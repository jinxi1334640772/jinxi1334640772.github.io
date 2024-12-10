## 寻找两个数组的中位数

```js
function find(arr, arr2) {
  let arr = [...arr, ...arr2].sort((a, b) => a - b);
  // 先对数组合并后排序

  let middleNum = Math.floor(arr.length / 2);
  // 取中位数

  if (arr.length % 2 === 0) return (arr[middleNum - 1] + arr[middleNum]) / 2;
  // 如果能被2整除，则返回最中间两个数的平均数

  return arr[middleNum];
  // 不能被整除，返回最中间那个数
}
```

## 两数相加

```js
// 给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

// 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

// 您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let c = 0;
  let r = new ListNode();
  let p = r;
  let p1 = l1;
  let p2 = l2;
  while (p1 || p2 || c) {
    c += (p1 && p1.val) + (p2 && p2.val);
    p.next = new ListNode(c % 10);
    c = parseInt(c / 10);
    p1 && (p1 = p1.next);
    p2 && (p2 = p2.next);
    p = p.next;
  }
  return r.next;
};
```

## 罗马数组转整数

```js
// 罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。

// 字符          数值
// I             1
// V             5
// X             10
// L             50
// C             100
// D             500
// M             1000
// 例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。

// 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：

// I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
// X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。
// C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
// 给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。

/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  const map = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let req = 0;
  for (let i = 0; i < s.length; i++) {
    if (i < s.length && map[s[i]] < map[s[i + 1]]) {
      req -= map[s[i]];
    } else {
      req += map[s[i]];
    }
  }
  return req;
};
```

## 合并两个有序链表

```js
// 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function (l1, l2) {
  if (l1 === null) return l2;
  let cur = l1;
  while (l2) {
    let node = new ListNode();
    if (cur.val >= l2.val) {
      node.val = cur.val;
      node.next = cur.next;
      cur.val = l2.val;
      cur.next = node;
      l2 = l2.next;
    } else if (cur.next && l2.val <= cur.next.val) {
      node.val = l2.val;
      node.next = cur.next;
      cur.next = node;
      l2 = l2.next;
    } else if (!cur.next) {
      node.val = l2.val;
      node.next = null;
      cur.next = node;
      l2 = l2.next;
      continue;
    }
    cur = cur.next;
  }
  return l1;
};
```

## 整数倒序输出

用 JavaScript 写一个函数，输入 int 型，返回整数逆序后的字符串。如：输入整型 1234，返回字符串“4321”。

要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串。

```js
// 小于10只有一个数组，直接返回
// 大于等于10，把最后数字放最前面，并拼接，剩余部分递归调用的返回值
function getReverse(num) {
  return num < 10
    ? num.toString()
    : `${num % 10}${getReverse(Math.floor(num / 10))}`;
}
```

## 各位相加

```js
// 给定一个非负整数 num，反复将各个位上的数字相加，直到结果为一位数。
/**
 * @param {number} num
 * @return {number}
 */
var addDigits = function (num) {
  let arr = [];
  for (let index of num.toString()) {
    arr.push(index);
  }
  if (arr.length === 1) {
    return parseInt(arr[0]);
  }
  let number = 0;
  for (let i = 0; i < arr.length; i++) {
    number += parseInt(arr[i]);
  }
  if (number > 9) {
    return addDigits(number);
  } else {
    return number;
  }
};
```

## 种花问题

```js
// 605. 种花问题
// 假设你有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花卉不能种植在相邻的地块上，它们会争夺水源，两者都会死去。

// 给定一个花坛（表示为一个数组包含0和1，其中0表示没种植花，1表示种植了花），和一个数 n 。能否在不打破种植规则的情况下种入 n 朵花？能则返回True，不能则返回False。
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function (flowerbed, n) {
  let max = 0;
  for (let i = 0; i < flowerbed.length - 1; i++) {
    if (flowerbed[i] === 0) {
      if (i === 0 && flowerbed[1] === 0) {
        max++;
        i++;
      } else if (flowerbed[i - 1] === 0 && flowerbed[i + 1] === 0) {
        max++;
        i++;
      }
    }
  }
  return max >= n;
};
```

## 卡牌分组

给定一副牌，每张牌上都写着一个整数。此时，你需要选定一个数字 X，使我们可以将整副牌按下述规则分成 1 组或更多组：

