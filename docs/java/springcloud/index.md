# Spring Cloud

## 概述

Spring Cloud 是一套基于 Spring Boot 的微服务架构解决方案，提供了服务注册与发现、配置中心、网关、负载均衡、熔断器等一系列组件。

### 微服务架构

```
                    ┌─────────────┐
                    │   Gateway   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐
│  Service A    │  │  Service B    │  │  Service C    │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Nacos     │
                    │ (注册中心)   │
                    └─────────────┘
```

### 主要组件

| 组件 | 说明 | 推荐方案 |
|------|------|----------|
| 服务注册与发现 | 服务的注册与发现 | Nacos |
| 配置中心 | 统一配置管理 | Nacos |
| 服务网关 | 路由、鉴权、限流 | Gateway |
| 负载均衡 | 客户端负载均衡 | LoadBalancer |
| 服务调用 | 声明式 HTTP 客户端 | OpenFeign |
| 熔断降级 | 服务保护 | Sentinel |
| 分布式事务 | 事务一致性 | Seata |

### 版本对应关系

| Spring Cloud | Spring Cloud Alibaba | Spring Boot |
|--------------|---------------------|-------------|
| 2022.0.x | 2022.0.0.0 | 3.0.x |
| 2021.0.x | 2021.0.5.0 | 2.6.x - 2.7.x |
| 2020.0.x | 2021.1 | 2.4.x - 2.5.x |

## 快速开始

### 父 POM 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>microservice-demo</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>
    
    <modules>
        <module>gateway</module>
        <module>user-service</module>
        <module>order-service</module>
        <module>common</module>
    </modules>
    
    <properties>
        <java.version>17</java.version>
        <spring-boot.version>2.7.18</spring-boot.version>
        <spring-cloud.version>2021.0.5</spring-cloud.version>
        <spring-cloud-alibaba.version>2021.0.5.0</spring-cloud-alibaba.version>
    </properties>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

### 项目结构

```
microservice-demo/
├── gateway/                    # 网关服务
│   ├── src/
│   └── pom.xml
├── user-service/               # 用户服务
│   ├── src/
│   └── pom.xml
├── order-service/              # 订单服务
│   ├── src/
│   └── pom.xml
├── common/                     # 公共模块
│   ├── src/
│   └── pom.xml
└── pom.xml                     # 父 POM
```

## LoadBalancer 负载均衡

### Maven 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

### 使用 RestTemplate

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    @LoadBalanced  // 启用负载均衡
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

@Service
public class OrderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public User getUser(Long id) {
        // 使用服务名调用
        return restTemplate.getForObject(
            "http://user-service/user/" + id, 
            User.class
        );
    }
}
```

### 自定义负载均衡策略

```java
public class CustomLoadBalancer implements ReactorServiceInstanceLoadBalancer {
    
    private final String serviceId;
    private final ObjectProvider<ServiceInstanceListSupplier> provider;
    
    public CustomLoadBalancer(ObjectProvider<ServiceInstanceListSupplier> provider, 
                              String serviceId) {
        this.serviceId = serviceId;
        this.provider = provider;
    }
    
    @Override
    public Mono<Response<ServiceInstance>> choose(Request request) {
        ServiceInstanceListSupplier supplier = provider
            .getIfAvailable(NoopServiceInstanceListSupplier::new);
        return supplier.get(request)
            .next()
            .map(this::getInstanceResponse);
    }
    
    private Response<ServiceInstance> getInstanceResponse(List<ServiceInstance> instances) {
        if (instances.isEmpty()) {
            return new EmptyResponse();
        }
        // 随机选择
        ServiceInstance instance = instances.get(
            ThreadLocalRandom.current().nextInt(instances.size())
        );
        return new DefaultResponse(instance);
    }
}

// 配置
@Configuration
@LoadBalancerClient(name = "user-service", configuration = CustomLoadBalancerConfig.class)
public class CustomLoadBalancerConfig {
    
    @Bean
    public ReactorLoadBalancer<ServiceInstance> customLoadBalancer(
            Environment environment,
            LoadBalancerClientFactory loadBalancerClientFactory) {
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        return new CustomLoadBalancer(
            loadBalancerClientFactory.getLazyProvider(name, ServiceInstanceListSupplier.class),
            name
        );
    }
}
```

## 链路追踪

### Sleuth + Zipkin

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-sleuth-zipkin</artifactId>
</dependency>
```

```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0  # 采样率
  zipkin:
    base-url: http://localhost:9411
    sender:
      type: web
```

### Micrometer Tracing（Spring Boot 3.x）

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>
```

```yaml
management:
  tracing:
    sampling:
      probability: 1.0
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
```

## 常用注解总结

| 注解 | 说明 |
|------|------|
| @EnableDiscoveryClient | 启用服务发现 |
| @EnableFeignClients | 启用 Feign 客户端 |
| @FeignClient | 声明 Feign 客户端 |
| @LoadBalanced | 启用负载均衡 |
| @RefreshScope | 配置自动刷新 |
| @SentinelResource | Sentinel 资源定义 |
| @GlobalTransactional | Seata 全局事务 |

## 相关文档

本文档包含以下 Spring Cloud 组件的详细说明：

- **[Nacos](#nacos)** - 服务注册与配置中心
- **[Sentinel](#sentinel)** - 熔断降级与流量控制
- **[Gateway](#gateway)** - 服务网关
- **[OpenFeign](#openfeign)** - 声明式服务调用
- **[Seata](#seata)** - 分布式事务

---

# Nacos

## 概述

Nacos（Dynamic Naming and Configuration Service）是阿里巴巴开源的服务注册与配置中心，支持服务发现、配置管理和服务管理。

### 核心功能

- 服务注册与发现
- 动态配置管理
- 动态 DNS 服务
- 服务及其元数据管理

## 安装部署

### 下载安装

```bash
# 下载地址
# https://github.com/alibaba/nacos/releases

