@echo off
echo Starting SwiftServe AI Backend Server...
echo.
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
