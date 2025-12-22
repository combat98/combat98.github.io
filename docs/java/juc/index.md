# JUC (Java并发工具包)

## 简介

JUC 是 java.util.concurrent 包的简称，是 Java 提供的并发编程工具包，包含了大量用于并发编程的工具类和接口。

### 核心内容

- **线程池** - ExecutorService、ThreadPoolExecutor
- **锁** - Lock、ReentrantLock、ReadWriteLock
- **原子类** - Atomic*系列
- **并发集合** - ConcurrentHashMap、CopyOnWriteArrayList
- **同步工具** - CountDownLatch、CyclicBarrier、Semaphore

## 线程基础

### 创建线程

```java
// 方式1：继承Thread类
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("线程执行");
    }
}

// 使用
MyThread thread = new MyThread();
thread.start();

// 方式2：实现Runnable接口
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("线程执行");
    }
}

// 使用
Thread thread = new Thread(new MyRunnable());
thread.start();

// 方式3：实现Callable接口
class MyCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        return "执行结果";
    }
}

// 使用
FutureTask<String> task = new FutureTask<>(new MyCallable());
Thread thread = new Thread(task);
thread.start();
String result = task.get(); // 获取返回值

// 方式4：Lambda表达式
new Thread(() -> {
    System.out.println("线程执行");
}).start();
```

### 线程状态

- **NEW** - 新建状态
- **RUNNABLE** - 可运行状态
- **BLOCKED** - 阻塞状态
- **WAITING** - 等待状态
- **TIMED_WAITING** - 超时等待状态
- **TERMINATED** - 终止状态

## 线程池

### ThreadPoolExecutor

```java
// 创建线程池
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    5,                      // 核心线程数
    10,                     // 最大线程数
    60L,                    // 空闲线程存活时间
    TimeUnit.SECONDS,       // 时间单位
    new LinkedBlockingQueue<>(100),  // 工作队列
    Executors.defaultThreadFactory(), // 线程工厂
    new ThreadPoolExecutor.AbortPolicy() // 拒绝策略
);

// 提交任务
executor.execute(() -> {
    System.out.println("执行任务");
});

// 提交有返回值的任务
Future<String> future = executor.submit(() -> {
    return "任务结果";
});
String result = future.get();

// 关闭线程池
executor.shutdown();
```

### Executors工具类

```java
// 固定大小线程池
ExecutorService fixedPool = Executors.newFixedThreadPool(5);

// 单线程线程池
ExecutorService singlePool = Executors.newSingleThreadExecutor();

// 缓存线程池
ExecutorService cachedPool = Executors.newCachedThreadPool();

// 定时任务线程池
ScheduledExecutorService scheduledPool = Executors.newScheduledThreadPool(5);

// 延迟执行
scheduledPool.schedule(() -> {
    System.out.println("延迟执行");
}, 5, TimeUnit.SECONDS);

// 周期执行
scheduledPool.scheduleAtFixedRate(() -> {
    System.out.println("周期执行");
}, 0, 1, TimeUnit.SECONDS);
```

### 线程池参数

**核心线程数（corePoolSize）**
- 线程池中始终保持的线程数量

**最大线程数（maximumPoolSize）**
- 线程池允许创建的最大线程数

**存活时间（keepAliveTime）**
- 非核心线程空闲时的存活时间

**工作队列（workQueue）**
- ArrayBlockingQueue - 有界队列
- LinkedBlockingQueue - 无界队列
- SynchronousQueue - 同步队列
- PriorityBlockingQueue - 优先级队列

**拒绝策略（handler）**
- AbortPolicy - 抛出异常（默认）
- CallerRunsPolicy - 调用者执行
- DiscardPolicy - 丢弃任务
- DiscardOldestPolicy - 丢弃最老任务

## Lock锁

### ReentrantLock

```java
public class Counter {
    private int count = 0;
    private final Lock lock = new ReentrantLock();
    
    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }
    
    // 尝试获取锁
    public void tryIncrement() {
        if (lock.tryLock()) {
            try {
                count++;
            } finally {
                lock.unlock();
            }
        }
    }
    
    // 超时获取锁
    public void timeoutIncrement() throws InterruptedException {
        if (lock.tryLock(1, TimeUnit.SECONDS)) {
            try {
                count++;
            } finally {
                lock.unlock();
            }
        }
    }
}
```

