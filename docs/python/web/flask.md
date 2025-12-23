# Flask

## 简介

Flask 是一个轻量级的 Python Web 框架，基于 Werkzeug 和 Jinja2 模板引擎。

### 特点

- 轻量级、灵活
- 易于学习和使用
- 丰富的扩展生态
- RESTful 请求分发
- 内置开发服务器和调试器

### 安装

```bash
pip install flask
```

## 快速开始

### Hello World

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
```

运行应用：

```bash
python app.py
```

访问 `http://127.0.0.1:5000/`

## 路由

### 基本路由

```python
@app.route('/')
def index():
    return 'Index Page'

@app.route('/hello')
def hello():
    return 'Hello, World!'

@app.route('/user/<username>')
def show_user(username):
    return f'User: {username}'

@app.route('/post/<int:post_id>')
def show_post(post_id):
    return f'Post ID: {post_id}'
```

### HTTP 方法

```python
from flask import request

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'Login POST'
    else:
        return 'Login GET'

@app.route('/api/data', methods=['GET'])
def get_data():
    return {'message': 'GET request'}

@app.route('/api/data', methods=['POST'])
def post_data():
    return {'message': 'POST request'}
```

### URL 构建

```python
from flask import url_for

@app.route('/')
def index():
    return 'Index'

@app.route('/user/<username>')
def profile(username):
    return f'User: {username}'

@app.route('/test')
def test():
    # 生成 URL
    print(url_for('index'))  # /
    print(url_for('profile', username='john'))  # /user/john
    return 'Test'
```

## 请求和响应

### 请求对象

```python
from flask import request

@app.route('/form', methods=['POST'])
def form():
    # 获取表单数据
    username = request.form.get('username')
    password = request.form.get('password')
    
    # 获取 URL 参数
    page = request.args.get('page', 1, type=int)
    
    # 获取 JSON 数据
    data = request.get_json()
    
    # 获取文件
    file = request.files.get('file')
    
    # 获取 Cookie
    cookie = request.cookies.get('session')
    
    # 获取请求头
    user_agent = request.headers.get('User-Agent')
    
    return {'status': 'success'}
```

### 响应对象

```python
from flask import make_response, jsonify, redirect, url_for

@app.route('/json')
def json_response():
    return jsonify({'message': 'Hello', 'status': 'success'})

@app.route('/custom')
def custom_response():
    response = make_response('Custom Response', 200)
    response.headers['X-Custom-Header'] = 'Value'
    return response

@app.route('/redirect')
def redirect_example():
    return redirect(url_for('index'))

@app.route('/cookie')
def set_cookie():
    response = make_response('Cookie Set')
    response.set_cookie('username', 'john')
    return response
```

## 模板

### Jinja2 模板

创建 `templates/index.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>Hello, {{ name }}!</h1>
    
    {% if user %}
        <p>Welcome back, {{ user }}!</p>
    {% else %}
        <p>Please log in.</p>
    {% endif %}
    
    <ul>
    {% for item in items %}
        <li>{{ item }}</li>
    {% endfor %}
    </ul>
</body>
</html>
```

使用模板：

```python
from flask import render_template

@app.route('/template')
def template_example():
    return render_template('index.html',
                         title='Home',
                         name='John',
                         user='john',
                         items=['Apple', 'Banana', 'Orange'])
```

### 模板继承

基础模板 `templates/base.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
    
    {% block content %}{% endblock %}
    
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>
```

子模板 `templates/home.html`：

```html
{% extends "base.html" %}

{% block title %}Home{% endblock %}

{% block content %}
    <h1>Welcome Home</h1>
    <p>This is the home page.</p>
{% endblock %}
```

## 静态文件

目录结构：
```
/static
    /css
        style.css
    /js
        script.js
    /images
        logo.png
```

在模板中使用：

```html
<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
<script src="{{ url_for('static', filename='js/script.js') }}"></script>
<img src="{{ url_for('static', filename='images/logo.png') }}">
```

