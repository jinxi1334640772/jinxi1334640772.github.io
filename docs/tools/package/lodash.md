## lodash 简介

Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库。Lodash 通过降低 array、number、objects、string 等等的使用难度从而让 JavaScript 变得更简单。 Lodash 的模块化方法 非常适用于：

- 遍历 array、object 和 string
- 对值进行操作和检测
- 创建符合功能的函数

## 数组

```js
/** 将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。
 * @param <Array> 需要处理的数组
 * @param <number> 每个数组区块的长度
 * @return <Array>  包含拆分区块的新数组
 */
_.chunk(array, [(size = 1)]);
_.chunk(["a", "b", "c", "d"], 2);
// => [['a', 'b'], ['c', 'd']]

_.chunk(["a", "b", "c", "d"], 3);
// => [['a', 'b', 'c'], ['d']]

/** 创建一个新数组，包含原数组中所有的非假值元素。
 * 例如false, null,0, "", undefined, 和 NaN 都是被认为是“假值”。
 * @param <Array> 需要处理的数组
 * @return <Array>  去除假值后的新数组
 */
_.compact(array);
_.compact([0, 1, false, 2, "", 3]);
// => [1, 2, 3]

/** 创建一个具有唯一array值的数组，每个值不包含在其他给定的数组中
 * @param <Array> array 要检查的数组。
 * @param <Array> values 要排除的值组成的数组
 * @return <Array>  过滤值后的新数组
 */
_.difference(array, [values]);
_.difference([3, 2, 1], [4, 2]);
// => [3, 1]

/** 首先使用迭代器分别迭代array 和 values中的每个元素，返回的值作为比较值
 * @param <Array> array 要检查的数组
 * @param <Array> values 要排除的值
 * @param <Array|function|object|string> iteratee调用每个元素
 * @return <Array> 过滤后的新数组
 */
_.differenceBy(array, [values], [(iteratee = _.identity)]);

_.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor);
// => [3.1, 1.3]

// The `_.property` iteratee shorthand.
_.differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], "x");
// => [{ 'x': 2 }]

/** 调用比较array，values中的元素。 结果值是从第一数组中选择
 * @param <Array> array 要检查的数组
 * @param <Array> values 要排除的值
 * @param [comparator] (Function): comparator 调用每个元素。
 * @return <Array> 过滤后的新数组
 */
_.differenceWith(array, [values], [comparator]);

var objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
];

_.differenceWith(objects, [{ x: 1, y: 2 }], _.isEqual);
// => [{ 'x': 2, 'y': 1 }]

/** 创建一个切片数组，去除array前面的n个元素。（n默认值为1。）
 * @param <Array> 需要处理的数组
 * @param [n=1] (number): 要去除的元素个数。
 * @return <Array> 返回array剩余切片。
 */
_.drop(array, [(n = 1)]);

_.drop([1, 2, 3]);
// => [2, 3]

_.drop([1, 2, 3], 2);
// => [3]

_.drop([1, 2, 3], 5);
// => []

_.drop([1, 2, 3], 0);
// => [1, 2, 3]

/** 创建一个切片数组，去除array尾部的n个元素。（n默认值为1。）
 * @param <Array> 需要处理的数组
 * @param [n=1] (number): 要去除的元素个数。
 * @return <Array> 返回array剩余切片。
 */
_.dropRight(array, [(n = 1)]);

_.dropRight([1, 2, 3]);
// => [1, 2]

_.dropRight([1, 2, 3], 2);
// => [1]

_.dropRight([1, 2, 3], 5);
// => []

_.dropRight([1, 2, 3], 0);
// => [1, 2, 3]

/** 创建一个切片数组，去除array中从 predicate 返回假值开始到尾部的部分。
 * predicate 会传入3个参数： (value, index, array)。
 * @param <Array> 需要处理的数组
 * @param [predicate=_.identity] (Function): 这个函数会在每一次迭代调用。
 * @return <Array>  返回array剩余切片。
 */
_.dropRightWhile(array, [(predicate = _.identity)]);

var users = [
  { user: "barney", active: true },
  { user: "fred", active: false },
  { user: "pebbles", active: false },
];

_.dropRightWhile(users, function (o) {
  return !o.active;
});
// => objects for ['barney']

// The `_.matches` iteratee shorthand.
_.dropRightWhile(users, { user: "pebbles", active: false });
// => objects for ['barney', 'fred']

// The `_.matchesProperty` iteratee shorthand.
_.dropRightWhile(users, ["active", false]);
// => objects for ['barney']

// The `_.property` iteratee shorthand.
_.dropRightWhile(users, "active");
// => objects for ['barney', 'fred', 'pebbles']

/** 去除掉从起点开始到返回假值结束部分
 * @param <Array> 需要处理的数组
 * @param [predicate=_.identity] (Function): 这个函数会在每一次迭代调用。
 * @return <Array>  剩余切片数组
 */
_.dropWhile(array, [(predicate = _.identity)]);

var users = [
  { user: "barney", active: false },
  { user: "fred", active: false },
  { user: "pebbles", active: true },
];

_.dropWhile(users, function (o) {
  return !o.active;
});
// => objects for ['pebbles']

// The `_.matches` iteratee shorthand.
_.dropWhile(users, { user: "barney", active: false });
// => objects for ['fred', 'pebbles']

// The `_.matchesProperty` iteratee shorthand.
_.dropWhile(users, ["active", false]);
// => objects for ['pebbles']

// The `_.property` iteratee shorthand.
_.dropWhile(users, "active");
// => objects for ['barney', 'fred', 'pebbles']

/** 给定数组的交集
 * @param <Array> 待检查的数组。
 * @return <Array>  包含所有传入数组交集元素的新数组。
 */
_.intersection([arrays]);

_.intersection([2, 1], [4, 2], [1, 2]);
// => [2]

/**  iteratee 调用每一个arrays的每个值以产生一个值，通过产生的值进行了比较。
 * @param <Array> 需要处理的数组
 * @param <number> [iteratee=_.identity] (Array|Function|Object|string): iteratee（迭代器）调用每个元素。
 * @return <Array>  包含所有传入数组交集元素的新数组。
 */
_.intersectionBy([arrays], [(iteratee = _.identity)]);

_.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor);
// => [2.1]

// The `_.property` iteratee shorthand.
_.intersectionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], "x");
// => [{ 'x': 1 }]

/** comparator 调用比较arrays中的元素。结果值是从第一数组中选择
 * @param <Array> 需要处理的数组
 * @param [comparator] (Function): comparator（比较器）调用每个元素。
 * @return <Array>  包含所有传入数组交集元素的新数组。
 */
_.intersectionWith([arrays], [comparator]);

var objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
];
var others = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
];

_.intersectionWith(objects, others, _.isEqual);
// => [{ 'x': 1, 'y': 2 }]

/** 移除数组array中所有和给定值相等的元素，使用SameValueZero 进行全等比较。
 * @param array (Array): 要修改的数组。
 * @param [values] (...*): 要删除的值。
 * @return <Array>  返回 array。改变原数组
 */
_.pull(array, [values]);

var array = [1, 2, 3, 1, 2, 3];

_.pull(array, 2, 3);
console.log(array);
// => [1, 1]

/** 类似_.pull，区别是这个方法接收一个要移除值的数组
 * @param array (Array): 要修改的数组。
 * @param values  要删除的值的数组
 * @return <Array>  返回 array。改变原数组
 */
_.pullAll(array, values);

var array = [1, 2, 3, 1, 2, 3];

_.pullAll(array, [2, 3]);
console.log(array);
// => [1, 1]

/** iteratee（迭代函数） 调用 array 和 values的每个值以产生一个值，通过产生的值进行了比较
 * @param array (Array): 要修改的数组。
 * @param values  要删除的值的数组
 * @param [iteratee=_.identity] (Array|Function|Object|string): iteratee（迭代器）调用每个元素。
 * @return <Array>  返回 array。改变原数组
 */
_.pullAllBy(array, values, [(iteratee = _.identity)]);

var array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }];

_.pullAllBy(array, [{ x: 1 }, { x: 3 }], "x");
console.log(array);
// => [{ 'x': 2 }]

/**  comparator 调用array中的元素和values比较。comparator 会传入两个参数：(arrVal, othVal)。
 * @param array (Array): 要修改的数组。
 * @param values  要删除的值的数组
 * @param [comparator] (Function): comparator（比较器）调用每个元素。
 * @return <Array>  返回 array。改变原数组
 */
_.pullAllWith(array, values, [comparator]);

var array = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
  { x: 5, y: 6 },
];

_.pullAllWith(array, [{ x: 3, y: 4 }], _.isEqual);
console.log(array);
// => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]

/** 根据索引 indexes，移除array中对应的元素，并返回被移除元素的数组。
 * @param <Array> 需要处理的数组
 * @param [indexes] (...(number|number[])): 要移除元素的索引
 * @return (Array): 返回移除元素组成的新数组。修改了原数组
 */
_.pullAt(array, [indexes]);

var array = [5, 10, 15, 20];
var evens = _.pullAt(array, 1, 3);

console.log(array);
// => [5, 15]

console.log(evens);
// => [10, 20]

/** 使用二进制的方式检索来决定 value值 应该插入到数组中 尽可能小的索引位置，以保证array的排序。
 * @param <Array> 需要处理的数组
 * @param value (*): 要评估的值。
 * @return (number): 返回 value值 应该在数组array中插入的索引位置 index。
 */
_.sortedIndex(array, value);
_.sortedIndex([30, 50], 40);
// => 1
_.sortedIndexBy(array, value, [(iteratee = _.identity)]);
//这个方法类似_.indexOf，除了它是在已经排序的数组array上执行二进制检索。
_.sortedIndexOf(array, value);
_.sortedLastIndexOf(array, value);
// 这个方法类似_.uniq，除了它会优化排序数组。返回排序和去重后的数组
_.sortedUniq(array);
_.sortedUniqBy(array, [iteratee]);
_.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
// => [1.1, 2.3]

/** 创建一个数组切片，从array数组的起始元素开始提取n个元素。
 * @param <Array> 需要处理的数组
 * @param [n=1] (number): 要提取的元素个数。
 * @return (Array): 返回 array 数组的切片（从起始元素开始n个元素）。
 */
_.take(array, [(n = 1)]);

_.take([1, 2, 3]);
// => [1]

_.take([1, 2, 3], 2);
// => [1, 2]

_.take([1, 2, 3], 5);
// => [1, 2, 3]

_.take([1, 2, 3], 0);
// => []

_.takeWhile(array, [(predicate = _.identity)]);
_.takeRight(array, [(n = 1)]);
_.takeRightWhile(array, [(predicate = _.identity)]);

/** 创建一个按顺序排列的唯一值的数组。所有给定数组的元素值使用SameValueZero做等值比较
 * @param <Array> 需要处理的数组
 * @return (Array): 返回一个新的联合数组。
 */
_.union([arrays]);
_.union([2], [1, 2]);
// => [2, 1]

_.unionBy([arrays], [(iteratee = _.identity)]);
_.unionWith([arrays], [comparator]);

/** 创建一个去重后的array数组副本。使用了SameValueZero 做等值比较。只有第一次出现的元素才会被保留。
 * @param <Array> 需要处理的数组
 * @return (Array): 返回新的去重后的数组。
 */
_.uniq(array);

_.uniq([2, 1, 2]);
// => [2, 1]
_.uniqBy(array, [(iteratee = _.identity)]);
_.uniqWith(array, [comparator]);

/** 类似于_.zip，除了它接收分组元素的数组，并且创建一个数组，分组元素到打包前的结构
 * @param <Array> 需要处理的数组
 * @return (Array): 返回重组元素的新数组。
 */
_.unzip(array);
_.unzipWith(array, [(iteratee = _.identity)]);

var zipped = _.zip(["fred", "barney"], [30, 40], [true, false]);
// => [['fred', 30, true], ['barney', 40, false]]

_.unzip(zipped);
// => [['fred', 'barney'], [30, 40], [true, false]]

_.zipWith([arrays], [(iteratee = _.identity)]);

// 这个方法类似_.zipObject（类似Object.fromEntries()），除了它支持属性路径。
_.zipObjectDeep([(props = [])], [(values = [])]);
_.zipObjectDeep(["a.b[0].c", "a.b[1].d"], [1, 2]);
// => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
```

