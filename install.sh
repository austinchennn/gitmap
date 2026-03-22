#!/bin/bash

# GitMap Installation Script
# This script installs all necessary dependencies for both the backend and frontend.

set -e  # Exit immediately if a command exits with a non-zero status.

echo "🚀 Starting GitMap Installation..."

# --- Backend Setup ---
echo "\n📦 Setting up Backend (Python/FastAPI)..."
cd backend

# check if python3 exists
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.10+."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "GITHUB_TOKEN=" > .env
    echo "REDIS_URL=redis://localhost:6379" >> .env
    echo "📝 Created .env file in backend/ directory. Please add your GITHUB_TOKEN."
fi

cd ..

# --- Frontend Setup ---
echo "\n🎨 Setting up Frontend (Next.js/React)..."
cd frontend

# check if node exists
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18+ recommended)."
    exit 1
fi

# Install dependencies (prefer yarn if installed, else npm)
if command -v yarn &> /dev/null; then
    echo "Installing frontend dependencies with Yarn..."
    yarn install
else
    echo "Installing frontend dependencies with npm..."
    npm install
fi

cd ..

echo "\n✨ Installation Complete!"
echo "👉 To start the application, run: ./start.sh"
chmod +x start.sh