- 每组都有  X  张牌。
- 组内所有的牌上都写着相同的整数。
- 仅当你可选的 X >= 2 时返回  true。

```js
/**
 * @param {number[]} deck
 * @return {boolean}
 */
var hasGroupsSizeX = function (deck) {
  // 最大公约数计算公式
  function gcd(num1, num2) {
    // 利用辗转相除法来计算最大公约数
    return num2 === 0 ? num1 : gcd(num2, num1 % num2);
  }

  // 相同牌出现次数Map
  let timeMap = new Map();

  // 遍历牌
  deck.forEach(num => {
    // 统计每张牌出现的次数
    timeMap.set(num, timeMap.has(num) ? timeMap.get(num) + 1 : 1);
  });

  // Map.protype.values()返回的是一个新的Iterator对象，所以可以使用扩展运算符(...)来构造成数组
  let timeAry = [...timeMap.values()];

  /*
  最大公约数
  因为该数组是出现次数数组，最小值至少为1（至少出现1次），所以默认赋值为数组首位对公约数计算无干扰
  */
  let g = timeAry[0];

  // 遍历出现次数，计算最大公约数
  timeAry.forEach(time => {
    // 因为需要比较所有牌出现次数的最大公约数，故需要一个中间值
    g = gcd(g, time);
  });

  // 判断是否满足题意
  return g >= 2;
};
```

## 删除字符串中的所有相邻重复项

```js
// 给你一个字符串 s，「k 倍重复项删除操作」将会从 s 中选择 k 个相邻且相等的字母，并删除它们，使被删去的字符串的左侧和右侧连在一起。
// 你需要对 s 重复进行无限次这样的删除操作，直到无法继续为止。
// 在执行完所有删除操作后，返回最终得到的字符串。

/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var removeDuplicates = function (s, k) {
  let stack = [];
  for (const c of s) {
    let prev = stack.pop();
    if (!prev || prev[0] !== c) {
      stack.push(prev);
      stack.push(c);
    } else if (prev.length < k - 1) {
      stack.push(prev + c);
    }
  }
  return stack.join("");
};
```

## 将整数转换为两个无零整数的和

```js
// 「无零整数」是十进制表示中 不含任何 0 的正整数。
// 给你一个整数 n，请你返回一个 由两个整数组成的列表 [A, B]，满足：
// A 和 B 都是无零整数 并且 A + B = n

/**
 * @param {number} n
 * @return {number[]}
 */
var getNoZeroIntegers = function (n) {
  let time = 1;
  while (String(time).includes("0") || String(n - time).includes("0")) {
    time++;
  }
  return [time, n - time];
};
```

## 控制执行顺序和延误时间的类

```js
// 先延迟2s，打印1，延迟1s，打印2，在延迟1s，打印3
new O().print(1).wait(1).print(2).wait(1).print(3).firstWait(2);

class O {
  constructor() {
    this.callbackList = []; // 任务中心

    // setTimeout延迟自动执行，保证任务都已加入任务中心
    setTimeout(() => {
      next();
    });
  }
  next() {
    // 取出任务中心最前面一个任务，如果存在就执行
    let nextCallback = this.callbackList.shift();
    if (nextCallback) {
      nextCallback();
    }
  }
  print(value) {
    const that = this; // 保存this的引用

    // 用自执行函数把任务函数包起来，保持对参数value的引用
    const fun = (function (param) {
      return function () {
        console.log(param);
        that.next(); //当任务执行时，在打印之后立即执行下一个任务
      };
    })(value);
    this.callbackList.push(fun);
    //把当前打印的任务，推送到任务中心

    return this; //返回当前实例，可以链式调用实例的方法
  }
  wait(time) {
    const that = this;
    const fun = (function (param) {
      return function () {
        console.log("输出等待时间：", param);
        that.next();
        setTimeout(() => {
          that.next(); // 等待time时间后，再执行下一个任务
        }, param * 1000);
      };
    })(time);
    this.callbackList.push(fun);
    return this;
  }
  firstWait(time) {
    const that = this;
    const fun = (function (param) {
      return function () {
        console.log("输出首先等待时间：", param);
        that.next();
        setTimeout(() => {
          that.next();
        }, param * 1000);
      };
    })(time);
    this.callbackList.unshift(fun);
    // 推送到任务中心首位，会先等待再执行下一个任务
    return this;
  }
}
```

