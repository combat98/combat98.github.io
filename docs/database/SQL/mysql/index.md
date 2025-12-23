---
next:
  text: 'Oracle'
  link: '/database/SQL/Oracle/index'
---

# MySQL

## 简介

MySQL 是最流行的开源关系型数据库管理系统，由瑞典 MySQL AB 公司开发，目前属于 Oracle 公司。

### 特点

- **开源免费** - 社区版完全免费
- **性能优秀** - 高性能的存储引擎
- **跨平台** - 支持多种操作系统
- **易于使用** - 简单易学
- **可扩展** - 支持集群和分布式
- **社区活跃** - 丰富的资源和工具

## 安装配置

### Windows 安装

```bash
# 下载 MySQL 安装包
https://dev.mysql.com/downloads/mysql/

# 或使用 Chocolatey
choco install mysql

# 启动服务
net start mysql
```

### Linux 安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server

# 启动服务
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 安全配置
sudo mysql_secure_installation
```

### Docker 安装

```bash
# 拉取镜像
docker pull mysql:8.0

# 运行容器
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
```

## 基本操作

### 连接数据库

```bash
# 命令行连接
mysql -h localhost -u root -p

# 指定数据库
mysql -h localhost -u root -p database_name
```

### 数据库操作

```sql
-- 创建数据库
CREATE DATABASE mydb;
CREATE DATABASE IF NOT EXISTS mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查看所有数据库
SHOW DATABASES;

-- 使用数据库
USE mydb;

-- 查看当前数据库
SELECT DATABASE();

-- 删除数据库
DROP DATABASE mydb;
DROP DATABASE IF EXISTS mydb;
```

### 表操作

```sql
-- 创建表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESC users;
SHOW CREATE TABLE users;

-- 修改表
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users MODIFY COLUMN age TINYINT;
ALTER TABLE users CHANGE COLUMN age user_age INT;
ALTER TABLE users DROP COLUMN phone;
ALTER TABLE users RENAME TO members;

-- 删除表
DROP TABLE users;
DROP TABLE IF EXISTS users;

-- 清空表
TRUNCATE TABLE users;
```

## 数据类型

### 数值类型

```sql
-- 整数类型
TINYINT     -- 1字节，-128 到 127
SMALLINT    -- 2字节，-32768 到 32767
MEDIUMINT   -- 3字节
INT         -- 4字节，-2147483648 到 2147483647
BIGINT      -- 8字节

-- 浮点类型
FLOAT       -- 4字节，单精度
DOUBLE      -- 8字节，双精度
DECIMAL(M,D) -- 精确小数，M总位数，D小数位数

-- 示例
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    price DECIMAL(10, 2),  -- 最大 99999999.99
    stock INT UNSIGNED,    -- 无符号整数
    rating FLOAT
);
```

### 字符串类型

```sql
-- 定长字符串
CHAR(n)     -- 固定长度，最大255字符

-- 变长字符串
VARCHAR(n)  -- 可变长度，最大65535字节

-- 文本类型
TINYTEXT    -- 最大255字节
TEXT        -- 最大65535字节
MEDIUMTEXT  -- 最大16MB
LONGTEXT    -- 最大4GB

-- 二进制类型
BINARY(n)
VARBINARY(n)
BLOB

-- 示例
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    content TEXT,
    author CHAR(50)
);
```

### 日期时间类型

```sql
DATE        -- 日期，格式：YYYY-MM-DD
TIME        -- 时间，格式：HH:MM:SS
DATETIME    -- 日期时间，格式：YYYY-MM-DD HH:MM:SS
TIMESTAMP   -- 时间戳，自动更新
YEAR        -- 年份

-- 示例
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_date DATE,
    event_time TIME,
    event_datetime DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## CRUD 操作

### 插入数据（INSERT）

