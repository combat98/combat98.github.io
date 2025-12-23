# Kotlin 学习路线与框架生态

## 学习路线

### 第一阶段：基础入门（1-2周）

1. **环境搭建**
   - 安装 JDK
   - 安装 IntelliJ IDEA
   - 配置 Kotlin 插件

2. **基础语法**
   - 变量和数据类型
   - 函数和Lambda
   - 控制流
   - 类和对象
   - 空安全

3. **Kotlin 特性**
   - 扩展函数
   - 数据类
   - 密封类
   - 对象表达式和声明

### 第二阶段：进阶特性（2-3周）

1. **函数式编程**
   - 高阶函数
   - 集合操作（map、filter、reduce）
   - 序列（Sequence）

2. **协程**
   - 协程基础
   - 挂起函数
   - 协程作用域
   - Flow

3. **泛型**
   - 泛型类和函数
   - 型变（协变、逆变）
   - 类型投影

### 第三阶段：Android 开发（3-4周）

1. **Android 基础**
   - Activity 和 Fragment
   - 布局和 UI
   - Intent 和导航

2. **Jetpack 组件**
   - ViewModel
   - LiveData
   - Room 数据库
   - Navigation

3. **Jetpack Compose**
   - 声明式 UI
   - 状态管理
   - 主题和样式

### 第四阶段：后端开发（3-4周）

1. **Ktor 框架**
   - 路由和请求处理
   - 序列化
   - 数据库集成

2. **Spring Boot + Kotlin**
   - RESTful API
   - JPA 集成
   - 安全认证

## 框架生态

### Android 开发

#### Jetpack Compose
- **特点**：现代声明式 UI
- **适用场景**：Android 应用开发

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}
```

#### Android Jetpack
- **组件**：
  - ViewModel：管理 UI 相关数据
  - LiveData：可观察的数据持有者
  - Room：SQLite 数据库抽象层
  - Navigation：应用导航
  - WorkManager：后台任务

```gradle
dependencies {
    implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2"
    implementation "androidx.room:room-runtime:2.6.0"
    kapt "androidx.room:room-compiler:2.6.0"
}
```

### 后端框架

#### Ktor
- **特点**：轻量级、异步
- **适用场景**：微服务、API 服务

```kotlin
fun main() {
    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                call.respondText("Hello, Ktor!")
            }
        }
    }.start(wait = true)
}
```

```gradle
dependencies {
    implementation "io.ktor:ktor-server-core:2.3.5"
    implementation "io.ktor:ktor-server-netty:2.3.5"
}
```

#### Spring Boot
- **特点**：成熟、功能完整
- **适用场景**：企业级应用

```kotlin
@SpringBootApplication
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}

@RestController
class HelloController {
    @GetMapping("/")
    fun hello() = "Hello, Spring Boot!"
}
```

#### Http4k
- **特点**：函数式、轻量级
- **适用场景**：微服务

```kotlin
val app: HttpHandler = routes(
    "/ping" bind GET to { Response(OK).body("pong") }
)

app.asServer(Netty(9000)).start()
```

### 数据库

#### Exposed
- **特点**：Kotlin DSL、类型安全
- **支持**：MySQL、PostgreSQL、SQLite

```kotlin
object Users : Table() {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 50)
    override val primaryKey = PrimaryKey(id)
}

transaction {
    Users.insert {
        it[name] = "Alice"
    }
}
```

#### Room (Android)
- **特点**：SQLite 抽象层
- **适用**：Android 应用

```kotlin
@Entity
data class User(
    @PrimaryKey val id: Int,
    val name: String
)

@Dao
interface UserDao {
    @Query("SELECT * FROM user")
    fun getAll(): List<User>
}
```

### 序列化

#### kotlinx.serialization
- **特点**：官方序列化库
- **支持格式**：JSON、ProtoBuf、CBOR

```kotlin
@Serializable
data class User(val name: String, val age: Int)

val json = Json.encodeToString(User("Alice", 25))
val user = Json.decodeFromString<User>(json)
```

### HTTP 客户端

#### Ktor Client
- **特点**：多平台、异步

```kotlin
val client = HttpClient()
val response: String = client.get("https://api.github.com")
```

#### Retrofit (Android)
- **特点**：类型安全、易用

```kotlin
interface GitHubService {
    @GET("users/{user}")
    suspend fun getUser(@Path("user") user: String): User
}
```

### 依赖注入

#### Koin
- **特点**：轻量级、DSL 风格

```kotlin
val appModule = module {
    single { UserRepository() }
    viewModel { UserViewModel(get()) }
}

startKoin {
    modules(appModule)
}
```

#### Hilt (Android)
- **特点**：基于 Dagger、Android 优化

```kotlin
@HiltAndroidApp
class MyApplication : Application()

@AndroidEntryPoint
class MainActivity : AppCompatActivity()
```

### 测试

#### JUnit 5
- **特点**：标准测试框架

```kotlin
@Test
fun `test addition`() {
    assertEquals(4, 2 + 2)
}
```

#### MockK
- **特点**：Kotlin 原生 Mock 库

```kotlin
val mock = mockk<UserRepository>()
every { mock.getUser(1) } returns User("Alice", 25)
```

## 学习资源

### 官方资源
- [Kotlin 官方文档](https://kotlinlang.org/docs/home.html)
- [Kotlin Koans](https://play.kotlinlang.org/koans/overview)
- [Android 开发者文档](https://developer.android.com/kotlin)

### 书籍推荐
- 《Kotlin 实战》
- 《Kotlin 核心编程》
- 《Android 开发艺术探索》

### 在线资源
- [Kotlin 中文网](https://www.kotlincn.net/)
- [Awesome Kotlin](https://kotlin.link/)
- [Kotlin Weekly](https://kotlinweekly.net/)

### 实战项目
1. **Android 应用**：使用 Jetpack Compose 构建 Todo 应用
2. **RESTful API**：使用 Ktor 构建后端服务
3. **多平台应用**：使用 Kotlin Multiplatform
4. **CLI 工具**：使用 Clikt 构建命令行工具

## 职业发展方向

1. **Android 开发工程师**
   - 移动应用开发
   - Jetpack Compose

2. **后端开发工程师**
   - Spring Boot 开发
   - 微服务架构

3. **全栈开发**
   - Kotlin Multiplatform
   - 跨平台开发

4. **架构师**
   - 系统设计
   - 技术选型

## 最佳实践

1. **代码规范**
   - 遵循 Kotlin 官方代码风格
   - 使用 ktlint 检查代码
   - 使用 detekt 静态分析

2. **项目结构**
   ```
   app/
   ├── src/
   │   ├── main/
   │   │   ├── kotlin/
   │   │   │   └── com/example/
   │   │   │       ├── ui/
   │   │   │       ├── data/
   │   │   │       └── domain/
   │   │   └── res/
   │   └── test/
   └── build.gradle.kts
   ```

3. **协程使用**
   - 使用结构化并发
   - 正确处理取消
   - 避免内存泄漏

4. **空安全**
   - 优先使用非空类型
   - 使用安全调用操作符 `?.`
   - 使用 Elvis 操作符 `?:`

5. **性能优化**
   - 使用 Sequence 处理大集合
   - 避免不必要的对象创建
   - 使用 inline 函数
