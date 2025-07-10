---
title: TypeScript 开发指南
description: TypeScript 完整开发指南，包含类型系统、泛型、接口、高级类型、装饰器等核心特性
outline: deep
---

# 🔷 TypeScript 开发指南

TypeScript 是 JavaScript 的超集，兼容 JavaScript 所有语法的基础上，支持使用 JavaScript 的最新语法，还扩展了很多其他功能，并且添加了类型标注、类型推断、类型验证功能，也有了更好的语法提示。TypeScript 在编译阶段就可以抛出一些容易被 JavaScript 忽略的错误，提升了代码健壮性。

::: tip 📖 本章内容
掌握 TypeScript 的类型系统、高级特性和最佳实践，提升代码质量和开发效率。
:::

## 1. 概述

### 1.1 什么是 TypeScript

TypeScript 是 Microsoft 开发的一门编程语言，它是 JavaScript 的超集，为 JavaScript 添加了静态类型定义。TypeScript 代码需要编译成 JavaScript 代码才能在浏览器或 Node.js 环境中运行。

### 1.2 核心特性

| 特性 | 描述 | 优势 |
|------|------|------|
| **静态类型检查** | 编译时类型验证 | 提前发现错误，提高代码质量 |
| **类型推断** | 自动推断变量类型 | 减少显式类型声明，提高开发效率 |
| **IDE 支持** | 强大的智能提示 | 更好的开发体验和代码补全 |
| **现代语法** | 支持最新 ES 特性 | 使用先进的 JavaScript 功能 |
| **渐进式采用** | 兼容现有 JavaScript | 可以逐步迁移现有项目 |

### 1.3 环境搭建

```bash
# 全局安装 TypeScript
npm install -g typescript

# 检查版本
tsc --version

# 编译 TypeScript 文件
tsc hello.ts

# 初始化 TypeScript 项目
tsc --init

# 使用 ts-node 直接运行 TypeScript
npm install -g ts-node
ts-node hello.ts
```

## 2. 基础类型

### 2.1 原始类型

#### 基本原始类型

```typescript
// 字符串类型
let name: string = "张进喜";
let message: string = `Hello, ${name}!`;

// 数字类型
let age: number = 25;
let price: number = 99.99;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// 布尔类型
let isActive: boolean = true;
let isComplete: boolean = false;

// 大整数类型
const bigNumber: bigint = BigInt(100);
const anotherBig: bigint = 100n;

// 符号类型
const id: symbol = Symbol("id");
const anotherId: symbol = Symbol("id");
console.log(id === anotherId); // false
```

#### 特殊类型

```typescript
// any 类型 - 任何类型（不推荐使用）
let value: any = 42;
value = "hello";
value = true;

// unknown 类型 - 类型安全的 any
let userInput: unknown;
userInput = 5;
userInput = "hello";

// 使用 unknown 需要类型检查
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase());
}

// void 类型 - 无返回值
function logMessage(message: string): void {
  console.log(message);
}

// never 类型 - 永不返回
function throwError(message: string): never {
  throw new Error(message);
}

// null 和 undefined
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// 严格空值检查
function doSomething(x: string | null) {
  if (x === null) {
    console.log("Value is null");
  } else {
    console.log(x.toUpperCase());
  }
}

// 非空断言操作符
function liveDangerously(x?: number | null) {
  console.log(x!.toFixed()); // 断言 x 不为 null 或 undefined
}
```

### 2.2 数组和元组

#### 数组类型

```typescript
// 数组类型的两种声明方式
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ["hello", "world"];

// 联合类型数组
let mixed: (number | string)[] = [1, "hello", 2, "world"];

// 只读数组
let readonlyNumbers: readonly number[] = [1, 2, 3];
let readonlyStrings: ReadonlyArray<string> = ["a", "b", "c"];

// 多维数组
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
```

#### 元组类型

```typescript
// 基本元组
let person: [string, number] = ["张进喜", 25];

// 可选元素
let optional: [string, number?] = ["hello"];

// 剩余元素
let rest: [string, ...number[]] = ["hello", 1, 2, 3];

// 只读元组
type StringNumberBooleans = readonly [string, number, ...boolean[]];
const tuple: StringNumberBooleans = ["world", 3, true, false, true];

// 命名元组
type Range = [start: number, end: number];
let range: Range = [0, 100];

// 元组解构
let [name, age] = person;
console.log(`姓名: ${name}, 年龄: ${age}`);
```

