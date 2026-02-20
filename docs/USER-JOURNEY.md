# OpenClaw Console 用户旅程地图

## 设计原则
- **一键部署**：用户只需提供 Bot Token，其他全自动
- 所有可自动化的步骤都不让用户选择
- 高级选项折叠隐藏，想改再展开

## 阶段 1：注册 & 登录
1. 访问 Landing Page (iclaw.io) → 点 "Get Started"
2. `/register` 注册（邮箱+密码）
3. 邮箱验证（目前 dev mode，可跳过）
4. `/login` 登录 → 跳转 dashboard

## 阶段 2：一键部署（核心体验）
5. `/dashboard` — 空状态，醒目的 "Deploy Your Bot" 入口
6. 粘贴 Telegram Bot Token（唯一必填项）
7. 点 "Deploy" → 后端自动完成：
   - 自动生成实例名称（如 `my-bot-001`）
   - 默认频道 Telegram
   - 按套餐自动选模型（Free→GPT-4o-mini, Pro→Claude Sonnet）
   - 默认 SOUL.md 模板
   - LLM API Key 平台托管，用户无需配置
   - 创建 VM → 启动 OpenClaw
8. 30 秒内 bot 上线，页面实时显示部署进度

## 阶段 3：管理实例
9. `/dashboard` 查看实例列表（状态、模型、IP）
10. 点击实例 → `/instances/[id]` 详情页
11. 操作：启动/停止/重启/查看日志/删除
12. 日志查看器：筛选级别、搜索

## 阶段 4：付费升级
13. 侧边栏 → `/billing` 查看当前套餐（Free）
14. 看到限制（1 实例、仅 GPT-4o-mini）→ 升级 Pro/Business
15. Stripe 支付 → 解锁更多实例和模型

## 阶段 5：设置 & 文档
16. `/settings` — 账户信息、密码修改
17. `/docs` — 使用文档

---

## 自动化策略

| 字段 | 策略 | 用户操作 |
|---|---|---|
| 实例名称 | 自动生成 `my-bot-001` | 无需填写 |
| 频道 | 默认 Telegram | 无需选择 |
| 模型 | 按套餐自动选最优 | 无需选择 |
| Bot Token | **用户必须提供** | 粘贴 |
| System Prompt | 默认模板 | 无需填写 |
| LLM API Key | 平台托管 | 无需配置 |

**高级选项（折叠隐藏）**：自定义名称、选频道、选模型、编辑 SOUL.md

## 空状态设计
Dashboard 无实例时，不显示空表格，直接展示**全屏引导卡片**：
- 三步教程：打开 @BotFather → 创建 bot → 粘贴 Token
- 输入框 + Deploy 按钮直接在卡片内，零跳转
- 折叠的"Advanced options"（名称/频道/模型）
- 有实例后卡片消失，变成实例列表 + 右上角 `+ New Instance`

## Bot Token 引导
页面内嵌简短步骤提示：
1. 打开 Telegram 搜索 @BotFather
2. 发送 `/newbot`，取个名字
3. 复制 Token 粘贴到输入框

配折叠图文教程或 GIF，30 秒能看完。

## 部署进度体验
点 Deploy 后显示进度条，分步打勾：
1. ✅ 创建实例
2. ✅ 启动虚拟机
3. ⏳ 安装 OpenClaw...
4. ⬜ 连接 Telegram
5. ⬜ Bot 上线

最后一步变绿 + "🎉 Your bot is live!" + "去 Telegram 聊天"按钮。
预计 30-60 秒完成。

## 高级选项（折叠隐藏，均有默认值）
- 实例名称：自动生成 `my-bot-001`
- 频道：默认 Telegram
- 模型：按套餐自动选（Free→GPT-4o-mini, Pro→Claude Sonnet）

## 已知缺失/薄弱环节
- **实例配置编辑** — 创建后无法修改配置（如换模型）
- **用量/监控** — 没有 token 用量、费用统计面板
- **通知** — 实例异常时无通知机制
