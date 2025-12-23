# 现代 C++ (C++11/14/17/20)

## 智能指针

```cpp
#include <iostream>
#include <memory>

class MyClass {
public:
    MyClass() { std::cout << "构造" << std::endl; }
    ~MyClass() { std::cout << "析构" << std::endl; }
    void doSomething() { std::cout << "做某事" << std::endl; }
};

int main() {
    // unique_ptr（独占所有权）
    std::unique_ptr<MyClass> ptr1 = std::make_unique<MyClass>();
    ptr1->doSomething();
    
    // shared_ptr（共享所有权）
    std::shared_ptr<MyClass> ptr2 = std::make_shared<MyClass>();
    std::shared_ptr<MyClass> ptr3 = ptr2;  // 引用计数 +1
    
    std::cout << "引用计数: " << ptr2.use_count() << std::endl;
    
    return 0;
}
```

## Lambda 表达式

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    // 基本 lambda
    auto add = [](int a, int b) { return a + b; };
    std::cout << "5 + 3 = " << add(5, 3) << std::endl;
    
    // 捕获变量
    int x = 10;
    auto addX = [x](int a) { return a + x; };
    std::cout << "5 + 10 = " << addX(5) << std::endl;
    
    // 使用 lambda 排序
    std::vector<int> vec = {5, 2, 8, 1, 9};
    std::sort(vec.begin(), vec.end(), [](int a, int b) {
        return a > b;  // 降序
    });
    
    for (int num : vec) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

## auto 和 decltype

```cpp
#include <iostream>
#include <vector>

int main() {
    // auto 类型推导
    auto x = 10;        // int
    auto y = 3.14;      // double
    auto z = "hello";   // const char*
    
    std::vector<int> vec = {1, 2, 3};
    
    // 简化迭代器
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;
    
    // decltype
    decltype(x) a = 20;  // a 的类型与 x 相同
    
    return 0;
}
```

## 范围 for 循环

```cpp
#include <iostream>
#include <vector>
#include <map>

int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    // 遍历 vector
    for (int num : vec) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // 遍历 map
    std::map<std::string, int> ages = {{"张三", 25}, {"李四", 30}};
    for (const auto& [name, age] : ages) {  // C++17 结构化绑定
        std::cout << name << ": " << age << std::endl;
    }
    
    return 0;
}
```

## 移动语义

```cpp
#include <iostream>
#include <vector>

class MyClass {
private:
    int* data;
    size_t size;

public:
    MyClass(size_t s) : size(s) {
        data = new int[size];
        std::cout << "构造" << std::endl;
    }
    
    // 移动构造函数
    MyClass(MyClass&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
        std::cout << "移动构造" << std::endl;
    }
    
    ~MyClass() {
        delete[] data;
        std::cout << "析构" << std::endl;
    }
};

int main() {
    MyClass obj1(100);
    MyClass obj2 = std::move(obj1);  // 移动而不是复制
    
    return 0;
}
```

## 参考资源

- [Modern C++](https://en.cppreference.com/w/cpp/language)
