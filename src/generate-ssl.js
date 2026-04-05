const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 创建ssl目录
const sslDir = path.join(__dirname, '..', 'ssl');
if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir, { recursive: true });
    console.log('创建ssl目录');
}

console.log('===========================================');
console.log('  智能教室管理系统 - SSL证书生成');
console.log('===========================================');

// 生成私钥
const privateKeyPath = path.join(sslDir, 'private-key.pem');
const privateKey = spawn('openssl', [
    'genrsa', 
    '-out', 
    privateKeyPath, 
    '2048'
]);

privateKey.on('close', (code) => {
    if (code === 0) {
        console.log('[成功] 私钥生成成功');

        // 生成证书
        const certificatePath = path.join(sslDir, 'certificate.pem');
        const certificate = spawn('openssl', [
            'req', 
            '-new', 
            '-x509', 
            '-key', 
            privateKeyPath, 
            '-out', 
            certificatePath, 
            '-days', 
            '365',
            '-subj',
            '/C=CN/ST=State/L=City/O=Organization/CN=localhost'
        ]);

        certificate.on('close', (code) => {
            if (code === 0) {
                console.log('[成功] SSL证书生成成功');
                console.log('');
                console.log('证书文件位置:');
                console.log(`- 私钥: ${privateKeyPath}`);
                console.log(`- 证书: ${certificatePath}`);
                console.log('');
                console.log('现在可以使用以下命令启动服务器:');
                console.log('npm run start:http2-ssl');
                console.log('===========================================');
            } else {
                console.error('[错误] 证书生成失败');
            }
        });
    } else {
        console.error('[错误] 私钥生成失败');
        console.error('请确保已安装OpenSSL');
    }
});