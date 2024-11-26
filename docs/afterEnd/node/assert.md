## assert 断言模块

提供了一组用于验证不变量的断言函数。

```js
const assert = require('node:assert');

/**
 * assert.ok() 的别名。
 * 检查value是否为真
 */
assert(value[, message])

/**
 * assert.deepStrictEqual() 的别名。严格断言模式
 */
assert.deepEqual(actual, expected[, message])

assert.deepEqual('+00000000', false);

/**
 * 期望 string 输入与正则表达式不匹配。
 */
assert.doesNotMatch(string, regexp[, message])

/**
 * 等待 asyncFn promise，或者，如果 asyncFn 是函数，则立即调用该函数
 * 并等待返回的 promise 完成。然后会检查 promise 是否没有被拒绝。
 */
assert.doesNotReject(asyncFn[, error][, message])

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();

/**
 * 断言函数 fn 不会抛出错误。
 */
assert.doesNotThrow(fn[, error][, message])

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);

/**
 * 使用 == 操作符 测试 actual 和 expected 参数之间的浅层强制相等性。
 * NaN 是特殊处理的，如果双方都是 NaN，则视为相同。
 */
assert.equal(actual, expected[, message])

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2

/**
 * 抛出带有提供的错误消息或默认错误消息的 AssertionError。
 * 如果 message 参数是 Error 的实例，则将抛出错误而不是 AssertionError。
 */
assert.fail([message])

/**
 * 如果 value 不是 undefined 或 null，则抛出错误
 */
assert.ifError(value)

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

/**
 * 期望 string 输入与正则表达式匹配。
 */
assert.match(string, regexp[, message])

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK

/**
 * 检验深度严格不相等。assert.deepStrictEqual() 的相反。
 */
assert.notDeepStrictEqual(actual, expected[, message])

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK

/**
 * 测试由 Object.is() 确定的 actual 和 expected 参数之间的严格不相等。
 */
assert.notStrictEqual(actual, expected[, message])

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:1

/**
 * 等待 asyncFn promise，或者，如果 asyncFn 是函数，则立即调用该函数
 * 并等待返回的 promise 完成。然后将检查 promise 是否被拒绝。
 */
assert.rejects(asyncFn[, error][, message])

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();

/**
 * 测试由 Object.is() 确定的 actual 和 expected 参数之间的严格相等
 */
assert.strictEqual(actual, expected[, message])

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:1 !== 2

assert.strictEqual(1, 1);
// OK

/**
 * 期望函数 fn 抛出错误。
 */
assert.throws(fn[, error][, message])

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
```