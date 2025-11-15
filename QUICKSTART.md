# Quick Start Guide

## 1. Backend Setup (5 minutes)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_key_here" > .env
echo "OPENAI_MODEL_NAME=gpt-4o" >> .env
echo "CHROMA_DB_DIR=./chroma_store" >> .env

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 2. Frontend Setup (3 minutes)

```bash
cd frontend
npm install

# Create .env file
echo "REACT_APP_API_BASE_URL=http://localhost:8000" > .env

# Run frontend
npm start
```

## 3. Usage

1. Open `http://localhost:3000` in your browser
2. Upload a clinical protocol PDF
3. Start asking questions!

## Troubleshooting

- **Backend won't start**: Check that OpenAI API key is set in `.env`
- **Frontend can't connect**: Verify `REACT_APP_API_BASE_URL` matches backend URL
- **Import errors**: Make sure all dependencies are installed (`pip install -r requirements.txt` and `npm install`)

