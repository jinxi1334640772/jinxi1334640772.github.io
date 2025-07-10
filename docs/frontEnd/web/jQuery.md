---
title: jQuery 技术指南
description: jQuery 完整开发指南，包含选择器、事件处理、动画效果、Ajax、插件开发等核心特性
outline: deep
---

# 📚 jQuery 技术指南

jQuery 是一个快速、小巧、功能丰富的 JavaScript 库。利用一些容易上手的 API，它使一些任务，譬如 HTML 文档遍历和操纵、事件处理、动画，以及 Ajax 更简单，并能跨浏览器起作用。

::: tip 📖 本章内容
深入学习 jQuery 的核心功能，掌握高效的 DOM 操作和事件处理技巧。
:::

## 1. jQuery 简介

### 1.1 功能概述

jQuery 库包含以下核心功能：

| 功能分类 | 描述 | 主要用途 |
|---------|------|----------|
| **HTML 元素选取** | 强大的选择器引擎 | 快速定位 DOM 元素 |
| **HTML 元素操作** | DOM 操作和修改 | 动态改变页面内容 |
| **HTML 事件函数** | 事件绑定和处理 | 响应用户交互 |
| **HTML DOM 遍历和修改** | DOM 树遍历 | 查找相关元素 |
| **CSS 操作** | 样式操作 | 动态修改元素样式 |
| **JavaScript 特效和动画** | 动画效果 | 创建流畅的用户体验 |
| **Ajax** | 异步通信 | 与服务器数据交互 |
| **Utilities** | 工具方法 | 常用辅助功能 |

### 1.2 版本兼容性

jQuery 使用 `$` 符号和 `jQuery` 对象，会注入 window 全局对象。但可能其他框架也使用 $ 符号，这样就会引发冲突（但 jQuery 也可以照常使用）。使用 `noConflict()` 方法避免这个问题。

```javascript
// 使用 noConflict()，释放对 $ 标识符的控制，返回值相当于起了个别名
var jq = $.noConflict();
jq(document).ready(function () {
  jq("button").click(function () {
    jq("p").text("jQuery 仍然在工作!");
  });
});
```

### 1.3 文档就绪事件

```javascript
// 通过选择器selector选中元素，然后执行相应的action操作
$(selector).action();

// 在 DOM 加载完成后才可以对 DOM 进行操作。类似DOMContentLoaded事件之后
$(document).ready(function () {
  // 开始写 jQuery 代码...
});

// 上述解析语法的简写形式：
$(function () {
  // 开始写 jQuery 代码...
});
```

## 2. jQuery 选择器

### 2.1 基本选择器

jQuery 选择器基于元素的 id、类、类型、属性、属性值等"查找"（或选择）HTML 元素。传入任何 CSS 选择器即可选中该元素，返回该元素的 jQuery 对象。

```javascript
// 选取 class 为 intro 的 <p> 元素
$("p.intro");

// 选取每个 <ul> 元素的第一个 <li> 元素
$("ul li:first-child");

// 根据 ID 选择
$("#myId");

// 根据标签选择
$("div");

// 根据属性选择
$("[data-role='button']");
```

### 2.2 伪类选择器

jQuery 提供了丰富的伪类选择器：

#### 内容过滤
- `:contains(text)` - 选择所有包含指定文本的元素
- `:has(selector)` - 选择至少包含指定选择器的元素
- `:empty` - 选择所有没有子元素的元素（包括文本节点）
- `:parent` - 选择有子元素或者文本的元素，与 empty 相反

#### 位置过滤
- `:lt(index)` - 所有索引值小于给定 index 参数的元素
- `:eq(index)` - 所有索引值等于给定 index 参数的元素
- `:gt(index)` - 所有索引值大于给定 index 参数的元素
- `:even` - 偶数元素
- `:odd` - 奇数元素

```javascript
// 选择包含特定文本的元素
$("div:contains('Hello')");

// 选择有子元素的 div
$("div:has(p)");

// 选择第一个和最后一个
$("li:first");
$("li:last");

// 选择偶数位置的元素
$("tr:even");
```

### 2.3 jQuery 对象方法

