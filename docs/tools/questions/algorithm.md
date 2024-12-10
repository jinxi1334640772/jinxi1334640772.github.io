## 数据结构和算法

- 数据结构：数组、链表、栈、队列、散列表、二叉树、堆、跳表、图、Trie 树；
- 算法：递归、排序、二分查找、搜索、哈希算法、贪心算法、分治算法、回溯算法、动态规划、字符串匹配算法。

算法思想：

1. 出入栈
2. 双指针
3. 滑动窗口
4. 翻牌标记

## 排序算法

### 冒泡排序

思想

- 冒泡排序只会操作相邻的两个数据。
- 每次冒泡操作都会对相邻的两个元素进行比较，看是否满足大小关系要求。如果不满足就让它俩互换。
- 一次冒泡会让至少一个元素移动到它应该在的位置，重复 n 次，就完成了 n 个数据的排序工作。

特点

- 优点：排序算法的基础，简单实用易于理解。
- 缺点：比较次数多，效率较低。

```js
function bubbleSort(arr) {
  console.time("冒泡排序耗时");
  if (!Array.isArray(arr)) return;

  const { length = 0 } = arr;
  if (length <= 1) return;

  for (let i = 0; i < length - 1; i++) {
    //最后一个值不需要对比了
    for (let j = 0; j < length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // 比下一个值大，就交换位置
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  console.timeEnd("冒泡排序耗时");
  return arr;
}

function bubbleSortOptimize(arr) {
  console.time("优化-冒泡排序耗时");

  if (!Array.isArray(arr)) return;

  const { length } = arr;
  if (length <= 1) return;

  for (let i = 0; i < length - 1; i++) {
    let changeState = false;
    for (let j = 0; j < length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        changeState = true;
      }
    }
    // 如果走过一轮之后，发现始终都是后面比前面数值大，
    // 说明已经排序好了，可以提前结束遍历了。
    if (!changeState) break;
  }
  console.timeEnd("优化-冒泡排序耗时");
  return arr;
}

const array = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array}`);
const newArr = bubbleSort(array);
console.log(`bubbleSort排序之后newArr: ${newArr}`);

console.log("----------------------------");

const array2 = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array2}`);
const newArr2 = bubbleSortOptimize(array2);
console.log(`bubbleSortOptimize排序之后newArr: ${newArr2}`);
```

### 快速排序

思想

- 先找到一个基准点（一般指数组的中部），然后数组被该基准点分为两部分，依次与该基准点数据比较，如果比它小，放左边；反之，放右边。
- 左右分别用一个空数组去存储比较后的数据。
- 最后递归执行上述操作，直到数组长度 <= 1;

特点：

- 优点：快速，常用。
- 缺点：需要另外声明两个数组，浪费了内存空间资源。

```js
function quickSort(arr) {
  if (!Array.isArray(arr)) return;

  const { length } = arr;

  if (length <= 1) return arr;

  // 设置中间index，以及对应的值，和左右两个数组
  const pivotIndex = length >> 1;
  const pivot = arr.splice(pivotIndex, 1)[0];
  const left = [];
  const right = [];

  // 遍历数组，小于中间值的元素放左边，否则放右边
  for (let item of arr) {
    item <= pivot ? left.push(item) : right.push(item);
  }
  // 左右两边分别递归此操作，然后合并数组
  return quickSort(left).concat(pivot, quickSort(right));
}

const array = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array}`);
const newArr = quickSort(array);
console.log(`quickSort排序之后newArr: ${newArr}`);
```

### 插入排序

思想：每步将一个待排序的记录，按其关键码值的大小插入前面已经排序的文件中适当位置上，直到全部插入完为止。

```js
function insertionSort(arr) {
  console.time("插入排序耗时");
  if (!Array.isArray(arr)) return;

  const { length } = arr;

  if (length <= 1) return arr;

  //第一个元素不需要遍历
  for (let i = 1; i < length; i++) {
    // 需要和当前元素之前的所有元素进行对比
    for (let j = i; j > 0; j--) {
      // 当前元素比前面的元素小，就往前移动
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      }
    }
  }
  console.timeEnd("插入排序耗时");
  return arr;
}

const array = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array}`);
const newArr = insertionSort(array);
console.log(`insertionSort排序之后newArr: ${newArr}`);
```

### 希尔排序

思想

- 希尔排序将序列分割成若干小序列（逻辑上分组），然后对每一个小序列进行插入排序，此时每一个小序列数据量小，插入排序的效率也提高了。

