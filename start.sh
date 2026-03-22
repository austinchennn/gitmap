#!/bin/bash

# GitMap Startup Script
# This script starts the backend (FastAPI) and frontend (Next.js) servers.

set -e

# Function to kill background processes on exit
cleanup() {
    echo "\n🛑 Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    wait
}
trap cleanup SIGINT SIGTERM

echo "🚀 Starting GitMap..."

# Check requirements
if ! command -v redis-server &> /dev/null && ! pgrep redis-server > /dev/null; then
    echo "⚠️  Warning: Redis does not seem to be running or installed."
    echo "   Ensure Redis is running locally on port 6379."
fi

# --- Start Backend ---
echo "Starting Backend Server..."
cd backend
source venv/bin/activate
# Run directly with uvicorn
python3 -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# --- Start Frontend ---
echo "Starting Frontend Server..."
cd frontend
if command -v yarn &> /dev/null; then
    yarn dev &
else
    npm run dev &
fi
FRONTEND_PID=$!
cd ..

echo "\n✅ GitMap is running!"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:8000"
echo "   (Press Ctrl+C to stop)"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID