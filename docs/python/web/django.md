# Django

## 简介

Django 是一个高级 Python Web 框架，鼓励快速开发和简洁实用的设计。

### 特点

- 完整的 Web 框架
- ORM（对象关系映射）
- 强大的后台管理系统
- 表单处理
- 用户认证系统
- 安全性高

### 安装

```
pip install django
```

## 快速开始

### 创建项目

```
django-admin startproject myproject
```

项目结构：
```
myproject/
    manage.py
    myproject/
        __init__.py
        settings.py
        urls.py
        wsgi.py
```

### 创建应用

```
cd myproject
python manage.py startapp myapp
```

### 运行服务器

```
python manage.py runserver
```

访问 `http://127.0.0.1:8000/`

## 配置

在 settings.py 中注册应用：

```python
INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'myapp',
]
```

数据库配置：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

## 模型（Models）

定义数据模型：

```python
# myapp/models.py

from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    age = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.username

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
```

### 常用字段类型

```python
CharField(max_length=100)  # 字符串
TextField()  # 长文本
IntegerField()  # 整数
FloatField()  # 浮点数
BooleanField()  # 布尔值
DateField()  # 日期
DateTimeField()  # 日期时间
EmailField()  # 邮箱
FileField(upload_to='uploads/')  # 文件
ImageField(upload_to='images/')  # 图片
JSONField()  # JSON

# 关系字段
ForeignKey(User, on_delete=models.CASCADE)  # 一对多
ManyToManyField(Tag)  # 多对多
OneToOneField(Profile, on_delete=models.CASCADE)  # 一对一
```

### 数据库迁移

```
# 创建迁移文件
python manage.py makemigrations

# 执行迁移
python manage.py migrate
```

### 数据查询

```python
# 获取所有记录
users = User.objects.all()

# 过滤
users = User.objects.filter(age__gte=18)
users = User.objects.filter(username__contains='john')

# 排除
users = User.objects.exclude(age__lt=18)

# 获取单个对象
user = User.objects.get(id=1)

# 排序
users = User.objects.order_by('-created_at')

# 限制数量
users = User.objects.all()[:10]

# 聚合
from django.db.models import Count, Avg, Max, Min
user_count = User.objects.count()
avg_age = User.objects.aggregate(Avg('age'))
```

### CRUD 操作

```python
# 创建
user = User(username='john', email='john@example.com')
user.save()

# 或
user = User.objects.create(username='john', email='john@example.com')

# 读取
user = User.objects.get(id=1)

# 更新
user.email = 'newemail@example.com'
user.save()

# 删除
user.delete()
```

## 视图（Views）

### 函数视图

```python
# myapp/views.py
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from .models import User

def index(request):
    return HttpResponse('Hello, Django!')

def user_list(request):
    users = User.objects.all()
    return render(request, 'users.html', {'users': users})

def user_detail(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return render(request, 'user_detail.html', {'user': user})

def api_users(request):
    users = User.objects.all()
    data = [{'id': u.id, 'username': u.username} for u in users]
    return JsonResponse(data, safe=False)
```

### 类视图

```python
from django.views import View
from django.views.generic import ListView, DetailView

class UserListView(ListView):
    model = User
    template_name = 'users.html'
    context_object_name = 'users'
    paginate_by = 10

class UserDetailView(DetailView):
    model = User
    template_name = 'user_detail.html'
    context_object_name = 'user'
```

## URL 配置

```python
# myproject/urls.py
from django.urls import path, include

urlpatterns = [
    path('', include('myapp.urls')),
]

# myapp/urls.py
from django.urls import path
from . import views

app_name = 'myapp'

urlpatterns = [
    path('', views.index, name='index'),
    path('users/', views.user_list, name='user_list'),
    path('users/<int:user_id>/', views.user_detail, name='user_detail'),
]
```

## 模板（Templates）

Django 使用模板系统来渲染 HTML，支持模板继承、变量、标签和过滤器等功能。

## 中间件

```python
# myapp/middleware.py
class CustomMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # 请求前处理
        print('Before request')
        
        response = self.get_response(request)
        
        # 响应后处理
        print('After request')
        response['X-Custom-Header'] = 'Value'
        
        return response
```

在 settings.py 中配置：

```python
MIDDLEWARE = [
    'myapp.middleware.CustomMiddleware',
]
```

## 静态文件和媒体文件

```python
# settings.py
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

## 最佳实践

1. 使用虚拟环境 - 隔离项目依赖
2. 配置管理 - 分离开发和生产配置
3. 使用 ORM - 避免 SQL 注入
4. 使用缓存 - 提高性能
5. 日志记录 - 记录错误和警告

## 常见问题

### 1. 静态文件不显示

```
python manage.py collectstatic
```

### 2. 数据库迁移错误

```
python manage.py migrate --fake
```

## 完整示例：博客系统

下面是一个完整的 Django 博客系统示例，展示了从项目创建到功能实现的全过程。

### 1. 创建项目和应用

```
# 创建项目
django-admin startproject blog_project
cd blog_project

