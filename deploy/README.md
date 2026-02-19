# OpenClaw Console 部署指南

## 首次部署

### 1. 安装服务文件

```bash
sudo cp deploy/openclaw-console.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable openclaw-console
```

### 2. 部署代码

```bash
# 确保项目在 /opt/openclaw-console
sudo mkdir -p /opt/openclaw-console
sudo cp -r . /opt/openclaw-console/

# 执行部署脚本
cd /opt/openclaw-console
chmod +x deploy.sh
./deploy.sh
```

### 3. 验证服务

```bash
sudo systemctl status openclaw-console
curl http://localhost:3200
```

## 日常更新

更新代码后，只需：

```bash
cd /opt/openclaw-console
./deploy.sh
```

## 查看日志

```bash
sudo journalctl -u openclaw-console -f
```

## 注意事项

- 服务运行在端口 **3200**
- Node.js 路径: `/usr/local/bin/node` (如需修改请编辑 service 文件)
- standalone 构建输出在 `.next/standalone/` 目录
