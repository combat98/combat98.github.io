# Kotlin 协程

## 简介

协程是 Kotlin 提供的轻量级并发解决方案，可以简化异步编程。

## 基础使用

### 添加依赖

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
}
```

### 启动协程

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}
```

### async 和 await

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val deferred1 = async {
        delay(1000L)
        10
    }
    
    val deferred2 = async {
        delay(2000L)
        20
    }
    
    val result = deferred1.await() + deferred2.await()
    println("结果: $result")
}
```

## 参考资源

- [Kotlin 协程文档](https://kotlinlang.org/docs/coroutines-overview.html)
