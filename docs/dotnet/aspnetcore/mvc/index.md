# ASP.NET Core MVC

## 概述

ASP.NET Core MVC 是基于 Model-View-Controller 设计模式的 Web 应用框架，用于构建动态网站和 Web 应用程序。

### MVC 模式

- Model（模型）：业务逻辑和数据
- View（视图）：用户界面
- Controller（控制器）：处理请求和响应

## 快速开始

### 创建项目

```bash
dotnet new mvc -n MyMvcApp
cd MyMvcApp
dotnet run
```

### Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

// 添加 MVC 服务
builder.Services.AddControllersWithViews();

var app = builder.Build();

// 配置中间件
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
```

## 控制器

### 基本控制器

```csharp
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    
    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }
    
    // GET: /Home/Index
    public IActionResult Index()
    {
        return View();
    }
    
    // GET: /Home/About
    public IActionResult About()
    {
        ViewData["Message"] = "关于页面";
        return View();
    }
    
    // GET: /Home/Contact
    public IActionResult Contact()
    {
        ViewBag.Email = "contact@example.com";
        return View();
    }
}
```

### 操作方法

```csharp
public class ProductsController : Controller
{
    // 返回视图
    public IActionResult Index()
    {
        return View();
    }
    
    // 返回 JSON
    public IActionResult GetJson()
    {
        var data = new { Name = "Product", Price = 99.99 };
        return Json(data);
    }
    
    // 重定向
    public IActionResult RedirectToHome()
    {
        return RedirectToAction("Index", "Home");
    }
    
    // 返回内容
    public IActionResult GetContent()
    {
        return Content("Hello World");
    }
    
    // 返回文件
    public IActionResult DownloadFile()
    {
        var bytes = System.IO.File.ReadAllBytes("file.pdf");
        return File(bytes, "application/pdf", "download.pdf");
    }
    
    // 返回部分视图
    public IActionResult GetPartial()
    {
        return PartialView("_ProductCard");
    }
}
```

## 路由

### 约定路由

```csharp
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "blog",
    pattern: "blog/{year}/{month}/{day}",
    defaults: new { controller = "Blog", action = "Post" });

app.MapControllerRoute(
    name: "admin",
    pattern: "admin/{controller=Dashboard}/{action=Index}/{id?}");
```

### 属性路由

```csharp
[Route("products")]
public class ProductsController : Controller
{
    // GET: /products
    [Route("")]
    [Route("index")]
    public IActionResult Index()
    {
        return View();
    }
    
    // GET: /products/5
    [Route("{id:int}")]
    public IActionResult Details(int id)
    {
        return View();
    }
    
    // GET: /products/create
    [Route("create")]
    public IActionResult Create()
    {
        return View();
    }
    
    // POST: /products/create
    [HttpPost]
    [Route("create")]
    public IActionResult Create(Product product)
    {
        return RedirectToAction(nameof(Index));
    }
}
```

### 路由约束

```csharp
[Route("products/{id:int}")]           // 整数
[Route("products/{id:min(1)}")]        // 最小值
[Route("products/{id:range(1,100)}")]  // 范围
[Route("products/{name:alpha}")]       // 字母
[Route("products/{code:regex(^\\d{{3}}$)}")]  // 正则
```

## 视图

### Razor 语法

```cshtml
@* 注释 *@

@* 输出变量 *@
<h1>@ViewData["Title"]</h1>
<p>@ViewBag.Message</p>

@* C# 代码块 *@
@{
    var name = "张三";
    var age = 25;
}

@* 条件语句 *@
@if (age >= 18)
{
    <p>成年人</p>
}
else
{
    <p>未成年</p>
}

@* 循环 *@
@foreach (var item in Model)
{
    <div>@item.Name</div>
}

@* Switch *@
@switch (ViewBag.Status)
{
    case "Active":
        <span class="badge badge-success">激活</span>
        break;
    case "Inactive":
        <span class="badge badge-danger">未激活</span>
        break;
}
```

### 强类型视图

```csharp
// Controller
public IActionResult Details(int id)
{
    var product = _productService.GetById(id);
    return View(product);
}

// View
@model Product

<h1>@Model.Name</h1>
<p>价格: @Model.Price</p>
<p>描述: @Model.Description</p>
```

### 布局页

```cshtml
<!-- _Layout.cshtml -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>@ViewData["Title"] - My App</title>
    <link rel="stylesheet" href="~/css/site.css" />
</head>
<body>
    <header>
        <nav>
            <a asp-controller="Home" asp-action="Index">首页</a>
            <a asp-controller="Products" asp-action="Index">产品</a>
        </nav>
    </header>
    
    <main>
        @RenderBody()
    </main>
    
    <footer>
        @RenderSection("Scripts", required: false)
    </footer>
    
    <script src="~/js/site.js"></script>
</body>
</html>

<!-- Index.cshtml -->
@{
    ViewData["Title"] = "首页";
    Layout = "_Layout";
}

<h1>欢迎</h1>

