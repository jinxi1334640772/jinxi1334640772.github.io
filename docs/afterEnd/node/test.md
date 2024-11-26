## test 模块

模块有助于创建 JavaScript 测试。通过 test 模块创建的测试由单个函数组成，该函数以三种方式之一进行处理：

- 同步的函数，如果抛出异常则认为失败，否则认为通过。

- 返回 Promise 的函数，如果 Promise 拒绝，则视为失败；如果 Promise 满足，则视为通过。

- 接收回调函数的函数。如果回调接收到任何真值作为其第一个参数，则认为测试失败。如果非真值作为第一个参数传给回调，则认为测试通过。如果测试函数接收到回调函数并且还返回 Promise，则测试将失败。

```js
const test ,{ describe, it } = require('node:test');

test('synchronous passing test', (t) => {
  // 严格相等，测试通过
  assert.strictEqual(1, 1);
});

test('synchronous failing test', (t) => {
  // 不相等，测试失败，抛出错误
  assert.strictEqual(1, 2);
});

/** 第二个参数：配置选项
 * @skip 或通过调用测试上下文的 skip() 方法跳过测试，也可以是message
 * @todo 将单个测试标记为不稳定或不完整，需要修复。不会被视为测试失败
 * @only 以 --test-only 命令行选项启动，或者禁用测试隔离，可使用only跳过除选定子集之外的所有测试，需要子项配合。等于测试上下文的 runOnly() 方法
 */
test('asynchronous passing test',{ skip: true,todo: true }, async (t) => {
  //测试通过，async函数没有拒绝
  assert.strictEqual(1, 1);
  t.beforeEach((t) => t.diagnostic(`about to run ${t.name}`));
  t.afterEach((t) => t.diagnostic(`finished running ${t.name}`));
  t.assert.snapshot({ value1: 1, value2: 2 });
  t.diagnostic('A diagnostic message');
  t.assert.strictEqual(true, true);
  t.runOnly(true);
  await t.test('this subtest is now skipped');
  await t.test('this subtest is run', { only: true });

  // Switch the context back to execute all tests.
  t.runOnly(false);
  await t.test('this subtest is now run');
  await t.test('skipped subtest', { only: false });

  // 也通过上下文跳过测试
   t.skip();
   t.skip('提示信息');

  /** 是test()的别名
   *
   */
 it('should be ok', () => {
    assert.strictEqual(2, 2);
  });
})
/** 
 *describe() 是suite() 的别名
 */
describe('a nested thing', async() => {
    it('should work', () => {
      assert.strictEqual(3, 3);
    });
  // 子测试：await 用于确保两个子测试均已完成。这是必要的，因为测试不会等待其子测试完成
   await t.test('subtest 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subtest 2', (t) => {
    assert.strictEqual(2, 2);
  });
});

test('asynchronous failing test', async (t) => {
  assert.strictEqual(1, 2);
});

test('failing test using Promises', (t) => {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('this will cause the test to fail'));
    });
  });
});

test('callback passing test', (t, done) => {
  // done() 是没有参数的回调函数
  setImmediate(done);
});

test('callback failing test', (t, done) => {
  // done()抛出错误，测试失败
  setImmediate(() => {
    done(new Error('callback failure'));
  });
});
```

## 生命周期函数