## 整数数组分组

```js
let array = [2, 10, 3, 4, 5, 11, 10, 11, 20];
// 转成： [[2, 3, 4, 5], [10, 11], [20]]
function formatArray(array) {
  let result = [];
  array
    .sort((a, b) => a - b)
    .forEach(item => {
      let remainder = Math.floor(item / 10);
      (result[remainder] || (result[remainder] = [])).push(item);
    });
  return result.filter(item => item);
}
formatArray(array);
```

## 字符串大小写转化

```js
// AbC to aBc
function transformChar(string) {
  let char = "";
  for (let index = 0; index < string.length; index++) {
    let code = string.charCodeAt(index);
    let thransCode = code + (code > 90 ? -32 : 32);
    // 小写比大写字母code 码大32：a-z=32
    char += String.fromCharCode(thransCode);
  }
  return char;
}
console.log(transformChar("AbC"));
```

## 数组每个值移动 n 个位置

```js
function reverseArray(array, n) {
  let length = array.length;
  let result = [];
  for (let index = 0; index < length; index++) {
    const element = array[index];
    let aferIndex = (index + n) % length;
    // 索引相加后取模，既是移动之后的位置
    result[aferIndex] = element;
  }
  return result;
}
console.log(reverseArray([1, 2, 3, 4, 5, 6, 7], 8));
```

## 找出 1000 内对称的数

把数字反转后依然相等，就是对称的数。

```js
[...Array(1000).keys()].filter(item => {
  return (
    item > 10 && item === Number(item.toString().split("").reverse().join(""))
  );
});
```

## 数组中 0 移动到最后面

要求：只在 array 上更改

```js
let array = [0, 1, 0, 3, 0, 12, 0];
let length = array.length;
let moveNum = 0; //记录移动的个数
for (let index = 0; index < length - moveNum; ) {
  //仅需遍历index前length - moveNum的数字，后面都是移动后的0了

  if (array[index] === 0) {
    array.push(array.splice(index, 1)[0]);
    // 把=0的数，截取到数组最后面

    // 数字被截取，需要继续遍历当前index的值
    moveNum++;
  } else {
    index++;
  }
}
console.log(array);
```

## 实现 add 函数

满足以下功能。

```js
add(1); // 1
add(1)(2); // 3
add(1)(2)(3); // 6
add(1)(2, 3); // 6
add(1, 2)(3); // 6
add(1, 2, 3); // 6
console.log(add(1, 2, 3));

function add(...a) {
  let sum = a.reduce((p, n) => p + n);
  function next(...b) {
    let _sum = b.reduce((p, n) => p + n);
    sum = sum + _sum;
    return next;
  }
  next.toString = function () {
    return sum;
  };
  return next;
}
```

## 树结构找出父级 id 数组

1121 => [1,11,112,1121]

```js
function findParents(array, params) {
  let length = params.length;
  let findArray = array;
  let result = [];
  for (let index = 0; index < length; index++) {
    const element = params.slice(0, index + 1);
    // 每次截取前index-1的字符：这是当前父级的id

    const parent = findArray.find(item => item.id === element);
    // 根据父级id找出当前父级

    if (!parent) return [];
    // 找不到父级，宣告失败，直接返回空数组

    result.push(element);
    // 找到了父级，把父级id添加到结果数组里

    if (index === length - 1) {
      return result;
      // 当前已经是最后一位了，返回结果
    } else {
      if (parent?.children?.length) {
        findArray = parent.children;
        // 当前父级若存在子项，则从子项里寻找下一个父级id
      } else {
        return [];
        // 当前父级没有子项，无法寻找下一个父级id，则宣告失败
      }
    }
  }
}
```

## 每次走 1 或者 2 步阶梯，n 阶梯有多少种走法？

```js
// 方法一
function getNumber(n) {
  if (n <= 2) return n;
  return getNumber(n - 1) + getNumber(n - 2);
}

// 方法二 时间复杂度低
function getNumber(n, map = new Map()) {
  if (n <= 2) return n;
  if (map.get(n) !== null) return map.get(n);
  let result = getNumber(n - 1, map) + getNumber(n - 2, map);
  map.set(n, result);
  return result;
}
```

