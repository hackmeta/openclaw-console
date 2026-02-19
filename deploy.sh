#!/bin/bash
set -e

PROJECT_DIR="/opt/openclaw-console"
SERVICE_NAME="openclaw-console"

echo "📦 开始部署 OpenClaw Console..."

# 进入项目目录
cd "$PROJECT_DIR"

# 安装依赖
echo "⬇️  安装依赖..."
npm install

# 构建项目
echo "🔨 构建生产版本..."
npm run build

# 重启服务
echo "🔄 重启服务..."
sudo systemctl restart "$SERVICE_NAME"

# 检查服务状态
echo "✅ 部署完成！服务状态："
sudo systemctl status "$SERVICE_NAME" --no-pager
