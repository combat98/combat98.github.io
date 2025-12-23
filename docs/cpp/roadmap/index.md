# C++ 学习路线与框架生态

## 学习路线

### 第一阶段：基础入门（2-3周）

1. **环境搭建**
   - 安装编译器（GCC、Clang、MSVC）
   - 配置 IDE（Visual Studio、CLion、VS Code）
   - 学习 CMake 构建工具

2. **C++ 基础**
   - 变量和数据类型
   - 函数和控制流
   - 数组和指针
   - 引用
   - 结构体

3. **内存管理**
   - 动态内存分配（new/delete）
   - 内存泄漏
   - 指针运算

### 第二阶段：面向对象（3-4周）

1. **类和对象**
   - 类的定义和使用
   - 构造函数和析构函数
   - 成员函数
   - 访问控制

2. **继承和多态**
   - 继承机制
   - 虚函数
   - 抽象类
   - 多重继承

3. **运算符重载**
   - 运算符重载规则
   - 友元函数
   - 类型转换

### 第三阶段：STL 和模板（3-4周）

1. **STL 容器**
   - vector、list、deque
   - set、map
   - unordered_set、unordered_map
   - stack、queue、priority_queue

2. **STL 算法**
   - 排序和查找
   - 迭代器
   - 函数对象

3. **模板编程**
   - 函数模板
   - 类模板
   - 模板特化

### 第四阶段：现代 C++（4-6周）

1. **C++11/14 特性**
   - auto 和 decltype
   - 智能指针
   - Lambda 表达式
   - 右值引用和移动语义
   - 范围 for 循环

2. **C++17/20 特性**
   - 结构化绑定
   - std::optional
   - std::variant
   - Concepts
   - Coroutines

3. **并发编程**
   - std::thread
   - std::mutex
   - std::condition_variable
   - std::async 和 std::future

### 第五阶段：实战应用（持续学习）

1. **网络编程**
   - Socket 编程
   - Boost.Asio
   - 网络库

2. **图形界面**
   - Qt 框架
   - wxWidgets

3. **游戏开发**
   - SDL
   - SFML
   - Unreal Engine

## 框架生态

### Web 框架

#### Crow
- **特点**：轻量级、类似 Flask
- **适用场景**：RESTful API、微服务

```cpp
#include "crow.h"

int main() {
    crow::SimpleApp app;
    
    CROW_ROUTE(app, "/")([](){
        return "Hello, Crow!";
    });
    
    CROW_ROUTE(app, "/json")
    ([](){
        crow::json::wvalue x;
        x["message"] = "Hello, JSON!";
        return x;
    });
    
    app.port(8080).multithreaded().run();
}
```

#### Drogon
- **特点**：高性能、异步
- **适用场景**：高并发 Web 服务

```cpp
#include <drogon/drogon.h>

int main() {
    drogon::app()
        .registerHandler("/",
            [](const HttpRequestPtr &req,
               std::function<void(const HttpResponsePtr &)> &&callback) {
                auto resp = HttpResponse::newHttpResponse();
                resp->setBody("Hello, Drogon!");
                callback(resp);
            })
        .addListener("0.0.0.0", 8080)
        .run();
}
```

#### CppCMS
- **特点**：高性能、MVC 架构
- **适用场景**：Web 应用开发

#### Pistache
- **特点**：现代 C++、RESTful
- **适用场景**：HTTP 服务器

```cpp
#include <pistache/endpoint.h>

using namespace Pistache;

class HelloHandler : public Http::Handler {
public:
    HTTP_PROTOTYPE(HelloHandler)
    
    void onRequest(const Http::Request& request, 
                   Http::ResponseWriter response) override {
        response.send(Http::Code::Ok, "Hello, Pistache!");
    }
};

int main() {
    Http::Endpoint server(Address(Ipv4::any(), Port(8080)));
    server.init(Http::Endpoint::options().threads(1));
    server.setHandler(Http::make_handler<HelloHandler>());
    server.serve();
}
```

### 网络库

#### Boost.Asio
- **特点**：异步 I/O、跨平台
- **适用场景**：网络编程、异步操作

