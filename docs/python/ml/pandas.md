# Pandas

## 简介

Pandas 是基于 NumPy 的数据分析库，提供了高效的数据结构和数据分析工具。

### 特点

- 快速高效的 DataFrame 对象
- 读写多种格式数据（CSV、Excel、SQL、JSON 等）
- 数据对齐和缺失数据处理
- 数据重塑和透视
- 强大的分组和聚合功能
- 时间序列功能

### 安装

```bash
pip install pandas
```

## 基础使用

### 导入 Pandas

```python
import pandas as pd
import numpy as np
```

### Series

Series 是一维标记数组，可以保存任何数据类型。

```python
# 从列表创建
s = pd.Series([1, 2, 3, 4, 5])
print(s)

# 指定索引
s = pd.Series([1, 2, 3], index=['a', 'b', 'c'])
print(s)

# 从字典创建
data = {'a': 1, 'b': 2, 'c': 3}
s = pd.Series(data)
print(s)

# 访问元素
print(s['a'])  # 1
print(s[0])    # 1

# 切片
print(s['a':'c'])
```

### DataFrame

DataFrame 是二维标记数据结构，类似于电子表格或 SQL 表。

```python
# 从字典创建
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['Beijing', 'Shanghai', 'Guangzhou']
}
df = pd.DataFrame(data)
print(df)

# 指定索引
df = pd.DataFrame(data, index=['row1', 'row2', 'row3'])
print(df)

# 从列表创建
data = [
    ['Alice', 25, 'Beijing'],
    ['Bob', 30, 'Shanghai'],
    ['Charlie', 35, 'Guangzhou']
]
df = pd.DataFrame(data, columns=['name', 'age', 'city'])
print(df)

# 从 NumPy 数组创建
arr = np.array([[1, 2, 3], [4, 5, 6]])
df = pd.DataFrame(arr, columns=['A', 'B', 'C'])
print(df)
```

## 数据查看

```python
df = pd.DataFrame({
    'A': [1, 2, 3, 4, 5],
    'B': [10, 20, 30, 40, 50],
    'C': ['a', 'b', 'c', 'd', 'e']
})

# 查看前几行
print(df.head())  # 默认前5行
print(df.head(3))  # 前3行

# 查看后几行
print(df.tail())

# 查看数据信息
print(df.info())

# 查看统计信息
print(df.describe())

# 查看形状
print(df.shape)  # (5, 3)

# 查看列名
print(df.columns)

# 查看索引
print(df.index)

# 查看数据类型
print(df.dtypes)
```

## 数据选择

### 列选择

```python
# 选择单列
print(df['A'])
print(df.A)

# 选择多列
print(df[['A', 'C']])

# 添加新列
df['D'] = df['A'] + df['B']
print(df)

# 删除列
df = df.drop('D', axis=1)
print(df)
```

### 行选择

```python
# 使用 loc（基于标签）
print(df.loc[0])  # 第一行
print(df.loc[0:2])  # 前三行
print(df.loc[0:2, ['A', 'C']])  # 指定行和列

# 使用 iloc（基于位置）
print(df.iloc[0])  # 第一行
print(df.iloc[0:3])  # 前三行
print(df.iloc[0:3, [0, 2]])  # 指定行和列

# 条件选择
print(df[df['A'] > 2])
print(df[(df['A'] > 2) & (df['B'] < 50)])
print(df[df['C'].isin(['a', 'c'])])
```

## 数据操作

### 排序

```python
# 按值排序
df_sorted = df.sort_values('A', ascending=False)
print(df_sorted)

# 按多列排序
df_sorted = df.sort_values(['A', 'B'], ascending=[True, False])
print(df_sorted)

# 按索引排序
df_sorted = df.sort_index()
print(df_sorted)
```

### 缺失值处理

```python
df = pd.DataFrame({
    'A': [1, 2, np.nan, 4],
    'B': [5, np.nan, np.nan, 8],
    'C': [9, 10, 11, 12]
})

# 检查缺失值
print(df.isnull())
print(df.isnull().sum())

# 删除缺失值
df_dropped = df.dropna()  # 删除包含缺失值的行
df_dropped = df.dropna(axis=1)  # 删除包含缺失值的列

# 填充缺失值
df_filled = df.fillna(0)  # 用0填充
df_filled = df.fillna(df.mean())  # 用均值填充
df_filled = df.fillna(method='ffill')  # 前向填充
df_filled = df.fillna(method='bfill')  # 后向填充
```

### 重复值处理

```python
df = pd.DataFrame({
    'A': [1, 2, 2, 3, 3],
    'B': [4, 5, 5, 6, 6]
})

# 检查重复值
print(df.duplicated())

# 删除重复值
df_unique = df.drop_duplicates()
print(df_unique)

# 保留最后一个重复值
df_unique = df.drop_duplicates(keep='last')
```

## 数据合并

### 连接（Concat）

```python
df1 = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})
df2 = pd.DataFrame({'A': [5, 6], 'B': [7, 8]})

# 垂直连接
result = pd.concat([df1, df2])
print(result)

# 水平连接
result = pd.concat([df1, df2], axis=1)
print(result)

# 忽略索引
result = pd.concat([df1, df2], ignore_index=True)
print(result)
```

### 合并（Merge）

```python
df1 = pd.DataFrame({
    'key': ['A', 'B', 'C'],
    'value1': [1, 2, 3]
})

df2 = pd.DataFrame({
    'key': ['A', 'B', 'D'],
    'value2': [4, 5, 6]
})

# 内连接
result = pd.merge(df1, df2, on='key', how='inner')
print(result)

# 左连接
result = pd.merge(df1, df2, on='key', how='left')
print(result)

# 右连接
result = pd.merge(df1, df2, on='key', how='right')
print(result)

# 外连接
result = pd.merge(df1, df2, on='key', how='outer')
print(result)
```

