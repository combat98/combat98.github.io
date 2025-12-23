---
next:
  text: 'MyCat'
  link: '/middleware/database/Mycat'
---

# ShardingSphere

## 简介

Apache ShardingSphere 是一套开源的分布式数据库中间件解决方案，提供数据分片、读写分离、分布式事务等功能。

### 特点

- **数据分片** - 水平分库分表
- **读写分离** - 主从架构支持
- **分布式事务** - XA、柔性事务
- **数据加密** - 透明化数据加密
- **影子库** - 压测数据隔离
- **多数据库支持** - MySQL、PostgreSQL、Oracle 等

### 核心组件

- **ShardingSphere-JDBC** - 轻量级 Java 框架
- **ShardingSphere-Proxy** - 数据库代理服务器
- **ShardingSphere-Sidecar** - Kubernetes 云原生数据库代理

## 安装配置

### ShardingSphere-JDBC

```xml
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>shardingsphere-jdbc-core-spring-boot-starter</artifactId>
    <version>5.3.0</version>
</dependency>
```

### ShardingSphere-Proxy

```bash
# 下载
wget https://archive.apache.org/dist/shardingsphere/5.3.0/apache-shardingsphere-5.3.0-shardingsphere-proxy-bin.tar.gz

# 解压
tar -xzf apache-shardingsphere-5.3.0-shardingsphere-proxy-bin.tar.gz

# 配置 server.yaml 和 config-*.yaml

# 启动
sh bin/start.sh

# 连接（默认端口 3307）
mysql -h 127.0.0.1 -P 3307 -u root -p
```

## 数据分片

### 配置示例

```yaml
spring:
  shardingsphere:
    datasource:
      names: ds0,ds1
      ds0:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3306/db0
        username: root
        password: root
      ds1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3306/db1
        username: root
        password: root
    rules:
      sharding:
        tables:
          t_order:
            actual-data-nodes: ds$->{0..1}.t_order_$->{0..1}
            database-strategy:
              standard:
                sharding-column: user_id
                sharding-algorithm-name: database-inline
            table-strategy:
              standard:
                sharding-column: order_id
                sharding-algorithm-name: table-inline
        sharding-algorithms:
          database-inline:
            type: INLINE
            props:
              algorithm-expression: ds$->{user_id % 2}
          table-inline:
            type: INLINE
            props:
              algorithm-expression: t_order_$->{order_id % 2}
```

### Java 代码

```java
@Entity
@Table(name = "t_order")
public class Order {
    @Id
    private Long orderId;
    private Long userId;
    private String status;
    // getters and setters
}

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    
    public void createOrder(Order order) {
        orderRepository.save(order);
    }
    
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}
```

## 读写分离

```yaml
spring:
  shardingsphere:
    datasource:
      names: master,slave0,slave1
      master:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3306/master_db
        username: root
        password: root
      slave0:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3307/slave_db
        username: root
        password: root
      slave1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3308/slave_db
        username: root
        password: root
    rules:
      readwrite-splitting:
        data-sources:
          readwrite_ds:
            type: Static
            props:
              write-data-source-name: master
              read-data-source-names: slave0,slave1
            load-balancer-name: round_robin
        load-balancers:
          round_robin:
            type: ROUND_ROBIN
```

## 分布式事务

### XA 事务

```yaml
spring:
  shardingsphere:
    props:
      xa-transaction-manager-type: Atomikos
```

```java
@Service
public class OrderService {
    
    @Transactional
    public void createOrder(Order order) {
        // 跨库操作会自动使用 XA 事务
        orderRepository.save(order);
        orderItemRepository.save(orderItem);
    }
}
```

### BASE 柔性事务

```yaml
spring:
  shardingsphere:
    props:
      transaction-type: BASE
```

## 分片策略

### 标准分片策略

```java
public class CustomShardingAlgorithm implements StandardShardingAlgorithm<Long> {
    
    @Override
    public String doSharding(Collection<String> availableTargetNames, 
                            PreciseShardingValue<Long> shardingValue) {
        Long value = shardingValue.getValue();
        for (String targetName : availableTargetNames) {
            if (targetName.endsWith(value % 2 + "")) {
                return targetName;
            }
        }
        throw new IllegalArgumentException();
    }
    
    @Override
    public Collection<String> doSharding(Collection<String> availableTargetNames,
                                        RangeShardingValue<Long> shardingValue) {
        // 范围分片逻辑
        return availableTargetNames;
    }
}
```

### 复合分片策略

```yaml
sharding:
  tables:
    t_order:
      table-strategy:
        complex:
          sharding-columns: user_id,order_id
          sharding-algorithm-name: complex-algorithm
```

### Hint 分片策略

```java
// 强制路由
HintManager hintManager = HintManager.getInstance();
hintManager.addDatabaseShardingValue("t_order", 1);
hintManager.addTableShardingValue("t_order", 2);

// 执行查询
List<Order> orders = orderRepository.findAll();

hintManager.close();
```

## 数据加密

```yaml
spring:
  shardingsphere:
    rules:
      encrypt:
        tables:
          t_user:
            columns:
              password:
                cipher-column: password_cipher
                encryptor-name: aes-encryptor
        encryptors:
          aes-encryptor:
            type: AES
            props:
              aes-key-value: 123456
```

## 最佳实践

1. **合理选择分片键** - 避免跨库查询
2. **使用雪花算法生成ID** - 保证全局唯一
3. **监控慢SQL** - 优化查询性能
4. **合理设置数据源** - 避免单点故障
5. **使用读写分离** - 提高查询性能
6. **定期数据迁移** - 平衡数据分布
7. **使用分布式事务** - 保证数据一致性

## 常见问题

### 1. 跨库关联查询

```java
// 避免跨库 JOIN，改为应用层关联
List<Order> orders = orderRepository.findByUserId(userId);
List<Long> orderIds = orders.stream()
    .map(Order::getOrderId)
    .collect(Collectors.toList());
List<OrderItem> items = orderItemRepository.findByOrderIdIn(orderIds);
```

### 2. 分布式主键

```yaml
sharding:
  tables:
    t_order:
      key-generate-strategy:
        column: order_id
        key-generator-name: snowflake
  key-generators:
    snowflake:
      type: SNOWFLAKE
      props:
        worker-id: 1
```

### 3. 数据迁移

```bash
# 使用 ShardingSphere-Scaling 进行数据迁移
# 1. 配置源和目标数据源
# 2. 启动迁移任务
# 3. 监控迁移进度
# 4. 切换应用
```

## 总结

ShardingSphere 是一个功能强大的分布式数据库中间件：

- ✅ 数据分片、读写分离
- ✅ 分布式事务支持
- ✅ 数据加密、影子库
- ✅ 多数据库支持
- ✅ 易于集成和使用

掌握 ShardingSphere 对于构建大规模分布式系统非常重要。

## 参考资源

- [ShardingSphere 官方文档](https://shardingsphere.apache.org/)
- [ShardingSphere GitHub](https://github.com/apache/shardingsphere)
