## TypeScript 简介

TypeScript 属于 Javascript 的超集，兼容 Javascript 所有语法的基础上，支持使用 JavaScript 的最新语法，还扩展了很多其他功能，并且添加了类型标注、类型推断、类型验证功能，也有了更好的语法提示。TypeScript 在编译阶段就可以抛出一些容易被 JavaScript 忽略的错误，提升了代码健壮性。

## 基础类型

- `string`
- `number`
- `boolean`
- `bigint`
- `symbol`

- `any`任何类型
- `null`不存在的值，任何类型子类
- `undefined`未初始化的值，任何类型子类
- `never`不可能出现的值，任何类型子类
- `void`声明返回 undefined 的函数或其他值

```ts
let num: number = 123;
let str: string = "12132";
let bool: boolean = true;

// bigint类型
const oneHundred: bigint = BigInt(100);
const anotherHundred: bigint = 100n;
// symbol类型
const symbolName: symbol = Symbol("name");
// any类型
let name: any = 2323;
name = "1212";
// 函数类型
function getName(name: string): void {
  console.log("void类型，修饰不返回任何内容的函数");
}

//null，undefined是任何类型子类型
let name: null | undefined = "124";

/**启用 strictNullChecks 时，当值为 null 或 undefined 时，你需要在对该值
 * 使用方法或属性之前测试这些值。就像在使用可选属性之前检查 undefined 一样，
 * 我们可以使用缩小来检查可能是 null 的值： */
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}

//表达式之后写 ! 实际上是一个类型断言，该值不是 null 或 undefined：
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed());
}
```

- `枚举`

```ts
// 数字枚举，默认索引从0开始。这里修改默认从1开始
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
console.log("Direction.Down === 2", Direction.Down === 2);

// 字符串枚举
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// 枚举的key和value，可以互相引用
let up = Direction.Up; // UP
console.log("Direction[up] === 'Up'", Direction[up] === "Up");
```

- `函数`

```ts
// Function函数类型
function doSomething(f: Function) {
  return f(1, 2, 3);
}
// 参数默认值，剩余参数 ，返回值为string类型
function getName(name: string = "zhangjinix", ...m: number[]): string {
  return name.toUpperCase();
}
// 参数为没有返回值的函数
function greeter(fn: (a: string) => void): string {
  return "当前greeter函数返回值类型为string";
}

// 返回 Promise 类型的函数，兑现为number
async function getFavoriteNumber(): Promise<number> {
  return 26;
}

// 对象类型的参数，z参数可选
function printCoord(pt: { x: number; y: number = 12; z?: number }): number {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
  return 124;
}
// 参数解构
function printCoord({ a, b, c }: { a: number; b: number; c: number }): number {
  return a + b + c;
}
```

## 复杂类型

- `数组`

```ts
let numArray: number[] = [1, 2, 3];
let stringArray: string[] = ["11", "aha", "zhangjinxi"];

// 使用泛型
let numArray: Array<number> = [1, 2, 3];
let numArray: Array<number | string> = [1, "zhangjinxi", 23243, "ewr"];
```

- `元组`

元组类型是另一种 Array 类型，它确切地知道它包含多少个元素，以及它在特定位置包含哪些类型。

```ts
// readonly元组，剩余参数
type StringNumberBooleans = readonly [string, number, ...boolean[]];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];

type StringNumberPair<T> = [string, number, T];
let stringArray: StringNumberPair<boolean> = ["11", 11, true];
```

- `object`

```ts
let obj: object = { name: "zhangjinxi", age: 23 };
let obj: { name: string; age: number } = { name: "zhangjinxi", age: 23 };
```

- `联合类型`

```ts
let name: string | number = "我可以是string类型，也可以是number类型";
name = 124;
```

- `交叉类型`

```ts
type Animal = { name: string };
type Bear = { honey: boolean };
type ListType: Animal & Bear
let bear:ListType== { name: "我是Animal，同时也是Bear类型", honey: true };
```

- `类型别名`

```ts
type otherName = Array<boolean>;
type point = number | string;
type Point = {
  x: number;
  y: string;
  z: boolean;
};
type Box<Type> = {
  contents: Type;
};
```

- `类型断言`

```ts
let div: HTMLDivElement = document.getElementById("myDiv");

// 使用断言
let div = document.getElementById("myDiv") as HTMLDivElement;
```

- `接口`

