# Python 面向对象编程

## 简介

面向对象编程（Object-Oriented Programming，OOP）是一种程序设计范式，它将数据和操作数据的方法组合成对象。

### 面向对象三大特性

- **封装**：将数据和方法封装在类中
- **继承**：子类继承父类的属性和方法
- **多态**：不同对象对同一方法的不同实现

## 类和对象

### 定义类

```python
class Person:
    """人类"""
    
    # 类属性
    species = "Human"
    
    # 构造方法
    def __init__(self, name, age):
        # 实例属性
        self.name = name
        self.age = age
    
    # 实例方法
    def say_hello(self):
        print(f"你好，我是 {self.name}，今年 {self.age} 岁")
    
    # 类方法
    @classmethod
    def get_species(cls):
        return cls.species
    
    # 静态方法
    @staticmethod
    def is_adult(age):
        return age >= 18

# 创建对象
person = Person("张三", 25)
person.say_hello()  # 输出：你好，我是 张三，今年 25 岁

# 访问类属性
print(Person.species)  # 输出：Human

# 调用类方法
print(Person.get_species())  # 输出：Human

# 调用静态方法
print(Person.is_adult(20))  # 输出：True
```

### 实例属性和类属性

```python
class Student:
    # 类属性（所有实例共享）
    school = "清华大学"
    count = 0
    
    def __init__(self, name, grade):
        # 实例属性（每个实例独有）
        self.name = name
        self.grade = grade
        Student.count += 1

# 创建实例
s1 = Student("小明", 90)
s2 = Student("小红", 95)

# 访问实例属性
print(s1.name)  # 输出：小明
print(s2.name)  # 输出：小红

# 访问类属性
print(Student.school)  # 输出：清华大学
print(Student.count)   # 输出：2
```

## 封装

### 私有属性和方法

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.__balance = balance  # 私有属性（双下划线开头）
    
    def deposit(self, amount):
        """存款"""
        if amount > 0:
            self.__balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        """取款"""
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return True
        return False
    
    def get_balance(self):
        """获取余额"""
        return self.__balance
    
    def __validate_amount(self, amount):
        """私有方法"""
        return amount > 0

# 使用
account = BankAccount("张三", 1000)
account.deposit(500)
print(account.get_balance())  # 输出：1500

# 无法直接访问私有属性
# print(account.__balance)  # 报错
```

### 属性装饰器

```python
class Employee:
    def __init__(self, name, salary):
        self._name = name
        self._salary = salary
    
    @property
    def name(self):
        """获取名字"""
        return self._name
    
    @name.setter
    def name(self, value):
        """设置名字"""
        if isinstance(value, str) and value:
            self._name = value
        else:
            raise ValueError("名字必须是非空字符串")
    
    @property
    def salary(self):
        """获取薪水"""
        return self._salary
    
    @salary.setter
    def salary(self, value):
        """设置薪水"""
        if value > 0:
            self._salary = value
        else:
            raise ValueError("薪水必须大于0")
    
    @property
    def annual_salary(self):
        """计算年薪（只读属性）"""
        return self._salary * 12

# 使用
emp = Employee("李四", 10000)
print(emp.name)           # 输出：李四
print(emp.salary)         # 输出：10000
print(emp.annual_salary)  # 输出：120000

# 修改属性
emp.name = "王五"
emp.salary = 12000
print(emp.annual_salary)  # 输出：144000
```

## 继承

### 单继承

```python
class Animal:
    """动物基类"""
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass
    
    def move(self):
        print(f"{self.name} 正在移动")

class Dog(Animal):
    """狗类继承动物类"""
    def __init__(self, name, breed):
        super().__init__(name)  # 调用父类构造方法
        self.breed = breed
    
    def speak(self):
        """重写父类方法"""
        print(f"{self.name} 说：汪汪汪！")
    
    def fetch(self):
        """子类特有方法"""
        print(f"{self.name} 正在捡球")

class Cat(Animal):
    """猫类继承动物类"""
    def speak(self):
        print(f"{self.name} 说：喵喵喵！")