```js
function shellSort(arr) {
  console.time("希尔排序耗时");

  if (!Array.isArray(arr)) return;

  const { length } = arr;
  let temp,
    log,
    step = 1,
    gap = length;

  //数组分组： (gap = Math.trunc(gap/2)) == (gap >>= 1)
  while (gap > 0 && (gap >>= 1)) {
    console.log(`Gap is ${gap}`);
    for (let i = gap; i < length; i++) {
      temp = arr[i]; //缓存当前元素
      let j = i - gap; //前一组对应元素的指针
      // 比前一组的对应元素小，则把元素放到当前位置
      while (j >= 0 && arr[j] > temp) {
        arr[j + gap] = arr[j];
        //比上一组元素小，则和上上一组元素比较大小
        j -= gap;
      }
      // 把当前元素放置在比他小的位置上
      arr[j + gap] = temp;

      log = "";
      arr.forEach((v, i) => {
        log += `${v}\t${(i + 1) % gap === 0 ? "\n" : ""}`;
      });
      console.log(`Step ${step++}: \n${log}`);
    }
  }
  console.timeEnd("希尔排序耗时");
  return arr;
}

const array = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array}`);
const newArr = shellSort(array);
console.log(`shellSort排序之后newArr: ${newArr}`);
```

### 选择排序

思想

- 选择排序算法的实现思路有点类似插入排序，也分已排序区间和未排序区间。但是选择排序每次会从未排序区间中找到最小的元素，将其放到已排序区间的末尾。

特点

- 优点：上手比较简单，比较符合人的正常思路逻辑。
- 缺点：时间复杂度 O(n^2)，运算速度很慢，当数组元素个数比较多时，时间增速惊人。

```js
const selectionSort = arr => {
  console.time("选择排序耗时");

  if (!Array.isArray(arr)) return;

  const { length } = arr;

  for (let i = 0; i < length - 1; i++) {
    let min = arr[i],
      minIndex = i,
      step = 0;
    // 从当前元素及以后的元素中找出最小值元素和对应的index
    for (let j = i + 1; j < length; j++) {
      step++;
      if (min > arr[j]) {
        min = arr[j];
        minIndex = j;
      }
    }
    console.log(
      `Step${i + 1}: ${arr}, min: ${min}, minIndex: ${minIndex}, step: ${step}`
    );

    // 最小值元素和当前元素交换位置
    [arr[i], arr[minIndex]] = [min, arr[i]];
  }
  console.timeEnd("选择排序耗时");
  return arr;
};

const array = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array}`);
const newArr = selectionSort(array);
console.log(`selectionSort排序之后newArr: ${newArr}`);
```

### 计数排序

思想

- 统计每个元素与最小元素的差，作为另一个数组的索引，重复出现的次数作为值
- 依次填充数组 ，其实是利用了数组索引的顺序

特点

- 优点：计数排序是所有排序算法中最简单的，也是最符合直觉的算法。
- 缺点：用在待排序数据范围不大的场景，若数据范围 k 比要排序的数据 n 大很多，浪费空间。

```js
function countingSort(arr) {
  console.time("计数排序耗时");

  if (!Array.isArray(arr)) return;
  const { length } = arr;
  if (length <= 1) return arr;
  let counts = [],
    result = [];
  let min = Math.min(...arr);
  for (let v of arr) {
    //把元素和最小值的差最为数组的index，value为重复次数
    counts[v - min] = (counts[v - min] ?? 0) + 1;
  }
  for (let i = 0; i < counts.length; i++) {
    let count = counts[i];
    // 对应index有值，则index+最小值恢复为原始值，推动数组里
    while (count > 0) {
      result.push(i + min);
      count--;
    }
  }
  console.timeEnd("计数排序耗时");
  return result;
}

const array = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array}`);
const newArr = countingSort(array);
console.log(`countingSort排序之后newArr: ${newArr}`);

console.log("----------------------------");

// TODO: k远大于n，代码执行久,如下
const array1 = [1, 100000001, 9, 1000, 3000];
console.log(`原始array: ${array1}`);
const newArr1 = countingSort(array1);
console.log(`countingSort排序之后newArr: ${newArr1}`);
// 原始array: 1,100000001,9,1000,3000
// 计数排序耗时: 4.344s
// countingSort排序之后newArr: 1,9,1000,3000,100000001
```

### 基数排序

思想

- 基数排序是基于数据位数的一种排序算法。
- 先拿出个位的数字进行排序，再拿出十位上的数字进行排序，依次递归
- 最后结果：位数越多越靠后，相同位数数字越大越靠后，完美

```js
function radixSort(arr) {
  console.time("基数排序耗时");

  if (!Array.isArray(arr)) return;

  let maxLength = 0; //获取最长位数
  for (let v of arr) {
    const { length } = String(v);
    if (length > maxLength) {
      maxLength = length;
    }
  }

  // 遍历每个位数
  for (i = 0; i < maxLength; i++) {
    arr = sort(arr, i); //同位时每次按数字大小排序
  }

  function sort(arr, index) {
    //初始化10个数组元素的数组，因为数字0-9，利用了数组索引顺序
    let buckets = [];
    for (let i = 0; i < 10; i++) {
      buckets.push([]);
    }
    for (let v of arr) {
      //不够最大长度的数字前，填充‘0’
      let pad = String(v).padStart(maxLength, "0");
      //从后面开始，依次获取每个数字，指定位数上的数字
      let num = pad[maxLength - 1 - index];
      //把数字推送到指定num索引上的数组里，方便利用索引大小排序
      buckets[num].push(v);
    }
    let result = [];
    for (let bucket of buckets) {
      // 把根据指定位数的数字大小排序，生成新的数组
      result.push(...bucket);
    }
    return result;
  }
  console.timeEnd("基数排序耗时");
  return arr;
}

const array = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array}`);
const newArr = radixSort(array);
console.log(`radixSort排序之后newArr: ${newArr}`);
```

### 归并排序

思想

- "归并" 二字就是"递归"加"合并"。它是典型的分而治之算法。分治思想
- 把数组一分为二，然后递归地排序好每部分，最后合并。二分法