@section Scripts {
    <script src="~/js/home.js"></script>
}
```

### 部分视图

```cshtml
<!-- _ProductCard.cshtml -->
@model Product

<div class="card">
    <h3>@Model.Name</h3>
    <p>@Model.Price</p>
</div>

<!-- 使用部分视图 -->
@foreach (var product in Model)
{
    <partial name="_ProductCard" model="product" />
}

<!-- 或 -->
@await Html.PartialAsync("_ProductCard", product)
```

### 视图组件

```csharp
// ViewComponent
public class CartViewComponent : ViewComponent
{
    private readonly ICartService _cartService;
    
    public CartViewComponent(ICartService cartService)
    {
        _cartService = cartService;
    }
    
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var items = await _cartService.GetItemsAsync();
        return View(items);
    }
}

// Views/Shared/Components/Cart/Default.cshtml
@model List<CartItem>

<div class="cart">
    <h4>购物车 (@Model.Count)</h4>
    @foreach (var item in Model)
    {
        <div>@item.Name - @item.Quantity</div>
    }
</div>

<!-- 使用视图组件 -->
<vc:cart></vc:cart>
<!-- 或 -->
@await Component.InvokeAsync("Cart")
```

## 模型绑定

### 表单绑定

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

// Controller
[HttpPost]
public IActionResult Create(Product product)
{
    if (ModelState.IsValid)
    {
        _productService.Add(product);
        return RedirectToAction(nameof(Index));
    }
    return View(product);
}

// View
@model Product

<form asp-action="Create" method="post">
    <div>
        <label asp-for="Name"></label>
        <input asp-for="Name" />
        <span asp-validation-for="Name"></span>
    </div>
    <div>
        <label asp-for="Price"></label>
        <input asp-for="Price" />
        <span asp-validation-for="Price"></span>
    </div>
    <button type="submit">提交</button>
</form>
```

### 模型验证

```csharp
public class RegisterViewModel
{
    [Required(ErrorMessage = "用户名不能为空")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "用户名长度3-50")]
    [Display(Name = "用户名")]
    public string Username { get; set; }
    
    [Required(ErrorMessage = "邮箱不能为空")]
    [EmailAddress(ErrorMessage = "邮箱格式不正确")]
    [Display(Name = "邮箱")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "密码不能为空")]
    [DataType(DataType.Password)]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "密码长度6-100")]
    [Display(Name = "密码")]
    public string Password { get; set; }
    
    [Required]
    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "两次密码不一致")]
    [Display(Name = "确认密码")]
    public string ConfirmPassword { get; set; }
}

// Controller
[HttpPost]
public IActionResult Register(RegisterViewModel model)
{
    if (!ModelState.IsValid)
    {
        return View(model);
    }
    
    // 注册逻辑
    return RedirectToAction("Index", "Home");
}

// View
@model RegisterViewModel

<form asp-action="Register" method="post">
    <div asp-validation-summary="All" class="text-danger"></div>
    
    <div class="form-group">
        <label asp-for="Username"></label>
        <input asp-for="Username" class="form-control" />
        <span asp-validation-for="Username" class="text-danger"></span>
    </div>
    
    <div class="form-group">
        <label asp-for="Email"></label>
        <input asp-for="Email" class="form-control" />
        <span asp-validation-for="Email" class="text-danger"></span>
    </div>
    
    <div class="form-group">
        <label asp-for="Password"></label>
        <input asp-for="Password" class="form-control" />
        <span asp-validation-for="Password" class="text-danger"></span>
    </div>
    
    <div class="form-group">
        <label asp-for="ConfirmPassword"></label>
        <input asp-for="ConfirmPassword" class="form-control" />
        <span asp-validation-for="ConfirmPassword" class="text-danger"></span>
    </div>
    
    <button type="submit" class="btn btn-primary">注册</button>
</form>

@section Scripts {
    <partial name="_ValidationScriptsPartial" />
}
```

## Tag Helpers

### 常用 Tag Helpers

```cshtml
<!-- 表单 -->
<form asp-controller="Products" asp-action="Create" method="post">
    <!-- 输入框 -->
    <input asp-for="Name" class="form-control" />
    
    <!-- 下拉框 -->
    <select asp-for="CategoryId" asp-items="ViewBag.Categories"></select>
    
    <!-- 文本域 -->
    <textarea asp-for="Description" rows="5"></textarea>
    
    <!-- 复选框 -->
    <input asp-for="IsActive" type="checkbox" />
    
    <!-- 单选按钮 -->
    <input asp-for="Gender" type="radio" value="Male" /> 男
    <input asp-for="Gender" type="radio" value="Female" /> 女
    
    <!-- 隐藏字段 -->
    <input asp-for="Id" type="hidden" />
    
    <!-- 提交按钮 -->
    <button type="submit">提交</button>
</form>

<!-- 链接 -->
<a asp-controller="Products" asp-action="Details" asp-route-id="5">详情</a>

<!-- 图片 -->
<img asp-append-version="true" src="~/images/logo.png" />

<!-- 脚本和样式 -->
<link rel="stylesheet" asp-append-version="true" href="~/css/site.css" />
<script asp-append-version="true" src="~/js/site.js"></script>

<!-- 环境 -->
<environment include="Development">
    <link rel="stylesheet" href="~/css/site.css" />
</environment>
<environment exclude="Development">
    <link rel="stylesheet" href="~/css/site.min.css" />
</environment>
```

