# MongoDB

## 简介

MongoDB 是一个基于分布式文件存储的开源 NoSQL 数据库系统，由 C++ 编写，旨在为 Web 应用提供可扩展的高性能数据存储解决方案。

### 特点

- **文档型数据库** - 使用 JSON 格式存储数据
- **无模式** - 灵活的数据结构
- **高性能** - 支持索引和查询优化
- **高可用** - 支持副本集
- **水平扩展** - 支持分片
- **丰富的查询** - 支持复杂查询和聚合

### 应用场景

- **内容管理系统** - 灵活的文档结构
- **实时分析** - 高性能读写
- **物联网** - 海量数据存储
- **移动应用** - 灵活的数据模型
- **日志存储** - 高吞吐量写入

## 安装配置

### Linux 安装

```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# 启动服务
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Docker 安装

```bash
# 拉取镜像
docker pull mongo:6.0

# 运行容器
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongo-data:/data/db \
  mongo:6.0
```

### 连接 MongoDB

```bash
# 命令行连接
mongosh

# 指定主机和端口
mongosh "mongodb://localhost:27017"

# 使用认证
mongosh "mongodb://admin:password@localhost:27017"
```

## 基本概念

### 数据库、集合、文档

```
MySQL          MongoDB
------         -------
数据库         数据库 (database)
表             集合 (collection)
行             文档 (document)
列             字段 (field)
```

### 文档结构

```javascript
// MongoDB 文档（类似 JSON）
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "New York"
  },
  hobbies: ["reading", "coding", "gaming"]
}
```

## 基本操作

### 数据库操作

```javascript
// 查看所有数据库
show dbs

// 切换/创建数据库
use mydb

// 查看当前数据库
db

// 删除数据库
db.dropDatabase()

// 查看数据库状态
db.stats()
```

### 集合操作

```javascript
// 创建集合
db.createCollection("users")

// 查看所有集合
show collections

// 删除集合
db.users.drop()

// 重命名集合
db.users.renameCollection("members")
```

## CRUD 操作

### 插入文档（Insert）

```javascript
// 插入单个文档
db.users.insertOne({
  name: "John Doe",
  age: 30,
  email: "john@example.com"
})

// 插入多个文档
db.users.insertMany([
  { name: "Alice", age: 25, email: "alice@example.com" },
  { name: "Bob", age: 28, email: "bob@example.com" },
  { name: "Charlie", age: 35, email: "charlie@example.com" }
])

// 插入并返回结果
const result = db.users.insertOne({ name: "David", age: 32 })
print(result.insertedId)
```

### 查询文档（Find）

```javascript
// 查询所有文档
db.users.find()

// 格式化输出
db.users.find().pretty()

// 条件查询
db.users.find({ age: 30 })
db.users.find({ age: { $gt: 25 } })  // 大于25
db.users.find({ age: { $gte: 25 } }) // 大于等于25
db.users.find({ age: { $lt: 30 } })  // 小于30
db.users.find({ age: { $lte: 30 } }) // 小于等于30
db.users.find({ age: { $ne: 30 } })  // 不等于30

// 范围查询
db.users.find({ age: { $gte: 25, $lte: 35 } })

// IN 查询
db.users.find({ age: { $in: [25, 30, 35] } })

// 正则表达式
db.users.find({ name: /^John/ })
db.users.find({ email: /@example\.com$/ })

// AND 查询
db.users.find({ age: 30, name: "John" })
db.users.find({ $and: [{ age: 30 }, { name: "John" }] })

// OR 查询
db.users.find({ $or: [{ age: 25 }, { age: 30 }] })

// 查询嵌套文档
db.users.find({ "address.city": "New York" })

// 查询数组
db.users.find({ hobbies: "reading" })
db.users.find({ hobbies: { $all: ["reading", "coding"] } })

// 查询单个文档
db.users.findOne({ name: "John" })

// 指定返回字段
db.users.find({}, { name: 1, email: 1, _id: 0 })

// 排序
db.users.find().sort({ age: 1 })   // 升序
db.users.find().sort({ age: -1 })  // 降序

// 限制结果数量
db.users.find().limit(10)

// 跳过记录
db.users.find().skip(20).limit(10)

// 统计数量
db.users.countDocuments()
db.users.countDocuments({ age: { $gt: 25 } })
```

### 更新文档（Update）

```javascript
// 更新单个文档
db.users.updateOne(
  { name: "John" },
  { $set: { age: 31, email: "john.new@example.com" } }
)

