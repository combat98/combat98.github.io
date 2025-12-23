---
prev:
  text: '数据结构与算法'
  link: '/program/dataStructure/index'
next:
  text: '计算机网络'
  link: '/program/network/index'
---

# 设计模式

设计模式是软件设计中常见问题的典型解决方案，分为三大类：创建型、结构型和行为型。

## 创建型模式

创建型模式关注对象的创建机制，提供了创建对象的最佳方式。

### 单例模式

确保一个类只有一个实例，并提供全局访问点。

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    this.data = [];
  }
  
  getData() {
    return this.data;
  }
  
  setData(val) {
    this.data.push(val);
  }
}

// 使用
const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2);  // true

// ES6 模块天然单例
// config.js
export default {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};
```

**应用场景：**
- 全局配置对象
- 数据库连接池
- 日志记录器
- Vuex Store、Redux Store

### 工厂方法模式

定义创建对象的接口，让子类决定实例化哪个类。

```javascript
// 简单工厂
class UserFactory {
  static createUser(role) {
    switch (role) {
      case 'admin':
        return new Admin();
      case 'user':
        return new User();
      case 'guest':
        return new Guest();
      default:
        throw new Error('Invalid role');
    }
  }
}

class Admin {
  constructor() {
    this.role = 'admin';
    this.permissions = ['read', 'write', 'delete'];
  }
}

class User {
  constructor() {
    this.role = 'user';
    this.permissions = ['read', 'write'];
  }
}

class Guest {
  constructor() {
    this.role = 'guest';
    this.permissions = ['read'];
  }
}

// 使用
const admin = UserFactory.createUser('admin');
console.log(admin.permissions);  // ['read', 'write', 'delete']
```

**应用场景：**
- 根据用户角色创建不同权限对象
- 根据配置创建不同类型的数据库连接
- React.createElement()

### 抽象工厂模式

提供一个创建一系列相关或相互依赖对象的接口。

```javascript
// UI 组件工厂
class WindowsFactory {
  createButton() {
    return new WindowsButton();
  }
  
  createInput() {
    return new WindowsInput();
  }
}

class MacFactory {
  createButton() {
    return new MacButton();
  }
  
  createInput() {
    return new MacInput();
  }
}

class WindowsButton {
  render() {
    return '<button class="windows-btn">Windows Button</button>';
  }
}

class MacButton {
  render() {
    return '<button class="mac-btn">Mac Button</button>';
  }
}

// 使用
const factory = process.platform === 'win32' ? new WindowsFactory() : new MacFactory();
const button = factory.createButton();
```

### 建造者模式

将复杂对象的构建与表示分离，使同样的构建过程可以创建不同的表示。

```javascript
class QueryBuilder {
  constructor() {
    this.query = {
      select: [],
      from: '',
      where: [],
      orderBy: []
    };
  }
  
  select(...fields) {
    this.query.select = fields;
    return this;
  }
  
  from(table) {
    this.query.from = table;
    return this;
  }
  
  where(condition) {
    this.query.where.push(condition);
    return this;
  }
  
  orderBy(field, direction = 'ASC') {
    this.query.orderBy.push({ field, direction });
    return this;
  }
  
  build() {
    let sql = `SELECT ${this.query.select.join(', ')} FROM ${this.query.from}`;
    if (this.query.where.length > 0) {
      sql += ` WHERE ${this.query.where.join(' AND ')}`;
    }
    if (this.query.orderBy.length > 0) {
      const orderClauses = this.query.orderBy.map(o => `${o.field} ${o.direction}`);
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }
    return sql;
  }
}

// 使用
const sql = new QueryBuilder()
  .select('id', 'name', 'email')
  .from('users')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('created_at', 'DESC')
  .build();
```

### 原型模式

通过复制现有对象来创建新对象。

```javascript
const carPrototype = {
  wheels: 4,
  engine: 'V6',
  clone() {
    return Object.create(this);
  },
  customize(options) {
    return Object.assign(this.clone(), options);
  }
};

const myCar = carPrototype.customize({
  color: 'red',
  brand: 'Tesla',
  engine: 'Electric'
});

