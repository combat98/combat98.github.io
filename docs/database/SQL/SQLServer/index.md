---
prev:
  text: 'PostgresSQL'
  link: '/database/SQL/PostgresSQL/index'
next:
  text: 'Oracle'
  link: '/database/SQL/Oracle/index'
---

# SQL Server

## 简介

Microsoft SQL Server 是由微软开发的关系型数据库管理系统，是企业级应用的主流数据库之一。

### 特点

- **企业级功能** - 高可用性、高性能
- **集成开发环境** - SQL Server Management Studio (SSMS)
- **商业智能** - 内置 BI 工具
- **云集成** - Azure SQL Database
- **安全性强** - 完善的安全机制
- **Windows 集成** - 与 Windows 生态紧密集成

### 版本

- **Express** - 免费版，适合小型应用
- **Standard** - 标准版，适合中小企业
- **Enterprise** - 企业版，功能最全
- **Developer** - 开发版，免费但仅用于开发测试

## 安装配置

### Windows 安装

```powershell
# 下载 SQL Server
# https://www.microsoft.com/sql-server/sql-server-downloads

# 下载 SSMS
# https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms

# 使用 Chocolatey 安装
choco install sql-server-express
choco install sql-server-management-studio
```

### Docker 安装

```bash
# 拉取镜像
docker pull mcr.microsoft.com/mssql/server:2022-latest

# 运行容器
docker run -d \
  --name sqlserver \
  -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 \
  -v sqlserver-data:/var/opt/mssql \
  mcr.microsoft.com/mssql/server:2022-latest
```

### 连接数据库

```bash
# 使用 sqlcmd
sqlcmd -S localhost -U sa -P YourPassword

# 使用 SSMS
# Server name: localhost
# Authentication: SQL Server Authentication
# Login: sa
# Password: YourPassword
```

## 基本操作

### 数据库操作

```sql
-- 创建数据库
CREATE DATABASE MyDB;
GO

CREATE DATABASE MyDB
ON PRIMARY (
    NAME = MyDB_Data,
    FILENAME = 'C:\Data\MyDB.mdf',
    SIZE = 10MB,
    MAXSIZE = 100MB,
    FILEGROWTH = 5MB
)
LOG ON (
    NAME = MyDB_Log,
    FILENAME = 'C:\Data\MyDB.ldf',
    SIZE = 5MB,
    MAXSIZE = 50MB,
    FILEGROWTH = 5MB
);
GO

-- 查看所有数据库
SELECT name FROM sys.databases;
GO

-- 使用数据库
USE MyDB;
GO

-- 查看当前数据库
SELECT DB_NAME();
GO

-- 删除数据库
DROP DATABASE MyDB;
GO

-- 修改数据库
ALTER DATABASE MyDB MODIFY NAME = NewDB;
GO

-- 设置数据库为单用户模式
ALTER DATABASE MyDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO

-- 设置数据库为多用户模式
ALTER DATABASE MyDB SET MULTI_USER;
GO
```

### 表操作

```sql
-- 创建表
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL,
    Age INT,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 查看所有表
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO

-- 查看表结构
EXEC sp_help 'Users';
GO

-- 修改表
ALTER TABLE Users ADD Phone NVARCHAR(20);
GO

ALTER TABLE Users ALTER COLUMN Age SMALLINT;
GO

EXEC sp_rename 'Users.Age', 'UserAge', 'COLUMN';
GO

ALTER TABLE Users DROP COLUMN Phone;
GO

EXEC sp_rename 'Users', 'Members';
GO

-- 删除表
DROP TABLE Users;
GO

-- 清空表
TRUNCATE TABLE Users;
GO
```

## 数据类型

### 数值类型

```sql
-- 整数类型
TINYINT         -- 1字节，0 到 255
SMALLINT        -- 2字节，-32768 到 32767
INT             -- 4字节
BIGINT          -- 8字节

-- 浮点类型
FLOAT           -- 浮点数
REAL            -- 单精度浮点数
DECIMAL(p, s)   -- 精确小数
NUMERIC(p, s)   -- 同 DECIMAL

-- 货币类型
MONEY           -- 货币类型
SMALLMONEY      -- 小额货币

-- 示例
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Price DECIMAL(10, 2),
    Stock INT,
    Rating FLOAT
);
GO
```

### 字符串类型

```sql
-- 字符类型
CHAR(n)         -- 定长字符串
VARCHAR(n)      -- 变长字符串
NCHAR(n)        -- 定长 Unicode 字符串
NVARCHAR(n)     -- 变长 Unicode 字符串
TEXT            -- 大文本（已弃用）
NTEXT           -- Unicode 大文本（已弃用）
VARCHAR(MAX)    -- 最大 2GB
NVARCHAR(MAX)   -- 最大 2GB Unicode

-- 示例
CREATE TABLE Articles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200),
    Content NVARCHAR(MAX),
    Author NVARCHAR(50)
);
GO
```

### 日期时间类型

```sql
DATE            -- 日期
TIME            -- 时间
DATETIME        -- 日期时间（精度 3.33ms）
DATETIME2       -- 日期时间（精度 100ns，推荐）
SMALLDATETIME   -- 小日期时间
DATETIMEOFFSET  -- 带时区的日期时间

-- 示例
CREATE TABLE Events (
    Id INT PRIMARY KEY IDENTITY(1,1),
    EventDate DATE,
    EventTime TIME,
    EventDateTime DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO
```

### 特殊类型

```sql
-- 二进制类型
BINARY(n)       -- 定长二进制
VARBINARY(n)    -- 变长二进制
VARBINARY(MAX)  -- 最大 2GB

-- 唯一标识符
UNIQUEIDENTIFIER -- GUID

-- XML 类型
XML             -- XML 数据

-- 空间数据类型
GEOMETRY        -- 平面空间数据
GEOGRAPHY       -- 地理空间数据

-- 示例
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50),
    ProfileImage VARBINARY(MAX),
    Settings XML,
    IsActive BIT DEFAULT 1
);
GO
```

## CRUD 操作

### 插入数据（INSERT）

```sql
-- 插入单条记录
INSERT INTO Users (Username, Email, Age) 
VALUES ('john', 'john@example.com', 30);
GO

-- 插入多条记录
INSERT INTO Users (Username, Email, Age) VALUES
('alice', 'alice@example.com', 25),
('bob', 'bob@example.com', 28),
('charlie', 'charlie@example.com', 35);
GO

-- 插入并返回
INSERT INTO Users (Username, Email) 
OUTPUT INSERTED.Id, INSERTED.Username
VALUES ('david', 'david@example.com');
GO

-- 从另一个表插入
INSERT INTO Users (Username, Email)
SELECT Name, Email FROM TempUsers;
GO

-- 插入或更新（MERGE）
MERGE INTO Users AS target
USING (SELECT 'john' AS Username, 'john@example.com' AS Email) AS source
ON target.Username = source.Username
WHEN MATCHED THEN
    UPDATE SET Email = source.Email
WHEN NOT MATCHED THEN
    INSERT (Username, Email) VALUES (source.Username, source.Email);
GO
```

### 查询数据（SELECT）

```sql
-- 基本查询
SELECT * FROM Users;
SELECT Username, Email FROM Users;

-- 条件查询
SELECT * FROM Users WHERE Age > 25;
SELECT * FROM Users WHERE Age BETWEEN 20 AND 30;
SELECT * FROM Users WHERE Username IN ('john', 'alice');
SELECT * FROM Users WHERE Email LIKE '%@example.com';
SELECT * FROM Users WHERE Age IS NULL;

-- 排序
SELECT * FROM Users ORDER BY Age ASC;
SELECT * FROM Users ORDER BY Age DESC, Username ASC;

-- 限制结果（SQL Server 2012+）
SELECT TOP 10 * FROM Users;
SELECT TOP 10 * FROM Users ORDER BY Age DESC;

-- 分页（SQL Server 2012+）
SELECT * FROM Users 
ORDER BY Id 
OFFSET 20 ROWS 
FETCH NEXT 10 ROWS ONLY;

-- 去重
SELECT DISTINCT Age FROM Users;

-- 聚合函数
SELECT COUNT(*) FROM Users;
SELECT COUNT(DISTINCT Age) FROM Users;
SELECT AVG(Age) FROM Users;
SELECT SUM(Age) FROM Users;
SELECT MAX(Age), MIN(Age) FROM Users;

-- 分组
SELECT Age, COUNT(*) as Count 
FROM Users 
GROUP BY Age;

SELECT Age, COUNT(*) as Count 
FROM Users 
GROUP BY Age 
HAVING COUNT(*) > 1;

-- 多表查询
SELECT u.Username, o.OrderNo 
FROM Users u
INNER JOIN Orders o ON u.Id = o.UserId;

SELECT u.Username, o.OrderNo 
FROM Users u
LEFT JOIN Orders o ON u.Id = o.UserId;

SELECT u.Username, o.OrderNo 
FROM Users u
RIGHT JOIN Orders o ON u.Id = o.UserId;

SELECT u.Username, o.OrderNo 
FROM Users u
FULL OUTER JOIN Orders o ON u.Id = o.UserId;

-- 子查询
SELECT * FROM Users 
WHERE Age > (SELECT AVG(Age) FROM Users);

-- CTE（公共表表达式）
WITH YoungUsers AS (
    SELECT * FROM Users WHERE Age < 30
)
SELECT * FROM YoungUsers WHERE Username LIKE 'j%';
GO
```

### 更新数据（UPDATE）

```sql
-- 更新单条记录
UPDATE Users SET Email = 'newemail@example.com' WHERE Id = 1;
GO

-- 更新多个字段
UPDATE Users 
SET Email = 'newemail@example.com', Age = 31 
WHERE Id = 1;
GO

-- 批量更新
UPDATE Users SET Age = Age + 1 WHERE Age < 30;
GO

-- 使用子查询更新
UPDATE Users 
SET Age = (SELECT AVG(Age) FROM Users) 
WHERE Id = 1;
GO

-- 更新并返回
UPDATE Users 
SET Age = 31 
OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Age
WHERE Id = 1;
GO

-- 从另一个表更新
UPDATE u
SET u.Email = t.NewEmail
FROM Users u
INNER JOIN TempEmails t ON u.Id = t.UserId;
GO
```

### 删除数据（DELETE）

```sql
-- 删除单条记录
DELETE FROM Users WHERE Id = 1;
GO

-- 批量删除
DELETE FROM Users WHERE Age < 18;
GO

-- 删除所有记录
DELETE FROM Users;
GO

-- 删除并返回
DELETE FROM Users 
OUTPUT DELETED.Id, DELETED.Username
WHERE Id = 1;
GO

-- 清空表（更快）
TRUNCATE TABLE Users;
GO
```

## 索引

### 索引类型

```sql
-- 聚集索引（每个表只能有一个）
CREATE CLUSTERED INDEX IX_Users_Id ON Users(Id);
GO

-- 非聚集索引
CREATE NONCLUSTERED INDEX IX_Users_Username ON Users(Username);
GO

-- 唯一索引
CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);
GO

-- 复合索引
CREATE INDEX IX_Users_Name_Age ON Users(Username, Age);
GO

-- 包含列索引
CREATE INDEX IX_Users_Username_Include 
ON Users(Username) 
INCLUDE (Email, Age);
GO

-- 筛选索引
CREATE INDEX IX_Users_Active 
ON Users(Username) 
WHERE IsActive = 1;
GO

-- 全文索引
CREATE FULLTEXT CATALOG ftCatalog AS DEFAULT;
GO

CREATE FULLTEXT INDEX ON Articles(Content)
KEY INDEX PK_Articles
ON ftCatalog;
GO

-- 查看索引
EXEC sp_helpindex 'Users';
GO

SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('Users');
GO

-- 删除索引
DROP INDEX IX_Users_Username ON Users;
GO

-- 重建索引
ALTER INDEX IX_Users_Username ON Users REBUILD;
GO

-- 重组索引
ALTER INDEX IX_Users_Username ON Users REORGANIZE;
GO

-- 查看索引使用情况
SET STATISTICS IO ON;
SELECT * FROM Users WHERE Username = 'john';
SET STATISTICS IO OFF;
GO
```

## 约束

### 主键约束

```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50)
);
GO

-- 或
CREATE TABLE Users (
    Id INT IDENTITY(1,1),
    Username NVARCHAR(50),
    CONSTRAINT PK_Users PRIMARY KEY (Id)
);
GO

-- 复合主键
CREATE TABLE UserRoles (
    UserId INT,
    RoleId INT,
    CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId)
);
GO
```

### 外键约束

```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT,
    OrderNo NVARCHAR(50),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) 
        REFERENCES Users(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
GO

-- 删除外键
ALTER TABLE Orders DROP CONSTRAINT FK_Orders_Users;
GO
```

### 唯一约束

```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) UNIQUE,
    Email NVARCHAR(100) UNIQUE
);
GO

-- 添加唯一约束
ALTER TABLE Users ADD CONSTRAINT UQ_Email UNIQUE (Email);
GO
```

### 检查约束

```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Age INT CHECK (Age >= 18),
    Email NVARCHAR(100) CHECK (Email LIKE '%@%')
);
GO

-- 添加检查约束
ALTER TABLE Users ADD CONSTRAINT CHK_Age CHECK (Age >= 18 AND Age <= 120);
GO
```

### 默认值约束

```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL,
    Status INT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);
GO

-- 添加默认值
ALTER TABLE Users ADD CONSTRAINT DF_Status DEFAULT 1 FOR Status;
GO

-- 删除默认值
ALTER TABLE Users DROP CONSTRAINT DF_Status;
GO
```

## 事务

### 事务操作

```sql
-- 开始事务
BEGIN TRANSACTION;

-- 提交事务
COMMIT TRANSACTION;

-- 回滚事务
ROLLBACK TRANSACTION;

-- 示例
BEGIN TRANSACTION;

UPDATE Accounts SET Balance = Balance - 100 WHERE Id = 1;
UPDATE Accounts SET Balance = Balance + 100 WHERE Id = 2;

COMMIT TRANSACTION;
GO

-- 命名事务
BEGIN TRANSACTION MyTransaction;
-- 执行操作
COMMIT TRANSACTION MyTransaction;
GO
```

### 事务隔离级别

```sql
-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;

-- 示例
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
-- 执行操作
COMMIT TRANSACTION;
GO
```

### 保存点

```sql
BEGIN TRANSACTION;

INSERT INTO Users (Username) VALUES ('user1');
SAVE TRANSACTION SavePoint1;

INSERT INTO Users (Username) VALUES ('user2');
SAVE TRANSACTION SavePoint2;

-- 回滚到保存点
ROLLBACK TRANSACTION SavePoint1;

COMMIT TRANSACTION;
GO
```

## 视图

```sql
-- 创建视图
CREATE VIEW UserView AS
SELECT Id, Username, Email FROM Users WHERE Age > 18;
GO

-- 使用视图
SELECT * FROM UserView;
GO

-- 更新视图
ALTER VIEW UserView AS
SELECT Id, Username, Email, Age FROM Users WHERE Age > 18;
GO

-- 索引视图（物化视图）
CREATE VIEW UserStats WITH SCHEMABINDING AS
SELECT Age, COUNT_BIG(*) as Count 
FROM dbo.Users 
GROUP BY Age;
GO

CREATE UNIQUE CLUSTERED INDEX IX_UserStats ON UserStats(Age);
GO

-- 删除视图
DROP VIEW UserView;
GO
```

## 存储过程

```sql
-- 创建存储过程
CREATE PROCEDURE GetUserById
    @UserId INT
AS
BEGIN
    SELECT * FROM Users WHERE Id = @UserId;
END;
GO

-- 调用存储过程
EXEC GetUserById @UserId = 1;
GO

-- 带输出参数的存储过程
CREATE PROCEDURE GetUserCount
    @Count INT OUTPUT
AS
BEGIN
    SELECT @Count = COUNT(*) FROM Users;
END;
GO

-- 调用
DECLARE @UserCount INT;
EXEC GetUserCount @Count = @UserCount OUTPUT;
SELECT @UserCount;
GO

-- 带返回值的存储过程
CREATE PROCEDURE CheckUserExists
    @Username NVARCHAR(50)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
        RETURN 1;
    ELSE
        RETURN 0;
END;
GO

-- 调用
DECLARE @Result INT;
EXEC @Result = CheckUserExists @Username = 'john';
SELECT @Result;
GO

-- 删除存储过程
DROP PROCEDURE GetUserById;
GO
```

## 函数

### 标量函数

```sql
-- 创建标量函数
CREATE FUNCTION GetUserAge(@UserId INT)
RETURNS INT
AS
BEGIN
    DECLARE @Age INT;
    SELECT @Age = Age FROM Users WHERE Id = @UserId;
    RETURN @Age;
END;
GO

-- 调用
SELECT dbo.GetUserAge(1);
GO
```

### 表值函数

```sql
-- 内联表值函数
CREATE FUNCTION GetUsersByAge(@MinAge INT)
RETURNS TABLE
AS
RETURN (
    SELECT Id, Username, Email, Age 
    FROM Users 
    WHERE Age >= @MinAge
);
GO

-- 调用
SELECT * FROM dbo.GetUsersByAge(25);
GO

-- 多语句表值函数
CREATE FUNCTION GetUserStats()
RETURNS @Stats TABLE (
    Age INT,
    Count INT
)
AS
BEGIN
    INSERT INTO @Stats
    SELECT Age, COUNT(*) FROM Users GROUP BY Age;
    RETURN;
END;
GO

-- 调用
SELECT * FROM dbo.GetUserStats();
GO
```

## 触发器

```sql
-- AFTER 触发器
CREATE TRIGGER trg_Users_AfterInsert
ON Users
AFTER INSERT
AS
BEGIN
    INSERT INTO UserLog (UserId, Action, ActionDate)
    SELECT Id, 'INSERT', GETDATE() FROM INSERTED;
END;
GO

-- INSTEAD OF 触发器
CREATE TRIGGER trg_Users_InsteadOfDelete
ON Users
INSTEAD OF DELETE
AS
BEGIN
    UPDATE Users 
    SET IsActive = 0 
    WHERE Id IN (SELECT Id FROM DELETED);
END;
GO

-- 查看触发器
SELECT * FROM sys.triggers WHERE parent_id = OBJECT_ID('Users');
GO

-- 禁用触发器
DISABLE TRIGGER trg_Users_AfterInsert ON Users;
GO

-- 启用触发器
ENABLE TRIGGER trg_Users_AfterInsert ON Users;
GO

-- 删除触发器
DROP TRIGGER trg_Users_AfterInsert;
GO
```

## 窗口函数

```sql
-- ROW_NUMBER
SELECT 
    Username,
    Age,
    ROW_NUMBER() OVER (ORDER BY Age DESC) as RowNum
FROM Users;
GO

-- RANK
SELECT 
    Username,
    Age,
    RANK() OVER (ORDER BY Age DESC) as Rank
FROM Users;
GO

-- DENSE_RANK
SELECT 
    Username,
    Age,
    DENSE_RANK() OVER (ORDER BY Age DESC) as DenseRank
FROM Users;
GO

-- PARTITION BY
SELECT 
    Department,
    Username,
    Salary,
    AVG(Salary) OVER (PARTITION BY Department) as DeptAvg
FROM Employees;
GO

-- LAG/LEAD
SELECT 
    Username,
    Age,
    LAG(Age) OVER (ORDER BY Age) as PrevAge,
    LEAD(Age) OVER (ORDER BY Age) as NextAge
FROM Users;
GO
```

## JSON 操作

```sql
-- 创建表
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50),
    Metadata NVARCHAR(MAX)
);
GO

-- 插入 JSON 数据
INSERT INTO Users (Username, Metadata) VALUES
('john', '{"age": 30, "city": "NYC", "hobbies": ["reading", "coding"]}'),
('alice', '{"age": 25, "city": "LA", "hobbies": ["music", "travel"]}');
GO

-- 查询 JSON 字段
SELECT 
    Username,
    JSON_VALUE(Metadata, '$.age') as Age,
    JSON_VALUE(Metadata, '$.city') as City
FROM Users;
GO

-- JSON 条件查询
SELECT * FROM Users 
WHERE JSON_VALUE(Metadata, '$.city') = 'NYC';
GO

-- 更新 JSON 字段
UPDATE Users 
SET Metadata = JSON_MODIFY(Metadata, '$.age', 31)
WHERE Username = 'john';
GO

-- FOR JSON - 将查询结果转换为 JSON
SELECT Id, Username, Email 
FROM Users 
FOR JSON AUTO;
GO

-- OPENJSON - 解析 JSON
SELECT * 
FROM OPENJSON('{"name": "John", "age": 30}')
WITH (
    Name NVARCHAR(50) '$.name',
    Age INT '$.age'
);
GO
```

## 性能优化

### 查询优化

```sql
-- 查看执行计划
SET SHOWPLAN_TEXT ON;
GO
SELECT * FROM Users WHERE Age = 25;
GO
SET SHOWPLAN_TEXT OFF;
GO

-- 或使用图形化执行计划（SSMS）
-- Ctrl + L 或 Ctrl + M

-- 避免 SELECT *
SELECT Id, Username, Email FROM Users;

-- 使用索引
CREATE INDEX IX_Age ON Users(Age);
GO

-- 避免在 WHERE 中使用函数
-- ❌ 不好
SELECT * FROM Users WHERE YEAR(CreatedAt) = 2024;
-- ✅ 好
SELECT * FROM Users 
WHERE CreatedAt >= '2024-01-01' AND CreatedAt < '2025-01-01';

-- 使用 EXISTS 代替 IN
-- ❌ 不好
SELECT * FROM Users WHERE Id IN (SELECT UserId FROM Orders);
-- ✅ 好
SELECT * FROM Users u WHERE EXISTS (SELECT 1 FROM Orders o WHERE o.UserId = u.Id);
```