// 更新多个文档
db.users.updateMany(
  { age: { $lt: 30 } },
  { $set: { status: "young" } }
)

// 替换文档
db.users.replaceOne(
  { name: "John" },
  { name: "John Doe", age: 31, email: "john@example.com" }
)

// 更新操作符
db.users.updateOne(
  { name: "John" },
  {
    $set: { age: 31 },           // 设置字段
    $unset: { status: "" },      // 删除字段
    $inc: { age: 1 },            // 增加数值
    $mul: { age: 2 },            // 乘以数值
    $rename: { name: "fullName" }, // 重命名字段
    $min: { age: 25 },           // 取最小值
    $max: { age: 35 }            // 取最大值
  }
)

// 数组操作
db.users.updateOne(
  { name: "John" },
  {
    $push: { hobbies: "swimming" },        // 添加元素
    $pull: { hobbies: "reading" },         // 删除元素
    $addToSet: { hobbies: "coding" },      // 添加唯一元素
    $pop: { hobbies: 1 },                  // 删除最后一个元素
    $pop: { hobbies: -1 }                  // 删除第一个元素
  }
)

// upsert（不存在则插入）
db.users.updateOne(
  { name: "David" },
  { $set: { age: 32, email: "david@example.com" } },
  { upsert: true }
)

// 返回更新后的文档
db.users.findOneAndUpdate(
  { name: "John" },
  { $set: { age: 31 } },
  { returnNewDocument: true }
)
```

### 删除文档（Delete）

```javascript
// 删除单个文档
db.users.deleteOne({ name: "John" })

// 删除多个文档
db.users.deleteMany({ age: { $lt: 18 } })

// 删除所有文档
db.users.deleteMany({})

// 删除并返回文档
db.users.findOneAndDelete({ name: "John" })
```

## 索引

### 创建索引

```javascript
// 创建单字段索引
db.users.createIndex({ name: 1 })   // 升序
db.users.createIndex({ age: -1 })   // 降序

// 创建复合索引
db.users.createIndex({ name: 1, age: -1 })

// 创建唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// 创建稀疏索引（只索引存在该字段的文档）
db.users.createIndex({ phone: 1 }, { sparse: true })

// 创建 TTL 索引（自动删除过期文档）
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
)

// 创建文本索引
db.articles.createIndex({ content: "text" })

// 创建地理空间索引
db.places.createIndex({ location: "2dsphere" })

// 查看索引
db.users.getIndexes()

// 删除索引
db.users.dropIndex("name_1")
db.users.dropIndexes()  // 删除所有索引（除了_id）

// 查看索引使用情况
db.users.find({ name: "John" }).explain("executionStats")
```

## 聚合

### 聚合管道

```javascript
// 基本聚合
db.orders.aggregate([
  // 匹配
  { $match: { status: "completed" } },
  
  // 分组
  { $group: {
    _id: "$customerId",
    totalAmount: { $sum: "$amount" },
    count: { $sum: 1 },
    avgAmount: { $avg: "$amount" }
  }},
  
  // 排序
  { $sort: { totalAmount: -1 } },
  
  // 限制
  { $limit: 10 },
  
  // 投影
  { $project: {
    customerId: "$_id",
    totalAmount: 1,
    count: 1,
    _id: 0
  }}
])

// 常用聚合操作符
db.orders.aggregate([
  // $match - 过滤
  { $match: { status: "completed" } },
  
  // $group - 分组
  { $group: {
    _id: "$category",
    total: { $sum: "$amount" },
    avg: { $avg: "$amount" },
    max: { $max: "$amount" },
    min: { $min: "$amount" },
    count: { $sum: 1 }
  }},
  
  // $sort - 排序
  { $sort: { total: -1 } },
  
  // $limit - 限制
  { $limit: 10 },
  
  // $skip - 跳过
  { $skip: 5 },
  
  // $project - 投影
  { $project: {
    category: "$_id",
    total: 1,
    avg: { $round: ["$avg", 2] },
    _id: 0
  }},
  
  // $lookup - 关联查询
  { $lookup: {
    from: "customers",
    localField: "customerId",
    foreignField: "_id",
    as: "customer"
  }},
  
  // $unwind - 展开数组
  { $unwind: "$items" },
  
  // $addFields - 添加字段
  { $addFields: {
    totalWithTax: { $multiply: ["$total", 1.1] }
  }}
])
```

## 数据建模

### 嵌入式文档

```javascript
// 一对一关系 - 嵌入
{
  _id: ObjectId("..."),
  name: "John Doe",
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001"
  }
}

