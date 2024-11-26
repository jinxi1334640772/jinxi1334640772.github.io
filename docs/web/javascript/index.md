# Javascript

## Javascript 简介

JavaScript（JS）是一种具有函数优先特性的轻量级、解释型或者说即时编译型的编程语言。虽然作为 Web 页面中的脚本语言被人所熟知，但是它也被用到了很多非浏览器环境中，例如 Node.js、Apache CouchDB、Adobe Acrobat 等。进一步说，JavaScript 是一种基于原型、多范式、单线程的动态语言，并且支持面向对象、命令式和声明式（如函数式编程）风格。

JavaScript 的动态特性包括运行时对象的构造、变量参数列表、函数变量、动态脚本创建（通过 eval）、对象内枚举（通过 for...in 和 Object 工具方法）和源代码恢复（JavaScript 函数会存储其源代码文本，可以使用 toString() 进行检索）。

## JavaScript 对象

在 JavaScript 中，大多数事物都是对象，从作为核心功能的字符串和数组，到建立在 JavaScript 之上的浏览器 API 。你甚至可以自己创建对象，将相关的函数和变量高效地封装打包成便捷的数据容器。

JavaScript 内置了一些对象的标准库，比如数组（Array），日期（Date），数学（Math）和一套核心语句，包括运算符、流程控制符以及声明方式等。JavaScript 的核心部分可以通过添加对象来扩展语言以适应不同用途；例如：

- 客户端的 JavaScript 通过提供对象，控制浏览器及其文档对象模型（DOM），来扩展语言核心。例如：客户端的拓展代码允许应用程序将元素放在某个 HTML 表单中，并且支持响应用户事件，比如鼠标点击、表单提交和页面导航。
- 服务端的 JavaScript 则通过提供有关在服务器上运行 JavaScript 的对象来可扩展语言核心。例如：服务端版本直接支持应用和数据库通信，提供应用不同调用间的信息连续性，或者在服务器上执行文件操作。

这意味着，在浏览器中，JavaScript 可以改变网页（DOM）的外观与样式。同样地，在服务器上，Node.js 中的 JavaScript 可以对浏览器上编写的代码发出的客户端请求做出响应。

## JavaScript 和 Java

JavaScript 和 Java 有一些共性但是在另一些方面有着根本性区别。JavaScript 语言类似 Java 但是并没有 Java 的静态类型和强类型检查特性。JavaScript 遵循了 Java 的表达式语法，命名规范以及基础流程控制，这也是 JavaScript 从 LiveScript 更名的原因。

与 Java 通过声明的方式构建类的编译时系统不同，JavaScript 采用基于少量的数据类型如数字、布尔、字符串值的运行时系统。JavaScript 拥有基于原型的对象模型提供的动态继承；也就是说，独立对象的继承是可以改变的。JavaScript 支持匿名函数。函数也可以作为对象的属性被当做宽松的类型方式执行。

与 Java 相比，Javascript 是一门形式自由的语言。你不必声明所有的变量，类和方法。你不必关心方法是否是公有、私有或者受保护的，也不需要实现接口。无需显式指定变量、参数、方法返回值的数据类型。

Java 是基于类的编程语言，设计的初衷就是为了确保快速执行和类型安全。类型安全，举个例子，你不能将一个 Java 整数变量转化为一个对象引用，或者由 Java 字节码访问专有存储器。Java 基于类的模型，意味着程序包含专有的类及其方法。Java 的类继承和强类型要求紧耦合的对象层级结构。这些要求使得 Java 编程比 JavaScript 要复杂的多。

相比之下，JavaScript 传承了 HyperTalk 和 dBASE 语句精简、动态类型等精髓，这些脚本语言为更多开发者提供了一种语法简单、内置功能强大以及用最小需求创建对象的编程工具。

## JavaScript 和 ECMAScript 规范

JavaScript 的标准化组织是 ECMA——这个欧洲信息与通信系统标准化协会提供基于 Javascript 的标准化方案（ECMA 原先是欧洲计算机制造商协会的首字母缩写）。这种标准化版本的 JavaScript 被称作 ECMAScript，在所有支持该标准的应用中以相同的方式工作。公司可以使用开放标准语言来开发他们自己的 JavaScript 实现版本。ECMAScript 标准在 ECMA－262 规范中进行文档化。

## 数据类型

最新的 ECMAScript 标准定义了 8 种数据类型：

七种基本数据类型：

1. Boolean，有 2 个值分别是：true 和 false。
2. null，一个表明 null 值的特殊关键字。JavaScript 是大小写敏感的，因此 null 与 Null、NULL 或变体完全不同。
3. undefined，和 null 一样是一个特殊的关键字，undefined 表示变量未赋值时的属性。
4. Number，整数或浮点数，例如： 42 或者 3.14159。
5. BigInt，任意精度的整数，可以安全地存储和操作大整数，甚至可以超过数字的安全整数限制。
6. String，字符串是一串表示文本值的字符序列，例如："Howdy"。
7. Symbol，一种实例是唯一且不可改变的数据类型。

引用类型：

- Object 
  - Function
  - Array
  - Date
  - RegExp
  - Error

## label 语句

一个 label 提供了一个让你在程序中其他位置引用它的标识符。例如，你可以用 label 标识一个循环，然后使用 break 或者 continue 来指出程序是否该停止循环还是继续循环。

```js
var num = 0;
outPoint: for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    if (i == 5 && j == 5) {
      // 在 i = 5，j = 5 时，跳出所有循环，而不是仅跳出j循环
      // 返回到整个 outPoint 下方，继续执行
      break outPoint;
    }
    num++;
  }
}

alert(num); // 输出 55
```
## 类和构造函数的区别
- 类的调用必须使用new 关键字
- 类的声明不会被提升
- 类的内部默认开启严格模式