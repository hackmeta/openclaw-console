# OpenClaw Console

OpenClaw Hosting 用户控制台 - 管理你的 OpenClaw AI Bot 实例

## 技术栈

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## 项目结构

```
openclaw-console/
├── app/                      # 页面路由
│   ├── login/               # 登录页
│   ├── register/            # 注册页
│   ├── dashboard/           # 实例列表
│   ├── instances/           
│   │   ├── new/            # 创建新实例
│   │   └── [id]/           # 实例详情
│   ├── settings/            # 账户设置
│   └── billing/             # 账单管理
├── components/              # React 组件
│   ├── sidebar.tsx         # 侧边栏导航
│   ├── status-badge.tsx    # 状态徽章
│   └── dashboard-layout.tsx # Dashboard 布局
├── lib/                     # 工具库
│   ├── api.ts              # API 客户端
│   ├── auth-context.tsx    # 认证上下文
│   └── mock-data.ts        # Mock 数据
└── types/                   # TypeScript 类型定义
    └── index.ts

```

## 功能

### 公开页面
- ✅ `/login` - 邮箱密码登录
- ✅ `/register` - 用户注册
- ✅ `/` - 自动重定向到 dashboard

### 登录后页面
- ✅ `/dashboard` - 实例列表，显示所有 OpenClaw 实例状态
- ✅ `/instances/new` - 创建新实例
  - 选择 AI 模型 (Claude/GPT/Gemini/Kimi)
  - 选择通道类型 (Telegram)
  - 配置 Bot Token
  - 选择套餐 (Free/Pro/Business)
- ✅ `/instances/[id]` - 实例详情
  - 查看状态、IP、创建时间
  - 启动/停止/重启实例
  - 查看最近日志
- ✅ `/settings` - 账户设置
  - 修改密码
  - API Key 管理
- ✅ `/billing` - 账单管理 (placeholder)

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 (或显示的其他端口)

### 构建生产版本

```bash
npm run build
npm start
```

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

## API 集成

当前使用 mock 数据进行开发。要接入真实 API：

1. 确保后端 API 运行在 `http://localhost:8081`
2. API 路径前缀为 `/api/v1/`
3. 在各页面中取消注释 API 调用代码
4. 注释掉 mock 数据调用

### API 端点

- `POST /api/v1/auth/login` - 登录
- `POST /api/v1/auth/register` - 注册
- `GET /api/v1/auth/profile` - 获取用户信息
- `GET /api/v1/instances` - 获取实例列表
- `GET /api/v1/instances/:id` - 获取实例详情
- `POST /api/v1/instances` - 创建实例
- `POST /api/v1/instances/:id/start` - 启动实例
- `POST /api/v1/instances/:id/stop` - 停止实例
- `POST /api/v1/instances/:id/restart` - 重启实例
- `DELETE /api/v1/instances/:id` - 删除实例
- `GET /api/v1/instances/:id/logs` - 获取实例日志

## 认证

- 登录后 JWT token 存储在 localStorage
- 使用 React Context 管理全局认证状态
- 未登录访问受保护页面自动重定向到 `/login`
- API 请求自动附加 `Authorization: Bearer <token>` header

## UI 设计

- 深色主题为主
- 简洁现代风格 (参考 Vercel Dashboard / Linear)
- 左侧导航栏固定
- 响应式布局支持移动端

## 下一步

- [ ] 接入真实后端 API
- [ ] 添加实时日志流
- [ ] 集成 Stripe 支付
- [ ] 添加更多实例监控指标
- [ ] 实现邮箱验证
- [ ] 添加双因素认证
- [ ] 支持团队协作功能

## License

MIT
