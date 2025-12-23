# JavaScript

## 概述

JavaScript 是一种轻量级的解释型编程语言，是 Web 开发的核心技术之一，与 HTML 和 CSS 并称为前端三剑客。

### 特点

- **解释型语言**：无需编译，直接运行
- **动态类型**：变量类型在运行时确定
- **基于原型**：面向对象编程
- **单线程**：事件循环机制
- **跨平台**：浏览器、Node.js

## 基础语法

### 变量声明

```javascript
// var - 函数作用域，存在变量提升
var name = 'Alice';

// let - 块级作用域，不存在变量提升
let age = 25;

// const - 块级作用域，常量
const PI = 3.14;

// 解构赋值
const [a, b, c] = [1, 2, 3];
const { name, age } = { name: 'Bob', age: 30 };
```

### 数据类型

```javascript
// 基本类型
let num = 42;                    // Number
let str = 'Hello';               // String
let bool = true;                 // Boolean
let undef = undefined;           // Undefined
let n = null;                    // Null
let sym = Symbol('id');          // Symbol
let bigInt = 123n;               // BigInt

// 引用类型
let obj = { name: 'Alice' };     // Object
let arr = [1, 2, 3];             // Array
let func = function() {};        // Function
let date = new Date();           // Date
let regex = /pattern/;           // RegExp

// 类型检测
typeof 42;                       // "number"
typeof 'hello';                  // "string"
typeof true;                     // "boolean"
typeof undefined;                // "undefined"
typeof null;                     // "object" (历史遗留问题)
typeof {};                       // "object"
typeof [];                       // "object"
typeof function(){};             // "function"

// 更准确的类型检测
Object.prototype.toString.call([]);  // "[object Array]"
Array.isArray([]);                   // true
```

### 运算符

```javascript
// 算术运算符
let a = 10 + 5;   // 加
let b = 10 - 5;   // 减
let c = 10 * 5;   // 乘
let d = 10 / 5;   // 除
let e = 10 % 3;   // 取余
let f = 2 ** 3;   // 幂运算

// 比较运算符
10 == '10';       // true (值相等)
10 === '10';      // false (值和类型都相等)
10 != '10';       // false
10 !== '10';      // true
10 > 5;           // true
10 < 5;           // false

// 逻辑运算符
true && false;    // false (与)
true || false;    // true (或)
!true;            // false (非)

// 赋值运算符
let x = 10;
x += 5;           // x = x + 5
x -= 5;           // x = x - 5
x *= 2;           // x = x * 2
x /= 2;           // x = x / 2

// 三元运算符
let result = age >= 18 ? '成年' : '未成年';

// 空值合并运算符
let value = null ?? 'default';  // 'default'

// 可选链运算符
let name = user?.profile?.name;
```

## 流程控制

### 条件语句

```javascript
// if...else
if (age >= 18) {
  console.log('成年');
} else if (age >= 13) {
  console.log('青少年');
} else {
  console.log('儿童');
}

// switch
switch (day) {
  case 1:
    console.log('Monday');
    break;
  case 2:
    console.log('Tuesday');
    break;
  default:
    console.log('Other day');
}
```

### 循环语句

```javascript
// for 循环
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// while 循环
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do...while 循环
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);

// for...in (遍历对象属性)
const obj = { a: 1, b: 2, c: 3 };
for (let key in obj) {
  console.log(key, obj[key]);
}

// for...of (遍历可迭代对象)
const arr = [1, 2, 3];
for (let value of arr) {
  console.log(value);
}

// break 和 continue
for (let i = 0; i < 10; i++) {
  if (i === 5) break;      // 跳出循环
  if (i % 2 === 0) continue;  // 跳过本次循环
  console.log(i);
}
```

## 函数

### 函数声明

