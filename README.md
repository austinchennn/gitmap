# GitMap

![GitMap Logo](https://img.shields.io/badge/GitMap-Visualization-blue?style=for-the-badge&logo=github)

> **GitMap** 是一个现代化的 Git 代码仓库可视化工具。通过交互式的树状图（Treemap）和文件树，直观地展示 GitHub 仓库的代码结构、文件大小分布及层级关系。

---

## 项目结构 | Structure

本项目采用前后端分离架构，目录结构清晰，便于扩展和维护。

```text
gitmap/
├── backend/                 # Python FastAPI 后端服务
│   ├── app/                 # 应用主逻辑
│   │   ├── api/             # API 路由定义
│   │   ├── core/            # 核心配置 (Redis, Config)
│   │   ├── models/          # 数据模型 (Pydantic schemas)
│   │   ├── services/        # 业务逻辑 (GitHub Client, Tree Builder)
│   │   └── main.py          # 程序入口
│   └── requirements.txt     # Python 依赖清单
│
├── frontend/                # Next.js 前端应用
│   ├── src/
│   │   ├── app/             # Next.js App Router 页面
│   │   ├── components/      # React 组件 (Treemap, Sidebar)
│   │   ├── store/           # Zustand 状态管理
│   │   ├── types/           # TypeScript 类型定义
│   │   └── utils/           # D3.js 辅助与工具函数
│   ├── tailwind.config.ts   # Tailwind 样式配置
│   └── next.config.js       # Next.js 配置
│
├── install.sh               # 一键安装脚本 (macOS/Linux)
└── start.sh                 # 一键启动脚本 (macOS/Linux)
```

---

## 快速开始 | Quick Start

我们提供了自动化脚本，助您在本地环境一键完成部署。

### 前置要求 (Prerequisites)

在运行之前，请确保您的系统已安装以下环境：

*   **Python**: 3.10 或更高版本
*   **Node.js**: 18.0 或更高版本
*   **Redis**: 用于缓存 GitHub API 数据 (必须在本地运行，默认端口 6379)
*   **GitHub Token**: (可选但推荐) 用于提高 API 调用速率限制

### 一键安装与运行 (One-Click Setup)

**第一步：安装依赖**

在项目根目录下运行安装脚本。该脚本会自动创建 Python 虚拟环境、安装 pip 依赖以及 npm 前端依赖。

```bash
./install.sh
```

> **注意**: 安装完成后，脚本会在 `backend/` 目录下生成一个 `.env` 文件。请打开该文件并填入您的 `GITHUB_TOKEN` 以避免访问受限。

**第二步：启动应用**

直接运行启动脚本，它将同时启动后端 API 服务和前端开发服务器。

```bash
./start.sh
```

启动成功后，访问：
*   **前端页面**: [http://localhost:3000](http://localhost:3000)
*   **后端 API 文档**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 手动配置 (Manual Setup)

如果您无法使用脚本，可以按照以下步骤手动设置：

### 后端配置 (Backend)

1.  进入 backend 目录: `cd backend`
2.  创建虚拟环境: `python3 -m venv venv`
3.  激活环境: `source venv/bin/activate` (Windows: `venv\Scripts\activate`)
4.  安装依赖: `pip install -r requirements.txt`
5.  配置环境变量: 参考 `app/core/config.py` 创建 `.env` 文件。
6.  运行服务: `uvicorn app.main:app --reload`

### 前端配置 (Frontend)

1.  进入 frontend 目录: `cd frontend`
2.  安装依赖: `npm install` (或 `yarn`)
3.  运行开发服务: `npm run dev`

---

## 技术栈 | Tech Stack

*   **Frontend**: Next.js 14, TypeScript, TailwindCSS, D3.js, Zustand, Framer Motion
*   **Backend**: Python, FastAPI, Pydantic, Redis
*   **Tools**: Git, Docker (Optional)

---

## License

MIT License © 2024 GitMap
