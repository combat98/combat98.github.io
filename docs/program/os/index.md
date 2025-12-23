---
next:
  text: '数据结构与算法'
  link: '/program/dataStructure/index'

prev:
  text: '计算机网络'
  link: '/program/network/index'
---

# 操作系统

## 进程、线程

### 进程（Process）

进程是操作系统进行资源分配和调度的基本单位，是程序的一次执行过程。

**进程的特点：**
- 独立的内存空间
- 拥有独立的资源（文件描述符、内存等）
- 进程间通信需要特殊机制（IPC）
- 创建和销毁开销大

**Node.js 创建子进程：**

```javascript
const { spawn, exec, fork } = require('child_process');

// spawn - 流式数据
const ls = spawn('ls', ['-lh', '/usr']);
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// exec - 缓冲输出
exec('ls -lh /usr', (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// fork - 创建 Node.js 子进程
const child = fork('child.js');
child.send({ hello: 'world' });
child.on('message', (msg) => {
  console.log('Message from child:', msg);
});
```

### 线程（Thread）

线程是 CPU 调度的基本单位，是进程中的一个执行流。

**线程的特点：**
- 共享进程的内存空间
- 共享进程的资源
- 线程间通信简单（共享内存）
- 创建和销毁开销小

**Node.js Worker Threads：**

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // 主线程
  const worker = new Worker(__filename, {
    workerData: { num: 5 }
  });
  
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
  
  worker.on('error', (err) => {
    console.error(err);
  });
  
  worker.on('exit', (code) => {
    console.log(`Worker exited with code ${code}`);
  });
} else {
  // 工作线程
  const { num } = workerData;
  const result = fibonacci(num);
  parentPort.postMessage(result);
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### 进程 vs 线程

```
特性         进程                    线程
------------------------------------------------------
资源         独立的内存空间          共享进程内存
通信         IPC（管道、消息队列）   共享内存、简单
开销         大                      小
稳定性       一个进程崩溃不影响其他  一个线程崩溃导致进程崩溃
创建速度     慢                      快
适用场景     多任务、隔离性要求高    并发计算、共享数据
```

## 进程 / 线程间通讯方式

### 进程间通信（IPC）

**1. 管道（Pipe）**

```javascript
const { spawn } = require('child_process');

// 匿名管道
const grep = spawn('grep', ['ssh']);
const ps = spawn('ps', ['ax']);

ps.stdout.pipe(grep.stdin);
grep.stdout.pipe(process.stdout);

// 命名管道（FIFO）
const fs = require('fs');
const fifoPath = '/tmp/myfifo';

// 创建命名管道
exec(`mkfifo ${fifoPath}`);

// 写入
const writeStream = fs.createWriteStream(fifoPath);
writeStream.write('Hello from pipe!');

// 读取
const readStream = fs.createReadStream(fifoPath);
readStream.on('data', (data) => {
  console.log(data.toString());
});
```

**2. 消息队列（Message Queue）**

```javascript
// 使用 Redis 实现消息队列
const Redis = require('ioredis');
const redis = new Redis();

// 生产者
async function producer() {
  await redis.lpush('queue', JSON.stringify({ task: 'process-data', id: 1 }));
}

// 消费者
async function consumer() {
  while (true) {
    const message = await redis.brpop('queue', 0);
    const data = JSON.parse(message[1]);
    console.log('Processing:', data);
  }
}
```

**3. 共享内存（Shared Memory）**

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // 创建共享内存
  const sharedBuffer = new SharedArrayBuffer(1024);
  const sharedArray = new Int32Array(sharedBuffer);
  
  const worker = new Worker(__filename, {
    workerData: { sharedBuffer }
  });
  
  // 主线程写入
  sharedArray[0] = 42;
  
  setTimeout(() => {
    console.log('Main thread:', sharedArray[0]); // 100
  }, 1000);
} else {
  const { sharedBuffer } = workerData;
  const sharedArray = new Int32Array(sharedBuffer);
  
  // 工作线程读取并修改
  console.log('Worker thread:', sharedArray[0]); // 42
  sharedArray[0] = 100;
}
```

**4. 信号（Signal）**

```javascript
// 发送信号
process.kill(pid, 'SIGTERM');

