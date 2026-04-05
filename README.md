# Smart Classroom Management System

A modern and feature-rich classroom management system, providing student score management, homework management, hygiene management, random number generation, and more.

---

## [中文说明](#chinese)

---

## Features

- Score Management: Student score statistics, leaderboard, score addition/deduction operations
- Homework Management: Homework assignment, submission status tracking
- Hygiene Management: Duty schedule, cleaning status management
- Random Number: Classroom random questioning function
- Rule Management: Custom classroom rules
- Data Dashboard: Real-time data visualization display
- System Monitoring: Server status monitoring
- Data Backup: Automatic backup and recovery

## Tech Stack

- Backend: Node.js + Express + HTTP/2
- Frontend: Native JavaScript + CSS3
- UI Framework: LuminaUI
- Data Storage: LocalStorage + JSON files
- Build Tool: Webpack

## Directory Structure

```
smart-classroom5.1/
├── public/                 # Frontend resources
│   ├── css/               # Style files
│   ├── js/                # JavaScript files
│   ├── assets/            # Static assets
│   ├── LuminaUI/          # UI component library
│   └── *.html             # Page files
├── src/                   # Backend source code
│   ├── server-http2.js    # HTTP/2 server
│   └── generate-ssl.js    # SSL certificate generation
├── data/                  # Data storage
│   └── backups/           # Data backups
├── ssl/                   # SSL certificates
├── docs/                  # Documentation
├── scripts/               # Scripts
├── package.json           # Project configuration
├── LICENSE                # Open source license
└── README.md              # Project description
```

## Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd smart-classroom5.1

# Install dependencies
npm install
```

### Running

```bash
# Development mode
npm start

# HTTP/2 mode
npm run start:http2

# HTTPS mode (generate certificate first)
npm run generate-ssl
npm run start:http2-ssl
```

### Access

Open your browser and visit: `http://localhost:3000`

## Feature Modules

### Login Authentication

- User login/logout
- Session management
- Permission control

### Dashboard

- Feature navigation
- Quick access
- System overview

### Score Management

- Student score query
- Score leaderboard
- Score addition/deduction operations
- Operation record viewing

### Homework Management

- Homework publication
- Submission status tracking
- History record query

### Hygiene Management

- Duty schedule
- Cleaning status marking
- History records

### Random Number

- Random student selection
- Selection range settings
- History records

### Data Dashboard

- Real-time data display
- Statistical charts
- Key indicator monitoring

## Configuration

### Port Configuration

Default port: 3000, can be modified in `src/server-http2.js`

### SSL Configuration

```bash
# Generate SSL certificate
npm run generate-ssl
```

### Environment Variables

- `USE_SSL=true`: Enable HTTPS

## Development Guide

### Project Structure Explanation

- `public/`: All frontend resources
- `src/`: Backend service code
- `data/`: Data file storage

### Adding New Features

1. Create the corresponding HTML page in `public/`
2. Add business logic in `public/js/`
3. Add styles in `public/css/`
4. Add API in `src/` if backend support is needed

### Code Standards

- Use ES6+ syntax
- Follow modular development
- Keep code clear and concise

## Deployment

### Production Environment Deployment

```bash
# Build the project
npm run build

# Start the service
npm start
```

### Using PM2 for Process Management

```bash
npm install -g pm2
pm2 start src/server-http2.js --name smart-classroom
```

## Contributing

Welcome to contribute! Please follow these steps:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contact

- Project Homepage: [GitHub Repository]
- Issue Tracker: [Issues]
- Email: [your-email@example.com]

## Acknowledgments

Thanks to all developers who have contributed to this project!

---

**Note**: When using the system for the first time, please register an administrator account and initialize system data.

---

# <a name="chinese"></a>智能教室管理系统

一个现代化的、功能丰富的班级管理系统，提供学生积分管理、作业管理、卫生管理、随机抽号等功能。

---

## [English](#smart-classroom-management-system)

---

## 特性

- 积分管理：学生积分统计、排行榜、加分/扣分操作
- 作业管理：作业布置、上交情况追踪
- 卫生管理：值日安排、清洁状态管理
- 随机抽号：课堂随机提问功能
- 规则管理：班级规则自定义
- 数据大屏：实时数据可视化展示
- 系统监控：服务器状态监控
- 数据备份：自动备份与恢复

## 技术栈

- 后端：Node.js + Express + HTTP/2
- 前端：原生 JavaScript + CSS3
- UI框架：LuminaUI
- 数据存储：LocalStorage + JSON文件
- 构建工具：Webpack

## 目录结构

```
smart-classroom5.1/
├── public/                 # 前端资源
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript文件
│   ├── assets/            # 静态资源
│   ├── LuminaUI/          # UI组件库
│   └── *.html             # 页面文件
├── src/                   # 后端源码
│   ├── server-http2.js    # HTTP/2服务器
│   └── generate-ssl.js    # SSL证书生成
├── data/                  # 数据存储
│   └── backups/           # 数据备份
├── ssl/                   # SSL证书
├── docs/                  # 文档
├── scripts/               # 脚本
├── package.json           # 项目配置
├── LICENSE                # 开源协议
└── README.md              # 项目说明
```

## 快速开始

### 前置要求

- Node.js 14+
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd smart-classroom5.1

# 安装依赖
npm install
```

### 运行

```bash
# 开发模式
npm start

# HTTP/2模式
npm run start:http2

# HTTPS模式（需先生成证书）
npm run generate-ssl
npm run start:http2-ssl
```

### 访问

打开浏览器访问：`http://localhost:3000`

## 功能模块

### 登录认证

- 用户登录/登出
- 会话管理
- 权限控制

### 控制台

- 功能导航
- 快捷入口
- 系统概览

### 积分管理

- 学生积分查询
- 积分排行榜
- 加分/扣分操作
- 操作记录查看

### 作业管理

- 作业发布
- 上交状态追踪
- 历史记录查询

### 卫生管理

- 值日安排
- 清洁状态标记
- 历史记录

### 随机抽号

- 随机抽取学生
- 抽取范围设置
- 历史记录

### 数据大屏

- 实时数据展示
- 统计图表
- 关键指标监控

## 配置说明

### 端口配置

默认端口：3000，可在 `src/server-http2.js` 中修改

### SSL配置

```bash
# 生成SSL证书
npm run generate-ssl
```

### 环境变量

- `USE_SSL=true`：启用HTTPS

## 开发指南

### 项目结构说明

- `public/`：所有前端资源
- `src/`：后端服务代码
- `data/`：数据文件存储

### 添加新功能

1. 在 `public/` 中创建对应的HTML页面
2. 在 `public/js/` 中添加业务逻辑
3. 在 `public/css/` 中添加样式
4. 如需要后端支持，在 `src/` 中添加API

### 代码规范

- 使用 ES6+ 语法
- 遵循模块化开发
- 保持代码清晰简洁

## 部署

### 生产环境部署

```bash
# 构建项目
npm run build

# 启动服务
npm start
```

### 使用PM2守护进程

```bash
npm install -g pm2
pm2 start src/server-http2.js --name smart-classroom
```

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 项目主页：[GitHub Repository]
- 问题反馈：[Issues]
- 邮箱：[your-email@example.com]

## 致谢

感谢所有为本项目做出贡献的开发者！

---

**注意**：首次使用系统时，请先注册管理员账号并初始化系统数据。
