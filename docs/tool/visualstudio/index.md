# Visual Studio

## 简介

Visual Studio 是微软开发的集成开发环境（IDE），主要用于 .NET 平台的应用程序开发，是 Windows 平台上最强大的开发工具之一。

### 特点

- **全功能 IDE** - 完整的开发、调试、测试工具
- **.NET 开发** - 最佳的 .NET 开发体验
- **企业级功能** - 代码分析、性能分析、测试工具
- **跨平台开发** - 支持 Windows、Web、移动应用
- **团队协作** - 集成 Azure DevOps

### 版本

- **Community** - 免费版，适合个人开发者和小团队
- **Professional** - 专业版，适合专业开发者
- **Enterprise** - 企业版，提供高级功能

## 安装

### 下载安装

访问 [官网](https://visualstudio.microsoft.com/) 下载安装器。

### 工作负载选择

安装时可以选择需要的工作负载：

- **.NET 桌面开发** - WPF、WinForms
- **ASP.NET 和 Web 开发** - Web 应用
- **Azure 开发** - 云应用
- **.NET Core 跨平台开发** - 跨平台应用
- **移动开发** - Xamarin
- **游戏开发** - Unity
- **数据存储和处理** - SQL Server

## 快捷键

### 通用快捷键

- `Ctrl + Shift + N` - 新建项目
- `Ctrl + Shift + O` - 打开项目
- `Ctrl + S` - 保存
- `Ctrl + Shift + S` - 全部保存
- `Ctrl + ,` - 快速启动
- `Ctrl + Q` - 搜索

### 编辑快捷键

- `Ctrl + K, Ctrl + C` - 注释选中代码
- `Ctrl + K, Ctrl + U` - 取消注释
- `Ctrl + K, Ctrl + D` - 格式化文档
- `Ctrl + K, Ctrl + F` - 格式化选中代码
- `Ctrl + .` - 快速操作和重构
- `Ctrl + Space` - 智能提示
- `Ctrl + Shift + Space` - 参数信息

### 导航快捷键

- `F12` - 转到定义
- `Ctrl + F12` - 转到实现
- `Shift + F12` - 查找所有引用
- `Ctrl + -` - 后退
- `Ctrl + Shift + -` - 前进
- `Ctrl + T` - 转到全部
- `Ctrl + ,` - 转到文件

### 调试快捷键

- `F5` - 开始调试
- `Ctrl + F5` - 开始执行（不调试）
- `Shift + F5` - 停止调试
- `F9` - 切换断点
- `F10` - 逐过程
- `F11` - 逐语句
- `Shift + F11` - 跳出

### 窗口管理

- `Ctrl + Alt + L` - 解决方案资源管理器
- `Ctrl + \\, E` - 错误列表
- `Ctrl + \\, O` - 输出窗口
- `Ctrl + Alt + O` - 对象浏览器
- `Ctrl + Alt + B` - 断点窗口

## 项目类型

### 控制台应用

```csharp
using System;

namespace ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            Console.ReadKey();
        }
    }
}
```

### WPF 应用

桌面应用程序，使用 XAML 设计界面。

```xml
<Window x:Class="WpfApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="MainWindow" Height="450" Width="800">
    <Grid>
        <Button Content="Click Me" Click="Button_Click"/>
    </Grid>
</Window>
```

### ASP.NET Core Web API

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello from API" });
    }
}
```

### ASP.NET Core MVC

```csharp
public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
```

## 必备扩展

### 生产力工具

**ReSharper**
代码分析和重构工具（付费）。

**Visual Assist**
C++ 开发增强工具。

**Productivity Power Tools**
微软官方生产力工具集。

**CodeMaid**
代码清理和格式化工具。

**File Icons**
文件图标美化。

### 代码质量

**SonarLint**
代码质量检查。

**Code Metrics**
代码度量工具。

### 版本控制

**Git Extensions**
Git 增强工具。

**GitFlow**
Git Flow 工作流支持。

### 主题和外观

**One Dark Pro**
流行的暗色主题。

**Visual Studio Color Theme Editor**
自定义主题编辑器。

### Web 开发

**Web Essentials**
Web 开发工具集。

**Bundler & Minifier**
CSS/JS 打包压缩工具。

## NuGet 包管理

### 使用 NuGet

#### 通过 UI 安装

1. 右键项目 → 管理 NuGet 程序包
2. 搜索需要的包
3. 点击安装

#### 通过包管理器控制台

```powershell
# 安装包
Install-Package Newtonsoft.Json

# 更新包
Update-Package Newtonsoft.Json

# 卸载包
Uninstall-Package Newtonsoft.Json

# 列出已安装的包
Get-Package
```

#### 通过 .NET CLI

```bash
# 添加包
dotnet add package Newtonsoft.Json

# 移除包
dotnet remove package Newtonsoft.Json

