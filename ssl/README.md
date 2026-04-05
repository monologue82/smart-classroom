# SSL证书说明

此目录包含用于服务器的SSL证书。

## 生成证书的方法：

### 方法1: 使用OpenSSL (推荐)
如果您安装了OpenSSL，可以使用以下命令生成证书：

```
# 生成私钥
openssl genrsa -out ssl/private-key.pem 2048

# 生成自签名证书
openssl req -new -x509 -key ssl/private-key.pem -out ssl/certificate.pem -days 365 -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost"
```

### 方法2: 使用mkcert (推荐用于开发)
mkcert是一个简单易用的工具，用于制作本地信任的开发证书：

```
# 安装mkcert
# Windows: 
# 下载并安装来自 https://github.com/FiloSottile/mkcert/releases
# 然后运行:
mkcert -install
mkcert localhost 127.0.0.1 ::1
# 这将生成 localhost+2.pem 和 localhost+2-key.pem 文件
# 重命名为 certificate.pem 和 private-key.pem
```

## 文件说明：
- private-key.pem: SSL私钥
- certificate.pem: SSL证书

## 安全提示：
- 不要在生产环境中使用自签名证书
- 保护好私钥文件，不要将其提交到版本控制系统
