import { FC } from 'react';
import { Property } from 'csstype';

/**
 * @description 自定义尺寸属性
 */
export interface SizeProps {
	width: string | number;
	height: string | number;
}

/**
 * @description 边距属性
 */
export interface PaddingProps {
	padding?: Property.Padding;
	paddingLeft?: Property.PaddingLeft;
	paddingTop?: Property.PaddingTop;
	paddingRight?: Property.PaddingRight;
	paddingBottom?: Property.PaddingBottom;
}

/**
 * @description 骨架屏组件参数
 * @interface SkeletonProps
 */
export interface SkeletonProps {
	className?: string;
	/**
	 * @description 占位图背景色， 默认值：`#ebebeb`;
	 */
	bgColor?: string;
	/**
	 * @description 占位图圆角尺寸， 将应用于组件实例中的 Row、Rect、Action占位图, 默认值：`2px`
	 */
	radius?: string | number;
	/**
	 * @description 排列方向  横向 或者 纵向， 默认 row
	 * @type {('row' | 'column')}
	 */
	type?: 'row' | 'column';
	/**
	 * @description 占位图四周边距， 默认值: padding: '16px 24px'
	 * @type {PaddingProps}
	 */
	contentPD?: PaddingProps;
	/**
	 * @description 是否显示占位图，传 `false` 时会展示子组件内容
	 * @type {boolean}
	 */
	loading?: boolean;
	/**
	 * @description 是否显示头像占位图, 默认尺寸: `60*60`
	 * @type {boolean}
	 */
	avatar?: boolean;
	/**
	 * @description 头像占位图大小, 默认值: `60`
	 * @type {number}
	 */
	avatarSize?: number;
	/**
	 * @description 头像占位图形状，可选值为 `square` 、`round` 默认值：`round`
	 * @type {('round' | 'square')}
	 */
	avatarShape?: 'round' | 'square';
	/**
	 * @description 是否显示右边操作按钮占位图
	 * @type {boolean}
	 */
	action?: boolean;
	/**
	 * @description 设置右边操作按钮占位图尺寸, 默认尺寸：`120*60`
	 * @type {SizeProps}
	 */
	actionSize?: SizeProps;
	/**
	 * @description 是否显示块占位图
	 * @type {boolean}
	 */
	rect?: boolean;
	/**
	 * @description 设置Rect 占位图尺寸, 默认值： `width: '100%', height: 400 `
	 * @type {SizeProps}
	 */
	rectSize?: SizeProps;
	/**
	 * @description 是否开启动画, 默认开启：`true`
	 * @type {boolean}
	 */
	animate?: boolean;
	/**
	 * @description 动画名称, 可选值为`blink`、`elastic`,  默认值：`blink`
	 * @type {('blink' | 'elastic')}
	 */
	animateName?: 'blink' | 'elastic';
	/**
	 * @description 动画持续时间, 单位`秒`, 默认值: `1.5`
	 * @type {number}
	 */
	animateDuration?: number;
	/**
	 * @description 段落占位图行数
	 * @type {number}
	 */
	row?: number;
	/**
	 * @description 段落占位图宽度，可传数组来设置每一行的宽度
	 * @type {(number | string | (number | string)[])}
	 */
	rowWidth?: number | string | (number | string)[];
	/**
	 * @description 段落占位图高度，可传数组来设置每一行的高度
	 * @type {(number | string | (number | string)[])}
	 */
	rowHeight?: number | string | (number | string)[];
	/**
	 * @description 用于定制 row 的宽和高，可传数组来设置每一行的宽和高，如果配置了该属性，则 rowWidth 配置无效
	 * @type {(SizeProps | SizeProps[])}
	 */
	rowProps?: SizeProps | SizeProps[];
	/**
	 * @description 段落占位图的对齐方式，默认: `left`
	 * @type {('left' | 'center' | 'right')}
	 */
	rowAlignStyle?: 'left' | 'center' | 'right';

	/**
	 * @description 设计稿尺寸，默认值: `750`
	 * @see [设计稿及尺寸单位](https://taro-docs.jd.com/taro/docs/next/size)
	 */
	designWidth?: number;
	/**
	 * @description 子组件内容
	 * @type {JSX.Element}
	 */
	children?: JSX.Element;
}

declare const Skeleton: FC<SkeletonProps>;

export default Skeleton;