### ReadWriteLock

```java
public class Cache {
    private final Map<String, Object> map = new HashMap<>();
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();
    
    // 读操作
    public Object get(String key) {
        readLock.lock();
        try {
            return map.get(key);
        } finally {
            readLock.unlock();
        }
    }
    
    // 写操作
    public void put(String key, Object value) {
        writeLock.lock();
        try {
            map.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }
}
```

### Condition

```java
public class BoundedBuffer {
    private final Lock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();
    private final Object[] items = new Object[100];
    private int putIndex, takeIndex, count;
    
    public void put(Object x) throws InterruptedException {
        lock.lock();
        try {
            while (count == items.length) {
                notFull.await(); // 队列满，等待
            }
            items[putIndex] = x;
            if (++putIndex == items.length) putIndex = 0;
            count++;
            notEmpty.signal(); // 通知消费者
        } finally {
            lock.unlock();
        }
    }
    
    public Object take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0) {
                notEmpty.await(); // 队列空，等待
            }
            Object x = items[takeIndex];
            if (++takeIndex == items.length) takeIndex = 0;
            count--;
            notFull.signal(); // 通知生产者
            return x;
        } finally {
            lock.unlock();
        }
    }
}
```

## 原子类

### 基本类型原子类

```java
// AtomicInteger
AtomicInteger atomicInt = new AtomicInteger(0);

// 自增
int result = atomicInt.incrementAndGet(); // ++i
int result2 = atomicInt.getAndIncrement(); // i++

// 自减
int result3 = atomicInt.decrementAndGet(); // --i
int result4 = atomicInt.getAndDecrement(); // i--

// 加法
int result5 = atomicInt.addAndGet(5);
int result6 = atomicInt.getAndAdd(5);

// CAS操作
boolean success = atomicInt.compareAndSet(0, 1);

// AtomicLong
AtomicLong atomicLong = new AtomicLong(0L);

// AtomicBoolean
AtomicBoolean atomicBoolean = new AtomicBoolean(false);
```

### 数组类型原子类

```java
// AtomicIntegerArray
AtomicIntegerArray array = new AtomicIntegerArray(10);

// 设置值
array.set(0, 100);

// 获取值
int value = array.get(0);

// 自增
array.incrementAndGet(0);

// CAS操作
array.compareAndSet(0, 100, 200);
```

### 引用类型原子类

```java
// AtomicReference
class User {
    String name;
    int age;
}

AtomicReference<User> atomicUser = new AtomicReference<>();
User user = new User();
atomicUser.set(user);

// CAS更新
User newUser = new User();
atomicUser.compareAndSet(user, newUser);

// AtomicStampedReference - 解决ABA问题
AtomicStampedReference<Integer> atomicStamped = 
    new AtomicStampedReference<>(100, 0);

int stamp = atomicStamped.getStamp();
atomicStamped.compareAndSet(100, 200, stamp, stamp + 1);
```

## 并发集合

### ConcurrentHashMap

```java
// 创建
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// 基本操作
map.put("key1", 1);
Integer value = map.get("key1");
map.remove("key1");

// 原子操作
map.putIfAbsent("key2", 2);
map.computeIfAbsent("key3", k -> 3);
map.computeIfPresent("key3", (k, v) -> v + 1);

// 合并操作
map.merge("key4", 1, (oldValue, newValue) -> oldValue + newValue);
```

### CopyOnWriteArrayList

```java
// 创建
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();

// 添加元素
list.add("item1");
list.add("item2");

// 遍历（不会抛出ConcurrentModificationException）
for (String item : list) {
    System.out.println(item);
}

// 适用场景：读多写少
```

### BlockingQueue

```java
// ArrayBlockingQueue
BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

// 生产者
new Thread(() -> {
    try {
        queue.put("item"); // 队列满时阻塞
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();

// 消费者
new Thread(() -> {
    try {
        String item = queue.take(); // 队列空时阻塞
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();

// LinkedBlockingQueue
BlockingQueue<String> linkedQueue = new LinkedBlockingQueue<>();

// PriorityBlockingQueue
BlockingQueue<Integer> priorityQueue = new PriorityBlockingQueue<>();
```

