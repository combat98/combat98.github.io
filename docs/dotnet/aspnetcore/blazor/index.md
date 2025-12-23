# Blazor

## 概述

Blazor 是一个使用 C# 和 .NET 构建交互式 Web UI 的框架，可以在浏览器中运行 .NET 代码。

### Blazor 模式

| 模式 | 说明 | 运行位置 |
|------|------|----------|
| Blazor Server | 服务器端渲染，通过 SignalR 通信 | 服务器 |
| Blazor WebAssembly | 客户端渲染，下载到浏览器运行 | 浏览器 |
| Blazor Hybrid | 混合模式，用于桌面和移动应用 | 本地 |

### 核心特性

- 使用 C# 代替 JavaScript
- 组件化开发
- 双向数据绑定
- 依赖注入
- 路由系统
- 表单验证

## 快速开始

### 创建项目

```bash
# Blazor Server
dotnet new blazorserver -n MyBlazorApp

# Blazor WebAssembly
dotnet new blazorwasm -n MyBlazorApp

cd MyBlazorApp
dotnet run
```

### Program.cs（Blazor Server）

```csharp
var builder = WebApplication.CreateBuilder(args);

// 添加服务
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddSingleton<WeatherForecastService>();

var app = builder.Build();

// 配置中间件
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
```

### Program.cs（Blazor WebAssembly）

```csharp
var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient 
{ 
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) 
});

await builder.Build().RunAsync();
```

## 组件

### 基本组件

```razor
@* Counter.razor *@
@page "/counter"

<PageTitle>计数器</PageTitle>

<h1>计数器</h1>

<p>当前计数: @currentCount</p>

<button class="btn btn-primary" @onclick="IncrementCount">点击我</button>

@code {
    private int currentCount = 0;

    private void IncrementCount()
    {
        currentCount++;
    }
}
```

### 组件参数

```razor
@* ChildComponent.razor *@
<div class="card">
    <h3>@Title</h3>
    <p>@Content</p>
</div>

@code {
    [Parameter]
    public string Title { get; set; }
    
    [Parameter]
    public string Content { get; set; }
}

@* 使用组件 *@
<ChildComponent Title="标题" Content="内容" />
```

### 事件回调

```razor
@* ChildComponent.razor *@
<button @onclick="OnButtonClick">点击</button>

@code {
    [Parameter]
    public EventCallback OnClick { get; set; }
    
    private async Task OnButtonClick()
    {
        await OnClick.InvokeAsync();
    }
}

@* ParentComponent.razor *@
<ChildComponent OnClick="HandleClick" />

@code {
    private void HandleClick()
    {
        Console.WriteLine("子组件被点击");
    }
}
```

### 级联参数

```razor
@* ParentComponent.razor *@
<CascadingValue Value="@theme">
    <ChildComponent />
</CascadingValue>

@code {
    private string theme = "dark";
}

@* ChildComponent.razor *@
<p>当前主题: @Theme</p>

@code {
    [CascadingParameter]
    public string Theme { get; set; }
}
```

### 组件生命周期

```razor
@code {
    protected override void OnInitialized()
    {
        // 组件初始化
        Console.WriteLine("OnInitialized");
    }
    
    protected override async Task OnInitializedAsync()
    {
        // 异步初始化
        await LoadDataAsync();
    }
    
    protected override void OnParametersSet()
    {
        // 参数设置后
        Console.WriteLine("OnParametersSet");
    }
    
    protected override async Task OnParametersSetAsync()
    {
        // 异步参数设置
        await Task.CompletedTask;
    }
    
    protected override void OnAfterRender(bool firstRender)
    {
        // 渲染后
        if (firstRender)
        {
            Console.WriteLine("首次渲染");
        }
    }
    
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        // 异步渲染后
        if (firstRender)
        {
            await JSRuntime.InvokeVoidAsync("initComponent");
        }
    }
    
    public void Dispose()
    {
        // 组件销毁
        Console.WriteLine("Dispose");
    }
}
```

## 数据绑定

### 单向绑定

```razor
<p>@message</p>
<input value="@message" />

@code {
    private string message = "Hello";
}
```