console.log(myCar.wheels);  // 4
console.log(myCar.engine);  // Electric
```

## 结构型模式

结构型模式关注类和对象的组合，通过继承和组合来获得更强大的功能。

### 适配器模式

将一个类的接口转换成客户希望的另一个接口。

```javascript
// 旧接口
class OldAPI {
  request(url) {
    return `Old API: ${url}`;
  }
}

// 新接口
class NewAPI {
  fetch(endpoint) {
    return fetch(endpoint).then(res => res.json());
  }
}

// 适配器
class APIAdapter {
  constructor() {
    this.newAPI = new NewAPI();
  }
  
  request(url) {
    // 将旧的 request 方法适配到新的 fetch 方法
    return this.newAPI.fetch(url);
  }
}

// 使用
const api = new APIAdapter();
api.request('/api/users');

// Axios 适配器示例
const axiosAdapter = {
  request(config) {
    return fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: JSON.stringify(config.data)
    });
  }
};
```

### 装饰器模式

动态地给对象添加额外的职责。

```javascript
// 基础组件
class Coffee {
  cost() {
    return 10;
  }
  
  description() {
    return 'Coffee';
  }
}

// 装饰器
class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  
  cost() {
    return this.coffee.cost() + 2;
  }
  
  description() {
    return this.coffee.description() + ', Milk';
  }
}

class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  
  cost() {
    return this.coffee.cost() + 1;
  }
  
  description() {
    return this.coffee.description() + ', Sugar';
  }
}

// 使用
let myCoffee = new Coffee();
myCoffee = new MilkDecorator(myCoffee);
myCoffee = new SugarDecorator(myCoffee);
console.log(myCoffee.description());  // Coffee, Milk, Sugar
console.log(myCoffee.cost());  // 13

// ES7 装饰器
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class Person {
  @readonly
  name() {
    return 'John';
  }
}
```

### 代理模式

为其他对象提供一种代理以控制对这个对象的访问。

```javascript
// 虚拟代理 - 图片懒加载
class ImageProxy {
  constructor(url) {
    this.url = url;
    this.image = null;
  }
  
  display() {
    if (!this.image) {
      console.log('Loading image...');
      this.image = new Image();
      this.image.src = this.url;
    }
    return this.image;
  }
}

// 缓存代理
const cacheProxy = (fn) => {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('From cache');
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

const fibonacci = cacheProxy((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

// ES6 Proxy
const handler = {
  get(target, property) {
    console.log(`Getting ${property}`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`Setting ${property} to ${value}`);
    target[property] = value;
    return true;
  }
};

const user = new Proxy({}, handler);
user.name = 'John';  // Setting name to John
console.log(user.name);  // Getting name, John
```

### 外观模式

为子系统中的一组接口提供一个统一的高层接口。

```javascript
// 复杂的子系统
class CPU {
  freeze() { console.log('CPU freeze'); }
  jump(position) { console.log(`CPU jump to ${position}`); }
  execute() { console.log('CPU execute'); }
}

class Memory {
  load(position, data) {
    console.log(`Memory load ${data} at ${position}`);
  }
}

class HardDrive {
  read(lba, size) {
    console.log(`HardDrive read ${size} from ${lba}`);
    return 'boot data';
  }
}

// 外观
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }
  
  start() {
    this.cpu.freeze();
    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);
    this.cpu.jump(0);
    this.cpu.execute();
  }
}

// 使用
const computer = new ComputerFacade();
computer.start();  // 简化的启动过程

// jQuery 就是一个外观模式的例子
$('#element').css('color', 'red');  // 隐藏了复杂的 DOM 操作
```

### 组合模式

将对象组合成树形结构以表示"部分-整体"的层次结构。

```javascript
// 文件系统示例
class File {
  constructor(name, size) {
    this.name = name;
    this.size = size;
  }
  
  getSize() {
    return this.size;
  }
  
  print(indent = '') {
    console.log(`${indent}📄 ${this.name} (${this.size}KB)`);
  }
}

class Folder {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
  
  add(item) {
    this.children.push(item);
  }
  
  getSize() {
    return this.children.reduce((total, child) => total + child.getSize(), 0);
  }
  
