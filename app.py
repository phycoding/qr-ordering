from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import random
import re
from typing import Dict, Any

app = FastAPI(
    title="SwiftServe AI Backend",
    description="Commission-free, AI-enhanced QR-based ordering platform backend",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class CustomizationRequest(BaseModel):
    custom_text: str

class CustomizationResponse(BaseModel):
    kitchen_instruction: str

class ServerSuggestionRequest(BaseModel):
    order_id: str

class ServerSuggestionResponse(BaseModel):
    suggestion: str

# Mock AI data and logic
SPICE_KEYWORDS = ['spicy', 'hot', 'mild', 'medium', 'extra hot', 'not spicy', 'less spicy']
INGREDIENT_KEYWORDS = ['paneer', 'cheese', 'onions', 'tomatoes', 'garlic', 'ginger', 'cilantro', 'mint']
COOKING_KEYWORDS = ['well done', 'medium', 'rare', 'crispy', 'soft', 'grilled', 'fried', 'steamed']
PORTION_KEYWORDS = ['extra', 'less', 'more', 'double', 'half', 'small', 'large']

SERVER_SUGGESTIONS = [
    "Suggest today's dessert special - popular with families",
    "Check if drinks are needed - been 10 minutes since last order",
    "Offer appetizer recommendations - kitchen has fresh ingredients",
    "Ask about spice preference - customer seems to enjoy milder flavors",
    "Suggest pairing beverages - perfect match for their main course",
    "Recommend sharing plates - great for groups",
    "Inquire about dietary restrictions - better safe than sorry",
    "Offer chef's special - limited time seasonal dish",
    "Check on meal satisfaction - ensure quality experience",
    "Suggest takeaway for remaining food - reduce waste"
]

TIME_BASED_SUGGESTIONS = {
    "lunch": ["Suggest quick lunch combos", "Offer healthy salad options", "Recommend light beverages"],
    "dinner": ["Suggest premium dishes", "Offer wine pairing", "Recommend dessert specials"],
    "late": ["Offer light snacks", "Suggest herbal teas", "Quick service items available"]
}

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "SwiftServe AI Backend is running",
        "version": "1.0.0",
        "status": "active",
        "features": ["AI Customization Processing", "Server Action Suggestions", "Real-time Order Management"]
    }

@app.get("/api/test")
async def test_connection():
    """Test endpoint to verify API connectivity"""
    return {"message": "FastAPI is running and connected."}

@app.post("/api/ai/customize", response_model=CustomizationResponse)
async def process_customization(request: CustomizationRequest):
    """
    AI-powered customization processing endpoint.
    Converts natural language customer requests into structured kitchen instructions.
    """
    try:
        custom_text = request.custom_text.lower().strip()
        
        if not custom_text:
            return CustomizationResponse(kitchen_instruction="KITCHEN: STANDARD PREPARATION")
        
        # Initialize instruction components
        instruction_parts = []
        
        # Process spice level
        spice_instruction = process_spice_level(custom_text)
        if spice_instruction:
            instruction_parts.append(spice_instruction)
        
        # Process ingredients (additions and removals)
        ingredient_instructions = process_ingredients(custom_text)
        instruction_parts.extend(ingredient_instructions)
        
        # Process cooking preferences
        cooking_instruction = process_cooking_preferences(custom_text)
        if cooking_instruction:
            instruction_parts.append(cooking_instruction)
        
        # Process portion adjustments
        portion_instruction = process_portion_adjustments(custom_text)
        if portion_instruction:
            instruction_parts.append(portion_instruction)
        
        # Compile final instruction
        if instruction_parts:
            kitchen_instruction = "KITCHEN: " + " | ".join(instruction_parts)
        else:
            kitchen_instruction = "KITCHEN: STANDARD PREPARATION - Special note: " + request.custom_text[:50]
        
        return CustomizationResponse(kitchen_instruction=kitchen_instruction)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing customization: {str(e)}")

@app.post("/api/ai/suggest_action", response_model=ServerSuggestionResponse)
async def suggest_server_action(request: ServerSuggestionRequest):
    """
    AI-powered server action suggestion endpoint.
    Generates contextual hospitality prompts based on order data and timing.
    """
    try:
        order_id = request.order_id
        
        # Simulate order analysis (in real implementation, this would fetch actual order data)
        order_analysis = analyze_mock_order(order_id)
        
        # Generate contextual suggestion based on order characteristics
        suggestion = generate_contextual_suggestion(order_analysis)
        
        return ServerSuggestionResponse(suggestion=suggestion)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating server suggestion: {str(e)}")

def process_spice_level(text: str) -> str:
    """Process spice-related instructions"""
    if any(keyword in text for keyword in ['not spicy', 'less spicy', 'mild']):
        return "SPICE: LOW"
    elif any(keyword in text for keyword in ['extra spicy', 'very hot', 'extra hot']):
        return "SPICE: EXTRA HIGH"
    elif any(keyword in text for keyword in ['spicy', 'hot']):
        return "SPICE: HIGH"
    elif 'medium' in text and 'spice' in text:
        return "SPICE: MEDIUM"
    return ""

