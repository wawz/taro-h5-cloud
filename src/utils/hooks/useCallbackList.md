# 自定义钩子 useCallbackList 😎

仿 useCallback 风格的循环绑定事件的性能优化方案  
用于缓存循环得到的函数

| 参数           | 类型     | 必填 | 释义                                                                                  |
| -------------- | -------- | ---- | ------------------------------------------------------------------------------------- |
| depArray       | array    | ✔️   | 需要循环的数组                                                                        |
| callbackMapper | function | ✔️   | 生成对应回调函数的柯里化函数，接收与 Array.map 方法相同的参数，返回用于绑定事件的函数 |
| dependencies   | array    | ✔️   | 外部依赖                                                                              |

## How To Use

在循环渲染的时候，如果有遇到事件绑定的情形，使用以下方式生成并绑定。

**_该钩子仅使用于函数式组件_**

```tsx
const clickHandlers = useCallbackList(
	array,
	(item, index, array) => {
		// just like using Array.map()
		return (onclick_prop) => {
			// do something here with item, index, the loop array itself, and child's onclick params
		};
	},
	[
		/* deps here, empty to store once*/
	]
);
return (
	<View>
		{array.map((item, index) => (
			// get the handler by index,
			<Child onClick={clickHandlers[index]}></Child>
		))}
	</View>
);
```

## 场景 😿

在 Hooks 中循环渲染组件并绑定事件时  
内联箭头函数、柯里化函数等方式，会在渲染时生成新的函数  
因此即使子组件使用 React.memo 封装，由于新函数的内存地址不一致  
还是会导致父组件刷新时，子组件也跟着刷新。

### 内联箭头函数

```tsx
//每次render时，()=>{} 字面量声明新函数
return (
	<Father>
		{arrary.map((item) => (
			<Child onClick={() => doSomething(item)}></Child>
		))}
	</Father>
);
```

### 柯里化函数

```tsx
//每次render时，调用generateNewFunction重新生成新函数，本质同上
generateNewFunction(item) => () => { doSomething(item) }
return (
  <Father>
    {arrary.map((item) => (
      <Child onClick={generateNewFunction(item)}></Child>
    ))}
  </Father>
)
```

## 优化目标 🎯

父组件刷新时，若一个数组的数据未变化，则它 map 渲染的子组件不应该重新渲染。

### 思路

组件渲染前，先根据需要遍历的数组，提前柯里化对应数量的回调函数，并缓存到一个数组中  
绑定事件时，通过索引直接访问缓存数组中的函数，以保证子组件获取的函数内存地址不变。

### 实现

函数内部有三个 Ref，分别用于记录缓存遍历的数组 prevArray 、依赖数组 prevDependencies 和 遍历的结果 storedResult  
每次调用时，将 depArray 与 prevArray 、 dependencies 与 prevDependencies 进行长度比较和逐个元素的浅比较

如果长度不一致或者某一个元素不相同，则重新柯里化生成新的函数数组并缓存。

如果数组和依赖都没有变化，则直接返回先前缓存的遍历结果 storedResult。