```sql
-- 插入单条记录
INSERT INTO users (username, email, age) 
VALUES ('john', 'john@example.com', 25);

-- 插入多条记录
INSERT INTO users (username, email, age) VALUES
('alice', 'alice@example.com', 30),
('bob', 'bob@example.com', 28),
('charlie', 'charlie@example.com', 35);

-- 插入并返回ID
INSERT INTO users (username, email) VALUES ('david', 'david@example.com');
SELECT LAST_INSERT_ID();

-- 插入或更新（存在则更新）
INSERT INTO users (id, username, email) 
VALUES (1, 'john', 'john@example.com')
ON DUPLICATE KEY UPDATE email = 'john@example.com';

-- 插入忽略重复
INSERT IGNORE INTO users (username, email) 
VALUES ('john', 'john@example.com');
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

-- 排序
SELECT * FROM users ORDER BY age ASC;
SELECT * FROM users ORDER BY age DESC, username ASC;

-- 限制结果
SELECT * FROM users LIMIT 10;
SELECT * FROM users LIMIT 10 OFFSET 20;  -- 跳过20条，取10条
SELECT * FROM users LIMIT 20, 10;        -- 同上

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
HAVING count > 1;

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
```

### 更新数据（UPDATE）

```sql
-- 更新单条记录
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;

-- 更新多个字段
UPDATE users 
SET email = 'newemail@example.com', age = 26 
WHERE id = 1;

-- 批量更新
UPDATE users SET age = age + 1 WHERE age < 30;

-- 使用子查询更新
UPDATE users 
SET age = (SELECT AVG(age) FROM users) 
WHERE id = 1;
```

### 删除数据（DELETE）

```sql
-- 删除单条记录
DELETE FROM users WHERE id = 1;

-- 批量删除
DELETE FROM users WHERE age < 18;

-- 删除所有记录（保留表结构）
DELETE FROM users;

-- 清空表（更快，重置自增ID）
TRUNCATE TABLE users;
```

## 索引

### 索引类型

```sql
-- 主键索引
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT
);

-- 唯一索引
CREATE UNIQUE INDEX idx_username ON users(username);
ALTER TABLE users ADD UNIQUE INDEX idx_email (email);

-- 普通索引
CREATE INDEX idx_age ON users(age);
ALTER TABLE users ADD INDEX idx_created_at (created_at);

-- 组合索引
CREATE INDEX idx_name_age ON users(username, age);

-- 全文索引
CREATE FULLTEXT INDEX idx_content ON articles(content);

-- 查看索引
SHOW INDEX FROM users;

-- 删除索引
DROP INDEX idx_age ON users;
ALTER TABLE users DROP INDEX idx_age;
```

### 索引优化

```sql
-- 使用 EXPLAIN 分析查询
EXPLAIN SELECT * FROM users WHERE age = 25;

-- 强制使用索引
SELECT * FROM users FORCE INDEX (idx_age) WHERE age = 25;

-- 忽略索引
SELECT * FROM users IGNORE INDEX (idx_age) WHERE age = 25;
```

## 约束

### 主键约束

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50)
);

-- 或
CREATE TABLE users (
    id INT AUTO_INCREMENT,
    username VARCHAR(50),
    PRIMARY KEY (id)
);

-- 复合主键
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id)
);
```

### 外键约束

```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_no VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 删除外键
ALTER TABLE orders DROP FOREIGN KEY fk_user_id;
```

### 唯一约束

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE
);

-- 添加唯一约束
ALTER TABLE users ADD UNIQUE (email);
```

### 非空约束

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL
);
```

### 默认值约束

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 检查约束

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    age INT CHECK (age >= 18),
    email VARCHAR(100) CHECK (email LIKE '%@%')
);
```

## 事务

### 事务操作

```sql
-- 开始事务
START TRANSACTION;
-- 或
BEGIN;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;

-- 示例
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

### 事务隔离级别

```sql
-- 查看隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

### 保存点

```sql
START TRANSACTION;

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

-- 删除视图
DROP VIEW user_view;
```

## 存储过程

