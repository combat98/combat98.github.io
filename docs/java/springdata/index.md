# Spring Data

## 概述

Spring Data 是 Spring 提供的数据访问框架，旨在简化数据库访问层的开发。它为不同的数据存储提供了统一的编程模型。

### Spring Data 家族

| 模块 | 说明 |
|------|------|
| Spring Data JPA | 关系型数据库 ORM |
| Spring Data Redis | Redis 缓存和数据存储 |
| Spring Data MongoDB | MongoDB 文档数据库 |
| Spring Data Elasticsearch | 全文搜索引擎 |
| Spring Data JDBC | 轻量级 JDBC 封装 |

## Spring Data JPA

### 快速开始

#### Maven 依赖

```xml
<dependencies>
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

#### 配置文件

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?useSSL=false&serverTimezone=UTC
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update  # create/create-drop/update/validate/none
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

### 实体映射

#### 基本实体

```java
@Entity
@Table(name = "t_user")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_name", length = 50, nullable = false)
    private String name;
    
    @Column(unique = true)
    private String email;
    
    private Integer age;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createTime;
    
    @Transient  // 不映射到数据库
    private String temp;
    
    // getter/setter
}
```

#### 常用注解

| 注解 | 说明 |
|------|------|
| @Entity | 标识实体类 |
| @Table | 指定表名 |
| @Id | 主键 |
| @GeneratedValue | 主键生成策略 |
| @Column | 字段映射 |
| @Transient | 不持久化字段 |
| @Temporal | 日期类型 |
| @Enumerated | 枚举类型 |

### 关联映射

#### 一对多 / 多对一

```java
@Entity
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees = new ArrayList<>();
}

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id")
    private Department department;
}
```

#### 多对多

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}
```

### Repository 接口

```java
// 基础接口
public interface UserRepository extends JpaRepository<User, Long> {
}

// JpaRepository 继承关系
// Repository
//   └── CrudRepository（基本 CRUD）
//         └── PagingAndSortingRepository（分页排序）
//               └── JpaRepository（JPA 特有方法）
```

#### 内置方法

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public void demo() {
        // 保存
        User user = new User();
        userRepository.save(user);
        userRepository.saveAll(List.of(user1, user2));
        
        // 查询
        Optional<User> user = userRepository.findById(1L);
        List<User> users = userRepository.findAll();
        boolean exists = userRepository.existsById(1L);
        long count = userRepository.count();
        
        // 删除
        userRepository.deleteById(1L);
        userRepository.delete(user);
        userRepository.deleteAll();
        
        // 分页排序
        Page<User> page = userRepository.findAll(PageRequest.of(0, 10));
        List<User> users = userRepository.findAll(Sort.by("name").ascending());
    }
}
```

### 方法名查询

```java
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 根据属性查询
    User findByName(String name);
    List<User> findByAge(Integer age);
    
    // And / Or
    List<User> findByNameAndAge(String name, Integer age);
    List<User> findByNameOrEmail(String name, String email);
    
    // 比较
    List<User> findByAgeGreaterThan(Integer age);
    List<User> findByAgeLessThanEqual(Integer age);
    List<User> findByAgeBetween(Integer min, Integer max);
    
    // Like
    List<User> findByNameLike(String name);  // 需要自己加 %
    List<User> findByNameContaining(String name);  // 自动加 %name%
    List<User> findByNameStartingWith(String name);  // name%
    
    // In / NotIn
    List<User> findByAgeIn(Collection<Integer> ages);
    
    // Null
    List<User> findByEmailIsNull();
    List<User> findByEmailIsNotNull();
    
    // 排序
    List<User> findByAgeOrderByNameAsc(Integer age);
    
    // 限制结果
    User findFirstByOrderByAgeDesc();
    List<User> findTop3ByOrderByAgeDesc();
    
    // 分页
    Page<User> findByAge(Integer age, Pageable pageable);
}
```

### @Query 自定义查询

```java
public interface UserRepository extends JpaRepository<User, Long> {
    
