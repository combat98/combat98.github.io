# Laravel 框架

## 简介

Laravel 是一个优雅的 PHP Web 应用框架，提供了丰富的功能和工具。

## 安装

```bash
# 使用 Composer 创建项目
composer create-project laravel/laravel myapp

cd myapp

# 启动开发服务器
php artisan serve
```

## 路由

```php
// routes/web.php
<?php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/users', function () {
    return 'Users List';
});

Route::get('/users/{id}', function ($id) {
    return "User ID: $id";
});

Route::post('/users', function () {
    return 'Create User';
});
?>
```

## 控制器

```php
// app/Http/Controllers/UserController.php
<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return view('users.index');
    }
    
    public function show($id)
    {
        return "User ID: $id";
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
        ]);
        
        // 创建用户
        return redirect('/users');
    }
}
?>

// routes/web.php
Route::resource('users', UserController::class);
```

## 模型（Eloquent ORM）

```php
// app/Models/User.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = ['name', 'email', 'age'];
    
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

// 使用模型
$users = User::all();
$user = User::find(1);
$user = User::where('age', '>', 18)->get();

// 创建
$user = User::create([
    'name' => '张三',
    'email' => 'zhang@example.com',
    'age' => 25
]);

// 更新
$user->update(['age' => 26]);

// 删除
$user->delete();
?>
```

## 视图（Blade 模板）

```php
<!-- resources/views/users/index.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>用户列表</title>
</head>
<body>
    <h1>用户列表</h1>
    
    @foreach($users as $user)
        <div>
            <h3>{{ $user->name }}</h3>
            <p>{{ $user->email }}</p>
        </div>
    @endforeach
    
    @if(count($users) > 0)
        <p>共 {{ count($users) }} 个用户</p>
    @else
        <p>没有用户</p>
    @endif
</body>
</html>
```

## 数据库迁移

```bash
# 创建迁移
php artisan make:migration create_users_table

# 运行迁移
php artisan migrate

# 回滚
php artisan migrate:rollback
```

```php
// database/migrations/xxxx_create_users_table.php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->integer('age');
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
?>
```

## API 开发

```php
// routes/api.php
<?php
use App\Http\Controllers\Api\UserController;

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
?>

// app/Http/Controllers/Api/UserController.php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }
    
    public function store(Request $request)
    {
        $user = User::create($request->all());
        return response()->json($user, 201);
    }
    
    public function show($id)
    {
        return User::findOrFail($id);
    }
    
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json($user);
    }
    
    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }
}
?>
```

## 参考资源

- [Laravel 官方文档](https://laravel.com/docs)
- [Laravel 中文文档](https://learnku.com/docs/laravel)