# 使用
dog = Dog("旺财", "金毛")
dog.speak()  # 输出：旺财 说：汪汪汪！
dog.move()   # 输出：旺财 正在移动
dog.fetch()  # 输出：旺财 正在捡球

cat = Cat("咪咪")
cat.speak()  # 输出：咪咪 说：喵喵喵！
```

### 多继承

```python
class Flyable:
    """可飞行的"""
    def fly(self):
        print("正在飞行")

class Swimmable:
    """可游泳的"""
    def swim(self):
        print("正在游泳")

class Duck(Animal, Flyable, Swimmable):
    """鸭子类（多继承）"""
    def speak(self):
        print(f"{self.name} 说：嘎嘎嘎！")

# 使用
duck = Duck("唐老鸭")
duck.speak()  # 输出：唐老鸭 说：嘎嘎嘎！
duck.fly()    # 输出：正在飞行
duck.swim()   # 输出：正在游泳
```

### 方法解析顺序（MRO）

```python
class A:
    def method(self):
        print("A.method")

class B(A):
    def method(self):
        print("B.method")

class C(A):
    def method(self):
        print("C.method")

class D(B, C):
    pass

# 查看方法解析顺序
print(D.__mro__)
# 输出：(<class '__main__.D'>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>)

d = D()
d.method()  # 输出：B.method（按照 MRO 顺序查找）
```

## 多态

```python
class Shape:
    """形状基类"""
    def area(self):
        pass
    
    def perimeter(self):
        pass

class Rectangle(Shape):
    """矩形"""
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

class Circle(Shape):
    """圆形"""
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14 * self.radius ** 2
    
    def perimeter(self):
        return 2 * 3.14 * self.radius

# 多态：不同对象调用相同方法，表现不同行为
def print_shape_info(shape):
    """打印形状信息"""
    print(f"面积：{shape.area()}")
    print(f"周长：{shape.perimeter()}")

# 使用
rect = Rectangle(5, 3)
circle = Circle(4)

print_shape_info(rect)    # 调用矩形的方法
print_shape_info(circle)  # 调用圆形的方法
```

## 特殊方法（魔术方法）

### 常用魔术方法

```python
class Book:
    def __init__(self, title, author, price):
        self.title = title
        self.author = author
        self.price = price
    
    def __str__(self):
        """字符串表示（用户友好）"""
        return f"《{self.title}》 - {self.author}"
    
    def __repr__(self):
        """字符串表示（开发者友好）"""
        return f"Book('{self.title}', '{self.author}', {self.price})"
    
    def __len__(self):
        """长度"""
        return len(self.title)
    
    def __eq__(self, other):
        """相等比较"""
        return self.title == other.title and self.author == other.author
    
    def __lt__(self, other):
        """小于比较"""
        return self.price < other.price
    
    def __add__(self, other):
        """加法运算"""
        return self.price + other.price

# 使用
book1 = Book("Python编程", "张三", 89.0)
book2 = Book("Java编程", "李四", 99.0)

print(book1)           # 输出：《Python编程》 - 张三
print(repr(book1))     # 输出：Book('Python编程', '张三', 89.0)
print(len(book1))      # 输出：8
print(book1 == book2)  # 输出：False
print(book1 < book2)   # 输出：True
print(book1 + book2)   # 输出：188.0
```

### 容器类型魔术方法

```python
class MyList:
    def __init__(self):
        self.items = []
    
    def __len__(self):
        """长度"""
        return len(self.items)
    
    def __getitem__(self, index):
        """获取元素"""
        return self.items[index]
    
    def __setitem__(self, index, value):
        """设置元素"""
        self.items[index] = value
    
    def __delitem__(self, index):
        """删除元素"""
        del self.items[index]
    
    def __contains__(self, item):
        """包含判断"""
        return item in self.items
    
    def __iter__(self):
        """迭代器"""
        return iter(self.items)
    
    def append(self, item):
        """添加元素"""
        self.items.append(item)

# 使用
my_list = MyList()
my_list.append(1)
my_list.append(2)
my_list.append(3)

print(len(my_list))      # 输出：3
print(my_list[0])        # 输出：1
print(2 in my_list)      # 输出：True