    // JPQL 查询
    @Query("SELECT u FROM User u WHERE u.name = ?1")
    User findByNameJpql(String name);
    
    // 命名参数
    @Query("SELECT u FROM User u WHERE u.name = :name AND u.age = :age")
    User findByNameAndAge(@Param("name") String name, @Param("age") Integer age);
    
    // 原生 SQL
    @Query(value = "SELECT * FROM t_user WHERE name = ?1", nativeQuery = true)
    User findByNameNative(String name);
    
    // 更新操作
    @Modifying
    @Query("UPDATE User u SET u.name = :name WHERE u.id = :id")
    int updateName(@Param("id") Long id, @Param("name") String name);
    
    // 删除操作
    @Modifying
    @Query("DELETE FROM User u WHERE u.age < :age")
    int deleteByAgeLessThan(@Param("age") Integer age);
}
```

### 分页和排序

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<User> findPage(int page, int size) {
        // 创建分页请求
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable);
    }
    
    public Page<User> findPageWithSort(int page, int size) {
        // 分页 + 排序
        Sort sort = Sort.by(Sort.Direction.DESC, "createTime");
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable);
    }
    
    public List<User> findWithSort() {
        // 多字段排序
        Sort sort = Sort.by(
            Sort.Order.desc("age"),
            Sort.Order.asc("name")
        );
        return userRepository.findAll(sort);
    }
}
```

### Specification 动态查询

```java
// 启用 JpaSpecificationExecutor
public interface UserRepository extends JpaRepository<User, Long>, 
                                        JpaSpecificationExecutor<User> {
}

// 使用 Specification
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> findByCondition(String name, Integer minAge, Integer maxAge) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(root.get("name"), "%" + name + "%"));
            }
            if (minAge != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("age"), minAge));
            }
            if (maxAge != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("age"), maxAge));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        
        return userRepository.findAll(spec);
    }
}
```

## Spring Data Redis

### 快速开始

#### Maven 依赖

```xml
<dependencies>
    <!-- Spring Data Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    
    <!-- Lettuce 客户端（默认） -->
    <dependency>
        <groupId>io.lettuce</groupId>
        <artifactId>lettuce-core</artifactId>
    </dependency>
    
    <!-- 或使用 Jedis 客户端 -->
    <!--
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
    </dependency>
    -->
    
    <!-- JSON 序列化 -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
</dependencies>
```

#### 配置文件

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: 
    database: 0
    timeout: 3000ms
    lettuce:
      pool:
        max-active: 8    # 最大连接数
        max-idle: 8      # 最大空闲连接
        min-idle: 0      # 最小空闲连接
        max-wait: -1ms   # 最大等待时间
```

#### Redis 配置类

```java
@Configuration
public class RedisConfig {
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        
        // JSON 序列化配置
        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper mapper = new ObjectMapper();
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        mapper.activateDefaultTyping(
            LaissezFaireSubTypeValidator.instance,
            ObjectMapper.DefaultTyping.NON_FINAL
        );
        serializer.setObjectMapper(mapper);
        
