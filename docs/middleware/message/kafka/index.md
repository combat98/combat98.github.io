---
prev:
  text: 'RabbitMQ'
  link: '/middleware/message/rabbit'
---

# Kafka

## 简介

Apache Kafka 是一个分布式流处理平台，最初由 LinkedIn 开发，现在是 Apache 的顶级项目。

### 特点

- **高吞吐量** - 每秒可处理数百万条消息
- **可扩展性** - 支持水平扩展
- **持久化** - 消息持久化到磁盘
- **容错性** - 支持数据副本
- **实时处理** - 支持流式处理
- **分布式** - 天然的分布式架构

### 应用场景

- **消息队列** - 异步处理、解耦
- **日志收集** - 集中式日志管理
- **流处理** - 实时数据处理
- **事件溯源** - 事件驱动架构
- **指标监控** - 系统监控数据收集

## 核心概念

### 基本概念

- **Producer（生产者）** - 发送消息到 Kafka
- **Consumer（消费者）** - 从 Kafka 读取消息
- **Broker（代理）** - Kafka 服务器节点
- **Topic（主题）** - 消息的分类
- **Partition（分区）** - Topic 的物理分组
- **Offset（偏移量）** - 消息在分区中的位置
- **Consumer Group（消费者组）** - 消费者的逻辑分组

### 架构图

```
Producer1 ─┐
Producer2 ─┼─> Broker1 (Leader)   ─┐
Producer3 ─┘    Broker2 (Follower) ├─> Topic (Partition 0, 1, 2)
                Broker3 (Follower) ─┘
                        │
                        ├─> Consumer Group 1 (Consumer1, Consumer2)
                        └─> Consumer Group 2 (Consumer3)
```

## 安装配置

### Docker 安装（推荐）

```bash
# 创建 docker-compose.yml
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"
  
  kafka:
    image: confluentinc/cp-kafka:7.4.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

# 启动
docker-compose up -d
```

### Linux 安装

```bash
# 下载 Kafka
wget https://downloads.apache.org/kafka/3.5.0/kafka_2.13-3.5.0.tgz
tar -xzf kafka_2.13-3.5.0.tgz
cd kafka_2.13-3.5.0

# 启动 ZooKeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# 启动 Kafka
bin/kafka-server-start.sh config/server.properties
```

## 基本操作

### Topic 操作

```bash
# 创建 Topic
bin/kafka-topics.sh --create \
  --bootstrap-server localhost:9092 \
  --topic my-topic \
  --partitions 3 \
  --replication-factor 1

# 查看所有 Topic
bin/kafka-topics.sh --list --bootstrap-server localhost:9092

# 查看 Topic 详情
bin/kafka-topics.sh --describe \
  --bootstrap-server localhost:9092 \
  --topic my-topic

# 删除 Topic
bin/kafka-topics.sh --delete \
  --bootstrap-server localhost:9092 \
  --topic my-topic

# 修改 Topic 分区数
bin/kafka-topics.sh --alter \
  --bootstrap-server localhost:9092 \
  --topic my-topic \
  --partitions 5
```

### 生产消息

```bash
# 命令行生产消息
bin/kafka-console-producer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic

# 带 key 的消息
bin/kafka-console-producer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic \
  --property "parse.key=true" \
  --property "key.separator=:"
```

### 消费消息

```bash
# 从最新消息开始消费
bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic

# 从头开始消费
bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic \
  --from-beginning

# 指定消费者组
bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic \
  --group my-group

# 显示 key
bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic my-topic \
  --property print.key=true \
  --property key.separator=":"
```

## 编程接口

### Java 生产者

```java
import org.apache.kafka.clients.producer.*;
import java.util.Properties;

public class KafkaProducerExample {
    public static void main(String[] args) {
        // 配置
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("acks", "all");
        props.put("retries", 3);
        
        // 创建生产者
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);
        
        try {
            // 发送消息
            for (int i = 0; i < 10; i++) {
                ProducerRecord<String, String> record = 
                    new ProducerRecord<>("my-topic", "key-" + i, "value-" + i);
                
                // 同步发送
                RecordMetadata metadata = producer.send(record).get();
                System.out.printf("Sent to partition %d, offset %d%n", 
                    metadata.partition(), metadata.offset());
                
                // 异步发送
                producer.send(record, (metadata, exception) -> {
                    if (exception == null) {
                        System.out.printf("Success: partition=%d, offset=%d%n",
                            metadata.partition(), metadata.offset());
                    } else {
                        exception.printStackTrace();
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            producer.close();
        }
    }
}
```

### Java 消费者

