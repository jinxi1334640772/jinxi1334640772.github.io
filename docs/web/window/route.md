# 前端路由

## hash路由
hash路由在html5之前，是解决SPA应用路由跳转问题采用的解决方案。hash变化不会向服务器重新发起请求，并且服务器也无法获取到hash值，所以不会触发页面的重新渲染。前端可以通过监听hashchange事件监听hash值的变化。  
```js
//监听hash变化
window.addEventListener('hashchange',function(){
  // hash变化后触发hashchange事件，
  // 这里做相应操作
})
```
## history路由
是html的规范，提供了对history栈的操作，常用api有: 

```js
// 当前history栈顶推送一条记录
/**
 * @state 需要传进去的数据state，在触发popstate事件时，可以在event.state里获取到
 * @title 标题，基本没用，一般传null
 * @url 要推送的新的历史记录url，必须同源。也可以是绝对路径和相对路经，相对当前url。
 */
window.history.pushState(state,title,url)
// 获取当前路由的state
let currentState = history.state;

// 与pushState用法相同，不同的是替换当前历史记录而不是新建历史记录
window.history.replaceState(state,title,url);

window.addEventListener('popstate',function(event){
  const state = event.state
    // 只能监听到浏览器前进后退引起的url改变，
    // pushState和replaceState方法不会触发
})

```
## popstate event事件对象

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/3/1713def82c0f88a7~tplv-t2oaga2asx-image.image)