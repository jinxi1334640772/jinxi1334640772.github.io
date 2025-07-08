---
title: JavaScript 包装对象
description: 详细介绍 JavaScript 中的包装对象，包括 Array、BigInt、Function、Number、Object、String、Symbol 等对象的属性和方法
outline: deep
---

# JavaScript 包装对象

JavaScript 中的包装对象为原始数据类型提供了丰富的属性和方法。本文档详细介绍了各种包装对象的特性和用法。

## Array

Array 对象提供了丰富的数组操作方法：

### 基本属性

- **`length`** - 返回最后一个元素的 index+1 作为 length（不等于数组元素个数）

### 实例方法

#### copyWithin()

浅复制数组的一部分到同一数组中的另一个位置，不会改变原数组的长度。

```javascript
/**
 * @param {number} target - 序列开始替换的目标位置，以 0 为起始的下标表示，且将被转换为整数，可负值
 * @param {number} start - 要复制的元素序列的起始位置，以 0 为起始的下标表示，且将被转换为整数
 * @param {number} end - 要复制的元素序列的结束位置，以 0 为起始的下标表示，且将被转换为整数
 */
copyWithin(target);
copyWithin(target, start);
copyWithin(target, start, end);

const array = ["a", "b", "c", "d", "e"];

// 将索引 3 处的元素复制到索引 0 处
console.log(array.copyWithin(0, 3, 4));
// 输出: ["d", "b", "c", "d", "e"]
```

#### fill()

用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。

```javascript
/**
 * @param {*} value - 用来填充数组元素的值。注意所有数组中的元素都将是这个确定的值
 * @param {number} start - 基于零的索引，从此开始填充，转换为整数
 * @param {number} end - 基于零的索引，在此结束填充，转换为整数。fill() 填充到但不包含 end 索引
 */
fill(value);
fill(value, start);
fill(value, start, end);

const array = ["a", "b", "c", "d", "e"];
console.log([1, 2, 3].fill(4, 1)); // [1, 4, 4]
```

#### toReversed()

`reverse()` 方法对应的复制版本。它返回一个元素顺序相反的新数组。

```javascript
const items = [1, 2, 3];
console.log(items); // [1, 2, 3]

const reversedItems = items.toReversed();
console.log(reversedItems); // [3, 2, 1]
console.log(items); // [1, 2, 3] - 原数组不变
```

#### toSorted()

`sort()` 方法对应的复制版本。它返回一个新数组，其元素按升序排列。

```javascript
// 不传入函数
toSorted();

// 传入箭头函数
toSorted((a, b) => {
  /* … */
});

// 传入比较函数，如果省略，则将数组元素转换为字符串，
// 然后根据每个字符的 Unicode 码位值进行排序
toSorted(compareFn);

// 内联比较函数
toSorted(function compareFn(a, b) {
  /* … */
});
```

#### toSpliced()

`splice()` 方法对应的复制版本。它返回一个新数组，并在给定的索引处删除和/或替换了一些元素。

```javascript
toSpliced(start);
toSpliced(start, deleteCount);
toSpliced(start, deleteCount, item1);
toSpliced(start, deleteCount, item1, item2, itemN);
```

## BigInt

表示任意大的整数。与 Number 类型相比有几个关键不同点：

::: warning 注意事项
- 不能用于 Math 对象中的方法
- 不能和任何 Number 实例混合运算，两者必须转换成同一种类型
- 在两种类型来回转换时要小心，因为 BigInt 变量在转换成 Number 变量时可能会丢失精度
:::

可以用在一个整数字面量后面加 `n` 的方式定义一个 BigInt，如：`10n`，或者调用函数 `BigInt()`（但不包含 `new` 运算符）并传递一个整数值或字符串值。

```javascript
const theBiggestInt = 9007199254740991n;

const alsoHuge = BigInt(9007199254740991);
// ↪ 9007199254740991n

// 使用 typeof 测试时，BigInt 对象返回 "bigint"
typeof 1n === "bigint"; // true
typeof BigInt("1") === "bigint"; // true

// 使用 Object 包装后，BigInt 被认为是一个普通 "object"
typeof Object(1n) === "object"; // true

const previousMaxSafe = BigInt(Number.MAX_SAFE_INTEGER);
// ↪ 9007199254740991n

const maxPlusOne = previousMaxSafe + 1n;
// ↪ 9007199254740992n
```

::: tip 建议
由于在 Number 与 BigInt 之间进行转换会损失精度，因而建议仅在值可能大于 2^53 时使用 BigInt 类型，并且不在两种类型之间进行相互转换。
:::

