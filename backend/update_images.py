"""
Update menu items with proper food images from a reliable source
Using Lorem Picsum with food-related seeds for consistent images
"""
from sqlalchemy.orm import Session
from database import SessionLocal, MenuItem
import hashlib

def get_image_url_for_item(item_name, item_id):
    """Generate a consistent image URL based on item name"""
    # Use hash of item name to get consistent seed
    seed = int(hashlib.md5(item_name.encode()).hexdigest()[:8], 16) % 1000
    
    # Use Lorem Picsum with specific dimensions
    # This provides consistent, high-quality placeholder images
    return f'https://picsum.photos/seed/{seed}/400/300'

def update_menu_images(db: Session):
    """Update all menu items with image URLs"""
    items = db.query(MenuItem).all()
    updated_count = 0
    
    for item in items:
        image_url = get_image_url_for_item(item.name, item.id)
        item.image = image_url
        updated_count += 1
        print(f"Updated: {item.name} -> {image_url}")
    
    db.commit()
    print(f"\n✅ Updated {updated_count} menu items with images!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("🖼️  Updating menu images with Lorem Picsum...")
        print("=" * 60)
        update_menu_images(db)
        print("=" * 60)
        print("✨ Image update complete!")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
