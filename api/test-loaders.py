import asyncio
import time
from loaders import TextFileLoader, CharacterTextSplitter
from embeddings import EmbeddingModel

print("=" * 60)
print("TESTING TextFileLoader")
print("=" * 60)

print("\nTest 1: Loading single text file...")
loader = TextFileLoader("data/Freediving.txt")
docs = loader.load()
print(f"✅ Loaded {len(docs)} document(s)")
print(f"First 100 chars: {docs[0][:100]}...")

print("\nTest 2: Loading single PDF file...")
loader = TextFileLoader("data/AIDA1 Manual_EN.pdf")
docs = loader.load()
print(f"✅ Loaded {len(docs)} document(s)")
print(f"First 200 chars: {docs[0][:200]}...")

print("\nTest 3: Loading directory...")
loader = TextFileLoader("data")
docs = loader.load()
print(f"✅ Loaded {len(docs)} documents")
for i, doc in enumerate(docs):
    print(f"  Document {i+1}: {len(doc)} characters")

print("\n" + "=" * 60)
print("TESTING CharacterTextSplitter")
print("=" * 60)

# Test 4: Basic splitting with default parameters
print("\nTest 4: Basic splitting with default parameters...")
splitter = CharacterTextSplitter()  # Uses defaults: chunk_size=1000, chunk_overlap=200
test_text = "A" * 2500  # 2500 characters
chunks = splitter.split_text(test_text)
print(f"✅ Split {len(test_text)} chars into {len(chunks)} chunks")
print(f"   Chunk sizes: {[len(c) for c in chunks]}")
print(f"   Expected chunks: {(2500 - 200) // (1000 - 200) + 1}")  # Rough calculation

# Test 5: Verify chunk sizes don't exceed limit
print("\nTest 5: Verifying chunk sizes...")
all_valid = all(len(chunk) <= splitter.chunk_size for chunk in chunks)
print(f"✅ All chunks <= {splitter.chunk_size} chars: {all_valid}")

# Test 6: Verify overlap between consecutive chunks
print("\nTest 6: Verifying overlap between chunks...")
if len(chunks) > 1:
    overlaps = []
    for i in range(len(chunks) - 1):
        # Check if the end of chunk i overlaps with start of chunk i+1
        chunk1_end = chunks[i][-splitter.chunk_overlap:]
        chunk2_start = chunks[i+1][:splitter.chunk_overlap]
        overlap_found = chunk1_end == chunk2_start
        overlaps.append(overlap_found)
        if not overlap_found:
            print(f"   ⚠️  Chunk {i} and {i+1} don't have expected overlap")
    print(f"✅ Overlap verified: {sum(overlaps)}/{len(overlaps)} chunks have proper overlap")
else:
    print("   (Only one chunk, no overlap to verify)")

# Test 7: Custom chunk size and overlap
print("\nTest 7: Custom chunk size and overlap...")
splitter_custom = CharacterTextSplitter(chunk_size=100, chunk_overlap=20)
test_text_custom = "B" * 250
chunks_custom = splitter_custom.split_text(test_text_custom)
print(f"✅ Split {len(test_text_custom)} chars into {len(chunks_custom)} chunks")
print(f"   Chunk sizes: {[len(c) for c in chunks_custom]}")

# Test 8: Edge case - text shorter than chunk_size
print("\nTest 8: Text shorter than chunk_size...")
short_text = "Short text here"
chunks_short = splitter.split_text(short_text)
print(f"✅ Split {len(short_text)} chars into {len(chunks_short)} chunk(s)")
print(f"   Content: {chunks_short[0] if chunks_short else '[]'}")

# Test 9: Edge case - empty string
print("\nTest 9: Empty string...")
chunks_empty = splitter.split_text("")
print(f"✅ Empty string returns {len(chunks_empty)} chunks: {chunks_empty}")

# Test 10: split_documents method
print("\nTest 10: split_documents with multiple documents...")
documents = ["Document 1: " + "X" * 500, "Document 2: " + "Y" * 500]
all_chunks = splitter.split_documents(documents)
print(f"✅ Split {len(documents)} documents into {len(all_chunks)} total chunks")
print(f"   First chunk from doc 1: {all_chunks[0][:50]}...")
print(f"   Last chunk from doc 2: {all_chunks[-1][:50]}...")

