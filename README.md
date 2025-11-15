# Clinical Trial Protocol Assistant

A production-ready conversational AI agent for clinical protocol documents, specifically designed for Phase 3 cancer clinical trial protocols. Built with React, FastAPI, LangChain, and OpenAI.

## 🎯 Overview

This application allows users to:
1. Upload clinical protocol PDFs
2. Chat with an AI assistant that answers questions based solely on the uploaded documents
3. View source citations showing which parts of the protocol were used

## 🏗️ Architecture

### Backend (`/backend`)
- **FastAPI** REST API
- **LangChain** for RAG (Retrieval-Augmented Generation)
- **ChromaDB** for vector storage
- **OpenAI** GPT models for chat completions
- **PyPDF** for PDF text extraction

### Frontend (`/frontend`)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API communication

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

5. Run backend server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env and set REACT_APP_API_BASE_URL=http://localhost:8000
```

4. Run development server:
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

## 📋 Usage Flow

1. **Upload Documents**: Open the app and upload one or more clinical protocol PDFs
2. **Session Created**: A unique session ID is generated and documents are processed
3. **Ask Questions**: Type questions about the protocol in the chat interface
4. **View Sources**: Check the right panel to see which document sections were referenced

## 🔧 Configuration

### Backend Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL_NAME`: Model to use (default: `gpt-4o`)
- `CHROMA_DB_DIR`: Directory for ChromaDB storage (default: `./chroma_store`)

### Frontend Environment Variables
- `REACT_APP_API_BASE_URL`: Backend API URL (default: `http://localhost:8000`)

## 📁 Project Structure

```
ProtoAgent/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry
│   │   ├── config.py         # Settings
│   │   ├── schemas.py        # Pydantic models
│   │   ├── rag_pipeline.py   # RAG ingestion
│   │   ├── chat_chain.py     # Conversational chain
│   │   ├── vectorstore.py    # ChromaDB management
│   │   └── utils/
│   │       └── pdf_loader.py # PDF extraction
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── api/              # API client
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔒 Key Features

- **RAG-based Answers**: AI only responds based on uploaded documents
- **Source Citations**: Every answer includes references to source documents and page numbers
- **Session Management**: Each upload creates an isolated session
- **Streaming Ready**: Architecture supports future streaming implementation
- **Error Handling**: Graceful error handling with user-friendly messages
- **Dark Mode**: Toggle between light and dark themes

## 🧪 API Endpoints

### `POST /api/upload`
Upload PDF files and create a session.

### `POST /api/chat`
Send a chat message and get AI response with sources.

### `GET /api/health`
Health check endpoint.

See backend README for detailed API documentation.

## 🛠️ Development

### Backend Development
- API docs available at `http://localhost:8000/docs` (Swagger UI)
- Uses hot reload with `--reload` flag

### Frontend Development
- Hot module replacement enabled
- TypeScript for type safety
- Tailwind CSS for styling

## 📝 Notes

- The AI is configured to explicitly state when information is not in the protocol
- Each session maintains its own vector store collection
- ChromaDB data persists across server restarts
- PDF processing extracts text with page numbers for accurate citations

## 🔮 Future Enhancements

- Streaming responses for real-time chat
- Support for additional file formats (Word, TXT)
- Multi-language support
- Export chat conversations
- Advanced document parsing (tables, figures)

## 📄 License

This project is provided as-is for demonstration purposes.

