
## Error 错误基类

当运行时错误产生时，Error 对象会被抛出。Error 对象也可用于用户自定义的异常的基础对象。

Error() 构造函数能够创建一个包含错误信息的对象。

```js
/**
 * @message 人类可读的错误信息。
 * @fileName 引发此错误的文件路径。默认为调用 Error() 构造函数的代码所在文件的名称。
 * @lineNumber 引发错误的文件中的行号，默认为包含 Error() 构造函数调用的行号。
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */
new Error()
new Error(message)
new Error(message, options)
new Error(message, fileName)
new Error(message, fileName, lineNumber)
Error()
Error(message)
Error(message, options)
Error(message, fileName)
Error(message, fileName, lineNumber)

const error = new Error(message?, fileName?, lineNumber?,optoins?)
/**也可以不适用new，直接调用， */
Error(message, fileName, lineNumber,options)

const y = new Error('I was constructed via the "new" keyword!'，{cause: '错误的具体原因！'});
```

Error实例属性和方法

- name 错误名称：Error
- message 错误 message ：I was constructed via the "new" keyword!
- cause 具体原因
- fileName 发生错误的文件名
- lineNumber 发生错误的行号
- columnNumber 发生错误的列号
- stack 错误堆栈信息

## AggregateError

包装了多个错误对象的单个错误对象。当一个操作需要报告多个错误时，例如 Promise.any()，当传递给它的所有承诺都被拒绝时，就会抛出该错误。

AggregateError() 构造函数能够创建了一个包装了多个错误对象的单个错误对象。

```js
/**
 * @errors 一系列错误对象，实际上可能不是 Error 的实例。的名称。
 * @message 一个可选的对错误集合的可读描述。
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */
const error = new AggregateError( errors,message?, optoins?)
/**也可以不适用new，直接调用， */
AggregateError( errors,message?, optoins?)

try {
  throw new AggregateError([new Error("some error")], "Hello");
} catch (e) {
  console.log(e instanceof AggregateError); // true
  console.log(e.message); // "Hello"
  console.log(e.name); // "AggregateError"
  console.log(e.errors); // [ Error: "some error" ]
}
```

AggregateError实例属性和方法

- name 错误名称：AggregateError
- message 错误 message
- cause 具体原因
- errors 一个数组，基本上反映了 AggregateError 实例化时使用的迭代器
- stack 错误堆栈信息

## EvalError

eval() 全局函数的错误

EvalError() 构造函数能够创建一个包含错误信息的对象。此异常不再会被 JavaScript 抛出，但是 EvalError 对象仍然存在，以保持兼容性。

EvalError 是一个可序列化对象，所以可以使用 structuredClone() 对它进行克隆，也可以使用 postMessage() 在 Worker 之间拷贝它。


```js
/**
 * @message 人类可读的错误信息。
 * @fileName 引发此错误的文件路径
 * @lineNumber 引发错误的文件中的行号
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */

try {
  throw new EvalError("Hello", "someFile.js", 10);
} catch (e) {
  console.log(e instanceof EvalError); // true
  console.log(e.message); // "Hello"
  console.log(e.name); // "EvalError"
  console.log(e.fileName); // "someFile.js"
  console.log(e.lineNumber); // 10
  console.log(e.columnNumber); // 0
  console.log(e.stack); // "@Scratchpad/2:2:9\n"
}
```

实例属性和方法

- name 错误名称：EvalError
- message 错误 message
- cause 具体原因
- fileName 发生错误的文件名
- lineNumber 发生错误的行号
- columnNumber 发生错误的列号
- stack 错误堆栈信息

## InternalError

出现在 JavaScript 引擎内部的错误。通常描述某种数量过多的情况，例如："too many switch cases"（过多 case 子句）

```js
/**
 * @message 人类可读的错误信息。
 * @fileName 引发此错误的文件路径
 * @lineNumber 引发错误的文件中的行号
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */
new InternalError();
new InternalError(message);
new InternalError(message, options);
new InternalError(message, fileName);
new InternalError(message, fileName, lineNumber);

InternalError();
InternalError(message);
InternalError(message, options);
InternalError(message, fileName);
InternalError(message, fileName, lineNumber);

new InternalError("Engine failure");
```
实例属性和方法

- name 错误名称：InternalError
- message 错误 message
- cause 具体原因
- fileName 发生错误的文件名
- lineNumber 发生错误的行号
- columnNumber 发生错误的列号
- stack 错误堆栈信息

## RangeError

表示一个特定值不在所允许的范围或者集合中的错误，RangeError 是一个可序列化对象，所以可以使用 structuredClone() 对它进行克隆，也可以使用 postMessage() 在 Worker 之间拷贝它。