## 斐波那契函数，输入 n,求其数列的第 n 项

```js
function getNumber(n) {
  if (n <= 2) return 1;
  return getNumber(n - 1) + getNumber(n - 2);
}
// methods two 时间复杂度低
function getNumber(n, map = new Map()) {
  if (n <= 2) return 1;
  if (map.get(n)) return map.get(n);
  let result = getNumber(n - 1, map) + getNumber(n - 2, map);
  map.set(n, result);
  return result;
}
```

## leetcode 1

整数数组中，求两个数之和为 target 的两个数的索引 o(n~2)

```js
// 双指针思想
function getIndex(array, target) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] + array[j] == target) return [i, j];
    }
  }
}

// 使用map缓存遍历过的数值o(n)
function getIndex(array, target) {
  let map = new Map();
  for (let i = 0; i < array.length; i++) {
    let another = target - array[i];
    if (map.has(another)) return [map.get(another), i];
    map.set(array[i], i);
  }
}
```

## 数组合并相关

两个整数升序数组 num1,num2,元素个数分别为 m,n,把 num2 数组有序合并到 num1 中，

```js
// 方法一 填充到另一个数组后，排序
function combine(num1, num2, m, n) {
  for (let i = 0; i < n; i++) {
    num1[m + i] = num2[i];
  }
  return num1.sort();
}

// 方法二 双指针思想 o(m+n)
function combine(num1, num2, m, n) {
  let total = m + n;
  let tem = [];
  for (let index = 0, num1Index = 0, num2Index = 0; index < total; index++) {
    if (num1Index >= m) {
      // num1 先取完了
      tem[index] = num2[num2Index++];
    } else if (num2Index >= n) {
      // num2 先取完了
      tem[index] = num1[num1Index++];
    } else if (num1[num1Index] <= num2[num2Index]) {
      tem[index] = num1[num1Index++];
      // 把比较小的数先放到要输出的数组里，并把较小值的index++
    } else {
      tem[index] = num2[num2Index++];
    }
    num1 = tem;
  }
  return num1;
}
// 方法三 也是双指针思想，倒着计算,少一个tem变量 o(m+n)
// num1或者num2的长度，肯定都小于他们两的长度之和m+n。
// 把比较的结果放在>=他们最大index的地方，不影响各自原本的元素
function combine(num1, num2, m, n) {
  let total = m + n;
  for (
    let index = total - 1, num1Index = m - 1, num2Index = n - 1;
    index < 0;
    index--
  ) {
    if (num1Index < 0) {
      num1[index] = num2[num2Index--];
    } else if (num2Index < 0) {
      break;
    } else if (num1[num1Index] > num2[num2Index]) {
      num1[index] = num1[num1Index--];
    } else {
      num1[index] = num2[num2Index--];
    }
  }
  return num1;
}
```

## leecode 448

在 n 个整数数组 array 中，求不在区间[1,n]中的数值组成的数组

```js
// 方法一
function getNumberArray(array, n) {
  let result = [...Array(n + 1).keys()].shift();
  // 拿到[1,n]这个区间

  return result.filter(item => !array.includes(item));
  // 从区间里筛选中不在array数组里的元素
}
getNumberArray([1, 2, 3, 4, 7, 8, 3, 2]);

// 方法二 翻牌思想：把匹配的打个标记，后续用作区分
function getNumberArray(array, n) {
  for (let iterator of array) {
    if (iterator < 1 || iterator > n) array[index] += n;
    // 不在[1,n]之间的，都翻牌加n：最后在区间的元素都<=n
  }
  return array.filter(item => item <= n);
  // 筛选数组中所有<=n的元素
}
getNumberArray([1, 2, 3, 4, 7, 8, 3, 2]);
```

## leetcode 20

有效符号(){}[] 返回 true [(})] 返回 false

```js
function isValidChar(string) {
  let result = [];
  for (let char of string) {
    if (char === "(" || char === "[" || char === "{") {
      result.push(char); // 左括号入栈
    } else {
      let pre = result[result.length - 1];
      if (
        (pre === "(" && char === ")") ||
        (pre === "[" && char === "]") ||
        (pre === "{" && char === "}")
      ) {
        result.pop();
        // 否则，判断与栈顶元素能否匹配。匹配就把栈顶元素出栈
      } else {
        return false; // 不匹配，说明元字符传存在不对称，返回false
      }
    }
  }
  return result.length === 0;
  // 栈内不存在元素，说明全部都匹配到了
}
console.log(isValidChar("()[]{}"));
console.log(isValidChar("[(})]"));
```