### 2.3 枚举类型

```typescript
// 数字枚举
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

console.log(Direction.Up);    // 1
console.log(Direction.Down);  // 2
console.log(Direction[1]);    // "Up"

// 字符串枚举
enum Color {
  Red = "#ff0000",
  Green = "#00ff00",
  Blue = "#0000ff"
}

// 常量枚举（编译时内联）
const enum Sizes {
  Small = "S",
  Medium = "M",
  Large = "L"
}

// 计算成员
enum FileAccess {
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write
}

// 反向映射
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

// 使用枚举
function setDirection(dir: Direction) {
  console.log(`Moving ${Direction[dir]}`);
}

setDirection(Direction.Up);
```

## 3. 函数类型

### 3.1 函数声明和表达式

```typescript
// 函数声明
function add(x: number, y: number): number {
  return x + y;
}

// 函数表达式
const multiply = function(x: number, y: number): number {
  return x * y;
};

// 箭头函数
const divide = (x: number, y: number): number => x / y;

// 函数类型
type MathOperation = (x: number, y: number) => number;

const subtract: MathOperation = (x, y) => x - y;
```

### 3.2 参数类型

```typescript
// 可选参数
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

// 默认参数
function createUser(name: string, age: number = 18): object {
  return { name, age };
}

// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// 参数解构
function printUser({ name, age }: { name: string; age: number }): void {
  console.log(`Name: ${name}, Age: ${age}`);
}

// 函数重载
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: any, b: any): any {
  return a + b;
}

console.log(combine("Hello, ", "World"));  // "Hello, World"
console.log(combine(1, 2));                // 3
```

### 3.3 高级函数类型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("hello");
let output2 = identity(42); // 类型推断

// 约束泛型
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello");     // ✓
logLength([1, 2, 3]);   // ✓
// logLength(123);      // ✗ Error

// 条件类型和工具类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 异步函数
async function fetchData(): Promise<string> {
  return "data";
}

// 回调函数类型
type EventCallback<T> = (event: T) => void;

function addEventListener<T>(
  event: string, 
  callback: EventCallback<T>
): void {
  // 实现...
}
```

## 4. 对象类型

### 4.1 对象类型声明

```typescript
// 对象类型
let user: {
  name: string;
  age: number;
  isActive?: boolean;  // 可选属性
  readonly id: number; // 只读属性
} = {
  name: "张进喜",
  age: 25,
  id: 1
};

// 索引签名
interface StringDictionary {
  [key: string]: string;
}

interface NumberArray {
  [index: number]: number;
}

// 混合类型
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function createCounter(): Counter {
  let counter = function(start: number) {
    return `Started at ${start}`;
  } as Counter;
  
  counter.interval = 123;
  counter.reset = function() { /* reset logic */ };
  
  return counter;
}
```

### 4.2 接口定义

```typescript
// 基本接口
interface Person {
  readonly id: number;
  name: string;
  age: number;
  email?: string;
}

// 继承接口
interface Employee extends Person {
  employeeId: string;
  department: string;
  salary: number;
}

// 多重继承
interface Developer extends Employee {
  skills: string[];
  level: 'junior' | 'senior' | 'lead';
}

// 泛型接口
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

interface User {
  id: number;
  name: string;
}

let userResponse: ApiResponse<User> = {
  data: { id: 1, name: "张进喜" },
  message: "Success",
  status: 200
};

// 函数接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(src, sub) {
  return src.search(sub) > -1;
};
```

## 5. 联合和交叉类型

### 5.1 联合类型

```typescript
// 基本联合类型
let value: string | number = "hello";
value = 42; // ✓

// 联合类型的类型守卫
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

// 字面量类型联合
type Theme = "light" | "dark" | "auto";
type Size = "small" | "medium" | "large";

function setTheme(theme: Theme): void {
  document.body.className = theme;
}

// 可辨识联合
interface Square {
  kind: "square";
  size: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      return shape.size * shape.size;
    case "rectangle":
      return shape.width * shape.height;
    case "circle":
      return Math.PI * shape.radius ** 2;
    default:
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
  }
}
```

### 5.2 交叉类型

```typescript
// 基本交叉类型
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;

let cc: ColorfulCircle = {
  color: "red",
  radius: 42
};

// 混入（Mixin）模式
class Timestamped {
  timestamp = Date.now();
}

class Tagged {
  tag = "default";
}

