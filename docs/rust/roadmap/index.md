# Rust 学习路线与框架生态

## 学习路线

### 第一阶段：基础入门（2-3周）

1. **环境搭建**
   - 安装 Rust（rustup）
   - 配置 Cargo
   - IDE 配置（VS Code + rust-analyzer）

2. **基础语法**
   - 变量和数据类型
   - 函数和控制流
   - 所有权系统（重点）
   - 借用和引用
   - 切片

3. **基本概念**
   - 结构体和枚举
   - 模式匹配
   - 错误处理（Result、Option）

### 第二阶段：进阶特性（3-4周）

1. **所有权深入**
   - 生命周期
   - 智能指针（Box、Rc、Arc、RefCell）
   - 内部可变性

2. **泛型和 Trait**
   - 泛型编程
   - Trait 定义和实现
   - Trait 对象

3. **并发编程**
   - 线程
   - 消息传递（Channel）
   - 共享状态（Mutex、Arc）
   - 异步编程（async/await）

### 第三阶段：Web 开发（4-5周）

1. **Web 框架**
   - Actix-web
   - Rocket
   - Axum

2. **数据库操作**
   - Diesel ORM
   - SQLx
   - SeaORM

3. **异步运行时**
   - Tokio
   - async-std

### 第四阶段：系统编程（5-6周）

1. **底层编程**
   - 不安全 Rust（unsafe）
   - FFI（外部函数接口）
   - 内存布局

2. **WebAssembly**
   - wasm-bindgen
   - wasm-pack

3. **嵌入式开发**
   - embedded-hal
   - no_std 编程

## 框架生态

### Web 框架

#### Actix-web
- **特点**：高性能、Actor 模型
- **适用场景**：高并发 Web 服务

```toml
[dependencies]
actix-web = "4"
```

```rust
use actix_web::{web, App, HttpServer, Responder};

async fn hello() -> impl Responder {
    "Hello, Actix!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().route("/", web::get().to(hello))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
```

#### Rocket
- **特点**：类型安全、易用
- **适用场景**：快速开发 Web 应用

```toml
[dependencies]
rocket = "0.5"
```

#### Axum
- **特点**：基于 Tokio、模块化
- **适用场景**：异步 Web 服务

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
```

#### Warp
- **特点**：函数式、组合式
- **适用场景**：RESTful API

### ORM 和数据库

#### Diesel
- **特点**：类型安全、编译时检查
- **支持**：PostgreSQL、MySQL、SQLite

```toml
[dependencies]
diesel = { version = "2.1", features = ["postgres"] }
```

#### SQLx
- **特点**：异步、编译时 SQL 检查
- **支持**：PostgreSQL、MySQL、SQLite

```toml
[dependencies]
sqlx = { version = "0.7", features = ["runtime-tokio-native-tls", "postgres"] }
```

#### SeaORM
- **特点**：异步、动态查询
- **支持**：PostgreSQL、MySQL、SQLite

```toml
[dependencies]
sea-orm = "0.12"
```

### 异步运行时

#### Tokio
- **特点**：最流行的异步运行时
- **功能**：异步 I/O、定时器、同步原语

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

#### async-std
- **特点**：类似标准库的 API
- **功能**：异步版本的标准库

```toml
[dependencies]
async-std = { version = "1", features = ["attributes"] }
```

### 序列化

#### Serde
- **特点**：高性能序列化框架
- **支持格式**：JSON、YAML、TOML、MessagePack

```toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### HTTP 客户端

#### Reqwest
- **特点**：易用的 HTTP 客户端

```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
```

### CLI 工具

#### Clap
- **特点**：命令行参数解析

```toml
[dependencies]
clap = { version = "4", features = ["derive"] }
```

### 日志

#### tracing
- **特点**：结构化日志和追踪

```toml
[dependencies]
tracing = "0.1"
tracing-subscriber = "0.3"
```

### 测试

#### cargo-test
- 内置测试框架

#### proptest
- 属性测试

```toml
[dev-dependencies]
proptest = "1.0"
```

## 学习资源

### 官方资源
- [Rust 官方文档](https://www.rust-lang.org/)
- [Rust 程序设计语言](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)

### 书籍推荐
- 《Rust 权威指南》
- 《Rust 编程之道》
- 《深入理解 Rust》

### 在线资源
- [Rustlings](https://github.com/rust-lang/rustlings)
- [Rust 语言圣经](https://course.rs/)
- [Awesome Rust](https://github.com/rust-unofficial/awesome-rust)

### 实战项目
1. **CLI 工具**：使用 Clap 构建命令行工具
2. **Web API**：使用 Actix-web 构建 RESTful API
3. **系统工具**：文件处理、网络工具
4. **WebAssembly**：构建前端应用

## 职业发展方向

1. **系统编程**
   - 操作系统开发
   - 数据库引擎

2. **Web 后端**
   - 高性能 API 服务
   - 微服务架构

3. **区块链开发**
   - 智能合约
   - 区块链基础设施

4. **嵌入式开发**
   - IoT 设备
   - 实时系统

5. **WebAssembly**
   - 前端性能优化
   - 跨平台应用

## 最佳实践

1. **代码规范**
   - 使用 rustfmt 格式化
   - 使用 clippy 检查
   - 遵循 Rust API 指南

2. **项目结构**
   ```
   project/
   ├── src/
   │   ├── main.rs
   │   ├── lib.rs
   │   └── modules/
   ├── tests/
   ├── benches/
   ├── examples/
   └── Cargo.toml
   ```

3. **错误处理**
   - 使用 Result 和 Option
   - 自定义错误类型
   - 使用 anyhow 或 thiserror

4. **性能优化**
   - 使用 cargo bench
   - 避免不必要的克隆
   - 合理使用引用

5. **安全性**
   - 最小化 unsafe 代码
   - 使用类型系统保证安全
   - 定期更新依赖
