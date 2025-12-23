---
prev:
  text: 'SQLServer'
  link: '/database/SQL/SQLServer/index'
---

# Oracle Database

## 简介

Oracle Database 是由甲骨文公司开发的关系型数据库管理系统，是世界上使用最广泛的企业级数据库之一。

### 特点

- **企业级** - 高性能、高可用、高安全
- **可扩展性** - 支持大规模数据和高并发
- **完整性** - 完善的数据完整性约束
- **PL/SQL** - 强大的过程化语言
- **RAC** - 真正的应用集群
- **跨平台** - 支持多种操作系统

### 版本

- **Express Edition (XE)** - 免费版，适合学习和小型应用
- **Standard Edition** - 标准版
- **Enterprise Edition** - 企业版，功能最全

## 安装配置

### Linux 安装

```bash
# 下载 Oracle Database
# https://www.oracle.com/database/technologies/

# 安装依赖
sudo yum install oracle-database-preinstall-19c

# 安装 Oracle
sudo rpm -ivh oracle-database-ee-19c-1.0-1.x86_64.rpm

# 创建数据库
sudo /etc/init.d/oracledb_ORCLCDB-19c configure

# 设置环境变量
export ORACLE_HOME=/opt/oracle/product/19c/dbhome_1
export PATH=$ORACLE_HOME/bin:$PATH
export ORACLE_SID=ORCLCDB
```

### Docker 安装

```bash
# 拉取镜像
docker pull container-registry.oracle.com/database/express:21c

# 运行容器
docker run -d \
  --name oracle \
  -p 1521:1521 \
  -p 5500:5500 \
  -e ORACLE_PWD=YourPassword123 \
  -v oracle-data:/opt/oracle/oradata \
  container-registry.oracle.com/database/express:21c
```

### 连接数据库

```bash
# 使用 SQL*Plus
sqlplus system/password@localhost:1521/XEPDB1

# 或
sqlplus / as sysdba
```

## 基本操作

### 用户和表空间

```sql
-- 创建表空间
CREATE TABLESPACE mydata
DATAFILE '/opt/oracle/oradata/mydata.dbf' SIZE 100M
AUTOEXTEND ON NEXT 10M MAXSIZE 500M;

-- 创建用户
CREATE USER myuser IDENTIFIED BY password
DEFAULT TABLESPACE mydata
TEMPORARY TABLESPACE temp
QUOTA UNLIMITED ON mydata;

-- 授予权限
GRANT CONNECT, RESOURCE TO myuser;
GRANT CREATE SESSION TO myuser;
GRANT CREATE TABLE TO myuser;
GRANT CREATE VIEW TO myuser;

-- 切换用户
CONN myuser/password;

-- 查看当前用户
SELECT USER FROM DUAL;

-- 删除用户
DROP USER myuser CASCADE;

-- 删除表空间
DROP TABLESPACE mydata INCLUDING CONTENTS AND DATAFILES;
```

### 表操作

```sql
-- 创建表
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    email VARCHAR2(100) NOT NULL,
    age NUMBER,
    is_active NUMBER(1) DEFAULT 1,
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE DEFAULT SYSDATE
);

-- 创建序列（用于自增ID）
CREATE SEQUENCE users_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- 查看所有表
SELECT table_name FROM user_tables;

-- 查看表结构
DESC users;

-- 修改表
ALTER TABLE users ADD phone VARCHAR2(20);
ALTER TABLE users MODIFY age NUMBER(3);
ALTER TABLE users RENAME COLUMN age TO user_age;
ALTER TABLE users DROP COLUMN phone;
RENAME users TO members;

-- 删除表
DROP TABLE users;
DROP TABLE users CASCADE CONSTRAINTS;

-- 清空表
TRUNCATE TABLE users;
```

## 数据类型

### 数值类型

```sql
-- 数值类型
NUMBER          -- 数值类型
NUMBER(p)       -- 精度为 p 的整数
NUMBER(p, s)    -- 精度为 p，小数位为 s
INTEGER         -- 整数
FLOAT           -- 浮点数
BINARY_FLOAT    -- 32位浮点数
BINARY_DOUBLE   -- 64位浮点数

-- 示例
CREATE TABLE products (
    id NUMBER PRIMARY KEY,
    price NUMBER(10, 2),
    stock INTEGER,
    rating BINARY_FLOAT
);
```

