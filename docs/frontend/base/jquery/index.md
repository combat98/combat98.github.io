# jQuery



## 1. 快速开始（把 jQuery 跑起来）

### 1.1 引入方式（CDN / 本地）
```html
<!-- 方式 1：CDN（适合演示/外网环境；企业内网可能不可用） -->
<!-- 注意：生产环境要考虑 SRI、版本锁定、CDN 可用性 -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>

<!-- 方式 2：本地文件（适合内网/离线） -->
<!-- <script src="/assets/vendor/jquery/jquery-3.7.1.min.js"></script> -->
```

### 1.2 DOMReady：等页面可操作再执行代码
```js
// 写法 1：$(document).ready(...)
$(document).ready(function () {
  // 解释：DOM 树已构建完成（但图片等资源可能还在加载）
  console.log('DOM Ready');
});

// 写法 2：$(fn) 的简写（最常用）
$(function () {
  console.log('DOM Ready（简写）');
});
```

> 为什么要 DOMReady？  
> 因为你在 JS 里选元素（如 `$('.btn')`）时，如果元素还没渲染出来，选择结果为空，你的绑定事件/改样式就不会生效。

---

## 2. 核心概念（必须理解的 4 件事）

### 2.1 `$()` 返回的是 jQuery 对象，不是原生 DOM
```js
const $btn = $('.btn');           // jQuery 对象（可能包含多个元素）
const btnEl = document.querySelector('.btn'); // 原生 DOM（单个元素）

// 解释：jQuery 对象可以直接调用 .addClass/.on 等 jQuery 方法
$btn.addClass('is-active');

// 解释：原生 DOM 不具备 jQuery 方法，得用 classList/addEventListener
btnEl?.classList.add('is-active');

// 互转：jQuery -> DOM
const firstEl = $btn[0];          // 取第一个 DOM 节点

// 互转：DOM -> jQuery
const $firstEl = $(firstEl);
```

### 2.2 “隐式迭代”（jQuery 的爽点）
```js
// 解释：如果页面有 10 个 .item，这句会对 10 个元素都生效（隐式循环）
$('.item').addClass('highlight');
```

### 2.3 链式调用（Chainable）
```js
// 解释：大部分 jQuery 方法返回当前 jQuery 对象，以便继续链式调用
$('.card')
  .addClass('card--ready')
  .find('.card__title')
  .text('已初始化');
```

### 2.4 选择器成本（性能意识）
```js
// 不推荐：重复查找会重复走 DOM 查询，成本更高
$('.list .item').addClass('x');
$('.list .item').attr('data-x', '1');

// 推荐：缓存结果，避免重复查询
const $items = $('.list .item');
$items.addClass('x').attr('data-x', '1');
```

---

## 3. 选择器与遍历（选得准，才能改得对）

### 3.1 基础选择器（与 CSS 很像）
```js
$('.box');          // class
$('#app');          // id
$('div');           // 标签
$('input[type=text]'); // 属性选择器
```

### 3.2 常用过滤选择器（写后台/表单非常常用）
```js
$('li:first');          // 第一个
$('li:last');           // 最后一个
$('li:eq(2)');          // 下标为 2（从 0 开始）
$('li:odd');            // 奇数下标
$('li:even');           // 偶数下标
$('input:checked');     // 勾选的
$('input:disabled');    // 禁用的
$(':focus');            // 当前聚焦的
```

### 3.3 DOM 遍历（Traversal）
```js
const $card = $('.card');

$card.parent();              // 父元素
$card.children('.title');    // 子元素（可带过滤）
$card.find('.btn');          // 后代元素（最常用）
$card.closest('.page');      // 向上找最近的匹配祖先（非常实用）
$card.siblings();            // 同级兄弟
$card.next();                // 下一个兄弟
$card.prev();                // 上一个兄弟
```

> 为什么要熟练 `closest()`？  
> 因为事件委托场景下，你经常拿到 `e.target`（点击的子元素），然后需要“回到组件根节点”做操作。

