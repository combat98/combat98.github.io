# SpringMVC

## 概述

SpringMVC 是 Spring 框架中的 Web 模块，基于 MVC（Model-View-Controller）设计模式，用于构建 Web 应用程序。

### 核心特点

- 与 Spring 框架无缝集成
- 基于注解的配置，简洁高效
- 支持 RESTful 风格
- 灵活的数据绑定和验证
- 强大的异常处理机制

### MVC 架构

```
┌─────────────────────────────────────────────────────┐
│                     浏览器                           │
└─────────────────────────────────────────────────────┘
                         ↓ ↑
┌─────────────────────────────────────────────────────┐
│              DispatcherServlet（前端控制器）          │
└─────────────────────────────────────────────────────┘
        ↓                ↓                ↓
┌───────────┐    ┌───────────┐    ┌───────────┐
│ Controller │ → │   Model   │ → │   View    │
└───────────┘    └───────────┘    └───────────┘
```

## 快速开始

### Maven 依赖

```xml
<dependencies>
    <!-- Spring MVC -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.3.30</version>
    </dependency>
    
    <!-- Servlet API -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
        <scope>provided</scope>
    </dependency>
    
    <!-- Jackson（JSON 支持）-->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.15.2</version>
    </dependency>
</dependencies>
```

### web.xml 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!-- 配置 DispatcherServlet -->
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:springmvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
    
    <!-- 字符编码过滤器 -->
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <param-name>forceEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

### SpringMVC 配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context
           http://www.springframework.org/schema/context/spring-context.xsd
           http://www.springframework.org/schema/mvc
           http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!-- 组件扫描 -->
    <context:component-scan base-package="com.example.controller"/>
    
    <!-- 开启 MVC 注解驱动 -->
    <mvc:annotation-driven/>
    
    <!-- 视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
    
    <!-- 静态资源处理 -->
    <mvc:resources mapping="/static/**" location="/static/"/>
    <mvc:default-servlet-handler/>
</beans>
```

### Java 配置方式

```java
@Configuration
@EnableWebMvc
@ComponentScan("com.example.controller")
public class WebConfig implements WebMvcConfigurer {
    
    // 视图解析器
    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
    
    // 静态资源处理
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("/static/");
    }
    
    // 默认 Servlet 处理
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }
}
```

## 控制器

### @Controller 和 @RestController

```java
// 传统控制器，返回视图
@Controller
public class ViewController {
    
    @RequestMapping("/hello")
    public String hello() {
        return "hello";  // 返回视图名
    }
}

// REST 控制器，返回数据
@RestController  // 等同于 @Controller + @ResponseBody
public class ApiController {
    
    @RequestMapping("/api/hello")
    public String hello() {
        return "Hello World";  // 直接返回数据
    }
}
```

### @RequestMapping

```java
@Controller
@RequestMapping("/user")  // 类级别映射
public class UserController {
    
    // 基本映射
    @RequestMapping("/list")
    public String list() {
        return "user/list";
    }
    
    // 指定请求方法
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public String add() {
        return "user/add";
    }
    
    // 简化注解
    @GetMapping("/detail")     // GET 请求
    @PostMapping("/save")      // POST 请求
    @PutMapping("/update")     // PUT 请求
    @DeleteMapping("/delete")  // DELETE 请求
    @PatchMapping("/patch")    // PATCH 请求
}
```

### 请求映射条件

```java
@Controller
public class MappingController {
    
    // params 条件
    @GetMapping(value = "/test", params = "id")
    public String withParam() {
        return "test";
    }
    
    // headers 条件
    @GetMapping(value = "/test", headers = "X-Custom-Header")
    public String withHeader() {
        return "test";
    }
    
    // consumes 条件（请求内容类型）
    @PostMapping(value = "/test", consumes = "application/json")
    public String consumeJson() {
        return "test";
    }
    
    // produces 条件（响应内容类型）
    @GetMapping(value = "/test", produces = "application/json")
    public String produceJson() {
        return "test";
    }
}
```

## 参数绑定

### 基本参数

```java
@RestController
public class ParamController {
    
    // 直接绑定（参数名匹配）
    @GetMapping("/test1")
    public String test1(String name, Integer age) {
        return "name=" + name + ", age=" + age;
    }
    
