# 设计模式详解与实践

## 1. 概述

设计模式是一套被反复使用的、多数人知晓的、经过分类编目的、代码设计经验的总结，旨在重用代码、提高代码可读性和可靠性。设计模式为软件开发中常见问题提供了成熟的解决方案。

## 2. 设计模式分类

设计模式根据其目的和使用场景分为三大类：

### 2.1 创建型模式

**创建型模式**关注于对象的创建机制，主要目的是将对象的创建和使用分离，降低系统的耦合度。

- **单例模式**：确保一个类只有一个实例，并提供一个全局访问点
- **原型模式**：通过复制现有对象来创建新对象
- **工厂模式**：通过工厂方法或简单工厂来创建对象
- **抽象工厂模式**：创建一个接口，用于生成一系列相关或相互依赖的对象
- **建造者模式**：将一个复杂对象的构建与表示分离

### 2.2 结构型模式

**结构型模式**关注类和对象的组合方式，通过继承和组合来定义新的功能。

- **适配器模式**：将一个类的接口转换成客户端希望的另一个接口
- **装饰器模式**：动态地给一个对象添加额外的职责
- **代理模式**：为其他对象提供一种代理以控制对这个对象的访问
- **外观模式**：为子系统中的一组接口提供一个统一的接口
- **桥接模式**：将抽象部分与实现部分分离
- **组合模式**：将对象组合成树形结构以表示"部分-整体"的层次结构
- **享元模式**：运用共享技术有效地支持大量细粒度的对象

### 2.3 行为型模式

**行为型模式**关注对象之间的交互和职责分配，旨在将系统行为建模成合作的对象结构。

- **观察者模式**：定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知
- **迭代器模式**：提供一种方法顺序访问一个聚合对象中的各个元素
- **策略模式**：定义一系列算法，并将每一个算法封装起来，使它们可以相互替换
- **模板方法模式**：定义一个操作中的算法的骨架，将算法的一些步骤延迟到子类中
- **职责链模式**：为解除请求的发送者和接收者之间的耦合而创建的一系列对象
- **命令模式**：将请求封装为对象，从而可使用不同的请求、队列或者日志来参数化其他对象
- **备忘录模式**：在不破坏封装的前提下，捕获和恢复对象的状态
- **状态模式**：允许一个对象在其内部状态改变时改变它的行为
- **访问者模式**：允许在不改变对象结构的前提下，定义作用于这些对象的新操作
- **中介者模式**：用一个中介对象来封装一系列的对象交互
- **解释器模式**：给定一个语言，定义它的文法的一种表示，并定义一个解释器

## 3. 创建型模式

### 3.1 工厂模式

工厂模式定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类。该模式使一个类的实例化延迟到了子类。而子类可以重写接口方法以便创建的时候指定自己的对象类型。

#### 3.1.1 基本实现

```javascript
class Product {
  constructor(name) {
    this.name = name;
  }
  
  init() {
    console.log("init");
  }
  
  fun() {
    console.log("fun");
  }
}

// 创建工厂类，由参数决定实例化的具体类
class Factory {
  create(name) {
    return new Product(name);
  }
}

// 使用示例
let factory = new Factory();
let p = factory.create("p1");
p.init();
p.fun();
```

#### 3.1.2 适用场景

- 不想让某个子系统与较大的那个对象之间形成强耦合，而是想运行时从许多子系统中进行挑选
- 将 new 操作简单封装，遇到 new 的时候就应该考虑是否用工厂模式
- 需要依赖具体环境创建不同实例，这些实例都有相同的行为

#### 3.1.3 优缺点分析

**优点：**
- 构造函数和创建者分离，符合"开闭原则"
- 使用简单：无需知道对象复杂的创建过程，只要知道其名称就可以快速创建大量类似的对象

**缺点：**
- 需要引入抽象层，增加了系统的抽象性和理解难度

### 3.2 建造者模式

分步构建一个复杂的对象，可以用不同组合或顺序建造出不同意义的对象。通常使用链式调用来进行建造过程，最后调用 build 方法生成最终对象。

#### 3.2.1 基本实现