# 创建博客应用
python manage.py startapp blog
```

### 2. 配置应用

```python
# blog_project/settings.py

INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',  # 添加博客应用
]

# 数据库配置（使用 SQLite）
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# 语言和时区
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
USE_TZ = True

# 静态文件
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

# 媒体文件
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

### 3. 定义模型

```python
# blog/models.py

from django.db import models
from django.utils import timezone

class Category(models.Model):
    """文章分类"""
    name = models.CharField('分类名称', max_length=50, unique=True)
    description = models.TextField('分类描述', blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    
    class Meta:
        db_table = 'blog_category'
        verbose_name = '分类'
        verbose_name_plural = '分类'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Tag(models.Model):
    """文章标签"""
    name = models.CharField('标签名称', max_length=30, unique=True)
    
    class Meta:
        db_table = 'blog_tag'
        verbose_name = '标签'
        verbose_name_plural = '标签'
    
    def __str__(self):
        return self.name

class Article(models.Model):
    """文章"""
    STATUS_CHOICES = [
        ('draft', '草稿'),
        ('published', '已发布'),
    ]
    
    title = models.CharField('标题', max_length=200)
    content = models.TextField('内容')
    excerpt = models.TextField('摘要', max_length=500, blank=True)
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='articles',
        verbose_name='分类'
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name='articles', verbose_name='标签')
    status = models.CharField('状态', max_length=10, choices=STATUS_CHOICES, default='draft')
    views = models.IntegerField('浏览次数', default=0)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)
    published_at = models.DateTimeField('发布时间', null=True, blank=True)
    
    class Meta:
        db_table = 'blog_article'
        verbose_name = '文章'
        verbose_name_plural = '文章'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # 自动设置发布时间
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        # 自动生成摘要
        if not self.excerpt:
            self.excerpt = self.content[:200]
        parent_save = super().save(*args, **kwargs)
        return parent_save
    
    def increase_views(self):
        """增加浏览次数"""
        self.views += 1
        self.save(update_fields=['views'])

class Comment(models.Model):
    """评论"""
    article = models.ForeignKey(
        Article, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name='文章'
    )
    author = models.CharField('作者', max_length=50)
    email = models.EmailField('邮箱')
    content = models.TextField('内容')
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    is_approved = models.BooleanField('已审核', default=False)
    
    class Meta:
        db_table = 'blog_comment'
        verbose_name = '评论'
        verbose_name_plural = '评论'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.author} - {self.article.title}'
```

### 4. 创建视图

```python
# blog/views.py

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.generic import ListView, DetailView
from django.db.models import Q, Count
from django.core.paginator import Paginator
from .models import Article, Category, Tag, Comment

def index(request):
    """首页"""
    # 获取最新发布的文章
    latest_articles = Article.objects.filter(status='published').order_by('-published_at')[:5]
    
    # 获取热门文章（按浏览次数）
    hot_articles = Article.objects.filter(status='published').order_by('-views')[:5]
    
    # 获取所有分类及文章数
    categories = Category.objects.annotate(article_count=Count('articles'))
    
    context = {
        'latest_articles': latest_articles,
        'hot_articles': hot_articles,
        'categories': categories,
    }
    return render(request, 'blog/index.html', context)

def article_list(request):
    """文章列表"""
    articles = Article.objects.filter(status='published').order_by('-published_at')
    
    # 分类筛选
    category_id = request.GET.get('category')
    if category_id:
        articles = articles.filter(category_id=category_id)
    
    # 标签筛选
    tag_id = request.GET.get('tag')
    if tag_id:
        articles = articles.filter(tags__id=tag_id)
    
    # 搜索
    keyword = request.GET.get('q')
    if keyword:
        articles = articles.filter(
            Q(title__icontains=keyword) | Q(content__icontains=keyword)
        )
    
    # 分页
    paginator = Paginator(articles, 10)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'keyword': keyword,
    }
    return render(request, 'blog/article_list.html', context)

def article_detail(request, article_id):
    """文章详情"""
    article = get_object_or_404(Article, id=article_id, status='published')
    
    # 增加浏览次数
    article.increase_views()
    
    # 获取评论
    comments = article.comments.filter(is_approved=True).order_by('-created_at')
    
    # 相关文章（同分类）
    related_articles = Article.objects.filter(
        category=article.category,
        status='published'
    ).exclude(id=article.id)[:5]
    
    context = {
        'article': article,
        'comments': comments,
        'related_articles': related_articles,
    }
    return render(request, 'blog/article_detail.html', context)

def add_comment(request, article_id):
    """添加评论"""
    if request.method == 'POST':
        article = get_object_or_404(Article, id=article_id)
        
        author = request.POST.get('author')
        email = request.POST.get('email')
        content = request.POST.get('content')
        
        if author and email and content:
            Comment.objects.create(
                article=article,
                author=author,
                email=email,
                content=content
            )
            return redirect('blog:article_detail', article_id=article_id)
    
    return redirect('blog:index')

def category_list(request):
    """分类列表"""
    categories = Category.objects.annotate(
        article_count=Count('articles', filter=Q(articles__status='published'))
    )
    return render(request, 'blog/category_list.html', {'categories': categories})

def tag_list(request):
    """标签列表"""
    tags = Tag.objects.annotate(
        article_count=Count('articles', filter=Q(articles__status='published'))
    )
    return render(request, 'blog/tag_list.html', {'tags': tags})

# API 视图
def api_article_list(request):
    """文章列表 API"""
    articles = Article.objects.filter(status='published').order_by('-published_at')[:10]
    data = [{
        'id': article.id,
        'title': article.title,
        'excerpt': article.excerpt,
        'category': article.category.name if article.category else None,
        'views': article.views,
        'published_at': article.published_at.strftime('%Y-%m-%d %H:%M:%S'),
    } for article in articles]
    return JsonResponse(data, safe=False)

def api_article_detail(request, article_id):
    """文章详情 API"""
    article = get_object_or_404(Article, id=article_id, status='published')
    data = {
        'id': article.id,
        'title': article.title,
        'content': article.content,
        'category': article.category.name if article.category else None,
        'tags': [tag.name for tag in article.tags.all()],
        'views': article.views,
        'published_at': article.published_at.strftime('%Y-%m-%d %H:%M:%S'),
    }
    return JsonResponse(data)
```

