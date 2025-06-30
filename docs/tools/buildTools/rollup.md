---
title: 🎯 Rollup 模块打包工具完全指南
description: Rollup 是专注于 ES 模块的 JavaScript 打包工具，提供高效的 Tree Shaking 和优化的输出
outline: deep
---

# 🎯 Rollup 模块打包工具完全指南

> Rollup 是一个用于 JavaScript 的模块打包工具，它将小的代码片段编译成更大、更复杂的代码，例如库或应用程序。它使用 JavaScript 的 ES6 版本中包含的新标准化代码模块格式，而不是以前的 CommonJS 和 AMD 等特殊解决方案。

## 📖 概述

### ✨ 核心特性

| 特性 | 描述 | 优势 |
|------|------|------|
| 🌳 **Tree Shaking** | 自动移除未使用的代码 | 更小的 bundle 体积 |
| 📦 **ES 模块优先** | 原生支持 ES 模块 | 更好的标准化支持 |
| 🎯 **专注库构建** | 特别适合构建库 | 输出更干净的代码 |
| 🔧 **插件系统** | 丰富的插件生态 | 高度可扩展 |
| 📊 **多格式输出** | 支持多种模块格式 | 兼容各种环境 |
| ⚡ **高性能** | 快速的构建速度 | 提升开发效率 |

### 🏗️ 技术优势

ES 模块允许你自由无缝地组合你最喜欢的库中最有用的个别函数。这在未来将在所有场景原生支持，但 Rollup 让你今天就可以开始这样做。

::: tip 💡 为什么选择 Rollup？
- **更好的 Tree Shaking**: 基于 ES 模块的静态分析
- **更小的输出**: 没有多余的运行时代码
- **标准化**: 遵循 ES 模块标准
- **库友好**: 特别适合构建可重用的库
:::

### 🔗 与其他工具的关系

Vite 目前打包生产环境代码，用的就是 Rollup。这证明了 Rollup 在现代前端工具链中的重要地位。

## 🚀 快速开始

### 📦 安装 Rollup

```bash
# 全局安装
npm install --global rollup

# 项目内安装（推荐）
npm install --save-dev rollup

# 使用 yarn
yarn add -D rollup

# 使用 pnpm
pnpm add -D rollup
```

### 🛠️ 基础使用

安装完成后，通常会在 `package.json` 中添加一个单一的构建脚本，为所有贡献者提供方便的命令：

```json
{
  "scripts": {
    "build": "rollup --config rollup.config.js",
    "dev": "rollup --config rollup.config.js --watch",
    "build:prod": "rollup --config rollup.config.prod.js"
  }
}
```

### 🎯 命令行使用

```bash
# 基础打包
rollup src/main.js --output.file bundle.js --output.format cjs

# 使用配置文件
rollup --config

# 监听模式
rollup --config --watch

# 指定环境
rollup --config --environment NODE_ENV:production
```

## ⚙️ 配置文件详解

### 📝 完整配置示例

创建 `rollup.config.js` 文件：

