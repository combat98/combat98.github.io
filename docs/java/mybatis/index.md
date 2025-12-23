# MyBatis

## 简介

MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。

### 特点

- **简单易学** - 学习成本低
- **灵活** - SQL 写在 XML 里，便于统一管理和优化
- **解除 SQL 与程序代码的耦合** - SQL 和代码分离
- **提供映射标签** - 支持对象与数据库的 ORM 字段关系映射
- **提供 XML 标签** - 支持编写动态 SQL
- **提供缓存机制** - 一级缓存和二级缓存

## 快速开始

### Maven 依赖

```xml
<dependencies>
    <!-- MyBatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.10</version>
    </dependency>
    
    <!-- MySQL驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.28</version>
    </dependency>
</dependencies>
```

### 配置文件

**mybatis-config.xml**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 环境配置 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/test"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    
    <!-- 映射器 -->
    <mappers>
        <mapper resource="mapper/UserMapper.xml"/>
    </mappers>
</configuration>
```

### 实体类

```java
public class User {
    private Long id;
    private String username;
    private String email;
    private Integer age;
    
    // getter和setter方法
}
```

### Mapper 接口

```java
public interface UserMapper {
    User selectById(Long id);
    List<User> selectAll();
    int insert(User user);
    int update(User user);
    int deleteById(Long id);
}
```

### Mapper XML

**UserMapper.xml**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">
    
    <!-- 查询单个 -->
    <select id="selectById" resultType="com.example.entity.User">
        SELECT * FROM users WHERE id = #{id}
    </select>
    
    <!-- 查询所有 -->
    <select id="selectAll" resultType="com.example.entity.User">
        SELECT * FROM users
    </select>
    
    <!-- 插入 -->
    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO users(username, email, age)
        VALUES(#{username}, #{email}, #{age})
    </insert>
    
    <!-- 更新 -->
    <update id="update">
        UPDATE users
        SET username = #{username}, email = #{email}, age = #{age}
        WHERE id = #{id}
    </update>
    
    <!-- 删除 -->
    <delete id="deleteById">
        DELETE FROM users WHERE id = #{id}
    </delete>
</mapper>
```

### 使用示例

```java
public class MyBatisDemo {
    public static void main(String[] args) throws IOException {
        // 1. 读取配置文件
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        
        // 2. 创建SqlSessionFactory
        SqlSessionFactory sqlSessionFactory = 
            new SqlSessionFactoryBuilder().build(inputStream);
        
        // 3. 获取SqlSession
        try (SqlSession session = sqlSessionFactory.openSession()) {
            // 4. 获取Mapper
            UserMapper mapper = session.getMapper(UserMapper.class);
            
            // 5. 执行SQL
            User user = mapper.selectById(1L);
            System.out.println(user);
            
            // 6. 提交事务
            session.commit();
        }
    }
}
```

## 核心配置

### 全局配置

```xml
<configuration>
    <!-- 设置 -->
    <settings>
        <!-- 开启驼峰命名转换 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- 开启延迟加载 -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <!-- 开启二级缓存 -->
        <setting name="cacheEnabled" value="true"/>
        <!-- 日志实现 -->
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
    
    <!-- 类型别名 -->
    <typeAliases>
        <typeAlias type="com.example.entity.User" alias="User"/>
        <!-- 或扫描包 -->
        <package name="com.example.entity"/>
    </typeAliases>
    
    <!-- 类型处理器 -->
    <typeHandlers>
        <typeHandler handler="com.example.handler.MyTypeHandler"/>
    </typeHandlers>
    
    <!-- 插件 -->
    <plugins>
        <plugin interceptor="com.example.plugin.MyPlugin">
            <property name="someProperty" value="100"/>
        </plugin>
    </plugins>
</configuration>
```

### 环境配置

```xml
<environments default="development">
    <!-- 开发环境 -->
    <environment id="development">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <property name="driver" value="${jdbc.driver}"/>
            <property name="url" value="${jdbc.url}"/>
            <property name="username" value="${jdbc.username}"/>
            <property name="password" value="${jdbc.password}"/>
        </dataSource>
    </environment>
    
    <!-- 生产环境 -->
    <environment id="production">
        <transactionManager type="JDBC"/>
        <dataSource type="POOLED">
            <property name="driver" value="${jdbc.driver}"/>
            <property name="url" value="${jdbc.url}"/>
            <property name="username" value="${jdbc.username}"/>
            <property name="password" value="${jdbc.password}"/>
        </dataSource>
    </environment>
</environments>
```

## 映射文件

### ResultMap

