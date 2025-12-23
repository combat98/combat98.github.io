# Redis

## 简介

Redis (Remote Dictionary Server) 是一个开源的内存数据结构存储系统，可以用作数据库、缓存和消息中间件。

### 特点

- **内存存储** - 数据存储在内存中，读写速度极快
- **丰富的数据类型** - 支持字符串、列表、集合、哈希、有序集合等
- **持久化** - 支持 RDB 和 AOF 两种持久化方式
- **高可用** - 支持主从复制、哨兵模式、集群模式
- **原子操作** - 所有操作都是原子性的
- **发布订阅** - 支持消息发布订阅模式

### 应用场景

- **缓存** - 热点数据缓存
- **会话存储** - Session 共享
- **排行榜** - 利用有序集合实现
- **计数器** - 文章阅读量、点赞数
- **分布式锁** - 实现分布式系统的锁机制
- **消息队列** - 简单的消息队列实现

## 安装配置

### Linux 安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# CentOS/RHEL
sudo yum install redis

# 启动服务
sudo systemctl start redis
sudo systemctl enable redis

# 查看状态
sudo systemctl status redis
```

### Docker 安装

```bash
# 拉取镜像
docker pull redis:7.0

# 运行容器
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7.0 redis-server --appendonly yes
```

### 连接 Redis

```bash
# 命令行连接
redis-cli

# 指定主机和端口
redis-cli -h 127.0.0.1 -p 6379

# 使用密码
redis-cli -a password

# 测试连接
redis-cli ping
# 返回 PONG 表示连接成功
```

## 数据类型

### String（字符串）

```bash
# 设置值
SET key value
SET name "John"
SET age 25

# 获取值
GET name

# 设置并返回旧值
GETSET name "Alice"

# 设置多个值
MSET key1 value1 key2 value2
MSET name "John" age 25 city "New York"

# 获取多个值
MGET key1 key2
MGET name age city

# 设置过期时间（秒）
SETEX key seconds value
SETEX session 3600 "session_data"

# 不存在时设置
SETNX key value
SETNX lock "locked"

# 追加字符串
APPEND key value
APPEND name " Doe"

# 获取字符串长度
STRLEN key

# 数值操作
INCR counter          # 自增1
INCRBY counter 5      # 增加5
DECR counter          # 自减1
DECRBY counter 3      # 减少3
INCRBYFLOAT price 1.5 # 增加浮点数
```

### Hash（哈希）

```bash
# 设置字段
HSET user:1 name "John"
HSET user:1 age 25
HSET user:1 email "john@example.com"

# 设置多个字段
HMSET user:2 name "Alice" age 30 email "alice@example.com"

# 获取字段
HGET user:1 name

# 获取多个字段
HMGET user:1 name age email

# 获取所有字段和值
HGETALL user:1

# 获取所有字段名
HKEYS user:1

# 获取所有值
HVALS user:1

# 判断字段是否存在
HEXISTS user:1 name

# 删除字段
HDEL user:1 email

# 字段数量
HLEN user:1

# 数值操作
HINCRBY user:1 age 1
HINCRBYFLOAT user:1 score 1.5
```

### List（列表）

```bash
# 左侧插入
LPUSH list value1 value2
LPUSH tasks "task1" "task2"

# 右侧插入
RPUSH list value1 value2
RPUSH tasks "task3" "task4"

# 左侧弹出
LPOP tasks

# 右侧弹出
RPOP tasks

# 获取列表长度
LLEN tasks

# 获取指定范围元素
LRANGE tasks 0 -1    # 获取所有
LRANGE tasks 0 9     # 获取前10个

# 获取指定索引元素
LINDEX tasks 0

# 设置指定索引元素
LSET tasks 0 "new_task"

# 删除元素
LREM tasks 1 "task1"  # 删除1个值为task1的元素

# 保留指定范围
LTRIM tasks 0 99      # 只保留前100个

# 阻塞弹出
BLPOP tasks 10        # 阻塞10秒等待元素
BRPOP tasks 10
```

### Set（集合）

```bash
# 添加元素
SADD set member1 member2
SADD tags "redis" "database" "cache"

# 获取所有元素
SMEMBERS tags

# 判断元素是否存在
SISMEMBER tags "redis"

# 删除元素
SREM tags "cache"

# 集合大小
SCARD tags

# 随机获取元素
SRANDMEMBER tags
SRANDMEMBER tags 2    # 获取2个

# 随机弹出元素
SPOP tags

# 集合运算
SINTER set1 set2      # 交集
SUNION set1 set2      # 并集
SDIFF set1 set2       # 差集