### 字符串类型

```sql
-- 字符类型
CHAR(n)         -- 定长字符串，最大 2000 字节
VARCHAR2(n)     -- 变长字符串，最大 4000 字节
NCHAR(n)        -- 定长 Unicode 字符串
NVARCHAR2(n)    -- 变长 Unicode 字符串
CLOB            -- 大文本，最大 4GB
NCLOB           -- Unicode 大文本

-- 示例
CREATE TABLE articles (
    id NUMBER PRIMARY KEY,
    title VARCHAR2(200),
    content CLOB,
    author VARCHAR2(50)
);
```

### 日期时间类型

```sql
DATE            -- 日期时间（精度到秒）
TIMESTAMP       -- 时间戳（精度到纳秒）
TIMESTAMP WITH TIME ZONE        -- 带时区的时间戳
TIMESTAMP WITH LOCAL TIME ZONE  -- 本地时区时间戳
INTERVAL YEAR TO MONTH          -- 年月间隔
INTERVAL DAY TO SECOND          -- 日秒间隔

-- 示例
CREATE TABLE events (
    id NUMBER PRIMARY KEY,
    event_date DATE,
    event_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP
);
```

### 特殊类型

```sql
-- 二进制类型
RAW(n)          -- 原始二进制数据，最大 2000 字节
LONG RAW        -- 长原始二进制数据，最大 2GB
BLOB            -- 二进制大对象，最大 4GB

-- XML 类型
XMLTYPE         -- XML 数据

-- 示例
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    username VARCHAR2(50),
    profile_image BLOB,
    settings XMLTYPE
);
```

## CRUD 操作

### 插入数据（INSERT）

```sql
-- 插入单条记录
INSERT INTO users (id, username, email, age) 
VALUES (users_seq.NEXTVAL, 'john', 'john@example.com', 30);

-- 插入多条记录（Oracle 23c+）
INSERT ALL
    INTO users (id, username, email, age) VALUES (users_seq.NEXTVAL, 'alice', 'alice@example.com', 25)
    INTO users (id, username, email, age) VALUES (users_seq.NEXTVAL, 'bob', 'bob@example.com', 28)
SELECT * FROM DUAL;

-- 从另一个表插入
INSERT INTO users (id, username, email)
SELECT users_seq.NEXTVAL, name, email FROM temp_users;

-- 提交事务
COMMIT;
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

-- 限制结果（Oracle 12c+）
SELECT * FROM users FETCH FIRST 10 ROWS ONLY;
SELECT * FROM users ORDER BY age DESC FETCH FIRST 10 ROWS ONLY;

-- 分页（Oracle 12c+）
SELECT * FROM users 
ORDER BY id 
OFFSET 20 ROWS 
FETCH NEXT 10 ROWS ONLY;

-- 旧版本分页
SELECT * FROM (
    SELECT a.*, ROWNUM rnum FROM (
        SELECT * FROM users ORDER BY id
    ) a WHERE ROWNUM <= 30
) WHERE rnum > 20;

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

-- WITH 子句（CTE）
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

-- 从另一个表更新
UPDATE users u
SET email = (SELECT new_email FROM temp_emails t WHERE t.user_id = u.id)
WHERE EXISTS (SELECT 1 FROM temp_emails t WHERE t.user_id = u.id);

-- 提交事务
COMMIT;
```

### 删除数据（DELETE）

```sql
-- 删除单条记录
DELETE FROM users WHERE id = 1;

-- 批量删除
DELETE FROM users WHERE age < 18;

-- 删除所有记录
DELETE FROM users;

-- 清空表（更快）
TRUNCATE TABLE users;

-- 提交事务
COMMIT;
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

-- 函数索引
CREATE INDEX idx_lower_username ON users(LOWER(username));

-- 位图索引（适合低基数列）
CREATE BITMAP INDEX idx_is_active ON users(is_active);

-- 反向键索引
CREATE INDEX idx_id_reverse ON users(id) REVERSE;

-- 查看索引
SELECT index_name, index_type, uniqueness 
FROM user_indexes 
WHERE table_name = 'USERS';

-- 删除索引
DROP INDEX idx_username;

-- 重建索引
ALTER INDEX idx_username REBUILD;

-- 查看索引使用情况
EXPLAIN PLAN FOR SELECT * FROM users WHERE username = 'john';
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

## 约束

### 主键约束

```sql
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    username VARCHAR2(50)
);

