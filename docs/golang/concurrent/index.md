# Go 并发编程

## Goroutine

Goroutine 是 Go 语言的轻量级线程，由 Go 运行时管理。

### 基础使用

```go
package main

import (
    "fmt"
    "time"
)

func task(id int) {
    fmt.Printf("任务 %d 开始\n", id)
    time.Sleep(time.Second)
    fmt.Printf("任务 %d 完成\n", id)
}

func main() {
    // 启动多个 goroutine
    for i := 1; i <= 5; i++ {
        go task(i)
    }
    
    // 等待 goroutine 完成
    time.Sleep(2 * time.Second)
    fmt.Println("所有任务完成")
}
```

## Channel

Channel 是 Go 语言中用于 goroutine 之间通信的管道。

### 无缓冲 Channel

```go
package main

import "fmt"

func main() {
    ch := make(chan int)
    
    // 发送数据
    go func() {
        ch <- 42
    }()
    
    // 接收数据
    value := <-ch
    fmt.Println("接收到:", value)
}
```

### 缓冲 Channel

```go
package main

import "fmt"

func main() {
    ch := make(chan int, 3)
    
    ch <- 1
    ch <- 2
    ch <- 3
    
    fmt.Println(<-ch)
    fmt.Println(<-ch)
    fmt.Println(<-ch)
}
```

### Channel 方向

```go
package main

import "fmt"

// 只能发送
func send(ch chan<- int) {
    ch <- 100
}

// 只能接收
func receive(ch <-chan int) {
    value := <-ch
    fmt.Println("接收:", value)
}

func main() {
    ch := make(chan int)
    
    go send(ch)
    receive(ch)
}
```

## Select

Select 用于处理多个 channel 操作。

```go
package main

import (
    "fmt"
    "time"
)

func main() {
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
        case <-time.After(3 * time.Second):
            fmt.Println("超时")
        }
    }
}
```

## sync 包

### WaitGroup

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()
    
    fmt.Printf("Worker %d 开始\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d 完成\n", id)
}

func main() {
    var wg sync.WaitGroup
    
    for i := 1; i <= 5; i++ {
        wg.Add(1)
        go worker(i, &wg)
    }
    
    wg.Wait()
    fmt.Println("所有 worker 完成")
}
```

### Mutex（互斥锁）

```go
package main

import (
    "fmt"
    "sync"
)

type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}

func main() {
    counter := &Counter{}
    var wg sync.WaitGroup
    
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter.Increment()
        }()
    }
    
    wg.Wait()
    fmt.Println("计数:", counter.Value())
}
```

### RWMutex（读写锁）

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Cache struct {
    mu   sync.RWMutex
    data map[string]string
}

func (c *Cache) Get(key string) string {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.data[key]
}

func (c *Cache) Set(key, value string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.data[key] = value
}

func main() {
    cache := &Cache{data: make(map[string]string)}
    
    // 写入
    go func() {
        cache.Set("name", "张三")
        time.Sleep(time.Second)
    }()
    
    // 读取
    time.Sleep(100 * time.Millisecond)
    fmt.Println(cache.Get("name"))
}
```

## Context

Context 用于控制 goroutine 的生命周期。

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func worker(ctx context.Context, id int) {
    for {
        select {
        case <-ctx.Done():
            fmt.Printf("Worker %d 停止\n", id)
            return
        default:
            fmt.Printf("Worker %d 工作中\n", id)
            time.Sleep(500 * time.Millisecond)
        }
    }
}

func main() {
    // 带超时的 context
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel()
    
    go worker(ctx, 1)
    go worker(ctx, 2)
    
    time.Sleep(3 * time.Second)
    fmt.Println("主程序结束")
}
```

## 并发模式

### Worker Pool

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for job := range jobs {
        fmt.Printf("Worker %d 处理任务 %d\n", id, job)
        time.Sleep(time.Second)
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 10)
    results := make(chan int, 10)
    var wg sync.WaitGroup
    
    // 启动 3 个 worker
    for i := 1; i <= 3; i++ {
        wg.Add(1)
        go worker(i, jobs, results, &wg)
    }
    
    // 发送任务
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // 等待完成
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // 收集结果
    for result := range results {
        fmt.Println("结果:", result)
    }
}
```

## 参考资源

- [Go 并发编程](https://golang.org/doc/effective_go#concurrency)
- [Go by Example: Goroutines](https://gobyexample.com/goroutines)