## 集合

```js
/** 根据iteratee处理后，作为key，value为划分的数量
 * @param collection (Array|Object): 一个用来迭代的集合。
 * @param [iteratee=_.identity] (Array|Function|Object|string): 一个迭代函数，用来转换key（键）。
 * @return (Object): 返回一个组成集合对象
 */
_.countBy(collection, [(iteratee = _.identity)]);

_.countBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': 1, '6': 2 }

// The `_.property` iteratee shorthand.
_.countBy(["one", "two", "three"], "length");
// => { '3': 2, '5': 1 }

/** 根据iteratee处理后，作为key，value为每个元素组成的数组
 * @param collection (Array|Object): 一个用来迭代的集合。
 * @param [iteratee=_.identity] (Array|Function|Object|string): 一个迭代函数，用来转换key（键）。
 * @return (Object): 返回一个组成集合对象
 */
_.groupBy(collection, [(iteratee = _.identity)]);

_.groupBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': [4.2], '6': [6.1, 6.3] }

// The `_.property` iteratee shorthand.
_.groupBy(["one", "two", "three"], "length");
// => { '3': ['one', 'two'], '5': ['three'] }

/** 根据iteratee处理后，某个value作为key，值为每个元素组成的数组
 * @param collection (Array|Object): 一个用来迭代的集合。
 * @param [iteratee=_.identity] (Array|Function|Object|string): 一个迭代函数，用来转换key（键）。
 * @return (Object): 返回一个组成集合对象
 */
_.keyBy(collection, [(iteratee = _.identity)]);

var array = [
  { dir: "left", code: 97 },
  { dir: "right", code: 100 },
];

_.keyBy(array, function (o) {
  return String.fromCharCode(o.code);
});
// => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }

_.keyBy(array, "dir");
// => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }

/** 类似于_.sortBy，除了它允许指定 iteratee（迭代函数）结果如何排序。
 * 如果没指定 orders（排序），所有值以升序排序。 否则，指定为"desc" 降序，
 * 或者指定为 "asc" 升序，排序对应值。
 * @param collection (Array|Object): 一个用来迭代的集合。
 * @param [iteratee=_.identity] (Array|Function|Object|string): 一个迭代函数，用来转换key（键）。
 * @param [orders] (string[]): iteratees迭代函数的排序顺序。
 * @return (Array): 排序排序后的新数组。
 */
_.orderBy(collection, [(iteratees = [_.identity])], [orders]);
var users = [
  { user: "fred", age: 48 },
  { user: "barney", age: 34 },
  { user: "fred", age: 40 },
  { user: "barney", age: 36 },
];

// 以 `user` 升序排序 再  `age` 以降序排序。
_.orderBy(users, ["user", "age"], ["asc", "desc"]);
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]

/** 创建一个分成两组的元素数组，第一组包含predicate（断言函数）返回为 truthy（真值）的元素，
 * 第二组包含predicate（断言函数）返回为 falsey（假值）的元素。predicate 调用1个参数：(value)。
 * @param collection (Array|Object): 一个用来迭代的集合。
 * @param [iteratee=_.identity] (Array|Function|Object|string): 一个迭代函数，用来转换key（键）。
 * @return (Array): 返回元素分组后的数组。
 */
_.partition(collection, [(predicate = _.identity)]);

var users = [
  { user: "barney", age: 36, active: false },
  { user: "fred", age: 40, active: true },
  { user: "pebbles", age: 1, active: false },
];

_.partition(users, function (o) {
  return o.active;
});
// => objects for [['fred'], ['barney', 'pebbles']]

// The `_.matches` iteratee shorthand.
_.partition(users, { age: 1, active: false });
// => objects for [['pebbles'], ['barney', 'fred']]

// The `_.matchesProperty` iteratee shorthand.
_.partition(users, ["active", false]);
// => objects for [['barney', 'pebbles'], ['fred']]

// The `_.property` iteratee shorthand.
_.partition(users, "active");
// => objects for [['fred'], ['barney', 'pebbles']]

/** 从collection（集合）中获得一个随机元素。
 * @param collection (Array|Object): 一个用来迭代的集合。
 * @return (*): 返回随机元素。
 */
_.sample(collection);

_.sample([1, 2, 3, 4]);
// => 2
//从collection（集合）中获得 n 个随机元素。
_.sampleSize(collection, [(n = 1)]);
_.sampleSize([1, 2, 3], 2);
// => [3, 1]

_.sampleSize([1, 2, 3], 4);
// => [2, 3, 1]

/** 创建一个被打乱值的集合
 * @param collection (Array|Object): 一个用来迭代的集合。
 * @return (Array): 返回打乱的新数组。
 */
_.shuffle(collection);
_.shuffle([1, 2, 3, 4]);
// => [4, 1, 3, 2]

/** 创建一个元素数组。 以 iteratee 处理的结果升序排序
 * @param collection (Array|Object): 一个用来迭代的集合。
 * @param [iteratee=_.identity] (Array|Function|Object|string): 一个迭代函数，用来转换key（键）。
 * @return (Array): 返回排序后的数组
 */
_.sortBy(collection, [(iteratees = [_.identity])]);

var users = [
  { user: "fred", age: 48 },
  { user: "barney", age: 36 },
  { user: "fred", age: 40 },
  { user: "barney", age: 34 },
];

_.sortBy(users, function (o) {
  return o.user;
});
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]

_.sortBy(users, ["user", "age"]);
// => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]

_.sortBy(users, "user", function (o) {
  return Math.floor(o.age / 10);
});
// => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
```

