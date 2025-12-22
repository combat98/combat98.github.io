# C# 异步编程

## 简介

异步编程允许程序在等待长时间运行的操作（如 I/O 操作）时继续执行其他工作，提高应用程序的响应性和性能。

### 为什么需要异步编程

- **提高响应性** - UI 应用不会冻结
- **提高吞吐量** - 服务器可以处理更多请求
- **资源利用** - 等待时释放线程资源

## async 和 await

### 基本用法

```csharp
// 异步方法
public async Task<string> GetDataAsync()
{
    // 模拟异步操作
    await Task.Delay(1000);
    return "数据";
}

// 调用异步方法
public async Task ProcessDataAsync()
{
    string data = await GetDataAsync();
    Console.WriteLine(data);
}
```

### 返回类型

```csharp
// Task - 无返回值
public async Task DoWorkAsync()
{
    await Task.Delay(1000);
    Console.WriteLine("工作完成");
}

// Task<T> - 有返回值
public async Task<int> CalculateAsync()
{
    await Task.Delay(1000);
    return 42;
}

// ValueTask<T> - 性能优化版本
public async ValueTask<int> GetCachedValueAsync()
{
    if (_cache.TryGetValue("key", out int value))
    {
        return value; // 同步返回，不分配 Task
    }
    
    await Task.Delay(1000);
    return 42;
}

// void - 仅用于事件处理器
public async void Button_Click(object sender, EventArgs e)
{
    await DoWorkAsync();
}
```

## Task 和 Task&lt;T&gt;

### 创建 Task

```csharp
// Task.Run - 在线程池中运行
Task<int> task = Task.Run(() =>
{
    Thread.Sleep(1000);
    return 42;
});

// Task.Factory.StartNew
Task task2 = Task.Factory.StartNew(() =>
{
    Console.WriteLine("执行任务");
});

// Task.FromResult - 返回已完成的任务
Task<int> completedTask = Task.FromResult(42);

// Task.CompletedTask - 已完成的空任务
Task emptyTask = Task.CompletedTask;
```

### 等待 Task

```csharp
// await - 异步等待
int result = await task;

// Wait - 同步等待（阻塞）
task.Wait();

// Result - 获取结果（阻塞）
int result2 = task.Result;

// WaitAll - 等待所有任务
Task.WaitAll(task1, task2, task3);

// WaitAny - 等待任意一个任务
int index = Task.WaitAny(task1, task2, task3);
```

## 并行执行

### Task.WhenAll

```csharp
public async Task<string[]> GetMultipleDataAsync()
{
    Task<string> task1 = GetDataFromApi1Async();
    Task<string> task2 = GetDataFromApi2Async();
    Task<string> task3 = GetDataFromApi3Async();
    
    // 并行执行，等待所有任务完成
    string[] results = await Task.WhenAll(task1, task2, task3);
    return results;
}
```

### Task.WhenAny

```csharp
public async Task<string> GetFastestResponseAsync()
{
    Task<string> task1 = GetDataFromServer1Async();
    Task<string> task2 = GetDataFromServer2Async();
    Task<string> task3 = GetDataFromServer3Async();
    
    // 返回最先完成的任务结果
    Task<string> completedTask = await Task.WhenAny(task1, task2, task3);
    return await completedTask;
}
```

### Parallel 类

```csharp
// Parallel.For
Parallel.For(0, 100, i =>
{
    Console.WriteLine($"处理项 {i}");
});

// Parallel.ForEach
var items = new List<int> { 1, 2, 3, 4, 5 };
Parallel.ForEach(items, item =>
{
    Console.WriteLine($"处理 {item}");
});

// Parallel.Invoke
Parallel.Invoke(
    () => Method1(),
    () => Method2(),
    () => Method3()
);
```

## 异常处理

### 单个任务异常

```csharp
try
{
    await DoWorkAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"错误: {ex.Message}");
}
```

### 多个任务异常

```csharp
try
{
    await Task.WhenAll(task1, task2, task3);
}
catch (Exception ex)
{
    // 只捕获第一个异常
    Console.WriteLine($"错误: {ex.Message}");
}

// 捕获所有异常
try
{
    await Task.WhenAll(task1, task2, task3);
}
catch
{
    // 检查每个任务的异常
    if (task1.IsFaulted)
        Console.WriteLine($"Task1 错误: {task1.Exception.Message}");
    if (task2.IsFaulted)
        Console.WriteLine($"Task2 错误: {task2.Exception.Message}");
    if (task3.IsFaulted)
        Console.WriteLine($"Task3 错误: {task3.Exception.Message}");
}
```

## 取消操作

### CancellationToken

```csharp
public async Task DoWorkAsync(CancellationToken cancellationToken)
{
    for (int i = 0; i < 100; i++)
    {
        // 检查是否请求取消
        cancellationToken.ThrowIfCancellationRequested();
        
        await Task.Delay(100, cancellationToken);
        Console.WriteLine($"进度: {i}%");
    }
}

// 使用
var cts = new CancellationTokenSource();

// 启动任务
var task = DoWorkAsync(cts.Token);

// 5秒后取消
await Task.Delay(5000);
cts.Cancel();

try
{
    await task;
}
catch (OperationCanceledException)
{
    Console.WriteLine("操作已取消");
}
```

