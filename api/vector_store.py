"""Vector Store Module - In-memory vector database for semantic search."""

import numpy as np
from typing import List, Dict, Optional, Any, Literal
from .embeddings import EmbeddingModel
from .similarity import cosine_similarity_batch, euclidean_similarity_batch


class VectorStore:    
    def __init__(self, embedding_model: Optional[EmbeddingModel] = None):
        self.documents: List[str] = []
        self.embeddings: Optional[np.ndarray] = None
        self.metadata: List[Dict[str, Any]] = []
        self.embedding_model = embedding_model or EmbeddingModel()
    
    def insert(self, text: str, embedding: np.ndarray, metadata: Optional[Dict[str, Any]] = None) -> None:
        if self.embeddings is None:
            self.embeddings = np.array([embedding])
        else:
            self.embeddings = np.vstack([self.embeddings, embedding.reshape(1, -1)])
        
        self.documents.append(text)
        self.metadata.append(metadata or {})
    
    async def build_from_list(
        self, 
        list_of_text: List[str], 
        metadata_list: Optional[List[Dict[str, Any]]] = None
    ) -> 'VectorStore':
        """
        Build vector database from a list of texts efficiently.
        
        Args:
            list_of_text: List of text strings to add
            metadata_list: Optional list of metadata dicts
        
        Returns:
            self for method chaining
        """
        if not list_of_text:
            raise ValueError("Text list cannot be empty")
        
        if metadata_list is not None and len(metadata_list) != len(list_of_text):
            raise ValueError(
                f"Metadata length ({len(metadata_list)}) must match text list length ({len(list_of_text)})"
            )
        
        embeddings = await self.embedding_model.get_embeddings(list_of_text)
        
        for i, (text, embedding) in enumerate(zip(list_of_text, embeddings)):
            metadata = metadata_list[i] if metadata_list else None
            self.insert(text, np.array(embedding), metadata)
        
        return self
    
    async def add_documents(
        self, 
        documents: List[str], 
        metadata: Optional[List[Dict[str, Any]]] = None
    ) -> None:
        if not documents:
            raise ValueError("Documents list cannot be empty")
        
        if metadata is not None and len(metadata) != len(documents):
            raise ValueError(
                f"Metadata length ({len(metadata)}) must match documents length ({len(documents)})"
            )
        
        new_embeddings = await self.embedding_model.get_embeddings(documents)
        new_embeddings_array = np.array(new_embeddings)

        if self.embeddings is None:
            self.embeddings = new_embeddings_array
        else:
            self.embeddings = np.vstack([self.embeddings, new_embeddings_array])
        
        self.documents.extend(documents)
        
        if metadata is None:
            self.metadata.extend([{}] * len(documents))
        else:
            self.metadata.extend(metadata)
    
    async def search(
        self, 
        query: str, 
        top_k: int = 5,
        similarity_method: Literal["cosine", "euclidean"] = "cosine"
    ) -> List[Dict[str, Any]]:
        """
        Search for similar documents using the specified similarity measure.
        
        Args:
            query: Search query text
            top_k: Number of top results to return
            similarity_method: Either "cosine" or "euclidean"
                - cosine: Measures angle between vectors (range 0-1, higher is better)
                - euclidean: Measures distance between vectors (converted to similarity 0-1, higher is better)
        
        Returns:
            List of dictionaries with 'text', 'score', and 'metadata'
        """
        if not self.documents or self.embeddings is None:
            return []
        
        query_embedding = await self.embedding_model.get_embedding(query)
        query_vector = np.array(query_embedding)

        # Calculate similarities based on chosen method
        if similarity_method == "euclidean":
            # Euclidean similarity (higher is better, range 0-1)
            similarities = euclidean_similarity_batch(query_vector, self.embeddings)
        else:
            # Cosine similarity (higher is better, range 0-1)
            similarities = cosine_similarity_batch(query_vector, self.embeddings)

        top_k = min(top_k, len(self.documents))
        top_k_indices = np.argsort(similarities)[-top_k:][::-1]

        results = []
        for idx in top_k_indices:
            results.append({
                "text": self.documents[idx],
                "score": float(similarities[idx]),
                "metadata": {
                    **self.metadata[idx],
                    "similarity_method": similarity_method  # Include method in metadata
                }
            })
        
        return results
    
    def get_stats(self) -> Dict[str, Any]:
        if self.embeddings is None:
            return {
                "num_documents": 0,
                "embedding_dimension": None,
                "total_size_mb": 0
            }
        
        return {
            "num_documents": len(self.documents),
            "embedding_dimension": self.embeddings.shape[1],
            "total_size_mb": round(self.embeddings.nbytes / (1024 * 1024), 2)
        }

    def clear(self) -> None:
        self.documents = []
        self.embeddings = None
        self.metadata = []

