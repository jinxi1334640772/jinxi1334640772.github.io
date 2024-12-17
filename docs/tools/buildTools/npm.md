## npm 简介

‌npm（Node Package Manager）是 Node.js 的默认包管理器，用于发布、安装和管理 JavaScript 包（modules）。‌ 其主要功能包括包管理和发布、依赖管理、版本控制以及脚本执行等

```bash
# 查看和更改版本号 major.minor.patch V1.2.0
npm version [type]
npm version patch

# 初始化node项目
npm init

# 安装依赖包npm i简写 -D：--save-dev；-S：--save;-g：--globel
npm install [name]

# 卸载依赖包
npm uninstall [name]

# 查看依赖包 --globel
npm ls
npm list

# 更新
npm update [name]
# 检查项目中过时的依赖包
npm outdated

# 搜索npm仓库中的包
npm search [name]
# 查看指定包的详细信息，包括版本、依赖、描述等
npm view [name]
# 在npm仓库中浏览包的详细信息
npm explore <package_name>
# 查看当前登录的npm账号信息
npm whoami

# 运行项目的测试脚本
npm test [scriptName]
# 启动一个Node.js应用程序
npm start [scriptName]
# 停止正在运行的npm进程
npm stop [scriptName]
# 运行在package.json文件的scripts部分定义的脚本
npm run [scriptName]

# 打包：生成一个.tgz格式的压缩包，包含项目所有内容和依赖信息
npm pack

# 登录
npm login
# 登出npm
npm logout

# 发布， --tag next 指定标签
npm publish
# 从npm仓库中删除一个包
npm unpublish <package_name>@<version>

# 管理包的所有权
npm owner add <user> <package_name>
npm owner remove <user> <package_name>

# 设置或修复包的访问权限。
npm access public <package_name>
npm access restricted <package_name>
# 列出包的访问权限
npm access list <package_name>

# 减少依赖项的冗余，优化项目的依赖树
npm dedupe

# 查看和设置配置项
npm config set [key] [value]
npm config set registry https://registry.npm.taobao.org
npm config get <key>
# 查看所有的npm配置
npm config list

# 检查安全漏洞
npm audit
# 自动修复一些已知的安全问题。
npm audit fix

# 在连续集成环境中安装项目依赖
npm ci

# 创建一个符号链接，将本地的包链接到全局npm环境中
npm link

# 重建所有的依赖包，解决由于更新npm或node版本导致的依赖问题
npm rebuild

# 检查并修复npm环境中的常见问题。
npm doctor

# 用于清除缓存
npm cache clean --force
# 查看缓存内容
npm cache ls
# 验证缓存的完整性。
npm cache verify

# 创建或查看npm访问令牌
npm token create
npm token list

# 管理包的分发标签。
pm dist-tag add <package_name>@<version> latest
npm dist-tag ls <package_name>

# 管理组织团队和成员
npm team members <team_name>
npm team add <user> <team_name>

# 管理webhook。
npm hook create <url> [events]
npm hook ls

# 管理命名空间
npm scope create <scope>
npm scope list
```

## node 版本管理

nvm 是一个来管理 node 的工具，方便我们在开发过程中 node 版本的切换
一定要卸载已安装的 NodeJS，否则会发生冲突。然后下载 nvm-windows 最新安装包，直接安装即可。

```bash
# 安装指定版本
nvm install [版本号]

# 删除指定版本
nvm uninstall [版本号]

# 查看当前安装的版本等于nvm ls
nvm list
nvm list installed
nvm list available

# 切换到指定版本 [版本号]
nvm use [版本号]

nvm -h 查看nvm帮助
```

## 镜像源管理

nrm(npm registry manager )是 npm 的镜像源管理工具，有时候国外资源太慢，使用这个就可以快速地在 npm 源间切换

```bash
# 全局安装nrm包
npm install -g nrm

# 添加镜像源
nrm add [name] [url]
nrm add taobao https://registry.npm.taobao.org

# 查看所有添加的镜像源
nrm ls

# 使用选择的镜像源
nrm use [name]
nrm use taobao

# 删除镜像源
nrm del [name]
nrm del taobao
```

## pnpm 包管理器

速度快、节省磁盘空间的软件包管理器