```javascript
// 过滤方法
$(".item").filter(".active");          // 过滤器
$(".item").first();                    // 第一个元素
$(".item").last();                     // 最后一个元素
$(".item").eq(2);                      // 指定索引的元素
$(".item").is(".active");              // 检查是否匹配
$(".item").not(".disabled");           // 排除指定元素
$(".item").has("span");                // 包含指定子元素的元素

// 集合操作
$(".item").slice(1, 3);                // 根据指定的下标范围过滤
$(".item").add(".new-item");           // 添加元素到匹配的元素集合

// 遍历方法
$(".item").map(function(index, element) {
  return $(element).text();
});

// DOM 树遍历
$(".item").find("span");               // 查找后代元素
$(".item").children(".child");         // 获取直接子元素
$(".item").closest(".container");      // 查找最近的祖先元素
$(".item").offsetParent();             // 获取最近的已定位祖先元素
$(".item").contents();                 // 获取包括文字和注释节点的所有内容

// 链式操作控制
$(".item").find("span").addClass("highlight").end().addClass("processed");
```

## 3. 事件处理

### 3.1 事件类型

页面对不同访问者的响应叫做事件。事件处理程序指的是当 HTML 元素发生某些事件时所调用的方法。

#### 鼠标事件
- `click` - 单击事件
- `dblclick` - 双击事件
- `mouseenter` - 鼠标进入
- `mouseleave` - 鼠标离开
- `mousemove` - 鼠标移动
- `mouseout` - 鼠标移出
- `hover` - 鼠标悬停

#### 键盘事件
- `keydown` - 按键按下
- `keyup` - 按键释放
- `keypress` - 按键按下并释放

#### 表单事件
- `submit` - 表单提交
- `change` - 值改变
- `input` - 输入事件
- `focus` - 获得焦点
- `blur` - 失去焦点

#### 文档事件
- `load` - 页面加载完成
- `resize` - 窗口大小改变
- `scroll` - 滚动事件

### 3.2 事件绑定方法

```javascript
// 基本事件绑定
$("p").click(function () {
  // 动作触发后执行的代码
  console.log("段落被点击了");
});

// on() 方法 - 推荐使用
$("p").on("click", function() {
  console.log("使用 on 方法绑定事件");
});

// 绑定多个事件
$("p").on("click mouseenter", function() {
  console.log("点击或鼠标进入");
});

// 事件代理
$("table").on("click", "td", function() {
  $(this).toggleClass("selected");
});

// 传递数据
$("button").on("click", {name: "张进喜"}, function(event) {
  alert("Hello " + event.data.name);
});
```

### 3.3 高级事件处理

```javascript
// 只执行一次的事件
$("button").one("click", function() {
  alert("这个事件只会执行一次");
});

// 事件解绑
$("button").off("click");
$("button").off("click", handlerFunction);

// 触发事件
$("button").trigger("click");
$("button").triggerHandler("click");

// hover 事件的特殊处理
$("#element").hover(
  function() {
    // 鼠标进入时执行
    $(this).css("background-color", "#cccccc");
  },
  function() {
    // 鼠标离开时执行
    $(this).css("background-color", "#ffffff");
  }
);

// 阻止默认行为和冒泡
$("a").click(function(event) {
  event.preventDefault();  // 阻止默认行为
  event.stopPropagation(); // 阻止事件冒泡
  return false; // 同时阻止默认行为和冒泡
});
```

## 4. 动画效果

### 4.1 基本显示隐藏

jQuery 提供了丰富的动画效果，包括隐藏、显示、切换，滑动，淡入淡出，以及自定义动画。

```javascript
// 显示隐藏动画
$("div").show();                    // 立即显示
$("div").show(1000);               // 1秒内显示
$("div").show("slow");             // 慢速显示
$("div").show("fast");             // 快速显示

$("div").hide(1000);               // 隐藏动画
$("div").toggle(1000);             // 切换显示/隐藏

// 带回调函数
$("div").show(1000, function() {
  console.log("显示动画完成");
});
```

### 4.2 淡入淡出效果