```js
// 明确函数作用是对一个数组进行排序操作
function mergeSort(arr) {
  if (!Array.isArray(arr)) return;
  const { length } = arr;
  if (length < 2) return arr;

  // 数组一分为二，递归对两部分分别进行排序
  const m = length >> 1,
    left = mergeSort(arr.slice(0, m)),
    right = mergeSort(arr.slice(m));

  let result = [];
  let i = 0,
    j = 0;
  // 当两部分数据都没有取完时
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      // 把较小值推到结果数组里，指针右移
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  // 某一部分数据已经取完，则把另一部分全部推到数组里
  if (i < left.length) {
    result.push(...left.slice(i));
  } else {
    result.push(...right.slice(j));
  }
  return result;
}

const array = Array.from(new Array(10), () => ~~(Math.random() * 100));
console.log(`原始array: ${array}`);
const newArr = mergeSort(array);
console.log(`mergeSort排序之后newArr: ${newArr}`);
```

## 栈

后进先出（Last In First Out）的数据结构。

### 链栈

栈的链接存储结构成为链栈，利用链表实现，链表中的每一个元素由两部分信息组成，一部分是存储其本身的信息（数据域），一部分是存储一个指示其直接后继的信息，即直接后继的存储位置（指针域）

对于链式栈，无栈满的问题，空间可以扩充，插入与删除仅在栈顶处执行，链式栈的栈顶在链头。

入栈操作：插入一个新元素 node，只能在链接在栈顶处，指针域指向原栈顶元素(node.next = top;)，栈顶指针 top 再指向这个新元素(top = node)
出栈操作：只能删除栈顶元素，删除时，栈顶指针指向原来栈顶元素的指针域。node = top; top = top.next; return node.data;

```js
// 定义节点
class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

/**
 * 属性：
 * length:栈的长度
 * top:栈顶指针
 *
 * 方法：
 * push:入栈
 * pop:出栈
 * peek:读栈顶数据元素
 * toSting:遍历栈将每个节点值转换为字符串，并返回结果
 * isEmpty:判断栈是否为空
 * size:栈的数据元素个数
 * clear:清除栈数据
 */
class LinkStack {
  constructor() {
    this.length = 0;
    this.top = null; // 栈顶指针
  }

  push(element) {
    let curNode;
    let node = new Node(element);
    //如果栈顶是null则新元素节点直接作为栈顶
    if (!this.top) {
      this.top = node;
    } else {
      // 将新元素节点取代栈顶，并且指向的节点是原来栈顶元素节点
      curNode = this.top;
      node.next = curNode;
      this.top = node; // 插入的新元素为栈顶
    }
    this.length++;
  }
  pop() {
    let curNode = this.top;
    if (this.top === null) {
      return null;
    }
    let element = curNode.element;
    this.top = curNode.next; // 栈顶指针指向原来栈顶元素的指针域
    this.length--;
    return element;
  }
  peek() {
    if (this.top === null) {
      return null;
    }
    return this.top.element;
  }
  toString() {
    let str = "";
    let curNode = this.top;
    while (curNode) {
      str += curNode.element + ",";
      curNode = curNode.next;
    }
    str = str.slice(0, str.length - 1);
    return str;
  }
  isEmpty() {
    return this.top === null;
  }
  size() {
    return this.length;
  }
  clear() {
    this.top = null;
    this.length = 0;
  }
}

const linkStack = new LinkStack();

let size = linkStack.size();
console.log("size:", size);

let isEmpty = linkStack.isEmpty();
console.log("isEmpty:", isEmpty);

let peek = linkStack.peek();
console.log("读取栈顶:", peek);

let pop = linkStack.pop();
console.log(pop, "出栈");

let toString = linkStack.toString();
console.log("toString:", toString);

linkStack.push("A");
linkStack.push("B");
linkStack.push("C");
linkStack.push("D");

toString = linkStack.toString();
console.log("toString:", toString);

pop = linkStack.pop();
console.log(pop, "出栈");
pop = linkStack.pop();
console.log(pop, "出栈");
pop = linkStack.pop();
console.log(pop, "出栈");

toString = linkStack.toString();
console.log("toString:", toString);

peek = linkStack.peek();
console.log("读取栈顶:", peek);

size = linkStack.size();
console.log("size:", size);
```

### 顺序栈

栈，又叫堆栈，比列表高效，因为栈内的元素只能通过列表的一端访问，称为栈顶，数据只能在栈顶添加或删除，遵循先入后出(LIFO，last-in-first-out) 的原则

顺序栈：利用一组地址连续的存储单元一次存放自栈底到栈顶的数据元素，把数组中下标为 0 的一端作为栈底。对栈的操作主要有两种，一是将一个元素压入栈，push 方法，另一个就是将栈顶元素出栈，pop 方法。

