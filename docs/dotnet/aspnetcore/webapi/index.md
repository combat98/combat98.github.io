# ASP.NET Core Web API

## 概述

ASP.NET Core Web API 是用于构建 RESTful HTTP 服务的框架，支持跨平台开发，可在 Windows、Linux 和 macOS 上运行。

### 核心特性

- RESTful 架构风格
- 内容协商（JSON、XML）
- 路由和模型绑定
- 数据验证
- 依赖注入
- 中间件管道
- 跨域支持（CORS）

## 快速开始

### 创建项目

```bash
dotnet new webapi -n MyApi
cd MyApi
dotnet run
```

### Program.cs（.NET 6+）

```csharp
var builder = WebApplication.CreateBuilder(args);

// 添加服务
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 配置中间件
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

### 第一个 API

```csharp
[ApiController]
[Route("api/[controller]")]
public class WeatherForecastController : ControllerBase
{
    [HttpGet]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = "Sunny"
        });
    }
}

public record WeatherForecast(DateTime Date, int TemperatureC, string Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
```

## 控制器

### 基本控制器

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }
    
    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }
    
    // GET: api/users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }
    
    // POST: api/users
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(CreateUserDto dto)
    {
        var user = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }
    
    // PUT: api/users/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest();
        }
        
        await _userService.UpdateAsync(dto);
        return NoContent();
    }
    
    // DELETE: api/users/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await _userService.DeleteAsync(id);
        return NoContent();
    }
}
```

### 路由

```csharp
// 属性路由
[Route("api/[controller]")]
[Route("api/v1/[controller]")]  // 多个路由

// 路由参数
[HttpGet("{id}")]
[HttpGet("{id:int}")]           // 约束类型
[HttpGet("{id:min(1)}")]        // 约束范围
[HttpGet("{id:regex(^\\d{{3}}$)}")]  // 正则约束

// 路由名称
[HttpGet("{id}", Name = "GetUser")]

// 查询参数
[HttpGet]
public IActionResult Get([FromQuery] int page = 1, [FromQuery] int size = 10)
{
    // ...
}
```

### 响应类型

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // 返回 200 OK
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<Product> Get(int id)
    {
        var product = GetProductById(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }
    
    // 返回 201 Created
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<Product> Create(Product product)
    {
        // 创建逻辑
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
    }
    
    // 返回 204 No Content
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Delete(int id)
    {
        // 删除逻辑
        return NoContent();
    }
}
```

## 模型绑定

### 绑定源

```csharp
[HttpPost]
public IActionResult Create(
    [FromBody] Product product,      // 请求体（JSON）
    [FromQuery] int page,            // 查询字符串
    [FromRoute] int id,              // 路由参数
    [FromHeader] string token,       // 请求头
    [FromForm] IFormFile file)       // 表单数据
{
    // ...
}
```

### 模型验证

```csharp
public class CreateUserDto
{
    [Required(ErrorMessage = "用户名不能为空")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "用户名长度2-50")]
    public string Username { get; set; }
    
    [Required]
    [EmailAddress(ErrorMessage = "邮箱格式不正确")]
    public string Email { get; set; }
    
    [Required]
    [Range(18, 100, ErrorMessage = "年龄18-100")]
    public int Age { get; set; }
    
    [Phone(ErrorMessage = "手机号格式不正确")]
    public string Phone { get; set; }
    
    [Url]
    public string Website { get; set; }
    
    [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", 
        ErrorMessage = "密码至少8位，包含字母和数字")]
    public string Password { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpPost]
    public IActionResult Create([FromBody] CreateUserDto dto)
    {
        // [ApiController] 自动验证模型
        // 如果验证失败，自动返回 400 Bad Request
        
        // 手动验证
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        // 业务逻辑
        return Ok();
    }
}
```

### 自定义验证

```csharp
public class CustomValidationAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext context)
    {
        if (value is string str && str.Contains("admin"))
        {
            return new ValidationResult("用户名不能包含 admin");
        }
        return ValidationResult.Success;
    }
}

public class CreateUserDto
{
    [CustomValidation]
    public string Username { get; set; }
}
```

## 依赖注入

### 注册服务

```csharp
// Program.cs
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddSingleton<ICacheService, CacheService>();
builder.Services.AddTransient<IEmailService, EmailService>();

// 注册 DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// 注册 HttpClient
builder.Services.AddHttpClient<IApiClient, ApiClient>(client =>
{
    client.BaseAddress = new Uri("https://api.example.com");
});
```

### 使用服务

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;
    
    public UsersController(
        IUserService userService,
        ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        _logger.LogInformation("获取用户列表");
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }
}
```