```javascript
// 淡入淡出
$("div").fadeIn();                 // 淡入
$("div").fadeIn(1000);            // 1秒淡入
$("div").fadeOut();               // 淡出
$("div").fadeToggle();            // 切换淡入/淡出

// 淡化到指定透明度
$("div").fadeTo(1000, 0.5);       // 1秒内淡化到50%透明度

// 链式调用
$("div").fadeOut(500).delay(1000).fadeIn(500);
```

### 4.3 滑动效果

```javascript
// 滑动效果
$("div").slideDown();             // 向下滑入
$("div").slideDown(1000);         // 1秒内向下滑入
$("div").slideUp();               // 向上滑出
$("div").slideToggle();           // 切换滑入/滑出

// 完整示例
$("button").click(function() {
  $("div").slideToggle("slow", function() {
    console.log("滑动动画完成");
  });
});
```

### 4.4 自定义动画

```javascript
// 基本自定义动画
$("div").animate({
  left: "250px",
  opacity: 0.5,
  height: "150px",
  width: "150px"
}, 1000);

// 相对值动画
$("div").animate({
  left: "+=50px",     // 相对当前位置移动50px
  height: "+=100px",  // 高度增加100px
  width: "-=50px"     // 宽度减少50px
}, 2000);

// 使用预定义值
$("div").animate({
  height: "toggle",   // 可以设置为 "show"、"hide" 或 "toggle"
  opacity: "toggle"
}, 1000);

// 队列动画
$("div")
  .animate({left: "100px"}, 1000)
  .animate({top: "100px"}, 1000)
  .animate({left: "0px"}, 1000)
  .animate({top: "0px"}, 1000);

// 同时进行多个动画
$("div").animate({
  left: "100px",
  top: "100px",
  opacity: 0.5
}, {
  duration: 1000,
  easing: "swing",
  complete: function() {
    console.log("动画完成");
  }
});
```

### 4.5 动画控制

```javascript
// 停止动画
$("div").stop();                  // 停止当前动画
$("div").stop(true);              // 停止所有动画
$("div").stop(true, true);        // 停止所有动画并跳到结束状态

// 延迟执行
$("div").delay(1000).fadeIn(500); // 延迟1秒后淡入

// 完成所有动画
$("div").finish();                // 立即完成所有动画

// 检查是否在动画中
if ($("div").is(":animated")) {
  console.log("元素正在动画中");
}
```

## 5. DOM 操作

### 5.1 内容操作

```javascript
// 获取和设置内容
$("p").text();                    // 获取文本内容
$("p").text("新的文本内容");       // 设置文本内容
$("p").html();                    // 获取HTML内容
$("p").html("<strong>加粗文本</strong>"); // 设置HTML内容

// 获取和设置表单值
$("input").val();                 // 获取表单元素的值
$("input").val("新值");           // 设置表单元素的值

// 批量设置
$("input[type='text']").val(function(index, currentValue) {
  return "Item " + (index + 1);
});
```

### 5.2 属性操作

```javascript
// 属性操作
$("img").attr("src");             // 获取属性值
$("img").attr("src", "new.jpg");  // 设置属性值
$("img").attr({                   // 设置多个属性
  "src": "new.jpg",
  "alt": "新图片",
  "title": "图片标题"
});

$("img").removeAttr("title");     // 移除属性

// 数据属性
$("div").data("key", "value");    // 设置数据属性
$("div").data("key");             // 获取数据属性
$("div").removeData("key");       // 移除数据属性
```

### 5.3 CSS 类操作

```javascript
// CSS 类操作
$("div").addClass("highlight");        // 添加类
$("div").removeClass("highlight");     // 移除类
$("div").toggleClass("highlight");     // 切换类
$("div").hasClass("highlight");        // 检查是否有类

// 添加多个类
$("div").addClass("class1 class2 class3");

// 条件性添加类
$("div").addClass(function(index, currentClass) {
  return index % 2 === 0 ? "even" : "odd";
});
```

### 5.4 CSS 样式操作

