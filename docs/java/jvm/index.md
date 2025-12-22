# JVM (Java虚拟机)

## 简介

JVM (Java Virtual Machine) 是 Java 虚拟机的缩写，是 Java 程序运行的基础。它负责将 Java 字节码转换为机器码并执行。

### 特点

- **跨平台性** - 一次编译，到处运行
- **自动内存管理** - 垃圾回收机制
- **安全性** - 字节码验证
- **高性能** - JIT 即时编译

## JVM 架构

### 整体结构

```
┌─────────────────────────────────────┐
│         类加载子系统                  │
├─────────────────────────────────────┤
│                                     │
│         运行时数据区                  │
│  ┌──────────┬──────────┬─────────┐ │
│  │  方法区   │   堆     │  栈     │ │
│  └──────────┴──────────┴─────────┘ │
│                                     │
├─────────────────────────────────────┤
│         执行引擎                     │
│  ┌──────────┬──────────┐           │
│  │ 解释器   │ JIT编译器 │           │
│  └──────────┴──────────┘           │
├─────────────────────────────────────┤
│         本地方法接口                  │
└─────────────────────────────────────┘
```

## 类加载机制

### 类加载过程

1. **加载（Loading）** - 读取字节码文件
2. **验证（Verification）** - 验证字节码格式
3. **准备（Preparation）** - 分配内存并初始化默认值
4. **解析（Resolution）** - 符号引用转换为直接引用
5. **初始化（Initialization）** - 执行类构造器

### 类加载器

```java
// 启动类加载器（Bootstrap ClassLoader）
// 加载 JDK 核心类库，如 java.lang.*

// 扩展类加载器（Extension ClassLoader）
// 加载 JDK 扩展目录中的类库

// 应用程序类加载器（Application ClassLoader）
// 加载应用程序类路径下的类

// 自定义类加载器
public class MyClassLoader extends ClassLoader {
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] classData = loadClassData(name);
        if (classData == null) {
            throw new ClassNotFoundException();
        }
        return defineClass(name, classData, 0, classData.length);
    }
    
    private byte[] loadClassData(String name) {
        // 从文件或网络加载字节码
        return null;
    }
}
```

### 双亲委派模型

```
应用程序类加载器
        ↓ 委派
扩展类加载器
        ↓ 委派
启动类加载器
```

**工作原理：**
1. 类加载器收到类加载请求
2. 委派给父类加载器加载
3. 父类加载器无法加载时，子类加载器才尝试加载

**优点：**
- 避免类的重复加载
- 保护核心类库不被篡改

## 运行时数据区

### 程序计数器（PC Register）

- 线程私有
- 记录当前线程执行的字节码行号
- 唯一不会发生 OutOfMemoryError 的区域

### Java 虚拟机栈（JVM Stack）

```java
// 栈帧结构
┌─────────────────┐
│   局部变量表     │
├─────────────────┤
│   操作数栈       │
├─────────────────┤
│   动态链接       │
├─────────────────┤
│   返回地址       │
└─────────────────┘
```

- 线程私有
- 存储局部变量、操作数栈、方法返回值等
- 每个方法调用创建一个栈帧
- 可能抛出 StackOverflowError 和 OutOfMemoryError

### 本地方法栈（Native Method Stack）

- 线程私有
- 为 Native 方法服务
- 可能抛出 StackOverflowError 和 OutOfMemoryError

### 堆（Heap）

```java
// 堆内存结构（JDK 8之前）
┌─────────────────────────────────┐
│          新生代（Young）          │
│  ┌──────┬──────────┬──────────┐ │
│  │ Eden │ Survivor0│ Survivor1│ │
│  └──────┴──────────┴──────────┘ │
├─────────────────────────────────┤
│          老年代（Old）            │
└─────────────────────────────────┘

// JDK 8及以后，永久代被元空间替代
```

- 线程共享
- 存储对象实例和数组
- 垃圾回收的主要区域
- 可能抛出 OutOfMemoryError

**新生代（Young Generation）**
- Eden 区 - 新对象分配区域
- Survivor 区 - 存活对象区域（S0、S1）
- 比例默认 8:1:1

**老年代（Old Generation）**
- 存储长期存活的对象
- 大对象直接进入老年代

### 方法区（Method Area）

