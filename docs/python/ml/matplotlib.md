# Matplotlib

## 简介

Matplotlib 是 Python 最流行的数据可视化库，可以创建各种静态、动态和交互式图表。

### 特点

- 支持多种图表类型
- 高度可定制
- 支持多种输出格式
- 与 NumPy 和 Pandas 无缝集成

### 安装

```bash
pip install matplotlib
```

## 基础使用

### 导入 Matplotlib

```python
import matplotlib.pyplot as plt
import numpy as np
```

### 简单绘图

```python
# 创建数据
x = np.linspace(0, 10, 100)
y = np.sin(x)

# 绘制图形
plt.plot(x, y)
plt.show()

# 添加标题和标签
plt.plot(x, y)
plt.title('Sine Wave')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.show()

# 添加网格
plt.plot(x, y)
plt.grid(True)
plt.show()
```

## 图表类型

### 折线图

```python
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

plt.plot(x, y1, label='sin(x)')
plt.plot(x, y2, label='cos(x)')
plt.legend()
plt.show()

# 自定义线条样式
plt.plot(x, y1, 'r--', linewidth=2, label='sin(x)')
plt.plot(x, y2, 'b:', linewidth=2, label='cos(x)')
plt.legend()
plt.show()
```

### 散点图

```python
x = np.random.rand(50)
y = np.random.rand(50)
colors = np.random.rand(50)
sizes = 1000 * np.random.rand(50)

plt.scatter(x, y, c=colors, s=sizes, alpha=0.5)
plt.colorbar()
plt.show()
```

### 柱状图

```python
categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

plt.bar(categories, values)
plt.title('Bar Chart')
plt.show()

# 水平柱状图
plt.barh(categories, values)
plt.show()

# 分组柱状图
x = np.arange(len(categories))
values1 = [23, 45, 56, 78, 32]
values2 = [34, 56, 67, 45, 23]
width = 0.35

plt.bar(x - width/2, values1, width, label='Group 1')
plt.bar(x + width/2, values2, width, label='Group 2')
plt.xticks(x, categories)
plt.legend()
plt.show()
```

### 直方图

```python
data = np.random.randn(1000)

plt.hist(data, bins=30, edgecolor='black')
plt.title('Histogram')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.show()

# 多个直方图
data1 = np.random.randn(1000)
data2 = np.random.randn(1000) + 2

plt.hist(data1, bins=30, alpha=0.5, label='Data 1')
plt.hist(data2, bins=30, alpha=0.5, label='Data 2')
plt.legend()
plt.show()
```

### 饼图

```python
sizes = [15, 30, 45, 10]
labels = ['A', 'B', 'C', 'D']
colors = ['gold', 'yellowgreen', 'lightcoral', 'lightskyblue']
explode = (0.1, 0, 0, 0)  # 突出第一块

plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=90)
plt.axis('equal')
plt.show()
```

### 箱线图

```python
data = [np.random.normal(0, std, 100) for std in range(1, 4)]

plt.boxplot(data, labels=['A', 'B', 'C'])
plt.title('Box Plot')
plt.show()
```

### 热力图

```python
data = np.random.rand(10, 10)

plt.imshow(data, cmap='hot', interpolation='nearest')
plt.colorbar()
plt.title('Heatmap')
plt.show()
```

### 等高线图

```python
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

plt.contour(X, Y, Z, levels=20)
plt.colorbar()
plt.title('Contour Plot')
plt.show()

# 填充等高线图
plt.contourf(X, Y, Z, levels=20, cmap='viridis')
plt.colorbar()
plt.show()
```

## 子图

### 创建子图

```python
# 方法1：subplot
fig = plt.figure(figsize=(10, 5))

plt.subplot(1, 2, 1)
plt.plot([1, 2, 3], [1, 4, 9])
plt.title('Plot 1')

plt.subplot(1, 2, 2)
plt.plot([1, 2, 3], [1, 2, 3])
plt.title('Plot 2')

plt.tight_layout()
plt.show()

# 方法2：subplots
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot([1, 2, 3], [1, 4, 9])
axes[0, 0].set_title('Plot 1')

axes[0, 1].scatter([1, 2, 3], [1, 4, 9])
axes[0, 1].set_title('Plot 2')

axes[1, 0].bar([1, 2, 3], [1, 4, 9])
axes[1, 0].set_title('Plot 3')

axes[1, 1].hist(np.random.randn(100))
axes[1, 1].set_title('Plot 4')

plt.tight_layout()
plt.show()
```

## 样式定制

### 颜色和线型