# 将结果存储到新集合
SINTERSTORE result set1 set2
```

### Sorted Set（有序集合）

```bash
# 添加元素（带分数）
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2" 150 "player3"

# 获取元素分数
ZSCORE leaderboard "player1"

# 获取排名（从0开始）
ZRANK leaderboard "player1"      # 正序排名
ZREVRANK leaderboard "player1"   # 倒序排名

# 获取指定范围元素
ZRANGE leaderboard 0 -1          # 按分数升序
ZREVRANGE leaderboard 0 -1       # 按分数降序
ZRANGE leaderboard 0 9 WITHSCORES # 带分数

# 按分数范围获取
ZRANGEBYSCORE leaderboard 100 200
ZRANGEBYSCORE leaderboard -inf +inf # 所有

# 删除元素
ZREM leaderboard "player1"

# 删除指定排名范围
ZREMRANGEBYRANK leaderboard 0 9

# 删除指定分数范围
ZREMRANGEBYSCORE leaderboard 0 100

# 集合大小
ZCARD leaderboard

# 指定分数范围的元素数量
ZCOUNT leaderboard 100 200

# 增加分数
ZINCRBY leaderboard 10 "player1"
```

## 常用命令

### 键操作

```bash
# 查看所有键
KEYS *
KEYS user:*

# 判断键是否存在
EXISTS key

# 删除键
DEL key
DEL key1 key2 key3

# 设置过期时间（秒）
EXPIRE key seconds
EXPIRE session 3600

# 设置过期时间（毫秒）
PEXPIRE key milliseconds

# 设置过期时间戳
EXPIREAT key timestamp

# 查看剩余时间（秒）
TTL key

# 查看剩余时间（毫秒）
PTTL key

# 移除过期时间
PERSIST key

# 重命名键
RENAME oldkey newkey
RENAMENX oldkey newkey  # 新键不存在时才重命名

# 查看键的类型
TYPE key

# 随机返回一个键
RANDOMKEY
```

### 数据库操作

```bash
# 选择数据库（0-15）
SELECT 0

# 查看当前数据库键数量
DBSIZE

# 清空当前数据库
FLUSHDB

# 清空所有数据库
FLUSHALL

# 保存数据到磁盘
SAVE          # 阻塞保存
BGSAVE        # 后台保存

# 查看最后保存时间
LASTSAVE
```

## 持久化

### RDB（快照）

```bash
# 配置文件 redis.conf
save 900 1      # 900秒内至少1个键被修改
save 300 10     # 300秒内至少10个键被修改
save 60 10000   # 60秒内至少10000个键被修改

# 手动触发
SAVE            # 阻塞保存
BGSAVE          # 后台保存

# RDB文件位置
dir /var/lib/redis
dbfilename dump.rdb
```

### AOF（追加文件）

```bash
# 配置文件 redis.conf
appendonly yes
appendfilename "appendonly.aof"

# 同步策略
appendfsync always    # 每次写入都同步
appendfsync everysec  # 每秒同步（推荐）
appendfsync no        # 由操作系统决定

# AOF重写
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# 手动重写
BGREWRITEAOF
```

## 事务

```bash
# 开始事务
MULTI

# 执行命令（加入队列）
SET key1 value1
SET key2 value2
INCR counter

# 执行事务
EXEC

# 取消事务
DISCARD

# 监视键（乐观锁）
WATCH key
MULTI
SET key newvalue
EXEC

# 取消监视
UNWATCH
```

## 发布订阅

```bash
# 订阅频道
SUBSCRIBE channel1 channel2

# 订阅模式
PSUBSCRIBE news.*

# 发布消息
PUBLISH channel1 "Hello"

# 取消订阅
UNSUBSCRIBE channel1
PUNSUBSCRIBE news.*

# 查看订阅信息
PUBSUB CHANNELS      # 所有频道
PUBSUB NUMSUB channel1  # 频道订阅数
PUBSUB NUMPAT        # 模式订阅数
```

## 主从复制

### 配置从节点

```bash
# 方式1：配置文件
replicaof 127.0.0.1 6379
masterauth password

# 方式2：命令行
REPLICAOF 127.0.0.1 6379

# 查看复制信息
INFO replication

# 取消复制
REPLICAOF NO ONE
```

## 哨兵模式

### 配置哨兵

```bash
# sentinel.conf
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel auth-pass mymaster password
sentinel down-after-milliseconds mymaster 5000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 10000

# 启动哨兵
redis-sentinel sentinel.conf
```

## 集群模式

### 创建集群

```bash
# 启动6个节点（3主3从）
redis-server --port 7000 --cluster-enabled yes
redis-server --port 7001 --cluster-enabled yes
redis-server --port 7002 --cluster-enabled yes
redis-server --port 7003 --cluster-enabled yes
redis-server --port 7004 --cluster-enabled yes
redis-server --port 7005 --cluster-enabled yes

