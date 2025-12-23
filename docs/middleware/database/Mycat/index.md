---
prev:
  text: 'ShardingSphere'
  link: '/middleware/database/ShardingSphere'
---

# Mycat

## 简介

Mycat 是一个开源的分布式数据库中间件，实现了 MySQL 协议的服务器，可以作为 Proxy 使用。

### 特点

- **数据分片** - 支持水平分库分表
- **读写分离** - 主从复制支持
- **多租户** - 支持多租户架构
- **SQL 路由** - 智能 SQL 解析和路由
- **高可用** - 支持故障切换
- **跨库 JOIN** - 支持跨分片查询

### 应用场景

- 大数据量分库分表
- 读写分离
- 数据库高可用
- 多租户系统

## 安装配置

### 下载安装

```bash
# 下载
wget http://dl.mycat.org.cn/2.0/install-template/mycat2-install-template-1.21.zip

# 解压
unzip mycat2-install-template-1.21.zip
cd mycat

# 启动
bin/mycat start

# 停止
bin/mycat stop

# 重启
bin/mycat restart

# 查看状态
bin/mycat status
```

### 连接 Mycat

```bash
# 默认端口 8066（数据端口）
mysql -h 127.0.0.1 -P 8066 -u root -p

# 管理端口 9066
mysql -h 127.0.0.1 -P 9066 -u root -p
```

## 核心配置

### server.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mycat:server xmlns:mycat="http://io.mycat/">
    <!-- 用户配置 -->
    <user name="root" defaultAccount="true">
        <property name="password">123456</property>
        <property name="schemas">testdb</property>
    </user>
    
    <user name="user">
        <property name="password">user</property>
        <property name="schemas">testdb</property>
        <property name="readOnly">true</property>
    </user>
</mycat:server>
```

### schema.xml

```xml
<?xml version="1.0"?>
<!DOCTYPE mycat:schema SYSTEM "schema.dtd">
<mycat:schema xmlns:mycat="http://io.mycat/">
    
    <!-- 逻辑库 -->
    <schema name="testdb" checkSQLschema="false" sqlMaxLimit="100">
        <!-- 分片表 -->
        <table name="t_order" dataNode="dn1,dn2" rule="mod-long" />
        
        <!-- 全局表 -->
        <table name="t_dict" dataNode="dn1,dn2" type="global" />
        
        <!-- 非分片表 -->
        <table name="t_user" dataNode="dn1" />
    </schema>
    
    <!-- 数据节点 -->
    <dataNode name="dn1" dataHost="localhost1" database="db1" />
    <dataNode name="dn2" dataHost="localhost1" database="db2" />
    
    <!-- 数据主机 -->
    <dataHost name="localhost1" maxCon="1000" minCon="10" balance="1"
              writeType="0" dbType="mysql" dbDriver="native" switchType="1">
        <heartbeat>select user()</heartbeat>
        <!-- 写主机 -->
        <writeHost host="hostM1" url="localhost:3306" user="root" password="123456">
            <!-- 读主机 -->
            <readHost host="hostS1" url="localhost:3307" user="root" password="123456" />
        </writeHost>
    </dataHost>
</mycat:schema>
```

### rule.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mycat:rule SYSTEM "rule.dtd">
<mycat:rule xmlns:mycat="http://io.mycat/">
    
    <!-- 取模分片规则 -->
    <tableRule name="mod-long">
        <rule>
            <columns>id</columns>
            <algorithm>mod-long</algorithm>
        </rule>
    </tableRule>
    
    <!-- 分片算法 -->
    <function name="mod-long" class="io.mycat.route.function.PartitionByMod">
        <property name="count">2</property>
    </function>
    
    <!-- 范围分片规则 -->
    <tableRule name="auto-sharding-long">
        <rule>
            <columns>id</columns>
            <algorithm>rang-long</algorithm>
        </rule>
    </tableRule>
    
    <function name="rang-long" class="io.mycat.route.function.AutoPartitionByLong">
        <property name="mapFile">autopartition-long.txt</property>
    </function>
    
    <!-- 时间分片规则 -->
    <tableRule name="sharding-by-date">
        <rule>
            <columns>create_time</columns>
            <algorithm>sharding-by-date</algorithm>
        </rule>
    </tableRule>
    
    <function name="sharding-by-date" class="io.mycat.route.function.PartitionByDate">
        <property name="dateFormat">yyyy-MM-dd</property>
        <property name="sBeginDate">2024-01-01</property>
        <property name="sEndDate">2024-12-31</property>
        <property name="sPartionDay">30</property>
    </function>
</mycat:rule>
```

