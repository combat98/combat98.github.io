# Rust 所有权与生命周期

## 所有权（Ownership）

所有权是 Rust 最独特的特性，它使 Rust 无需垃圾回收器就能保证内存安全。

### 所有权规则

1. Rust 中的每一个值都有一个所有者（owner）
2. 值在任一时刻有且只有一个所有者
3. 当所有者离开作用域，这个值将被丢弃

### 变量作用域

```rust
fn main() {
    {                      // s 在这里无效，它尚未声明
        let s = "hello";   // 从此处起，s 是有效的
        // 使用 s
    }                      // 此作用域已结束，s 不再有效
}
```

### 移动（Move）

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 的值移动到 s2
    
    // println!("{}", s1);  // 错误！s1 已经无效
    println!("{}", s2);     // 正确
    
    // 基本类型会复制
    let x = 5;
    let y = x;
    println!("{}, {}", x, y);  // 正确，因为 i32 实现了 Copy trait
}
```

### 克隆（Clone）

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();  // 深拷贝
    
    println!("s1 = {}, s2 = {}", s1, s2);  // 都有效
}
```

### 函数与所有权

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s);  // s 的值移动到函数里
    // println!("{}", s);  // 错误！s 已经无效
    
    let x = 5;
    makes_copy(x);  // x 是 Copy 的，所以后面可继续使用
    println!("{}", x);  // 正确
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}  // some_string 离开作用域并调用 drop

fn makes_copy(some_integer: i32) {
    println!("{}", some_integer);
}
```

### 返回值与所有权

```rust
fn main() {
    let s1 = gives_ownership();
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2);
    
    println!("{}, {}", s1, s3);
}

fn gives_ownership() -> String {
    let some_string = String::from("hello");
    some_string  // 返回并移出给调用的函数
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string  // 返回并移出给调用的函数
}
```

## 引用与借用（References and Borrowing）

### 不可变引用

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);  // 传递引用
    
    println!("'{}' 的长度是 {}", s1, len);  // s1 仍然有效
}

fn calculate_length(s: &String) -> usize {
    s.len()
}  // s 离开作用域，但因为它不拥有引用值，所以什么也不会发生
```

### 可变引用

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
    println!("{}", s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

### 引用规则

```rust
fn main() {
    let mut s = String::from("hello");
    
    // 可以有多个不可变引用
    let r1 = &s;
    let r2 = &s;
    println!("{} and {}", r1, r2);
    
    // 但不能同时有可变和不可变引用
    // let r3 = &mut s;  // 错误！
    
    // 在同一时间只能有一个可变引用
    let r1 = &mut s;
    // let r2 = &mut s;  // 错误！
    println!("{}", r1);
}
```

### 悬垂引用

```rust
fn main() {
    // let reference_to_nothing = dangle();  // 错误！
    let string = no_dangle();
}

// 错误：返回悬垂引用
// fn dangle() -> &String {
//     let s = String::from("hello");
//     &s  // 返回 s 的引用
// }  // s 离开作用域并被丢弃，其内存被释放

// 正确：返回 String 本身
fn no_dangle() -> String {
    let s = String::from("hello");
    s  // 所有权被移出
}
```

## 切片（Slices）

### 字符串切片

```rust
fn main() {
    let s = String::from("hello world");
    
    let hello = &s[0..5];
    let world = &s[6..11];
    
    let hello = &s[..5];   // 等同于 &s[0..5]
    let world = &s[6..];   // 等同于 &s[6..11]
    let whole = &s[..];    // 整个字符串
    
    println!("{} {}", hello, world);
    
    let word = first_word(&s);
    println!("第一个单词: {}", word);
}

fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    
    &s[..]
}
```

### 数组切片

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
    let slice = &a[1..3];
    
    assert_eq!(slice, &[2, 3]);
}
```

## 生命周期（Lifetimes）

### 生命周期注解

::: code-group
```rust
fn main() {
    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(string1.as_str(), string2.as_str());
        println!("最长的字符串是 {}", result);
    }
}

// 生命周期注解
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```
:::

### 结构体中的生命周期

::: code-group
```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
    
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("注意: {}", announcement);
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("找不到句号");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
    
    println!("{}", i.part);
}
```
:::

### 生命周期省略规则

::: code-group
```rust
// 编译器可以推断生命周期
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    
    &s[..]
}

// 等价于
fn first_word_explicit<'a>(s: &'a str) -> &'a str {
    // ...
    &s[..]
}
```
:::

### 静态生命周期

```rust
fn main() {
    // 'static 生命周期存活于整个程序期间
    let s: &'static str = "I have a static lifetime.";
    println!("{}", s);
}
```

## 智能指针

### Box 智能指针

::: code-group
```rust
fn main() {
    // 在堆上分配数据
    let b = Box::new(5);
    println!("b = {}", b);
    
    // 递归类型
    enum List {
        Cons(i32, Box<List>),
        Nil,
    }
    
    use List::{Cons, Nil};
    
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
}
```
:::

### Rc 引用计数

::: code-group
```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    println!("引用计数: {}", Rc::strong_count(&a));
    
    let b = Rc::clone(&a);
    println!("引用计数: {}", Rc::strong_count(&a));
    
    {
        let c = Rc::clone(&a);
        println!("引用计数: {}", Rc::strong_count(&a));
    }
    
    println!("引用计数: {}", Rc::strong_count(&a));
}
```
:::

### RefCell 内部可变性

::: code-group
```rust
use std::cell::RefCell;

fn main() {
    let data = RefCell::new(5);
    
    *data.borrow_mut() += 1;
    
    println!("data: {:?}", data.borrow());
}
```
:::

## 参考资源

- [Rust 所有权](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
- [Rust 生命周期](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html)