```javascript
// 对于 Node 18.20+，你可以使用导入断言
import pkg from './package.json' with { type: 'json' };
// ES Module 不能使用 __dirname。fileURLToPath 代替
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { globSync } from 'glob';
// 用于类型提示
import type { RollupOptions } from 'rollup';

// Rollup 不会自动从 node_modules 中寻找依赖项，需要这个插件的支持
import resolve from '@rollup/plugin-node-resolve';
// 支持 CommonJS 模块
import commonjs from '@rollup/plugin-commonjs';
// 使支持最新 js 语法
import babel from '@rollup/plugin-babel';
// 压缩 js 插件
import terser from '@rollup/plugin-terser';
// TypeScript 支持
import typescript from '@rollup/plugin-typescript';
// CSS 处理
import postcss from 'rollup-plugin-postcss';
// 复制文件
import copy from 'rollup-plugin-copy';
// 替换环境变量
import replace from '@rollup/plugin-replace';
// JSON 支持
import json from '@rollup/plugin-json';

export default (commandLineArgs) => {
	const inputBase = commandLineArgs.input || 'src/main.js';
	const isProduction = process.env.NODE_ENV === 'production';

	// 这会使 Rollup 忽略 CLI 参数
	delete commandLineArgs.input;
	
	return {
		// 核心输入选项
		
		// 指出哪些模块应该视为外部模块
		external: [
			// 文件路径
			fileURLToPath(new URL('src/some-file.js', import.meta.url)),
			// 包名
			'lodash',
			// 正则表达式
			/^lodash/,
			// 函数判断
			(id) => /^react/.test(id)
		],
		
		// 指定项目入口
		input: {
			// 单入口
			main: 'src/main.js',
			// 多入口：把每个匹配的文件作为入口
			...Object.fromEntries(
				globSync('src/modules/*.js').map(file => [
					// 这里将删除 `src/` 以及每个文件的扩展名
					// 因此，例如 src/modules/foo.js 会变成 modules/foo
					path.relative(
						'src',
						file.slice(0, file.length - path.extname(file).length)
					),
					// 这里可以将相对路径扩展为绝对路径
					fileURLToPath(new URL(file, import.meta.url))
				])
			)
		},
		
		// 引入插件
		plugins: [
			// JSON 支持
			json(),
			
			// 解析 node_modules 中的模块
			resolve({
				browser: true,
				preferBuiltins: false,
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			}),
			
			// 支持 CommonJS
			commonjs({
				include: 'node_modules/**'
			}),
			
			// TypeScript 支持
			typescript({
				tsconfig: './tsconfig.json',
				declaration: true,
				declarationDir: 'dist/types'
			}),
			
			// Babel 转换
			babel({
				babelHelpers: 'bundled',
				exclude: 'node_modules/**',
				presets: [
					['@babel/preset-env', {
						targets: {
							browsers: ['last 2 versions', '> 1%']
						}
					}],
					'@babel/preset-react'
				],
				plugins: [
					'@babel/plugin-proposal-class-properties'
				]
			}),
			
			// CSS 处理
			postcss({
				extract: true,
				minimize: isProduction,
				plugins: [
					require('autoprefixer'),
					require('cssnano')
				]
			}),
			
			// 环境变量替换
			replace({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				preventAssignment: true
			}),
			
			// 复制静态资源
			copy({
				targets: [
					{ src: 'src/assets/**/*', dest: 'dist/assets' }
				]
			}),
			
			// 生产环境压缩
			isProduction && terser({
				compress: {
					drop_console: true,
					drop_debugger: true
				}
			})
		].filter(Boolean),
		
		// JSX 配置
		jsx: {
			preset: 'react',
			importSource: 'preact',
			factory: 'h'
		},

		// 进阶输入选项
		cache: true, // 缓存编译的结果，只会对变化的模块重新编译
		logLevel: 'info', // 日志等级: 'info' | 'warn' | 'silent'
		// 外部依赖的绝对路径是否应该在输出中转换为相对路径
		makeAbsoluteExternalsRelative: true,
		maxParallelFileOps: 20, // 并发数
		// 一个用于截取日志信息的函数
		onLog(level, log, handler) {
			if (log.code === 'CIRCULAR_DEPENDENCY') return;
			handler(level, log);
		},
		// 用于拦截警告信息
		onwarn(warning, warn) {
			if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
			warn(warning);
		},
		preserveEntrySignatures: 'strict',
		strictDeprecations: false,

		// 危险区域
		context: 'window',
		moduleContext: {
			'some-module': 'window'
		},
		preserveSymlinks: false,
		shimMissingExports: false,
		treeshake: {
			moduleSideEffects: false,
			propertyReadSideEffects: false,
			tryCatchDeoptimization: false
		},

		// 实验性
		experimentalCacheExpiry: 10,
		experimentalLogSideEffects: false,
		experimentalMinChunkSize: 0,
		perf: false,

		// 配置文件输出。必需（可以是数组，用于描述多个输出）
		output: [
			// ES 模块输出
			{
				file: pkg.module,
				format: 'es',
				sourcemap: true
			},
			// CommonJS 输出
			{
				file: pkg.main,
				format: 'cjs',
				sourcemap: true,
				exports: 'named'
			},
			// UMD 输出
			{
				file: pkg.browser,
				format: 'umd',
				name: 'MyLibrary',
				sourcemap: true,
				globals: {
					'react': 'React',
					'react-dom': 'ReactDOM'
				}
			}
		],

		// 监听配置
		watch: {
			buildDelay: 0,
			chokidar: {
				usePolling: false
			},
			clearScreen: true,
			exclude: 'node_modules/**',
			include: 'src/**',
			skipWrite: false
		}
	};
};
```

