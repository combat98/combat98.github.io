# Kotlin 基础

## 简介

Kotlin 是一种现代的静态类型编程语言，由 JetBrains 开发。Kotlin 可以编译为 JVM 字节码、JavaScript 或原生代码，是 Android 开发的首选语言。

### 特点

- 简洁的语法
- 空安全
- 与 Java 完全互操作
- 函数式编程支持
- 协程支持
- 多平台开发

## 环境配置

### 安装 Kotlin

```bash
# macOS/Linux (使用 SDKMAN)
curl -s "https://get.sdkman.io" | bash
sdk install kotlin

# 验证安装
kotlin -version
```

### 使用 IntelliJ IDEA

下载并安装 [IntelliJ IDEA](https://www.jetbrains.com/idea/)，内置 Kotlin 支持。

### 创建项目

```bash
# 使用 Gradle
gradle init --type kotlin-application

# 或使用 Maven
mvn archetype:generate -DgroupId=com.example -DartifactId=myapp
```

### Hello World

```kotlin
fun main() {
    println("Hello, Kotlin!")
}
```

## 语法基础

### 变量

```kotlin
fun main() {
    // 可变变量
    var name = "张三"
    name = "李四"
    
    // 不可变变量
    val age = 25
    // age = 26  // 错误
    
    // 类型声明
    var score: Double = 95.5
    val isStudent: Boolean = true
    
    println("$name, $age 岁, 分数: $score")
}
```

### 数据类型

```kotlin
fun main() {
    // 基本类型
    val intNum: Int = 10
    val longNum: Long = 100L
    val floatNum: Float = 3.14f
    val doubleNum: Double = 3.14159
    val charValue: Char = 'A'
    val boolValue: Boolean = true
    
    // 字符串
    val str = "Hello, Kotlin"
    val multiLine = """
        多行
        字符串
    """.trimIndent()
    
    // 字符串模板
    val name = "张三"
    val greeting = "你好, $name!"
    val message = "2 + 2 = ${2 + 2}"
    
    println(greeting)
    println(message)
}
```

### 函数

```kotlin
// 基本函数
fun add(a: Int, b: Int): Int {
    return a + b
}

// 表达式函数体
fun multiply(a: Int, b: Int) = a * b

// 默认参数
fun greet(name: String = "朋友") {
    println("你好, $name!")
}

// 命名参数
fun createUser(name: String, age: Int, city: String) {
    println("$name, $age 岁, 来自 $city")
}

fun main() {
    println(add(5, 3))
    println(multiply(4, 6))
    
    greet()
    greet("张三")
    
    createUser(name = "李四", age = 30, city = "北京")
}
```

### 控制流

```kotlin
fun main() {
    // if 表达式
    val max = if (10 > 5) 10 else 5
    
    // when 表达式
    val day = 3
    val dayName = when (day) {
        1 -> "星期一"
        2 -> "星期二"
        3 -> "星期三"
        else -> "其他"
    }
    println(dayName)
    
    // for 循环
    for (i in 1..5) {
        print("$i ")
    }
    println()
    
    for (i in 5 downTo 1) {
        print("$i ")
    }
    println()
    
    for (i in 1 until 5) {  // 不包含 5
        print("$i ")
    }
    println()
    
    // while 循环
    var count = 0
    while (count < 5) {
        print("$count ")
        count++
    }
    println()
}
```

### 集合

```kotlin
fun main() {
    // List
    val numbers = listOf(1, 2, 3, 4, 5)
    val mutableNumbers = mutableListOf(1, 2, 3)
    mutableNumbers.add(4)
    
    // Set
    val uniqueNumbers = setOf(1, 2, 3, 2, 1)  // {1, 2, 3}
    
    // Map
    val ages = mapOf("张三" to 25, "李四" to 30)
    val mutableAges = mutableMapOf("王五" to 28)
    mutableAges["赵六"] = 35
    
    // 遍历
    for (num in numbers) {
        print("$num ")
    }
    println()
    
    for ((name, age) in ages) {
        println("$name: $age 岁")
    }
}
```

### 类和对象

```kotlin
class Person(val name: String, var age: Int) {
    fun introduce() {
        println("我是 $name, 今年 $age 岁")
    }
}

// 数据类
data class User(val name: String, val age: Int)

// 单例对象
object DatabaseConfig {
    val url = "jdbc:mysql://localhost:3306/db"
}

fun main() {
    val person = Person("张三", 25)
    person.introduce()
    person.age = 26
    person.introduce()
    
    // 数据类自动生成 equals, hashCode, toString, copy
    val user1 = User("李四", 30)
    val user2 = user1.copy(age = 31)
    println(user1)
    println(user2)
    
    println(DatabaseConfig.url)
}
```

### 空安全

```kotlin
fun main() {
    // 可空类型
    var name: String? = "张三"
    name = null
    
    // 安全调用
    println(name?.length)
    
    // Elvis 运算符
    val length = name?.length ?: 0
    println("长度: $length")
    
    // 非空断言
    // val len = name!!.length  // 如果 name 为 null 会抛出异常
    
    // 安全转换
    val obj: Any = "Hello"
    val str: String? = obj as? String
    println(str)
}
```

### Lambda 表达式

```kotlin
fun main() {
    // Lambda 表达式
    val sum = { a: Int, b: Int -> a + b }
    println(sum(5, 3))
    
    // 高阶函数
    val numbers = listOf(1, 2, 3, 4, 5)
    
    val doubled = numbers.map { it * 2 }
    println(doubled)
    
    val evens = numbers.filter { it % 2 == 0 }
    println(evens)
    
    val total = numbers.reduce { acc, num -> acc + num }
    println("总和: $total")
}
```

## 参考资源

- [Kotlin 官方文档](https://kotlinlang.org/docs/home.html)
- [Kotlin Koans](https://play.kotlinlang.org/koans/overview)