## 同步工具

### CountDownLatch

```java
// 等待多个线程完成
CountDownLatch latch = new CountDownLatch(3);

// 工作线程
for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        System.out.println("线程执行");
        latch.countDown(); // 计数减1
    }).start();
}

// 主线程等待
latch.await(); // 等待计数为0
System.out.println("所有线程完成");
```

### CyclicBarrier

```java
// 等待所有线程到达屏障点
CyclicBarrier barrier = new CyclicBarrier(3, () -> {
    System.out.println("所有线程到达屏障");
});

for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        try {
            System.out.println("线程到达屏障");
            barrier.await(); // 等待其他线程
            System.out.println("继续执行");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }).start();
}
```

### Semaphore

```java
// 信号量，控制并发数
Semaphore semaphore = new Semaphore(3); // 允许3个线程同时访问

for (int i = 0; i < 10; i++) {
    new Thread(() -> {
        try {
            semaphore.acquire(); // 获取许可
            System.out.println("执行任务");
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            semaphore.release(); // 释放许可
        }
    }).start();
}
```

### Exchanger

```java
// 两个线程交换数据
Exchanger<String> exchanger = new Exchanger<>();

new Thread(() -> {
    try {
        String data = "线程1的数据";
        String received = exchanger.exchange(data);
        System.out.println("线程1收到: " + received);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();

new Thread(() -> {
    try {
        String data = "线程2的数据";
        String received = exchanger.exchange(data);
        System.out.println("线程2收到: " + received);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();
```

## CompletableFuture

### 异步编程

```java
// 异步执行
CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
    System.out.println("异步执行");
});

// 异步执行并返回结果
CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> {
    return "结果";
});

// 获取结果
String result = future2.get();

// 链式调用
CompletableFuture.supplyAsync(() -> "Hello")
    .thenApply(s -> s + " World")
    .thenApply(String::toUpperCase)
    .thenAccept(System.out::println);

// 组合多个Future
CompletableFuture<String> future3 = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> future4 = CompletableFuture.supplyAsync(() -> "World");

CompletableFuture<String> combined = future3.thenCombine(future4, (s1, s2) -> s1 + " " + s2);

// 等待所有完成
CompletableFuture<Void> allOf = CompletableFuture.allOf(future3, future4);
allOf.join();

// 等待任意一个完成
CompletableFuture<Object> anyOf = CompletableFuture.anyOf(future3, future4);
```

## 最佳实践

1. **优先使用线程池** - 避免频繁创建销毁线程
2. **合理设置线程池参数** - 根据任务类型调整参数
3. **使用Lock替代synchronized** - 更灵活的锁机制
4. **使用原子类** - 避免使用synchronized
5. **使用并发集合** - 替代同步集合
6. **避免死锁** - 注意锁的顺序
7. **使用CompletableFuture** - 简化异步编程

## 常见问题

### 线程池大小设置

```java
// CPU密集型任务
int cpuCount = Runtime.getRuntime().availableProcessors();
int corePoolSize = cpuCount + 1;

// IO密集型任务
int corePoolSize = cpuCount * 2;
```

### 避免死锁

```java
// 按固定顺序获取锁
public void transfer(Account from, Account to, int amount) {
    Account first = from.getId() < to.getId() ? from : to;
    Account second = from.getId() < to.getId() ? to : from;
    
    synchronized (first) {
        synchronized (second) {
            from.debit(amount);
            to.credit(amount);
        }
    }
}
```

## 总结

JUC 提供了丰富的并发编程工具：

- ✅ 线程池 - 管理线程资源
- ✅ Lock锁 - 灵活的锁机制
- ✅ 原子类 - 无锁并发
- ✅ 并发集合 - 线程安全的集合
- ✅ 同步工具 - 线程协作

掌握 JUC 是 Java 并发编程的基础。

## 参考资源

- [Java并发编程实战](https://book.douban.com/subject/10484692/)
- [Java并发编程的艺术](https://book.douban.com/subject/26591326/)
- [JUC官方文档](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html)