```java
import org.apache.kafka.clients.consumer.*;
import java.time.Duration;
import java.util.*;

public class KafkaConsumerExample {
    public static void main(String[] args) {
        // 配置
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("group.id", "my-group");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("enable.auto.commit", "true");
        props.put("auto.commit.interval.ms", "1000");
        props.put("auto.offset.reset", "earliest");
        
        // 创建消费者
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        
        // 订阅 Topic
        consumer.subscribe(Arrays.asList("my-topic"));
        
        try {
            while (true) {
                // 拉取消息
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
                
                for (ConsumerRecord<String, String> record : records) {
                    System.out.printf("partition=%d, offset=%d, key=%s, value=%s%n",
                        record.partition(), record.offset(), record.key(), record.value());
                }
                
                // 手动提交偏移量
                // consumer.commitSync();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            consumer.close();
        }
    }
}
```

### Node.js (KafkaJS)

```javascript
const { Kafka } = require('kafkajs');

// 创建 Kafka 实例
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

// 生产者
async function produceMessages() {
  const producer = kafka.producer();
  
  await producer.connect();
  
  for (let i = 0; i < 10; i++) {
    await producer.send({
      topic: 'my-topic',
      messages: [
        { key: `key-${i}`, value: `value-${i}` }
      ]
    });
  }
  
  await producer.disconnect();
}

// 消费者
async function consumeMessages() {
  const consumer = kafka.consumer({ groupId: 'my-group' });
  
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        value: message.value.toString()
      });
    }
  });
}

// 执行
produceMessages().catch(console.error);
consumeMessages().catch(console.error);
```

### Python (kafka-python)

```python
from kafka import KafkaProducer, KafkaConsumer
import json

# 生产者
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# 发送消息
for i in range(10):
    producer.send('my-topic', {'key': f'key-{i}', 'value': f'value-{i}'})

producer.flush()
producer.close()

# 消费者
consumer = KafkaConsumer(
    'my-topic',
    bootstrap_servers=['localhost:9092'],
    group_id='my-group',
    auto_offset_reset='earliest',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    print(f"partition={message.partition}, offset={message.offset}, value={message.value}")
```

## Spring Boot 集成

### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

### 配置

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      acks: all
      retries: 3
    consumer:
      group-id: my-group
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      auto-offset-reset: earliest
      enable-auto-commit: true
```

### 生产者

```java
@Service
public class KafkaProducerService {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
    }
    
    public void sendMessageWithKey(String topic, String key, String message) {
        kafkaTemplate.send(topic, key, message);
    }
    
    public void sendMessageWithCallback(String topic, String message) {
        ListenableFuture<SendResult<String, String>> future = 
            kafkaTemplate.send(topic, message);
        
        future.addCallback(
            result -> System.out.println("Success: " + result.getRecordMetadata().offset()),
            ex -> System.err.println("Failed: " + ex.getMessage())
        );
    }
}
```

### 消费者

```java
@Service
public class KafkaConsumerService {
    
    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void listen(String message) {
        System.out.println("Received: " + message);
    }
    
    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void listenWithMetadata(
        @Payload String message,
        @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition,
        @Header(KafkaHeaders.OFFSET) long offset
    ) {
        System.out.printf("Received: partition=%d, offset=%d, message=%s%n",
            partition, offset, message);
    }
    
    // 批量消费
    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void listenBatch(List<String> messages) {
        System.out.println("Received batch: " + messages.size());
        messages.forEach(System.out::println);
    }
}
```

## 高级特性

### 分区策略

```java
// 自定义分区器
public class CustomPartitioner implements Partitioner {
    @Override
    public int partition(String topic, Object key, byte[] keyBytes,
                        Object value, byte[] valueBytes, Cluster cluster) {
        List<PartitionInfo> partitions = cluster.partitionsForTopic(topic);
        int numPartitions = partitions.size();
        
        // 根据 key 的哈希值分区
        if (key == null) {
            return 0;
        }
        return Math.abs(key.hashCode()) % numPartitions;
    }
    
    @Override
    public void close() {}
    
    @Override
    public void configure(Map<String, ?> configs) {}
}

// 使用自定义分区器
props.put("partitioner.class", "com.example.CustomPartitioner");
```

### 事务

```java
// 配置事务
props.put("transactional.id", "my-transactional-id");

KafkaProducer<String, String> producer = new KafkaProducer<>(props);

// 初始化事务
producer.initTransactions();

