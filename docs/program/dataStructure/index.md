---
next:
  text: '设计模式'
  link: '/program/design/index'
---

# 数据结构与算法

## 数据结构

### 数组

数组是最基本的数据结构，元素在内存中连续存储。

**特点：**
- 随机访问：O(1)
- 插入/删除：O(n)
- 查找：O(n)（未排序），O(log n)（已排序）

**常见操作：**

```javascript
// 创建数组
const arr = [1, 2, 3, 4, 5];

// 访问元素
arr[0];  // 1

// 添加元素
arr.push(6);      // 末尾添加
arr.unshift(0);   // 开头添加

// 删除元素
arr.pop();        // 删除末尾
arr.shift();      // 删除开头
arr.splice(2, 1); // 删除指定位置

// 查找元素
arr.indexOf(3);   // 2
arr.includes(3);  // true

// 遍历
arr.forEach(item => console.log(item));
arr.map(item => item * 2);
arr.filter(item => item > 2);
```

**经典问题：**
- 两数之和
- 三数之和
- 数组去重
- 最大子数组和
- 旋转数组

### 字符串

字符串是字符数组的特殊形式。

**常见操作：**

```javascript
const str = "Hello World";

// 长度
str.length;  // 11

// 访问字符
str[0];           // 'H'
str.charAt(0);    // 'H'

// 查找
str.indexOf('o');      // 4
str.includes('World'); // true

// 截取
str.substring(0, 5);   // 'Hello'
str.slice(0, 5);       // 'Hello'

// 分割
str.split(' ');        // ['Hello', 'World']

// 替换
str.replace('World', 'JavaScript');

// 大小写
str.toLowerCase();
str.toUpperCase();

// 去空格
str.trim();
```

**经典问题：**
- 反转字符串
- 回文判断
- 最长公共前缀
- 字符串匹配（KMP算法）
- 最长回文子串

### 队列

队列是先进先出（FIFO）的数据结构。

**实现：**

```javascript
class Queue {
  constructor() {
    this.items = [];
  }
  
  // 入队
  enqueue(element) {
    this.items.push(element);
  }
  
  // 出队
  dequeue() {
    return this.items.shift();
  }
  
  // 查看队首
  front() {
    return this.items[0];
  }
  
  // 是否为空
  isEmpty() {
    return this.items.length === 0;
  }
  
  // 队列大小
  size() {
    return this.items.length;
  }
}
```

**应用场景：**
- 广度优先搜索（BFS）
- 任务调度
- 消息队列
- 打印队列

### 栈

栈是后进先出（LIFO）的数据结构。

**实现：**

```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  // 入栈
  push(element) {
    this.items.push(element);
  }
  
  // 出栈
  pop() {
    return this.items.pop();
  }
  
  // 查看栈顶
  peek() {
    return this.items[this.items.length - 1];
  }
  
  // 是否为空
  isEmpty() {
    return this.items.length === 0;
  }
  
  // 栈大小
  size() {
    return this.items.length;
  }
}
```

**应用场景：**
- 函数调用栈
- 表达式求值
- 括号匹配
- 深度优先搜索（DFS）
- 浏览器历史记录

**经典问题：**
- 有效的括号
- 最小栈
- 逆波兰表达式求值

### 链表

链表是由节点组成的线性集合，每个节点包含数据和指向下一个节点的指针。

**单链表实现：**

```javascript
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  // 添加节点
  append(val) {
    const newNode = new ListNode(val);
    
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }
  
  // 插入节点
  insert(val, index) {
    if (index < 0 || index > this.size) return false;
    
    const newNode = new ListNode(val);
    
    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      let current = this.head;
      let prev = null;
      let i = 0;
      
      while (i < index) {
        prev = current;
        current = current.next;
        i++;
      }
      
      newNode.next = current;
      prev.next = newNode;
    }
    this.size++;
    return true;
  }
  
  // 删除节点
  remove(index) {
    if (index < 0 || index >= this.size) return null;
    
    let current = this.head;
    
    if (index === 0) {
      this.head = current.next;
    } else {
      let prev = null;
      let i = 0;
      
      while (i < index) {
        prev = current;
        current = current.next;
        i++;
      }
      
      prev.next = current.next;
    }
    
    this.size--;
    return current.val;
  }
}
```

