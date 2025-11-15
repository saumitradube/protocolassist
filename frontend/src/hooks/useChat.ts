/** Custom hook for managing chat state and interactions. */
import { useState, useCallback } from 'react';
import { Message, Source, Session } from '../types/chat';
import { uploadDocuments, sendMessage } from '../api/chatApi';

export function useChat(username?: string) {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload documents and create a new session.
   */
  const handleUpload = useCallback(async (files: File[]): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await uploadDocuments(files);
      const newSession: Session = {
        id: response.sessionId,
        documents: response.documents,
        createdAt: new Date().toISOString(),
      };
      setSession(newSession);
      setMessages([]);
      setSources([]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to upload documents';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Send a message and get AI response.
   */
  const handleSendMessage = useCallback(async (content: string) => {
    if (!session) {
      setError('Please upload a protocol document first');
      return;
    }

    if (!content.trim()) {
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Prepare history for API
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await sendMessage({
        sessionId: session.id,
        message: content.trim(),
        history,
        username: username,
      });

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Update sources with IDs
      const sourcesWithIds = response.sources.map((source, index) => ({
        ...source,
        id: `${source.fileName}-${source.pageNumber}-${index}`,
      }));
      setSources(sourcesWithIds);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to send message';
      setError(errorMessage);
      
      // Add error message to chat
      const errorMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  }, [session, messages]);

  /**
   * Clear chat and reset state.
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setSources([]);
    setError(null);
  }, []);

  return {
    session,
    messages,
    sources,
    isLoading,
    error,
    handleUpload,
    handleSendMessage,
    clearChat,
  };
}

