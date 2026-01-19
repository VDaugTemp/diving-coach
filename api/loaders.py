import os
from pypdf import PdfReader

class TextFileLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self):
        if os.path.isfile(self.file_path):
            if self.file_path.endswith('.txt'):
                return [self.load_txt(self.file_path)]
            elif self.file_path.endswith('.pdf'):
                return [self.load_pdf(self.file_path)]
            else:
                raise ValueError(f"File '{self.file_path}' is not a supported file type (.txt or .pdf)")
        elif os.path.isdir(self.file_path):
            return self.load_directory()
        else:
            raise ValueError(f"Path '{self.file_path}' does not exist or is not a valid file/directory")

    def load_txt(self, file_path: str):
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()

    def load_pdf(self, file_path: str):
        pages = []
        reader = PdfReader(file_path)
        for page in reader.pages:
            pages.append(page.extract_text())
        return '\n'.join(pages)

    def load_directory(self):
        documents = []
        all_files = os.listdir(self.file_path)
        
        # Filter for both .txt and .pdf files
        supported_files = [filename for filename in all_files 
                          if filename.endswith(('.txt', '.pdf'))]
        
        # Process each file based on its extension
        for filename in supported_files:
            full_path = os.path.join(self.file_path, filename)
            if filename.endswith('.txt'):
                content = self.load_txt(full_path)
            elif filename.endswith('.pdf'):
                content = self.load_pdf(full_path)
            documents.append(content)
        
        return documents

class CharacterTextSplitter: 
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
       
        if chunk_overlap >= chunk_size:
            raise ValueError(f"chunk_overlap ({chunk_overlap}) must be less than chunk_size ({chunk_size})")
        if chunk_size <= 0:
            raise ValueError(f"chunk_size must be greater than 0, got {chunk_size}")
        if chunk_overlap < 0:
            raise ValueError(f"chunk_overlap must be non-negative, got {chunk_overlap}")
        
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> list[str]:
        if not text:
            return []
        
        chunks = []
        step = self.chunk_size - self.chunk_overlap
        
        for i in range(0, len(text), step):
            chunk = text[i:i + self.chunk_size]
            if chunk: 
                chunks.append(chunk)
        
        return chunks

    def split_documents(self, documents: list[str]) -> list[str]:
        all_chunks = []
        for doc in documents:
            chunks = self.split_text(doc)
            all_chunks.extend(chunks)
        return all_chunks