### 自定义 Tag Helper

```csharp
[HtmlTargetElement("email")]
public class EmailTagHelper : TagHelper
{
    public string Address { get; set; }
    
    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "a";
        output.Attributes.SetAttribute("href", $"mailto:{Address}");
        output.Content.SetContent(Address);
    }
}

<!-- 使用 -->
<email address="contact@example.com"></email>
<!-- 输出: <a href="mailto:contact@example.com">contact@example.com</a> -->
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
        _logger.LogInformation($"执行前: {context.ActionDescriptor.DisplayName}");
    }
    
    public void OnActionExecuted(ActionExecutedContext context)
    {
        _logger.LogInformation($"执行后: {context.ActionDescriptor.DisplayName}");
    }
}

// 全局注册
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<LogActionFilter>();
});

// 控制器级别
[ServiceFilter(typeof(LogActionFilter))]
public class HomeController : Controller
{
    // ...
}

// 操作级别
[ServiceFilter(typeof(LogActionFilter))]
public IActionResult Index()
{
    return View();
}
```

### 异常过滤器

```csharp
public class CustomExceptionFilter : IExceptionFilter
{
    private readonly ILogger<CustomExceptionFilter> _logger;
    
    public CustomExceptionFilter(ILogger<CustomExceptionFilter> logger)
    {
        _logger = logger;
    }
    
    public void OnException(ExceptionContext context)
    {
        _logger.LogError(context.Exception, "未处理的异常");
        
        context.Result = new ViewResult
        {
            ViewName = "Error",
            ViewData = new ViewDataDictionary(
                new EmptyModelMetadataProvider(),
                new ModelStateDictionary())
            {
                Model = context.Exception.Message
            }
        };
        
        context.ExceptionHandled = true;
    }
}
```

## 区域（Areas）

### 创建区域

```
Areas/
├── Admin/
│   ├── Controllers/
│   │   └── DashboardController.cs
│   └── Views/
│       └── Dashboard/
│           └── Index.cshtml
└── Customer/
    ├── Controllers/
    └── Views/
```

```csharp
// Controller
[Area("Admin")]
public class DashboardController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}

// 路由配置
app.MapControllerRoute(
    name: "admin",
    pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}");

// 链接
<a asp-area="Admin" asp-controller="Dashboard" asp-action="Index">管理后台</a>
```

## 会话和缓存

### 会话

```csharp
// 配置
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

app.UseSession();

// 使用
public IActionResult SetSession()
{
    HttpContext.Session.SetString("Username", "张三");
    HttpContext.Session.SetInt32("UserId", 123);
    return Ok();
}

public IActionResult GetSession()
{
    var username = HttpContext.Session.GetString("Username");
    var userId = HttpContext.Session.GetInt32("UserId");
    return Ok(new { username, userId });
}
```

### TempData

```csharp
// 设置
public IActionResult Create(Product product)
{
    _productService.Add(product);
    TempData["Message"] = "创建成功";
    return RedirectToAction(nameof(Index));
}

// 读取
public IActionResult Index()
{
    ViewBag.Message = TempData["Message"];
    return View();
}
```

## 文件上传

```csharp
// Controller
[HttpPost]
public async Task<IActionResult> Upload(IFormFile file)
{
    if (file == null || file.Length == 0)
    {
        ModelState.AddModelError("", "请选择文件");
        return View();
    }
    
    var fileName = Path.GetFileName(file.FileName);
    var filePath = Path.Combine("wwwroot/uploads", fileName);
    
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    
    return RedirectToAction(nameof(Index));
}

// View
<form asp-action="Upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file" />
    <button type="submit">上传</button>
</form>
```

## 最佳实践

### ViewModel 模式

```csharp
// ViewModel
public class ProductListViewModel
{
    public List<Product> Products { get; set; }
    public int TotalCount { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

// Controller
public IActionResult Index(int page = 1)
{
    var viewModel = new ProductListViewModel
    {
        Products = _productService.GetPage(page, 10),
        TotalCount = _productService.Count(),
        PageIndex = page,
        PageSize = 10
    };
    
    return View(viewModel);
}
```

### 依赖注入

```csharp
// Service
public interface IProductService
{
    List<Product> GetAll();
    Product GetById(int id);
    void Add(Product product);
    void Update(Product product);
    void Delete(int id);
}

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    
    public ProductService(AppDbContext context)
    {
        _context = context;
    }
    
    // 实现方法...
}

// 注册
builder.Services.AddScoped<IProductService, ProductService>();

// 使用
public class ProductsController : Controller
{
    private readonly IProductService _productService;
    
    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }
}
```
