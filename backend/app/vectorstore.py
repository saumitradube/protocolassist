"""Vector store management using ChromaDB."""
import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Dict
import os
from app.config import settings


class VectorStoreManager:
    """Manages ChromaDB vector stores for different sessions."""
    
    def __init__(self):
        """Initialize the vector store manager."""
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=settings.openai_api_key
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            length_function=len,
        )
        
        # Ensure chroma_db_dir exists
        os.makedirs(settings.chroma_db_dir, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=settings.chroma_db_dir,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
    
    def create_collection_for_session(self, session_id: str) -> Chroma:
        """
        Create or get a Chroma collection for a session.
        
        Args:
            session_id: Unique session identifier
            
        Returns:
            Chroma vector store instance
        """
        collection_name = f"session_{session_id}"
        
        vectorstore = Chroma(
            client=self.client,
            collection_name=collection_name,
            embedding_function=self.embeddings,
            persist_directory=settings.chroma_db_dir
        )
        
        return vectorstore
    
    def add_documents_to_session(
        self, 
        session_id: str, 
        pages: List[Dict[str, any]]
    ) -> int:
        """
        Add documents to a session's vector store.
        
        Args:
            session_id: Session identifier
            pages: List of page dicts with 'text', 'page_number', 'source'
            
        Returns:
            Number of chunks added
        """
        vectorstore = self.create_collection_for_session(session_id)
        
        # Split pages into chunks
        all_chunks = []
        metadatas = []
        
        for page in pages:
            text = page["text"]
            chunks = self.text_splitter.split_text(text)
            
            for chunk in chunks:
                all_chunks.append(chunk)
                metadatas.append({
                    "source": page["source"],
                    "page_number": page["page_number"],
                    "session_id": session_id
                })
        
        # Add to vector store
        if all_chunks:
            vectorstore.add_texts(
                texts=all_chunks,
                metadatas=metadatas
            )
        
        return len(all_chunks)
    
    def get_retriever(self, session_id: str, k: int = None):
        """
        Get a retriever for a session with improved search.
        
        Args:
            session_id: Session identifier
            k: Number of documents to retrieve (defaults to max_retrieved_docs from settings)
            
        Returns:
            LangChain retriever with MMR (Maximum Marginal Relevance) for better diversity
        """
        if k is None:
            k = settings.max_retrieved_docs
            
        vectorstore = self.create_collection_for_session(session_id)
        
        # Use MMR (Maximum Marginal Relevance) to get diverse, relevant chunks
        # This helps ensure we don't get 8 very similar chunks, but rather diverse relevant ones
        return vectorstore.as_retriever(
            search_type="mmr",  # Maximum Marginal Relevance for diversity
            search_kwargs={
                "k": k,
                "fetch_k": min(k * 3, 20),  # Fetch more candidates, then select diverse ones
                "lambda_mult": 0.7  # Balance between relevance (1.0) and diversity (0.0)
            }
        )

