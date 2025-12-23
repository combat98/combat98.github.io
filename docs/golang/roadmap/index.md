# Go 学习路线与框架生态

## 学习路线

### 第一阶段：基础入门（1-2周）

1. **环境搭建**
   - 安装 Go
   - 配置 GOPATH 和 Go Modules
   - 熟悉 Go 命令行工具

2. **基础语法**
   - 变量、常量、数据类型
   - 函数、方法
   - 控制流（if、for、switch）
   - 数组、切片、Map
   - 结构体和接口

3. **包管理**
   - 包的导入和使用
   - Go Modules 依赖管理
   - 常用标准库

### 第二阶段：进阶特性（2-3周）

1. **并发编程**
   - Goroutine 和 Channel
   - sync 包（Mutex、WaitGroup、RWMutex）
   - Context 上下文管理
   - 并发模式（Worker Pool、Pipeline）

2. **错误处理**
   - error 接口
   - 自定义错误
   - panic 和 recover

3. **测试**
   - 单元测试
   - 基准测试
   - 表格驱动测试

### 第三阶段：Web 开发（3-4周）

1. **HTTP 编程**
   - net/http 标准库
   - RESTful API 设计
   - 中间件模式

2. **Web 框架**
   - Gin 框架
   - Echo 框架
   - Fiber 框架

3. **数据库操作**
   - database/sql 标准库
   - GORM ORM 框架
   - Redis 操作

### 第四阶段：微服务与云原生（4-6周）

1. **微服务框架**
   - gRPC
   - Go-Micro
   - Go-Kit

2. **容器化**
   - Docker
   - Kubernetes

3. **消息队列**
   - RabbitMQ
   - Kafka

## 框架生态

### Web 框架

#### Gin
- **特点**：高性能、简单易用
- **适用场景**：RESTful API、微服务
- **学习资源**：[Gin 官方文档](https://gin-gonic.com/)

```bash
go get -u github.com/gin-gonic/gin
```

#### Echo
- **特点**：高性能、可扩展
- **适用场景**：Web 应用、API 服务
- **学习资源**：[Echo 官方文档](https://echo.labstack.com/)

```bash
go get -u github.com/labstack/echo/v4
```

#### Fiber
- **特点**：受 Express 启发、极速性能
- **适用场景**：高并发 API
- **学习资源**：[Fiber 官方文档](https://docs.gofiber.io/)

```bash
go get -u github.com/gofiber/fiber/v2
```

#### Beego
- **特点**：全栈框架、MVC 架构
- **适用场景**：企业级应用
- **学习资源**：[Beego 官方文档](https://beego.vip/)

### ORM 框架

#### GORM
- **特点**：功能完整、开发友好
- **支持数据库**：MySQL、PostgreSQL、SQLite、SQL Server

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
```

#### Ent
- **特点**：类型安全、代码生成
- **适用场景**：复杂数据模型

```bash
go get -u entgo.io/ent/cmd/ent
```

### 微服务框架

#### gRPC
- **特点**：高性能 RPC 框架
- **适用场景**：微服务通信

```bash
go get -u google.golang.org/grpc
go get -u google.golang.org/protobuf
```

#### Go-Micro
- **特点**：完整的微服务框架
- **功能**：服务发现、负载均衡、消息编码

#### Go-Kit
- **特点**：微服务工具集
- **功能**：日志、监控、追踪

### 数据库驱动

- **MySQL**：`github.com/go-sql-driver/mysql`
- **PostgreSQL**：`github.com/lib/pq`
- **MongoDB**：`go.mongodb.org/mongo-driver`
- **Redis**：`github.com/go-redis/redis`

### 测试框架

#### Testify
- **特点**：断言和 Mock 工具

```bash
go get -u github.com/stretchr/testify
```

#### GoMock
- **特点**：官方 Mock 框架

```bash
go install github.com/golang/mock/mockgen@latest
```

### 日志库

#### Zap
- **特点**：高性能结构化日志

```bash
go get -u go.uber.org/zap
```

#### Logrus
- **特点**：结构化日志、易用

```bash
go get -u github.com/sirupsen/logrus
```

### 配置管理

#### Viper
- **特点**：完整的配置解决方案
- **支持格式**：JSON、YAML、TOML、ENV

```bash
go get -u github.com/spf13/viper
```

### 任务调度

#### Cron
- **特点**：定时任务调度

```bash
go get -u github.com/robfig/cron/v3
```

## 学习资源

### 官方资源
- [Go 官方文档](https://golang.org/doc/)
- [Go 语言之旅](https://tour.golang.org/)
- [Effective Go](https://golang.org/doc/effective_go)

### 书籍推荐
- 《Go 程序设计语言》
- 《Go 语言实战》
- 《Go Web 编程》

### 在线资源
- [Go by Example](https://gobyexample.com/)
- [Go 语言中文网](https://studygolang.com/)
- [Awesome Go](https://awesome-go.com/)

### 实战项目
1. **RESTful API**：使用 Gin 构建 CRUD 应用
2. **微服务**：使用 gRPC 构建微服务架构
3. **爬虫**：使用 Colly 构建网络爬虫
4. **CLI 工具**：使用 Cobra 构建命令行工具

## 职业发展方向

1. **后端开发工程师**
   - Web API 开发
   - 微服务架构

2. **云原生工程师**
   - Kubernetes 开发
   - 容器化应用

3. **DevOps 工程师**
   - 自动化工具开发
   - CI/CD 流程

4. **区块链开发**
   - 以太坊开发
   - 智能合约

## 最佳实践

1. **代码规范**
   - 遵循 Go 官方代码规范
   - 使用 gofmt 格式化代码
   - 使用 golint 检查代码

2. **项目结构**
   ```
   project/
   ├── cmd/           # 主程序入口
   ├── internal/      # 私有代码
   ├── pkg/           # 公共库
   ├── api/           # API 定义
   ├── configs/       # 配置文件
   ├── docs/          # 文档
   └── scripts/       # 脚本
   ```

3. **性能优化**
   - 使用 pprof 性能分析
   - 合理使用并发
   - 避免内存泄漏

4. **安全性**
   - 输入验证
   - SQL 注入防护
   - HTTPS 通信
