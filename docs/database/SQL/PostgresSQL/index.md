---
prev:
  text: 'Mysql'
  link: '/database/SQL/mysql/index'
next:
  text: 'SQLServer'
  link: '/database/SQL/SQLServer/index'
---

# PostgreSQL

## 简介

PostgreSQL 是一个功能强大的开源对象关系型数据库系统，拥有超过 35 年的积极开发历史，以其可靠性、功能健壮性和性能而闻名。

### 特点

- **开源免费** - 完全开源，BSD 许可证
- **ACID 兼容** - 完全支持事务
- **丰富的数据类型** - 支持 JSON、数组、范围类型等
- **扩展性强** - 支持自定义函数、数据类型、索引类型
- **高级特性** - 支持窗口函数、CTE、全文搜索
- **跨平台** - 支持多种操作系统

### 应用场景

- **企业级应用** - 复杂的业务逻辑
- **地理信息系统** - PostGIS 扩展
- **数据仓库** - 大数据分析
- **Web 应用** - 高并发读写
- **金融系统** - 高可靠性要求

## 安装配置

### Linux 安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 切换到 postgres 用户
sudo -i -u postgres
psql
```

### Docker 安装

```bash
# 拉取镜像
docker pull postgres:15

# 运行容器
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=admin \
  -e POSTGRES_DB=mydb \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15
```

### 连接数据库

```bash
# 命令行连接
psql -h localhost -U postgres -d mydb

# 或使用 URL
psql postgresql://postgres:password@localhost:5432/mydb
```

## 基本操作

### 数据库操作

```sql
-- 创建数据库
CREATE DATABASE mydb;
CREATE DATABASE mydb WITH ENCODING 'UTF8' LC_COLLATE='zh_CN.UTF-8';

-- 查看所有数据库
\l
SELECT datname FROM pg_database;

-- 切换数据库
\c mydb

-- 查看当前数据库
SELECT current_database();

-- 删除数据库
DROP DATABASE mydb;
DROP DATABASE IF EXISTS mydb;

-- 重命名数据库
ALTER DATABASE mydb RENAME TO newdb;
```

### 模式（Schema）操作

```sql
-- 创建模式
CREATE SCHEMA myschema;

-- 查看所有模式
\dn
SELECT schema_name FROM information_schema.schemata;

-- 设置搜索路径
SET search_path TO myschema, public;

-- 删除模式
DROP SCHEMA myschema;
DROP SCHEMA myschema CASCADE;  -- 级联删除
```

### 表操作

```sql
-- 创建表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    age INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 查看所有表
\dt
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 查看表结构
\d users
\d+ users  -- 详细信息

-- 修改表
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ALTER COLUMN age TYPE SMALLINT;
ALTER TABLE users RENAME COLUMN age TO user_age;
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users RENAME TO members;

-- 删除表
DROP TABLE users;
DROP TABLE IF EXISTS users CASCADE;

-- 清空表
TRUNCATE TABLE users;
TRUNCATE TABLE users RESTART IDENTITY;  -- 重置序列
```

## 数据类型

### 数值类型

```sql
-- 整数类型
SMALLINT        -- 2字节，-32768 到 32767
INTEGER (INT)   -- 4字节，-2147483648 到 2147483647
BIGINT          -- 8字节

-- 自增类型
SERIAL          -- 自增整数
BIGSERIAL       -- 自增大整数

-- 浮点类型
REAL            -- 4字节，单精度
DOUBLE PRECISION -- 8字节，双精度
NUMERIC(p, s)   -- 精确小数
DECIMAL(p, s)   -- 同 NUMERIC

-- 示例
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    price NUMERIC(10, 2),
    stock INTEGER,
    rating REAL
);
```

### 字符串类型

```sql
-- 字符类型
CHAR(n)         -- 定长字符串
VARCHAR(n)      -- 变长字符串
TEXT            -- 无限长度文本

-- 示例
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    content TEXT,
    author CHAR(50)
);
```

### 日期时间类型

```sql
DATE            -- 日期
TIME            -- 时间
TIMESTAMP       -- 日期时间
TIMESTAMPTZ     -- 带时区的日期时间
INTERVAL        -- 时间间隔

-- 示例
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_date DATE,
    event_time TIME,
    event_datetime TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 时间间隔