  print(indent = '') {
    console.log(`${indent}📁 ${this.name}`);
    this.children.forEach(child => child.print(indent + '  '));
  }
}

// 使用
const root = new Folder('root');
const documents = new Folder('documents');
const photos = new Folder('photos');

documents.add(new File('resume.pdf', 100));
documents.add(new File('cover-letter.pdf', 50));
photos.add(new File('vacation.jpg', 2000));

root.add(documents);
root.add(photos);
root.add(new File('readme.txt', 10));

root.print();
console.log(`Total size: ${root.getSize()}KB`);
```

## 行为型模式

行为型模式关注对象之间的通信和职责分配。

### 观察者模式

定义对象间的一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会得到通知。

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  
  update(data) {
    console.log(`${this.name} received: ${data}`);
  }
}

// 使用
const subject = new Subject();
const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.notify('Hello!');

// Vue 响应式系统就是观察者模式
// EventEmitter 也是观察者模式
```

### 发布-订阅模式

与观察者模式类似，但通过事件中心解耦发布者和订阅者。

```javascript
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
  
  once(event, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// 使用
const eventBus = new EventBus();

eventBus.on('user:login', (user) => {
  console.log(`User ${user.name} logged in`);
});

eventBus.on('user:login', (user) => {
  console.log(`Send welcome email to ${user.email}`);
});

eventBus.emit('user:login', { name: 'John', email: 'john@example.com' });
```

### 策略模式

定义一系列算法，把它们封装起来，并使它们可以互相替换。

```javascript
// 表单验证策略
const strategies = {
  required: (value, errorMsg) => {
    if (!value) return errorMsg;
  },
  minLength: (value, length, errorMsg) => {
    if (value.length < length) return errorMsg;
  },
  email: (value, errorMsg) => {
    if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
      return errorMsg;
    }
  },
  phone: (value, errorMsg) => {
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return errorMsg;
    }
  }
};

class Validator {
  constructor() {
    this.rules = [];
  }
  
  add(value, rules) {
    rules.forEach(rule => {
      const [strategy, ...args] = rule;
      this.rules.push(() => {
        return strategies[strategy](value, ...args);
      });
    });
  }
  
  validate() {
    for (let rule of this.rules) {
      const error = rule();
      if (error) return error;
    }
  }
}

// 使用
const validator = new Validator();
validator.add('', [
  ['required', '用户名不能为空'],
  ['minLength', 6, '用户名长度不能少于6位']
]);

const error = validator.validate();
if (error) {
  console.log(error);
}

// 支付策略
class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  pay(amount) {
    return this.strategy.pay(amount);
  }
}

class AlipayStrategy {
  pay(amount) {
    console.log(`使用支付宝支付 ${amount} 元`);
  }
}

class WechatStrategy {
  pay(amount) {
    console.log(`使用微信支付 ${amount} 元`);
  }
}

const payment = new PaymentContext(new AlipayStrategy());
payment.pay(100);
payment.setStrategy(new WechatStrategy());
payment.pay(200);
```

### 命令模式

将请求封装成对象，从而使你可用不同的请求对客户进行参数化。

```javascript
// 文本编辑器命令
class Editor {
  constructor() {
    this.content = '';
  }
  
  write(text) {
    this.content += text;
  }
  
  delete(length) {
    this.content = this.content.slice(0, -length);
  }
  
  getContent() {
    return this.content;
  }
}

class Command {
  constructor(editor) {
    this.editor = editor;
  }
  
  execute() {}
  undo() {}
}

class WriteCommand extends Command {
  constructor(editor, text) {
    super(editor);
    this.text = text;
  }
  
  execute() {
    this.editor.write(this.text);
  }
  
  undo() {
    this.editor.delete(this.text.length);
  }
}

class CommandManager {
  constructor() {
    this.history = [];
    this.current = -1;
  }
  
  execute(command) {
    command.execute();
    this.history = this.history.slice(0, this.current + 1);
    this.history.push(command);
    this.current++;
  }
  
  undo() {
    if (this.current >= 0) {
      this.history[this.current].undo();
      this.current--;
    }
  }
  
  redo() {
    if (this.current < this.history.length - 1) {
      this.current++;
      this.history[this.current].execute();
    }
  }
}

// 使用
const editor = new Editor();
const manager = new CommandManager();

manager.execute(new WriteCommand(editor, 'Hello '));
manager.execute(new WriteCommand(editor, 'World'));
console.log(editor.getContent());  // Hello World

manager.undo();
console.log(editor.getContent());  // Hello 

manager.redo();
console.log(editor.getContent());  // Hello World
```

