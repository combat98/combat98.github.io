---
prev:
  text: 'RocketMQ'
  link: '/middleware/message/rocket'
next:
  text: 'Kafka'
  link: '/middleware/message/kafka'
---

# RabbitMQ

## 简介

RabbitMQ 是一个开源的消息代理软件（消息中间件），实现了高级消息队列协议（AMQP）。

### 特点

- **可靠性** - 支持消息持久化、确认机制
- **灵活的路由** - 支持多种交换机类型
- **集群** - 支持集群部署
- **高可用** - 支持镜像队列
- **多协议** - 支持 AMQP、STOMP、MQTT 等
- **管理界面** - 提供 Web 管理界面

### 应用场景

- **异步处理** - 解耦系统，提高响应速度
- **流量削峰** - 缓冲高并发请求
- **消息分发** - 一对多消息推送
- **延迟队列** - 定时任务
- **RPC** - 远程过程调用

## 核心概念

### 基本概念

- **Producer（生产者）** - 发送消息的应用
- **Consumer（消费者）** - 接收消息的应用
- **Queue（队列）** - 存储消息的缓冲区
- **Exchange（交换机）** - 接收生产者消息并路由到队列
- **Binding（绑定）** - 交换机和队列之间的路由规则
- **Routing Key（路由键）** - 消息的路由规则
- **Virtual Host（虚拟主机）** - 逻辑隔离单元

### 架构图

```
Producer ─> Exchange ─(Binding)─> Queue ─> Consumer
              │
              ├─ Direct Exchange
              ├─ Fanout Exchange
              ├─ Topic Exchange
              └─ Headers Exchange
```

## 安装配置

### Docker 安装（推荐）

```bash
# 拉取镜像（带管理界面）
docker pull rabbitmq:3.12-management

# 运行容器
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin \
  rabbitmq:3.12-management

# 访问管理界面
# http://localhost:15672
# 用户名: admin
# 密码: admin
```

### Linux 安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install rabbitmq-server

# 启动服务
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server

# 启用管理插件
sudo rabbitmq-plugins enable rabbitmq_management

# 创建用户
sudo rabbitmqctl add_user admin admin
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

## 交换机类型

### 1. Direct Exchange（直连交换机）

精确匹配 routing key

```
Producer ─(routing_key: "error")─> Direct Exchange
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
            (binding: "error")  (binding: "info")  (binding: "warning")
                    │                   │                   │
                  Queue1              Queue2              Queue3
```

### 2. Fanout Exchange（扇出交换机）

广播到所有绑定的队列，忽略 routing key

```
Producer ─> Fanout Exchange
                │
        ┌───────┼───────┐
        │       │       │
      Queue1  Queue2  Queue3
```

### 3. Topic Exchange（主题交换机）

通过模式匹配 routing key

```
Producer ─(routing_key: "user.order.create")─> Topic Exchange
                                                      │
                                  ┌───────────────────┼───────────────────┐
                          (binding: "user.#")  (binding: "*.order.*")  (binding: "#.create")
                                  │                   │                   │
                                Queue1              Queue2              Queue3

# - 匹配一个单词
* - 匹配零个或多个单词
```

### 4. Headers Exchange（头交换机）

根据消息头属性匹配

```
Producer ─(headers: {type: "pdf", size: "large"})─> Headers Exchange
                                                          │
                                      ┌───────────────────┴───────────────────┐
                              (x-match: all,              (x-match: any,
                               type: pdf,                  type: pdf,
                               size: large)                format: A4)
                                      │                           │
                                    Queue1                      Queue2
```

## 编程接口

### Java (Spring AMQP)

#### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

#### 配置

```yaml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: admin
    password: admin
    virtual-host: /
```

#### 简单队列

```java
// 配置
@Configuration
public class RabbitConfig {
    
    @Bean
    public Queue simpleQueue() {
        return new Queue("simple.queue", true);
    }
}

// 生产者
@Service
public class Producer {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void send(String message) {
        rabbitTemplate.convertAndSend("simple.queue", message);
    }
}

// 消费者
@Component
public class Consumer {
    
    @RabbitListener(queues = "simple.queue")
    public void receive(String message) {
        System.out.println("Received: " + message);
    }
}
```

#### Work Queue（工作队列）

```java
@Configuration
public class WorkQueueConfig {
    
    @Bean
    public Queue workQueue() {
        return new Queue("work.queue", true);
    }
}

// 多个消费者竞争消费
@Component
public class WorkConsumer {
    
    @RabbitListener(queues = "work.queue")
    public void receive1(String message) {
        System.out.println("Consumer 1: " + message);
    }
    
    @RabbitListener(queues = "work.queue")
    public void receive2(String message) {
        System.out.println("Consumer 2: " + message);
    }
}
```