SELECT NOW() + INTERVAL '1 day';
SELECT NOW() - INTERVAL '1 hour';
```

### 特殊类型

```sql
-- 布尔类型
BOOLEAN         -- true/false

-- JSON 类型
JSON            -- JSON 数据
JSONB           -- 二进制 JSON（推荐）

-- 数组类型
INTEGER[]       -- 整数数组
TEXT[]          -- 文本数组

-- UUID 类型
UUID            -- 通用唯一标识符

-- 示例
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50),
    tags TEXT[],
    metadata JSONB,
    is_active BOOLEAN DEFAULT true
);

-- 数组操作
INSERT INTO users (username, tags) 
VALUES ('john', ARRAY['admin', 'user']);

SELECT * FROM users WHERE 'admin' = ANY(tags);

-- JSON 操作
INSERT INTO users (username, metadata) 
VALUES ('alice', '{"age": 25, "city": "NYC"}');

SELECT metadata->>'age' FROM users;
SELECT * FROM users WHERE metadata->>'city' = 'NYC';
```

## CRUD 操作

### 插入数据（INSERT）

```sql
-- 插入单条记录
INSERT INTO users (username, email, age) 
VALUES ('john', 'john@example.com', 30);

-- 插入多条记录
INSERT INTO users (username, email, age) VALUES
('alice', 'alice@example.com', 25),
('bob', 'bob@example.com', 28),
('charlie', 'charlie@example.com', 35);

-- 插入并返回
INSERT INTO users (username, email) 
VALUES ('david', 'david@example.com')
RETURNING id, username;

-- 插入或更新（UPSERT）
INSERT INTO users (id, username, email) 
VALUES (1, 'john', 'john@example.com')
ON CONFLICT (id) 
DO UPDATE SET email = EXCLUDED.email;

-- 插入忽略冲突
INSERT INTO users (username, email) 
VALUES ('john', 'john@example.com')
ON CONFLICT (username) DO NOTHING;
```

### 查询数据（SELECT）

```sql
-- 基本查询
SELECT * FROM users;
SELECT username, email FROM users;

-- 条件查询
SELECT * FROM users WHERE age > 25;
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
SELECT * FROM users WHERE username IN ('john', 'alice');
SELECT * FROM users WHERE email LIKE '%@example.com';
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;

-- 正则表达式
SELECT * FROM users WHERE username ~ '^john';
SELECT * FROM users WHERE email ~* '@example\.com$';  -- 不区分大小写

-- 排序
SELECT * FROM users ORDER BY age ASC;
SELECT * FROM users ORDER BY age DESC, username ASC;

-- 限制结果
SELECT * FROM users LIMIT 10;
SELECT * FROM users LIMIT 10 OFFSET 20;

-- 去重
SELECT DISTINCT age FROM users;

-- 聚合函数
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT age) FROM users;
SELECT AVG(age) FROM users;
SELECT SUM(age) FROM users;
SELECT MAX(age), MIN(age) FROM users;

-- 分组
SELECT age, COUNT(*) as count 
FROM users 
GROUP BY age;

SELECT age, COUNT(*) as count 
FROM users 
GROUP BY age 
HAVING COUNT(*) > 1;

-- 多表查询
SELECT u.username, o.order_no 
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

SELECT u.username, o.order_no 
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

SELECT u.username, o.order_no 
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

SELECT u.username, o.order_no 
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;

-- 子查询
SELECT * FROM users 
WHERE age > (SELECT AVG(age) FROM users);

-- CTE（公共表表达式）
WITH young_users AS (
    SELECT * FROM users WHERE age < 30
)
SELECT * FROM young_users WHERE username LIKE 'j%';
```

### 更新数据（UPDATE）

```sql
-- 更新单条记录
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;

-- 更新多个字段
UPDATE users 
SET email = 'newemail@example.com', age = 31 
WHERE id = 1;

-- 批量更新
UPDATE users SET age = age + 1 WHERE age < 30;

-- 使用子查询更新
UPDATE users 
SET age = (SELECT AVG(age) FROM users) 
WHERE id = 1;

-- 更新并返回
UPDATE users 
SET age = 31 
WHERE id = 1
RETURNING *;

