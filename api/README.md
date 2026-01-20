# Diving Coach API

FastAPI backend for diving instruction with RAG (Retrieval Augmented Generation).

## Setup

```bash
pip install openai fastapi uvicorn pypdf python-multipart numpy
export OPENAI_API_KEY="your-key-here"
```

## Run

```bash
python app.py
```

Server starts at `http://localhost:8000`

Documents from `data/` folder are automatically loaded at startup.

## API Endpoints

- `POST /api/chat` - Chat with streaming response
- `GET /api/health` - Health check
- `GET /api/ingest/stats` - Vector store statistics
- `POST /api/ingest/reload` - Reload documents from data/

## Project Structure

```
api/
├── app.py              # Main FastAPI application
├── ingest.py           # Document loading and ingestion
├── vector_store.py     # In-memory vector database
├── embeddings.py       # OpenAI embeddings
├── similarity.py       # Cosine similarity calculations
├── loaders.py          # Text/PDF loaders and chunking
├── test_vector_store.py # Tests
├── ingest_data.py      # Utility script for testing
└── data/               # Diving manuals (PDFs/TXT)
```

## Testing

```bash
# Test vector store
python test_vector_store.py

# Test document ingestion
python ingest_data.py
```

## How It Works

1. **Startup**: Loads all `.txt` and `.pdf` files from `data/` folder
2. **Chunking**: Splits documents into 1000-char chunks (200 overlap)
3. **Embeddings**: Generates vectors using OpenAI's text-embedding-3-small
4. **Storage**: Stores in in-memory vector database (687 chunks from 6 manuals)
5. **Search**: Cosine similarity for semantic search (coming in Phase 5)

## Current Status

✅ Document ingestion (Phase 4)
✅ Vector storage with semantic search
✅ Chat endpoint with streaming
✅ RAG integration (Step 10)
✅ Prompt templates (Step 11)
🎯 Ready for production testing