```javascript
// 函数声明
function add(a, b) {
  return a + b;
}

// 函数表达式
const subtract = function(a, b) {
  return a - b;
};

// 箭头函数
const multiply = (a, b) => a * b;

// 箭头函数（多行）
const divide = (a, b) => {
  if (b === 0) return 'Error';
  return a / b;
};

// 默认参数
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// 立即执行函数
(function() {
  console.log('IIFE');
})();
```

### 高阶函数

```javascript
// 函数作为参数
function operate(a, b, operation) {
  return operation(a, b);
}

operate(5, 3, (x, y) => x + y);  // 8

// 函数作为返回值
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
double(5);  // 10

// 闭包
function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const myCounter = counter();
myCounter.increment();  // 1
myCounter.increment();  // 2
myCounter.getCount();   // 2
```

## 数组

### 数组方法

```javascript
const arr = [1, 2, 3, 4, 5];

// 添加/删除元素
arr.push(6);           // 末尾添加
arr.pop();             // 末尾删除
arr.unshift(0);        // 开头添加
arr.shift();           // 开头删除
arr.splice(2, 1, 'a'); // 删除并插入

// 查找元素
arr.indexOf(3);        // 2
arr.includes(3);       // true
arr.find(x => x > 3);  // 4
arr.findIndex(x => x > 3);  // 3

// 遍历数组
arr.forEach((item, index) => {
  console.log(index, item);
});

// 转换数组
arr.map(x => x * 2);              // [2, 4, 6, 8, 10]
arr.filter(x => x > 2);           // [3, 4, 5]
arr.reduce((sum, x) => sum + x, 0);  // 15

// 其他方法
arr.slice(1, 3);       // [2, 3] (不改变原数组)
arr.concat([6, 7]);    // [1, 2, 3, 4, 5, 6, 7]
arr.join('-');         // "1-2-3-4-5"
arr.reverse();         // [5, 4, 3, 2, 1]
arr.sort((a, b) => a - b);  // 升序排序

// ES6+ 方法
arr.some(x => x > 3);  // true (至少一个满足)
arr.every(x => x > 0); // true (全部满足)
arr.flat();            // 扁平化数组
arr.flatMap(x => [x, x * 2]);  // map + flat
```

### 数组解构

```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// 交换变量
let a = 1, b = 2;
[a, b] = [b, a];

// 默认值
const [x = 0, y = 0] = [1];
// x = 1, y = 0
```

## 对象

### 对象操作

```javascript
// 创建对象
const person = {
  name: 'Alice',
  age: 25,
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

// 访问属性
person.name;           // 'Alice'
person['age'];         // 25

// 添加/修改属性
person.email = 'alice@example.com';
person.age = 26;

// 删除属性
delete person.email;

// 检查属性
'name' in person;      // true
person.hasOwnProperty('name');  // true

// 遍历属性
for (let key in person) {
  console.log(key, person[key]);
}

Object.keys(person);   // ['name', 'age', 'greet']
Object.values(person); // ['Alice', 26, function]
Object.entries(person);  // [['name', 'Alice'], ['age', 26], ...]

// 对象方法
Object.assign({}, person);  // 浅拷贝
Object.freeze(person);      // 冻结对象
Object.seal(person);        // 密封对象
```

### 对象解构

```javascript
const { name, age, email = 'N/A' } = person;

// 重命名
const { name: userName, age: userAge } = person;

// 嵌套解构
const user = {
  id: 1,
  profile: {
    name: 'Bob',
    age: 30
  }
};

const { profile: { name, age } } = user;
```

### 对象简写

```javascript
const name = 'Alice';
const age = 25;

// 属性简写
const person = { name, age };

// 方法简写
const obj = {
  greet() {
    console.log('Hello');
  }
};

// 计算属性名
const key = 'name';
const person2 = {
  [key]: 'Bob',
  ['age']: 30
};
```

## 类与继承

