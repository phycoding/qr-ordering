#!/bin/bash
# SwiftServe AI Backend Startup Script

echo "🚀 Starting SwiftServe AI Backend..."
echo "📍 Current directory: $(pwd)"

# Activate virtual environment if it exists
if [ -d ".venv" ]; then
    echo "📦 Activating virtual environment..."
    source .venv/Scripts/activate
fi

# Install dependencies if needed
echo "📋 Installing dependencies..."
pip install -r requirements.txt

# Start the FastAPI server
echo "🌐 Starting FastAPI server on http://127.0.0.1:8000"
python main.py
