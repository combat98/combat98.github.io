# Rust 基础

## 简介

Rust 是一门系统编程语言，专注于安全、并发和性能。Rust 通过所有权系统在编译时保证内存安全，无需垃圾回收器。

### 特点

- 内存安全（无空指针、无数据竞争）
- 零成本抽象
- 高性能（接近 C/C++）
- 现代化的包管理器（Cargo）
- 强大的类型系统
- 优秀的错误处理

## 环境配置

### 安装 Rust

**Windows/macOS/Linux:**
```bash
# 使用 rustup 安装
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 验证安装
rustc --version
cargo --version
```

**Windows (使用安装程序):**
下载并运行 [rustup-init.exe](https://rustup.rs/)

### 配置国内镜像（可选）

```bash
# 创建配置文件
mkdir -p ~/.cargo
cat > ~/.cargo/config.toml << EOF
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "https://mirrors.ustc.edu.cn/crates.io-index"
EOF
```

### 创建第一个项目

```bash
# 创建新项目
cargo new hello-rust
cd hello-rust

# 项目结构
# hello-rust/
#   ├── Cargo.toml  # 项目配置
#   └── src/
#       └── main.rs  # 源代码

# 运行项目
cargo run

# 编译项目
cargo build

# 发布编译
cargo build --release
```

## 语法基础

### 变量和常量

```rust
fn main() {
    // 不可变变量（默认）
    let x = 5;
    // x = 6;  // 错误：不能修改不可变变量
    
    // 可变变量
    let mut y = 5;
    y = 6;  // 正确
    
    // 常量
    const MAX_POINTS: u32 = 100_000;
    
    // 变量遮蔽
    let x = x + 1;
    let x = x * 2;
    println!("x = {}", x);  // 12
    
    // 类型转换
    let guess: u32 = "42".parse().expect("不是数字");
    println!("guess = {}", guess);
}
```

### 数据类型

```rust
fn main() {
    // 整数类型
    let a: i8 = 127;
    let b: i32 = 2147483647;
    let c: u32 = 4294967295;
    
    // 浮点类型
    let x: f32 = 3.14;
    let y: f64 = 2.718281828;
    
    // 布尔类型
    let t = true;
    let f: bool = false;
    
    // 字符类型
    let c = 'z';
    let emoji = '😊';
    
    // 元组
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (x, y, z) = tup;  // 解构
    let first = tup.0;     // 索引访问
    
    // 数组
    let arr = [1, 2, 3, 4, 5];
    let first = arr[0];
    let arr: [i32; 5] = [1, 2, 3, 4, 5];
    let arr = [3; 5];  // [3, 3, 3, 3, 3]
    
    println!("{}, {}, {}", a, x, c);
}
```

### 函数

```rust
fn main() {
    println!("5 + 3 = {}", add(5, 3));
    println!("5 - 3 = {}", subtract(5, 3));
}

// 基本函数
fn add(a: i32, b: i32) -> i32 {
    a + b  // 表达式，无分号
}

// 带 return 语句
fn subtract(a: i32, b: i32) -> i32 {
    return a - b;
}

// 无返回值
fn print_message(msg: &str) {
    println!("{}", msg);
}
```

### 控制流

```rust
fn main() {
    // if 表达式
    let number = 6;
    if number % 2 == 0 {
        println!("偶数");
    } else {
        println!("奇数");
    }
    
    // if 作为表达式
    let condition = true;
    let number = if condition { 5 } else { 6 };
    
    // loop 循环
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;
        }
    };
    println!("result = {}", result);
    
    // while 循环
    let mut number = 3;
    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }
    
    // for 循环
    let arr = [10, 20, 30, 40, 50];
    for element in arr.iter() {
        println!("值: {}", element);
    }
    
    // 范围循环
    for number in 1..4 {
        println!("{}", number);  // 1, 2, 3
    }
    
    for number in (1..=5).rev() {
        println!("{}", number);  // 5, 4, 3, 2, 1
    }
}
```

### 字符串

```rust
fn main() {
    // 字符串字面量（&str）
    let s1 = "hello";
    
    // String 类型
    let mut s2 = String::from("hello");
    s2.push_str(", world!");
    
    // 字符串拼接
    let s3 = s1.to_string() + " " + &s2;
    let s4 = format!("{} {}", s1, s2);
    
    // 字符串切片
    let hello = &s2[0..5];
    
    // 遍历字符串
    for c in "नमस्ते".chars() {
        println!("{}", c);
    }
    
    println!("{}", s2);
}
```

### 向量（Vector）

```rust
fn main() {
    // 创建向量
    let mut v: Vec<i32> = Vec::new();
    let v = vec![1, 2, 3];
    
    // 添加元素
    let mut v = Vec::new();
    v.push(5);
    v.push(6);
    v.push(7);
    
    // 访问元素
    let third = &v[2];
    println!("第三个元素: {}", third);
    
    match v.get(2) {
        Some(third) => println!("第三个元素: {}", third),
        None => println!("没有第三个元素"),
    }
    
    // 遍历
    for i in &v {
        println!("{}", i);
    }
    
    // 可变遍历
    for i in &mut v {
        *i += 50;
    }
}
```

### HashMap

```rust
use std::collections::HashMap;

fn main() {
    // 创建 HashMap
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    
    // 访问值
    let team_name = String::from("Blue");
    let score = scores.get(&team_name);
    
    match score {
        Some(s) => println!("分数: {}", s),
        None => println!("队伍不存在"),
    }
    
    // 遍历
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
    
    // 只在键不存在时插入
    scores.entry(String::from("Blue")).or_insert(50);
    
    // 根据旧值更新
    let text = "hello world wonderful world";
    let mut map = HashMap::new();
    
    for word in text.split_whitespace() {
        let count = map.entry(word).or_insert(0);
        *count += 1;
    }
    
    println!("{:?}", map);
}
```

### 结构体

```rust
// 定义结构体
struct User {
    username: String,
    email: String,
    age: u32,
    active: bool,
}

// 元组结构体
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

// 单元结构体
struct AlwaysEqual;

impl User {
    // 关联函数（类似静态方法）
    fn new(username: String, email: String) -> User {
        User {
            username,
            email,
            age: 0,
            active: true,
        }
    }
    
    // 方法
    fn is_adult(&self) -> bool {
        self.age >= 18
    }
    
    // 可变方法
    fn set_age(&mut self, age: u32) {
        self.age = age;
    }
}

fn main() {
    let mut user1 = User {
        email: String::from("user@example.com"),
        username: String::from("张三"),
        age: 25,
        active: true,
    };
    
    user1.email = String::from("newemail@example.com");
    
    // 结构体更新语法
    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
    
    // 使用方法
    let user3 = User::new(
        String::from("李四"),
        String::from("lisi@example.com")
    );
    
    println!("是否成年: {}", user3.is_adult());
}
```

### 枚举

```rust
// 定义枚举
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {
        match self {
            Message::Quit => println!("退出"),
            Message::Move { x, y } => println!("移动到 ({}, {})", x, y),
            Message::Write(text) => println!("写入: {}", text),
            Message::ChangeColor(r, g, b) => println!("颜色: ({}, {}, {})", r, g, b),
        }
    }
}

fn main() {
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));
    
    let msg = Message::Write(String::from("hello"));
    msg.call();
}
```

### Option 和 Result

```rust
fn main() {
    // Option<T>
    let some_number = Some(5);
    let some_string = Some("a string");
    let absent_number: Option<i32> = None;
    
    match some_number {
        Some(i) => println!("值: {}", i),
        None => println!("没有值"),
    }
    
    // if let
    if let Some(i) = some_number {
        println!("值: {}", i);
    }
    
    // Result<T, E>
    let result: Result<i32, &str> = Ok(10);
    let error: Result<i32, &str> = Err("出错了");
    
    match result {
        Ok(value) => println!("成功: {}", value),
        Err(e) => println!("错误: {}", e),
    }
}

// 返回 Result
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("除数不能为 0"))
    } else {
        Ok(a / b)
    }
}
```

### 错误处理

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    // panic! 宏
    // panic!("程序崩溃");
    
    // Result 处理
    let f = File::open("hello.txt");
    
    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("创建文件失败: {:?}", e),
            },
            other_error => panic!("打开文件失败: {:?}", other_error),
        },
    };
    
    // unwrap 和 expect
    let f = File::open("hello.txt").unwrap();
    let f = File::open("hello.txt").expect("无法打开文件");
    
    // ? 运算符
    fn read_username() -> Result<String, std::io::Error> {
        let mut f = File::open("username.txt")?;
        let mut s = String::new();
        f.read_to_string(&mut s)?;
        Ok(s)
    }
}
```

## 参考资源

- [Rust 官方文档](https://www.rust-lang.org/)
- [Rust 程序设计语言](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