```javascript
// 父类
class BaseBuilder {
  init() {
    Object.keys(this).forEach(key => {
      const withName = `with${key.substring(0, 1).toUpperCase()}${key.substring(1)}`;
      this[withName] = value => {
        this[key] = value;
        return this;
      };
    });
  }

  build() {
    const keysNoWithers = Object.keys(this).filter(
      key => typeof this[key] !== "function"
    );

    return keysNoWithers.reduce((returnValue, key) => {
      return {
        ...returnValue,
        [key]: this[key],
      };
    }, {});
  }
}

// 子类1: 书籍建造者类
class BookBuilder extends BaseBuilder {
  constructor() {
    super();
    this.name = "";
    this.author = "";
    this.price = 0;
    this.category = "";
    super.init();
  }
}

// 调用书籍建造者类
const book = new BookBuilder()
  .withName("高效能人士的七个习惯")
  .withAuthor("史蒂芬·柯维")
  .withPrice(51)
  .withCategory("励志")
  .build();
```

#### 3.2.2 适用场景

- 分步构建一个复杂的对象

#### 3.2.3 优缺点分析

**优点：**
- 不仅得到了结果，同时也参与了创建的具体过程

**缺点：**
- 需要定义每个实现步骤，比较复杂

### 3.3 单例模式

一个类只有一个实例，并提供一个访问它的全局访问点。

#### 3.3.1 基本实现

```javascript
class LoginForm {
  static instance = null;
  
  constructor() {
    this.state = "hide";
  }

  // 静态方法始终返回同一个实例
  static getInstance() {
    if (!this.instance) {
      this.instance = new LoginForm();
    }
    return this.instance;
  }
}

let obj1 = LoginForm.getInstance();
let obj2 = LoginForm.getInstance();

console.log(obj1 === obj2); // true
```

#### 3.3.2 适用场景

- 需要全局唯一且共享的数据和方法
  - vuex 和 redux 中的 store
  - 全局唯一的弹出层

#### 3.3.3 优缺点分析

**优点：**
- 减少全局变量，减少内存占用，提升性能
- 增强模块性，只会实例化一次，便于维护和代码调试

**缺点：**
- 由于单例模式提供的是一种单点访问，所以它有可能导致模块间的强耦合 从而不利于单元测试。无法单独测试一个调用了来自单例的方法的类，而只能把它与那个单例作为一个单元一起测试

## 4. 结构型模式

### 4.1 适配器模式

将一个类的接口转化为另外一个接口，以满足用户需求，使类之间接口不兼容问题通过适配器得以解决。

#### 4.1.1 基本实现

```javascript
class Iphone {
  getName() {
    return "iphone充电头";
  }
}

class TypeC {
  getTypeName() {
    return "TypeC充电头";
  }
}

class Target {
  constructor(name) {
    this.name = name;
    if (name === "iphone") {
      this.plug = new Iphone();
    } else if (name === "typec") {
      this.plug = new TypeC();
    }
  }
  
  // 通过适配器模式，抹平不同平台的兼容性
  getName() {
    if (this.name === "iphone") {
      return this.plug.getName();
    } else if (this.name === "typec") {
      return this.plug.getTypeName();
    }
  }
}

let target1 = new Target("iphone");
console.log(target1.getName()); // iphone充电头

let target2 = new Target("typec");
console.log(target2.getName()); // TypeC充电头
```

#### 4.1.2 适用场景

- 整合第三方 SDK，统一接口
- 兼容旧接口

#### 4.1.3 优缺点分析

**优点：**
- 抹平了不同平台的差异，提供统一的接口，方便使用和维护
- 提高类的复用性

**缺点：**
- 定义和创建额外的类，增加了复杂性，占用更多的空间消耗

### 4.2 装饰者模式

在不改变原类的基础上，给类添加一些额外的职责，而不会影响从这个类中派生的其他对象，是一种实现继承的替代方案。

#### 4.2.1 基本实现

```javascript
class Cellphone {
  create() {
    console.log("生成一个手机");
  }
}

class Decorator {
  constructor(cellphone) {
    this.cellphone = cellphone;
  }
  
  create() {
    this.cellphone.create();
    this.createShell();
  }
  
  createShell() {
    console.log("生成对应的手机壳");
  }
}

let cellphone = new Cellphone();
cellphone.create();

let dec = new Decorator(cellphone);
dec.create();
```

#### 4.2.2 适用场景

- 不想改变现有类的同时，为类扩展功能
- 类的装饰器

#### 4.2.3 优缺点分析

**优点：**
- 扩展类的同时，不影响以前的业务逻辑
- 装饰类和被装饰类都只关心自身的核心业务，实现了解耦

**缺点：**
- 多层装饰比较复杂，难以阅读和理解
- 常常会引入许多小对象，看起来比较相似，实际功能大相径庭，从而使得我们的应用程序架构变得复杂起来

### 4.3 代理模式

是为一个对象提供一个代用品或占位符，以便控制对它的访问。

#### 4.3.1 基本实现

