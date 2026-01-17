#!/bin/bash

# Start development servers for Portfolio website
# Usage: ./start-dev.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo " Portfolio Development Server Launcher"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Python is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed or not in PATH"
    echo "Please install Node.js and try again"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}Servers stopped.${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT TERM

echo -e "${GREEN}[1/4]${NC} Setting up backend environment..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv 2>/dev/null || python -m venv venv
fi

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
fi

# Install dependencies
echo "Installing/updating backend dependencies..."
pip install -q -r requirements.txt || {
    echo -e "${RED}[ERROR]${NC} Failed to install backend dependencies"
    cd ..
    exit 1
}
cd ..

echo -e "${GREEN}[2/4]${NC} Setting up frontend environment..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (this may take a while)..."
    npm install || {
        echo -e "${RED}[ERROR]${NC} Failed to install frontend dependencies"
        cd ..
        exit 1
    }
else
    echo "Frontend dependencies already installed"
fi
cd ..

echo -e "${GREEN}[3/4]${NC} Starting Flask backend server..."
cd backend
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
fi
python run.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

echo -e "${GREEN}[4/4]${NC} Starting React frontend server..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo -e " ${GREEN}Servers Started Successfully!${NC}"
echo "========================================"
echo ""
echo "  Backend:  http://localhost:5000 (PID: $BACKEND_PID)"
echo "  Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "  Logs are being written to:"
echo "    - backend.log"
echo "    - frontend.log"
echo ""
echo -e "  Press ${YELLOW}Ctrl+C${NC} to stop both servers"
echo ""

# Wait for user interrupt
wait
