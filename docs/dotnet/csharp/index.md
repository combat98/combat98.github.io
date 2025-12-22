# C# 语言基础

## 简介

C# 是一种现代、面向对象的编程语言，由微软开发，运行在 .NET 平台上。它结合了 C++ 的强大功能和 Visual Basic 的简洁性。

### 特点

- **类型安全** - 强类型语言，编译时检查类型错误
- **面向对象** - 完全支持封装、继承、多态
- **现代语法** - 支持 LINQ、async/await、模式匹配等现代特性
- **跨平台** - .NET Core/.NET 5+ 支持 Windows、Linux、macOS
- **高性能** - 接近 C++ 的性能，优于大多数解释型语言

## 基础语法

### 数据类型

#### 值类型

```csharp
// 整数类型
int age = 25;
long population = 7800000000L;
short temperature = -10;
byte level = 255;

// 浮点类型
float price = 19.99f;
double pi = 3.14159265359;
decimal money = 1000.50m; // 高精度，适合金融计算

// 布尔类型
bool isActive = true;

// 字符类型
char grade = 'A';

// 结构体
struct Point
{
    public int X;
    public int Y;
}
```

#### 引用类型

```csharp
// 字符串
string name = "张三";
string message = $"你好，{name}"; // 字符串插值

// 数组
int[] numbers = { 1, 2, 3, 4, 5 };
string[] names = new string[3];

// 类
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

// 接口
interface IRepository
{
    void Save();
}
```

### 变量和常量

```csharp
// 变量声明
int count = 0;
var name = "李四"; // 类型推断

// 常量
const double PI = 3.14159;
const string APP_NAME = "MyApp";

// 只读字段
readonly DateTime createdAt = DateTime.Now;
```

### 运算符

```csharp
// 算术运算符
int sum = 10 + 5;
int difference = 10 - 5;
int product = 10 * 5;
int quotient = 10 / 5;
int remainder = 10 % 3;

// 比较运算符
bool isEqual = (5 == 5);
bool isNotEqual = (5 != 3);
bool isGreater = (10 > 5);

// 逻辑运算符
bool result = true && false; // 与
bool result2 = true || false; // 或
bool result3 = !true; // 非

// 空值合并运算符
string name = null;
string displayName = name ?? "匿名用户";

// 空值条件运算符
int? length = name?.Length;
```

## 控制流

### 条件语句

```csharp
// if-else
int score = 85;
if (score >= 90)
{
    Console.WriteLine("优秀");
}
else if (score >= 60)
{
    Console.WriteLine("及格");
}
else
{
    Console.WriteLine("不及格");
}

// switch
string day = "Monday";
switch (day)
{
    case "Monday":
        Console.WriteLine("星期一");
        break;
    case "Tuesday":
        Console.WriteLine("星期二");
        break;
    default:
        Console.WriteLine("其他");
        break;
}

// switch 表达式 (C# 8.0+)
string dayName = day switch
{
    "Monday" => "星期一",
    "Tuesday" => "星期二",
    _ => "其他"
};
```

### 循环语句

```csharp
// for 循环
for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i);
}

// foreach 循环
string[] names = { "张三", "李四", "王五" };
foreach (string name in names)
{
    Console.WriteLine(name);
}

// while 循环
int count = 0;
while (count < 5)
{
    Console.WriteLine(count);
    count++;
}

// do-while 循环
int num = 0;
do
{
    Console.WriteLine(num);
    num++;
} while (num < 5);
```

## 方法

### 基本方法

```csharp
// 无返回值方法
void PrintMessage(string message)
{
    Console.WriteLine(message);
}

// 有返回值方法
int Add(int a, int b)
{
    return a + b;
}

// 可选参数
void Greet(string name, string greeting = "你好")
{
    Console.WriteLine($"{greeting}, {name}");
}

// 命名参数
Greet(greeting: "早上好", name: "张三");

// 参数数组
int Sum(params int[] numbers)
{
    return numbers.Sum();
}
int total = Sum(1, 2, 3, 4, 5);
```

### 表达式体方法

```csharp
// 表达式体方法 (C# 6.0+)
int Multiply(int a, int b) => a * b;

string GetFullName(string firstName, string lastName) 
    => $"{firstName} {lastName}";
```

### ref 和 out 参数

```csharp
// ref 参数 - 必须初始化
void Increment(ref int number)
{
    number++;
}

int value = 10;
Increment(ref value); // value = 11

// out 参数 - 不需要初始化
bool TryParse(string input, out int result)
{
    return int.TryParse(input, out result);
}

if (TryParse("123", out int number))
{
    Console.WriteLine(number);
}
```

## 集合

### 数组

```csharp
// 一维数组
int[] numbers = new int[5];
int[] scores = { 90, 85, 92, 88, 95 };

// 多维数组
int[,] matrix = new int[3, 3];
int[,] grid = { { 1, 2 }, { 3, 4 } };

// 交错数组
int[][] jaggedArray = new int[3][];
jaggedArray[0] = new int[] { 1, 2 };
jaggedArray[1] = new int[] { 3, 4, 5 };
```

### List

```csharp
using System.Collections.Generic;

// 创建 List
List<string> names = new List<string>();
List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };

// 添加元素
names.Add("张三");
names.AddRange(new[] { "李四", "王五" });

// 访问元素
string first = names[0];

// 删除元素
names.Remove("张三");
names.RemoveAt(0);

// 查找元素
bool exists = names.Contains("李四");
int index = names.IndexOf("王五");

// 遍历
foreach (var name in names)
{
    Console.WriteLine(name);
}
```

### Dictionary

