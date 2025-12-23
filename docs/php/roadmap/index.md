# PHP 学习路线与框架生态

## 学习路线

### 第一阶段：基础入门（1-2周）

1. **环境搭建**
   - 安装 PHP
   - 配置 Web 服务器（Apache/Nginx）
   - 安装 Composer

2. **基础语法**
   - 变量和数据类型
   - 运算符和控制流
   - 函数
   - 数组
   - 字符串处理

3. **Web 基础**
   - HTML 表单处理
   - GET 和 POST 请求
   - Cookie 和 Session
   - 文件上传

### 第二阶段：面向对象（2-3周）

1. **OOP 基础**
   - 类和对象
   - 继承和多态
   - 接口和抽象类
   - Trait

2. **高级特性**
   - 命名空间
   - 自动加载
   - 异常处理
   - 魔术方法

3. **设计模式**
   - 单例模式
   - 工厂模式
   - 观察者模式
   - 依赖注入

### 第三阶段：数据库操作（2-3周）

1. **MySQL 基础**
   - SQL 语句
   - 数据库设计
   - 索引优化

2. **PHP 数据库操作**
   - MySQLi
   - PDO
   - 预处理语句

3. **ORM**
   - Eloquent
   - Doctrine

### 第四阶段：框架开发（4-6周）

1. **Laravel 框架**
   - 路由和控制器
   - Eloquent ORM
   - Blade 模板
   - 中间件
   - 认证和授权

2. **API 开发**
   - RESTful API
   - JWT 认证
   - API 资源

3. **高级特性**
   - 队列和任务调度
   - 事件和监听器
   - 缓存

## 框架生态

### Web 框架

#### Laravel
- **特点**：优雅、功能完整
- **适用场景**：企业级应用、快速开发

```bash
composer create-project laravel/laravel myapp
```

**核心特性：**
- Eloquent ORM
- Blade 模板引擎
- Artisan 命令行工具
- 队列系统
- 任务调度

```php
// 路由
Route::get('/users', [UserController::class, 'index']);

// 控制器
class UserController extends Controller {
    public function index() {
        return User::all();
    }
}

// 模型
class User extends Model {
    protected $fillable = ['name', 'email'];
}
```

#### Symfony
- **特点**：企业级、组件化
- **适用场景**：大型项目、高度定制

```bash
composer create-project symfony/skeleton myapp
```

**核心组件：**
- HttpFoundation
- Routing
- Console
- Validator
- Security

#### CodeIgniter
- **特点**：轻量级、简单
- **适用场景**：中小型项目

```bash
composer create-project codeigniter4/appstarter myapp
```

#### Slim
- **特点**：微框架、灵活
- **适用场景**：API 服务、微服务

```php
$app = new \Slim\App();

$app->get('/hello/{name}', function ($request, $response, $args) {
    return $response->write("Hello, " . $args['name']);
});

$app->run();
```

### ORM 框架

#### Eloquent (Laravel)
- **特点**：Active Record 模式、易用

```php
// 定义模型
class Post extends Model {
    public function user() {
        return $this->belongsTo(User::class);
    }
}

// 查询
$posts = Post::where('status', 'published')
    ->with('user')
    ->get();

// 创建
Post::create([
    'title' => '标题',
    'content' => '内容'
]);
```

#### Doctrine
- **特点**：Data Mapper 模式、功能强大

```php
$user = new User();
$user->setName('张三');

$entityManager->persist($user);
$entityManager->flush();
```

### 模板引擎

#### Blade (Laravel)
- **特点**：简洁、强大

```blade
@extends('layouts.app')

@section('content')
    <h1>{{ $title }}</h1>
    
    @foreach($users as $user)
        <p>{{ $user->name }}</p>
    @endforeach
@endsection
```

#### Twig (Symfony)
- **特点**：安全、灵活

```twig
{% extends "base.html.twig" %}

{% block content %}
    <h1>{{ title }}</h1>
    
    {% for user in users %}
        <p>{{ user.name }}</p>
    {% endfor %}
{% endblock %}
```

### API 开发

#### Laravel API Resources
```php
class UserResource extends JsonResource {
    public function toArray($request) {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }
}

// 使用
return UserResource::collection(User::all());
```

#### API Platform (Symfony)
- **特点**：自动生成 REST/GraphQL API

