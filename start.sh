#!/bin/bash

# ==========================================
# BirdNET 一键启动脚本 (Antigravity DX)
# ==========================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # 无颜色

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 信号捕获：退出时杀死所有后台子进程，释放端口
cleanup() {
    echo -e "\n${YELLOW}[INFO] 正在优雅关闭所有服务...${NC}"
    # 杀死直接记录的 PID
    if [ ! -z "$API_PID" ]; then kill $API_PID 2>/dev/null; fi
    if [ ! -z "$APP_PID" ]; then kill $APP_PID 2>/dev/null; fi
    # 补刀：杀死所有后台 job 防止漏网之鸟(Orphan Processes)
    kill $(jobs -p) 2>/dev/null
    echo -e "${GREEN}[OK] 服务已安全退出，端口已释放。${NC}"
    exit 0
}
# 捕获 Ctrl+C (SIGINT), 杀死容器等
trap cleanup SIGINT SIGTERM EXIT

clear
echo -e "${BLUE}"
echo "    _    _   _ _____ ___ ____ ____      _ __     _____ ________   __"
echo "   / \  | \ | |_   _|_ _/ ___|  _ \    / \\ \   / /_ _|_   _\ \ / /"
echo "  / _ \ |  \| | | |  | | |  _| |_) |  / _ \\ \ / / | |  | |  \ V / "
echo " / ___ \| |\  | | |  | | |_| |  _ <  / ___ \\ V /  | |  | |   | |  "
echo "/_/   \_\_| \_| |_| |___\____|_| \_\/_/   \_\_/  |___| |_|   |_|  "
echo -e "${NC}"
echo -e "=== ${BLUE}BirdNET 全栈服务管理器 (Antigravity)${NC} ===\n"

# 1. 后端启动流程
echo -e "${BLUE}[1/2] 正在准备后端 (BirdNET API)...${NC}"
cd "$ROOT_DIR/birdnet-api"

# 自动激活虚拟环境
if [ -d "venv" ]; then
    echo -e "${GREEN}-> 发现本地虚拟环境 venv${NC}"
    source venv/bin/activate
elif [ -d "../.venv" ]; then
    echo -e "${GREEN}-> 发现项目根目录虚拟环境 .venv${NC}"
    source ../.venv/bin/activate
else
    echo -e "${YELLOW}-> 未发现虚拟环境，将使用系统 Python 运行${NC}"
fi

echo -e "${GREEN}-> 启动后端 API (端口 8000)...${NC}"
uvicorn main:app --reload --port 8000 &
API_PID=$!

sleep 1 # 给后端一点时间打印首轮日志

# 2. 前端启动流程
echo -e "\n${BLUE}[2/2] 正在准备前端 (BirdNET App)...${NC}"
cd "$ROOT_DIR/birdnet-app"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}-> node_modules 不存在，正在安装依赖 (npm install)...${NC}"
    npm install
fi

echo -e "${GREEN}-> 启动前端 App (端口 5173)...${NC}"
npm run dev &
APP_PID=$!

echo -e "\n${GREEN}==========================================${NC}"
echo -e "🎉  ${GREEN}前后端服务已成功并发启动！${NC}"
echo -e "🌐  ${BLUE}后端 API:${NC}  http://localhost:8000"
echo -e "🌐  ${BLUE}前端 App:${NC}  http://localhost:5173 (通常)"
echo -e "📝  ${YELLOW}前方排队打印日志中...${NC}"
echo -e "🛑  ${RED}随时按 Ctrl+C 优雅停止所有关联服务${NC}"
echo -e "==========================================\n"

# 保持前台挂起，允许日志交替打印在屏幕上
wait
