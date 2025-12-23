# Python

## 环境安装

### Python 安装

Python 的解释器是开源免费的，可以直接去官方网站进行下载。

#### 官方安装

访问 [Python 官网](https://www.python.org/) 然后点击 Downloads，选择适合你操作系统的版本。

**Windows 安装：**

1. 下载 Python 安装包（推荐 Python 3.9 或更高版本）
2. 运行安装程序
3. **重要：勾选 "Add Python to PATH"**
4. 点击 "Install Now" 或 "Customize installation"
5. 安装完成后，打开命令提示符验证：

```bash
python --version
pip --version
```

**macOS 安装：**

```bash
# 使用 Homebrew 安装
brew install python3

# 验证安装
python3 --version
pip3 --version
```

**Linux 安装：**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip

# 验证安装
python3 --version
pip3 --version
```

### Anaconda/Miniconda 安装

Anaconda 是一个用于科学计算的 Python 发行版，包含了众多流行的科学计算、数据分析的 Python 包。

#### Anaconda vs Miniconda

- **Anaconda**：完整版，包含 Python、Conda 和 150+ 科学包（约 3GB）
- **Miniconda**：精简版，只包含 Python 和 Conda（约 400MB），需要时再安装其他包

#### 安装 Anaconda

1. 访问 [Anaconda 官网](https://www.anaconda.com/download)
2. 下载适合你操作系统的安装包
3. 运行安装程序，按照提示完成安装
4. 验证安装：

```bash
conda --version
python --version
```

#### 安装 Miniconda

1. 访问 [Miniconda 官网](https://docs.conda.io/en/latest/miniconda.html)
2. 下载适合你操作系统的安装包
3. 运行安装程序

**Windows：**
```bash
# 下载后直接运行安装程序
# 安装完成后打开 Anaconda Prompt
conda --version
```

**macOS/Linux：**
```bash
# 下载安装脚本
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# 运行安装脚本
bash Miniconda3-latest-Linux-x86_64.sh

# 重新加载配置
source ~/.bashrc

# 验证安装
conda --version
```

### Conda 基础使用

#### 环境管理

```bash
# 创建新环境
conda create -n myenv python=3.9

# 创建环境并安装包
conda create -n myenv python=3.9 numpy pandas

# 激活环境
conda activate myenv

# 退出环境
conda deactivate

# 查看所有环境
conda env list
# 或
conda info --envs

# 删除环境
conda remove -n myenv --all

# 克隆环境
conda create -n newenv --clone myenv

# 导出环境配置
conda env export > environment.yml

# 从配置文件创建环境
conda env create -f environment.yml
```

#### 包管理

```bash
# 安装包
conda install numpy
conda install numpy pandas matplotlib

# 安装指定版本
conda install numpy=1.20.0

# 从指定频道安装
conda install -c conda-forge package_name

# 更新包
conda update numpy
conda update --all

# 卸载包
conda remove numpy

# 查看已安装的包
conda list

# 搜索包
conda search numpy

# 清理缓存
conda clean --all
```

#### Conda 配置

```bash
# 查看配置
conda config --show

# 添加镜像源（国内加速）
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/

# 设置搜索时显示频道地址
conda config --set show_channel_urls yes

# 移除镜像源
conda config --remove channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
```

### 虚拟环境（venv）

Python 3.3+ 自带 venv 模块，用于创建轻量级虚拟环境。

#### 创建和使用虚拟环境

**Windows：**

```bash
# 创建虚拟环境
python -m venv myenv

# 激活虚拟环境
myenv\Scripts\activate

# 退出虚拟环境
deactivate
```

**macOS/Linux：**

```bash
# 创建虚拟环境
python3 -m venv myenv

# 激活虚拟环境
source myenv/bin/activate

# 退出虚拟环境
deactivate
```

#### 虚拟环境中的包管理

```bash
# 激活虚拟环境后
pip install numpy pandas

# 查看已安装的包
pip list

# 导出依赖
pip freeze > requirements.txt

# 安装依赖
pip install -r requirements.txt
```

### virtualenv

virtualenv 是一个更强大的虚拟环境工具，支持 Python 2 和 Python 3。

```bash
# 安装 virtualenv
pip install virtualenv

# 创建虚拟环境
virtualenv myenv

# 指定 Python 版本
virtualenv -p python3.9 myenv

# 激活和退出与 venv 相同
```

### pipenv

pipenv 是一个集成了 pip 和 virtualenv 的工具，提供了更好的依赖管理。

```bash
# 安装 pipenv
pip install pipenv

# 创建虚拟环境并安装包
pipenv install numpy pandas

# 激活虚拟环境
pipenv shell

# 退出虚拟环境
exit

# 运行命令（不激活环境）
pipenv run python script.py

# 查看依赖树
pipenv graph

# 生成 requirements.txt
pipenv lock -r > requirements.txt
```

### Poetry

Poetry 是一个现代化的 Python 依赖管理和打包工具。

```bash
# 安装 Poetry（Windows PowerShell）
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -

# 安装 Poetry（macOS/Linux）
curl -sSL https://install.python-poetry.org | python3 -

# 创建新项目
poetry new myproject

# 初始化现有项目
poetry init

# 添加依赖
poetry add numpy pandas

# 安装依赖
poetry install

# 激活虚拟环境
poetry shell

# 运行命令
poetry run python script.py
```

### 环境管理最佳实践

1. **为每个项目创建独立的虚拟环境**
   - 避免包版本冲突
   - 保持项目依赖清晰

2. **选择合适的工具**
   - 数据科学项目：推荐 Conda
   - Web 开发项目：推荐 venv 或 pipenv
   - 包开发：推荐 Poetry

3. **使用 requirements.txt 或 environment.yml**
   - 记录项目依赖
   - 方便团队协作和部署

4. **不要将虚拟环境提交到版本控制**
   - 添加到 .gitignore
   ```
   # Python
   venv/
   env/
   myenv/
   .venv/
   
   # Conda
   conda-env/
   
   # Pipenv
   Pipfile.lock
   ```

5. **定期更新依赖**
   ```bash
   # pip
   pip list --outdated
   pip install --upgrade package_name
   
   # conda
   conda update --all
   ```

### 常见问题

#### 1. Python 命令不识别

**Windows：**
- 确保安装时勾选了 "Add Python to PATH"
- 手动添加到环境变量：`C:\Python39\` 和 `C:\Python39\Scripts\`

**macOS/Linux：**
- 使用 `python3` 而不是 `python`
- 添加别名：`alias python=python3`

#### 2. pip 安装速度慢

使用国内镜像源（见下文 pip 镜像源配置）

#### 3. Conda 环境激活失败

```bash
# 初始化 conda
conda init bash  # Linux/macOS
conda init powershell  # Windows PowerShell
conda init cmd.exe  # Windows CMD
```

#### 4. 虚拟环境中找不到包

确保已激活虚拟环境，并在该环境中安装了包

### pip 镜像源配置

#### 临时使用

```bash
pip install 包名 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

#### 永久修改

**Windows：**

1. 在用户目录下创建 `pip` 文件夹：`C:\Users\<UserName>\pip\`
2. 在 `pip` 目录下创建 `pip.ini` 文件
3. 写入以下内容：

```ini
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host = pypi.tuna.tsinghua.edu.cn
timeout = 6000
```

**macOS/Linux：**

```bash
# 创建配置文件
mkdir -p ~/.pip
nano ~/.pip/pip.conf

# 写入以下内容
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host = pypi.tuna.tsinghua.edu.cn
timeout = 6000
```

#### 国内常用镜像源

- 阿里云：`https://mirrors.aliyun.com/pypi/simple/`
- 清华大学：`https://pypi.tuna.tsinghua.edu.cn/simple/`
- 中国科技大学：`https://pypi.mirrors.ustc.edu.cn/simple/`
- 豆瓣：`http://pypi.douban.com/simple/`
- 华为云：`https://repo.huaweicloud.com/repository/pypi/simple/`

## 语法

Python 的语法比较简单，采用缩进方式，写出来的代码就像下面的样子：

```python
# print absolute value of an integer:
a = 100
if a >= 0:
    print(a)
else:
    print(-a)
```

以 `#` 开头的语句是注释，注释是给人看的，可以是任意内容，解释器会忽略掉注释。

其他每一行都是一个语句，当语句以冒号 `:` 结尾时，缩进的语句视为代码块。

缩进有利有弊。好处是强迫你写出格式化的代码，但没有规定缩进是几个空格还是 Tab。

按照约定俗成的惯例，应该始终坚持使用 4 个空格的缩进。

缩进的另一个好处是强迫你写出缩进较少的代码，你会倾向于把一段很长的代码拆分成若干函数，从而得到缩进较少的代码。

最后，请务必注意，Python 程序是**大小写敏感**的，如果写错了大小写，程序会报错。

## 输入输出

```python
# 输入
name = input("请输入你的名字：")

# 输出
print("你的名字是：" + name)
print(f"你的名字是：{name}")  # f-string 格式化
```

## 标准数据类型

### Number（数字）

Python3 支持 int、float、bool、complex（复数）。

```python
# 奇葩的赋值方式，对象依次赋值给变量，并且没有类型声明
a, b, c, d = 20, 5.5, True, 4+3j

# output：<class 'int'> <class 'float'> <class 'bool'> <class 'complex'>
print(type(a), type(b), type(c), type(d))
```

在 Python 中，有两种除法，一种除法是 `/`：

```python
>>> 10 / 3
3.3333333333333335
```

`/` 除法计算结果是浮点数，即使是两个整数恰好整除，结果也是浮点数：

还有一种除法是 `//`，称为地板除，两个整数的除法仍然是整数：

```python
>>> 10 // 3
3
```

整数的地板除 `//` 永远是整数，即使除不尽。要做精确的除法，使用 `/` 就可以。

### String（字符串）

单引号或双引号表示字符串，`'` 或 `"` 本身只是一种表示方式，不是字符串的一部分。

```python
'hello world'
"hello world"
```

转义字符 `\` 可以转义很多字符，比如 `\n` 表示换行，`\t` 表示制表符，字符 `\` 本身也要转义，所以 `\\` 表示的字符就是 `\`。

如果字符串里面有很多字符都需要转义，就需要加很多 `\`，为了简化，Python 还允许用 `r''` 表示 `''` 内部的字符串默认不转义。

```python
# 输出转义后的制表符
print('\t')

# 直接输出字符，不进行转义
print(r'\t')
```

多行字符串：Python 允许用 `'''...'''` 的格式表示多行内容，或者表示区块代码的注释

```python
# 多行字符串
print('''
无题
锦瑟无端五十弦
''')
```

### 布尔值

布尔值和布尔代数的表示完全一致，一个布尔值只有 True、False 两种值，要么是 True，要么是 False。

`and` 表示 `与运算`，`or` 表示 `或运算`，`not` 表示 `非运算`

```python
>>> True and True
True
>>> True and False
False
>>> False and False
False
>>> 5 > 3 and 3 > 1
True
>>> True or True
True
>>> True or False
True
>>> False or False
False
>>> 5 > 3 or 1 > 3
True
>>> not True
False
>>> not False
True
>>> not 1 > 2
True
```

### 空值 None

空值是 Python 里一个特殊的值，用 None 表示。None 不能理解为 0，因为 0 是有意义的，而 None 是一个特殊的空值。

### 常量

在 Python 中，通常用全部大写的变量名表示常量：

```python
PI = 3.14159265359
```

但事实上 PI 仍然是一个变量，Python 根本没有任何机制保证 PI 不会被改变，所以，用全部大写的变量名表示常量只是一个习惯上的用法，如果你一定要改变变量 PI 的值，也没人能拦住你。

### 列表

list 是一种有序的集合，可以随时添加和删除其中的元素。

列表 `[]` 很像 JS 里的数组，不限定元素的类型，并且是支持修改的。

#### 通用序列操作

```python
# 列表 list 或元组 tuple 均支持以下操作
tags = [1, 2, 3, "hello", "world", True]

# 1. 索引访问，同其他语言
print(tags[1])  # 2

# 2. 分片 [start:end] 不包含 end 索引

# a) 截取第2位，即索引为1
print(tags[1:2])  # [2]

# b) 截取最后一个元素
print(tags[-1:])  # [True]

# c) 利用分片进行复制 list，因为 list 也是引用，直接赋值只是引用 copy
# 可以通过分片 [:] 达到深度复制
tagsCopy = tags[:]
tagsCopy += [False]
print(tags)
print(tagsCopy)

# 3. 序列相加，有些类似于拼接
print([1, 2, 3] + ["abc" + "xyz"])  # [1, 2, 3, 'abcxyz']

# 4. 序列乘法，即原来的序列被重复 N 次
print(["repeat"] * 3)  # ['repeat', 'repeat', 'repeat']

# 5. 检查元素是否在序列中，这里和 js 中的表示不一样
print("xyz" in ["abc", "xyz", "opq"])  # True
print("ll" in "hello")  # True

# 6. 长度、最大、最小
nums = [9, 5, 2, 7]
print(len(nums))
print(max(nums))
print(min(nums))
```

#### 列表 list

```python
# 列表赋值，同 js
names = ['Alice', 'Bob', 'Charlie']

# 添加元素
names.append('David')  # 末尾添加
names.insert(1, 'Eve')  # 指定位置插入

# 删除元素
del names[0]  # 删除指定索引
names.remove('Bob')  # 删除指定值
names.pop()  # 删除末尾元素
names.pop(0)  # 删除指定索引

# 排序
names.sort()  # 原地排序
sorted_names = sorted(names)  # 返回新列表

# 反转
names.reverse()
```

### 元组 tuple

tuple 和 list 非常类似，但是 tuple 一旦初始化就不能修改，比如同样是列出同学的名字：

```python
classmates = ('Michael', 'Bob', 'Tracy')
```

classmates 这个 tuple 不能变了，它也没有 append()，insert() 这样的方法。

其他获取元素的方法和 list 是一样的，你可以正常地使用 classmates[0]，classmates[-1]，但不能赋值成另外的元素。

不可变的 tuple 有什么意义？

因为 tuple 不可变，所以代码更安全。如果可能，能用 tuple 代替 list 就尽量用 tuple。

tuple 的陷阱：当你定义一个 tuple 时，在定义的时候，tuple 的元素就必须被确定下来，比如：

```python
>>> t = (1, 2)
>>> t
(1, 2)
```

如果要定义一个空的 tuple，可以写成 `()`：

```python
>>> t = ()
>>> t
()
```

但是，要定义一个只有 1 个元素的 tuple，如果你这么定义：

```python
>>> t = (1)
>>> t
1
```

定义的不是 tuple，是 1 这个数！

这是因为括号 `()` 既可以表示 tuple，又可以表示数学公式中的小括号，这就产生了歧义，

因此，Python 规定，这种情况下，按小括号进行计算，计算结果自然是 1。

所以，只有 1 个元素的 tuple 定义时必须加一个逗号 `,`，来消除歧义：

```python
>>> t = (1,)
>>> t
(1,)
```

最后来看一个"可变的" tuple：

```python
>>> t = ('a', 'b', ['A', 'B'])
>>> t[2][0] = 'X'
>>> t[2][1] = 'Y'
>>> t
('a', 'b', ['X', 'Y'])
```

表面上看，tuple 的元素确实变了，但其实变的不是 tuple 的元素，而是 list 的元素。

tuple 一开始指向的 list 并没有改成别的 list，所以，tuple 所谓的"不变"是说，tuple 的每个元素，指向永远不变。

即指向 'a'，就不能改成指向 'b'，指向一个 list，就不能改成指向其他对象，但指向的这个 list 本身是可变的！

### Dictionary（字典）

Python 内置了字典：dict 的支持，dict 全称 dictionary，在其他语言中也称为 map，使用键-值（key-value）存储，具有极快的查找速度。

举个例子，假设要根据同学的名字查找对应的成绩，如果用 list 实现，需要两个 list：

```python
names = ['Michael', 'Bob', 'Tracy']
scores = [95, 75, 85]
```

给定一个名字，要查找对应的成绩，就先要在 names 中找到对应的位置，再从 scores 取出对应的成绩，list 越长，耗时越长。

```python
>>> d = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
>>> d['Michael']
95
```

由于一个 key 只能对应一个 value，所以，多次对一个 key 放入 value，后面的值会把前面的值冲掉：

```python
>>> d['Jack'] = 90
>>> d['Jack']
90
>>> d['Jack'] = 88
>>> d['Jack']
88
```

要避免 key 不存在的错误，有两种办法，一是通过 in 判断 key 是否存在：

```python
>>> 'Thomas' in d
False
```

二是通过 dict 提供的 get() 方法，如果 key 不存在，可以返回 None，或者自己指定的 value：

```python
>>> d.get('Thomas')
>>> d.get('Thomas', -1)
-1
```

要删除一个 key，用 pop(key) 方法，对应的 value 也会从 dict 中删除：

```python
>>> d.pop('Bob')
75
>>> d
{'Michael': 95, 'Tracy': 85}
```

和 list 比较，dict 有以下几个特点：

1. 查找和插入的速度极快，不会随着 key 的增加而变慢；
2. 需要占用大量的内存，内存浪费多。

而 list 相反：

1. 查找和插入的时间随着元素的增加而增加；
2. 占用空间小，浪费内存很少。

dict 可以用在需要高速查找的很多地方，在 Python 代码中几乎无处不在，正确使用 dict 非常重要，需要牢记的第一条就是 dict 的 key 必须是不可变对象。

这是因为 dict 根据 key 来计算 value 的存储位置，如果每次计算相同的 key 得出的结果不同，那 dict 内部就完全混乱了。

这个通过 key 计算位置的算法称为哈希算法（Hash）。

要保证 hash 的正确性，作为 key 的对象就不能变。

在 Python 中，字符串、整数等都是不可变的，因此，可以放心地作为 key。而 list 是可变的，就不能作为 key：

### Sets（集合）

set 和 dict 类似，也是一组 key 的集合，但不存储 value。由于 key 不能重复，所以，在 set 中，没有重复的 key。

要创建一个 set，需要提供一个 list 作为输入集合：

```python
>>> s = set([1, 2, 3])
>>> s
{1, 2, 3}
```

注意，传入的参数 [1, 2, 3] 是一个 list，而显示的 {1, 2, 3} 只是告诉你这个 set 内部有 1，2，3 这 3 个元素，显示的顺序也不表示 set 是有序的。

重复元素在 set 中自动被过滤：

```python
>>> s = set([1, 1, 2, 2, 3, 3])
>>> s
{1, 2, 3}
```

通过 add(key) 方法可以添加元素到 set 中，可以重复添加，但不会有效果：

```python
>>> s.add(4)
>>> s
{1, 2, 3, 4}
>>> s.add(4)
>>> s
{1, 2, 3, 4}
```

通过 remove(key) 方法可以删除元素：

```python
>>> s.remove(4)
>>> s
{1, 2, 3}
```

## 函数

要调用一个函数，需要知道函数的名称和参数，比如求绝对值的函数 abs，只有一个参数。

可以直接从 Python 的官方网站查看文档：
> [http://docs.python.org/3/library/functions.html#abs](http://docs.python.org/3/library/functions.html#abs)

### 数据类型转换

Python 内置的常用函数还包括数据类型转换函数，比如 int() 函数可以把其他数据类型转换为整数：

```python
>>> int('123')
123
>>> int(12.34)
12
>>> float('12.34')
12.34
>>> str(1.23)
'1.23'
>>> str(100)
'100'
>>> bool(1)
True
>>> bool('')
False
```

函数名其实就是指向一个函数对象的引用，完全可以把函数名赋给一个变量，相当于给这个函数起了一个"别名"：

```python
>>> a = abs  # 变量 a 指向 abs 函数
>>> a(-1)  # 所以也可以通过 a 调用 abs 函数
1
```

### 定义函数

在 Python 中，定义一个函数要使用 def 语句，依次写出函数名、括号、括号中的参数和冒号 `:`，然后，在缩进块中编写函数体，函数的返回值用 return 语句返回。

我们以自定义一个求绝对值的 my_abs 函数为例：

```python
def my_abs(x):
    if x >= 0:
        return x
    else:
        return -x

print(my_abs(-5))  # 5
```

### 空函数

如果想定义一个什么事也不做的空函数，可以用 pass 语句：

```python
def nop():
    pass
```

### 返回多个值

```python
def get_full_name():
    first_name = 'smith'
    last_name = 'will'
    return last_name, first_name

print(get_full_name()[0])
print(get_full_name()[1])
```

返回值是一个 tuple！

但是，在语法上，返回一个 tuple 可以省略括号，而多个变量可以同时接收一个 tuple，按位置赋给对应的值。

所以，Python 的函数返回多值其实就是返回一个 tuple，但写起来更方便。

关于函数：

- 定义函数时，需要确定函数名和参数个数；
- 如果有必要，可以先对参数的数据类型做检查；
- 函数体内部可以用 return 随时返回函数结果；
- 函数执行完毕也没有 return 语句时，自动 return None。
- 函数可以同时返回多个值，但其实就是一个 tuple。

### 函数参数

```python
# 位置参数
def power(x, n):
    return x ** n

# 默认参数
def power(x, n=2):
    return x ** n

# 可变参数
def calc(*numbers):
    sum = 0
    for n in numbers:
        sum = sum + n
    return sum

# 关键字参数
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)