# 列出包
dotnet list package
```

### 常用 NuGet 包

**通用**
- Newtonsoft.Json - JSON 序列化
- AutoMapper - 对象映射
- Serilog - 日志框架

**Web 开发**
- Swashbuckle.AspNetCore - Swagger/OpenAPI
- FluentValidation - 数据验证

**数据访问**
- Entity Framework Core - ORM 框架
- Dapper - 轻量级 ORM

**测试**
- xUnit - 单元测试框架
- Moq - Mock 框架
- FluentAssertions - 断言库

## 调试技巧

### 断点

**条件断点**
- 右键断点 → 条件
- 设置条件表达式

**命中次数断点**
- 右键断点 → 命中次数
- 设置命中次数条件

**跟踪点**
- 右键断点 → 操作
- 输出消息而不中断执行

### 调试窗口

**局部变量**
显示当前作用域的变量。

**监视**
添加要监视的表达式。

**调用堆栈**
显示方法调用链。

**即时窗口**
在调试时执行代码。

**诊断工具**
显示 CPU、内存使用情况。

### 高级调试

**编辑并继续**
调试时修改代码并继续执行。

**IntelliTrace**
记录应用程序执行历史（Enterprise 版）。

**快照调试**
在生产环境中调试（Enterprise 版）。

## 代码片段

### 使用代码片段

输入快捷方式，按 `Tab` 键两次。

### 常用代码片段

- `ctor` - 构造函数
- `prop` - 属性
- `propfull` - 完整属性
- `for` - for 循环
- `foreach` - foreach 循环
- `if` - if 语句
- `switch` - switch 语句
- `try` - try-catch
- `class` - 类定义
- `interface` - 接口定义

### 自定义代码片段

`工具 → 代码片段管理器`

创建 `.snippet` 文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<CodeSnippets>
  <CodeSnippet Format="1.0.0">
    <Header>
      <Title>Console WriteLine</Title>
      <Shortcut>cw</Shortcut>
    </Header>
    <Snippet>
      <Code Language="csharp">
        <![CDATA[Console.WriteLine($END$);]]>
      </Code>
    </Snippet>
  </CodeSnippet>
</CodeSnippets>
```

## 重构

### 常用重构操作

**重命名**
- `Ctrl + R, Ctrl + R` 或 `F2`
- 重命名符号

**提取方法**
- `Ctrl + R, Ctrl + M`
- 将代码提取为方法

**提取接口**
- `Ctrl + R, Ctrl + I`
- 从类提取接口

**封装字段**
- `Ctrl + R, Ctrl + E`
- 将字段转换为属性

**内联**
- 将方法或变量内联到调用处

## 测试

### 单元测试

#### 创建测试项目

1. 添加新项目 → 测试 → xUnit Test Project
2. 添加对被测试项目的引用

#### 编写测试

```csharp
public class CalculatorTests
{
    [Fact]
    public void Add_TwoNumbers_ReturnsSum()
    {
        // Arrange
        var calculator = new Calculator();
        
        // Act
        var result = calculator.Add(2, 3);
        
        // Assert
        Assert.Equal(5, result);
    }
    
    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(0, 0, 0)]
    [InlineData(-1, 1, 0)]
    public void Add_MultipleInputs_ReturnsCorrectSum(int a, int b, int expected)
    {
        var calculator = new Calculator();
        var result = calculator.Add(a, b);
        Assert.Equal(expected, result);
    }
}
```

#### 运行测试

- `Ctrl + R, A` - 运行所有测试
- `Ctrl + R, T` - 运行当前测试
- 测试资源管理器 - 查看测试结果

### 代码覆盖率

Enterprise 版支持代码覆盖率分析。

`测试 → 分析代码覆盖率`

## 性能分析

### 性能探查器

`调试 → 性能探查器`

#### 可用工具

- **CPU 使用率** - 分析 CPU 消耗
- **内存使用率** - 分析内存分配
- **.NET 对象分配** - 跟踪对象分配
- **数据库** - 分析数据库查询
- **异步代码** - 分析异步操作

### 诊断工具

调试时自动显示：
- CPU 使用率
- 内存使用率
- 事件

## 团队协作

### Git 集成

**团队资源管理器**
- 克隆仓库
- 提交更改
- 同步代码
- 管理分支

**Git 更改窗口**
- 查看更改
- 暂存文件
- 提交代码

### Azure DevOps

集成 Azure DevOps 服务：
- 工作项跟踪
- 持续集成/部署
- 代码审查

## 最佳实践

1. **使用解决方案文件夹** - 组织项目结构
2. **配置 EditorConfig** - 统一代码风格
3. **使用代码分析** - 提高代码质量
4. **编写单元测试** - 保证代码正确性
5. **使用版本控制** - 管理代码变更
6. **定期更新** - 保持工具最新
7. **学习快捷键** - 提高开发效率

## 性能优化

### 禁用不需要的功能

`工具 → 选项 → 环境`

- 禁用启动页
- 减少扩展加载

### 清理解决方案

定期清理和重新生成解决方案。

### 排除文件夹

在解决方案资源管理器中排除不需要的文件夹（如 node_modules）。

## 总结

Visual Studio 是 .NET 开发的最佳选择：

- ✅ 完整的 IDE 功能
- ✅ 强大的调试工具
- ✅ 丰富的项目模板
- ✅ 优秀的性能分析
- ✅ 完善的团队协作

掌握 Visual Studio 是 .NET 开发者的必备技能。

## 参考资源

- [Visual Studio 官网](https://visualstudio.microsoft.com/)
- [Visual Studio 文档](https://docs.microsoft.com/zh-cn/visualstudio/)
- [快捷键参考](https://docs.microsoft.com/zh-cn/visualstudio/ide/default-keyboard-shortcuts-in-visual-studio)
- [扩展市场](https://marketplace.visualstudio.com/)