-- 或
CREATE TABLE users (
    id NUMBER,
    username VARCHAR2(50),
    CONSTRAINT pk_users PRIMARY KEY (id)
);

-- 复合主键
CREATE TABLE user_roles (
    user_id NUMBER,
    role_id NUMBER,
    CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id)
);
```

### 外键约束

```sql
CREATE TABLE orders (
    id NUMBER PRIMARY KEY,
    user_id NUMBER,
    order_no VARCHAR2(50),
    CONSTRAINT fk_orders_users FOREIGN KEY (user_id) 
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 删除外键
ALTER TABLE orders DROP CONSTRAINT fk_orders_users;
```

### 唯一约束

```sql
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    username VARCHAR2(50) UNIQUE,
    email VARCHAR2(100) UNIQUE
);

-- 添加唯一约束
ALTER TABLE users ADD CONSTRAINT uk_email UNIQUE (email);
```

### 检查约束

```sql
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    age NUMBER CHECK (age >= 18),
    email VARCHAR2(100) CHECK (email LIKE '%@%')
);

-- 添加检查约束
ALTER TABLE users ADD CONSTRAINT chk_age CHECK (age >= 18 AND age <= 120);
```

### 非空约束

```sql
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    username VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) NOT NULL
);

-- 添加非空约束
ALTER TABLE users MODIFY email NOT NULL;

-- 删除非空约束
ALTER TABLE users MODIFY email NULL;
```

## 事务

### 事务操作

```sql
-- Oracle 自动开始事务，无需 BEGIN

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;

-- 示例
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- 设置自动提交
SET AUTOCOMMIT ON;
SET AUTOCOMMIT OFF;
```

### 事务隔离级别

```sql
-- Oracle 支持两种隔离级别
-- READ COMMITTED（默认）
-- SERIALIZABLE

-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- 示例
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- 执行操作
COMMIT;
```

### 保存点

```sql
INSERT INTO users (id, username) VALUES (users_seq.NEXTVAL, 'user1');
SAVEPOINT sp1;

INSERT INTO users (id, username) VALUES (users_seq.NEXTVAL, 'user2');
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
EXEC DBMS_MVIEW.REFRESH('user_stats');

-- 删除视图
DROP VIEW user_view;
DROP MATERIALIZED VIEW user_stats;
```

## PL/SQL

### 存储过程

```sql
-- 创建存储过程
CREATE OR REPLACE PROCEDURE get_user_by_id(
    p_user_id IN NUMBER,
    p_username OUT VARCHAR2,
    p_email OUT VARCHAR2
) AS
BEGIN
    SELECT username, email 
    INTO p_username, p_email
    FROM users 
    WHERE id = p_user_id;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_username := NULL;
        p_email := NULL;
END;
/

-- 调用存储过程
DECLARE
    v_username VARCHAR2(50);
    v_email VARCHAR2(100);
BEGIN
    get_user_by_id(1, v_username, v_email);
    DBMS_OUTPUT.PUT_LINE('Username: ' || v_username);
    DBMS_OUTPUT.PUT_LINE('Email: ' || v_email);
END;
/

-- 删除存储过程
DROP PROCEDURE get_user_by_id;
```

### 函数

```sql
-- 创建函数
CREATE OR REPLACE FUNCTION get_user_count
RETURN NUMBER
AS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM users;
    RETURN v_count;
END;
/

-- 调用函数
SELECT get_user_count() FROM DUAL;

-- 带参数的函数
CREATE OR REPLACE FUNCTION get_user_age(p_user_id NUMBER)
RETURN NUMBER
AS
    v_age NUMBER;
BEGIN
    SELECT age INTO v_age FROM users WHERE id = p_user_id;
    RETURN v_age;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN NULL;
END;
/

-- 调用
SELECT get_user_age(1) FROM DUAL;