---

## 4. DOM 操作（增删改查：最常用 API）

### 4.1 文本/HTML
```js
$('.title').text('纯文本');               // 设置纯文本（会转义）
$('.content').html('<b>带标签</b>');      // 设置 HTML（不会转义）

// 读取
const titleText = $('.title').text();
const htmlText = $('.content').html();
```

### 4.2 表单值（val）
```js
// 设置 input 值
$('#username').val('Alice');

// 读取 input 值
const username = $('#username').val(); // 注意：返回 string（或 null/undefined）
```

### 4.3 属性与属性状态（attr vs prop）
```js
// attr：操作 HTML 属性（字符串）
$('.link').attr('href', '/home');
const href = $('.link').attr('href');

// prop：操作 DOM 属性（更贴近“状态”）
$('#agree').prop('checked', true);      // 勾选复选框
const checked = $('#agree').prop('checked');
```

> 经验：  
> - 你要改 `checked/disabled/selected` 这类“状态”，优先用 `prop()`  
> - 你要改 `href/title/data-*` 这类“属性值”，用 `attr()`

### 4.4 data（存取业务数据）
```html
<button class="btn" data-id="1001">查看</button>
```

```js
// 读取 data-*（jQuery 会做一次缓存/类型转换）
const id = $('.btn').data('id'); // 可能得到 number 1001（取决于版本与值形态）

// 写入 data（写入的是 jQuery 内部数据缓存；必要时也可写 attr）
$('.btn').data('role', 'viewer');
```

### 4.5 class 与样式
```js
$('.box').addClass('is-open');       // 添加 class
$('.box').removeClass('is-open');    // 移除 class
$('.box').toggleClass('is-open');    // 切换 class
$('.box').hasClass('is-open');       // 判断是否存在 class

// css：设置/读取内联样式
$('.box').css('width', '120px');
$('.box').css({ width: '120px', height: '80px' }); // 批量设置（更清晰）
const width = $('.box').css('width');
```

### 4.6 插入/删除节点（结构操作）
```js
// 追加到末尾
$('.list').append('<li class="item">新项</li>');

// 追加到开头
$('.list').prepend('<li class="item">新项（头部）</li>');

// 插到元素前/后
$('.target').before('<div class="tip">前面</div>');
$('.target').after('<div class="tip">后面</div>');

// 删除/清空
$('.toast').remove();     // 删除自身节点
$('.list').empty();       // 清空子节点（保留容器）
```

---

## 5. 事件系统（写交互的关键）

### 5.1 on/off/one：绑定与解绑
```js
function handleClick(e) {
  // e 是 jQuery 封装后的事件对象（兼容性更好）
  console.log('clicked:', e.currentTarget);
}

$('.btn').on('click', handleClick);  // 绑定
$('.btn').off('click', handleClick); // 解绑

// one：只执行一次（例如首次提示、一次性引导）
$('.btn-once').one('click', function () {
  console.log('只执行一次');
});
```

### 5.2 事件委托（非常重要：动态列表必备）
```html
<ul class="todo-list">
  <!-- 解释：li 可能是动态 append 出来的 -->
</ul>
```

```js
// 不推荐：只对“当前已存在的 .todo__del”生效，后续 append 的按钮没事件
// $('.todo__del').on('click', ...)

// 推荐：事件委托 -> 把监听绑在父容器上，由事件冒泡来处理子元素点击
$('.todo-list').on('click', '.todo__del', function (e) {
  // 解释：this 指向真正命中的 .todo__del（因为使用了 selector 参数）
  $(this).closest('.todo').remove(); // 解释：找到最近的 todo 行并删除
});
```

### 5.3 常用事件与键盘操作
```js
$('#search').on('input', function () {
  // 解释：input 事件适合实时响应输入
  console.log('关键词：', $(this).val());
});

$('#search').on('keydown', function (e) {
  // 解释：回车搜索是经典交互
  if (e.key === 'Enter') {
    console.log('回车触发搜索：', $(this).val());
  }
});
```