```js
/**
 属性：
 stackArray:存储栈数据
 方法：
 pop:出栈，删除栈顶元素,并且返回该值
 push:入栈，在栈顶将新元素入栈
 peek:查看当前栈顶元素,仅仅是查看，并不删除
 isEmpty:判断是否为空
 size:查看当前栈元素的总数
 clear:清空栈内元素
 toString:遍历栈查看所有元素
 */

class ArraySatck {
  constructor() {
    this.datas = [];
  }
  isEmpty() {
    return this.datas.length === 0;
  }
  size() {
    return this.datas.length;
  }
  push(item) {
    this.datas.push(item);
  }
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.datas.pop(); // 原生js数组pop方法删除最后一个元素并且返回
  }
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.datas[this.size() - 1];
  }
  clear() {
    this.datas = [];
  }
  toString() {
    return this.datas.toString();
  }
}

const arraySatck = new ArraySatck();

let isEmp = arraySatck.isEmpty();
console.log("是否为空", isEmp);

length = arraySatck.size();
console.log("栈长度", length);

let pop = arraySatck.pop();
console.log(pop + "出栈");

let peek = arraySatck.peek();
console.log("查看栈顶", peek);

let str = arraySatck.toString();
console.log("toSting", str);

arraySatck.push("A");
arraySatck.push("B");
arraySatck.push("C");
arraySatck.push("D");
arraySatck.push("E");

isEmp = arraySatck.isEmpty();
console.log("是否为空", isEmp);

length = arraySatck.size();
console.log(length);

pop = arraySatck.pop();
console.log(pop + "出栈");

pop = arraySatck.pop();
console.log(pop + "出栈");

peek = arraySatck.peek();
console.log("查看栈顶", peek);

str = arraySatck.toString();
console.log("toSting", str);

arraySatck.clear();

str = arraySatck.toString();
console.log("after clear toSting", str);

let arr = arraySatck.datas;
console.log("datas", arr);
```

## 队列

先进先出（First In First Out）的数据结构。和栈一样，队列是一种操作受限制的线性表，只允许在表的前端（front：队头）进行删除操作，而在表的后端（rear：队尾）进行插入操作，

### 链队列

链式队列不存在假溢出问题。

- 空的链队条件：头指针 front 和尾指针 rear 均指向头节点，即 front == rear
- 入队操作：将新 rear.next 指向新元素节点，然后将 rear.next 设置为 rear
- 出队操作：修改队头 front 指向，front.next = front.next.next

```js
// 定义节点
class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

class LinkQueue {
  constructor() {
    this.head = new Node(null);
    this.front = this.head;
    this.rear = this.head;
    this.length = 0;
  }

  isEmpty() {
    return this.front.next === null;
  }

  enqueue(element) {
    let node = new Node(element);
    this.rear.next = node; // 在这里front与rear都是指向head,对rear操作其属性是对引用数据类型操作，他们都会改变
    this.rear = node; // 在这里rear整个被重新赋值为node，引用数据类型指向node，此时之后对rear其属性操作不会改变front
    this.length++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    let element = this.front.next.element;
    this.front.next = this.front.next.next;
    this.length--;
    if (this.front.next == null) {
      this.rear = this.front;
    }
    return element;
  }

  getFront() {
    if (this.isEmpty()) {
      return null;
    }
    return this.front.next.element;
  }

  toString() {
    let str = "";
    let node = this.front.next;
    while (node !== null) {
      str += node.element + ",";
      node = node.next;
    }
    str = "[" + str.slice(0, -1) + "]";
    return str;
  }

  size() {
    return this.length;
  }

  /**
   * 使头指针和尾指针均指向头节点
   */
  clear() {
    this.front = this.head;
    this.rear = this.head;
    this.length = 0;
  }
}

linkQueue = new LinkQueue();

console.log("getFront", linkQueue.getFront());
console.log("toString", linkQueue.toString());
console.log("size", linkQueue.size());

console.log("------------------------");
linkQueue.enqueue("A");
linkQueue.enqueue("B");
linkQueue.enqueue("C");
linkQueue.enqueue("D");
linkQueue.enqueue("E");

console.log("getFront", linkQueue.getFront());
console.log("toString", linkQueue.toString());
console.log("size", linkQueue.size());
console.log("------------------------");

console.log(linkQueue.dequeue(), "出队列");
console.log(linkQueue.dequeue(), "出队列");
console.log(linkQueue.dequeue(), "出队列");
console.log(linkQueue.dequeue(), "出队列");

console.log("getFront", linkQueue.getFront());
console.log("toString", linkQueue.toString());
console.log("size", linkQueue.size());

console.log("------------------------");
linkQueue.clear();
console.log("getFront", linkQueue.getFront());
console.log("toString", linkQueue.toString());
console.log("size", linkQueue.size());

console.log("------------------------");
linkQueue.enqueue("F");
linkQueue.enqueue("G");
console.log("getFront", linkQueue.getFront());
console.log("toString", linkQueue.toString());
console.log("size", linkQueue.size());
```

### 顺序队列

用一组地址连续的存储单元依次存放从队列头到队列尾的元素的队列。如果数组长度限制，那么顺序队列会存在假溢满问题，这样子可能需要进行数据迁移，这样是非常消耗性能的，由于 js 数组没有最大长度限制（除非内存溢出），所以 js 版本的顺序队列没有溢出问题。队列的基本操作：

- 入队：将新元素追加到队列尾
- 出队：删除队列头元素，并且返回元素值
- 获取头元素：仅仅返回头元素的值
- 求队列长度:求出队列中数据元素的个数
- 判断空:判断当前队列是否为空
- 输出队列：返回队列中所有的元素
- 销毁:清空队列

```js
class ArrayQueue {
  constructor() {
    this.datas = [];
  }

  enqueue(item) {
    this.datas.push(item);
  }

  dequeue() {
    return this.datas.shift();
  }

  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.datas[0];
  }

  isEmpty() {
    return this.datas.length === 0;
  }

  size() {
    return this.datas.length;
  }

  toString() {
    return "[" + this.datas.toString() + "]";
  }
}

const queue = new ArrayQueue();

console.log("isEmpty", queue.isEmpty());
console.log("size", queue.size());
console.log("front", queue.front());
console.log("toString", queue.toString());
console.log("----------------------------------");

queue.enqueue("A");
queue.enqueue("B");
queue.enqueue("C");
queue.enqueue("D");
queue.enqueue("E");

console.log("isEmpty", queue.isEmpty());
console.log("size", queue.size());
console.log("front", queue.front());
console.log("toString", queue.toString());
console.log("----------------------------------");

let item = null;
item = queue.dequeue();
for (let i = 0; i < 3; i++) {
  console.log(item, "出队列");
  item = queue.dequeue();
}
console.log("isEmpty", queue.isEmpty());
console.log("size", queue.size());
console.log("front", queue.front());
console.log("toString", queue.toString());
```

