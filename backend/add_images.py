"""
Add food images to menu items using Unsplash API
This script updates all menu items with appropriate food images
"""
from sqlalchemy.orm import Session
from database import SessionLocal, MenuItem
import json

# Mapping of menu item names to Unsplash image search terms
IMAGE_MAPPINGS = {
    # Indian Appetizers
    'Paneer Tikka': 'paneer-tikka',
    'Chicken Tikka': 'chicken-tikka',
    'Tandoori Chicken': 'tandoori-chicken',
    'Seekh Kebab': 'seekh-kebab',
    'Malai Tikka': 'malai-tikka',
    'Hara Bhara Kebab': 'hara-bhara-kebab',
    'Fish Tikka': 'fish-tikka',
    'Tandoori Prawns': 'tandoori-prawns',
    'Dahi Kebab': 'dahi-kebab',
    'Chicken 65': 'chicken-65',
    'Samosa': 'samosa',
    'Papdi Chaat': 'papdi-chaat',
    'Aloo Tikki': 'aloo-tikki-chaat',
    'Mushroom Tikka': 'mushroom-tikka',
    'Achari Paneer': 'achari-paneer-tikka',
    
    # Chinese Appetizers
    'Spring Rolls': 'spring-rolls',
    'Chicken Manchurian': 'chicken-manchurian',
    'Veg Manchurian': 'veg-manchurian',
    'Chilli Chicken': 'chilli-chicken',
    'Chilli Paneer': 'chilli-paneer',
    'Honey Chilli Potato': 'honey-chilli-potato',
    'Chicken Lollipop': 'chicken-lollipop',
    'Crispy Corn': 'crispy-corn',
    'Drums of Heaven': 'drums-of-heaven',
    'Prawn Tempura': 'prawn-tempura',
    'Chicken Satay': 'chicken-satay',
    'Salt & Pepper Squid': 'salt-pepper-squid',
    'Dim Sum': 'dim-sum',
    
    # Continental
    'Bruschetta': 'bruschetta',
    'Garlic Bread': 'garlic-bread',
    'Stuffed Mushrooms': 'stuffed-mushrooms',
    'Chicken Wings': 'chicken-wings',
    'Nachos': 'nachos',
    'Potato Wedges': 'potato-wedges',
    'French Fries': 'french-fries',
    'Onion Rings': 'onion-rings',
    'Chicken Nuggets': 'chicken-nuggets',
    
    # Soups
    'Tomato Soup': 'tomato-soup',
    'Sweet Corn Soup': 'sweet-corn-soup',
    'Hot & Sour Soup': 'hot-sour-soup',
    'Manchow Soup': 'manchow-soup',
    'Cream of Mushroom': 'mushroom-soup',
    'Chicken Clear Soup': 'chicken-soup',
    'Minestrone': 'minestrone-soup',
    
    # Indian Mains
    'Paneer Butter Masala': 'paneer-butter-masala',
    'Palak Paneer': 'palak-paneer',
    'Kadai Paneer': 'kadai-paneer',
    'Shahi Paneer': 'shahi-paneer',
    'Dal Makhani': 'dal-makhani',
    'Dal Tadka': 'dal-tadka',
    'Malai Kofta': 'malai-kofta',
    'Veg Kolhapuri': 'veg-kolhapuri',
    'Navratan Korma': 'navratan-korma',
    'Aloo Gobi': 'aloo-gobi',
    'Bhindi Masala': 'bhindi-masala',
    'Baingan Bharta': 'baingan-bharta',
    'Mushroom Masala': 'mushroom-masala',
    'Veg Jalfrezi': 'veg-jalfrezi',
    'Paneer Tikka Masala': 'paneer-tikka-masala',
    'Butter Chicken': 'butter-chicken',
    'Chicken Tikka Masala': 'chicken-tikka-masala',
    'Kadai Chicken': 'kadai-chicken',
    'Chicken Curry': 'chicken-curry',
    'Chicken Korma': 'chicken-korma',
    'Chicken Vindaloo': 'chicken-vindaloo',
    'Rogan Josh': 'rogan-josh',
    'Mutton Curry': 'mutton-curry',
    'Fish Curry': 'fish-curry',
    'Prawn Curry': 'prawn-curry',
    'Chicken Chettinad': 'chicken-chettinad',
    'Egg Curry': 'egg-curry',
    'Chicken Saagwala': 'chicken-saag',
    'Mutton Rara': 'mutton-rara',
    'Chicken Bhuna': 'chicken-bhuna',
    
    # Chinese Mains
    'Fried Rice': 'fried-rice',
    'Hakka Noodles': 'hakka-noodles',
    'Schezwan': 'schezwan',
    'Singapore Noodles': 'singapore-noodles',
    'American Chopsuey': 'american-chopsuey',
    'Black Bean': 'black-bean-sauce',
    'Sweet & Sour': 'sweet-sour-chicken',
    'Triple Schezwan': 'triple-schezwan',
    
    # Continental Mains
    'Margherita Pizza': 'margherita-pizza',
    'Pepperoni Pizza': 'pepperoni-pizza',
    'BBQ Pizza': 'bbq-chicken-pizza',
    'Veggie Supreme': 'veggie-pizza',
    'Pasta Alfredo': 'pasta-alfredo',
    'Pasta Arrabiata': 'pasta-arrabiata',
    'Chicken Pasta': 'chicken-pasta',
    'Grilled Chicken Steak': 'grilled-chicken-steak',
    'Fish & Chips': 'fish-and-chips',
    'Chicken Burger': 'chicken-burger',
    'Veg Burger': 'veggie-burger',
    'Club Sandwich': 'club-sandwich',
    'Veg Sandwich': 'vegetable-sandwich',
    'Lasagna': 'lasagna',
    'Risotto': 'mushroom-risotto',
    
    # Breads
    'Naan': 'naan-bread',
    'Roti': 'roti',
    'Paratha': 'paratha',
    'Kulcha': 'kulcha',
    
    # Rice & Biryani
    'Biryani': 'biryani',
    'Jeera Rice': 'jeera-rice',
    'Steamed Rice': 'steamed-rice',
    'Pulao': 'pulao',
    'Curd Rice': 'curd-rice',
    
    # Desserts
    'Gulab Jamun': 'gulab-jamun',
    'Rasgulla': 'rasgulla',
    'Rasmalai': 'rasmalai',
    'Gajar Halwa': 'gajar-halwa',
    'Moong Dal Halwa': 'moong-dal-halwa',
    'Kulfi': 'kulfi',
    'Brownie': 'chocolate-brownie',
    'Lava Cake': 'chocolate-lava-cake',
    'Tiramisu': 'tiramisu',
    'Cheesecake': 'cheesecake',
    'Ice Cream': 'ice-cream',
    'Fruit Custard': 'fruit-custard',
    'Chocolate Mousse': 'chocolate-mousse',
    'Apple Pie': 'apple-pie',
    'Panna Cotta': 'panna-cotta',
    
    # Beverages
    'Chai': 'masala-chai',
    'Coffee': 'coffee',
    'Cappuccino': 'cappuccino',
    'Latte': 'latte',
    'Lime Soda': 'lime-soda',
    'Lassi': 'lassi',
    'Fruit Juice': 'fruit-juice',
    'Mojito': 'mojito',
    'Iced Tea': 'iced-tea',
    'Cold Coffee': 'cold-coffee',
}

