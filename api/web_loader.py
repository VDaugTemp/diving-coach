"""Web content loader for fetching and extracting articles from URLs."""

import requests
from typing import List, Dict, Any, Optional
from datetime import datetime


class TrafilaturaWebLoader:
    """Web loader using trafilatura for intelligent content extraction."""
    
    def __init__(self, timeout: int = 10, user_agent: Optional[str] = None):
        """
        Initialize web article loader.
        
        Args:
            timeout: Request timeout in seconds
            user_agent: Custom user agent string (optional)
        """
        self.timeout = timeout
        self.user_agent = user_agent or "Mozilla/5.0 (compatible; DivingCoachBot/1.0)"
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": self.user_agent})
        
        try:
            import trafilatura
            self.trafilatura = trafilatura
        except ImportError:
            raise ImportError(
                "trafilatura not installed. Install with: pip install trafilatura"
            )
    
    def fetch_url(self, url: str) -> str:
        """Fetch HTML content from a URL."""
        try:
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch {url}: {e}")
    
    def extract_content(self, html: str, url: str) -> Dict[str, Any]:
        """Extract content using trafilatura."""
        extracted = self.trafilatura.extract(
            html,
            include_comments=False,
            include_tables=False,
            no_fallback=False
        )
        
        if not extracted:
            raise Exception("Failed to extract content from HTML")
        
        # Extract metadata
        metadata_obj = self.trafilatura.extract_metadata(html)
        
        title = "Unknown Title"
        if metadata_obj:
            title = metadata_obj.title or title
        
        metadata = {
            "source_url": url,
            "title": title,
            "fetch_date": datetime.now().isoformat(),
            "source_type": "web_article"
        }
        
        if metadata_obj:
            metadata["author"] = metadata_obj.author
            metadata["site_name"] = metadata_obj.sitename
            metadata["publish_date"] = metadata_obj.date
        
        return {
            "title": title,
            "content": extracted,
            "metadata": metadata
        }
    
    def load_from_url(self, url: str) -> List[Dict[str, Any]]:
        """Load article from a single URL."""
        try:
            html = self.fetch_url(url)
            extracted = self.extract_content(html, url)
            
            return [{
                "text": f"# {extracted['title']}\n\n{extracted['content']}",
                "metadata": extracted['metadata']
            }]
        
        except Exception as e:
            print(f"❌ Error loading {url}: {e}")
            return []
    
    def load_from_urls(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Load articles from multiple URLs."""
        documents = []
        for url in urls:
            print(f"🌐 Fetching: {url}")
            docs = self.load_from_url(url)
            if docs:
                print(f"✅ Loaded: {docs[0]['metadata']['title'][:60]}...")
            documents.extend(docs)
        return documents


# Convenience function
def load_articles_from_urls(urls: List[str]) -> List[Dict[str, Any]]:
    """
    Load articles from URLs.
    
    Args:
        urls: List of URLs to load
    
    Returns:
        List of document dictionaries with 'text' and 'metadata'
    """
    loader = TrafilaturaWebLoader()
    return loader.load_from_urls(urls)