-- 从另一个表更新
UPDATE users u
SET email = t.new_email
FROM temp_emails t
WHERE u.id = t.user_id;
```

### 删除数据（DELETE）

```sql
-- 删除单条记录
DELETE FROM users WHERE id = 1;

-- 批量删除
DELETE FROM users WHERE age < 18;

-- 删除所有记录
DELETE FROM users;

-- 删除并返回
DELETE FROM users 
WHERE id = 1
RETURNING *;

-- 清空表（更快）
TRUNCATE TABLE users;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
```

## 索引

### 索引类型

```sql
-- B-tree 索引（默认）
CREATE INDEX idx_username ON users(username);

-- 唯一索引
CREATE UNIQUE INDEX idx_email ON users(email);

-- 复合索引
CREATE INDEX idx_name_age ON users(username, age);

-- 部分索引
CREATE INDEX idx_active_users ON users(username) WHERE is_active = true;

-- 表达式索引
CREATE INDEX idx_lower_username ON users(LOWER(username));

-- GIN 索引（用于数组、JSON、全文搜索）
CREATE INDEX idx_tags ON users USING GIN(tags);
CREATE INDEX idx_metadata ON users USING GIN(metadata);

-- GiST 索引（用于地理数据）
CREATE INDEX idx_location ON places USING GIST(location);

-- Hash 索引
CREATE INDEX idx_hash_email ON users USING HASH(email);

-- 查看索引
\di
SELECT * FROM pg_indexes WHERE tablename = 'users';

-- 删除索引
DROP INDEX idx_username;
DROP INDEX IF EXISTS idx_username;

-- 重建索引
REINDEX INDEX idx_username;
REINDEX TABLE users;

-- 查看索引使用情况
EXPLAIN ANALYZE SELECT * FROM users WHERE username = 'john';
```

## 约束

### 主键约束

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50)
);

-- 或
CREATE TABLE users (
    id SERIAL,
    username VARCHAR(50),
    PRIMARY KEY (id)
);

-- 复合主键
CREATE TABLE user_roles (
    user_id INTEGER,
    role_id INTEGER,
    PRIMARY KEY (user_id, role_id)
);
```

### 外键约束

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_no VARCHAR(50)
);

-- 或
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    order_no VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 删除外键
ALTER TABLE orders DROP CONSTRAINT orders_user_id_fkey;
```

### 唯一约束

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE
);

-- 添加唯一约束
ALTER TABLE users ADD UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT uk_email UNIQUE (email);
```

### 非空约束

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- 添加非空约束
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- 删除非空约束
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
```

### 检查约束

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    age INTEGER CHECK (age >= 18),
    email VARCHAR(100) CHECK (email LIKE '%@%')
);

-- 添加检查约束
ALTER TABLE users ADD CHECK (age >= 18);
ALTER TABLE users ADD CONSTRAINT chk_age CHECK (age >= 18 AND age <= 120);
```

### 默认值约束

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    status INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加默认值
ALTER TABLE users ALTER COLUMN status SET DEFAULT 1;

-- 删除默认值
ALTER TABLE users ALTER COLUMN status DROP DEFAULT;
```

## 事务

### 事务操作

```sql
-- 开始事务
BEGIN;
-- 或
START TRANSACTION;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;

-- 示例
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

### 事务隔离级别

```sql
-- 查看隔离级别
SHOW transaction_isolation;

-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- 示例
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- 执行操作
COMMIT;
```

### 保存点

```sql
BEGIN;

INSERT INTO users (username) VALUES ('user1');
SAVEPOINT sp1;

INSERT INTO users (username) VALUES ('user2');
SAVEPOINT sp2;

-- 回滚到保存点
ROLLBACK TO sp1;

COMMIT;
```

## 视图

```sql
-- 创建视图
CREATE VIEW user_view AS
SELECT id, username, email FROM users WHERE age > 18;

-- 使用视图
SELECT * FROM user_view;

-- 更新视图
CREATE OR REPLACE VIEW user_view AS
SELECT id, username, email, age FROM users WHERE age > 18;

-- 物化视图
CREATE MATERIALIZED VIEW user_stats AS
SELECT age, COUNT(*) as count FROM users GROUP BY age;

-- 刷新物化视图
REFRESH MATERIALIZED VIEW user_stats;

-- 删除视图
DROP VIEW user_view;
DROP MATERIALIZED VIEW user_stats;
```

