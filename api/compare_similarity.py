"""Compare different similarity measures."""

import numpy as np
from similarity import (
    cosine_similarity, 
    euclidean_distance, 
    euclidean_similarity,
    cosine_similarity_batch,
    euclidean_similarity_batch
)


def demo_similarity_measures():
    """Show how different similarity measures work."""
    
    print("=" * 60)
    print("Comparing Similarity Measures")
    print("=" * 60 + "\n")
    
    # Example vectors
    v1 = np.array([1, 0, 0])
    v2_identical = np.array([1, 0, 0])
    v2_similar = np.array([0.8, 0.6, 0])
    v2_orthogonal = np.array([0, 1, 0])
    v2_opposite = np.array([-1, 0, 0])
    v2_scaled = np.array([2, 0, 0])  # Same direction, different magnitude
    
    test_cases = [
        ("Identical", v1, v2_identical),
        ("Similar direction", v1, v2_similar),
        ("Orthogonal (90°)", v1, v2_orthogonal),
        ("Opposite direction", v1, v2_opposite),
        ("Same direction, 2x magnitude", v1, v2_scaled),
    ]
    
    for name, vec_a, vec_b in test_cases:
        print(f"Test: {name}")
        print(f"  Vector A: {vec_a}")
        print(f"  Vector B: {vec_b}")
        
        cos_sim = cosine_similarity(vec_a, vec_b)
        euc_dist = euclidean_distance(vec_a, vec_b)
        euc_sim = euclidean_similarity(vec_a, vec_b)
        
        print(f"  Cosine Similarity:    {cos_sim:.3f}")
        print(f"  Euclidean Distance:   {euc_dist:.3f}")
        print(f"  Euclidean Similarity: {euc_sim:.3f}")
        print()
    
    print("-" * 60)
    print("\nKey Differences:")
    print()
    print("🔵 COSINE SIMILARITY:")
    print("   - Measures angle/direction (ignores magnitude)")
    print("   - [1,0,0] and [2,0,0] have similarity = 1.0 (same direction)")
    print("   - Best for: Text embeddings, word vectors")
    print("   - Range: -1 to 1 (we use 0 to 1 for embeddings)")
    print()
    print("🟢 EUCLIDEAN DISTANCE:")
    print("   - Measures straight-line distance (considers magnitude)")
    print("   - [1,0,0] and [2,0,0] have distance = 1.0 (different magnitude)")
    print("   - Best for: Clustering, image features")
    print("   - Range: 0 to ∞ (0 = identical)")
    print()
    print("🟡 EUCLIDEAN SIMILARITY:")
    print("   - Euclidean distance converted to 0-1 scale")
    print("   - Formula: 1 / (1 + distance)")
    print("   - Range: 0 to 1 (1 = identical)")
    print()


def demo_batch_comparison():
    """Compare batch similarity for search."""
    
    print("=" * 60)
    print("Batch Search Comparison")
    print("=" * 60 + "\n")
    
    # Query: "freediving safety"
    query = np.array([1.0, 0.8, 0.3])
    
    # Documents (simulated)
    docs = np.array([
        [1.0, 0.9, 0.2],  # Very similar to query
        [0.5, 0.5, 0.5],  # Somewhat similar
        [0.1, 0.1, 0.9],  # Different
        [2.0, 1.6, 0.6],  # Same direction but 2x magnitude
    ])
    
    print("Query vector:", query)
    print("\nDocument vectors:")
    for i, doc in enumerate(docs):
        print(f"  Doc {i+1}: {doc}")
    
    print("\n" + "-" * 60)
    print("COSINE SIMILARITY (what we use for RAG):")
    cos_scores = cosine_similarity_batch(query, docs)
    for i, score in enumerate(cos_scores):
        print(f"  Doc {i+1}: {score:.3f}")
    
    print("\nEUCLIDEAN SIMILARITY:")
    euc_scores = euclidean_similarity_batch(query, docs)
    for i, score in enumerate(euc_scores):
        print(f"  Doc {i+1}: {score:.3f}")
    
    print("\n" + "-" * 60)
    print("\nNotice:")
    print("  - Cosine: Doc 1 and Doc 4 have SAME score (same direction)")
    print("  - Euclidean: Doc 4 has LOWER score (different magnitude)")
    print("\n  👉 For text/embeddings, we want direction → use COSINE")
    print()


if __name__ == "__main__":
    demo_similarity_measures()
    print("\n")
    demo_batch_comparison()