```javascript
let obj = { name: "zhangjinxi", age: 22 };

// 通过代理对象，控制对原对象obj的访问
let proxy = new Proxy(obj, {
  get(target, key) {
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    return Reflect.set(target, key, value);
  },
});

console.log(proxy.name); // zhangjinxi
```

#### 4.3.2 适用场景

- 通过一个代理对象，可以更方便控制和操作被代理对象的场合。例如，DOM 元素事件委托

#### 4.3.3 优缺点分析

**优点：**
- 代理模式能将代理对象与被调用对象分离，降低了系统的耦合度。也起到保护目标对象的作用
- 代理对象可以扩展目标对象的功能，且符合开闭原则

**缺点：**
- 处理请求速度可能有差别，非直接访问存在开销

### 4.4 外观模式

为子系统的一组接口提供一个一致的界面，定义了一个高层接口，这个接口使子系统更加容易使用。

#### 4.4.1 基本实现

```javascript
// 兼容浏览器事件绑定
let addMyEvent = function (el, ev, fn) {
  if (el.addEventListener) {
    el.addEventListener(ev, fn, false);
  } else if (el.attachEvent) {
    el.attachEvent("on" + ev, fn);
  } else {
    el["on" + ev] = fn;
  }
};
```

#### 4.4.2 适用场景

- 想抹平兼容性的场合

#### 4.4.3 优缺点分析

**优点：**
- 减少系统相互依赖，提高了灵活性
- 顾及到各个的不同，提升了安全性

**缺点：**
- 不符合开闭原则，如果要改东西很麻烦，继承重写都不合适

### 4.5 桥接模式

将抽象部分与它的实现部分分离，使它们都可以独立地变化。

#### 4.5.1 基本实现

```javascript
class Color {
  constructor(name) {
    this.name = name;
  }
}

class Shape {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
  
  draw() {
    console.log(`${this.color.name} ${this.name}`);
  }
}

// 测试
let red = new Color("red");
let yellow = new Color("yellow");

let circle = new Shape("circle", red);
circle.draw();

let triangle = new Shape("triangle", yellow);
triangle.draw();
```

#### 4.5.2 适用场景

- 一个整体需要由若干个部分组合而成的场合

#### 4.5.3 优缺点分析

**优点：**
- 有助于独立地管理各组成部分，把抽象化与实现化解耦，提高可扩展性

**缺点：**
- 大量的类将导致开发成本的增加，性能减少

### 4.6 组合模式

将对象组合成树形结构，以表示"整体-部分"的层次结构。通过对象的多态表现，使得用户对单个对象和组合对象的使用具有一致性。

#### 4.6.1 基本实现

```javascript
class TrainOrder {
  create() {
    console.log("创建火车票订单");
  }
}

class HotelOrder {
  create() {
    console.log("创建酒店订单");
  }
}

class TotalOrder {
  constructor() {
    this.orderList = [];
  }
  
  addOrder(order) {
    this.orderList.push(order);
    return this;
  }
  
  create() {
    this.orderList.forEach(item => {
      item.create();
    });
    return this;
  }
}

// 可以在购票网站买车票同时也订房间
let train = new TrainOrder();
let hotel = new HotelOrder();
let total = new TotalOrder();
total.addOrder(train).addOrder(hotel).create();
```

#### 4.6.2 适用场景

- 表示对象-整体层次结构
- 希望用户忽略组合对象和单个对象的不同，用户将统一地使用组合结构中的所有对象

#### 4.6.3 优缺点分析

**优点：**
- 一次性完成所有流程，使用更加便捷

**缺点：**
- 如果通过组合模式创建了太多的对象，消耗性能

### 4.7 原型模式

创建一个共享的原型，通过拷贝这个原型来创建新的类，用于创建重复的对象，带来性能上的提升。

#### 4.7.1 基本实现

```javascript
// 创造共享的原型
class Product {
  constructor(name) {
    this.name = name;
  }
  
  init() {
    console.log("init");
  }
}

// 创建工厂类，由参数决定实例化的具体类
class Factory {
  create(name) {
    // 创造的新对象全都指向构造函数的原型对象
    return new Product(name);
  }
}

let factory = new Factory();
let p = factory.create("p1");
p.init();
```

#### 4.7.2 适用场景

- 以某个对象为原型，创建大量对象的场合

#### 4.7.3 优缺点分析

**优点：**
- 原型用来重复创建对象，提升性能

**缺点：**
- 原型是所有实例共享的，当原型改变，所有实例都会改变

### 4.8 享元模式

