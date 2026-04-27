#!/bin/bash

# StoryVibe — AI Narrative Workbench
# Launch Script for macOS / Linux
#
# USAGE:
#   1. Open Terminal
#   2. cd to this folder
#   3. chmod +x start.sh   (first time only)
#   4. ./start.sh
#   5. Open browser: http://localhost:3000

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   StoryVibe — AI Narrative Workbench                         ║"
echo "║   Launch Script for macOS / Linux                            ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js is not installed."
    echo ""
    echo "Please install Node.js first:"
    echo "  macOS:   brew install node      (install Homebrew from https://brew.sh)"
    echo "  Linux:   sudo apt install nodejs npm"
    echo "  Or visit: https://nodejs.org and download LTS version"
    echo ""
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}[OK]${NC} Node.js found: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} npm not found. Please reinstall Node.js."
    exit 1
fi
echo -e "${GREEN}[OK]${NC} npm found"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo -e "${YELLOW}[INFO]${NC} First run detected. Installing dependencies..."
    echo "         This may take 2-5 minutes. Please wait..."
    echo ""
    npm install --legacy-peer-deps
    echo -e "${GREEN}[OK]${NC} Dependencies installed."
else
    echo -e "${GREEN}[OK]${NC} Dependencies already installed."
fi

# Build frontend if needed
if [ ! -d "dist" ]; then
    echo ""
    echo -e "${YELLOW}[INFO]${NC} Building frontend..."
    npm run build
    echo -e "${GREEN}[OK]${NC} Frontend built."
else
    echo -e "${GREEN}[OK]${NC} Frontend already built."
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Starting StoryVibe...                                       ║"
echo "║                                                              ║"
echo "║  Frontend: http://localhost:3000                             ║"
echo "║  Backend:  http://localhost:3001                             ║"
echo "║                                                              ║"
echo "║  Press Ctrl+C to stop both services                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "[INFO] Stopping StoryVibe..."
    kill $BACKEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup INT TERM

# Start backend
node server/index.js &
BACKEND_PID=$!

# Wait for backend
sleep 2

# Start frontend
npx serve dist -l 3000 --single
