# Entity Framework Core

## 简介

Entity Framework Core (EF Core) 是一个轻量级、可扩展、开源和跨平台的对象关系映射 (ORM) 框架，用于 .NET 应用程序。

### 特点

- **跨平台** - 支持 Windows、Linux、macOS
- **Code First** - 通过代码定义数据模型
- **LINQ 查询** - 使用强类型 LINQ 查询数据
- **变更跟踪** - 自动跟踪实体变更
- **迁移** - 数据库架构版本控制

## 快速开始

### 安装包

```bash
# EF Core 核心包
dotnet add package Microsoft.EntityFrameworkCore

# SQL Server 提供程序
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

# 设计时工具
dotnet add package Microsoft.EntityFrameworkCore.Design

# EF Core 工具
dotnet tool install --global dotnet-ef
```

### 定义实体

```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // 导航属性
    public List<Post> Posts { get; set; }
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime PublishedAt { get; set; }
    
    // 外键
    public int UserId { get; set; }
    // 导航属性
    public User User { get; set; }
}
```

### 创建 DbContext

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // 配置实体
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
        });
        
        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Content).IsRequired();
            
            // 配置关系
            entity.HasOne(p => p.User)
                  .WithMany(u => u.Posts)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
```

### 注册 DbContext

```csharp
// Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

## 迁移

### 创建迁移

```bash
# 添加迁移
dotnet ef migrations add InitialCreate

# 更新数据库
dotnet ef database update

# 删除最后一次迁移
dotnet ef migrations remove

# 查看迁移列表
dotnet ef migrations list
```

### 迁移到特定版本

```bash
# 回滚到指定迁移
dotnet ef database update PreviousMigration

# 回滚所有迁移
dotnet ef database update 0
```

## CRUD 操作

### 查询数据

```csharp
public class UserRepository
{
    private readonly ApplicationDbContext _context;
    
    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    // 查询所有
    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }
    
    // 根据 ID 查询
    public async Task<User> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }
    
    // 条件查询
    public async Task<List<User>> GetByEmailDomainAsync(string domain)
    {
        return await _context.Users
            .Where(u => u.Email.EndsWith(domain))
            .ToListAsync();
    }
    
    // 分页查询
    public async Task<List<User>> GetPagedAsync(int page, int pageSize)
    {
        return await _context.Users
            .OrderBy(u => u.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }
    
    // 包含关联数据
    public async Task<User> GetWithPostsAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Posts)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
    
    // 投影查询
    public async Task<List<UserDto>> GetUserDtosAsync()
    {
        return await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                PostCount = u.Posts.Count
            })
            .ToListAsync();
    }
}
```

### 添加数据

```csharp
public async Task<User> CreateAsync(User user)
{
    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return user;
}

// 批量添加
public async Task CreateManyAsync(List<User> users)
{
    _context.Users.AddRange(users);
    await _context.SaveChangesAsync();
}
```

### 更新数据

```csharp
public async Task UpdateAsync(User user)
{
    _context.Users.Update(user);
    await _context.SaveChangesAsync();
}

// 部分更新
public async Task UpdateEmailAsync(int id, string email)
{
    var user = await _context.Users.FindAsync(id);
    if (user != null)
    {
        user.Email = email;
        await _context.SaveChangesAsync();
    }
}

// 批量更新
public async Task UpdateManyAsync(List<User> users)
{
    _context.Users.UpdateRange(users);
    await _context.SaveChangesAsync();
}
```

### 删除数据

```csharp
public async Task DeleteAsync(int id)
{
    var user = await _context.Users.FindAsync(id);
    if (user != null)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }
}

// 批量删除
public async Task DeleteManyAsync(List<int> ids)
{
    var users = await _context.Users
        .Where(u => ids.Contains(u.Id))
        .ToListAsync();
    
    _context.Users.RemoveRange(users);
    await _context.SaveChangesAsync();
}
```

## 关系配置

### 一对多关系

```csharp
public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Post> Posts { get; set; }
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int BlogId { get; set; }
    public Blog Blog { get; set; }
}

// 配置
modelBuilder.Entity<Post>()
    .HasOne(p => p.Blog)
    .WithMany(b => b.Posts)
    .HasForeignKey(p => p.BlogId);
```

### 一对一关系

```csharp
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public UserProfile Profile { get; set; }
}

public class UserProfile
{
    public int Id { get; set; }
    public string Bio { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
}

// 配置
modelBuilder.Entity<User>()
    .HasOne(u => u.Profile)
    .WithOne(p => p.User)
    .HasForeignKey<UserProfile>(p => p.UserId);
```

### 多对多关系

```csharp
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Course> Courses { get; set; }
}

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; }
    public List<Student> Students { get; set; }
}

// EF Core 5.0+ 自动配置多对多
modelBuilder.Entity<Student>()
    .HasMany(s => s.Courses)
    .WithMany(c => c.Students);

// 或使用显式连接表
public class StudentCourse
{
    public int StudentId { get; set; }
    public Student Student { get; set; }
    
    public int CourseId { get; set; }
    public Course Course { get; set; }
    
    public DateTime EnrolledAt { get; set; }
}

modelBuilder.Entity<StudentCourse>()
    .HasKey(sc => new { sc.StudentId, sc.CourseId });
```

## 高级查询

### 原始 SQL 查询

```csharp
// 查询实体
var users = await _context.Users
    .FromSqlRaw("SELECT * FROM Users WHERE Email LIKE '%@example.com'")
    .ToListAsync();

// 参数化查询
var email = "test@example.com";
var user = await _context.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE Email = {email}")
    .FirstOrDefaultAsync();

// 执行存储过程
var users = await _context.Users
    .FromSqlRaw("EXEC GetActiveUsers")
    .ToListAsync();
```

