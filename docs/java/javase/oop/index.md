# 面向对象

## 概述

面向对象编程（OOP）是一种编程范式，Java 是一门纯面向对象的语言。OOP 的核心思想是将数据和操作数据的方法封装在一起，形成"对象"。

### 面向对象三大特性

- **封装**：隐藏对象的内部实现细节，只暴露必要的接口
- **继承**：子类继承父类的属性和方法，实现代码复用
- **多态**：同一操作作用于不同对象，产生不同的行为

## 类与对象

### 类的定义

```java
public class Person {
    // 成员变量（属性）
    private String name;
    private int age;
    
    // 构造方法
    public Person() {}
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 成员方法
    public void sayHello() {
        System.out.println("Hello, I'm " + name);
    }
    
    // Getter 和 Setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}
```

### 创建对象

```java
// 使用 new 关键字创建对象
Person person = new Person("张三", 25);
person.sayHello();
```

## 封装

封装是将数据和操作数据的方法绑定在一起，对外隐藏实现细节。

### 访问修饰符

| 修饰符 | 同类 | 同包 | 子类 | 不同包 |
|--------|------|------|------|--------|
| private | ✓ | ✗ | ✗ | ✗ |
| default | ✓ | ✓ | ✗ | ✗ |
| protected | ✓ | ✓ | ✓ | ✗ |
| public | ✓ | ✓ | ✓ | ✓ |

```java
public class BankAccount {
    private double balance;  // 私有属性
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public double getBalance() {
        return balance;
    }
}
```

## 继承

继承允许创建一个新类，继承现有类的属性和方法。

```java
// 父类
public class Animal {
    protected String name;
    
    public void eat() {
        System.out.println(name + " is eating");
    }
}

// 子类
public class Dog extends Animal {
    public Dog(String name) {
        this.name = name;
    }
    
    public void bark() {
        System.out.println(name + " is barking");
    }
}
```

### 方法重写（Override）

```java
public class Cat extends Animal {
    @Override
    public void eat() {
        System.out.println(name + " is eating fish");
    }
}
```

### super 关键字

```java
public class Student extends Person {
    private String school;
    
    public Student(String name, int age, String school) {
        super(name, age);  // 调用父类构造方法
        this.school = school;
    }
}
```

## 多态

多态是指同一个方法调用，由于对象不同可能会有不同的行为。

### 多态的实现条件

1. 继承关系
2. 方法重写
3. 父类引用指向子类对象

```java
public class PolymorphismDemo {
    public static void main(String[] args) {
        Animal animal1 = new Dog("旺财");
        Animal animal2 = new Cat("咪咪");
        
        animal1.eat();  // 调用 Dog 的 eat 方法
        animal2.eat();  // 调用 Cat 的 eat 方法
    }
}
```

### instanceof 关键字

```java
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;  // 向下转型
    dog.bark();
}
```

## 抽象类

抽象类不能被实例化，用于定义通用的模板。

```java
public abstract class Shape {
    protected String color;
    
    // 抽象方法，子类必须实现
    public abstract double getArea();
    
    // 普通方法
    public void setColor(String color) {
        this.color = color;
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}
```

## 接口

接口定义了一组规范，实现类必须遵守。

```java
public interface Flyable {
    void fly();  // 抽象方法
    
    default void land() {  // 默认方法（Java 8+）
        System.out.println("Landing...");
    }
}

public class Bird implements Flyable {
    @Override
    public void fly() {
        System.out.println("Bird is flying");
    }
}
```

### 接口 vs 抽象类

| 特性 | 接口 | 抽象类 |
|------|------|--------|
| 多继承 | 支持 | 不支持 |
| 构造方法 | 无 | 有 |
| 成员变量 | 只能是常量 | 可以是变量 |
| 方法实现 | 默认方法/静态方法 | 可以有普通方法 |

## 内部类

### 成员内部类

```java
public class Outer {
    private String name = "Outer";
    
    class Inner {
        public void show() {
            System.out.println(name);  // 可以访问外部类私有成员
        }
    }
}
```

### 静态内部类

```java
public class Outer {
    static class StaticInner {
        public void show() {
            System.out.println("Static Inner Class");
        }
    }
}

// 使用
Outer.StaticInner inner = new Outer.StaticInner();
```

### 匿名内部类

```java
Runnable runnable = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running...");
    }
};
```

## 常用关键字

### this

- 引用当前对象
- 调用当前类的构造方法

### static

- 静态变量：属于类，所有实例共享
- 静态方法：不依赖实例，通过类名调用
- 静态代码块：类加载时执行一次

```java
public class Counter {
    private static int count = 0;  // 静态变量
    
    public Counter() {
        count++;
    }
    
    public static int getCount() {  // 静态方法
        return count;
    }
}
```

### final

- final 变量：常量，不可修改
- final 方法：不可被重写
- final 类：不可被继承

```java
public final class Constants {
    public static final double PI = 3.14159;
}
```