### 循环队列

使用限制数组长度实现的循环队列，循环队列的优点是不存在队列假溢满问题，不需要进行数据迁移

```js
class SequenceQueue {
  constructor(length) {
    // 约定少用一个数组存储空间来判断队列是否满，为了满足用户需要length个数据，将length+1处理
    this.length = length + 1;
    this.datas = [];
    this.front = 0;
    this.rear = 0;
  }

  isEmpty() {
    return this.rear === this.front;
  }

  isFull() {
    return (this.rear + 1) % this.length === this.front;
  }

  /**
   * 入队的时候将队尾指针rear+1，再将元素按rear指示位置加入
   * @param item
   * @returns {boolean}
   */
  enqueue(item) {
    if (this.isFull()) {
      return false;
    }
    this.rear = (this.rear + 1) % this.length;
    this.datas[this.rear] = item;
  }

  /**
   * 先将队头指针front+1,再将front所指示的元素取出
   * @returns {*}
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    this.front = (this.front + 1) % this.length;
    let result = this.datas[this.front];
    delete this.datas[this.front];
    return result;
  }

  /**
   * 取出队列头元素
   * @returns {*}
   */
  getFront() {
    if (this.isEmpty()) {
      return null;
    }
    return this.datas[(this.front + 1) % this.length];
  }

  /**
   * 队列中数据元素个数
   * @returns {number}
   */
  size() {
    return (this.rear - this.front + this.length) % this.length;
  }

  /**
   *
   * @returns {string}
   * 注意这里toString不能简单地见this.datas元素直接遍历输出，要根据队列实际有效数据输出
   */
  toString() {
    let i,
      j = this.front;
    let str = "";
    for (i = 0; i < this.size(); i++) {
      j = (j + 1) % this.length;
      str += this.datas[j] + ",";
    }
    str = str.slice(0, -1);
    return str;
  }

  clear() {
    this.front = this.rear = 0;
    this.datas = [];
  }
}

const sequenceQueue = new SequenceQueue(5);

console.log("isEmpty", sequenceQueue.isEmpty());
console.log("isFull", sequenceQueue.isFull());

let front = sequenceQueue.getFront();
console.log("front", front);

let size = sequenceQueue.size();
console.log("size", size);

let toStr = sequenceQueue.toString();
console.log("toStr", toStr);
console.log("---------1------------");

sequenceQueue.enqueue("A");
sequenceQueue.enqueue("B");
sequenceQueue.enqueue("C");
sequenceQueue.enqueue("D");
sequenceQueue.enqueue("E");
sequenceQueue.enqueue("F");

console.log("isEmpty", sequenceQueue.isEmpty());
console.log("isFull", sequenceQueue.isFull());

size = sequenceQueue.size();
console.log("size", size);

front = sequenceQueue.getFront();
console.log("front", front);

toStr = sequenceQueue.toString();
console.log("toStr", toStr);
console.log("--------2-------------");

let item = sequenceQueue.dequeue();
console.log(item, "出队列");
item = sequenceQueue.dequeue();
console.log(item, "出队列");
item = sequenceQueue.dequeue();
console.log(item, "出队列");

front = sequenceQueue.getFront();
console.log(item, "出队列之后front", front);

toStr = sequenceQueue.toString();
console.log("toStr", toStr);
console.log("---------3------------");

console.log("队列数组真实元素", sequenceQueue.datas);

console.log("---------4------------");
sequenceQueue.clear();
toStr = sequenceQueue.toString();
console.log("after clear toStr", toStr);
console.log("----------5-----------");
console.log("after clear  队列数组真实元素", sequenceQueue.datas);
```

## 链表

### 单向列表

