import os
import asyncio
from typing import Optional
from openai import AsyncOpenAI

class EmbeddingModel: 
    def __init__(self, model: str = "text-embedding-3-small", api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY must be provided as parameter or set as environment variable")
        
        self.model = model
        
        self.client = AsyncOpenAI(api_key=self.api_key)

    async def get_embedding(self, text: str) -> list[float]:
        if not text or not text.strip():
            raise ValueError("Text is required and cannot be empty")
        
        response = await self.client.embeddings.create(
            model=self.model,
            input=text
        )
        
        return response.data[0].embedding

    async def get_embeddings(self, texts: list[str], batch_size: int = 100) -> list[list[float]]:
        if not texts:
            raise ValueError("Texts list cannot be empty")
        
        valid_texts = [text for text in texts if text and text.strip()]
        if not valid_texts:
            raise ValueError("All texts are empty")
        
        if len(valid_texts) <= batch_size:
            response = await self.client.embeddings.create(
                model=self.model,
                input=valid_texts
            )
            return [item.embedding for item in response.data]
        
        all_embeddings = []
        
        batches = [valid_texts[i:i + batch_size] for i in range(0, len(valid_texts), batch_size)]
        
        async def process_batch(batch: list[str]) -> list[list[float]]:
            response = await self.client.embeddings.create(
                model=self.model,
                input=batch
            )
            return [item.embedding for item in response.data]
        
        batch_results = await asyncio.gather(*[process_batch(batch) for batch in batches])
        
        for batch_embeddings in batch_results:
            all_embeddings.extend(batch_embeddings)
        
        return all_embeddings

