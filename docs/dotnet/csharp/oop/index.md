# C# 面向对象编程

## 类和对象

### 定义类

```csharp
public class Person
{
    // 字段
    private string _name;
    private int _age;
    
    // 属性
    public string Name
    {
        get { return _name; }
        set { _name = value; }
    }
    
    // 自动属性
    public int Age { get; set; }
    public string Email { get; set; }
    
    // 构造函数
    public Person()
    {
        Age = 0;
    }
    
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }
    
    // 方法
    public void Introduce()
    {
        Console.WriteLine($"我是{Name}，今年{Age}岁");
    }
    
    // 静态成员
    public static int TotalCount { get; set; }
    
    public static void PrintTotal()
    {
        Console.WriteLine($"总人数: {TotalCount}");
    }
}
```

### 创建对象

```csharp
// 使用构造函数
Person person1 = new Person();
Person person2 = new Person("张三", 25);

// 对象初始化器
Person person3 = new Person
{
    Name = "李四",
    Age = 30,
    Email = "lisi@example.com"
};

// 使用 var
var person4 = new Person("王五", 28);
```

## 封装

### 访问修饰符

```csharp
public class BankAccount
{
    // public - 任何地方都可访问
    public string AccountNumber { get; set; }
    
    // private - 只能在类内部访问
    private decimal _balance;
    
    // protected - 类内部和派生类可访问
    protected string _ownerName;
    
    // internal - 同一程序集内可访问
    internal string BankCode { get; set; }
    
    // protected internal - 同一程序集或派生类可访问
    protected internal DateTime CreatedAt { get; set; }
    
    // private protected - 同一程序集内的派生类可访问
    private protected string InternalId { get; set; }
    
    public decimal Balance
    {
        get { return _balance; }
        private set { _balance = value; } // 只读属性
    }
    
    public void Deposit(decimal amount)
    {
        if (amount > 0)
        {
            _balance += amount;
        }
    }
    
    public bool Withdraw(decimal amount)
    {
        if (amount > 0 && _balance >= amount)
        {
            _balance -= amount;
            return true;
        }
        return false;
    }
}
```

## 继承

### 基本继承

```csharp
// 基类
public class Animal
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public virtual void MakeSound()
    {
        Console.WriteLine("动物发出声音");
    }
    
    public void Sleep()
    {
        Console.WriteLine($"{Name} 正在睡觉");
    }
}

// 派生类
public class Dog : Animal
{
    public string Breed { get; set; }
    
    // 重写方法
    public override void MakeSound()
    {
        Console.WriteLine("汪汪汪！");
    }
    
    public void Fetch()
    {
        Console.WriteLine($"{Name} 正在捡球");
    }
}

public class Cat : Animal
{
    public override void MakeSound()
    {
        Console.WriteLine("喵喵喵！");
    }
}
```

### 构造函数继承

```csharp
public class Vehicle
{
    public string Brand { get; set; }
    public string Model { get; set; }
    
    public Vehicle(string brand, string model)
    {
        Brand = brand;
        Model = model;
    }
}

public class Car : Vehicle
{
    public int Doors { get; set; }
    
    // 调用基类构造函数
    public Car(string brand, string model, int doors) 
        : base(brand, model)
    {
        Doors = doors;
    }
}
```

### base 关键字

```csharp
public class Employee
{
    public string Name { get; set; }
    public decimal Salary { get; set; }
    
    public virtual decimal CalculateBonus()
    {
        return Salary * 0.1m;
    }
}

public class Manager : Employee
{
    public int TeamSize { get; set; }
    
    public override decimal CalculateBonus()
    {
        // 调用基类方法
        decimal baseBonus = base.CalculateBonus();
        return baseBonus + (TeamSize * 1000);
    }
}
```

## 多态

### 方法重写

```csharp
public class Shape
{
    public virtual double GetArea()
    {
        return 0;
    }
    
    public virtual void Draw()
    {
        Console.WriteLine("绘制形状");
    }
}

public class Circle : Shape
{
    public double Radius { get; set; }
    
    public override double GetArea()
    {
        return Math.PI * Radius * Radius;
    }
    
    public override void Draw()
    {
        Console.WriteLine("绘制圆形");
    }
}

public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }
    
    public override double GetArea()
    {
        return Width * Height;
    }
    
    public override void Draw()
    {
        Console.WriteLine("绘制矩形");
    }
}

// 使用多态
Shape[] shapes = new Shape[]
{
    new Circle { Radius = 5 },
    new Rectangle { Width = 4, Height = 6 }
};

foreach (var shape in shapes)
{
    shape.Draw();
    Console.WriteLine($"面积: {shape.GetArea()}");
}
```

### 抽象类