try {
    // 开始事务
    producer.beginTransaction();
    
    // 发送消息
    producer.send(new ProducerRecord<>("topic1", "key1", "value1"));
    producer.send(new ProducerRecord<>("topic2", "key2", "value2"));
    
    // 提交事务
    producer.commitTransaction();
} catch (Exception e) {
    // 回滚事务
    producer.abortTransaction();
}
```

### 消费者组再平衡

```java
consumer.subscribe(Arrays.asList("my-topic"), new ConsumerRebalanceListener() {
    @Override
    public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
        System.out.println("Partitions revoked: " + partitions);
        // 提交偏移量
        consumer.commitSync();
    }
    
    @Override
    public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
        System.out.println("Partitions assigned: " + partitions);
    }
});
```

### 精确一次语义（Exactly Once）

```java
// 生产者配置
props.put("enable.idempotence", "true");
props.put("transactional.id", "my-transactional-id");

// 消费者配置
props.put("isolation.level", "read_committed");
```

## 性能优化

### 生产者优化

```java
// 批量发送
props.put("batch.size", 16384);
props.put("linger.ms", 10);

// 压缩
props.put("compression.type", "snappy");

// 缓冲区大小
props.put("buffer.memory", 33554432);

// 并发发送
props.put("max.in.flight.requests.per.connection", 5);
```

### 消费者优化

```java
// 批量拉取
props.put("fetch.min.bytes", 1024);
props.put("fetch.max.wait.ms", 500);
props.put("max.poll.records", 500);

// 并发消费
@KafkaListener(
    topics = "my-topic",
    groupId = "my-group",
    concurrency = "3"
)
public void listen(String message) {
    // 处理消息
}
```

### Broker 配置优化

```properties
# server.properties

# 日志保留时间（7天）
log.retention.hours=168

# 日志段大小
log.segment.bytes=1073741824

# 副本数
default.replication.factor=3

# 最小同步副本数
min.insync.replicas=2

# 压缩
compression.type=producer

# 网络线程数
num.network.threads=8

# IO 线程数
num.io.threads=8
```

## 监控与管理

### 查看消费者组

```bash
# 查看所有消费者组
bin/kafka-consumer-groups.sh --list --bootstrap-server localhost:9092

# 查看消费者组详情
bin/kafka-consumer-groups.sh --describe \
  --bootstrap-server localhost:9092 \
  --group my-group

# 重置偏移量
bin/kafka-consumer-groups.sh --reset-offsets \
  --bootstrap-server localhost:9092 \
  --group my-group \
  --topic my-topic \
  --to-earliest \
  --execute
```

### JMX 监控

```bash
# 启动 Kafka 时开启 JMX
export JMX_PORT=9999
bin/kafka-server-start.sh config/server.properties
```

### Kafka Manager

```bash
# 使用 Docker 运行 Kafka Manager
docker run -d \
  --name kafka-manager \
  -p 9000:9000 \
  -e ZK_HOSTS="localhost:2181" \
  hlebalbau/kafka-manager:latest
```

## 最佳实践

1. **合理设置分区数** - 根据吞吐量需求设置
2. **使用消费者组** - 实现负载均衡
3. **设置合适的副本数** - 保证高可用（建议3个）
4. **启用压缩** - 减少网络传输和存储
5. **监控消费延迟** - 及时发现问题
6. **合理设置保留时间** - 平衡存储和数据可用性
7. **使用事务** - 保证数据一致性
8. **批量发送** - 提高吞吐量

## 常见问题

### 1. 消息丢失

```java
// 生产者配置
props.put("acks", "all");  // 等待所有副本确认
props.put("retries", 3);   // 重试次数

// Broker 配置
min.insync.replicas=2  // 最小同步副本数

// 消费者配置
props.put("enable.auto.commit", "false");  // 手动提交
consumer.commitSync();  // 处理完消息后提交
```

### 2. 消息重复

```java
// 启用幂等性
props.put("enable.idempotence", "true");

// 或在业务层面去重
Set<String> processedIds = new HashSet<>();
if (!processedIds.contains(messageId)) {
    // 处理消息
    processedIds.add(messageId);
}
```

### 3. 消费延迟

```bash
# 增加消费者数量
# 增加分区数
# 优化消费逻辑
# 使用批量消费
```

## 总结

Kafka 是一个高性能的分布式流处理平台：

- ✅ 高吞吐量、低延迟
- ✅ 可扩展、高可用
- ✅ 持久化、容错
- ✅ 支持流处理
- ✅ 丰富的生态系统

掌握 Kafka 对于构建大规模分布式系统非常重要。

## 参考资源

- [Kafka 官方文档](https://kafka.apache.org/documentation/)
- [Kafka 权威指南](https://book.douban.com/subject/27665114/)
- [Kafka Streams](https://kafka.apache.org/documentation/streams/)
