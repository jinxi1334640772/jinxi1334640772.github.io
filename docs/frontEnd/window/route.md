# 前端路由

## 1. 概述

前端路由是单页应用（SPA）中的核心技术，用于实现页面跳转而无需重新加载整个页面。通过前端路由，我们可以在不向服务器发送请求的情况下改变浏览器的 URL，从而实现页面内容的动态切换。

前端路由主要有两种实现方式：Hash 路由和 History 路由。

## 2. Hash 路由

### 2.1 功能介绍

Hash 路由是在 HTML5 之前解决 SPA 应用路由跳转问题采用的主要解决方案。它利用 URL 中的 hash（#）部分来标识不同的页面状态。

### 2.2 基本特点

- **不触发页面刷新**: hash 变化不会向服务器重新发起请求
- **服务器无感知**: 服务器无法获取到 hash 值
- **监听支持**: 可以通过 `hashchange` 事件监听 hash 值的变化
- **兼容性好**: 支持所有浏览器，包括 IE8+

### 2.3 代码示例

```javascript
// 监听 hash 变化
window.addEventListener('hashchange', function(event) {
  // hash 变化后触发 hashchange 事件
  const newURL = event.newURL;
  const oldURL = event.oldURL;
  const newHash = location.hash;
  
  console.log('Hash changed from:', oldURL, 'to:', newURL);
  console.log('Current hash:', newHash);
  
  // 根据 hash 值做相应操作
  handleRoute(newHash);
});

// 手动设置 hash
function navigateTo(hash) {
  location.hash = hash;
}

// 路由处理函数
function handleRoute(hash) {
  switch(hash) {
    case '#/home':
      showHomePage();
      break;
    case '#/about':
      showAboutPage();
      break;
    case '#/contact':
      showContactPage();
      break;
    default:
      showHomePage();
  }
}
```

## 3. History 路由

### 3.1 功能介绍

History 路由是 HTML5 规范提供的新特性，通过 History API 对浏览器历史栈进行操作，可以实现更加友好的 URL 结构，不需要 # 符号。

### 3.2 基本特点

- **URL 美观**: 不需要 # 符号，URL 更加直观
- **服务器配置**: 需要服务器配置支持，将所有路由指向入口文件
- **现代浏览器**: 需要现代浏览器支持（IE10+）
- **状态管理**: 可以携带状态数据

### 3.3 核心 API

#### pushState()

```javascript
/**
 * 向历史栈顶推送一条新记录
 * @param {Object} state - 需要传递的状态数据，在触发 popstate 事件时可以通过 event.state 获取
 * @param {String} title - 页面标题，目前大多数浏览器忽略此参数，一般传 null
 * @param {String} url - 新的历史记录 URL，必须同源，可以是绝对路径或相对路径
 */
window.history.pushState(state, title, url);

// 示例
history.pushState({page: 'home'}, null, '/home');
```

#### replaceState()

```javascript
/**
 * 替换当前历史记录而不是新建历史记录
 * 参数与 pushState 相同
 */
window.history.replaceState(state, title, url);

// 示例
history.replaceState({page: 'about'}, null, '/about');
```

#### 获取当前状态

```javascript
// 获取当前路由的 state
let currentState = history.state;
console.log('Current state:', currentState);
```

### 3.4 事件监听

```javascript
// 监听浏览器前进后退事件
window.addEventListener('popstate', function(event) {
  const state = event.state;
  const currentPath = location.pathname;
  
  console.log('PopState event triggered');
  console.log('State:', state);
  console.log('Current path:', currentPath);
  
  // 注意：只能监听到浏览器前进后退引起的 URL 改变
  // pushState 和 replaceState 方法不会触发 popstate 事件
  handleRouteChange(currentPath, state);
});

// 路由变化处理函数
function handleRouteChange(path, state) {
  switch(path) {
    case '/home':
      showHomePage(state);
      break;
    case '/about':
      showAboutPage(state);
      break;
    case '/contact':
      showContactPage(state);
      break;
    default:
      show404Page();
  }
}
```

### 3.5 完整示例

```javascript
class Router {
  constructor() {
    this.routes = {};
    this.init();
  }
  
  // 注册路由
  route(path, callback) {
    this.routes[path] = callback;
  }
  
  // 导航到指定路径
  navigate(path, state = {}) {
    history.pushState(state, null, path);
    this.handleRoute(path, state);
  }
  
  // 替换当前路由
  replace(path, state = {}) {
    history.replaceState(state, null, path);
    this.handleRoute(path, state);
  }
  
  // 处理路由
  handleRoute(path, state) {
    const handler = this.routes[path];
    if (handler) {
      handler(state);
    } else {
      console.error('Route not found:', path);
    }
  }
  
  // 初始化
  init() {
    // 监听 popstate 事件
    window.addEventListener('popstate', (event) => {
      this.handleRoute(location.pathname, event.state);
    });
    
    // 处理初始路由
    this.handleRoute(location.pathname, history.state);
  }
}

// 使用示例
const router = new Router();

// 注册路由
router.route('/home', (state) => {
  document.getElementById('app').innerHTML = '<h1>Home Page</h1>';
});

router.route('/about', (state) => {
  document.getElementById('app').innerHTML = '<h1>About Page</h1>';
});

// 导航
router.navigate('/home', {from: 'menu'});
```

## 4. PopState 事件详解

### 4.1 事件对象属性

`popstate` 事件对象包含以下重要属性：

<img src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/3/1713def82c0f88a7~tplv-t2oaga2asx-image.image" alt="PopState 事件对象属性" data-fancybox="gallery" />

### 4.2 事件触发时机

- 用户点击浏览器的前进/后退按钮
- 调用 `history.back()`、`history.forward()`、`history.go()` 方法
- **注意**: `pushState()` 和 `replaceState()` 不会触发 `popstate` 事件

### 4.3 状态管理

```javascript
// 保存复杂状态
const state = {
  page: 'product',
  id: 123,
  filters: {
    category: 'electronics',
    price: { min: 100, max: 500 }
  },
  timestamp: Date.now()
};

history.pushState(state, null, '/product/123');

// 在 popstate 事件中获取状态
window.addEventListener('popstate', function(event) {
  if (event.state) {
    const { page, id, filters, timestamp } = event.state;
    // 根据状态恢复页面
    restorePage(page, id, filters);
  }
});
```

## 5. 最佳实践

### 5.1 路由选择建议

- **Hash 路由**: 适用于简单项目、静态托管、不需要 SEO 的场景
- **History 路由**: 适用于需要 SEO、URL 美观、服务器可配置的场景

### 5.2 注意事项

1. **服务器配置**: History 路由需要服务器将所有路由指向入口 HTML 文件
2. **状态大小**: `pushState` 的 state 参数不宜过大，建议小于 640KB
3. **错误处理**: 要处理路由不存在的情况
4. **性能优化**: 避免频繁调用 `pushState`

### 5.3 常见问题

- 刷新页面后 History 路由 404：需要服务器配置
- 状态丢失：确保在 `popstate` 事件中正确处理状态
- 浏览器兼容性：考虑降级到 Hash 路由

## 6. 参考资料

- [MDN - History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)
- [MDN - PopState Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event)
- [HTML5 History API](https://html.spec.whatwg.org/multipage/history.html)