有效地支持大量细粒度对象的复用。系统只使用少量的对象，而这些对象都很相似，状态变化很小，可以实现对象的多次复用。

#### 4.8.1 基本实现

```javascript
/* 驾考车对象 */
class ExamCar {
  constructor() {
    this.usingState = false; // 是否正在使用
  }

  /* 在本车上考试 */
  examine(candidateId) {
    return new Promise(resolve => {
      this.usingState = true;
      setTimeout(() => {
        this.usingState = false;
        resolve(); // 0~2秒后考试完毕
      }, Math.random() * 2000);
    });
  }
}

/* 考试车对象池 */
const ExamCarPool = {
  _pool: [], // 驾考车对象池
  _candidateQueue: [], // 考生队列
  
  /* 注册考生 ID 列表 */
  registCandidates(candidateList) {
    candidateList.forEach(candidateId => this.registCandidate(candidateId));
  },

  /* 注册考生 */
  registCandidate(candidateId) {
    // 找一个未被占用的驾考车
    const examCar = this.getExamCar();
    if (examCar) {
      // 开始考试，考完了让队列中的下一个考生开始考试
      examCar.examine(candidateId).then(() => {
        const nextCandidateId = this._candidateQueue.length && this._candidateQueue.shift();
        nextCandidateId && this.registCandidate(nextCandidateId);
      });
    } else {
      this._candidateQueue.push(candidateId);
    }
  },

  /* 注册考试车 */
  initExamCar(ExamCarNum) {
    for (let i = 1; i <= ExamCarNum; i++) {
      this._pool.push(new ExamCar());
    }
  },

  /* 获取状态为未被占用的车 */
  getExamCar() {
    return this._pool.find(car => !car.usingState);
  },
};

ExamCarPool.initExamCar(3); // 一共有3个驾考车
ExamCarPool.registCandidates([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 10个考生来考试
```

#### 4.8.2 适用场景

- 如果一个应用程序使用了大量的对象，造成了很大的存储开销时
- 需要复用细粒度对象的时候

#### 4.8.3 优缺点分析

**优点：**
- 大大减少对象的创建，降低系统的内存，使效率提高

**缺点：**
- 提高了系统的复杂度，需要分离出外部状态和内部状态，而且外部状态具有固有化的性质，不应该随着内部状态的变化而变化，否则会造成系统的混乱

## 5. 行为型模式

### 5.1 观察者模式

定义了一种一对多的关系，让多个观察者对象同时监听某一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者对象，使它们能够自动更新自己，当一个对象的改变需要同时改变其它对象，并且它不知道具体有多少对象需要改变的时候，就应该考虑使用观察者模式。

#### 5.1.1 基本实现

```javascript
// 主题 保存状态，状态变化之后触发所有观察者对象
class Subject {
  constructor() {
    this.state = 0;
    this.observers = [];
  }
  
  getState() {
    return this.state;
  }
  
  setState(state) {
    this.state = state;
    this.notifyAllObservers();
  }
  
  // 发生变动时，通知所有观察者
  notifyAllObservers() {
    this.observers.forEach(observer => {
      observer.update();
    });
  }
  
  // 添加观察者
  attach(observer) {
    this.observers.push(observer);
  }
}

// 观察者
class Observer {
  // 新建观察者时，把自己添加进目标对象的订阅者数组里
  constructor(name, subject) {
    this.name = name;
    this.subject = subject;
    this.subject.attach(this);
  }
  
  update() {
    console.log(`${this.name} update, state: ${this.subject.getState()}`);
  }
}

let s = new Subject();
let o1 = new Observer("o1", s);
let o2 = new Observer("o2", s);

s.setState(12);
```

#### 5.1.2 适用场景

- Vue 响应式原理
- DOM 事件监听器

#### 5.1.3 优缺点分析

**优点：**
- 支持简单的广播通信，自动通知所有已经订阅过的对象
- 目标对象与观察者之间的抽象耦合关系能单独扩展以及重用，增加了灵活性
- 观察者模式所做的工作就是在解耦，让耦合的双方都依赖于抽象，而不是依赖于具体。从而使得各自的变化都不会影响到另一边的变化

**缺点：**
- 过度使用会导致对象与对象之间的联系弱化，会导致程序难以跟踪维护和理解

### 5.2 发布订阅模式

观察者模式可以通知变化。发布订阅模式则是通知多种类型的变化。

#### 5.2.1 基本实现