### 🎯 输出格式详解

```javascript
export default {
	input: 'src/main.js',
	output: [
		// AMD 格式
		{
			file: 'dist/bundle.amd.js',
			format: 'amd'
		},
		// CommonJS 格式
		{
			file: 'dist/bundle.cjs.js',
			format: 'cjs',
			exports: 'named'
		},
		// ES 模块格式
		{
			file: 'dist/bundle.esm.js',
			format: 'es'
		},
		// IIFE 格式（立即执行函数）
		{
			file: 'dist/bundle.iife.js',
			format: 'iife',
			name: 'MyBundle'
		},
		// UMD 格式（通用模块定义）
		{
			file: 'dist/bundle.umd.js',
			format: 'umd',
			name: 'MyBundle',
			globals: {
				'lodash': '_'
			}
		},
		// SystemJS 格式
		{
			file: 'dist/bundle.system.js',
			format: 'system'
		}
	]
};
```

### 🔧 高级输出配置

```javascript
export default {
	input: 'src/main.js',
	output: {
		// 核心输出选项
		dir: 'dist', // 输出目录
		file: 'dist/bundle.js', // 输出的文件，只有一个chunk时可用
		format: 'es', // 生成bundle的格式
		// 用于在 umd / iife bundle 中，使用 id: variableName 键值对指定外部依赖
		globals: {
			jquery: '$',
			lodash: '_'
		},
		name: 'MyLibrary', // 输出格式为 iife / umd 的 bundle 的全局变量名
		plugins: [terser()], // 指定输出插件

		// 进阶输出选项
		// 自定义构建结果中的静态资源名称
		assetFileNames: "assets/[name]-[hash][extname]",
		// 在 bundle 前添加一个字符串
		banner: '/* My Library v1.0.0 */',
		// 在 bundle 后添加一个字符串
		footer: '/* End of bundle */',
		// 对代码分割中产生的 chunk 自定义命名
		chunkFileNames: "[name]-[hash].js",
		compact: false, // 用于压缩 Rollup 产生的额外代码
		dynamicImportInCjs: true,
		entryFileNames: "[name].js", // 用于指定 chunks 的入口文件模式
		extend: false, // 指定是否扩展 umd 或 iife 格式中 name 选项定义的全局变量
		externalImportAttributes: true, // 是否在输出中为外部引入添加导入属性
		generatedCode: 'es2015', // 使用哪些语言特性: 'es5' | 'es2015' | {}
		hashCharacters: 'base64',
		hoistTransitiveImports: true,
		importAttributesKey: 'with',
		inlineDynamicImports: false, // 内联动态引入，而不是用于创建包含新 chunk 的独立 bundle
		interop: 'auto',
		intro: '/* Intro comment */',
		// 手动进行代码分割
		manualChunks: {
			lodash: ['lodash'],
			react: ['react', 'react-dom']
		},
		// 内部变量导出为单个字母的变量，以便更好地压缩代码
		minifyInternalExports: true,
		outro: '/* Outro comment */',
		// 将外部依赖 ID 映射为路径，路径会取代模块 ID，在生成的 bundle 中使用
		paths: {
			'd3': 'https://d3js.org/d3.v4.min.js'
		},
		// 该选项将使用原始模块名作为文件名，为所有模块创建单独的 chunk
		preserveModules: false,
		preserveModulesRoot: 'src',
		sourcemap: true,
		sourcemapBaseUrl: 'https://example.com/',
		sourcemapDebugIds: false,
		sourcemapExcludeSources: false,
		sourcemapFile: 'bundle.js.map',
		sourcemapFileNames: '[name].js.map',
		sourcemapIgnoreList: (relativeSourcePath) => relativeSourcePath.includes('node_modules'),
		sourcemapPathTransform: (relativeSourcePath) => relativeSourcePath,
		validate: false,

		// 危险区域
		amd: {
			id: 'myBundle'
		},
		esModule: true,
		exports: 'auto',
		externalLiveBindings: true,
		freeze: true,
		indent: '  ',
		noConflict: false,
		sanitizeFileName: (name) => name.replace(/[<>:"/\\|?*]/g, '_'),
		strict: true,
		systemNullSetters: false,

		// 实验性
		experimentalMinChunkSize: 0
	}
};
```