**经典问题：**
- 反转链表
- 合并两个有序链表
- 环形链表检测
- 链表中点
- 删除链表倒数第N个节点

### 集合

集合是不包含重复元素的数据结构。

```javascript
// 使用 Set
const set = new Set();

set.add(1);
set.add(2);
set.add(2);  // 不会添加重复元素

set.has(1);  // true
set.delete(1);
set.size;    // 1

// 集合运算
const setA = new Set([1, 2, 3]);
const setB = new Set([2, 3, 4]);

// 并集
const union = new Set([...setA, ...setB]);

// 交集
const intersection = new Set([...setA].filter(x => setB.has(x)));

// 差集
const difference = new Set([...setA].filter(x => !setB.has(x)));
```

### 哈希表

哈希表通过哈希函数将键映射到值，提供快速的查找、插入和删除操作。

```javascript
// 使用 Map
const map = new Map();

map.set('name', 'Alice');
map.set('age', 25);

map.get('name');  // 'Alice'
map.has('name');  // true
map.delete('age');
map.size;         // 1

// 遍历
map.forEach((value, key) => {
  console.log(key, value);
});

// 使用对象作为哈希表
const hash = {};
hash['key'] = 'value';
```

**应用场景：**
- 缓存
- 数据库索引
- 去重
- 统计频率

**经典问题：**
- 两数之和
- 字母异位词分组
- 最长连续序列

### 二叉树

二叉树是每个节点最多有两个子节点的树结构。

**实现：**

```javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  
  // 前序遍历（根-左-右）
  preorder(node = this.root, result = []) {
    if (node) {
      result.push(node.val);
      this.preorder(node.left, result);
      this.preorder(node.right, result);
    }
    return result;
  }
  
  // 中序遍历（左-根-右）
  inorder(node = this.root, result = []) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.val);
      this.inorder(node.right, result);
    }
    return result;
  }
  
  // 后序遍历（左-右-根）
  postorder(node = this.root, result = []) {
    if (node) {
      this.postorder(node.left, result);
      this.postorder(node.right, result);
      result.push(node.val);
    }
    return result;
  }
  
  // 层序遍历
  levelOrder() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length) {
      const level = [];
      const size = queue.length;
      
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        level.push(node.val);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      
      result.push(level);
    }
    
    return result;
  }
}
```

**经典问题：**
- 二叉树的最大深度
- 翻转二叉树
- 对称二叉树
- 路径总和
- 二叉搜索树验证

## 算法

### 排序

**冒泡排序 - O(n²)**

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

**快速排序 - O(n log n)**

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

**归并排序 - O(n log n)**

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

### 双指针

双指针技巧用于处理数组和链表问题。

```javascript
// 两数之和（有序数组）
function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1];
}

// 反转字符串
function reverseString(s) {
  let left = 0, right = s.length - 1;
  
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  
  return s;
}
```

### 查找

**二分查找 - O(log n)**

```javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}
```

### 分治

分治算法将问题分解为更小的子问题。

```javascript
// 最大子数组和
function maxSubArray(nums) {
  if (nums.length === 1) return nums[0];
  
  const mid = Math.floor(nums.length / 2);
  const leftMax = maxSubArray(nums.slice(0, mid));
  const rightMax = maxSubArray(nums.slice(mid));
  const crossMax = maxCrossingSum(nums, mid);
  
  return Math.max(leftMax, rightMax, crossMax);
}
```

### 动态规划

动态规划通过保存子问题的解来避免重复计算。

```javascript
// 斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 爬楼梯
function climbStairs(n) {
  if (n <= 2) return n;
  
  const dp = [0, 1, 2];
  
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 最长公共子序列
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}
```

### 递归

递归是函数调用自身的编程技巧。

```javascript
// 阶乘
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// 二叉树深度
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

### 回溯

回溯算法通过尝试所有可能的解来找到答案。

```javascript
// 全排列
function permute(nums) {
  const result = [];
  
  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    
    for (let num of nums) {
      if (path.includes(num)) continue;
      path.push(num);
      backtrack(path);
      path.pop();
    }
  }
  
  backtrack([]);
  return result;
}