# 命名关键字参数
def person(name, age, *, city, job):
    print(name, age, city, job)
```

## 循环

### while

`while` 循环输出 0-9：

```python
a = 0
while a < 10:
    print(a)
    a += 1
```

while 循环使用 else 语句，在条件语句为 false 时执行 else 的语句块：

```python
a = 0
while a < 10:
    print(a)
    a += 1
else:
    print('!!! 循环结束 a 的值为：' + str(a))
```

```python
# 死循环
while True:
    print('hi')
```

同样需要注意冒号和缩进。另外，在 Python 中没有 do..while 循环。

### for

列表 list 的遍历：

```python
names = ['jack', 'lucy', 'smith', 'tony']
for t in names:
    print(t)
```

同样的，for..else 的用法：

```python
names = ['jack', 'lucy', 'smith', 'tony']
for t in names:
    print(t)
else:
    print('list 已遍历完成！')
```

### break 和 continue

break 语句可以跳出 for 和 while 的循环体。如果你从 for 或 while 循环中终止，任何对应的循环 else 块将不执行。

continue 语句被用来告诉 Python 跳过当前循环块中的剩余语句，然后继续进行下一轮循环。

```python
n = 5
while n > 0:
    n -= 1
    if n == 2:
        break
    print(n)
print('循环结束。')
```

```python
n = 5
while n > 0:
    n -= 1
    if n == 2:
        continue
    print(n)
