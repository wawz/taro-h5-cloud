import React, { CSSProperties, useState } from 'react';
import Taro, { usePageScroll } from '@tarojs/taro';
import { View, Block } from '@tarojs/components';
import { CustomNavbarProps } from './typing';

const HEADERPDB = 8; //胶囊底部到导航栏底部的距离，8像素
const menuButtonRect = Taro.getMenuButtonBoundingClientRect();
const NAVBAR_PLACEHOLDER_STYLE: CSSProperties = {
	boxSizing: 'content-box',
	paddingTop: `${menuButtonRect.top}px`,
	width: '100vw',
	height: `${menuButtonRect.height}px`,
	paddingBottom: `${HEADERPDB}px`,
	background: 'none',
};
const NAVBAR_STYLE: CSSProperties = {
	...NAVBAR_PLACEHOLDER_STYLE,
	position: 'fixed',
	top: '0',
	left: '0',
	zIndex: 9999,
};
/** 导航栏总高度，可用于定位收藏提示、使用自定义导航时页面的paddingTop等。
 * @description 导航栏总高度=胶囊高度+胶囊与屏幕顶部距离+8(常量)
 */
export const NAVBAR_HEIGHT: number = menuButtonRect.height + menuButtonRect.top + HEADERPDB;

/** 透明导航栏的钩子函数
 * @description 依赖Taro.usePageScroll，HooksOnly
 * @param {number} threshold 页面滚动的阈值，当滚动大于该阈值时返回false，小于时返回true，默认为35px
 * @return {boolean} 用于判断的透明flag
 */
export function useTransparentNavbar(threshold: number = 35): boolean {
	const [transparentNavBar, setTransparentNavBar] = useState(true);
	usePageScroll((e) => {
		if (e.scrollTop > threshold && transparentNavBar) {
			setTransparentNavBar(false);
		} else if (e.scrollTop <= threshold && !transparentNavBar) {
			setTransparentNavBar(true);
		}
	});
	return transparentNavBar;
}

/** 顶部导航容器
 * @description 当全局或页面配置的window.navigationStyle为‘custom’时，需要自行实现
 * @description 由于项目间设计差异，不再包含按钮标题等内容，仅提炼了位置尺寸、透明等功能
 * @example
 * ```tsx
 * export default function() {
 *    const transparentNav = useTransparentNavbar(35)
 *    return (
 *        <CustomNavbar
 *            transparent={transparentNav}
 *            holdplace={false}
 *        >
 *            <View>Logo，按钮，title 等</View>
 *        </CustomNavbar>
 *     )
 * }
 * ```
 */

export default React.memo(
	({
		transparent = false,
		holdPlace = true,
		backgroundColor = '#fff',
		children = null,
		style = {},
	}: Partial<CustomNavbarProps>) => {
		return (
			<Block>
				<View style={NAVBAR_STYLE}>
					<View
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							pointerEvents: 'none',
							transition: 'opacity 0.1s linear',
							opacity: transparent ? '0' : '1',
							background: backgroundColor,
							zIndex: 0,
							...style,
						}}
					></View>
					<View
						id={'navigation-wrapper'}
						style={{
							position: 'relative',
							height: '100%',
							zIndex: 1,
						}}
					>
						{children}
					</View>
				</View>
				{holdPlace && <View style={NAVBAR_PLACEHOLDER_STYLE}></View>}
			</Block>
		);
	}
);
