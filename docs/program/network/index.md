---
prev:
  text: '设计模式'
  link: '/program/design/index'

next:
  text: '操作系统'
  link: '/program/os/index'
---

# 计算机网络

## HTTP / HTTPS 协议

### HTTP 协议

HTTP（HyperText Transfer Protocol）是应用层协议，用于在 Web 浏览器和服务器之间传输数据。

**HTTP 请求方法：**

```javascript
// GET - 获取资源
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data));

// POST - 创建资源
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});

// PUT - 更新资源（完整更新）
fetch('/api/users/1', {
  method: 'PUT',
  body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
});

// PATCH - 部分更新
fetch('/api/users/1', {
  method: 'PATCH',
  body: JSON.stringify({ name: 'John Doe' })
});

// DELETE - 删除资源
fetch('/api/users/1', { method: 'DELETE' });

// HEAD - 获取响应头
fetch('/api/users', { method: 'HEAD' });

// OPTIONS - 获取支持的方法
fetch('/api/users', { method: 'OPTIONS' });
```

**HTTP 状态码：**

```
1xx - 信息响应
  100 Continue - 继续请求
  101 Switching Protocols - 切换协议

2xx - 成功响应
  200 OK - 请求成功
  201 Created - 资源已创建
  204 No Content - 无内容返回

3xx - 重定向
  301 Moved Permanently - 永久重定向
  302 Found - 临时重定向
  304 Not Modified - 资源未修改（缓存）

4xx - 客户端错误
  400 Bad Request - 请求错误
  401 Unauthorized - 未授权
  403 Forbidden - 禁止访问
  404 Not Found - 资源不存在
  405 Method Not Allowed - 方法不允许
  429 Too Many Requests - 请求过多

5xx - 服务器错误
  500 Internal Server Error - 服务器内部错误
  502 Bad Gateway - 网关错误
  503 Service Unavailable - 服务不可用
  504 Gateway Timeout - 网关超时
```

**HTTP 请求头：**

```javascript
const headers = {
  // 内容类型
  'Content-Type': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Content-Type': 'multipart/form-data',
  
  // 认证
  'Authorization': 'Bearer token',
  'Authorization': 'Basic base64(username:password)',
  
  // 缓存控制
  'Cache-Control': 'no-cache',
  'Cache-Control': 'max-age=3600',
  
  // 其他
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0',
  'Referer': 'https://example.com',
  'Cookie': 'session=abc123'
};
```

### HTTPS 协议

HTTPS = HTTP + SSL/TLS，提供加密、身份验证和数据完整性。

**HTTPS 握手过程：**

```
1. 客户端发送 Client Hello
   - 支持的 TLS 版本
   - 支持的加密套件
   - 随机数

2. 服务器发送 Server Hello
   - 选择的 TLS 版本
   - 选择的加密套件
   - 服务器证书
   - 随机数

3. 客户端验证证书
   - 检查证书有效期
   - 检查证书颁发机构
   - 检查域名匹配

4. 生成会话密钥
   - 客户端生成预主密钥
   - 使用服务器公钥加密
   - 发送给服务器

5. 开始加密通信
   - 双方使用会话密钥加密数据
```

