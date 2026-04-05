// HTTP/2 服务器实现
const fs = require('fs');
const path = require('path');
const http2 = require('http2');
const url = require('url');

// HTTP/2服务器配置
const http2Port = 3000; // 使用3000端口
const publicDir = path.join(__dirname, '..', 'public');
const sslDir = path.join(__dirname, '..', 'ssl');

// 检查是否使用SSL
const useSSL = process.env.USE_SSL === 'true';

// 读取文件的辅助函数
function readFile(filePath, res, contentType = 'text/html') {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// 获取内容类型辅助函数
function getContentType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    
    return mimeTypes[extname] || 'application/octet-stream';
}

if (useSSL) {
    // 使用SSL的HTTP/2服务器
    const serverOptions = {
        key: fs.readFileSync(path.join(sslDir, 'private-key.pem')),
        cert: fs.readFileSync(path.join(sslDir, 'certificate.pem'))
    };
    
    const http2Server = http2.createSecureServer(serverOptions, (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname;
        
        // 处理API路由
        if (pathname.startsWith('/api/')) {
            if (pathname === '/api/students' && req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            } else if (pathname === '/api/login' && req.method === 'POST') {
                // For demonstration, we'll just read the request body
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, isAdmin: false, username: 'test' }));
                });
                return;
            }
        }
        
        // 处理根路径重定向
        if (pathname === '/') {
            pathname = '/login.html';
        }
        
        // 从public目录提供文件
        pathname = path.join(publicDir, pathname);
        
        // 防止路径遍历攻击
        if (!pathname.startsWith(publicDir)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }
        
        const contentType = getContentType(pathname);
        
        fs.readFile(pathname, (err, data) => {
            if (err) {
                // 如果是目录，尝试添加index.html
                if (err.code === 'EISDIR') {
                    const indexPath = path.join(pathname, 'index.html');
                    fs.readFile(indexPath, (err, data) => {
                        if (err) {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('404 Not Found');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(data);
                        }
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    });
    
    http2Server.listen(http2Port, () => {
        console.log(`===========================================`);
        console.log(`  智能教室管理系统 - HTTP/2 服务器 (SSL)`);
        console.log(`===========================================`);
        console.log(`服务地址: https://localhost:${http2Port}`);
        console.log(`按 Ctrl+C 停止服务`);
        console.log(`===========================================`);
    });
} else {
    // 不使用SSL的HTTP/2服务器 (h2c)
    const http2Server = http2.createServer((req, res) => {
        const parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname;
        
        // 处理API路由
        if (pathname.startsWith('/api/')) {
            if (pathname === '/api/students' && req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            } else if (pathname === '/api/login' && req.method === 'POST') {
                // For demonstration, we'll just read the request body
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, isAdmin: false, username: 'test' }));
                });
                return;
            }
        }
        
        // 处理根路径重定向
        if (pathname === '/') {
            pathname = '/login.html';
        }
        
        // 从public目录提供文件
        pathname = path.join(publicDir, pathname);
        
        // 防止路径遍历攻击
        if (!pathname.startsWith(publicDir)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }
        
        const contentType = getContentType(pathname);
        
        fs.readFile(pathname, (err, data) => {
            if (err) {
                // 如果是目录，尝试添加index.html
                if (err.code === 'EISDIR') {
                    const indexPath = path.join(pathname, 'index.html');
                    fs.readFile(indexPath, (err, data) => {
                        if (err) {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('404 Not Found');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(data);
                        }
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    });
    
    http2Server.listen(http2Port, () => {
        console.log(`===========================================`);
        console.log(`    智能教室管理系统 - HTTP/2 服务器`);
        console.log(`===========================================`);
        console.log(`服务地址: http://localhost:${http2Port}`);
        console.log(`按 Ctrl+C 停止服务`);
        console.log(`===========================================`);
    });
}