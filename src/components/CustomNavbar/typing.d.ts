import { CSSProperties } from 'react';

interface CustomNavbarProps {
	/** 导航栏是否透明
	 * @default false
	 */
	transparent?: boolean;

	/** 导航栏是否占位，若不占位，则页面从屏幕顶部起始
	 * @default true
	 */
	holdPlace?: boolean;

	/** 导航栏背景色
	 * @default #fff
	 */
	backgroundColor?: string;

	/** 可以扩展导航栏背景的样式
	 * @default {}
	 */
	style?: CSSProperties;

	children?: any;
}
export { CustomNavbarProps };
