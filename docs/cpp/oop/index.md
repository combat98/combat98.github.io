# C++ 面向对象编程

## 类的基础

```cpp
#include <iostream>
#include <string>

class Student {
private:
    std::string name;
    int age;
    double score;

public:
    // 构造函数
    Student() : name(""), age(0), score(0.0) {}
    Student(std::string n, int a, double s) : name(n), age(a), score(s) {}
    
    // 析构函数
    ~Student() {
        std::cout << "析构 " << name << std::endl;
    }
    
    // 成员函数
    void display() const {
        std::cout << "姓名: " << name << ", 年龄: " << age << ", 分数: " << score << std::endl;
    }
    
    // Getter 和 Setter
    std::string getName() const { return name; }
    void setName(const std::string& n) { name = n; }
};

int main() {
    Student s1("张三", 20, 95.5);
    s1.display();
    
    return 0;
}
```

## 继承

```cpp
#include <iostream>
#include <string>

// 基类
class Animal {
protected:
    std::string name;

public:
    Animal(std::string n) : name(n) {}
    
    virtual void speak() {
        std::cout << name << " 发出声音" << std::endl;
    }
    
    virtual ~Animal() {}
};

// 派生类
class Dog : public Animal {
public:
    Dog(std::string n) : Animal(n) {}
    
    void speak() override {
        std::cout << name << " 说: 汪汪汪!" << std::endl;
    }
};

class Cat : public Animal {
public:
    Cat(std::string n) : Animal(n) {}
    
    void speak() override {
        std::cout << name << " 说: 喵喵喵!" << std::endl;
    }
};

int main() {
    Dog dog("旺财");
    Cat cat("咪咪");
    
    dog.speak();
    cat.speak();
    
    // 多态
    Animal* animals[] = {&dog, &cat};
    for (Animal* animal : animals) {
        animal->speak();
    }
    
    return 0;
}
```

## 多态

```cpp
#include <iostream>

class Shape {
public:
    virtual double area() const = 0;  // 纯虚函数
    virtual ~Shape() {}
};

class Rectangle : public Shape {
private:
    double width, height;

public:
    Rectangle(double w, double h) : width(w), height(h) {}
    
    double area() const override {
        return width * height;
    }
};

class Circle : public Shape {
private:
    double radius;

public:
    Circle(double r) : radius(r) {}
    
    double area() const override {
        return 3.14159 * radius * radius;
    }
};

int main() {
    Rectangle rect(5, 3);
    Circle circle(4);
    
    Shape* shapes[] = {&rect, &circle};
    
    for (Shape* shape : shapes) {
        std::cout << "面积: " << shape->area() << std::endl;
    }
    
    return 0;
}
```

## 运算符重载

```cpp
#include <iostream>

class Complex {
private:
    double real, imag;

public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}
    
    // 重载 + 运算符
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }
    
    // 重载 << 运算符
    friend std::ostream& operator<<(std::ostream& os, const Complex& c) {
        os << c.real << " + " << c.imag << "i";
        return os;
    }
};

int main() {
    Complex c1(3, 4);
    Complex c2(1, 2);
    Complex c3 = c1 + c2;
    
    std::cout << "c1 = " << c1 << std::endl;
    std::cout << "c2 = " << c2 << std::endl;
    std::cout << "c3 = " << c3 << std::endl;
    
    return 0;
}
```

## 参考资源

- [C++ OOP](https://en.cppreference.com/w/cpp/language/classes)