        // String 序列化
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        
        // key 采用 String 序列化
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        
        // value 采用 JSON 序列化
        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);
        
        template.afterPropertiesSet();
        return template;
    }
}
```

### RedisTemplate 基本操作

#### String 操作

```java
@Service
public class RedisService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 设置值
    public void set(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }
    
    // 设置值并指定过期时间
    public void setWithExpire(String key, Object value, long timeout, TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }
    
    // 获取值
    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }
    
    // 自增
    public Long increment(String key) {
        return redisTemplate.opsForValue().increment(key);
    }
    
    // 自增指定值
    public Long incrementBy(String key, long delta) {
        return redisTemplate.opsForValue().increment(key, delta);
    }
    
    // 自减
    public Long decrement(String key) {
        return redisTemplate.opsForValue().decrement(key);
    }
    
    // 批量设置
    public void multiSet(Map<String, Object> map) {
        redisTemplate.opsForValue().multiSet(map);
    }
    
    // 批量获取
    public List<Object> multiGet(Collection<String> keys) {
        return redisTemplate.opsForValue().multiGet(keys);
    }
}
```

#### Hash 操作

```java
@Service
public class RedisHashService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 设置 Hash 字段
    public void hSet(String key, String field, Object value) {
        redisTemplate.opsForHash().put(key, field, value);
    }
    
    // 获取 Hash 字段
    public Object hGet(String key, String field) {
        return redisTemplate.opsForHash().get(key, field);
    }
    
    // 批量设置
    public void hSetAll(String key, Map<String, Object> map) {
        redisTemplate.opsForHash().putAll(key, map);
    }
    
    // 获取所有字段
    public Map<Object, Object> hGetAll(String key) {
        return redisTemplate.opsForHash().entries(key);
    }
    
    // 删除字段
    public Long hDelete(String key, Object... fields) {
        return redisTemplate.opsForHash().delete(key, fields);
    }
    
    // 判断字段是否存在
    public Boolean hExists(String key, String field) {
        return redisTemplate.opsForHash().hasKey(key, field);
    }
    
    // 字段自增
    public Long hIncrement(String key, String field, long delta) {
        return redisTemplate.opsForHash().increment(key, field, delta);
    }
}
```

#### List 操作

```java
@Service
public class RedisListService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 左侧插入
    public Long leftPush(String key, Object value) {
        return redisTemplate.opsForList().leftPush(key, value);
    }
    
    // 右侧插入
    public Long rightPush(String key, Object value) {
        return redisTemplate.opsForList().rightPush(key, value);
    }
    
    // 批量右侧插入
    public Long rightPushAll(String key, Object... values) {
        return redisTemplate.opsForList().rightPushAll(key, values);
    }
    
    // 左侧弹出
    public Object leftPop(String key) {
        return redisTemplate.opsForList().leftPop(key);
    }
    
    // 右侧弹出
    public Object rightPop(String key) {
        return redisTemplate.opsForList().rightPop(key);
    }
    
    // 获取列表长度
    public Long size(String key) {
        return redisTemplate.opsForList().size(key);
    }
    
    // 获取范围内的元素
    public List<Object> range(String key, long start, long end) {
        return redisTemplate.opsForList().range(key, start, end);
    }
    
    // 根据索引获取元素
    public Object index(String key, long index) {
        return redisTemplate.opsForList().index(key, index);
    }
}
```

#### Set 操作

```java
@Service
public class RedisSetService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 添加元素
    public Long add(String key, Object... values) {
        return redisTemplate.opsForSet().add(key, values);
    }
    
    // 移除元素
    public Long remove(String key, Object... values) {
        return redisTemplate.opsForSet().remove(key, values);
    }
    
    // 随机弹出元素
    public Object pop(String key) {
        return redisTemplate.opsForSet().pop(key);
    }
    
    // 获取集合大小
    public Long size(String key) {
        return redisTemplate.opsForSet().size(key);
    }
    
    // 判断元素是否存在
    public Boolean isMember(String key, Object value) {
        return redisTemplate.opsForSet().isMember(key, value);
    }
    
    // 获取所有元素
    public Set<Object> members(String key) {
        return redisTemplate.opsForSet().members(key);
    }
    
    // 交集
    public Set<Object> intersect(String key, String otherKey) {
        return redisTemplate.opsForSet().intersect(key, otherKey);
    }
    
    // 并集
    public Set<Object> union(String key, String otherKey) {
        return redisTemplate.opsForSet().union(key, otherKey);
    }
    
    // 差集
    public Set<Object> difference(String key, String otherKey) {
        return redisTemplate.opsForSet().difference(key, otherKey);
    }
}
```

#### ZSet 有序集合操作

```java
@Service
public class RedisZSetService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 添加元素
    public Boolean add(String key, Object value, double score) {
        return redisTemplate.opsForZSet().add(key, value, score);
    }
    
    // 批量添加
    public Long addAll(String key, Set<ZSetOperations.TypedTuple<Object>> tuples) {
        return redisTemplate.opsForZSet().add(key, tuples);
    }
    
    // 移除元素
    public Long remove(String key, Object... values) {
        return redisTemplate.opsForZSet().remove(key, values);
    }
    
    // 增加分数
    public Double incrementScore(String key, Object value, double delta) {
        return redisTemplate.opsForZSet().incrementScore(key, value, delta);
    }
    
    // 获取排名（从小到大）
    public Long rank(String key, Object value) {
        return redisTemplate.opsForZSet().rank(key, value);
    }
    
    // 获取排名（从大到小）
    public Long reverseRank(String key, Object value) {
        return redisTemplate.opsForZSet().reverseRank(key, value);
    }
    
    // 获取分数
    public Double score(String key, Object value) {
        return redisTemplate.opsForZSet().score(key, value);
    }
    
    // 按分数范围获取
    public Set<Object> rangeByScore(String key, double min, double max) {
        return redisTemplate.opsForZSet().rangeByScore(key, min, max);
    }
    
    // 按排名范围获取（从小到大）
    public Set<Object> range(String key, long start, long end) {
        return redisTemplate.opsForZSet().range(key, start, end);
    }
    
    // 按排名范围获取（从大到小）
    public Set<Object> reverseRange(String key, long start, long end) {
        return redisTemplate.opsForZSet().reverseRange(key, start, end);
    }
}
```

### 通用操作

```java
@Service
public class RedisCommonService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 设置过期时间
    public Boolean expire(String key, long timeout, TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }
    
    // 设置过期时间点
    public Boolean expireAt(String key, Date date) {
        return redisTemplate.expireAt(key, date);
    }
    
    // 获取过期时间
    public Long getExpire(String key) {
        return redisTemplate.getExpire(key);
    }
    
    // 判断 key 是否存在
    public Boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }
    
    // 删除 key
    public Boolean delete(String key) {
        return redisTemplate.delete(key);
    }
    
    // 批量删除
    public Long delete(Collection<String> keys) {
        return redisTemplate.delete(keys);
    }
    
    // 模糊查询 key
    public Set<String> keys(String pattern) {
        return redisTemplate.keys(pattern);
    }
    
    // 重命名
    public void rename(String oldKey, String newKey) {
        redisTemplate.rename(oldKey, newKey);
    }
    
    // 移动到其他数据库
    public Boolean move(String key, int dbIndex) {
        return redisTemplate.move(key, dbIndex);
    }
}
```

### @Cacheable 缓存注解

#### 启用缓存

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))  // 默认过期时间
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new StringRedisSerializer()
                )
            )
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()
                )
            )
            .disableCachingNullValues();  // 不缓存 null 值
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}
```

