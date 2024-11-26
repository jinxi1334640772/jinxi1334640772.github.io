### AJAX
> Asynchronous JavaScript And XML。通过Ajax进行网络请求，可以动态获取服务端数据，从而局部刷新页面，拥有更好的用户体验。并且Ajax使用新的线程进行网络请求，不会阻塞页面的解析和渲染，性能更好。

## 1. Ajax的使用方法
```js
# 创建XHR对象
let xhr = new XMLHttpRequest();
# 构建XHR请求
xhr.open(method,url,isAsync,user,password);
# 需要的话，设置请求头部字段
xhr.setRequestHeader('Accept','*/*');
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
# 监听readystatechange事件
xhr.onreadystatechange=function(){
    if(xhr.readyState === 4){
        if(xhr.status === 200){
            console.log("发送成功！");
        }else{
        console.log("发送失败");
        }
    }
}
# 发送XHR请求，post请求时，content为请求数据：序列化参数或者FormData对象
xhr.send(content);
```
## 2. Ajax XHR对象的属性、方法

```js
{
    readyState:0|1|2|3|4; //xhr对象的状态， 0:xhr对象创建，未初始化1：open方法调用，2：send方法调用，此时可以获取到头部信息，3：内容正在下载中，4：下载成功。
    status:1XX|2XX|3XX|4XX|5XX,//服务器响应的 http 状态码, 1XX:需要继续处理，2XX：响应成功，3XX：重定向，4XX：客户端错误，5XX：服务器错误。
    statusText:'ok',// 状态码简短描述
    responseText,// 服务器响应text内容
    responseXML,// 服务器响应XML内容
    responseType:'arrrybuffer', // 设置服务器响应内容类型。
    timeout:2000,// 超时时间2000毫秒，和setRequestHeader()一样需要放在open和send之间。
    withCredentials:true,// 跨域CORS默认不发送cookie,如想支持可设置为true，并且服务端设置响应头部Access-Control-Allow-Origin,Access-Control-Allow-Credentials:true。
    open(method,url,isAsync,user,password),// method：请求方法get|post|head|put|delete,url:请求地址，isAsync：是否异步，默认true，user：认证用户名，password：认证密码。
    send(data),
    setRequestHeader(header，value),// 设置请求头部信息。
    onreadystatechange,// 监听readystatechange事件
    onload,// onload事件
    upload,// 上传时的upload对象，可以监测上传相关的事件，例如：onprogress
}
```
## 3. Ajax事件

| 事件名 | 描述 |
| --- | --- |
|  onreadystatechange|  当xhr对象的状态码readyState改变时触发|
|  onloadstart|  开始获取数据|
|  onprogress|  数据获取中|
|  onabort|  数据获取被取消|
|  onerror|  数据获取失败|
|  ontimeout|  数据获取超时|
|  onloadend|  数据获取结束（不管成功失败）|
|  onload|  数据获取成功|
