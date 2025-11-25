// Mock menu data
export const mockMenuData = [
    {
        id: 'item1',
        name: 'Butter Chicken',
        price: 320,
        category: 'Main Course',
        description: 'Rich and creamy tomato-based curry with tender chicken pieces',
        image: '/images/butter-chicken.jpg',
        aiRecommended: true,
        available: true,
        preparationTime: 20,
        tags: ['Popular', 'Spicy'],
        nutritionInfo: {
            calories: 450,
            protein: 35,
            carbs: 15,
            fat: 28
        }
    },
    {
        id: 'item2',
        name: 'Paneer Tikka',
        price: 280,
        category: 'Appetizers',
        description: 'Grilled cottage cheese marinated in aromatic spices',
        image: '/images/paneer-tikka.jpg',
        aiRecommended: false,
        available: true,
        preparationTime: 15,
        tags: ['Vegetarian', 'Grilled'],
        nutritionInfo: {
            calories: 320,
            protein: 18,
            carbs: 12,
            fat: 22
        }
    },
    {
        id: 'item3',
        name: 'Chicken Biryani',
        price: 350,
        category: 'Main Course',
        description: 'Aromatic basmati rice layered with spiced chicken',
        image: '/images/biryani.jpg',
        aiRecommended: true,
        available: true,
        preparationTime: 30,
        tags: ['Popular', 'Rice Dish'],
        nutritionInfo: {
            calories: 550,
            protein: 40,
            carbs: 65,
            fat: 18
        }
    },
    {
        id: 'item4',
        name: 'Gulab Jamun',
        price: 120,
        category: 'Desserts',
        description: 'Sweet milk dumplings soaked in rose-flavored syrup',
        image: '/images/gulab-jamun.jpg',
        aiRecommended: false,
        available: true,
        preparationTime: 5,
        tags: ['Sweet', 'Traditional'],
        nutritionInfo: {
            calories: 280,
            protein: 5,
            carbs: 45,
            fat: 10
        }
    },
    {
        id: 'item5',
        name: 'Masala Chai',
        price: 60,
        category: 'Beverages',
        description: 'Traditional Indian spiced tea with aromatic herbs',
        image: '/images/masala-chai.jpg',
        aiRecommended: true,
        available: true,
        preparationTime: 5,
        tags: ['Hot', 'Refreshing'],
        nutritionInfo: {
            calories: 80,
            protein: 2,
            carbs: 15,
            fat: 2
        }
    },
    {
        id: 'item6',
        name: 'Dal Makhani',
        price: 240,
        category: 'Main Course',
        description: 'Creamy black lentils slow-cooked with butter and cream',
        image: '/images/dal-makhani.jpg',
        aiRecommended: false,
        available: true,
        preparationTime: 25,
        tags: ['Vegetarian', 'Creamy'],
        nutritionInfo: {
            calories: 380,
            protein: 15,
            carbs: 35,
            fat: 20
        }
    },
    {
        id: 'item7',
        name: 'Garlic Naan',
        price: 80,
        category: 'Breads',
        description: 'Soft leavened bread topped with garlic and butter',
        image: '/images/garlic-naan.jpg',
        aiRecommended: false,
        available: true,
        preparationTime: 10,
        tags: ['Bread', 'Side'],
        nutritionInfo: {
            calories: 260,
            protein: 7,
            carbs: 45,
            fat: 6
        }
    },
    {
        id: 'item8',
        name: 'Mango Lassi',
        price: 100,
        category: 'Beverages',
        description: 'Refreshing yogurt-based drink with sweet mango pulp',
        image: '/images/mango-lassi.jpg',
        aiRecommended: true,
        available: true,
        preparationTime: 5,
        tags: ['Cold', 'Sweet', 'Refreshing'],
        nutritionInfo: {
            calories: 180,
            protein: 6,
            carbs: 32,
            fat: 4
        }
    }
];

// App constants
export const ORDER_STATUS = {
    NEW: 'new',
    PREPARING: 'preparing',
    READY: 'ready',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.NEW]: 'New Order',
    [ORDER_STATUS.PREPARING]: 'Preparing',
    [ORDER_STATUS.READY]: 'Ready',
    [ORDER_STATUS.COMPLETED]: 'Completed',
    [ORDER_STATUS.CANCELLED]: 'Cancelled'
};

export const CATEGORIES = [
    'All Items',
    'Main Course',
    'Appetizers',
    'Breads',
    'Beverages',
    'Desserts'
];

export const PAYMENT_METHODS = {
    UPI: 'upi',
    CARD: 'card',
    CASH: 'cash'
};

export const TABLE_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);
