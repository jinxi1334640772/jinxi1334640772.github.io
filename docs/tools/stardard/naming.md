## 文档规范

使用 HTML5 的文档声明类型 `<!DOCTYPE html>` 来开启标准模式。
若不添加该声明，浏览器会开启怪异模式，按照浏览器自己的解析方式渲染页面，那么，在不同的浏览器下面可能会有不同的样式。

```html
<!-- HTML5文档声明使用标准模式 -->
<!DOCTYPE html>
<!-- 定义文档使用的语言，浏览器会根据语言进行排版和格式化 -->
<html lang="en">
  <head>
    <!-- 统一使用 UTF-8 编码，避免乱码问题。 -->
    <meta charset="UTF-8" />
    <!-- 移动端定义视口宽度 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- 使用语义化标签代替div进行布局 -->
    <header>
      <section>
        <nav></nav>
      </section>
    </header>
  </body>
</html>
```

## 命名方式

- Pascal Case 大驼峰式命名法：首字母大写。eg：StudentInfo、UserInfo、ProductInfo
- Camel Case 小驼峰式命名法：首字母小写。eg：studentInfo、userInfo、productInfo
- 烤串命名法：全部小写，单词用`-`分割。eg：student-info、user-info

## 文件资源命名

- 使用烤串命名法。
- 文件名不得含有空格。
- 建议只使用小写字母，不使用大写字母。( 为了醒目，某些说明文件的文件名，可以使用大写字母，比如 README、LICENSE。 )
- 引入资源使用相对路径，不要指定资源所带的具体协议 ( http:,https: ) ，除非这两者协议都不可用。

```js
// 推荐
<script src="//cdn.bootcss.com/vue/2.6.10/vue.common.dev.js"></script>
// 不推荐：
<script src="https://cdn.bootcss.com/vue/2.6.10/vue.common.dev.js"></script>
```

## 变量命名

- 命名方式 : 小驼峰式命名方法
- 命名规范 : 类型+对象描述的方式，如果没有明确的类型，就可以使前缀为名词。类型有：
  - function
  - boolean
  - string
  - object
  - array
  - int

```js
// 推荐
var tableTitle = "LoginTable";
// 不推荐：
var getTitle = "LoginTable";
```

## 常量命名

- 命名方法 : 全部大写
- 命名规范 : 使用大写字母和下划线来组合命名，下划线用以分割单词。

```js
const MAX_COUNT = 10;
const URL = "https://www.yuque.com/wuchendi/fe";
```

## 函数命名

- 命名方式 : 小驼峰方式 ( 构造函数使用大驼峰命名法 )
- 命名规则 : 前缀为动词
  - can：判断是否可执行某个动作
  - has：判断是否含有某个值
  - is：判断是否为某个值
  - get：获取某个值
  - set：设置某个值

## CSS class 命名

使用 BEM 规范。‌BEM 规范 ‌（Block, Element, Modifier）是一种基于组件化的前端开发方式，旨在提升界面开发效率和代码复用性。它包含四个主要概念：Block、Element、Modifier 和 Mix。

- ‌Block‌：Block 是页面上的独立功能单元，可以重复使用。例如，一个按钮或一个菜单都可以是一个 Block。Block 的命名应该描述其用途而不是状态，例如使用“button”而不是“red-button”‌
- ‌Element‌：Element 是 Block 的一部分，只能在 Block 的上下文中使用。例如，一个按钮的图标可以是一个 Element。Element 的命名应该明确其在 Block 中的作用 ‌
- ‌Modifier‌：Modifier 用于定义 Block 和 Element 的外观、状态和行为。例如，一个按钮可以有不同的状态（如禁用、激活），这些状态可以通过 Modifier 来定义 ‌
  ‌- Mix‌：Mix 允许组合多个 BEM 实体，提供更灵活的样式定义方式 ‌

BEM 的命名规则通过双下划线`__`和双连字符（--）来区分 Block、Element 和 Modifier。具体规则：`block__element--modifier‌`

BEM 的优势：

- ‌ 可读性强 ‌：通过明确的命名方式，开发者可以快速理解类名所代表的意义 ‌
- ‌ 易于维护 ‌：结构化的 CSS 使得代码更容易维护和扩展 ‌
- ‌ 降低冲突风险 ‌：使用特定的命名模式减少了类名之间的冲突，增强了代码的可预测性 ‌
- ‌ 促进团队协作 ‌：统一的命名规范使得团队成员更容易理解彼此编写的代码，促进了协作效率 ‌