## Function

直接调用此构造函数可以动态创建函数，但会遇到和 `eval()` 类似的安全问题和（相对较小的）性能问题。然而，与 `eval()` 不同的是，Function 构造函数创建的函数只能在全局作用域中运行。

### 实例属性和方法

| 属性/方法 | 描述 |
|-----------|------|
| `name` | 函数的名称 |
| `displayName` | 函数的显示名称 |
| `length` | 指定函数期望的参数个数 |
| `call()` | 调用函数并指定 this 值 |
| `apply()` | 调用函数并指定 this 值和参数数组 |
| `bind()` | 创建新函数并绑定 this 值 |
| `toString()` | 返回表示函数源代码的字符串 |
| `[Symbol.hasInstance]()` | 指定确定构造函数是否将对象识别为其实例的默认过程 |

```javascript
// 使用 `var` 创建一个全局属性
var x = 10;

function createFunction1() {
  const x = 20;
  return new Function("return x;"); // 这个 `x` 指的是全局 `x`
}

const f1 = createFunction1();
console.log(f1()); // 10
```

::: warning Node.js 环境差异
虽然这段代码可以在浏览器中正常运行，但在 Node.js 中 `f1()` 会产生一个"找不到变量 x"的 ReferenceError。这是因为在 Node 中顶级作用域不是全局作用域，而 x 其实是在当前模块的作用域之中。
:::

## Number

Number 类型是一个双精度 64 位二进制格式 IEEE 754 值，表示 3 个部分：

- **1 位**用于表示符号（sign）（正数或者负数）
- **11 位**用于表示指数（exponent）（-1022 到 1023）
- **52 位**用于表示尾数（mantissa）（表示 0 和 1 之间的数值）

::: info 术语说明
尾数（也称为有效数）是表示实际值（有效数字）的数值部分。指数是尾数应乘以的 2 的幂次。
:::

### 实例方法

| 方法 | 描述 |
|------|------|
| `toExponential()` | 返回使用指数表示法表示数值的字符串 |
| `toLocaleString()` | 返回数值在特定语言环境下表示的字符串 |

### 静态属性

| 属性 | 描述 |
|------|------|
| `Number.EPSILON` | 两个可表示数之间的最小间隔 |
| `Number.MAX_SAFE_INTEGER` | JavaScript 中最大的安全整数（2^53 - 1） |
| `Number.MIN_SAFE_INTEGER` | JavaScript 中最小的安全整数（-(2^53 - 1)） |
| `Number.MAX_VALUE` | 能表示的最大正数 |
| `Number.MIN_VALUE` | 能表示的最小正数即最接近 0 的正数 |
| `Number.NaN` | 特殊的"Not a Number"（非数字）值 |
| `Number.POSITIVE_INFINITY` | 特殊的正无穷大值，在溢出时返回该值 |
| `Number.NEGATIVE_INFINITY` | 特殊的负无穷大值，在溢出时返回该值 |

## Object

```javascript
new Object(value);
Object(value);
```

### 静态方法

#### 对象状态控制

- **`Object.preventExtensions(obj)`** - 防止新属性被添加到对象中（即防止该对象被扩展）。**可以删除现有属性**
- **`Object.seal(obj)`** - 密封一个对象，使得对象不可新增和删除属性，不可将数据属性和访问器属性互相转换。**可以修改现有属性值**
- **`Object.freeze(obj)`** - 冻结一个对象，使得对象不可新增和删除属性，不可将数据属性和访问器属性互相转换，**也不能修改现有属性**

#### Object.groupBy()

根据提供的回调函数返回的字符串值对给定可迭代对象中的元素进行分组。

```javascript
/**
 * @param {Iterable} items - 一个将进行元素分组的可迭代对象（例如 Array）
 * @param {Function} callbackFn - 对可迭代对象中的每个元素执行的函数
 */
Object.groupBy(items, callbackFn);

const inventory = [
  { name: "芦笋", type: "蔬菜", quantity: 5 },
  { name: "香蕉", type: "水果", quantity: 0 },
  { name: "山羊", type: "肉", quantity: 23 },
  { name: "樱桃", type: "水果", quantity: 5 },
  { name: "鱼", type: "肉", quantity: 22 },
];

const result = Object.groupBy(inventory, ({ type }) => type);

/* 结果是：
{
  蔬菜: [
    { name: "芦笋", type: "蔬菜", quantity: 5 },
  ],
  水果: [
    { name: "香蕉", type: "水果", quantity: 0 },
    { name: "樱桃", type: "水果", quantity: 5 }
  ],
  肉: [
    { name: "山羊", type: "肉", quantity: 23 },
    { name: "鱼", type: "肉", quantity: 22 }
  ]
}
*/
```