```ts
// <T>:泛型，readonly:只读参数，new:构造函数，?:可选参数，[params: string]:不定参数
interface Person<T> {
  readonly name: string;
  age: T;
  skin:'white'|'black';
  hobbies: Array<string>;
  new (s: string): SomeObject;
  func(someArg: number)?: boolean;
  option?: string;
  [index: number]: string;
  [params: string]: string;
}

type personAlias = Person;

// extends继承
interface student extends Person {
  class: number;
  height: number;
}
let person: Person<number> = {
  name: "zhangjinxi",
  age: 23,
  skin:'white',
  hobbies: ["爬山", "游泳", "打球"],
  option:'我是可选参数，有没有都可以'
};
let otherPerson:Person;
new otherPerson('会调用Person接口声明里的new构造函数')
```

- `字面类型`

```ts
let name: "小明" | "小花" = "小明";
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello", "left");
printText("world", "我不属于字面类型指定的值，会报错"); // 报错
```

## 泛型：类型变量

把类型当作变量，参数的类型取决于传进来的类型。

```js
// 传入泛型Type
function identity<Type>(arg: Type): Type {
  return arg;
}
let output = identity<string>("myString");

//用泛型定义函数类型
let myIdentity: <Type>(arg: Type) => Type = identity;

// 定义泛型接口
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}
let myIdentity: GenericIdentityFn = identity;

//定义泛型类
class GenericNumber<NumType> {
  zeroValue: NumType;
  make(): NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};

// 泛型约束：约束泛型Type，只能是具有 .length 属性的所有类型
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}

//在泛型约束中使用类型参数：Key类型只能是Type类型中的一个属性
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}
//在泛型中使用类类型:使用泛型创建工厂时，需要通过其构造函数引用类类型
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
 //使用原型属性来推断和约束构造函数和类类型的实例端之间的关系
 class ZooKeeper {
  nametag: string = "Mikle";
}

class Animal {
  numLegs: number = 4;
}
 class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}
// A继承自Animal，并且也是c类构造函数返回值类型;U继承HTMLElement默认值为HTMLDivElement
function createInstance<A extends Animal,U extends HTMLElement = HTMLDivElement>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;

//Cat expends Animal。 Cat 和 Animal作为泛型使用时，
// 协变：接受Animal的地方也能接受Cat——兼容子类
// 逆变：接受Cat的地方也能接受Animal——兼容父类

// 逆变注释：Contravariant annotation
interface Consumer<in T> {
  consume: (arg: T) => void;
}
// 协变注释：Covariant annotation
interface Producer<out T> {
  make(): T;
}
// 不变注释：Invariant annotation
interface ProducerConsumer<in out T> {
  consume: (arg: T) => void;
  make(): T;
}
```

## keyof：键映射

keyof 运算符采用对象类型并生成其键的字符串或数字字面联合。keyof 类型在与映射类型结合使用时变得特别有用

```ts
type Point = { x: number; y: number };
type P = keyof Point; // P = "x" | "y"

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // A = number

//因为 JavaScript 对象键总是被强制转换为字符串
type Mapish = { [k: string]: boolean };
type M = keyof Mapish; //M = string | number
```

## typeof：类型引用

TypeScript 添加了一个 typeof 运算符，你可以在类型上下文中使用它来引用变量或属性的类型：

```ts
let s = "hello";
let n: typeof s; // string

//预定义类型 ReturnType<T> ，接受一个函数类型并产生函数的返回类型
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>; // boolean：函数返回类型是Boolean

function f() {
  return { x: 10, y: 3 };
}
//报错：ReturnType需要传函数类型，这里f是值。
type P = ReturnType<f>;

//值和类型不是一回事。要引用值 f 所具有的类型，我们使用 typeof
type P = ReturnType<typeof f>; //type P = { x: number; y: number };
```

## Type[index]：类型索引

可以使用索引访问类型来查找另一种类型的特定属性：

```ts
type Person = { age: number; name: string; alive: boolean };

type Age = Person["age"]; //type Age = number

//索引类型本身就是一种类型，可使用联合、keyof 或其他类型：
type I1 = Person["age" | "name"];//type I1 = string | number

type I2 = Person[keyof Person];//type I2 = string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];//type I3 = string | boolean

//使用 number 来获取数组元素的类型。我们可以将它与 typeof 结合起来，以方便地捕获数组字面量的元素类型：
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 //type Person = {name: string;age: number}  可以不加括号
type Person = typeof (MyArray[number]);

type Age = typeof (MyArray[number]["age"]);//type Age = number

```

