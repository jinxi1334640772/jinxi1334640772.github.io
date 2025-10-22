/**
 * VitePress 数据加载器
 * 
 * 此文件用于在构建时加载数据，可在 Vue 组件和 Markdown 文件中使用
 * 使用方式: import { data } from './example.data.js'
 * 
 * @see https://vitepress.dev/guide/data-loading
 */

export default {
  /**
   * 数据加载函数（同步版本）
   * 
   * @returns {Object} 返回要导出的数据对象
   */
  load() {
    return {
      // 站点基础信息
      site: {
        title: 'VitePress 技术文档站点',
        description: '专业的前端技术知识库',
        author: 'zhangjinxi',
        year: new Date().getFullYear(),
      },
      
      // 示例数据
      hello: 'world',
      
      // 技术栈列表
      techStack: [
        { name: 'VitePress', version: '1.5.0' },
        { name: 'Vue', version: '3.x' },
        { name: 'Vite', version: '5.x' },
      ],
      
      // 导航链接
      links: {
        github: 'https://github.com/jinxi1334640772',
        juejin: 'https://juejin.cn/user/1451011080204040',
      },
    };
  },
  
  /**
   * 数据加载函数（异步版本示例）
   * 
   * 取消注释以启用异步数据加载
   * 适用于需要从 API 获取数据的场景
   * 
   * @returns {Promise<Object>} 返回异步加载的数据
   */
  // async load() {
  //   try {
  //     // 方式1: 从本地 JSON 文件加载
  //     // const localData = await import('./data.json');
  //     // return localData.default;
  //     
  //     // 方式2: 从远程 API 加载
  //     // const response = await fetch('https://api.example.com/data');
  //     // if (!response.ok) {
  //     //   throw new Error(`HTTP error! status: ${response.status}`);
  //     // }
  //     // return await response.json();
  //     
  //     // 方式3: 从多个来源加载并合并
  //     // const [users, posts] = await Promise.all([
  //     //   fetch('https://api.example.com/users').then(r => r.json()),
  //     //   fetch('https://api.example.com/posts').then(r => r.json()),
  //     // ]);
  //     // return { users, posts };
  //   } catch (error) {
  //     console.error('数据加载失败:', error);
  //     // 返回默认数据作为降级方案
  //     return {
  //       hello: 'world',
  //       error: error.message,
  //     };
  //   }
  // },
  
  /**
   * 监听文件变化（可选）
   * 
   * 返回需要监听的文件路径数组
   * 当这些文件发生变化时，会重新执行 load 函数
   * 
   * @returns {string[]} 监听的文件路径数组
   */
  // watch: ['./data/*.json', './config/*.yml'],
};