// 混入函数
function extend<T, U>(first: T, second: U): T & U {
  const result = {} as T & U;
  for (const prop in first) {
    if (first.hasOwnProperty(prop)) {
      (result as T)[prop] = first[prop];
    }
  }
  for (const prop in second) {
    if (second.hasOwnProperty(prop)) {
      (result as U)[prop] = second[prop];
    }
  }
  return result;
}

const mixed = extend(new Timestamped(), new Tagged());
console.log(mixed.timestamp, mixed.tag);
```

## 6. 泛型

### 6.1 泛型基础

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

let myIdentity: GenericIdentityFn<number> = identity;

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
  
  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
let stringNumeric = new GenericNumber<string>("", (x, y) => x + y);
```

### 6.2 泛型约束

```typescript
// 基本约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 在泛型约束中使用类型参数
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

let person = { name: "张进喜", age: 25, city: "北京" };
let name = getProperty(person, "name");
let age = getProperty(person, "age");

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;
type Flatten<T> = T extends any[] ? T[number] : T;

// 映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 实用工具类型
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
type TodoUpdate = Partial<Todo>;
type TodoRequired = Required<Todo>;
```

## 7. 类和继承

### 7.1 类的基本语法

```typescript
// 基本类定义
class Animal {
  // 属性声明
  private _name: string;
  protected age: number;
  public species: string;
  
  // 构造函数
  constructor(name: string, age: number, species: string) {
    this._name = name;
    this.age = age;
    this.species = species;
  }
  
  // 方法
  public getName(): string {
    return this._name;
  }
  
  protected getAge(): number {
    return this.age;
  }
  
  // 静态方法
  static createDog(name: string, age: number): Animal {
    return new Animal(name, age, "Dog");
  }
  
  // getter/setter
  get name(): string {
    return this._name;
  }
  
  set name(value: string) {
    if (value.length > 0) {
      this._name = value;
    }
  }
}

// 继承
class Dog extends Animal {
  private breed: string;
  
  constructor(name: string, age: number, breed: string) {
    super(name, age, "Dog");
    this.breed = breed;
  }
  
  public bark(): string {
    return `${this.getName()} says woof!`;
  }
  
  // 重写方法
  public getName(): string {
    return `Dog: ${super.getName()}`;
  }
}
```

### 7.2 抽象类和接口实现

```typescript
// 抽象类
abstract class Shape {
  abstract getArea(): number;
  
  protected displayInfo(): void {
    console.log(`Area: ${this.getArea()}`);
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }
  
  getArea(): number {
    return this.width * this.height;
  }
}

// 接口实现
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Duck implements Flyable, Swimmable {
  fly(): void {
    console.log("Duck is flying");
  }
  
  swim(): void {
    console.log("Duck is swimming");
  }
}

// 类实现接口
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  
  setTime(d: Date) {
    this.currentTime = d;
  }
  
  constructor(h: number, m: number) {
    // 构造逻辑
  }
}
```

## 8. 模块系统

### 8.1 模块导出和导入

```typescript
// math.ts - 命名导出
export function add(x: number, y: number): number {
  return x + y;
}

export function subtract(x: number, y: number): number {
  return x - y;
}

export const PI = 3.14159;

// 默认导出
export default function multiply(x: number, y: number): number {
  return x * y;
}

// calculator.ts - 导入使用
import multiply, { add, subtract, PI } from './math';
import * as math from './math';

console.log(add(1, 2));
console.log(multiply(3, 4));
console.log(math.PI);

// 重新导出
export { add as addition } from './math';
export * from './math';

// 动态导入
async function loadMath() {
  const mathModule = await import('./math');
  return mathModule.add(1, 2);
}
```

### 8.2 命名空间

```typescript
// 命名空间定义
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  
  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;
  
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
  
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}

// 使用命名空间
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// 多文件命名空间
/// <reference path="Validation.ts" />
namespace Validation {
  export class NumberValidator implements StringValidator {
    isAcceptable(s: string) {
      return /^[0-9]+$/.test(s);
    }
  }
}
```

## 9. 高级类型

### 9.1 类型操作符

```typescript
// keyof 操作符
interface Person {
  name: string;
  age: number;
  location: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "location"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// typeof 操作符
let person = {
  name: "张进喜",
  age: 25
};

type PersonType = typeof person; // { name: string; age: number; }

// in 操作符
type Keys = "a" | "b" | "c";

type Obj = {
  [K in Keys]: string;
}; // { a: string; b: string; c: string; }

// 条件类型
type TypeName<T> = 
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T1 = TypeName<string>;    // "string"
type T2 = TypeName<number>;    // "number"
type T3 = TypeName<boolean>;   // "boolean"
```