#### 使用缓存注解

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // 查询时缓存
    @Cacheable(value = "user", key = "#id")
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    // 条件缓存
    @Cacheable(value = "user", key = "#id", condition = "#id > 0")
    public User findByIdWithCondition(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    // 更新时清除缓存
    @CachePut(value = "user", key = "#user.id")
    public User update(User user) {
        return userRepository.save(user);
    }
    
    // 删除时清除缓存
    @CacheEvict(value = "user", key = "#id")
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
    
    // 清除所有缓存
    @CacheEvict(value = "user", allEntries = true)
    public void deleteAll() {
        userRepository.deleteAll();
    }
    
    // 组合注解
    @Caching(
        cacheable = @Cacheable(value = "user", key = "#id"),
        put = @CachePut(value = "userList", key = "'all'")
    )
    public User findAndCache(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
```

### 缓存注解说明

| 注解 | 说明 |
|------|------|
| @Cacheable | 查询时缓存，如果缓存存在则直接返回 |
| @CachePut | 更新缓存，无论缓存是否存在都会执行方法 |
| @CacheEvict | 清除缓存 |
| @Caching | 组合多个缓存注解 |
| @CacheConfig | 类级别的缓存配置 |

### Redis 分布式锁

```java
@Service
public class RedisLockService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 获取锁
     * @param key 锁的 key
     * @param value 锁的值（通常使用 UUID）
     * @param timeout 过期时间
     * @param unit 时间单位
     * @return 是否获取成功
     */
    public Boolean tryLock(String key, String value, long timeout, TimeUnit unit) {
        return redisTemplate.opsForValue().setIfAbsent(key, value, timeout, unit);
    }
    
    /**
     * 释放锁
     * @param key 锁的 key
     * @param value 锁的值
     * @return 是否释放成功
     */
    public Boolean unlock(String key, String value) {
        // Lua 脚本保证原子性
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                       "return redis.call('del', KEYS[1]) else return 0 end";
        
        RedisScript<Long> redisScript = RedisScript.of(script, Long.class);
        Long result = redisTemplate.execute(redisScript, 
            Collections.singletonList(key), value);
        return result != null && result > 0;
    }
    
    /**
     * 使用分布式锁执行业务
     */
    public void executeWithLock(String lockKey, Runnable task) {
        String lockValue = UUID.randomUUID().toString();
        try {
            // 尝试获取锁，最多等待 3 秒
            if (tryLock(lockKey, lockValue, 30, TimeUnit.SECONDS)) {
                // 执行业务逻辑
                task.run();
            } else {
                throw new RuntimeException("获取锁失败");
            }
        } finally {
            // 释放锁
            unlock(lockKey, lockValue);
        }
    }
}

// 使用示例
@Service
public class OrderService {
    
    @Autowired
    private RedisLockService lockService;
    
    public void createOrder(Long productId) {
        String lockKey = "product:lock:" + productId;
        
        lockService.executeWithLock(lockKey, () -> {
            // 业务逻辑：扣减库存、创建订单等
            System.out.println("处理订单...");
        });
    }
}
```

### Redis 消息发布订阅

#### 配置监听器

```java
@Configuration
public class RedisMessageConfig {
    
    @Bean
    public RedisMessageListenerContainer container(RedisConnectionFactory factory) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(factory);
        
        // 添加监听器
        container.addMessageListener(messageListener(), 
            new PatternTopic("channel:*"));
        
        return container;
    }
    
    @Bean
    public MessageListenerAdapter messageListener() {
        return new MessageListenerAdapter(new RedisMessageSubscriber());
    }
}
```

#### 消息订阅者

```java
public class RedisMessageSubscriber implements MessageListener {
    
