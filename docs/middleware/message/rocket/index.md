# RocketMQ

## 简介

Apache RocketMQ 是阿里巴巴开源的分布式消息中间件，具有低延迟、高可靠、万亿级容量和灵活的可扩展性。

### 特点

- 高性能、高可靠、分布式
- 支持顺序消息、事务消息、延迟消息
- 万亿级消息容量保证
- 支持集群部署和主从复制

### 应用场景

- 异步解耦、削峰填谷
- 消息分发、分布式事务
- 日志处理、流式计算

## 核心概念

- **Producer** - 生产者
- **Consumer** - 消费者
- **Broker** - 消息存储服务器
- **NameServer** - 路由注册中心
- **Topic** - 消息主题
- **Message Queue** - 消息队列
- **Tag** - 消息标签

## 安装配置

### Docker 安装

```bash
# NameServer
docker run -d -p 9876:9876 --name rmqnamesrv apache/rocketmq:4.9.4 sh mqnamesrv

# Broker
docker run -d -p 10911:10911 -p 10909:10909 --name rmqbroker \
  --link rmqnamesrv:namesrv \
  -e "NAMESRV_ADDR=namesrv:9876" \
  apache/rocketmq:4.9.4 sh mqbroker
```

## 基本使用

### Java 客户端

```java
// 生产者
DefaultMQProducer producer = new DefaultMQProducer("ProducerGroup");
producer.setNamesrvAddr("localhost:9876");
producer.start();

Message msg = new Message("MyTopic", "TagA", "Hello RocketMQ".getBytes());
SendResult result = producer.send(msg);
producer.shutdown();

// 消费者
DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("ConsumerGroup");
consumer.setNamesrvAddr("localhost:9876");
consumer.subscribe("MyTopic", "*");
consumer.registerMessageListener((MessageListenerConcurrently) (msgs, context) -> {
    msgs.forEach(msg -> System.out.println(new String(msg.getBody())));
    return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
});
consumer.start();
```

### Spring Boot 集成

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-spring-boot-starter</artifactId>
    <version>2.2.2</version>
</dependency>
```

```yaml
rocketmq:
  name-server: localhost:9876
  producer:
    group: SpringBootProducerGroup
```

```java
@Service
public class ProducerService {
    @Autowired
    private RocketMQTemplate rocketMQTemplate;
    
    public void send(String topic, String message) {
        rocketMQTemplate.convertAndSend(topic, message);
    }
}

@Service
@RocketMQMessageListener(topic = "MyTopic", consumerGroup = "MyGroup")
public class ConsumerService implements RocketMQListener<String> {
    @Override
    public void onMessage(String message) {
        System.out.println("Received: " + message);
    }
}
```

## 消息类型

- **普通消息** - 基本消息发送
- **顺序消息** - 保证消息顺序
- **延迟消息** - 定时投递
- **事务消息** - 分布式事务
- **批量消息** - 批量发送

## 最佳实践

1. 合理设置 Topic 和 Tag
2. 使用消费者组实现负载均衡
3. 监控消费延迟
4. 使用主从模式提高可用性
5. 合理设置消息保留时间

## 参考资源

- [RocketMQ 官方文档](https://rocketmq.apache.org/)
- [Spring Boot RocketMQ](https://github.com/apache/rocketmq-spring)