## 三目运算：条件类型

类型根据输入做出决定

```ts
// 语法类似：
SomeType extends OtherType ? TrueType : FalseType;

interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}
//type Example1 = number
type Example1 = Dog extends Animal ? number : string;

//type Example2 = string
type Example2 = RegExp extends Animal ? number : string;

// 从联合类型选择
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
type name =  NameOrId<number> //type name = IdLabel


// 类型约束 T类型必须要有message属性
type MessageOf<T extends { message: unknown }> = T["message"];

// T有message属性返回T["message"]，否则返回never
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

// 在条件类型中推断：使用 infer 关键字引入并推断新变量，Return：函数返回类型
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

// Type：() => number，返回number类型，推断为true，则返回number
type Num = GetReturnType<() => number>;//type Num = number

type Str = GetReturnType<(x: string) => string>;//type Str = string

//type Bools = boolean[]  Type函数返回boolean[]类型，
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;

//分布式条件类型
type ToArray<Type> = Type extends any ? Type[] : never;
//这里把string | number分开传入了，结果：type StrArrOrNumArr = string[] | number[]
type StrArrOrNumArr = ToArray<string | number>;

// [Type] [any]都用中括号包起来，此时string | number作为一个整体
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// type ArrOfStrOrNum = (string | number)[]
type ArrOfStrOrNum = ToArrayNonDist<string | number>;
```

## in：映射类型

有时一种类型需要基于另一种类型，就不需要重复自己了。映射类型是一种泛型类型，它使用 PropertyKey 的联合（经常创建的 通过 keyof）来迭代键来创建类型：

```ts
// keyof Type结果为联合字面量：'darkMode'|'newUserProfile'
// 通过in关键字，遍历联合字面量：'darkMode'|'newUserProfile'
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
type Features = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<Features>;
type FeatureOptions = {
  darkMode: boolean;
  newUserProfile: boolean;
};
// 映射修饰符：readonly 和 ? 分别影响可变性和可选性。 as 给键重命名，Exclude排除键
// 通过添加前缀 - 或 + 来移除或添加这些修饰符。如果你不添加前缀，则假定为 +。

// 添加-前缀，移除readonly修饰符，移除？修饰符，as重命名键，as+Exclude排除键
type CreateMutable<Type> = {
  -readonly [Property in keyof Type as Exclude<Property, "kind">
   as `get${Capitalize<string & Property>}`]-?: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
  age?: number;
};

type UnlockedAccount = CreateMutable<LockedAccount>;

type UnlockedAccount = {
  getId: string;
  getAge: number;
};
```

## class 类

与其他 JavaScript 语言功能一样，TypeScript 添加了类型注释和其他语法，以允许你表达类和其他类型之间的关系。

> `strictPropertyInitialization` 设置控制类字段是否需要在构造函数中初始化。

```ts
class Point<T> {
  public x: number = 123; // public 成员可以在任何地方访问
  protected y: number; // protected成员在类和子类中可见
  // Not initialized, but no error
  private name!: string; //private成员只在当前类可见
  readonly age: T; //只读属性
  static height: number; //静态成功，通过Point.height获取
  // 参数名和类属性x,y重名，将赋值给类属性值
  constructor(x: number, y: number);
  // 类可以声明索引签名；这些工作与 其他对象类型的索引签名 相同：
  [s: string]: boolean | ((s: string) => boolean);
  check(s: string) {
    return this[s] as boolean;
  }
}

// 构造函数签名:给定类本身的类型，InstanceType 工具类型会对此操作进行建模。
type PointInstance = InstanceType<typeof Point>;
const pt: PointInstance = new Point();
pt.x = 0;
pt.y = 0;

// implements 检查一个类是否满足特定的 interface
// extends继承其他类
class Sonar extends Animal implements Point, Point2 {
  ping() {
    console.log("ping!");
  }
}

//当 target >= ES2022 或 useDefineForClassFields 为 true 时，
//想为继承的字段重新声明更准确的类型时，会报错。通过 declare 表明这个字段声明不应该有运行时影响。
// abstract抽象类只能被继承不能实例化，类似interface接口
abstract class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // 子类的resident不必和父类的resident类型保持一致
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

## 工具类型

TypeScript 提供了几种工具类型来促进常见的类型转换。这些工具在全局作用域内可用。

- `Awaited<Type>`

此类型旨在对 async 函数中的 await 或 Promise 中的 .then() 方法等操作进行建模 - 具体来说，他们递归地解开 Promise 的方式。

```ts
type A = Awaited<Promise<string>>; //type A = string