```javascript
// CSS 样式操作
$("div").css("color");                 // 获取样式值
$("div").css("color", "red");          // 设置样式值
$("div").css({                         // 设置多个样式
  "color": "red",
  "background-color": "yellow",
  "font-size": "16px"
});

// 获取计算后的样式
$("div").css("width");                 // 返回如 "200px"

// 相对值设置
$("div").css("fontSize", "+=2px");     // 字体大小增加2px
```

### 5.5 尺寸操作

```javascript
// 尺寸获取和设置
$("div").width();                      // 获取宽度
$("div").width(200);                   // 设置宽度
$("div").height();                     // 获取高度
$("div").height(100);                  // 设置高度

// 包含padding的尺寸
$("div").innerWidth();                 // 宽度 + padding
$("div").innerHeight();                // 高度 + padding

// 包含padding和border的尺寸
$("div").outerWidth();                 // 宽度 + padding + border
$("div").outerHeight();                // 高度 + padding + border

// 包含margin的尺寸
$("div").outerWidth(true);             // 宽度 + padding + border + margin
$("div").outerHeight(true);            // 高度 + padding + border + margin
```

## 6. Ajax 操作

### 6.1 基本 Ajax 方法

```javascript
// 基本的 Ajax 请求
$.ajax({
  url: "/api/data",
  type: "GET",
  dataType: "json",
  success: function(data) {
    console.log("请求成功", data);
  },
  error: function(xhr, status, error) {
    console.log("请求失败", error);
  }
});

// 简化的 GET 请求
$.get("/api/data", function(data) {
  console.log("GET 请求成功", data);
});

// 简化的 POST 请求
$.post("/api/data", {name: "张进喜", age: 25}, function(data) {
  console.log("POST 请求成功", data);
});

// 加载 JSON 数据
$.getJSON("/api/data.json", function(data) {
  console.log("JSON 数据", data);
});
```

### 6.2 表单序列化

```javascript
// 表单序列化
$("#myForm").serialize();              // 序列化为查询字符串
$("#myForm").serializeArray();         // 序列化为对象数组

// 示例
var formData = $("#myForm").serialize();
console.log(formData); // "name=张进喜&email=zhang@example.com"

var formArray = $("#myForm").serializeArray();
console.log(formArray); 
// [
//   {name: "name", value: "张进喜"},
//   {name: "email", value: "zhang@example.com"}
// ]
```

### 6.3 Ajax 全局事件

```javascript
// Ajax 全局事件处理
$(document).ajaxStart(function() {
  console.log("Ajax 请求开始");
  $("#loading").show();
});

$(document).ajaxStop(function() {
  console.log("Ajax 请求结束");
  $("#loading").hide();
});

$(document).ajaxSuccess(function(event, xhr, settings) {
  console.log("Ajax 请求成功");
});

$(document).ajaxError(function(event, xhr, settings, error) {
  console.log("Ajax 请求错误", error);
});
```

## 7. 插件开发

### 7.1 基本插件结构

```javascript
// 基本插件模板
(function($) {
  $.fn.myPlugin = function(options) {
    // 默认设置
    var defaults = {
      color: 'red',
      fontSize: '14px'
    };
    
    // 合并设置
    var settings = $.extend({}, defaults, options);
    
    // 返回 jQuery 对象以支持链式调用
    return this.each(function() {
      var $this = $(this);
      
      // 插件逻辑
      $this.css({
        'color': settings.color,
        'font-size': settings.fontSize
      });
    });
  };
})(jQuery);

// 使用插件
$('p').myPlugin({
  color: 'blue',
  fontSize: '16px'
});
```

### 7.2 高级插件开发