```xml
<!-- 基本ResultMap -->
<resultMap id="userResultMap" type="User">
    <id property="id" column="user_id"/>
    <result property="username" column="user_name"/>
    <result property="email" column="email"/>
    <result property="age" column="age"/>
</resultMap>

<select id="selectById" resultMap="userResultMap">
    SELECT user_id, user_name, email, age
    FROM users WHERE user_id = #{id}
</select>

<!-- 一对一关联 -->
<resultMap id="userWithProfileMap" type="User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <association property="profile" javaType="Profile">
        <id property="id" column="profile_id"/>
        <result property="bio" column="bio"/>
    </association>
</resultMap>

<!-- 一对多关联 -->
<resultMap id="userWithOrdersMap" type="User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <collection property="orders" ofType="Order">
        <id property="id" column="order_id"/>
        <result property="orderNo" column="order_no"/>
    </collection>
</resultMap>
```

### 参数传递

```xml
<!-- 单个参数 -->
<select id="selectById" resultType="User">
    SELECT * FROM users WHERE id = #{id}
</select>

<!-- 多个参数 - 使用@Param -->
<select id="selectByUsernameAndEmail" resultType="User">
    SELECT * FROM users 
    WHERE username = #{username} AND email = #{email}
</select>

<!-- 对象参数 -->
<insert id="insert">
    INSERT INTO users(username, email, age)
    VALUES(#{username}, #{email}, #{age})
</insert>

<!-- Map参数 -->
<select id="selectByMap" resultType="User">
    SELECT * FROM users 
    WHERE username = #{username} AND age = #{age}
</select>
```

### 动态 SQL

**if 标签**

```xml
<select id="selectByCondition" resultType="User">
    SELECT * FROM users
    WHERE 1=1
    <if test="username != null and username != ''">
        AND username = #{username}
    </if>
    <if test="email != null and email != ''">
        AND email = #{email}
    </if>
    <if test="age != null">
        AND age = #{age}
    </if>
</select>
```

**where 标签**

```xml
<select id="selectByCondition" resultType="User">
    SELECT * FROM users
    <where>
        <if test="username != null and username != ''">
            AND username = #{username}
        </if>
        <if test="email != null and email != ''">
            AND email = #{email}
        </if>
    </where>
</select>
```

**set 标签**

```xml
<update id="updateSelective">
    UPDATE users
    <set>
        <if test="username != null">username = #{username},</if>
        <if test="email != null">email = #{email},</if>
        <if test="age != null">age = #{age}</if>
    </set>
    WHERE id = #{id}
</update>
```

**choose、when、otherwise**

```xml
<select id="selectByCondition" resultType="User">
    SELECT * FROM users
    WHERE 1=1
    <choose>
        <when test="username != null">
            AND username = #{username}
        </when>
        <when test="email != null">
            AND email = #{email}
        </when>
        <otherwise>
            AND age = 18
        </otherwise>
    </choose>
</select>
```

**foreach 标签**

```xml
<!-- IN查询 -->
<select id="selectByIds" resultType="User">
    SELECT * FROM users
    WHERE id IN
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>

<!-- 批量插入 -->
<insert id="insertBatch">
    INSERT INTO users(username, email, age) VALUES
    <foreach collection="list" item="user" separator=",">
        (#{user.username}, #{user.email}, #{user.age})
    </foreach>
</insert>
```

**trim 标签**

```xml
<select id="selectByCondition" resultType="User">
    SELECT * FROM users
    <trim prefix="WHERE" prefixOverrides="AND |OR ">
        <if test="username != null">
            AND username = #{username}
        </if>
        <if test="email != null">
            AND email = #{email}
        </if>
    </trim>
</select>
```

**sql 和 include**

```xml
<!-- 定义SQL片段 -->
<sql id="userColumns">
    id, username, email, age
</sql>

<!-- 引用SQL片段 -->
<select id="selectAll" resultType="User">
    SELECT <include refid="userColumns"/>
    FROM users
</select>
```

## 关联查询

### 一对一

**嵌套查询**

```xml
<resultMap id="userWithProfileMap" type="User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <association property="profile" column="id" 
                 select="selectProfileByUserId"/>
</resultMap>

<select id="selectById" resultMap="userWithProfileMap">
    SELECT * FROM users WHERE id = #{id}
</select>

<select id="selectProfileByUserId" resultType="Profile">
    SELECT * FROM profiles WHERE user_id = #{id}
</select>
```

**嵌套结果**

```xml
<resultMap id="userWithProfileMap" type="User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <association property="profile" javaType="Profile">
        <id property="id" column="profile_id"/>
        <result property="bio" column="bio"/>
    </association>
</resultMap>

<select id="selectById" resultMap="userWithProfileMap">
    SELECT u.*, p.id as profile_id, p.bio
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE u.id = #{id}
</select>
```

