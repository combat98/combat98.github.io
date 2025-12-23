# C++ STL 标准库

## 容器

### vector（动态数组）

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};
    
    // 添加元素
    vec.push_back(6);
    
    // 访问元素
    std::cout << "第一个元素: " << vec[0] << std::endl;
    std::cout << "最后一个元素: " << vec.back() << std::endl;
    
    // 遍历
    for (int num : vec) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // 大小和容量
    std::cout << "大小: " << vec.size() << std::endl;
    std::cout << "容量: " << vec.capacity() << std::endl;
    
    return 0;
}
```

### map（映射）

```cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> ages;
    
    // 插入元素
    ages["张三"] = 25;
    ages["李四"] = 30;
    ages.insert({"王五", 28});
    
    // 访问元素
    std::cout << "张三的年龄: " << ages["张三"] << std::endl;
    
    // 遍历
    for (const auto& pair : ages) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }
    
    // 查找
    if (ages.find("张三") != ages.end()) {
        std::cout << "找到张三" << std::endl;
    }
    
    return 0;
}
```

### set（集合）

```cpp
#include <iostream>
#include <set>

int main() {
    std::set<int> numbers = {5, 2, 8, 1, 9};
    
    // 插入
    numbers.insert(3);
    
    // 遍历（自动排序）
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // 查找
    if (numbers.find(5) != numbers.end()) {
        std::cout << "找到 5" << std::endl;
    }
    
    return 0;
}
```

## 算法

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> vec = {5, 2, 8, 1, 9, 3};
    
    // 排序
    std::sort(vec.begin(), vec.end());
    
    // 查找
    auto it = std::find(vec.begin(), vec.end(), 8);
    if (it != vec.end()) {
        std::cout << "找到 8" << std::endl;
    }
    
    // 反转
    std::reverse(vec.begin(), vec.end());
    
    // 最大最小值
    auto max_it = std::max_element(vec.begin(), vec.end());
    auto min_it = std::min_element(vec.begin(), vec.end());
    
    std::cout << "最大值: " << *max_it << std::endl;
    std::cout << "最小值: " << *min_it << std::endl;
    
    return 0;
}
```

## 参考资源

- [C++ STL](https://en.cppreference.com/w/cpp/container)
