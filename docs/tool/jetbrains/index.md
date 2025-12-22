# JetBrains IDE

## 简介

JetBrains 是一家专注于开发工具的公司，提供多款专业的集成开发环境（IDE），每款 IDE 都针对特定的编程语言和开发场景进行了优化。

### JetBrains 产品系列

- **IntelliJ IDEA** - Java/Kotlin 开发
- **PyCharm** - Python 开发
- **WebStorm** - JavaScript/TypeScript 开发
- **PhpStorm** - PHP 开发
- **GoLand** - Go 开发
- **Rider** - .NET 开发
- **CLion** - C/C++ 开发
- **RubyMine** - Ruby 开发
- **DataGrip** - 数据库管理
- **Android Studio** - Android 开发（基于 IntelliJ IDEA）

## IntelliJ IDEA

### 版本

- **Ultimate** - 付费版，支持所有功能
- **Community** - 免费版，支持 Java、Kotlin、Groovy、Scala

### 安装

#### 下载安装

访问 [官网](https://www.jetbrains.com/idea/) 下载安装包。

#### 命令行安装

```bash
# macOS (使用 Homebrew)
brew install --cask intellij-idea

# Ubuntu (使用 Snap)
sudo snap install intellij-idea-ultimate --classic
sudo snap install intellij-idea-community --classic
```

### 快捷键

#### 通用快捷键

- `Cmd/Ctrl + Shift + A` - 查找操作
- `Double Shift` - 全局搜索
- `Cmd/Ctrl + E` - 最近文件
- `Cmd/Ctrl + N` - 查找类
- `Cmd/Ctrl + Shift + N` - 查找文件
- `Cmd/Ctrl + Alt + Shift + N` - 查找符号

#### 编辑快捷键

- `Cmd/Ctrl + D` - 复制行
- `Cmd/Ctrl + Y` - 删除行
- `Cmd/Ctrl + /` - 单行注释
- `Cmd/Ctrl + Shift + /` - 块注释
- `Alt + Enter` - 显示意图操作和快速修复
- `Cmd/Ctrl + Alt + L` - 格式化代码
- `Cmd/Ctrl + Alt + O` - 优化导入

#### 导航快捷键

- `Cmd/Ctrl + B` - 跳转到声明
- `Cmd/Ctrl + Alt + B` - 跳转到实现
- `Cmd/Ctrl + U` - 跳转到父类/方法
- `Cmd/Ctrl + F12` - 文件结构
- `Alt + F7` - 查找用法
- `Cmd/Ctrl + H` - 类型层次结构

#### 重构快捷键

- `Shift + F6` - 重命名
- `Cmd/Ctrl + Alt + M` - 提取方法
- `Cmd/Ctrl + Alt + V` - 提取变量
- `Cmd/Ctrl + Alt + C` - 提取常量
- `Cmd/Ctrl + Alt + F` - 提取字段
- `Cmd/Ctrl + Alt + P` - 提取参数

#### 运行和调试

- `Shift + F10` - 运行
- `Shift + F9` - 调试
- `Cmd/Ctrl + F2` - 停止
- `F8` - 单步跳过
- `F7` - 单步进入
- `Shift + F8` - 单步跳出
- `F9` - 恢复程序
- `Cmd/Ctrl + F8` - 切换断点

### 必备插件

#### 通用插件

**Chinese Language Pack**
中文语言包。

**Rainbow Brackets**
彩虹括号，便于识别代码块。

**Key Promoter X**
快捷键提示，帮助学习快捷键。

**String Manipulation**
字符串操作工具。

**Translation**
翻译插件，支持多种翻译引擎。

**Grep Console**
控制台输出着色。

**CodeGlance**
代码缩略图。

**Material Theme UI**
Material Design 主题。

#### Java 开发

**Lombok**
Lombok 注解支持。

**Maven Helper**
Maven 依赖管理助手。

**JRebel**
热部署工具。

**SonarLint**
代码质量检查。

**MyBatis Log Plugin**
MyBatis SQL 日志格式化。

**Free MyBatis Plugin**
MyBatis 增强工具。

#### Spring 开发

**Spring Boot Assistant**
Spring Boot 配置助手。

**Spring Initializr and Assistant**
Spring 项目初始化。

#### 前端开发

**Vue.js**
Vue 开发支持。

**React**
React 开发支持。

#### 数据库

**Database Navigator**
数据库管理工具。

#### 版本控制

**GitToolBox**
Git 增强工具。

### 配置

#### 设置编码

`Settings → Editor → File Encodings`

```
Global Encoding: UTF-8
Project Encoding: UTF-8
Default encoding for properties files: UTF-8
```

#### 设置 Maven

`Settings → Build, Execution, Deployment → Build Tools → Maven`

```
Maven home directory: /path/to/maven
User settings file: /path/to/settings.xml
Local repository: /path/to/repository
```

#### 设置 JDK

`File → Project Structure → SDKs`

添加 JDK 路径。

#### 代码模板

`Settings → Editor → Live Templates`

##### 常用模板

**psvm** - main 方法
```java
public static void main(String[] args) {
    $END$
}
```

**sout** - System.out.println
```java
System.out.println($END$);
```

**fori** - for 循环
```java
for (int i = 0; i < $END$; i++) {
    
}
```

**iter** - 增强 for 循环
```java
for ($ELEMENT_TYPE$ $VAR$ : $ITERABLE_TYPE$) {
    $END$
}
```

### 代码检查

#### 配置检查规则

`Settings → Editor → Inspections`

可以启用/禁用特定的检查规则。

#### 代码分析

- `Cmd/Ctrl + Alt + Shift + I` - 运行检查
- `Alt + Enter` - 查看问题并快速修复

### 重构

#### 常用重构操作

**重命名**
- 快捷键：`Shift + F6`
- 重命名类、方法、变量等

**提取方法**
- 快捷键：`Cmd/Ctrl + Alt + M`
- 将选中代码提取为方法

**提取变量**
- 快捷键：`Cmd/Ctrl + Alt + V`
- 将表达式提取为变量

**内联**
- 快捷键：`Cmd/Ctrl + Alt + N`
- 将方法或变量内联到调用处

**移动**
- 快捷键：`F6`
- 移动类、方法到其他位置

**复制**
- 快捷键：`F5`
- 复制类、方法

**安全删除**
- 快捷键：`Alt + Delete`
- 删除前检查引用

### 调试技巧

#### 断点类型

**行断点**
- 点击行号左侧添加
- 程序执行到该行时暂停

**条件断点**
- 右键断点设置条件
- 满足条件时才暂停

**异常断点**
- `Cmd/Ctrl + Shift + F8` → `+` → `Java Exception Breakpoints`
- 抛出异常时暂停

**方法断点**
- 在方法名行添加断点
- 进入或退出方法时暂停

#### 调试操作

**查看变量**
- Variables 窗口查看当前变量
- Watches 窗口添加监视表达式

**计算表达式**
- `Alt + F8` - 打开表达式计算器
- 在调试时计算任意表达式

**修改变量值**
- 在 Variables 窗口右键变量
- 选择 Set Value 修改值

**强制返回**
- `Cmd/Ctrl + Shift + F8`
- Force Return 强制方法返回

### 版本控制

#### Git 集成

**提交更改**
- `Cmd/Ctrl + K` - 打开提交窗口
- 选择要提交的文件
- 输入提交信息
- 点击 Commit 或 Commit and Push

**更新项目**
- `Cmd/Ctrl + T` - 拉取最新代码

**查看历史**
- `Alt + 9` - 打开 Git 工具窗口
- 右键文件 → Git → Show History

**分支管理**
- 右下角点击分支名
- 创建、切换、合并分支

**解决冲突**
- 冲突文件会标红
- 右键 → Git → Resolve Conflicts
- 使用三方合并工具解决

### 数据库工具

#### 连接数据库

1. 打开 Database 工具窗口
2. 点击 `+` → Data Source
3. 选择数据库类型
4. 配置连接信息
5. 测试连接

#### 执行 SQL

- 在 Console 中编写 SQL
- `Cmd/Ctrl + Enter` - 执行当前语句
- `Cmd/Ctrl + Shift + Enter` - 执行所有语句

#### 数据库导航

- 查看表结构
- 浏览数据
- 导出数据
- 生成 DDL

## PyCharm

Python 专业开发 IDE，功能与 IntelliJ IDEA 类似。

### 特色功能

- **智能代码补全** - 针对 Python 优化
- **代码检查** - PEP 8 规范检查
- **科学工具** - Jupyter Notebook 支持
- **Web 开发** - Django、Flask 支持
- **数据库工具** - 内置数据库管理

## WebStorm

JavaScript/TypeScript 专业开发 IDE。

### 特色功能

- **前端框架支持** - React、Vue、Angular
- **Node.js 开发** - 完整的 Node.js 支持
- **调试工具** - 浏览器调试集成
- **代码质量** - ESLint、TSLint 集成
- **包管理** - npm、yarn 集成

## Rider

.NET 专业开发 IDE。

### 特色功能

- **跨平台** - 支持 Windows、Linux、macOS
- **Unity 支持** - 游戏开发
- **性能分析** - 内置性能分析工具
- **代码检查** - ReSharper 引擎
- **调试工具** - 强大的调试功能

## 最佳实践

1. **学习快捷键** - 提高开发效率
2. **使用代码模板** - 快速生成代码
3. **善用重构** - 保持代码整洁
4. **配置代码检查** - 提高代码质量
5. **使用版本控制** - 集成 Git 操作
6. **定制主题** - 选择舒适的主题
7. **安装必要插件** - 扩展功能

## 性能优化

### 增加内存

编辑 `idea.vmoptions` 或 `idea64.vmoptions`：

```
-Xms512m
-Xmx2048m
-XX:ReservedCodeCacheSize=512m
```

### 排除文件索引

`Settings → Project → Directories`

将不需要索引的目录标记为 Excluded。

### 禁用不需要的插件

`Settings → Plugins`

禁用不常用的插件。

## 总结

JetBrains IDE 是专业开发者的首选工具：

- ✅ 智能代码补全
- ✅ 强大的重构功能
- ✅ 完善的调试工具
- ✅ 丰富的插件生态
- ✅ 优秀的用户体验

掌握 JetBrains IDE 可以显著提升开发效率和代码质量。

## 参考资源

- [JetBrains 官网](https://www.jetbrains.com/)
- [IntelliJ IDEA 文档](https://www.jetbrains.com/help/idea/)
- [快捷键参考](https://resources.jetbrains.com/storage/products/intellij-idea/docs/IntelliJIDEA_ReferenceCard.pdf)
- [插件市场](https://plugins.jetbrains.com/)
