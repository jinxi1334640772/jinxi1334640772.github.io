## indexedDB

indexedDB 是 window 上的一个只读属性，返回 IDBFactory 对象，IndexedDB 是一种底层 API，用于在客户端存储大量的结构化数据（也包括文件/二进制大型对象（blobs））。该 API 使用索引实现对数据的高性能搜索。虽然 Web Storage 在存储较少量的数据很有用，但对于存储更大量的结构化数据来说力不从心。而 IndexedDB 提供了这种场景的解决方案。

> 此特性在 Web Worker 中可用。正如大多数的 web 储存解决方案一样，IndexedDB 也遵守同源策略。因此当你在某个域名下操作储存数据的时候，你不能操作其他域名下的数据。

IndexedDB 是一个事务型数据库系统，基于 JavaScript 的面向对象数据库。允许你存储和检索用键索引的对象；可以存储结构化克隆算法支持的任何对象。你只需要指定数据库模式，打开与数据库的连接，然后检索和更新一系列事务。

ndexedDB 鼓励使用的基本模式如下所示：

1. 打开数据库。
2. 在数据库中创建一个对象存储（object store）。
3. 启动事务，并发送一个请求来执行一些数据库操作，如添加或获取数据等。
4. 通过监听正确类型的 DOM 事件以等待操作完成。
5. 对结果进行一些操作（可以在 request 对象中找到）

```js
let customerData = [
  { name: "zhangjinxi", age: 18, email: "1334640772@qq.com", ssn: 121121323 },
  { name: "张三", age: 20, email: "23223423423@qq.com", ssn: 23232323 },
];

// 打开或者创建成功时，添加onversionchange事件处理器。
function useDatabase(db) {
  // 其他标签页请求版本变更时会触发onversionchange事件。
  // 这里必须关闭数据库，允许其他标签页更新数据库。
  // 如果不这样做，在用户关闭这些标签页之前，版本升级将不会发生。
  db.onversionchange = event => {
    db.close();
    console.log("此页面的新版本已准备就绪。请重新加载或关闭此标签页！");
  };

  //数据库关闭事件
  db.onclose=(event)=>{
    console.log('数据库关闭了')
  }
}

// 打开或者创建名字为dbName，版本为2的数据库
const request = indexedDB.open("dbName", 2);

// 删除database
// const request = indexedDB.deleteDatabase(name, options)

// 数据库打开失败处理函数
request.onerror = event => {
  // 错误处理
};

// 数据库打开成功处理函数
request.onsuccess = event => {
  const db = event.target.result;
  useDatabase(db);
  return;
};
//
request.onblocked = event => {
  // 当使用更高的版本号调用 open() 方法时，其他所有标签页打开的数据库必须显式地确认请求，才能对数据库进行修改（onblocked 事件会被触发，直到它们被关闭或重新加载）。
  console.log("请关闭其他打开了该站点的标签页！");
};

// 新创建或者版本号改变时，触发onupgradeneeded事件
request.onupgradeneeded = event => {
  // 获取IDBDatabase对象：数据库对象
  const db = event.target.result;
  useDatabase(db);
  // 创建一个名为customers的对象存储，将对象中不会重复的key:email作为键路径
  const objectStore = db.createObjectStore("customers", { keyPath: "email" });

  // 创建另一个名为“names”的对象存储，并将 autoIncrement 标志设置为真。
  const objStore = db.createObjectStore("names", { autoIncrement: true });

  /**
   * @indexName 索引名
   * @keyPath 索引名使用的keyPath
   * @options 
   *  unique 是否允许存在重复的值，默认false
   *  multiEntry  如果为true，则当keyPath解析为数组时，索引将在索引中为每个数组元素添加一个条目。如果为false，它将添加一个包含该数组的单条目。默认为false。
   * @return IDBIndex对象
   */
  objectStore.createIndex("name", "name", { unique: false });

  // 使用邮箱建立索引，我们想确保客户的邮箱不会重复，所以我们使用 unique 索引。
  objectStore.createIndex("email", "email", { unique: true });

  // 使用索引查找数据，返回查找到的第一条数据
  const index = objectStore.index("name");

  index.get("zhangjinxi").onsuccess = event => {
    console.log(`${event.target.result}`);
  };

  // 使用事务的 oncomplete 事件确保在插入数据前对象存储已经创建完毕。
  objectStore.transaction.oncomplete = event => {
    // 通过事务拿到名为customers的对象储存：customerObjectStore
    /**
     * @customers 作用域，一个你想访问的对象存储的数组
     * @readwrite 事务如何操作数据
     *  readonly 默认值
     *  readwrite
     *  versionchange:此类事务中才能修改数据库的“模式”或结构（包括新建或删除对象存储、索引）
     */
    const transactionCustomers = db.transaction(["customers"], "readwrite");

    // 在所有数据添加完毕后的处理
    transactionCustomers.oncomplete = event => {
      console.log("全部完成了！");
    };

    transactionCustomers.onerror = event => {
      // 不要忘记错误处理！error 事件是冒泡机制，所以事务会接收由它产生的所有请求所产生的错误
    };
    transactionCustomers.abort = event => {
      // 事务中没有处理一个已发生的错误事件或者调用了 abort() 方法，那么该事务会被回滚，并触发 abort 事件
    };

    const customerObjectStore = transactionCustomers.objectStore("customers");
    // 添加数据：通过遍历将数据保存到新创建的对象存储中。
    customerData.forEach(customer => {
      const request = customerObjectStore.add(customer);
      request.onsuccss = event => {
        // event.target.result === customer.email 返回keyPath
      };
    });

    // 删除数据：通过指定的keyPath
    const deleteRequest = customerObjectStore.delete("23223423423@qq.com");
    deleteRequest.onsuccess = event => {
      const deleteItem = event.target.result;
      console.log("删除成功，删除的item为：", deleteItem);
    };

    // 查询数据：通过指定的keyPath。还有getAll() 和 getAllKeys()
    const getRequest = customerObjectStore.get("23223423423@qq.com");
    getRequest.onsuccess = event => {
      // 也等于：getRequest.result
      const getItem = event.target.result;
      console.log("查询的item为：", getItem);
    };

    let putObj = {
      name: "张三",
      age: 200,
      email: "23223423423@qq.com",
      ssn: 23232323,
    };
    // 更新数据：通过指定的keyPath，更新对应keyPath的数据
    const putRequest = customerObjectStore.put(putObj);
    putRequest.onsuccess = event => {
      console.log("数据已经成功更新");
    };
    putRequest.onerror = event => {
      console.log("数据更新失败");
    };
  };
};
```

