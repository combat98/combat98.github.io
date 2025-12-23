# C++ 基础

## 简介

C++ 是一种通用的编程语言，支持过程化、面向对象和泛型编程。C++ 是 C 语言的扩展，提供了类、继承、模板等特性。

### 特点

- 高性能
- 面向对象
- 泛型编程（模板）
- 底层内存控制
- 丰富的标准库（STL）
- 跨平台

## 环境配置

### Windows

```bash
# 安装 MinGW-w64
# 下载: https://www.mingw-w64.org/

# 或使用 Visual Studio
# 下载: https://visualstudio.microsoft.com/

# 验证安装
g++ --version
```

### macOS

```bash
# 安装 Xcode Command Line Tools
xcode-select --install

# 或使用 Homebrew 安装 GCC
brew install gcc

# 验证
g++ --version
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install g++ build-essential

# CentOS/RHEL
sudo yum install gcc-c++

# 验证
g++ --version
```

### 编译和运行

```bash
# 编译
g++ hello.cpp -o hello

# 运行
./hello

# 使用 C++11/14/17/20
g++ -std=c++17 hello.cpp -o hello
```

## 语法基础

### Hello World

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

### 变量和数据类型

```cpp
#include <iostream>
#include <string>

int main() {
    // 基本类型
    int age = 25;
    double price = 99.99;
    char grade = 'A';
    bool isStudent = true;
    
    // 字符串
    std::string name = "张三";
    
    // 常量
    const double PI = 3.14159;
    
    // auto 类型推导
    auto x = 10;        // int
    auto y = 3.14;      // double
    auto z = "hello";   // const char*
    
    std::cout << "姓名: " << name << ", 年龄: " << age << std::endl;
    
    return 0;
}
```

### 输入输出

```cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    int age;
    
    std::cout << "请输入姓名: ";
    std::cin >> name;
    
    std::cout << "请输入年龄: ";
    std::cin >> age;
    
    std::cout << "你好, " << name << "! 你今年 " << age << " 岁。" << std::endl;
    
    return 0;
}
```

### 控制流

```cpp
#include <iostream>

int main() {
    // if-else
    int score = 85;
    if (score >= 90) {
        std::cout << "优秀" << std::endl;
    } else if (score >= 80) {
        std::cout << "良好" << std::endl;
    } else if (score >= 60) {
        std::cout << "及格" << std::endl;
    } else {
        std::cout << "不及格" << std::endl;
    }
    
    // switch
    int day = 3;
    switch (day) {
        case 1:
            std::cout << "星期一" << std::endl;
            break;
        case 2:
            std::cout << "星期二" << std::endl;
            break;
        case 3:
            std::cout << "星期三" << std::endl;
            break;
        default:
            std::cout << "其他" << std::endl;
    }
    
    // for 循环
    for (int i = 0; i < 5; i++) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
    
    // while 循环
    int j = 0;
    while (j < 5) {
        std::cout << j << " ";
        j++;
    }
    std::cout << std::endl;
    
    // do-while 循环
    int k = 0;
    do {
        std::cout << k << " ";
        k++;
    } while (k < 5);
    std::cout << std::endl;
    
    return 0;
}
```

### 数组

```cpp
#include <iostream>

int main() {
    // 静态数组
    int arr[5] = {1, 2, 3, 4, 5};
    
    // 访问元素
    std::cout << "第一个元素: " << arr[0] << std::endl;
    
    // 遍历数组
    for (int i = 0; i < 5; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
    
    // 范围 for 循环 (C++11)
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // 多维数组
    int matrix[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    
    return 0;
}
```

### 函数

```cpp
#include <iostream>

// 函数声明
int add(int a, int b);
void printMessage(std::string msg);

// 默认参数
int multiply(int a, int b = 2);

// 函数重载
int sum(int a, int b);
double sum(double a, double b);

// 引用参数
void swap(int& a, int& b);

int main() {
    std::cout << "5 + 3 = " << add(5, 3) << std::endl;
    printMessage("Hello, C++!");
    
    std::cout << "5 * 2 = " << multiply(5) << std::endl;
    std::cout << "5 * 3 = " << multiply(5, 3) << std::endl;
    
    int x = 10, y = 20;
    swap(x, y);
    std::cout << "x = " << x << ", y = " << y << std::endl;
    
    return 0;
}

// 函数定义
int add(int a, int b) {
    return a + b;
}

void printMessage(std::string msg) {
    std::cout << msg << std::endl;
}

int multiply(int a, int b) {
    return a * b;
}

int sum(int a, int b) {
    return a + b;
}

double sum(double a, double b) {
    return a + b;
}

void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
```

### 指针

```cpp
#include <iostream>

int main() {
    int x = 10;
    int* ptr = &x;  // 指针指向 x 的地址
    
    std::cout << "x 的值: " << x << std::endl;
    std::cout << "x 的地址: " << &x << std::endl;
    std::cout << "ptr 的值: " << ptr << std::endl;
    std::cout << "ptr 指向的值: " << *ptr << std::endl;
    
    // 修改指针指向的值
    *ptr = 20;
    std::cout << "x 的新值: " << x << std::endl;
    
    // 空指针
    int* nullPtr = nullptr;
    
    return 0;
}
```

### 动态内存

```cpp
#include <iostream>

int main() {
    // 动态分配单个变量
    int* p = new int(10);
    std::cout << *p << std::endl;
    delete p;  // 释放内存
    
    // 动态分配数组
    int* arr = new int[5];
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
    }
    
    for (int i = 0; i < 5; i++) {
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;
    
    delete[] arr;  // 释放数组内存
    
    return 0;
}
```

### 结构体

```cpp
#include <iostream>
#include <string>

struct Person {
    std::string name;
    int age;
    double height;
};

int main() {
    // 创建结构体
    Person p1;
    p1.name = "张三";
    p1.age = 25;
    p1.height = 1.75;
    
    // 初始化列表
    Person p2 = {"李四", 30, 1.80};
    
    std::cout << p1.name << ", " << p1.age << " 岁" << std::endl;
    std::cout << p2.name << ", " << p2.age << " 岁" << std::endl;
    
    return 0;
}
```

### 类和对象

```cpp
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    // 构造函数
    Person(std::string n, int a) : name(n), age(a) {}
    
    // 成员函数
    void introduce() {
        std::cout << "我是 " << name << ", 今年 " << age << " 岁" << std::endl;
    }
    
    // Getter
    std::string getName() const {
        return name;
    }
    
    // Setter
    void setAge(int a) {
        if (a > 0) {
            age = a;
        }
    }
};

int main() {
    Person p1("张三", 25);
    p1.introduce();
    
    p1.setAge(26);
    p1.introduce();
    
    return 0;
}
```

## 参考资源

- [C++ 官方文档](https://en.cppreference.com/)
- [Learn C++](https://www.learncpp.com/)