### 超时取消

```csharp
// 设置超时
var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));

try
{
    await DoWorkAsync(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("操作超时");
}
```

## 进度报告

```csharp
public async Task DownloadFileAsync(
    string url,
    IProgress<int> progress,
    CancellationToken cancellationToken)
{
    for (int i = 0; i <= 100; i++)
    {
        cancellationToken.ThrowIfCancellationRequested();
        
        await Task.Delay(50);
        
        // 报告进度
        progress?.Report(i);
    }
}

// 使用
var progress = new Progress<int>(percent =>
{
    Console.WriteLine($"下载进度: {percent}%");
});

await DownloadFileAsync("http://example.com/file", progress, CancellationToken.None);
```

## 异步流 (IAsyncEnumerable)

```csharp
// 定义异步流
public async IAsyncEnumerable<int> GenerateNumbersAsync(
    [EnumeratorCancellation] CancellationToken cancellationToken = default)
{
    for (int i = 0; i < 10; i++)
    {
        await Task.Delay(1000, cancellationToken);
        yield return i;
    }
}

// 消费异步流
await foreach (var number in GenerateNumbersAsync())
{
    Console.WriteLine(number);
}
```

## ConfigureAwait

```csharp
// 不捕获上下文（库代码推荐）
public async Task DoWorkAsync()
{
    await Task.Delay(1000).ConfigureAwait(false);
    // 可能在不同线程上继续执行
}

// 捕获上下文（UI 代码默认）
public async Task UpdateUIAsync()
{
    await Task.Delay(1000); // 或 .ConfigureAwait(true)
    // 在原始上下文（UI 线程）上继续执行
    textBox.Text = "完成";
}
```

## 异步最佳实践

### 1. 避免 async void

```csharp
// ❌ 错误 - 无法捕获异常
public async void BadMethodAsync()
{
    await Task.Delay(1000);
    throw new Exception("错误");
}

// ✅ 正确
public async Task GoodMethodAsync()
{
    await Task.Delay(1000);
}
```

### 2. 使用 async/await 而不是 Task.Wait()

```csharp
// ❌ 错误 - 可能死锁
public void BadMethod()
{
    var result = GetDataAsync().Result;
}

// ✅ 正确
public async Task GoodMethodAsync()
{
    var result = await GetDataAsync();
}
```

### 3. 异步方法命名约定

```csharp
// ✅ 异步方法以 Async 结尾
public async Task<string> GetDataAsync()
{
    return await _httpClient.GetStringAsync("url");
}
```

### 4. 避免不必要的 async/await

```csharp
// ❌ 不必要的 async/await
public async Task<string> GetDataAsync()
{
    return await _httpClient.GetStringAsync("url");
}

// ✅ 直接返回 Task
public Task<string> GetDataAsync()
{
    return _httpClient.GetStringAsync("url");
}
```

### 5. 使用 ValueTask 优化性能

```csharp
public ValueTask<int> GetValueAsync()
{
    if (_cache.TryGetValue("key", out int value))
    {
        return new ValueTask<int>(value); // 同步路径，无分配
    }
    
    return new ValueTask<int>(GetValueFromDatabaseAsync());
}

private async Task<int> GetValueFromDatabaseAsync()
{
    // 异步操作
    return await _database.GetValueAsync();
}
```

## 实际应用示例

### HTTP 请求

```csharp
public class ApiService
{
    private readonly HttpClient _httpClient;
    
    public ApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    
    public async Task<User> GetUserAsync(int id)
    {
        var response = await _httpClient.GetAsync($"api/users/{id}");
        response.EnsureSuccessStatusCode();
        
        var user = await response.Content.ReadFromJsonAsync<User>();
        return user;
    }
    
    public async Task<User> CreateUserAsync(User user)
    {
        var response = await _httpClient.PostAsJsonAsync("api/users", user);
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<User>();
    }
}
```

### 数据库操作

```csharp
public class UserRepository
{
    private readonly ApplicationDbContext _context;
    
    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<User> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }
    
    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }
    
    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
}
```

### 文件操作

```csharp
public class FileService
{
    public async Task<string> ReadFileAsync(string path)
    {
        return await File.ReadAllTextAsync(path);
    }
    
    public async Task WriteFileAsync(string path, string content)
    {
        await File.WriteAllTextAsync(path, content);
    }
    
    public async Task<byte[]> ReadBytesAsync(string path)
    {
        return await File.ReadAllBytesAsync(path);
    }
}
```

## 总结

C# 异步编程的关键点：

- ✅ 使用 async/await 简化异步代码
- ✅ 返回 Task 或 `Task<T>`
- ✅ 支持取消和进度报告
- ✅ 正确处理异常
- ✅ 遵循最佳实践

掌握异步编程是编写高性能 C# 应用的必备技能。

## 参考资源

- [异步编程官方文档](https://docs.microsoft.com/zh-cn/dotnet/csharp/async)
- [Task-based Asynchronous Pattern](https://docs.microsoft.com/zh-cn/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap)