#### Fanout Exchange

```java
@Configuration
public class FanoutConfig {
    
    @Bean
    public FanoutExchange fanoutExchange() {
        return new FanoutExchange("fanout.exchange");
    }
    
    @Bean
    public Queue fanoutQueue1() {
        return new Queue("fanout.queue1");
    }
    
    @Bean
    public Queue fanoutQueue2() {
        return new Queue("fanout.queue2");
    }
    
    @Bean
    public Binding binding1(FanoutExchange fanoutExchange, Queue fanoutQueue1) {
        return BindingBuilder.bind(fanoutQueue1).to(fanoutExchange);
    }
    
    @Bean
    public Binding binding2(FanoutExchange fanoutExchange, Queue fanoutQueue2) {
        return BindingBuilder.bind(fanoutQueue2).to(fanoutExchange);
    }
}

// 生产者
public void sendToFanout(String message) {
    rabbitTemplate.convertAndSend("fanout.exchange", "", message);
}

// 消费者
@RabbitListener(queues = "fanout.queue1")
public void receiveFanout1(String message) {
    System.out.println("Queue1: " + message);
}

@RabbitListener(queues = "fanout.queue2")
public void receiveFanout2(String message) {
    System.out.println("Queue2: " + message);
}
```

#### Direct Exchange

```java
@Configuration
public class DirectConfig {
    
    @Bean
    public DirectExchange directExchange() {
        return new DirectExchange("direct.exchange");
    }
    
    @Bean
    public Queue directQueue1() {
        return new Queue("direct.queue1");
    }
    
    @Bean
    public Queue directQueue2() {
        return new Queue("direct.queue2");
    }
    
    @Bean
    public Binding bindingError(DirectExchange directExchange, Queue directQueue1) {
        return BindingBuilder.bind(directQueue1).to(directExchange).with("error");
    }
    
    @Bean
    public Binding bindingInfo(DirectExchange directExchange, Queue directQueue2) {
        return BindingBuilder.bind(directQueue2).to(directExchange).with("info");
    }
}

// 生产者
public void sendDirect(String routingKey, String message) {
    rabbitTemplate.convertAndSend("direct.exchange", routingKey, message);
}

// 消费者
@RabbitListener(queues = "direct.queue1")
public void receiveError(String message) {
    System.out.println("Error: " + message);
}

@RabbitListener(queues = "direct.queue2")
public void receiveInfo(String message) {
    System.out.println("Info: " + message);
}
```

#### Topic Exchange

```java
@Configuration
public class TopicConfig {
    
    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange("topic.exchange");
    }
    
    @Bean
    public Queue topicQueue1() {
        return new Queue("topic.queue1");
    }
    
    @Bean
    public Queue topicQueue2() {
        return new Queue("topic.queue2");
    }
    
    @Bean
    public Binding bindingUser(TopicExchange topicExchange, Queue topicQueue1) {
        return BindingBuilder.bind(topicQueue1).to(topicExchange).with("user.#");
    }
    
    @Bean
    public Binding bindingOrder(TopicExchange topicExchange, Queue topicQueue2) {
        return BindingBuilder.bind(topicQueue2).to(topicExchange).with("*.order.*");
    }
}

// 生产者
public void sendTopic(String routingKey, String message) {
    rabbitTemplate.convertAndSend("topic.exchange", routingKey, message);
}

// 消费者
@RabbitListener(queues = "topic.queue1")
public void receiveUser(String message) {
    System.out.println("User: " + message);
}

@RabbitListener(queues = "topic.queue2")
public void receiveOrder(String message) {
    System.out.println("Order: " + message);
}
```

### Node.js (amqplib)

```javascript
const amqp = require('amqplib');

// 生产者
async function sendMessage() {
  const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
  const channel = await connection.createChannel();
  
  const queue = 'simple.queue';
  await channel.assertQueue(queue, { durable: true });
  
  channel.sendToQueue(queue, Buffer.from('Hello RabbitMQ!'), {
    persistent: true
  });
  
  console.log('Message sent');
  
  setTimeout(() => {
    connection.close();
  }, 500);
}

// 消费者
async function receiveMessage() {
  const connection = await amqp.connect('amqp://admin:admin@localhost:5672');
  const channel = await connection.createChannel();
  
  const queue = 'simple.queue';
  await channel.assertQueue(queue, { durable: true });
  
  console.log('Waiting for messages...');
  
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Received:', msg.content.toString());
      channel.ack(msg);
    }
  });
}

sendMessage().catch(console.error);
receiveMessage().catch(console.error);
```