```cpp
#include <boost/asio.hpp>
#include <iostream>

using boost::asio::ip::tcp;

int main() {
    boost::asio::io_context io_context;
    
    tcp::acceptor acceptor(io_context, 
        tcp::endpoint(tcp::v4(), 8080));
    
    tcp::socket socket(io_context);
    acceptor.accept(socket);
    
    std::string message = "Hello from server!";
    boost::asio::write(socket, 
        boost::asio::buffer(message));
    
    return 0;
}
```

#### libuv
- **特点**：事件驱动、跨平台
- **适用场景**：异步 I/O

#### ZeroMQ
- **特点**：高性能消息队列
- **适用场景**：分布式系统

### GUI 框架

#### Qt
- **特点**：跨平台、功能完整
- **适用场景**：桌面应用、移动应用

```cpp
#include <QApplication>
#include <QPushButton>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    
    QPushButton button("Hello, Qt!");
    button.resize(200, 100);
    button.show();
    
    return app.exec();
}
```

**Qt 核心模块：**
- Qt Core：核心非 GUI 功能
- Qt GUI：GUI 组件
- Qt Widgets：桌面 UI 组件
- Qt Network：网络编程
- Qt SQL：数据库访问

#### wxWidgets
- **特点**：原生外观、跨平台
- **适用场景**：桌面应用

```cpp
#include <wx/wx.h>

class MyApp : public wxApp {
public:
    virtual bool OnInit();
};

class MyFrame : public wxFrame {
public:
    MyFrame(const wxString& title);
};

bool MyApp::OnInit() {
    MyFrame *frame = new MyFrame("Hello, wxWidgets!");
    frame->Show(true);
    return true;
}

MyFrame::MyFrame(const wxString& title)
    : wxFrame(NULL, wxID_ANY, title) {
    wxButton *button = new wxButton(this, wxID_ANY, "Click Me");
}

wxIMPLEMENT_APP(MyApp);
```

#### GTK+
- **特点**：开源、跨平台
- **适用场景**：Linux 桌面应用

### 游戏开发

#### SDL (Simple DirectMedia Layer)
- **特点**：跨平台、底层
- **适用场景**：2D 游戏、多媒体应用

```cpp
#include <SDL2/SDL.h>

int main(int argc, char* argv[]) {
    SDL_Init(SDL_INIT_VIDEO);
    
    SDL_Window* window = SDL_CreateWindow(
        "SDL2 Window",
        SDL_WINDOWPOS_CENTERED,
        SDL_WINDOWPOS_CENTERED,
        640, 480,
        SDL_WINDOW_SHOWN
    );
    
    SDL_Delay(3000);
    
    SDL_DestroyWindow(window);
    SDL_Quit();
    
    return 0;
}
```

#### SFML (Simple and Fast Multimedia Library)
- **特点**：简单易用、模块化
- **适用场景**：2D 游戏

```cpp
#include <SFML/Graphics.hpp>

int main() {
    sf::RenderWindow window(sf::VideoMode(800, 600), "SFML Window");
    
    sf::CircleShape shape(50);
    shape.setFillColor(sf::Color::Green);
    
    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();
        }
        
        window.clear();
        window.draw(shape);
        window.display();
    }
    
    return 0;
}
```

#### Unreal Engine
- **特点**：AAA 级游戏引擎
- **适用场景**：3D 游戏、虚拟现实

#### Cocos2d-x
- **特点**：跨平台、2D/3D
- **适用场景**：移动游戏

### 数据库

#### SQLite
- **特点**：嵌入式、零配置

```cpp
#include <sqlite3.h>

int main() {
    sqlite3* db;
    sqlite3_open("test.db", &db);
    
    const char* sql = "CREATE TABLE IF NOT EXISTS users "
                     "(id INTEGER PRIMARY KEY, name TEXT);";
    sqlite3_exec(db, sql, 0, 0, 0);
    
    sqlite3_close(db);
    return 0;
}
```

#### MySQL Connector/C++
- **特点**：官方 MySQL 驱动

```cpp
#include <mysql_driver.h>
#include <mysql_connection.h>

sql::mysql::MySQL_Driver *driver;
sql::Connection *con;

driver = sql::mysql::get_mysql_driver_instance();
con = driver->connect("tcp://127.0.0.1:3306", "user", "password");
```

