/** Type definitions for chat functionality. */

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Source {
  id: string;
  fileName: string;
  pageNumber: number;
  snippet: string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}

export interface DocumentInfo {
  fileName: string;
  pages: number;
}

export interface UploadResponse {
  sessionId: string;
  documents: DocumentInfo[];
}

export interface Session {
  id: string;
  documents: DocumentInfo[];
  createdAt: string;
}