### Python (pika)

```python
import pika

# 连接
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host='localhost',
        port=5672,
        credentials=pika.PlainCredentials('admin', 'admin')
    )
)
channel = connection.channel()

# 声明队列
channel.queue_declare(queue='simple.queue', durable=True)

# 生产者
channel.basic_publish(
    exchange='',
    routing_key='simple.queue',
    body='Hello RabbitMQ!',
    properties=pika.BasicProperties(delivery_mode=2)  # 持久化
)

print('Message sent')

# 消费者
def callback(ch, method, properties, body):
    print(f'Received: {body.decode()}')
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(
    queue='simple.queue',
    on_message_callback=callback
)

print('Waiting for messages...')
channel.start_consuming()

connection.close()
```

## 高级特性

### 消息确认

```java
// 生产者确认
@Configuration
public class RabbitConfig {
    
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        
        // 开启确认模式
        template.setConfirmCallback((correlationData, ack, cause) -> {
            if (ack) {
                System.out.println("消息发送成功");
            } else {
                System.out.println("消息发送失败: " + cause);
            }
        });
        
        // 开启返回模式
        template.setMandatory(true);
        template.setReturnCallback((message, replyCode, replyText, exchange, routingKey) -> {
            System.out.println("消息未路由到队列: " + message);
        });
        
        return template;
    }
}

// 消费者手动确认
@RabbitListener(queues = "simple.queue", ackMode = "MANUAL")
public void receive(Message message, Channel channel) throws IOException {
    try {
        String msg = new String(message.getBody());
        System.out.println("Received: " + msg);
        
        // 手动确认
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    } catch (Exception e) {
        // 拒绝消息，重新入队
        channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
    }
}
```

### 消息持久化

```java
// 队列持久化
@Bean
public Queue durableQueue() {
    return new Queue("durable.queue", true);  // durable = true
}

// 交换机持久化
@Bean
public DirectExchange durableExchange() {
    return new DirectExchange("durable.exchange", true, false);
}

// 消息持久化
rabbitTemplate.convertAndSend("durable.exchange", "key", message, msg -> {
    msg.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
    return msg;
});
```

### 延迟队列

```java
// 使用 TTL + 死信队列实现
@Configuration
public class DelayQueueConfig {
    
    // 死信交换机
    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange("dlx.exchange");
    }
    
    // 死信队列
    @Bean
    public Queue deadLetterQueue() {
        return new Queue("dlx.queue");
    }
    
    @Bean
    public Binding deadLetterBinding() {
        return BindingBuilder.bind(deadLetterQueue())
            .to(deadLetterExchange())
            .with("dlx");
    }
    
    // 延迟队列
    @Bean
    public Queue delayQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange", "dlx.exchange");
        args.put("x-dead-letter-routing-key", "dlx");
        args.put("x-message-ttl", 10000);  // 10秒后过期
        return new Queue("delay.queue", true, false, false, args);
    }
    
    @Bean
    public DirectExchange delayExchange() {
        return new DirectExchange("delay.exchange");
    }
    
    @Bean
    public Binding delayBinding() {
        return BindingBuilder.bind(delayQueue())
            .to(delayExchange())
            .with("delay");
    }
}

// 发送延迟消息
public void sendDelayMessage(String message) {
    rabbitTemplate.convertAndSend("delay.exchange", "delay", message);
}

// 消费延迟消息
@RabbitListener(queues = "dlx.queue")
public void receiveDelayMessage(String message) {
    System.out.println("Received delay message: " + message);
}
```

### 优先级队列

```java
@Bean
public Queue priorityQueue() {
    Map<String, Object> args = new HashMap<>();
    args.put("x-max-priority", 10);  // 最大优先级
    return new Queue("priority.queue", true, false, false, args);
}

// 发送带优先级的消息
public void sendPriorityMessage(String message, int priority) {
    rabbitTemplate.convertAndSend("priority.queue", message, msg -> {
        msg.getMessageProperties().setPriority(priority);
        return msg;
    });
}
```

### 消息追踪

```java
// 开启消息追踪
@Bean
public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate template = new RabbitTemplate(connectionFactory);
    
    // 设置消息ID
    template.setBeforePublishPostProcessors(message -> {
        message.getMessageProperties().setMessageId(UUID.randomUUID().toString());
        message.getMessageProperties().setTimestamp(new Date());
        return message;
    });
    
    return template;
}
```

## 集群与高可用

### 普通集群

