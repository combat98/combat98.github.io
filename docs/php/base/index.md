# PHP 基础

## 简介

PHP（Hypertext Preprocessor）是一种广泛使用的开源服务器端脚本语言，特别适合 Web 开发。

### 特点

- 易于学习
- 跨平台
- 丰富的框架和库
- 强大的数据库支持
- 大量的社区资源

## 环境配置

### Windows

```bash
# 下载 XAMPP
# https://www.apachefriends.org/

# 或下载 PHP
# https://windows.php.net/download/

# 验证安装
php -v
```

### macOS

```bash
# macOS 自带 PHP，或使用 Homebrew 安装
brew install php

# 验证
php -v
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install php php-cli php-mysql

# CentOS/RHEL
sudo yum install php php-cli php-mysql

# 验证
php -v
```

### 运行 PHP

```bash
# 命令行运行
php script.php

# 内置服务器
php -S localhost:8000
```

## 语法基础

### Hello World

```php
<?php
echo "Hello, World!";
?>
```

### 变量和数据类型

```php
<?php
// 变量（以 $ 开头）
$name = "张三";
$age = 25;
$price = 99.99;
$isStudent = true;

// 字符串拼接
$greeting = "你好, " . $name . "!";
echo $greeting . "\n";

// 字符串插值（双引号）
echo "我是 $name, 今年 $age 岁\n";

// 常量
define("PI", 3.14159);
const MAX_SIZE = 100;

echo PI . "\n";
?>
```

### 数组

```php
<?php
// 索引数组
$fruits = array("苹果", "香蕉", "橙子");
$numbers = [1, 2, 3, 4, 5];

echo $fruits[0] . "\n";

// 关联数组
$person = array(
    "name" => "张三",
    "age" => 25,
    "city" => "北京"
);

echo $person["name"] . "\n";

// 遍历数组
foreach ($fruits as $fruit) {
    echo $fruit . " ";
}
echo "\n";

foreach ($person as $key => $value) {
    echo "$key: $value\n";
}
?>
```

### 控制流

```php
<?php
// if-else
$score = 85;
if ($score >= 90) {
    echo "优秀\n";
} elseif ($score >= 80) {
    echo "良好\n";
} elseif ($score >= 60) {
    echo "及格\n";
} else {
    echo "不及格\n";
}

// switch
$day = 3;
switch ($day) {
    case 1:
        echo "星期一\n";
        break;
    case 2:
        echo "星期二\n";
        break;
    case 3:
        echo "星期三\n";
        break;
    default:
        echo "其他\n";
}

// for 循环
for ($i = 0; $i < 5; $i++) {
    echo "$i ";
}
echo "\n";

// while 循环
$j = 0;
while ($j < 5) {
    echo "$j ";
    $j++;
}
echo "\n";

// foreach 循环
$numbers = [1, 2, 3, 4, 5];
foreach ($numbers as $num) {
    echo "$num ";
}
echo "\n";
?>
```

### 函数

```php
<?php
// 基本函数
function add($a, $b) {
    return $a + $b;
}

// 默认参数
function greet($name = "朋友") {
    return "你好, $name!";
}

// 类型声明（PHP 7+）
function multiply(int $a, int $b): int {
    return $a * $b;
}

// 可变参数
function sum(...$numbers) {
    $total = 0;
    foreach ($numbers as $num) {
        $total += $num;
    }
    return $total;
}

echo add(5, 3) . "\n";
echo greet() . "\n";
echo greet("张三") . "\n";
echo multiply(4, 6) . "\n";
echo sum(1, 2, 3, 4, 5) . "\n";
?>
```

### 类和对象

```php
<?php
class Person {
    // 属性
    private $name;
    private $age;
    
    // 构造函数
    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }
    
    // 方法
    public function introduce() {
        return "我是 {$this->name}, 今年 {$this->age} 岁";
    }
    
    // Getter
    public function getName() {
        return $this->name;
    }
    
    // Setter
    public function setAge($age) {
        if ($age > 0) {
            $this->age = $age;
        }
    }
}

$person = new Person("张三", 25);
echo $person->introduce() . "\n";

$person->setAge(26);
echo $person->introduce() . "\n";
?>
```

### 继承

```php
<?php
class Animal {
    protected $name;
    
    public function __construct($name) {
        $this->name = $name;
    }
    
    public function speak() {
        return "{$this->name} 发出声音";
    }
}

class Dog extends Animal {
    public function speak() {
        return "{$this->name} 说: 汪汪汪!";
    }
}

class Cat extends Animal {
    public function speak() {
        return "{$this->name} 说: 喵喵喵!";
    }
}

$dog = new Dog("旺财");
$cat = new Cat("咪咪");

echo $dog->speak() . "\n";
echo $cat->speak() . "\n";
?>
```

### 文件操作

```php
<?php
// 写入文件
file_put_contents("test.txt", "Hello, PHP!");

// 读取文件
$content = file_get_contents("test.txt");
echo $content . "\n";

// 追加内容
file_put_contents("test.txt", "\n新的一行", FILE_APPEND);

// 逐行读取
$lines = file("test.txt");
foreach ($lines as $line) {
    echo $line;
}

// 删除文件
unlink("test.txt");
?>
```

### 表单处理

```php
<!-- form.html -->
<form method="POST" action="process.php">
    <input type="text" name="username" placeholder="用户名">
    <input type="password" name="password" placeholder="密码">
    <button type="submit">提交</button>
</form>

<!-- process.php -->
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    
    // 验证和处理数据
    if (!empty($username) && !empty($password)) {
        echo "欢迎, $username!";
    } else {
        echo "请填写所有字段";
    }
}
?>
```

### 数据库操作（MySQLi）

```php
<?php
// 连接数据库
$conn = new mysqli("localhost", "username", "password", "database");

if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

// 查询
$sql = "SELECT * FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "ID: " . $row["id"] . " - 姓名: " . $row["name"] . "\n";
    }
}

// 插入
$sql = "INSERT INTO users (name, email) VALUES ('张三', 'zhang@example.com')";
if ($conn->query($sql) === TRUE) {
    echo "新记录插入成功\n";
}

// 关闭连接
$conn->close();
?>
```

### PDO（推荐）

```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=database", "username", "password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 预处理语句
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->execute(['id' => 1]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    print_r($user);
    
    // 插入
    $stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (:name, :email)");
    $stmt->execute([
        'name' => '李四',
        'email' => 'li@example.com'
    ]);
    
} catch(PDOException $e) {
    echo "错误: " . $e->getMessage();
}
?>
```

## 参考资源

- [PHP 官方文档](https://www.php.net/manual/zh/)
- [PHP The Right Way](https://phptherightway.com/)
