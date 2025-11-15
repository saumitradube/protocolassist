"""RAG pipeline for document ingestion and retrieval."""
from typing import List, Dict
from app.utils.pdf_loader import load_pdf_text
from app.vectorstore import VectorStoreManager
import uuid


class RAGPipeline:
    """Main RAG pipeline for document processing."""
    
    def __init__(self):
        """Initialize the RAG pipeline."""
        self.vectorstore_manager = VectorStoreManager()
    
    def ingest_documents(
        self, 
        files: List[tuple[str, bytes]]
    ) -> tuple[str, List[Dict[str, any]]]:
        """
        Ingest multiple PDF files and create a session.
        
        Args:
            files: List of (filename, file_content) tuples
            
        Returns:
            Tuple of (session_id, document_info_list)
        """
        # Generate session ID
        session_id = str(uuid.uuid4())
        
        # Process all files
        all_pages = []
        document_info = []
        
        for filename, file_content in files:
            # Load PDF
            pages = load_pdf_text(file_content, filename)
            all_pages.extend(pages)
            
            # Track document info
            document_info.append({
                "fileName": filename,
                "pages": len(pages)
            })
        
        # Add to vector store
        if all_pages:
            self.vectorstore_manager.add_documents_to_session(
                session_id, 
                all_pages
            )
        
        return session_id, document_info

