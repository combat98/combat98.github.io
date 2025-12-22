---
next:
  text: 'Css'
  link: '/frontend/base/css/index'
---
# Html

## 认识html
HTML 指的是超文本标记语言(Hyper Text Markup Language) 是用来描述网页的一种语言。
HTML 不是一种编程语言，而是一种标记语言 (markup language)
标记语言是一套标记标签 (markup tag)

## head标签
在 HTML 页面的基本结构，head 标签是比较特殊的。事实上，只有一些特殊的标签才能放在 head 标签内，其他大部分标签都是放在 body 标签内的。
在 HTML 中，一般来说，只有 6 个标签能放在 head 标签内。
* title 标签
* meta 标签
* link 标签
* style 标签
* script 标签
* base 标签
### title
在 HTML 中，title 标签唯一的作用就是定义网页的标题。
### meta
meta标签是head部的一个辅助性标签，提供关于 HTML 文档的元数据。它并不会显示在页面上，但对于机器是可读的。可用于浏览器（如何显示内容或重新加载页面），搜索引擎（SEO），或其他 web 服务。
```html
<head>
   <meta /> 是对页面的描述
   <meta charset="utf-8" /> 设置页面字符集  HTML5
   <!--http-equiv 告知浏览器的行为-->
   <meta http-equiv="content-type" cotent="text/html;charset=utf-8" />  HTML4设置页面字符集的方式
   <meta http-equiv="refresh" content="3;url=http://www.baidu.com" /> 告知浏览器3S后跳转到百度
   <meta http-equiv="refresh" content="3" />  告知浏览器3S后刷新一次
   <!--name 告知浏览器的内容-->
   <meta name="keywords" content="关键字,关键字,多个关键字使用英文状态下的逗号分隔"/> 设置网站关键字
   <meta name="description" content="描述的内容" />
   <!--阻止移动浏览器自动调整页面大小-->
   <meta name="viewport" content="initial-scale=2.0,width=device-width" />
   <!--
       name = "viewport" 说明此meta标签定义视口的属性
       initial-scale = 2.0 意思是将页面放大两倍
       width = device-width 告诉浏览器页面的宽度的能与设备的宽度
   -->
   <meta name="viewport" content="width=device-width,maximun-scale=3,minimum-scale=0.5" />
   <!--允许用户将页面最大放大至设备宽度3倍，最小压缩至设备宽度的一半-->
   <meta name="viewport" content="initial-scale=1.0,user-scalable=no" />
   <!--禁止用户缩放，可以在混合APP时，为了使html页面更逼真，使页面无法缩放。user-scalable=no是禁止缩放-->
</head>
```
### link
在 HTML 中，link 标签用于引入外部样式文件（CSS文件）。
```html
 <link type="text/css" rel="stylesheet" href="css/home.css">
```
### script
在 HTML 中，script 标签用于定义页面的 JavaScript 代码，也可以引入外部 JavaScript 文件。
```html
<head>
   <script>
      /*编写javascript代码*/
   </script>
</head>
```
### style
在 HTML 中，style 标签用于定义元素的 CSS 样式，
```html
<head>
   <style>
      /*编写css样式*/
   </style>
</head>
```
## html常用标签
```html
<p></p>段落标签 <!--特点：与上行文本和下行文本之间间隔一行-->
	<!--
		align 控制内容方向。取值：left 默认居左、center 居中、right 居右
		title 设置标题
	-->
<b></b>加粗标签
	<!--
		物理标签：b代表的意思bold  加粗的意思   html
	-->
<strong></strong> 强调某段文本效果是加粗
	<!--
		逻辑标记： 强调的意思    xhtml
	-->
<i></i> 定义斜体
<em></em>  强调某段文本 效果斜体
<br/> 换行标签
<hr/> 水平线标签 
<!--
	属性：align:水平对齐方式，默认是居中。
	width:水平线的长度，百分比及像素都可以。 
	size:水平线的高度。
	color:水平线的颜色
-->
<u></u> 下划线标签
<hn></hn>  <h1>~<h6> 标签定义标题，H1字体最大，H5字体最小。
    <!--h族标签只有h1到h6标签。没有H7标签-->
<bdo></bdo> 覆盖默认的文本方向。属性：dir=ltr/rtl ltr表示left to right 从左到右
<sub></sub>  定义下标文本
<sup></sup>  定义上标文本
<details></details> 标签是交互式的控件，定义元素的细节
<summary></summary> 为details标签定义标题
<dialog></dialog> 定义对话框或者窗口 在chrome浏览器中需要设置属性open="true"才支持
<pre></pre>原格式输出标签  注意:如果编辑器中显示的效果和浏览器中的效果不一样，需要用记事本打开代码重新调试
<figure></figure> 用于对元素进行组合，多用于图片与图片描述组合
<mark></mark>标记文本，呈现加背景色
<small></small>定义小号字体
<ins></ins> 定义插入字  ins全写insert插入的意思
```
### 语义化标签
```html
<div></div>无意义的块级元素
<span></span> 无意义的行内元素
<header></header>定义网页头部
<footer></footer>定义网页底部
<nav></nav>定义网页导航
<aside></aside>定义网页侧边栏
<section></section>定义一个区块
<article></article>定义独立内容
<address></address>定义地址
```
## 列表标签
```html
<ul></ul> 定义无序列表
	<!--
		type 规定在列表中使用的标记类型
			disc  默认实心圆
			circle  空心圆
			none  符号不显示
			square 小方块
	-->
<ol></ol> 定义有序列表
	<!--
		reversed 倒叙
		start  规定有序列表的起始值
		type 规定在列表中使用的标记类型
			1  表示项目用数字标号(1,2,3……)
			a  表示项目用小写字母标号
			A  表示项目用大写字母标号
			i  表示项目用小写罗马数字标号
			I  表示项目用大写的罗马数字标号
	-->
<li></li> 用于ul或者ol中定义列表项
<dl></dl> 定义一个定义列表
<dt></dt>标签定义一个定义列表中的一个项目以及dialog中角色
<dd></dd>标签定义一个定义列表中对项目的描述
```
### 超链接标签
```html
<a target="_blank"></a> 定义超链接。
<!--定义锚点-->
<a id="section1"></a>
<h2>Section 1</h2>
<p>Content of section 1...</p>
<a href="#section1">Jump to Section 1</a>

<!--邮件链接跳转-->
<a href="mailto:发送人的邮箱地址?cc=抄送的人&bcc=密送的人&subject=邮件的主题&body=邮件的主体"></a>
```
**常用属性：**

