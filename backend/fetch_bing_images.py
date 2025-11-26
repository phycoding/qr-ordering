"""
Fetch real food images using Bing Image Search API
Requires Azure Cognitive Services API key
Set BING_SEARCH_API_KEY environment variable
"""
from sqlalchemy.orm import Session
from database import SessionLocal, MenuItem
import requests
import os
from dotenv import load_dotenv
import time

load_dotenv()

BING_SEARCH_API_KEY = os.getenv('BING_SEARCH_API_KEY', '')
BING_SEARCH_ENDPOINT = "https://api.bing.microsoft.com/v7.0/images/search"

def search_food_image(food_name):
    """Search for food image using Bing Image Search API"""
    if not BING_SEARCH_API_KEY:
        print(f"⚠️  No API key found for {food_name}, using fallback")
        # Fallback to Lorem Picsum
        import hashlib
        seed = int(hashlib.md5(food_name.encode()).hexdigest()[:8], 16) % 1000
        return f'https://picsum.photos/seed/{seed}/400/300'
    
    headers = {
        'Ocp-Apim-Subscription-Key': BING_SEARCH_API_KEY
    }
    
    params = {
        'q': f'{food_name} food dish',
        'count': 1,
        'imageType': 'photo',
        'aspect': 'wide',
        'size': 'medium',
        'safeSearch': 'strict'
    }
    
    try:
        response = requests.get(BING_SEARCH_ENDPOINT, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        
        search_results = response.json()
        
        if 'value' in search_results and len(search_results['value']) > 0:
            # Get the thumbnail URL (smaller, faster to load)
            image_url = search_results['value'][0].get('thumbnailUrl', '')
            if image_url:
                print(f"✓ Found image for {food_name}")
                return image_url
        
        print(f"⚠️  No image found for {food_name}, using fallback")
        # Fallback
        import hashlib
        seed = int(hashlib.md5(food_name.encode()).hexdigest()[:8], 16) % 1000
        return f'https://picsum.photos/seed/{seed}/400/300'
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching image for {food_name}: {e}")
        # Fallback
        import hashlib
        seed = int(hashlib.md5(food_name.encode()).hexdigest()[:8], 16) % 1000
        return f'https://picsum.photos/seed/{seed}/400/300'

def update_menu_images_with_bing(db: Session):
    """Update all menu items with Bing Image Search results"""
    items = db.query(MenuItem).all()
    updated_count = 0
    
    print(f"📸 Fetching images for {len(items)} menu items...")
    print("=" * 60)
    
    for i, item in enumerate(items, 1):
        print(f"[{i}/{len(items)}] {item.name}...", end=" ")
        
        image_url = search_food_image(item.name)
        item.image = image_url
        updated_count += 1
        
        # Rate limiting - Bing API allows 3 calls per second on free tier
        if BING_SEARCH_API_KEY and i % 3 == 0:
            time.sleep(1)
    
    db.commit()
    print("=" * 60)
    print(f"✅ Updated {updated_count} menu items with images!")

if __name__ == "__main__":
    print("🔍 Bing Image Search API Integration")
    print("=" * 60)
    
    if BING_SEARCH_API_KEY:
        print(f"✓ API Key found: {BING_SEARCH_API_KEY[:10]}...")
    else:
        print("⚠️  No BING_SEARCH_API_KEY found in environment")
        print("   Will use fallback Lorem Picsum images")
        print("   To use Bing API:")
        print("   1. Get API key from Azure Cognitive Services")
        print("   2. Add to .env file: BING_SEARCH_API_KEY=your_key_here")
    
    print("=" * 60)
    
    proceed = input("\nProceed with image update? (y/n): ")
    if proceed.lower() != 'y':
        print("Cancelled.")
        exit()
    
    db = SessionLocal()
    try:
        update_menu_images_with_bing(db)
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