// 接收信号
process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  // 清理资源
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT (Ctrl+C)');
  process.exit(0);
});
```

**5. Socket**

```javascript
const net = require('net');

// 服务器
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write('Echo: ' + data);
  });
});
server.listen(8080);

// 客户端
const client = net.createConnection({ port: 8080 }, () => {
  client.write('Hello from client!');
});
client.on('data', (data) => {
  console.log(data.toString());
});
```

### 线程间通信

**1. 共享内存**

```javascript
// 使用 SharedArrayBuffer
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);

// 线程 1 写入
sharedArray[0] = 42;

// 线程 2 读取
console.log(sharedArray[0]); // 42
```

**2. 消息传递**

```javascript
// Worker Threads 消息传递
const { Worker, parentPort } = require('worker_threads');

// 主线程
const worker = new Worker('./worker.js');
worker.postMessage({ cmd: 'start', data: [1, 2, 3] });
worker.on('message', (msg) => {
  console.log('From worker:', msg);
});

// worker.js
parentPort.on('message', (msg) => {
  console.log('From main:', msg);
  parentPort.postMessage({ result: 'done' });
});
```

## 进程调度算法

### 1. 先来先服务（FCFS）

按照进程到达的顺序进行调度。

```javascript
class FCFS {
  constructor() {
    this.queue = [];
  }
  
  addProcess(process) {
    this.queue.push(process);
  }
  
  schedule() {
    while (this.queue.length > 0) {
      const process = this.queue.shift();
      console.log(`Executing ${process.name} for ${process.burstTime}ms`);
      // 执行进程
    }
  }
}

// 使用
const scheduler = new FCFS();
scheduler.addProcess({ name: 'P1', burstTime: 10 });
scheduler.addProcess({ name: 'P2', burstTime: 5 });
scheduler.addProcess({ name: 'P3', burstTime: 8 });
scheduler.schedule();
```

### 2. 最短作业优先（SJF）

选择执行时间最短的进程先执行。

```javascript
class SJF {
  constructor() {
    this.queue = [];
  }
  
  addProcess(process) {
    this.queue.push(process);
    // 按执行时间排序
    this.queue.sort((a, b) => a.burstTime - b.burstTime);
  }
  
  schedule() {
    while (this.queue.length > 0) {
      const process = this.queue.shift();
      console.log(`Executing ${process.name} for ${process.burstTime}ms`);
    }
  }
}
```

### 3. 优先级调度

根据进程的优先级进行调度。

```javascript
class PriorityScheduler {
  constructor() {
    this.queue = [];
  }
  
  addProcess(process) {
    this.queue.push(process);
    // 按优先级排序（数字越小优先级越高）
    this.queue.sort((a, b) => a.priority - b.priority);
  }
  
  schedule() {
    while (this.queue.length > 0) {
      const process = this.queue.shift();
      console.log(`Executing ${process.name} (priority: ${process.priority})`);
    }
  }
}
```

### 4. 时间片轮转（Round Robin）

每个进程分配一个时间片，时间片用完后切换到下一个进程。

```javascript
class RoundRobin {
  constructor(timeQuantum) {
    this.queue = [];
    this.timeQuantum = timeQuantum;
  }
  
  addProcess(process) {
    this.queue.push(process);
  }
  
  schedule() {
    while (this.queue.length > 0) {
      const process = this.queue.shift();
      
      if (process.remainingTime <= this.timeQuantum) {
        console.log(`Executing ${process.name} for ${process.remainingTime}ms (completed)`);
        process.remainingTime = 0;
      } else {
        console.log(`Executing ${process.name} for ${this.timeQuantum}ms`);
        process.remainingTime -= this.timeQuantum;
        this.queue.push(process); // 重新加入队列
      }
    }
  }
}

// 使用
const scheduler = new RoundRobin(4);
scheduler.addProcess({ name: 'P1', remainingTime: 10 });
scheduler.addProcess({ name: 'P2', remainingTime: 5 });
scheduler.addProcess({ name: 'P3', remainingTime: 8 });
scheduler.schedule();
```

### 5. 多级反馈队列

结合多个队列和不同的调度算法。

```javascript
class MultilevelFeedbackQueue {
  constructor() {
    this.queues = [
      { priority: 1, timeQuantum: 2, processes: [] },
      { priority: 2, timeQuantum: 4, processes: [] },
      { priority: 3, timeQuantum: 8, processes: [] }
    ];
  }
  
