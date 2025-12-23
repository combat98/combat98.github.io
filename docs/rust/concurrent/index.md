# Rust 并发编程

## 线程

### 创建线程

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("子线程: {}", i);
            thread::sleep(Duration::from_millis(1));
        }
    });
    
    for i in 1..5 {
        println!("主线程: {}", i);
        thread::sleep(Duration::from_millis(1));
    }
    
    handle.join().unwrap();
}
```

### 使用 move 闭包

```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];
    
    let handle = thread::spawn(move || {
        println!("向量: {:?}", v);
    });
    
    handle.join().unwrap();
}
```

## 消息传递

### 通道（Channel）

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });
    
    let received = rx.recv().unwrap();
    println!("收到: {}", received);
}
```

### 发送多个值

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];
        
        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });
    
    for received in rx {
        println!("收到: {}", received);
    }
}
```

### 多个生产者

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx1 = tx.clone();
    
    thread::spawn(move || {
        tx.send(String::from("线程1")).unwrap();
    });
    
    thread::spawn(move || {
        tx1.send(String::from("线程2")).unwrap();
    });
    
    for received in rx {
        println!("收到: {}", received);
    }
}
```

## 共享状态

### Mutex 互斥锁

::: code-group
```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);
    
    {
        let mut num = m.lock().unwrap();
        *num = 6;
    }
    
    println!("m = {:?}", m);
}
```
:::

### 多线程共享 Mutex

::: code-group
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
    
    println!("结果: {}", *counter.lock().unwrap());
}
```
:::

## 异步编程（Tokio）

### 安装 Tokio

```toml
# Cargo.toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

### 基础异步函数

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    println!("开始");
    
    let task1 = tokio::spawn(async {
        sleep(Duration::from_secs(1)).await;
        println!("任务1完成");
    });
    
    let task2 = tokio::spawn(async {
        sleep(Duration::from_secs(2)).await;
        println!("任务2完成");
    });
    
    task1.await.unwrap();
    task2.await.unwrap();
    
    println!("结束");
}
```

### 异步 HTTP 请求

::: code-group
```rust
use tokio;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("https://httpbin.org/ip")
        .await?
        .text()
        .await?;
    
    println!("响应: {}", resp);
    Ok(())
}
```
:::

## 参考资源

- [Rust 并发](https://doc.rust-lang.org/book/ch16-00-concurrency.html)
- [Tokio 文档](https://tokio.rs/)