## 🔌 插件生态

### 📝 官方插件

| 插件 | 用途 | 安装命令 |
|------|------|----------|
| **@rollup/plugin-node-resolve** | 解析 node_modules | `npm i -D @rollup/plugin-node-resolve` |
| **@rollup/plugin-commonjs** | 支持 CommonJS | `npm i -D @rollup/plugin-commonjs` |
| **@rollup/plugin-babel** | Babel 转换 | `npm i -D @rollup/plugin-babel` |
| **@rollup/plugin-typescript** | TypeScript 支持 | `npm i -D @rollup/plugin-typescript` |
| **@rollup/plugin-json** | JSON 文件支持 | `npm i -D @rollup/plugin-json` |
| **@rollup/plugin-replace** | 字符串替换 | `npm i -D @rollup/plugin-replace` |
| **@rollup/plugin-terser** | 代码压缩 | `npm i -D @rollup/plugin-terser` |

### 🎨 社区插件

| 插件 | 用途 | 安装命令 |
|------|------|----------|
| **rollup-plugin-postcss** | CSS 处理 | `npm i -D rollup-plugin-postcss` |
| **rollup-plugin-copy** | 文件复制 | `npm i -D rollup-plugin-copy` |
| **rollup-plugin-serve** | 开发服务器 | `npm i -D rollup-plugin-serve` |
| **rollup-plugin-livereload** | 热重载 | `npm i -D rollup-plugin-livereload` |
| **rollup-plugin-visualizer** | 包分析 | `npm i -D rollup-plugin-visualizer` |

### 🔧 插件配置示例

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

export default {
	input: 'src/main.ts',
	output: {
		file: 'dist/bundle.js',
		format: 'iife',
		name: 'MyApp',
		sourcemap: isDevelopment
	},
	plugins: [
		// 解析外部依赖
		resolve({
			browser: true,
			dedupe: ['react', 'react-dom'],
			preferBuiltins: false
		}),
		
		// 支持 CommonJS
		commonjs({
			include: 'node_modules/**'
		}),
		
		// TypeScript 编译
		typescript({
			tsconfig: './tsconfig.json',
			sourceMap: isDevelopment,
			inlineSources: isDevelopment
		}),
		
		// Babel 转换
		babel({
			babelHelpers: 'bundled',
			exclude: 'node_modules/**',
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
			presets: [
				['@babel/preset-env', {
					targets: 'defaults'
				}],
				'@babel/preset-react'
			]
		}),
		
		// CSS 处理
		postcss({
			extract: true,
			minimize: isProduction,
			sourceMap: isDevelopment,
			plugins: [
				require('autoprefixer'),
				isProduction && require('cssnano')
			].filter(Boolean)
		}),
		
		// 生产环境压缩
		isProduction && terser({
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		}),
		
		// 开发服务器
		isDevelopment && serve({
			open: true,
			contentBase: ['dist', 'public'],
			host: 'localhost',
			port: 3000
		}),
		
		// 热重载
		isDevelopment && livereload('dist')
	].filter(Boolean)
};
```

## 🛠️ 编写 Rollup 插件

### 📝 插件基础结构

```javascript
// my-plugin.js
export default function myPlugin(options = {}) {
	return {
		name: 'my-plugin', // 插件名称
		
		// 构建钩子
		buildStart(opts) {
			// 构建开始时调用
			console.log('Build started');
		},
		
		resolveId(id, importer) {
			// 解析模块 ID
			if (id === 'virtual:my-module') {
				return id;
			}
			return null;
		},
		
		load(id) {
			// 加载模块
			if (id === 'virtual:my-module') {
				return 'export const msg = "Hello from virtual module!";';
			}
			return null;
		},
		
		transform(code, id) {
			// 转换代码
			if (id.endsWith('.special')) {
				return {
					code: `// Transformed\n${code}`,
					map: null
				};
			}
			return null;
		},
		
		generateBundle(options, bundle) {
			// 生成 bundle 时调用
			console.log('Generated bundle with', Object.keys(bundle).length, 'chunks');
		},
		
		writeBundle(options, bundle) {
			// 写入文件后调用
			console.log('Bundle written to', options.dir || options.file);
		}
	};
}