**Node.js HTTPS 服务器：**

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello HTTPS!');
}).listen(443);
```

### HTTP/2 和 HTTP/3

**HTTP/2 特性：**
- 二进制分帧
- 多路复用（一个连接多个请求）
- 服务器推送
- 头部压缩

**HTTP/3 特性：**
- 基于 QUIC 协议（UDP）
- 更快的连接建立
- 更好的拥塞控制
- 连接迁移

## 网络模型

### OSI 七层模型

```
7. 应用层 (Application)    - HTTP, FTP, SMTP, DNS
6. 表示层 (Presentation)   - 数据格式转换、加密
5. 会话层 (Session)        - 建立、管理会话
4. 传输层 (Transport)      - TCP, UDP
3. 网络层 (Network)        - IP, ICMP, 路由
2. 数据链路层 (Data Link)   - MAC, 交换机
1. 物理层 (Physical)       - 网线、光纤、无线
```

### TCP/IP 四层模型

```
4. 应用层 (Application)    - HTTP, FTP, SMTP, DNS
3. 传输层 (Transport)      - TCP, UDP
2. 网络层 (Internet)       - IP, ICMP
1. 网络接口层 (Link)        - 以太网、WiFi
```

**数据封装过程：**

```
应用层：HTTP 数据
传输层：TCP 段 (Segment) = TCP 头 + HTTP 数据
网络层：IP 包 (Packet) = IP 头 + TCP 段
链路层：帧 (Frame) = 帧头 + IP 包 + 帧尾
```

## UDP / TCP 协议

### UDP 协议

UDP（User Datagram Protocol）是无连接的传输层协议。

**特点：**
- 无连接（不需要建立连接）
- 不可靠（不保证数据到达）
- 无序（数据可能乱序）
- 快速（开销小）
- 支持广播和多播

**应用场景：**
- 视频直播
- 在线游戏
- DNS 查询
- 语音通话

**Node.js UDP 示例：**

```javascript
const dgram = require('dgram');

// UDP 服务器
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  console.log(`Received: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.bind(41234);

// UDP 客户端
const client = dgram.createSocket('udp4');
const message = Buffer.from('Hello UDP!');

client.send(message, 41234, 'localhost', (err) => {
  if (err) console.error(err);
  client.close();
});
```

### TCP 协议

TCP（Transmission Control Protocol）是面向连接的可靠传输协议。

**特点：**
- 面向连接（三次握手）
- 可靠传输（确认重传）
- 有序传输（序列号）
- 流量控制（滑动窗口）
- 拥塞控制

**三次握手（建立连接）：**

```
客户端                    服务器
  |                         |
  |-------- SYN ----------->|  1. 客户端发送 SYN
  |                         |
  |<----- SYN + ACK --------|  2. 服务器回复 SYN + ACK
  |                         |
  |-------- ACK ----------->|  3. 客户端发送 ACK
  |                         |
  |    连接建立，开始传输    |
```

**为什么需要三次握手？**
- 防止旧的重复连接请求
- 确认双方收发能力正常
- 协商初始序列号

**四次挥手（断开连接）：**

```
客户端                    服务器
  |                         |
  |-------- FIN ----------->|  1. 客户端发送 FIN
  |                         |
  |<------- ACK ------------|  2. 服务器回复 ACK
  |                         |
  |<------- FIN ------------|  3. 服务器发送 FIN
  |                         |
  |-------- ACK ----------->|  4. 客户端回复 ACK
  |                         |
  |      连接关闭           |
```

**为什么需要四次挥手？**
- TCP 是全双工通信
- 双方都需要关闭自己的发送通道

**Node.js TCP 示例：**

```javascript
const net = require('net');

// TCP 服务器
const server = net.createServer((socket) => {
  console.log('Client connected');
  
  socket.on('data', (data) => {
    console.log(`Received: ${data}`);
    socket.write(`Echo: ${data}`);
  });
  
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});

// TCP 客户端
const client = net.createConnection({ port: 8080 }, () => {
  console.log('Connected to server');
  client.write('Hello TCP!');
});

client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
```

### TCP 流量控制和拥塞控制

**滑动窗口（流量控制）：**

```javascript
// 接收方通过窗口大小控制发送方的发送速率
接收窗口 = 缓冲区大小 - 已接收未处理的数据

// 发送方根据接收窗口调整发送量
发送窗口 = min(接收窗口, 拥塞窗口)
```

**拥塞控制算法：**

1. **慢启动**：指数增长
2. **拥塞避免**：线性增长
3. **快速重传**：收到 3 个重复 ACK 立即重传
4. **快速恢复**：减半窗口后继续传输

## 网络安全

### 常见攻击方式

**XSS（跨站脚本攻击）：**

```javascript
// ❌ 不安全的代码
element.innerHTML = userInput;

// ✅ 安全的做法
element.textContent = userInput;

// 或使用 DOMPurify 清理
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// 服务端设置 CSP 头
res.setHeader('Content-Security-Policy', "default-src 'self'");
```

**CSRF（跨站请求伪造）：**

```javascript
// 防御措施：使用 CSRF Token
app.use(csrf());

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/submit', (req, res) => {
  // 自动验证 CSRF Token
  res.send('Success');
});

// 前端发送请求时携带 Token
fetch('/submit', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(data)
});
```

**SQL 注入：**

```javascript
// ❌ 不安全的代码
const query = `SELECT * FROM users WHERE username = '${username}'`;

// ✅ 使用参数化查询
const query = 'SELECT * FROM users WHERE username = ?';
db.query(query, [username]);

// 或使用 ORM
const user = await User.findOne({ where: { username } });
```

**DDoS 攻击防御：**

```javascript
// 限流中间件
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 最多 100 个请求
  message: 'Too many requests'
});

app.use('/api/', limiter);

// IP 黑名单
const blacklist = new Set(['192.168.1.100']);

app.use((req, res, next) => {
  const ip = req.ip;
  if (blacklist.has(ip)) {
    return res.status(403).send('Forbidden');
  }
  next();
});
```

### 加密和认证

**对称加密（AES）：**

```javascript
const crypto = require('crypto');

// 加密
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// 解密
function decrypt(text, key) {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = Buffer.from(parts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

**非对称加密（RSA）：**

```javascript
const { generateKeyPairSync, publicEncrypt, privateDecrypt } = require('crypto');

// 生成密钥对
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048
});