-- 删除函数
DROP FUNCTION get_user_count;
```

### 触发器

```sql
-- BEFORE 触发器
CREATE OR REPLACE TRIGGER trg_users_before_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    :NEW.created_at := SYSDATE;
    :NEW.updated_at := SYSDATE;
END;
/

-- AFTER 触发器
CREATE OR REPLACE TRIGGER trg_users_after_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO user_log (user_id, action, action_date)
    VALUES (:NEW.id, 'UPDATE', SYSDATE);
END;
/

-- 查看触发器
SELECT trigger_name, trigger_type, triggering_event 
FROM user_triggers 
WHERE table_name = 'USERS';

-- 禁用触发器
ALTER TRIGGER trg_users_before_insert DISABLE;

-- 启用触发器
ALTER TRIGGER trg_users_before_insert ENABLE;

-- 删除触发器
DROP TRIGGER trg_users_before_insert;
```

### 包（Package）

```sql
-- 创建包规范
CREATE OR REPLACE PACKAGE user_pkg AS
    PROCEDURE get_user_by_id(
        p_user_id IN NUMBER,
        p_username OUT VARCHAR2,
        p_email OUT VARCHAR2
    );
    
    FUNCTION get_user_count RETURN NUMBER;
END user_pkg;
/

-- 创建包体
CREATE OR REPLACE PACKAGE BODY user_pkg AS
    PROCEDURE get_user_by_id(
        p_user_id IN NUMBER,
        p_username OUT VARCHAR2,
        p_email OUT VARCHAR2
    ) AS
    BEGIN
        SELECT username, email 
        INTO p_username, p_email
        FROM users 
        WHERE id = p_user_id;
    END;
    
    FUNCTION get_user_count RETURN NUMBER AS
        v_count NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_count FROM users;
        RETURN v_count;
    END;
END user_pkg;
/

-- 调用包中的过程和函数
DECLARE
    v_username VARCHAR2(50);
    v_email VARCHAR2(100);
    v_count NUMBER;
BEGIN
    user_pkg.get_user_by_id(1, v_username, v_email);
    v_count := user_pkg.get_user_count();
    DBMS_OUTPUT.PUT_LINE('Count: ' || v_count);
END;
/

-- 删除包
DROP PACKAGE user_pkg;
```

## 分析函数

```sql
-- ROW_NUMBER
SELECT 
    username,
    age,
    ROW_NUMBER() OVER (ORDER BY age DESC) as row_num
FROM users;

-- RANK
SELECT 
    username,
    age,
    RANK() OVER (ORDER BY age DESC) as rank
FROM users;

-- DENSE_RANK
SELECT 
    username,
    age,
    DENSE_RANK() OVER (ORDER BY age DESC) as dense_rank
FROM users;

-- PARTITION BY
SELECT 
    department,
    username,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg
FROM employees;

-- LAG/LEAD
SELECT 
    username,
    age,
    LAG(age) OVER (ORDER BY age) as prev_age,
    LEAD(age) OVER (ORDER BY age) as next_age
FROM users;
```

## 性能优化

### 查询优化

```sql
-- 查看执行计划
EXPLAIN PLAN FOR SELECT * FROM users WHERE age = 25;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- 或使用 AUTOTRACE
SET AUTOTRACE ON;
SELECT * FROM users WHERE age = 25;
SET AUTOTRACE OFF;

-- 避免 SELECT *
SELECT id, username, email FROM users;

-- 使用绑定变量
VARIABLE v_age NUMBER;
EXEC :v_age := 25;
SELECT * FROM users WHERE age = :v_age;

-- 使用 EXISTS 代替 IN
-- ❌ 不好
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);
-- ✅ 好
SELECT * FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
```

### 统计信息

```sql
-- 收集统计信息
EXEC DBMS_STATS.GATHER_TABLE_STATS('MYUSER', 'USERS');

-- 收集所有表的统计信息
EXEC DBMS_STATS.GATHER_SCHEMA_STATS('MYUSER');

-- 查看统计信息
SELECT table_name, num_rows, last_analyzed 
FROM user_tables;
```

## 备份与恢复

### 导出（Export）

```bash
# 使用 expdp（Data Pump）
expdp system/password DIRECTORY=dump_dir DUMPFILE=mydb.dmp SCHEMAS=myuser

# 导出表
expdp system/password DIRECTORY=dump_dir DUMPFILE=users.dmp TABLES=myuser.users

