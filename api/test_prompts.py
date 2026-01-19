"""Test and compare different prompt templates."""

from prompts import PromptTemplates


def test_prompt_templates():
    """Show how different prompt templates work."""
    
    print("=" * 70)
    print("Prompt Template Testing")
    print("=" * 70 + "\n")
    
    # Simulate search results
    mock_results = [
        {
            "text": "Equalization is essential to prevent ear barotrauma. The Frenzel maneuver is recommended for depths beyond 10 meters.",
            "score": 0.85,
            "metadata": {"filename": "AIDA2 Manual.pdf", "chunk_index": 42}
        },
        {
            "text": "Practice equalization on land first. Never force equalization if you feel pain or resistance.",
            "score": 0.72,
            "metadata": {"filename": "AIDA3 Manual.pdf", "chunk_index": 18}
        }
    ]
    
    user_query = "How do I equalize my ears while diving?"
    
    # Test different templates
    templates = ["default", "beginner", "advanced"]
    
    for template in templates:
        print(f"\n{'='*70}")
        print(f"Template: {template.upper()}")
        print('='*70 + "\n")
        
        system_msg, user_msg = PromptTemplates.build_rag_prompt(
            user_query=user_query,
            search_results=mock_results,
            template=template,
            max_sources=2
        )
        
        print("SYSTEM MESSAGE:")
        print("-" * 70)
        print(system_msg)
        print()
        
        print("USER MESSAGE:")
        print("-" * 70)
        print(user_msg)
        print()


def test_no_context():
    """Test how templates handle no search results."""
    
    print("\n" + "=" * 70)
    print("Testing with NO CONTEXT (no search results)")
    print("=" * 70 + "\n")
    
    user_query = "What is the meaning of life?"
    empty_results = []
    
    system_msg, user_msg = PromptTemplates.build_rag_prompt(
        user_query=user_query,
        search_results=empty_results,
        template="default"
    )
    
    print("SYSTEM MESSAGE:")
    print("-" * 70)
    print(system_msg)
    print()
    
    print("USER MESSAGE:")
    print("-" * 70)
    print(user_msg)
    print()


def test_low_relevance():
    """Test filtering low-relevance results."""
    
    print("\n" + "=" * 70)
    print("Testing with LOW RELEVANCE RESULTS")
    print("=" * 70 + "\n")
    
    # Results with low similarity scores
    low_relevance_results = [
        {
            "text": "The ocean is blue due to water absorbing red wavelengths.",
            "score": 0.25,  # Low score - barely relevant
            "metadata": {"filename": "Random Facts.pdf", "chunk_index": 1}
        },
        {
            "text": "Fish use gills to extract oxygen from water.",
            "score": 0.15,  # Very low score - not relevant
            "metadata": {"filename": "Marine Biology.pdf", "chunk_index": 5}
        }
    ]
    
    user_query = "How to improve my breath-hold time?"
    
    system_msg, user_msg = PromptTemplates.build_rag_prompt(
        user_query=user_query,
        search_results=low_relevance_results,
        template="default"
    )
    
    print("SYSTEM MESSAGE:")
    print("-" * 70)
    print(system_msg)
    print("\n👉 Notice: Low-relevance results (score < 0.3) are filtered out!")
    print()


def show_template_comparison():
    """Side-by-side comparison of templates."""
    
    print("\n" + "=" * 70)
    print("Template Comparison Summary")
    print("=" * 70 + "\n")
    
    comparison = [
        {
            "template": "DEFAULT",
            "audience": "General users",
            "tone": "Professional, balanced",
            "focus": "Safety + accuracy",
            "use_when": "Most queries"
        },
        {
            "template": "BEGINNER",
            "audience": "New divers (AIDA1-2)",
            "tone": "Patient, encouraging",
            "focus": "Simple explanations, fundamentals",
            "use_when": "Teaching basics, new students"
        },
        {
            "template": "ADVANCED",
            "audience": "Experienced divers (AIDA3-4)",
            "tone": "Technical, detailed",
            "focus": "Performance optimization, competition",
            "use_when": "Advanced techniques, competition prep"
        }
    ]
    
    for item in comparison:
        print(f"📋 {item['template']}")
        print(f"   Audience:  {item['audience']}")
        print(f"   Tone:      {item['tone']}")
        print(f"   Focus:     {item['focus']}")
        print(f"   Use when:  {item['use_when']}")
        print()


def test_custom_instructions():
    """Test adding custom instructions to prompts."""
    
    print("\n" + "=" * 70)
    print("Testing Custom Instructions")
    print("=" * 70 + "\n")
    
    mock_results = [
        {
            "text": "Static apnea training should progress gradually.",
            "score": 0.80,
            "metadata": {"filename": "AIDA2 Manual.pdf", "chunk_index": 30}
        }
    ]
    
    context = PromptTemplates.format_context(mock_results)
    
    # Add custom instructions
    system_msg = PromptTemplates.build_system_message(
        template="default",
        context=context,
        custom_instructions="Important: Keep response under 100 words. Use bullet points."
    )
    
    print("SYSTEM MESSAGE WITH CUSTOM INSTRUCTIONS:")
    print("-" * 70)
    print(system_msg)
    print()


if __name__ == "__main__":
    test_prompt_templates()
    test_no_context()
    test_low_relevance()
    show_template_comparison()
    test_custom_instructions()
    
    print("=" * 70)
    print("✅ All prompt template tests complete!")
    print("=" * 70)

