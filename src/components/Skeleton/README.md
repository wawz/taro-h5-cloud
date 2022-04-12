# 骨架屏 组件 😎 

在[taro-skeleton](https://github.com/lentoo/taro-skeleton)基础上进行了拓展

## 场景

骨架屏是页面的一个空白版本，通常会在页面完全渲染之前，通过一些灰色的区块大致勾勒出轮廓，待数据加载完成后，再替换成真实的内容。
骨架屏仅用于展示页面首屏中的可见区域, 也可用作局部加载的 loading 样式。

## 使用方法 😄

**该组件基于 Taro**

```tsx
<Skeleton row={3} loading={loading}>
  <Text>实际内容</Text>
</Skeleton>
```

## 实现目标 🎯

简单快捷的配置骨架屏
开发者可根据需要设置占位图的颜色、形状、排列方式

### 配置项 🤝

  其中 尺寸属性、边距属性的值为数字时，最后应用的结果为 `Taro.pxTransform(value, designWidth)`

| 参数              | 说明 | 类型 | 默认值 |
| :---------------- | :--- | :--- | :--- |
| loading           | 是否显示占位图，传`false`时会展示子组件内容 | `boolean` | `true` |
| type              | 定义排列方式  | `row/column` | `row` | 
| row               | 段落占位图行数 | `number` | `0` |
| rowWidth          | 段落占位图宽度，可传数组来设置每一行的宽度 | `number/string/number[]/string[]` | `100%` |
| rowHeight         | 段落占位图高度，可传数组来设置每一行的高度 | `number/string/number[]/string[]` | `24` |
| rowProps          | 用于设置 row 的宽和高，可传数组来设置每一行的宽和高，如果配置了该属性，则 rowWidth 配置无效 | `SizeProps/SizeProps[]` | - |
| rowAlignStyle     | 段落占位图对齐方式，可选值为 `left / center / right` | `string` | `left` |
| avatar            | 是否显示头像占位图 | `boolean` | `false` |
| avatarSize        | 头像占位图大小 | `number/string` | `60` |
| avatarShape       | 头像占位图形状，可选值为 `round / square` | `string` | `round` |
| action            | 是否显示右边操作按钮占位图 | `boolean` | `false` |
| actionSize        | 设置右边操作按钮占位图尺寸 | `SizeProps` | `120*60` |
| rect              | 是否显示块占位图 | `boolean` | `false` |
| rectSize          | 设置块占位图尺寸 | `SizeProps` | `width: '100%'; height: 400` |
| animate           | 是否开启动画 | `boolean` | `true` |
| animateName       | 动画类型，可选值为`blink / elastic` | `string` | `blink` |
| animateDuration   | 动画持续时间，单位`秒` | `number` | `1.5` |
| designWidth       |Taro.pxTransform(px, designWidth) 的designWidth的属性| `number` | `750` |
| className         | 使用自定义类名针对性设置骨架屏样式  | `string` | -  |
| bgColor           | 占位图背景色   | `string` | `#ebebeb` |
| radius            | 占位图圆角尺寸，将应用于组件实例中的 row、rect、action 属性的占位图 | `string / number` | `2` |
| contentPD         | 设置占位图四周边距 | `PaddingProps` | `padding: '16px 24px'` |

#### SizeProps

| 参数    | 说明 | 类型 | 是否必填 | 默认值 |
| :------ | :------ | :------ | :------ | :------ |
| width   | 占位图宽度 | `number/string` | 是 | - |
| height  | 占位图高度 | `number/string` | 是 | - |