for item in my_list:
    print(item)          # 输出：1 2 3
```

## 抽象基类

```python
from abc import ABC, abstractmethod

class Vehicle(ABC):
    """交通工具抽象基类"""
    
    def __init__(self, brand):
        self.brand = brand
    
    @abstractmethod
    def start(self):
        """启动（抽象方法，子类必须实现）"""
        pass
    
    @abstractmethod
    def stop(self):
        """停止（抽象方法，子类必须实现）"""
        pass
    
    def info(self):
        """普通方法"""
        print(f"品牌：{self.brand}")

class Car(Vehicle):
    """汽车类"""
    def start(self):
        print(f"{self.brand} 汽车启动")
    
    def stop(self):
        print(f"{self.brand} 汽车停止")

class Bike(Vehicle):
    """自行车类"""
    def start(self):
        print(f"{self.brand} 自行车开始骑行")
    
    def stop(self):
        print(f"{self.brand} 自行车停止骑行")

# 使用
car = Car("奔驰")
car.info()   # 输出：品牌：奔驰
car.start()  # 输出：奔驰 汽车启动
car.stop()   # 输出：奔驰 汽车停止

# 无法实例化抽象类
# vehicle = Vehicle("通用")  # 报错
```

## 数据类（dataclass）

```python
from dataclasses import dataclass, field
from typing import List

@dataclass
class Product:
    """商品数据类"""
    name: str
    price: float
    quantity: int = 0
    tags: List[str] = field(default_factory=list)
    
    def total_value(self):
        """计算总价值"""
        return self.price * self.quantity

# 使用
product = Product("笔记本电脑", 5999.0, 10, ["电子产品", "办公"])
print(product)
# 输出：Product(name='笔记本电脑', price=5999.0, quantity=10, tags=['电子产品', '办公'])

print(product.total_value())  # 输出：59990.0
```

## 单例模式

```python
class Singleton:
    """单例模式"""
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self, value):
        self.value = value

# 使用
s1 = Singleton(10)
s2 = Singleton(20)

print(s1 is s2)      # 输出：True（同一个实例）
print(s1.value)      # 输出：20
print(s2.value)      # 输出：20
```

## 上下文管理器

```python
class FileManager:
    """文件管理器（上下文管理器）"""
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        """进入上下文"""
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """退出上下文"""
        if self.file:
            self.file.close()
        return False

# 使用
with FileManager('test.txt', 'w') as f:
    f.write('Hello, World!')
# 文件自动关闭
```

## 描述符

```python
class Validator:
    """验证器描述符"""
    def __init__(self, min_value=None, max_value=None):
        self.min_value = min_value
        self.max_value = max_value
    
    def __set_name__(self, owner, name):
        self.name = name
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__.get(self.name)
    
    def __set__(self, instance, value):
        if self.min_value is not None and value < self.min_value:
            raise ValueError(f"{self.name} 不能小于 {self.min_value}")
        if self.max_value is not None and value > self.max_value:
            raise ValueError(f"{self.name} 不能大于 {self.max_value}")
        instance.__dict__[self.name] = value

class Person:
    age = Validator(min_value=0, max_value=150)
    
    def __init__(self, name, age):
        self.name = name
        self.age = age

# 使用
person = Person("张三", 25)
print(person.age)  # 输出：25

# person.age = -1   # 报错：age 不能小于 0
# person.age = 200  # 报错：age 不能大于 150
```

## 最佳实践

1. **遵循单一职责原则** - 一个类只负责一个功能
2. **使用组合优于继承** - 优先使用组合而不是继承
3. **遵循开闭原则** - 对扩展开放，对修改关闭
4. **使用私有属性** - 保护内部数据
5. **编写文档字符串** - 为类和方法添加说明
6. **使用类型注解** - 提高代码可读性
7. **实现特殊方法** - 让对象更加 Pythonic

## 参考资源

- [Python 官方文档 - 类](https://docs.python.org/zh-cn/3/tutorial/classes.html)
- [Python 数据模型](https://docs.python.org/zh-cn/3/reference/datamodel.html)
