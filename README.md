# 智能体工程手册 · 学习平台

一个自部署的智能体学习平台，包含用户注册登录、学习进度追踪、学习笔记等功能。

## 技术栈

- **前端**：React 19 + Vite + React Router
- **后端**：Node.js + Express + TypeScript
- **数据库**：PostgreSQL + Drizzle ORM
- **认证**：JWT + bcrypt

## 快速开始（Docker 推荐）

```bash
# 1. 克隆代码
git clone <你的仓库地址>
cd agentic-handbook

# 2. 修改 docker-compose.yml 中的 JWT_SECRET 为随机字符串

# 3. 一键启动
docker-compose up -d

# 4. 访问
# http://localhost:3000
# 默认账号：admin@example.com / admin123
```

## 本地开发

### 前置要求

- Node.js >= 22
- PostgreSQL >= 14

### 步骤

```bash
# 1. 安装依赖
npm install
cd client && npm install && cd ..

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 DATABASE_URL

# 3. 初始化数据库表
# 先执行 migrations/init.sql 在 PostgreSQL 中建表

# 4. 导入种子数据
npm run seed

# 5. 启动开发
npm run dev
# 后端: http://localhost:3000
# 前端: http://localhost:5173
```

### 生产部署

```bash
# 构建
npm run build

# 启动
NODE_ENV=production node dist/server/index.js
```

## 上传到 GitHub

```bash
cd agentic-handbook
git init
git add .
git commit -m "初始提交：智能体工程手册学习平台"
git branch -M main
git remote add origin <你的GitHub仓库地址>
git push -u origin main
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 服务端口 | 3000 |
| DATABASE_URL | PostgreSQL 连接串 | - |
| JWT_SECRET | JWT 签名密钥 | 生产环境必须修改 |
| JWT_EXPIRES_IN | token 过期时间 | 7d |

## 目录结构

```
.
├── client/              # 前端 React 应用
│   └── src/
│       ├── pages/       # 8 个页面
│       ├── components/  # 布局组件
│       └── lib/         # API 与认证
├── server/              # 后端 Express 应用
│   ├── routes/          # API 路由
│   ├── db/              # 数据库 schema 与种子
│   └── middleware/      # 认证中间件
├── migrations/          # SQL 建表脚本
├── Dockerfile
└── docker-compose.yml
```
