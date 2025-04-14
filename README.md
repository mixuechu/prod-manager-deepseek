# AI 制片管理系统

基于人工智能的影视制片管理系统，通过 AI 技术辅助剧本分析、场景管理和制片流程优化。

## 功能特性

### 已实现功能

1. **项目管理**
   - 创建和查看项目
   - 项目基本信息管理（标题、描述、日期等）
   - 项目状态跟踪
   - 团队成员管理

2. **场景管理**
   - AI 剧本分析
   - 场景列表展示
   - 场景详细信息查看和编辑
   - 场景状态追踪

3. **统计分析**
   - 项目进度统计
   - 角色出场统计
   - 道具使用统计
   - 场景分布分析

### 计划功能

1. **拍摄进度管理**
   - 场景拍摄状态追踪
   - 拍摄时间安排
   - 进度报告生成

2. **资源管理**
   - 道具库管理
   - 演员档期管理
   - 场地资源管理

3. **数据导出**
   - 拍摄计划导出
   - 统计报告导出
   - 场景细节表导出

## 技术栈

### 后端
- FastAPI
- MongoDB
- OpenAI GPT-4
- Python 3.13
- Uvicorn

### 前端
- Next.js
- React
- Tailwind CSS

## 项目结构

```
api/
├── config/          # 配置文件
├── models/          # 数据模型
├── routes/          # API路由
├── services/        # 业务逻辑
└── main.py         # 应用入口

app/                # 前端应用
├── components/     # React组件
├── pages/         # 页面
└── styles/        # 样式文件
```

## 安装和运行

### 环境要求
- Python 3.13+
- Node.js 18+
- MongoDB

### 后端设置

1. 安装依赖：
```bash
pip install fastapi uvicorn python-multipart motor openai
```

2. 配置环境变量：
- 在 `api/config/settings.py` 中配置 MongoDB 连接和 OpenAI API 密钥

3. 启动服务器：
```bash
python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### 前端设置

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

## API 文档

启动服务器后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 开发状态

当前版本: 1.0.0-alpha

- [x] 基础项目架构
- [x] 数据模型设计
- [x] API 端点实现
- [x] AI 剧本分析集成
- [ ] 完整的前端界面
- [ ] 用户认证系统
- [ ] 完整的测试覆盖

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT License