# Dapper

## 概述

Dapper 是一个轻量级的 ORM（对象关系映射）框架，由 Stack Overflow 团队开发，被称为"微型 ORM 之王"。

### 核心特性

- 高性能：接近原生 ADO.NET 的性能
- 轻量级：只有一个文件，无依赖
- 简单易用：API 简洁明了
- 支持多数据库：SQL Server、MySQL、PostgreSQL、SQLite 等
- 支持存储过程
- 支持批量操作

### Dapper vs EF Core

| 特性 | Dapper | EF Core |
|------|--------|---------|
| 性能 | 极高 | 较高 |
| 学习曲线 | 平缓 | 陡峭 |
| SQL 控制 | 完全控制 | 自动生成 |
| 变更追踪 | 无 | 有 |
| 迁移 | 无 | 有 |
| 适用场景 | 高性能查询 | 复杂业务 |

## 快速开始

### 安装

```bash
dotnet add package Dapper
dotnet add package Microsoft.Data.SqlClient
# 或 MySQL
dotnet add package MySql.Data
```

### 基本使用

```csharp
using Dapper;
using Microsoft.Data.SqlClient;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public int Age { get; set; }
}

public class UserRepository
{
    private readonly string _connectionString;
    
    public UserRepository(string connectionString)
    {
        _connectionString = connectionString;
    }
    
    public IEnumerable<User> GetAll()
    {
        using var connection = new SqlConnection(_connectionString);
        return connection.Query<User>("SELECT * FROM Users");
    }
    
    public User GetById(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        return connection.QueryFirstOrDefault<User>(
            "SELECT * FROM Users WHERE Id = @Id",
            new { Id = id });
    }
    
    public int Insert(User user)
    {
        using var connection = new SqlConnection(_connectionString);
        var sql = @"INSERT INTO Users (Name, Email, Age) 
                    VALUES (@Name, @Email, @Age);
                    SELECT CAST(SCOPE_IDENTITY() as int)";
        return connection.QuerySingle<int>(sql, user);
    }
    
    public int Update(User user)
    {
        using var connection = new SqlConnection(_connectionString);
        var sql = @"UPDATE Users 
                    SET Name = @Name, Email = @Email, Age = @Age 
                    WHERE Id = @Id";
        return connection.Execute(sql, user);
    }
    
    public int Delete(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        return connection.Execute(
            "DELETE FROM Users WHERE Id = @Id",
            new { Id = id });
    }
}
```

## 查询操作

### Query - 查询多条

```csharp
// 查询所有
var users = connection.Query<User>("SELECT * FROM Users");

// 带参数查询
var users = connection.Query<User>(
    "SELECT * FROM Users WHERE Age > @Age",
    new { Age = 18 });

// 查询动态类型
var users = connection.Query(
    "SELECT Id, Name FROM Users");
foreach (var user in users)
{
    Console.WriteLine($"{user.Id}: {user.Name}");
}
```

### QueryFirst/QuerySingle - 查询单条

```csharp
// QueryFirst：返回第一条，没有抛异常
var user = connection.QueryFirst<User>(
    "SELECT * FROM Users WHERE Id = @Id",
    new { Id = 1 });

// QueryFirstOrDefault：返回第一条或 null
var user = connection.QueryFirstOrDefault<User>(
    "SELECT * FROM Users WHERE Id = @Id",
    new { Id = 1 });

// QuerySingle：返回唯一一条，多条或没有抛异常
var user = connection.QuerySingle<User>(
    "SELECT * FROM Users WHERE Id = @Id",
    new { Id = 1 });

// QuerySingleOrDefault：返回唯一一条或 null
var user = connection.QuerySingleOrDefault<User>(
    "SELECT * FROM Users WHERE Id = @Id",
    new { Id = 1 });
```

### 异步查询

```csharp
// 异步查询多条
var users = await connection.QueryAsync<User>(
    "SELECT * FROM Users");

// 异步查询单条
var user = await connection.QueryFirstOrDefaultAsync<User>(
    "SELECT * FROM Users WHERE Id = @Id",
    new { Id = 1 });
```

## 执行操作

### Execute - 执行命令

```csharp
// 插入
var sql = "INSERT INTO Users (Name, Email, Age) VALUES (@Name, @Email, @Age)";
var affectedRows = connection.Execute(sql, new User 
{ 
    Name = "张三", 
    Email = "zhangsan@example.com", 
    Age = 25 
});

// 更新
var sql = "UPDATE Users SET Name = @Name WHERE Id = @Id";
var affectedRows = connection.Execute(sql, new { Id = 1, Name = "李四" });

// 删除
var sql = "DELETE FROM Users WHERE Id = @Id";
var affectedRows = connection.Execute(sql, new { Id = 1 });

// 批量操作
var users = new[]
{
    new User { Name = "张三", Email = "zhangsan@example.com", Age = 25 },
    new User { Name = "李四", Email = "lisi@example.com", Age = 30 }
};
var sql = "INSERT INTO Users (Name, Email, Age) VALUES (@Name, @Email, @Age)";
var affectedRows = connection.Execute(sql, users);
```

### ExecuteScalar - 返回单个值

```csharp
// 查询总数
var count = connection.ExecuteScalar<int>("SELECT COUNT(*) FROM Users");

// 查询最大值
var maxAge = connection.ExecuteScalar<int>("SELECT MAX(Age) FROM Users");

// 查询是否存在
var exists = connection.ExecuteScalar<bool>(
    "SELECT CASE WHEN EXISTS(SELECT 1 FROM Users WHERE Id = @Id) THEN 1 ELSE 0 END",
    new { Id = 1 });
```

## 多结果集

### QueryMultiple

```csharp
var sql = @"
    SELECT * FROM Users WHERE Id = @UserId;
    SELECT * FROM Orders WHERE UserId = @UserId;
    SELECT * FROM Products WHERE UserId = @UserId;
";

using var multi = connection.QueryMultiple(sql, new { UserId = 1 });

var user = multi.ReadFirst<User>();
var orders = multi.Read<Order>().ToList();
var products = multi.Read<Product>().ToList();
```

## 映射

### 列名映射

```csharp
// 使用别名
var users = connection.Query<User>(
    "SELECT UserId as Id, UserName as Name FROM Users");

// 使用 Column 特性
public class User
{
    [Column("UserId")]
    public int Id { get; set; }
    
    [Column("UserName")]
    public string Name { get; set; }
}
```

### 自定义映射

```csharp
// 全局映射
SqlMapper.SetTypeMap(typeof(User), new CustomPropertyTypeMap(
    typeof(User),
    (type, columnName) => type.GetProperties()
        .FirstOrDefault(prop => prop.Name.ToLower() == columnName.ToLower())));

// 忽略属性
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    [Ignore]
    public string FullName => $"{FirstName} {LastName}";
}
```

### 一对多映射

```csharp
var sql = @"
    SELECT u.*, o.*
    FROM Users u
    LEFT JOIN Orders o ON u.Id = o.UserId
    WHERE u.Id = @UserId
";

var userDictionary = new Dictionary<int, User>();

var users = connection.Query<User, Order, User>(
    sql,
    (user, order) =>
    {
        if (!userDictionary.TryGetValue(user.Id, out var userEntry))
        {
            userEntry = user;
            userEntry.Orders = new List<Order>();
            userDictionary.Add(user.Id, userEntry);
        }
        
        if (order != null)
        {
            userEntry.Orders.Add(order);
        }
        
        return userEntry;
    },
    new { UserId = 1 },
    splitOn: "Id");

var result = userDictionary.Values.FirstOrDefault();
```

## 存储过程

```csharp
// 执行存储过程
var users = connection.Query<User>(
    "sp_GetUsers",
    new { Age = 18 },
    commandType: CommandType.StoredProcedure);

// 带输出参数
var parameters = new DynamicParameters();
parameters.Add("@UserId", 1);
parameters.Add("@TotalOrders", dbType: DbType.Int32, direction: ParameterDirection.Output);

connection.Execute(
    "sp_GetUserOrders",
    parameters,
    commandType: CommandType.StoredProcedure);

var totalOrders = parameters.Get<int>("@TotalOrders");
```

## 事务

```csharp
using var connection = new SqlConnection(_connectionString);
connection.Open();

using var transaction = connection.BeginTransaction();

try
{
    // 操作1
    connection.Execute(
        "INSERT INTO Users (Name, Email) VALUES (@Name, @Email)",
        new { Name = "张三", Email = "zhangsan@example.com" },
        transaction);
    
    // 操作2
    connection.Execute(
        "UPDATE Accounts SET Balance = Balance - 100 WHERE UserId = @UserId",
        new { UserId = 1 },
        transaction);
    
    transaction.Commit();
}
catch
{
    transaction.Rollback();
    throw;
}
```

## 批量操作

### 批量插入

```csharp
var users = new List<User>();
for (int i = 0; i < 1000; i++)
{
    users.Add(new User 
    { 
        Name = $"User{i}", 
        Email = $"user{i}@example.com",
        Age = 20 + i % 50
    });
}

var sql = "INSERT INTO Users (Name, Email, Age) VALUES (@Name, @Email, @Age)";
var affectedRows = connection.Execute(sql, users);
```

### 批量更新

```csharp
var updates = new[]
{
    new { Id = 1, Name = "张三" },
    new { Id = 2, Name = "李四" },
    new { Id = 3, Name = "王五" }
};

var sql = "UPDATE Users SET Name = @Name WHERE Id = @Id";
var affectedRows = connection.Execute(sql, updates);
```

## 与 ASP.NET Core 集成

### 配置

```csharp
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyDb;User Id=sa;Password=123456;"
  }
}

// Program.cs
builder.Services.AddScoped<IDbConnection>(sp =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
```

### Repository 模式