- 线程共享
- 存储类信息、常量、静态变量、JIT 编译后的代码
- JDK 8 之前称为永久代（PermGen）
- JDK 8 及以后使用元空间（Metaspace）

**运行时常量池**
- 存储编译期生成的字面量和符号引用
- String.intern() 方法可以将字符串放入常量池

```java
String s1 = "hello";
String s2 = "hello";
System.out.println(s1 == s2); // true，指向常量池同一对象

String s3 = new String("hello");
String s4 = new String("hello");
System.out.println(s3 == s4); // false，不同对象

String s5 = s3.intern();
System.out.println(s1 == s5); // true，intern返回常量池引用
```

## 垃圾回收（GC）

### 判断对象是否存活

**引用计数法**
- 给对象添加引用计数器
- 引用加1，失效减1
- 计数为0时回收
- 无法解决循环引用问题

**可达性分析算法**
- 从 GC Roots 开始向下搜索
- 不可达的对象可以被回收

**GC Roots 包括：**
- 虚拟机栈中引用的对象
- 方法区中静态属性引用的对象
- 方法区中常量引用的对象
- 本地方法栈中引用的对象

### 引用类型

```java
// 强引用（Strong Reference）
Object obj = new Object();

// 软引用（Soft Reference）
SoftReference<Object> soft = new SoftReference<>(new Object());
// 内存不足时回收

// 弱引用（Weak Reference）
WeakReference<Object> weak = new WeakReference<>(new Object());
// GC时回收

// 虚引用（Phantom Reference）
ReferenceQueue<Object> queue = new ReferenceQueue<>();
PhantomReference<Object> phantom = new PhantomReference<>(new Object(), queue);
// 无法通过虚引用获取对象，用于跟踪对象回收
```

### 垃圾回收算法

**标记-清除算法（Mark-Sweep）**
- 标记所有需要回收的对象
- 统一回收被标记的对象
- 缺点：产生内存碎片

**标记-复制算法（Mark-Copy）**
- 将内存分为两块
- 将存活对象复制到另一块
- 清空原内存块
- 优点：无内存碎片
- 缺点：浪费一半内存

**标记-整理算法（Mark-Compact）**
- 标记存活对象
- 将存活对象移动到一端
- 清理边界外的内存
- 优点：无内存碎片，不浪费内存

**分代收集算法**
- 新生代使用复制算法
- 老年代使用标记-清除或标记-整理算法

### 垃圾回收器

**Serial 收集器**
- 单线程收集器
- 简单高效
- 适合单核 CPU

**ParNew 收集器**
- Serial 的多线程版本
- 适合多核 CPU

**Parallel Scavenge 收集器**
- 多线程收集器
- 关注吞吐量
- 适合后台计算任务

**CMS 收集器（Concurrent Mark Sweep）**
```
初始标记（STW）
    ↓
并发标记
    ↓
重新标记（STW）
    ↓
并发清除
```
- 以获取最短停顿时间为目标
- 并发收集，低停顿
- 缺点：产生内存碎片

**G1 收集器（Garbage First）**
- 面向服务端应用
- 将堆分为多个 Region
- 可预测的停顿时间
- JDK 9 默认收集器

**ZGC 收集器**
- 低延迟垃圾收集器
- 停顿时间不超过 10ms
- 适合大内存应用

### GC 日志分析

```bash
# 开启 GC 日志
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
-Xloggc:gc.log

# GC 日志示例
[GC (Allocation Failure) [PSYoungGen: 2048K->512K(2560K)] 2048K->520K(9728K), 0.0012345 secs]
```

## JVM 参数配置

### 堆内存配置

```bash
# 初始堆大小
-Xms512m

# 最大堆大小
-Xmx2g

# 新生代大小
-Xmn256m

# 新生代与老年代比例
-XX:NewRatio=2

# Eden与Survivor比例
-XX:SurvivorRatio=8
```

### 栈内存配置

```bash
# 线程栈大小
-Xss256k
```

### 元空间配置

```bash
# 初始元空间大小
-XX:MetaspaceSize=128m

# 最大元空间大小
-XX:MaxMetaspaceSize=256m
```

### 垃圾回收器配置

```bash
# 使用 Serial 收集器
-XX:+UseSerialGC

# 使用 ParNew 收集器
-XX:+UseParNewGC

# 使用 Parallel Scavenge 收集器
-XX:+UseParallelGC

# 使用 CMS 收集器
-XX:+UseConcMarkSweepGC

# 使用 G1 收集器
-XX:+UseG1GC

# 使用 ZGC 收集器
-XX:+UseZGC
```