## 函数和存储过程

### 创建函数

```sql
-- PL/pgSQL 函数
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER AS $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    RETURN user_count;
END;
$$ LANGUAGE plpgsql;

-- 调用函数
SELECT get_user_count();

-- 带参数的函数
CREATE OR REPLACE FUNCTION get_user_by_id(user_id INTEGER)
RETURNS TABLE(id INTEGER, username VARCHAR, email VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.username, u.email 
    FROM users u 
    WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- 调用
SELECT * FROM get_user_by_id(1);

-- 删除函数
DROP FUNCTION get_user_count();
```

### 存储过程

```sql
-- 创建存储过程
CREATE OR REPLACE PROCEDURE update_user_age(
    user_id INTEGER,
    new_age INTEGER
)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE users SET age = new_age WHERE id = user_id;
    COMMIT;
END;
$$;

-- 调用存储过程
CALL update_user_age(1, 31);

-- 删除存储过程
DROP PROCEDURE update_user_age;
```

## 触发器

```sql
-- 创建触发器函数
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- 查看触发器
\dS users

-- 删除触发器
DROP TRIGGER users_update_timestamp ON users;
```

## 窗口函数

```sql
-- ROW_NUMBER - 行号
SELECT 
    username,
    age,
    ROW_NUMBER() OVER (ORDER BY age DESC) as row_num
FROM users;

-- RANK - 排名（有并列）
SELECT 
    username,
    age,
    RANK() OVER (ORDER BY age DESC) as rank
FROM users;

-- DENSE_RANK - 密集排名
SELECT 
    username,
    age,
    DENSE_RANK() OVER (ORDER BY age DESC) as dense_rank
FROM users;

-- PARTITION BY - 分组
SELECT 
    department,
    username,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg
FROM employees;

-- LAG/LEAD - 访问前后行
SELECT 
    username,
    age,
    LAG(age) OVER (ORDER BY age) as prev_age,
    LEAD(age) OVER (ORDER BY age) as next_age
FROM users;
```

## 全文搜索

```sql
-- 创建全文搜索索引
CREATE INDEX idx_content_search ON articles 
USING GIN(to_tsvector('english', content));

-- 全文搜索
SELECT * FROM articles 
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'postgresql & database');

-- 搜索排名
SELECT 
    title,
    ts_rank(to_tsvector('english', content), to_tsquery('english', 'postgresql')) as rank
FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'postgresql')
ORDER BY rank DESC;
```

## JSON 操作

```sql
-- 创建表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    metadata JSONB
);

-- 插入 JSON 数据
INSERT INTO users (username, metadata) VALUES
('john', '{"age": 30, "city": "NYC", "hobbies": ["reading", "coding"]}'),
('alice', '{"age": 25, "city": "LA", "hobbies": ["music", "travel"]}');

-- 查询 JSON 字段
SELECT metadata->>'age' as age FROM users;
SELECT metadata->'hobbies'->0 as first_hobby FROM users;

-- JSON 条件查询
SELECT * FROM users WHERE metadata->>'city' = 'NYC';
SELECT * FROM users WHERE (metadata->>'age')::int > 25;
SELECT * FROM users WHERE metadata @> '{"city": "NYC"}';
SELECT * FROM users WHERE metadata ? 'age';

-- 更新 JSON 字段
UPDATE users 
SET metadata = jsonb_set(metadata, '{age}', '31')
WHERE username = 'john';

-- 删除 JSON 字段
UPDATE users 
SET metadata = metadata - 'city'
WHERE username = 'john';

-- JSON 聚合
SELECT jsonb_agg(username) FROM users;
SELECT jsonb_object_agg(username, metadata) FROM users;
```

## 性能优化

### 查询优化

```sql
-- 使用 EXPLAIN 分析
EXPLAIN SELECT * FROM users WHERE age = 25;
EXPLAIN ANALYZE SELECT * FROM users WHERE age = 25;

-- 避免 SELECT *
SELECT id, username, email FROM users;

-- 使用索引
CREATE INDEX idx_age ON users(age);

-- 避免在 WHERE 中使用函数
-- ❌ 不好
SELECT * FROM users WHERE EXTRACT(YEAR FROM created_at) = 2024;
-- ✅ 好
SELECT * FROM users 
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- 使用 LIMIT
SELECT * FROM users LIMIT 100;

-- 使用 EXISTS 代替 IN
-- ❌ 不好
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);
-- ✅ 好
SELECT * FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

### 表优化

```sql
-- 分析表
ANALYZE users;