```js
class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.size = 0;
    this.head = null;
  }
  // 删除某节点
  delete(node) {
    let nextNode = node.next;
    node.value = nextNode.value;
    node.next = nextNode.next;
    // 把指针指向下下个节点，既是删除
  }
  // 删除重复链表
  deleteDuplicates() {
    if (!this.head) return head;
    let current = head;
    let next = current.next;
    while (next) {
      if (current.value === next.value) {
        current.next = next.next;
        // 相邻两个节点的值相等，就是重复了，令指针指向下下个节点
      } else {
        current = next;
      }
    }
    return this.head;
  }
  // 新增节点放到链表指定值对应的一个节点后面
  insert(refValue, insertValue) {
    let node = new Node(insertValue);
    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.head;
      while (current) {
        console.log(111, current.value, insertValue);
        if (current.value === refValue) {
          let next = current.next;
          current.next = node;
          node.next = next;
          return ++this.size;
        }
        current = current.next;
      }
      throw new Error(`没有找到值为${refValue}的node`);
    }
  }
  // 反转链表
  reverse() {
    let current = this.head;
    let previousNode = null;
    let nextNode = null;
    while (current) {
      nextNode = current.next;
      current.next = previousNode;
      previousNode = current;
      current = nextNode;
    }
    this.head = previousNode;
  }
  // 链表转成字符串，节点值用‘，’拼接
  toString() {
    let current = this.head;
    let string = "";
    while (current) {
      string += current.value + (current.next ? "," : "");
      current = current.next;
    }
    return string;
  }
  /**
   * @method 尾部追加数据
   * @param {any} element 追加数据
   */
  append(element) {
    let node = new Node(element);
    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.getNode(this.size - 1);
      current.next = node;
    }
    this.size++;
  }

  /**
   * @method 指定位置追加数据
   * @param {Number} position 位置
   * @param {any} element 追加数据
   */
  appendAt(position, element) {
    if (position < 0 || position > this.size) {
      throw new Error("position out range");
    }
    let node = new Node(element);
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let pre = this.getNode(position - 1);
      node.next = pre.next;
      pre.next = node;
    }
    this.size++;
  }

  /**
   * @method 删除指定位置数据
   * @param {Number} position 位置
   */
  removeAt(position) {
    if (position < 0 || position >= this.size) {
      throw new Error("position out range");
    }
    let current = this.head;
    if (position === 0) {
      this.head = current.next;
    } else {
      let pre = this.getNode(position - 1);
      current = pre.next;
      pre.next = current.next;
    }
    this.size--;
  }

  /**
   * @method 修改指定位置数据
   * @param {Number} position 位置
   * @param {any} element 追加数据
   */
  update(position, element) {
    if (position < 0 || position >= this.size) {
      throw new Error("position out range");
    }
    let pre = this.getNode(position);
    pre.element = element;
  }

  /**
   * @method 查找指定位置数据
   * @param {Number} position 位置
   * @return {any} 返回数据
   */
  getData(position) {
    if (position < 0 || position >= this.size) {
      throw new Error("position out range");
    }
    let pre = this.getNode(position);
    return pre.element;
  }

  /**
   * @method 查找指定数据索引
   * @param {any} element
   * @return {Number} 索引
   */
  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.size; i++) {
      if (current.element === element) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }

  /**
   * @method 返回链表长度
   * @return {Number} 链表长度
   */
  get length() {
    return this.size;
  }

  getNode(index) {
    if (index < 0 || index >= this.size) {
      throw new Error("out range");
    }
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
}

let ll = new LinkedList();
```

### 双向链表

```js
class DoublyNode {
  constructor(element) {
    this.element = element;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }

  /**
   * @method 尾部追加数据
   * @param {any} element 追加数据
   */
  append(element) {
    let node = new DoublyNode(element);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.size++;
  }

  /**
   * @method 指定位置追加数据
   * @param {*} position 位置
   * @param {*} element 追加数据
   */
  appendAt(position, element) {
    if (position < 0 || position > this.size) {
      throw new Error("position out range");
    }
    let node = new DoublyNode(element);
    if (position === 0) {
      if (this.head === null) {
        this.head = node;
        this.tail = node;
      } else {
        node.next = this.head;
        this.head.perv = node;
        this.head = node;
      }
    } else if (position === this.size) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      let pre = this.getNode(position - 1);
      pre.next = node;
      node.prev = pre;
      node.next = pre.next;
      pre.prev = node;
    }
    this.size++;
  }

  /**
   * @method 删除指定位置数据
   * @param {*} position 位置
   */
  removeAt(position) {
    if (position < 0 || position >= this.size) {
      throw new Error("position out range");
    }
    let current = this.head;
    if (position === 0) {
      if (this.size === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = current.next;
        this.head.prev = null;
      }
    } else if (position === this.size - 1) {
      this.tail.prev.next = null;
      this.tail = this.tail.prev;
    } else {
      let pre = this.getNode(position - 1);
      current = pre.next;
      pre.next = current.next;
    }
    this.size--;
  }

  /**
   * @method 修改指定位置数据
   * @param {Number} position 位置
   * @param {any} element 追加数据
   */
  update(position, element) {
    if (position < 0 || position >= this.size) {
      throw new Error("position out range");
    }
    let pre = this.getNode(position);
    pre.element = element;
  }

  /**
   * @method 查找指定位置数据
   * @param {Number} position 位置
   * @return {any} 返回数据
   */
  getData(position) {
    if (position < 0 || position >= this.size) {
      throw new Error("position out range");
    }
    let pre = this.getNode(position);
    return pre.element;
  }

  /**
   * @method 查找指定数据索引
   * @param {Number} element
   * @return {Number} 索引
   */
  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.size; i++) {
      if (current.element === element) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }

  /**
   * @method 返回链表长度
   * @return {Number} 链表长度
   */
  get length() {
    return this.size;
  }

  getNode(index) {
    if (index < 0 || index >= this.size) {
      throw new Error("out range");
    }
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
}

let ll = new DoublyLinkedList();
ll.append(1);
```

### 是否环形链表

快慢两个指针，快指针循环一圈还能找到慢指针，说明存在循环

```js
var hasCycle = function (head) {
  if (head == null || head.next == null) return false;
  let slow = head;
  let fast = head;
  while (fast != null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
};
```

## 树

### 二叉树

经典的遍历方法有三种，前序遍历、中序遍历和后序遍历。
其中，前、中、后序，表示的是节点与它的左右子树节点遍历打印的先后顺序。
前序遍历是指，对于树中的任意节点来说，先打印这个节点，然后再打印它的左子树，最后打印它的右子树。
中序遍历是指，对于树中的任意节点来说，先打印它的左子树，然后再打印它本身，最后打印它的右子树。
后序遍历是指，对于树中的任意节点来说，先打印它的左子树，然后再打印它的右子树，最后打印这个节点本身。