### 分组和聚合

```csharp
// 分组统计
var stats = await _context.Posts
    .GroupBy(p => p.UserId)
    .Select(g => new
    {
        UserId = g.Key,
        PostCount = g.Count(),
        LatestPost = g.Max(p => p.PublishedAt)
    })
    .ToListAsync();

// 聚合函数
var totalUsers = await _context.Users.CountAsync();
var avgAge = await _context.Users.AverageAsync(u => u.Age);
var maxAge = await _context.Users.MaxAsync(u => u.Age);
```

### 复杂查询

```csharp
// 多条件查询
var query = _context.Users.AsQueryable();

if (!string.IsNullOrEmpty(searchTerm))
{
    query = query.Where(u => u.Username.Contains(searchTerm));
}

if (minAge.HasValue)
{
    query = query.Where(u => u.Age >= minAge.Value);
}

var users = await query.ToListAsync();

// 子查询
var usersWithPosts = await _context.Users
    .Where(u => _context.Posts.Any(p => p.UserId == u.Id))
    .ToListAsync();
```

## 性能优化

### 预加载 (Eager Loading)

```csharp
// Include
var users = await _context.Users
    .Include(u => u.Posts)
    .ToListAsync();

// ThenInclude
var users = await _context.Users
    .Include(u => u.Posts)
        .ThenInclude(p => p.Comments)
    .ToListAsync();

// 多个 Include
var users = await _context.Users
    .Include(u => u.Posts)
    .Include(u => u.Profile)
    .ToListAsync();
```

### 显式加载 (Explicit Loading)

```csharp
var user = await _context.Users.FindAsync(id);

// 加载集合
await _context.Entry(user)
    .Collection(u => u.Posts)
    .LoadAsync();

// 加载引用
await _context.Entry(user)
    .Reference(u => u.Profile)
    .LoadAsync();
```

### 延迟加载 (Lazy Loading)

```csharp
// 安装包
// dotnet add package Microsoft.EntityFrameworkCore.Proxies

// 启用延迟加载
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString)
           .UseLazyLoadingProxies());

// 导航属性必须是 virtual
public class User
{
    public int Id { get; set; }
    public virtual List<Post> Posts { get; set; }
}
```

### AsNoTracking

```csharp
// 只读查询，不跟踪变更
var users = await _context.Users
    .AsNoTracking()
    .ToListAsync();
```

### 批量操作

```csharp
// 使用 EF Core Plus 或 EF Core Bulk Extensions
// dotnet add package Z.EntityFramework.Plus.EFCore

// 批量更新
await _context.Users
    .Where(u => u.IsActive == false)
    .UpdateAsync(u => new User { IsDeleted = true });

// 批量删除
await _context.Users
    .Where(u => u.IsDeleted == true)
    .DeleteAsync();
```

## 事务

```csharp
// 使用事务
using (var transaction = await _context.Database.BeginTransactionAsync())
{
    try
    {
        var user = new User { Username = "test" };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        var post = new Post { UserId = user.Id, Title = "First Post" };
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        
        await transaction.CommitAsync();
    }
    catch
    {
        await transaction.RollbackAsync();
        throw;
    }
}

// SaveChanges 自动使用事务
_context.Users.Add(user);
_context.Posts.Add(post);
await _context.SaveChangesAsync(); // 原子操作
```

## 并发控制

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    
    [Timestamp]
    public byte[] RowVersion { get; set; }
}

// 处理并发冲突
try
{
    await _context.SaveChangesAsync();
}
catch (DbUpdateConcurrencyException ex)
{
    foreach (var entry in ex.Entries)
    {
        var databaseValues = await entry.GetDatabaseValuesAsync();
        
        if (databaseValues == null)
        {
            // 记录已被删除
        }
        else
        {
            // 解决冲突
            entry.OriginalValues.SetValues(databaseValues);
        }
    }
}
```

## 最佳实践

1. **使用异步方法**
   ```csharp
   await _context.Users.ToListAsync();
   await _context.SaveChangesAsync();
   ```

2. **合理使用 AsNoTracking**
   ```csharp
   // 只读查询使用 AsNoTracking
   var users = await _context.Users.AsNoTracking().ToListAsync();
   ```

3. **避免 N+1 查询**
   ```csharp
   // 使用 Include 预加载
   var users = await _context.Users.Include(u => u.Posts).ToListAsync();
   ```

4. **使用投影减少数据传输**
   ```csharp
   var users = await _context.Users
       .Select(u => new { u.Id, u.Username })
       .ToListAsync();
   ```

5. **合理设置 DbContext 生命周期**
   ```csharp
   // 使用 Scoped 生命周期
   builder.Services.AddDbContext<ApplicationDbContext>(
       ServiceLifetime.Scoped);
   ```

## 总结

Entity Framework Core 是一个强大的 ORM 框架，主要特点：

- ✅ 跨平台、高性能
- ✅ 强类型 LINQ 查询
- ✅ 自动变更跟踪
- ✅ 数据库迁移
- ✅ 丰富的关系配置

掌握 EF Core 可以大大提高数据访问层的开发效率。

## 参考资源

- [EF Core 官方文档](https://docs.microsoft.com/zh-cn/ef/core/)
- [EF Core GitHub](https://github.com/dotnet/efcore)
- [EF Core 教程](https://docs.microsoft.com/zh-cn/ef/core/get-started/)
