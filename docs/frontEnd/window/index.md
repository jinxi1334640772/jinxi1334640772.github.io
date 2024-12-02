## Window简介
window 对象表示一个包含 DOM 文档的窗口，其 document 属性指向窗口中载入的 DOM 文档 。

使用 document.defaultView 属性可以获取指定文档所在窗口。

代表了脚本正在运行的窗口的 window 全局变量，被暴露给 Javascript 代码。

Window 接口是各种函数、命名空间、对象和构造函数的家，它们不一定与用户界面窗口的概念直接相关。然而，Window 接口是一个可以包含这些需要全局可用的项目的合适的地方。其中很多内容都在 JavaScript 参考和 DOM 参考中有所记载。

在标签式浏览器中，每个标签都由自己的 Window 对象表示；在特定标签中运行的 JavaScript 代码所看到的全局 window 总是代表代码所运行的标签。也就是说，即使在标签浏览器中，一些属性和方法仍然适用于包含标签的整个窗口，如 resizeTo() 和 innerHeight。一般来说，任何不能合理地与标签有关的东西都与窗口有关。

Window对象继承自EventTarget对象。