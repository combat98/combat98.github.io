# Spring Framework

## 简介

Spring 是一个开源的 Java 企业级应用开发框架，提供了全面的基础设施支持，让开发者可以专注于业务逻辑的实现。

### 特点

- **轻量级** - 非侵入式设计
- **IOC容器** - 控制反转，依赖注入
- **AOP支持** - 面向切面编程
- **事务管理** - 声明式事务
- **MVC框架** - Web开发支持
- **测试支持** - 完善的测试框架

### Spring 生态

- **Spring Framework** - 核心框架
- **Spring Boot** - 快速开发脚手架
- **Spring Cloud** - 微服务框架
- **Spring Data** - 数据访问
- **Spring Security** - 安全框架
- **Spring Batch** - 批处理框架

## 快速开始

### Maven 依赖

```xml
<dependencies>
    <!-- Spring核心 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.20</version>
    </dependency>
    
    <!-- Spring AOP -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>5.3.20</version>
    </dependency>
    
    <!-- AspectJ -->
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.9.7</version>
    </dependency>
</dependencies>
```

### Hello World

```java
// 1. 定义Bean
public class HelloWorld {
    private String message;
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public void getMessage() {
        System.out.println("Message: " + message);
    }
}

// 2. 配置文件 applicationContext.xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="helloWorld" class="com.example.HelloWorld">
        <property name="message" value="Hello Spring!"/>
    </bean>
</beans>

// 3. 使用
public class Main {
    public static void main(String[] args) {
        ApplicationContext context = 
            new ClassPathXmlApplicationContext("applicationContext.xml");
        
        HelloWorld obj = (HelloWorld) context.getBean("helloWorld");
        obj.getMessage();
    }
}
```

## IOC 容器

### 依赖注入方式

**构造器注入**
```java
public class UserService {
    private UserDao userDao;
    
    // 构造器注入
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }
}

// XML配置
<bean id="userService" class="com.example.UserService">
    <constructor-arg ref="userDao"/>
</bean>

<bean id="userDao" class="com.example.UserDaoImpl"/>
```

**Setter注入**
```java
public class UserService {
    private UserDao userDao;
    
    // Setter注入
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
}

// XML配置
<bean id="userService" class="com.example.UserService">
    <property name="userDao" ref="userDao"/>
</bean>
```

**注解注入**
```java
@Component
public class UserService {
    
    // @Autowired - 按类型注入
    @Autowired
    private UserDao userDao;
    
    // @Resource - 按名称注入
    @Resource(name = "userDao")
    private UserDao userDao;
    
    // @Qualifier - 指定Bean名称
    @Autowired
    @Qualifier("userDaoImpl")
    private UserDao userDao;
}
```

### Bean 作用域

```java
// singleton - 单例（默认）
@Scope("singleton")
@Component
public class SingletonBean {
}

// prototype - 原型，每次获取创建新实例
@Scope("prototype")
@Component
public class PrototypeBean {
}

// request - 每个HTTP请求创建一个实例
@Scope("request")
@Component
public class RequestBean {
}

// session - 每个HTTP会话创建一个实例
@Scope("session")
@Component
public class SessionBean {
}
```

### Bean 生命周期

```java
@Component
public class LifecycleBean implements InitializingBean, DisposableBean {
    
    // 1. 构造器
    public LifecycleBean() {
        System.out.println("1. 构造器");
    }
    
    // 2. 设置属性
    @Autowired
    public void setDependency(Dependency dependency) {
        System.out.println("2. 设置属性");
    }
    
    // 3. BeanNameAware
    @Override
    public void setBeanName(String name) {
        System.out.println("3. BeanNameAware");
    }
    
    // 4. BeanFactoryAware
    @Override
    public void setBeanFactory(BeanFactory beanFactory) {
        System.out.println("4. BeanFactoryAware");
    }
    
    // 5. ApplicationContextAware
    @Override
    public void setApplicationContext(ApplicationContext context) {
        System.out.println("5. ApplicationContextAware");
    }
    
    // 6. BeanPostProcessor - postProcessBeforeInitialization
    
    // 7. @PostConstruct
    @PostConstruct
    public void postConstruct() {
        System.out.println("7. @PostConstruct");
    }
    
    // 8. InitializingBean
    @Override
    public void afterPropertiesSet() {
        System.out.println("8. InitializingBean");
    }
    
    // 9. init-method
    public void initMethod() {
        System.out.println("9. init-method");
    }
    
    // 10. BeanPostProcessor - postProcessAfterInitialization
    
    // Bean可以使用了
    
    // 11. @PreDestroy
    @PreDestroy
    public void preDestroy() {
        System.out.println("11. @PreDestroy");
    }
    
    // 12. DisposableBean
    @Override
    public void destroy() {
        System.out.println("12. DisposableBean");
    }
    
    // 13. destroy-method
    public void destroyMethod() {
        System.out.println("13. destroy-method");
    }
}
```

