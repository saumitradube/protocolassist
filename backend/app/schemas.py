"""Pydantic models for API requests and responses."""
from pydantic import BaseModel
from typing import List, Optional, Literal


class DocumentInfo(BaseModel):
    """Information about an uploaded document."""
    fileName: str
    pages: int


class UploadResponse(BaseModel):
    """Response after uploading documents."""
    sessionId: str
    documents: List[DocumentInfo]


class ChatMessage(BaseModel):
    """A single chat message."""
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    """Request to send a chat message."""
    sessionId: str
    message: str
    history: Optional[List[ChatMessage]] = None
    username: Optional[str] = None


class Source(BaseModel):
    """A source citation from the protocol."""
    fileName: str
    pageNumber: int
    snippet: str


class ChatResponse(BaseModel):
    """Response from chat endpoint."""
    answer: str
    sources: List[Source]