### 统计信息

```sql
-- 更新统计信息
UPDATE STATISTICS Users;
GO

-- 查看统计信息
DBCC SHOW_STATISTICS('Users', 'IX_Users_Username');
GO
```

## 备份与恢复

### 备份

```sql
-- 完整备份
BACKUP DATABASE MyDB 
TO DISK = 'C:\Backup\MyDB_Full.bak'
WITH FORMAT, INIT, NAME = 'Full Backup';
GO

-- 差异备份
BACKUP DATABASE MyDB 
TO DISK = 'C:\Backup\MyDB_Diff.bak'
WITH DIFFERENTIAL, INIT, NAME = 'Differential Backup';
GO

-- 事务日志备份
BACKUP LOG MyDB 
TO DISK = 'C:\Backup\MyDB_Log.trn'
WITH INIT, NAME = 'Log Backup';
GO
```

### 恢复

```sql
-- 恢复完整备份
RESTORE DATABASE MyDB 
FROM DISK = 'C:\Backup\MyDB_Full.bak'
WITH REPLACE, RECOVERY;
GO

-- 恢复差异备份
RESTORE DATABASE MyDB 
FROM DISK = 'C:\Backup\MyDB_Full.bak'
WITH NORECOVERY;
GO

RESTORE DATABASE MyDB 
FROM DISK = 'C:\Backup\MyDB_Diff.bak'
WITH RECOVERY;
GO

-- 恢复事务日志
RESTORE LOG MyDB 
FROM DISK = 'C:\Backup\MyDB_Log.trn'
WITH RECOVERY;
GO
```

## 用户权限管理

```sql
-- 创建登录
CREATE LOGIN username WITH PASSWORD = 'Password123!';
GO

-- 创建用户
USE MyDB;
GO
CREATE USER username FOR LOGIN username;
GO

-- 授予权限
GRANT SELECT, INSERT, UPDATE ON Users TO username;
GO

GRANT ALL ON SCHEMA::dbo TO username;
GO

-- 添加到角色
ALTER ROLE db_datareader ADD MEMBER username;
ALTER ROLE db_datawriter ADD MEMBER username;
GO

-- 撤销权限
REVOKE SELECT ON Users FROM username;
GO

-- 删除用户
DROP USER username;
GO

-- 删除登录
DROP LOGIN username;
GO
```

## 最佳实践

1. **使用参数化查询** - 防止 SQL 注入
2. **合理使用索引** - 提高查询性能
3. **使用存储过程** - 提高性能和安全性
4. **定期备份** - 防止数据丢失
5. **监控性能** - 使用 DMV 和执行计划
6. **使用事务** - 保证数据一致性
7. **避免游标** - 使用集合操作
8. **使用 NVARCHAR** - 支持 Unicode

## 常见问题

### 1. 查看数据库大小

```sql
EXEC sp_spaceused;
GO

SELECT 
    DB_NAME() AS DatabaseName,
    SUM(size * 8 / 1024) AS SizeMB
FROM sys.database_files;
GO
```

### 2. 查看活动连接

```sql
SELECT 
    session_id,
    login_name,
    host_name,
    program_name,
    status
FROM sys.dm_exec_sessions
WHERE is_user_process = 1;
GO
```

### 3. 杀死进程

```sql
KILL 52;  -- 52 是 session_id
GO
```

## 总结

SQL Server 是一个功能强大的企业级数据库：

- ✅ 企业级功能和性能
- ✅ 完善的开发工具（SSMS）
- ✅ 强大的商业智能功能
- ✅ 与 Windows 和 Azure 集成
- ✅ 完善的安全机制

掌握 SQL Server 对于 .NET 开发者尤为重要。

## 参考资源

- [SQL Server 官方文档](https://docs.microsoft.com/sql/sql-server/)
- [SQL Server 中文文档](https://docs.microsoft.com/zh-cn/sql/sql-server/)
- [SQL Server 性能调优](https://www.red-gate.com/simple-talk/sql/performance/)