  addProcess(process) {
    // 新进程加入最高优先级队列
    this.queues[0].processes.push(process);
  }
  
  schedule() {
    for (let i = 0; i < this.queues.length; i++) {
      const queue = this.queues[i];
      
      while (queue.processes.length > 0) {
        const process = queue.processes.shift();
        
        if (process.remainingTime <= queue.timeQuantum) {
          console.log(`Q${i+1}: Executing ${process.name} for ${process.remainingTime}ms`);
          process.remainingTime = 0;
        } else {
          console.log(`Q${i+1}: Executing ${process.name} for ${queue.timeQuantum}ms`);
          process.remainingTime -= queue.timeQuantum;
          
          // 降级到下一个队列
          if (i < this.queues.length - 1) {
            this.queues[i + 1].processes.push(process);
          } else {
            queue.processes.push(process);
          }
        }
      }
    }
  }
}
```

## 进程 / 线程状态

### 进程状态转换

```
新建 (New)
  ↓
就绪 (Ready) ←→ 运行 (Running)
  ↑              ↓
  └── 阻塞 (Blocked)
       ↓
    终止 (Terminated)
```

**状态说明：**
- **新建**：进程正在被创建
- **就绪**：进程已准备好运行，等待 CPU
- **运行**：进程正在 CPU 上执行
- **阻塞**：进程等待某个事件（I/O、信号等）
- **终止**：进程执行完毕

**Node.js 进程状态监控：**

```javascript
const { spawn } = require('child_process');

const child = spawn('node', ['long-running-task.js']);

console.log('Process ID:', child.pid);
console.log('Process started');

child.on('spawn', () => {
  console.log('Process spawned');
});

child.on('exit', (code, signal) => {
  console.log(`Process exited with code ${code} and signal ${signal}`);
});

child.on('error', (err) => {
  console.error('Process error:', err);
});

// 获取进程信息
console.log('Memory usage:', process.memoryUsage());
console.log('CPU usage:', process.cpuUsage());
console.log('Uptime:', process.uptime());
```

## 死锁

### 死锁的四个必要条件

1. **互斥条件**：资源不能被多个进程同时使用
2. **请求和保持条件**：进程持有资源的同时请求新资源
3. **不可剥夺条件**：资源不能被强制剥夺
4. **循环等待条件**：存在进程资源的循环等待链

### 死锁示例

```javascript
// 死锁示例
class BankAccount {
  constructor(balance) {
    this.balance = balance;
    this.locked = false;
  }
  
  lock() {
    while (this.locked) {
      // 等待锁释放
    }
    this.locked = true;
  }
  
  unlock() {
    this.locked = false;
  }
}

function transfer(from, to, amount) {
  from.lock();
  console.log('Locked from account');
  
  // 模拟延迟
  setTimeout(() => {
    to.lock();
    console.log('Locked to account');
    
    from.balance -= amount;
    to.balance += amount;
    
    to.unlock();
    from.unlock();
  }, 100);
}

const account1 = new BankAccount(1000);
const account2 = new BankAccount(1000);

// 死锁：两个线程互相等待对方释放锁
transfer(account1, account2, 100);
transfer(account2, account1, 200);
```

### 死锁预防

**1. 破坏互斥条件**
```javascript
// 使用读写锁，允许多个读操作
class ReadWriteLock {
  constructor() {
    this.readers = 0;
    this.writer = false;
  }
  
  readLock() {
    while (this.writer) {
      // 等待写锁释放
    }
    this.readers++;
  }
  
  readUnlock() {
    this.readers--;
  }
  
  writeLock() {
    while (this.writer || this.readers > 0) {
      // 等待所有锁释放
    }
    this.writer = true;
  }
  