type B = Awaited<Promise<Promise<number>>>; //type B = number

type C = Awaited<boolean | Promise<number>>; //type C = number | boolean
```

- `Partial<Type>`

构造一个将 Type 的所有属性设置为可选的类型。此工具将返回一个表示给定类型的所有子集的类型。

```ts
interface Todo {
  title: string;
  description: string;
}
type optionTodo = Partial<Todo>;
// 转变为：
type optionTodo = {
  title?: string;
  description?: string;
};
```

- `Required<Type>`

构造一个由设置为 required 的 Type 的所有属性组成的类型。与 Partial 相反。

```ts
interface Todo {
  title?: string;
  description?: string;
}
type optionTodo = Required<Todo>;
// 转变为：
type optionTodo = {
  title: string;
  description: string;
};
```

- `Readonly<Type>`
  构造一个将 Type 的所有属性设置为 readonly 的类型，这意味着构造类型的属性不能重新分配

```ts
interface Todo {
  title?: string;
  description?: string;
}
type optionTodo = Readonly<Todo>
// 转变为：
type optionTodo = {
  Readonly title:string;
  Readonly description:string
}
```

- `Record<Keys, Type>`
  构造一个对象类型，其属性键为 Keys，其属性值为 Type。此工具可用于将一种类型的属性映射到另一种类型。

```ts
type CatName = "miffy" | "boris" | "mordred";

interface CatInfo {
  age: number;
  breed: string;
}

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
```

- `Pick<Type, Keys>`

通过从 Type 中选取一组属性 Keys（字符串字面或字符串字面的并集）来构造一个类型。

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

- `Omit<Type, Keys>`

通过从 Type 中选择所有属性然后删除 Keys（字符串字面或字符串字面的并集）来构造一个类型。与 Pick 相反。

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};
```

- `Exclude<UnionType, ExcludedMembers>`

通过从 UnionType 中排除所有可分配给 ExcludedMembers 的联合成员来构造一个类型。

```ts
type T0 = Exclude<"a" | "b" | "c", "a">; //type T0 = "b" | "c"

//type T2 = string | number
type T2 = Exclude<string | number | (() => void), Function>;

type Shape = { kind: "circle"; radius: number } | { kind: "square"; x: number } | { kind: "triangle"; x: number; y: number };

type T3 = Exclude<Shape, { kind: "circle" }>;
type T3 =
  | {
      kind: "square";
      x: number;
    }
  | {
      kind: "triangle";
      x: number;
      y: number;
    };
```

- `Extract<Type, Union>`

通过从 Type 中提取所有可分配给 Union 的联合成员来构造一个类型。`Exclude<UnionType, ExcludedMembers>`相反

```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">; //type T0 = "a"

//type T1 = () => void
type T1 = Extract<string | number | (() => void), Function>;
```

- `NonNullable<Type>`

通过从 Type 中排除 null 和 undefined 来构造一个类型。

```ts
//type T0 = string | number
type T0 = NonNullable<string | number | undefined>;
```

- `Parameters<Type>`
  从函数类型 Type 的参数中使用的类型构造元组类型。

```ts
type T0 = Parameters<() => string>; //type T0 = []

type T1 = Parameters<(s: string) => void>; //type T1 = [s: string]

declare function f1(arg: { a: number; b: string }): void;
type T3 = Parameters<typeof f1>;
type T3 = [
  arg: {
    a: number;
    b: string;
  }
];
```

- `ConstructorParameters<Type>`

从构造函数类型的类型构造元组或数组类型。它生成一个包含所有参数类型的元组类型（如果 Type 不是函数，则生成类型 never）。

```ts
//type T0 = [message?: string]
type T0 = ConstructorParameters<ErrorConstructor>;

//type T1 = string[]
type T1 = ConstructorParameters<FunctionConstructor>;

//type T2 = [pattern: string | RegExp, flags?: string]
type T2 = ConstructorParameters<RegExpConstructor>;

class C {
  constructor(a: number, b: string) {}
}
//type T3 = [a: number, b: string]
type T3 = ConstructorParameters<typeof C>;
```

- `ReturnType<Type>`

构造一个由函数 Type 的返回类型组成的类型。

```ts
declare function f1(): { a: number; b: string };

type T4 = ReturnType<typeof f1>;

type T4 = {
  a: number;
  b: string;
};
```

