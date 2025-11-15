"""Configuration settings for the application."""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    openai_api_key: str
    openai_model_name: str = "gpt-4o"
    chroma_db_dir: str = "./chroma_store"
    
    # Retrieval and token optimization settings
    max_retrieved_docs: int = 8  # Increased to ensure better coverage of document content
    max_chat_history_messages: int = 6  # Limit chat history (3 exchanges)
    max_context_length: int = 3000  # Max characters per document chunk (increased for better context)
    max_tokens: int = 1500  # Max response tokens (increased for more complete answers)
    chunk_size: int = 1500  # Chunk size for text splitting (larger chunks = more context)
    chunk_overlap: int = 300  # Overlap between chunks (helps preserve context across boundaries)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()

