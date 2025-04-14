# Film Production Management System

[English](#english) | [中文](#chinese)

<a name="english"></a>

## Film Production Management System

A comprehensive web application for managing film production projects, built with Next.js, FastAPI, and MongoDB.

### Features

#### Project Management
- Create and manage multiple film projects
- View project details and progress
- Track overall project status and completion

#### Scene Management
- Detailed scene breakdown with:
  - Basic scene information (location, time, duration)
  - Character actions and requirements
  - Props list with importance levels
  - Technical requirements
  - Special notes
- Scene progress tracking with status updates
- Scene editing capabilities

#### Shooting Schedule
- Calendar view of shooting schedule
- Scene scheduling with start and end times
- Progress tracking for each scene
- Visual timeline of shooting days
- Easy navigation to scene details

#### Budget Management
- Track budget items by category:
  - Cast and crew
  - Equipment
  - Locations
  - Props and costumes
  - Catering
  - Transportation
  - Post-production
- Budget status tracking (planned, approved, spent)
- Real-time budget summaries
- Category-based budget analysis

#### Reporting
- Comprehensive project reports including:
  - Project summary statistics
  - Scene completion status
  - Character appearances
  - Props categorized by importance
  - Budget analysis
- Downloadable reports in JSON format

### Technical Stack

#### Frontend
- Next.js 13+ with App Router
- React with TypeScript
- Tailwind CSS for styling
- Heroicons for icons
- React Hot Toast for notifications

#### Backend
- FastAPI (Python)
- MongoDB with Motor for async database operations
- Pydantic for data validation

#### Key Dependencies
- `@heroicons/react`: UI icons
- `react-hot-toast`: Toast notifications
- `tailwindcss`: Utility-first CSS framework
- `fastapi`: Backend API framework
- `motor`: Async MongoDB driver
- `pydantic`: Data validation

### Getting Started

#### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB

#### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd film-production-manager
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Set up MongoDB:
- Ensure MongoDB is running locally on port 27017
- Or update the connection string in `api/index.py`

5. Start the development servers:

Backend:
```bash
python api/index.py
```

Frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### API Endpoints

#### Projects
- `GET /api/projects/{project_id}/stats`: Get project statistics
- `GET /api/projects/{project_id}/schedule`: Get shooting schedule
- `PUT /api/projects/{project_id}/schedule`: Update schedule
- `GET /api/projects/{project_id}/report`: Generate project report
- `GET /api/projects/{project_id}/budget`: Get project budget
- `PUT /api/projects/{project_id}/budget`: Update project budget

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<a name="chinese"></a>

## 影视制作管理系统

一个基于 Next.js、FastAPI 和 MongoDB 构建的综合性影视制作项目管理系统。

### 功能特性

#### 项目管理
- 创建和管理多个影视项目
- 查看项目详情和进度
- 跟踪整体项目状态和完成情况

#### 场景管理
- 详细的场景分解：
  - 基本场景信息（地点、时间、时长）
  - 角色动作和要求
  - 分级道具清单
  - 技术要求
  - 特殊说明
- 场景进度跟踪和状态更新
- 场景编辑功能

#### 拍摄日程
- 拍摄日程的日历视图
- 场景拍摄时间安排
- 每个场景的进度跟踪
- 拍摄日期的可视化时间线
- 便捷的场景详情导航

#### 预算管理
- 按类别跟踪预算项目：
  - 演职人员
  - 设备器材
  - 场地
  - 道具和服装
  - 餐饮
  - 交通
  - 后期制作
- 预算状态跟踪（计划、已批准、已支出）
- 实时预算汇总
- 基于类别的预算分析

#### 报告生成
- 综合项目报告包括：
  - 项目统计摘要
  - 场景完成状态
  - 角色出场统计
  - 按重要性分类的道具
  - 预算分析
- 可下载的 JSON 格式报告

### 技术栈

#### 前端
- Next.js 13+ 及其 App Router
- 使用 TypeScript 的 React
- Tailwind CSS 样式
- Heroicons 图标
- React Hot Toast 通知

#### 后端
- FastAPI (Python)
- 使用 Motor 的异步 MongoDB 操作
- Pydantic 数据验证

#### 主要依赖
- `@heroicons/react`：UI 图标
- `react-hot-toast`：提示通知
- `tailwindcss`：实用优先的 CSS 框架
- `fastapi`：后端 API 框架
- `motor`：异步 MongoDB 驱动
- `pydantic`：数据验证

### 快速开始

#### 环境要求
- Node.js 16+
- Python 3.8+
- MongoDB

#### 安装步骤

1. 克隆仓库：
```bash
git clone [repository-url]
cd film-production-manager
```

2. 安装前端依赖：
```bash
npm install
```

3. 安装后端依赖：
```bash
pip install -r requirements.txt
```

4. 设置 MongoDB：
- 确保 MongoDB 在本地 27017 端口运行
- 或在 `api/index.py` 中更新连接字符串

5. 启动开发服务器：

后端：
```bash
python api/index.py
```

前端：
```bash
npm run dev
```

应用将在 `http://localhost:3000` 上可用

### API 接口

#### 项目相关
- `GET /api/projects/{project_id}/stats`：获取项目统计信息
- `GET /api/projects/{project_id}/schedule`：获取拍摄日程
- `PUT /api/projects/{project_id}/schedule`：更新日程
- `GET /api/projects/{project_id}/report`：生成项目报告
- `GET /api/projects/{project_id}/budget`：获取项目预算
- `PUT /api/projects/{project_id}/budget`：更新项目预算

### 贡献指南

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解行为准则以及提交拉取请求的流程。

### 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。