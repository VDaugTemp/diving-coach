"""Document ingestion - loads local files and web articles."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
import json

from loaders import TextFileLoader, CharacterTextSplitter
from vector_store import VectorStore
from web_loader import load_articles_from_urls


vector_store = VectorStore()
_ingestion_complete = False

router = APIRouter(prefix="/api/ingest", tags=["Document Ingestion"])


class StatsResponse(BaseModel):
    num_documents: int
    embedding_dimension: Optional[int]
    total_size_mb: Optional[float]
    ingestion_complete: bool


async def load_documents_from_data_folder():
    """Load all documents from data/ folder and web sources at startup."""
    global _ingestion_complete
    
    if _ingestion_complete:
        return
    
    try:
        # =========================================================================
        # STEP 1: Load local files
        # =========================================================================
        print("📚 Loading local documents from data/ folder...")
        
        loader = TextFileLoader("data")
        documents = loader.load()
        
        if not documents:
            print("⚠️  No local documents found in data/ folder")
            return
        
        print(f"✅ Loaded {len(documents)} local documents")
        
        splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(documents)
        
        print(f"✂️  Split into {len(chunks)} chunks")
        
        # Build metadata for local files
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
                    "chunk_index": i,
                    "source_type": "local_file"
                })
        
        # =========================================================================
        # STEP 2: Load web articles
        # =========================================================================
        print("\n🌐 Loading web articles...")
        
        # Read web sources from config
        config_path = Path("config/web_sources.json")
        web_chunks = []
        web_metadata = []
        
        if config_path.exists():
            try:
                with open(config_path, 'r') as f:
                    config = json.load(f)
                    urls = config.get('urls', [])
                
                if urls:
                    print(f"📋 Found {len(urls)} URL(s) to fetch")
                    
                    # Load articles
                    web_docs = load_articles_from_urls(urls)
                    
                    if web_docs:
                        print(f"✅ Loaded {len(web_docs)} web article(s)")
                        
                        # Chunk web articles
                        for web_doc in web_docs:
                            doc_chunks = splitter.split_text(web_doc['text'])
                            
                            for i, chunk in enumerate(doc_chunks):
                                web_chunks.append(chunk)
                                web_metadata.append({
                                    **web_doc['metadata'],
                                    'chunk_index': i,
                                    'total_chunks': len(doc_chunks)
                                })
                        
                        print(f"✂️  Created {len(web_chunks)} chunks from web articles")
                else:
                    print("ℹ️  No URLs configured in web_sources.json")
            
            except Exception as e:
                print(f"⚠️  Warning: Could not load web articles: {e}")
                print("   (Continuing with local documents only)")
        else:
            print("ℹ️  No web sources config found (config/web_sources.json)")
        
        # =========================================================================
        # STEP 3: Combine and add to vector store
        # =========================================================================
        print(f"\n🔄 Generating embeddings...")
        
        all_chunks = chunks + web_chunks
        all_metadata = metadata_list + web_metadata
        
        await vector_store.add_documents(all_chunks, all_metadata)
        
        stats = vector_store.get_stats()
        print(f"\n✅ Ingestion complete!")
        print(f"   - Local chunks: {len(chunks)}")
        print(f"   - Web chunks: {len(web_chunks)}")
        print(f"   - Total: {stats['num_documents']} chunks stored")
        
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