# Test 11: Integration test - load and split a real document
print("\nTest 11: Integration - Load and split real document...")
loader = TextFileLoader("data/Freediving.txt")
docs = loader.load()
splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = splitter.split_documents(docs)
print(f"✅ Loaded document ({len(docs[0])} chars) and split into {len(chunks)} chunks")
print(f"   Average chunk size: {sum(len(c) for c in chunks) / len(chunks):.1f} chars")

# Test 12: Validation - invalid parameters
print("\nTest 12: Validation - invalid parameters...")
try:
    invalid_splitter = CharacterTextSplitter(chunk_size=100, chunk_overlap=150)
    print("   ❌ Should have raised ValueError for overlap >= chunk_size")
except ValueError as e:
    print(f"✅ Correctly raised ValueError: {e}")

try:
    invalid_splitter = CharacterTextSplitter(chunk_size=0, chunk_overlap=0)
    print("   ❌ Should have raised ValueError for chunk_size <= 0")
except ValueError as e:
    print(f"✅ Correctly raised ValueError: {e}")

print("\n" + "=" * 60)
print("TESTING EmbeddingModel")
print("=" * 60)

# Test 13: Basic async embedding test
print("\nTest 13: Basic async embedding for single text...")
try:
    embedding_model = EmbeddingModel()
    test_text = "Freediving is a form of underwater diving"
    
    async def test_single():
        embedding = await embedding_model.get_embedding(test_text)
        return embedding
    
    embedding = asyncio.run(test_single())
    
    # Verify it's a list of floats
    is_list = isinstance(embedding, list)
    is_floats = all(isinstance(x, float) for x in embedding)
    correct_length = len(embedding) == 1536  # text-embedding-3-small has 1536 dimensions
    
    print(f"✅ Got embedding: {is_list and is_floats}")
    print(f"   Dimensions: {len(embedding)} (expected: 1536)")
    print(f"   Correct length: {correct_length}")
    print(f"   First 5 values: {embedding[:5]}")
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 14: Batch async embeddings test
print("\nTest 14: Batch async embeddings for multiple texts...")
try:
    embedding_model = EmbeddingModel()
    test_texts = [
        "Freediving techniques",
        "Underwater swimming",
        "Cooking recipes"
    ]
    
    async def test_batch():
        embeddings = await embedding_model.get_embeddings(test_texts)
        return embeddings
    
    embeddings = asyncio.run(test_batch())
    
    correct_count = len(embeddings) == len(test_texts)
    all_correct_length = all(len(emb) == 1536 for emb in embeddings)
    
    print(f"✅ Got {len(embeddings)} embeddings for {len(test_texts)} texts")
    print(f"   Correct count: {correct_count}")
    print(f"   All correct length (1536): {all_correct_length}")
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 15: Similarity test with async
print("\nTest 15: Semantic similarity test (async)...")
try:
    embedding_model = EmbeddingModel()
    
    async def test_similarity():
        # Get embeddings for similar and different texts
        emb1 = await embedding_model.get_embedding("diving")
        emb2 = await embedding_model.get_embedding("swimming")
        emb3 = await embedding_model.get_embedding("cooking")
        return emb1, emb2, emb3
    
    emb1, emb2, emb3 = asyncio.run(test_similarity())
    
    # Calculate cosine similarity
    def cosine_similarity(a, b):
        dot_product = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x * x for x in a) ** 0.5
        norm_b = sum(y * y for y in b) ** 0.5
        return dot_product / (norm_a * norm_b) if (norm_a * norm_b) > 0 else 0
    
    sim_diving_swimming = cosine_similarity(emb1, emb2)
    sim_diving_cooking = cosine_similarity(emb1, emb3)
    
    more_similar = sim_diving_swimming > sim_diving_cooking
    
    print(f"✅ Similarity test:")
    print(f"   diving ↔ swimming: {sim_diving_swimming:.4f}")
    print(f"   diving ↔ cooking: {sim_diving_cooking:.4f}")
    print(f"   More similar (diving-swimming > diving-cooking): {more_similar}")
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 16: Edge cases with async
print("\nTest 16: Edge cases (async)...")
try:
    embedding_model = EmbeddingModel()
    
    async def test_edge_cases():
        # Test empty string
        try:
            await embedding_model.get_embedding("")
            print("   ❌ Should have raised ValueError for empty string")
        except ValueError as e:
            print(f"✅ Correctly raised ValueError for empty string: {e}")
        
        # Test empty list
        try:
            await embedding_model.get_embeddings([])
            print("   ❌ Should have raised ValueError for empty list")
        except ValueError as e:
            print(f"✅ Correctly raised ValueError for empty list: {e}")
        
        # Test list with all empty strings
        try:
            await embedding_model.get_embeddings(["", "  ", "\n"])
            print("   ❌ Should have raised ValueError for all empty strings")
        except ValueError as e:
            print(f"✅ Correctly raised ValueError for all empty strings: {e}")
    
    asyncio.run(test_edge_cases())
        
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 17: Integration test - load, split, and embed (async)
print("\nTest 17: Integration - Load, split, and embed document (async)...")
try:
    # Load document
    loader = TextFileLoader("data/Freediving.txt")
    docs = loader.load()
    
    # Split into chunks
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    chunks = splitter.split_documents(docs)
    
    # Get embeddings for first 3 chunks (to save API calls)
    embedding_model = EmbeddingModel()
    sample_chunks = chunks[:3]
    
    async def test_integration():
        embeddings = await embedding_model.get_embeddings(sample_chunks)
        return embeddings
    
    embeddings = asyncio.run(test_integration())
    
    print(f"✅ Loaded document ({len(docs[0])} chars)")
    print(f"   Split into {len(chunks)} chunks")
    print(f"   Got embeddings for {len(embeddings)} sample chunks")
    print(f"   All embeddings have correct dimensions: {all(len(e) == 1536 for e in embeddings)}")
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 18: Validation - missing API key
print("\nTest 18: Validation - missing API key...")
try:
    # Temporarily remove API key from environment
    import os
    original_key = os.environ.get("OPENAI_API_KEY")
    if "OPENAI_API_KEY" in os.environ:
        del os.environ["OPENAI_API_KEY"]
    
    try:
        invalid_model = EmbeddingModel(api_key=None)
        print("   ❌ Should have raised ValueError for missing API key")
    except ValueError as e:
        print(f"✅ Correctly raised ValueError: {e}")
    finally:
        # Restore original key
        if original_key:
            os.environ["OPENAI_API_KEY"] = original_key
