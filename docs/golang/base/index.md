# Golang 基础

## 简介

Go（又称 Golang）是 Google 开发的一种静态强类型、编译型语言。Go 语言语法简洁，并发性能优秀，适合构建高性能的网络服务和分布式系统。

### 特点

- 简洁的语法
- 高效的并发编程（goroutine）
- 快速的编译速度
- 内置垃圾回收
- 丰富的标准库
- 跨平台支持

## 环境配置

### 安装 Go

**Windows:**
```bash
# 下载安装包
# https://golang.org/dl/
# 下载 .msi 文件并安装

# 验证安装
go version
```

**macOS:**
```bash
# 使用 Homebrew
brew install go

# 验证安装
go version
```

**Linux:**
```bash
# 下载并解压
wget https://golang.org/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz

# 配置环境变量
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# 验证安装
go version
```

### 配置 GOPATH 和 Go Modules

```bash
# 设置 GOPATH（可选，Go 1.11+ 推荐使用 Go Modules）
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# 启用 Go Modules
go env -w GO111MODULE=on

# 配置代理（中国用户）
go env -w GOPROXY=https://goproxy.cn,direct
```

### 创建第一个项目

```bash
# 创建项目目录
mkdir hello-go
cd hello-go

# 初始化模块
go mod init hello-go

# 创建 main.go
```

```go
// main.go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

```bash
# 运行程序
go run main.go

# 编译程序
go build

# 运行编译后的程序
./hello-go
```

## 语法基础

### 变量和常量

```go
package main

import "fmt"

func main() {
    // 变量声明
    var name string = "张三"
    var age int = 25
    var isStudent bool = true
    
    // 类型推断
    var city = "北京"
    
    // 短变量声明（只能在函数内使用）
    country := "中国"
    
    // 多变量声明
    var x, y, z int = 1, 2, 3
    a, b := 10, 20
    
    // 常量
    const PI = 3.14159
    const (
        StatusOK = 200
        StatusNotFound = 404
    )
    
    fmt.Println(name, age, isStudent, city, country)
    fmt.Println(x, y, z, a, b)
    fmt.Println(PI, StatusOK)
}
```

### 基本数据类型

```go
package main

import "fmt"

func main() {
    // 整数类型
    var i8 int8 = 127
    var i16 int16 = 32767
    var i32 int32 = 2147483647
    var i64 int64 = 9223372036854775807
    var ui uint = 100
    
    // 浮点类型
    var f32 float32 = 3.14
    var f64 float64 = 3.141592653589793
    
    // 布尔类型
    var flag bool = true
    
    // 字符串类型
    var str string = "Hello, Go!"
    
    // 字节类型
    var b byte = 'A'  // byte 是 uint8 的别名
    var r rune = '中'  // rune 是 int32 的别名，表示 Unicode 码点
    
    fmt.Println(i8, i16, i32, i64, ui)
    fmt.Println(f32, f64)
    fmt.Println(flag, str, b, r)
}
```

### 数组和切片

```go
package main

import "fmt"

func main() {
    // 数组（固定长度）
    var arr1 [5]int = [5]int{1, 2, 3, 4, 5}
    arr2 := [3]string{"a", "b", "c"}
    arr3 := [...]int{1, 2, 3, 4}  // 自动推断长度
    
    fmt.Println(arr1, arr2, arr3)
    fmt.Println("数组长度:", len(arr1))
    
    // 切片（动态数组）
    slice1 := []int{1, 2, 3, 4, 5}
    slice2 := make([]int, 5)      // 长度为 5
    slice3 := make([]int, 3, 10)  // 长度为 3，容量为 10
    
    // 切片操作
    slice1 = append(slice1, 6, 7, 8)  // 追加元素
    subSlice := slice1[1:4]            // 切片 [2, 3, 4]
    
    fmt.Println(slice1, slice2, slice3)
    fmt.Println("切片长度:", len(slice1), "容量:", cap(slice1))
    fmt.Println("子切片:", subSlice)
}
```

### Map（映射）

```go
package main

import "fmt"

func main() {
    // 创建 map
    map1 := make(map[string]int)
    map1["apple"] = 5
    map1["banana"] = 3
    
    // 字面量创建
    map2 := map[string]string{
        "name": "张三",
        "city": "北京",
    }
    
    // 访问元素
    fmt.Println(map1["apple"])
    
    // 检查键是否存在
    value, exists := map1["orange"]
    if exists {
        fmt.Println("orange:", value)
    } else {
        fmt.Println("orange 不存在")
    }
    
    // 删除元素
    delete(map1, "apple")
    
    // 遍历 map
    for key, value := range map2 {
        fmt.Printf("%s: %s\n", key, value)
    }
    
    fmt.Println("map 长度:", len(map2))
}
```

### 控制流

```go
package main

