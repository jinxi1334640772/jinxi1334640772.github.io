# 图片优化

## 图片格式

目前在前端的开发中常用的图片格式有 jpg、png、gif，png8、png24、png32、svg 和 webp

- gif 是无损的，具有文件小、支持动画及透明的优点。但 gif 无法支持半透明，且仅支持 8bit 的索引色，即在整个图片中，只能存在 256 种不同的颜色。gif 是一种逐渐被抛弃的图片格式。png 格式的出现就是为了替代它。由于 gif 支持动画的这个“一招鲜”的本领，在网络中仍然占有一席之地，主要用于一些小图标
- jpg 又称为 jpeg，是有损的，但采用了直接色，保证了色彩的丰富性。jpg 图片支持透明和半透明，所有空白区域填充白色。jpg 格式主要用于高清图、摄影图等大图

- png8 是无损的，是 png 的索引色版本。png 是 gif 格式的替代者，在相同图片效果下，png8 具有更小的文件体积，且支持透明度的调节。但 png8 不支持半透明，也不支持动画
- png24 是无损的，是 png 的直接色版本。支持透明，也支持半透明，但文件体积较大。png24 的目标是替换 jpg。但一般而言，png24 的文件大小是 jpg 的 5 倍之多，但显示效果却只有一点点提升
- png32 是在 png24 的基础上，添加了 8 位的 alpha 通道信息，可以支持透明和半透明，且支持图层，辅助线等复杂数据的保存。使用 ps 导出的透明的 png24 图片，实际上是阉割版的 png32，因为只有 32 位的 png 图片才支持透明，阉割版是说导出的图片不支持图层
- svg 是无损的矢量图。svg 与上面这些图片格式最大的不同是，上面的图片格式都是位图，而 svg 是矢量图，具有无论如何缩放都不会失真，非常适用于绘制 logo、图标等
- WebP 格式是 Google 于 2010 年发布的一种支持有损压缩和无损压缩的图片文件格式，派生自图像编码格式 VP8。它具有较优的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量，同时具备了无损和有损的压缩模式、Alpha 透明以及动画的特性，在 JPEG 和 PNG 上的转化效果都非常优秀、稳定和统一。

## 懒加载

图片延迟加载也称为懒加载，延迟加载图片或符合某些条件时才加载某些图片，通常用于图片比较多的网页。可以减少请求数或者延迟请求数，优化性能。一般会在图片进入可视区域时加载，这个主要监控滚动条实现，一般距离用户看到的底边很近的时候开始加载，这样能保证用户下拉时图片正好接上，不会有太长时间的停顿

1、待加载的图片默认加载一张占位图

2、使用 data-src 属性保存真正地址

3、当触发某些条件时，自动改变该区域的图片的 src 属性为真实的地址

4、图片加载完成时，移除占位图

```html
<img data-src="./images/1.jpg" alt="" />

<script>
  // 使用getBoundingClientRect() 实现
  const oList = document.getElementById("list");
  const viewHeight = oList.clientHeight;
  const eles = document.querySelectorAll("img[data-src]");
  const lazyLoad = () => {
    Array.prototype.forEach.call(eles, item => {
      const rect = item.getBoundingClientRect();
      if (rect.top <= viewHeight && !item.isLoaded) {
        item.isLoaded = true;
        const oImg = new Image();
        oImg.onload = () => {
          item.src = oImg.src;
        };
        oImg.src = item.getAttribute("data-src");
      }
    });
  };
  const throttle = (fn, wait = 100) => {
    return function () {
      if (fn.timer) return;
      fn.timer = setTimeout(() => {
        fn.apply(this, arguments);
        fn.timer = null;
      }, wait);
    };
  };
  lazyLoad();
  oList.addEventListener("scroll", throttle(lazyLoad));

  // 每次调用getBoundingClientRect()，都会触发回流，严重影响性能
  // 使用IntersectionObserver() 实现
  const imgs = document.querySelectorAll("img[data-src]");
  var options = {
    root: document.querySelector("#scrollArea"),
    rootMargin: "0px",
    threshold: 0.1,
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.time;
      entry.rootBounds;
      entry.boundingClientRect;
      entry.intersectionRect;
      entry.intersectionRatio;
      entry.target;
      entry.isIntersecting;

      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        io.unobserve(img);
        img.onload = () => {
          console.log("图片移除占位图");
          img.removeAttribute("data-src");
          img.classList.remove("lazy");
        };
      }
    });
  }, options);
  imgs.forEach(img => {
    io.observe(img);
    img.classList.add("lazy");
  });
</script>
```

## 预加载

提前加载用户所需的图片，保证图片快速、无缝发布，使用户在浏览器网站时获得更好用户体验。常用于图片画廊等应用中。  以下几个场景中，可以使用图片预加载：

1、在首屏加载之前，缩短白屏时间

2、在空闲时间为 SPA 的下一屏预加载

3、预测用户操作，预先加载数据

```html
<script>
  // 1、使用页面无用元素的背景图片来进行图片预加载
  function preLoadImg() {
    preload1.style.background = "url('img/img1.gif')";
    preload2.style.background = "url('img/img2.gif')";
    preload3.style.background = "url('img/img3.gif')";
    preload4.style.background = "url('img/img4.gif')";
  }
  // 2、通过new Image()或document.createElement('img')创建img标签，然后通过img的src属性来加载图片
  function preLoadImg() {
    var array = [
      "img/img1.gif",
      "img/img2.gif",
      "img/img3.gif",
      "img/img4.gif",
    ];
    var aImages = [];
    let image = new Image();
    for (var i = 0; i < array.length; i++) {
      aImages[i] = new Image();
      aImages[i].src = array[i];
    }
  }
  window.onload = function () {
    preLoadImg();
  };
  // 3、通过XHR对象发送ajax请求来获取图片，但只能获取同域图片

  // 4、使用插件vue-lazyload，可以实现图片的懒加载、使用webp图片等效果
  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: "dist/error.png",
    loading: "dist/loading.gif",
    attempt: 1,
    listenEvents: ["scroll"],
    // set observer to true
    observer: true,

    // optional
    observerOptions: {
      rootMargin: "0px",
      threshold: 0.1,
    },
  });
  // preLoad    预加载的宽高比    1.3    Number
  // error      图片加载失败时使用的图片源    'data-src'    String
  // loading    图片加载的路径    'data-src'    String
  // attempt    尝试加载次数    3    Number
  // listenEvents    想让vue监听的事件    ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
  // adapter    动态修改元素属性    { }
  // filter     图像的SRC过滤器    { }
  // lazyComponent    懒加载组件    false
</script>
```
