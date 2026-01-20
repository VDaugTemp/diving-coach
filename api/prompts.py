"""Prompt templates for RAG-powered diving coach with structured citations."""

from typing import List, Dict, Any, Tuple, Optional
import re


class PromptTemplates:
    """Collection of prompt templates for the diving coach with citation support."""
    
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
- **ALWAYS cite sources when referencing manuals using this format: [Source X]**
- If you're unsure, say so - safety is paramount
- Encourage proper training and certification
- When multiple sources say similar things, cite all relevant sources""",
        
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
- **Cite your sources using [Source X] when referencing manuals**
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
- **Always provide specific source citations using [Source X] format**
- Reference exact manual sections when available"""
    }
    
    @staticmethod
    def format_context(
        search_results: List[Dict[str, Any]], 
        max_sources: int = 3,
        min_score: float = 0.3,
        structured_citations: bool = True
    ) -> str:
        """
        Format search results into context string with structured citations.
        
        Args:
            search_results: List of search results with text, score, metadata
            max_sources: Maximum number of sources to include
            min_score: Minimum similarity score to include (default 0.3)
            structured_citations: Whether to include rich citation metadata
        
        Returns:
            Formatted context string with citation information
        """
        if not search_results:
            return ""
        
        context_parts = ["📚 Relevant information from AIDA training materials:\n"]
        
        source_count = 0
        for result in search_results:
            if source_count >= max_sources:
                break
                
            score = result.get('score', 0)
            
            # Only include high-confidence results
            if score < min_score:
                continue
            
            source_count += 1
            metadata = result.get('metadata', {})
            filename = metadata.get('filename', 'Unknown source')
            chunk_index = metadata.get('chunk_index', 'N/A')
            text = result.get('text', '')
            
            if structured_citations:
                # Rich citation format with metadata
                context_parts.append(f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                context_parts.append(f"[Source {source_count}]")
                context_parts.append(f"📄 Document: {filename}")
                context_parts.append(f"🔍 Relevance: {score:.2%}")
                context_parts.append(f"📍 Chunk: {chunk_index}")
                context_parts.append(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
                context_parts.append(f"{text}\n")
            else:
                # Simple format
                context_parts.append(f"\n[Source {source_count}: {filename}]")
                context_parts.append(f"{text}\n")
        
        if source_count == 0:
            return ""
        
        # Add citation instructions
        context_parts.append("\n" + "="*50)
        context_parts.append("IMPORTANT: When using information from the sources above,")
        context_parts.append("cite them in your response as [Source 1], [Source 2], etc.")
        context_parts.append("="*50)
        
        return "\n".join(context_parts)
    
    @staticmethod
    def build_system_message(
        template: str = "default",
        context: str = "",
        custom_instructions: str = "",
        enforce_citations: bool = True
    ) -> str:
        """
        Build the complete system message with citation requirements.
        
        Args:
            template: Which system prompt template to use
            context: Retrieved context from vector search
            custom_instructions: Additional instructions to append
            enforce_citations: Whether to strictly require citations
        
        Returns:
            Complete system message
        """
        # Get base system prompt
        system_prompt = PromptTemplates.SYSTEM_PROMPTS.get(template, PromptTemplates.SYSTEM_PROMPTS["default"])
        
        # Add context if available
        if context:
            system_prompt += f"\n\n{context}"
            
            if enforce_citations:
                system_prompt += "\n\n⚠️  CITATION REQUIREMENT: You MUST cite sources when using information from the materials above."
        else:
            system_prompt += "\n\n📝 Note: No specific manual references found. Provide general guidance based on freediving knowledge."
            system_prompt += "\nClearly state that you're providing general guidance without specific manual references."
        
        # Add custom instructions
        if custom_instructions:
            system_prompt += f"\n\n💡 Additional Instructions:\n{custom_instructions}"
        
        return system_prompt
    
    @staticmethod
    def build_rag_prompt(
        user_query: str,
        search_results: List[Dict[str, Any]],
        template: str = "default",
        max_sources: int = 3,
        min_score: float = 0.3,
        structured_citations: bool = True,
        enforce_citations: bool = True,
        custom_instructions: Optional[str] = None
    ) -> Tuple[str, str]:
        """
        Build complete RAG prompt with structured citations.
        
        Args:
            user_query: User's question
            search_results: Results from vector search
            template: Which system prompt to use (default, beginner, advanced)
            max_sources: Max number of sources to include
            min_score: Minimum similarity score to include source
            structured_citations: Whether to use rich citation format
            enforce_citations: Whether to require AI to cite sources
            custom_instructions: Additional custom instructions
        
        Returns:
            Tuple of (system_message, user_message)
        """
        # Format context from search results with structured citations
        context = PromptTemplates.format_context(
            search_results, 
            max_sources=max_sources,
            min_score=min_score,
            structured_citations=structured_citations
        )
        
        # Build system message with context and citation requirements
        system_message = PromptTemplates.build_system_message(
            template=template,
            context=context,
            custom_instructions=custom_instructions or "",
            enforce_citations=enforce_citations
        )
        
        # User message stays clean - just the question
        user_message = user_query
        
        return system_message, user_message
    @staticmethod
    def extract_citations(response_text: str) -> List[int]:
        """
        Extract citation numbers from AI response.
        
        Args:
            response_text: The AI's response text
        
        Returns:
            List of source numbers that were cited (e.g., [1, 2, 3])
        
        Example:
            >>> extract_citations("According to [Source 1] and [Source 3]...")
            [1, 3]
        """
        pattern = r'\[Source (\d+)\]'
        matches = re.findall(pattern, response_text)
        return sorted(list(set(int(m) for m in matches)))
    
    @staticmethod
    def build_citation_reference(
        search_results: List[Dict[str, Any]],
        cited_sources: Optional[List[int]] = None
    ) -> str:
        """
        Build a formatted reference list for cited sources.
        
        Args:
            search_results: Original search results
            cited_sources: List of source numbers that were cited (if None, includes all)
        
        Returns:
            Formatted reference list string
        
        Example output:
            References:
            [1] AIDA3_Manual.pdf (Chunk 42, Relevance: 87%)
            [2] AIDA2_Manual.pdf (Chunk 15, Relevance: 76%)
        """
        if not search_results:
            return ""
        
        references = ["📚 References:"]
        
        for i, result in enumerate(search_results, 1):
            # If cited_sources is specified, only include those
            if cited_sources and i not in cited_sources:
                continue
            
            metadata = result.get('metadata', {})
            filename = metadata.get('filename', 'Unknown')
            chunk_index = metadata.get('chunk_index', 'N/A')
            score = result.get('score', 0)
            
            references.append(
                f"[{i}] {filename} (Chunk {chunk_index}, Relevance: {score:.0%})"
            )
        
        return "\n".join(references) if len(references) > 1 else ""
    
    @staticmethod
    def verify_citations(
        response_text: str,
        search_results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Verify that citations in response are valid.
        
        Args:
            response_text: The AI's response
            search_results: Original search results
        
        Returns:
            Dictionary with citation analysis:
            {
                'cited_sources': [1, 2],
                'total_available': 3,
                'all_valid': True,
                'citation_rate': 0.67
            }
        """
        cited = PromptTemplates.extract_citations(response_text)
        total = len(search_results)
        
        return {
            'cited_sources': cited,
            'total_available': total,
            'all_valid': all(1 <= c <= total for c in cited),
            'citation_count': len(cited),
            'citation_rate': len(cited) / total if total > 0 else 0
        }


# Convenience functions for common use cases
def get_basic_rag_prompt(user_query: str, search_results: List[Dict[str, Any]]) -> Tuple[str, str]:
    """Quick helper for basic RAG prompt."""
    return PromptTemplates.build_rag_prompt(user_query, search_results, template="default")


def get_beginner_rag_prompt(user_query: str, search_results: List[Dict[str, Any]]) -> Tuple[str, str]:
    """Quick helper for beginner-focused RAG prompt."""
    return PromptTemplates.build_rag_prompt(user_query, search_results, template="beginner")


def get_advanced_rag_prompt(user_query: str, search_results: List[Dict[str, Any]]) -> Tuple[str, str]:
    """Quick helper for advanced RAG prompt."""
    return PromptTemplates.build_rag_prompt(user_query, search_results, template="advanced")