import "fmt"

func main() {
    // if-else
    age := 20
    if age >= 18 {
        fmt.Println("成年人")
    } else {
        fmt.Println("未成年人")
    }
    
    // if 简短语句
    if num := 10; num > 5 {
        fmt.Println("num 大于 5")
    }
    
    // switch
    day := 3
    switch day {
    case 1:
        fmt.Println("星期一")
    case 2:
        fmt.Println("星期二")
    case 3:
        fmt.Println("星期三")
    default:
        fmt.Println("其他")
    }
    
    // switch 无条件
    score := 85
    switch {
    case score >= 90:
        fmt.Println("优秀")
    case score >= 80:
        fmt.Println("良好")
    case score >= 60:
        fmt.Println("及格")
    default:
        fmt.Println("不及格")
    }
    
    // for 循环
    for i := 0; i < 5; i++ {
        fmt.Println(i)
    }
    
    // while 风格
    j := 0
    for j < 5 {
        fmt.Println(j)
        j++
    }
    
    // 无限循环
    // for {
    //     fmt.Println("无限循环")
    //     break
    // }
    
    // range 遍历
    nums := []int{1, 2, 3, 4, 5}
    for index, value := range nums {
        fmt.Printf("索引: %d, 值: %d\n", index, value)
    }
}
```

### 函数

```go
package main

import "fmt"

// 基本函数
func add(a int, b int) int {
    return a + b
}

// 参数类型相同可以简写
func multiply(a, b int) int {
    return a * b
}

// 多返回值
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("除数不能为 0")
    }
    return a / b, nil
}

// 命名返回值
func swap(a, b string) (x, y string) {
    x = b
    y = a
    return  // 裸返回
}

// 可变参数
func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}

// 匿名函数和闭包
func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

func main() {
    fmt.Println(add(3, 5))
    fmt.Println(multiply(4, 6))
    
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("错误:", err)
    } else {
        fmt.Println("结果:", result)
    }
    
    x, y := swap("hello", "world")
    fmt.Println(x, y)
    
    fmt.Println(sum(1, 2, 3, 4, 5))
    
    // 闭包
    c := counter()
    fmt.Println(c())  // 1
    fmt.Println(c())  // 2
    fmt.Println(c())  // 3
}
```

### 结构体

```go
package main

import "fmt"

// 定义结构体
type Person struct {
    Name string
    Age  int
    City string
}

// 结构体方法
func (p Person) SayHello() {
    fmt.Printf("你好，我是 %s，今年 %d 岁\n", p.Name, p.Age)
}

// 指针接收者方法（可以修改结构体）
func (p *Person) Birthday() {
    p.Age++
}

// 嵌套结构体
type Employee struct {
    Person
    Company string
    Salary  float64
}

func main() {
    // 创建结构体
    p1 := Person{Name: "张三", Age: 25, City: "北京"}
    p2 := Person{"李四", 30, "上海"}
    p3 := &Person{Name: "王五", Age: 28}
    
    fmt.Println(p1, p2, *p3)
    
    // 访问字段
    fmt.Println(p1.Name, p1.Age)
    
    // 调用方法
    p1.SayHello()
    p1.Birthday()
    fmt.Println("生日后年龄:", p1.Age)
    
    // 嵌套结构体
    emp := Employee{
        Person:  Person{Name: "赵六", Age: 35, City: "深圳"},
        Company: "科技公司",
        Salary:  15000,
    }
    fmt.Println(emp.Name, emp.Company)  // 可以直接访问嵌套字段
    emp.SayHello()
}
```

### 接口

```go
package main

import (
    "fmt"
    "math"
)

// 定义接口
type Shape interface {
    Area() float64
    Perimeter() float64
}

// 矩形
type Rectangle struct {
    Width  float64
    Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// 圆形
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}

// 使用接口
func printShapeInfo(s Shape) {
    fmt.Printf("面积: %.2f, 周长: %.2f\n", s.Area(), s.Perimeter())
}

func main() {
    rect := Rectangle{Width: 5, Height: 3}
    circle := Circle{Radius: 4}
    
    printShapeInfo(rect)
    printShapeInfo(circle)
    
    // 空接口（可以接受任何类型）
    var any interface{}
    any = 42
    fmt.Println(any)
    any = "hello"
    fmt.Println(any)
    
    // 类型断言
    str, ok := any.(string)
    if ok {
        fmt.Println("字符串:", str)
    }
}
```

### 错误处理

```go
package main

import (
    "errors"
    "fmt"
)

// 自定义错误
type MyError struct {
    Code    int
    Message string
}

