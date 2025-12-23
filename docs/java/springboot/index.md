# Spring Boot

## 概述

Spring Boot 是基于 Spring 框架的快速开发脚手架，通过约定优于配置的理念，简化了 Spring 应用的搭建和开发过程。

### 核心特性

- 自动配置：根据依赖自动配置 Spring 应用
- 起步依赖：简化 Maven/Gradle 配置
- 内嵌服务器：无需部署 WAR 包
- 生产就绪：提供监控、健康检查等功能
- 无代码生成：不生成代码，不需要 XML 配置

### 版本对应关系

| Spring Boot | Spring Framework | Java |
|-------------|------------------|------|
| 3.x | 6.x | 17+ |
| 2.7.x | 5.3.x | 8+ |
| 2.6.x | 5.3.x | 8+ |

## 快速开始

### 创建项目

访问 [Spring Initializr](https://start.spring.io/) 或使用 IDE 创建项目。

### Maven 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.18</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>1.0.0</version>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 启动类

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

### 第一个接口

```java
@RestController
public class HelloController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot!";
    }
}
```

### 运行应用

```bash
# Maven
mvn spring-boot:run

# Gradle
gradle bootRun

# JAR 包
java -jar demo.jar
```

## 核心注解

### @SpringBootApplication

```java
// @SpringBootApplication 是以下三个注解的组合
@SpringBootConfiguration  // 标识配置类
@EnableAutoConfiguration  // 启用自动配置
@ComponentScan           // 组件扫描

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### @Configuration

```java
@Configuration
public class AppConfig {
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Bean
    @ConditionalOnMissingBean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
```

### @Conditional 系列

```java
// 条件注解
@ConditionalOnClass(DataSource.class)        // 类存在
@ConditionalOnMissingClass("xxx")            // 类不存在
@ConditionalOnBean(DataSource.class)         // Bean 存在
@ConditionalOnMissingBean(DataSource.class)  // Bean 不存在
@ConditionalOnProperty(name = "app.enabled", havingValue = "true")  // 配置存在
@ConditionalOnExpression("${app.enabled:false}")  // SpEL 表达式
@ConditionalOnWebApplication                 // Web 应用
@ConditionalOnNotWebApplication              // 非 Web 应用

@Configuration
@ConditionalOnClass(RedisOperations.class)
public class RedisConfig {
    
    @Bean
    @ConditionalOnMissingBean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        return template;
    }
}
```

## 配置文件

### application.yml

```yaml
# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api

# 应用配置
spring:
  application:
    name: demo
  
  # 数据源配置
  datasource:
    url: jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
  
  # JPA 配置
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  
  # Redis 配置
  redis:
    host: localhost
    port: 6379
    password: 
    database: 0
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0

# 日志配置
logging:
  level:
    root: INFO
    com.example: DEBUG
  file:
    name: logs/app.log
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

# 自定义配置
app:
  name: Demo Application
  version: 1.0.0
```

### 多环境配置

```yaml
# application.yml
spring:
  profiles:
    active: dev

---
# application-dev.yml
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:mysql://localhost:3306/dev

---
# application-prod.yml
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:mysql://prod-server:3306/prod
```

### 配置绑定

```java
@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String name;
    private String version;
    private List<String> servers;
    private Map<String, String> metadata;
}

// 使用
@Autowired
private AppProperties appProperties;
```

### @Value 注解

```java
@Component
public class AppConfig {
    
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.version:1.0.0}")  // 默认值
    private String version;
    
    @Value("#{${app.metadata}}")  // SpEL 表达式
    private Map<String, String> metadata;
}
```

## 自动配置原理

### @EnableAutoConfiguration

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
}
```

### 自动配置流程

```
1. @SpringBootApplication 包含 @EnableAutoConfiguration
2. @EnableAutoConfiguration 导入 AutoConfigurationImportSelector
3. 读取 META-INF/spring.factories 文件
4. 加载所有自动配置类
5. 根据 @Conditional 条件判断是否生效
6. 创建 Bean 并注入容器
```

### 自定义自动配置