- pnpm 比 npm 快了近 2 倍
- node_modules 中的所有文件均克隆或硬链接自单一存储位置
- pnpm 内置了对单个源码仓库中包含多个软件包的支持
- pnpm 创建的 node_modules 默认并非扁平结构，因此代码无法对任意软件包进行访问

```bash
# npm install 安装所有依赖
pnpm install
# 安装软件包及其依赖的任何软件包
pnpm add <pkg>

# pnpm ls
pnpm list --depth <number>
# 显示依赖于指定包的所有包。
pnpm why --depth <number>
# 列出已安装包的许可证。
pnpm licenses

pnpm outdated
pnpm update

# 别名：rm\uninstall\un 从 node_modules 和项目 package.json 中删除软件包
pnpm remove

# npm run <cmd> | pnpm run <cmd>：运行软件包 scripts 对象中指定的任意命令
pnpm <cmd>
# 别名: run start：运行软件包 scripts 对象中 start 属性指定的任意命令
pnpm start
# 别名 run test\t\tst
pnpm test

# 从 create-* 或 @foo/create-* 启动套件创建项目。
pnpm create
pnpm create react-app my-app

# 在项目范围内执行 shell 命令。
pnpm exec
# 为所有的软件包递归清理 node_modules 安装。
pnpm -r exec rm -rf node_modules
# pnpx 是 pnpm dlx的别名：从注册源中获取软件包而不将其安装为依赖项，热加载它，并运行它暴露的任何默认命令二进制文件
pnpm dlx
pnpm dlx create-react-app@next ./my-app

# 使当前本地包可在系统范围内或其他位置访问
pnpm link
# 将 <dir> 目录中的软件包或者全局的 node_modules 中的pkg包，链接到执行此命令的软件包的 node_modules
pnpm link <dir|pkg name>
# 取消链接一个系统范围的package
pnpm unlink

# 从另一个软件包管理器的锁文件生成 pnpm-lock.yaml
pnpm import
# 别名：rb 重新构建软件包。
pnpm rebuild
# 移除不需要的软件包。
pnpm prune
# 获取锁文件中列出的包到虚拟存储中，包清单将被忽略：用于改进构建 Docker 镜像
pnpm fetch
# 依次执行 pnpm install、 pnpm test 参数和 pnpm install完全相同
pnpm install-test
# 如果可以使用较新的版本，则执行安装并删除锁文件中的较旧依赖项。
pnpm dedupe


# 给软件包添加补丁:会将指定的软件包提取到一个可以随意编辑的临时目录中
pnpm patch <pkg>
# 完成修改后运行此命令。 (<path> 是之前提取的临时目录) 以生成一个补丁文件，并提供 patchedDependencies 字段注册到你项目中的顶层清单文件。
pnpm patch-commit <path>
# 删除 pnpm.patchedDependencies 中的现有补丁文件和设置。
pnpm patch-remove <pkg...>

# 别名： c。配置与 npm 相同 --globel:-g  --json
pnpm config set [key] [value]
pnpm config get <key>
pnpm config delete <key>
pnpm config list

# 安全检查：强制将不易受攻击的版本，添加覆盖到 package.json 文件中。
pnpm audit --fix

# 列出可用的程序包元数据缓存。 支持通过 glob 过滤。
pnpm cache list
# 查看指定包的缓存中的信息。
pnpm cache view
# 删除指定包的元数据缓存。 支持模式。
pnpm cache delete

# 将 pnpm 更新到最新版本或指定版本。
pnpm self-update
# 发布一个包到注册源。
pnpm publish

pnpm pack
# 管理包存储。 status add prune path
pnpm store
# 打印有效的存放模块的目录。 -g:--globel
pnpm root
# 打印依赖项的可执行文件链接到的目录。-g:--globel
pnpm bin

pnpm init
# pnpm 的独立安装脚本使用此命令,安装程序执行以下操作：
# 为 pnpm CLI 创建一个主目录
# 通过更新 shell 配置文件将 pnpm 主目录添加到 PATH
# 将 pnpm 可执行文件复制到 pnpm 主目录
pnpm setup

# 从工作空间部署软件包:--prod 选项跳过 devDependencies 安装
pnpm deploy
pnpm --filter=<deployed project name> deploy <target directory>

# 检查 pnpm 配置的已知常见问题。
pnpm doctor

# 过滤允许你将命令限制于软件包的特定子集。支持模式
pnpm --filter <package_selector> <command>
pnpm --filter "./packages/**" <cmd>

pnpm --filter "@babel/core" test
pnpm --filter "@babel/*" test
pnpm --filter "*core" test

# 要选择一个软件包及其依赖项（直接和非直接），在包名称后加上省略号
pnpm --filter foo... test
# ^ 只包含依赖项
pnpm --filter "foo^..." test
# 要选择一个包及被其依赖的包(直接和非直接)，在包名前添加一个省略号
pnpm --filter ...foo test
# 要只选择一个包的被依赖项 (直接和非直接)
pnpm --filter "...^foo" test
```