```js
/**
 * 二叉搜索树满足以下的几个性质：
 *
 * 若任意节点的左子树不空，则左子树上所有节点的值均小于它的根节点的值；
 * 若任意节点的右子树不空，则右子树上所有节点的值均大于它的根节点的值；
 * 任意节点的左、右子树也需要满足左边小右边大的性质
 *
 * 二叉搜索树操作:
 * insert(key):向二叉树中插入一个新的健
 * search(key):在二叉树中查找一个健，如果节点存在，则返回true,如果不存在，则返回false
 * inOrder:通过中序遍历方式遍历所有节点
 * preOrder:通过先序遍历方式遍历所有的节点
 * postOrder:通过后序遍历方式遍历所有节点
 * min:返回树中最小的值/健
 * max:返回树中最大的值/健
 * search(key):查找某个key是否存在
 * remove(key):从树中移除某个键
 *
 * 注意：如果insert的数据是Stirng类型，会自动转码再比较。
 */

class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // insert
  insert(key) {
    let newNode = new Node(key);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this._insert(this.root, newNode);
    }
  }
  _insert(node, newNode) {
    if (newNode.key < node.key) {
      // 向左查找
      if (node.left === null) {
        node.left = newNode;
      } else {
        this._insert(node.left, newNode);
      }
    } else {
      // 向右查找
      if (node.right === null) {
        node.right = newNode;
      } else {
        this._insert(node.right, newNode);
      }
    }
  }

  // 先序遍历
  preOrder(handler) {
    this._preOrder(this.root, handler);
  }
  // 对某个节点遍历,每一个节点都会遍历左右节点，从左到右
  _preOrder(node, handler) {
    if (node !== null) {
      // 处理节点
      handler(node.key);
      // 处理经过的左节点
      this._preOrder(node.left, handler);
      // 处理经过的右节点
      this._preOrder(node.right, handler);
    }
  }

  // 中序遍历
  inOrder(handler) {
    this._inOrder(this.root, handler);
  }
  _inOrder(node, handler) {
    if (node !== null) {
      // 处理左子树中节点
      this._inOrder(node.left, handler);
      // 处理节点
      handler(node.key);
      // 处理右子树中的节点
      this._inOrder(node.right, handler);
    }
  }

  // 后序遍历
  postOrder(handler) {
    this._postOrder(this.root, handler);
  }
  _postOrder(node, handler) {
    if (node !== null) {
      // 处理左子树中的节点
      this._postOrder(node.left, handler);
      // 处理右子树中节点
      this._postOrder(node.right, handler);
      // 处理节点
      handler(node.key);
    }
  }

  // 返回min值
  min() {
    let node = this.root;
    let key = null;
    while (node !== null) {
      key = node.key;
      node = node.left;
    }
    return key;
  }

  // 返回max值
  max() {
    let node = this.root;
    let key = null;
    while (node !== null) {
      key = node.key;
      node = node.right;
    }
    return key;
  }

  // 搜索某一个key
  search(key) {
    let node = this.root;
    // 循环搜索key
    while (node !== null) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else {
        return true;
      }
    }
    return false;
  }

  /**
   * remove
   * 1.先找到要删除的节点
   * 2.情况一：删除叶子点
   * 3.情况二：删除只有一个子节点的节点
   */
  remove(key) {
    let curNode = this.root;
    let parent = null;
    let isLeftChild = true;
    // 1.寻找需要删除的节点和其父节点
    while (curNode !== key) {
      parent = curNode;
      if (key < curNode.key) {
        isLeftChild = true;
        curNode = curNode.left;
      } else {
        isLeftChild = false;
        curNode = curNode.right;
      }
      //遍历到最后节点，没找到
      if (curNode === null) {
        return false;
      }
    }

    // 根据对应的情况进行删除操作
    // 1.删除的节点是叶子节点
    if (curNode.left === null && curNode.right === null) {
      if (curNode === this.root) {
        this.root = null;
      } else if (isLeftChild) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    }
    // 2.删除的节点有一个子节点
    else if (curNode.right === null) {
      if (curNode === this.root) {
        this.root = curNode;
      } else if (isLeftChild) {
        parent.left = curNode.left;
      } else {
        parent.right = curNode.left;
      }
      n;
    } else if (curNode.left === null) {
      if (curNode === this.root) {
        this.root = curNode;
      } else if (isLeftChild) {
        parent.left = curNode.right;
      } else {
        parent.right = curNode.right;
      }
    }

    // 3.删除的节点有两个子节点
  }
}

const bst2 = new BinarySearchTree();

bst2.insert("安琪拉");
bst2.insert("亚瑟");
bst2.insert("王昭君");
bst2.insert("貂蝉");
bst2.insert("甄姬");
bst2.insert("娜可露露");
bst2.insert("典韦");
bst2.insert("凯");
bst2.insert("鲁班七号");

resultOrder = "";

// 测试先序遍历
bst2.inOrder(key => {
  resultOrder += key + ",";
});
console.log("min", bst2.min());
console.log("max", bst2.max());
console.log("search 鲁班", bst2.search("鲁班"));
```

### 二叉树相关