## 函数

```js

/** _.before的反向函数;此方法创建一个函数，当他被调用n或更多次之后将马上触发func 。
 * @n (number): func 方法应该在调用多少次后才执行。
 * @func (Function): 用来限定的函数。
 * @return (Function): 返回新的限定函数。
 */
_.after(n, func)
var saves = ['profile', 'settings'];

var done = _.after(saves.length, function() {
  console.log('done saving!');
});

_.forEach(saves, function(type) {
  asyncSave({ 'type': type, 'complete': done });
});
// => Logs 'done saving!' after the two async saves have completed.

/** 创建一个调用func的函数。调用func时最多接受 n个参数，忽略多出的参数。
 * @func (Function): 需要被限制参数个数的函数。
 * @[n=func.length] (number): 限制的参数数量。
 * @return (Function): 返回新的覆盖函数
 */
_.ary(func, [n=func.length])
var saves = ['profile', 'settings'];
_.map(['6', '8', '10'], _.ary(parseInt, 1));
// => [6, 8, 10]

/** 创建一个调用func的函数，通过this绑定和创建函数的参数调用func，
 * 调用次数不超过 n 次。 之后再调用这个函数，将返回一次最后调用func的结果。
 * @n (number): 超过多少次不再调用func（注：限制调用func 的次数）。
 * @func (Function): 用来限定的函数。
 * @return (Function): 返回新的限定函数。
 */
_.before(n, func)

jQuery(element).on('click', _.before(5, addContactToList));
// => allows adding up to 4 contacts to the list

/** 如果 func 所需参数已经提供，则直接返回 func 所执行的结果。或返回一个函数，
 * 接受余下的func 参数的函数，可以使用 func.length 强制需要累积的参数个数。
 * @func (Function): 用来柯里化（curry）的函数。
 * @[arity=func.length] (number): 需要提供给 func 的参数数量。
 * @return (Function): 返回新的柯里化（curry）函数。
 */
_.curry(func, [arity=func.length])
var saves = ['profile', 'settings'];
 _.curryRight(func, [arity=func.length])

var abc = function(a, b, c) {
  return [a, b, c];
};

var curried = _.curry(abc);

curried(1)(2)(3);
// => [1, 2, 3]

curried(1, 2)(3);
// => [1, 2, 3]

curried(1, 2, 3);
// => [1, 2, 3]

// Curried with placeholders.
curried(1)(_, 3)(2);
// => [1, 2, 3]

/**创建一个 debounced（防抖动）函数，该函数会从上一次被调用后，延迟 wait 毫秒后调用 func 方法
 * @func (Function): 要防抖动的函数。
 * [wait=0] (number): 需要延迟的毫秒数。
 * [options=] (Object): 选项对象。
 * [options.leading=false] (boolean): 指定在延迟开始前调用。
 * [options.maxWait] (number): 设置 func 允许被延迟的最大值。
 * [options.trailing=true] (boolean): 指定在延迟结束后调用。
 * @return (Function): 返回新的 debounced（防抖动）函数
 */
_.debounce(func, [wait=0], [options=])
// 避免窗口在变动时出现昂贵的计算开销。
jQuery(window).on('resize', _.debounce(calculateLayout, 150));

// 当点击时 `sendMail` 随后就被调用。
jQuery(element).on('click', _.debounce(sendMail, 300, {
  'leading': true,
  'trailing': false
}));

// 确保 `batchLog` 调用1次之后，1秒内会被触发。
var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
var source = new EventSource('/stream');
jQuery(source).on('message', debounced);

// 取消一个 trailing 的防抖动调用
jQuery(window).on('popstate', debounced.cancel);

/**创建一个节流函数，在 wait 秒内最多执行 func 一次的函数。
 * 该函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用
 * @func (Function): 要节流的函数。
 * [wait=0] (number): 需要节流的毫秒数。
 * [options=] (Object): 选项对象。
 * [options.leading=false] (boolean): 指定在节流开始前调用。
 * [options.trailing=true] (boolean): 指定在节流结束后调用。
 * @return (Function): 返回新的节流函数
 */
_.throttle(func, [wait=0], [options=])
// 避免在滚动时过分的更新定位
jQuery(window).on('scroll', _.throttle(updatePosition, 100));

// 点击后就调用 `renewToken`，但5分钟内超过1次。
var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
jQuery(element).on('click', throttled);

// 取消一个 trailing 的节流调用。
jQuery(window).on('popstate', throttled.cancel);

/** 推迟调用func，直到当前堆栈清理完毕。 调用时，任何附加的参数会传给func。
 * @func (Function):  要延迟的函数。
 * @[args] (...*): 会在调用时传给 func 的参数。
 * @return (number):返回计时器 id。
 */
_.defer(func, [args])

_.defer(function(text) {
  console.log(text);
}, 'deferred');
// => 一毫秒或更久一些输出 'deferred'。

/** 延迟 wait 毫秒后调用 func。 调用时，任何附加的参数会传给func。= setTimeout
 * @func (Function): 要延迟的函数。
 * @wait (number): 要延迟的毫秒数。
 * @[args] (...*): 会在调用时传给 func 的参数。
 * @return (number): 返回计时器 id
 */
_.delay(func, wait, [args])
_.delay(function(text) {
  console.log(text);
}, 1000, 'later');
// => 一秒后输出 'later'。

/** 创建一个会缓存 func 结果的函数。 如果提供了 resolver ，就用 resolver 的返回值
 * 作为 key 缓存函数的结果。 默认情况下用第一个参数作为缓存的 key。
 *  func 在调用时 this 会绑定在缓存函数上。
 * @func (Function): 需要缓存化的函数.
 * @[resolver] (Function): 这个函数的返回值作为缓存的 key。
 * @return (Function): 返回缓存化后的函数。
 */
_.memoize(func, [resolver])
var object = { 'a': 1, 'b': 2 };
var other = { 'c': 3, 'd': 4 };

var values = _.memoize(_.values);
values(object);
// => [1, 2]

values(other);
// => [3, 4]

object.a = 2;
values(object);
// => [1, 2]

// 修改结果缓存。
values.cache.set(object, ['a', 'b']);
values(object);
// => ['a', 'b']

// 替换 `_.memoize.Cache`。
_.memoize.Cache = WeakMap;

/**创建一个只能调用 func 一次的函数。 重复调用返回第一次调用的结果。
 * func 调用时， this 绑定到创建的函数，并传入对应参数。
 * @func (Function): 指定的触发的函数。
 * @return (Function): 返回新的受限函数
 */
_.once(func)
var initialize = _.once(createApplication);
initialize();
initialize();
// `initialize` 只能调用 `createApplication` 一次。
```

