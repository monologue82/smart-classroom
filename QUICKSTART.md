# 快速启动指南

## 方式一：使用一键启动脚本（推荐）

### Windows 用户

#### 使用批处理文件
双击 `start.bat` 文件即可启动

#### 使用 PowerShell 脚本
右键点击 `start.ps1`，选择"使用PowerShell运行"

## 方式二：使用 npm 命令

### 1. 安装依赖（如果尚未安装）
```bash
npm install
```

### 2. 启动服务器

#### 普通模式（HTTP）
```bash
npm start
```
或
```bash
npm run start:http2
```

#### HTTPS 模式（需要先生成证书）
```bash
# 1. 生成SSL证书
npm run generate-ssl

# 2. 启动HTTPS服务器
npm run start:http2-ssl
```

## 访问系统

启动成功后，在浏览器中打开：

- HTTP模式：http://localhost:3000
- HTTPS模式：https://localhost:3000

默认会自动跳转到登录页面。

## 停止服务

在终端窗口中按 `Ctrl + C` 即可停止服务器。

## 故障排除

### 问题：端口3000已被占用

**解决方案：**
修改 `src/server-http2.js` 文件中的端口号：
```javascript
const http2Port = 3000; // 改为其他端口，如 8080
```

### 问题：Node.js未找到

**解决方案：**
1. 访问 https://nodejs.org/ 下载并安装Node.js
2. 重启命令行窗口
3. 运行 `node --version` 验证安装

### 问题：依赖安装失败

**解决方案：**
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rmdir /s /q node_modules
del package-lock.json

# 重新安装
npm install
```

## 项目结构说明

```
smart-classroom5.1/
├── public/          # 前端资源
│   ├── css/        # 样式文件
│   ├── js/         # JavaScript文件
│   ├── assets/     # 静态资源
│   ├── LuminaUI/   # UI组件库
│   └── *.html      # 页面文件
├── src/            # 后端源码
│   ├── server-http2.js
│   └── generate-ssl.js
├── data/           # 数据存储
├── ssl/            # SSL证书
├── start.bat       # Windows批处理启动脚本
├── start.ps1       # PowerShell启动脚本
└── package.json    # 项目配置
```