## 相邻字符问题

```js
// leetcode 1047 去除字符串中相邻重复字符
// 方法一
function delRepeat(string) {
  for (let i = 0; i < string.length; ) {
    if (string[i] === string[i + 1]) {
      string = string.slice(0, i) + string.slice(i + 2);
      // 当前元素和下一个元素相等，就截掉这两个元素。继续从当前index判断
    } else {
      i++; //否则从下一个位置开始遍历
    }
  }
  return string;
}
// 方法二
function delRepeat(string) {
  let result = [];
  for (const iterator of string) {
    let pre = result.pop();
    if (iterator !== pre) {
      result.push(pre, iterator);
      // 栈顶元素和当前元素不同，把当前元素也入栈。否则去除栈顶元素
    }
  }
  return result.join("");
}
console.log(delRepeat("qqwerttr"));

// leetcode 3 找出字符中无重复的最长子串:滑动窗口思想
function maxLength(string) {
  let length = string.length;
  let leftIndex = 0; // 滑动窗口左指针
  let maxLength = 0; //最长长度
  let maxChar = ""; //最长的字符

  // 字符改变时更改滑动窗口，并计算最多字符和长度
  function getChar(index) {
    let preCharLength = index - leftIndex;
    // 获取当前滑动窗口长度
    if (preCharLength > maxLength) {
      maxLength = preCharLength;
      maxChar = string[leftIndex];
    }
    leftIndex = index;
    // 把滑动窗口重置为当前字符index
  }

  for (let index = 0; index < length; index++) {
    let char = string[index];
    if (index === length - 1) {
      getChar(char === string[leftIndex] ? index + 1 : index);
      // 最后一个元素，无论是否相等都需要计算。相同计算长度要包含自身
    } else {
      char !== string[leftIndex] && getChar(index);
      // 不是最后一个元素时，只有当前字符不属于滑动窗口字符时需要计算
    }
  }
  return [maxLength, maxChar];
}
```

## leetcode 71 简化路径

类似 node path 模块的 path.parse()，拼接路径字符串

```js
function getPath(path) {
  let result = [];
  path.split("/").forEach(item => {
    if (item === "..") {
      result.pop();
      // 存在‘往上一级’，则去掉栈顶元素
    } else if (item && item !== ".") {
      result.push(item);
      // 元素不等于‘.’，推送到栈顶
    }
  });
  return result.length ? "/" + result.join("/") : "/";
}
console.log(getPath("/home/../ab/cd/")); // /ab/cd
```

## 验证是否是回文字符串

回文字符串：去除空格和无效字符后左右对称

```js
// 双指针思想
function isPalindrome(s) {
  s = s.toLowerCase();
  function isValid(char) {
    return (char >= "a" && char <= "z") || (char >= "0" && char <= "9");
  }
  let leftIndex = 0;
  let rightIndex = s.length - 1;
  let leftChar = "";
  let rightChar = "";
  while (leftIndex <= rightIndex) {
    leftChar = s[leftIndex];
    rightChar = s[rightIndex];
    if (!isValid(leftChar)) {
      leftIndex++;
    } else if (!isValid(rightChar)) {
      rightIndex--; //  左/右指针无效时略过
    } else if (leftChar !== rightChar) {
      return false; // 最左字符!==最右字符，不是回文字符
    } else {
      leftIndex++; // 左右相等，同时往里移动指针
      rightIndex--;
    }
  }
  return true;
}
```

## 信号灯问题