```js

/** 在执行套件之前运行的钩子。
 * @options
 *  signal <AbortSignal> 允许中止正在进行的钩子。
 *  timeout 钩子会在几毫秒后失败
 */
before([fn][, options])

/** 在执行套件后运行的钩子
 * @options
 *  signal <AbortSignal> 允许中止正在进行的钩子。
 *  timeout 钩子会在几毫秒后失败
 */
after([fn][, options])

/** 在当前套件中的每个测试之前运行的钩子
 * @options
 *  signal <AbortSignal> 允许中止正在进行的钩子。
 *  timeout 钩子会在几毫秒后失败
 */
beforeEach([fn][, options])

/** 在当前套件中的每个测试之后运行
 * @options
 *  signal <AbortSignal> 允许中止正在进行的钩子。
 *  timeout 钩子会在几毫秒后失败
 */
afterEach([fn][, options])


describe('tests', async () => {
  before(() => console.log('about to run some test'));
  after(() => console.log('finished running tests'));
  beforeEach(() => console.log('about to run a test'));
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## 按名称过滤测试

测试名称模式被解释为 JavaScript 正则表达式，可以多次指定。对于执行的每个测试，也会运行任何相应的测试钩子，例如 beforeEach()。未执行的测试将从测试运行器输出中省略。

- `--test-name-pattern` 命令行选项可用于仅运行名称与提供的模式匹配的测试
- `--test-skip-pattern` 选项可用于跳过名称与提供的模式匹配的测试。

```js
// 使用 --test-name-pattern="test [1-3]" 执行以下匹配选项
test("test 1", async t => {
  await t.test("test 2");
  await t.test("test 3");
});

// --test-skip-pattern="/test [4-5]/i 跳过执行匹配项
test("Test 4", async t => {
  await t.test("Test 5");
  await t.test("test 6");
});
```

## 监视模式

Node.js 测试运行器支持通过传递 --watch 标志以监视模式运行：`node --test --watch`

在监视模式下，测试运行器将监视测试文件及其依赖的更改。当检测到变化时，测试运行器将重新运行受变化影响的测试。测试运行器将继续运行直到进程终止。

## 从命令行运行测试

可以通过传入 --test 标志从命令行调用 Node.js 测试运行程序：`node --test`

默认情况下，Node.js 将运行与这些模式匹配的所有文件：

- `**/*.test.{cjs,mjs,js}`

- `**/*-test.{cjs,mjs,js}`

- `**/*_test.{cjs,mjs,js}`

- `**/test-*.{cjs,mjs,js}`

- `**/test.{cjs,mjs,js}`

- `**/test/**/*.{cjs,mjs,js}`

指定需要测试的文件：`node --test "**/*.test.js" "**/*.spec.js"`

## 收集代码覆盖率

当 Node.js 以 --experimental-test-coverage 命令行标志启动时，代码覆盖率将被收集并在所有测试完成后报告统计信息。如果使用 NODE_V8_COVERAGE 环境变量指定代码覆盖目录，则生成的 V8 覆盖文件写入该目录。默认情况下，node_modules/ 目录中的 Node.js 核心模块和文件不包含在覆盖率报告中。但是，它们可以通过 --test-coverage-include 标志明确包含。如果启用覆盖，覆盖报告将通过 'test:coverage' 事件发送到任何 测试报告器。

```js
// 使用以下注释语法在一系列行上禁用覆盖：

/* node:coverage disable */
if (anAlwaysFalseCondition) {
  console.log("this is never executed");
}
/* node:coverage enable */

// 也可以针对指定行数禁用覆盖

/* node:coverage ignore next */
if (anAlwaysFalseCondition) {
  console.log("this is never executed");
}

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log("this is never executed");
}
```

Tap 和 Spec 报告器将打印覆盖统计数据的摘要。还有一个 lcov 报告器，它将生成 lcov 文件，可用作深度覆盖报告

```hash
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```

## mock 测试模拟

支持通过顶层 mock 对象在测试期间进行模拟

```js
"use strict";
const assert = require("node:assert");
const { mock, test } = require("node:test");

test("spies on a function", () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```

相同的模拟功能也暴露在每个测试的 TestContext 对象上。以下示例使用 TestContext 上公开的 API 创建对象方法的监听器。通过测试上下文进行模拟的好处是，测试运行器将在测试完成后自动恢复所有模拟功能。

```js
test("spies on an object method", t => {
  const number = {
    value: 5,
    add(a) {
      return this.value + a;
    },
  };

  t.mock.method(number, "add");
  assert.strictEqual(number.add.mock.callCount(), 0);
  assert.strictEqual(number.add(3), 8);
  assert.strictEqual(number.add.mock.callCount(), 1);

  const call = number.add.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 8);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});

