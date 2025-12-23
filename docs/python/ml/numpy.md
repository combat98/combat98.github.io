# NumPy

## 简介

NumPy（Numerical Python）是 Python 科学计算的基础包，提供了多维数组对象和各种派生对象，以及用于数组快速操作的各种函数。

### 特点

- 强大的 N 维数组对象 ndarray
- 广播功能函数
- 整合 C/C++/Fortran 代码的工具
- 线性代数、傅里叶变换、随机数生成等功能

### 安装

```bash
pip install numpy
```

## 基础使用

### 导入 NumPy

```python
import numpy as np
```

### 创建数组

```python
# 从列表创建
arr1 = np.array([1, 2, 3, 4, 5])
print(arr1)  # [1 2 3 4 5]

# 创建二维数组
arr2 = np.array([[1, 2, 3], [4, 5, 6]])
print(arr2)
# [[1 2 3]
#  [4 5 6]]

# 创建全零数组
zeros = np.zeros((3, 4))
print(zeros)

# 创建全一数组
ones = np.ones((2, 3))
print(ones)

# 创建指定值数组
full = np.full((2, 2), 7)
print(full)  # [[7 7] [7 7]]

# 创建单位矩阵
identity = np.eye(3)
print(identity)

# 创建等差数列
arange = np.arange(0, 10, 2)  # 从0到10，步长为2
print(arange)  # [0 2 4 6 8]

# 创建等间隔数列
linspace = np.linspace(0, 1, 5)  # 从0到1，生成5个数
print(linspace)  # [0.   0.25 0.5  0.75 1.  ]

# 创建随机数组
random = np.random.random((2, 3))
print(random)

# 创建随机整数数组
randint = np.random.randint(0, 10, (3, 3))
print(randint)
```

### 数组属性

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])

# 数组维度
print(arr.ndim)  # 2

# 数组形状
print(arr.shape)  # (2, 3)

# 数组大小
print(arr.size)  # 6

# 数据类型
print(arr.dtype)  # int64

# 每个元素的字节大小
print(arr.itemsize)  # 8
```

## 数组操作

### 索引和切片

```python
arr = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

# 索引
print(arr[0])  # 0
print(arr[-1])  # 9

# 切片
print(arr[2:5])  # [2 3 4]
print(arr[:5])   # [0 1 2 3 4]
print(arr[5:])   # [5 6 7 8 9]
print(arr[::2])  # [0 2 4 6 8]

# 二维数组索引
arr2d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(arr2d[0, 0])  # 1
print(arr2d[1, 2])  # 6

# 二维数组切片
print(arr2d[:2, 1:])
# [[2 3]
#  [5 6]]

# 布尔索引
arr = np.array([1, 2, 3, 4, 5])
mask = arr > 3
print(arr[mask])  # [4 5]
print(arr[arr > 3])  # [4 5]

# 花式索引
arr = np.array([10, 20, 30, 40, 50])
indices = [0, 2, 4]
print(arr[indices])  # [10 30 50]
```

### 数组变形

```python
arr = np.arange(12)

# 改变形状
reshaped = arr.reshape(3, 4)
print(reshaped)

# 展平数组
flattened = reshaped.flatten()
print(flattened)

# 转置
transposed = reshaped.T
print(transposed)

# 添加维度
expanded = np.expand_dims(arr, axis=0)
print(expanded.shape)  # (1, 12)

# 压缩维度
squeezed = np.squeeze(expanded)
print(squeezed.shape)  # (12,)
```

### 数组拼接

```python
arr1 = np.array([[1, 2], [3, 4]])
arr2 = np.array([[5, 6], [7, 8]])

# 垂直拼接
vstack = np.vstack((arr1, arr2))
print(vstack)
# [[1 2]
#  [3 4]
#  [5 6]
#  [7 8]]

# 水平拼接
hstack = np.hstack((arr1, arr2))
print(hstack)
# [[1 2 5 6]
#  [3 4 7 8]]

# 按轴拼接
concatenate = np.concatenate((arr1, arr2), axis=0)
print(concatenate)
```

### 数组分割

```python
arr = np.arange(16).reshape(4, 4)

# 垂直分割
vsplit = np.vsplit(arr, 2)
print(vsplit)

# 水平分割
hsplit = np.hsplit(arr, 2)
print(hsplit)

# 按轴分割
split = np.split(arr, 2, axis=0)
print(split)
```

## 数学运算

### 基本运算

```python
arr1 = np.array([1, 2, 3, 4])
arr2 = np.array([5, 6, 7, 8])

# 加法
print(arr1 + arr2)  # [ 6  8 10 12]
print(np.add(arr1, arr2))

# 减法
print(arr1 - arr2)  # [-4 -4 -4 -4]
print(np.subtract(arr1, arr2))

# 乘法
print(arr1 * arr2)  # [ 5 12 21 32]
print(np.multiply(arr1, arr2))

# 除法
print(arr2 / arr1)  # [5.  3.  2.33 2.]
print(np.divide(arr2, arr1))

# 幂运算
print(arr1 ** 2)  # [ 1  4  9 16]
print(np.power(arr1, 2))

# 取余
print(arr2 % arr1)  # [0 0 1 0]

