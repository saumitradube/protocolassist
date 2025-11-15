"""FastAPI application entry point."""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn

from app.schemas import (
    UploadResponse, 
    ChatRequest, 
    ChatResponse,
    ChatMessage
)
from app.rag_pipeline import RAGPipeline
from app.chat_chain import create_chat_chain, format_sources


app = FastAPI(
    title="Clinical Protocol Assistant API",
    description="RAG-based conversational AI for clinical trial protocols",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG pipeline
rag_pipeline = RAGPipeline()


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "clinical-protocol-assistant"}


@app.post("/api/upload", response_model=UploadResponse)
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Upload one or more PDF files and create a session.
    
    Args:
        files: List of uploaded PDF files
        
    Returns:
        UploadResponse with sessionId and document info
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    # Validate files are PDFs
    for file in files:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400, 
                detail=f"File {file.filename} is not a PDF"
            )
    
    try:
        # Read all files
        file_data = []
        for file in files:
            content = await file.read()
            file_data.append((file.filename, content))
        
        # Ingest documents
        session_id, document_info = rag_pipeline.ingest_documents(file_data)
        
        return UploadResponse(
            sessionId=session_id,
            documents=[
                {"fileName": doc["fileName"], "pages": doc["pages"]}
                for doc in document_info
            ]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing files: {str(e)}"
        )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a chat message and get AI response with sources.
    
    Args:
        request: ChatRequest with sessionId, message, and optional history
        
    Returns:
        ChatResponse with answer and sources
    """
    if not request.sessionId:
        raise HTTPException(status_code=400, detail="sessionId is required")
    
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="message is required")
    
    try:
        # Create chat chain for this session with username
        chain, retriever = create_chat_chain(
            request.sessionId,
            username=request.username
        )
        
        # Prepare chat history from request (limit to save tokens)
        from langchain_core.messages import HumanMessage, AIMessage
        from app.config import settings
        
        chat_history = []
        if request.history:
            # Only keep the most recent messages to limit token usage
            recent_history = request.history[-settings.max_chat_history_messages:]
            for msg in recent_history:
                if msg.role == "user":
                    chat_history.append(HumanMessage(content=msg.content))
                elif msg.role == "assistant":
                    chat_history.append(AIMessage(content=msg.content))
        
        # Retrieve relevant documents for sources
        source_documents = retriever.invoke(request.message)
        
        # Run the chain with chat history
        answer = chain.invoke({
            "question": request.message,
            "chat_history": chat_history
        })
        
        # Format sources
        sources = format_sources(source_documents)
        
        return ChatResponse(
            answer=answer,
            sources=sources
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