```sql
-- 创建存储过程
DELIMITER //
CREATE PROCEDURE GetUserById(IN userId INT)
BEGIN
    SELECT * FROM users WHERE id = userId;
END //
DELIMITER ;

-- 调用存储过程
CALL GetUserById(1);

-- 带输出参数的存储过程
DELIMITER //
CREATE PROCEDURE GetUserCount(OUT userCount INT)
BEGIN
    SELECT COUNT(*) INTO userCount FROM users;
END //
DELIMITER ;

-- 调用
CALL GetUserCount(@count);
SELECT @count;

-- 删除存储过程
DROP PROCEDURE IF EXISTS GetUserById;
```

## 触发器

```sql
-- 创建触发器
DELIMITER //
CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.created_at = NOW();
END //
DELIMITER ;

-- 查看触发器
SHOW TRIGGERS;

-- 删除触发器
DROP TRIGGER IF EXISTS before_user_insert;
```

## 函数

### 字符串函数

```sql
SELECT CONCAT('Hello', ' ', 'World');           -- 拼接字符串
SELECT CONCAT_WS(',', 'A', 'B', 'C');          -- 使用分隔符拼接
SELECT LENGTH('Hello');                         -- 字符串长度
SELECT CHAR_LENGTH('你好');                     -- 字符数
SELECT UPPER('hello');                          -- 转大写
SELECT LOWER('HELLO');                          -- 转小写
SELECT SUBSTRING('Hello World', 1, 5);         -- 截取字符串
SELECT TRIM('  Hello  ');                      -- 去除空格
SELECT REPLACE('Hello World', 'World', 'MySQL'); -- 替换
SELECT LEFT('Hello', 3);                       -- 左边3个字符
SELECT RIGHT('Hello', 3);                      -- 右边3个字符
```

### 数值函数

```sql
SELECT ABS(-10);                -- 绝对值
SELECT CEIL(3.14);              -- 向上取整
SELECT FLOOR(3.14);             -- 向下取整
SELECT ROUND(3.14159, 2);       -- 四舍五入
SELECT MOD(10, 3);              -- 取模
SELECT POWER(2, 3);             -- 幂运算
SELECT SQRT(16);                -- 平方根
SELECT RAND();                  -- 随机数 0-1
```

### 日期函数

```sql
SELECT NOW();                           -- 当前日期时间
SELECT CURDATE();                       -- 当前日期
SELECT CURTIME();                       -- 当前时间
SELECT DATE('2024-01-15 10:30:00');    -- 提取日期
SELECT TIME('2024-01-15 10:30:00');    -- 提取时间
SELECT YEAR(NOW());                     -- 年份
SELECT MONTH(NOW());                    -- 月份
SELECT DAY(NOW());                      -- 日
SELECT DATE_ADD(NOW(), INTERVAL 1 DAY); -- 加1天
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH); -- 减1月
SELECT DATEDIFF('2024-12-31', '2024-01-01'); -- 日期差
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'); -- 格式化
```

### 聚合函数

```sql
SELECT COUNT(*) FROM users;             -- 计数
SELECT SUM(age) FROM users;             -- 求和
SELECT AVG(age) FROM users;             -- 平均值
SELECT MAX(age) FROM users;             -- 最大值
SELECT MIN(age) FROM users;             -- 最小值
SELECT GROUP_CONCAT(username) FROM users; -- 拼接
```

## 性能优化

### 查询优化

```sql
-- 使用 EXPLAIN 分析
EXPLAIN SELECT * FROM users WHERE age = 25;

-- 避免 SELECT *
SELECT id, username, email FROM users;

-- 使用索引
CREATE INDEX idx_age ON users(age);

-- 避免在 WHERE 中使用函数
-- ❌ 不好
SELECT * FROM users WHERE YEAR(created_at) = 2024;
-- ✅ 好
SELECT * FROM users WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- 使用 LIMIT
SELECT * FROM users LIMIT 100;

-- 避免子查询，使用 JOIN
-- ❌ 不好
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);
-- ✅ 好
SELECT DISTINCT u.* FROM users u INNER JOIN orders o ON u.id = o.user_id;
```

### 索引优化

