# Java

## Java简介
Java是一种广泛使用的计算机编程语言，由Sun Microsystems（后来被Oracle收购）在1995年推出。它被设计为一种通用的、面向对象的编程语言，具有跨平台性和可移植性。

### 特点
* 简单易学：Java采用类似于C++的语法，但它去除了一些容易导致错误的复杂特性，使得它更加简单易学。
* 面向对象编程：Java是一种完全面向对象编程语言，这意味着所有的程序元素都是对象，通过对象之间的交互实现程序的逻辑。
* 跨平台性：Java程序在不同平台上可以运行，这是因为Java程序通过JVM（Java虚拟机）来运行，JVM能够在不同平台上执行相同的Java代码。
* 安全性：Java是一种安全性较高的编程语言，因为它具有内置的安全机制，如内存管理、异常处理和访问控制。
* 高性能：尽管Java是一种解释型语言，但它可以通过JIT（即时编译）技术提高性能。
* 多线程支持：Java提供了内置的多线程支持，使得程序员可以很方便地编写多线程程序。
* 开源免费：Java是一种开源免费的编程语言，可以通过许多渠道获得它的开发工具和运行环境。

### Java语言跨平台的原理
* 操作系统本身其实是不认识Java语言的。
* 但是针对于不同的操作系统，Java提供了不同的虚拟机。
![img.png](img/img.png)
![img_1.png](img/img_1.png)

### Java能做什么
* Web 应用开发：Java 提供了丰富的 Web 开发框架，如 Spring、SpringMVC 和 Mybatis，使得开发高性能和可扩展的 Web 应用变得更加容易。
* 移动应用开发：Java 是 Android 应用开发的主要语言。开发者使用 Java 及其相关工具开发各种类型的 Android 应用。
* 桌面应用开发：使用 Java 的 Swing、JavaFX 等库，可以开发跨平台的桌面应用程序。
* 大数据处理：Java 在大数据领域也有重要地位。Hadoop 等大数据处理框架就是用 Java 编写的。
* 嵌入式系统开发：Java 在嵌入式系统中的应用也很广泛，比如智能卡、嵌入式设备等。
* 分布式系统：Java 提供了强大的网络编程能力和分布式计算支持，可以用来开发分布式系统和微服务架构。
* 游戏开发：尽管 Java 不是最流行的游戏开发语言，但一些 2D 和 3D 游戏也用 Java 开发，尤其是使用 libGDX 等游戏开发框架。
* 科学计算：Java 也用于科学计算和研究领域，利用其强大的性能和稳定性。
* 云计算：Java 是许多云计算平台的基础，提供了开发云端应用和服务的支持。

## Java环境配置