```java
// 1. 创建自动配置类
@Configuration
@ConditionalOnClass(MyService.class)
@EnableConfigurationProperties(MyProperties.class)
public class MyAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public MyService myService(MyProperties properties) {
        return new MyService(properties);
    }
}

// 2. 创建配置属性类
@Data
@ConfigurationProperties(prefix = "my")
public class MyProperties {
    private String name;
    private boolean enabled = true;
}

// 3. 创建 META-INF/spring.factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.autoconfigure.MyAutoConfiguration
```

## 起步依赖

### 常用 Starter

```xml
<!-- Web 开发 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- 数据访问 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- 模板引擎 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- 安全 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- 测试 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- 监控 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<!-- 验证 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- AOP -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>

<!-- 邮件 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- 定时任务 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
```

### 自定义 Starter

```xml
<!-- 1. 创建 starter 项目 -->
<artifactId>my-spring-boot-starter</artifactId>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
    </dependency>
</dependencies>
```

## 数据访问

### JPA

```java
@Entity
@Table(name = "t_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer age;
}

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
    List<User> findByAgeGreaterThan(Integer age);
}

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
}
```

### MyBatis

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.3.1</version>
</dependency>
```

```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.entity
  configuration:
    map-underscore-to-camel-case: true
```

```java
@Mapper
public interface UserMapper {
    
    @Select("SELECT * FROM t_user WHERE id = #{id}")
    User findById(Long id);
    
    @Insert("INSERT INTO t_user(name, age) VALUES(#{name}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    @Update("UPDATE t_user SET name = #{name}, age = #{age} WHERE id = #{id}")
    int update(User user);
    
    @Delete("DELETE FROM t_user WHERE id = #{id}")
    int delete(Long id);
}
```

### Redis

```java
@Configuration
public class RedisConfig {
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        
        // 设置序列化器
        Jackson2JsonRedisSerializer<Object> serializer = 
            new Jackson2JsonRedisSerializer<>(Object.class);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        
        return template;
    }
}

@Service
public class CacheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public void set(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }
    
    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }
}
```

## 缓存

### 启用缓存

```java
@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 缓存注解

```java
@Service
public class UserService {
    
    @Cacheable(value = "users", key = "#id")
    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    @CacheEvict(value = "users", allEntries = true)
    public void deleteAll() {
        userRepository.deleteAll();
    }
    
    @Caching(
        cacheable = @Cacheable(value = "users", key = "#id"),
        put = @CachePut(value = "userCache", key = "#id")
    )
    public User complexCache(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
```

### 自定义缓存配置

```java
@Configuration
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))  // 过期时间
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new StringRedisSerializer()))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new Jackson2JsonRedisSerializer<>(Object.class)))
            .disableCachingNullValues();
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}
```

## 定时任务

### @Scheduled

```java
@SpringBootApplication
@EnableScheduling
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Component
public class ScheduledTasks {
    
    // 固定延迟
    @Scheduled(fixedDelay = 5000)
    public void task1() {
        System.out.println("每 5 秒执行一次");
    }
    
    // 固定频率
    @Scheduled(fixedRate = 5000)
    public void task2() {
        System.out.println("每 5 秒执行一次");
    }
    
    // Cron 表达式
    @Scheduled(cron = "0 0 0 * * ?")
    public void task3() {
        System.out.println("每天 0 点执行");
    }
    
    // 初始延迟
    @Scheduled(initialDelay = 10000, fixedRate = 5000)
    public void task4() {
        System.out.println("启动 10 秒后开始执行");
    }
}
```

### 异步任务

```java
@SpringBootApplication
@EnableAsync
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Service
public class AsyncService {
    
    @Async
    public void asyncTask() {
        System.out.println("异步任务执行中...");
    }
    
    @Async
    public CompletableFuture<String> asyncTaskWithResult() {
        return CompletableFuture.completedFuture("异步任务结果");
    }
}

// 自定义线程池
@Configuration
public class AsyncConfig {
    
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}
```

## 事件监听

### 发布事件