## 语言

```js
/** 法类似_.clone，除了它会递归拷贝 value。（注：也叫深拷贝）。
 * @value (*): 要深拷贝的值。
 * @return (*): 返回拷贝后的值。
 */
_.cloneDeep(value);
_.cloneDeepWith(value, [customizer]);
_.cloneWith(value, [customizer]);
/** 通过调用断言source的属性与 object 的相应属性值，检查 object是否符合 source。
 * 当source偏应用时，这种方法和_.conforms函数是等价的。
 * @object (Object): 要检查的对象。
 * @source (Object): 要断言属性是否符合的对象。
 * @return (boolean): 如果 object 符合，返回 true，否则 false。
 */
_.conformsTo(object, source);
var object = { a: 1, b: 2 };

_.conformsTo(object, {
  b: function (n) {
    return n > 1;
  },
});
// => true

_.conformsTo(object, {
  b: function (n) {
    return n > 2;
  },
});
// => false
/**
 * 执行SameValueZero 比较两者的值，来确定它们是否相等。
 */
_.eq(value, other); // ===
_.gt(value, other); // >
_.gte(value, other); // >=
_.lt(value, other); // <
_.lte(value, other); // <=

/**
 * 类型检测
 */
_.isArguments(value);
_.isArray(value);
_.isArrayBuffer(value);
_.isArrayLike(value); // 类数组，由length值
_.isArrayLikeObject(value); // 类数组对象
_.isBoolean(value);
_.isBuffer(value);
_.isDate(value);
_.isElement(value);
_.isEmpty(value); //空对象，集合，映射或者set
_.isEqual(value, other);
_.isEqualWith(value, other, [customizer]);
_.isError(value);
_.isFinite(value);
_.isFunction(value);
_.isInteger(value);
_.isLength(value);
_.isMap(value);
_.isNaN(value);
_.isNative(value); // 是否原生函数
_.isNil(value); //是否 null 或者 undefined。
_.isNull(value);
_.isNumber(value);
_.isObject(value);
//不是 null，而且 typeof 后的结果是 "object"。
_.isObjectLike(value);
//是否是普通对象：由 Object 构造函数创建，或者 [[Prototype]] 为 null 。
_.isPlainObject(value);
_.isRegExp(value);
_.isSafeInteger(value);
_.isSet(value);
_.isString(value);
_.isSymbol(value);
_.isTypedArray(value);
_.isUndefined(value);
_.isWeakMap(value);
_.isWeakSet(value);

/**
 * 执行一个深度比较，来确定 object 是否含有和 source 完全相等的属性值。
 */
_.isMatch(object, source);
_.isMatchWith(object, source, [customizer]);

var object = { a: 1, b: 2 };

_.isMatch(object, { b: 2 });
// => true

_.isMatch(object, { b: 1 });
// => false

_.toArray(value); //转换 value 为一个数组。
_.toFinite(value); //转换 value 为一个有限数字。
_.toInteger(value); //转换 value 为一个整数
_.toLength(value); //转换 value 为用作类数组对象的长度整数。
_.toNumber(value);
_.toPlainObject(value); //转换 value 为普通对象。 包括继承的可枚举属性。
_.toSafeInteger(value);
_.toString(value);
```

