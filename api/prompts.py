"""Prompt templates for RAG-powered diving coach."""

from typing import List, Dict, Any


class PromptTemplates:
    """Collection of prompt templates for the diving coach."""
    
    # System prompts define the assistant's role and behavior
    SYSTEM_PROMPTS = {
        "default": """You are an expert freediving instructor and safety advisor.

Your role:
- Provide accurate, safety-focused diving instruction
- Base answers on official AIDA training materials when available
- Emphasize safety protocols and proper technique
- Be encouraging but never compromise on safety

Guidelines:
- Use clear, simple language
- Cite sources when referencing manuals
- If you're unsure, say so - safety is paramount
- Encourage proper training and certification""",
        
        "beginner": """You are a patient freediving instructor specializing in beginners.

Your role:
- Explain concepts in simple, non-technical terms
- Focus on fundamentals and safety
- Encourage questions and learning
- Reference AIDA1 and AIDA2 materials primarily

Guidelines:
- Break down complex topics into simple steps
- Use analogies and examples
- Always emphasize safety first
- Encourage proper training with certified instructors""",
        
        "advanced": """You are an expert freediving coach for advanced divers.

Your role:
- Provide detailed technical guidance
- Reference AIDA3 and AIDA4 competition standards
- Discuss advanced techniques and optimization
- Support competitive training

Guidelines:
- Use technical terminology appropriately
- Focus on performance and technique refinement
- Maintain safety focus even at advanced levels
- Reference specific manual sections when relevant"""
    }
    
    @staticmethod
    def format_context(search_results: List[Dict[str, Any]], max_sources: int = 3) -> str:
        """
        Format search results into context string.
        
        Args:
            search_results: List of search results with text, score, metadata
            max_sources: Maximum number of sources to include
        
        Returns:
            Formatted context string
        """
        if not search_results:
            return ""
        
        context_parts = ["Relevant information from AIDA training materials:\n"]
        
        for i, result in enumerate(search_results[:max_sources], 1):
            filename = result['metadata'].get('filename', 'Unknown source')
            score = result['score']
            text = result['text']
            
            # Only include high-confidence results (>0.3 similarity)
            if score < 0.3:
                continue
            
            context_parts.append(f"\n[Source {i}: {filename}]")
            context_parts.append(f"{text}\n")
        
        return "\n".join(context_parts)
    
    @staticmethod
    def build_system_message(
        template: str = "default",
        context: str = "",
        custom_instructions: str = ""
    ) -> str:
        """
        Build the complete system message.
        
        Args:
            template: Which system prompt template to use
            context: Retrieved context from vector search
            custom_instructions: Additional instructions to append
        
        Returns:
            Complete system message
        """
        # Get base system prompt
        system_prompt = PromptTemplates.SYSTEM_PROMPTS.get(template, PromptTemplates.SYSTEM_PROMPTS["default"])
        
        # Add context if available
        if context:
            system_prompt += f"\n\n{context}"
        else:
            system_prompt += "\n\nNote: No specific manual references found. Provide general guidance based on diving knowledge."
        
        # Add custom instructions
        if custom_instructions:
            system_prompt += f"\n\n{custom_instructions}"
        
        return system_prompt
    
    @staticmethod
    def build_rag_prompt(
        user_query: str,
        search_results: List[Dict[str, Any]],
        template: str = "default",
        max_sources: int = 3
    ) -> tuple[str, str]:
        """
        Build complete RAG prompt with system message and user query.
        
        Args:
            user_query: User's question
            search_results: Results from vector search
            template: Which system prompt to use
            max_sources: Max number of sources to include
        
        Returns:
            Tuple of (system_message, user_message)
        """
        # Format context from search results
        context = PromptTemplates.format_context(search_results, max_sources)
        
        # Build system message with context
        system_message = PromptTemplates.build_system_message(template, context)
        
        # User message stays clean - just the question
        user_message = user_query
        
        return system_message, user_message


# Convenience functions for common use cases
def get_basic_rag_prompt(user_query: str, search_results: List[Dict[str, Any]]) -> tuple[str, str]:
    """Quick helper for basic RAG prompt."""
    return PromptTemplates.build_rag_prompt(user_query, search_results, template="default")


def get_beginner_rag_prompt(user_query: str, search_results: List[Dict[str, Any]]) -> tuple[str, str]:
    """Quick helper for beginner-focused RAG prompt."""
    return PromptTemplates.build_rag_prompt(user_query, search_results, template="beginner")


def get_advanced_rag_prompt(user_query: str, search_results: List[Dict[str, Any]]) -> tuple[str, str]:
    """Quick helper for advanced RAG prompt."""
    return PromptTemplates.build_rag_prompt(user_query, search_results, template="advanced")

