# 智能教室管理系统

一个现代化的、功能丰富的班级管理系统，提供学生积分管理、作业管理、卫生管理、随机抽号等功能。

---

## [English](README.md)

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
└── README-CN.md           # 项目说明（中文）
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
- 邮箱：[2627641908@QQ.com]
- B站：[骄傲的狼W0R](https://space.bilibili.com/1741551557)

## 致谢

感谢所有为本项目做出贡献的开发者！

---

**注意**：首次使用系统时，请先注册管理员账号并初始化系统数据。
