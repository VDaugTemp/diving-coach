# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager
from collections import defaultdict
from datetime import datetime

# Import document ingestion
from .ingest import router as ingest_router, load_documents_from_data_folder, get_vector_store
# Import prompt templates
from .prompts import PromptTemplates


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load documents from data/ folder when the app starts."""
    await load_documents_from_data_folder()
    yield


# Initialize FastAPI application with a title
app = FastAPI(title="Diving Coach API", lifespan=lifespan)

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Include document ingestion endpoints
app.include_router(ingest_router)

# RAG Statistics Storage
# This tracks retrieval quality and usage patterns
rag_statistics: Dict[str, Any] = {
    "total_queries": 0,
    "total_documents_retrieved": 0,
    "avg_relevance_score": 0.0,
    "similarity_method_usage": {"cosine": 0, "euclidean": 0},
    "source_usage": defaultdict(int),  # Track how often each source is retrieved
    "queries_over_time": [],  # Track when queries happen
    "relevance_scores": [],  # Store all scores for calculating averages
}

def update_rag_stats(search_results: List[Dict[str, Any]], similarity_method: str) -> None:
    """Update RAG statistics with new search results."""
    rag_statistics["total_queries"] += 1
    rag_statistics["total_documents_retrieved"] += len(search_results)
    rag_statistics["similarity_method_usage"][similarity_method] += 1
    
    # Track query timestamp
    rag_statistics["queries_over_time"].append({
        "timestamp": datetime.now().isoformat(),
        "num_results": len(search_results)
    })
    
    # Track relevance scores and source usage
    for result in search_results:
        score = result.get("score", 0.0)
        rag_statistics["relevance_scores"].append(score)
        
        # Track source from metadata
        metadata = result.get("metadata", {})
        source = metadata.get("source", "unknown")
        if source and source != "unknown":
            # Extract filename from path
            source_name = os.path.basename(source) if "/" in source or "\\" in source else source
            rag_statistics["source_usage"][source_name] += 1
    
    # Update average relevance score
    if rag_statistics["relevance_scores"]:
        rag_statistics["avg_relevance_score"] = sum(rag_statistics["relevance_scores"]) / len(rag_statistics["relevance_scores"])

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    template: Optional[str] = "default"  # Prompt template: default, beginner, advanced
    similarity_method: Optional[str] = "cosine"  # Similarity measure: cosine or euclidean

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Get API key from environment variable
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY environment variable is not set")
        
        # RAG: Search vector database for relevant context
        vector_store = get_vector_store()
        
        # Check if vector store has documents
        stats = vector_store.get_stats()
        if stats["num_documents"] == 0:
            print("⚠️  WARNING: Vector store is empty! No documents loaded.")
            print("   This might be a deployment issue - check if data/ folder is accessible")
        
        search_results = await vector_store.search(
            request.user_message, 
            top_k=3,
            similarity_method=request.similarity_method
        )
        
        # Track RAG statistics (only if we have results)
        if search_results:
            update_rag_stats(search_results, request.similarity_method)
        
        # Build prompt using templates
        system_message, user_message = PromptTemplates.build_rag_prompt(
            user_query=request.user_message,
            search_results=search_results,
            template=request.template,
            max_sources=3
        )
        
        # Initialize OpenAI client with the API key from environment
        client = OpenAI(api_key=api_key)
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request with enhanced context
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "developer", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Define a debug endpoint to diagnose deployment issues
@app.get("/api/debug")
async def debug_info():
    """Debug endpoint to check if files and data are accessible."""
    import sys
    from pathlib import Path
    
    # Get paths
    api_dir = Path(__file__).parent.absolute()
    data_dir = api_dir / "data"
    config_dir = api_dir / "config"
    
    # Get vector store stats
    vector_store = get_vector_store()
    vs_stats = vector_store.get_stats()
    
    debug_data = {
        "python_version": sys.version,
        "current_working_directory": str(Path.cwd()),
        "api_directory": str(api_dir),
        "data_directory": {
            "path": str(data_dir),
            "exists": data_dir.exists(),
            "is_dir": data_dir.is_dir() if data_dir.exists() else False,
            "files": [f.name for f in data_dir.iterdir()] if data_dir.exists() and data_dir.is_dir() else []
        },
        "config_directory": {
            "path": str(config_dir),
            "exists": config_dir.exists(),
            "is_dir": config_dir.is_dir() if config_dir.exists() else False,
            "files": [f.name for f in config_dir.iterdir()] if config_dir.exists() and config_dir.is_dir() else []
        },
        "vector_store": vs_stats,
        "environment_variables": {
            "OPENAI_API_KEY": "set" if os.getenv("OPENAI_API_KEY") else "not set"
        }
    }
    
    return debug_data

# Define RAG statistics endpoint
@app.get("/api/rag-stats")
async def get_rag_stats():
    """
    Returns RAG system statistics including:
    - Vector store information (number of documents, size)
    - Retrieval quality metrics (average relevance scores)
    - Usage patterns (similarity methods, source frequency)
    """
    try:
        vector_store = get_vector_store()
        vector_stats = vector_store.get_stats()
        
        # Get top 5 most frequently retrieved sources
        top_sources = sorted(
            rag_statistics["source_usage"].items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]
        
        return {
            # Vector store stats
            "vector_store": vector_stats,
            
            # Retrieval quality
            "total_queries": rag_statistics["total_queries"],
            "total_documents_retrieved": rag_statistics["total_documents_retrieved"],
            "avg_documents_per_query": (
                rag_statistics["total_documents_retrieved"] / rag_statistics["total_queries"]
                if rag_statistics["total_queries"] > 0 else 0
            ),
            "avg_relevance_score": round(rag_statistics["avg_relevance_score"], 3),
            
            # Usage patterns
            "similarity_method_usage": dict(rag_statistics["similarity_method_usage"]),
            "top_sources": [
                {"source": source, "count": count}
                for source, count in top_sources
            ],
            
            # Recent activity (last 10 queries)
            "recent_queries": rag_statistics["queries_over_time"][-10:] if rag_statistics["queries_over_time"] else [],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
