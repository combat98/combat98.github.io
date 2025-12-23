# Node.js

## 概述

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，让 JavaScript 可以在服务器端运行。

### 特点

- **事件驱动**：基于事件循环的异步 I/O
- **非阻塞 I/O**：高并发处理能力
- **单线程**：简化编程模型
- **跨平台**：支持 Windows、Linux、macOS
- **NPM 生态**：丰富的第三方模块

## 安装

```bash
# 下载安装包
https://nodejs.org/

# 使用 nvm 管理版本（推荐）
# Linux/macOS
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js
nvm install 18
nvm use 18
nvm alias default 18

# 验证安装
node -v
npm -v
```

## 基础模块

### 文件系统（fs）

```js
const fs = require('fs');
const path = require('path');

// 同步读取文件
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);

// 异步读取文件
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise 方式
const fsPromises = require('fs').promises;

async function readFile() {
  try {
    const data = await fsPromises.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

// 写入文件
fs.writeFile('file.txt', 'Hello World', (err) => {
  if (err) throw err;
  console.log('File written');
});

// 追加文件
fs.appendFile('file.txt', '\nNew line', (err) => {
  if (err) throw err;
});

// 删除文件
fs.unlink('file.txt', (err) => {
  if (err) throw err;
});

// 创建目录
fs.mkdir('newdir', { recursive: true }, (err) => {
  if (err) throw err;
});

// 读取目录
fs.readdir('./', (err, files) => {
  if (err) throw err;
  console.log(files);
});

// 文件信息
fs.stat('file.txt', (err, stats) => {
  if (err) throw err;
  console.log(stats.isFile());
  console.log(stats.isDirectory());
  console.log(stats.size);
});

// 监听文件变化
fs.watch('file.txt', (eventType, filename) => {
  console.log(`${filename} ${eventType}`);
});
```

### 路径（path）

```js
const path = require('path');

// 路径拼接
const fullPath = path.join(__dirname, 'files', 'file.txt');
console.log(fullPath);

// 解析路径
const parsed = path.parse('/home/user/file.txt');
console.log(parsed);
// {
//   root: '/',
//   dir: '/home/user',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

// 获取扩展名
console.log(path.extname('file.txt')); // .txt

// 获取文件名
console.log(path.basename('/home/user/file.txt')); // file.txt

// 获取目录名
console.log(path.dirname('/home/user/file.txt')); // /home/user

// 规范化路径
console.log(path.normalize('/home/user/../file.txt')); // /home/file.txt

// 相对路径
console.log(path.relative('/home/user', '/home/user/files')); // files

// 绝对路径
console.log(path.resolve('file.txt')); // /current/path/file.txt
```

### HTTP 服务器

```js
const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // 设置响应头
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  // 路由处理
  if (req.url === '/') {
    res.statusCode = 200;
    res.end('<h1>Home Page</h1>');
  } else if (req.url === '/api/users') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ users: ['Alice', 'Bob'] }));
  } else {
    res.statusCode = 404;
    res.end('<h1>404 Not Found</h1>');
  }
});

// 监听端口
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 事件（events）

```js
const EventEmitter = require('events');

// 创建事件发射器
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// 监听事件
myEmitter.on('event', (arg) => {
  console.log('Event triggered:', arg);
});

// 只监听一次
myEmitter.once('event', () => {
  console.log('This will only run once');
});

// 触发事件
myEmitter.emit('event', 'Hello');

// 移除监听器
const listener = () => console.log('Listener');
myEmitter.on('event', listener);
myEmitter.removeListener('event', listener);

// 获取监听器数量
console.log(myEmitter.listenerCount('event'));
```

### 流（Stream）

```js
const fs = require('fs');

// 可读流
const readStream = fs.createReadStream('input.txt', 'utf8');

readStream.on('data', (chunk) => {
  console.log('Chunk:', chunk);
});

readStream.on('end', () => {
  console.log('Reading finished');
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});

// 可写流
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Hello\n');
writeStream.write('World\n');
writeStream.end();

writeStream.on('finish', () => {
  console.log('Writing finished');
});

// 管道
const readStream2 = fs.createReadStream('input.txt');
const writeStream2 = fs.createWriteStream('output.txt');