### 连接（Join）

```python
df1 = pd.DataFrame({'A': [1, 2, 3]}, index=['a', 'b', 'c'])
df2 = pd.DataFrame({'B': [4, 5, 6]}, index=['a', 'b', 'd'])

# 左连接
result = df1.join(df2, how='left')
print(result)
```

## 分组和聚合

```python
df = pd.DataFrame({
    'Category': ['A', 'B', 'A', 'B', 'A'],
    'Value1': [1, 2, 3, 4, 5],
    'Value2': [10, 20, 30, 40, 50]
})

# 分组求和
grouped = df.groupby('Category').sum()
print(grouped)

# 分组求平均
grouped = df.groupby('Category').mean()
print(grouped)

# 多个聚合函数
grouped = df.groupby('Category').agg({
    'Value1': 'sum',
    'Value2': 'mean'
})
print(grouped)

# 多个聚合函数应用于同一列
grouped = df.groupby('Category')['Value1'].agg(['sum', 'mean', 'max'])
print(grouped)

# 自定义聚合函数
grouped = df.groupby('Category')['Value1'].agg(lambda x: x.max() - x.min())
print(grouped)
```

## 数据透视

```python
df = pd.DataFrame({
    'Date': ['2024-01', '2024-01', '2024-02', '2024-02'],
    'City': ['Beijing', 'Shanghai', 'Beijing', 'Shanghai'],
    'Sales': [100, 200, 150, 250]
})

# 数据透视表
pivot = df.pivot_table(
    values='Sales',
    index='Date',
    columns='City',
    aggfunc='sum'
)
print(pivot)

# 交叉表
crosstab = pd.crosstab(df['Date'], df['City'], values=df['Sales'], aggfunc='sum')
print(crosstab)
```

## 文件操作

### CSV 文件

```python
# 读取 CSV
df = pd.read_csv('data.csv')
df = pd.read_csv('data.csv', encoding='utf-8')
df = pd.read_csv('data.csv', sep=';')  # 指定分隔符

# 写入 CSV
df.to_csv('output.csv', index=False)
df.to_csv('output.csv', encoding='utf-8-sig')  # 支持中文
```

### Excel 文件

```python
# 读取 Excel
df = pd.read_excel('data.xlsx')
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# 写入 Excel
df.to_excel('output.xlsx', index=False)
df.to_excel('output.xlsx', sheet_name='Data')

# 写入多个 sheet
with pd.ExcelWriter('output.xlsx') as writer:
    df1.to_excel(writer, sheet_name='Sheet1')
    df2.to_excel(writer, sheet_name='Sheet2')
```

### JSON 文件

```python
# 读取 JSON
df = pd.read_json('data.json')

# 写入 JSON
df.to_json('output.json', orient='records')
```

### SQL 数据库

```python
import sqlite3

# 连接数据库
conn = sqlite3.connect('database.db')

# 读取数据
df = pd.read_sql('SELECT * FROM table_name', conn)

# 写入数据
df.to_sql('table_name', conn, if_exists='replace', index=False)

conn.close()
```

## 时间序列

```python
# 创建日期范围
dates = pd.date_range('2024-01-01', periods=10, freq='D')
print(dates)

# 创建时间序列
ts = pd.Series(np.random.randn(10), index=dates)
print(ts)

# 日期解析
df = pd.DataFrame({
    'date': ['2024-01-01', '2024-01-02', '2024-01-03'],
    'value': [1, 2, 3]
})
df['date'] = pd.to_datetime(df['date'])
print(df.dtypes)

# 设置日期索引
df = df.set_index('date')
print(df)

# 重采样
ts = pd.Series(np.random.randn(100), 
               index=pd.date_range('2024-01-01', periods=100, freq='D'))
monthly = ts.resample('M').mean()
print(monthly)

# 时间偏移
df['next_day'] = df.index + pd.Timedelta(days=1)
df['next_month'] = df.index + pd.DateOffset(months=1)
```

## 数据可视化

```python
import matplotlib.pyplot as plt

df = pd.DataFrame({
    'A': [1, 2, 3, 4, 5],
    'B': [2, 4, 6, 8, 10],
    'C': [1, 3, 5, 7, 9]
})

# 折线图
df.plot()
plt.show()

# 柱状图
df.plot(kind='bar')
plt.show()

# 散点图
df.plot(kind='scatter', x='A', y='B')
plt.show()

# 直方图
df['A'].plot(kind='hist')
plt.show()

# 箱线图
df.plot(kind='box')
plt.show()
```

## 最佳实践

1. **使用向量化操作** - 避免循环
2. **合理使用 inplace 参数** - 节省内存
3. **使用 category 类型** - 节省内存
4. **使用 chunksize 读取大文件** - 分块处理
5. **使用 query 方法** - 简化条件筛选

## 常见问题

### 1. 链式赋值警告

```python
# 错误方式
df[df['A'] > 2]['B'] = 100

# 正确方式
df.loc[df['A'] > 2, 'B'] = 100
```

### 2. 性能优化

```python
# 使用 category 类型
df['category_col'] = df['category_col'].astype('category')

# 分块读取大文件
chunks = pd.read_csv('large_file.csv', chunksize=10000)
for chunk in chunks:
    process(chunk)
```

## 参考资源

- [Pandas 官方文档](https://pandas.pydata.org/docs/)
- [Pandas 中文文档](https://www.pypandas.cn/)
- [10 Minutes to Pandas](https://pandas.pydata.org/docs/user_guide/10min.html)