// N皇后
function solveNQueens(n) {
  const result = [];
  const board = Array(n).fill(0).map(() => Array(n).fill('.'));
  
  function isValid(row, col) {
    // 检查列
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    
    // 检查左上对角线
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    
    // 检查右上对角线
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    
    return true;
  }
  
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(row => row.join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (!isValid(row, col)) continue;
      
      board[row][col] = 'Q';
      backtrack(row + 1);
      board[row][col] = '.';
    }
  }
  
  backtrack(0);
  return result;
}
```

### 贪心

贪心算法在每一步选择当前最优解。

```javascript
// 零钱兑换（贪心）
function coinChange(coins, amount) {
  coins.sort((a, b) => b - a);
  let count = 0;
  
  for (let coin of coins) {
    while (amount >= coin) {
      amount -= coin;
      count++;
    }
  }
  
  return amount === 0 ? count : -1;
}

// 跳跃游戏
function canJump(nums) {
  let maxReach = 0;
  
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  
  return true;
}
```

### 位运算

位运算直接操作二进制位。

```javascript
// 常用位运算
n & 1;           // 判断奇偶
n & (n - 1);     // 清除最低位的1
n | (1 << i);    // 设置第i位为1
n & ~(1 << i);   // 清除第i位
n ^ n;           // 结果为0
n ^ 0;           // 结果为n

// 只出现一次的数字
function singleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num;
  }
  return result;
}

// 计算二进制中1的个数
function hammingWeight(n) {
  let count = 0;
  while (n) {
    n &= (n - 1);
    count++;
  }
  return count;
}
```

### DFS（深度优先搜索）

```javascript
// 二叉树DFS
function dfs(root) {
  if (!root) return;
  
  console.log(root.val);
  dfs(root.left);
  dfs(root.right);
}

// 图DFS
function dfsGraph(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (let neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfsGraph(graph, neighbor, visited);
    }
  }
}
```

### BFS（广度优先搜索）

```javascript
// 二叉树BFS
function bfs(root) {
  if (!root) return;
  
  const queue = [root];
  
  while (queue.length) {
    const node = queue.shift();
    console.log(node.val);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}

// 图BFS
function bfsGraph(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  
  while (queue.length) {
    const node = queue.shift();
    console.log(node);
    
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
```

### 图

图是由顶点和边组成的数据结构。

```javascript
// 邻接表表示
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  
  addEdge(v1, v2) {
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1);
  }
  
  removeEdge(v1, v2) {
    this.adjacencyList[v1] = this.adjacencyList[v1].filter(v => v !== v2);
    this.adjacencyList[v2] = this.adjacencyList[v2].filter(v => v !== v1);
  }
  
  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }
}
```

**经典问题：**
- 岛屿数量
- 课程表（拓扑排序）
- 最短路径（Dijkstra算法）
- 最小生成树（Prim、Kruskal算法）

## 安全算法

### 哈希算法

```javascript
// MD5、SHA-1、SHA-256等
// 用于数据完整性验证、密码存储

// 使用 crypto 模块（Node.js）
const crypto = require('crypto');

const hash = crypto.createHash('sha256');
hash.update('password');
const hashed = hash.digest('hex');
```

### 加密算法

**对称加密：** AES、DES
**非对称加密：** RSA、ECC

```javascript
// AES 加密示例
const crypto = require('crypto');

function encrypt(text, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 数字签名

用于验证数据的真实性和完整性。

```javascript
// RSA 签名示例
const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// 签名
const sign = crypto.createSign('SHA256');
sign.update('data');
const signature = sign.sign(privateKey, 'hex');

// 验证
const verify = crypto.createVerify('SHA256');
verify.update('data');
const isValid = verify.verify(publicKey, signature, 'hex');
```

## 时间复杂度对比

| 复杂度 | 名称 | 示例 |
|--------|------|------|
| O(1) | 常数 | 数组访问 |
| O(log n) | 对数 | 二分查找 |
| O(n) | 线性 | 遍历数组 |
| O(n log n) | 线性对数 | 快速排序、归并排序 |
| O(n²) | 平方 | 冒泡排序、选择排序 |
| O(2ⁿ) | 指数 | 递归斐波那契 |
| O(n!) | 阶乘 | 全排列 |