except Exception as e:
    print(f"⚠️  Test skipped: {e}")

print("\n" + "=" * 60)
print("TESTING Advanced Async Features")
print("=" * 60)

# Test 18: Async with batching logic (larger dataset)
print("\nTest 18: Async with batching logic (larger dataset)...")
try:
    embedding_model = EmbeddingModel()
    
    # Create 25 texts to test batching (with batch_size=10, should create 3 batches)
    test_texts = [f"Diving technique number {i}: This is test text for embedding generation." for i in range(25)]
    
    print(f"   Testing with {len(test_texts)} texts, batch_size=10 (should create 3 batches)...")
    
    async def test_batching():
        start = time.time()
        embeddings = await embedding_model.get_embeddings(test_texts, batch_size=10)
        elapsed = time.time() - start
        return embeddings, elapsed
    
    embeddings, elapsed_time = asyncio.run(test_batching())
    
    correct_count = len(embeddings) == len(test_texts)
    all_valid = all(len(emb) == 1536 for emb in embeddings)
    
    print(f"✅ Batch processing complete:")
    print(f"   Processed {len(embeddings)} embeddings in {elapsed_time:.2f} seconds")
    print(f"   Correct count: {correct_count}")
    print(f"   All valid dimensions: {all_valid}")
    print(f"   Average time per embedding: {elapsed_time/len(embeddings):.3f} seconds")
    
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 19: Concurrent single embeddings with asyncio.gather
print("\nTest 19: Concurrent single embeddings with asyncio.gather...")
try:
    embedding_model = EmbeddingModel()
    
    test_texts = [
        "Freediving safety protocols",
        "Breath-hold training methods",
        "Underwater diving techniques",
        "Apnea exercises",
        "Diving equipment essentials"
    ]
    
    async def test_concurrent_singles():
        start = time.time()
        # Process all single embeddings concurrently
        embeddings = await asyncio.gather(*[
            embedding_model.get_embedding(text) for text in test_texts
        ])
        elapsed = time.time() - start
        return embeddings, elapsed
    
    embeddings, elapsed_time = asyncio.run(test_concurrent_singles())
    
    correct_count = len(embeddings) == len(test_texts)
    all_valid = all(len(emb) == 1536 for emb in embeddings)
    
    print(f"✅ Concurrent processing complete:")
    print(f"   Processed {len(embeddings)} embeddings in {elapsed_time:.2f} seconds")
    print(f"   Correct count: {correct_count}")
    print(f"   All valid dimensions: {all_valid}")
    print(f"   Average time per embedding: {elapsed_time/len(embeddings):.3f} seconds")
    
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 20: Performance test with many documents
print("\nTest 20: Performance test with many documents (15+ texts)...")
try:
    embedding_model = EmbeddingModel()
    
    # Create 15 test texts
    test_texts = [
        "Freediving is a form of underwater diving",
        "Breath-hold diving requires training",
        "Apnea techniques improve lung capacity",
        "Safety protocols are essential for diving",
        "Equalization prevents ear injuries",
        "Fins help with propulsion underwater",
        "Wetsuits provide thermal protection",
        "Weight belts help with buoyancy control",
        "Dive watches track depth and time",
        "Training improves breath-hold duration",
        "Relaxation is key to longer dives",
        "Hyperventilation can be dangerous",
        "Buddy system ensures diver safety",
        "Recovery breathing restores oxygen",
        "Depth records require careful preparation"
    ]
    
    print(f"   Testing with {len(test_texts)} texts...")
    
    async def test_performance():
        start = time.time()
        embeddings = await embedding_model.get_embeddings(test_texts)
        elapsed = time.time() - start
        return embeddings, elapsed
    
    embeddings, elapsed_time = asyncio.run(test_performance())
    
    correct_count = len(embeddings) == len(test_texts)
    all_valid = all(len(emb) == 1536 for emb in embeddings)
    
    print(f"✅ Performance test complete:")
    print(f"   Processed {len(embeddings)} embeddings in {elapsed_time:.2f} seconds")
    print(f"   Correct count: {correct_count}")
    print(f"   All valid dimensions: {all_valid}")
    print(f"   Average time per embedding: {elapsed_time/len(embeddings):.3f} seconds")
    print(f"   Throughput: {len(embeddings)/elapsed_time:.2f} embeddings/second")
    
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 21: Test different batch sizes
print("\nTest 21: Testing different batch sizes...")
try:
    embedding_model = EmbeddingModel()
    
    # Create 20 test texts
    test_texts = [f"Test text number {i} for batch size testing." for i in range(20)]
    
    async def test_batch_sizes():
        results = {}
        for batch_size in [5, 10, 20, 100]:
            start = time.time()
            embeddings = await embedding_model.get_embeddings(test_texts, batch_size=batch_size)
            elapsed = time.time() - start
            results[batch_size] = {
                'time': elapsed,
                'count': len(embeddings),
                'valid': all(len(e) == 1536 for e in embeddings)
            }
        return results
    
    results = asyncio.run(test_batch_sizes())
    
    print(f"✅ Batch size comparison:")
    for batch_size, result in sorted(results.items()):
        print(f"   batch_size={batch_size:3d}: {result['time']:.2f}s, "
              f"{result['count']} embeddings, valid={result['valid']}")
    
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 22: Large dataset with proper batching
print("\nTest 22: Large dataset with proper batching (50+ texts)...")
try:
    embedding_model = EmbeddingModel()
    
    # Create 50 test texts
    test_texts = [
        f"Diving technique {i}: Comprehensive freediving instruction covering "
        f"safety, training, and advanced methods for breath-hold diving."
        for i in range(50)
    ]
    
    print(f"   Testing with {len(test_texts)} texts, batch_size=20...")
    
    async def test_large_dataset():
        start = time.time()
        embeddings = await embedding_model.get_embeddings(test_texts, batch_size=20)
        elapsed = time.time() - start
        return embeddings, elapsed
    
    embeddings, elapsed_time = asyncio.run(test_large_dataset())
    
    correct_count = len(embeddings) == len(test_texts)
    all_valid = all(len(emb) == 1536 for emb in embeddings)
    expected_batches = (len(test_texts) + 19) // 20  # Ceiling division
    
    print(f"✅ Large dataset processing complete:")
    print(f"   Processed {len(embeddings)} embeddings in {elapsed_time:.2f} seconds")
    print(f"   Expected batches: {expected_batches}")
    print(f"   Correct count: {correct_count}")
    print(f"   All valid dimensions: {all_valid}")
    print(f"   Throughput: {len(embeddings)/elapsed_time:.2f} embeddings/second")
    
except ValueError as e:
    print(f"⚠️  Skipped: {e}")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)
print("ALL TESTS COMPLETE")
print("=" * 60)