#### Object.hasOwn()

如果指定的对象自身有指定的属性，则返回 `true`。如果属性是继承的或者不存在，该方法返回 `false`。

::: tip 推荐
`Object.hasOwn()` 旨在取代 `Object.prototype.hasOwnProperty()`。
:::

```javascript
Object.hasOwn(obj, key);
```

## String

### UTF-16 字符、Unicode 码位和字素簇

字符串基本上表示为 **UTF-16** 码元的序列。该字符集称为基本多语言平面（BMP），包含最常见的字符，如拉丁字母、希腊字母、西里尔字母以及许多东亚字符。

::: details 详细说明
每个码元都可以用以 `\u` 开头的 4 个十六进制数字写在一个字符串中。然而，整个 Unicode 字符集比 65536 大得多。额外的字符以代理对的形式存储在 UTF-16 中，代理对是一对 16 位码元，表示一个单个字符。

- **前导代理**：高位代理，其值在 0xD800 和 0xDBFF 之间（含）
- **后尾代理**：低位代理，其值在 0xDC00 和 0xDFFF 之间（含）

每个 Unicode 字符由一个或者两个 UTF-16 码元组成，也称为 Unicode 码位（code point）。每个 Unicode 码位都可以使用 `\u{xxxxxx}` 1–6 个十六进制数字表示。
:::

**单独代理项**（前导代理或者后尾代理）不代表任何 Unicode 字符。在与其他系统交互时通常不是有效的值。例如，`encodeURI()` 会为单独代理项抛出 URIError。

除了 Unicode 字符之外，还有某些 Unicode 字符序列应视为一个视觉单元，被称为**字素簇**（grapheme cluster）。最常见的情况是 emoji。

```javascript
"😄".split(""); // ['\ud83d', '\ude04']; 分割成两个单独代理项

// "Backhand Index Pointing Right: Dark Skin Tone"
[..."👉🏿"]; // ['👉', '🏿']
// 分割成基本的"Backhand Index Pointing Right" emoji 和 "Dark skin tone" emoji

// "Family: Man, Boy"
[..."👨‍👦"]; // [ '👨', '‍', '👦' ]
// 分割成 "Man" 和 "Boy" emoji，由 ZWJ 连接

// The United Nations flag
[..."🇺🇳"]; // [ '🇺', '🇳' ]
// 分割成两个 "region indicator" 字母 "U" 和 "N"
// 所有国旗 emoji 都是由两个区域指示字母连接形成的
```

::: warning 构造函数差异
通过 `new String` 构造函数返回包装对象，否则为强制转化为字符串。
:::

```javascript
const strPrim = "foo"; // 字面量是一个字符串原始值
const strPrim2 = String(1); // 被强制转换为字符串原始值"1"
const strPrim3 = String(true); // 被强制转换为字符串原始值"true"
const strObj = new String(strPrim); // 使用 `new` 关键字调用 `String` 构造函数返回一个字符串包装对象

// 使用 eval() 时，字符串原始值和 String 对象也会给出不同的结果
const s1 = "2 + 2"; // 创建一个字符串原始值
const s2 = new String("2 + 2"); // 创建一个 String 对象
console.log(eval(s1)); // 返回数字 4
console.log(eval(s2)); // 返回字符串"2 + 2"
```

### 实例方法

#### endsWith()

判断当前字符串是否以指定字符串结尾。

```javascript
/**
 * @param {string} searchString - 要搜索的作为结尾的字符串，不能是正则表达式
 * @param {number} endPosition - 预期找到 searchString 的末尾位置，默认为 str.length
 */
endsWith(searchString);
endsWith(searchString, endPosition);

const str = "生存还是毁灭，这是一个问题。";

console.log(str.endsWith("问题。")); // true
console.log(str.endsWith("毁灭")); // false
console.log(str.endsWith("毁灭", 6)); // true
```

#### startsWith()

判断当前字符串是否以指定字符串开头，用法同 `endsWith()`。

#### charCodeAt()

返回给定索引处的 UTF-16 码元，其值介于 0 和 65535 之间。

```javascript
/**
 * @param {number} index - 要返回的字符的索引，从零开始。将被转换为整数——undefined 被转换为 0
 */
charCodeAt(index);
```