### 9.2 实用工具类型

```typescript
// 内置工具类型示例
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - 所有属性可选
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

// Required - 所有属性必需
type RequiredUser = Required<PartialUser>;

// Pick - 选择特定属性
type UserPreview = Pick<User, "name" | "email">;
// { name: string; email: string; }

// Omit - 排除特定属性
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; age: number; }

// Record - 创建记录类型
type UserRoles = Record<string, User>;
// { [key: string]: User; }

// Exclude 和 Extract
type T1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T2 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// ReturnType - 获取函数返回类型
function createUser(): User {
  return { id: 1, name: "张进喜", email: "zhang@example.com", age: 25 };
}

type UserReturnType = ReturnType<typeof createUser>; // User

// Parameters - 获取函数参数类型
type CreateUserParams = Parameters<typeof createUser>; // []
```

## 10. 装饰器

### 10.1 类装饰器

```typescript
// 启用装饰器支持需要在 tsconfig.json 中设置
// "experimentalDecorators": true

// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  greet() {
    return `Hello, ${this.greeting}`;
  }
}

// 装饰器工厂
function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

@classDecorator
class MyClass {
  property = "property";
  hello: string;
  
  constructor(m: string) {
    this.hello = m;
  }
}
```

### 10.2 方法和属性装饰器

```typescript
// 方法装饰器
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

// 属性装饰器
function format(formatString: string) {
  return function (target: any, propertyKey: string): any {
    let value = target[propertyKey];
    
    const getter = () => {
      return `${formatString} ${value}`;
    };
    
    const setter = (newVal: string) => {
      value = newVal;
    };
    
    return {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    };
  };
}

class Person {
  @format("Hello")
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  @enumerable(false)
  greet() {
    return `Hello, ${this.name}`;
  }
}

// 参数装饰器
function required(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Required parameter in ${propertyKey} at index ${parameterIndex}`);
}

