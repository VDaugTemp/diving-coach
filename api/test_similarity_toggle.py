"""
Demo: Comparing Cosine vs Euclidean Similarity in Vector Search

This demonstrates how different similarity measures can produce different search results.
"""

import asyncio
import numpy as np
from vector_store import VectorStore
from ingest import load_documents_from_data_folder, get_vector_store


async def demo_similarity_comparison():
    """Compare search results using cosine vs euclidean similarity."""
    
    print("=" * 80)
    print("SIMILARITY METHODS COMPARISON")
    print("=" * 80)
    
    # Load documents
    await load_documents_from_data_folder()
    vector_store = get_vector_store()
    
    stats = vector_store.get_stats()
    print(f"\n📊 Vector Store Stats:")
    print(f"   - Documents: {stats['num_documents']}")
    print(f"   - Embedding dimension: {stats['embedding_dimension']}")
    print(f"   - Size: {stats['total_size_mb']} MB")
    
    # =========================================================================
    # TEST 1: Simple Query Comparison
    # =========================================================================
    print("\n" + "=" * 80)
    print("TEST 1: Simple Query - 'equalization techniques'")
    print("=" * 80)
    
    query = "equalization techniques"
    print(f"\n📝 Query: '{query}'")
    
    # Search with cosine similarity
    print("\n🔵 COSINE SIMILARITY Results:")
    print("-" * 80)
    cosine_results = await vector_store.search(query, top_k=5, similarity_method="cosine")
    
    for i, result in enumerate(cosine_results, 1):
        filename = result['metadata'].get('filename', 'Unknown')
        score = result['score']
        text_preview = result['text'][:100].replace('\n', ' ')
        print(f"\n[{i}] Score: {score:.4f} | {filename}")
        print(f"    {text_preview}...")
    
    # Search with euclidean similarity
    print("\n\n🟢 EUCLIDEAN SIMILARITY Results:")
    print("-" * 80)
    euclidean_results = await vector_store.search(query, top_k=5, similarity_method="euclidean")
    
    for i, result in enumerate(euclidean_results, 1):
        filename = result['metadata'].get('filename', 'Unknown')
        score = result['score']
        text_preview = result['text'][:100].replace('\n', ' ')
        print(f"\n[{i}] Score: {score:.4f} | {filename}")
        print(f"    {text_preview}...")
    
    # Compare rankings
    print("\n\n📊 RANKING COMPARISON:")
    print("-" * 80)
    print("Top 5 document chunks by method:\n")
    
    print("Rank | Cosine Chunk | Euclidean Chunk | Same?")
    print("-" * 60)
    for i in range(5):
        cosine_chunk = cosine_results[i]['metadata'].get('chunk_index', 'N/A')
        euclidean_chunk = euclidean_results[i]['metadata'].get('chunk_index', 'N/A')
        same = "✓" if cosine_chunk == euclidean_chunk else "✗"
        print(f"  {i+1}  |     {cosine_chunk:4}      |      {euclidean_chunk:4}      |  {same}")
    
    # =========================================================================
    # TEST 2: Technical Query
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("TEST 2: Technical Query - 'mammalian dive reflex physiology'")
    print("=" * 80)
    
    technical_query = "mammalian dive reflex physiology"
    print(f"\n📝 Query: '{technical_query}'")
    
    cosine_tech = await vector_store.search(technical_query, top_k=3, similarity_method="cosine")
    euclidean_tech = await vector_store.search(technical_query, top_k=3, similarity_method="euclidean")
    
    print("\n🔵 Cosine Top 3 Scores:", [f"{r['score']:.4f}" for r in cosine_tech])
    print("🟢 Euclidean Top 3 Scores:", [f"{r['score']:.4f}" for r in euclidean_tech])
    
    # =========================================================================
    # TEST 3: Score Distribution Analysis
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("TEST 3: Score Distribution Analysis")
    print("=" * 80)
    
    query = "static apnea training"
    
    cosine_dist = await vector_store.search(query, top_k=10, similarity_method="cosine")
    euclidean_dist = await vector_store.search(query, top_k=10, similarity_method="euclidean")
    
    cosine_scores = [r['score'] for r in cosine_dist]
    euclidean_scores = [r['score'] for r in euclidean_dist]
    
    print(f"\n📝 Query: '{query}'")
    print(f"\n📊 Score Statistics (Top 10 results):")
    print("-" * 80)
    print(f"{'Metric':<20} | {'Cosine':>12} | {'Euclidean':>12}")
    print("-" * 80)
    print(f"{'Highest Score':<20} | {max(cosine_scores):>12.4f} | {max(euclidean_scores):>12.4f}")
    print(f"{'Lowest Score':<20} | {min(cosine_scores):>12.4f} | {min(euclidean_scores):>12.4f}")
    print(f"{'Average Score':<20} | {np.mean(cosine_scores):>12.4f} | {np.mean(euclidean_scores):>12.4f}")
    print(f"{'Score Range':<20} | {max(cosine_scores) - min(cosine_scores):>12.4f} | {max(euclidean_scores) - min(euclidean_scores):>12.4f}")
    print(f"{'Std Deviation':<20} | {np.std(cosine_scores):>12.4f} | {np.std(euclidean_scores):>12.4f}")
    
    # =========================================================================
    # TEST 4: When Results Differ Significantly
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("TEST 4: When Do Results Differ Most?")
    print("=" * 80)
    
    test_queries = [
        "safety procedures",
        "breath hold training",
        "underwater blackout",
        "finning technique",
        "CO2 tolerance"
    ]
    
    print("\nTesting multiple queries to find differences...\n")
    print(f"{'Query':<25} | {'Agreement %':>12}")
    print("-" * 45)
    
    for test_query in test_queries:
        cos_res = await vector_store.search(test_query, top_k=5, similarity_method="cosine")
        euc_res = await vector_store.search(test_query, top_k=5, similarity_method="euclidean")
        
        # Calculate agreement (how many chunks appear in both top 5)
        cos_chunks = {r['metadata'].get('chunk_index') for r in cos_res}
        euc_chunks = {r['metadata'].get('chunk_index') for r in euc_res}
        
        agreement = len(cos_chunks & euc_chunks) / 5 * 100
        
        print(f"{test_query:<25} | {agreement:>11.0f}%")
    
    # =========================================================================
    # UNDERSTANDING THE DIFFERENCES
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("UNDERSTANDING COSINE vs EUCLIDEAN")
    print("=" * 80)
    
    print("""
📐 COSINE SIMILARITY:
   - Measures the angle between two vectors
   - Range: 0 to 1 (higher is more similar)
   - Ignores magnitude, only considers direction
   - Good for: Text similarity, where document length doesn't matter
   - Formula: (A·B) / (||A|| * ||B||)
   
📏 EUCLIDEAN SIMILARITY:
   - Measures the straight-line distance between vectors
   - Converted to similarity: 1 / (1 + distance)
   - Range: 0 to 1 (higher is more similar)
   - Considers both direction and magnitude
   - Good for: When vector magnitude matters
   - Formula: 1 / (1 + ||A - B||)

🔍 KEY DIFFERENCES:
   1. Cosine ignores vector length (magnitude)
   2. Euclidean considers both angle AND distance
   3. For normalized embeddings (like OpenAI's), they often give similar results
   4. Euclidean can be more sensitive to outliers
   5. Cosine is generally preferred for text embeddings

💡 WHEN TO USE WHICH:
   - Use COSINE for: Text search, document similarity, semantic search
   - Use EUCLIDEAN for: When magnitude matters, spatial relationships
   - For OpenAI embeddings: Cosine is recommended (embeddings are normalized)
    """)
    
    # =========================================================================
    # VISUAL COMPARISON
    # =========================================================================
    print("\n" + "=" * 80)
    print("VISUAL SCORE COMPARISON")
    print("=" * 80)
    
    query = "breath hold technique"
    cos_visual = await vector_store.search(query, top_k=10, similarity_method="cosine")
    euc_visual = await vector_store.search(query, top_k=10, similarity_method="euclidean")
    
    print(f"\n📝 Query: '{query}'")
    print("\nScore Visualization (Top 10):\n")
    
    for i in range(10):
        cos_score = cos_visual[i]['score']
        euc_score = euc_visual[i]['score']
        
        cos_bar = "█" * int(cos_score * 50)
        euc_bar = "█" * int(euc_score * 50)
        
        print(f"Rank {i+1:2d}")
        print(f"  🔵 Cosine:    {cos_score:.4f} {cos_bar}")
        print(f"  🟢 Euclidean: {euc_score:.4f} {euc_bar}")
        print()
    
    # =========================================================================
    # PRACTICAL RECOMMENDATION
    # =========================================================================
    print("\n" + "=" * 80)
    print("PRACTICAL RECOMMENDATION FOR YOUR APP")
    print("=" * 80)
    
    print("""
✅ RECOMMENDATION: Use COSINE SIMILARITY (default)

Why?
1. OpenAI embeddings are normalized (magnitude ~1)
2. Cosine is standard for semantic text search
3. More interpretable scores (0-1 range, clear meaning)
4. Industry standard for RAG systems
5. Better for comparing meaning rather than exact similarity

🔧 When to offer Euclidean as an option?
- For advanced users who want to experiment
- For specific use cases where magnitude matters
- For research/comparison purposes

💡 Your implementation is perfect:
   - Default to cosine (best for most users)
   - Allow toggling for advanced users
   - Both methods properly normalized to 0-1 range
    """)
    
    print("\n" + "=" * 80)
    print("✅ Demo Complete!")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(demo_similarity_comparison())

