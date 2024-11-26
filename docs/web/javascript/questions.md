## 中文输入事件

>当监听input事件时，输入英文时，每输入一个字母，就会把这个字母送到输入框内，触发一次input事件。但当输入中文时，每个汉字或者每个词语都需要多次敲击键盘才能完成，未完成前并不需要触发input事件。

此时可以利用composition合成事件：
- `compositionstart` 开始输入时触发
  >在文本合成系统如 IME：input method editor（即输入法编辑器）的文本复合系统打开时触发，表示要开始输入
- `compositionupdate` 更新输入时触发
- `compositionend` 结束输入时触发
  > 在IME的文本复合系统关闭时触发，表示返回正常键盘输入状态(选中文字，输入法消失的那一刻)

代码实现过程：

```js
// 提前定义好一个变量，代表是否合成事件
let isOnComposition = false;
// 定义input事件处理器
handleInput(event){
  // 是合成事件，则结束，不执行input逻辑
  if(isOnComposition) return;
  // 非合成事件，处理input事件逻辑
}

// 定义compositionstart事件处理器
handleCompositionstart(event){
  // 合成事件开始，令isOnComposition=true
  isOnComposition = true;
  // 为true时，不会触发input事件逻辑
}

// 定义compositionend事件处理器
handleCompositionend(event){
  // 合成事件结束，令isOnComposition=false，然后触发一次input事件
  isOnComposition = false;
  handleInput(event)
}

```
## 脚本async和defer属性

> HTML文档中的js脚本文件，默认加载和执行都会阻塞HTML文档的解析和渲染

```js
<script src='/js/xx.js' async></script>
<script src='/js/xx.js' defer></script>

```

- async：异步加载。加载脚本和HTML解析并行，当脚本下载完成后，立即执行脚本，并且暂停HTML的解析。无法保证脚本的执行顺序。
- defer：延迟执行。加载脚本和HTML解析并行，脚本下载完成后并不立刻执行，而是等到HTML文件解析完毕之后在执行。并且脚本的执行顺序和在HTML文档中的书写顺序保持一直。

他们的加载和执行，如图所示：

![tupian](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/3/1713e43a3a39328c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

>如何选择：当多个脚本执行有依赖关系时，使用defer属性，否则使用async属性
## 惰性函数

惰性函数表示函数第一次执行遇到分支时，会被某一分支重写为另一个更合适的函数，以后对原函数的调用就不必在经过分支的判断了。常用来处理兼容性问题

比如对元素添加事件处理器的时候，首先检查是否支持 addEventListener，如果不支持，再检查是否支持 attachEvent（ie 老版本浏览器），如果还不支持，就只能用 dom0 级的方法添加事件。这个过程每次都要执行一遍，实际上如果浏览器支持其中的一种方法，下次调用函数就没必要判断了。这就是惰性函数的应用之一，本质就是函数重写，有两种方法实现：

```js
// 该方法有个缺点，要是函数名称改变的话，修改起来有点麻烦，要修改每个重新赋值的地方。
function addEvent(ele, type, fn) {
  if (ele.addEventListener) {
    addEvent = function (ele, type, fn) {
      ele.addEventListener(type, fn, false);
    };
  } else if (ele.attachEvent) {
    addEvent = function (ele, type, fn) {
      ele.attachEvent("on" + type, fn); //老版本ie浏览器只支持冒泡，所以没有第三个参数，并且事件类型都以on开头，所以要进行拼接
    };
  } else {
    addEvent = function (ele, type, fn) {
      ele["on" + type] = fn;
    };
  }
  return addEvent(ele, type, fn);
}
// 利用自执行函数和闭包，把嗅探浏览器的操作提前到代码加载的时候：在代码加载时就立即进行一次判断，以便让addEvent返回一个包裹了正确逻辑的函数：
let addEvent = (function () {
  if (document.addEventListener) {
    return function (ele, type, fn) {
      ele, addEventListener(type, fn, false);
    };
  } else if (document.attachEvent) {
    return function (ele, type, fn) {
      ele.attachEvent("on" + type, fn);
    };
  } else {
    return function (ele, type, fn) {
      ele["on" + type] = fn;
    };
  }
})();

// 示例2：解决XMLHttpRequest的兼容性问题

//惰性函数

function createXHR() {
  var xhr = null;
  if (typeof XMLHttpRequest != "undefined") {
    xhr = new XMLHttpRequest();
    createXHR = function () {
      // 每次调用createXHR函数，返回不同的实例
      return new XMLHttpRequest();
    };
  } else {
    try {
      xhr = new ActiveXObject("Msxml2.XMLHTTP");
      createXHR = function () {
        return new ActiveXObject("Msxml2.XMLHTTP");
      };
    } catch (e) {
      try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
        createXHR = function () {
          return new ActiveXObject("Microsoft.XMLHTTP");
        };
      } catch (e) {
        createXHR = function () {
          return null;
        };
      }
    }
  }
  return xhr;
}
```
惰性函数的优点：
- 是显而易见的效率问题，虽然在第一次执行的时候函数会意味赋值而执行的慢一些，但是后续的调用会因为避免的重复检测更快；

- 是要执行的适当代码只有当实际调用函数是才执行，很多JavaScript库在在加载的时候就根据浏览器不同而执行很多分支，把所有东西实现设置好，而惰性载入函数将计算延迟，不影响初始脚本的执行时间
## 数组分块技术

> 遇到的问题：当一次执行大量逻辑代码，例如一次性往页面添加大量 dom，就可能导致页面卡死，可以利用数组分块技术处理这个问题。其实就是利用定时器分割循环的技术，在每次时间间隔内只处理一定数量的任务，

函数封装如下：

```js
//循环的数组，处理函数，每次处理数量，时间间隔
function chunk(array, fn, count, delay) {
  // 每次执行start函数，处理count条数据
  let start = function () {
    //每次处理count条数据，如果剩余数据不够count条，就处理array剩余的所有的数据
    count = array.length > count ? count : array.length;
    for (let i = 0; i < count; i++) {
      // 依次处理count条数据
      fn(array.shift());
    }
  };
  return function () {
    // 调用函数，首先处理一组数据，然后计时，delay时间后，继续处理一下组数据，循环这个过程，知道数据处理完毕
    start();
    let timer = setInternal(() => {
      // 如果数组处理完毕，清空定时器，结束循环
      if (array.length === 0) {
        clearInternal(timer);
        return;
      }
      // 还有数据待处理，继续处理下一组数据
      start();
    }, delay);
  };
}
```