class Calculator {
  add(@required x: number, @required y: number): number {
    return x + y;
  }
}
```

## 11. 配置和最佳实践

### 11.1 TypeScript 配置

```json
// tsconfig.json 配置示例
{
  "compilerOptions": {
    // 基本选项
    "target": "ES2020",                    // 编译目标
    "module": "commonjs",                  // 模块系统
    "lib": ["ES2020", "DOM"],             // 包含的库文件
    "outDir": "./dist",                    // 输出目录
    "rootDir": "./src",                    // 源文件根目录
    
    // 严格类型检查选项
    "strict": true,                        // 启用所有严格类型检查
    "noImplicitAny": true,                // 禁止隐式 any
    "strictNullChecks": true,             // 严格空值检查
    "strictFunctionTypes": true,          // 严格函数类型
    "noImplicitReturns": true,            // 禁止隐式返回
    "noImplicitThis": true,               // 禁止隐式 this
    
    // 模块解析选项
    "moduleResolution": "node",           // 模块解析策略
    "baseUrl": "./",                      // 基础路径
    "paths": {                            // 路径映射
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    },
    "esModuleInterop": true,              // ES 模块互操作
    "allowSyntheticDefaultImports": true, // 允许合成默认导入
    
    // 其他选项
    "experimentalDecorators": true,       // 实验性装饰器
    "emitDecoratorMetadata": true,        // 装饰器元数据
    "skipLibCheck": true,                 // 跳过库文件检查
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致
    "declaration": true,                  // 生成声明文件
    "sourceMap": true                     // 生成源映射
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

### 11.2 类型声明文件

```typescript
// types/global.d.ts - 全局类型声明
declare global {
  interface Window {
    myGlobalFunction: () => void;
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
    }
  }
}

// 模块声明
declare module "*.vue" {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 第三方库声明
declare module "my-library" {
  export function doSomething(param: string): number;
  export interface MyInterface {
    prop: string;
  }
}

// 环境声明
declare const API_URL: string;
declare function gtag(command: string, ...args: any[]): void;
```

### 11.3 最佳实践

```typescript
// 1. 使用明确的类型而不是 any
// ❌ 不好
function processData(data: any): any {
  return data.toString();
}

// ✅ 更好
function processData(data: string | number): string {
  return data.toString();
}

// 2. 使用类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    // 这里 TypeScript 知道 value 是 string
    console.log(value.toUpperCase());
  }
}

// 3. 利用工具类型
interface ApiConfig {
  url: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

// 创建部分配置
function createConfig(config: Partial<ApiConfig>): ApiConfig {
  return {
    url: 'http://localhost',
    timeout: 5000,
    retries: 3,
    headers: {},
    ...config
  };
}

// 4. 使用断言函数
function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error('Expected number');
  }
}

function calculate(input: unknown) {
  assertIsNumber(input);
  // TypeScript 现在知道 input 是 number
  return input * 2;
}

// 5. 品牌类型（Branded Types）
type UserId = string & { readonly brand: unique symbol };
type EmailAddress = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createEmail(email: string): EmailAddress {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  return email as EmailAddress;
}

// 这样可以防止类型混淆
function sendEmail(userId: UserId, email: EmailAddress) {
  // 实现...
}

// sendEmail(createEmail('test@example.com'), createUserId('123')); // ❌ 类型错误
```

## 12. 与 React 集成

### 12.1 React 组件类型

```typescript
import React, { FC, ReactNode, useState, useEffect } from 'react';

// 函数组件 Props 类型
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

// Hook 类型
interface User {
  id: number;
  name: string;
  email: string;
}

function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const userData: User = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);
  
  return { user, loading, error };
}

// 事件处理类型
interface FormProps {
  onSubmit: (data: { name: string; email: string }) => void;
}

const ContactForm: FC<FormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, email });
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={name} 
        onChange={handleNameChange}
        placeholder="姓名" 
      />
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="邮箱" 
      />
      <Button onClick={() => {}}>提交</Button>
    </form>
  );
};
```

## 13. 调试和测试

### 13.1 类型调试

```typescript
// 类型调试工具
type Debug<T> = { [K in keyof T]: T[K] };

// 展开复杂类型
type ComplexType = Debug<Pick<User, 'name' | 'email'> & { age: number }>;

// 条件类型调试
type IsString<T> = T extends string ? true : false;
type Test1 = IsString<string>;  // true
type Test2 = IsString<number>;  // false

// 使用注释来理解类型
interface ApiResponse<T> {
  data: T;
  // ^? T 是什么类型？
  status: number;
  message: string;
}

// 类型断言调试
function assertType<T>(_value: T): void {
  // 这个函数在运行时什么都不做，但可以帮助验证类型
}

const user = { name: "张进喜", age: 25 };
assertType<{ name: string; age: number }>(user); // 验证类型是否正确
```

### 13.2 单元测试

```typescript
// 使用 Jest 和 TypeScript
import { add, User } from './math';

describe('Math functions', () => {
  test('add function should return correct sum', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });
  
  test('should handle edge cases', () => {
    expect(add(0, 0)).toBe(0);
    expect(add(Number.MAX_VALUE, 1)).toBeGreaterThan(Number.MAX_VALUE);
  });
});

// 类型安全的模拟
interface UserService {
  getUser(id: number): Promise<User>;
  createUser(userData: Omit<User, 'id'>): Promise<User>;
}

const mockUserService: jest.Mocked<UserService> = {
  getUser: jest.fn(),
  createUser: jest.fn(),
};

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should get user by id', async () => {
    const expectedUser: User = { id: 1, name: '张进喜', email: 'zhang@example.com' };
    mockUserService.getUser.mockResolvedValue(expectedUser);
    
    const user = await mockUserService.getUser(1);
    
    expect(user).toEqual(expectedUser);
    expect(mockUserService.getUser).toHaveBeenCalledWith(1);
  });
});
```

## 14. 参考资料

### 14.1 官方文档
- [TypeScript 官方网站](https://www.typescriptlang.org/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [TypeScript 发布说明](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)

### 14.2 学习资源
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### 14.3 工具和库
- [ts-node](https://github.com/TypeStrong/ts-node) - 直接运行 TypeScript
- [tsc-watch](https://github.com/gilamran/tsc-watch) - TypeScript 编译器监视模式
- [typescript-eslint](https://typescript-eslint.io/) - TypeScript ESLint 规则

### 14.4 社区资源
- [Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped) - 第三方库类型定义
- [TypeScript Community Discord](https://discord.gg/typescript)
- [r/typescript](https://www.reddit.com/r/typescript/) - Reddit 社区 