- `InstanceType<Type>`

构造一个由 Type 中的构造函数的实例类型组成的类型。

```ts
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;

type T0 = C;
```

- `NoInfer<Type>`

阻止对所包含类型的推断。除了阻止推断之外，`NoInfer<Type>` 与 Type 相同。

```ts
function createStreetLight<C extends string>(colors: C[], defaultColor?: NoInfer<C>) {
  // ...
}
createStreetLight(["red", "yellow", "green"], "red"); // OK
createStreetLight(["red", "yellow", "green"], "blue"); // Error
```

- `ThisParameterType<Type>`

提取函数类型的 this 参数的类型，如果函数类型没有 this 参数，则提取 unknown。

```ts
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

- `OmitThisParameter<Type>`
  从 Type 中删除 this 参数。如果 Type 没有显式声明的 this 参数，则结果只是 Type。否则，将从 Type 创建一个没有 this 参数的新函数类型。泛型被删除，只有最后一个重载签名被传播到新的函数类型中。

```ts
function toHex(this: Number) {
  return this.toString(16);
}

// const fiveToHex:()=>string
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

- `ThisType<Type>`
  此工具不返回转换后的类型。相反，它用作上下文 this 类型的标记。请注意，必须启用 noImplicitThis 标志才能使用此工具。

```ts
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 }, //是D
  //methods作用域内上下文this的类型：this:D & M
  // 即{ x: number, y: number } & { moveBy(dx: number, dy: number)
  methods: {
    //是M
    moveBy(dx: number, dy: number) {
      this.x += dx;
      this.y += dy;
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

- `Uppercase<StringType>`转为大写
- `Lowercase<StringType>`转为小写
- `Capitalize<StringType>`首字母大写
- `Uncapitalize<StringType>`首字母小写

## 装饰器

**_装饰器_**:是一种特殊的声明，可以附加到 类声明、方法、accessor、属性 或 参数。装饰器使用 @expression 形式，其中 expression 必须评估为一个函数，该函数将在运行时调用，可以在不修改原始类的情况下更改、扩展类的功能。装饰器提供了一种为类声明和成员添加注释和元编程语法的方法。

要启用对装饰器的实验性支持，你必须在命令行或 tsconfig.json 中启用 experimentalDecorators 编译器选项：

```bash
tsc --target ES5 --experimentalDecorators
```

tsconfig.json：

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

装饰器函数大致这样：

```ts
function sealed(target) {
  // do something with 'target' ...
}
```

## 装饰器工厂

装饰器工厂只是一个函数，返回装饰器函数

> 多个装饰器工厂函数从上到下执行，但返回的装饰器函数却是从下到上执行

```ts
/**
 * 方法装饰器应用于方法的属性描述符，可用于观察、修改或替换方法定义
 * @target 静态成员的类的构造函数，或者实例成员的类的原型。
 * @propertyKey 成员的名称。
 * @descriptor 成员的属性描述符
 */
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}

/**
 * 访问器装饰器应用于访问器的属性描述符，可用于观察、修改或替换访问器的定义
 * @target 静态成员的类的构造函数，或者实例成员的类的原型。
 * @propertyKey 成员的名称。
 * @descriptor 成员的属性描述符
 */
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
 /**
  * 类装饰器应用于类的构造函数，可用于观察、修改或替换类定义
  * @constructor:类的构造函数
  */
 function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

/**
 * 属性装饰器的表达式将在运行时作为函数调用
 * @target 静态成员的类的构造函数，或者实例成员的类的原型。
 * @propertyKey 成员的名称。
 */
function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    descriptor.configurable = value;
  };
}

/**
 * 参数装饰器应用于类构造函数或方法声明的函数
 * @target 静态成员的类的构造函数，或者实例成员的类的原型。
 * @propertyKey 成员的名称。
 * @parameterIndex 函数参数列表中参数的序号索引。
 */
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  console.log(targent,propertyKey,parameterIndex)
}


@sealed  // 类装饰器
class ExampleClass {
  @format("Hello, %s") //属性装饰器工厂
  greeting: string;
  constructor(t: string) {
    this.title = t;
  }
   @configurable(false) // 访问装饰器工厂
  get x() {
    return this._x;
  }

  @first() // 多个方法装饰器工厂
  @second()
  method(@required name:stringr):string {
    return name //@required参数装饰器
  }
}

// 方法装饰器工厂函数输出值：
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