```js
/**
 * @message 人类可读的错误信息。
 * @fileName 引发此错误的文件路径
 * @lineNumber 引发错误的文件中的行号
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */
new RangeError();
new RangeError(message);
new RangeError(message, options);
new RangeError(message, fileName);
new RangeError(message, fileName, lineNumber);

RangeError();
RangeError(message);
RangeError(message, options);
RangeError(message, fileName);
RangeError(message, fileName, lineNumber);
new RangeError("The argument must be between -500 and 500.");
```
实例属性和方法:

- name 错误名称：RangeError
- message 错误 message
- cause 具体原因
- fileName 发生错误的文件名
- lineNumber 发生错误的行号
- columnNumber 发生错误的列号
- stack 错误堆栈信息

## ReferenceError

代表当一个不存在（或尚未初始化）的变量被引用时发生的错误。

ReferenceError 是一个可序列化对象，所以可以使用 structuredClone() 对它进行克隆，也可以使用 postMessage() 在 Worker 之间拷贝它。

```js
/**
 * @message 人类可读的错误信息。
 * @fileName 引发此错误的文件路径
 * @lineNumber 引发错误的文件中的行号
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */
new ReferenceError(message, fileName, lineNumber);

ReferenceError();
ReferenceError(message);
ReferenceError(message, options);
ReferenceError(message, fileName);
ReferenceError(message, fileName, lineNumber);

try {
  let a = undefinedVariable;
} catch (e) {
  console.log(e instanceof ReferenceError); // true
  console.log(e.message); // "undefinedVariable is not defined"
  console.log(e.name); // "ReferenceError"
  console.log(e.fileName); // "Scratchpad/1"
  console.log(e.lineNumber); // 2
  console.log(e.columnNumber); // 6
  console.log(e.stack); // "@Scratchpad/2:2:7\n"
}
```

实例属性和方法

- name 错误名称：ReferenceError
- message 错误 message
- cause 具体原因
- fileName 发生错误的文件名
- lineNumber 发生错误的行号
- columnNumber 发生错误的列号
- stack 错误堆栈信息

## SyntaxError

尝试解析不符合语法的代码的错误。当 Javascript 引擎解析代码时，遇到了不符合语法规范的标记（token）或标记顺序，则会抛出 SyntaxError。

```js
/**
 * @message 人类可读的错误信息。
 * @fileName 引发此错误的文件路径
 * @lineNumber 引发错误的文件中的行号
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */

try {
  throw new SyntaxError("Hello", "someFile.js", 10);
} catch (e) {
  console.error(e instanceof SyntaxError); // true
  console.error(e.message); // Hello
  console.error(e.name); // SyntaxError
  console.error(e.fileName); // someFile.js
  console.error(e.lineNumber); // 10
  console.error(e.columnNumber); // 0
  console.error(e.stack); // @debugger eval code:3:9
}
```
实例属性和方法

- name 错误名称：SyntaxError
- message 错误 message
- cause 具体原因
- fileName 发生错误的文件名
- lineNumber 发生错误的行号
- columnNumber 发生错误的列号
- stack 错误堆栈信息

## TypeError

通常（但并不只是）用来表示值的类型非预期类型时发生的错误。

```js
/**
 * @message 人类可读的错误信息。
 * @fileName 引发此错误的文件路径
 * @lineNumber 引发错误的文件中的行号
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */
try {
  null.f();
} catch (e) {
  console.log(e instanceof TypeError); // true
  console.log(e.message); // "null has no properties"
  console.log(e.name); // "TypeError"
  console.log(e.fileName); // "Scratchpad/1"
  console.log(e.lineNumber); // 2
  console.log(e.columnNumber); // 2
  console.log(e.stack); // "@Scratchpad/2:2:3\n"
}
```
实例属性和方法

- name 错误名称：TypeError
- message 错误 message
- cause 具体原因
- fileName 发生错误的文件名
- lineNumber 发生错误的行号
- columnNumber 发生错误的列号
- stack 错误堆栈信息

## URIError

表示以一种错误的方式使用全局 URI 处理函数而产生的错误。

```js
/**
 * @message 人类可读的错误信息。
 * @fileName 引发此错误的文件路径
 * @lineNumber 引发错误的文件中的行号
 * @options 包含cause属性的对象，cause指示错误的具体原因
 */
try {
  decodeURIComponent("%");
  //等于 throw new URIError("Hello", "someFile.js", 10);
} catch (e) {
  console.log(e instanceof URIError); // true
  console.log(e.message); // "malformed URI sequence"
  console.log(e.name); // "URIError"
  console.log(e.fileName); // "Scratchpad/1"
  console.log(e.lineNumber); // 2
  console.log(e.columnNumber); // 2
  console.log(e.stack); // "@Scratchpad/2:2:3\n"
}
```
实例属性和方法

- name 错误名称：URIError
- message 错误 message
- cause 具体原因
- fileName 发生错误的文件名
- lineNumber 发生错误的行号
- columnNumber 发生错误的列号
- stack 错误堆栈信息
