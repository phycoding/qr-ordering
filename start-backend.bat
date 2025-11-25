@echo off
REM SwiftServe AI Backend Startup Script for Windows

echo 🚀 Starting SwiftServe AI Backend...
echo 📍 Current directory: %CD%

REM Install dependencies if needed
echo 📋 Installing dependencies...
.venv\Scripts\python.exe -m pip install -r requirements.txt

REM Start the FastAPI server
echo 🌐 Starting FastAPI server on http://127.0.0.1:8000
.venv\Scripts\python.exe main.py

pause