### 下载JDK
[JDK8](https://www.oracle.com/java/technologies/downloads/?er=221886#java8)
[JDK17](https://www.oracle.com/java/technologies/downloads/#java17)
[JDK21](https://www.oracle.com/java/technologies/downloads/#java21)

### 配置环境变量

#### JAVA_HOME
变量值：`C:\Program Files\Java\jdk1.8.0_91`  // 根据自己的实际路径配置

#### CLASSPATH
变量值：`.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;`  // 注意前面有个"."

#### Path
变量值：`%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;`

### 测试JDK是否安装成功

```bash
java -version
javac -version
```

## 基础语法

### 数据类型

Java 数据类型分为基本数据类型和引用数据类型。

#### 基本数据类型

| 类型 | 大小 | 范围 | 默认值 |
|------|------|------|--------|
| byte | 1字节 | -128 ~ 127 | 0 |
| short | 2字节 | -32768 ~ 32767 | 0 |
| int | 4字节 | -2^31 ~ 2^31-1 | 0 |
| long | 8字节 | -2^63 ~ 2^63-1 | 0L |
| float | 4字节 | 约±3.4E38 | 0.0f |
| double | 8字节 | 约±1.8E308 | 0.0d |
| char | 2字节 | 0 ~ 65535 | '\u0000' |
| boolean | 1位 | true/false | false |

```java
// 基本数据类型示例
byte b = 100;
short s = 1000;
int i = 100000;
long l = 100000L;
float f = 3.14f;
double d = 3.14159;
char c = 'A';
boolean flag = true;
```

#### 类型转换

```java
// 自动类型转换（小转大）
int num = 100;
long bigNum = num;

// 强制类型转换（大转小）
double d = 3.14;
int i = (int) d;  // 结果为 3
```

### 运算符

```java
// 算术运算符
int a = 10, b = 3;
System.out.println(a + b);  // 13
System.out.println(a - b);  // 7
System.out.println(a * b);  // 30
System.out.println(a / b);  // 3
System.out.println(a % b);  // 1

// 关系运算符
System.out.println(a > b);   // true
System.out.println(a == b);  // false

// 逻辑运算符
boolean x = true, y = false;
System.out.println(x && y);  // false
System.out.println(x || y);  // true
System.out.println(!x);      // false

// 三元运算符
int max = (a > b) ? a : b;
```

### 流程控制

#### 条件语句

```java
// if-else
int score = 85;
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}

// switch
int day = 1;
switch (day) {
    case 1:
        System.out.println("星期一");
        break;
    case 2:
        System.out.println("星期二");
        break;
    default:
        System.out.println("其他");
}

// switch 表达式（Java 14+）
String result = switch (day) {
    case 1 -> "星期一";
    case 2 -> "星期二";
    default -> "其他";
};
```

#### 循环语句

```java
// for 循环
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// while 循环
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// do-while 循环
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 5);

// 增强 for 循环
int[] arr = {1, 2, 3, 4, 5};
for (int num : arr) {
    System.out.println(num);
}
```

#### 跳转语句

```java
// break：跳出循环
for (int i = 0; i < 10; i++) {
    if (i == 5) break;
    System.out.println(i);
}

// continue：跳过本次循环
for (int i = 0; i < 10; i++) {
    if (i == 5) continue;
    System.out.println(i);
}
```

### 数组

#### 一维数组

```java
// 声明和初始化
int[] arr1 = new int[5];
int[] arr2 = {1, 2, 3, 4, 5};
int[] arr3 = new int[]{1, 2, 3, 4, 5};

// 访问元素
arr1[0] = 10;
System.out.println(arr2[0]);

// 遍历数组
for (int i = 0; i < arr2.length; i++) {
    System.out.println(arr2[i]);
}

// 增强 for 循环
for (int num : arr2) {
    System.out.println(num);
}
```

#### 二维数组

```java
// 声明和初始化
int[][] matrix = new int[3][4];
int[][] matrix2 = {{1, 2}, {3, 4}, {5, 6}};

// 遍历
for (int i = 0; i < matrix2.length; i++) {
    for (int j = 0; j < matrix2[i].length; j++) {
        System.out.print(matrix2[i][j] + " ");
    }
    System.out.println();
}
```

#### Arrays 工具类

```java
import java.util.Arrays;

int[] arr = {3, 1, 4, 1, 5, 9};

// 排序
Arrays.sort(arr);

// 二分查找
int index = Arrays.binarySearch(arr, 4);

// 填充
Arrays.fill(arr, 0);

// 复制
int[] copy = Arrays.copyOf(arr, 10);

// 转字符串
System.out.println(Arrays.toString(arr));

// 比较
boolean equal = Arrays.equals(arr, copy);
```

## 常用类

### String

String 是不可变的字符序列。

```java
// 创建字符串
String s1 = "Hello";
String s2 = new String("Hello");

// 常用方法
s1.length();              // 长度
s1.charAt(0);             // 获取字符
s1.substring(1, 3);       // 截取子串
s1.indexOf("l");          // 查找位置
s1.contains("ell");       // 是否包含
s1.startsWith("He");      // 是否以...开头
s1.endsWith("lo");        // 是否以...结尾
s1.toUpperCase();         // 转大写
s1.toLowerCase();         // 转小写
s1.trim();                // 去除首尾空格
s1.replace("l", "L");     // 替换
s1.split(",");            // 分割
s1.equals(s2);            // 比较内容
s1.equalsIgnoreCase(s2);  // 忽略大小写比较

// 字符串拼接
String s3 = s1 + " World";
String s4 = s1.concat(" World");
```

### StringBuilder 和 StringBuffer

```java
// StringBuilder（线程不安全，效率高）
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" World");
sb.insert(5, ",");
sb.delete(5, 6);
sb.reverse();
String result = sb.toString();

// StringBuffer（线程安全）
StringBuffer sbf = new StringBuffer();
sbf.append("Hello");
```

### 日期时间

#### Date 和 SimpleDateFormat

```java
import java.util.Date;
import java.text.SimpleDateFormat;

// 当前时间
Date now = new Date();

// 格式化
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
String str = sdf.format(now);

// 解析
Date date = sdf.parse("2024-01-01 12:00:00");
```

#### Java 8 新日期时间 API

```java
import java.time.*;
import java.time.format.DateTimeFormatter;

// LocalDate - 日期
LocalDate today = LocalDate.now();
LocalDate date = LocalDate.of(2024, 1, 1);

// LocalTime - 时间
LocalTime time = LocalTime.now();
LocalTime t = LocalTime.of(12, 30, 0);

// LocalDateTime - 日期时间
LocalDateTime dateTime = LocalDateTime.now();
LocalDateTime dt = LocalDateTime.of(2024, 1, 1, 12, 30, 0);

// 格式化
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String str = dateTime.format(formatter);
LocalDateTime parsed = LocalDateTime.parse("2024-01-01 12:00:00", formatter);

// 日期计算
LocalDate tomorrow = today.plusDays(1);
LocalDate lastMonth = today.minusMonths(1);

// Duration - 时间间隔
Duration duration = Duration.between(time, LocalTime.now());

// Period - 日期间隔
Period period = Period.between(date, today);
```

### 包装类

```java
// 自动装箱
Integer i = 100;

// 自动拆箱
int n = i;

// 字符串转数字
int num = Integer.parseInt("123");
double d = Double.parseDouble("3.14");

// 数字转字符串
String s = String.valueOf(100);
String s2 = Integer.toString(100);
```

### Math 类

```java
Math.abs(-10);       // 绝对值：10
Math.max(10, 20);    // 最大值：20
Math.min(10, 20);    // 最小值：10
Math.pow(2, 3);      // 幂运算：8.0
Math.sqrt(16);       // 平方根：4.0
Math.ceil(3.2);      // 向上取整：4.0
Math.floor(3.8);     // 向下取整：3.0
Math.round(3.5);     // 四舍五入：4
Math.random();       // 随机数：[0, 1)
```

## 集合类

### Collection 体系

```
Collection
├── List（有序、可重复）
│   ├── ArrayList
│   ├── LinkedList
│   └── Vector
└── Set（无序、不可重复）
    ├── HashSet
    ├── LinkedHashSet
    └── TreeSet
```

### List

```java
import java.util.*;

// ArrayList
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add(1, "C");      // 指定位置插入
list.get(0);           // 获取元素
list.set(0, "D");      // 修改元素
list.remove(0);        // 删除元素
list.size();           // 大小
list.contains("A");    // 是否包含
list.indexOf("A");     // 查找位置
list.isEmpty();        // 是否为空
list.clear();          // 清空

// 遍历
for (String s : list) {
    System.out.println(s);
}

list.forEach(System.out::println);

// LinkedList
LinkedList<String> linkedList = new LinkedList<>();
linkedList.addFirst("A");
linkedList.addLast("B");
linkedList.getFirst();
linkedList.getLast();
linkedList.removeFirst();
linkedList.removeLast();
```

### Set

```java
// HashSet（无序）
Set<String> hashSet = new HashSet<>();
hashSet.add("A");
hashSet.add("B");
hashSet.add("A");  // 重复元素不会添加

// LinkedHashSet（保持插入顺序）
Set<String> linkedHashSet = new LinkedHashSet<>();

// TreeSet（自然排序）
Set<String> treeSet = new TreeSet<>();
```

### Map

```java
import java.util.*;

// HashMap
Map<String, Integer> map = new HashMap<>();
map.put("A", 1);
map.put("B", 2);
map.get("A");              // 获取值
map.getOrDefault("C", 0);  // 获取值，不存在返回默认值
map.containsKey("A");      // 是否包含键
map.containsValue(1);      // 是否包含值
map.remove("A");           // 删除
map.size();                // 大小
map.keySet();              // 所有键
map.values();              // 所有值
map.entrySet();            // 所有键值对

// 遍历
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

map.forEach((k, v) -> System.out.println(k + ": " + v));

// LinkedHashMap（保持插入顺序）
Map<String, Integer> linkedHashMap = new LinkedHashMap<>();

// TreeMap（按键排序）
Map<String, Integer> treeMap = new TreeMap<>();
```

### Collections 工具类

```java
List<Integer> list = new ArrayList<>(Arrays.asList(3, 1, 4, 1, 5));

Collections.sort(list);              // 排序
Collections.reverse(list);           // 反转
Collections.shuffle(list);           // 打乱
Collections.max(list);               // 最大值
Collections.min(list);               // 最小值
Collections.binarySearch(list, 3);   // 二分查找
Collections.fill(list, 0);           // 填充
Collections.copy(dest, src);         // 复制
```

## 泛型

### 泛型类

```java
public class Box<T> {
    private T content;
    
    public void set(T content) {
        this.content = content;
    }
    
    public T get() {
        return content;
    }
}

// 使用
Box<String> stringBox = new Box<>();
stringBox.set("Hello");
String s = stringBox.get();
```

### 泛型方法

```java
public class Utils {
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.println(element);
        }
    }
}

// 使用
Integer[] intArray = {1, 2, 3};
Utils.printArray(intArray);
```

### 泛型接口

```java
public interface Generator<T> {
    T generate();
}

public class StringGenerator implements Generator<String> {
    @Override
    public String generate() {
        return "Hello";
    }
}
```

### 通配符

```java
// 无界通配符
public void printList(List<?> list) {
    for (Object obj : list) {
        System.out.println(obj);
    }
}

// 上界通配符（只读）
public double sum(List<? extends Number> list) {
    double sum = 0;
    for (Number num : list) {
        sum += num.doubleValue();
    }
    return sum;
}

// 下界通配符（只写）
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
}
```

## 注解

### 内置注解

```java
@Override           // 重写方法
@Deprecated         // 已过时
@SuppressWarnings   // 抑制警告
@FunctionalInterface // 函数式接口
```

### 自定义注解

```java
import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    String value() default "";
    int count() default 0;
}

// 使用
public class Demo {
    @MyAnnotation(value = "test", count = 1)
    public void test() {}
}
```

### 元注解

| 注解 | 说明 |
|------|------|
| @Target | 注解作用目标 |
| @Retention | 注解保留策略 |
| @Documented | 包含在 Javadoc 中 |
| @Inherited | 可被继承 |

## 异常

### 异常体系

```
Throwable
├── Error（错误，不可处理）
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception（异常）
    ├── RuntimeException（运行时异常，非受检）
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   └── ClassCastException
    └── 其他异常（受检异常）
        ├── IOException
        └── SQLException
```

### 异常处理

```java
// try-catch-finally
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("除数不能为0");
} catch (Exception e) {
    e.printStackTrace();
} finally {
    System.out.println("总会执行");
}

// try-with-resources（自动关闭资源）
try (FileInputStream fis = new FileInputStream("file.txt")) {
    // 读取文件
} catch (IOException e) {
    e.printStackTrace();
}
```

### 抛出异常

```java
// throws 声明异常
public void readFile() throws IOException {
    // ...
}

// throw 抛出异常
public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("年龄不能为负数");
    }
}
```

### 自定义异常

```java
public class BusinessException extends RuntimeException {
    private int code;
    
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
    
    public int getCode() {
        return code;
    }
}

// 使用
throw new BusinessException(500, "业务异常");
```

## IO流

### IO流分类

```
按方向：输入流、输出流
按数据：字节流、字符流

字节流
├── InputStream
│   ├── FileInputStream
│   ├── BufferedInputStream
│   └── ObjectInputStream
└── OutputStream
    ├── FileOutputStream
    ├── BufferedOutputStream
    └── ObjectOutputStream

字符流
├── Reader
│   ├── FileReader
│   ├── BufferedReader
│   └── InputStreamReader
└── Writer
    ├── FileWriter
    ├── BufferedWriter
    └── OutputStreamWriter
```

### 字节流

```java
// 文件复制
try (FileInputStream fis = new FileInputStream("source.txt");
     FileOutputStream fos = new FileOutputStream("target.txt")) {
    byte[] buffer = new byte[1024];
    int len;
    while ((len = fis.read(buffer)) != -1) {
        fos.write(buffer, 0, len);
    }
}

// 缓冲流
try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream("file.txt"));
     BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("copy.txt"))) {
    byte[] buffer = new byte[1024];
    int len;
    while ((len = bis.read(buffer)) != -1) {
        bos.write(buffer, 0, len);
    }
}
```

### 字符流

```java
// 读取文本文件
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}

// 写入文本文件
try (BufferedWriter bw = new BufferedWriter(new FileWriter("file.txt"))) {
    bw.write("Hello World");
    bw.newLine();
    bw.write("Java IO");
}
```

### 转换流

```java
// 指定编码读取
try (BufferedReader br = new BufferedReader(
        new InputStreamReader(new FileInputStream("file.txt"), "UTF-8"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}
```

### 对象序列化

```java
// 序列化
try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("object.dat"))) {
    oos.writeObject(new Person("张三", 25));
}

// 反序列化
try (ObjectInputStream ois = new ObjectInputStream(
        new FileInputStream("object.dat"))) {
    Person person = (Person) ois.readObject();
}
```

### Files 工具类（NIO）

```java
import java.nio.file.*;

// 读取文件
String content = Files.readString(Path.of("file.txt"));
List<String> lines = Files.readAllLines(Path.of("file.txt"));

// 写入文件
Files.writeString(Path.of("file.txt"), "Hello");
Files.write(Path.of("file.txt"), lines);

// 文件操作
Files.copy(source, target);
Files.move(source, target);
Files.delete(path);
Files.exists(path);
Files.isDirectory(path);
Files.createDirectory(path);

// 遍历目录
Files.walk(Path.of("."))
     .filter(Files::isRegularFile)
     .forEach(System.out::println);
```

## 反射

### 获取 Class 对象

```java
// 方式一：类名.class
Class<String> clazz1 = String.class;

// 方式二：对象.getClass()
String str = "Hello";
Class<?> clazz2 = str.getClass();

// 方式三：Class.forName()
Class<?> clazz3 = Class.forName("java.lang.String");
```

### 获取类信息

```java
Class<?> clazz = Person.class;

// 获取构造方法
Constructor<?>[] constructors = clazz.getConstructors();
Constructor<?> constructor = clazz.getConstructor(String.class, int.class);

// 获取字段
Field[] fields = clazz.getDeclaredFields();
Field field = clazz.getDeclaredField("name");

// 获取方法
Method[] methods = clazz.getDeclaredMethods();
Method method = clazz.getDeclaredMethod("setName", String.class);
```

### 创建对象

```java
// 通过构造方法创建
Constructor<?> constructor = clazz.getConstructor(String.class, int.class);
Object obj = constructor.newInstance("张三", 25);
```

### 访问字段

```java
Field field = clazz.getDeclaredField("name");
field.setAccessible(true);  // 访问私有字段

// 获取值
Object value = field.get(obj);

// 设置值
field.set(obj, "李四");
```

### 调用方法

```java
Method method = clazz.getDeclaredMethod("setName", String.class);
method.setAccessible(true);  // 访问私有方法

// 调用方法
method.invoke(obj, "王五");
```

### 反射应用示例

```java
// 通用对象创建工厂
public class ObjectFactory {
    public static <T> T create(Class<T> clazz) throws Exception {
        return clazz.getDeclaredConstructor().newInstance();
    }
}

// 使用
Person person = ObjectFactory.create(Person.class);
```


## 网络编程

### 网络编程基础

Java 提供了强大的网络编程能力，主要通过 `java.net` 包实现。

#### 网络通信三要素

1. **IP 地址**：网络中设备的唯一标识
2. **端口号**：应用程序的唯一标识（0-65535）
3. **协议**：通信规则（TCP、UDP）

### InetAddress 类

```java
import java.net.InetAddress;
import java.net.UnknownHostException;

public class InetAddressDemo {
    public static void main(String[] args) throws UnknownHostException {
        // 获取本机 InetAddress 对象
        InetAddress localHost = InetAddress.getLocalHost();
        System.out.println("本机名称：" + localHost.getHostName());
        System.out.println("本机IP：" + localHost.getHostAddress());
        
        // 根据主机名获取 InetAddress 对象
        InetAddress host = InetAddress.getByName("www.baidu.com");
        System.out.println("百度主机名：" + host.getHostName());
        System.out.println("百度IP：" + host.getHostAddress());
        
        // 获取所有IP地址
        InetAddress[] addresses = InetAddress.getAllByName("www.baidu.com");
        for (InetAddress addr : addresses) {
            System.out.println(addr.getHostAddress());
        }
    }
}
```

### TCP 编程

TCP（Transmission Control Protocol）是面向连接的、可靠的传输协议。

#### TCP 服务器端

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class TCPServer {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(8888)) {
            System.out.println("服务器启动，等待客户端连接...");
            
            // 监听客户端连接
            Socket socket = serverSocket.accept();
            System.out.println("客户端已连接：" + socket.getInetAddress().getHostAddress());
            
            // 获取输入流，读取客户端消息
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(socket.getInputStream())
            );
            String message = reader.readLine();
            System.out.println("收到客户端消息：" + message);
            
            // 获取输出流，向客户端发送消息
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
            writer.println("服务器收到：" + message);
            
            // 关闭资源
            reader.close();
            writer.close();
            socket.close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### TCP 客户端

```java
import java.io.*;
import java.net.Socket;

public class TCPClient {
    public static void main(String[] args) {
        try (Socket socket = new Socket("localhost", 8888)) {
            System.out.println("已连接到服务器");
            
            // 获取输出流，向服务器发送消息
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
            writer.println("你好，服务器！");
            
            // 获取输入流，读取服务器响应
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(socket.getInputStream())
            );
            String response = reader.readLine();
            System.out.println("服务器响应：" + response);
            
            // 关闭资源
            writer.close();
            reader.close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 多线程服务器

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

public class MultiThreadServer {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(8888)) {
            System.out.println("服务器启动，等待客户端连接...");
            
            while (true) {
                Socket socket = serverSocket.accept();
                System.out.println("客户端已连接：" + socket.getInetAddress().getHostAddress());
                
                // 为每个客户端创建一个新线程
                new Thread(new ClientHandler(socket)).start();
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

class ClientHandler implements Runnable {
    private Socket socket;
    
    public ClientHandler(Socket socket) {
        this.socket = socket;
    }
    
    @Override
    public void run() {
        try {
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(socket.getInputStream())
            );
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
            
            String message;
            while ((message = reader.readLine()) != null) {
                System.out.println("收到消息：" + message);
                writer.println("服务器回复：" + message);
                
                if ("bye".equalsIgnoreCase(message)) {
                    break;
                }
            }
            
            reader.close();
            writer.close();
            socket.close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### UDP 编程

UDP（User Datagram Protocol）是无连接的、不可靠的传输协议。

#### UDP 发送端

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UDPSender {
    public static void main(String[] args) {
        try {
            // 创建 DatagramSocket
            DatagramSocket socket = new DatagramSocket();
            
            // 准备数据
            String message = "Hello, UDP!";
            byte[] data = message.getBytes();
            
            // 创建数据包
            InetAddress address = InetAddress.getByName("localhost");
            DatagramPacket packet = new DatagramPacket(data, data.length, address, 9999);
            
            // 发送数据包
            socket.send(packet);
            System.out.println("消息已发送：" + message);
            
            // 关闭资源
            socket.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### UDP 接收端

```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class UDPReceiver {
    public static void main(String[] args) {
        try {
            // 创建 DatagramSocket，绑定端口
            DatagramSocket socket = new DatagramSocket(9999);
            System.out.println("UDP 接收端启动，等待数据...");
            
            // 准备接收数据的缓冲区
            byte[] buffer = new byte[1024];
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            
            // 接收数据包
            socket.receive(packet);
            
            // 解析数据
            String message = new String(packet.getData(), 0, packet.getLength());
            System.out.println("收到消息：" + message);
            System.out.println("发送方：" + packet.getAddress().getHostAddress());
            System.out.println("端口：" + packet.getPort());
            
            // 关闭资源
            socket.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### URL 和 URLConnection

#### URL 类

```java
import java.net.URL;

public class URLDemo {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://www.example.com:8080/path/index.html?name=value#section");
            
            System.out.println("协议：" + url.getProtocol());
            System.out.println("主机：" + url.getHost());
            System.out.println("端口：" + url.getPort());
            System.out.println("路径：" + url.getPath());
            System.out.println("文件：" + url.getFile());
            System.out.println("查询：" + url.getQuery());
            System.out.println("锚点：" + url.getRef());
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### URLConnection 下载文件

```java
import java.io.*;
import java.net.URL;
import java.net.URLConnection;

public class DownloadFile {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://www.example.com/file.txt");
            URLConnection connection = url.openConnection();
            
            // 获取输入流
            InputStream inputStream = connection.getInputStream();
            
            // 创建输出流
            FileOutputStream outputStream = new FileOutputStream("downloaded_file.txt");
            
            // 读取并写入
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
            
            System.out.println("文件下载完成");
            
            // 关闭资源
            inputStream.close();
            outputStream.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### HTTP 请求（使用 HttpURLConnection）

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpRequestDemo {
    public static void main(String[] args) {
        try {
            // GET 请求
            URL url = new URL("https://api.github.com/users/github");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // 设置请求方法
            connection.setRequestMethod("GET");
            
            // 设置请求头
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            
            // 获取响应码
            int responseCode = connection.getResponseCode();
            System.out.println("响应码：" + responseCode);
            
            // 读取响应
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream())
                );
                
                String line;
                StringBuilder response = new StringBuilder();
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                
                System.out.println("响应内容：");
                System.out.println(response.toString());
            }
            
            connection.disconnect();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### POST 请求

```java
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpPostDemo {
    public static void main(String[] args) {
        try {
            URL url = new URL("https://httpbin.org/post");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            
            // 设置请求方法为 POST
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            
            // 设置请求头
            connection.setRequestProperty("Content-Type", "application/json");
            
            // 发送 POST 数据
            String jsonData = "{\"name\":\"张三\",\"age\":25}";
            OutputStream outputStream = connection.getOutputStream();
            outputStream.write(jsonData.getBytes());
            outputStream.flush();
            outputStream.close();
            
            // 读取响应
            int responseCode = connection.getResponseCode();
            System.out.println("响应码：" + responseCode);
            
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream())
                );
                
                String line;
                StringBuilder response = new StringBuilder();
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
                
                System.out.println("响应内容：");
                System.out.println(response.toString());
            }
            
            connection.disconnect();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 简单的聊天室示例

#### 服务器端

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public class ChatServer {
    private static List<ClientThread> clients = new ArrayList<>();
    
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(8888)) {
            System.out.println("聊天室服务器启动...");
            
            while (true) {
                Socket socket = serverSocket.accept();
                ClientThread client = new ClientThread(socket);
                clients.add(client);
                client.start();
                System.out.println("新用户加入，当前在线：" + clients.size());
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    // 广播消息给所有客户端
    public static void broadcast(String message, ClientThread sender) {
        for (ClientThread client : clients) {
            if (client != sender) {
                client.sendMessage(message);
            }
        }
    }
    
    // 移除客户端
    public static void removeClient(ClientThread client) {
        clients.remove(client);
        System.out.println("用户离开，当前在线：" + clients.size());
    }
}

class ClientThread extends Thread {
    private Socket socket;
    private BufferedReader reader;
    private PrintWriter writer;
    
    public ClientThread(Socket socket) {
        this.socket = socket;
        try {
            reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            writer = new PrintWriter(socket.getOutputStream(), true);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void run() {
        try {
            String message;
            while ((message = reader.readLine()) != null) {
                System.out.println("收到消息：" + message);
                ChatServer.broadcast(message, this);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            ChatServer.removeClient(this);
            try {
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    public void sendMessage(String message) {
        writer.println(message);
    }
}
```

#### 客户端

```java
import java.io.*;
import java.net.Socket;
import java.util.Scanner;

public class ChatClient {
    public static void main(String[] args) {
        try {
            Socket socket = new Socket("localhost", 8888);
            System.out.println("已连接到聊天室");
            
            // 接收消息的线程
            new Thread(() -> {
                try {
                    BufferedReader reader = new BufferedReader(
                        new InputStreamReader(socket.getInputStream())
                    );
                    String message;
                    while ((message = reader.readLine()) != null) {
                        System.out.println(message);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }).start();
            
            // 发送消息
            PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
            Scanner scanner = new Scanner(System.in);
            
            System.out.print("请输入昵称：");
            String nickname = scanner.nextLine();
            
            String message;
            while (true) {
                message = scanner.nextLine();
                if ("exit".equalsIgnoreCase(message)) {
                    break;
                }
                writer.println(nickname + ": " + message);
            }
            
            socket.close();
            scanner.close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 网络编程最佳实践

1. **资源管理**：使用 try-with-resources 自动关闭资源
2. **异常处理**：妥善处理网络异常
3. **线程安全**：多线程环境下注意同步
4. **超时设置**：设置连接和读取超时
5. **缓冲区大小**：合理设置缓冲区大小
6. **编码问题**：注意字符编码转换

```java
// 设置超时示例
Socket socket = new Socket();
socket.connect(new InetSocketAddress("localhost", 8888), 5000); // 连接超时5秒
socket.setSoTimeout(10000); // 读取超时10秒
```

## 参考资源

- [Java 官方文档](https://docs.oracle.com/javase/8/docs/)
- [Java 网络编程](https://docs.oracle.com/javase/tutorial/networking/)