/**
 * 通过测试上下文进行模拟定时器的好处是，一旦测试完成，
 * 测试运行器将自动恢复所有模拟的定时器功能。
 */
test("mocks setTimeout to be executed synchronously without having to actually wait for it", context => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ["setTimeout"] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});

/**模拟定时器 API 还允许模拟 Date 对象。
 * 可以通过将 now 属性传递给 .enable() 方法来设置初始日期。该值将用作
 * 模拟 Date 对象的初始日期。它可以是正整数，也可以是另一个 Date 对象。
 */
test("mocks the Date object with initial time", context => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ["Date"], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

## 快照测试

快照测试允许将任意值序列化为字符串值并与一组已知的良好值进行比较。已知的良好值称为快照，并存储在快照文件中。快照文件由测试运行器管理，但设计为人类可读的，以帮助调试。最佳做法是将快照文件与测试文件一起签入源代码控制。为了启用快照测试，必须使用 --experimental-test-snapshots 命令行标志启动 Node.js。

快照文件是通过使用 --test-update-snapshots 命令行标志启动 Node.js 生成的。为每个测试文件生成一个单独的快照文件。默认情况下，快照文件的名称与测试文件相同，但文件扩展名为 .snapshot。可以使用 snapshot.setResolveSnapshotPath() 函数配置此行为。每个快照断言对应快照文件中的导出。

```js
// 第一次执行此测试时，它将失败，因为相应的快照文件不存在。
suite("suite of snapshot tests", () => {
  test("snapshot test", t => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```

## 测试报告器

支持传递 --test-reporter 标志，以便测试运行器使用特定的报告程序。

支持以下内置报告器：

- tap 报告器以 TAP 格式输出测试结果。

- spec 报告器以人类可读的格式输出测试结果。

- dot 报告器以紧凑格式输出测试结果，其中每个通过的测试用 . 表示，每个失败的测试用 X 表示。

- junit 报告器以 jUnit XML 格式输出测试结果

- lcov 与 --experimental-test-coverage 标志一起使用时，lcov 报告器会输出测试覆盖率。

当 stdout 为 TTY 时，默认使用 spec 报告器。否则，默认使用 tap 报告器。报告器可通过 node:test/reporters 模块获得：

```js
const { tap, spec, dot, junit, lcov } = require("node:test/reporters");
```

## 自定义报告器

--test-reporter 可用于指定自定义报告程序的路径。自定义报告器是一个导出 stream.compose 接受的值的模块。报告者应该转换 `<TestsStream>` 触发的事件

```js
// 使用 `<stream.Transform>` 的自定义报告器示例：
const { Transform } = require("node:stream");

module.exports = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case "test:dequeue":
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case "test:enqueue":
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case "test:watch:drained":
        callback(null, "test watch queue drained");
        break;
      case "test:start":
        callback(null, `test ${event.data.name} started`);
        break;
      case "test:pass":
        callback(null, `test ${event.data.name} passed`);
        break;
      case "test:fail":
        callback(null, `test ${event.data.name} failed`);
        break;
      case "test:plan":
        callback(null, "test plan");
        break;
      case "test:diagnostic":
      case "test:stderr":
      case "test:stdout":
        callback(null, event.data.message);
        break;
      case "test:coverage": {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

// 使用生成器函数的自定义报告器示例：
module.exports = async function* customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case "test:dequeue":
        yield `test ${event.data.name} dequeued\n`;
        break;
      case "test:enqueue":
        yield `test ${event.data.name} enqueued\n`;
        break;
      case "test:watch:drained":
        yield "test watch queue drained\n";
        break;
      case "test:start":
        yield `test ${event.data.name} started\n`;
        break;
      case "test:pass":
        yield `test ${event.data.name} passed\n`;
        break;
      case "test:fail":
        yield `test ${event.data.name} failed\n`;
        break;
      case "test:plan":
        yield "test plan\n";
        break;
      case "test:diagnostic":
      case "test:stderr":
      case "test:stdout":
        yield `${event.data.message}\n`;
        break;
      case "test:coverage": {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```

## 运行测试的配置

```js
const { tap } = require("node:test/reporters");
const { run } = require("node:test");
const path = require("node:path");

/** run([options])
 * @concurrency <number> | <boolean> 测试进程将并行运行数
 * @files 包含要运行的文件列表的数组。默认值：来自 测试运行器执行模型 的匹配文件
 * @forceExit 在所有已知测试完成执行后退出进程
 * @globPatterns 包含用于匹配测试文件的 glob 模式列表的数组
 * @inspectPort <number> | <Function> 设置测试子进程的检查器端口
 * @isolations <string> 配置测试隔离的类型。
 *   process 每个测试文件都在单独的子进程中运行 默认值
 *   none 所有测试文件都在当前进程中运行
 * @only 测试上下文是否仅运行设置了 only 选项的测试
 * @setup 接受 TestsStream 实例并可用于在运行任何测试之前设置监听器的函数。默认值：undefined。
 * @exexArgv  生成子进程时传递给 node 可执行文件的 CLI 标志数组
 * @argv 生成子进程时传递给每个测试文件的 CLI 标志数组
 * @signal <AbortSignal> 允许中止正在进行的测试执行
 * @testNamePatterns 可用于仅运行名称与提供的模式匹配的测试
 * @testSkipPatterns 排除名称与提供的模式匹配的正在运行的测试
 * @timeout 测试执行将在几毫秒后失败。子测试从其父测试继承此值。默认值：Infinity
 * @watch 是否以监视模式运行。默认值：false。
 * @shard 在特定分片中运行测试。默认值：undefined。
 * @coverage 启用 代码覆盖率 集合。默认值：false。
 * @coverageExcludeGlobs 使用 glob 模式从代码覆盖范围中排除特定文件
 * @coverageIncludeGlobs 使用 glob 模式在代码覆盖范围内包含特定文件
 * @lineCoverage 要求覆盖行的最小百分比
 * @branchCoverage 要求覆盖分支的最小百分比
 * @functionCoverage 要求覆盖函数的最小百分比
 * @return  <TestsStream>
 */
let testStream = run({ files: [path.resolve("./tests/test.js")] })
  .on("test:fail", () => {
    process.exitCode = 1;
  })
  .compose(tap)
  .pipe(process.stdout);

testStream.on("coverage", data => {
  console.log("启用代码覆盖率并且所有测试都已完成时触发。", data);
});

testStream.on("complete", data => {
  console.log("当测试完成执行时触发", data);
});

testStream.on("dequeue", data => {
  console.log("当测试出列时（在执行之前）触发", data);
});

testStream.on("diagnostic", data => {
  console.log(
    "调用 context.diagnostic 时触发。该事件保证按照测试定义的顺序触发。",
    data
  );
});

testStream.on("fail", data => {
  console.log("测试失败时触发", data);
});

testStream.on("pass", data => {
  console.log("测试通过时触发", data);
});

testStream.on("plan", data => {
  console.log("当给定测试的所有子测试都完成时触发", data);
});

testStream.on("start", data => {
  console.log("当测试开始报告其自身及其子测试状态时触发", data);
});

testStream.on("stderr", data => {
  console.log("当正在运行的测试写入 stderr 时触发", data);
});

testStream.on("stdout", data => {
  console.log("当正在运行的测试写入 stdout 时触发", data);
});

testStream.on("sunmmary", data => {
  console.log("测试运行完成时触发", data);
});

testStream.on("watch:drained", data => {
  console.log("当没有更多测试排队等待以监视模式执行时触发", data);
});
```
