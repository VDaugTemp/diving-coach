"""Similarity measures for vector search."""

import numpy as np


def cosine_similarity(vector_a: np.ndarray, vector_b: np.ndarray) -> float:
    """
    Computes the cosine similarity between two vectors.
    
    Measures the angle between vectors (0 to 1).
    1.0 = identical direction, 0.0 = orthogonal
    
    Good for: Text embeddings (ignores magnitude, focuses on direction)
    """
    dot_product = np.dot(vector_a, vector_b)
    norm_a = np.linalg.norm(vector_a)
    norm_b = np.linalg.norm(vector_b)
    return dot_product / (norm_a * norm_b)


def euclidean_distance(vector_a: np.ndarray, vector_b: np.ndarray) -> float:
    """
    Computes the Euclidean (L2) distance between two vectors.
    
    Measures straight-line distance in n-dimensional space.
    0.0 = identical, larger = more different
    
    Good for: When magnitude matters (e.g., image features, general clustering)
    """
    return np.linalg.norm(vector_a - vector_b)


def euclidean_similarity(vector_a: np.ndarray, vector_b: np.ndarray) -> float:
    """
    Converts Euclidean distance to a similarity score (0 to 1).
    
    1.0 = identical, 0.0 = very different
    """
    distance = euclidean_distance(vector_a, vector_b)
    return 1 / (1 + distance)


def cosine_similarity_batch(query_vector: np.ndarray, vectors: np.ndarray) -> np.ndarray:
    """
    Compute cosine similarity between a query vector and multiple vectors.
    
    Args:
        query_vector: Single vector (1D array)
        vectors: Multiple vectors (2D array, one vector per row)
    
    Returns:
        Array of similarity scores (0 to 1)
    """
    query_norm = np.linalg.norm(query_vector)
    query_normalized = query_vector / query_norm
    
    vector_norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    vectors_normalized = vectors / vector_norms
    
    similarities = np.dot(vectors_normalized, query_normalized)
    
    return similarities


def euclidean_distance_batch(query_vector: np.ndarray, vectors: np.ndarray) -> np.ndarray:
    """
    Compute Euclidean distance between a query vector and multiple vectors.
    
    Args:
        query_vector: Single vector (1D array)
        vectors: Multiple vectors (2D array, one vector per row)
    
    Returns:
        Array of distances (smaller = more similar)
    """
    differences = vectors - query_vector
    distances = np.linalg.norm(differences, axis=1)
    return distances


def euclidean_similarity_batch(query_vector: np.ndarray, vectors: np.ndarray) -> np.ndarray:
    """
    Compute Euclidean similarity (converted from distance) for multiple vectors.
    
    Args:
        query_vector: Single vector (1D array)
        vectors: Multiple vectors (2D array, one vector per row)
    
    Returns:
        Array of similarity scores (0 to 1, higher = more similar)
    """
    distances = euclidean_distance_batch(query_vector, vectors)
    similarities = 1 / (1 + distances)
    return similarities