    @Override
    public void onMessage(Message message, byte[] pattern) {
        String channel = new String(message.getChannel());
        String body = new String(message.getBody());
        
        System.out.println("收到消息 - 频道: " + channel + ", 内容: " + body);
    }
}
```

#### 消息发布者

```java
@Service
public class RedisMessagePublisher {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public void publish(String channel, Object message) {
        redisTemplate.convertAndSend(channel, message);
    }
}

// 使用示例
@RestController
public class MessageController {
    
    @Autowired
    private RedisMessagePublisher publisher;
    
    @PostMapping("/publish")
    public String publish(@RequestParam String channel, @RequestParam String message) {
        publisher.publish(channel, message);
        return "发布成功";
    }
}
```

### Redis 管道操作

```java
@Service
public class RedisPipelineService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 批量操作使用管道提高性能
     */
    public List<Object> batchSet(Map<String, Object> data) {
        return redisTemplate.executePipelined(new SessionCallback<Object>() {
            @Override
            public Object execute(RedisOperations operations) throws DataAccessException {
                for (Map.Entry<String, Object> entry : data.entrySet()) {
                    operations.opsForValue().set(entry.getKey(), entry.getValue());
                }
                return null;
            }
        });
    }
    
    /**
     * 批量获取
     */
    public List<Object> batchGet(List<String> keys) {
        return redisTemplate.executePipelined(new SessionCallback<Object>() {
            @Override
            public Object execute(RedisOperations operations) throws DataAccessException {
                for (String key : keys) {
                    operations.opsForValue().get(key);
                }
                return null;
            }
        });
    }
}
```

### Redis 事务

```java
@Service
public class RedisTransactionService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 执行事务
     */
    public List<Object> executeTransaction() {
        return redisTemplate.execute(new SessionCallback<List<Object>>() {
            @Override
            public List<Object> execute(RedisOperations operations) throws DataAccessException {
                // 开启事务
                operations.multi();
                
                try {
                    operations.opsForValue().set("key1", "value1");
                    operations.opsForValue().set("key2", "value2");
                    operations.opsForValue().increment("counter");
                    
                    // 提交事务
                    return operations.exec();
                } catch (Exception e) {
                    // 回滚事务
                    operations.discard();
                    throw e;
                }
            }
        });
    }
    
    /**
     * 乐观锁（Watch）
     */
    public void transferWithWatch(String fromKey, String toKey, int amount) {
        redisTemplate.execute(new SessionCallback<Object>() {
            @Override
            public Object execute(RedisOperations operations) throws DataAccessException {
                // 监视 key
                operations.watch(fromKey);
                
                Integer balance = (Integer) operations.opsForValue().get(fromKey);
                if (balance < amount) {
                    operations.unwatch();
                    throw new RuntimeException("余额不足");
                }
                
                // 开启事务
                operations.multi();
                operations.opsForValue().decrement(fromKey, amount);
                operations.opsForValue().increment(toKey, amount);
                
                // 提交事务
                List<Object> result = operations.exec();
                if (result == null || result.isEmpty()) {
                    throw new RuntimeException("转账失败，请重试");
                }
                
                return result;
            }
        });
    }
}
```

## 常见应用场景

### 缓存穿透解决方案

```java
@Service
public class CacheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 缓存空对象防止缓存穿透
     */
    public User getUserById(Long id) {
        String key = "user:" + id;
        
        // 1. 查询缓存
        Object cached = redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return cached instanceof User ? (User) cached : null;
        }
        
        // 2. 查询数据库
        User user = userRepository.findById(id).orElse(null);
        
        // 3. 缓存结果（包括 null）
        if (user != null) {
            redisTemplate.opsForValue().set(key, user, 30, TimeUnit.MINUTES);
        } else {
            // 缓存空对象，设置较短过期时间
            redisTemplate.opsForValue().set(key, "", 5, TimeUnit.MINUTES);
        }
        
        return user;
    }
}
```

### 缓存雪崩解决方案

```java
@Service
public class CacheAvalancheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 随机过期时间防止缓存雪崩
     */
    public void setWithRandomExpire(String key, Object value, long baseTimeout) {
        // 基础过期时间 + 随机时间（0-300秒）
        long timeout = baseTimeout + new Random().nextInt(300);
        redisTemplate.opsForValue().set(key, value, timeout, TimeUnit.SECONDS);
    }
}
```

### 热点数据缓存

```java
@Service
public class HotDataService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 热点数据永不过期 + 逻辑过期
     */
    public Object getHotData(String key) {
        String dataKey = "hot:" + key;
        String expireKey = "hot:expire:" + key;
        
        // 获取数据
        Object data = redisTemplate.opsForValue().get(dataKey);
        if (data == null) {
            return loadAndCache(key);
        }
        
        // 检查逻辑过期时间
        Long expireTime = (Long) redisTemplate.opsForValue().get(expireKey);
        if (expireTime != null && System.currentTimeMillis() > expireTime) {
            // 异步更新缓存
            CompletableFuture.runAsync(() -> loadAndCache(key));
        }
        
        return data;
    }
    
    private Object loadAndCache(String key) {
        // 从数据库加载数据
        Object data = loadFromDatabase(key);
        
        // 缓存数据（永不过期）
        redisTemplate.opsForValue().set("hot:" + key, data);
        
        // 设置逻辑过期时间（30分钟后）
        long expireTime = System.currentTimeMillis() + 30 * 60 * 1000;
        redisTemplate.opsForValue().set("hot:expire:" + key, expireTime);
        
        return data;
    }
    
    private Object loadFromDatabase(String key) {
        // 实际业务逻辑
        return null;
    }
}
```

### 限流实现

```java
@Service
public class RateLimiterService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 固定窗口限流
     * @param key 限流 key
     * @param limit 限制次数
     * @param window 时间窗口（秒）
     * @return 是否允许访问
     */
    public boolean fixedWindowLimit(String key, int limit, int window) {
        Long count = redisTemplate.opsForValue().increment(key);
        
        if (count == 1) {
            redisTemplate.expire(key, window, TimeUnit.SECONDS);
        }
        
        return count <= limit;
    }
    
    /**
     * 滑动窗口限流（使用 ZSet）
     */
    public boolean slidingWindowLimit(String key, int limit, int window) {
        long now = System.currentTimeMillis();
        long windowStart = now - window * 1000;
        
        // 移除过期数据
        redisTemplate.opsForZSet().removeRangeByScore(key, 0, windowStart);
        
        // 统计当前窗口内的请求数
        Long count = redisTemplate.opsForZSet().zCard(key);
        
        if (count < limit) {
            // 添加当前请求
            redisTemplate.opsForZSet().add(key, UUID.randomUUID().toString(), now);
            redisTemplate.expire(key, window, TimeUnit.SECONDS);
            return true;
        }
        
        return false;
    }
    
    /**
     * 令牌桶限流（使用 Lua 脚本）
     */
    public boolean tokenBucketLimit(String key, int capacity, int rate) {
        String script = 
            "local key = KEYS[1]\n" +
            "local capacity = tonumber(ARGV[1])\n" +
            "local rate = tonumber(ARGV[2])\n" +
            "local now = tonumber(ARGV[3])\n" +
            "local tokens = tonumber(redis.call('get', key) or capacity)\n" +
            "local last_time = tonumber(redis.call('get', key .. ':time') or now)\n" +
            "local delta = math.max(0, now - last_time)\n" +
            "local new_tokens = math.min(capacity, tokens + delta * rate)\n" +
            "if new_tokens >= 1 then\n" +
            "    redis.call('set', key, new_tokens - 1)\n" +
            "    redis.call('set', key .. ':time', now)\n" +
            "    return 1\n" +
            "else\n" +
            "    return 0\n" +
            "end";
        
        RedisScript<Long> redisScript = RedisScript.of(script, Long.class);
        Long result = redisTemplate.execute(redisScript, 
            Collections.singletonList(key), 
            capacity, rate, System.currentTimeMillis());
        
        return result != null && result > 0;
    }
}
```

### 排行榜实现

```java
@Service
public class RankService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String RANK_KEY = "rank:score";
    
    /**
     * 更新分数
     */
    public void updateScore(String userId, double score) {
        redisTemplate.opsForZSet().add(RANK_KEY, userId, score);
    }
    
    /**
     * 增加分数
     */
    public void incrementScore(String userId, double delta) {
        redisTemplate.opsForZSet().incrementScore(RANK_KEY, userId, delta);
    }
    
    /**
     * 获取排名（从1开始）
     */
    public Long getRank(String userId) {
        Long rank = redisTemplate.opsForZSet().reverseRank(RANK_KEY, userId);
        return rank != null ? rank + 1 : null;
    }
    
    /**
     * 获取分数
     */
    public Double getScore(String userId) {
        return redisTemplate.opsForZSet().score(RANK_KEY, userId);
    }
    
    /**
     * 获取排行榜（前N名）
     */
    public List<RankDTO> getTopN(int n) {
        Set<ZSetOperations.TypedTuple<Object>> tuples = 
            redisTemplate.opsForZSet().reverseRangeWithScores(RANK_KEY, 0, n - 1);
        
        List<RankDTO> result = new ArrayList<>();
        int rank = 1;
        for (ZSetOperations.TypedTuple<Object> tuple : tuples) {
            RankDTO dto = new RankDTO();
            dto.setRank(rank++);
            dto.setUserId((String) tuple.getValue());
            dto.setScore(tuple.getScore());
            result.add(dto);
        }
        return result;
    }
    
    /**
     * 获取指定分数范围的用户
     */
    public Set<Object> getUsersByScoreRange(double min, double max) {
        return redisTemplate.opsForZSet().rangeByScore(RANK_KEY, min, max);
    }
}