```python
x = np.linspace(0, 10, 100)

# 颜色
plt.plot(x, np.sin(x), 'r')  # 红色
plt.plot(x, np.cos(x), color='blue')  # 蓝色
plt.plot(x, np.sin(x) + 1, color='#FF5733')  # 十六进制颜色
plt.show()

# 线型
plt.plot(x, np.sin(x), '-')   # 实线
plt.plot(x, np.cos(x), '--')  # 虚线
plt.plot(x, np.sin(x) + 1, ':')   # 点线
plt.plot(x, np.cos(x) + 1, '-.')  # 点划线
plt.show()

# 标记
plt.plot(x[::10], np.sin(x[::10]), 'o')  # 圆圈
plt.plot(x[::10], np.cos(x[::10]), 's')  # 方块
plt.plot(x[::10], np.sin(x[::10]) + 1, '^')  # 三角形
plt.show()
```

### 字体和文本

```python
plt.rcParams['font.sans-serif'] = ['SimHei']  # 中文字体
plt.rcParams['axes.unicode_minus'] = False  # 负号显示

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)
plt.title('正弦波', fontsize=16, fontweight='bold')
plt.xlabel('X 轴', fontsize=12)
plt.ylabel('Y 轴', fontsize=12)

# 添加文本
plt.text(5, 0, '中点', fontsize=12, ha='center')

# 添加注释
plt.annotate('最大值', xy=(np.pi/2, 1), xytext=(3, 1.5),
            arrowprops=dict(arrowstyle='->', color='red'))

plt.show()
```

### 图例

```python
x = np.linspace(0, 10, 100)

plt.plot(x, np.sin(x), label='sin(x)')
plt.plot(x, np.cos(x), label='cos(x)')

# 图例位置
plt.legend(loc='upper right')  # 右上角
# plt.legend(loc='best')  # 最佳位置
# plt.legend(loc='lower left')  # 左下角

plt.show()
```

### 坐标轴

```python
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)

# 设置坐标轴范围
plt.xlim(0, 10)
plt.ylim(-1.5, 1.5)

# 设置坐标轴刻度
plt.xticks([0, 2, 4, 6, 8, 10])
plt.yticks([-1, 0, 1])

# 设置坐标轴标签
plt.xticks([0, np.pi, 2*np.pi], ['0', 'π', '2π'])

plt.show()
```

## 3D 绘图

```python
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# 3D 散点图
x = np.random.rand(100)
y = np.random.rand(100)
z = np.random.rand(100)

ax.scatter(x, y, z)
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')
plt.show()

# 3D 曲面图
x = np.linspace(-5, 5, 50)
y = np.linspace(-5, 5, 50)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.plot_surface(X, Y, Z, cmap='viridis')
plt.show()
```

## 保存图形

```python
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.plot(x, y)

# 保存为 PNG
plt.savefig('plot.png', dpi=300, bbox_inches='tight')

# 保存为 PDF
plt.savefig('plot.pdf')

# 保存为 SVG
plt.savefig('plot.svg')

plt.show()
```

## 样式主题

```python
# 查看可用样式
print(plt.style.available)

# 使用样式
plt.style.use('ggplot')
# plt.style.use('seaborn')
# plt.style.use('dark_background')

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
```

## 动画

```python
from matplotlib.animation import FuncAnimation

fig, ax = plt.subplots()
x = np.linspace(0, 2*np.pi, 100)
line, = ax.plot(x, np.sin(x))

def update(frame):
    line.set_ydata(np.sin(x + frame/10))
    return line,

ani = FuncAnimation(fig, update, frames=100, interval=50, blit=True)
plt.show()

# 保存动画
# ani.save('animation.gif', writer='pillow')
```

## 最佳实践

1. **使用面向对象接口** - 更灵活的控制
2. **设置合适的 DPI** - 保存高质量图片
3. **使用 tight_layout** - 自动调整子图间距
4. **选择合适的颜色映射** - 提高可读性
5. **添加标题和标签** - 提高图表可理解性

## 常见问题

### 1. 中文显示问题

```python
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False
```

### 2. 图形不显示

```python
# 确保调用 plt.show()
plt.plot([1, 2, 3])
plt.show()

# 或在 Jupyter 中使用
%matplotlib inline
```

### 3. 内存泄漏

```python
# 关闭图形
plt.close()

# 关闭所有图形
plt.close('all')
```

## 参考资源

- [Matplotlib 官方文档](https://matplotlib.org/stable/contents.html)
- [Matplotlib 画廊](https://matplotlib.org/stable/gallery/index.html)
- [Matplotlib 教程](https://matplotlib.org/stable/tutorials/index.html)