## 分片规则

### 取模分片

```xml
<tableRule name="mod-long">
    <rule>
        <columns>user_id</columns>
        <algorithm>mod-long</algorithm>
    </rule>
</tableRule>

<function name="mod-long" class="io.mycat.route.function.PartitionByMod">
    <property name="count">2</property>
</function>
```

### 范围分片

```xml
<tableRule name="auto-sharding-long">
    <rule>
        <columns>id</columns>
        <algorithm>rang-long</algorithm>
    </rule>
</tableRule>

<function name="rang-long" class="io.mycat.route.function.AutoPartitionByLong">
    <property name="mapFile">autopartition-long.txt</property>
</function>
```

autopartition-long.txt:
```
# K=1000,M=10000
0-500M=0
500M-1000M=1
1000M-1500M=2
```

### 枚举分片

```xml
<tableRule name="sharding-by-intfile">
    <rule>
        <columns>province</columns>
        <algorithm>hash-int</algorithm>
    </rule>
</tableRule>

<function name="hash-int" class="io.mycat.route.function.PartitionByFileMap">
    <property name="mapFile">partition-hash-int.txt</property>
    <property name="type">0</property>
    <property name="defaultNode">0</property>
</function>
```

partition-hash-int.txt:
```
beijing=0
shanghai=1
guangzhou=2
shenzhen=3
```

### 时间分片

```xml
<tableRule name="sharding-by-date">
    <rule>
        <columns>create_time</columns>
        <algorithm>sharding-by-date</algorithm>
    </rule>
</tableRule>

<function name="sharding-by-date" class="io.mycat.route.function.PartitionByDate">
    <property name="dateFormat">yyyy-MM-dd</property>
    <property name="sBeginDate">2024-01-01</property>
    <property name="sPartionDay">30</property>
</function>
```

## 读写分离

### 配置

```xml
<dataHost name="localhost1" maxCon="1000" minCon="10" 
          balance="1" writeType="0" dbType="mysql" dbDriver="native">
    <heartbeat>select user()</heartbeat>
    
    <writeHost host="hostM1" url="192.168.1.1:3306" user="root" password="123456">
        <readHost host="hostS1" url="192.168.1.2:3306" user="root" password="123456" />
        <readHost host="hostS2" url="192.168.1.3:3306" user="root" password="123456" />
    </writeHost>
</dataHost>
```

### balance 参数

- **0** - 不开启读写分离，所有读操作都发送到当前可用的 writeHost
- **1** - 全部的 readHost 与 stand by writeHost 参与 select 语句的负载均衡
- **2** - 所有读操作都随机分发到 writeHost、readHost
- **3** - 所有读请求随机分发到 readHost

### writeType 参数

- **0** - 所有写操作发送到配置的第一个 writeHost
- **1** - 所有写操作随机发送到配置的 writeHost

## 全局表

```xml
<!-- 全局表配置 -->
<table name="t_dict" dataNode="dn1,dn2,dn3" type="global" />
```

全局表特点：
- 每个分片都有完整数据
- 插入、更新、删除操作会在所有节点执行
- 查询操作只在一个节点执行
- 适合字典表、配置表等

## ER 表