### 双向绑定

```razor
<input @bind="message" />
<input @bind="message" @bind:event="oninput" />
<p>@message</p>

@code {
    private string message = "Hello";
}
```

### 绑定格式化

```razor
<input @bind="startDate" @bind:format="yyyy-MM-dd" />
<input @bind="price" @bind:format="C2" />

@code {
    private DateTime startDate = DateTime.Now;
    private decimal price = 99.99m;
}
```

## 事件处理

### 常用事件

```razor
<button @onclick="HandleClick">点击</button>
<input @onchange="HandleChange" />
<input @oninput="HandleInput" />
<input @onfocus="HandleFocus" />
<input @onblur="HandleBlur" />
<form @onsubmit="HandleSubmit">
    <button type="submit">提交</button>
</form>

@code {
    private void HandleClick(MouseEventArgs e)
    {
        Console.WriteLine($"点击位置: {e.ClientX}, {e.ClientY}");
    }
    
    private void HandleChange(ChangeEventArgs e)
    {
        Console.WriteLine($"值改变: {e.Value}");
    }
    
    private void HandleInput(ChangeEventArgs e)
    {
        Console.WriteLine($"输入: {e.Value}");
    }
    
    private void HandleFocus()
    {
        Console.WriteLine("获得焦点");
    }
    
    private void HandleBlur()
    {
        Console.WriteLine("失去焦点");
    }
    
    private void HandleSubmit()
    {
        Console.WriteLine("表单提交");
    }
}
```

### 阻止默认行为

```razor
<form @onsubmit="HandleSubmit" @onsubmit:preventDefault>
    <button type="submit">提交</button>
</form>

<a href="https://example.com" @onclick="HandleClick" @onclick:preventDefault>
    链接
</a>
```

### 事件参数

```razor
<button @onclick="@(e => HandleClick(e, "参数"))">点击</button>

@code {
    private void HandleClick(MouseEventArgs e, string param)
    {
        Console.WriteLine($"参数: {param}");
    }
}
```

## 表单和验证

### 表单组件

```razor
@using System.ComponentModel.DataAnnotations

<EditForm Model="@model" OnValidSubmit="HandleValidSubmit">
    <DataAnnotationsValidator />
    <ValidationSummary />
    
    <div class="form-group">
        <label>用户名:</label>
        <InputText @bind-Value="model.Username" class="form-control" />
        <ValidationMessage For="@(() => model.Username)" />
    </div>
    
    <div class="form-group">
        <label>邮箱:</label>
        <InputText @bind-Value="model.Email" class="form-control" />
        <ValidationMessage For="@(() => model.Email)" />
    </div>
    
    <div class="form-group">
        <label>年龄:</label>
        <InputNumber @bind-Value="model.Age" class="form-control" />
        <ValidationMessage For="@(() => model.Age)" />
    </div>
    
    <div class="form-group">
        <label>性别:</label>
        <InputSelect @bind-Value="model.Gender" class="form-control">
            <option value="">请选择</option>
            <option value="Male">男</option>
            <option value="Female">女</option>
        </InputSelect>
        <ValidationMessage For="@(() => model.Gender)" />
    </div>
    
    <div class="form-group">
        <label>
            <InputCheckbox @bind-Value="model.AcceptTerms" />
            接受条款
        </label>
        <ValidationMessage For="@(() => model.AcceptTerms)" />
    </div>
    
    <button type="submit" class="btn btn-primary">提交</button>
</EditForm>

@code {
    private UserModel model = new();
    
    private void HandleValidSubmit()
    {
        Console.WriteLine("表单验证通过");
    }
    
    public class UserModel
    {
        [Required(ErrorMessage = "用户名不能为空")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "用户名长度3-50")]
        public string Username { get; set; }
        
        [Required(ErrorMessage = "邮箱不能为空")]
        [EmailAddress(ErrorMessage = "邮箱格式不正确")]
        public string Email { get; set; }
        
        [Required]
        [Range(18, 100, ErrorMessage = "年龄18-100")]
        public int Age { get; set; }
        
        [Required(ErrorMessage = "请选择性别")]
        public string Gender { get; set; }
        
        [Range(typeof(bool), "true", "true", ErrorMessage = "必须接受条款")]
        public bool AcceptTerms { get; set; }
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

public class UserModel
{
    [CustomValidation]
    public string Username { get; set; }
}
```