```javascript
class Event {
  constructor() {
    // 事件仓库，大概是这样的形式：
    // handlers:{eventName:[handler1,handler2,handler3...]}
    this.handlers = {};
  }

  // 添加事件
  on(type, handler) {
    (this.handlers[type] || (this.handlers[type] = [])).push(handler);
  }
  
  // 派发事件
  emit(type, ...params) {
    if (!this.handlers[type]) throw new Error("该事件不存在");
    this.handlers[type].forEach(handler => {
      handler(...params);
    });
  }
  
  // 移除事件
  off(type, handler) {
    if (!this.handlers[type]) throw new Error("该事件不存在");
    if (!handler) {
      delete this.handlers[type];
    } else {
      const currentIndex = this.handlers[type].findIndex(item => item === handler);
      if (currentIndex >= 0) {
        this.handlers[type].splice(currentIndex, 1);
        this.handlers[type].length === 0 && delete this.handlers[type];
      }
    }
  }
}
```

### 5.3 状态模式

允许一个对象在其内部状态改变的时候改变它的行为，对象看起来似乎修改了它的类。

#### 5.3.1 基本实现

```javascript
// 状态 （弱光、强光、关灯）
class State {
  constructor(state) {
    this.state = state;
  }
  
  // 更改context的state，导致其行为发生变化
  handle(context) {
    console.log(`this is ${this.state} light`);
    context.setState(this);
  }
}

// 接受不同的状态，执行不同的行为
class Context {
  constructor() {
    this.state = null;
  }
  
  getState() {
    return this.state;
  }
  
  setState(state) {
    this.state = state;
  }
}

// 测试
let context = new Context();
let weak = new State("weak");
let strong = new State("strong");
let off = new State("off");

// 弱光
weak.handle(context);
console.log(context.getState());

// 强光
strong.handle(context);
console.log(context.getState());

// 关闭
off.handle(context);
console.log(context.getState());
```

#### 5.3.2 适用场景

- 一个对象的行为取决于它的状态，并且它必须在运行时，根据状态改变它的行为
- 一个操作中含有大量的分支语句，而且这些分支语句依赖于该对象的状态

#### 5.3.3 优缺点分析

**优点：**
- 定义了状态与行为之间的关系，封装在一个类里，更直观清晰，增改方便
- 状态与状态间，行为与行为间彼此独立互不干扰
- 用对象代替字符串来记录当前状态，使得状态的切换更加一目了然

**缺点：**
- 会在系统中定义许多状态类
- 逻辑分散，不易理解

### 5.4 迭代器模式

提供一种方法顺序访问一个聚合对象中各个元素，而又不暴露该对象的内部表示。

#### 5.4.1 基本实现

```javascript
class Iterator {
  constructor(container) {
    this.list = container.list;
    this.index = 0;
  }
  
  next() {
    if (this.hasNext()) {
      return this.list[this.index++];
    }
    return null;
  }
  
  hasNext() {
    if (this.index >= this.list.length) {
      return false;
    }
    return true;
  }
}

class Container {
  constructor(list) {
    this.list = list;
  }
  
  getIterator() {
    return new Iterator(this);
  }
}

// 测试代码
let container = new Container([1, 2, 3, 4, 5]);
let iterator = container.getIterator();
while (iterator.hasNext()) {
  console.log(iterator.next());
}
```

#### 5.4.2 适用场景

- Array.prototype.forEach
- jQuery 中的 $.each()
- ES6 Iterator
- 对于集合内部结果常常变化各异，不想暴露其内部结构的话，但又想让客户代码透明的访问其中的元素，可以使用迭代器模式

#### 5.4.3 优缺点分析

**优点：**
- 访问一个聚合对象的内容而无需暴露它的内部表示
- 为遍历不同的集合结构提供一个统一的接口，从而支持同样的算法在不同的集合结构上进行操作

### 5.5 策略模式

定义一系列的算法，把它们一个个封装起来，并且使它们可以互相替换。

#### 5.5.1 基本实现

