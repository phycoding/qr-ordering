import apiService from './api';

// AI service for processing customizations and generating suggestions
class AIService {
    // Process customer customization text into kitchen instructions
    async processCustomization(customText) {
        try {
            const response = await apiService.post('/api/ai/customize', {
                custom_text: customText
            });
            return response.kitchen_instruction;
        } catch (error) {
            console.log('API not available, using local AI processing');
            return this.localProcessCustomization(customText);
        }
    }

    // Local fallback for customization processing
    localProcessCustomization(customText) {
        let instruction = "KITCHEN: ";
        const text = customText.toLowerCase();

        // Spice level detection
        if (text.includes('spicy') || text.includes('hot')) {
            if (text.includes('not') || text.includes('less') || text.includes('mild')) {
                instruction += "SPICE LEVEL: LOW. ";
            } else if (text.includes('extra') || text.includes('very') || text.includes('more')) {
                instruction += "SPICE LEVEL: HIGH. ";
            } else {
                instruction += "SPICE LEVEL: MEDIUM. ";
            }
        }

        // Add-ons detection
        if (text.includes('extra')) {
            const extraMatch = text.match(/extra\s+(\w+)/i);
            if (extraMatch) {
                instruction += `ADD-ON: ${extraMatch[1].toUpperCase()} (Extra). `;
            }
        }

        // Removals detection
        if (text.includes('no ') || text.includes('without')) {
            const noMatch = text.match(/(?:no|without)\s+(\w+)/i);
            if (noMatch) {
                instruction += `REMOVE: ${noMatch[1].toUpperCase()}. `;
            }
        }

        // Cooking preferences
        if (text.includes('well done') || text.includes('crispy')) {
            instruction += "COOKING: WELL DONE. ";
        } else if (text.includes('soft') || text.includes('tender')) {
            instruction += "COOKING: SOFT. ";
        }

        // Portion size
        if (text.includes('large') || text.includes('big')) {
            instruction += "PORTION: LARGE. ";
        } else if (text.includes('small') || text.includes('light')) {
            instruction += "PORTION: SMALL. ";
        }

        return instruction || "KITCHEN: STANDARD PREPARATION";
    }

    // Generate server action suggestions
    async generateServerSuggestion(orderId, orderData) {
        try {
            const response = await apiService.post('/api/ai/suggest_action', {
                order_id: orderId,
                order_data: orderData
            });
            return response.suggestion;
        } catch (error) {
            console.log('API not available, using local suggestions');
            return this.localGenerateSuggestion(orderData);
        }
    }

    // Local fallback for server suggestions
    localGenerateSuggestion(orderData) {
        const suggestions = [
            "Suggest today's dessert special - popular with families",
            "Check if drinks are needed - been 10 minutes since last order",
            "Offer appetizer recommendations based on main course",
            "Ask about spice preference for next items",
            "Suggest pairing beverages with the meal",
            "Recommend chef's special for the day",
            "Check if additional condiments are needed",
            "Offer complimentary water refill"
        ];

        // Simple logic based on order data
        if (orderData?.items) {
            const hasMainCourse = orderData.items.some(item =>
                item.category === 'Main Course'
            );
            const hasDessert = orderData.items.some(item =>
                item.category === 'Desserts'
            );
            const hasBeverage = orderData.items.some(item =>
                item.category === 'Beverages'
            );

            if (hasMainCourse && !hasDessert) {
                return "Suggest today's dessert special to complement the main course";
            }
            if (hasMainCourse && !hasBeverage) {
                return "Recommend a beverage pairing for the meal";
            }
        }

        return suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    // Get AI recommendations for menu items
    async getRecommendations(userPreferences = {}) {
        try {
            const response = await apiService.post('/api/ai/recommendations', {
                preferences: userPreferences
            });
            return response.recommendations;
        } catch (error) {
            console.log('API not available, using local recommendations');
            return this.localGetRecommendations();
        }
    }

    // Local fallback for recommendations
    localGetRecommendations() {
        // Return item IDs that should be recommended
        return ['item1', 'item3', 'item5'];
    }

    // Get menu recommendations based on menu items
    async getMenuRecommendations(menuItems) {
        try {
            const response = await apiService.post('/api/ai/menu-recommendations', {
                menu_items: menuItems
            });
            return response.recommendations;
        } catch (error) {
            console.log('API not available, using local menu recommendations');
            return this.localGetMenuRecommendations(menuItems);
        }
    }

    // Local fallback for menu recommendations
    localGetMenuRecommendations(menuItems) {
        // Return items marked as AI recommended or random selection
        const recommended = menuItems.filter(item => item.aiRecommended);
        if (recommended.length > 0) {
            return recommended.map(item => item.id);
        }
        // If no items marked, return first 3 items
        return menuItems.slice(0, 3).map(item => item.id);
    }
}

export default new AIService();