```bash
# 节点1
rabbitmq-server -detached

# 节点2
rabbitmq-server -detached
rabbitmqctl stop_app
rabbitmqctl join_cluster rabbit@node1
rabbitmqctl start_app

# 节点3
rabbitmq-server -detached
rabbitmqctl stop_app
rabbitmqctl join_cluster rabbit@node1
rabbitmqctl start_app

# 查看集群状态
rabbitmqctl cluster_status
```

### 镜像队列

```bash
# 设置镜像策略
rabbitmqctl set_policy ha-all "^" '{"ha-mode":"all"}'

# 或通过管理界面设置
# Admin -> Policies -> Add Policy
# Pattern: ^
# Definition: {"ha-mode":"all"}
```

## 性能优化

### 生产者优化

```java
// 批量发送
List<String> messages = Arrays.asList("msg1", "msg2", "msg3");
messages.forEach(msg -> {
    rabbitTemplate.convertAndSend("queue", msg);
});

// 使用连接池
@Bean
public CachingConnectionFactory connectionFactory() {
    CachingConnectionFactory factory = new CachingConnectionFactory("localhost");
    factory.setUsername("admin");
    factory.setPassword("admin");
    factory.setChannelCacheSize(25);  // 通道缓存大小
    return factory;
}
```

### 消费者优化

```java
// 预取数量
@RabbitListener(
    queues = "simple.queue",
    containerFactory = "rabbitListenerContainerFactory"
)
public void receive(String message) {
    // 处理消息
}

@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
    ConnectionFactory connectionFactory
) {
    SimpleRabbitListenerContainerFactory factory = 
        new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setPrefetchCount(10);  // 预取10条消息
    factory.setConcurrentConsumers(3);  // 3个并发消费者
    factory.setMaxConcurrentConsumers(10);  // 最多10个
    return factory;
}
```

## 监控与管理

### 管理命令

```bash
# 查看队列
rabbitmqctl list_queues

# 查看交换机
rabbitmqctl list_exchanges

# 查看绑定
rabbitmqctl list_bindings

# 查看连接
rabbitmqctl list_connections

# 查看通道
rabbitmqctl list_channels

# 查看消费者
rabbitmqctl list_consumers

# 清空队列
rabbitmqctl purge_queue queue_name
```

### HTTP API

```bash
# 获取队列信息
curl -u admin:admin http://localhost:15672/api/queues

# 获取交换机信息
curl -u admin:admin http://localhost:15672/api/exchanges

# 发送消息
curl -u admin:admin -X POST \
  http://localhost:15672/api/exchanges/%2F/amq.default/publish \
  -H 'content-type: application/json' \
  -d '{
    "properties": {},
    "routing_key": "simple.queue",
    "payload": "Hello",
    "payload_encoding": "string"
  }'
```

## 最佳实践

1. **合理设置预取数量** - 平衡吞吐量和内存
2. **使用消息确认** - 保证消息不丢失
3. **设置消息持久化** - 防止服务重启丢失消息
4. **使用死信队列** - 处理失败消息
5. **监控队列长度** - 及时发现消费问题
6. **使用集群** - 提高可用性
7. **合理设置 TTL** - 避免消息堆积
8. **使用连接池** - 提高性能

## 常见问题

### 1. 消息丢失

```java
// 生产者确认
template.setConfirmCallback(...);

// 消息持久化
queue.setDurable(true);
message.setDeliveryMode(MessageDeliveryMode.PERSISTENT);

// 消费者手动确认
@RabbitListener(ackMode = "MANUAL")
```

### 2. 消息重复

```java
// 业务层面去重
@RabbitListener(queues = "simple.queue")
public void receive(Message message) {
    String messageId = message.getMessageProperties().getMessageId();
    if (processedIds.contains(messageId)) {
        return;  // 已处理过
    }
    // 处理消息
    processedIds.add(messageId);
}
```

### 3. 消息堆积

```bash
# 增加消费者数量
# 提高消费速度
# 设置消息 TTL
# 使用死信队列
```

## 总结

RabbitMQ 是一个功能强大的消息中间件：

- ✅ 可靠的消息传递
- ✅ 灵活的路由机制
- ✅ 支持多种协议
- ✅ 易于管理和监控
- ✅ 丰富的客户端库

掌握 RabbitMQ 对于构建分布式系统非常重要。

## 参考资源

- [RabbitMQ 官方文档](https://www.rabbitmq.com/documentation.html)
- [RabbitMQ 实战](https://book.douban.com/subject/26649178/)
- [Spring AMQP](https://spring.io/projects/spring-amqp)