```html
<html>
  <head>
    <title>策略模式-校验表单</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  </head>
  <body>
    <form id="registerForm" method="post" action="http://xxxx.com/api/register">
      用户名：<input type="text" name="userName" />
      密码：<input type="text" name="password" />
      手机号码：<input type="text" name="phoneNumber" />
      <button type="submit">提交</button>
    </form>
    <script type="text/javascript">
      // 策略对象
      const strategies = {
        isNoEmpty: function (value, errorMsg) {
          if (value === "") {
            return errorMsg;
          }
        },
        isNoSpace: function (value, errorMsg) {
          if (value.trim() === "") {
            return errorMsg;
          }
        },
        minLength: function (value, length, errorMsg) {
          if (value.trim().length < length) {
            return errorMsg;
          }
        },
        maxLength: function (value, length, errorMsg) {
          if (value.length > length) {
            return errorMsg;
          }
        },
        isMobile: function (value, errorMsg) {
          if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[7]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value)) {
            return errorMsg;
          }
        },
      };

      // 验证类
      class Validator {
        constructor() {
          this.cache = [];
        }
        
        add(dom, rules) {
          for (let i = 0, rule; (rule = rules[i++]); ) {
            let strategyAry = rule.strategy.split(":");
            let errorMsg = rule.errorMsg;
            this.cache.push(() => {
              let strategy = strategyAry.shift();
              strategyAry.unshift(dom.value);
              strategyAry.push(errorMsg);
              return strategies[strategy].apply(dom, strategyAry);
            });
          }
        }
        
        start() {
          for (let i = 0, validatorFunc; (validatorFunc = this.cache[i++]); ) {
            let errorMsg = validatorFunc();
            if (errorMsg) {
              return errorMsg;
            }
          }
        }
      }

      // 调用代码
      let registerForm = document.getElementById("registerForm");

      let validataFunc = function () {
        let validator = new Validator();
        validator.add(registerForm.userName, [
          { strategy: "isNoEmpty", errorMsg: "用户名不可为空" },
          { strategy: "isNoSpace", errorMsg: "不允许以空白字符命名" },
          { strategy: "minLength:2", errorMsg: "用户名长度不能小于2位" },
        ]);
        validator.add(registerForm.password, [
          { strategy: "minLength:6", errorMsg: "密码长度不能小于6位" },
        ]);
        validator.add(registerForm.phoneNumber, [
          { strategy: "isMobile", errorMsg: "请输入正确的手机号码格式" },
        ]);
        return validator.start();
      };

      registerForm.onsubmit = function () {
        let errorMsg = validataFunc();
        if (errorMsg) {
          alert(errorMsg);
          return false;
        }
      };
    </script>
  </body>
</html>
```

#### 5.5.2 适用场景

- 一个系统需要动态地在几种算法(行为)中选择一种。例如：表单验证

#### 5.5.3 优缺点分析

**优点：**
- 符合开闭原则，算法独立封装在一起，易于切换、理解、扩展
- 利用组合、委托、多态等技术和思想，可以有效的避免多重条件选择语句

**缺点：**
- 会在程序中增加许多策略类或者策略对象

### 5.6 模板方法模式

模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法和封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

#### 5.6.1 基本实现

```javascript
// 创造饮料父类
class Beverage {
  constructor({ brewDrink }) {
    this.brewDrink = brewDrink;
  }
  
  /* 烧开水，共用方法 */
  boilWater() {
    console.log("水已经煮沸=== 共用");
  }

  /* 模板方法 */
  init() {
    this.boilWater();
    this.brewDrink();
  }
}

/* 咖啡 */
const coffee = new Beverage({
  /* 冲泡咖啡，覆盖抽象方法 */
  brewDrink: function () {
    console.log("冲泡咖啡");
  },
});
coffee.init();
```

#### 5.6.2 适用场景

- 一次性实现一个算法的不变的部分，并将可变的行为留给子类来实现

#### 5.6.3 优缺点分析

**优点：**
- 提取了公共代码部分，易于维护

**缺点：**
- 增加了系统复杂度，主要是增加了的抽象类和类间联系

### 5.7 职责链模式

使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

#### 5.7.1 基本实现

```javascript
// 请假审批，需要组长审批、经理审批、总监审批
class Action {
  constructor(name) {
    this.name = name;
    this.nextAction = null;
  }
  
  setNextAction(action) {
    this.nextAction = action;
  }
  
  handle() {
    console.log(`${this.name} 审批`);
    if (this.nextAction != null) {
      this.nextAction.handle();
    }
  }
}

let a1 = new Action("组长");
let a2 = new Action("经理");
let a3 = new Action("总监");
a1.setNextAction(a2);
a2.setNextAction(a3);
a1.handle();
```

#### 5.7.2 适用场景

- 需要多次处理的流程。例如：JS 中的事件冒泡，作用域链，原型链

#### 5.7.3 优缺点分析

**优点：**
- 降低耦合度。它将请求的发送者和接收者解耦
- 简化了对象。使得对象不需要知道链的结构
- 增强给对象指派职责的灵活性。很容易新增或者删除责任链