// 一对多关系 - 嵌入数组
{
  _id: ObjectId("..."),
  title: "Blog Post",
  comments: [
    { user: "Alice", text: "Great post!", date: ISODate("...") },
    { user: "Bob", text: "Thanks for sharing", date: ISODate("...") }
  ]
}
```

### 引用

```javascript
// 一对多关系 - 引用
// 用户文档
{
  _id: ObjectId("user1"),
  name: "John Doe"
}

// 订单文档
{
  _id: ObjectId("order1"),
  userId: ObjectId("user1"),
  amount: 100
}

// 多对多关系 - 引用数组
// 学生文档
{
  _id: ObjectId("student1"),
  name: "Alice",
  courseIds: [ObjectId("course1"), ObjectId("course2")]
}

// 课程文档
{
  _id: ObjectId("course1"),
  title: "MongoDB Basics"
}
```

## 事务

```javascript
// 开始会话
const session = db.getMongo().startSession()

// 开始事务
session.startTransaction()

try {
  const usersCol = session.getDatabase("mydb").users
  const ordersCol = session.getDatabase("mydb").orders
  
  // 执行操作
  usersCol.updateOne(
    { _id: ObjectId("...") },
    { $inc: { balance: -100 } },
    { session }
  )
  
  ordersCol.insertOne(
    { userId: ObjectId("..."), amount: 100 },
    { session }
  )
  
  // 提交事务
  session.commitTransaction()
} catch (error) {
  // 回滚事务
  session.abortTransaction()
  throw error
} finally {
  session.endSession()
}
```

## 副本集

### 配置副本集

```bash
# 启动3个 MongoDB 实例
mongod --replSet rs0 --port 27017 --dbpath /data/db1
mongod --replSet rs0 --port 27018 --dbpath /data/db2
mongod --replSet rs0 --port 27019 --dbpath /data/db3

# 初始化副本集
mongosh --port 27017
```

```javascript
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
})

// 查看副本集状态
rs.status()

// 查看配置
rs.conf()

// 添加成员
rs.add("localhost:27020")

// 删除成员
rs.remove("localhost:27020")
```

## 分片

### 配置分片集群

```bash
# 1. 启动配置服务器
mongod --configsvr --replSet configReplSet --port 27019 --dbpath /data/configdb

# 2. 启动分片服务器
mongod --shardsvr --replSet shard1 --port 27018 --dbpath /data/shard1
mongod --shardsvr --replSet shard2 --port 27020 --dbpath /data/shard2

# 3. 启动 mongos 路由
mongos --configdb configReplSet/localhost:27019 --port 27017
```

```javascript
// 添加分片
sh.addShard("shard1/localhost:27018")
sh.addShard("shard2/localhost:27020")

// 启用数据库分片
sh.enableSharding("mydb")

// 对集合分片
sh.shardCollection("mydb.users", { _id: "hashed" })

// 查看分片状态
sh.status()
```

## 编程语言客户端

### Node.js (MongoDB Driver)

```javascript
const { MongoClient } = require('mongodb')

// 连接
const client = new MongoClient('mongodb://localhost:27017')
await client.connect()

const db = client.db('mydb')
const users = db.collection('users')

// 插入
await users.insertOne({ name: 'John', age: 30 })
await users.insertMany([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 28 }
])

// 查询
const user = await users.findOne({ name: 'John' })
const allUsers = await users.find({}).toArray()
const youngUsers = await users.find({ age: { $lt: 30 } }).toArray()

// 更新
await users.updateOne(
  { name: 'John' },
  { $set: { age: 31 } }
)

await users.updateMany(
  { age: { $lt: 30 } },
  { $set: { status: 'young' } }
)

// 删除
await users.deleteOne({ name: 'John' })
await users.deleteMany({ age: { $lt: 18 } })

// 聚合
const result = await users.aggregate([
  { $match: { age: { $gte: 25 } } },
  { $group: { _id: null, avgAge: { $avg: '$age' } } }
]).toArray()

