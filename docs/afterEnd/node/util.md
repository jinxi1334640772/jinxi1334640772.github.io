## util 模块

模块支持 Node.js 内部 API 的需求。许多实用工具对应用和模块开发者也很有用

```js
let util = require('util')

/** 对象继承函数，类似Object.create()函数，但没有创建新对象
 * @target 目标对象
 * @base 基础对象
 * @return
 */
util.inherits(target,base)

/** 将任意对象转换为字符串,通常用于调试和错误输出
 * @object 要转换的对象
 * @showHidden 是一个可选参数，如果值为 true，将会输出更多隐藏信息
 * @depth 表示最大递归的层数，如果对象很复杂，你可以指定层数以控制输出信息的多 少。如果不指定depth，默认会递归2层，指定为 null 表示将不限递归层数完整遍历对象
 * @color 如果color 值为 true，输出格式将会以ANSI 颜色编码，通常用于在终端显示更漂亮 的效果。
 */
util.inspect(object,[showHidden],[depth],[colors])

/** 格式化字符串
 * @format <string> 类似 printf 的格式字符串。
 *
 */
util.format(format[, ...args])

util.format('%s:%s', 'foo', 'bar', 'baz');
// Returns: 'foo:bar baz'

//val1 和 val2 之间存在深度严格相等
util.isDeepStrictEqual(val1, val2)

// MIMEType 对象的所有属性都被实现为类原型上的获取器和设置器，
// 而不是对象本身的数据属性。
util.MIMEType
//提供对 MIMEType 参数的读写访问。
util.MIMEParams
const { MIMEType } = require('node:util');
const myMIME = new MIMEType('text/plain');
const myParamsMap = new MIMEParams();

/** 为命令行参数解析提供比直接与 process.argv 交互更高级别的 API。
 * 采用预期参数的规范并返回带有解析选项和位置的结构化对象。
 * @config
 *    args
 *    strict
 *    tokens
 */
util.parseArgs([config])

const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {type: 'boolean',short: 'f',},
  bar: {type: 'string',},
};
const {values,positionals} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []

util.parseEnv(content)
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Returns: { HELLO: 'oh my' }

//采用遵循常见的错误优先的回调风格的函数
util.promisify(original)

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});

//考虑到在终端中打印所传递的 format 的格式化文本
util.styleText(format, text[, options])
util.styleText(['underline', 'italic'], 'My italic underlined message')
const successMessage = styleText('green', 'Success!');
const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validate if process.stderr has TTY
  { stream: stderr },
);

//不同种类的内置对象提供类型检查
util.types
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Returns true
util.types.isArgumentsObject(arguments);  // Returns true
util.types.isAsyncFunction(function foo() {});  // Returns false
util.types.isAsyncFunction(async function foo() {});  // Returns true
util.types.isBooleanObject(true);   // Returns false
util.types.isBooleanObject(new Boolean(false)); // Returns true
util.types.isDataView(new DataView(ab));  // Returns true
util.types.isDate(new Date());  // Returns true util.types.isMap(value)
util.types.isNumberObject(0);  // Returns false
util.types.isNumberObject(new Number(0));   // Returns true
util.types.isPromise(Promise.resolve(42));  // Returns true
util.types.isProxy(proxy);  // Returns true
util.types.isRegExp(/abc/);  // Returns true
util.types.isRegExp(new RegExp('abc'));  // Returns true

```