**缺点：**
- 不能保证某个请求一定会被链中的节点处理，这种情况可以在链尾增加一个保底的接受者节点来处理这种即将离开链尾的请求
- 使程序中多了很多节点对象，可能在一次请求的过程中，大部分的节点并没有起到实质性的作用。他们的作用仅仅是让请求传递下去，从性能方面考虑，要避免过长的职责链带来的性能损耗

### 5.8 命令模式

将一个请求封装成一个对象，从而让你使用不同的请求把客户端参数化，对请求排队或者记录请求日志，可以提供命令的撤销和恢复功能。

#### 5.8.1 基本实现

```javascript
// 接收者类
class Receiver {
  execute() {
    console.log("接收者执行请求");
  }
}

// 命令
class Command {
  constructor(receiver) {
    this.receiver = receiver;
  }
  
  execute() {
    console.log("命令");
    this.receiver.execute();
  }
}

// 命令触发者
class Invoker {
  constructor(command) {
    this.command = command;
  }
  
  invoke() {
    console.log("开始");
    this.command.execute();
  }
}

// 仓库
const warehouse = new Receiver();
// 订单
const order = new Command(warehouse);
// 客户
const client = new Invoker(order);
client.invoke();
```

#### 5.8.2 适用场景

- 命令发出者通过不同命令，来控制命令接收者做出不同行为

#### 5.8.3 优缺点分析

**优点：**
- 对命令进行封装，使命令易于扩展和修改
- 命令发出者和接受者解耦，使发出者不需要知道命令的具体执行过程即可执行

**缺点：**
- 可能会导致某些系统有过多的具体命令类

### 5.9 备忘录模式

在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样以后就可将该对象恢复到保存的状态。

#### 5.9.1 基本实现

```javascript
// 备忘类
class Memento {
  constructor(content) {
    this.content = content;
  }
  
  getContent() {
    return this.content;
  }
}

// 备忘列表
class CareTaker {
  constructor() {
    this.list = [];
  }
  
  add(memento) {
    this.list.push(memento);
  }
  
  get(index) {
    return this.list[index];
  }
}

// 编辑器
class Editor {
  constructor() {
    this.content = null;
  }
  
  setContent(content) {
    this.content = content;
  }
  
  getContent() {
    return this.content;
  }
  
  saveContentToMemento() {
    return new Memento(this.content);
  }
  
  getContentFromMemento(memento) {
    this.content = memento.getContent();
  }
}

// 测试代码
let editor = new Editor();
let careTaker = new CareTaker();

editor.setContent("111");
editor.setContent("222");
careTaker.add(editor.saveContentToMemento());
editor.setContent("333");
careTaker.add(editor.saveContentToMemento());
editor.setContent("444");

console.log(editor.getContent()); // 444
editor.getContentFromMemento(careTaker.get(1));
console.log(editor.getContent()); // 333

editor.getContentFromMemento(careTaker.get(0));
console.log(editor.getContent()); // 222
```

#### 5.9.2 适用场景

- 需要备份数据，以便以后恢复数据的场合。例如：分页控件

#### 5.9.3 优缺点分析

**优点：**
- 使用户能够比较方便地回到某个历史的状态

**缺点：**
- 消耗资源。如果类的成员变量过多，势必会占用比较大的资源，而且每一次保存都会消耗一定的内存

### 5.10 中介者模式

解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的相关对象都通过中介者对象来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可。中介者使各对象之间耦合松散，而且可以独立地改变它们之间的交互。中介者模式使网状的多对多关系变成了相对简单的一对多关系。

#### 5.10.1 基本实现

```javascript
class A {
  constructor() {
    this.number = 0;
  }
  
  setNumber(num, m) {
    this.number = num;
    if (m) {
      m.setB();
    }
  }
}

class B {
  constructor() {
    this.number = 0;
  }
  
  setNumber(num, m) {
    this.number = num;
    if (m) {
      m.setA();
    }
  }
}

class Mediator {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  
  setA() {
    let number = this.b.number;
    this.a.setNumber(number * 10);
  }
  
  setB() {
    let number = this.a.number;
    this.b.setNumber(number / 10);
  }
}

let a = new A();
let b = new B();
let m = new Mediator(a, b);
a.setNumber(10, m);
console.log(a.number, b.number);
b.setNumber(10, m);
console.log(a.number, b.number);
```

#### 5.10.2 适用场景

- 系统中对象之间存在比较复杂的引用关系，导致它们之间的依赖关系结构混乱而且难以复用该对象
- 想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类

#### 5.10.3 优缺点分析

**优点：**
- 使各对象之间耦合松散，而且可以独立地改变它们之间的交互
- 中介者和对象一对多的关系取代了对象之间的网状多对多的关系

