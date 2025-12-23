# Flutter

## 概述

Flutter 是 Google 推出的开源 UI 工具包，用于从单一代码库构建美观、原生编译的移动、Web 和桌面应用。

### 特点

- **跨平台**：一套代码，多端运行
- **高性能**：直接编译为原生代码
- **热重载**：快速开发迭代
- **丰富的 Widget**：Material 和 Cupertino 风格
- **Dart 语言**：简洁高效

## 安装

```bash
# 下载 Flutter SDK
https://flutter.dev/docs/get-started/install

# 配置环境变量
export PATH="$PATH:`pwd`/flutter/bin"

# 验证安装
flutter doctor

# 创建项目
flutter create my_app
cd my_app
flutter run
```

## 基础 Widget

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 文本
            Text(
              'Hello Flutter',
              style: TextStyle(fontSize: 24),
            ),
            
            // 按钮
            ElevatedButton(
              onPressed: () {
                print('Button pressed');
              },
              child: Text('Click Me'),
            ),
            
            // 图片
            Image.network('https://example.com/image.png'),
            
            // 容器
            Container(
              width: 100,
              height: 100,
              color: Colors.blue,
              child: Center(child: Text('Box')),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 有状态 Widget

```dart
class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  void _increment() {
    setState(() {
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count'),
        ElevatedButton(
          onPressed: _increment,
          child: Text('+1'),
        ),
      ],
    );
  }
}
```

## 布局

```dart
// Column - 垂直布局
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('Item 1'),
    Text('Item 2'),
  ],
)

// Row - 水平布局
Row(
  mainAxisAlignment: MainAxisAlignment.spaceAround,
  children: [
    Icon(Icons.star),
    Icon(Icons.star),
  ],
)

// Stack - 层叠布局
Stack(
  children: [
    Container(color: Colors.blue),
    Positioned(
      top: 10,
      left: 10,
      child: Text('Overlay'),
    ),
  ],
)

// ListView - 列表
ListView(
  children: [
    ListTile(title: Text('Item 1')),
    ListTile(title: Text('Item 2')),
  ],
)

// ListView.builder - 动态列表
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ListTile(
      title: Text(items[index]),
    );
  },
)

// GridView - 网格
GridView.count(
  crossAxisCount: 2,
  children: List.generate(10, (index) {
    return Card(
      child: Center(child: Text('Item $index')),
    );
  }),
)
```

## 导航

```dart
// 跳转到新页面
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondPage()),
);

// 返回
Navigator.pop(context);

// 命名路由
MaterialApp(
  routes: {
    '/': (context) => HomePage(),
    '/second': (context) => SecondPage(),
  },
);

Navigator.pushNamed(context, '/second');

// 传递参数
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => DetailPage(id: 123),
  ),
);
```

## 表单

```dart
class MyForm extends StatefulWidget {
  @override
  _MyFormState createState() => _MyFormState();
}

class _MyFormState extends State<MyForm> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  String _email = '';

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            decoration: InputDecoration(labelText: 'Name'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter name';
              }
              return null;
            },
            onSaved: (value) => _name = value!,
          ),
          TextFormField(
            decoration: InputDecoration(labelText: 'Email'),
            validator: (value) {
              if (value == null || !value.contains('@')) {
                return 'Please enter valid email';
              }
              return null;
            },
            onSaved: (value) => _email = value!,
          ),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                print('Name: $_name, Email: $_email');
              }
            },
            child: Text('Submit'),
          ),
        ],
      ),
    );
  }
}
```

## HTTP 请求

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

// GET 请求
Future<List<User>> fetchUsers() async {
  final response = await http.get(
    Uri.parse('https://api.example.com/users'),
  );

  if (response.statusCode == 200) {
    List<dynamic> data = json.decode(response.body);
    return data.map((json) => User.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load users');
  }
}

// POST 请求
Future<User> createUser(String name, String email) async {
  final response = await http.post(
    Uri.parse('https://api.example.com/users'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({'name': name, 'email': email}),
  );

  if (response.statusCode == 201) {
    return User.fromJson(json.decode(response.body));
  } else {
    throw Exception('Failed to create user');
  }
}

// 使用 FutureBuilder
FutureBuilder<List<User>>(
  future: fetchUsers(),
  builder: (context, snapshot) {
    if (snapshot.hasData) {
      return ListView.builder(
        itemCount: snapshot.data!.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(snapshot.data![index].name),
          );
        },
      );
    } else if (snapshot.hasError) {
      return Text('Error: ${snapshot.error}');
    }
    return CircularProgressIndicator();
  },
)
```

## 状态管理（Provider）

```dart
// pubspec.yaml
dependencies:
  provider: ^6.0.0

// counter_model.dart
import 'package:flutter/foundation.dart';

class CounterModel extends ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// main.dart
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => CounterModel(),
      child: MyApp(),
    ),
  );
}

// 使用 Provider
class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Consumer<CounterModel>(
          builder: (context, counter, child) {
            return Text('Count: ${counter.count}');
          },
        ),
        ElevatedButton(
          onPressed: () {
            context.read<CounterModel>().increment();
          },
          child: Text('+1'),
        ),
      ],
    );
  }
}
```

## 生命周期

```dart
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  @override
  void initState() {
    super.initState();
    print('initState');
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('didChangeDependencies');
  }

  @override
  void didUpdateWidget(MyWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    print('didUpdateWidget');
  }

  @override
  void dispose() {
    print('dispose');
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

## 动画

```dart
class AnimatedContainer extends StatefulWidget {
  @override
  _AnimatedContainerState createState() => _AnimatedContainerState();
}

class _AnimatedContainerState extends State<AnimatedContainer> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _expanded = !_expanded;
        });
      },
      child: AnimatedContainer(
        duration: Duration(milliseconds: 300),
        width: _expanded ? 200 : 100,
        height: _expanded ? 200 : 100,
        color: _expanded ? Colors.blue : Colors.red,
        curve: Curves.easeInOut,
      ),
    );
  }
}
```

## 最佳实践

1. **Widget 拆分**：保持 Widget 小而专注
2. **使用 const**：提高性能
3. **状态管理**：选择合适的状态管理方案
4. **异步处理**：使用 async/await
5. **错误处理**：捕获和处理异常
6. **性能优化**：避免不必要的重建
7. **代码规范**：遵循 Dart 风格指南
8. **测试**：编写单元测试和 Widget 测试
