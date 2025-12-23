# CSS

## 概述

CSS（Cascading Style Sheets，层叠样式表）是用于描述 HTML 文档样式的语言，控制网页的布局和外观。

### CSS 的三种引入方式

```html
<!-- 1. 内联样式 -->
<div style="color: red; font-size: 16px;">内联样式</div>

<!-- 2. 内部样式 -->
<head>
  <style>
    div {
      color: blue;
      font-size: 18px;
    }
  </style>
</head>

<!-- 3. 外部样式（推荐） -->
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

## 选择器

### 基础选择器

```css
/* 标签选择器 */
p {
  color: red;
}

/* 类选择器 */
.class-name {
  color: blue;
}

/* ID 选择器 */
#id-name {
  color: green;
}

/* 通配符选择器 */
* {
  margin: 0;
  padding: 0;
}
```

### 组合选择器

```css
/* 后代选择器 */
div p {
  color: red;
}

/* 子选择器 */
div > p {
  color: blue;
}

/* 相邻兄弟选择器 */
h1 + p {
  color: green;
}

/* 通用兄弟选择器 */
h1 ~ p {
  color: orange;
}

/* 群组选择器 */
h1, h2, h3 {
  font-weight: bold;
}
```

### 属性选择器

```css
/* 存在属性 */
[title] {
  color: red;
}

/* 属性值完全匹配 */
[type="text"] {
  border: 1px solid #ccc;
}

/* 属性值包含 */
[class*="btn"] {
  padding: 10px;
}

/* 属性值以...开头 */
[class^="icon-"] {
  font-size: 20px;
}

/* 属性值以...结尾 */
[src$=".png"] {
  border: 1px solid #000;
}
```

### 伪类选择器

```css
/* 链接伪类 */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: orange; }

