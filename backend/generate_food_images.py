"""
Generate AI food images using Pollinations.ai (Free Image Generator)
Updates menu items with dynamic AI-generated image URLs
"""
from sqlalchemy.orm import Session
from database import SessionLocal, MenuItem
import urllib.parse

def get_ai_image_url(food_name, category):
    """Generate AI image URL using Pollinations.ai"""
    # Create a descriptive prompt for better results
    prompt = f"delicious {food_name} {category} professional food photography 4k highly detailed appetizing"
    
    # URL encode the prompt
    encoded_prompt = urllib.parse.quote(prompt)
    
    # Pollinations.ai URL (Free, no API key required)
    return f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=400&height=300&nologo=true"

def update_menu_with_ai_images(db: Session):
    """Update all menu items with AI-generated image URLs"""
    items = db.query(MenuItem).all()
    updated_count = 0
    
    print(f"🎨 Generating AI images for {len(items)} menu items...")
    print("=" * 60)
    
    for item in items:
        image_url = get_ai_image_url(item.name, item.category)
        item.image = image_url
        updated_count += 1
        # Print first few to show progress
        if updated_count <= 5:
            print(f"Generated for {item.name}: {image_url[:50]}...")
            
    db.commit()
    print("=" * 60)
    print(f"✅ Updated {updated_count} menu items with AI-generated images!")
    print("Note: Images are generated on-the-fly when loaded in the browser.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("🤖 Starting AI Image Generation (Pollinations.ai)...")
        update_menu_with_ai_images(db)
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