print('循环结束。')
```

### range() 函数

如果你需要遍历数字序列，可以使用内置 range() 函数。它会生成数列，例如:

```python
# 输出 0-4
for t in range(5):
    print(t)

# 输出 10-14
for t in range(10, 15):
    print(t)
```

## 遍历

### list 遍历

最简单的 `for...in` 遍历元素，打印输出索引和元素本身：

```python
names = ['jack', 'lucy', 'smith', 'tony']
for t in names:
    index = names.index(t)
    print('index is : {ind} ,element is : {val}'.format(ind=index, val=t))
```

通过 range() 方式快速遍历：

```python
names = ['jack', 'lucy', 'smith', 'tony']
for ind in range(len(names)):
    print('index is : {ind},element is :{val}'.format(ind=ind, val=names[ind]))
```

通过 `enumerate()` 函数将可遍历的数据组合成索引序列：

```python
names = ['jack', 'lucy', 'smith', 'tony']
for i, v in enumerate(names):
    print('{ind} and {val}'.format(ind=i, val=v))
```

### 字典遍历

遍历字典的 key 值：

```python
someone = {'name': 'jack', 'age': 12, 'location': '芜湖'}
for k in someone:
    print('key:{key},value:{val}'.format(key=k, val=someone[k]))
```

其实，上述 `for k in someone` 也可以换成 `for k in someone.keys()`，二者是等价的

遍历字典的 value 值：

```python
for v in someone.values():
    print('value:{val}'.format(val=v))