**缺点：**
- 系统中会新增一个中介者对象，因为对象之间交互的复杂性，转移成了中介者对象的复杂性，使得中介者对象经常是巨大的。中介者对象自身往往就是一个难以维护的对象

### 5.11 解释器模式

给定一个语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。

#### 5.11.1 基本实现

```javascript
class Context {
  constructor() {
    this._list = []; // 存放 终结符表达式
    this._sum = 0; // 存放 非终结符表达式(运算结果)
  }

  get sum() {
    return this._sum;
  }
  
  set sum(newValue) {
    this._sum = newValue;
  }
  
  add(expression) {
    this._list.push(expression);
  }
  
  get list() {
    return [...this._list];
  }
}

class PlusExpression {
  interpret(context) {
    if (!(context instanceof Context)) {
      throw new Error("TypeError");
    }
    context.sum = ++context.sum;
  }
}

class MinusExpression {
  interpret(context) {
    if (!(context instanceof Context)) {
      throw new Error("TypeError");
    }
    context.sum = --context.sum;
  }
}

/** 以下是测试代码 **/
const context = new Context();

// 依次添加: 加法 | 加法 | 减法 表达式
context.add(new PlusExpression());
context.add(new PlusExpression());
context.add(new MinusExpression());

// 依次执行: 加法 | 加法 | 减法 表达式
context.list.forEach(expression => expression.interpret(context));
console.log(context.sum);
```

#### 5.11.2 适用场景

- 需要添加一个解释类来表示语言的文法规则

#### 5.11.3 优缺点分析

**优点：**
- 易于改变和扩展文法
- 由于在解释器模式中使用类来表示语言的文法规则，因此可以通过继承等机制来改变或扩展文法

**缺点：**
- 执行效率较低，在解释器模式中使用了大量的循环和递归调用，因此在解释较为复杂的句子时其速度慢
- 对于复杂的文法比较难维护

### 5.12 访问者模式

在不改变各元素的类的前提下定义作用于这些元素的新操作。

#### 5.12.1 基本实现

```javascript
// 访问者
class Visitor {
  constructor() {}
  
  visitConcreteElement(ConcreteElement) {
    ConcreteElement.operation();
  }
}

// 元素类
class ConcreteElement {
  constructor() {}
  
  operation() {
    console.log("ConcreteElement.operation invoked");
  }
  
  accept(visitor) {
    visitor.visitConcreteElement(this);
  }
}

// 客户端
let visitor = new Visitor();
let element = new ConcreteElement();
element.accept(visitor);
```

#### 5.12.2 适用场景

- 不修改元素的前提下，访问或者修改元素

#### 5.12.3 优缺点分析

**优点：**
- 符合单一职责原则
- 优秀的扩展性和灵活性

**缺点：**
- 具体元素对访问者公布细节，违反了迪米特原则
- 违反了依赖倒置原则，依赖了具体类，没有依赖抽象

## 6. 最佳实践

### 6.1 设计模式选择指南

在选择设计模式时，应该考虑以下因素：

1. **问题域分析**：首先明确要解决的具体问题
2. **复杂度评估**：权衡引入模式的复杂度与带来的好处
3. **扩展性需求**：考虑系统未来的扩展和维护需求
4. **团队熟悉度**：确保团队成员能够理解和维护相关模式

### 6.2 常见误区

1. **过度设计**：不要为了使用模式而使用模式
2. **模式堆叠**：避免在一个系统中使用过多的设计模式
3. **忽视简单性**：简单的解决方案往往比复杂的模式更好
4. **死板应用**：要根据具体情况灵活应用模式

### 6.3 性能考虑

1. **对象创建开销**：某些模式可能增加对象创建的开销
2. **内存使用**：注意模式对内存使用的影响
3. **执行效率**：权衡模式带来的灵活性与执行效率

## 7. 总结

设计模式是软件开发中的重要工具，它们提供了经过验证的解决方案来解决常见的设计问题。通过合理使用设计模式，可以：

- 提高代码的可维护性和可扩展性
- 增强代码的可读性和可理解性
- 促进团队协作和代码重用
- 减少开发时间和成本

但是，设计模式不是银弹，需要根据具体情况选择合适的模式，避免过度设计和模式滥用。

## 8. 参考资料

- 《设计模式：可复用面向对象软件的基础》- GoF
- 《JavaScript设计模式与开发实践》- 曾探
- 《Head First 设计模式》- Freeman & Robson
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript 设计模式](https://www.patterns.dev/)