// 公钥加密
const encrypted = publicEncrypt(publicKey, Buffer.from('Hello'));

// 私钥解密
const decrypted = privateDecrypt(privateKey, encrypted);
console.log(decrypted.toString());
```

**JWT 认证：**

```javascript
const jwt = require('jsonwebtoken');

// 生成 Token
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  'secret-key',
  { expiresIn: '1h' }
);

// 验证 Token
try {
  const decoded = jwt.verify(token, 'secret-key');
  console.log(decoded);
} catch (err) {
  console.error('Invalid token');
}

// Express 中间件
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

## 域名解析

### DNS 解析过程

```
1. 浏览器缓存
   ↓ 未找到
2. 操作系统缓存
   ↓ 未找到
3. 本地 DNS 服务器（ISP）
   ↓ 未找到
4. 根 DNS 服务器
   ↓ 返回顶级域名服务器地址
5. 顶级域名服务器（.com）
   ↓ 返回权威域名服务器地址
6. 权威域名服务器
   ↓ 返回 IP 地址
7. 返回给客户端
```

**DNS 记录类型：**

```
A 记录     - 域名 → IPv4 地址
AAAA 记录  - 域名 → IPv6 地址
CNAME 记录 - 域名 → 另一个域名（别名）
MX 记录    - 邮件服务器
TXT 记录   - 文本信息（SPF、DKIM）
NS 记录    - 域名服务器
```

**Node.js DNS 查询：**

```javascript
const dns = require('dns');

// 查询 A 记录
dns.resolve4('example.com', (err, addresses) => {
  if (err) throw err;
  console.log('IPv4 addresses:', addresses);
});

// 查询 AAAA 记录
dns.resolve6('example.com', (err, addresses) => {
  if (err) throw err;
  console.log('IPv6 addresses:', addresses);
});

// 查询 MX 记录
dns.resolveMx('example.com', (err, addresses) => {
  if (err) throw err;
  console.log('Mail servers:', addresses);
});

// 反向查询
dns.reverse('8.8.8.8', (err, hostnames) => {
  if (err) throw err;
  console.log('Hostnames:', hostnames);
});

// Promise 版本
const { promises: dnsPromises } = require('dns');

async function lookup() {
  const addresses = await dnsPromises.resolve4('example.com');
  console.log(addresses);
}
```

### CDN 工作原理

