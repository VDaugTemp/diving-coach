"""Document ingestion - loads local files from data/ folder."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from pathlib import Path

from loaders import TextFileLoader, CharacterTextSplitter
from vector_store import VectorStore


vector_store = VectorStore()
_ingestion_complete = False

router = APIRouter(prefix="/api/ingest", tags=["Document Ingestion"])


class StatsResponse(BaseModel):
    num_documents: int
    embedding_dimension: Optional[int]
    total_size_mb: Optional[float]
    ingestion_complete: bool


async def load_documents_from_data_folder():
    """Load all documents from data/ folder at startup."""
    global _ingestion_complete
    
    if _ingestion_complete:
        return
    
    print("📚 Loading documents from data/ folder...")
    
    try:
        loader = TextFileLoader("data")
        documents = loader.load()
        
        if not documents:
            print("⚠️  No documents found in data/ folder")
            return
        
        print(f"✅ Loaded {len(documents)} documents")
        
        splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(documents)
        
        print(f"✂️  Split into {len(chunks)} chunks")
        print("🔄 Generating embeddings (this may take a minute)...")
        
        data_path = Path("data")
        files = list(data_path.glob("*.txt")) + list(data_path.glob("*.pdf"))
        
        metadata_list = []
        for file in files:
            file_loader = TextFileLoader(str(file))
            file_docs = file_loader.load()
            file_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            file_chunks = file_splitter.split_documents(file_docs)
            
            for i in range(len(file_chunks)):
                metadata_list.append({
                    "filename": file.name,
                    "source": str(file),
                    "chunk_index": i
                })
        
        await vector_store.add_documents(chunks, metadata_list)
        
        stats = vector_store.get_stats()
        print(f"✅ Ingestion complete: {stats['num_documents']} chunks stored")
        
        _ingestion_complete = True
        
    except Exception as e:
        print(f"❌ Error loading documents: {e}")


@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get statistics about the vector store."""
    stats = vector_store.get_stats()
    return {
        **stats,
        "ingestion_complete": _ingestion_complete
    }


@router.post("/reload")
async def reload_documents():
    """Reload all documents from data/ folder."""
    global _ingestion_complete
    
    vector_store.clear()
    _ingestion_complete = False
    
    await load_documents_from_data_folder()
    
    stats = vector_store.get_stats()
    return {
        "success": True,
        "message": f"Reloaded {stats['num_documents']} document chunks"
    }


def get_vector_store():
    """Get the global vector store instance."""
    return vector_store