```js
// 二叉树：深度优先算法
function deep(root) {
  console.log("处理当前节点,遍历子节点", root);
  root.children?.forEach(deep);
}

// 二叉树： 广度优先算法
function guandu(root) {
  const result = [root];
  // 每次执行当前节点时，把其子节点送入栈尾，保证节点执行顺序
  while (result.length > 0) {
    const current = result.shift();
    console.log("每次取出栈顶元素", current);
    current.children?.forEach(item => result.push(item));
    // 把子节点依次推入栈内，方便依次执行
  }
}

// leetcode 111, 二叉树最小深度
function minDeep(root) {
  if (!root) return 0;
  let stack = [[root, 1]];
  while (stack.length) {
    let [node, n] = stack.shift();
    if (!node.left && !node.right) return n;
    node.left && stack.push([node.left, n + 1]);
    node.right && stack.push([node.right, n + 1]);
  }
}

// leetcode 7, 二叉树最大深度
function maxDeep(root) {
  if (!root) return 0;
  const stack = [root];
  let num = 0;
  while (stack.length) {
    num++;
    let length = stack.length;
    while (length--) {
      const bottom = stack.shift();
      bottom.left && stack.push(bottom.left);
      bottom.right && stack.push(bottom.right);
    }
  }
  return num;
}

// leetcode 104, 反转二叉树
function invertTree(root) {
  if (!root) return root;
  const tem = root.left;
  root.left = root.right;
  root.right = tem;
  invertTree(root.left);
  invertTree(root.right);
}

// leetcode 100, 是否相同二叉树
function isSomeTree(node1, node2) {
  if (node1 === null && node2 === null) return true;
  if (node1 === null || node2 === null) return false;
  if (node1.value !== node2.value) return false;
  return (
    isSomeTree(node1.left, node2.left) && isSomeTree(node1.right, node2.right)
  );
}
```

## 哈希表

```js
class HasTable {
  constructor() {
    this.storage = [];
    this.count = 0;
    this.limit = 7;
  }

  /** 哈希函数
   * 将字符串转换成比较大的数字，这个数字称为 hashCode
   * 将大的数字压缩到数组(size) 范围之内既 index
   * size为哈希表的长度
   */
  hasFunc(str, size = 7) {
    // PRIME_NUMBER 为质数，且小于数组的容量
    const PRIME_NUMBER = 37;
    // 定义 hasCode 变量
    let hasCode = 0;
    // 计算hasCode的值
    for (let i = 0; i < str.length; i++) {
      hasCode = PRIME_NUMBER * hasCode + str.charCodeAt(i);
    }
    // 取余操作
    return hasCode % size;
  }

  // 插入修改操作
  put(key, value) {
    // 根据Key获取index
    let index = this.hasFunc(key, this.limit);
    // 根据index取出对应的bucket
    let bucket = this.storage[index];
    // 判断bucket是否为null
    if (bucket == null) {
      bucket = [];
      this.storage[index] = bucket;
    }
    // 判断是否修改数据
    for (let i = 0; i < bucket.length; i++) {
      let tuple = bucket[i];
      if (tuple[0] === key) {
        tuple[1] = value;
        return;
      }
    }
    // 添加操作
    bucket.push([key, value]);
    this.count++;
  }

  // 获取操作
  get(key) {
    // 根据key获取index
    const index = this.hasFunc(key, this.limit);
    // 根据index获取对应的bucket
    const bucket = this.storage[index];
    // 判断bucket是否空
    if (bucket === null) {
      return null;
    }
    // 有bucket那么进行线性查找
    for (let i = 0; i < bucket.length; i++) {
      let tuple = bucket[i];
      if (tuple[0] === key) {
        return tuple[1];
      }
    }
    // 没有找到，那么返回Null
    return null;
  }

  // 删除操作
  remove(key) {
    // 根据key获取index
    const index = this.hasFunc(key, this.limit);
    // 根据index获取对应的bucket
    const bucket = this.storage[index];
    // 判断bucket是否空
    if (bucket === null) {
      return null;
    }
    // 有bucket那么进行线性查找,并且删除
    for (let i = 0; i < bucket.length; i++) {
      let tuple = bucket[i];
      if (tuple[0] === key) {
        bucket.splice(i, 1);
        this.count--;
        return tuple[1];
      }
    }
    // 没有找到，那么返回Null
    return null;
  }

  // 判断哈希表是否为空
  isEmpty() {
    return this.count === 0;
  }

  // 获取哈希表元素个数
  size() {
    return this.count;
  }
}
```

## 字典

一种以键-值对形式存储数据的数据结构。如：名字-电话号码，通过名字就能找到对应的电话号码，名字就是键(key)，电话号就是值(value)。字典中的键，是值在字典中的索引。

```js
class Dictionary {
  constructor() {
    this.items = {};
  }

  // 添加一个存储键值对
  set(key, value) {
    this.items[key] = value;
  }

  // 根据key返回一个item
  get(key) {
    return this.items.hasOwnProperty(key) ? this.items[key] : undefined;
  }

  // 删除一个存储键值对
  remove(key) {
    if (this.items.hasOwnProperty(key)) {
      delete this.items[key];
    }
  }

  // 返回字典中 key
  get keys() {
    return Object.keys(this.items);
  }

  // 返回字典中 value
  get values() {
    return Object.keys(this.items).reduce((r, c, i) => {
      r.push(this.items[c]);
      return r;
    }, []);
  }
}
const dictionary = new Dictionary();
dictionary.set("zhangjinxi", "zhangjinxi@email.com");
```