### 迭代器模式

提供一种方法顺序访问聚合对象中的各个元素，而不暴露其内部表示。

```javascript
class Iterator {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }
  
  hasNext() {
    return this.index < this.items.length;
  }
  
  next() {
    return this.items[this.index++];
  }
  
  reset() {
    this.index = 0;
  }
}

// 使用
const iterator = new Iterator([1, 2, 3, 4, 5]);
while (iterator.hasNext()) {
  console.log(iterator.next());
}

// ES6 迭代器协议
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}

// 使用
for (let num of new Range(1, 5)) {
  console.log(num);  // 1, 2, 3, 4, 5
}
```

### 责任链模式

使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系。

```javascript
class Handler {
  constructor() {
    this.next = null;
  }
  
  setNext(handler) {
    this.next = handler;
    return handler;
  }
  
  handle(request) {
    if (this.next) {
      return this.next.handle(request);
    }
    return null;
  }
}

class AuthHandler extends Handler {
  handle(request) {
    if (!request.user) {
      return { error: 'Not authenticated' };
    }
    console.log('Auth check passed');
    return super.handle(request);
  }
}

class ValidationHandler extends Handler {
  handle(request) {
    if (!request.data) {
      return { error: 'Invalid data' };
    }
    console.log('Validation passed');
    return super.handle(request);
  }
}

class ProcessHandler extends Handler {
  handle(request) {
    console.log('Processing request');
    return { success: true, data: request.data };
  }
}

// 使用
const auth = new AuthHandler();
const validation = new ValidationHandler();
const process = new ProcessHandler();

auth.setNext(validation).setNext(process);

const result = auth.handle({
  user: { id: 1 },
  data: { name: 'John' }
});

// Express 中间件就是责任链模式
app.use(authMiddleware);
app.use(validationMiddleware);
app.use(processMiddleware);
```

### 模板方法模式

定义一个操作中的算法骨架，而将一些步骤延迟到子类中。

```javascript
class DataProcessor {
  process() {
    this.readData();
    this.processData();
    this.saveData();
  }
  
  readData() {
    throw new Error('readData must be implemented');
  }
  
  processData() {
    throw new Error('processData must be implemented');
  }
  
  saveData() {
    console.log('Saving data...');
  }
}

class CSVProcessor extends DataProcessor {
  readData() {
    console.log('Reading CSV file');
  }
  
  processData() {
    console.log('Processing CSV data');
  }
}

class JSONProcessor extends DataProcessor {
  readData() {
    console.log('Reading JSON file');
  }
  
  processData() {
    console.log('Processing JSON data');
  }
}

// 使用
const csvProcessor = new CSVProcessor();
csvProcessor.process();

const jsonProcessor = new JSONProcessor();
jsonProcessor.process();
```

### 状态模式

允许对象在内部状态改变时改变它的行为。