def get_image_url(item_name):
    """Generate Unsplash image URL for menu item"""
    # Find matching search term
    search_term = None
    for key, value in IMAGE_MAPPINGS.items():
        if key.lower() in item_name.lower():
            search_term = value
            break
    
    # Default to generic food image if no match
    if not search_term:
        # Extract category-based search
        if 'pizza' in item_name.lower():
            search_term = 'pizza'
        elif 'pasta' in item_name.lower():
            search_term = 'pasta'
        elif 'burger' in item_name.lower():
            search_term = 'burger'
        elif 'sandwich' in item_name.lower():
            search_term = 'sandwich'
        elif 'soup' in item_name.lower():
            search_term = 'soup'
        elif 'rice' in item_name.lower():
            search_term = 'rice-dish'
        elif 'noodles' in item_name.lower():
            search_term = 'noodles'
        else:
            search_term = 'indian-food'
    
    # Use Unsplash Source API for food images
    return f'https://source.unsplash.com/400x300/?{search_term},food'

def add_images_to_menu(db: Session):
    """Add image URLs to all menu items"""
    items = db.query(MenuItem).all()
    updated_count = 0
    
    for item in items:
        image_url = get_image_url(item.name)
        item.image = image_url
        updated_count += 1
    
    db.commit()
    print(f"✅ Updated {updated_count} menu items with images!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("🖼️  Adding images to menu items...")
        print("=" * 60)
        add_images_to_menu(db)
        print("=" * 60)
        print("✨ Image update complete!")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