```csharp
public abstract class Database
{
    public string ConnectionString { get; set; }
    
    // 抽象方法 - 必须被重写
    public abstract void Connect();
    public abstract void Disconnect();
    public abstract void ExecuteQuery(string query);
    
    // 普通方法
    public void Log(string message)
    {
        Console.WriteLine($"[{DateTime.Now}] {message}");
    }
}

public class SqlServerDatabase : Database
{
    public override void Connect()
    {
        Console.WriteLine("连接到 SQL Server");
    }
    
    public override void Disconnect()
    {
        Console.WriteLine("断开 SQL Server 连接");
    }
    
    public override void ExecuteQuery(string query)
    {
        Console.WriteLine($"执行查询: {query}");
    }
}
```

## 接口

### 定义和实现接口

```csharp
public interface IRepository<T>
{
    T GetById(int id);
    IEnumerable<T> GetAll();
    void Add(T entity);
    void Update(T entity);
    void Delete(int id);
}

public class UserRepository : IRepository<User>
{
    private List<User> _users = new List<User>();
    
    public User GetById(int id)
    {
        return _users.FirstOrDefault(u => u.Id == id);
    }
    
    public IEnumerable<User> GetAll()
    {
        return _users;
    }
    
    public void Add(User entity)
    {
        _users.Add(entity);
    }
    
    public void Update(User entity)
    {
        var existing = GetById(entity.Id);
        if (existing != null)
        {
            // 更新逻辑
        }
    }
    
    public void Delete(int id)
    {
        var user = GetById(id);
        if (user != null)
        {
            _users.Remove(user);
        }
    }
}
```

### 多接口实现

```csharp
public interface IReadable
{
    void Read();
}

public interface IWritable
{
    void Write();
}

public class File : IReadable, IWritable
{
    public void Read()
    {
        Console.WriteLine("读取文件");
    }
    
    public void Write()
    {
        Console.WriteLine("写入文件");
    }
}
```

### 显式接口实现

```csharp
public interface IEnglishSpeaker
{
    void Speak();
}

public interface IChineseSpeaker
{
    void Speak();
}

public class BilingualPerson : IEnglishSpeaker, IChineseSpeaker
{
    void IEnglishSpeaker.Speak()
    {
        Console.WriteLine("Hello!");
    }
    
    void IChineseSpeaker.Speak()
    {
        Console.WriteLine("你好！");
    }
}

// 使用
var person = new BilingualPerson();
((IEnglishSpeaker)person).Speak(); // Hello!
((IChineseSpeaker)person).Speak(); // 你好！
```

## 属性

### 完整属性

```csharp
public class Product
{
    private decimal _price;
    
    public decimal Price
    {
        get { return _price; }
        set
        {
            if (value < 0)
                throw new ArgumentException("价格不能为负数");
            _price = value;
        }
    }
}
```

### 自动属性

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    // 只读属性
    public DateTime CreatedAt { get; } = DateTime.Now;
    
    // 私有 set
    public string Email { get; private set; }
}
```

### 计算属性

```csharp
public class Rectangle
{
    public double Width { get; set; }
    public double Height { get; set; }
    
    public double Area => Width * Height;
    public double Perimeter => 2 * (Width + Height);
}
```

## 索引器

```csharp
public class StringCollection
{
    private string[] _items = new string[100];
    
    public string this[int index]
    {
        get { return _items[index]; }
        set { _items[index] = value; }
    }
}

// 使用
var collection = new StringCollection();
collection[0] = "Hello";
Console.WriteLine(collection[0]);
```

## 运算符重载

```csharp
public class Complex
{
    public double Real { get; set; }
    public double Imaginary { get; set; }
    
    public Complex(double real, double imaginary)
    {
        Real = real;
        Imaginary = imaginary;
    }
    
    // 重载 + 运算符
    public static Complex operator +(Complex a, Complex b)
    {
        return new Complex(a.Real + b.Real, a.Imaginary + b.Imaginary);
    }
    
    // 重载 - 运算符
    public static Complex operator -(Complex a, Complex b)
    {
        return new Complex(a.Real - b.Real, a.Imaginary - b.Imaginary);
    }
    
    // 重载 == 运算符
    public static bool operator ==(Complex a, Complex b)
    {
        return a.Real == b.Real && a.Imaginary == b.Imaginary;
    }
    
    public static bool operator !=(Complex a, Complex b)
    {
        return !(a == b);
    }
}
```

## 总结

C# 面向对象编程的核心概念：

- ✅ **封装** - 隐藏实现细节，提供公共接口
- ✅ **继承** - 代码复用和扩展
- ✅ **多态** - 同一接口，不同实现
- ✅ **抽象** - 定义规范，延迟实现

掌握这些概念是编写高质量 C# 代码的基础。
