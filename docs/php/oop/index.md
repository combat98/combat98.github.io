# PHP 面向对象编程

## 类的基础

```php
<?php
class User {
    // 属性
    public $name;
    protected $email;
    private $password;
    
    // 构造函数
    public function __construct($name, $email, $password) {
        $this->name = $name;
        $this->email = $email;
        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }
    
    // 方法
    public function getInfo() {
        return "用户: {$this->name}, 邮箱: {$this->email}";
    }
    
    // 静态方法
    public static function create($name, $email, $password) {
        return new self($name, $email, $password);
    }
}

$user = new User("张三", "zhang@example.com", "password123");
echo $user->getInfo() . "\n";

$user2 = User::create("李四", "li@example.com", "pass456");
?>
```

## 继承和多态

```php
<?php
abstract class Shape {
    abstract public function area();
    abstract public function perimeter();
}

class Rectangle extends Shape {
    private $width;
    private $height;
    
    public function __construct($width, $height) {
        $this->width = $width;
        $this->height = $height;
    }
    
    public function area() {
        return $this->width * $this->height;
    }
    
    public function perimeter() {
        return 2 * ($this->width + $this->height);
    }
}

class Circle extends Shape {
    private $radius;
    
    public function __construct($radius) {
        $this->radius = $radius;
    }
    
    public function area() {
        return pi() * $this->radius * $this->radius;
    }
    
    public function perimeter() {
        return 2 * pi() * $this->radius;
    }
}

$rect = new Rectangle(5, 3);
$circle = new Circle(4);

echo "矩形面积: " . $rect->area() . "\n";
echo "圆形面积: " . $circle->area() . "\n";
?>
```

## 接口和Trait

```php
<?php
interface Drawable {
    public function draw();
}

trait Timestampable {
    public function getCreatedAt() {
        return date('Y-m-d H:i:s');
    }
}

class Post implements Drawable {
    use Timestampable;
    
    private $title;
    
    public function __construct($title) {
        $this->title = $title;
    }
    
    public function draw() {
        echo "绘制文章: {$this->title}\n";
    }
}

$post = new Post("我的文章");
$post->draw();
echo "创建时间: " . $post->getCreatedAt() . "\n";
?>
```

## 参考资源

- [PHP OOP](https://www.php.net/manual/zh/language.oop5.php)