    // @RequestParam 注解
    @GetMapping("/test2")
    public String test2(
            @RequestParam("userName") String name,
            @RequestParam(value = "age", required = false, defaultValue = "0") Integer age) {
        return "name=" + name + ", age=" + age;
    }
}
```

### 路径变量

```java
@RestController
public class PathController {
    
    // 单个路径变量
    @GetMapping("/user/{id}")
    public String getUser(@PathVariable Long id) {
        return "User ID: " + id;
    }
    
    // 多个路径变量
    @GetMapping("/user/{userId}/order/{orderId}")
    public String getOrder(
            @PathVariable Long userId,
            @PathVariable Long orderId) {
        return "User: " + userId + ", Order: " + orderId;
    }
}
```

### 对象绑定

```java
// 实体类
public class User {
    private Long id;
    private String name;
    private Integer age;
    // getter/setter
}

@RestController
public class ObjectController {
    
    // 表单数据绑定到对象
    @PostMapping("/user/save")
    public String save(User user) {
        return "Saved: " + user.getName();
    }
    
    // JSON 数据绑定到对象
    @PostMapping("/user/create")
    public String create(@RequestBody User user) {
        return "Created: " + user.getName();
    }
}
```

### 集合参数

```java
@RestController
public class CollectionController {
    
    // 数组参数
    @GetMapping("/test/array")
    public String array(@RequestParam("ids") Long[] ids) {
        return Arrays.toString(ids);
    }
    
    // List 参数
    @GetMapping("/test/list")
    public String list(@RequestParam("ids") List<Long> ids) {
        return ids.toString();
    }
    
    // JSON 数组
    @PostMapping("/test/json-list")
    public String jsonList(@RequestBody List<User> users) {
        return "Count: " + users.size();
    }
}
```

### 日期参数

```java
@RestController
public class DateController {
    
    // 单个参数格式化
    @GetMapping("/test/date")
    public String date(@DateTimeFormat(pattern = "yyyy-MM-dd") Date date) {
        return date.toString();
    }
    
    // LocalDateTime
    @GetMapping("/test/datetime")
    public String datetime(
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime dateTime) {
        return dateTime.toString();
    }
}

// 全局日期格式配置
@Configuration
public class DateConfig implements WebMvcConfigurer {
    
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new DateFormatter("yyyy-MM-dd"));
    }
}
```

### 请求头和 Cookie

```java
@RestController
public class HeaderController {
    
    // 获取请求头
    @GetMapping("/test/header")
    public String header(@RequestHeader("User-Agent") String userAgent) {
        return userAgent;
    }
    
    // 获取 Cookie
    @GetMapping("/test/cookie")
    public String cookie(@CookieValue("JSESSIONID") String sessionId) {
        return sessionId;
    }
}
```

## 响应处理

### 返回视图

```java
@Controller
public class ViewController {
    
    // 返回视图名
    @GetMapping("/page1")
    public String page1() {
        return "page1";
    }
    
    // 使用 ModelAndView
    @GetMapping("/page2")
    public ModelAndView page2() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("page2");
        mv.addObject("message", "Hello");
        return mv;
    }
    
    // 重定向
    @GetMapping("/redirect")
    public String redirect() {
        return "redirect:/target";
    }
    
    // 转发
    @GetMapping("/forward")
    public String forward() {
        return "forward:/target";
    }
}
```

### 返回 JSON

```java
@RestController
public class JsonController {
    
    // 返回对象（自动转 JSON）
    @GetMapping("/user/{id}")
    public User getUser(@PathVariable Long id) {
        User user = new User();
        user.setId(id);
        user.setName("张三");
        return user;
    }
    
    // 返回集合
    @GetMapping("/users")
    public List<User> getUsers() {
        return Arrays.asList(
            new User(1L, "张三"),
            new User(2L, "李四")
        );
    }
    
    // 返回 Map
    @GetMapping("/map")
    public Map<String, Object> getMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("code", 200);
        map.put("message", "success");
        return map;
    }
}
```

### ResponseEntity

```java
@RestController
public class ResponseEntityController {
    
    @GetMapping("/user/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/user")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userService.save(user);
        URI location = URI.create("/user/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }
    
    // 自定义响应头
    @GetMapping("/custom")
    public ResponseEntity<String> custom() {
        return ResponseEntity.ok()
                .header("X-Custom-Header", "value")
                .body("Hello");
    }
}
```

### 统一响应格式

```java
// 统一响应类
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }
    
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
}

