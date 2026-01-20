"""
Demo: Structured Source Citations in RAG System

This demonstrates the enhanced prompt system with structured citations.
"""

import asyncio
from prompts import PromptTemplates
from vector_store import VectorStore
from ingest import get_vector_store, load_documents_from_data_folder


async def demo_structured_citations():
    """Demonstrate structured citation features."""
    
    print("=" * 80)
    print("STRUCTURED SOURCE CITATIONS DEMO")
    print("=" * 80)
    
    # Load documents if not already loaded
    await load_documents_from_data_folder()
    vector_store = get_vector_store()
    
    # Test query
    query = "What are the main equalization techniques for freediving?"
    print(f"\n📝 Query: {query}\n")
    
    # Search for relevant documents
    search_results = await vector_store.search(query, top_k=3)
    print(f"✅ Found {len(search_results)} relevant sources\n")
    
    # =========================================================================
    # DEMO 1: Standard Structured Citations
    # =========================================================================
    print("=" * 80)
    print("DEMO 1: Standard Structured Citations (Default Template)")
    print("=" * 80)
    
    system_msg, user_msg = PromptTemplates.build_rag_prompt(
        user_query=query,
        search_results=search_results,
        template="default",
        max_sources=3,
        structured_citations=True,
        enforce_citations=True
    )
    
    print("\n📋 SYSTEM MESSAGE:")
    print("-" * 80)
    print(system_msg)
    print("\n📋 USER MESSAGE:")
    print("-" * 80)
    print(user_msg)
    
    # =========================================================================
    # DEMO 2: Simple Citations (Without Rich Formatting)
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("DEMO 2: Simple Citations (No Rich Formatting)")
    print("=" * 80)
    
    system_msg_simple, user_msg_simple = PromptTemplates.build_rag_prompt(
        user_query=query,
        search_results=search_results,
        template="default",
        structured_citations=False  # Turn off rich formatting
    )
    
    print("\n📋 SYSTEM MESSAGE (Simple):")
    print("-" * 80)
    print(system_msg_simple)
    
    # =========================================================================
    # DEMO 3: Advanced Template with Custom Instructions
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("DEMO 3: Advanced Template with Custom Instructions")
    print("=" * 80)
    
    system_msg_adv, user_msg_adv = PromptTemplates.build_rag_prompt(
        user_query=query,
        search_results=search_results,
        template="advanced",
        max_sources=3,
        structured_citations=True,
        custom_instructions="Focus on competition-level techniques. Keep response under 200 words."
    )
    
    print("\n📋 SYSTEM MESSAGE (Advanced + Custom):")
    print("-" * 80)
    print(system_msg_adv[:1000] + "...\n[truncated for brevity]")
    
    # =========================================================================
    # DEMO 4: Citation Extraction and Verification
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("DEMO 4: Citation Extraction & Verification")
    print("=" * 80)
    
    # Simulate an AI response with citations
    mock_response = """
    Freediving uses several equalization techniques to prevent barotrauma during descent.
    
    The most common technique is the Frenzel maneuver [Source 1], which involves using the 
    tongue as a piston to compress air into the middle ear. This is more efficient than 
    the Valsalva maneuver at depth.
    
    For advanced divers, the mouthfill technique [Source 2] allows equalization at depths 
    where lung volume is significantly compressed. According to [Source 1], practicing 
    equalization on land is essential before attempting deep dives.
    
    Safety protocols emphasize equalizing early and often [Source 3] to prevent injury.
    """
    
    print("\n🤖 Simulated AI Response:")
    print("-" * 80)
    print(mock_response)
    
    # Extract citations
    cited_sources = PromptTemplates.extract_citations(mock_response)
    print(f"\n📊 Extracted Citations: {cited_sources}")
    
    # Verify citations
    verification = PromptTemplates.verify_citations(mock_response, search_results)
    print(f"\n✅ Citation Verification:")
    print(f"   - Cited sources: {verification['cited_sources']}")
    print(f"   - Total available: {verification['total_available']}")
    print(f"   - All valid: {verification['all_valid']}")
    print(f"   - Citation count: {verification['citation_count']}")
    print(f"   - Citation rate: {verification['citation_rate']:.0%}")
    
    # Build reference list
    references = PromptTemplates.build_citation_reference(
        search_results, 
        cited_sources=cited_sources
    )
    print(f"\n{references}")
    
    # =========================================================================
    # DEMO 5: Handling Low-Relevance Results
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("DEMO 5: Filtering Low-Relevance Results")
    print("=" * 80)
    
    # Create mock results with varying scores
    mock_results = [
        {"text": "High relevance content", "score": 0.85, "metadata": {"filename": "AIDA3.pdf", "chunk_index": 10}},
        {"text": "Medium relevance content", "score": 0.55, "metadata": {"filename": "AIDA2.pdf", "chunk_index": 5}},
        {"text": "Low relevance content", "score": 0.25, "metadata": {"filename": "AIDA1.pdf", "chunk_index": 2}},
    ]
    
    system_msg_filtered, _ = PromptTemplates.build_rag_prompt(
        user_query=query,
        search_results=mock_results,
        template="default",
        min_score=0.3,  # Filter out results below 30% similarity
        structured_citations=True
    )
    
    print("\n📊 Results with min_score=0.3:")
    print(f"   - Total results: {len(mock_results)}")
    print(f"   - High relevance (≥30%): 2 sources included")
    print(f"   - Low relevance (<30%): 1 source filtered out")
    print("\n✅ Only high-confidence sources are included in the prompt!")
    
    # =========================================================================
    # SUMMARY
    # =========================================================================
    print("\n\n" + "=" * 80)
    print("KEY FEATURES OF STRUCTURED CITATIONS")
    print("=" * 80)
    print("""
    ✅ Rich metadata display (filename, chunk, relevance score)
    ✅ Clear citation format [Source X] for AI to use
    ✅ Automatic filtering of low-relevance sources
    ✅ Citation extraction from AI responses
    ✅ Citation verification and validation
    ✅ Automatic reference list generation
    ✅ Support for custom instructions
    ✅ Template-based system prompts (default, beginner, advanced)
    
    💡 Benefits:
    - More trustworthy and verifiable responses
    - Users can trace information back to source documents
    - Better transparency in RAG system
    - Professional citation format
    - Easy to track which sources were actually used
    """)
    
    print("\n" + "=" * 80)
    print("✅ Demo Complete!")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(demo_structured_citations())

