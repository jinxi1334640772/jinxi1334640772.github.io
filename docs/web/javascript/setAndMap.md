## Set

Set 对象允许你存储任何类型（无论是原始值还是对象引用）的唯一值。实例属性和方法：

- `size`
- `add()`
- `has()`
- `delete()`
- `clear()`
- `keys()`
- `values()`
- `entries()`
- `forEach()`
- `[Symbol.iterator]()`
- `[Symbol.toStringTag]`

## WeakSet

WeakSet 是可被垃圾回收的值的集合，包括对象和非全局注册的符号。WeakSet 中的值只能出现一次。

> WeakSet 中的对象应用为弱引用，这也意味着集合中没有存储当前值的列表。所以 WeakSet 是不可枚举的。
> 实例属性和方法：

- `[Symbol.toStringTag]`
- `add()`
- `has()`
- `delete()`

## Map

Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值（对象或者原始值）都可以作为键或值。Map 中的一个键只能出现一次。实例属性和方法：

- `size`
- `get()`
- `set()`
- `has()`
- `delete()`
- `clear()`
- `keys()`
- `values()`
- `entries()`
- `forEach()`
- `[Symbol.iterator]()`
- `Map.groupBy()` 类似 Object.groupBy()，但是可以用对象作为分组的 key。

  ```js
  const inventory = [
    { name: "asparagus", type: "vegetables", quantity: 9 },
    { name: "bananas", type: "fruit", quantity: 5 },
    { name: "goat", type: "meat", quantity: 23 },
    { name: "cherries", type: "fruit", quantity: 12 },
    { name: "fish", type: "meat", quantity: 22 },
  ];

  const restock = { restock: true };
  const sufficient = { restock: false };
  const result = Map.groupBy(inventory, ({ quantity }) =>
    quantity < 6 ? restock : sufficient
  );
  console.log(result.get(restock));
  // [{ name: "bananas", type: "fruit", quantity: 5 }]
  ```

  Object 和 Map 的比较：
  |维度|Map|Object|
  |----|----|----|
  |意外的键|Map 可以安全地与用户提供的键值一起使用。|Object 有原型，因此它包含默认的键，如果不小心的话，它们可能会与你自己的键相冲突。|
  |安全性|Map 默认不包含任何键。它只包含显式存入的键值对|在 Object 上设置用户提供的键值对可能会允许攻击者覆盖对象的原型，这可能会导致对象注入攻击。就像意外的键问题一样，这也可以通过使用 null 原型对象来缓解。|
  |键的类型|Map 的键可以为任何值（包括函数、对象或任何原始值）。|Object 的键必须为 String 或 Symbol。|
  |键的顺序|Map 中的键以简单、直接的方式排序：Map 对象按照插入的顺序迭代条目、键和值。|尽管现在普通的 Object 的键是有序的，但情况并非总是如此，并且其排序比较复杂的。因此，最好不要依赖属性的顺序。|
  |大小|Map 中的项目数量很容易从其 size 属性中获得。|确定 Object 中的项目数量通常更麻烦，效率也较低。一种常见的方法是通过获取 Object.keys() 返回的数组的长度。|
  |迭代|Map 是可迭代对象，所以它可以直接迭代。|Object 没有实现迭代协议，因此对象默认情况下不能直接通过 JavaScript 的 for...of 语句进行迭代。|
  |性能|在涉及频繁添加和删除键值对的场景中表现更好。|未针对频繁添加和删除键值对进行优化。|
  |没有对序列化或解析的原生支持|Map 默认不包含任何键。它只包含显式存入的键值对|原生支持使用 JSON.stringify() 序列化 Object 到 JSON。原生支持使用 JSON.parse() 解析 JSON 为 Object。|

## WeakMap

一种键值对的集合，其中的键必须是对象或非全局注册的符号，且值可以是任意的 JavaScript 类型，并且不会创建对它的键的强引用，这也意味着没有存储当前值的列表。所以 WeakMap 是不可枚举的。其实例属性和方法有：

- `get()`
- `set()`
- `has()`
- `delete()`

## WeakRef

可作为对象的弱引用，这个弱引用被称为该 WeakRef 对象的 target 或者是 referent。

```js
/**使用WeakRef，在一个 DOM 元素中启动一个计数器，当这个元素不存在时停止： */
class Counter {
  constructor(element) {
    // Remember a weak reference to the DOM element
    this.ref = new WeakRef(element);
    this.start();
  }

  start() {
    if (this.timer) {
      return;
    }

    this.count = 0;

    const tick = () => {
      // Get the element from the weak reference, if it still exists
      const element = this.ref.deref();
      if (element) {
        element.textContent = ++this.count;
      } else {
        // The element doesn't exist anymore
        console.log("The element is gone.");
        this.stop();
        this.ref = null;
      }
    };

    tick();
    this.timer = setInterval(tick, 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }
}

const counter = new Counter(document.getElementById("counter"));
counter.start();
setTimeout(() => {
  document.getElementById("counter").remove();
}, 5000);
```