**target**: 窗口的打开方式，取值：
* `_blank`在新窗口中打开被链接的文档。
* `_self` 默认。在当前窗口中打开链接的文档。
* `_top ` 在框架顶部打开被链接的文档(在整个窗口中打开被链接的文档)
* 
**href**: 用于从一个页面链接到另一个页面。记录需要跳转的地址

#### 锚点
使用<a></a>标签来定义锚点。能快速找到页面中需要的位置。

**锚点的实现：**

* 需要再快读找到的位置定义一个a标签，a标签中添加id属性，属性名自定义。
* 在要跳转的a标签href属性的最后添加#后面跟锚点的名称来实现快速定位。

### 多媒体标签
```html
<progress></progress> 进度条标签
	需要配合属性：
	min 最小值
	max 最大值
	value  当前值
<meter></meter> 定义范围内的度量
	需要配合属性：
	min 最小值
	max 最大值
	low 优化的最小值  警告的最小值
	high 警告的最大值
	optimum 良好值
	value 当前值
<img /> 标签定义图像
	src= 图像路径
	注意：如果图片的路径是绝对路径，那么必须加上协议。
	width 设置图像宽度
	height 设置图像高度
	注意：图像的宽度和高度如何同时设置，那么图像会强制压缩，如果只设置图像的高度或者只设置图像的宽度，那么图像会将设置的高度或者宽度压缩为指定设置的值，另外一端会等比例缩放。
	ismap  将点击的坐标传送到服务器
	usemap 图像定义为客户端图像映射
	图像映射指的是带有可点击区域的图像
	映射实现：
		usemap属性值与<map></map>标签的name属性进行关联。以建立img和map标签之间的关系。
<map></map>  定义客户端图像映射
	属性：name属性，属性值自定义，然后在img标签中usemap属性值通过#来查找对应name的属性值。
<area />  定义图像映射中的区域
	shape  定义区域的形状
		取值：rect 矩形    circle 圆	poly 多边形 default 整张图  
	coords 定义区域的坐标值
		矩形： 左上角坐标和右下角坐标
		圆形：需要设置圆形点和半径
		多边形：自定义坐标点。
	href 点击区域跳转的位置
	target  打开的方式

<audio></audio>  加载音频
	autoplay 自动播放
	controls 播放控件 必加
	src 声音地址
	loop 循环播放
	preload 提前加载准备播放
<video></video>   加载视频
	src 视频地址
	controls 播放控件
	height 视频高度
	width 视频宽度
	poster 定义视频在点击播放前显示的图像
	autoplay 自动播放
<embed />   加载多媒体
	width 
	height
	src
	type 文件的mime类型
<source />   定义媒介资源
	src 媒介的地址
	type 媒体的类型
```
### 表格标签
```html
<table></table> 定义表格
	border:设置表格的边框
	align：设置表格相对于浏览器的水平位置  left   center  right
	width: 设置表格的宽度
	height:设置表格的高度
	background:设置表格的背景图片
	bgcolor:设置表格的背景颜色
	bordercolor:设置表格边框颜色
	cellspacing: 单元格之间的间距
	cellpadding:单元格内容与单元格边界的间距
<caption></caption> 定义表格的标题
<tr></tr>定义表格中的一行
	height:设置行高
	align:行内容的水平对齐方式 取值：left  center  right
	valign：行内容的垂直对齐方式  取值：top   middle  bottom
	bgcolor:行的背景颜色
<td></td>定义表格中的一个单元格
	width / height 设置宽高
	align 设置水平对齐方式 取值 left  center right
	valign 设置垂直对齐方式  取值 top middle bottom
	bgcolor 单元格的背景色
	colspan 设置单元格跨列
	rowspan 设置单元格跨行
<th></th> 定义表格内的表头单元格
<thead></thead> 设置表格的头部
<tbody></tbody>	设置表格的主体内容
<tfoot></tfoot>	设置表格的低部
```
## 表单相关标签
```html
<form></form> 用于为用户输入创建HTML表单
<!--必须属性-->
action -- 浏览者输入数据被传送到的地方，比如一个PHP页面
method -- 数据传送的方式
get -- 此方式传递数据量少，但是传递的信息显示在网址上。
post -- 此方式传递信息多，而且不会把传递的信息显示在网址上。
<input />为用户定义需要使用的表单项
<!--必须属性-->
name -- 定义此表单项的名称。
value -- 定义此表单项的默认值。
type -- 代表一个输入域的显示方式(分为：输入型、选择型、点击型)
type的取值：
type = "text" 普通文本域
type = "password" 密码域
type = "radio" 单选  注意：如果要实现单选name属性名称必须一致才会产生排斥效果
type = "checkbox"  复选框 多选框 注意：name名称后面必须加中括号  比如 name="hobby[]"代表一组
type = "file" 文件选取表单
type = "reset"  重置按钮 清空表单信息还原默认状态
type = "hidden"  代表隐藏域，可以传送一些隐藏的信息到服务器中
type = "image" 使用图片来显示提交按钮，使用src属性指定图片的位置。类似于img标签。
type = "button" 普通按钮(给JS使用)
type = "submit" 提交按钮，把信息传送到服务器，可以使用value属性来显示提交按钮上的文字信息
form把表单相关标签
<button></button> 提交按钮(可以实现提交)
<button type="submit"></button> 提交按钮
<button type="button"></button>没有意义的按钮

<label></label> 为input元素定义标注(绑定元素)
实现绑定元素
1：直接将内容和input标签包含在一块。
2.在label标签中定义一个for属性，在input标签定义一个id属性，两个属性值相同即可实现关联。
<textarea></textarea> 多行文本输入域
name 为多行文本输入域定义名称
rows 定义多行文本输入域默认显示的行数
cols 定义多行文本输入域默认显示的列数
注意：textarea没有value属性，获取的只就是两个标签中间的内容。
<select></select> 定义下拉列表
name 为该下拉列表定义名称
<option></option> 为下拉列表定义列表项
value 为该列表项定义默认值
注意：如果列表项中没有设置value属性，那么点击提交时，将获取option标签中间的内容。如果设置了value属性，将获取value属性设置的值。
<optgroup></optgroup> 为下拉列表定义分组
label 定义分组的名称。
<fieldset></fieldset> 将表单内的相关元素进行分组
<legend></legend>为fieldset定义分组的标题
<datalist></datalist> 定义可选数列表
将可选数据列表与普通文本域进行关联
1.在datalist标签中定义id属性
2.在文本域中定义list属性，属性值指定id的属性值即可实现关联。
注意：列表项依然使用<option></option>来定义。

表单分离技术
为了排版方便，在H5中表单标签允许脱离form表单之外，但是要实现提交需要做2件事。
1.为form标签添加id属性，属性值自定义。
2.为需要提交的元素添加form属性，属性值指定id的属性值即可实现提交。

新增的表单类型 type值等于：
date    日期选取表单
time    时间选取表单
week    周选取表单
month   月份选取表单
datetime-local  完整日期
email 设定当前表单的验证方式是email邮件验证
url 设定当前表单的验证方式是url方式
number 设定当前表单的验证方式是数值验证  可以使用min 和 max
range 设定当前表单的验证方式必须在指定的范围内  需要配合属性 min max
search 设定当前表单为搜索表单
color 设定表单为颜色选取
tel 设定标签为电话号表单
```
### 表单属性
```html
<form></form> 用于为用户输入创建HTML表单
    <!--必须属性-->
    action -- 浏览者输入数据被传送到的地方，比如一个PHP页面
    method -- 数据传送的方式
        get -- 此方式传递数据量少，但是传递的信息显示在网址上。
        post -- 此方式传递信息多，而且不会把传递的信息显示在网址上。
<input />为用户定义需要使用的表单项
    <!--必须属性-->
    name -- 定义此表单项的名称。
    value -- 定义此表单项的默认值。
    type -- 代表一个输入域的显示方式(分为：输入型、选择型、点击型)
    type的取值：
    type = "text" 普通文本域
    type = "password" 密码域
    type = "radio" 单选  注意：如果要实现单选name属性名称必须一致才会产生排斥效果
    type = "checkbox"  复选框 多选框 注意：name名称后面必须加中括号  比如 name="hobby[]"代表一组
    type = "file" 文件选取表单
    type = "reset"  重置按钮 清空表单信息还原默认状态
    type = "hidden"  代表隐藏域，可以传送一些隐藏的信息到服务器中
    type = "image" 使用图片来显示提交按钮，使用src属性指定图片的位置。类似于img标签。
    type = "button" 普通按钮(给JS使用)
    type = "submit" 提交按钮，把信息传送到服务器，可以使用value属性来显示提交按钮上的文字信息
form把表单相关标签 
<button></button> 提交按钮(可以实现提交)
<button type="submit"></button> 提交按钮
<button type="button"></button>没有意义的按钮

<label></label> 为input元素定义标注(绑定元素)
实现绑定元素
    1：直接将内容和input标签包含在一块。
    2.在label标签中定义一个for属性，在input标签定义一个id属性，两个属性值相同即可实现关联。
<textarea></textarea> 多行文本输入域
    name 为多行文本输入域定义名称
    rows 定义多行文本输入域默认显示的行数
    cols 定义多行文本输入域默认显示的列数
    注意：textarea没有value属性，获取的只就是两个标签中间的内容。
<select></select> 定义下拉列表
    name 为该下拉列表定义名称
<option></option> 为下拉列表定义列表项
    value 为该列表项定义默认值
    注意：如果列表项中没有设置value属性，那么点击提交时，将获取option标签中间的内容。如果设置了value属性，将获取value属性设置的值。
<optgroup></optgroup> 为下拉列表定义分组
    label 定义分组的名称。
<fieldset></fieldset> 将表单内的相关元素进行分组
<legend></legend>为fieldset定义分组的标题
<datalist></datalist> 定义可选数列表
将可选数据列表与普通文本域进行关联
    1.在datalist标签中定义id属性
    2.在文本域中定义list属性，属性值指定id的属性值即可实现关联。
注意：列表项依然使用<option></option>来定义。

表单分离技术
    为了排版方便，在H5中表单标签允许脱离form表单之外，但是要实现提交需要做2件事。
    1.为form标签添加id属性，属性值自定义。
    2.为需要提交的元素添加form属性，属性值指定id的属性值即可实现提交。

新增的表单类型 type值等于：
    date    日期选取表单
    time    时间选取表单
    week    周选取表单
    month   月份选取表单
    datetime-local  完整日期
    email 设定当前表单的验证方式是email邮件验证
    url 设定当前表单的验证方式是url方式
    number 设定当前表单的验证方式是数值验证  可以使用min 和 max 
    range 设定当前表单的验证方式必须在指定的范围内  需要配合属性 min max
    search 设定当前表单为搜索表单
    color 设定表单为颜色选取
    tel 设定标签为电话号表单
```
## html全局属性
1. contentEditable 内容可编辑属性 
   * 设定该属性的内容允许在页面中直接修改。
   * 页面中修改只是临时修改，如果需要长期修改，需要以后学习JS和AJAX等技术配合
2. designMode 页面可编辑属性(标签无法使用，只能JS用)	注意：当前属性不是任何标签的属性，而是文档的属性。如果文档设置该属性为on，那么页面中所有的元素均可编辑。
```javascript
document.designMode='on';
```

## html框架标签
```html
<iframe></iframe> 在页面中开一块空间链接一个子页面。
    src 引入子页面的地址
    width 设置宽度
    height 设置高度
<frameset></frameset>代表body标签定义框架页，并且定义框架页将分为多少行或者多少列
    cols 定义框架页含有多少列与列的大小(每个值使用逗号分隔，值为像素或者百分比)
    rows 定义框架页含有多少行与行的大小
<frame /> 定义frameset标签中每个框架页的内容
    src 定义内容的地址
    name 为每一个框架页定义名称(在一个框架页链接到另一个框架页时使用)
```