### 配置方式

**XML配置**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="userService" class="com.example.UserService">
        <property name="userDao" ref="userDao"/>
    </bean>
    
    <bean id="userDao" class="com.example.UserDaoImpl"/>
</beans>
```

**注解配置**
```java
@Configuration
@ComponentScan("com.example")
public class AppConfig {
    
    @Bean
    public UserService userService() {
        return new UserService(userDao());
    }
    
    @Bean
    public UserDao userDao() {
        return new UserDaoImpl();
    }
}

// 使用
ApplicationContext context = 
    new AnnotationConfigApplicationContext(AppConfig.class);
```

**Java配置 + 注解**
```java
@Configuration
@ComponentScan("com.example")
@EnableAspectJAutoProxy
@EnableTransactionManagement
public class AppConfig {
}

@Component
public class UserService {
    @Autowired
    private UserDao userDao;
}
```

## AOP 面向切面编程

### 核心概念

- **切面（Aspect）** - 横切关注点的模块化
- **连接点（Join Point）** - 程序执行的某个点
- **切入点（Pointcut）** - 匹配连接点的表达式
- **通知（Advice）** - 在切入点执行的动作
- **目标对象（Target）** - 被代理的对象
- **织入（Weaving）** - 将切面应用到目标对象的过程

### 通知类型

```java
@Aspect
@Component
public class LogAspect {
    
    // 前置通知
    @Before("execution(* com.example.service.*.*(..))")
    public void before(JoinPoint joinPoint) {
        System.out.println("前置通知: " + joinPoint.getSignature().getName());
    }
    
    // 后置通知
    @After("execution(* com.example.service.*.*(..))")
    public void after(JoinPoint joinPoint) {
        System.out.println("后置通知");
    }
    
    // 返回通知
    @AfterReturning(
        pointcut = "execution(* com.example.service.*.*(..))",
        returning = "result")
    public void afterReturning(JoinPoint joinPoint, Object result) {
        System.out.println("返回通知: " + result);
    }
    
    // 异常通知
    @AfterThrowing(
        pointcut = "execution(* com.example.service.*.*(..))",
        throwing = "ex")
    public void afterThrowing(JoinPoint joinPoint, Exception ex) {
        System.out.println("异常通知: " + ex.getMessage());
    }
    
    // 环绕通知
    @Around("execution(* com.example.service.*.*(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕通知 - 前");
        Object result = joinPoint.proceed();
        System.out.println("环绕通知 - 后");
        return result;
    }
}
```

### 切入点表达式

```java
// 执行任意公共方法
execution(public * *(..))

// 执行任何以set开始的方法
execution(* set*(..))

// 执行UserService类的任意方法
execution(* com.example.service.UserService.*(..))

// 执行service包下的任意方法
execution(* com.example.service.*.*(..))

// 执行service包及子包下的任意方法
execution(* com.example.service..*.*(..))

// 组合表达式
@Pointcut("execution(* com.example.service.*.*(..)) && args(id)")
public void serviceMethod(Long id) {}
```

### 实际应用

**日志记录**
```java
@Aspect
@Component
public class LogAspect {
    
    @Around("@annotation(com.example.annotation.Log)")
    public Object log(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        System.out.println("开始执行: " + className + "." + methodName);
        System.out.println("参数: " + Arrays.toString(args));
        
        Object result = joinPoint.proceed();
        
        long end = System.currentTimeMillis();
        System.out.println("执行完成，耗时: " + (end - start) + "ms");
        
        return result;
    }
}

// 使用
@Service
public class UserService {
    
    @Log
    public User getUserById(Long id) {
        return userDao.findById(id);
    }
}
```

**权限校验**
```java
@Aspect
@Component
public class AuthAspect {
    
    @Before("@annotation(requiresPermission)")
    public void checkPermission(JoinPoint joinPoint, RequiresPermission requiresPermission) {
        String permission = requiresPermission.value();
        
        // 获取当前用户
        User currentUser = getCurrentUser();
        
        // 检查权限
        if (!currentUser.hasPermission(permission)) {
            throw new AccessDeniedException("无权限访问");
        }
    }
}

// 使用
@Service
public class UserService {
    