#### codePointAt()

返回给定索引开始的字符的 Unicode 码位值。索引仍然基于 UTF-16 码元，而不是 Unicode 码位。

```javascript
/**
 * @param {number} index - 需要返回的字符的（从零开始的）索引。会被转换为整数——undefined 会转换为 0
 */
codePointAt(index);

const icons = "☃★♲";
console.log(icons.codePointAt(1)); // "9733"
```

#### isWellFormed()

返回一个表示该字符串是否包含单独代理项的布尔值。

```javascript
const strings = [
  // 单独的前导代理
  "ab\uD800",
  "ab\uD800c",
  // 单独的后尾代理
  "\uDFFFab",
  "c\uDFFFab",
  // 格式正确
  "abc",
  "ab\uD83D\uDE04c",
];

for (const str of strings) {
  console.log(str.isWellFormed());
}
// 输出：false, false, false, false, true, true

// 如果传递的字符串格式不正确，encodeURI 会抛出错误
// 可以通过使用 isWellFormed() 在将字符串传递给 encodeURI() 之前测试字符串来避免这种情况
const illFormed = "https://example.com/search?q=\uD800";

try {
  encodeURI(illFormed);
} catch (e) {
  console.log(e); // URIError: URI malformed
}

if (illFormed.isWellFormed()) {
  console.log(encodeURI(illFormed));
} else {
  console.warn("Ill-formed strings encountered."); // Ill-formed strings encountered.
}
```

#### toWellFormed()

返回一个字符串，其中该字符串的所有单独代理项都被替换为 Unicode 替换字符 U+FFFD。

::: info 说明
当在某些上下文中使用格式不正确的字符串时，例如 TextEncoder，它们会自动转换为使用相同替换字符的格式正确的字符串。当单独代理项被呈现时，它们也会呈现为替换字符（一个带有问号的钻石形状）。
:::

```javascript
const strings = [
  // 单独的前导代理
  "ab\uD800",
  "ab\uD800c",
  // 单独的后尾代理
  "\uDFFFab",
  "c\uDFFFab",
  // 格式正确
  "abc",
  "ab\uD83D\uDE04c",
];

for (const str of strings) {
  console.log(str.toWellFormed());
}
// "ab"
// "abc"
// "ab"
// "cab"
// "abc"
// "ab😄c"
```

#### localeCompare()

返回一个数字，表示参考字符串在排序顺序中是在给定字符串之前、之后还是与之相同。

::: tip 返回值
- 如果引用字符串存在于比较字符串之前则为**负数**
- 如果引用字符串存在于比较字符串之后则为**正数**
- 相等的时候返回 **0**
:::

```javascript
/**
 * @param {string} compareString - 与 referenceStr 进行比较的字符串
 * @param {string|string[]} locales - 表示缩写语言代码的字符串，或由此类字符串组成的数组
 * @param {object} options - 一个调整输出格式的对象
 */
localeCompare(compareString, locales?, options?);

const a = "réservé"; // With accents, lowercase
const b = "RESERVE"; // No accents, uppercase

console.log(a.localeCompare(b)); // 1
console.log(a.localeCompare(b, "en", { sensitivity: "base" })); // 0
```

#### padEnd()

将当前字符串从末尾开始填充给定的字符串，直到达到给定的长度。

```javascript
/**
 * @param {number} targetLength - 当前 str 填充后的长度
 * @param {string} padString - 用于填充当前 str 的字符串，默认为空格
 */
padEnd(targetLength);
padEnd(targetLength, padString);

const str1 = "Breaded Mushrooms";
console.log(str1.padEnd(25, ".")); // "Breaded Mushrooms........"

const str2 = "200";
console.log(str2.padEnd(5)); // "200  "
```

#### padStart()

将当前字符串从开头开始填充给定的字符串，用法同 `padEnd()`。

#### repeat()

构造并返回一个新字符串，其中包含指定数量的所调用的字符串副本。

```javascript
/**
 * @param {number} count - 介于 0 和 +Infinity 之间的整数。表示在新构造的字符串中重复了多少遍原字符串
 */
repeat(count);

const mood = "Happy! ";
console.log(`I feel ${mood.repeat(3)}`); // "I feel Happy! Happy! Happy! "
```

### 静态方法

#### String.fromCharCode()

返回由指定的 UTF-16 码元序列创建的字符串。

```javascript
String.fromCharCode(num1, num2, /* …, */ numN);
```

#### String.fromCodePoint()