```
1. 用户请求 www.example.com
   ↓
2. DNS 解析返回 CDN 节点 IP
   ↓
3. 用户连接到最近的 CDN 节点
   ↓
4. CDN 节点检查缓存
   ↓ 缓存未命中
5. CDN 回源获取内容
   ↓
6. CDN 缓存内容并返回给用户
```

**CDN 配置示例：**

```javascript
// Cloudflare Workers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const cache = caches.default;
  let response = await cache.match(request);
  
  if (!response) {
    response = await fetch(request);
    // 缓存 1 小时
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'max-age=3600');
    response = new Response(response.body, {
      status: response.status,
      headers
    });
    event.waitUntil(cache.put(request, response.clone()));
  }
  
  return response;
}
```

## 性能优化

### HTTP 缓存

**强缓存：**

```javascript
// Cache-Control
res.setHeader('Cache-Control', 'max-age=3600'); // 缓存 1 小时
res.setHeader('Cache-Control', 'no-cache');     // 每次验证
res.setHeader('Cache-Control', 'no-store');     // 不缓存

// Expires（HTTP/1.0）
res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());
```

**协商缓存：**

```javascript
// Last-Modified / If-Modified-Since
const lastModified = new Date(file.mtime).toUTCString();
res.setHeader('Last-Modified', lastModified);

if (req.headers['if-modified-since'] === lastModified) {
  res.statusCode = 304;
  res.end();
  return;
}

// ETag / If-None-Match
const etag = crypto.createHash('md5').update(content).digest('hex');
res.setHeader('ETag', etag);

if (req.headers['if-none-match'] === etag) {
  res.statusCode = 304;
  res.end();
  return;
}
```

### 连接优化

**Keep-Alive：**

```javascript
// HTTP/1.1 默认开启
res.setHeader('Connection', 'keep-alive');
res.setHeader('Keep-Alive', 'timeout=5, max=100');
```

**HTTP/2 Server Push：**

```javascript
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
});

server.on('stream', (stream, headers) => {
  if (headers[':path'] === '/') {
    // 推送 CSS 和 JS
    stream.pushStream({ ':path': '/style.css' }, (err, pushStream) => {
      pushStream.respondWithFile('style.css');
    });
    
    stream.respondWithFile('index.html');
  }
});

server.listen(443);
```

### 数据压缩

```javascript
const compression = require('compression');

// Gzip 压缩
app.use(compression({
  level: 6,
  threshold: 1024, // 大于 1KB 才压缩
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

## 常见问题

### 跨域问题

**CORS 配置：**

```javascript
// 简单请求
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Origin', 'https://example.com');

// 预检请求
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Max-Age', '86400'); // 缓存 24 小时

// 携带 Cookie
res.setHeader('Access-Control-Allow-Credentials', 'true');

// Express 中间件
const cors = require('cors');
app.use(cors({
  origin: 'https://example.com',
  credentials: true
}));
```

### WebSocket

```javascript
const WebSocket = require('ws');

// 服务器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send(`Echo: ${message}`);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// 客户端
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected');
  ws.send('Hello WebSocket!');
});

ws.on('message', (data) => {
  console.log('Received:', data);
});
```

### RESTful API 设计

```javascript
// 资源命名
GET    /api/users          - 获取用户列表
GET    /api/users/:id      - 获取单个用户
POST   /api/users          - 创建用户
PUT    /api/users/:id      - 更新用户（完整）
PATCH  /api/users/:id      - 更新用户（部分）
DELETE /api/users/:id      - 删除用户

// 嵌套资源
GET    /api/users/:id/posts       - 获取用户的文章
POST   /api/users/:id/posts       - 创建用户的文章
GET    /api/users/:id/posts/:pid  - 获取用户的某篇文章

// 过滤、排序、分页
GET /api/users?role=admin&sort=created_at&order=desc&page=1&limit=20

// 版本控制
GET /api/v1/users
GET /api/v2/users

// 响应格式
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "timestamp": 1234567890
}

{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```
