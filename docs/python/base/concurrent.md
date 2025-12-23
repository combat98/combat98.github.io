# Python 多线程与多进程

## 简介

Python 提供了多种并发编程方式：
- **多线程（Threading）**：适合 I/O 密集型任务
- **多进程（Multiprocessing）**：适合 CPU 密集型任务
- **异步编程（Asyncio）**：适合高并发 I/O 操作

## 多线程（Threading）

### 基础使用

```python
import threading
import time

def worker(name, delay):
    """工作线程"""
    print(f"线程 {name} 开始")
    time.sleep(delay)
    print(f"线程 {name} 结束")

# 创建线程
t1 = threading.Thread(target=worker, args=("A", 2))
t2 = threading.Thread(target=worker, args=("B", 1))

# 启动线程
t1.start()
t2.start()

# 等待线程结束
t1.join()
t2.join()

print("所有线程执行完毕")
```

### 线程类

```python
import threading
import time

class MyThread(threading.Thread):
    """自定义线程类"""
    def __init__(self, name, delay):
        super().__init__()
        self.name = name
        self.delay = delay
    
    def run(self):
        """线程执行的方法"""
        print(f"线程 {self.name} 开始")
        time.sleep(self.delay)
        print(f"线程 {self.name} 结束")

# 使用
t1 = MyThread("Thread-1", 2)
t2 = MyThread("Thread-2", 1)

t1.start()
t2.start()

t1.join()
t2.join()
```

### 线程同步 - Lock（锁）

```python
import threading

# 共享资源
counter = 0
lock = threading.Lock()

def increment():
    """增加计数器"""
    global counter
    for _ in range(100000):
        # 获取锁
        lock.acquire()
        try:
            counter += 1
        finally:
            # 释放锁
            lock.release()

# 或使用 with 语句
def increment_with():
    global counter
    for _ in range(100000):
        with lock:
            counter += 1

# 创建多个线程
threads = []
for i in range(5):
    t = threading.Thread(target=increment)
    threads.append(t)
    t.start()

# 等待所有线程完成
for t in threads:
    t.join()

print(f"最终计数：{counter}")  # 输出：500000
```

### 线程同步 - RLock（可重入锁）

```python
import threading

rlock = threading.RLock()

def recursive_function(n):
    """递归函数"""
    with rlock:
        if n > 0:
            print(f"递归层级：{n}")
            recursive_function(n - 1)

t = threading.Thread(target=recursive_function, args=(5,))
t.start()
t.join()
```

### 线程同步 - Semaphore（信号量）

```python
import threading
import time

# 创建信号量（最多允许3个线程同时访问）
semaphore = threading.Semaphore(3)

def access_resource(name):
    """访问资源"""
    print(f"{name} 等待访问资源")
    with semaphore:
        print(f"{name} 获得访问权限")
        time.sleep(2)
        print(f"{name} 释放资源")

# 创建10个线程
threads = []
for i in range(10):
    t = threading.Thread(target=access_resource, args=(f"线程-{i}",))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

### 线程同步 - Event（事件）

```python
import threading
import time

event = threading.Event()

def waiter(name):
    """等待事件"""
    print(f"{name} 等待事件")
    event.wait()  # 阻塞，直到事件被设置
    print(f"{name} 收到事件，继续执行")

def setter():
    """设置事件"""
    time.sleep(3)
    print("设置事件")
    event.set()  # 设置事件

# 创建线程
t1 = threading.Thread(target=waiter, args=("线程-1",))
t2 = threading.Thread(target=waiter, args=("线程-2",))
t3 = threading.Thread(target=setter)

t1.start()
t2.start()
t3.start()

t1.join()
t2.join()
t3.join()
```

### 线程同步 - Condition（条件变量）

```python
import threading
import time

condition = threading.Condition()
items = []

def producer():
    """生产者"""
    for i in range(5):
        time.sleep(1)
        with condition:
            items.append(i)
            print(f"生产：{i}")
            condition.notify()  # 通知消费者

def consumer():
    """消费者"""
    while True:
        with condition:
            while not items:
                condition.wait()  # 等待通知
            item = items.pop(0)
            print(f"消费：{item}")
            if item == 4:
                break

# 创建线程
t1 = threading.Thread(target=producer)
t2 = threading.Thread(target=consumer)

t1.start()
t2.start()

t1.join()
t2.join()
```

### 线程池（ThreadPoolExecutor）

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def task(n):
    """任务函数"""
    print(f"任务 {n} 开始")
    time.sleep(1)
    return n * n

# 创建线程池
with ThreadPoolExecutor(max_workers=3) as executor:
    # 提交任务
    futures = [executor.submit(task, i) for i in range(5)]
    
    # 获取结果
    for future in as_completed(futures):
        result = future.result()
        print(f"结果：{result}")

# 使用 map 方法
with ThreadPoolExecutor(max_workers=3) as executor:
    results = executor.map(task, range(5))
    for result in results:
        print(f"结果：{result}")
```

### 线程本地数据