# 解压后进入 bin 目录

# Windows 单机启动
startup.cmd -m standalone

# Linux 单机启动
sh startup.sh -m standalone

# 访问控制台
# http://localhost:8848/nacos
# 默认账号密码：nacos/nacos
```

### Docker 部署

```bash
docker run -d \
  --name nacos \
  -e MODE=standalone \
  -p 8848:8848 \
  -p 9848:9848 \
  nacos/nacos-server:v2.2.3
```

## 服务注册与发现

### Maven 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

### 配置文件

```yaml
spring:
  application:
    name: user-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        namespace: dev
        group: DEFAULT_GROUP
```

### 启用服务发现

```java
@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

## 配置中心

### Maven 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```

### bootstrap.yml

```yaml
spring:
  application:
    name: user-service
  profiles:
    active: dev
  cloud:
    nacos:
      config:
        server-addr: localhost:8848
        file-extension: yaml
        namespace: dev
        group: DEFAULT_GROUP
```

### 读取配置

```java
@RestController
@RefreshScope
public class ConfigController {
    
    @Value("${app.name:default}")
    private String appName;
    
    @GetMapping("/config")
    public String getConfig() {
        return appName;
    }
}
```

---

# Sentinel

## 概述

Sentinel 是阿里巴巴开源的流量控制组件，提供流量控制、熔断降级、系统负载保护等功能。

### 核心功能

- 流量控制：QPS、线程数限流
- 熔断降级：慢调用、异常比例、异常数
- 热点参数限流
- 系统自适应保护

## 快速开始

### Maven 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

### 配置

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080
        port: 8719
      eager: true
```

## 流量控制

### @SentinelResource 注解

```java
@RestController
public class UserController {
    
    @GetMapping("/user/{id}")
    @SentinelResource(
        value = "getUser",
        blockHandler = "getUserBlockHandler",
        fallback = "getUserFallback"
    )
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
    
    public User getUserBlockHandler(Long id, BlockException ex) {
        return new User(-1L, "系统繁忙");
    }
    
    public User getUserFallback(Long id, Throwable ex) {
        return new User(-1L, "服务异常");
    }
}
```

---

# Gateway

## 概述

Spring Cloud Gateway 是 Spring Cloud 官方推出的网关组件，基于 WebFlux 响应式编程。

### 核心概念

- Route（路由）：网关的基本构建块
- Predicate（断言）：匹配请求的条件
- Filter（过滤器）：对请求和响应进行处理

## 快速开始

### Maven 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

### 基本配置

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=1
```

## 全局过滤器

```java
@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }
    
    @Override
    public int getOrder() {
        return -100;
    }
}
```

---

# OpenFeign

## 概述

OpenFeign 是一个声明式的 HTTP 客户端，简化了微服务之间的通信。

## 快速开始

### Maven 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

### 启用 Feign

```java
@SpringBootApplication
@EnableFeignClients
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

### 定义 Feign 客户端

```java
@FeignClient(name = "user-service")
public interface UserClient {
    
    @GetMapping("/user/{id}")
    User getUser(@PathVariable("id") Long id);
    
    @PostMapping("/user")
    User createUser(@RequestBody User user);
}
```

### 使用

```java
@Service
public class OrderService {
    
    @Autowired
    private UserClient userClient;
    
    public Order createOrder(Long userId) {
        User user = userClient.getUser(userId);
        // 业务逻辑
        return order;
    }
}
```

---

# Seata

## 概述

Seata 是阿里巴巴开源的分布式事务解决方案。

### 核心概念

- TC（Transaction Coordinator）：事务协调器
- TM（Transaction Manager）：事务管理器
- RM（Resource Manager）：资源管理器

### 事务模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| AT | 自动补偿，无侵入 | 大多数业务场景 |
| TCC | Try-Confirm-Cancel | 高性能场景 |
| SAGA | 长事务 | 业务流程长 |
| XA | 强一致性 | 传统数据库 |

## 快速开始

### Maven 依赖

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
```

### 配置

```yaml
seata:
  enabled: true
  application-id: ${spring.application.name}
  tx-service-group: my_tx_group
  config:
    type: nacos
    nacos:
      server-addr: localhost:8848
  registry:
    type: nacos
    nacos:
      server-addr: localhost:8848
```

### 使用

```java
@Service
public class OrderService {
    
    @GlobalTransactional(rollbackFor = Exception.class)
    public void createOrder(OrderDTO orderDTO) {
        // 1. 创建订单
        orderMapper.insert(order);
        
        // 2. 扣减库存
        stockClient.decrease(orderDTO.getProductId(), orderDTO.getCount());
        
        // 3. 扣减余额
        accountClient.decrease(orderDTO.getUserId(), orderDTO.getMoney());
    }
}
```