## 表单处理

### Flask-WTF

安装：

```bash
pip install flask-wtf
```

创建表单：

```python
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, Length

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    submit = SubmitField('Login')

app.config['SECRET_KEY'] = 'your-secret-key'

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        return f'Login: {username}'
    return render_template('login.html', form=form)
```

模板 `templates/login.html`：

```html
<form method="POST">
    {{ form.hidden_tag() }}
    
    {{ form.username.label }}
    {{ form.username() }}
    
    {{ form.password.label }}
    {{ form.password() }}
    
    {{ form.submit() }}
</form>
```

## 数据库

### Flask-SQLAlchemy

安装：

```bash
pip install flask-sqlalchemy
```

配置：

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 定义模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    def __repr__(self):
        return f'<User {self.username}>'

# 创建表
with app.app_context():
    db.create_all()

# CRUD 操作
@app.route('/user/create')
def create_user():
    user = User(username='john', email='john@example.com')
    db.session.add(user)
    db.session.commit()
    return 'User created'

@app.route('/user/<int:user_id>')
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return f'User: {user.username}'

@app.route('/users')
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'username': u.username} for u in users])

@app.route('/user/<int:user_id>/update')
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    user.email = 'newemail@example.com'
    db.session.commit()
    return 'User updated'

@app.route('/user/<int:user_id>/delete')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return 'User deleted'
```

## 用户认证

### Flask-Login

安装：

```bash
pip install flask-login
```

配置：

```python
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(120))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        login_user(user)
        return redirect(url_for('dashboard'))
    return 'Invalid credentials'

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    return f'Welcome, {current_user.username}!'
```

## RESTful API

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

# 模拟数据库
users = [
    {'id': 1, 'name': 'Alice'},
    {'id': 2, 'name': 'Bob'}
]

# GET - 获取所有用户
@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(users)

# GET - 获取单个用户
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

# POST - 创建用户
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = {
        'id': len(users) + 1,
        'name': data['name']
    }
    users.append(new_user)
    return jsonify(new_user), 201

# PUT - 更新用户
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        data = request.get_json()
        user['name'] = data['name']
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

# DELETE - 删除用户
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    global users
    users = [u for u in users if u['id'] != user_id]
    return '', 204
```

## 蓝图（Blueprint）

```python
# auth.py
from flask import Blueprint

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login')
def login():
    return 'Login Page'

@auth_bp.route('/register')
def register():
    return 'Register Page'

# app.py
from auth import auth_bp

app.register_blueprint(auth_bp)
```

## 错误处理

```python
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({'error': str(e)}), 500
```

## 中间件

```python
@app.before_request
def before_request():
    print('Before request')

@app.after_request
def after_request(response):
    print('After request')
    response.headers['X-Custom-Header'] = 'Value'
    return response

@app.teardown_request
def teardown_request(exception):
    print('Teardown request')
```

## 配置管理

```python
# config.py
class Config:
    SECRET_KEY = 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

# app.py
app.config.from_object('config.DevelopmentConfig')
```

## 文件上传

```python
from werkzeug.utils import secure_filename
import os

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400
    
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'File uploaded successfully'
```

## 最佳实践

1. **使用蓝图** - 组织大型应用
2. **配置管理** - 分离开发和生产环境
3. **错误处理** - 统一错误响应格式
4. **使用扩展** - Flask-SQLAlchemy、Flask-Login 等
5. **安全性** - CSRF 保护、密码加密
6. **日志记录** - 记录应用运行状态

## 常见问题

### 1. CORS 跨域

```bash
pip install flask-cors
```

```python
from flask_cors import CORS

CORS(app)
```

### 2. 环境变量

```python
import os

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-key')
```

## 参考资源

- [Flask 官方文档](https://flask.palletsprojects.com/)
- [Flask 中文文档](https://dormousehole.readthedocs.io/)
- [Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world)