  writeUnlock() {
    this.writer = false;
  }
}
```

**2. 破坏请求和保持条件**
```javascript
// 一次性申请所有资源
function transferSafe(from, to, amount) {
  // 按固定顺序获取锁
  const first = from.id < to.id ? from : to;
  const second = from.id < to.id ? to : from;
  
  first.lock();
  second.lock();
  
  from.balance -= amount;
  to.balance += amount;
  
  second.unlock();
  first.unlock();
}
```

**3. 破坏循环等待条件**
```javascript
// 资源按序分配
const resources = ['A', 'B', 'C', 'D'];
const resourceOrder = { A: 1, B: 2, C: 3, D: 4 };

function acquireResources(needed) {
  // 按顺序获取资源
  const sorted = needed.sort((a, b) => resourceOrder[a] - resourceOrder[b]);
  sorted.forEach(resource => {
    console.log(`Acquiring ${resource}`);
    // 获取资源
  });
}
```

### 死锁检测和恢复

```javascript
class DeadlockDetector {
  constructor() {
    this.waitGraph = new Map(); // 等待图
  }
  
  addEdge(from, to) {
    if (!this.waitGraph.has(from)) {
      this.waitGraph.set(from, []);
    }
    this.waitGraph.get(from).push(to);
  }
  
  detectCycle() {
    const visited = new Set();
    const recStack = new Set();
    
    for (const node of this.waitGraph.keys()) {
      if (this.hasCycle(node, visited, recStack)) {
        return true;
      }
    }
    return false;
  }
  
  hasCycle(node, visited, recStack) {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;
    
    visited.add(node);
    recStack.add(node);
    
    const neighbors = this.waitGraph.get(node) || [];
    for (const neighbor of neighbors) {
      if (this.hasCycle(neighbor, visited, recStack)) {
        return true;
      }
    }
    
    recStack.delete(node);
    return false;
  }
}

// 使用
const detector = new DeadlockDetector();
detector.addEdge('P1', 'P2');
detector.addEdge('P2', 'P3');
detector.addEdge('P3', 'P1'); // 形成环

if (detector.detectCycle()) {
  console.log('Deadlock detected!');
  // 恢复策略：终止进程或剥夺资源
}
```

## 内存管理

### 内存分配策略

**1. 首次适应（First Fit）**
```javascript
class FirstFit {
  constructor(totalMemory) {
    this.memory = [{ start: 0, size: totalMemory, free: true }];
  }
  
  allocate(size) {
    for (let i = 0; i < this.memory.length; i++) {
      const block = this.memory[i];
      if (block.free && block.size >= size) {
        // 分配内存
        if (block.size > size) {
          this.memory.splice(i + 1, 0, {
            start: block.start + size,
            size: block.size - size,
            free: true
          });
        }
        block.size = size;
        block.free = false;
        return block.start;
      }
    }
    return -1; // 分配失败
  }
  
  free(start) {
    const block = this.memory.find(b => b.start === start);
    if (block) {
      block.free = true;
      this.merge(); // 合并相邻空闲块
    }
  }
  
  merge() {
    for (let i = 0; i < this.memory.length - 1; i++) {
      if (this.memory[i].free && this.memory[i + 1].free) {
        this.memory[i].size += this.memory[i + 1].size;
        this.memory.splice(i + 1, 1);
        i--;
      }
    }
  }
}
```

**2. 最佳适应（Best Fit）**
```javascript
class BestFit {
  allocate(size) {
    let bestIndex = -1;
    let minSize = Infinity;
    
    for (let i = 0; i < this.memory.length; i++) {
      const block = this.memory[i];
      if (block.free && block.size >= size && block.size < minSize) {
        bestIndex = i;
        minSize = block.size;
      }
    }
    
    if (bestIndex !== -1) {
      // 分配内存
      return this.memory[bestIndex].start;
    }
    return -1;
  }
}
```

### 虚拟内存

**分页（Paging）：**

```javascript
class PageTable {
  constructor(pageSize) {
    this.pageSize = pageSize;
    this.table = new Map(); // 页号 -> 帧号
  }
  
  // 虚拟地址转物理地址
  translate(virtualAddress) {
    const pageNumber = Math.floor(virtualAddress / this.pageSize);
    const offset = virtualAddress % this.pageSize;
    
    if (!this.table.has(pageNumber)) {
      throw new Error('Page fault');
    }
    
    const frameNumber = this.table.get(pageNumber);
    const physicalAddress = frameNumber * this.pageSize + offset;
    return physicalAddress;
  }
  
