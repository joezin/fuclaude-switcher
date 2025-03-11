# FuClaude 切换器

一个现代化的网页应用程序，用于无缝管理 Claude 访问，专为想要在多个设备上轻松访问 Claude 的用户设计。

## 功能特点

- 多平台支持（手机、桌面、平板）
- 无需 VPN 即可一键访问 Claude
- 自动生成带隔离的 FuClaude 访问链接
- 便捷的会话密钥管理和有效性跟踪
- 简单的链接分享功能
- 社交登录支持（GitHub、Google、邮箱）
- 清爽直观的用户界面

## 技术栈

- **前端**: Next.js
- **数据库**: Neon (PostgreSQL)
- **身份认证**: Clerk
- **部署**: Vercel

## 为什么选择 FuClaude 切换器？

FuClaude 切换器旨在解决 Claude 用户面临的常见挑战：

- 跨平台访问需求
- 移动设备上的 VPN 依赖
- 复杂的管理系统
- 对轻量级解决方案的需求

我们的解决方案提供了一个简化的、用户友好的界面，让您可以即时访问 Claude - 只需点击即可使用，用完即走。

## 设置

### 前置要求

- Node.js 18+ 和 npm
- Neon 数据库账号
- Clerk 账号用于身份认证
- Vercel 账号用于部署

### 安装

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/fuclaude-switcher.git
   cd fuclaude-switcher
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 设置环境变量：
   ```env
   
# Neon
NEON_DATABASE_URL=postgresql://fuclaude-switcher_owner:npg_hpl93kibZKey@ep-rapid-morning-a1a4uex1-pooler.ap-southeast-1.aws.neon.tech/fuclaude-switcher?sslmode=require

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bG92ZWQta2FuZ2Fyb28tNTQuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_iSetRT70WyTRJ3ATxWqvlUWNbEH6UugJs0BDHsTZ8n
   ```

### 开发

运行开发服务器：

```bash
npm run dev
```

### 生产环境部署

该应用程序配置为在 Vercel 上部署。只需将您的仓库连接到 Vercel，它就会自动处理部署过程。

## 数据库架构

```sql
-- 如果表存在则删除
DROP TABLE IF EXISTS accounts;

-- 创建账户表
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  session_key TEXT NOT NULL,
  prefix_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 
```

## API 路由

- `GET /api/accounts` - 获取用户账户
- `POST /api/accounts` - 创建新账户
- `PATCH /api/accounts/:id` - 更新账户状态
- `DELETE /api/accounts/:id` - 删除账户
- `POST /api/share` - 生成可分享链接
- `GET /api/validate/:token` - 验证分享链接

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

MIT
