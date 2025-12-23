# Go Web 框架

## 标准库 net/http

Go 标准库提供了强大的 HTTP 服务器功能。

### 基础 HTTP 服务器

```go
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

### 路由和处理器

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type User struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "欢迎访问首页")
}

func userHandler(w http.ResponseWriter, r *http.Request) {
    user := User{Name: "张三", Age: 25}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

func main() {
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/user", userHandler)
    
    fmt.Println("服务器启动在 :8080")
    http.ListenAndServe(":8080", nil)
}
```

## Gin 框架

Gin 是一个高性能的 Go Web 框架。

### 安装

```bash
go get -u github.com/gin-gonic/gin
```

### 基础使用

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    r := gin.Default()
    
    // GET 请求
    r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "Hello, Gin!",
        })
    })
    
    // 路径参数
    r.GET("/user/:name", func(c *gin.Context) {
        name := c.Param("name")
        c.JSON(http.StatusOK, gin.H{
            "name": name,
        })
    })
    
    // 查询参数
    r.GET("/search", func(c *gin.Context) {
        keyword := c.Query("q")
        c.JSON(http.StatusOK, gin.H{
            "keyword": keyword,
        })
    })
    
    r.Run(":8080")
}
```

### RESTful API

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
    Age  int    `json:"age"`
}

var users = []User{
    {ID: 1, Name: "张三", Age: 25},
    {ID: 2, Name: "李四", Age: 30},
}

func main() {
    r := gin.Default()
    
    // 获取所有用户
    r.GET("/users", func(c *gin.Context) {
        c.JSON(http.StatusOK, users)
    })
    
    // 获取单个用户
    r.GET("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        for _, user := range users {
            if fmt.Sprint(user.ID) == id {
                c.JSON(http.StatusOK, user)
                return
            }
        }
        c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
    })
    
    // 创建用户
    r.POST("/users", func(c *gin.Context) {
        var newUser User
        if err := c.ShouldBindJSON(&newUser); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        newUser.ID = len(users) + 1
        users = append(users, newUser)
        c.JSON(http.StatusCreated, newUser)
    })
    
    // 更新用户
    r.PUT("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        var updatedUser User
        if err := c.ShouldBindJSON(&updatedUser); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        
        for i, user := range users {
            if fmt.Sprint(user.ID) == id {
                users[i] = updatedUser
                users[i].ID = user.ID
                c.JSON(http.StatusOK, users[i])
                return
            }
        }
        c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
    })
    
    // 删除用户
    r.DELETE("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        for i, user := range users {
            if fmt.Sprint(user.ID) == id {
                users = append(users[:i], users[i+1:]...)
                c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
                return
            }
        }
        c.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
    })
    
    r.Run(":8080")
}
```

### 中间件

```go
package main

import (
    "github.com/gin-gonic/gin"
    "log"
    "time"
)

// 日志中间件
func Logger() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        
        c.Next()
        
        duration := time.Since(start)
        log.Printf("[%s] %s %v", c.Request.Method, c.Request.URL.Path, duration)
    }
}

// 认证中间件
func Auth() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token != "secret-token" {
            c.JSON(401, gin.H{"error": "未授权"})
            c.Abort()
            return
        }
        c.Next()
    }
}

func main() {
    r := gin.New()
    
    // 全局中间件
    r.Use(Logger())
    
    // 公开路由
    r.GET("/public", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "公开接口"})
    })
    
    // 需要认证的路由组
    authorized := r.Group("/api")
    authorized.Use(Auth())
    {
        authorized.GET("/users", func(c *gin.Context) {
            c.JSON(200, gin.H{"message": "用户列表"})
        })
    }
    
    r.Run(":8080")
}
```

## Echo 框架

Echo 是另一个高性能的 Go Web 框架。

### 安装

```bash
go get -u github.com/labstack/echo/v4
```

### 基础使用

```go
package main

import (
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    "net/http"
)

func main() {
    e := echo.New()
    
    // 中间件
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    
    // 路由
    e.GET("/", func(c echo.Context) error {
        return c.String(http.StatusOK, "Hello, Echo!")
    })
    
    e.GET("/users/:id", func(c echo.Context) error {
        id := c.Param("id")
        return c.JSON(http.StatusOK, map[string]string{
            "id": id,
        })
    })
    
    e.Logger.Fatal(e.Start(":8080"))
}
```

## Fiber 框架

Fiber 是一个受 Express 启发的 Web 框架。

### 安装

```bash
go get -u github.com/gofiber/fiber/v2
```

### 基础使用

```go
package main

import (
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
    app := fiber.New()
    
    // 中间件
    app.Use(logger.New())
    
    // 路由
    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, Fiber!")
    })
    
    app.Get("/api/users/:id", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "id": c.Params("id"),
        })
    })
    
    app.Listen(":8080")
}
```

## 数据库操作（GORM）

GORM 是 Go 语言的 ORM 库。

### 安装

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
```

### 基础使用

```go
package main

import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "log"
)

type User struct {
    ID   uint   `gorm:"primaryKey"`
    Name string `gorm:"size:100"`
    Age  int
}

func main() {
    // 连接数据库
    dsn := "user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal(err)
    }
    
    // 自动迁移
    db.AutoMigrate(&User{})
    
    // 创建
    user := User{Name: "张三", Age: 25}
    db.Create(&user)
    
    // 查询
    var result User
    db.First(&result, 1)
    db.Where("name = ?", "张三").First(&result)
    
    // 更新
    db.Model(&result).Update("Age", 26)
    
    // 删除
    db.Delete(&result, 1)
}
```

## 参考资源

- [Gin 文档](https://gin-gonic.com/docs/)
- [Echo 文档](https://echo.labstack.com/)
- [Fiber 文档](https://docs.gofiber.io/)
- [GORM 文档](https://gorm.io/docs/)