# 创建集群
redis-cli --cluster create \
  127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
  --cluster-replicas 1

# 连接集群
redis-cli -c -p 7000

# 查看集群信息
CLUSTER INFO
CLUSTER NODES
```

## 编程语言客户端

### Node.js (ioredis)

```javascript
const Redis = require('ioredis');

// 连接
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
  password: 'password',
  db: 0
});

// 基本操作
await redis.set('key', 'value');
const value = await redis.get('key');

// 哈希操作
await redis.hset('user:1', 'name', 'John');
const name = await redis.hget('user:1', 'name');

// 列表操作
await redis.lpush('tasks', 'task1', 'task2');
const tasks = await redis.lrange('tasks', 0, -1);

// 集合操作
await redis.sadd('tags', 'redis', 'database');
const tags = await redis.smembers('tags');

// 有序集合操作
await redis.zadd('leaderboard', 100, 'player1');
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// 管道
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.incr('counter');
await pipeline.exec();

// 事务
const multi = redis.multi();
multi.set('key1', 'value1');
multi.set('key2', 'value2');
await multi.exec();

// 发布订阅
const subscriber = new Redis();
subscriber.subscribe('channel1');
subscriber.on('message', (channel, message) => {
  console.log(`Received ${message} from ${channel}`);
});

const publisher = new Redis();
publisher.publish('channel1', 'Hello');
```

### Java (Jedis)

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

// 连接池
JedisPool pool = new JedisPool("localhost", 6379);

try (Jedis jedis = pool.getResource()) {
    // 基本操作
    jedis.set("key", "value");
    String value = jedis.get("key");
    
    // 哈希操作
    jedis.hset("user:1", "name", "John");
    String name = jedis.hget("user:1", "name");
    
    // 列表操作
    jedis.lpush("tasks", "task1", "task2");
    List<String> tasks = jedis.lrange("tasks", 0, -1);
    
    // 集合操作
    jedis.sadd("tags", "redis", "database");
    Set<String> tags = jedis.smembers("tags");
    
    // 有序集合操作
    jedis.zadd("leaderboard", 100, "player1");
    Set<String> top10 = jedis.zrevrange("leaderboard", 0, 9);
    
    // 管道
    Pipeline pipeline = jedis.pipelined();
    pipeline.set("key1", "value1");
    pipeline.set("key2", "value2");
    pipeline.incr("counter");
    pipeline.sync();
    
    // 事务
    Transaction tx = jedis.multi();
    tx.set("key1", "value1");
    tx.set("key2", "value2");
    tx.exec();
}

pool.close();
```

### Python (redis-py)

```python
import redis

# 连接
r = redis.Redis(host='localhost', port=6379, db=0, password='password')

# 基本操作
r.set('key', 'value')
value = r.get('key')

# 哈希操作
r.hset('user:1', 'name', 'John')
name = r.hget('user:1', 'name')

# 列表操作
r.lpush('tasks', 'task1', 'task2')
tasks = r.lrange('tasks', 0, -1)

# 集合操作
r.sadd('tags', 'redis', 'database')
tags = r.smembers('tags')

# 有序集合操作
r.zadd('leaderboard', {'player1': 100})
top10 = r.zrevrange('leaderboard', 0, 9, withscores=True)

# 管道
pipe = r.pipeline()
pipe.set('key1', 'value1')
pipe.set('key2', 'value2')
pipe.incr('counter')
pipe.execute()

# 事务
with r.pipeline() as pipe:
    pipe.multi()
    pipe.set('key1', 'value1')
    pipe.set('key2', 'value2')
    pipe.execute()

# 发布订阅
pubsub = r.pubsub()
pubsub.subscribe('channel1')

for message in pubsub.listen():
    print(message)
```

## 实际应用

### 1. 缓存

```javascript
// 查询缓存
async function getUser(userId) {
  const cacheKey = `user:${userId}`;
  
  // 先查缓存
  let user = await redis.get(cacheKey);
  if (user) {
    return JSON.parse(user);
  }
  
  // 缓存未命中，查数据库
  user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  
  // 写入缓存，过期时间1小时
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}
```

### 2. 分布式锁

