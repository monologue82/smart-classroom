const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const port = 3000;
const publicDir = path.join(__dirname, '..', 'public');

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

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    if (pathname.startsWith('/api/')) {
        if (pathname === '/api/students' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
            return;
        } else if (pathname === '/api/login' && req.method === 'POST') {
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
    
    if (pathname === '/') {
        pathname = '/login.html';
    }
    
    pathname = path.join(publicDir, pathname);
    
    if (!pathname.startsWith(publicDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    const contentType = getContentType(pathname);
    
    fs.readFile(pathname, (err, data) => {
        if (err) {
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

server.listen(port, () => {
    console.log(`===========================================`);
    console.log(`    智能教室管理系统 - HTTP 服务器`);
    console.log(`===========================================`);
    console.log(`服务地址: http://localhost:${port}`);
    console.log(`按 Ctrl+C 停止服务`);
    console.log(`===========================================`);
});