```

遍历字典项，`items` 每项是 `tuple`

```python
for it in someone.items():
    print(it)
```

更加快捷的方式：

```python
for k, v in someone.items():
    print('{key}-{val}'.format(key=k, val=v))
```

列表字典组合的遍历：

```python
students = [
    {'name': 'jack', 'age': 12, 'location': '芜湖'},
    {'name': 'lucy', 'age': 14, 'location': '合肥'},
    {'name': 'smith', 'age': 22, 'location': '滁州'},
]

for t in students:
    print('第{number}个元素：'.format(number=students.index(t)))
    for k, v in t.items():
        print('{key}--{val}'.format(key=k, val=v))
```

## 模块

Python 模块（Module），是一个 Python 文件，以 .py 结尾，包含了 Python 对象定义和 Python 语句。

模块让你能够有逻辑地组织你的 Python 代码段。

### import

import 模块名1 [as 别名1], 模块名2 [as 别名2]，…：

使用这种语法格式的 import 语句，会导入指定模块中的所有成员（包括变量、函数、类等）。

不仅如此，当需要使用模块中的成员时，需用该模块名（或别名）作为前缀，否则 Python 解释器会报错。

support.py 模块：

```python
def say_hello(name):
    print('你好 {name}'.format(name=name))
```

新建 run.py 文件：

```python
import support

hi = support.say_hello

hi('jack')
```

或者使用别名：

```python
import support as supp

hi = supp.say_hello

hi('jack')
```

一个模块只会被导入一次，不管你执行了多少次 import。这样可以防止导入模块被一遍又一遍地执行。

### from…import 语句

`from 模块名 import 成员名 as 别名`

```python
# 导入 sys 模块的 argv 成员
from sys import argv
# 使用导入成员的语法，直接使用成员名访问
print(argv[0])
```

对于自定义的模块，还可以这样使用：

```python
from my_lib.test.support import say_hello as self_say

self_say('jack')
```

## 参考引用

- [Python 教程 - 廖雪峰](https://www.liaoxuefeng.com/wiki/1016959663602400)
- [Python 官方文档](https://docs.python.org/zh-cn/3/)
- [Python 教程 - 菜鸟教程](https://www.runoob.com/python3/python3-tutorial.html)