## 数字

```js
/**
 * 返回限制在 lower 和 upper 之间的值。
 * 小于lower，返回lower
 * 大于upper，返回upper
 * 否则，返回number
 */
_.clamp(number, [lower], upper);
_.clamp(-10, -5, 5);
// => -5

_.clamp(10, -5, 5);
// => 5

/**
 * 检查 n 是否在 start 与 end 之间，但不包括 end。 如果 end 没有指定，那么 start 设置为0。
 *  如果 start 大于 end，那么参数会交换以便支持负范围。
 */
_.inRange(number, [(start = 0)], end);

_.inRange(3, 2, 4);
// => true

_.inRange(4, 8);
// => true

_.inRange(4, 2);
// => false

/**
 * 产生一个包括 lower 与 upper 之间的数。 如果只提供一个参数返回一个0到提供数之间的数。
 * 如果 floating 设为 true，或者 lower 或 upper 是浮点数，结果返回浮点数。
 */
_.random([(lower = 0)], [(upper = 1)], [floating]);

_.random(0, 5);
// => an integer between 0 and 5

_.random(5);
// => also an integer between 0 and 5

_.random(5, true);
// => a floating-point number between 0 and 5

_.random(1.2, 5.2);
// => a floating-point number between 1.2 and 5.2
```