```java
// 自定义事件
public class UserRegisterEvent extends ApplicationEvent {
    private User user;
    
    public UserRegisterEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
    
    public User getUser() {
        return user;
    }
}

// 发布事件
@Service
public class UserService {
    
    @Autowired
    private ApplicationEventPublisher publisher;
    
    public void register(User user) {
        // 注册逻辑
        userRepository.save(user);
        
        // 发布事件
        publisher.publishEvent(new UserRegisterEvent(this, user));
    }
}
```

### 监听事件

```java
@Component
public class UserEventListener {
    
    @EventListener
    public void handleUserRegister(UserRegisterEvent event) {
        User user = event.getUser();
        System.out.println("用户注册: " + user.getName());
        // 发送欢迎邮件等
    }
    
    @EventListener
    @Async
    public void asyncHandleUserRegister(UserRegisterEvent event) {
        // 异步处理
    }
}
```

## Actuator 监控

### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### 配置

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"  # 暴露所有端点
  endpoint:
    health:
      show-details: always
  metrics:
    tags:
      application: ${spring.application.name}
```

### 常用端点

| 端点 | 说明 |
|------|------|
| /actuator/health | 健康检查 |
| /actuator/info | 应用信息 |
| /actuator/metrics | 指标信息 |
| /actuator/env | 环境变量 |
| /actuator/beans | Bean 列表 |
| /actuator/mappings | 请求映射 |
| /actuator/loggers | 日志配置 |
| /actuator/threaddump | 线程转储 |
| /actuator/heapdump | 堆转储 |

### 自定义健康检查

```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // 检查逻辑
        boolean isHealthy = checkHealth();
        
        if (isHealthy) {
            return Health.up()
                .withDetail("status", "running")
                .withDetail("version", "1.0.0")
                .build();
        } else {
            return Health.down()
                .withDetail("error", "Service unavailable")
                .build();
        }
    }
    
    private boolean checkHealth() {
        // 实际检查逻辑
        return true;
    }
}
```

### 自定义指标

```java
@Component
public class CustomMetrics {
    
    private final Counter counter;
    private final Gauge gauge;
    
    public CustomMetrics(MeterRegistry registry) {
        this.counter = Counter.builder("custom.counter")
            .description("自定义计数器")
            .register(registry);
        
        this.gauge = Gauge.builder("custom.gauge", this, CustomMetrics::getValue)
            .description("自定义仪表")
            .register(registry);
    }
    
    public void increment() {
        counter.increment();
    }
    
    private double getValue() {
        return Math.random() * 100;
    }
}
```

## 测试

### 单元测试

```java
@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void testGetUser() {
        User user = userService.getUser(1L);
        assertNotNull(user);
        assertEquals("张三", user.getName());
    }
}
```

### Web 测试

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetUser() throws Exception {
        mockMvc.perform(get("/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("张三"));
    }
    
    @Test
    void testCreateUser() throws Exception {
        String json = "{\"name\":\"李四\",\"age\":25}";
        
        mockMvc.perform(post("/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists());
    }
}
```

### Mock 测试

```java
@SpringBootTest
class UserServiceMockTest {
    
    @MockBean
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Test
    void testGetUser() {
        User mockUser = new User(1L, "张三", 30);
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        
        User user = userService.getUser(1L);
        assertEquals("张三", user.getName());
        
        verify(userRepository, times(1)).findById(1L);
    }
}
```

## 打包部署

### Maven 打包

```bash
mvn clean package
```

### 运行 JAR

```bash
java -jar demo.jar

# 指定配置文件
java -jar demo.jar --spring.profiles.active=prod

# 指定端口
java -jar demo.jar --server.port=8081

# JVM 参数
java -Xms512m -Xmx1024m -jar demo.jar
```

### Docker 部署

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/demo.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
docker build -t demo:1.0.0 .
docker run -d -p 8080:8080 demo:1.0.0
```

## 常用配置总结

```yaml
# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /
  tomcat:
    max-threads: 200
    accept-count: 100

# 日志配置
logging:
  level:
    root: INFO
  file:
    name: logs/app.log
    max-size: 10MB
    max-history: 30

# 数据源配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: 123456
    hikari:
      maximum-pool-size: 20

# Jackson 配置
spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
    default-property-inclusion: non_null

# 文件上传配置
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 100MB
```