@Data
class RankDTO {
    private Integer rank;
    private String userId;
    private Double score;
}
```

## 最佳实践

### 1. Key 命名规范

```java
// 推荐格式：业务模块:对象类型:ID
user:info:1001
order:detail:20231201001
product:stock:SKU123

// 使用常量管理
public class RedisKeyConstants {
    public static final String USER_INFO = "user:info:";
    public static final String ORDER_DETAIL = "order:detail:";
    
    public static String getUserKey(Long userId) {
        return USER_INFO + userId;
    }
}
```

### 2. 合理设置过期时间

```java
// 不同类型数据设置不同过期时间
// 热点数据：30分钟 - 2小时
redisTemplate.opsForValue().set(key, value, 30, TimeUnit.MINUTES);

// 普通数据：1-24小时
redisTemplate.opsForValue().set(key, value, 1, TimeUnit.HOURS);

// 临时数据：5-10分钟
redisTemplate.opsForValue().set(key, value, 5, TimeUnit.MINUTES);
```

### 3. 避免大 Key

```java
// 不推荐：单个 Hash 存储大量字段
redisTemplate.opsForHash().put("user:all", "user1", user1);
redisTemplate.opsForHash().put("user:all", "user2", user2);
// ... 存储百万级用户

// 推荐：分散存储
redisTemplate.opsForValue().set("user:1", user1);
redisTemplate.opsForValue().set("user:2", user2);
```

### 4. 使用连接池

```yaml
spring:
  redis:
    lettuce:
      pool:
        max-active: 8     # 最大连接数
        max-idle: 8       # 最大空闲连接
        min-idle: 2       # 最小空闲连接
        max-wait: 3000ms  # 最大等待时间
