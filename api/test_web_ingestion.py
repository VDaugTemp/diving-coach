"""
Demo: Test web article fetching functionality.

NOTE: This is a test/demo file only!
Production code automatically loads web articles in ingest.py from config/web_sources.json

Run: python test_web_ingestion.py
"""

import asyncio
from web_loader import load_articles_from_urls


def test_web_fetch():
    """Demonstrate fetching web articles."""
    
    print("=" * 80)
    print("WEB ARTICLE FETCHING DEMO")
    print("=" * 80)
    print("\n📝 NOTE: Production ingestion happens automatically in ingest.py")
    print("   Web articles are loaded from config/web_sources.json")
    print("   This demo just shows how the web_loader module works.\n")
    
    # Test URLs
    urls = [
        "https://www.divessi.com/en/blog/starting-freediving-myths-2478",
    ]
    
    print("🌐 Fetching articles...")
    print("-" * 80)
    
    try:
        # Load articles
        web_docs = load_articles_from_urls(urls)
        
        if not web_docs:
            print("❌ No articles loaded!")
            return
        
        print(f"\n✅ Successfully loaded {len(web_docs)} article(s)\n")
        
        # Display what we got
        for i, doc in enumerate(web_docs, 1):
            print(f"{'=' * 80}")
            print(f"ARTICLE #{i}")
            print(f"{'=' * 80}")
            
            metadata = doc['metadata']
            print(f"\n📄 Title: {metadata.get('title', 'Unknown')}")
            print(f"🔗 URL: {metadata.get('source_url', 'Unknown')}")
            print(f"🏢 Site: {metadata.get('site_name', 'Unknown')}")
            print(f"✍️  Author: {metadata.get('author', 'Unknown')}")
            print(f"📅 Published: {metadata.get('publish_date', 'Unknown')}")
            print(f"📏 Length: {len(doc['text']):,} characters")
            
            print(f"\n📝 Content Preview (first 500 chars):")
            print("-" * 80)
            print(doc['text'][:500])
            print("...")
            print("-" * 80)
        
        print(f"\n{'=' * 80}")
        print("✅ DEMO COMPLETE!")
        print(f"{'=' * 80}")
        print("\n💡 To add more articles:")
        print("   1. Edit config/web_sources.json")
        print("   2. Add URLs to the 'urls' array")
        print("   3. Restart the app (python app.py)")
        print("\n")
    
    except ImportError as e:
        print(f"\n❌ Error: {e}")
        print("\n💡 Install required dependencies:")
        print("   pip install beautifulsoup4 trafilatura")
    
    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    test_web_fetch()