## 游标

使用 get() 要求你知道你想要检索哪一个键。如果你想要遍历对象存储空间中的所有值，那么你可以使用游标。看起来会像下面这样：

```js
const customers = [];
/**openCursor 或者openKeyCursor 的参数
 * @keyRange key range 对象来限制被检索的项目的范围
 * @order 进行迭代的方向，默认升序迭代。prev降序
 * @return  请求的result
 */
objectStore.openCursor().onsuccess = event => {
  // 到达数据的末尾时仍然会得到一个成功回调，但是 result 属性是undefined
  const cursor = event.target.result;
  if (cursor) {
    // openCursor时value为整个对象。openKeyCursor时value为keyPath值
    customers.push(cursor.value);
    console.log(`email ${cursor.key} 对应的对象是 ${cursor.value}`);
    // 想要继续，那么你必须调用游标上的 continue()
    cursor.continue();
  } else {
    console.log(`已获取的所有客户：${customers}`);
  }
};
```

## 指定游标的范围和方向

```js
// 仅匹配“Donna”
const singleKeyRange = IDBKeyRange.only("Donna");

// 匹配所有大于“Bill”的，包括“Bill”
const lowerBoundKeyRange = IDBKeyRange.lowerBound("Bill");

// 匹配所有大于“Bill”的，但不包括“Bill”
const lowerBoundOpenKeyRange = IDBKeyRange.lowerBound("Bill", true);

// 匹配所有小于“Donna”的，不包括“Donna”
const upperBoundOpenKeyRange = IDBKeyRange.upperBound("Donna", true);

// 匹配所有在“Bill”和“Donna”之间的，但不包括“Donna”
const boundKeyRange = IDBKeyRange.bound("Bill", "Donna", false, true);

// 使用其中的一个键范围，把它作为 openCursor()/openKeyCursor() 的第一个参数
index.openCursor(boundKeyRange, "prev").onsuccess = event => {
  const cursor = event.target.result;
  if (cursor) {
    // 对匹配结果进行一些操作。
    cursor.continue();
  }
};
```
