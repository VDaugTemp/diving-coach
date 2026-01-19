"""Test RAG (Retrieval Augmented Generation) functionality."""

import requests
import json

# Test the RAG-enabled chat endpoint
def test_rag_chat():
    url = "http://localhost:8000/api/chat"
    
    # Question that should be answerable from the diving manuals
    payload = {
        "developer_message": "You are a helpful diving instructor assistant.",
        "user_message": "What are equalization techniques and why are they important?",
        "model": "gpt-4.1-mini"
    }
    
    print("🧪 Testing RAG Chat Endpoint\n")
    print(f"Question: {payload['user_message']}\n")
    print("Response:\n")
    
    # Make streaming request
    response = requests.post(url, json=payload, stream=True)
    
    if response.status_code == 200:
        for chunk in response.iter_content(chunk_size=None, decode_unicode=True):
            if chunk:
                print(chunk, end='', flush=True)
        print("\n\n✅ RAG test successful!")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)


def test_search_only():
    """Test just the vector search to see what context is retrieved."""
    url = "http://localhost:8000/api/ingest/stats"
    
    print("\n🔍 Checking vector store stats...\n")
    response = requests.get(url)
    
    if response.status_code == 200:
        stats = response.json()
        print(f"Documents loaded: {stats['num_documents']}")
        print(f"Ingestion complete: {stats['ingestion_complete']}")
        print(f"Size: {stats['total_size_mb']} MB\n")
    else:
        print(f"❌ Could not get stats: {response.status_code}")


if __name__ == "__main__":
    print("=" * 60)
    print("RAG (Retrieval Augmented Generation) Test")
    print("=" * 60 + "\n")
    
    # First check if documents are loaded
    test_search_only()
    
    # Then test the RAG chat
    test_rag_chat()