```js
// 实现 红灯10s，黄灯3s，绿灯5s
let sig = new Signal({
  init: "red",
  colors: ["red", "yellow", "green"],
  times: [10, 3, 5],
});
console.log(sig);

class Signal {
  constructor(options) {
    this.signal = options.init; //当前信号灯
    this.colors = options.colors; //自定义颜色数组
    this.times = options.times; // 时间数组，和颜色一一对应
    this.eventMap = new Map();
    // 事件中心：对外提供事件，用于监听信号灯

    this.eventMap.set("change", new Set());
    // 监听红绿灯切换事件

    this.eventMap.set("tick", new Set());
    // 每1s时间 tick 通知外界

    this.setTime(); //初始化当前灯开始和结束时间
    this.exchange(); // 定时1s查询剩余时间
  }
  get next() {
    //获取下一个灯的颜色
    return this.colors[
      (this.colors.indexOf(this.signal) + 1) % this.colors.length
    ];
  }
  get remain() {
    //获取当前灯亮的剩余时间
    let diff = this.end - Date.now();
    if (diff < 0) {
      diff = 0;
    }
    return diff;
  }
  on(event, handler) {
    this.eventMap.get(event).add(handler);
  }
  off(event, handler) {
    this.eventMap.get(event).delete(handler);
  }
  emit(event) {
    this.eventMap.get(event).forEach(handler => {
      handler.call(this, this);
    });
  }
  async exchange() {
    await 1;
    if (this.remain > 0) {
      this.emit("tick");
      await sleep(1000); //沉睡1s
    } else {
      this.signal = this.next; //切换到下一个灯
      this.setTime(); //设置灯的开始和结束时间
      this.emit("change"); //通知灯的change事件
      console.log("切换了：", this.signal);
    }
    this.exchange();
  }
  setTime() {
    //灯亮时，设置当前灯的开始和结束时间
    this.start = Date.now();
    this.end = this.start + this.times[this.colors.indexOf(this.signal)] * 1000;
  }
}
```

## 根据数字按键得到所有字母组合

```js
// 根据数字按键得到所有字母组合
function getKeybordMap(digits) {
  let map = [, , "abc", "def", "ghi", "jkl", "mno", "pqps", "tuv", "wxyz"];
  // 获取每个数字键（即数组index），对应的字母
  let result = [];
  for (let digit of digits) {
    result = compose(result, map[digit].split(""));
    // 把当前按键对应的字母，分别和结果数组里的元素混合，混合结果组成新数组
  }
  function compose(arr1, charts) {
    if (arr1.length === 0) return charts;
    if (charts.length === 0) return arr1;
    const composeResult = [];
    for (let item of arr1) {
      for (let chart of charts) {
        composeResult.push(item + chart);
      }
    }
    return composeResult;
  }
  return result;
}
console.log(getKeybordMap("234"));
```

## 快速排序算法

快速排序算法：找出基准值，大于和小于基准值的数放入不同数组里，两个数组递归该操作

```js
function quickSort(array) {
  if (array.length <= 1) return array; // 终止条件
  let baseValue = array[Math.floor(array.length / 2)];
  //数组中间值作为基准值

  let left = [];
  let right = [];
  for (let element of array) {
    if (element < baseValue) {
      left.push(element);
    } else {
      right.push(element);
    }
  }
  return quickSort(left).concat(quickSort(right));
}
```

## 小孩报数去除报 3 问题

小孩子围成一个圈，从 1 开始报数，报数为 3 的小孩子不在计数，然后又从 1 开始报数。找出剩下的最后一个孩子的索引 index

```js
/** 翻牌思想，报3的孩子索引设为-1，不在参数计数
 * @param {Number} num 孩子总数
 * @param {Number} count 要去除的报数
 */
function destroyThree(num, count) {
  let pool = [...Array(num).keys()];
  // 创建[0,num-1]的池子
  let index = 0; //报数孩子的index
  let counter = 0; //要报的数字
  let exitCount = 0; //出局孩子的个数
  while (num - exitCount > 1) {
    // 剩余孩子个数超过1，需要继续报数

    if (pool[index] !== -1) {
      //当前孩子没有出局时，报数比上个孩子报数+1，
      if (counter++ === count) {
        pool[index] = -1;
        exitCount++;
        counter = 0;
        // 如果正好=3，翻牌，另出局数+1，计数重置为0
      }
    }
    index++ === num && (index = 0);
    // 指针移到下一个孩子。如果超过最大索引，重置为0
  }
  return pool.findIndex(item => item !== -1);
  // 返回最后一个没有被翻牌的孩子的index
}
```

## 最多的元素和次数