## 路由

### 路由配置

```razor
@* App.razor *@
<Router AppAssembly="@typeof(App).Assembly">
    <Found Context="routeData">
        <RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
        <FocusOnNavigate RouteData="@routeData" Selector="h1" />
    </Found>
    <NotFound>
        <PageTitle>未找到</PageTitle>
        <LayoutView Layout="@typeof(MainLayout)">
            <p>页面不存在</p>
        </LayoutView>
    </NotFound>
</Router>
```

### 路由参数

```razor
@page "/user/{id:int}"
@page "/user/{id:int}/{action}"

<h1>用户 ID: @Id</h1>
<p>操作: @Action</p>

@code {
    [Parameter]
    public int Id { get; set; }
    
    [Parameter]
    public string Action { get; set; }
}
```

### 查询参数

```razor
@page "/search"
@inject NavigationManager Navigation

<p>关键词: @keyword</p>

@code {
    private string keyword;
    
    protected override void OnInitialized()
    {
        var uri = new Uri(Navigation.Uri);
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        keyword = query["q"];
    }
}
```

### 导航

```razor
@inject NavigationManager Navigation

<button @onclick="NavigateToHome">返回首页</button>
<button @onclick="NavigateToUser">用户详情</button>

@code {
    private void NavigateToHome()
    {
        Navigation.NavigateTo("/");
    }
    
    private void NavigateToUser()
    {
        Navigation.NavigateTo("/user/123");
    }
}
```

## JavaScript 互操作

### 调用 JavaScript

```razor
@inject IJSRuntime JSRuntime

<button @onclick="ShowAlert">显示警告</button>
<button @onclick="GetValue">获取值</button>

@code {
    private async Task ShowAlert()
    {
        await JSRuntime.InvokeVoidAsync("alert", "Hello from Blazor!");
    }
    
    private async Task GetValue()
    {
        var result = await JSRuntime.InvokeAsync<string>("prompt", "请输入:");
        Console.WriteLine($"输入: {result}");
    }
}
```

### JavaScript 调用 .NET

```csharp
// C# 方法
public class JsInterop
{
    [JSInvokable]
    public static string GetMessage()
    {
        return "Hello from .NET!";
    }
    
    [JSInvokable]
    public static Task<string> GetMessageAsync()
    {
        return Task.FromResult("Hello from .NET!");
    }
}

// 注册
builder.Services.AddSingleton<JsInterop>();
```

```javascript
// JavaScript 调用
DotNet.invokeMethodAsync('MyApp', 'GetMessage')
    .then(result => console.log(result));
```

## 依赖注入

### 注册服务

```csharp
// Program.cs
builder.Services.AddScoped<IWeatherService, WeatherService>();
builder.Services.AddSingleton<IConfigService, ConfigService>();
builder.Services.AddTransient<IEmailService, EmailService>();

// HttpClient
builder.Services.AddScoped(sp => new HttpClient 
{ 
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) 
});
```

### 使用服务

```razor
@inject IWeatherService WeatherService
@inject HttpClient Http

<h3>天气预报</h3>

@if (forecasts == null)
{
    <p>加载中...</p>
}
else
{
    <table class="table">
        @foreach (var forecast in forecasts)
        {
            <tr>
                <td>@forecast.Date.ToShortDateString()</td>
                <td>@forecast.TemperatureC</td>
                <td>@forecast.Summary</td>
            </tr>
        }
    </table>
}

@code {
    private WeatherForecast[] forecasts;
    
    protected override async Task OnInitializedAsync()
    {
        forecasts = await WeatherService.GetForecastAsync();
    }
}
```

## 状态管理

### 组件状态

```razor
@code {
    private int count = 0;
    
    private void IncrementCount()
    {
        count++;
        StateHasChanged();  // 手动触发重新渲染
    }
}
```

