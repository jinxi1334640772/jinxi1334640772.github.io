# Set 和 Map 数据结构详解

JavaScript 提供了多种集合数据结构，包括 Set、WeakSet、Map、WeakMap 和 WeakRef。这些数据结构各有特点，适用于不同的使用场景。

## 1. Set

Set 对象允许你存储任何类型（无论是原始值还是对象引用）的唯一值。Set 中的值只能出现一次。

### 实例属性和方法

- `size` - 返回 Set 对象中值的数量
- `add(value)` - 向 Set 对象添加一个值
- `delete(value)` - 从 Set 对象中删除一个值
- `has(value)` - 检查 Set 对象中是否存在某个值
- `clear()` - 清空 Set 对象中的所有值
- `keys()` - 返回一个迭代器，包含 Set 对象中所有值
- `values()` - 返回一个迭代器，包含 Set 对象中所有值
- `entries()` - 返回一个迭代器，包含 Set 对象中所有值的键值对
- `forEach(callback)` - 遍历 Set 对象中的每个值
- `[Symbol.iterator]()` - 返回默认迭代器
- `[Symbol.toStringTag]` - 对象的字符串标签

### 基本用法示例

```javascript
const mySet = new Set();
mySet.add(1);
mySet.add(2);
mySet.add(2); // 重复值不会被添加
console.log(mySet.size); // 2
console.log(mySet.has(1)); // true
```

## 2. WeakSet

WeakSet 是可被垃圾回收的值的集合，包括对象和非全局注册的符号。WeakSet 中的值只能出现一次。

> **注意：** WeakSet 中的对象引用为弱引用，这也意味着集合中没有存储当前值的列表。所以 WeakSet 是不可枚举的。

### 实例属性和方法

- `[Symbol.toStringTag]` - 对象的字符串标签
- `add(value)` - 向 WeakSet 添加一个对象
- `delete(value)` - 从 WeakSet 中删除一个对象
- `has(value)` - 检查 WeakSet 中是否存在某个对象

### 基本用法示例

```javascript
const ws = new WeakSet();
const obj = {};
ws.add(obj);
console.log(ws.has(obj)); // true
```

## 3. Map

Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值（对象或者原始值）都可以作为键或值。Map 中的一个键只能出现一次。

### 实例属性和方法

- `size` - 返回 Map 对象中键值对的数量
- `get(key)` - 根据键获取值
- `set(key, value)` - 设置键值对
- `has(key)` - 检查 Map 对象中是否存在某个键
- `delete(key)` - 删除指定的键值对
- `clear()` - 清空 Map 对象中的所有键值对
- `keys()` - 返回一个迭代器，包含 Map 对象中所有键
- `values()` - 返回一个迭代器，包含 Map 对象中所有值
- `entries()` - 返回一个迭代器，包含 Map 对象中所有键值对
- `forEach(callback)` - 遍历 Map 对象中的每个键值对
- `[Symbol.iterator]()` - 返回默认迭代器

### Map.groupBy() 静态方法

`Map.groupBy()` 类似 `Object.groupBy()`，但是可以用对象作为分组的 key。

```javascript
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

### Object 和 Map 的比较

| 维度 | Map | Object |
|------|-----|--------|
| 意外的键 | Map 可以安全地与用户提供的键值一起使用 | Object 有原型，因此它包含默认的键，如果不小心的话，它们可能会与你自己的键相冲突 |
| 安全性 | Map 默认不包含任何键。它只包含显式存入的键值对 | 在 Object 上设置用户提供的键值对可能会允许攻击者覆盖对象的原型，这可能会导致对象注入攻击 |
| 键的类型 | Map 的键可以为任何值（包括函数、对象或任何原始值） | Object 的键必须为 String 或 Symbol |
| 键的顺序 | Map 中的键以简单、直接的方式排序：Map 对象按照插入的顺序迭代条目、键和值 | 尽管现在普通的 Object 的键是有序的，但情况并非总是如此，并且其排序比较复杂 |
| 大小 | Map 中的项目数量很容易从其 size 属性中获得 | 确定 Object 中的项目数量通常更麻烦，效率也较低。一种常见的方法是通过获取 Object.keys() 返回的数组的长度 |
| 迭代 | Map 是可迭代对象，所以它可以直接迭代 | Object 没有实现迭代协议，因此对象默认情况下不能直接通过 JavaScript 的 for...of 语句进行迭代 |
| 性能 | 在涉及频繁添加和删除键值对的场景中表现更好 | 未针对频繁添加和删除键值对进行优化 |
| 序列化支持 | Map 默认没有对序列化或解析的原生支持 | 原生支持使用 JSON.stringify() 序列化 Object 到 JSON，原生支持使用 JSON.parse() 解析 JSON 为 Object |

## 4. WeakMap

WeakMap 是一种键值对的集合，其中的键必须是对象或非全局注册的符号，且值可以是任意的 JavaScript 类型，并且不会创建对它的键的强引用。这也意味着没有存储当前值的列表，所以 WeakMap 是不可枚举的。

### 实例属性和方法

- `get(key)` - 根据键获取值
- `set(key, value)` - 设置键值对
- `has(key)` - 检查 WeakMap 中是否存在某个键
- `delete(key)` - 删除指定的键值对

### 基本用法示例

```javascript
const wm = new WeakMap();
const obj = {};
wm.set(obj, "value");
console.log(wm.get(obj)); // "value"
```

## 5. WeakRef

WeakRef 可作为对象的弱引用，这个弱引用被称为该 WeakRef 对象的 target 或者是 referent。

### 实际应用示例

```javascript
/**
 * 使用 WeakRef 在一个 DOM 元素中启动一个计数器，
 * 当这个元素不存在时停止计数器
 */
class Counter {
  constructor(element) {
    // 保存 DOM element 的弱引用
    this.ref = new WeakRef(element);
    this.start();
  }

  start() {
    if (this.timer) {
      return;
    }
    
    this.count = 0;
    const tick = () => {
      // 从 WeakRef 中获取弱引用
      const element = this.ref.deref();
      if (element) {
        element.textContent = ++this.count;
      } else {
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

// 使用示例
const counter = new Counter(document.getElementById("counter"));
counter.start();

// 5秒后移除元素，计数器会自动停止
setTimeout(() => {
  document.getElementById("counter").remove();
}, 5000);
```

## 6. 最佳实践

### 使用场景建议

1. **Set** - 适用于需要存储唯一值的场景
2. **WeakSet** - 适用于存储对象的弱引用集合
3. **Map** - 适用于需要非字符串键的键值对存储
4. **WeakMap** - 适用于存储对象的私有数据或元数据
5. **WeakRef** - 适用于需要弱引用的高级场景

### 注意事项

- WeakSet 和 WeakMap 的键必须是对象
- WeakRef 主要用于高级场景，需要谨慎使用
- 弱引用不会阻止垃圾回收，可能会导致意外的行为

## 7. 参考资料

- [MDN - Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - WeakSet](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
- [MDN - WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - WeakRef](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)
