## 模板引擎

‌ 模板引擎 ‌ 是一种用于将数据和模板结合生成最终文本输出的工具，广泛应用于软件开发中，特别是在需要生成大量重复格式的文本时，如 HTML 页面、邮件模板、代码文件等。其主要作用是快速生成动态页面、提高开发效率，减少重复代码的编写，同时降低维护成本，使代码更加清晰易懂

其工作原理通常包括以下几个步骤：

- 数据填充 ‌：将业务数据填充到模板中的占位符或标记位置。
- ‌ 模板渲染 ‌：根据数据生成最终的文本输出，如 HTML 页面、邮件内容等。
- ‌ 输出显示 ‌：将生成的文本输出展示给用户。

常见的模板引擎及其特点

- ‌JSP‌：功能强大，支持 Java 代码编写，性能较好，适合官方标准。
- ‌Freemarker‌：性能良好，支持严格的 MVC 分离，使用方便，但用户群体较少。
- ‌Thymeleaf‌：基于 HTML 的模板引擎，支持动静分离，易于与 Spring 框架集成，适合现代 Web 开发。
- art-template： 是一个简约、超快的模板引擎

## sodajs 模板引擎

目前感觉最好用的指令模板引擎。其特性有：

- 超小体积（gzip 之后只有 4K)
- 支持 dom 指令系统
- 良好的兼容性，兼容 ie8 及现代浏览器，兼容 node 环境
- 避免输出的 xss 漏洞
- 高性能 dom 渲染引擎
- 与 AngularJS 指令兼容，使用非常方便
- 自定义指令和前缀

安装：`npm install --save sodajs`

## 使用

```js
import soda from "sodajs";

// 自定义指令前缀，默认前缀时soda-。设置为v-，类似vue模板语法
soda.prefix("v-");

// 自定义过滤器，并接收参数，用法类似vue
soda.filter("nameFilter", function (input, length) {
  return (input || "").substr(0, length);
});

/** 自定义指令
 * scope: 当前的scope数据
 * el: 当前节点
 * expression: 指令的表达式原始字符串
 * parseSodaExpression: 解析soda表达式
 * getValue: 从data链式获取值
 * compileNode: 继续编译节点
 * document: 使用document参数而不是使用window.document, 这样可以在node环境下去用
 */
soda.directive("mydirective", {
  priority: 8,
  link({
    scope,
    el,
    parseSodaExpression,
    expression,
    getValue,
    compileNode,
    document,
  }) {
    // how to compile el
    getValue({ a: { b: 1 } }, "a.b"); // ===>   1
    parseSodaExpression("{{1 + 2 + a}}", { a: 1 }); // ===> 4
    var value = parseSodaExpression(expression);
    if (value) {
      var textNode = document.createTextNode(value);
      el.appendChild(textNode);
    }
  },
});

// 定义子模板
soda.discribe("tmpl1", `<h1>{{name}}</h1>`, {
  compile: false, // 是否编译子模板的变量
});
// 子模板可以定义为函数，接收参数
soda.discribe("tmpl2", function (path) {
  return `<h1>{{name}}_${path}</h1>`;
  // return fs.readFileSync(path, 'utf-8'); // node环境里，返回读取的文件
});

// 定义模板
const tpl = ` 
<div v-if="show">条件渲染, 使用变量：{{name}}</div>
<div v-if="!show">I\'m hidden!</div>

<div v-html="html">渲染原始HTML</div>
<div v-replace="html">用html替换当前结点</div>

<div v-include="tmpl1">使用定义的子模板，替换当前节点</div>
<div v-include="tmpl2:view.html">使用函数形式的子模板接收view.html参数，替换当前节点</div>

<div v-class="show ? 'active' : ''">自定义class</div>
<div v-style="style">自定义style</div>

<div v-checked="{{false}}">false 或者 "", 该属性就会被移除，否则，会被添加上去</div>
<div v-src="hello{{name}}.png">自定义src</div>

<div v-mydirective="add one tips: {{name}}">使用自定义指令</div>

<ul>
    <li v-repeat="(index,item) in list by name" v-if="item.show">
        循环渲染 $index：默认索引，也可以明确索引index dom的key为name
        {{item.name}}
        {{$index}}
        {{index}}
        {{item.name|nameFilter:10}}
    </li>
</ul>
`;

// 定义传入模板的数据
var data = {
  show: true,
  html: '<span style="color:red;">test soda-html</span>',
  style: { width: "100px", height: "100px" },
  list: [
    { name: "Hello", show: true },
    { name: "sodajs", show: true },
    { name: "AlloyTeam" },
  ],
};

document.body.innerHTML = soda(tpl, data);
```

自定义 node 端的 dom 解析引擎。soda.node 版本的默认 dom 解析引擎是 nodeWindow,你可以用这个方法替换为 jsdom 等

```js
var document = require("document");
var soda = require("soda");

soda.setDocument(document);
```