// 使用插件
import myPlugin from './my-plugin.js';

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.js',
		format: 'es'
	},
	plugins: [
		myPlugin({
			// 插件选项
		})
	]
};
```

### 🎯 实用插件示例

#### 环境变量注入插件

```javascript
export function envPlugin(env = {}) {
	return {
		name: 'env',
		transform(code, id) {
			let transformedCode = code;
			
			Object.keys(env).forEach(key => {
				const regex = new RegExp(`process\\.env\\.${key}`, 'g');
				transformedCode = transformedCode.replace(
					regex, 
					JSON.stringify(env[key])
				);
			});
			
			return transformedCode !== code ? {
				code: transformedCode,
				map: null
			} : null;
		}
	};
}
```

#### 文件大小报告插件

```javascript
export function sizePlugin() {
	return {
		name: 'size-report',
		generateBundle(options, bundle) {
			console.log('\n📦 Bundle Size Report:');
			console.log('─'.repeat(50));
			
			Object.keys(bundle).forEach(fileName => {
				const chunk = bundle[fileName];
				if (chunk.type === 'chunk') {
					const size = new Blob([chunk.code]).size;
					console.log(`${fileName}: ${(size / 1024).toFixed(2)} KB`);
				}
			});
			
			console.log('─'.repeat(50));
		}
	};
}
```

## 🚀 JavaScript API

Rollup 提供了一个可从 Node.js 使用的 JavaScript API。你很少需要使用它，除非你正在扩展 Rollup 本身或者需要编程式地打包等特殊用途，否则应该使用命令行 API。

### 📝 基础 API 使用

```javascript
import { rollup } from 'rollup';

// 输入选项
const inputOptions = {
	// 核心输入选项
	external: ['lodash'],
	input: 'src/main.js',
	plugins: [],

	// 进阶输入选项
	cache: undefined,
	logLevel: 'info',
	makeAbsoluteExternalsRelative: true,
	maxParallelFileOps: 20,
	onLog: (level, log, handler) => handler(level, log),
	onwarn: (warning, warn) => warn(warning),
	preserveEntrySignatures: 'strict',
	strictDeprecations: false
};

// 输出选项
const outputOptions = {
	// 核心输出选项
	dir: 'dist',
	file: 'dist/bundle.js',
	format: 'cjs',
	globals: {},
	name: 'MyBundle',
	plugins: [],

	// 进阶输出选项
	assetFileNames: 'assets/[name]-[hash][extname]',
	banner: '/* My banner */',
	chunkFileNames: '[name]-[hash].js',
	compact: false,
	entryFileNames: '[name].js',
	extend: false,
	footer: '/* My footer */',
	generatedCode: 'es2015',
	inlineDynamicImports: false,
	interop: 'auto',
	intro: '/* My intro */',
	manualChunks: undefined,
	minifyInternalExports: false,
	outro: '/* My outro */',
	paths: {},
	preserveModules: false,
	sourcemap: false,
	sourcemapExcludeSources: false,
	sourcemapFile: undefined,
	sourcemapPathTransform: undefined,
	validate: false
};

