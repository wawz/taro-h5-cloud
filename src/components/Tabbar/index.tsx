import { Image, View, Navigator } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import React, { useCallback, useState } from 'react';
// import TabBar from '@app.config';
import TabBar from '../../test.config';
import './index.scss';

/**
 * 自定义tab-bar组件
 * 根据debug mode判断是否显示或隐藏 Tool tab-bar(Tool总是最后一个tab)
 * 非 debug mode, 隐藏 Tool tab-bar
 * debug mode, 显示 Tool tab-bar
 * 注意: 需要对app.config的tab icon 路径进行处理
 */

interface tabBarParamsType {
	current: number;
}

interface tabListType {
	pagePath: string;
	text: string;
	iconPath: string;
	selectedIconPath: string;
}

const debugTabBarList: tabListType[] = TabBar.tabBar.list;
const len = debugTabBarList.length;
const originTabBarList: tabListType[] = debugTabBarList.slice(0, len - 1);

/**
 * require 拼接路径时, 需要注意: 拼接的变量前面的字符需要是可引入的文件夹路径
 * '@assets/' + parma | '@assets/tabbar' + parma OK
 * '@' + param | '@assets' + param No
 * @param str
 * @returns str
 */
const handleIconPath = (str: string): string => {
	return str.replace('assets/', '');
};

const { platform } = Taro.getSystemInfoSync();

export default React.memo((props: tabBarParamsType) => {
	const [tabBarList, setTabBarList] = useState<tabListType[]>(
		platform !== 'devtools' && process.env.TARO_ENV === 'weapp' ? originTabBarList : debugTabBarList
	);
	const current: number = props.current;

	useDidShow(() => {
		const isDebug = Taro.getSystemInfoSync().enableDebug;
		if (platform !== 'devtools' && process.env.TARO_ENV === 'weapp') {
			// 当debug和tabBarList不对应时，则修改tabBarList
			if (isDebug && tabBarList.length === 4) {
				setTabBarList(debugTabBarList);
			}
			if (!isDebug && tabBarList.length === 5) {
				setTabBarList(originTabBarList);
			}
		}
	});

	return (
		<View className='tab-container'>
			{tabBarList.map((tab, index) => {
				const url =
					current === index ? handleIconPath(tab.selectedIconPath) : handleIconPath(tab.iconPath);
				return (
					<Navigator
						openType='switchTab'
						hoverClass='none'
						url={`/${tab.pagePath}`}
						key={index}
						className='tab-item'
					>
						<Image className='tab-icon' src={require('@assets/' + url)} />
						<View className={current === index ? 'tab-text-select' : 'tab-text'}>{tab.text}</View>
					</Navigator>
				);
			})}
		</View>
	);
});