## Object 对象

```js
/**
 * 创建一个object键值倒置后的对象。 如果 object 有重复的值，后面的值会覆盖前面的值。
 */
_.invert(object);
_.invertBy(object, [(iteratee = _.identity)]);
var object = { a: 1, b: 2, c: 1 };

_.invert(object);
// => { '1': 'c', '2': 'b' }

/**
 * 创建一个从 object 中选中的属性的对象。
 */
_.pick(object, [props]);
_.pickBy(object, [(predicate = _.identity)]);

var object = { a: 1, b: "2", c: 3 };

_.pick(object, ["a", "c"]);
// => { 'a': 1, 'c': 3 }

/**
 * 创建一个lodash包装实例，包装value以启用显式链模式。要解除链必须使用 _#value 方法。
 */
_.chain(value) === _(value);
var users = [
  { user: "barney", age: 36 },
  { user: "fred", age: 40 },
  { user: "pebbles", age: 1 },
];

var youngest = _.chain(users)
  .sortBy("age")
  .map(function (o) {
    return o.user + " is " + o.age;
  })
  .head()
  .value();
// => 'pebbles is 1'

/**
 * 这个方法调用一个 interceptor 并返回 value。interceptor调用1个参数： (value)。
 *  该方法的目的是 进入 方法链序列以便修改中间结果。
 */
_.tap(value, interceptor);
_([1, 2, 3])
  .tap(function (array) {
    // 改变传入的数组
    array.pop();
  })
  .reverse()
  .value();
// => [2, 1]

/**
 * 这个方法类似_.tap， 除了它返回 interceptor 的返回结果。
 * 该方法的目的是"传递" 值到一个方法链序列以取代中间结果。
 */
_.thru(value, interceptor);
_("  abc  ")
  .chain()
  .trim()
  .thru(function (value) {
    return [value];
  })
  .value();
// => ['abc']
```

## 字符串

```js
//转换字符串string为驼峰写法。
_.camelCase([string=''])
_.camelCase('Foo Bar');
// => 'fooBar'

_.camelCase('--foo-bar--');
// => 'fooBar'

_.camelCase('__FOO_BAR__');
// => 'fooBar'

//转换字符串string首字母为大写，剩下为小写。
_.capitalize([string=''])

//转义string中的 "&", "<", ">", '"', "'", 和 "`" 字符为HTML实体字符。
_.escape([string=''])