/* 结构伪类 */
li:first-child { font-weight: bold; }
li:last-child { font-style: italic; }
li:nth-child(2) { color: red; }
li:nth-child(odd) { background: #f0f0f0; }
li:nth-child(even) { background: #fff; }
li:nth-child(3n) { color: blue; }

/* 状态伪类 */
input:focus { border-color: blue; }
input:disabled { opacity: 0.5; }
input:checked + label { color: green; }

/* 否定伪类 */
p:not(.special) { color: gray; }
```

### 伪元素选择器

```css
/* ::before 和 ::after */
.box::before {
  content: "前缀";
  color: red;
}

.box::after {
  content: "后缀";
  color: blue;
}

/* ::first-letter 首字母 */
p::first-letter {
  font-size: 2em;
  font-weight: bold;
}

/* ::first-line 首行 */
p::first-line {
  color: blue;
}

/* ::selection 选中文本 */
::selection {
  background: yellow;
  color: black;
}
```

## 文本样式

```css
.text {
  /* 字体 */
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold; /* normal, bold, 100-900 */
  font-style: italic; /* normal, italic, oblique */
  
  /* 文本 */
  color: #333;
  text-align: center; /* left, right, center, justify */
  text-decoration: underline; /* none, underline, overline, line-through */
  text-transform: uppercase; /* none, uppercase, lowercase, capitalize */
  text-indent: 2em;
  line-height: 1.5;
  letter-spacing: 2px;
  word-spacing: 5px;
  
  /* 文本溢出 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* 多行文本溢出 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## 盒模型

```css
.box {
  /* 宽高 */
  width: 200px;
  height: 100px;
  
  /* 内边距 */
  padding: 10px;
  padding: 10px 20px; /* 上下 左右 */
  padding: 10px 20px 30px 40px; /* 上 右 下 左 */
  
  /* 边框 */
  border: 1px solid #ccc;
  border-width: 1px;
  border-style: solid; /* solid, dashed, dotted, double */
  border-color: #ccc;
  border-radius: 5px;
  
  /* 外边距 */
  margin: 10px;
  margin: 10px auto; /* 水平居中 */
  
  /* 盒模型类型 */
  box-sizing: border-box; /* content-box, border-box */
}
```

## 背景

```css
.background {
  /* 背景颜色 */
  background-color: #f0f0f0;
  
  /* 背景图片 */
  background-image: url('image.jpg');
  background-repeat: no-repeat; /* repeat, repeat-x, repeat-y, no-repeat */
  background-position: center center; /* left, right, center, top, bottom */
  background-size: cover; /* auto, cover, contain, 100px 100px */
  background-attachment: fixed; /* scroll, fixed */
  
  /* 简写 */
  background: #f0f0f0 url('image.jpg') no-repeat center/cover;
  
  /* 多背景 */
  background-image: url('bg1.jpg'), url('bg2.jpg');
  background-position: left top, right bottom;
  background-repeat: no-repeat, no-repeat;
  
  /* 渐变背景 */
  background: linear-gradient(to right, red, blue);
  background: linear-gradient(45deg, red, yellow, green);
  background: radial-gradient(circle, red, blue);
}
```

## 布局

### Display

```css
/* 块级元素 */
.block {
  display: block;
  width: 100%;
}

/* 行内元素 */
.inline {
  display: inline;
}

/* 行内块元素 */
.inline-block {
  display: inline-block;
  width: 100px;
  height: 100px;
}

/* 隐藏元素 */
.hidden {
  display: none; /* 不占空间 */
  visibility: hidden; /* 占空间 */
}
```

### Position

```css
/* 静态定位（默认） */
.static {
  position: static;
}

/* 相对定位 */
.relative {
  position: relative;
  top: 10px;
  left: 20px;
}

/* 绝对定位 */
.absolute {
  position: absolute;
  top: 0;
  right: 0;
}

/* 固定定位 */
.fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

/* 粘性定位 */
.sticky {
  position: sticky;
  top: 0;
}
```

### Float

```css
/* 浮动 */
.left {
  float: left;
}

.right {
  float: right;
}

/* 清除浮动 */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

### Flexbox

```css
/* 容器属性 */
.flex-container {
  display: flex;
  
  /* 主轴方向 */
  flex-direction: row; /* row, row-reverse, column, column-reverse */
  
  /* 换行 */
  flex-wrap: wrap; /* nowrap, wrap, wrap-reverse */
  
  /* 主轴对齐 */
  justify-content: center; /* flex-start, flex-end, center, space-between, space-around, space-evenly */
  
  /* 交叉轴对齐 */
  align-items: center; /* flex-start, flex-end, center, baseline, stretch */
  
  /* 多行对齐 */
  align-content: center;
  
  /* 间距 */
  gap: 10px;
  row-gap: 10px;
  column-gap: 20px;
}

/* 项目属性 */
.flex-item {
  /* 放大比例 */
  flex-grow: 1;
  
  /* 缩小比例 */
  flex-shrink: 1;
  
  /* 基础大小 */
  flex-basis: 200px;
  
  /* 简写 */
  flex: 1; /* flex-grow flex-shrink flex-basis */
  
  /* 单独对齐 */
  align-self: flex-end;
  
  /* 顺序 */
  order: 2;
}
```

### Grid

```css
/* 容器属性 */
.grid-container {
  display: grid;
  
  /* 定义列 */
  grid-template-columns: 200px 1fr 2fr;
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  
  /* 定义行 */
  grid-template-rows: 100px 200px;
  grid-template-rows: repeat(3, 100px);
  
  /* 间距 */
  gap: 10px;
  row-gap: 10px;
  column-gap: 20px;
  
  /* 对齐 */
  justify-items: center;
  align-items: center;
  justify-content: center;
  align-content: center;
}

/* 项目属性 */
.grid-item {
  /* 列位置 */
  grid-column: 1 / 3; /* 起始 / 结束 */
  grid-column: span 2; /* 跨越 2 列 */
  
  /* 行位置 */
  grid-row: 1 / 3;
  grid-row: span 2;
  
  /* 简写 */
  grid-area: 1 / 1 / 3 / 3; /* row-start / col-start / row-end / col-end */
}
```

## 动画与过渡

### Transition

```css
.box {
  width: 100px;
  height: 100px;
  background: blue;
  
  /* 过渡 */
  transition: all 0.3s ease;
  transition: width 0.3s, height 0.3s;
  transition-property: width;
  transition-duration: 0.3s;
  transition-timing-function: ease; /* linear, ease, ease-in, ease-out, ease-in-out */
  transition-delay: 0.1s;
}

.box:hover {
  width: 200px;
  height: 200px;
  background: red;
}
```

### Transform

```css
.transform {
  /* 平移 */
  transform: translate(50px, 100px);
  transform: translateX(50px);
  transform: translateY(100px);
  
  /* 缩放 */
  transform: scale(1.5);
  transform: scale(2, 0.5);
  
  /* 旋转 */
  transform: rotate(45deg);
  
  /* 倾斜 */
  transform: skew(10deg, 20deg);
  
  /* 组合 */
  transform: translate(50px, 100px) rotate(45deg) scale(1.5);
  
  /* 3D 变换 */
  transform: rotateX(45deg);
  transform: rotateY(45deg);
  transform: rotateZ(45deg);
  transform: translate3d(50px, 100px, 0);
}
```

### Animation

```css
/* 定义动画 */
@keyframes slide {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100px);
    opacity: 0;
  }
}

/* 使用动画 */
.animated {
  animation: slide 2s ease infinite;
  animation-name: slide;
  animation-duration: 2s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: infinite; /* 1, 2, infinite */
  animation-direction: normal; /* normal, reverse, alternate, alternate-reverse */
  animation-fill-mode: forwards; /* none, forwards, backwards, both */
  animation-play-state: running; /* running, paused */
}
```

## 响应式设计

### 媒体查询

```css
/* 移动优先 */
.container {
  width: 100%;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}

/* 大屏 */
@media (min-width: 1200px) {
  .container {
    width: 1140px;
  }
}

/* 横屏 */
@media (orientation: landscape) {
  .box {
    width: 100%;
  }
}

/* 打印 */
@media print {
  .no-print {
    display: none;
  }
}
```

### 视口单位

```css
.responsive {
  /* 视口宽度 */
  width: 50vw; /* 50% of viewport width */
  
  /* 视口高度 */
  height: 100vh; /* 100% of viewport height */
  
  /* 视口最小值 */
  font-size: 5vmin;
  
  /* 视口最大值 */
  font-size: 5vmax;
}
```

## 常用技巧

### 水平垂直居中

```css
/* Flexbox */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid */
.center-grid {
  display: grid;
  place-items: center;
}

/* 绝对定位 + Transform */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 绝对定位 + Margin */
.center-margin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}
```

### 清除浮动

```css
/* 方法1：clearfix */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

/* 方法2：overflow */
.container {
  overflow: hidden;
}

/* 方法3：BFC */
.container {
  display: flow-root;
}
```

### 三角形

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}
```

### 圆形和椭圆

```css
/* 圆形 */
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

/* 椭圆 */
.ellipse {
  width: 200px;
  height: 100px;
  border-radius: 50%;
}
```

## CSS 变量

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size: 16px;
  --spacing: 10px;
}

.button {
  background-color: var(--primary-color);
  font-size: var(--font-size);
  padding: var(--spacing);
}

/* 带默认值 */
.box {
  color: var(--text-color, #333);
}
```

## 最佳实践

1. **使用语义化的类名**：`.btn-primary` 而不是 `.blue-button`
2. **避免过度嵌套**：选择器嵌套不超过 3 层
3. **使用简写属性**：`margin: 10px 20px` 而不是分开写
4. **移动优先**：先写移动端样式，再用媒体查询适配大屏
5. **使用 Flexbox/Grid**：替代传统的浮动布局
6. **CSS 变量**：提高代码可维护性
7. **避免 !important**：除非必要
8. **性能优化**：减少重绘和回流