---

## 6. 效果与动画（能用 CSS 就尽量用 CSS）

```js
// show/hide：直接切 display（简单粗暴）
$('.panel').hide();
$('.panel').show();
$('.panel').toggle();

// 淡入淡出
$('.toast').fadeIn(150);
$('.toast').fadeOut(150);

// 滑动
$('.menu').slideDown(180);
$('.menu').slideUp(180);

// animate：自定义动画（注意性能，尽量只动画 transform/opacity）
$('.box').animate(
  { opacity: 0.5, left: '+=30px' }, // 解释：可以用 +=/-= 做相对变化
  200,
  'swing',
  function () {
    console.log('动画结束回调');
  }
);
```

> 为什么更推荐 CSS 动画？  
> CSS 动画通常更容易走 GPU 合成（尤其是 `transform/opacity`），性能与可控性更好；jQuery 的 `animate` 多数情况下会触发布局计算。

---

## 7. AJAX（用 jQuery 访问接口）

### 7.1 $.ajax（最完整、最常用）
```js
// 解释：$.ajax 返回 jqXHR（兼容 Promise 风格的 then/catch）
$.ajax({
  url: '/api/users',       // 解释：请求地址
  method: 'GET',           // 解释：也可写 type: 'GET'（老写法）
  data: { page: 1 },       // 解释：query 参数（GET 会拼到 URL）
  dataType: 'json',        // 解释：期望返回 JSON（jQuery 会自动解析）
  timeout: 8000,           // 解释：超时控制（毫秒）
})
  .done(function (data) {
    console.log('成功：', data);
  })
  .fail(function (xhr, textStatus, errorThrown) {
    // 解释：xhr.status 可以拿到 HTTP 状态码（例如 401/500）
    console.error('失败：', xhr.status, textStatus, errorThrown);
  })
  .always(function () {
    console.log('无论成功失败都会执行：收尾逻辑放这里');
  });
```

### 7.2 GET/POST 快捷方法
```js
$.get('/api/profile', function (data) {
  console.log('GET 返回：', data);
});

$.post('/api/login', { username: 'a', password: 'b' }, function (data) {
  console.log('POST 返回：', data);
});
```

### 7.3 全局 AJAX 事件（做 loading 很方便）
```js
$(document)
  .ajaxStart(function () {
    // 解释：任意一个 AJAX 开始（第一个请求发出）
    $('.global-loading').show();
  })
  .ajaxStop(function () {
    // 解释：所有 AJAX 都结束（最后一个请求完成）
    $('.global-loading').hide();
  });
```

---

## 8. Deferred/Promise（进阶：理解“异步链”）

> jQuery 的 `$.ajax()` 返回 `jqXHR`，它实现了 Promise-like 的 `.done/.fail/.then`。  
> 在老项目里你会遇到：`$.when()`、`$.Deferred()`、`resolve/reject`。

```js
function wait(ms) {
  const dfd = $.Deferred();

  // 解释：用 setTimeout 模拟异步任务
  setTimeout(function () {
    dfd.resolve({ ok: true, ms });
  }, ms);

  // 解释：返回 promise（而不是暴露 resolve/reject），更安全
  return dfd.promise();
}

$.when(wait(300), wait(600)).done(function (a, b) {
  // 解释：多个异步都成功后执行
  console.log('全部完成：', a, b);
});
```

---

## 9. 插件开发（从“会用”到“会封装”）