def process_ingredients(text: str) -> list:
    """Process ingredient additions and removals"""
    instructions = []
    
    # Handle additions (extra ingredients)
    extra_pattern = r'extra\s+(\w+)'
    extra_matches = re.findall(extra_pattern, text)
    for ingredient in extra_matches:
        instructions.append(f"ADD: EXTRA {ingredient.upper()}")
    
    # Handle removals (no ingredients)
    no_pattern = r'no\s+(\w+)'
    no_matches = re.findall(no_pattern, text)
    for ingredient in no_matches:
        instructions.append(f"REMOVE: {ingredient.upper()}")
    
    # Handle more/less of specific ingredients
    more_pattern = r'more\s+(\w+)'
    more_matches = re.findall(more_pattern, text)
    for ingredient in more_matches:
        instructions.append(f"INCREASE: {ingredient.upper()}")
    
    less_pattern = r'less\s+(\w+)'
    less_matches = re.findall(less_pattern, text)
    for ingredient in less_matches:
        instructions.append(f"REDUCE: {ingredient.upper()}")
    
    return instructions

def process_cooking_preferences(text: str) -> str:
    """Process cooking method preferences"""
    if 'well done' in text:
        return "COOKING: WELL DONE"
    elif 'crispy' in text:
        return "COOKING: EXTRA CRISPY"
    elif 'soft' in text:
        return "COOKING: SOFT/TENDER"
    elif 'grilled' in text:
        return "METHOD: GRILLED"
    return ""

def process_portion_adjustments(text: str) -> str:
    """Process portion size adjustments"""
    if any(keyword in text for keyword in ['large portion', 'extra large', 'big']):
        return "PORTION: LARGE"
    elif any(keyword in text for keyword in ['small portion', 'less food', 'light']):
        return "PORTION: SMALL"
    elif 'double' in text:
        return "PORTION: DOUBLE"
    return ""

def analyze_mock_order(order_id: str) -> Dict[str, Any]:
    """Simulate order analysis for suggestion generation"""
    # Mock order characteristics based on order_id
    order_time = random.choice(['lunch', 'dinner', 'late'])
    order_size = random.choice(['small', 'medium', 'large'])
    customer_type = random.choice(['family', 'couple', 'individual', 'group'])
    order_value = random.choice(['low', 'medium', 'high'])
    
    return {
        'time_period': order_time,
        'size': order_size,
        'customer_type': customer_type,
        'value': order_value,
        'wait_time': random.randint(5, 25)  # minutes
    }

def generate_contextual_suggestion(order_analysis: Dict[str, Any]) -> str:
    """Generate contextual server suggestions based on order analysis"""
    suggestions = []
    
    # Time-based suggestions
    time_period = order_analysis.get('time_period', 'lunch')
    if time_period in TIME_BASED_SUGGESTIONS:
        suggestions.extend(TIME_BASED_SUGGESTIONS[time_period])
    
    # Wait time based suggestions
    wait_time = order_analysis.get('wait_time', 10)
    if wait_time > 15:
        suggestions.append("Apologize for wait time and offer complimentary appetizer")
        suggestions.append("Check if customer needs anything while waiting")
    elif wait_time < 5:
        suggestions.append("Compliment on quick service and ask for feedback")
    
    # Customer type based suggestions
    customer_type = order_analysis.get('customer_type', 'individual')
    if customer_type == 'family':
        suggestions.extend([
            "Offer kid-friendly options or modifications",
            "Suggest sharing platters for the table",
            "Ask if high chairs or special seating needed"
        ])
    elif customer_type == 'couple':
        suggestions.extend([
            "Suggest romantic ambiance adjustments",
            "Offer wine or beverage pairing",
            "Recommend dessert for sharing"
        ])
    elif customer_type == 'group':
        suggestions.extend([
            "Suggest group meal deals or combos",
            "Offer separate billing options",
            "Recommend popular sharing dishes"
        ])
    
    # Order value based suggestions
    order_value = order_analysis.get('order_value', 'medium')
    if order_value == 'high':
        suggestions.extend([
            "Thank for choosing premium options",
            "Offer chef's special recommendations",
            "Suggest wine pairing for premium dishes"
        ])
    elif order_value == 'low':
        suggestions.extend([
            "Suggest value meal additions",
            "Offer combo deals to enhance value",
            "Mention daily specials and promotions"
        ])
    
    # Add general hospitality suggestions
    suggestions.extend(SERVER_SUGGESTIONS)
    
    # Return a random suggestion from the contextual options
    return random.choice(suggestions)

@app.get("/api/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "SwiftServe AI Backend",
        "timestamp": "2024-10-24",
        "uptime": "operational"
    }

@app.get("/api/features")
async def get_features():
    """List available AI features"""
    return {
        "ai_features": [
            {
                "name": "Customization Processing",
                "endpoint": "/api/ai/customize",
                "description": "Converts natural language customer requests into structured kitchen instructions"
            },
            {
                "name": "Server Action Suggestions",
                "endpoint": "/api/ai/suggest_action", 
                "description": "Generates contextual hospitality prompts based on order data and timing"
            }
        ],
        "supported_languages": ["English"],
        "processing_capabilities": [
            "Spice level detection",
            "Ingredient modification",
            "Cooking preference analysis",
            "Portion size adjustment",
            "Context-aware server prompts"
        ]
    }

if __name__ == "__main__":
    print("🚀 Starting SwiftServe AI Backend Server...")
    print("📱 Frontend should connect to: http://127.0.0.1:8000")
    print("📖 API Documentation: http://127.0.0.1:8000/docs")
    print("🔧 Health Check: http://127.0.0.1:8000/api/health")
    
    uvicorn.run(
        "main:app", 
        host="127.0.0.1", 
        port=8000,
        reload=True,
        log_level="info"
    )
