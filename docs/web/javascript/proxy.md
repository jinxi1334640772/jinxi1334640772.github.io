## 元编程

Proxy 和 Reflect 对象允许拦截并自定义基本语言操作，例如属性查找、赋值、枚举和函数调用等。

## Proxy

创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）

```js
/**
 * @target 要使用 Proxy 包装的目标对象
 * @handler 以函数作为属性的对象，定义在拦截各种操作时，代理对象的行为。
 */
const p = new Proxy(target, handler);

let target = { name: "zhangjinxi", age: 18 };
let handler = {
  // 拦截对象的读取属性操作,receiver:Proxy 或者继承 Proxy 的对象
  get: function (target, property, receiver) {
    return Reflect.get(target, propertyKey[, receiver])
  },
  // 设置属性值操作的捕获器，返回布尔值，是否设置成功。
  set(target, property, value, receiver) {
    // 返回一个 Boolean 值表明是否成功设置属性。
    return Reflect.set(target, propertyKey, value, receiver)
  },
  // 针对 in 操作符的代理方法。
  has: function (target, prop) {
    return Reflect.has(target, propertyKey)
  },
  // 拦截对对象属性的 delete 操作
  deleteProperty: function (target, property) {
    // 返回布尔值
    return Reflect.deleteProperty(target, propertyKey)
  },
  // 拦截对象的 Object.defineProperty() 操作。
  defineProperty: function (target, property, descriptor) {
    // Reflect.defineProperty返回布尔值，代表设置成功或失败
    return Reflect.defineProperty(target, propertyKey, attributes)
  },
  // 是 Object.getOwnPropertyDescriptor() 的钩子。
  getOwnPropertyDescriptor: function (target, prop) {
    return Reflect.getOwnPropertyDescriptor(target, propertyKey)
  },
  // 读取代理对象的原型时
  getPrototypeOf(target) {
    return Reflect.getPrototypeOf(target)
  },
  // 拦截 Object.setPrototypeOf()
  setPrototypeOf: function (target, prototype) {
    return Reflect.setPrototypeOf(target, prototype)
  },
  // 拦截对对象的 Object.isExtensible()
  isExtensible: function (target) {
    return Reflect.isExtensible(target)
  },
  // 对Object.preventExtensions()的拦截
  preventExtensions: function (target) {
    // 返回一个 Boolean 值表明目标对象是否成功被设置为不可扩展。
    return Reflect.preventExtensions(target)
  },
  // Object.getOwnPropertyNames() Object.getOwnPropertySymbols()
  // Object.keys() Reflect.ownKeys()
  ownKeys: function (target) {
    return Reflect.ownKeys(target)
  },
  // 拦截 new 操作符
  construct: function (target, argumentsList, newTarget) {
    return Reflect.construct(target, argumentsList[, newTarget])
  },
  // 拦截函数的调用
  apply: function (target, thisArg, argumentsList) {
    return Reflect.apply(target, thisArgument, argumentsList)
  },
};
let proxy = new Proxy(target, handler);

// 可撤销的Proxy
let revocableProcy = Proxy.revocable(target,handler)
// 表示新生成的代理对象本身
revocableProcy.proxy
// 撤销代理的方法，调用的时候不需要加任何参数
revocableProxy.revoke()
```

> Proxy.revocable() 创建一个可撤销的代理对象

## Reflect

提供拦截 JavaScript 操作的方法。这些方法与 proxy handler 的方法相同。Reflect 不是一个函数对象，因此它是不可构造的。
只是把 Object 和 Function 上的方法移到 Reflect 上，并且 Reflect 上的名称和 Proxy handler 上的拦截方法名一一对应。不在介绍，参考 Proxy。
