# Error Handling & Toast System

## 已添加的错误处理功能

### 1. Error Boundaries (错误边界)

#### `app/error.tsx` - 全局错误边界
- 捕获页面级别的 React 错误
- 深色主题 + 紫色调设计
- 开发环境显示错误详情，生产环境隐藏
- 提供"重试"和"返回控制台"按钮

#### `app/global-error.tsx` - Root Layout 错误边界
- 捕获根布局级别的错误
- 包含完整的 html/body 标签
- 纯内联 CSS，不依赖 Tailwind（以防样式加载失败）

#### `app/not-found.tsx` - 404 页面
- 自定义 404 错误页面
- 显示大号 404 文字
- 提供"返回首页"和"返回控制台"链接

#### `app/loading.tsx` - 全局加载状态
- 路由切换时的加载指示器
- 紫色旋转 spinner

### 2. Toast 通知系统

#### `lib/toast.ts` - Toast 管理器
简单的发布订阅模式，无需第三方库。

**使用方法：**
```typescript
import { toast } from '@/lib/toast';

// 成功消息
toast.success('操作成功！');

// 错误消息
toast.error('操作失败，请重试');

// 信息提示
toast.info('这是一条提示信息');
```

#### `components/toast.tsx` - Toast 组件
- 右上角固定定位
- 支持 success/error/info 三种类型
- 自动 3 秒消失
- 支持手动关闭
- 深色主题，带图标

#### `app/layout.tsx` - 已集成 ToastProvider
ToastProvider 已添加到根布局中，全局可用。

## 使用示例

### 在 API 调用中使用 Toast

```typescript
'use client';

import { useState } from 'react';
import { toast } from '@/lib/toast';

export default function MyComponent() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/something', {
        method: 'POST',
        body: JSON.stringify({ data: 'example' }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      toast.success('保存成功！');
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? '保存中...' : '保存'}
    </button>
  );
}
```

### 错误边界自动生效

错误边界会自动捕获组件树中的错误：

```typescript
// 如果这个组件抛出错误，会被 error.tsx 捕获
export default function ProblematicComponent() {
  const data = null;
  return <div>{data.property}</div>; // 会抛出错误
}
```

## 文件清单

```
app/
├── error.tsx              ← 全局错误边界
├── global-error.tsx       ← Root layout 错误边界
├── not-found.tsx          ← 404 页面
├── loading.tsx            ← 全局加载状态
└── layout.tsx             ← 已集成 ToastProvider

components/
└── toast.tsx              ← Toast 通知组件

lib/
└── toast.ts               ← Toast 管理器（API）
```

## 测试

### 测试错误边界
访问任意不存在的路由查看 404 页面。

### 测试 Toast
在任意客户端组件中：
```typescript
import { toast } from '@/lib/toast';

// 在事件处理函数中调用
toast.success('测试成功提示！');
toast.error('测试错误提示！');
toast.info('测试信息提示！');
```