```javascript
// 获取锁
async function acquireLock(lockKey, timeout = 10000) {
  const lockValue = Date.now() + timeout;
  const acquired = await redis.setnx(lockKey, lockValue);
  
  if (acquired) {
    await redis.pexpire(lockKey, timeout);
    return lockValue;
  }
  
  return null;
}

// 释放锁
async function releaseLock(lockKey, lockValue) {
  const value = await redis.get(lockKey);
  if (value === lockValue.toString()) {
    await redis.del(lockKey);
    return true;
  }
  return false;
}

// 使用
const lockKey = 'resource:lock';
const lockValue = await acquireLock(lockKey);

if (lockValue) {
  try {
    // 执行业务逻辑
  } finally {
    await releaseLock(lockKey, lockValue);
  }
}
```

### 3. 限流

```javascript
// 滑动窗口限流
async function rateLimit(userId, limit = 100, window = 60) {
  const key = `rate_limit:${userId}`;
  const now = Date.now();
  const windowStart = now - window * 1000;
  
  // 删除窗口外的记录
  await redis.zremrangebyscore(key, 0, windowStart);
  
  // 获取当前窗口内的请求数
  const count = await redis.zcard(key);
  
  if (count < limit) {
    // 添加当前请求
    await redis.zadd(key, now, `${now}`);
    await redis.expire(key, window);
    return true;
  }
  
  return false;
}
```

### 4. 排行榜

```javascript
// 更新分数
async function updateScore(userId, score) {
  await redis.zincrby('leaderboard', score, userId);
}

// 获取排行榜
async function getLeaderboard(start = 0, end = 9) {
  return await redis.zrevrange('leaderboard', start, end, 'WITHSCORES');
}

// 获取用户排名
async function getUserRank(userId) {
  return await redis.zrevrank('leaderboard', userId);
}
```

### 5. 会话存储

```javascript
// 保存会话
async function saveSession(sessionId, data, ttl = 3600) {
  const key = `session:${sessionId}`;
  await redis.setex(key, ttl, JSON.stringify(data));
}

// 获取会话
async function getSession(sessionId) {
  const key = `session:${sessionId}`;
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

// 删除会话
async function deleteSession(sessionId) {
  const key = `session:${sessionId}`;
  await redis.del(key);
}
```

## 性能优化

### 1. 使用管道

```javascript
// ❌ 不好 - 多次网络往返
for (let i = 0; i < 1000; i++) {
  await redis.set(`key${i}`, `value${i}`);
}

// ✅ 好 - 使用管道
const pipeline = redis.pipeline();
for (let i = 0; i < 1000; i++) {
  pipeline.set(`key${i}`, `value${i}`);
}
await pipeline.exec();
```

### 2. 避免大键

```javascript
// ❌ 不好 - 单个键存储大量数据
await redis.hset('users', 'user1', JSON.stringify(largeObject));

// ✅ 好 - 拆分成多个键
await redis.hset('user:1:profile', 'name', 'John');
await redis.hset('user:1:settings', 'theme', 'dark');
```

### 3. 设置过期时间

```javascript
// 避免内存泄漏
await redis.setex('cache:key', 3600, 'value');
```

### 4. 使用连接池

```javascript
// 创建连接池
const pool = new Redis.Cluster([
  { host: '127.0.0.1', port: 7000 },
  { host: '127.0.0.1', port: 7001 }
], {
  redisOptions: {
    password: 'password'
  }
});
```

## 监控与调优

### 监控命令

```bash
# 查看服务器信息
INFO
INFO server
INFO memory
INFO stats

# 实时监控命令
MONITOR

# 慢查询日志
SLOWLOG GET 10
SLOWLOG LEN
SLOWLOG RESET

# 查看客户端连接
CLIENT LIST
CLIENT KILL ip:port
```

### 配置优化

```bash
# redis.conf

# 最大内存
maxmemory 2gb

# 内存淘汰策略
maxmemory-policy allkeys-lru

# 最大客户端连接数
maxclients 10000

# TCP backlog
tcp-backlog 511

# 超时时间
timeout 300

# TCP keepalive
tcp-keepalive 300
```

## 最佳实践

1. **合理设置过期时间** - 避免内存泄漏
2. **使用连接池** - 提高性能
3. **避免大键** - 影响性能
4. **使用管道** - 减少网络往返
5. **选择合适的数据结构** - 提高效率
6. **监控慢查询** - 及时优化
7. **定期备份** - 防止数据丢失
8. **使用集群** - 提高可用性和性能

## 总结

Redis 是一个高性能的内存数据库：

- ✅ 极快的读写速度
- ✅ 丰富的数据类型
- ✅ 持久化支持
- ✅ 高可用架构
- ✅ 广泛的应用场景

掌握 Redis 是现代后端开发的必备技能。

## 参考资源

- [Redis 官方文档](https://redis.io/documentation)
- [Redis 命令参考](https://redis.io/commands)
- [Redis 设计与实现](https://book.douban.com/subject/25900156/)
