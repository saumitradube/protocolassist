"""Conversational retrieval chain for chat."""
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage
from app.config import settings
from app.vectorstore import VectorStoreManager
from typing import List, Dict, Any, Tuple


# System prompt for clinical protocol assistant
SYSTEM_PROMPT = """You are a clinical trial assistant specialized in cancer Phase 3 protocols.
Your role is to help clinicians and clinical operations teams understand protocol documents.

IMPORTANT RULES:
1. Answer ONLY based on the provided protocol documents. Do not use any external knowledge.
2. If information is not in the protocol, be specific and helpful:
   - State clearly: "This specific detail is not found in the provided protocol document excerpts."
   - Suggest what section might contain it (e.g., "This information is typically found in the Synopsis, Study Design, or Eligibility Criteria sections.")
   - Ask if the user wants you to search for related information that IS available in the documents.
3. Use clear, professional, and concise language suitable for clinicians.
4. When referencing information, ALWAYS mention the source document name and page number (e.g., "According to protocol.pdf, page 15...").
5. Do not hallucinate or make up information. If uncertain, explicitly state what you found and what you didn't.
6. Structure your answers clearly with bullet points or numbered lists when appropriate.
7. If you find partial information, share what you found and note what's missing."""


def format_docs(docs: List) -> str:
    """Format documents into a context string with token optimization."""
    if not docs:
        return "No relevant protocol document sections found."
    
    formatted_parts = []
    total_length = 0
    max_total_length = settings.max_context_length * settings.max_retrieved_docs  # Total context budget
    
    for doc in docs:
        # Use full chunk content (chunks are already optimized in size)
        content = doc.page_content
        
        # Only truncate if extremely long (safety check)
        if len(content) > settings.max_context_length * 2:
            content = content[:settings.max_context_length * 2] + "..."
        
        # Extract filename from source path
        source = doc.metadata.get('source', 'unknown')
        if isinstance(source, str):
            # Get just the filename if it's a path
            filename = source.split('/')[-1] if '/' in source else source
        else:
            filename = str(source)
        
        page_num = doc.metadata.get('page_number', 0)
        
        formatted = f"[Document: {filename}, Page {page_num}]\n{content}"
        
        # Stop if we're exceeding total context budget
        if total_length + len(formatted) > max_total_length:
            # Add partial content if there's still room
            remaining = max_total_length - total_length - 200  # Reserve 200 chars for formatting
            if remaining > 100:
                formatted = formatted[:remaining] + "...\n[Content truncated due to length]"
                formatted_parts.append(formatted)
            break
            
        formatted_parts.append(formatted)
        total_length += len(formatted)
    
    if not formatted_parts:
        return "No relevant protocol document sections found."
    
    return "\n\n---\n\n".join(formatted_parts)


def create_chat_chain(session_id: str, username: str = None) -> Tuple[Any, Any]:
    """
    Create a conversational retrieval chain for a session using LCEL.
    
    Args:
        session_id: Session identifier
        
    Returns:
        Runnable chain instance
    """
    vectorstore_manager = VectorStoreManager()
    # Use optimized number of retrieved documents
    retriever = vectorstore_manager.get_retriever(
        session_id, 
        k=settings.max_retrieved_docs
    )
    
    llm = ChatOpenAI(
        model=settings.openai_model_name,
        openai_api_key=settings.openai_api_key,
        temperature=0.1,  # Low temperature for factual responses
        streaming=False,  # Can be enabled later for streaming
        max_tokens=settings.max_tokens  # Limit response length to save tokens
    )
    
    # Build system prompt with username if provided
    system_prompt = SYSTEM_PROMPT
    if username:
        system_prompt += f"\n\nIMPORTANT: The user's name is {username}. When the user greets you (says hello, hi, good morning, etc.), always respond with a friendly greeting that includes their name, {username}."
    
    # Create prompt template with system message and chat history
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt + "\n\nUse the following pieces of context from the protocol documents to answer the question. Each context piece includes the source file name and page number.\n\nContext from protocol documents:\n{context}\n\nWhen answering:\n- Cite specific sources (filename and page number) for all information\n- If the answer isn't in the context, clearly state this and suggest where it might be found\n- Be helpful and specific, not generic\n\n"),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}")
    ])
    
    # Create the chain using LCEL
    def create_chain_input(input_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare input for the chain."""
        question = input_dict["question"]
        chat_history = input_dict.get("chat_history", [])
        # Retrieve documents
        docs = retriever.invoke(question)
        context = format_docs(docs)
        return {
            "context": context,
            "question": question,
            "chat_history": chat_history
        }
    
    chain = (
        RunnablePassthrough() | create_chain_input
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return chain, retriever


def format_sources(source_documents: List) -> List[Dict[str, any]]:
    """
    Format source documents into citation format.
    
    Args:
        source_documents: List of Document objects from LangChain
        
    Returns:
        List of source dicts with fileName, pageNumber, snippet
    """
    sources = []
    seen = set()
    
    for doc in source_documents:
        # Create unique key to avoid duplicates
        source_key = (
            doc.metadata.get("source", "unknown"),
            doc.metadata.get("page_number", 0)
        )
        
        if source_key not in seen:
            seen.add(source_key)
            snippet = doc.page_content[:300]  # First 300 chars
            if len(doc.page_content) > 300:
                snippet += "..."
            
            sources.append({
                "fileName": doc.metadata.get("source", "unknown"),
                "pageNumber": doc.metadata.get("page_number", 0),
                "snippet": snippet
            })
    
    return sources

