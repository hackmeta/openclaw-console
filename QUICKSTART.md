# Quick Start Guide

## 1. 启动项目

```bash
cd /Users/apple/.openclaw/workspace/projects/openclaw-console
npm run dev
```

访问: http://localhost:3000 (或终端显示的端口)

## 2. 测试登录流程

### 方式 A: 使用 Mock 数据 (当前模式)

1. 打开浏览器访问 http://localhost:3000
2. 会自动重定向到 `/login`
3. 输入任意邮箱和密码 (8位以上)
4. 点击登录 - 会看到错误提示 (因为后端未连接)

### 方式 B: 连接真实 API

1. 确保后端运行在 `http://localhost:8081`
2. 编辑 `lib/auth-context.tsx`:
   - 取消注释真实 API 调用
   - 注释掉 mock 登录逻辑
3. 刷新页面重新测试

## 3. 浏览功能

### 注册页面
http://localhost:3000/register

### Dashboard (需要登录)
http://localhost:3000/dashboard

当前显示 mock 数据：
- 3 个示例实例
- 不同状态: running, stopped, error

### 创建新实例
http://localhost:3000/instances/new

可以选择:
- 模型: Claude, GPT, Gemini, Kimi
- 通道: Telegram
- 套餐: Free, Pro, Business

### 实例详情
http://localhost:3000/instances/1

查看：
- 实例配置
- 运行状态
- 操作按钮 (启动/停止/重启/删除)
- 最近日志

### 设置
http://localhost:3000/settings

- 查看账户信息
- 修改密码
- 管理 API Key

### 账单
http://localhost:3000/billing

Placeholder 页面，显示套餐和使用量

## 4. 切换到真实 API

### Step 1: 更新登录逻辑

编辑 `lib/auth-context.tsx`:

```typescript
// 注释掉这部分 (约 44-48 行)
// const response = await api.login(data);
// localStorage.setItem('token', response.token);
// setUser(response.user);
// router.push('/dashboard');

// 改为:
try {
  const response = await api.login(data);
  localStorage.setItem('token', response.token);
  setUser(response.user);
  router.push('/dashboard');
} catch (error) {
  throw error;
}
```

### Step 2: 更新 Dashboard 数据

编辑 `app/dashboard/page.tsx`:

```typescript
// 注释掉这部分 (约 16-20 行)
// setTimeout(() => {
//   setInstances(mockInstances);
//   setLoading(false);
// }, 500);

// 改为:
api.getInstances()
  .then(setInstances)
  .catch(console.error)
  .finally(() => setLoading(false));
```

### Step 3: 更新实例详情

编辑 `app/instances/[id]/page.tsx`:

类似方式替换 mock 数据调用为真实 API。

## 5. 目录结构速查

```
app/
  login/page.tsx          # 登录页
  register/page.tsx       # 注册页
  dashboard/page.tsx      # 实例列表
  instances/
    new/page.tsx          # 新建实例
    [id]/page.tsx         # 实例详情
  settings/page.tsx       # 设置
  billing/page.tsx        # 账单

components/
  sidebar.tsx             # 侧边栏
  status-badge.tsx        # 状态指示器
  dashboard-layout.tsx    # 布局组件

lib/
  api.ts                  # API 客户端
  auth-context.tsx        # 认证管理
  mock-data.ts            # 测试数据

types/
  index.ts                # TypeScript 类型
```

## 6. 常见问题

### 端口被占用
如果 3000 端口被占用，Next.js 会自动使用 3001。查看终端输出的实际端口。

### 登录失败
确认:
1. 后端 API 是否运行
2. `.env.local` 中的 API_URL 是否正确
3. 网络请求是否到达后端 (检查浏览器 Network 面板)

### 页面报错
1. 检查浏览器控制台
2. 检查终端 Next.js 输出
3. 确认所有依赖已安装 (`npm install`)

## 7. 开发技巧

### 热重载
修改代码后自动刷新，无需重启服务器

### TypeScript 检查
```bash
npm run build
```

### 清除缓存
```bash
rm -rf .next
npm run dev
```

## 需要帮助?

查看完整 README.md 了解更多信息。