// 关闭连接
await client.close()
```

### Python (PyMongo)

```python
from pymongo import MongoClient

# 连接
client = MongoClient('mongodb://localhost:27017/')
db = client['mydb']
users = db['users']

# 插入
users.insert_one({'name': 'John', 'age': 30})
users.insert_many([
    {'name': 'Alice', 'age': 25},
    {'name': 'Bob', 'age': 28}
])

# 查询
user = users.find_one({'name': 'John'})
all_users = list(users.find({}))
young_users = list(users.find({'age': {'$lt': 30}}))

# 更新
users.update_one(
    {'name': 'John'},
    {'$set': {'age': 31}}
)

users.update_many(
    {'age': {'$lt': 30}},
    {'$set': {'status': 'young'}}
)

# 删除
users.delete_one({'name': 'John'})
users.delete_many({'age': {'$lt': 18}})

# 聚合
result = list(users.aggregate([
    {'$match': {'age': {'$gte': 25}}},
    {'$group': {'_id': None, 'avgAge': {'$avg': '$age'}}}
]))

# 关闭连接
client.close()
```

### Java (MongoDB Driver)

```java
import com.mongodb.client.*;
import org.bson.Document;

// 连接
MongoClient client = MongoClients.create("mongodb://localhost:27017");
MongoDatabase db = client.getDatabase("mydb");
MongoCollection<Document> users = db.getCollection("users");

// 插入
users.insertOne(new Document("name", "John").append("age", 30));

// 查询
Document user = users.find(eq("name", "John")).first();
List<Document> allUsers = users.find().into(new ArrayList<>());

// 更新
users.updateOne(
    eq("name", "John"),
    new Document("$set", new Document("age", 31))
);

// 删除
users.deleteOne(eq("name", "John"));

// 聚合
List<Document> result = users.aggregate(Arrays.asList(
    Aggregates.match(Filters.gte("age", 25)),
    Aggregates.group(null, Accumulators.avg("avgAge", "$age"))
)).into(new ArrayList<>());

// 关闭连接
client.close();
```

## 性能优化

### 1. 使用索引

```javascript
// 创建合适的索引
db.users.createIndex({ email: 1 })
db.orders.createIndex({ userId: 1, createdAt: -1 })

// 分析查询
db.users.find({ email: "john@example.com" }).explain("executionStats")
```

### 2. 投影

```javascript
// 只返回需要的字段
db.users.find({}, { name: 1, email: 1, _id: 0 })
```

### 3. 限制结果

```javascript
// 使用 limit
db.users.find().limit(100)
```

### 4. 批量操作

```javascript
// 批量插入
db.users.insertMany([...])

// 批量更新
const bulk = db.users.initializeUnorderedBulkOp()
bulk.find({ age: { $lt: 30 } }).update({ $set: { status: 'young' } })
bulk.find({ age: { $gte: 30 } }).update({ $set: { status: 'adult' } })
bulk.execute()
```

## 监控与维护

### 监控命令

```javascript
// 查看数据库状态
db.stats()

// 查看集合状态
db.users.stats()

// 查看当前操作
db.currentOp()

// 查看服务器状态
db.serverStatus()

// 查看慢查询
db.system.profile.find().sort({ ts: -1 }).limit(10)
```

### 备份与恢复

```bash
# 备份
mongodump --db mydb --out /backup/

# 恢复
mongorestore --db mydb /backup/mydb/

# 导出集合
mongoexport --db mydb --collection users --out users.json

# 导入集合
mongoimport --db mydb --collection users --file users.json
```

## 最佳实践

1. **合理设计数据模型** - 根据查询模式设计
2. **使用索引** - 提高查询性能
3. **避免大文档** - 文档大小不超过16MB
4. **使用投影** - 只返回需要的字段
5. **批量操作** - 提高写入性能
6. **使用副本集** - 提高可用性
7. **定期备份** - 防止数据丢失
8. **监控性能** - 及时发现问题

## 总结

MongoDB 是一个强大的 NoSQL 数据库：

- ✅ 灵活的文档模型
- ✅ 强大的查询能力
- ✅ 水平扩展支持
- ✅ 高可用架构
- ✅ 丰富的生态系统

掌握 MongoDB 对于现代应用开发非常重要。

## 参考资源

- [MongoDB 官方文档](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB 权威指南](https://book.douban.com/subject/25798102/)