```php
#[ApiResource]
class Book {
    #[ORM\Id]
    public ?int $id = null;
    
    public string $title;
}
```

### 测试框架

#### PHPUnit
- **特点**：标准测试框架

```php
class UserTest extends TestCase {
    public function testUserCreation() {
        $user = User::create([
            'name' => '张三',
            'email' => 'zhang@example.com'
        ]);
        
        $this->assertDatabaseHas('users', [
            'email' => 'zhang@example.com'
        ]);
    }
}
```

#### Pest (Laravel)
- **特点**：简洁、优雅

```php
test('user can be created', function () {
    $user = User::create([
        'name' => '张三',
        'email' => 'zhang@example.com'
    ]);
    
    expect($user->name)->toBe('张三');
});
```

### 包管理

#### Composer
- **特点**：PHP 依赖管理工具

```json
{
    "require": {
        "php": "^8.1",
        "laravel/framework": "^10.0"
    },
    "require-dev": {
        "phpunit/phpunit": "^10.0"
    }
}
```

### 缓存

#### Redis
```php
use Illuminate\Support\Facades\Redis;

Redis::set('key', 'value');
$value = Redis::get('key');
```

#### Memcached
```php
use Illuminate\Support\Facades\Cache;

Cache::put('key', 'value', 600);
$value = Cache::get('key');
```

### 队列

#### Laravel Queue
```php
// 定义任务
class SendEmail implements ShouldQueue {
    public function handle() {
        // 发送邮件
    }
}

// 分发任务
SendEmail::dispatch($user);
```

### 日志

#### Monolog
```php
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$log = new Logger('name');
$log->pushHandler(new StreamHandler('app.log', Logger::WARNING));

$log->warning('警告信息');
$log->error('错误信息');
```

## 学习资源

### 官方资源
- [PHP 官方文档](https://www.php.net/manual/zh/)
- [Laravel 官方文档](https://laravel.com/docs)
- [Symfony 官方文档](https://symfony.com/doc/current/index.html)

### 书籍推荐
- 《Modern PHP》
- 《Laravel 实战》
- 《PHP 核心技术与最佳实践》

### 在线资源
- [PHP The Right Way](https://phptherightway.com/)
- [Laravel 中文文档](https://learnku.com/docs/laravel)
- [Awesome PHP](https://github.com/ziadoz/awesome-php)

### 实战项目
1. **博客系统**：使用 Laravel 构建完整博客
2. **RESTful API**：构建用户管理 API
3. **电商系统**：商品管理、订单系统
4. **CMS 系统**：内容管理系统

## 职业发展方向

1. **Web 后端开发**
   - Laravel 开发
   - API 开发

2. **全栈开发**
   - PHP + Vue.js
   - PHP + React

3. **架构师**
   - 系统设计
   - 性能优化

4. **DevOps**
   - 自动化部署
   - 容器化

## 最佳实践

1. **代码规范**
   - 遵循 PSR 标准
   - 使用 PHP CS Fixer
   - 使用 PHPStan 静态分析

2. **项目结构（Laravel）**
   ```
   app/
   ├── Http/
   │   ├── Controllers/
   │   ├── Middleware/
   │   └── Requests/
   ├── Models/
   ├── Services/
   └── Repositories/
   ```

3. **安全性**
   - 防止 SQL 注入（使用预处理）
   - 防止 XSS 攻击
   - CSRF 保护
   - 密码加密

4. **性能优化**
   - 使用缓存
   - 数据库查询优化
   - 使用队列处理耗时任务
   - 使用 OPcache

5. **版本控制**
   - 使用 Git
   - 遵循 Git Flow
   - 代码审查

## PHP 8+ 新特性

### 命名参数
```php
function createUser(string $name, string $email, int $age) {
    // ...
}

createUser(name: '张三', email: 'zhang@example.com', age: 25);
```

### 联合类型
```php
function process(int|float $number): int|float {
    return $number * 2;
}
```

### Match 表达式
```php
$result = match($status) {
    'pending' => '待处理',
    'approved' => '已批准',
    'rejected' => '已拒绝',
    default => '未知'
};
```

### 构造器属性提升
```php
class User {
    public function __construct(
        public string $name,
        public string $email,
        public int $age
    ) {}
}
```

### Nullsafe 操作符
```php
$country = $user?->getAddress()?->getCountry();
```