//_.escape的反向版。 这个方法转换string字符串中的 HTML 实体
// &amp;, &lt;, &gt;, &quot;, &#39;, 和 &#96; 为对应的字符。
_.unescape([string=''])

//转义 RegExp 字符串中特殊的字符 "^", "$", "", ".", "*", "+", "?", "(", ")", "[", "]", ", ", 和 "|" in .
_.escapeRegExp([string=''])
_.escapeRegExp('[lodash](https://lodash.com/)');
// => '\[lodash\]\(https://lodash\.com/\)'


//转换字符串string为kebab case.
_.kebabCase([string=''])
_.kebabCase('Foo Bar');
// => 'foo-bar'

_.kebabCase('fooBar');
// => 'foo-bar'

_.kebabCase('__FOO_BAR__');
// => 'foo-bar'


//转换字符串string以空格分开单词，并转换为小写。
_.lowerCase([string=''])
_.lowerCase('--Foo-Bar--');
// => 'foo bar'

_.lowerCase('fooBar');
// => 'foo bar'

_.lowerCase('__FOO_BAR__');
// => 'foo bar'

//转换字符串string的首字母为小写。
_.lowerFirst([string=''])

//转换字符串string为 空格 分隔的大写单词。
_.upperCase([string=''])
_.upperFirst([string='']) // 首字母大写
_.upperCase('--foo-bar');
// => 'FOO BAR'

_.upperCase('fooBar');
// => 'FOO BAR'

_.upperCase('__foo_bar__');
// => 'FOO BAR'


//转换字符串string为snake case.
_.snakeCase([string=''])
_.snakeCase('Foo Bar');
// => 'foo_bar'

_.snakeCase('fooBar');
// => 'foo_bar'

_.snakeCase('--FOO-BAR--');
// => 'foo_bar'

//转换 string 字符串为start case.
_.startCase([string=''])
_.startCase('--foo-bar--');
// => 'Foo Bar'

_.startCase('fooBar');
// => 'Foo Bar'

_.startCase('__FOO_BAR__');
// => 'FOO BAR'

// 拆分字符串string中的词为数组 。
_.words([string=''], [pattern])
_.words('fred, barney, & pebbles');
// => ['fred', 'barney', 'pebbles']

_.words('fred, barney, & pebbles', /[^, ]+/g);
// => ['fred', 'barney', '&', 'pebbles']

/**
 * 创建一个预编译模板方法，可以插入数据到模板中 "interpolate" 分隔符相应的位置
 * [string=''] (string): 模板字符串.
 * [options=] (Object): 选项对象.
 * [options.escape=_.templateSettings.escape] (RegExp): "escape" 分隔符.
 * [options.evaluate=_.templateSettings.evaluate] (RegExp): "evaluate" 分隔符.
 * [options.imports=_.templateSettings.imports] (Object): 导入对象到模板中作为自由变量。
 * [options.interpolate=_.templateSettings.interpolate] (RegExp): "interpolate" 分隔符。
 * [options.sourceURL='lodash.templateSources[n]'] (string): 模板编译的来源URL。
 * [options.variable='obj'] (string): 数据对象的变量名。
 */
_.template([string=''], [options=])
// 使用 "interpolate" 分隔符创建编译模板
var compiled = _.template('hello <%= user %>!');
compiled({ 'user': 'fred' });
// => 'hello fred!'

// 使用 HTML "escape" 转义数据的值
var compiled = _.template('<b><%- value %></b>');
compiled({ 'value': '<script>' });
// => '<b><script></b>'

// 使用 "evaluate" 分隔符执行 JavaScript 和 生成HTML代码
var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
compiled({ 'users': ['fred', 'barney'] });
// => '<li>fred</li><li>barney</li>'

// 在 "evaluate" 分隔符中使用内部的 `print` 函数
var compiled = _.template('<% print("hello " + user); %>!');
compiled({ 'user': 'barney' });
// => 'hello barney!'

// 使用 ES 分隔符代替默认的 "interpolate" 分隔符
var compiled = _.template('hello ${ user }!');
compiled({ 'user': 'pebbles' });
// => 'hello pebbles!'

// 使用自定义的模板分隔符
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
var compiled = _.template('hello {{ user }}!');
compiled({ 'user': 'mustache' });
// => 'hello mustache!'

// 使用反斜杠符号作为纯文本处理
var compiled = _.template('<%= "\\<%- value %\\>" %>');
compiled({ 'value': 'ignored' });
// => '<%- value %>'

// 使用 `imports` 选项导入 `jq` 作为 `jQuery` 的别名
var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
compiled({ 'users': ['fred', 'barney'] });
// => '<li>fred</li><li>barney</li>'

// 使用 `sourceURL` 选项指定模板的来源URL
var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
compiled(data);
// => 在开发工具的 Sources 选项卡 或 Resources 面板中找到 "greeting.jst"

// 使用 `variable` 选项确保在编译模板中不声明变量
var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
compiled.source;
// => function(data) {
//   var __t, __p = '';
//   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
//   return __p;
// }