readStream2.pipe(writeStream2);

// 链式管道
const zlib = require('zlib');
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));
```

## Express 框架

### 安装

```bash
npm install express
```

### 基本使用

```js
const express = require('express');
const app = express();

// 中间件
app.use(express.json()); // 解析 JSON
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码
app.use(express.static('public')); // 静态文件

// 路由
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  res.status(201).json({ message: 'User created', user });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const user = req.body;
  res.json({ message: `User ${id} updated`, user });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `User ${id} deleted` });
});

// 查询参数
app.get('/search', (req, res) => {
  const { q, page } = req.query;
  res.json({ query: q, page });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 路由模块化

```js
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

router.get('/:id', (req, res) => {
  res.json({ user: { id: req.params.id } });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

module.exports = router;

// app.js
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);
```

### 中间件

```js
// 日志中间件
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

app.use(logger);

// 认证中间件
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // 验证 token
  try {
    // const decoded = jwt.verify(token, SECRET);
    // req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.use('/api/protected', auth);

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

app.use(errorHandler);
```

## 数据库操作

### MongoDB（Mongoose）

```bash
npm install mongoose
```

```js
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义 Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 创建 Model
const User = mongoose.model('User', userSchema);

// 创建文档
const createUser = async () => {
  const user = new User({
    name: 'Alice',
    email: 'alice@example.com',
    age: 25
  });
  
  await user.save();
  console.log('User created:', user);
};

// 查询
const findUsers = async () => {
  const users = await User.find();
  console.log(users);
  
  const user = await User.findOne({ email: 'alice@example.com' });
  console.log(user);
  
  const userById = await User.findById('60d5ec49f1b2c8b1f8e4e1a1');
  console.log(userById);
};

// 更新
const updateUser = async () => {
  const user = await User.findByIdAndUpdate(
    '60d5ec49f1b2c8b1f8e4e1a1',
    { age: 26 },
    { new: true }
  );
  console.log('Updated user:', user);
};

// 删除
const deleteUser = async () => {
  await User.findByIdAndDelete('60d5ec49f1b2c8b1f8e4e1a1');
  console.log('User deleted');
};
```

### MySQL（mysql2）

```bash
npm install mysql2
```

```js
const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10
});

// 查询
const getUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  console.log(rows);
};

// 参数化查询
const getUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

// 插入
const createUser = async (name, email) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  return result.insertId;
};

// 更新
const updateUser = async (id, name) => {
  const [result] = await pool.query(
    'UPDATE users SET name = ? WHERE id = ?',
    [name, id]
  );
  return result.affectedRows;
};

// 删除
const deleteUser = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result.affectedRows;
};

// 事务
const transaction = async () => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    await connection.query('INSERT INTO users (name) VALUES (?)', ['Alice']);
    await connection.query('INSERT INTO users (name) VALUES (?)', ['Bob']);
    
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
```

## 认证与授权

### JWT

```bash
npm install jsonwebtoken bcrypt
```

```js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = 'your-secret-key';

// 注册
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 保存用户到数据库
    const user = await User.create({
      username,
      password: hashedPassword
    });
    
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 登录
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 生成 token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 认证中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 受保护的路由
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

## 文件上传

```bash
npm install multer
```

```js
const multer = require('multer');
const path = require('path');

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// 单文件上传
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    message: 'File uploaded',
    file: req.file
  });
});

// 多文件上传
app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
  res.json({
    message: 'Files uploaded',
    files: req.files
  });
});
```

## 环境变量

```bash
npm install dotenv
```

```js
// .env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
JWT_SECRET=your-secret-key

// app.js
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
const JWT_SECRET = process.env.JWT_SECRET;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 最佳实践

1. **使用异步/await**：避免回调地狱
2. **错误处理**：使用 try-catch 和错误中间件
3. **环境变量**：敏感信息不要硬编码
4. **日志记录**：使用 winston 或 morgan
5. **安全性**：使用 helmet、cors、rate-limit
6. **代码组织**：模块化、分层架构
7. **测试**：使用 Jest 或 Mocha
8. **文档**：使用 Swagger 生成 API 文档