## 命名空间

“内部模块” 现在称为 “命名空间”。此外，在声明内部模块时使用 module 关键字的任何地方，都可以并且应该使用 namespace 关键字。这通过使用类似名称的术语使新用户重载来避免混淆新用户。使用方式：

Validation.ts：定义类型基类：

```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  // 命名空间嵌套命名空间
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}
// 同一个文件内，使用命名空间内的StringValidator接口
let validators: { [s: string]: Validation.StringValidator } = {};

// 使用import关键字，为指定符号创建别名
import polygons = Validation.Polygons;
// Same as 'new Validation.Polygons.Square()'
let sq = new polygons.Square();
```

LettersValidator.ts：引入基类的声明文件，并使用定义的接口

```ts
/// <reference path="Validation.ts" />

// reference它用作文件之间依赖的声明。引入同名命名空间，进行合并
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

Test.ts：同时引入两个类型定义文件

```ts
/// <reference path="Validation.ts" />
/// <reference path="LettersValidator.ts" />

// 引入两个同名命名空间，内容会合并
let validators: { [s: string]: Validation.StringValidator } = {};
validators["Letters only"] = new Validation.LettersOnlyValidator();
```

## 三斜杠指令

三斜杠指令是包含单个 XML 标记的单行注释。注释的内容用作编译器指令。

三斜杠指令仅在其包含文件的顶部有效。三斜杠指令前只能有单行或多行注释，包括其他三斜杠指令。如果在语句或声明之后遇到它们，它们将被视为常规单行注释，并且没有特殊含义。

如果指定了编译器标志 noResolve，则忽略三斜杠引用；它们既不会导致添加新文件，也不会更改所提供文件的顺序。

- `/// <reference path="..." />`

它用作文件之间依赖的声明，指示编译器在编译过程中包含其他文件。

- `/// <reference types="..." />`

与用作依赖声明的 `/// <reference path="..." />` 指令类似，`/// <reference types="..." />` 指令声明对包的依赖。

解析这些包名的过程类似于在 import 语句中解析模块名的过程。将三斜杠引用类型指令视为声明包的 import 的一种简单方法。

例如，在声明文件中包含 `/// <reference types="node" />` 声明该文件使用 @types/node/index.d.ts 中声明的名称；因此，这个包需要与声明文件一起包含在编译中。

> 仅当你手动创作 d.ts 文件时才使用这些指令。要在 .ts 文件中声明对 @types 包的依赖，请在命令行或 tsconfig.json 中使用 types。

- `/// <reference lib="..." />`

该指令允许文件显式包含现有的内置 lib 文件。

内置 lib 文件的引用方式与 tsconfig.json 中的 lib 编译器选项相同（例如，使用 lib="es2015" 而不是 lib="lib.es2015.d.ts" 等）。

对于依赖内置类型的声明文件作者，例如建议使用 DOM API 或内置 JS 运行时构造函数，如 Symbol 或 Iterable，三斜杠引用 lib 指令。以前这些 .d.ts 文件必须添加此类类型的前向/重复声明。

例如，将 `/// <reference lib="es2017.string" />` 添加到编译中的某个文件中，相当于使用 --lib es2017.string 进行编译。

- `/// <reference no-default-lib="true" />`

该指令将文件标记为默认库。你将在 lib.d.ts 及其不同变体的顶部看到此注释。

该指令指示编译器不在编译中包含默认库（即 lib.d.ts）。这里的影响类似于在命令行中传递 noLib。

另请注意，当传递 skipDefaultLibCheck 时，编译器只会跳过检查具有 `/// <reference no-default-lib="true"/>` 的文件。

- `/// <amd-module />`

默认情况下，AMD 模块是匿名生成的。当使用其他工具来处理生成的模块时，这可能会导致问题，例如打包器（例如 r.js）。

amd-module 指令允许将可选模块名称传递给编译器：`/// <amd-module name="NamedModule"/>`

例如，将 `/// <reference lib="es2017.string" />` 添加到编译中的某个文件中，相当于使用 --lib es2017.string 进行编译。

## tsconfig.json

tsconfig.json 文件指定编译项目所需的根文件和编译器选项。作用类似 JavaScript 项目的 jsconfig.json 文件

```json
{
  "extends": "@tsconfig/node12/tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
  "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "emitter.ts",
    "program.ts",
    "commandLineParser.ts",
    "tsc.ts",
    "diagnosticInformationMap.generated.ts"
  ]
}
```