-- 清理表
VACUUM users;
VACUUM FULL users;

-- 自动清理配置
ALTER TABLE users SET (autovacuum_enabled = true);
```

## 备份与恢复

### 备份

```bash
# 备份单个数据库
pg_dump mydb > mydb_backup.sql

# 备份所有数据库
pg_dumpall > all_backup.sql

# 自定义格式备份（推荐）
pg_dump -Fc mydb > mydb_backup.dump

# 只备份表结构
pg_dump --schema-only mydb > structure.sql

# 只备份数据
pg_dump --data-only mydb > data.sql

# 备份特定表
pg_dump -t users mydb > users_backup.sql
```

### 恢复

```bash
# 恢复 SQL 格式
psql mydb < mydb_backup.sql

# 恢复自定义格式
pg_restore -d mydb mydb_backup.dump

# 恢复到新数据库
createdb newdb
pg_restore -d newdb mydb_backup.dump
```

## 用户权限管理

```sql
-- 创建用户
CREATE USER username WITH PASSWORD 'password';
CREATE USER username WITH SUPERUSER PASSWORD 'password';

-- 修改密码
ALTER USER username WITH PASSWORD 'new_password';

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE mydb TO username;
GRANT SELECT, INSERT, UPDATE ON users TO username;
GRANT ALL ON ALL TABLES IN SCHEMA public TO username;

-- 撤销权限
REVOKE ALL PRIVILEGES ON DATABASE mydb FROM username;
REVOKE SELECT ON users FROM username;

-- 查看权限
\du
SELECT * FROM pg_roles;

-- 删除用户
DROP USER username;
```

## 配置优化

### postgresql.conf 配置

```ini
# 内存配置
shared_buffers = 256MB          # 共享缓冲区
effective_cache_size = 1GB      # 有效缓存大小
work_mem = 4MB                  # 工作内存
maintenance_work_mem = 64MB     # 维护工作内存

# 连接配置
max_connections = 100           # 最大连接数
superuser_reserved_connections = 3

# 日志配置
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'all'
log_duration = on
log_min_duration_statement = 1000  # 记录慢查询（毫秒）

# 检查点配置
checkpoint_timeout = 5min
checkpoint_completion_target = 0.9

# WAL 配置
wal_level = replica
max_wal_size = 1GB
min_wal_size = 80MB
```

## 最佳实践

1. **使用合适的数据类型** - 节省空间，提高性能
2. **合理使用索引** - 提高查询速度
3. **使用 JSONB 而不是 JSON** - 更好的性能
4. **定期 VACUUM** - 回收空间，更新统计信息
5. **使用连接池** - 提高并发性能
6. **监控慢查询** - 及时优化
7. **定期备份** - 防止数据丢失
8. **使用事务** - 保证数据一致性

## 常见问题

### 1. 连接数过多

```sql
-- 查看当前连接数
SELECT count(*) FROM pg_stat_activity;

-- 查看最大连接数
SHOW max_connections;

-- 修改最大连接数（需要重启）
ALTER SYSTEM SET max_connections = 200;

-- 终止连接
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'mydb' AND pid <> pg_backend_pid();
```

### 2. 查看锁信息

```sql
-- 查看锁
SELECT * FROM pg_locks;

-- 查看阻塞
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.usename AS blocked_user,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS blocking_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

## 总结

PostgreSQL 是一个功能强大的关系型数据库：

- ✅ 开源免费，功能丰富
- ✅ 完全支持 ACID 事务
- ✅ 丰富的数据类型（JSON、数组等）
- ✅ 强大的扩展性
- ✅ 高级查询特性（窗口函数、CTE等）

掌握 PostgreSQL 对于现代应用开发非常重要。

## 参考资源

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [PostgreSQL 中文文档](http://www.postgres.cn/docs/14/)
- [PostgreSQL 修炼之道](https://book.douban.com/subject/26389922/)