```javascript
// 类定义
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
  
  // 静态方法
  static create(name, age) {
    return new Person(name, age);
  }
  
  // Getter
  get info() {
    return `${this.name}, ${this.age}`;
  }
  
  // Setter
  set info(value) {
    [this.name, this.age] = value.split(', ');
  }
}

// 继承
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }
  
  study() {
    console.log(`${this.name} is studying`);
  }
  
  // 重写方法
  greet() {
    super.greet();
    console.log(`I'm in grade ${this.grade}`);
  }
}

const student = new Student('Bob', 18, 12);
student.greet();
student.study();
```

## 异步编程

### 回调函数

```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback('Data loaded');
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
```

### Promise

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Success');
    } else {
      reject('Error');
    }
  }, 1000);
});

// 使用 Promise
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log('Done'));

// Promise 方法
Promise.all([promise1, promise2])     // 全部成功
  .then(results => console.log(results));

Promise.race([promise1, promise2])    // 第一个完成
  .then(result => console.log(result));

Promise.allSettled([promise1, promise2])  // 全部完成
  .then(results => console.log(results));

Promise.any([promise1, promise2])     // 第一个成功
  .then(result => console.log(result));
```

### Async/Await

```javascript
// async 函数
async function fetchData() {
  return 'Data';
}

// await 等待 Promise
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// 并行执行
async function fetchMultiple() {
  const [data1, data2] = await Promise.all([
    fetchData1(),
    fetchData2()
  ]);
  return { data1, data2 };
}
```

## DOM 操作

```javascript
// 选择元素
document.getElementById('id');
document.getElementsByClassName('class');
document.getElementsByTagName('div');
document.querySelector('.class');
document.querySelectorAll('.class');

// 创建元素
const div = document.createElement('div');
div.textContent = 'Hello';
div.innerHTML = '<span>World</span>';

// 添加元素
parent.appendChild(child);
parent.insertBefore(newNode, referenceNode);
parent.append(child1, child2);  // 可添加多个

// 删除元素
parent.removeChild(child);
element.remove();

// 修改属性
element.setAttribute('class', 'active');
element.getAttribute('class');
element.removeAttribute('class');
element.classList.add('active');
element.classList.remove('active');
element.classList.toggle('active');

// 修改样式
element.style.color = 'red';
element.style.fontSize = '16px';

// 事件监听
element.addEventListener('click', (e) => {
  console.log('Clicked', e.target);
});

element.removeEventListener('click', handler);

// 事件委托
parent.addEventListener('click', (e) => {
  if (e.target.matches('.child')) {
    console.log('Child clicked');
  }
});
```

## ES6+ 新特性

```javascript
// 模板字符串
const name = 'Alice';
const greeting = `Hello, ${name}!`;

// 扩展运算符
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };

// 可选链
const value = obj?.prop?.nested;

// 空值合并
const result = value ?? 'default';

// Promise
// Async/Await
// 类
// 模块化
import { func } from './module.js';
export default function() {}

// Symbol
const sym = Symbol('description');

// Map 和 Set
const map = new Map();
map.set('key', 'value');
map.get('key');

const set = new Set([1, 2, 3, 3]);
set.add(4);
set.has(1);
```

## 常用技巧

### 深拷贝

```javascript
// 简单深拷贝
const copy = JSON.parse(JSON.stringify(obj));

// 递归深拷贝
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  const clone = Array.isArray(obj) ? [] : {};
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  
  return clone;
}
```

### 防抖和节流

```javascript
// 防抖
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// 节流
function throttle(func, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) {
      func.apply(this, args);
      last = now;
    }
  };
}
```

### 数组去重

```javascript
// 使用 Set
const unique = [...new Set(arr)];

// 使用 filter
const unique = arr.filter((item, index) => arr.indexOf(item) === index);
```

## 最佳实践

1. **使用严格模式**：`'use strict';`
2. **使用 const 和 let**：避免使用 var
3. **使用箭头函数**：简洁且不绑定 this
4. **使用模板字符串**：替代字符串拼接
5. **使用解构赋值**：简化代码
6. **使用 async/await**：替代 Promise 链
7. **避免全局变量**：使用模块化
8. **错误处理**：使用 try-catch