### GC 调优参数

```bash
# 设置 GC 停顿时间目标
-XX:MaxGCPauseMillis=200

# 设置吞吐量目标
-XX:GCTimeRatio=99

# 老年代对象年龄阈值
-XX:MaxTenuringThreshold=15

# 大对象阈值
-XX:PretenureSizeThreshold=1m
```

## JVM 性能监控

### 命令行工具

**jps - 查看 Java 进程**
```bash
jps -l  # 显示完整类名
jps -v  # 显示 JVM 参数
```

**jstat - 查看 JVM 统计信息**
```bash
jstat -gc pid 1000 10  # 每秒输出 GC 信息，共10次
jstat -gcutil pid      # GC 统计汇总
```

**jinfo - 查看和修改 JVM 参数**
```bash
jinfo -flags pid       # 查看 JVM 参数
jinfo -flag MaxHeapSize pid  # 查看特定参数
```

**jmap - 生成堆转储快照**
```bash
jmap -heap pid         # 查看堆信息
jmap -dump:format=b,file=heap.hprof pid  # 生成堆转储文件
```

**jhat - 分析堆转储文件**
```bash
jhat heap.hprof        # 启动 Web 服务器分析堆
```

**jstack - 生成线程快照**
```bash
jstack pid             # 查看线程堆栈
jstack -l pid          # 查看锁信息
```

### 可视化工具

**JConsole**
- JDK 自带的监控工具
- 监控内存、线程、类加载等

**VisualVM**
- 功能强大的性能分析工具
- 支持插件扩展

**JProfiler**
- 商业性能分析工具
- 功能全面

**Arthas**
- 阿里开源的 Java 诊断工具
- 在线诊断，无需重启

```bash
# 启动 Arthas
java -jar arthas-boot.jar

# 常用命令
dashboard  # 查看系统实时数据
thread     # 查看线程信息
jvm        # 查看 JVM 信息
memory     # 查看内存信息
```

## 性能调优

### 内存溢出排查

**堆内存溢出（OutOfMemoryError: Java heap space）**
```bash
# 生成堆转储文件
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/path/to/dump

# 分析步骤
1. 使用 jmap 生成堆转储
2. 使用 MAT 或 VisualVM 分析
3. 找出占用内存最多的对象
4. 检查是否有内存泄漏
```

**栈溢出（StackOverflowError）**
- 检查是否有无限递归
- 增加栈大小 -Xss

**元空间溢出（OutOfMemoryError: Metaspace）**
- 增加元空间大小
- 检查是否有类加载泄漏

### GC 调优

**调优目标**
- 降低 GC 频率
- 减少 GC 停顿时间
- 提高吞吐量

**调优步骤**
1. 分析 GC 日志
2. 确定调优目标
3. 调整堆大小
4. 选择合适的垃圾回收器
5. 调整 GC 参数
6. 测试验证

**常见问题**
- Full GC 频繁 - 增加老年代大小
- Minor GC 频繁 - 增加新生代大小
- GC 停顿时间长 - 使用 CMS 或 G1

## 最佳实践

1. **合理设置堆大小** - 根据应用需求设置
2. **选择合适的垃圾回收器** - 根据应用特点选择
3. **监控 JVM 性能** - 定期检查 GC 日志
4. **避免内存泄漏** - 及时释放不用的对象
5. **使用对象池** - 减少对象创建
6. **避免大对象** - 大对象直接进入老年代
7. **合理使用缓存** - 避免缓存过大导致 OOM

## 总结

JVM 是 Java 程序运行的基础：

- ✅ 类加载机制 - 双亲委派模型
- ✅ 内存模型 - 堆、栈、方法区
- ✅ 垃圾回收 - 自动内存管理
- ✅ 性能监控 - 丰富的监控工具
- ✅ 性能调优 - 灵活的参数配置

深入理解 JVM 是 Java 开发者进阶的必经之路。

## 参考资源

- [深入理解Java虚拟机](https://book.douban.com/subject/34907497/)
- [Java性能优化权威指南](https://book.douban.com/subject/25828043/)
- [JVM规范](https://docs.oracle.com/javase/specs/jvms/se8/html/)
