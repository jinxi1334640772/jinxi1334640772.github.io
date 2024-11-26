# prefetch

>利用浏览器空闲时间，预加载用户未来可能会用到的资源。告诉浏览器这个资源将来可能需要，但是什么时间加载这个资源是由浏览器来决定的。若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源。

使用方式如下：
```html
// 通过 Link 标签进行创建：
<link rel='prefetch' href='/js/xx.js'>
```

# preload

> 预加载那些在页面加载完成后就立即要用的资源，使得必需的资源等到更早加载，这样不容易阻塞页面的初步渲染，进而提升性能和用户体验。是一个声明式 fetch，可以强制浏览器在不阻塞 document 的 onload 事件的情况下请求资源。

使用方式如下：

```html
// 方式一：通过 Link 标签进行创建：
<link rel='preload' as='script' href='/js/xx.js'>

// 方式二：在 HTTP 响应头中加上 preload 字段：这种方式比通过 Link 方式加载资源方式更快，请求在返回还没到解析页面的时候就已经开始预加载资源了。
Link: <https://example.com/other/styles.css>; rel=preload; as=style
```
需要用as属性指定资源类型，浏览器根据as属性判断请求资源的优先级。没有as属性的，被看作异步请求。目前可用资源类型有： 

- audio:音频文件
- video:视频文件
- style:style样式表文件
- font:字体文件
- image:图片文件
- script:JavaScript脚本文件
- document:一个将要被嵌入到内部的HTML文档
- embed:一个将要被插入到元素内部的资源
- fetch:通过fetch或XHR请求获取的资源，例如：ArrayBuffer或json文件
- object:一个将要被嵌入到元素内的文件
- track:WebVTT文件
- worker:web worker或shared worker的JavaScript文件

对于 preload 来说，一旦页面关闭了，它就会立即停止 preload 获取资源，而对于 prefetch 资源，即使页面关闭，prefetch 发起的请求仍会进行不会中断。