#### MongoDB C++ Driver
- **特点**：NoSQL 数据库驱动

### JSON 库

#### nlohmann/json
- **特点**：现代 C++、易用

```cpp
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main() {
    json j;
    j["name"] = "张三";
    j["age"] = 25;
    j["skills"] = {"C++", "Python", "Java"};
    
    std::cout << j.dump(4) << std::endl;
    
    return 0;
}
```

#### RapidJSON
- **特点**：高性能、SAX/DOM

### 日志库

#### spdlog
- **特点**：快速、异步

```cpp
#include "spdlog/spdlog.h"

int main() {
    spdlog::info("Welcome to spdlog!");
    spdlog::error("Some error message");
    spdlog::warn("Easy padding in numbers like {:08d}", 12);
}
```

#### Boost.Log
- **特点**：功能完整、可扩展

### 测试框架

#### Google Test
- **特点**：功能强大、广泛使用

```cpp
#include <gtest/gtest.h>

TEST(TestSuiteName, TestName) {
    EXPECT_EQ(1 + 1, 2);
    ASSERT_TRUE(true);
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
```

#### Catch2
- **特点**：单头文件、BDD 风格

```cpp
#define CATCH_CONFIG_MAIN
#include <catch2/catch.hpp>

TEST_CASE("Addition works", "[math]") {
    REQUIRE(1 + 1 == 2);
}
```

### 构建工具

#### CMake
- **特点**：跨平台、标准

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)

add_executable(myapp main.cpp)

find_package(Boost REQUIRED)
target_link_libraries(myapp Boost::boost)
```

#### Conan
- **特点**：包管理器

```ini
[requires]
boost/1.80.0
nlohmann_json/3.11.2

[generators]
cmake
```

### 并发库

#### Intel TBB (Threading Building Blocks)
- **特点**：并行算法、任务调度

```cpp
#include <tbb/parallel_for.h>

tbb::parallel_for(0, 100, [](int i) {
    // 并行执行
    std::cout << i << std::endl;
});
```

## 学习资源

### 官方资源
- [C++ 官方文档](https://en.cppreference.com/)
- [ISO C++ 标准](https://isocpp.org/)
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/)

### 书籍推荐
- 《C++ Primer》
- 《Effective C++》
- 《Modern C++ Design》
- 《C++ Concurrency in Action》
- 《深度探索 C++ 对象模型》

### 在线资源
- [Learn C++](https://www.learncpp.com/)
- [C++ Reference](https://en.cppreference.com/)
- [Awesome C++](https://github.com/fffaraz/awesome-cpp)

### 实战项目
1. **命令行工具**：文件处理、系统工具
2. **网络服务器**：HTTP 服务器、聊天服务器
3. **游戏**：2D 游戏、游戏引擎
4. **GUI 应用**：文本编辑器、图像查看器

## 职业发展方向

1. **系统开发**
   - 操作系统
   - 数据库引擎
   - 编译器

2. **游戏开发**
   - 游戏引擎
   - 游戏逻辑

3. **嵌入式开发**
   - 固件开发
   - 驱动开发

4. **高性能计算**
   - 科学计算
   - 金融系统

5. **图形渲染**
   - 3D 引擎
   - 图形驱动

## 最佳实践

1. **代码规范**
   - 遵循 Google C++ Style Guide
   - 使用 clang-format 格式化
   - 使用 clang-tidy 静态分析

2. **项目结构**
   ```
   project/
   ├── include/        # 头文件
   ├── src/           # 源文件
   ├── tests/         # 测试
   ├── docs/          # 文档
   ├── CMakeLists.txt # CMake 配置
   └── README.md
   ```

3. **内存管理**
   - 优先使用智能指针
   - RAII 原则
   - 避免内存泄漏

4. **性能优化**
   - 使用 profiler 分析
   - 避免不必要的拷贝
   - 使用移动语义
   - 合理使用内联

5. **现代 C++ 特性**
   - 使用 auto 类型推导
   - 使用 Lambda 表达式
   - 使用范围 for 循环
   - 使用智能指针

6. **并发安全**
   - 使用 RAII 管理锁
   - 避免死锁
   - 使用原子操作
   - 线程安全的数据结构