# 标量运算
print(arr1 + 10)  # [11 12 13 14]
print(arr1 * 2)   # [2 4 6 8]
```

### 统计函数

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])

# 求和
print(np.sum(arr))  # 21
print(np.sum(arr, axis=0))  # [5 7 9]
print(np.sum(arr, axis=1))  # [ 6 15]

# 平均值
print(np.mean(arr))  # 3.5
print(np.mean(arr, axis=0))  # [2.5 3.5 4.5]

# 中位数
print(np.median(arr))  # 3.5

# 标准差
print(np.std(arr))  # 1.707825127659933

# 方差
print(np.var(arr))  # 2.9166666666666665

# 最大值和最小值
print(np.max(arr))  # 6
print(np.min(arr))  # 1

# 最大值和最小值的索引
print(np.argmax(arr))  # 5
print(np.argmin(arr))  # 0

# 累积和
print(np.cumsum(arr))  # [ 1  3  6 10 15 21]

# 累积积
print(np.cumprod(arr))  # [  1   2   6  24 120 720]
```

### 数学函数

```python
arr = np.array([1, 2, 3, 4])

# 三角函数
print(np.sin(arr))
print(np.cos(arr))
print(np.tan(arr))

# 指数和对数
print(np.exp(arr))  # 指数
print(np.log(arr))  # 自然对数
print(np.log10(arr))  # 以10为底的对数

# 开方
print(np.sqrt(arr))  # [1. 1.414 1.732 2.]

# 绝对值
arr_neg = np.array([-1, -2, 3, -4])
print(np.abs(arr_neg))  # [1 2 3 4]

# 四舍五入
arr_float = np.array([1.2, 2.5, 3.7, 4.1])
print(np.round(arr_float))  # [1. 2. 4. 4.]
print(np.floor(arr_float))  # [1. 2. 3. 4.]
print(np.ceil(arr_float))   # [2. 3. 4. 5.]
```

## 线性代数

```python
# 矩阵乘法
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# 点积
dot = np.dot(A, B)
print(dot)
# [[19 22]
#  [43 50]]

# 或使用 @ 运算符
print(A @ B)

# 矩阵转置
print(A.T)

# 矩阵的迹
print(np.trace(A))  # 5

# 行列式
print(np.linalg.det(A))  # -2.0

# 矩阵的逆
inv = np.linalg.inv(A)
print(inv)

# 特征值和特征向量
eigenvalues, eigenvectors = np.linalg.eig(A)
print("特征值:", eigenvalues)
print("特征向量:", eigenvectors)

# 求解线性方程组 Ax = b
A = np.array([[3, 1], [1, 2]])
b = np.array([9, 8])
x = np.linalg.solve(A, b)
print(x)  # [2. 3.]
```

## 广播机制

```python
# 标量与数组
arr = np.array([1, 2, 3])
print(arr + 10)  # [11 12 13]

# 一维数组与二维数组
arr1 = np.array([[1, 2, 3], [4, 5, 6]])
arr2 = np.array([10, 20, 30])
print(arr1 + arr2)
# [[11 22 33]
#  [14 25 36]]

# 不同形状的数组
arr1 = np.array([[1], [2], [3]])  # (3, 1)
arr2 = np.array([10, 20, 30])     # (3,)
print(arr1 + arr2)
# [[11 21 31]
#  [12 22 32]
#  [13 23 33]]
```

## 随机数生成

```python
# 设置随机种子
np.random.seed(42)

# 生成随机浮点数 [0, 1)
print(np.random.random(5))

# 生成随机整数
print(np.random.randint(0, 10, 5))

# 正态分布
print(np.random.randn(5))  # 标准正态分布
print(np.random.normal(0, 1, 5))  # 指定均值和标准差

# 均匀分布
print(np.random.uniform(0, 10, 5))

# 从数组中随机选择
arr = np.array([1, 2, 3, 4, 5])
print(np.random.choice(arr, 3))

# 打乱数组
np.random.shuffle(arr)
print(arr)
```

## 文件操作

```python
# 保存数组
arr = np.array([1, 2, 3, 4, 5])
np.save('array.npy', arr)

# 加载数组
loaded = np.load('array.npy')
print(loaded)

# 保存多个数组
arr1 = np.array([1, 2, 3])
arr2 = np.array([4, 5, 6])
np.savez('arrays.npz', a=arr1, b=arr2)

# 加载多个数组
data = np.load('arrays.npz')
print(data['a'])
print(data['b'])

# 保存为文本文件
np.savetxt('array.txt', arr)

# 从文本文件加载
loaded_txt = np.loadtxt('array.txt')
print(loaded_txt)
```

## 最佳实践

1. **使用向量化操作** - 避免使用 Python 循环
2. **合理使用数据类型** - 节省内存
3. **利用广播机制** - 简化代码
4. **使用视图而非副本** - 提高性能
5. **合理使用内存布局** - C 顺序或 Fortran 顺序

## 常见问题

### 1. 数组复制

```python
# 浅复制（视图）
arr = np.array([1, 2, 3])
view = arr.view()
view[0] = 100
print(arr)  # [100   2   3]

# 深复制
copy = arr.copy()
copy[0] = 200
print(arr)  # [100   2   3]
```

### 2. 数组比较

```python
arr1 = np.array([1, 2, 3])
arr2 = np.array([1, 2, 3])

# 元素级比较
print(arr1 == arr2)  # [ True  True  True]

# 数组相等
print(np.array_equal(arr1, arr2))  # True
```

## 参考资源

- [NumPy 官方文档](https://numpy.org/doc/)
- [NumPy 中文文档](https://www.numpy.org.cn/)
- [NumPy 教程](https://numpy.org/doc/stable/user/quickstart.html)
