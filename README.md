# Taro 微信小程序项目模板（React,Typescript）

在 Taro 已有的项目模板基础上针对内部工作流程优化后的模板  
但在一切开始之前，我们希望你对 Taro 框架和微信小程序有一定了解:cyclone:

:link:[小程序开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/) 可以先着重于了解小程序的框架  
:link:[Taro 官方文档](https://taro-docs.jd.com/taro/docs/README/index.html)

## 目录结构

```
|
├── config                            项目编译配置目录
|   ├── index.js                      默认配置
|   ├── dev.js                        测试环境配置
|   ├── uat.js                        客户验收环境配置
|   └── prod.js                       生产环境配置
|
├── src                               源码目录
|   ├── components                    通用组件目录
|   |   └── ThisIsComponent           组件目录 (命名规则 PascalCase 大驼峰)
|   |       ├── index.tsx             组件逻辑
|   |       └── index.scss            组件样式
|   ├── pages                         页面文件目录
|   |   └── this-is-a-page            页面目录 (命名规则 kebab-case 短横线命名)
|   |       ├── sub-page              相关业务的子页面目录
|   |       ├── components            页面特有的、非通用的组件目录
|   |       |   └── PageComponent
|   |       ├── index.tsx             页面逻辑
|   |       ├── index.scss            页面样式
|   |       └── index.config.ts       页面配置
|   |
|   ├── components                    通用组件目录
|   ├── assets                        静态资源目录
|   ├── custom-tab-bar                当小程序使用自定义tabbar时需要维护的组件目录(1)
|   ├── services                      通讯目录
|   ├── utils                         工具函数目录
|   |
|   ├── reducers                      redux reducer目录(optional)
|   ├── actions                       redux action目录(optional)
|   ├── actions                       redux 仓库目录(optional)
|   ├── styles                        通用样式目录(optional)
|   |
|   ├── app.tsx                       项目入口文件
|   ├── app.scss                      项目通用样式
|   └── app.config.ts                 项目入口配置
|
├── babel.config.js                   Babel 配置
├── tsconfig.json                     TypeScript 配置
├── .eslintrc                         ESLint 配置
|
├── project.config.json               微信小程序项目配置(编译时生成/修改)
├── dist                              编译结果目录
|
└── package.json                      项目依赖
```

(1) :link:[自定义 tabbar 文档](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)

---

## 在开始前

为避免多人协同开发时，工具或平台差异导致格式不统一，在此规范使用方法和配置，以 VSCode 为例

### CRLF LF

Mac 和 Win 不同的默认换行符会造成提交代码时出现问题

```
git config --global core.autocrlf true
```

该命令可以保证 windows 平台开发者在提交代码时 git 自动将 CRLF 转换为 LF

### IDE

建议使用 VSCode

### 格式化工具 Prettier

在 VSCode 扩展中查找 [Prettier - Code Formmater](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) ，安装并开启

将以下配置加入 package.json 的 prettier 字段或项目根目录的.prettierrc 中

```json
{
	"printWidth": 100,
	"trailingComma": "es5",
	"useTabs": true,
	"tabWidth": 2,
	"semi": true,
	"singleQuote": true,
	"endOfLine": "crlf",
	"quoteProps": "preserve",
	"bracketSpacing": true,
	"arrowParens": "always",
	"rangeStart": 0,
	"requirePragma": false,
	"insertPragma": false,
	"proseWrap": "preserve",
	"htmlWhitespaceSensitivity": "ignore",
	"jsxSingleQuote": true
}
```

将 Prettier 设置为全局的默认格式化工具  
文件 → 首选项 → 设置 → 找到 Editor: Default Formatter 配置项 → 选择 Prettier

**_在过去的使用中，你可能为某些特定类型文件指定了其他格式工具_**
**_而这将覆盖我们的默认设置_**

为确保格式工具的行为在不同开发者的 IDE 上保持一致  
打开 VSCode 的设置文件 settings.json，并确认如下配置

```js
{
  //ide默认格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  //保存文件时自动格式化
  "editor.formatOnSave": true,
  //某类文件的特殊配置
  "[javascript]": {
    //将该类型文件的格式化工具指定为 Prettier
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    //或不指定该类型文件的格式化工具，此时对于将采取默认配置
  },
}
```

**最后，重启 VSCode 以使配置生效**

Prettier 也可以通过 CLI 对整个项目目录进行格式化  
全局安装 pretter

```
npm i prettier --global
```

运行目录格式化（需先按上述文档完成配置），[使用教程](https://prettier.io/docs/en/cli.html)  
以本项目为例，格式化 src 目录下的 ts, tsx, json ,scss 文件

```
prettier --write "./src/**/*.{ts,tsx,json,scss}"
```

---

## How To Use

复制除 .gitignore 中提及和\*.md 外的文件和目录至新项目中  
酌情删除代码

安装依赖

```
npm install
//或
yarn
```

配置对应环境的 appid 和参数  
见[环境配置](https://github.com/31ten/miniprogram_taro_react_template/tree/develop/config)

开发时

```
npm run dev:weapp:{环境}
```

发布时

```
npm run build:weapp:{环境}
```

其中 ‘环境’ 常见有 测试环境 test，客户验收环境 uat，生产环境 prod

生产模式（build 命令）默认开启代码压缩和性能优化，**上传前务必使用生产模式进行编译**

---

## 着手开发吧！:smile:

### 命名规范

尽可能**添加定语**以提升语义，杜绝使用单一的，无意义的词，如：price、data、page 等  
尽可能使用完整的单词拼写命名  
不使用任何前缀 $\_等

#### 项目命名

所有内容小写，分词用下划线("\_")拼接，{项目名称}\_{项目类型}

```js
//资深堂电商项目小程序
shiseido_ec_mp;
```

#### 目录命名

所有目录以 kebab-case 规范命名，所有字母小写，分词用短横线("-")拼接
组件目录以 PascalCase 规范命名，单词首字大写

```js
// 功能的集合使用复数形式表达
// 比如页面文件夹 pages
// 组件文件夹 components
'src/pages/index';
'src/pages/this-is-page';
'src/components/CustomComponent';
```

#### 文件命名

所有内容小写，分词使用('.')拼接

```js
user.service.ts;
```

#### 本地变量

camelCase，除第一个字符外，所有单词首字大写

```js
let list ✖
let userList ✔

const data  ✖
const pageData ✔

let time1  ✖
let time2  ✖
```

#### 全局常量

UPPERCASE，所有字母大写，分词使用下划线拼接

```js
export const GLOBAL_CONSTANT
```

#### 函数

camelCase，除第一个字符外，所有单词首字大写  
函数通常包含某些功能，尽可能**使用动宾短语**以提升语义  
除非该函数是某个已被语义化的类或实例的成员

```js
function fetch() {} ✖
function data() {} ✖
function fetchData() {} ✔
BookingService.cancel() ✔
```

#### 类、组件、接口、类型等

自身使用 PascalCase， 所有单词的首字大写  
其成员遵循上述变量和函数的命名规则

```ts
class UserService {
	userName: string;
	fetchUserData(): void;
}
```

#### className，id 等

id 以 camelCase 规范命名
类以 kebab-case 规范命名
若存在样式的嵌套，用双下划线("\_\_")按层级拼接

```tsx
<Component id='componentId' className='component-class'>
	<Child className='component-class__body'>
		<GrandChild className='component-class__body__inner' />
	</Child>
</Component>
```

```scss
.component-class {
	&__body {
		&__inner {
		}
	}
}
```

#### Typescript 相关

```tsx
//如无必要，应该尽量避免使用any
let anyArray: any[] = []
//该问题常见于处理接口返回的数据，可以通过申明全局或局部类型，或添加.d.ts文件，例如
type PageDataListItem {
    property: number
}
let noMoreAny: PageDataListItem[] = []

//不要依赖类型推断，应尽量手动指定
let showFlag = false ✖
let showFlag: boolean = false  ✔
const [state, setState] = useState<boolean>(false)  ✔

//函数必须指定参数类型和返回值类型，如无返回，则指定void
function doSomething(
    param: string,
    optionalPram?: string,
    defaultValue: string = ''
): void {
    //do something
    return
}

//对于参数为对象形式的函数，需要定义该对象的类型
type FunctionOption= {
    /**
     * paramA是做什么的
     */
    paramA:string;
    /**
     * paramB是做什么的
     */
    paramB:number;
}
function doSomethingElse(option:FunctionOption) {
    const { paramA, paramB } = option;
}

```

### 代码注释

对于工具类函数、通讯方法、通用组件，必须添加符合[JSDoc 规范](https://en.wikipedia.org/wiki/JSDoc)的代码注释

函数、方法必须在注释中指明用途、用法、参数类型，返回类型

```tsx
/** 函数功能
 * @description           描述
 * @param {string} param  参数用途
 * @return {void}         返回内容
 */
function doSomething(param: string): void {
	//dosome thing
	return;
}
```

组件必须在注释中指明用途、用法，并在声明参数接口后对其成员进行描述(类型，默认值，用途)

```tsx
//组件接口
interface ComponentProps {
	/** 这是一个参数
	 * @default false
	 */
	propA: boolean;
}

/** 组件功能
 * @description 描述
 */
function SomeComponent(props: ComponentProps) {
	const { propA } = props;
	return <div>This is a component</div>;
}
```