```

### 5. 序列化选择

```java
// String 类型：StringRedisSerializer
// 对象类型：Jackson2JsonRedisSerializer 或 GenericJackson2JsonRedisSerializer
// 性能要求高：使用 Protobuf 或 Kryo
```

## 常见问题

### 1. 缓存与数据库一致性

```java
// 方案1：先更新数据库，再删除缓存（推荐）
@Transactional
public void updateUser(User user) {
    userRepository.save(user);
    redisTemplate.delete("user:" + user.getId());
}

// 方案2：延迟双删
@Transactional
public void updateUserWithDoubleDelete(User user) {
    // 第一次删除缓存
    redisTemplate.delete("user:" + user.getId());
    
    // 更新数据库
    userRepository.save(user);
    
    // 延迟删除缓存
    CompletableFuture.runAsync(() -> {
        try {
            Thread.sleep(500);
            redisTemplate.delete("user:" + user.getId());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    });
}
```

### 2. Redis 连接超时

```yaml
# 增加超时时间
spring:
  redis:
    timeout: 5000ms
    lettuce:
      pool:
        max-wait: 5000ms
```

### 3. 序列化异常

```java
// 确保实体类实现 Serializable
@Entity
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    // ...
}
```

## 总结

Spring Data 提供了统一的数据访问抽象，简化了不同数据存储的操作：

- **Spring Data JPA**：适用于关系型数据库，提供强大的 ORM 功能
- **Spring Data Redis**：适用于缓存和高性能数据存储，支持多种数据结构

通过合理使用这两个模块，可以构建高性能、可扩展的应用系统。
