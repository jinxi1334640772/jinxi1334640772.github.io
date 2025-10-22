
/**
 * VitePress 技术文档站点工具函数
 * @author zhangjinxi
 * @version 1.0.0
 */

/**
 * 计算两个数字的和
 * 
 * @param {number} a - 第一个加数
 * @param {number} b - 第二个加数
 * @returns {number} 两数之和
 * @example
 * add(1, 2); // 返回 3
 * add(10, 20); // 返回 30
 */
function add(a, b) {
  return a + b;
}

/**
 * 生成问候语字符串
 * 
 * 将姓名和年龄拼接成问候语格式
 * 
 * @param {string} name - 姓名
 * @param {number} age - 年龄
 * @returns {string} 格式化的问候语字符串
 * @example
 * createGreeting('张三', 25); // 返回 'hello 张三，25岁'
 */
function createGreeting(name, age) {
  return `hello ${name}，${age}岁`;
}

// 导出函数供外部使用
export { add, createGreeting };