# 使用 exp（传统导出）
exp system/password FILE=mydb.dmp OWNER=myuser
```

### 导入（Import）

```bash
# 使用 impdp（Data Pump）
impdp system/password DIRECTORY=dump_dir DUMPFILE=mydb.dmp SCHEMAS=myuser

# 导入表
impdp system/password DIRECTORY=dump_dir DUMPFILE=users.dmp TABLES=myuser.users

# 使用 imp（传统导入）
imp system/password FILE=mydb.dmp FROMUSER=myuser TOUSER=newuser
```

### RMAN 备份

```bash
# 连接 RMAN
rman target /

# 完整备份
BACKUP DATABASE;

# 增量备份
BACKUP INCREMENTAL LEVEL 1 DATABASE;

# 备份归档日志
BACKUP ARCHIVELOG ALL;

# 恢复数据库
RESTORE DATABASE;
RECOVER DATABASE;
```

## 用户权限管理

```sql
-- 创建用户
CREATE USER myuser IDENTIFIED BY password;

-- 授予系统权限
GRANT CREATE SESSION TO myuser;
GRANT CREATE TABLE TO myuser;
GRANT CREATE VIEW TO myuser;
GRANT CREATE PROCEDURE TO myuser;

-- 授予角色
GRANT CONNECT, RESOURCE TO myuser;
GRANT DBA TO myuser;

-- 授予对象权限
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO myuser;
GRANT ALL ON users TO myuser;

-- 撤销权限
REVOKE CREATE TABLE FROM myuser;
REVOKE SELECT ON users FROM myuser;

-- 查看权限
SELECT * FROM user_sys_privs;
SELECT * FROM user_tab_privs;
SELECT * FROM user_role_privs;

-- 删除用户
DROP USER myuser CASCADE;
```

## 配置优化

### 初始化参数

```sql
-- 查看参数
SHOW PARAMETER sga_target;
SHOW PARAMETER pga_aggregate_target;

-- 修改参数
ALTER SYSTEM SET sga_target = 1G SCOPE=BOTH;
ALTER SYSTEM SET pga_aggregate_target = 512M SCOPE=BOTH;

-- 查看所有参数
SELECT name, value FROM v$parameter;
```

## 最佳实践

1. **使用绑定变量** - 提高性能，防止 SQL 注入
2. **合理使用索引** - 提高查询速度
3. **定期收集统计信息** - 优化执行计划
4. **使用分区表** - 处理大数据量
5. **使用 PL/SQL** - 减少网络往返
6. **定期备份** - 防止数据丢失
7. **监控性能** - 使用 AWR 报告
8. **使用连接池** - 提高并发性能

## 常见问题

### 1. 查看表空间使用情况

```sql
SELECT 
    tablespace_name,
    ROUND(SUM(bytes)/1024/1024, 2) AS size_mb,
    ROUND(SUM(maxbytes)/1024/1024, 2) AS max_size_mb
FROM dba_data_files
GROUP BY tablespace_name;
```

### 2. 查看会话信息

```sql
SELECT 
    sid,
    serial#,
    username,
    status,
    machine,
    program
FROM v$session
WHERE username IS NOT NULL;
```

### 3. 杀死会话

```sql
ALTER SYSTEM KILL SESSION 'sid,serial#';
```

### 4. 查看锁信息

```sql
SELECT 
    l.session_id,
    l.oracle_username,
    l.os_user_name,
    o.object_name,
    l.locked_mode
FROM v$locked_object l
JOIN dba_objects o ON l.object_id = o.object_id;
```

## 总结

Oracle Database 是一个功能强大的企业级数据库：

- ✅ 企业级性能和可靠性
- ✅ 强大的 PL/SQL 语言
- ✅ 完善的高可用方案（RAC、Data Guard）
- ✅ 丰富的管理工具
- ✅ 广泛的企业应用

掌握 Oracle 对于企业级应用开发非常重要。

## 参考资源

- [Oracle 官方文档](https://docs.oracle.com/en/database/)
- [Oracle 中文文档](https://docs.oracle.com/cd/E11882_01/index.htm)
- [Oracle PL/SQL 程序设计](https://book.douban.com/subject/3931697/)