## pnpm 工作空间（Workspace）

pnpm 内置了对单一存储库（也称为多包存储库、多项目存储库或单体存储库）的支持。 你可以创建一个工作空间以将多个项目合并到一个仓库中。

```txt
./
├── Dockerfile
├── .dockerignore
├── .gitignore
├── packages/
│   ├── app1/
│   │   ├── dist/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   ├── app2/
│   │   ├── dist/
│   │   ├── package.json
│   │   ├── src/
│   │   └── tsconfig.json
│   └── common/
│       ├── dist/
│       ├── package.json
│       ├── src/
│       └── tsconfig.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

工作空间的根目录下必须有 pnpm-workspace.yaml 文件， 工作区在其根目录中也可能有一个 .npmrc 文件。

```yaml
packages:
  # 指定根目录直接子目录中的包
  - "my-app"
  # packages/ 直接子目录中的所有包
  - "packages/*"
  # components/ 子目录中的所有包
  - "components/**"
  # 排除测试目录中的包
  - "!**/test/**"

# 定义目录default和依赖版本号
catalog:
  react: ^18.3.1

# 使用 (复数) catalogs 字段创建任意命名的目录。
catalogs:
  react16:
    react: ^16.7.0
    redux: ^16.7.0
```

子项可以使用 catalog: 协议来代替依赖项版本。Catalog 协议允许在冒号后使用可选名称 (例如：catalog:name) 来指定应使用哪个目录。 当省略名称时，将使用默认 default 目录。packages/example-app/package.json:

```json
{
  "name": "@example/app",
  "dependencies": {
    "react": "catalog:",
    "redux": "catalog:react16"
  }
}
```

### 工作空间协议 (workspace:)

如果 link-workspace-packages 设置为 true，则如果可用包 与声明的范围匹配，pnpm 将链接来自工作空间的包。 例如，如果 bar 引用 "foo": "^1.0.0" 并且工作空间中存在 foo@1.0.0，foo@1.0.0 将被链接到 bar。 但是，如果 bar 的依赖项中有 "foo": "2.0.0"，而 foo@2.0.0 在工作空间中并不存在，则将从注册源中安装 foo@2.0.0 。 这种行为带来了一些不确定性。

幸运的是，pnpm 支持工作空间协议 workspace: 。 当使用此协议时，pnpm 将拒绝解析除本地工作空间所包含包之外的任何内容。 因此，如果你设置 "foo": "workspace:2.0.0"，此时安装将失败，因为 "foo@2.0.0" 不存在于此工作空间中。

当 link-workspace-packages 选项被设置为 false 时，这个协议将特别有用。 在这种情况下，仅当使用 workspace: 协议声明依赖，pnpm 才会从此 workspace 链接所需的包。

### 引用工作空间包

假设你在工作空间中有一个名为 foo 的包。

- 通常这样引用："foo": "workspace:\*"。

- 通过别名引用: "bar": "workspace:foo@\*"。在发布之前，别名被转换为常规名称。 上面的示例将变为："bar": "npm:foo@1.0.0"。
- 通过相对路径引用工作空间包：假如工作空间中有 foo\bar 2 个包。bar 中可能有 foo 的依赖： "foo": "workspace:../foo"。 在发布之前，这些将转换为所有包管理器支持的常规版本规范。

### 发布工作空间包

当工作被打包到归档（无论它是通过 pnpm pack ，还是 pnpm publish 之类的发布命令）时，将动态替换这些 workspace: 依赖：

假设工作空间中有 foo、 bar、 qar、 zoo 并且它们的版本都是 1.5.0，如下：

```json
{
    "dependencies": {
        "foo": "workspace:*",
        "bar": "workspace:~",
        "qar": "workspace:^",
        "zoo": "workspace:^1.5.0"
    }
}
// 将会被转化为：
{
    "dependencies": {
        "foo": "1.5.0",
        "bar": "~1.5.0",
        "qar": "^1.5.0",
        "zoo": "^1.5.0"
    }
}
```

这个功能允许你发布转化之后的包到远端，并且可以正常使用本地 workspace 中的 packages，而不需要其它中间步骤。包的使用者也可以像常规的包那样正常使用，且仍然可以受益于语义化版本。

## .pnpmfile.js

pnpm 允许您通过特殊功能（钩子）直接挂钩到安装过程。 钩子可以在名为 .pnpmfile.cjs 的文件中声明。

默认情况下， .pnpmfile.cjs 应该与锁文件位于同一目录中。 例如，在具有共享锁文件的 工作区 中 .pnpmfile.cjs 应该位于 monorepo 的根目录中。

- hooks.readPackage(pkg, context): pkg

在 pnpm 解析依赖的软件清单文件后调用，允许改变依赖的 package.json

- hooks.afterAllResolved(lockfile, context): lockfile

在解析完依赖关系后调用。允许更改锁文件。

```js
function readPackage(pkg, context) {
  // Override the manifest of foo@1.x after downloading it from the registry
  if (pkg.name === "foo" && pkg.version.startsWith("1.")) {
    // Replace bar@x.x.x with bar@2.0.0
    pkg.dependencies = {
      ...pkg.dependencies,
      bar: "^2.0.0",
    };
    context.log("bar@1 => bar@2 in dependencies of foo");
  }

  // This will change any packages using baz@x.x.x to use baz@1.2.3
  if (pkg.dependencies.baz) {
    pkg.dependencies.baz = "1.2.3";
  }

  return pkg;
}