```csharp
public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> GetByIdAsync(int id);
    Task<int> InsertAsync(User user);
    Task<int> UpdateAsync(User user);
    Task<int> DeleteAsync(int id);
}

public class UserRepository : IUserRepository
{
    private readonly IDbConnection _connection;
    
    public UserRepository(IDbConnection connection)
    {
        _connection = connection;
    }
    
    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _connection.QueryAsync<User>("SELECT * FROM Users");
    }
    
    public async Task<User> GetByIdAsync(int id)
    {
        return await _connection.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM Users WHERE Id = @Id",
            new { Id = id });
    }
    
    public async Task<int> InsertAsync(User user)
    {
        var sql = @"INSERT INTO Users (Name, Email, Age) 
                    VALUES (@Name, @Email, @Age);
                    SELECT CAST(SCOPE_IDENTITY() as int)";
        return await _connection.QuerySingleAsync<int>(sql, user);
    }
    
    public async Task<int> UpdateAsync(User user)
    {
        var sql = @"UPDATE Users 
                    SET Name = @Name, Email = @Email, Age = @Age 
                    WHERE Id = @Id";
        return await _connection.ExecuteAsync(sql, user);
    }
    
    public async Task<int> DeleteAsync(int id)
    {
        return await _connection.ExecuteAsync(
            "DELETE FROM Users WHERE Id = @Id",
            new { Id = id });
    }
}
```

### 使用

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    
    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll()
    {
        var users = await _userRepository.GetAllAsync();
        return Ok(users);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }
    
    [HttpPost]
    public async Task<ActionResult<User>> Create(User user)
    {
        var id = await _userRepository.InsertAsync(user);
        user.Id = id;
        return CreatedAtAction(nameof(GetById), new { id }, user);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, User user)
    {
        user.Id = id;
        await _userRepository.UpdateAsync(user);
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _userRepository.DeleteAsync(id);
        return NoContent();
    }
}
```

## Dapper 扩展

### Dapper.Contrib

```bash
dotnet add package Dapper.Contrib
```

```csharp
using Dapper.Contrib.Extensions;

[Table("Users")]
public class User
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    
    [Computed]
    public string DisplayName => $"{Name} ({Email})";
}

// 使用
var user = connection.Get<User>(1);
var users = connection.GetAll<User>();
var id = connection.Insert(new User { Name = "张三", Email = "zhangsan@example.com" });
connection.Update(user);
connection.Delete(user);
```

### Dapper.SimpleCRUD

```bash
dotnet add package Dapper.SimpleCRUD
```

```csharp
// 查询
var user = connection.Get<User>(1);
var users = connection.GetList<User>();
var users = connection.GetList<User>(new { Age = 25 });

// 插入
var id = connection.Insert(new User { Name = "张三" });

// 更新
connection.Update(user);

// 删除
connection.Delete(user);
connection.DeleteList<User>(new { Age = 25 });
```

## 性能优化

### 使用缓存

```csharp
private static readonly ConcurrentDictionary<string, object> _cache = new();

public User GetById(int id)
{
    var cacheKey = $"user_{id}";
    
    if (_cache.TryGetValue(cacheKey, out var cached))
    {
        return (User)cached;
    }
    
    using var connection = new SqlConnection(_connectionString);
    var user = connection.QueryFirstOrDefault<User>(
        "SELECT * FROM Users WHERE Id = @Id",
        new { Id = id });
    
    if (user != null)
    {
        _cache[cacheKey] = user;
    }
    
    return user;
}
```

### 批量操作

```csharp
// 使用 Table-Valued Parameters (TVP)
var sql = @"
    INSERT INTO Users (Name, Email, Age)
    SELECT Name, Email, Age FROM @Users
";

var table = new DataTable();
table.Columns.Add("Name", typeof(string));
table.Columns.Add("Email", typeof(string));
table.Columns.Add("Age", typeof(int));

foreach (var user in users)
{
    table.Rows.Add(user.Name, user.Email, user.Age);
}

connection.Execute(sql, new { Users = table.AsTableValuedParameter("UserTableType") });
```

## 最佳实践

### 使用 using 语句

```csharp
// 推荐
using var connection = new SqlConnection(_connectionString);
var users = connection.Query<User>("SELECT * FROM Users");

// 或
using (var connection = new SqlConnection(_connectionString))
{
    var users = connection.Query<User>("SELECT * FROM Users");
}
```

### 参数化查询

```csharp
// 推荐：使用参数化查询
var users = connection.Query<User>(
    "SELECT * FROM Users WHERE Age > @Age",
    new { Age = 18 });

// 不推荐：字符串拼接（SQL 注入风险）
var users = connection.Query<User>(
    $"SELECT * FROM Users WHERE Age > {age}");
```

### 异步操作

```csharp
// 推荐：使用异步方法
public async Task<IEnumerable<User>> GetAllAsync()
{
    using var connection = new SqlConnection(_connectionString);
    return await connection.QueryAsync<User>("SELECT * FROM Users");
}
```

### 连接池

```csharp
// 连接字符串配置连接池
var connectionString = "Server=localhost;Database=MyDb;User Id=sa;Password=123456;" +
                       "Min Pool Size=5;Max Pool Size=100;";
```