根据指定的码位序列返回一个字符串。

```javascript
String.fromCodePoint(num1, num2, /* …, */ numN);
```

#### String.raw()

模板字符串的标签函数，用于获取模板字符串的原始字符串形式。

```javascript
/**
 * @param {object} strings - 格式正确的模板字符串数组对象
 * @param {...any} substitutions - 包含的替换表达式对应的值
 */
String.raw(strings, ...substitutions);
String.raw`templateString`;

String.raw`Hi\n${2 + 3}!`; // 'Hi\\n5!'，'Hi' 后面的字符不是换行符，'\' 和 'n' 是两个不同的字符

String.raw`Hi\u000A!`; // 'Hi\\u000A!'，同上，这里得到的会是 \、u、0、0、0、A，6 个字符

const name = "Bob";
String.raw`Hi\n${name}!`; // 'Hi\\nBob!'，内插表达式还可以正常替换

String.raw`Hi \${name}!`; // 'Hi \\${name}!'，美元符号被转义；这里没有插值
```

## Symbol

Symbol 是一种基本数据类型，不支持语法：`new Symbol()`。

```javascript
/**
 * @param {string} description - 可选的，字符串类型。对 symbol 的描述，可用于调试但不是访问 symbol 本身
 */
Symbol([description]);

const symbol1 = Symbol();
const symbol2 = Symbol(42);
const symbol3 = Symbol("foo");

// 一个只读的字符串，意为对该 Symbol 对象的描述
symbol3.description === "foo";

console.log(typeof symbol1); // "symbol"
console.log(symbol2 === 42); // false
console.log(symbol3.toString()); // "Symbol(foo)"
console.log(Symbol("foo") === Symbol("foo")); // false
```

### 内置 Symbol

::: info 内置 Symbol
除了自己创建的 symbol，JavaScript 还内建了一些在 ECMAScript 5 之前没有暴露给开发者的 symbol，它们代表了内部语言行为。
:::

| Symbol | 描述 | 用途 |
|--------|------|------|
| `Symbol.iterator` | 返回对象默认迭代器的方法 | 被 `for...of` 使用 |
| `Symbol.asyncIterator` | 返回对象默认异步迭代器的方法 | 被 `for await of` 使用 |
| `Symbol.match` | 用于对字符串进行匹配的方法 | 被 `String.prototype.match()` 使用 |
| `Symbol.replace` | 替换匹配字符串的子串的方法 | 被 `String.prototype.replace()` 使用 |
| `Symbol.search` | 返回字符串中与正则表达式相匹配的索引的方法 | 被 `String.prototype.search()` 使用 |
| `Symbol.split` | 在匹配正则表达式的索引处拆分字符串的方法 | 被 `String.prototype.split()` 使用 |
| `Symbol.hasInstance` | 确定构造器对象识别的对象是否为它的实例的方法 | 被 `instanceof` 使用 |
| `Symbol.isConcatSpreadable` | 表明对象是否应该 flattened 为它的数组元素的布尔值 | 被 `Array.prototype.concat()` 使用 |
| `Symbol.unscopables` | 拥有和继承属性名的对象的值被排除在与环境绑定的相关对象外 | 用于 `with` 语句 |
| `Symbol.species` | 用于创建派生对象的构造器函数 | 用于子类化内置对象 |
| `Symbol.toPrimitive` | 将对象转化为基本数据类型的方法 | 用于类型转换 |
| `Symbol.toStringTag` | 用于对象的默认描述的字符串值 | 被 `Object.prototype.toString()` 使用 |

### 静态方法

#### Symbol.for()

使用给定的 key 搜索现有的 symbol，如果找到则返回该 symbol。否则将使用给定的 key 在全局 symbol 注册表中创建一个新的 symbol。

```javascript
Symbol.for(key);
```

#### Symbol.keyFor()

从全局 symbol 注册表中，为给定的 symbol 检索一个 symbol key。

```javascript
Symbol.keyFor(sym);
```

## 总结

JavaScript 的包装对象为原始数据类型提供了丰富的功能：

- **Array** - 提供强大的数组操作方法
- **BigInt** - 处理任意大的整数
- **Function** - 函数对象的属性和方法
- **Number** - 数值处理和格式化
- **Object** - 对象操作和状态控制
- **String** - 字符串处理和 Unicode 支持
- **Symbol** - 唯一标识符和内置行为控制

这些包装对象让 JavaScript 具有了强大的数据处理能力，是现代 JavaScript 开发的重要基础。