```csharp
// 创建 Dictionary
Dictionary<string, int> ages = new Dictionary<string, int>();
Dictionary<string, string> config = new Dictionary<string, string>
{
    { "host", "localhost" },
    { "port", "8080" }
};

// 添加元素
ages.Add("张三", 25);
ages["李四"] = 30;

// 访问元素
int age = ages["张三"];

// 检查键是否存在
if (ages.ContainsKey("张三"))
{
    Console.WriteLine(ages["张三"]);
}

// 安全获取值
if (ages.TryGetValue("王五", out int value))
{
    Console.WriteLine(value);
}

// 遍历
foreach (var kvp in ages)
{
    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
}
```

## 字符串操作

```csharp
string text = "Hello, World!";

// 字符串长度
int length = text.Length;

// 字符串拼接
string fullName = "张" + "三";
string message = string.Concat("Hello", " ", "World");

// 字符串插值
string name = "张三";
int age = 25;
string info = $"{name} 今年 {age} 岁";

// 字符串格式化
string formatted = string.Format("{0} 今年 {1} 岁", name, age);

// 字符串分割
string[] parts = "a,b,c".Split(',');

// 字符串替换
string replaced = text.Replace("World", "C#");

// 字符串截取
string sub = text.Substring(0, 5); // "Hello"

// 字符串查找
int index = text.IndexOf("World");
bool contains = text.Contains("Hello");

// 大小写转换
string upper = text.ToUpper();
string lower = text.ToLower();

// 去除空格
string trimmed = "  hello  ".Trim();
```

## 异常处理

```csharp
// try-catch
try
{
    int result = 10 / 0;
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"错误: {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"未知错误: {ex.Message}");
}
finally
{
    Console.WriteLine("清理资源");
}

// 抛出异常
void ValidateAge(int age)
{
    if (age < 0)
    {
        throw new ArgumentException("年龄不能为负数");
    }
}

// 自定义异常
public class InvalidUserException : Exception
{
    public InvalidUserException(string message) : base(message)
    {
    }
}
```

## 可空类型

```csharp
// 可空值类型
int? nullableInt = null;
double? nullableDouble = 3.14;

// 检查是否有值
if (nullableInt.HasValue)
{
    int value = nullableInt.Value;
}

// 获取值或默认值
int result = nullableInt.GetValueOrDefault();
int result2 = nullableInt ?? 0;

// 可空引用类型 (C# 8.0+)
#nullable enable
string? nullableString = null;
string nonNullableString = "Hello";
```

## 元组

```csharp
// 创建元组
var person = (Name: "张三", Age: 25);
(string Name, int Age) person2 = ("李四", 30);

// 访问元组元素
Console.WriteLine(person.Name);
Console.WriteLine(person.Age);

// 元组解构
var (name, age) = person;
Console.WriteLine($"{name}, {age}");

// 方法返回元组
(int Min, int Max) GetMinMax(int[] numbers)
{
    return (numbers.Min(), numbers.Max());
}

var (min, max) = GetMinMax(new[] { 1, 5, 3, 9, 2 });
```

## 模式匹配

```csharp
// is 模式
object obj = "Hello";
if (obj is string str)
{
    Console.WriteLine(str.ToUpper());
}

// switch 模式匹配
object value = 42;
string result = value switch
{
    int i => $"整数: {i}",
    string s => $"字符串: {s}",
    null => "空值",
    _ => "其他类型"
};

// 属性模式
Person person = new Person { Name = "张三", Age = 25 };
string category = person switch
{
    { Age: &lt; 18 } => "未成年",
    { Age: >= 18 and &lt; 60 } => "成年人",
    { Age: >= 60 } => "老年人",
    _ => "未知"
};
```

## 文件操作

```csharp
using System.IO;

// 读取文件
string content = File.ReadAllText("file.txt");
string[] lines = File.ReadAllLines("file.txt");

// 写入文件
File.WriteAllText("file.txt", "Hello, World!");
File.WriteAllLines("file.txt", new[] { "Line 1", "Line 2" });

// 追加内容
File.AppendAllText("file.txt", "New line");

// 检查文件是否存在
if (File.Exists("file.txt"))
{
    // 处理文件
}

// 使用 StreamReader/StreamWriter
using (StreamReader reader = new StreamReader("file.txt"))
{
    string line;
    while ((line = reader.ReadLine()) != null)
    {
        Console.WriteLine(line);
    }
}

using (StreamWriter writer = new StreamWriter("file.txt"))
{
    writer.WriteLine("Hello");
    writer.WriteLine("World");
}
```

## 最佳实践

1. **命名规范**
   - 类名、方法名使用 PascalCase
   - 变量名、参数名使用 camelCase
   - 常量使用 UPPER_CASE 或 PascalCase

2. **代码组织**
   - 一个文件一个类
   - 使用命名空间组织代码
   - 合理使用访问修饰符

3. **性能优化**
   - 使用 StringBuilder 拼接大量字符串
   - 优先使用值类型减少 GC 压力
   - 使用 `Span<T>` 和 `Memory<T>` 处理大数据

4. **安全性**
   - 验证用户输入
   - 使用参数化查询防止 SQL 注入
   - 妥善处理敏感信息

## 总结

C# 是一门功能强大的现代编程语言，主要特点：

- ✅ 强类型、类型安全
- ✅ 丰富的语法特性
- ✅ 优秀的性能
- ✅ 跨平台支持
- ✅ 完善的生态系统

掌握 C# 基础是学习 .NET 开发的第一步。

## 参考资源

- [C# 官方文档](https://docs.microsoft.com/zh-cn/dotnet/csharp/)
- [C# 编程指南](https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/)
- [.NET API 浏览器](https://docs.microsoft.com/zh-cn/dotnet/api/)