```javascript
class State {
  constructor(order) {
    this.order = order;
  }
  
  cancel() {
    throw new Error('cancel must be implemented');
  }
  
  pay() {
    throw new Error('pay must be implemented');
  }
  
  ship() {
    throw new Error('ship must be implemented');
  }
}

class PendingState extends State {
  cancel() {
    console.log('Order cancelled');
    this.order.setState(this.order.cancelledState);
  }
  
  pay() {
    console.log('Payment received');
    this.order.setState(this.order.paidState);
  }
  
  ship() {
    console.log('Cannot ship unpaid order');
  }
}

class PaidState extends State {
  cancel() {
    console.log('Refunding payment');
    this.order.setState(this.order.cancelledState);
  }
  
  pay() {
    console.log('Already paid');
  }
  
  ship() {
    console.log('Order shipped');
    this.order.setState(this.order.shippedState);
  }
}

class ShippedState extends State {
  cancel() {
    console.log('Cannot cancel shipped order');
  }
  
  pay() {
    console.log('Already paid');
  }
  
  ship() {
    console.log('Already shipped');
  }
}

class CancelledState extends State {
  cancel() {
    console.log('Already cancelled');
  }
  
  pay() {
    console.log('Cannot pay cancelled order');
  }
  
  ship() {
    console.log('Cannot ship cancelled order');
  }
}

class Order {
  constructor() {
    this.pendingState = new PendingState(this);
    this.paidState = new PaidState(this);
    this.shippedState = new ShippedState(this);
    this.cancelledState = new CancelledState(this);
    
    this.state = this.pendingState;
  }
  
  setState(state) {
    this.state = state;
  }
  
  cancel() {
    this.state.cancel();
  }
  
  pay() {
    this.state.pay();
  }
  
  ship() {
    this.state.ship();
  }
}

// 使用
const order = new Order();
order.pay();    // Payment received
order.ship();   // Order shipped
order.cancel(); // Cannot cancel shipped order
```

## 最佳实践

### 选择合适的设计模式

- **单例模式**：全局唯一实例（配置、缓存、连接池）
- **工厂模式**：创建复杂对象，隐藏创建逻辑
- **观察者模式**：一对多依赖关系（事件系统）
- **策略模式**：算法可替换（表单验证、支付方式）
- **装饰器模式**：动态添加功能（中间件、HOC）
- **代理模式**：控制访问（懒加载、缓存、权限）

### 常见问题

**过度设计**
```javascript
// ❌ 简单功能过度设计
class UserFactory {
  createUser(data) {
    return new User(data);
  }
}

// ✅ 直接创建
const user = new User(data);
```

**模式滥用**
```javascript
// ❌ 不必要的单例
class Logger {
  static instance;
  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}

// ✅ 简单的模块导出
export const logger = {
  log(msg) {
    console.log(msg);
  }
};
```

### 设计原则

1. **单一职责原则（SRP）**：一个类只负责一个功能
2. **开闭原则（OCP）**：对扩展开放，对修改关闭
3. **里氏替换原则（LSP）**：子类可以替换父类
4. **接口隔离原则（ISP）**：使用多个专门接口，而不是单一总接口
5. **依赖倒置原则（DIP）**：依赖抽象而不是具体实现

```javascript
// 开闭原则示例
class Shape {
  area() {
    throw new Error('area must be implemented');
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  
  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  area() {
    return this.width * this.height;
  }
}

// 计算总面积，无需修改此函数即可支持新形状
function calculateTotalArea(shapes) {
  return shapes.reduce((total, shape) => total + shape.area(), 0);
}
```

## 实际应用

### React 中的设计模式

```javascript
// HOC - 装饰器模式
function withAuth(Component) {
  return function AuthComponent(props) {
    const { user } = useAuth();
    if (!user) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}

// Render Props - 策略模式
<DataProvider render={data => (
  <div>{data.name}</div>
)} />

// Context - 单例模式
const ThemeContext = React.createContext();

// Custom Hooks - 组合模式
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
  return { values, errors, handleChange };
}
```

### Vue 中的设计模式

```javascript
// Mixin - 组合模式
const formMixin = {
  data() {
    return {
      formData: {}
    };
  },
  methods: {
    handleSubmit() {
      // 提交逻辑
    }
  }
};

// Plugin - 单例模式
const MyPlugin = {
  install(Vue, options) {
    Vue.prototype.$myMethod = function() {
      // 方法逻辑
    };
  }
};

// Vuex - 单例 + 观察者模式
const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});
```

### Node.js 中的设计模式

```javascript
// 中间件 - 责任链模式
app.use((req, res, next) => {
  console.log('Middleware 1');
  next();
});

// Stream - 迭代器模式
const readStream = fs.createReadStream('file.txt');
readStream.on('data', (chunk) => {
  console.log(chunk);
});

// EventEmitter - 观察者模式
const emitter = new EventEmitter();
emitter.on('event', (data) => {
  console.log(data);
});
```