async function build() {
	let bundle;
	let buildFailed = false;
	
	try {
		// 创建 bundle
		bundle = await rollup(inputOptions);

		// 生成输出
		const { output } = await bundle.generate(outputOptions);

		// 或者写入文件
		await bundle.write(outputOptions);
	} catch (error) {
		buildFailed = true;
		console.error(error);
	}
	
	if (bundle) {
		// 关闭 bundle
		await bundle.close();
	}
	
	process.exit(buildFailed ? 1 : 0);
}

build();
```

### 🔄 监听模式 API

```javascript
import { watch } from 'rollup';

const watchOptions = {
	...inputOptions,
	output: [outputOptions],
	watch: {
		buildDelay: 0,
		chokidar: {
			usePolling: false
		},
		clearScreen: true,
		exclude: 'node_modules/**',
		include: 'src/**',
		skipWrite: false
	}
};

const watcher = watch(watchOptions);

watcher.on('event', event => {
	switch (event.code) {
		case 'START':
			console.log('🚀 Build started');
			break;
		case 'BUNDLE_START':
			console.log('📦 Bundling', event.input);
			break;
		case 'BUNDLE_END':
			console.log('✅ Bundle generated in', event.duration, 'ms');
			break;
		case 'END':
			console.log('🎉 Build completed');
			break;
		case 'ERROR':
			console.error('❌ Build failed:', event.error);
			break;
	}
});

// 停止监听
// watcher.close();
```

## 🎯 最佳实践

### ✅ 推荐做法

::: tip 🎯 最佳实践
1. **库优先**: Rollup 特别适合构建库，输出更干净
2. **ES 模块**: 优先使用 ES 模块，获得更好的 Tree Shaking
3. **外部依赖**: 合理配置 external，避免打包不必要的依赖
4. **多格式输出**: 为不同环境提供不同格式的输出
5. **插件组合**: 合理组合插件，避免功能重复
6. **缓存利用**: 开启缓存提升构建性能
:::

### 🚫 避免的做法

::: warning ⚠️ 注意事项
- 不要忽略 Tree Shaking 的重要性
- 避免在库中打包大型依赖
- 不要过度使用插件导致构建复杂
- 避免在配置中硬编码路径
- 不要忽略 source map 的配置
:::

### 📁 项目结构建议

```
rollup-project/
├── src/
│   ├── index.js             // 主入口
│   ├── utils/               // 工具函数
│   └── components/          // 组件
├── dist/                    // 输出目录
├── rollup.config.js         // Rollup 配置
├── package.json
└── README.md
```

### 🔧 库开发配置模板

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies || {});

export default [
	// ES 模块构建
	{
		input: 'src/index.ts',
		external,
		output: {
			file: pkg.module,
			format: 'es',
			sourcemap: true
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.json'
			})
		]
	},
	
	// CommonJS 构建
	{
		input: 'src/index.ts',
		external,
		output: {
			file: pkg.main,
			format: 'cjs',
			sourcemap: true,
			exports: 'named'
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.json'
			})
		]
	},
	
	// UMD 构建
	{
		input: 'src/index.ts',
		external,
		output: {
			file: pkg.browser,
			format: 'umd',
			name: 'MyLibrary',
			sourcemap: true,
			globals: {
				'react': 'React'
			}
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.json'
			}),
			terser()
		]
	}
];
```

## 🌟 总结

Rollup 作为专注于 ES 模块的构建工具，提供了：

- ✅ **优秀的 Tree Shaking**: 基于 ES 模块的静态分析
- ✅ **更小的输出**: 没有多余的运行时代码
- ✅ **多格式支持**: 支持各种模块格式输出
- ✅ **插件生态**: 丰富的插件系统
- ✅ **库友好**: 特别适合构建可重用的库
- ✅ **现代化**: 紧跟 ES 标准发展

通过合理使用 Rollup，可以构建出高质量、体积小巧的 JavaScript 库和应用，是现代前端工具链中不可缺少的重要工具。