// 使用
@RestController
public class ApiController {
    
    @GetMapping("/user/{id}")
    public Result<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return Result.success(user);
    }
}
```

## 数据校验

### 添加依赖

```xml
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.2.5.Final</version>
</dependency>
```

### 校验注解

```java
public class User {
    
    @NotNull(message = "ID不能为空")
    private Long id;
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度2-20")
    private String name;
    
    @NotNull(message = "年龄不能为空")
    @Min(value = 0, message = "年龄不能小于0")
    @Max(value = 150, message = "年龄不能大于150")
    private Integer age;
    
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
}
```

### 使用校验

```java
@RestController
public class ValidController {
    
    // @Valid 或 @Validated 触发校验
    @PostMapping("/user")
    public Result<User> createUser(@Valid @RequestBody User user) {
        return Result.success(user);
    }
    
    // 获取校验结果
    @PostMapping("/user2")
    public Result<?> createUser2(
            @Valid @RequestBody User user,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String message = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            return Result.error(400, message);
        }
        return Result.success(user);
    }
}
```

### 分组校验

```java
// 定义分组
public interface CreateGroup {}
public interface UpdateGroup {}

// 实体类
public class User {
    
    @Null(groups = CreateGroup.class, message = "新增时ID必须为空")
    @NotNull(groups = UpdateGroup.class, message = "更新时ID不能为空")
    private Long id;
    
    @NotBlank(groups = {CreateGroup.class, UpdateGroup.class})
    private String name;
}

// 使用
@RestController
public class GroupValidController {
    
    @PostMapping("/user")
    public Result<User> create(
            @Validated(CreateGroup.class) @RequestBody User user) {
        return Result.success(user);
    }
    
    @PutMapping("/user")
    public Result<User> update(
            @Validated(UpdateGroup.class) @RequestBody User user) {
        return Result.success(user);
    }
}
```

## 异常处理

### @ExceptionHandler

```java
@Controller
public class UserController {
    
    @GetMapping("/user/{id}")
    public String getUser(@PathVariable Long id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID必须大于0");
        }
        return "user";
    }
    
    // 局部异常处理
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseBody
    public Result<?> handleIllegalArgument(IllegalArgumentException e) {
        return Result.error(400, e.getMessage());
    }
}
```

### @ControllerAdvice 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    // 处理参数校验异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<?> handleValidException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return Result.error(400, message);
    }
    
    // 处理业务异常
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        return Result.error(e.getCode(), e.getMessage());
    }
    
    // 处理其他异常
    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        return Result.error(500, "服务器内部错误");
    }
}

// 自定义业务异常
public class BusinessException extends RuntimeException {
    private Integer code;
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    public Integer getCode() {
        return code;
    }
}
```

## 拦截器

### 定义拦截器

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {
    
    // 请求处理前
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            response.getWriter().write("Unauthorized");
            return false;  // 拦截请求
        }
        return true;  // 放行
    }
    
    // 请求处理后，视图渲染前
    @Override
    public void postHandle(HttpServletRequest request, 
                          HttpServletResponse response, 
                          Object handler, 
                          ModelAndView modelAndView) throws Exception {
        // 可以修改 ModelAndView
    }
    
    // 请求完成后
    @Override
    public void afterCompletion(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler, 
                               Exception ex) throws Exception {
        // 清理资源
    }
}
```

### 注册拦截器

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private AuthInterceptor authInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .addPathPatterns("/api/**")      // 拦截路径
                .excludePathPatterns("/api/login", "/api/register");  // 排除路径
    }
}
```

### 多个拦截器执行顺序

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 按注册顺序执行
        registry.addInterceptor(new LogInterceptor()).order(1);
        registry.addInterceptor(new AuthInterceptor()).order(2);
    }
}

// 执行顺序：
// preHandle1 → preHandle2 → Controller → postHandle2 → postHandle1 → afterCompletion2 → afterCompletion1
```

## 文件上传下载

### 配置文件上传

```xml
<!-- XML 配置 -->
<bean id="multipartResolver" 
      class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <property name="maxUploadSize" value="10485760"/>  <!-- 10MB -->
    <property name="defaultEncoding" value="UTF-8"/>
