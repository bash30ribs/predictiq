#!/usr/bin/env bash

# PredictIQ - 1-Click Local Launcher Script
set -e

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BLUE}${BOLD}====================================================${NC}"
echo -e "${CYAN}${BOLD}       PredictIQ Enterprise Churn Intelligence       ${NC}"
echo -e "${BLUE}${BOLD}====================================================${NC}"

# Resolve project directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Ensure local user bin is in PATH
export PATH="$HOME/.local/bin:$PATH"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Warning: node not found in standard PATH. Trying /home/ribs/.local/bin...${NC}"
    if [ -f "/home/ribs/.local/bin/node" ]; then
        export PATH="/home/ribs/.local/bin:$PATH"
    else
        echo "Error: Node.js is required to run PredictIQ."
        exit 1
    fi
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js detected:${NC} $NODE_VERSION"

# Check if port 3000 is already active
PORT_ACTIVE=false
if command -v ss &> /dev/null; then
    if ss -tuln | grep -q ":3000 "; then
        PORT_ACTIVE=true
    fi
elif command -v lsof &> /dev/null; then
    if lsof -i :3000 &> /dev/null; then
        PORT_ACTIVE=true
    fi
fi

if [ "$PORT_ACTIVE" = true ]; then
    echo -e "${GREEN}✓ PredictIQ server is already running on http://localhost:3000${NC}"
else
    echo -e "${CYAN}Starting PredictIQ Next.js dev server on http://localhost:3000...${NC}"
    cd "$FRONTEND_DIR"
    nohup npm run dev -- -p 3000 > "$SCRIPT_DIR/predictiq.log" 2>&1 &
    PID=$!
    echo -e "${GREEN}✓ Background server initiated (PID: $PID). Logs: predictiq.log${NC}"
    
    # Wait up to 10 seconds for server to respond
    echo -n "Waiting for server to become ready..."
    for i in {1..15}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e " ${GREEN}Ready!${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done
fi

echo ""
echo -e "${BLUE}${BOLD}----------------------------------------------------${NC}"
echo -e "${GREEN}${BOLD}PredictIQ is live and accessible at:${NC}"
echo -e "  ${BOLD}Landing Page:${NC}       http://localhost:3000"
echo -e "  ${BOLD}Create Account:${NC}     http://localhost:3000/register"
echo -e "  ${BOLD}Sign In:${NC}            http://localhost:3000/login"
echo -e "  ${BOLD}Executive Cockpit:${NC}  http://localhost:3000/dashboard"
echo -e "  ${BOLD}Customer Reviews:${NC}   http://localhost:3000/reviews"
echo -e "  ${BOLD}Simulator Sandbox:${NC}  http://localhost:3000/simulation"
echo -e "  ${BOLD}ROI Calculator:${NC}     http://localhost:3000/impact"
echo -e "${BLUE}${BOLD}----------------------------------------------------${NC}"
echo ""

# Attempt to automatically launch default browser
if command -v xdg-open &> /dev/null; then
    echo -e "${CYAN}Launching application in your browser...${NC}"
    xdg-open "http://localhost:3000" > /dev/null 2>&1 &
elif command -v sensible-browser &> /dev/null; then
    sensible-browser "http://localhost:3000" > /dev/null 2>&1 &
fi

echo -e "${GREEN}Done! You can minimize or close this terminal.${NC}"