```sql
-- 最左前缀原则
CREATE INDEX idx_name_age_email ON users(username, age, email);

-- 可以使用索引的查询
SELECT * FROM users WHERE username = 'john';
SELECT * FROM users WHERE username = 'john' AND age = 25;
SELECT * FROM users WHERE username = 'john' AND age = 25 AND email = 'john@example.com';

-- 不能使用索引的查询
SELECT * FROM users WHERE age = 25;
SELECT * FROM users WHERE email = 'john@example.com';
```

### 表优化

```sql
-- 分析表
ANALYZE TABLE users;

-- 优化表
OPTIMIZE TABLE users;

-- 检查表
CHECK TABLE users;

-- 修复表
REPAIR TABLE users;
```

## 备份与恢复

### 备份

```bash
# 备份单个数据库
mysqldump -u root -p mydb > mydb_backup.sql

# 备份多个数据库
mysqldump -u root -p --databases db1 db2 > backup.sql

# 备份所有数据库
mysqldump -u root -p --all-databases > all_backup.sql

# 只备份表结构
mysqldump -u root -p --no-data mydb > structure.sql

# 只备份数据
mysqldump -u root -p --no-create-info mydb > data.sql
```

### 恢复

```bash
# 恢复数据库
mysql -u root -p mydb < mydb_backup.sql

# 或在 MySQL 中执行
mysql> source /path/to/backup.sql;
```

## 用户权限管理

```sql
-- 创建用户
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'username'@'%' IDENTIFIED BY 'password';  -- 允许任何主机

-- 授予权限
GRANT ALL PRIVILEGES ON mydb.* TO 'username'@'localhost';
GRANT SELECT, INSERT, UPDATE ON mydb.users TO 'username'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 查看权限
SHOW GRANTS FOR 'username'@'localhost';

-- 撤销权限
REVOKE ALL PRIVILEGES ON mydb.* FROM 'username'@'localhost';

-- 删除用户
DROP USER 'username'@'localhost';

-- 修改密码
ALTER USER 'username'@'localhost' IDENTIFIED BY 'new_password';
```

## 常用配置

### my.cnf 配置文件

```ini
[mysqld]
# 端口
port = 3306

# 数据目录
datadir = /var/lib/mysql

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# 最大连接数
max_connections = 200

# 缓冲池大小
innodb_buffer_pool_size = 1G

# 日志
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# 二进制日志
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 7
```

## 最佳实践

1. **使用合适的数据类型** - 节省空间，提高性能
2. **合理使用索引** - 提高查询速度，但不要过度索引
3. **避免 SELECT *** - 只查询需要的字段
4. **使用事务** - 保证数据一致性
5. **定期备份** - 防止数据丢失
6. **监控慢查询** - 及时优化
7. **使用连接池** - 提高并发性能
8. **分库分表** - 应对大数据量

## 常见问题

### 1. 中文乱码

```sql
-- 查看字符集
SHOW VARIABLES LIKE 'character%';

-- 设置字符集
ALTER DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 忘记 root 密码

```bash
# 1. 停止 MySQL 服务
sudo systemctl stop mysqld

# 2. 跳过权限验证启动
sudo mysqld_safe --skip-grant-tables &

# 3. 登录并修改密码
mysql -u root
mysql> FLUSH PRIVILEGES;
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';

# 4. 重启 MySQL
sudo systemctl restart mysqld
```

### 3. 连接数过多

```sql
-- 查看当前连接数
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';

-- 查看最大连接数
SHOW VARIABLES LIKE 'max_connections';

-- 修改最大连接数
SET GLOBAL max_connections = 500;
```

## 总结

MySQL 是最流行的关系型数据库：

- ✅ 开源免费，性能优秀
- ✅ 支持事务，ACID 特性
- ✅ 丰富的数据类型和函数
- ✅ 强大的索引和查询优化
- ✅ 完善的备份和恢复机制

掌握 MySQL 是后端开发者的必备技能。

## 参考资源

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [MySQL 必知必会](https://book.douban.com/subject/3354490/)
- [高性能 MySQL](https://book.douban.com/subject/23008813/)