### 一对多

```xml
<resultMap id="userWithOrdersMap" type="User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <collection property="orders" ofType="Order">
        <id property="id" column="order_id"/>
        <result property="orderNo" column="order_no"/>
        <result property="amount" column="amount"/>
    </collection>
</resultMap>

<select id="selectWithOrders" resultMap="userWithOrdersMap">
    SELECT u.*, o.id as order_id, o.order_no, o.amount
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.id = #{id}
</select>
```

## 缓存

### 一级缓存

- SqlSession 级别的缓存
- 默认开启
- 同一个 SqlSession 中查询相同数据会使用缓存

```java
SqlSession session = sqlSessionFactory.openSession();
UserMapper mapper = session.getMapper(UserMapper.class);

// 第一次查询，从数据库查询
User user1 = mapper.selectById(1L);

// 第二次查询，从一级缓存获取
User user2 = mapper.selectById(1L);

// user1 == user2 为 true
```

### 二级缓存

- Mapper 级别的缓存
- 需要手动开启
- 不同 SqlSession 可以共享缓存

```xml
<!-- 开启二级缓存 -->
<cache/>

<!-- 或配置缓存属性 -->
<cache
  eviction="LRU"
  flushInterval="60000"
  size="512"
  readOnly="true"/>

<!-- 查询使用缓存 -->
<select id="selectById" resultType="User" useCache="true">
    SELECT * FROM users WHERE id = #{id}
</select>
```

## 注解开发

### 基本注解

```java
public interface UserMapper {
    
    @Select("SELECT * FROM users WHERE id = #{id}")
    User selectById(Long id);
    
    @Select("SELECT * FROM users")
    List<User> selectAll();
    
    @Insert("INSERT INTO users(username, email, age) " +
            "VALUES(#{username}, #{email}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);
    
    @Update("UPDATE users SET username=#{username}, " +
            "email=#{email}, age=#{age} WHERE id=#{id}")
    int update(User user);
    
    @Delete("DELETE FROM users WHERE id = #{id}")
    int deleteById(Long id);
}
```

### 动态 SQL 注解

```java
public interface UserMapper {
    
    @SelectProvider(type = UserSqlProvider.class, method = "selectByCondition")
    List<User> selectByCondition(User user);
    
    @InsertProvider(type = UserSqlProvider.class, method = "insertSelective")
    int insertSelective(User user);
}

public class UserSqlProvider {
    
    public String selectByCondition(User user) {
        return new SQL() {{
            SELECT("*");
            FROM("users");
            if (user.getUsername() != null) {
                WHERE("username = #{username}");
            }
            if (user.getEmail() != null) {
                WHERE("email = #{email}");
            }
        }}.toString();
    }
    
    public String insertSelective(User user) {
        return new SQL() {{
            INSERT_INTO("users");
            if (user.getUsername() != null) {
                VALUES("username", "#{username}");
            }
            if (user.getEmail() != null) {
                VALUES("email", "#{email}");
            }
            if (user.getAge() != null) {
                VALUES("age", "#{age}");
            }
        }}.toString();
    }
}
```

## Spring 集成

### Maven 依赖

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.7</version>
</dependency>
```

### 配置

```java
@Configuration
@MapperScan("com.example.mapper")
public class MyBatisConfig {
    
    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) 
            throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        
        // 设置配置
        org.apache.ibatis.session.Configuration configuration = 
            new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        factoryBean.setConfiguration(configuration);
        
        // 设置Mapper位置
        factoryBean.setMapperLocations(
            new PathMatchingResourcePatternResolver()
                .getResources("classpath:mapper/*.xml"));
        
        return factoryBean.getObject();
    }
}
```

### 使用

```java
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }
}
```

## 最佳实践

1. **合理使用动态SQL** - 提高SQL灵活性
2. **使用ResultMap** - 处理复杂映射
3. **避免N+1问题** - 使用关联查询
4. **合理使用缓存** - 提高查询性能
5. **SQL写在XML中** - 便于维护
6. **使用批量操作** - 提高插入/更新效率
7. **注意SQL注入** - 使用#{}而不是${}

## 总结

MyBatis 是一款优秀的持久层框架：

- ✅ 简单易学 - 学习成本低
- ✅ 灵活强大 - 支持复杂SQL
- ✅ SQL分离 - 便于维护
- ✅ 动态SQL - 灵活构建查询
- ✅ 缓存支持 - 提高性能

掌握 MyBatis 是 Java 开发者的必备技能。

## 参考资源

- [MyBatis官方文档](https://mybatis.org/mybatis-3/zh/index.html)
- [MyBatisPlus官方文档](https://baomidou.com)
