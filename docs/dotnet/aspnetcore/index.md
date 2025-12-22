# ASP.NET Core 基础

## 简介

ASP.NET Core 是一个跨平台、高性能的开源框架，用于构建现代的、基于云的、互联网连接的应用程序。

### 特点

- **跨平台** - 支持 Windows、Linux、macOS
- **高性能** - 比传统 ASP.NET 快数倍
- **模块化** - 按需引入功能模块
- **依赖注入** - 内置 DI 容器
- **统一框架** - MVC、Web API、Razor Pages 统一

## 快速开始

### 创建项目

```bash
# 创建 Web API 项目
dotnet new webapi -n MyApi

# 创建 MVC 项目
dotnet new mvc -n MyMvcApp

# 创建 Razor Pages 项目
dotnet new webapp -n MyWebApp
```

### 项目结构

```
MyApi/
├── Controllers/        # 控制器
├── Models/            # 模型
├── Properties/        # 项目属性
├── appsettings.json   # 配置文件
├── Program.cs         # 程序入口
└── MyApi.csproj       # 项目文件
```

### Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

// 添加服务到容器
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 配置 HTTP 请求管道
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

## 依赖注入

### 服务注册

```csharp
// 瞬时服务 - 每次请求都创建新实例
builder.Services.AddTransient<IEmailService, EmailService>();

// 作用域服务 - 每个请求创建一个实例
builder.Services.AddScoped<IUserService, UserService>();

// 单例服务 - 整个应用生命周期只有一个实例
builder.Services.AddSingleton<IConfigService, ConfigService>();
```

### 服务注入

```csharp
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;
    
    // 构造函数注入
    public UserController(
        IUserService userService,
        ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }
}
```

## 配置管理

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyDb;User=sa;Password=***"
  },
  "AppSettings": {
    "ApiKey": "your-api-key",
    "MaxPageSize": 100
  }
}
```

### 读取配置

```csharp
// 方式1: 直接注入 IConfiguration
public class MyService
{
    private readonly IConfiguration _configuration;
    
    public MyService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public void DoSomething()
    {
        string apiKey = _configuration["AppSettings:ApiKey"];
        int maxSize = _configuration.GetValue<int>("AppSettings:MaxPageSize");
    }
}

// 方式2: 使用 Options 模式
public class AppSettings
{
    public string ApiKey { get; set; }
    public int MaxPageSize { get; set; }
}

// 注册配置
builder.Services.Configure<AppSettings>(
    builder.Configuration.GetSection("AppSettings"));

// 使用配置
public class MyService
{
    private readonly AppSettings _settings;
    
    public MyService(IOptions<AppSettings> options)
    {
        _settings = options.Value;
    }
}
```

## 中间件

### 内置中间件

```csharp
var app = builder.Build();

// 异常处理
app.UseExceptionHandler("/Error");

// HTTPS 重定向
app.UseHttpsRedirection();

// 静态文件
app.UseStaticFiles();

// 路由
app.UseRouting();

// 认证
app.UseAuthentication();

// 授权
app.UseAuthorization();

// 端点映射
app.MapControllers();
```

### 自定义中间件

```csharp
// 中间件类
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;
    
    public RequestLoggingMiddleware(
        RequestDelegate next,
        ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation(
            $"请求: {context.Request.Method} {context.Request.Path}");
        
        await _next(context);
        
        _logger.LogInformation(
            $"响应: {context.Response.StatusCode}");
    }
}

// 扩展方法
public static class RequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestLoggingMiddleware>();
    }
}

// 使用中间件
app.UseRequestLogging();
```

### 内联中间件

```csharp
app.Use(async (context, next) =>
{
    // 请求处理前
    Console.WriteLine($"请求: {context.Request.Path}");
    
    await next();
    
    // 请求处理后
    Console.WriteLine($"响应: {context.Response.StatusCode}");
});
```

## 路由

### 属性路由

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    // GET: api/users
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok();
    }
    
    // GET: api/users/5
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        return Ok();
    }
    
    // POST: api/users
    [HttpPost]
    public IActionResult Create([FromBody] User user)
    {
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }
    
    // PUT: api/users/5
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] User user)
    {
        return NoContent();
    }
    
    // DELETE: api/users/5
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return NoContent();
    }
}
```

### 路由约束

```csharp
[HttpGet("{id:int}")]  // id 必须是整数
public IActionResult GetById(int id) { }

[HttpGet("{name:alpha}")]  // name 只能包含字母
public IActionResult GetByName(string name) { }

[HttpGet("{date:datetime}")]  // date 必须是日期时间
public IActionResult GetByDate(DateTime date) { }

[HttpGet("{id:min(1)}")]  // id 最小值为 1
public IActionResult GetById(int id) { }
```

## 模型绑定和验证

### 模型绑定

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}

[HttpPost]
public IActionResult Create(
    [FromBody] User user,      // 从请求体
    [FromQuery] int page,      // 从查询字符串
    [FromRoute] int id,        // 从路由
    [FromHeader] string token, // 从请求头
    [FromForm] IFormFile file) // 从表单
{
    return Ok();
}
```

### 数据验证

```csharp
using System.ComponentModel.DataAnnotations;

