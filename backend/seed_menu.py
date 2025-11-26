"""
Simplified seed script for Indian, Chinese & Continental menu (150 items)
Programmatically generates menu items for efficient database seeding
"""
from sqlalchemy.orm import Session
from database import SessionLocal, MenuItem
import json

def clear_existing_menu(db: Session):
    """Clear existing menu items"""
    db.query(MenuItem).delete()
    db.commit()
    print("✅ Cleared existing menu items")

def generate_menu_items():
    """Generate 150 menu items programmatically"""
    items = []
    item_id = 1
    
    # INDIAN APPETIZERS (15 items)
    indian_appetizers = [
        ('Paneer Tikka', 380, 'Cottage cheese marinated in spices, grilled in tandoor', 20, ['Vegetarian', 'Tandoor'], True),
        ('Chicken Tikka', 420, 'Boneless chicken marinated in yogurt and spices', 25, ['Non-Veg', 'Tandoor'], True),
        ('Tandoori Chicken (Half)', 480, 'Classic tandoori chicken with aromatic spices', 30, ['Non-Veg', 'Signature'], True),
        ('Seekh Kebab', 450, 'Minced lamb kebabs with herbs and spices', 25, ['Non-Veg', 'Tandoor'], False),
        ('Malai Tikka', 420, 'Creamy chicken tikka marinated in cream and cheese', 25, ['Non-Veg', 'Creamy'], True),
        ('Hara Bhara Kebab', 320, 'Spinach and green peas patties', 20, ['Vegetarian', 'Healthy'], False),
        ('Fish Tikka', 520, 'Boneless fish marinated in tandoori spices', 20, ['Seafood', 'Tandoor'], True),
        ('Tandoori Prawns', 680, 'Jumbo prawns in tandoori masala', 20, ['Seafood', 'Premium'], True),
        ('Dahi Kebab', 340, 'Hung curd kebabs with Indian spices', 20, ['Vegetarian', 'Unique'], False),
        ('Chicken 65', 380, 'Spicy deep-fried chicken with curry leaves', 20, ['Non-Veg', 'Spicy'], False),
        ('Samosa (2 pcs)', 120, 'Crispy pastry with spiced potatoes', 15, ['Vegetarian', 'Snack'], False),
        ('Papdi Chaat', 180, 'Crispy wafers with yogurt and chutneys', 10, ['Vegetarian', 'Street Food'], False),
        ('Aloo Tikki Chaat', 160, 'Potato patties with chickpeas', 15, ['Vegetarian', 'Street Food'], False),
        ('Mushroom Tikka', 360, 'Button mushrooms marinated and grilled', 20, ['Vegetarian', 'Tandoor'], False),
        ('Achari Paneer Tikka', 400, 'Cottage cheese with pickle spices', 20, ['Vegetarian', 'Tangy'], True),
    ]
    for name, price, desc, prep_time, tags, ai_rec in indian_appetizers:
        items.append({
            'id': f'ind_app{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Indian Appetizers', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # CHINESE APPETIZERS (15 items)
    chinese_appetizers = [
        ('Spring Rolls (Veg)', 280, 'Crispy rolls filled with vegetables', 15, ['Vegetarian', 'Fried'], False),
        ('Spring Rolls (Chicken)', 320, 'Crispy rolls filled with chicken', 15, ['Non-Veg', 'Fried'], False),
        ('Chicken Manchurian', 380, 'Fried chicken in spicy Manchurian sauce', 20, ['Non-Veg', 'Popular'], True),
        ('Veg Manchurian', 320, 'Mixed vegetable balls in Manchurian sauce', 20, ['Vegetarian', 'Spicy'], True),
        ('Chilli Chicken', 420, 'Spicy chicken with bell peppers', 20, ['Non-Veg', 'Popular'], True),
        ('Chilli Paneer', 360, 'Cottage cheese in spicy chilli sauce', 18, ['Vegetarian', 'Spicy'], True),
        ('Honey Chilli Potato', 280, 'Crispy potato in honey chilli glaze', 15, ['Vegetarian', 'Sweet-Spicy'], False),
        ('Chicken Lollipop', 420, 'Frenched chicken wings in spicy coating', 25, ['Non-Veg', 'Popular'], True),
        ('Crispy Corn', 260, 'Crispy fried corn kernels with spices', 15, ['Vegetarian', 'Fried'], False),
        ('Drums of Heaven', 450, 'Spicy chicken winglets', 25, ['Non-Veg', 'Spicy'], False),
        ('Prawn Tempura', 580, 'Crispy battered prawns', 18, ['Seafood', 'Fried'], True),
        ('Chicken Satay', 420, 'Grilled chicken skewers with peanut sauce', 20, ['Non-Veg', 'Grilled'], False),
        ('Salt & Pepper Squid', 520, 'Crispy calamari with salt and pepper', 18, ['Seafood', 'Fried'], True),
        ('Dim Sum Platter (Veg)', 480, 'Assorted steamed dumplings', 20, ['Vegetarian', 'Steamed'], True),
        ('Dim Sum Platter (Non-Veg)', 550, 'Assorted chicken and prawn dumplings', 20, ['Non-Veg', 'Steamed'], True),
    ]
    for name, price, desc, prep_time, tags, ai_rec in chinese_appetizers:
        items.append({
            'id': f'chi_app{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Chinese Appetizers', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # CONTINENTAL APPETIZERS (10 items)
    continental_appetizers = [
        ('Bruschetta', 320, 'Toasted bread with tomatoes, basil, olive oil', 12, ['Vegetarian', 'Italian'], False),
        ('Garlic Bread', 180, 'Toasted bread with garlic butter', 10, ['Vegetarian', 'Popular'], False),
        ('Cheese Garlic Bread', 240, 'Garlic bread topped with cheese', 12, ['Vegetarian', 'Popular'], True),
        ('Stuffed Mushrooms', 380, 'Mushrooms stuffed with cheese and herbs', 20, ['Vegetarian', 'Baked'], False),
        ('Chicken Wings', 420, 'BBQ or Buffalo style chicken wings', 25, ['Non-Veg', 'Fried'], True),
        ('Nachos Supreme', 380, 'Tortilla chips with cheese, salsa, jalapeños', 15, ['Vegetarian', 'Mexican'], False),
        ('Potato Wedges', 220, 'Crispy potato wedges with dips', 15, ['Vegetarian', 'Fried'], False),
        ('French Fries', 180, 'Classic crispy fries', 12, ['Vegetarian', 'Popular'], False),
        ('Onion Rings', 220, 'Crispy battered onion rings', 15, ['Vegetarian', 'Fried'], False),
        ('Chicken Nuggets', 320, 'Crispy chicken nuggets with dips', 15, ['Non-Veg', 'Fried'], False),
    ]
    for name, price, desc, prep_time, tags, ai_rec in continental_appetizers:
        items.append({
            'id': f'cont_app{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Continental Appetizers', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # SOUPS (10 items)
    soups = [
        ('Tomato Soup', 180, 'Classic tomato soup with herbs', 15, ['Vegetarian', 'Continental'], False),
        ('Sweet Corn Soup (Veg)', 160, 'Creamy corn soup with vegetables', 15, ['Vegetarian', 'Chinese'], True),
        ('Sweet Corn Soup (Chicken)', 200, 'Creamy corn soup with chicken', 15, ['Non-Veg', 'Chinese'], True),
        ('Hot & Sour Soup (Veg)', 180, 'Spicy and tangy Chinese soup', 15, ['Vegetarian', 'Spicy'], True),
        ('Hot & Sour Soup (Chicken)', 220, 'Spicy and tangy soup with chicken', 15, ['Non-Veg', 'Spicy'], True),
        ('Manchow Soup (Veg)', 180, 'Spicy soup with crispy noodles', 15, ['Vegetarian', 'Spicy'], False),
        ('Manchow Soup (Chicken)', 220, 'Spicy chicken soup with crispy noodles', 15, ['Non-Veg', 'Spicy'], False),
        ('Cream of Mushroom Soup', 220, 'Creamy mushroom soup', 18, ['Vegetarian', 'Continental'], False),
        ('Chicken Clear Soup', 200, 'Light chicken broth with vegetables', 15, ['Non-Veg', 'Healthy'], False),
        ('Minestrone Soup', 220, 'Italian vegetable soup', 18, ['Vegetarian', 'Continental'], False),
    ]
    for name, price, desc, prep_time, tags, ai_rec in soups:
        items.append({
            'id': f'soup{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Soups', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # INDIAN MAIN COURSE - VEG (15 items)
    indian_veg_mains = [
        ('Paneer Butter Masala', 380, 'Cottage cheese in rich tomato and butter gravy', 25, ['Vegetarian', 'Creamy'], True),
        ('Palak Paneer', 360, 'Cottage cheese in spinach gravy', 25, ['Vegetarian', 'Healthy'], True),
        ('Kadai Paneer', 380, 'Cottage cheese with bell peppers in spicy gravy', 25, ['Vegetarian', 'Spicy'], False),
        ('Shahi Paneer', 420, 'Cottage cheese in rich cashew and cream gravy', 25, ['Vegetarian', 'Royal'], True),
        ('Dal Makhani', 320, 'Black lentils cooked with butter and cream', 30, ['Vegetarian', 'Creamy'], True),
        ('Dal Tadka', 280, 'Yellow lentils tempered with spices', 25, ['Vegetarian', 'Healthy'], False),
        ('Malai Kofta', 380, 'Cottage cheese dumplings in creamy gravy', 30, ['Vegetarian', 'Creamy'], True),
        ('Veg Kolhapuri', 340, 'Mixed vegetables in spicy Kolhapuri gravy', 25, ['Vegetarian', 'Spicy'], False),
        ('Navratan Korma', 360, 'Nine vegetables in mild creamy gravy', 25, ['Vegetarian', 'Mild'], False),
        ('Aloo Gobi', 280, 'Potato and cauliflower with spices', 20, ['Vegetarian', 'Dry'], False),
        ('Bhindi Masala', 300, 'Okra cooked with onions and spices', 20, ['Vegetarian', 'Dry'], False),
        ('Baingan Bharta', 320, 'Roasted eggplant mash with spices', 25, ['Vegetarian', 'Smoky'], False),
        ('Mushroom Masala', 340, 'Button mushrooms in spicy gravy', 20, ['Vegetarian', 'Spicy'], False),
        ('Veg Jalfrezi', 320, 'Stir-fried vegetables in tangy gravy', 20, ['Vegetarian', 'Tangy'], False),
        ('Paneer Tikka Masala', 420, 'Grilled paneer in rich tomato gravy', 30, ['Vegetarian', 'Premium'], True),
    ]
    for name, price, desc, prep_time, tags, ai_rec in indian_veg_mains:
        items.append({
            'id': f'ind_veg{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Indian Main Course - Veg', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # INDIAN MAIN COURSE - NON-VEG (15 items)
    indian_nonveg_mains = [
        ('Butter Chicken', 480, 'Tandoori chicken in rich tomato and butter gravy', 30, ['Non-Veg', 'Signature'], True),
        ('Chicken Tikka Masala', 460, 'Grilled chicken in spiced tomato gravy', 30, ['Non-Veg', 'Popular'], True),
        ('Kadai Chicken', 450, 'Chicken with bell peppers in spicy gravy', 25, ['Non-Veg', 'Spicy'], False),
        ('Chicken Curry', 420, 'Traditional chicken curry with spices', 30, ['Non-Veg', 'Classic'], True),
        ('Chicken Korma', 460, 'Chicken in mild creamy gravy with nuts', 30, ['Non-Veg', 'Creamy'], False),
        ('Chicken Vindaloo', 450, 'Spicy Goan chicken curry with vinegar', 30, ['Non-Veg', 'Spicy'], False),
        ('Rogan Josh (Mutton)', 580, 'Kashmiri mutton curry with aromatic spices', 45, ['Non-Veg', 'Premium'], True),
        ('Mutton Curry', 550, 'Traditional mutton curry', 45, ['Non-Veg', 'Classic'], False),
        ('Fish Curry', 480, 'Fish in coconut-based curry', 25, ['Seafood', 'Coastal'], True),
        ('Prawn Curry', 620, 'Prawns in spicy coastal curry', 25, ['Seafood', 'Spicy'], True),
        ('Chicken Chettinad', 480, 'South Indian spicy chicken curry', 30, ['Non-Veg', 'Spicy'], False),
        ('Egg Curry', 280, 'Boiled eggs in spiced gravy', 20, ['Egg', 'Budget'], False),
        ('Chicken Saagwala', 450, 'Chicken in spinach gravy', 30, ['Non-Veg', 'Healthy'], False),
        ('Mutton Rara', 600, 'Mutton with minced meat in spicy gravy', 45, ['Non-Veg', 'Premium'], True),
        ('Chicken Bhuna', 460, 'Dry chicken curry with thick gravy', 30, ['Non-Veg', 'Dry'], False),
    ]
    for name, price, desc, prep_time, tags, ai_rec in indian_nonveg_mains:
        items.append({
            'id': f'ind_nv{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Indian Main Course - Non-Veg', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # CHINESE MAIN COURSE (15 items)
    chinese_mains = [
        ('Veg Fried Rice', 280, 'Stir-fried rice with vegetables', 15, ['Vegetarian', 'Rice'], False),
        ('Chicken Fried Rice', 320, 'Stir-fried rice with chicken', 18, ['Non-Veg', 'Popular'], True),
        ('Egg Fried Rice', 260, 'Stir-fried rice with scrambled eggs', 15, ['Egg', 'Rice'], False),
        ('Prawn Fried Rice', 420, 'Stir-fried rice with prawns', 18, ['Seafood', 'Rice'], True),
        ('Veg Hakka Noodles', 280, 'Stir-fried noodles with vegetables', 15, ['Vegetarian', 'Noodles'], False),
        ('Chicken Hakka Noodles', 320, 'Stir-fried noodles with chicken', 18, ['Non-Veg', 'Popular'], True),
        ('Schezwan Fried Rice (Veg)', 300, 'Spicy Schezwan rice with vegetables', 18, ['Vegetarian', 'Spicy'], True),
        ('Schezwan Fried Rice (Chicken)', 340, 'Spicy Schezwan rice with chicken', 18, ['Non-Veg', 'Spicy'], True),
        ('Schezwan Noodles (Veg)', 300, 'Spicy Schezwan noodles with vegetables', 18, ['Vegetarian', 'Spicy'], False),
        ('Schezwan Noodles (Chicken)', 340, 'Spicy Schezwan noodles with chicken', 18, ['Non-Veg', 'Spicy'], False),
        ('Singapore Noodles', 360, 'Curry-flavored rice noodles with chicken', 20, ['Non-Veg', 'Spicy'], True),
        ('American Chopsuey', 340, 'Crispy noodles with sweet and sour sauce', 25, ['Vegetarian', 'Sweet'], False),
        ('Chicken in Black Bean Sauce', 420, 'Chicken with bell peppers in black bean sauce', 20, ['Non-Veg', 'Savory'], True),
        ('Sweet & Sour Chicken', 400, 'Crispy chicken in sweet and sour sauce', 25, ['Non-Veg', 'Sweet'], False),
        ('Triple Schezwan Rice', 420, 'Schezwan rice with noodles and gravy', 25, ['Vegetarian', 'Combo'], True),
    ]
    for name, price, desc, prep_time, tags, ai_rec in chinese_mains:
        items.append({
            'id': f'chi_main{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Chinese Main Course', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # CONTINENTAL MAIN COURSE (15 items)
    continental_mains = [
        ('Margherita Pizza', 380, 'Classic pizza with tomato sauce, mozzarella, basil', 20, ['Vegetarian', 'Popular'], True),
        ('Pepperoni Pizza', 480, 'Pizza with pepperoni and cheese', 20, ['Non-Veg', 'Popular'], True),
        ('Chicken BBQ Pizza', 520, 'Pizza with BBQ chicken and onions', 22, ['Non-Veg', 'Italian'], True),
        ('Veggie Supreme Pizza', 420, 'Pizza loaded with assorted vegetables', 20, ['Vegetarian', 'Italian'], False),
        ('Pasta Alfredo', 380, 'Creamy white sauce pasta', 18, ['Vegetarian', 'Creamy'], True),
        ('Pasta Arrabiata', 360, 'Spicy tomato sauce pasta', 18, ['Vegetarian', 'Spicy'], False),
        ('Chicken Pasta', 420, 'Pasta with grilled chicken in choice of sauce', 20, ['Non-Veg', 'Italian'], True),
        ('Grilled Chicken Steak', 580, 'Grilled chicken breast with mashed potatoes', 30, ['Non-Veg', 'Premium'], True),
        ('Fish & Chips', 520, 'Battered fish with French fries', 25, ['Seafood', 'British'], False),
        ('Chicken Burger', 320, 'Grilled chicken burger with fries', 20, ['Non-Veg', 'American'], False),
        ('Veg Burger', 260, 'Vegetable patty burger with fries', 18, ['Vegetarian', 'American'], False),
        ('Club Sandwich', 380, 'Triple-decker sandwich with chicken, bacon', 15, ['Non-Veg', 'American'], False),
        ('Veg Sandwich', 240, 'Grilled vegetable sandwich', 12, ['Vegetarian', 'American'], False),
        ('Lasagna', 420, 'Layered pasta with meat sauce and cheese', 30, ['Non-Veg', 'Baked'], True),
        ('Risotto', 480, 'Creamy Italian rice with mushrooms', 25, ['Vegetarian', 'Creamy'], False),
    ]
    for name, price, desc, prep_time, tags, ai_rec in continental_mains:
        items.append({
            'id': f'cont_main{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Continental Main Course', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # INDIAN BREADS (10 items)
    breads = [
        ('Butter Naan', 60, 'Tandoor-baked flatbread with butter', 10, ['Vegetarian', 'Tandoor'], False),
        ('Garlic Naan', 80, 'Naan topped with garlic and cilantro', 10, ['Vegetarian', 'Tandoor'], True),
        ('Cheese Naan', 120, 'Naan stuffed with cheese', 12, ['Vegetarian', 'Tandoor'], True),
        ('Tandoori Roti', 40, 'Whole wheat flatbread from tandoor', 8, ['Vegetarian', 'Healthy'], False),
        ('Butter Roti', 50, 'Tandoori roti with butter', 8, ['Vegetarian', 'Tandoor'], False),
        ('Laccha Paratha', 70, 'Multi-layered flatbread', 12, ['Vegetarian', 'Tandoor'], False),
        ('Stuffed Kulcha', 90, 'Naan stuffed with spiced potatoes', 15, ['Vegetarian', 'Tandoor'], False),
        ('Missi Roti', 60, 'Gram flour flatbread with spices', 10, ['Vegetarian', 'Tandoor'], False),
        ('Roomali Roti', 50, 'Thin handkerchief-like bread', 10, ['Vegetarian', 'Tandoor'], False),
        ('Pudina Paratha', 70, 'Mint-flavored layered bread', 12, ['Vegetarian', 'Tandoor'], False),
    ]
    for name, price, desc, prep_time, tags, ai_rec in breads:
        items.append({
            'id': f'bread{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Indian Breads', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # RICE & BIRYANI (10 items)
    rice_biryani = [
        ('Veg Biryani', 320, 'Aromatic rice with mixed vegetables and spices', 35, ['Vegetarian', 'Rice'], True),
        ('Chicken Biryani', 420, 'Aromatic rice with chicken and spices', 40, ['Non-Veg', 'Signature'], True),
        ('Mutton Biryani', 520, 'Aromatic rice with mutton and spices', 45, ['Non-Veg', 'Premium'], True),
        ('Egg Biryani', 280, 'Aromatic rice with boiled eggs', 30, ['Egg', 'Rice'], False),
        ('Prawn Biryani', 580, 'Aromatic rice with prawns and spices', 40, ['Seafood', 'Premium'], True),
        ('Jeera Rice', 180, 'Basmati rice tempered with cumin', 15, ['Vegetarian', 'Rice'], False),
        ('Steamed Rice', 120, 'Plain steamed basmati rice', 15, ['Vegetarian', 'Rice'], False),
        ('Veg Pulao', 240, 'Mildly spiced rice with vegetables', 20, ['Vegetarian', 'Rice'], False),
        ('Kashmiri Pulao', 280, 'Sweet rice with dry fruits and saffron', 25, ['Vegetarian', 'Sweet'], False),
        ('Curd Rice', 160, 'Rice mixed with yogurt and tempering', 15, ['Vegetarian', 'South Indian'], False),
    ]
    for name, price, desc, prep_time, tags, ai_rec in rice_biryani:
        items.append({
            'id': f'rice{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Rice & Biryani', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # DESSERTS (15 items)
    desserts = [
        ('Gulab Jamun (2 pcs)', 120, 'Sweet milk dumplings in rose syrup', 10, ['Vegetarian', 'Indian'], True),
        ('Rasgulla (2 pcs)', 100, 'Spongy cottage cheese balls in sugar syrup', 10, ['Vegetarian', 'Indian'], False),
        ('Rasmalai (2 pcs)', 140, 'Cottage cheese discs in sweetened milk', 10, ['Vegetarian', 'Indian'], True),
        ('Gajar Halwa', 150, 'Carrot pudding with nuts', 15, ['Vegetarian', 'Indian'], False),
        ('Moong Dal Halwa', 180, 'Lentil pudding with ghee and nuts', 20, ['Vegetarian', 'Indian'], False),
        ('Kulfi', 120, 'Traditional Indian ice cream', 5, ['Vegetarian', 'Indian'], True),
        ('Brownie with Ice Cream', 180, 'Warm chocolate brownie with vanilla ice cream', 15, ['Vegetarian', 'Continental'], True),
        ('Chocolate Lava Cake', 220, 'Warm chocolate cake with molten center', 18, ['Vegetarian', 'Continental'], True),
        ('Tiramisu', 240, 'Italian coffee-flavored dessert', 10, ['Vegetarian', 'Italian'], True),
        ('Cheesecake', 220, 'New York-style cheesecake', 10, ['Vegetarian', 'American'], False),
        ('Ice Cream (2 scoops)', 120, 'Choice of vanilla, chocolate, or strawberry', 5, ['Vegetarian', 'Continental'], False),
        ('Fruit Custard', 140, 'Mixed fruits in vanilla custard', 15, ['Vegetarian', 'Indian'], False),
        ('Chocolate Mousse', 180, 'Light and airy chocolate dessert', 10, ['Vegetarian', 'Continental'], False),
        ('Apple Pie with Ice Cream', 200, 'Warm apple pie with vanilla ice cream', 15, ['Vegetarian', 'American'], False),
        ('Panna Cotta', 180, 'Italian cream dessert with berry sauce', 10, ['Vegetarian', 'Italian'], False),
    ]
    for name, price, desc, prep_time, tags, ai_rec in desserts:
        items.append({
            'id': f'dessert{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Desserts', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    item_id = 1
    # BEVERAGES (15 items)
    beverages = [
        ('Masala Chai', 60, 'Indian spiced tea', 8, ['Vegetarian', 'Hot'], True),
        ('Coffee', 80, 'Freshly brewed coffee', 5, ['Vegetarian', 'Hot'], False),
        ('Cappuccino', 120, 'Espresso with steamed milk and foam', 8, ['Vegetarian', 'Hot'], True),
        ('Latte', 140, 'Espresso with steamed milk', 8, ['Vegetarian', 'Hot'], False),
        ('Fresh Lime Soda', 80, 'Fresh lime with soda', 5, ['Vegetarian', 'Cold'], True),
        ('Fresh Lime Water', 60, 'Fresh lime with water', 5, ['Vegetarian', 'Cold'], False),
        ('Mango Lassi', 120, 'Sweet mango yogurt drink', 8, ['Vegetarian', 'Cold'], True),
        ('Sweet Lassi', 80, 'Sweet yogurt drink', 5, ['Vegetarian', 'Cold'], False),
        ('Salted Lassi', 80, 'Salted yogurt drink', 5, ['Vegetarian', 'Cold'], False),
        ('Fresh Fruit Juice', 120, 'Choice of orange, apple, or pineapple', 8, ['Vegetarian', 'Cold'], True),
        ('Watermelon Juice', 100, 'Fresh watermelon juice', 8, ['Vegetarian', 'Cold'], False),
        ('Virgin Mojito', 140, 'Mint, lime, and soda', 10, ['Vegetarian', 'Cold'], True),
        ('Iced Tea', 100, 'Chilled tea with lemon', 5, ['Vegetarian', 'Cold'], False),
        ('Cold Coffee', 140, 'Chilled coffee with ice cream', 10, ['Vegetarian', 'Cold'], True),
        ('Soft Drinks', 60, 'Choice of Coke, Pepsi, Sprite, Fanta', 2, ['Vegetarian', 'Cold'], False),
    ]
    for name, price, desc, prep_time, tags, ai_rec in beverages:
        items.append({
            'id': f'bev{item_id:03d}', 'name': name, 'price': price, 'description': desc,
            'category': 'Beverages', 'preparation_time': prep_time,
            'tags': tags, 'ai_recommended': ai_rec
        })
        item_id += 1
    
    return items

def seed_menu(db: Session):
    """Seed database with generated menu items"""
    menu_items = generate_menu_items()
    
    for item_data in menu_items:
        item = MenuItem(
            id=item_data['id'],
            name=item_data['name'],
            description=item_data['description'],
            price=item_data['price'],
            category=item_data['category'],
            available=True,
            preparation_time=item_data['preparation_time'],
            tags=json.dumps(item_data['tags']),
            ai_recommended=item_data['ai_recommended']
        )
        db.add(item)
    
    db.commit()
    print(f"✅ Successfully added {len(menu_items)} menu items!")
    
    # Print category summary
    categories = {}
    for item in menu_items:
        cat = item['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n📊 Menu Summary:")
    for cat, count in sorted(categories.items()):
        print(f"   {cat}: {count} items")
    print(f"\n🎯 Total Items: {len(menu_items)}")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        print("🍽️  Seeding Indian, Chinese & Continental Menu...")
        print("=" * 60)
        clear_existing_menu(db)
        seed_menu(db)
        print("=" * 60)
        print("✨ Menu seeding complete!")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
