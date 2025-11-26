"""
Generate AI food images using Pollinations.ai (Improved Version)
Updates menu items with sanitized, reliable AI image URLs
"""
from sqlalchemy.orm import Session
from database import SessionLocal, MenuItem
import urllib.parse
import re
import random

def sanitize_for_prompt(text):
    """Clean text for better prompt generation"""
    # Remove special characters but keep spaces
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def get_ai_image_url(food_name, category):
    """Generate AI image URL using Pollinations.ai with improved prompting"""
    clean_name = sanitize_for_prompt(food_name)
    clean_category = sanitize_for_prompt(category)
    
    # Create a descriptive prompt
    # Adding 'food photography', '4k', 'highly detailed' to ensure quality
    prompt = f"professional food photography of {clean_name} {clean_category} dish delicious appetizing 4k highly detailed studio lighting"
    
    # URL encode the prompt
    encoded_prompt = urllib.parse.quote(prompt)
    
    # Add a random seed to ensure uniqueness and bypass cache
    seed = random.randint(1, 10000)
    
    # Pollinations.ai URL
    # Using specific dimensions for the poster layout
    return f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&nologo=true&seed={seed}&model=flux"

def update_menu_with_ai_images(db: Session):
    """Update all menu items with improved AI-generated image URLs"""
    items = db.query(MenuItem).all()
    updated_count = 0
    
    print(f"🎨 Generating improved AI images for {len(items)} menu items...")
    print("=" * 60)
    
    for item in items:
        image_url = get_ai_image_url(item.name, item.category)
        item.image = image_url
        updated_count += 1
        
        if updated_count % 10 == 0:
            print(f"Progress: {updated_count}/{len(items)} items updated")
            
    db.commit()
    print("=" * 60)
    print(f"✅ Successfully updated {updated_count} menu items with high-quality AI images!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("🤖 Starting Improved AI Image Generation...")
        update_menu_with_ai_images(db)
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