</bean>
```

```java
// Java 配置
@Bean
public MultipartResolver multipartResolver() {
    CommonsMultipartResolver resolver = new CommonsMultipartResolver();
    resolver.setMaxUploadSize(10 * 1024 * 1024);  // 10MB
    resolver.setDefaultEncoding("UTF-8");
    return resolver;
}
```

### 文件上传

```java
@RestController
public class FileController {
    
    // 单文件上传
    @PostMapping("/upload")
    public Result<String> upload(@RequestParam("file") MultipartFile file) 
            throws IOException {
        if (file.isEmpty()) {
            return Result.error(400, "文件不能为空");
        }
        
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String path = "/uploads/" + filename;
        file.transferTo(new File(path));
        
        return Result.success(path);
    }
    
    // 多文件上传
    @PostMapping("/uploads")
    public Result<List<String>> uploads(@RequestParam("files") MultipartFile[] files) 
            throws IOException {
        List<String> paths = new ArrayList<>();
        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String path = "/uploads/" + filename;
            file.transferTo(new File(path));
            paths.add(path);
        }
        return Result.success(paths);
    }
}
```

### 文件下载

```java
@RestController
public class DownloadController {
    
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> download(@PathVariable String filename) 
            throws IOException {
        Path path = Paths.get("/uploads/" + filename);
        Resource resource = new UrlResource(path.toUri());
        
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }
}
```

## RESTful API

### RESTful 设计规范

| 操作 | HTTP 方法 | URL | 说明 |
|------|-----------|-----|------|
| 查询列表 | GET | /users | 获取所有用户 |
| 查询单个 | GET | /users/{id} | 获取指定用户 |
| 新增 | POST | /users | 创建用户 |
| 修改 | PUT | /users/{id} | 更新用户 |
| 删除 | DELETE | /users/{id} | 删除用户 |

### RESTful 控制器示例

```java
@RestController
@RequestMapping("/api/users")
public class UserRestController {
    
    @Autowired
    private UserService userService;
    
    // 查询列表
    @GetMapping
    public Result<List<User>> list() {
        return Result.success(userService.findAll());
    }
    
    // 查询单个
    @GetMapping("/{id}")
    public Result<User> get(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }
        return Result.success(user);
    }
    
    // 新增
    @PostMapping
    public Result<User> create(@Valid @RequestBody User user) {
        return Result.success(userService.save(user));
    }
    
    // 修改
    @PutMapping("/{id}")
    public Result<User> update(@PathVariable Long id, 
                               @Valid @RequestBody User user) {
        user.setId(id);
        return Result.success(userService.update(user));
    }
    
    // 删除
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return Result.success(null);
    }
}
```

### 配置 HiddenHttpMethodFilter

浏览器表单只支持 GET 和 POST，需要配置过滤器支持 PUT 和 DELETE：

```xml
<filter>
    <filter-name>hiddenHttpMethodFilter</filter-name>
    <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>hiddenHttpMethodFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

```html
<!-- 表单中使用 -->
<form action="/users/1" method="post">
    <input type="hidden" name="_method" value="PUT"/>
    <!-- 其他字段 -->
</form>
```

## 跨域处理

### @CrossOrigin 注解

```java
@RestController
@CrossOrigin(origins = "http://localhost:3000")  // 类级别
public class ApiController {
    
    @CrossOrigin(origins = "*")  // 方法级别
    @GetMapping("/data")
    public String getData() {
        return "data";
    }
}
```

### 全局跨域配置

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## 常用注解总结

| 注解 | 说明 |
|------|------|
| @Controller | 标识控制器类 |
| @RestController | @Controller + @ResponseBody |
| @RequestMapping | 请求映射 |
| @GetMapping | GET 请求映射 |
| @PostMapping | POST 请求映射 |
| @PutMapping | PUT 请求映射 |
| @DeleteMapping | DELETE 请求映射 |
| @RequestParam | 请求参数绑定 |
| @PathVariable | 路径变量绑定 |
| @RequestBody | 请求体绑定（JSON） |
| @ResponseBody | 响应体（返回 JSON） |
| @RequestHeader | 请求头绑定 |
| @CookieValue | Cookie 值绑定 |
| @ModelAttribute | 模型属性绑定 |
| @SessionAttributes | Session 属性 |
| @Valid / @Validated | 数据校验 |
| @ExceptionHandler | 异常处理 |
| @ControllerAdvice | 全局控制器增强 |
| @CrossOrigin | 跨域配置 |