func (e *MyError) Error() string {
    return fmt.Sprintf("错误代码: %d, 消息: %s", e.Code, e.Message)
}

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("除数不能为 0")
    }
    return a / b, nil
}

func checkAge(age int) error {
    if age < 0 {
        return &MyError{Code: 1001, Message: "年龄不能为负数"}
    }
    if age > 150 {
        return &MyError{Code: 1002, Message: "年龄超出范围"}
    }
    return nil
}

func main() {
    // 基本错误处理
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("错误:", err)
    } else {
        fmt.Println("结果:", result)
    }
    
    // 自定义错误
    if err := checkAge(-5); err != nil {
        fmt.Println(err)
    }
    
    // defer（延迟执行）
    defer fmt.Println("这会最后执行")
    fmt.Println("这会先执行")
    
    // panic 和 recover
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("捕获 panic:", r)
        }
    }()
    
    // panic("发生严重错误")  // 取消注释会触发 panic
}
```

### 并发编程

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// Goroutine
func sayHello(name string) {
    for i := 0; i < 3; i++ {
        fmt.Printf("%s: Hello %d\n", name, i)
        time.Sleep(100 * time.Millisecond)
    }
}

// Channel
func sum(nums []int, ch chan int) {
    total := 0
    for _, num := range nums {
        total += num
    }
    ch <- total  // 发送到 channel
}

// WaitGroup
func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()
    fmt.Printf("Worker %d 开始工作\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d 完成工作\n", id)
}

func main() {
    // 启动 goroutine
    go sayHello("goroutine-1")
    go sayHello("goroutine-2")
    
    // Channel 示例
    nums := []int{1, 2, 3, 4, 5}
    ch := make(chan int)
    go sum(nums[:len(nums)/2], ch)
    go sum(nums[len(nums)/2:], ch)
    
    x, y := <-ch, <-ch  // 从 channel 接收
    fmt.Println("总和:", x+y)
    
    // 缓冲 channel
    bufferedCh := make(chan int, 2)
    bufferedCh <- 1
    bufferedCh <- 2
    fmt.Println(<-bufferedCh)
    fmt.Println(<-bufferedCh)
    
    // WaitGroup
    var wg sync.WaitGroup
    for i := 1; i <= 3; i++ {
        wg.Add(1)
        go worker(i, &wg)
    }
    wg.Wait()
    fmt.Println("所有 worker 完成")
    
    // Select
    ch1 := make(chan string)
    ch2 := make(chan string)
    
    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "来自 ch1"
    }()
    
    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "来自 ch2"
    }()
    
    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-ch1:
            fmt.Println(msg1)
        case msg2 := <-ch2:
            fmt.Println(msg2)
        }
    }
}
```

## 常用标准库

### fmt - 格式化 I/O

```go
package main

import "fmt"

func main() {
    name := "张三"
    age := 25
    
    // 打印
    fmt.Println("Hello, World!")
    fmt.Printf("姓名: %s, 年龄: %d\n", name, age)
    
    // 格式化字符串
    str := fmt.Sprintf("姓名: %s, 年龄: %d", name, age)
    fmt.Println(str)
    
    // 输入
    var input string
    // fmt.Scan(&input)
    // fmt.Println("输入:", input)
}
```

### time - 时间处理

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 当前时间
    now := time.Now()
    fmt.Println("当前时间:", now)
    
    // 格式化时间
    fmt.Println(now.Format("2006-01-02 15:04:05"))
    fmt.Println(now.Format("2006/01/02"))
    
    // 解析时间
    t, _ := time.Parse("2006-01-02", "2024-01-01")
    fmt.Println(t)
    
    // 时间计算
    tomorrow := now.Add(24 * time.Hour)
    fmt.Println("明天:", tomorrow.Format("2006-01-02"))
    
    // 睡眠
    time.Sleep(1 * time.Second)
    
    // 定时器
    timer := time.NewTimer(2 * time.Second)
    <-timer.C
    fmt.Println("定时器触发")
}
```

### os - 操作系统功能

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    // 环境变量
    fmt.Println("PATH:", os.Getenv("PATH"))
    os.Setenv("MY_VAR", "value")
    
    // 命令行参数
    fmt.Println("参数:", os.Args)
    
    // 文件操作
    file, err := os.Create("test.txt")
    if err != nil {
        fmt.Println("错误:", err)
        return
    }
    defer file.Close()
    
    file.WriteString("Hello, Go!")
    
    // 读取文件
    data, _ := os.ReadFile("test.txt")
    fmt.Println("文件内容:", string(data))
    
    // 删除文件
    os.Remove("test.txt")
}
```

## 参考资源

- [Go 官方文档](https://golang.org/doc/)
- [Go 语言之旅](https://tour.golang.org/welcome/1)
- [Go by Example](https://gobyexample.com/)