function afterAllResolved(lockfile, context) {
  // ...
  return lockfile;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
```

## .npmrc

pnpm 从命令行、环境变量和 .npmrc 文件中获取其配置。

pnpm config 命令可用于更新和编辑 用户和全局 .npmrc 文件的内容

四个相关文件分别为：

- 每个项目的配置文件（/path/to/my/project/.npmrc）
- 每个工作区的配置文件（包含 pnpm-workspace.yaml 文件的目录）
- 每位用户的配置文件（ ~/.npmrc ）
- 全局配置文件（ /etc/npmrc ）

所有 .npmrc 文件都遵循 INI-formatted 列表，包含 key = value 参数。

```bash
# 默认镜像源配置
registry=https://example.com/packages/npm/

# 指定包的注册源范围:@babel 范围内的包时
@babel:registry=https://example.com/packages/npm/

# 访问指定注册源时要使用的身份验证承载令牌
//registry.npmjs.org/:_authToken=xxxxxxxx-xxxx-xxxx
# 使用环境变量
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

参考：https://www.pnpm.cn/npmrc

## .npmignore 忽略文件

把发布包时被忽略的文件，添加进来。例如：

```bash
node_modules
```

## 持续集成

在 GitHub Actions 上，你可以像这样使用 pnpm 安装和缓存你的依赖项（属于 .github/workflows/NAME.yml）：

```yml
name: pnpm 示例工作流
on:
  push:

jobs:
  build:
    runs-on: ubuntu-22.04
    strategy:
      matrix:
        node-version: [20]
    steps:
      - uses: actions/checkout@v4
      - name: 安装 pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      - name: 使用 Nnode.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"
      - name: 安装依赖
        run: pnpm install
```

在 Gitlab 上，您像这样可以使用 pnpm 来安装和缓存你的依赖项 （在 .gitlab-ci.yml 中）：

```yml
stages:
  - build

build:
  stage: build
  image: node:18.17.1
  before_script:
    - corepack enable
    - corepack prepare pnpm@latest-10 --activate
    - pnpm config set store-dir .pnpm-store
  script:
    - pnpm install # 安装依赖
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store
```

Jenkins 可以使用 pnpm 来安装和缓存你的依赖项：

```bash
pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'corepack enable'
                sh 'corepack prepare pnpm@latest-10 --activate'
                sh 'pnpm install'
            }
        }
    }
}
```