### 9.1 插件的基本形态（挂到 $.fn 上）
```js
// 解释：IIFE 避免污染全局作用域
(function ($) {
  // 解释：默认配置（可被用户覆盖）
  const DEFAULTS = {
    activeClass: 'is-active',
  };

  // 解释：插件函数必须挂到 $.fn（也就是 jQuery 原型）上
  $.fn.activeToggle = function (options) {
    const settings = $.extend({}, DEFAULTS, options);

    // 解释：保持链式调用：return this.each(...)
    return this.each(function () {
      const $el = $(this);

      // 解释：点击切换 class（演示用）
      $el.on('click', function () {
        $el.toggleClass(settings.activeClass);
      });
    });
  };
})(jQuery);

// 用法：
// $('.btn').activeToggle({ activeClass: 'btn--active' });
```

### 9.2 插件常见能力清单（建议你逐步补齐）
- 支持“初始化 + 方法调用”（例如 `$('.x').plugin('destroy')`）
- 支持 `data-*` 读配置（HTML 配置化）
- 支持事件回调（如 `onOpen/onClose`）
- 避免重复初始化（可以用 `$.data(el, 'pluginName')` 记录状态）

---

## 10. 可运行案例（复制即可用）

> 建议做法：每个案例都单独建一个 `demo.html` 文件直接打开。  
> 说明：下面为了笔记可读性，把 HTML/CSS/JS 放在一起；真实项目建议拆文件。