```python
import threading

# 创建线程本地数据
local_data = threading.local()

def worker(value):
    """工作线程"""
    local_data.value = value
    print(f"线程 {threading.current_thread().name}: {local_data.value}")

# 创建多个线程
threads = []
for i in range(3):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

## 多进程（Multiprocessing）

### 基础使用

```python
import multiprocessing
import time

def worker(name, delay):
    """工作进程"""
    print(f"进程 {name} 开始，PID: {multiprocessing.current_process().pid}")
    time.sleep(delay)
    print(f"进程 {name} 结束")

if __name__ == '__main__':
    # 创建进程
    p1 = multiprocessing.Process(target=worker, args=("A", 2))
    p2 = multiprocessing.Process(target=worker, args=("B", 1))
    
    # 启动进程
    p1.start()
    p2.start()
    
    # 等待进程结束
    p1.join()
    p2.join()
    
    print("所有进程执行完毕")
```

### 进程类

```python
import multiprocessing
import time

class MyProcess(multiprocessing.Process):
    """自定义进程类"""
    def __init__(self, name, delay):
        super().__init__()
        self.name = name
        self.delay = delay
    
    def run(self):
        """进程执行的方法"""
        print(f"进程 {self.name} 开始")
        time.sleep(self.delay)
        print(f"进程 {self.name} 结束")

if __name__ == '__main__':
    p1 = MyProcess("Process-1", 2)
    p2 = MyProcess("Process-2", 1)
    
    p1.start()
    p2.start()
    
    p1.join()
    p2.join()
```

### 进程间通信 - Queue（队列）

```python
import multiprocessing
import time

def producer(queue):
    """生产者进程"""
    for i in range(5):
        time.sleep(1)
        queue.put(i)
        print(f"生产：{i}")
    queue.put(None)  # 结束信号

def consumer(queue):
    """消费者进程"""
    while True:
        item = queue.get()
        if item is None:
            break
        print(f"消费：{item}")

if __name__ == '__main__':
    # 创建队列
    queue = multiprocessing.Queue()
    
    # 创建进程
    p1 = multiprocessing.Process(target=producer, args=(queue,))
    p2 = multiprocessing.Process(target=consumer, args=(queue,))
    
    p1.start()
    p2.start()
    
    p1.join()
    p2.join()
```

### 进程间通信 - Pipe（管道）

```python
import multiprocessing

def sender(conn):
    """发送者"""
    conn.send("Hello from sender")
    conn.close()

def receiver(conn):
    """接收者"""
    msg = conn.recv()
    print(f"收到消息：{msg}")
    conn.close()

if __name__ == '__main__':
    # 创建管道
    parent_conn, child_conn = multiprocessing.Pipe()
    
    # 创建进程
    p1 = multiprocessing.Process(target=sender, args=(parent_conn,))
    p2 = multiprocessing.Process(target=receiver, args=(child_conn,))
    
    p1.start()
    p2.start()
    
    p1.join()
    p2.join()
```

### 进程间通信 - Value 和 Array（共享内存）

```python
import multiprocessing

def worker(shared_value, shared_array):
    """工作进程"""
    shared_value.value += 1
    for i in range(len(shared_array)):
        shared_array[i] *= 2

if __name__ == '__main__':
    # 创建共享变量
    shared_value = multiprocessing.Value('i', 0)  # 'i' 表示整数
    shared_array = multiprocessing.Array('i', [1, 2, 3, 4, 5])
    
    # 创建进程
    processes = []
    for _ in range(5):
        p = multiprocessing.Process(target=worker, args=(shared_value, shared_array))
        processes.append(p)
        p.start()
    
    for p in processes:
        p.join()
    
    print(f"共享值：{shared_value.value}")
    print(f"共享数组：{list(shared_array)}")
```

### 进程同步 - Lock（锁）

```python
import multiprocessing

def worker(lock, shared_value):
    """工作进程"""
    for _ in range(10000):
        with lock:
            shared_value.value += 1

if __name__ == '__main__':
    lock = multiprocessing.Lock()
    shared_value = multiprocessing.Value('i', 0)
    
    processes = []
    for _ in range(5):
        p = multiprocessing.Process(target=worker, args=(lock, shared_value))
        processes.append(p)
        p.start()
    
    for p in processes:
        p.join()
    
    print(f"最终值：{shared_value.value}")
```

### 进程池（Pool）

```python
import multiprocessing
import time

def task(n):
    """任务函数"""
    print(f"任务 {n} 开始，PID: {multiprocessing.current_process().pid}")
    time.sleep(1)
    return n * n

if __name__ == '__main__':
    # 创建进程池
    with multiprocessing.Pool(processes=3) as pool:
        # 使用 map
        results = pool.map(task, range(5))
        print(f"结果：{results}")
        
        # 使用 apply_async
        async_results = [pool.apply_async(task, (i,)) for i in range(5)]
        for async_result in async_results:
            print(f"结果：{async_result.get()}")
```

### 进程池执行器（ProcessPoolExecutor）

```python
from concurrent.futures import ProcessPoolExecutor, as_completed
import time

def task(n):
    """任务函数"""
    print(f"任务 {n} 开始")
    time.sleep(1)
    return n * n