### 应用状态

```csharp
// AppState.cs
public class AppState
{
    public string Username { get; set; }
    public bool IsAuthenticated { get; set; }
    
    public event Action OnChange;
    
    public void SetUsername(string username)
    {
        Username = username;
        NotifyStateChanged();
    }
    
    private void NotifyStateChanged() => OnChange?.Invoke();
}

// 注册
builder.Services.AddScoped<AppState>();

// 使用
@inject AppState AppState
@implements IDisposable

<p>用户: @AppState.Username</p>

@code {
    protected override void OnInitialized()
    {
        AppState.OnChange += StateHasChanged;
    }
    
    public void Dispose()
    {
        AppState.OnChange -= StateHasChanged;
    }
}
```

## HTTP 请求

### GET 请求

```razor
@inject HttpClient Http

@code {
    private User[] users;
    
    protected override async Task OnInitializedAsync()
    {
        users = await Http.GetFromJsonAsync<User[]>("api/users");
    }
}
```

### POST 请求

```razor
@inject HttpClient Http

@code {
    private async Task CreateUser(User user)
    {
        var response = await Http.PostAsJsonAsync("api/users", user);
        if (response.IsSuccessStatusCode)
        {
            var createdUser = await response.Content.ReadFromJsonAsync<User>();
        }
    }
}
```

### PUT/DELETE 请求

```razor
@code {
    private async Task UpdateUser(User user)
    {
        await Http.PutAsJsonAsync($"api/users/{user.Id}", user);
    }
    
    private async Task DeleteUser(int id)
    {
        await Http.DeleteAsync($"api/users/{id}");
    }
}
```

## 布局

### 主布局

```razor
@* MainLayout.razor *@
@inherits LayoutComponentBase

<div class="page">
    <div class="sidebar">
        <NavMenu />
    </div>
    
    <main>
        <div class="top-row px-4">
            <a href="https://docs.microsoft.com/aspnet/" target="_blank">关于</a>
        </div>
        
        <article class="content px-4">
            @Body
        </article>
    </main>
</div>
```

### 导航菜单

```razor
@* NavMenu.razor *@
<div class="nav-menu">
    <nav class="flex-column">
        <div class="nav-item px-3">
            <NavLink class="nav-link" href="" Match="NavLinkMatch.All">
                <span class="oi oi-home" aria-hidden="true"></span> 首页
            </NavLink>
        </div>
        <div class="nav-item px-3">
            <NavLink class="nav-link" href="counter">
                <span class="oi oi-plus" aria-hidden="true"></span> 计数器
            </NavLink>
        </div>
        <div class="nav-item px-3">
            <NavLink class="nav-link" href="fetchdata">
                <span class="oi oi-list-rich" aria-hidden="true"></span> 数据
            </NavLink>
        </div>
    </nav>
</div>
```

## 最佳实践

### 组件拆分

```razor
@* 父组件 *@
<UserList Users="@users" OnUserSelected="HandleUserSelected" />

@code {
    private List<User> users;
    private User selectedUser;
    
    private void HandleUserSelected(User user)
    {
        selectedUser = user;
    }
}

@* 子组件 *@
<div class="user-list">
    @foreach (var user in Users)
    {
        <div @onclick="() => OnUserSelected.InvokeAsync(user)">
            @user.Name
        </div>
    }
</div>

@code {
    [Parameter]
    public List<User> Users { get; set; }
    
    [Parameter]
    public EventCallback<User> OnUserSelected { get; set; }
}
```

### 性能优化

```razor
@* 使用 @key 优化列表渲染 *@
@foreach (var item in items)
{
    <div @key="item.Id">
        @item.Name
    </div>
}

@* 使用 ShouldRender 控制渲染 *@
@code {
    protected override bool ShouldRender()
    {
        // 返回 false 阻止渲染
        return true;
    }
}
```

### 错误处理

```razor
<ErrorBoundary>
    <ChildContent>
        <MyComponent />
    </ChildContent>
    <ErrorContent Context="ex">
        <p>发生错误: @ex.Message</p>
    </ErrorContent>
</ErrorBoundary>
```