```js
//查找文章中出现次数最多的单词和次数
function mostWord(article) {
  if (!article) return;
  article = article.trim().toLowerCase();
  // 大小写都按同一个单词处理，并去除首尾空格

  let wordList = [...new Set(article.match(/[a-z]+/g))];
  // 文章以空格分隔成单词数组后，去重减少遍历次数

  let maxWord = ""; // 最多次的单词
  let maxNum = 0; // 单词出现最多次数
  wordList.forEach(word => {
    let reg = new RegExp(" " + word + " ", "g");
    let wordnum = article.match(reg).length;
    // 拿到匹配到的每个单词，组成的数组的长度（即出现次数）

    if (wordnum > maxNum) {
      maxNum = wordnum;
      maxWord = word;
    }
  });
  return `次数最多的单词是：${maxWord},次数是：${maxNum}`;
}

// leetcode 1207 求字符串中出现次数最多的字符和次数
function getTimes(string) {
  let maxNum = 0;
  let maxChar = "";
  let map = new Map();
  for (const iterator of string) {
    map.set(iterator, (map.get(iterator) || 0) + 1);
  }
  for (const [key, value] of map) {
    if (value > maxNum) {
      maxNum = value;
      maxChar = key;
    }
  }
  return [maxChar, maxNum];
}
```

## 求数组全排列

```js
//释放注释为求字符全排列
function getArray(params) {
  const res = []; // 结果集数组
  let path = []; // 字符组合数组
  function backTracking(array, used) {
    // 参数1：需要全排的数组 参数2：used数组记录当前元素是否已被使用
    let arrayLength = array.length;
    if (path.length === arrayLength) return res.push(path); // 当获取的元素个数等于传入数组长度时（此时说明找到了一组结果）
    for (let i = 0; i < arrayLength; i++) {
      if (used[i]) continue; // 当前元素已被使用，结束此次循环
      path.push(array[i]); // 将符合条件的元素存进path数组
      // path = path + array[i]; // 将符合条件的元素存进path字符串
      used[i] = true; // 并将该元素标为true，表示已使用同支
      backTracking(array, used);
      path = path.slice(0, path.length - 1);
      used[i] = false;
    }
  }
  // backTracking(Array.from(params), []); // 当为
  backTracking(params, []);
  return res;
}
console.log(getArray([1, 2, 3, 4]));
```

## 找出最少硬币组合

```js
const rninCoinChange = new MinCoinChange([1, 5, 10, 25]);
console.log(rninCoinChange.makeChange(36)); // [1, 10, 25]

function MinCoinChange(coins) {
  var cache = {};
  this.makeChange = function (amount) {
    if (!amount) return [];
    const _this = this;
    if (cache[amount]) return cache[amount];
    let min = [];
    let newMin;
    let newAmount;
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i];
      newAmount = amount - coin;
      if (newAmount >= 0) {
        newMin = _this.makeChange(newAmount);
      }
      if (
        newAmount >= 0 &&
        (newMin.length < min.length - 1 || !min.length) &&
        (newMin.length || !newAmount)
      ) {
        // 这里设定了边界条件，当传给递归函数的 newAmount 为 coin 时开始回溯
        min = [coin].concat(newMin);
        console.log("new min " + min + " for " + amount);
      }
    }
    return (cache[amount] = min);
  };
}
```

## 实现两个大整数相加

实现超出整数存储范围的两个大整数相加 function add(a,b)。注意 a 和 b 以及函数的返回值都是字符串。

```js
function add(a, b) {
  let maxLength = Math.max(a.length, b.length);
  let padA = a.padStart(maxLength, "0");
  let padB = b.padStart(maxLength, "0");
  // 为了计算时个位数对齐，填充长度至两者长度的最大值

  let carryNum = 0; // 是否进1
  let result = [];
  for (let index = maxLength - 1; index >= 0; index--) {
    // 从个数开始计算，也就是倒着算。

    let tem = Number(padA[index]) + Number(padB[index]) + carryNum;
    if (tem >= 10) {
      carryNum = 1; // 超10进1
      result.unshift(tem % 10);
      index === 0 && result.unshift(carryNum);
      // 遍历到最后一位时，如果超10，往最前位进1
    } else {
      carryNum = 0; // 不超10，进0，
      result.unshift(tem);
    }
  }
  return result.join("");
}
console.log(add("333333333333333333333333333333", "33333333333333333333333"));
```