  map(pageNumber, frameNumber) {
    this.table.set(pageNumber, frameNumber);
  }
}

// 使用
const pageTable = new PageTable(4096); // 4KB 页
pageTable.map(0, 5); // 页 0 映射到帧 5
pageTable.map(1, 3); // 页 1 映射到帧 3

const physicalAddr = pageTable.translate(4100); // 虚拟地址 4100
console.log('Physical address:', physicalAddr);
```

### 页面置换算法

**1. FIFO（先进先出）**
```javascript
class FIFO {
  constructor(capacity) {
    this.capacity = capacity;
    this.pages = [];
  }
  
  access(page) {
    if (this.pages.includes(page)) {
      return false; // 命中
    }
    
    if (this.pages.length >= this.capacity) {
      this.pages.shift(); // 移除最早的页
    }
    this.pages.push(page);
    return true; // 缺页
  }
}
```

**2. LRU（最近最少使用）**
```javascript
class LRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  access(page) {
    if (this.cache.has(page)) {
      // 命中，更新访问时间
      this.cache.delete(page);
      this.cache.set(page, true);
      return false;
    }
    
    if (this.cache.size >= this.capacity) {
      // 删除最久未使用的页（Map 的第一个元素）
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(page, true);
    return true; // 缺页
  }
}

// 使用
const lru = new LRU(3);
console.log(lru.access(1)); // true (缺页)
console.log(lru.access(2)); // true (缺页)
console.log(lru.access(3)); // true (缺页)
console.log(lru.access(1)); // false (命中)
console.log(lru.access(4)); // true (缺页，移除页 2)
```

**3. LFU（最不经常使用）**
```javascript
class LFU {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // page -> frequency
  }
  
  access(page) {
    if (this.cache.has(page)) {
      this.cache.set(page, this.cache.get(page) + 1);
      return false;
    }
    
    if (this.cache.size >= this.capacity) {
      // 找到频率最低的页
      let minFreq = Infinity;
      let minPage = null;
      
      for (const [page, freq] of this.cache) {
        if (freq < minFreq) {
          minFreq = freq;
          minPage = page;
        }
      }
      
      this.cache.delete(minPage);
    }
    
    this.cache.set(page, 1);
    return true;
  }
}
```

### Node.js 内存管理

```javascript
// 查看内存使用
console.log(process.memoryUsage());
/*
{
  rss: 物理内存占用
  heapTotal: 堆总大小
  heapUsed: 堆使用大小
  external: C++ 对象占用
  arrayBuffers: ArrayBuffer 占用
}
*/

// 手动触发垃圾回收（需要 --expose-gc 标志）
if (global.gc) {
  global.gc();
  console.log('GC triggered');
}

// 监控内存泄漏
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`Memory usage: ${Math.round(used * 100) / 100} MB`);

// 内存泄漏示例
const leaks = [];
setInterval(() => {
  leaks.push(new Array(1000000)); // 持续增长
}, 1000);

// 避免内存泄漏
// 1. 及时清理定时器
const timer = setInterval(() => {}, 1000);
clearInterval(timer);

// 2. 移除事件监听器
const handler = () => {};
emitter.on('event', handler);
emitter.off('event', handler);

// 3. 使用 WeakMap/WeakSet
const weakMap = new WeakMap();
let obj = { data: 'value' };
weakMap.set(obj, 'metadata');
obj = null; // obj 可以被垃圾回收
```

## 最佳实践

### 进程管理

```javascript
// PM2 进程管理
module.exports = {
  apps: [{
    name: 'app',
    script: './app.js',
    instances: 4, // 4 个进程
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  
  // 停止接收新请求
  server.close(async () => {
    // 等待现有请求完成
    await closeDatabase();
    await closeRedis();
    
    console.log('Server closed');
    process.exit(0);
  });
  
  // 超时强制退出
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 30000);
});
```

### 性能优化

```javascript
// 使用 Worker Threads 处理 CPU 密集任务
const { Worker } = require('worker_threads');

function runWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData: data });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// 使用 Cluster 模块利用多核 CPU
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // 重启工作进程
  });
} else {
  // 工作进程
  require('./app.js');
  console.log(`Worker ${process.pid} started`);
}
```