    @RequiresPermission("user:delete")
    public void deleteUser(Long id) {
        userDao.deleteById(id);
    }
}
```

## 事务管理

### 声明式事务

```java
@Configuration
@EnableTransactionManagement
public class AppConfig {
    
    @Bean
    public DataSource dataSource() {
        // 配置数据源
    }
    
    @Bean
    public PlatformTransactionManager transactionManager() {
        return new DataSourceTransactionManager(dataSource());
    }
}

@Service
public class UserService {
    
    @Transactional
    public void createUser(User user) {
        userDao.insert(user);
        // 如果发生异常，事务会回滚
    }
    
    @Transactional(
        propagation = Propagation.REQUIRED,
        isolation = Isolation.READ_COMMITTED,
        timeout = 30,
        rollbackFor = Exception.class,
        noRollbackFor = IllegalArgumentException.class
    )
    public void updateUser(User user) {
        userDao.update(user);
    }
}
```

### 事务传播行为

```java
// REQUIRED - 如果当前存在事务，则加入该事务；如果不存在，则创建新事务（默认）
@Transactional(propagation = Propagation.REQUIRED)

// REQUIRES_NEW - 创建新事务，如果当前存在事务，则挂起当前事务
@Transactional(propagation = Propagation.REQUIRES_NEW)

// SUPPORTS - 如果当前存在事务，则加入该事务；如果不存在，则以非事务方式执行
@Transactional(propagation = Propagation.SUPPORTS)

// NOT_SUPPORTED - 以非事务方式执行，如果当前存在事务，则挂起当前事务
@Transactional(propagation = Propagation.NOT_SUPPORTED)

// MANDATORY - 如果当前存在事务，则加入该事务；如果不存在，则抛出异常
@Transactional(propagation = Propagation.MANDATORY)

// NEVER - 以非事务方式执行，如果当前存在事务，则抛出异常
@Transactional(propagation = Propagation.NEVER)

// NESTED - 如果当前存在事务，则在嵌套事务内执行
@Transactional(propagation = Propagation.NESTED)
```

### 事务隔离级别

```java
// DEFAULT - 使用数据库默认隔离级别
@Transactional(isolation = Isolation.DEFAULT)

// READ_UNCOMMITTED - 读未提交
@Transactional(isolation = Isolation.READ_UNCOMMITTED)

// READ_COMMITTED - 读已提交
@Transactional(isolation = Isolation.READ_COMMITTED)

// REPEATABLE_READ - 可重复读
@Transactional(isolation = Isolation.REPEATABLE_READ)

// SERIALIZABLE - 串行化
@Transactional(isolation = Isolation.SERIALIZABLE)
```

## Spring 常用注解

### 组件注解

```java
@Component      // 通用组件
@Service        // 服务层
@Repository     // 数据访问层
@Controller     // 控制层
@RestController // REST控制层
@Configuration  // 配置类
```

### 依赖注入注解

```java
@Autowired      // 自动装配
@Resource       // 按名称注入
@Qualifier      // 指定Bean名称
@Value          // 注入配置值
@Primary        // 优先注入
```

### 配置注解

```java
@Bean           // 定义Bean
@Scope          // 作用域
@Lazy           // 延迟加载
@DependsOn      // 依赖关系
@Conditional    // 条件注入
@Profile        // 环境配置
```

### AOP注解

```java
@Aspect         // 切面
@Pointcut       // 切入点
@Before         // 前置通知
@After          // 后置通知
@AfterReturning // 返回通知
@AfterThrowing  // 异常通知
@Around         // 环绕通知
```

### 事务注解

```java
@Transactional  // 声明式事务
@EnableTransactionManagement // 启用事务管理
```

## 最佳实践

1. **优先使用注解配置** - 简洁明了
2. **合理使用作用域** - 根据需求选择
3. **避免循环依赖** - 使用@Lazy或重构代码
4. **事务粒度要小** - 避免长事务
5. **合理使用AOP** - 不要过度使用
6. **注意事务失效** - 同类方法调用、非public方法
7. **使用接口编程** - 便于测试和扩展

## 总结

Spring Framework 是 Java 企业级开发的基石：

- ✅ IOC容器 - 依赖注入，降低耦合
- ✅ AOP支持 - 横切关注点分离
- ✅ 事务管理 - 声明式事务
- ✅ 丰富的生态 - 完整的解决方案
- ✅ 活跃的社区 - 持续更新

掌握 Spring 是 Java 开发者的必备技能。

## 参考资源

- [Spring官方文档](https://spring.io/projects/spring-framework)
- [Spring实战](https://book.douban.com/subject/34949443/)
- [Spring源码深度解析](https://book.douban.com/subject/25866350/)