## 过滤器

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
            Code = 500,
            Message = "服务器内部错误",
            Detail = context.Exception.Message
        };
        
        context.Result = new ObjectResult(result)
        {
            StatusCode = StatusCodes.Status500InternalServerError
        };
        
        context.ExceptionHandled = true;
    }
}

// 注册
builder.Services.AddControllers(options =>
{
    options.Filters.Add<GlobalExceptionFilter>();
});
```

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
        _logger.LogInformation($"执行前: {context.ActionDescriptor.DisplayName}");
    }
    
    public void OnActionExecuted(ActionExecutedContext context)
    {
        _logger.LogInformation($"执行后: {context.ActionDescriptor.DisplayName}");
    }
}

// 使用
[ServiceFilter(typeof(LogActionFilter))]
[HttpGet]
public IActionResult Get()
{
    return Ok();
}
```

### 授权过滤器

```csharp
public class ApiKeyAuthFilter : IAuthorizationFilter
{
    private readonly IConfiguration _configuration;
    
    public ApiKeyAuthFilter(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var apiKey = context.HttpContext.Request.Headers["X-API-Key"].FirstOrDefault();
        var validApiKey = _configuration["ApiKey"];
        
        if (apiKey != validApiKey)
        {
            context.Result = new UnauthorizedResult();
        }
    }
}
```

## 中间件

### 自定义中间件

```csharp
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
        _logger.LogInformation($"请求: {context.Request.Method} {context.Request.Path}");
        
        await _next(context);
        
        _logger.LogInformation($"响应: {context.Response.StatusCode}");
    }
}

// 扩展方法
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestLoggingMiddleware>();
    }
}

// 使用
app.UseRequestLogging();
```

## Swagger/OpenAPI

### 配置 Swagger

```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1",
        Description = "API 文档",
        Contact = new OpenApiContact
        {
            Name = "开发者",
            Email = "dev@example.com"
        }
    });
    
    // 添加 XML 注释
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
    
    // 添加 JWT 认证
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    options.RoutePrefix = string.Empty;  // 根路径访问
});
```

### XML 注释

```csharp
/// <summary>
/// 获取用户信息
/// </summary>
/// <param name="id">用户ID</param>
/// <returns>用户信息</returns>
/// <response code="200">成功</response>
/// <response code="404">用户不存在</response>
[HttpGet("{id}")]
[ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task<ActionResult<User>> GetUser(int id)
{
    // ...
}
```

## CORS 跨域

```csharp
// 配置 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
    
    options.AddPolicy("Specific", builder =>
    {
        builder.WithOrigins("https://example.com")
               .WithMethods("GET", "POST")
               .WithHeaders("Content-Type", "Authorization")
               .AllowCredentials();
    });
});

// 使用 CORS
app.UseCors("AllowAll");

// 控制器级别
[EnableCors("Specific")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    // ...
}
```

## 文件上传

```csharp
[HttpPost("upload")]
public async Task<IActionResult> Upload(IFormFile file)
{
    if (file == null || file.Length == 0)
    {
        return BadRequest("文件不能为空");
    }
    
    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    var filePath = Path.Combine("uploads", fileName);
    
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    
    return Ok(new { FileName = fileName, Size = file.Length });
}

// 多文件上传
[HttpPost("uploads")]
public async Task<IActionResult> Uploads(List<IFormFile> files)
{
    var results = new List<object>();
    
    foreach (var file in files)
    {
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine("uploads", fileName);
        
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
        
        results.Add(new { FileName = fileName, Size = file.Length });
    }
    
    return Ok(results);
}
```

## 版本控制

```csharp
// 安装包
// Microsoft.AspNetCore.Mvc.Versioning

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

// 使用
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class UsersV1Controller : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("V1");
}

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("2.0")]
public class UsersV2Controller : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("V2");
}
```

## 最佳实践

### 统一响应格式

```csharp
public class ApiResponse<T>
{
    public int Code { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    
    public static ApiResponse<T> Success(T data, string message = "成功")
    {
        return new ApiResponse<T>
        {
            Code = 200,
            Message = message,
            Data = data
        };
    }
    
    public static ApiResponse<T> Error(int code, string message)
    {
        return new ApiResponse<T>
        {
            Code = code,
            Message = message
        };
    }
}

[HttpGet]
public ActionResult<ApiResponse<List<User>>> Get()
{
    var users = _userService.GetAll();
    return Ok(ApiResponse<List<User>>.Success(users));
}
```

### 分页

```csharp
public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

[HttpGet]
public async Task<ActionResult<PagedResult<User>>> Get(
    [FromQuery] int page = 1,
    [FromQuery] int size = 10)
{
    var result = await _userService.GetPagedAsync(page, size);
    return Ok(result);
}
```
