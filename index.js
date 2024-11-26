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