public class CreateUserDto
{
    [Required(ErrorMessage = "用户名不能为空")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "用户名长度必须在3-50之间")]
    public string Username { get; set; }
    
    [Required]
    [EmailAddress(ErrorMessage = "邮箱格式不正确")]
    public string Email { get; set; }
    
    [Required]
    [MinLength(6, ErrorMessage = "密码至少6位")]
    public string Password { get; set; }
    
    [Range(18, 100, ErrorMessage = "年龄必须在18-100之间")]
    public int Age { get; set; }
}

[HttpPost]
public IActionResult Create([FromBody] CreateUserDto dto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    
    // 处理业务逻辑
    return Ok();
}
```

### 自定义验证

```csharp
public class FutureDateAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(
        object value, ValidationContext validationContext)
    {
        if (value is DateTime date)
        {
            if (date > DateTime.Now)
            {
                return ValidationResult.Success;
            }
            return new ValidationResult("日期必须是未来时间");
        }
        return new ValidationResult("无效的日期格式");
    }
}

public class Event
{
    [FutureDate]
    public DateTime StartDate { get; set; }
}
```

## 过滤器

### 操作过滤器

```csharp
public class LogActionFilter : IActionFilter
{
    private readonly ILogger<LogActionFilter> _logger;
    
    public LogActionFilter(ILogger<LogActionFilter> logger)
    {
        _logger = logger;
    }
    
    public void OnActionExecuting(ActionExecutingContext context)
    {
        _logger.LogInformation($"执行操作: {context.ActionDescriptor.DisplayName}");
    }
    
    public void OnActionExecuted(ActionExecutedContext context)
    {
        _logger.LogInformation($"操作完成: {context.ActionDescriptor.DisplayName}");
    }
}

// 注册过滤器
builder.Services.AddControllers(options =>
{
    options.Filters.Add<LogActionFilter>();
});

// 或在控制器/操作上使用
[ServiceFilter(typeof(LogActionFilter))]
public class UsersController : ControllerBase { }
```

### 异常过滤器

```csharp
public class GlobalExceptionFilter : IExceptionFilter
{
    private readonly ILogger<GlobalExceptionFilter> _logger;
    
    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
    {
        _logger = logger;
    }
    
    public void OnException(ExceptionContext context)
    {
        _logger.LogError(context.Exception, "未处理的异常");
        
        var result = new
        {
            error = "服务器内部错误",
            message = context.Exception.Message
        };
        
        context.Result = new ObjectResult(result)
        {
            StatusCode = 500
        };
        
        context.ExceptionHandled = true;
    }
}
```

## 日志

### 使用日志

```csharp
public class UserService
{
    private readonly ILogger<UserService> _logger;
    
    public UserService(ILogger<UserService> logger)
    {
        _logger = logger;
    }
    
    public async Task<User> GetUserAsync(int id)
    {
        _logger.LogInformation("获取用户信息, ID: {UserId}", id);
        
        try
        {
            var user = await _repository.GetByIdAsync(id);
            
            if (user == null)
            {
                _logger.LogWarning("用户不存在, ID: {UserId}", id);
            }
            
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取用户失败, ID: {UserId}", id);
            throw;
        }
    }
}
```

### 配置日志

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

## 静态文件

```csharp
// 启用静态文件
app.UseStaticFiles();

// 自定义静态文件目录
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "MyStaticFiles")),
    RequestPath = "/StaticFiles"
});
```

## CORS

```csharp
// 添加 CORS 服务
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
    
    options.AddPolicy("AllowSpecific", builder =>
    {
        builder.WithOrigins("https://example.com")
               .WithMethods("GET", "POST")
               .WithHeaders("Content-Type");
    });
});

// 使用 CORS
app.UseCors("AllowAll");
```

## 最佳实践

1. **项目结构**
   - 使用分层架构（Controller、Service、Repository）
   - 合理组织代码文件
   - 使用 DTOs 传输数据

2. **依赖注入**
   - 优先使用接口
   - 选择合适的生命周期
   - 避免服务定位器模式

3. **配置管理**
   - 使用 Options 模式
   - 敏感信息使用 User Secrets 或环境变量
   - 不同环境使用不同配置文件

4. **错误处理**
   - 使用全局异常处理
   - 返回统一的错误格式
   - 记录详细的错误日志

5. **性能优化**
   - 使用异步方法
   - 启用响应压缩
   - 合理使用缓存

## 总结

ASP.NET Core 是一个现代化的 Web 开发框架，主要特点：

- ✅ 跨平台、高性能
- ✅ 内置依赖注入
- ✅ 灵活的中间件管道
- ✅ 统一的开发体验
- ✅ 丰富的生态系统

掌握 ASP.NET Core 基础是开发现代 Web 应用的关键。

## 参考资源

- [ASP.NET Core 官方文档](https://docs.microsoft.com/zh-cn/aspnet/core/)
- [ASP.NET Core 教程](https://docs.microsoft.com/zh-cn/aspnet/core/tutorials/)
- [ASP.NET Core GitHub](https://github.com/dotnet/aspnetcore)