if __name__ == '__main__':
    # 创建进程池
    with ProcessPoolExecutor(max_workers=3) as executor:
        # 提交任务
        futures = [executor.submit(task, i) for i in range(5)]
        
        # 获取结果
        for future in as_completed(futures):
            result = future.result()
            print(f"结果：{result}")
```

## 异步编程（Asyncio）

### 基础使用

```python
import asyncio

async def task(name, delay):
    """异步任务"""
    print(f"任务 {name} 开始")
    await asyncio.sleep(delay)
    print(f"任务 {name} 结束")
    return f"任务 {name} 的结果"

async def main():
    """主函数"""
    # 并发执行多个任务
    results = await asyncio.gather(
        task("A", 2),
        task("B", 1),
        task("C", 3)
    )
    print(f"所有结果：{results}")

# 运行
asyncio.run(main())
```

### 创建任务

```python
import asyncio

async def task(name, delay):
    """异步任务"""
    print(f"任务 {name} 开始")
    await asyncio.sleep(delay)
    print(f"任务 {name} 结束")
    return name

async def main():
    """主函数"""
    # 创建任务
    task1 = asyncio.create_task(task("A", 2))
    task2 = asyncio.create_task(task("B", 1))
    
    # 等待任务完成
    result1 = await task1
    result2 = await task2
    
    print(f"结果：{result1}, {result2}")

asyncio.run(main())
```

### 异步上下文管理器

```python
import asyncio

class AsyncResource:
    """异步资源"""
    async def __aenter__(self):
        print("获取资源")
        await asyncio.sleep(1)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("释放资源")
        await asyncio.sleep(1)

async def main():
    async with AsyncResource() as resource:
        print("使用资源")

asyncio.run(main())
```

### 异步迭代器

```python
import asyncio

class AsyncCounter:
    """异步计数器"""
    def __init__(self, max_count):
        self.max_count = max_count
        self.count = 0
    
    def __aiter__(self):
        return self
    
    async def __anext__(self):
        if self.count >= self.max_count:
            raise StopAsyncIteration
        await asyncio.sleep(1)
        self.count += 1
        return self.count

async def main():
    async for num in AsyncCounter(5):
        print(f"计数：{num}")

asyncio.run(main())
```

### 异步队列

```python
import asyncio

async def producer(queue):
    """生产者"""
    for i in range(5):
        await asyncio.sleep(1)
        await queue.put(i)
        print(f"生产：{i}")
    await queue.put(None)

async def consumer(queue):
    """消费者"""
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"消费：{item}")
        queue.task_done()

async def main():
    queue = asyncio.Queue()
    
    # 并发执行生产者和消费者
    await asyncio.gather(
        producer(queue),
        consumer(queue)
    )

asyncio.run(main())
```

## GIL（全局解释器锁）

Python 的 GIL 限制了多线程的并行执行：

- **多线程**：适合 I/O 密集型任务（网络请求、文件读写）
- **多进程**：适合 CPU 密集型任务（计算、数据处理）
- **异步编程**：适合高并发 I/O 操作

### CPU 密集型任务示例

```python
import time
import threading
import multiprocessing

def cpu_bound_task(n):
    """CPU 密集型任务"""
    count = 0
    for i in range(n):
        count += i * i
    return count

def test_threading():
    """测试多线程"""
    start = time.time()
    threads = []
    for _ in range(4):
        t = threading.Thread(target=cpu_bound_task, args=(10000000,))
        threads.append(t)
        t.start()
    for t in threads:
        t.join()
    print(f"多线程耗时：{time.time() - start:.2f}秒")

def test_multiprocessing():
    """测试多进程"""
    start = time.time()
    processes = []
    for _ in range(4):
        p = multiprocessing.Process(target=cpu_bound_task, args=(10000000,))
        processes.append(p)
        p.start()
    for p in processes:
        p.join()
    print(f"多进程耗时：{time.time() - start:.2f}秒")

if __name__ == '__main__':
    test_threading()       # 较慢（受 GIL 限制）
    test_multiprocessing() # 较快（真正并行）
```

## 最佳实践

1. **选择合适的并发方式**
   - I/O 密集型：使用多线程或异步编程
   - CPU 密集型：使用多进程

2. **避免死锁**
   - 按固定顺序获取锁
   - 使用超时机制
   - 使用上下文管理器

3. **线程安全**
   - 使用锁保护共享资源
   - 使用线程安全的数据结构
   - 避免全局变量

4. **资源管理**
   - 使用上下文管理器
   - 及时关闭线程池和进程池
   - 避免创建过多线程/进程

5. **异常处理**
   - 捕获并处理线程/进程中的异常
   - 使用 try-finally 确保资源释放

## 参考资源

- [Python 官方文档 - threading](https://docs.python.org/zh-cn/3/library/threading.html)
- [Python 官方文档 - multiprocessing](https://docs.python.org/zh-cn/3/library/multiprocessing.html)
- [Python 官方文档 - asyncio](https://docs.python.org/zh-cn/3/library/asyncio.html)
