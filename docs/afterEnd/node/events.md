## node events事件模块
大多数时候不需要创建eventEmitter实例，因为支持事件响应的核心模块，fs,http....,都是eventEmitter的实例，都有各自内定的事件

此事件机制有些像观察者模式
- 定义事件监听器函数
- 通过`on`注册事件监听器，观察事件是否触发
- 通过`emit`派发事件，事件监听器观测到事件触发，执行事件监听器逻辑
```js
let events = require('events') //引入events模块
let eventEmitter = new events.EventEmitter() //创建events实例

/**
 * 定义事件监听器函数
 * 参数都是emit是传过来的
 */
methodsOne =  (qq,ww)=>{ 
    console.log(qq,ww,'111');
} 
methodsTwo = (qq,ww)=>{
    console.log(qq,ww,'2222')
}

/**
 * 通过on注册事件监听器：可以添加多个监听器
 * @eventName
 * @handler
 */
eventEmitter.on('zhangjinxi',methodsOne)
eventEmitter.on('zhangjinxi',methodsTwo)
/**
 * 注册只会执行一次的监听器
 */
eventEmitter.once('onceEventName',methodsTwo)

/**
 * 通过emit派发事件：
 * @eventName
 * @args 后面都是传给事件监听器的参数
 */
eventEmitter.emit('zhangjinxi','这是参数1','这是参数2'); 


/**
 * 设置监听器的最大个数，默认最多10个
 * @num <integer> 最多数目
 */
eventEmitter.setMaxListeners(number)

/**
 * 获取某事件的所有监听器
 * @eventName
 * @return <Array> 事件名对应的监听器数组
 */
let handlerList = eventEmitter.listeners('zhangjinxi') 

/**
 * 获取某个事件监听器的个数
 * @eventName
 * @return <integer> 事件名对应的监听器个数
 */
let eventNum = eventEmitter.listenerCount('zhangjinxi') 

/**
 * 移除事件监听器
 * @eventName
 * @handler 要移除的监听器
 */
eventEmitter.removeListener('zhangjinxi',methodsOne) 

/**
 * 移除所有事件监听器
 * @eventNameList <Array> 要移除监听器的事件名字数组
 */
eventEmitter.removeAllListeners(['zhangjinxi'])

```