// 使用 `source` 特性内联编译模板
// 便以查看行号、错误信息、堆栈
fs.writeFileSync(path.join(cwd, 'jst.js'), '\
  var JST = {\
    "main": ' + _.template(mainText).source + '\
  };\
');

//从string字符串中移除前面和后面的 空格 或 指定的字符。
_.trim([string=''], [chars=whitespace])
_.trimEnd([string=''], [chars=whitespace])
_.trimStart([string=''], [chars=whitespace])

_.trim('  abc  ');
// => 'abc'

_.trim('-_-abc-_-', '_-');
// => 'abc'

_.map(['  foo  ', '  bar  '], _.trim);
// => ['foo', 'bar']

/**
 * 截断string字符串，如果字符串超出了限定的最大值。 被截断的字符串后面
 * 会以 omission 代替，omission 默认是 "..."。
 * [string=''] (string): 要截断的字符串。
 * [options=] (Object): 选项对象。
 * [options.length=30] (number): 允许的最大长度。
 * [options.omission='...'] (string): 超出后的代替字符。
 * [options.separator] (RegExp|string): 截断点。
 */
_.truncate([string=''], [options=])
_.truncate('hi-diddly-ho there, neighborino');
// => 'hi-diddly-ho there, neighbo...'

_.truncate('hi-diddly-ho there, neighborino', {
  'length': 24,
  'separator': ' '
});
// => 'hi-diddly-ho there,...'

_.truncate('hi-diddly-ho there, neighborino', {
  'length': 24,
  'separator': /,? +/
});
// => 'hi-diddly-ho there...'

_.truncate('hi-diddly-ho there, neighborino', {
  'omission': ' [...]'
});
// => 'hi-diddly-ho there, neig [...]'
```

## 实用函数

```js
/** 创建了一个函数，这个函数会迭代pairs，并调用最先返回真值对应的函数。
 * 该断言函数对绑定 this 及传入创建函数的参数
 *  有点像简化的switch语句结构
 */
_.cond(pairs);
var func = _.cond([
  [_.matches({ a: 1 }), _.constant("matches A")],
  [_.conforms({ b: _.isNumber }), _.constant("matches B")],
  [_.stubTrue, _.constant("no match")],
]);

func({ a: 1, b: 2 });
// => 'matches A'

func({ a: 0, b: 1 });
// => 'matches B'

func({ a: "1", b: "2" });
// => 'no match'

/** 创建一个函数。 返回的结果是调用提供函数的结果，this 会绑定到创建函数。
 * 每一个连续调用，传入的参数都是前一个函数返回的结果。
 *  函数的流式调用
 */
_.flow([funcs]);
_.flowRight([funcs]);

function square(n) {
  return n * n;
}

var addSquare = _.flow([_.add, square]);
addSquare(1, 2);
// => 9

/** 创建一个函数，通过创建函数的参数调用 func 函数。 如果 func 是一个属性名，
 * 传入包含这个属性名的对象，回调返回对应属性名的值。 如果 func 是一个对象，
 * 传入的元素有相同的对象属性，回调返回 true 。 其他情况返回 false 。
 *
 */
_.iteratee([(func = _.identity)]);
var users = [
  { user: "barney", age: 36, active: true },
  { user: "fred", age: 40, active: false },
];

// The `_.matches` iteratee shorthand.
_.filter(users, _.iteratee({ user: "barney", active: true }));
// => [{ 'user': 'barney', 'age': 36, 'active': true }]

// The `_.matchesProperty` iteratee shorthand.
_.filter(users, _.iteratee(["user", "fred"]));
// => [{ 'user': 'fred', 'age': 40 }]

// The `_.property` iteratee shorthand.
_.map(users, _.iteratee("user"));
// => ['barney', 'fred']

// Create custom iteratee shorthands.
_.iteratee = _.wrap(_.iteratee, function (iteratee, func) {
  return !_.isRegExp(func)
    ? iteratee(func)
    : function (string) {
        return func.test(string);
      };
});

_.filter(["abc", "def"], /ef/);
// => ['def']

//释放 _ 变量为原来的值，并返回一个 lodash 的引用。
_.noConflict();
var lodash = _.noConflict();

/** 创建一个包含从 start 到 end，但不包含 end 本身范围数字的数组。
 * 如果 start 是负数，而 end 或 step 没有指定，那么 step 从 -1 为开始。
 * 如果 end 没有指定，start 设置为 0。
 * 如果 end 小于 start ，会创建一个空数组，除非指定了 step。
 *
 */
_.range([(start = 0)], end, [(step = 1)]);
_.rangeRight([(start = 0)], end, [(step = 1)]);

_.range(0, 20, 5);
// => [0, 5, 10, 15]

//调用 iteratee n 次，每次调用返回的结果存入到数组中。 iteratee 调用入1个参数： (index)。
_.times(n, [(iteratee = _.identity)]);
_.times(3, String);
// => ['0', '1', '2']

_.times(4, _.constant(0));
// => [0, 0, 0, 0]

// 生成唯一ID。 如果提供了 prefix ，会被添加到ID前缀上。
_.uniqueId([(prefix = "")]);
_.uniqueId("contact_");
// => 'contact_104'

_.uniqueId();
// => '105'
```
