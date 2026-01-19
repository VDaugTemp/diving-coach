"""Tests for VectorStore class."""

import asyncio
from vector_store import VectorStore


async def test_vector_store():
    print("🧪 Testing VectorStore...\n")
    
    store = VectorStore()
    print("✅ VectorStore initialized")
    
    results = await store.search("test query")
    assert results == [], "Empty store should return empty results"
    print("✅ Empty search works")
    
    docs = [
        "Freediving is diving underwater without breathing apparatus.",
        "The mammalian dive reflex slows heart rate and conserves oxygen.",
        "Equalization techniques help prevent ear barotrauma.",
        "Static apnea is holding your breath while stationary.",
    ]
    metadata = [{"source": "test", "id": i} for i in range(len(docs))]
    
    await store.add_documents(docs, metadata)
    print(f"✅ Added {len(docs)} documents")
    
    stats = store.get_stats()
    print(f"📊 Stats: {stats}")
    assert stats['num_documents'] == 4
    assert stats['embedding_dimension'] == 1536
    print("✅ Stats are correct")
    
    results = await store.search("breathing techniques", top_k=2)
    print(f"\n🔍 Search results for 'breathing techniques':")
    for i, result in enumerate(results, 1):
        print(f"  {i}. Score: {result['score']:.3f}")
        print(f"     Text: {result['text'][:60]}...")
    
    assert len(results) == 2, "Should return top 2 results"
    assert all('score' in r and 'text' in r and 'metadata' in r for r in results)
    print("\n✅ Search works correctly")
    
    store.clear()
    stats = store.get_stats()
    assert stats['num_documents'] == 0
    print("✅ Clear works correctly")
    
    print("\n✅ All tests passed!")


async def test_abuild_from_list():
    """Test the abuild_from_list method with 20+ documents."""
    print("\n🧪 Testing abuild_from_list with 20+ documents...\n")
    
    texts = [
        "Freediving is the practice of diving underwater without breathing apparatus.",
        "The mammalian dive reflex slows heart rate during submersion.",
        "Equalization techniques prevent ear barotrauma during descent.",
        "Static apnea involves holding your breath while stationary.",
        "Dynamic apnea is swimming underwater on a single breath.",
        "Constant weight freediving is descending and ascending with the same weight.",
        "Free immersion involves pulling down a rope without fins.",
        "The Frenzel maneuver is an equalization technique.",
        "Diaphragmatic breathing improves lung capacity for diving.",
        "Hyperventilation before diving is dangerous and should be avoided.",
        "The urge to breathe is triggered by CO2 buildup, not oxygen depletion.",
        "Proper weighting is essential for neutral buoyancy.",
        "The safety diver is crucial during freediving training.",
        "Never dive alone - always use the buddy system.",
        "Proper warm-up reduces the risk of injury.",
        "Stretching exercises improve flexibility for diving.",
        "Mental preparation is as important as physical training.",
        "Visualization techniques can improve dive performance.",
        "Progressive relaxation helps reduce oxygen consumption.",
        "The dive reflex is stronger in cold water.",
        "Proper hydration is essential for safe diving.",
        "Recovery breathing should be done correctly after surfacing.",
        "Blackout prevention requires proper safety protocols.",
        "Training tables help improve breath-hold time safely.",
        "The Valsalva maneuver can be used for equalization.",
    ]
    
    metadata = [{"doc_id": i, "topic": "freediving"} for i in range(len(texts))]
    
    store = VectorStore()
    result = await store.abuild_from_list(texts, metadata)
    
    assert result is store, "Should return self for chaining"
    print(f"✅ Built vector DB with {len(texts)} documents")
    
    stats = store.get_stats()
    assert stats['num_documents'] == len(texts), f"Expected {len(texts)} documents, got {stats['num_documents']}"
    print(f"📊 Stats: {stats}")
    print("✅ All documents added correctly")
    
    results = await store.search("equalization techniques", top_k=3)
    print(f"\n🔍 Search results for 'equalization techniques':")
    for i, result in enumerate(results, 1):
        print(f"  {i}. Score: {result['score']:.3f}")
        print(f"     Text: {result['text'][:60]}...")
        print(f"     Metadata: {result['metadata']}")
    
    assert len(results) == 3, "Should return top 3 results"
    assert all(r['score'] > 0 for r in results), "All results should have positive scores"
    print("\n✅ Search on 20+ documents works correctly")
    
    chained_store = VectorStore()
    await chained_store.abuild_from_list(texts[:5], metadata[:5])
    await chained_store.abuild_from_list(texts[5:10], metadata[5:10])
    final_stats = chained_store.get_stats()
    assert final_stats['num_documents'] == 10, "Chaining should work"
    print("✅ Method chaining works correctly")
    
    print("\n✅ All abuild_from_list tests passed!")


if __name__ == "__main__":
    asyncio.run(test_vector_store())
    asyncio.run(test_abuild_from_list())