### 案例 1：TodoList（事件委托 + 动态渲染）
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>jQuery TodoList Demo</title>
    <style>
      /* 解释：简单做个可读的 UI，重点在交互逻辑 */
      body { font-family: system-ui, "Microsoft YaHei", sans-serif; padding: 20px; }
      .row { display: flex; gap: 10px; }
      .todo-list { margin-top: 14px; padding: 0; list-style: none; }
      .todo { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #eee; border-radius: 10px; margin-bottom: 10px; }
      .todo__text { flex: 1; }
      .todo.is-done .todo__text { text-decoration: line-through; color: #999; }
      .btn { padding: 6px 10px; border-radius: 8px; border: 1px solid #ddd; background: #fff; cursor: pointer; }
      .btn:hover { background: #f7f7f7; }
    </style>
  </head>
  <body>
    <h1>TodoList（jQuery）</h1>

    <div class="row">
      <input id="todo-input" placeholder="输入待办，回车也可添加" />
      <button id="todo-add" class="btn">添加</button>
    </div>

    <ul class="todo-list"></ul>

    <!-- 说明：演示时用 CDN；离线请换成本地 jquery 文件 -->
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
    <script>
      $(function () {
        // 解释：用数组作为“数据源”，真实项目可以换成接口返回的数据
        const todos = [];

        // 解释：统一渲染函数 -> 保证“数据”与“视图”同步
        function render() {
          const $list = $('.todo-list');
          $list.empty(); // 解释：简单起见，直接全量重绘

          // 解释：把 todos 渲染为 DOM（这里拼字符串也可以，下面用 jQuery 创建节点更直观）
          todos.forEach(function (todo, index) {
            const $li = $('<li class="todo"></li>');

            // 解释：用 data 保存索引，事件处理时能拿到对应项
            $li.attr('data-index', String(index));

            // 解释：完成态加 class，靠 CSS 控制样式
            if (todo.done) $li.addClass('is-done');

            const $check = $('<input class="todo__check" type="checkbox" />');
            $check.prop('checked', todo.done);

            const $text = $('<span class="todo__text"></span>');
            $text.text(todo.text); // 解释：用 text 防止 XSS（输入当作纯文本）

            const $del = $('<button class="btn todo__del">删除</button>');

            $li.append($check, $text, $del);
            $list.append($li);
          });
        }

        function addTodo() {
          const text = String($('#todo-input').val() || '').trim();
          if (!text) return;

          todos.push({ text, done: false });
          $('#todo-input').val(''); // 解释：清空输入框
          render();
        }

        // 解释：点击添加
        $('#todo-add').on('click', addTodo);

        // 解释：回车添加（键盘友好）
        $('#todo-input').on('keydown', function (e) {
          if (e.key === 'Enter') addTodo();
        });

        // 解释：事件委托：删除按钮（动态渲染也能工作）
        $('.todo-list').on('click', '.todo__del', function () {
          const index = Number($(this).closest('.todo').attr('data-index'));
          todos.splice(index, 1);
          render();
        });

        // 解释：事件委托：勾选完成
        $('.todo-list').on('change', '.todo__check', function () {
          const $todo = $(this).closest('.todo');
          const index = Number($todo.attr('data-index'));
          todos[index].done = $(this).prop('checked');
          render();
        });

        render(); // 解释：初次渲染
      });
    </script>
  </body>
</html>
```

### 案例 2：Tabs（组件化思维 + class 切换）
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>jQuery Tabs Demo</title>
    <style>
      body { font-family: system-ui, "Microsoft YaHei", sans-serif; padding: 20px; }
      .tabs { border: 1px solid #eee; border-radius: 12px; overflow: hidden; width: min(100%, 560px); }
      .tabs__nav { display: flex; gap: 0; background: #fafafa; }
      .tabs__btn { flex: 1; padding: 10px; border: 0; background: transparent; cursor: pointer; }
      .tabs__btn.is-active { background: #fff; font-weight: 700; }
      .tabs__panel { display: none; padding: 14px; }
      .tabs__panel.is-active { display: block; }
    </style>
  </head>
  <body>
    <h1>Tabs（jQuery）</h1>

    <div class="tabs" id="demo-tabs">
      <div class="tabs__nav">
        <button class="tabs__btn is-active" data-tab="a">Tab A</button>
        <button class="tabs__btn" data-tab="b">Tab B</button>
        <button class="tabs__btn" data-tab="c">Tab C</button>
      </div>

      <div class="tabs__panel is-active" data-panel="a">内容 A：这是第一个面板。</div>
      <div class="tabs__panel" data-panel="b">内容 B：这是第二个面板。</div>
      <div class="tabs__panel" data-panel="c">内容 C：这是第三个面板。</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
    <script>
      $(function () {
        const $tabs = $('#demo-tabs');

        // 解释：事件委托：只绑一次，内部按钮随便增删都能工作
        $tabs.on('click', '.tabs__btn', function () {
          const tabKey = $(this).data('tab'); // 解释：拿到 data-tab 的值

          // 解释：激活当前按钮，关闭其它按钮
          $tabs.find('.tabs__btn').removeClass('is-active');
          $(this).addClass('is-active');

          // 解释：激活对应面板
          $tabs.find('.tabs__panel').removeClass('is-active');
          $tabs.find(`.tabs__panel[data-panel="${tabKey}"]`).addClass('is-active');
        });
      });
    </script>
  </body>
</html>
```

---

### 案例 3：搜索建议（防抖 + 渲染列表 + 事件委托）

> 这个案例主要练 3 个点：  
> 1）输入事件 `input`；2）防抖避免频繁计算/请求；3）动态列表用事件委托处理点击。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>jQuery Search Suggest Demo</title>
    <style>
      body { font-family: system-ui, "Microsoft YaHei", sans-serif; padding: 20px; }
      .search { width: min(100%, 520px); position: relative; }
      .search input { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 10px; }
      .suggest { margin-top: 10px; padding: 0; list-style: none; border: 1px solid #eee; border-radius: 10px; overflow: hidden; }
      .suggest__item { padding: 10px 12px; cursor: pointer; }
      .suggest__item:hover { background: #f7f7f7; }
      .hint { margin-top: 10px; color: #666; }
    </style>
  </head>
  <body>
    <h1>搜索建议（jQuery）</h1>

    <div class="search">
      <input id="kw" placeholder="输入关键词，例如：vue / react / jquery ..." />
      <ul id="suggest" class="suggest"></ul>
      <div id="hint" class="hint">提示：输入会在 300ms 后触发“防抖计算”。</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
    <script>
      $(function () {
        // 解释：演示用本地数据源（真实项目一般换成接口请求）
        const words = ['vue', 'react', 'jquery', 'typescript', 'javascript', 'vitepress', 'node', 'css', 'html', 'tailwind'];

        // 解释：防抖函数：在用户停止输入一段时间后才执行回调
        function debounce(fn, delay) {
          let timer = null;
          return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(function () {
              fn.apply(null, args);
            }, delay);
          };
        }

        function renderSuggest(list) {
          const $ul = $('#suggest');
          $ul.empty();

          // 解释：没有建议就不渲染任何项
          if (!list.length) return;

          list.forEach(function (item) {
            // 解释：用 text() 写入，避免把用户输入当 HTML 插入导致 XSS
            const $li = $('<li class="suggest__item"></li>');
            $li.text(item);
            $ul.append($li);
          });
        }

        const doSearch = debounce(function () {
          const kw = String($('#kw').val() || '').trim().toLowerCase();
          if (!kw) {
            renderSuggest([]);
            return;
          }

          // 解释：简单 contains 匹配；真实项目可改成拼音/分词/权重排序
          const result = words.filter(function (w) {
            return w.includes(kw);
          });

          renderSuggest(result);
        }, 300);

        // 解释：监听 input（比 keyup 更适合处理中文输入法）
        $('#kw').on('input', doSearch);

        // 解释：事件委托：点击建议项后回填输入框
        $('#suggest').on('click', '.suggest__item', function () {
          $('#kw').val($(this).text());
          renderSuggest([]);
          $('#hint').text('已选择：' + $('#kw').val());
        });
      });
    </script>
  </body>
</html>
```

---

## 11. 常用工具函数与技巧（写得更快）

### 11.1 each：遍历 jQuery 集合
```js
$('.item').each(function (index, el) {
  // index：下标
  // el：原生 DOM 节点
  // this：同 el
  $(el).attr('data-index', String(index));
});
```

### 11.2 extend：合并配置（插件/组件常用）
```js
const defaults = { size: 'md', theme: 'light' };
const user = { theme: 'dark' };

// 解释：把 user 覆盖到 defaults 上，生成一个新对象
const settings = $.extend({}, defaults, user);
// settings => { size: 'md', theme: 'dark' }
```

### 11.3 serialize：表单序列化（提交表单很方便）
```js
// <form id="f">
//   <input name="username" />
//   <input name="age" />
// </form>

const queryString = $('#f').serialize();
// 解释：结果类似 "username=alice&age=18"
```

---

## 12. 常见坑与最佳实践（让你少踩雷）

1. **多用事件委托**：列表/动态内容一定要委托到容器上（`on('click', '.child', fn)`）。
2. **缓存选择结果**：避免重复 `$('.xx')`（尤其在滚动/频繁事件里）。
3. **用 `text()` 防 XSS**：用户输入展示到页面，优先 `text()` 而不是 `html()`。
4. **attr vs prop 分清**：状态用 `prop()`（`checked/disabled/selected`）。
5. **动画尽量用 CSS**：jQuery `animate` 容易引发布局计算，性能不稳定。

---

## 13. jQuery 与原生对照速查（迁移很有用）

```js
// 选择元素
// jQuery: $('.btn')
// 原生: document.querySelectorAll('.btn')

// 绑定事件
// jQuery: $('.btn').on('click', fn)
// 原生: el.addEventListener('click', fn)

// class 操作
// jQuery: $el.addClass('x')
// 原生: el.classList.add('x')

// AJAX
// jQuery: $.ajax({ ... })
// 原生: fetch(url, { method, headers, body })
```

---

## 参考资料（官方文档）

> 为什么把官方文档放在结尾？  
> 1）你在前面已经掌握了“常用 API + 实战模式”，此时再看官方文档会更高效（知道自己要查什么）。  
> 2）官方文档是最权威、更新最及时的来源，用来核对参数、返回值、边界行为最可靠。  

- jQuery API（官方 API 索引）：`https://api.jquery.com/`
- jQuery Learning Center（官方学习中心，偏教程）：`https://learn.jquery.com/`
