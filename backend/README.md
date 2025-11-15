# Clinical Protocol Assistant - Backend

FastAPI backend with LangChain RAG for clinical protocol document analysis.

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL_NAME=gpt-4o
CHROMA_DB_DIR=./chroma_store
```

### 4. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the Python module:

```bash
python -m app.main
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## API Endpoints

### `POST /api/upload`
Upload one or more PDF files to create a session.

**Request:** Multipart form data with PDF files

**Response:**
```json
{
  "sessionId": "uuid",
  "documents": [
    {"fileName": "protocol.pdf", "pages": 150}
  ]
}
```

### `POST /api/chat`
Send a chat message and get AI response.

**Request:**
```json
{
  "sessionId": "uuid",
  "message": "What is the primary endpoint?",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

**Response:**
```json
{
  "answer": "The primary endpoint is...",
  "sources": [
    {
      "fileName": "protocol.pdf",
      "pageNumber": 45,
      "snippet": "The primary endpoint is defined as..."
    }
  ]
}
```

### `GET /api/health`
Health check endpoint.

## Architecture

- **RAG Pipeline**: Ingests PDFs, chunks text, creates embeddings, stores in ChromaDB
- **Chat Chain**: ConversationalRetrievalChain with OpenAI LLM
- **Vector Store**: ChromaDB with per-session collections
- **Memory**: ConversationBufferMemory for chat history

## Notes

- Each upload creates a new session with a unique UUID
- Documents are stored in ChromaDB with metadata (source, page_number)
- The AI is configured to only answer based on uploaded documents
- ChromaDB data persists in `./chroma_store` directory