## 求数组交集

```js
function getjiaoji(arr1, arr2) {
  return arr1.filter(item => {
    let index = arr2.findIndex(v => v == item);
    if (index !== -1) {
      arr2.splice(index, 1);
      // 把当前元素删除，防止重复使用
      return true;
    }
  });
}
```

## 数组指定值

```js
// 整数数组中某两个数等于某个值的所有可能性，用过的元素不在使用
//二分法+双指针思想实现
const arr = [13, 2, 534, 2, 12, 232, 23, 12, 12, 2, 131, 1, 31, 21];
function getSum(arr, num) {
  arr.sort((a, b) => a - b);
  const result = [];
  let left = 0,
   let right = arr.length - 1;
  while (left < right) {
    if (arr[left] + arr[right] < num) {
      left++;
    } else if (arr[left] + arr[right] > num) {
      right--;
    } else {
      result.push([arr[left], arr[right]]);
      left++;
      right--;
    }
  }
  return result;
}

// 双循环+双指针思想
function getSum(array, num) {
  const length = array.length;
  const result = [];
  for (let index = 0; index < length - 1; index++) {
    for (let innerIndex = index + 1; innerIndex < length; innerIndex++) {
      // 遍历外层循环指针后面的元素
      if (array[index] + array[innerIndex] === num) {
        result.push([array[index], array.splice(innerIndex, 1)[0]]);
         //后面用过的元素删掉，并保存结果
      }
    }
  }
  return result;
}
console.log(getSum(arr, 14));

// 二分法查找指定值在整数有序数组中的位置
function binarySearch(arr, target) {
  let low = 0; // 范围的最小值索引
  let high = arr.length - 1; // 范围的最大值索引
  let midIndex = 0; // 范围中间值索引
  let midElement = 0; // 范围中间值索引对应的中间值
  while (low <= high) {
    midIndex = Math.floor((low + high) / 2);
    midElement = arr[midIndex];
    if (target > midElement) {
      low = midIndex + 1;
    } else if (target < midElement) {
      high = midIndex - 1;
    } else {
      return midIndex;
    }
  }
  return -1; // 最终找不到等于target的值，则返回-1
}
console.log(binarySearch([3, 4, 7, 10, 34], 7));

// leetcode 1207 数组元素是否都独一无二出现
function isNoRepeat(array) {
  let map = new Map();
  for (const iterator of array) {
    map.set(iterator, (map.get(iterator) || 0) + 1);
  }
  let set = new Set();
  for (const [key, value] of map) {
    set.add(key); // 利用了Set自动去重的特性
  }
  return set.size === map.size;
  // return array.length === [...new Set(array)].size;
}
```

## leetcode 933

统计最近 3000 毫秒内的请求次数,很少遇到

```js
class RecentCounter {
  result = [];
  ping(t) {
    this.result.push(t);
    while (t - this.result[0] >= 3000) {
      this.result.shift();
    }
    return this.result.length;
  }
}
let obj = new RecentCounter();
console.log(obj.ping(3000));
console.log(obj.ping(4000));
console.log(obj.ping(5000));
```

## 数组中是否有重复元素

```js
function hasRepeat(array) {
  let set = new Set();
  for (const iterator of array) {
    if (set.has(iterator)) return true;
    // 后面的元素存在缓存过的，就有重复
    set.add(iterator);
    //元素没有缓存就加入Set缓存
  }
  return false;
}
```

## 寻找质数

找出某范围内的所有质数

```js
function getPrime(params) {
  if (params <= 1)
    throw "注意 1 不是质数，质数是大于 1 的且只能被 1 和自身整除的自然数";
  let result = []; // 质数结果集合
  let innerIndex = 0;
  // 内循环索引，定义在外层方便外层循环可以拿到内循环的index

  for (let index = 2; index < params; index++) {
    for (innerIndex = 2; innerIndex < index; innerIndex++) {
      if (index % innerIndex === 0) break;
      // 2 <= innerIndex < index范围内存在被整除的数，是非质数
    }
    innerIndex === index && result.push(index);
    // 内层循环走到了最后都没找到被整除的数，是质数
  }
  return result;
}
console.log(getPrime(10)); // [ 2, 3, 5, 7 ]
```