### 5. 配置 URL

```python
# blog_project/urls.py

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('blog.urls')),
]

# 开发环境下提供媒体文件服务
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# blog/urls.py

from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    # 页面路由
    path('', views.index, name='index'),
    path('articles/', views.article_list, name='article_list'),
    path('articles/<int:article_id>/', views.article_detail, name='article_detail'),
    path('articles/<int:article_id>/comment/', views.add_comment, name='add_comment'),
    path('categories/', views.category_list, name='category_list'),
    path('tags/', views.tag_list, name='tag_list'),
    
    # API 路由
    path('api/articles/', views.api_article_list, name='api_article_list'),
    path('api/articles/<int:article_id>/', views.api_article_detail, name='api_article_detail'),
]
```

### 6. 数据库迁移

```
# 创建迁移文件
python manage.py makemigrations

# 执行迁移
python manage.py migrate
```

### 7. 创建测试数据

```python
# blog/management/commands/create_test_data.py

from django.core.management.base import BaseCommand
from blog.models import Category, Tag, Article

class Command(BaseCommand):
    help = '创建测试数据'
    
    def handle(self, *args, **options):
        # 创建分类
        tech = Category.objects.create(name='技术', description='技术相关文章')
        life = Category.objects.create(name='生活', description='生活随笔')
        
        # 创建标签
        python_tag = Tag.objects.create(name='Python')
        django_tag = Tag.objects.create(name='Django')
        web_tag = Tag.objects.create(name='Web开发')
        
        # 创建文章
        article1 = Article.objects.create(
            title='Django 入门教程',
            content='这是一篇关于 Django 的入门教程...',
            category=tech,
            status='published'
        )
        article1.tags.add(python_tag, django_tag, web_tag)
        
        article2 = Article.objects.create(
            title='Python 最佳实践',
            content='这是一篇关于 Python 最佳实践的文章...',
            category=tech,
            status='published'
        )
        article2.tags.add(python_tag)
        
        self.stdout.write(self.style.SUCCESS('测试数据创建成功！'))
```

运行命令：
```
python manage.py create_test_data
```

### 8. 运行项目

```
# 启动开发服务器
python manage.py runserver

# 访问网站
# http://127.0.0.1:8000/
```

### 9. 常用管理命令

```
# 创建数据库表
python manage.py migrate

# 创建迁移文件
python manage.py makemigrations

# 查看 SQL 语句
python manage.py sqlmigrate blog 0001

# 进入 Django Shell
python manage.py shell

# 收集静态文件
python manage.py collectstatic

# 清空数据库
python manage.py flush
```

### 10. Django Shell 操作示例

```python
# 进入 shell
python manage.py shell

# 导入模型
from blog.models import Article, Category, Tag

# 创建分类
category = Category.objects.create(name='技术')

# 创建文章
article = Article.objects.create(
    title='我的第一篇文章',
    content='这是文章内容',
    category=category,
    status='published'
)

# 查询所有文章
articles = Article.objects.all()

# 查询已发布的文章
published = Article.objects.filter(status='published')

# 查询特定分类的文章
tech_articles = Article.objects.filter(category__name='技术')

# 查询包含特定标签的文章
python_articles = Article.objects.filter(tags__name='Python')

# 更新文章
article.title = '新标题'
article.save()

# 删除文章
article.delete()

# 聚合查询
from django.db.models import Count, Avg
Article.objects.aggregate(Count('id'))
Article.objects.aggregate(Avg('views'))

# 关联查询
article = Article.objects.select_related('category').get(id=1)
articles = Article.objects.prefetch_related('tags').all()
```

## 参考资源

- [Django 官方文档](https://docs.djangoproject.com/)
- [Django 中文文档](https://docs.djangoproject.com/zh-hans/)