```javascript
// 高级插件模板
(function($) {
  // 插件构造函数
  function MyPlugin(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, MyPlugin.DEFAULTS, options);
    this.init();
  }
  
  // 默认设置
  MyPlugin.DEFAULTS = {
    color: 'red',
    speed: 300
  };
  
  // 插件原型方法
  MyPlugin.prototype = {
    init: function() {
      this.bindEvents();
      this.render();
    },
    
    bindEvents: function() {
      var self = this;
      this.$element.on('click', function() {
        self.toggle();
      });
    },
    
    render: function() {
      this.$element.css('color', this.options.color);
    },
    
    toggle: function() {
      this.$element.toggle(this.options.speed);
    },
    
    destroy: function() {
      this.$element.off('click');
      this.$element.removeData('myPlugin');
    }
  };
  
  // jQuery 插件接口
  $.fn.myPlugin = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('myPlugin');
      var options = typeof option === 'object' && option;
      
      if (!data) {
        $this.data('myPlugin', (data = new MyPlugin(this, options)));
      }
      
      if (typeof option === 'string') {
        data[option]();
      }
    });
  };
  
})(jQuery);

// 使用高级插件
$('div').myPlugin({color: 'blue'});
$('div').myPlugin('toggle');
$('div').myPlugin('destroy');
```

## 8. 最佳实践

### 8.1 性能优化

```javascript
// 缓存 jQuery 对象
var $container = $('#container');
$container.addClass('active');
$container.css('color', 'red');

// 使用事件代理
$('#container').on('click', '.button', function() {
  // 处理点击事件
});

// 链式调用
$('#element')
  .addClass('active')
  .css('color', 'red')
  .fadeIn(300);

// 批量DOM操作
var html = '';
for (var i = 0; i < 100; i++) {
  html += '<div>Item ' + i + '</div>';
}
$('#container').html(html);
```

### 8.2 代码组织

```javascript
// 使用立即执行函数表达式(IIFE)
(function($) {
  'use strict';
  
  // 私有变量和方法
  var privateVar = 'private';
  
  function privateMethod() {
    return 'This is private';
  }
  
  // 公共API
  window.MyApp = {
    init: function() {
      this.bindEvents();
    },
    
    bindEvents: function() {
      $('.button').on('click', this.handleClick);
    },
    
    handleClick: function() {
      console.log('Button clicked');
    }
  };
  
})(jQuery);

// 初始化应用
$(document).ready(function() {
  MyApp.init();
});
```

### 8.3 错误处理

```javascript
// Ajax 错误处理
$.ajax({
  url: '/api/data',
  type: 'GET',
  dataType: 'json'
})
.done(function(data) {
  console.log('Success:', data);
})
.fail(function(xhr, status, error) {
  console.error('Error:', error);
  // 显示用户友好的错误信息
  $('#error-message').text('数据加载失败，请稍后重试').show();
})
.always(function() {
  // 无论成功还是失败都会执行
  $('#loading').hide();
});

// 检查元素是否存在
if ($('#element').length > 0) {
  $('#element').doSomething();
}
```

## 9. 常见问题

### 9.1 文档就绪 vs 窗口加载

```javascript
// DOM 就绪（推荐）
$(document).ready(function() {
  // DOM 结构已加载完成，但图片等资源可能还在加载
});

// 窗口完全加载
$(window).load(function() {
  // 所有资源（包括图片）都已加载完成
});
```

### 9.2 this 的使用

```javascript
$('.button').click(function() {
  // this 指向原生 DOM 元素
  console.log(this.tagName);
  
  // $(this) 是 jQuery 对象
  $(this).addClass('clicked');
});
```

### 9.3 命名空间事件

```javascript
// 使用命名空间便于管理
$('#element').on('click.myNamespace', function() {
  console.log('Namespaced click event');
});

// 移除特定命名空间的事件
$('#element').off('.myNamespace');
```

## 10. 参考资料

### 10.1 官方资源
- [jQuery 官方网站](https://jquery.com/)
- [jQuery API 文档](https://api.jquery.com/)
- [jQuery 学习中心](https://learn.jquery.com/)

### 10.2 社区资源
- [jQuery UI](https://jqueryui.com/) - 官方 UI 库
- [jQuery Mobile](https://jquerymobile.com/) - 移动端框架
- [jQuery 插件库](https://plugins.jquery.com/) - 官方插件仓库

### 10.3 相关工具
- [jQuery CDN](https://code.jquery.com/) - 官方 CDN 服务
- [jQuery Migrate](https://github.com/jquery/jquery-migrate) - 版本迁移工具
- [jQuery Builder](https://jquery.com/download/) - 自定义构建工具