```xml
<!-- 父表 -->
<table name="t_order" dataNode="dn1,dn2" rule="mod-long">
    <!-- 子表 -->
    <childTable name="t_order_item" primaryKey="id" joinKey="order_id" parentKey="id" />
</table>
```

ER 表特点：
- 子表数据跟随父表分片
- 避免跨库 JOIN
- 提高查询性能

## 管理命令

```sql
-- 查看数据源
show @@datasource;

-- 查看后端连接
show @@backend;

-- 查看连接
show @@connection;

-- 查看线程池
show @@threadpool;

-- 查看缓存
show @@cache;

-- 重新加载配置
reload @@config;

-- 切换数据源
switch @@datasource name:value;

-- 查看心跳
show @@heartbeat;

-- 查看版本
show @@version;
```

## 高可用

### 主从切换

```xml
<dataHost name="localhost1" maxCon="1000" minCon="10" 
          balance="1" writeType="0" dbType="mysql" 
          dbDriver="native" switchType="1">
    <heartbeat>select user()</heartbeat>
    
    <writeHost host="hostM1" url="192.168.1.1:3306" user="root" password="123456">
        <readHost host="hostS1" url="192.168.1.2:3306" user="root" password="123456" />
    </writeHost>
    
    <!-- 备用写主机 -->
    <writeHost host="hostM2" url="192.168.1.3:3306" user="root" password="123456" />
</dataHost>
```

### switchType 参数

- **-1** - 不自动切换
- **1** - 默认切换
- **2** - 基于 MySQL 主从同步状态决定是否切换

## 性能优化

### 连接池配置

```xml
<dataHost name="localhost1" maxCon="1000" minCon="10" balance="1">
    <!-- maxCon: 最大连接数 -->
    <!-- minCon: 最小连接数 -->
</dataHost>
```

### SQL 缓存

```xml
<system>
    <property name="sqlExecuteTimeout">300</property>
    <property name="processorBufferPool">163840000</property>
    <property name="processorBufferChunk">40960</property>
</system>
```

### 分片优化

1. 选择合适的分片键
2. 避免跨库 JOIN
3. 使用全局表
4. 使用 ER 表
5. 批量操作

## 最佳实践

1. **合理选择分片规则** - 根据业务特点选择
2. **使用全局表** - 减少跨库查询
3. **使用 ER 表** - 保持数据关联性
4. **监控性能** - 定期检查慢查询
5. **定期备份** - 保证数据安全
6. **使用读写分离** - 提高查询性能
7. **配置高可用** - 保证服务稳定性

## 常见问题

### 1. 跨库 JOIN

```sql
-- 避免跨库 JOIN
-- 方案1：使用全局表
-- 方案2：使用 ER 表
-- 方案3：应用层关联
```

### 2. 分布式主键

```xml
<!-- 使用数据库序列 -->
<table name="t_order" dataNode="dn1,dn2" rule="mod-long" autoIncrement="true" />

<!-- 或使用雪花算法 -->
<table name="t_order" dataNode="dn1,dn2" rule="mod-long">
    <property name="sequenceHandlerType">2</property>
</table>
```

### 3. 数据迁移

```bash
# 1. 导出数据
mysqldump -h localhost -P 3306 -u root -p db_name > backup.sql

# 2. 修改数据
# 根据分片规则修改数据

# 3. 导入数据
mysql -h localhost -P 8066 -u root -p testdb < backup.sql
```

## 总结

Mycat 是一个功能强大的数据库中间件：

- ✅ 数据分片、读写分离
- ✅ 高可用、故障切换
- ✅ 支持多种分片规则
- ✅ 兼容 MySQL 协议
- ✅ 易于部署和使用

掌握 Mycat 对于构建大规模数据库系统非常重要。

## 参考资源

- [Mycat 官方文档](http://www.mycat.org.cn/)
- [Mycat GitHub](https://github.com/MyCATApache/Mycat2)
- [Mycat 权威指南](http://www.mycat.org.cn/document/mycat-definitive-guide.pdf)
