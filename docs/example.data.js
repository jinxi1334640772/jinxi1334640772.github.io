export default {
  // 数据导出 可以在vue和md文件中使用，必须要有load方法。
  load(name) {
    return {
      // 导出数据
      hello: 'world'
    }
    
  },
  // async load() {
  //   // 获取远程数据
  //   return (await fetch('...')).json()
  // }
}