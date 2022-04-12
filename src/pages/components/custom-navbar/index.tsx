import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import CustomNavbar, { useTransparentNavbar, NAVBAR_HEIGHT } from '@components/CustomNavbar';
import './index.scss';

export default function Index() {
	const transparentNav = useTransparentNavbar();
	return (
		<View className='navbar-page'>
			<CustomNavbar transparent={transparentNav} holdPlace={false}>
				<View className='header'>自定义导航栏</View>
			</CustomNavbar>
			<View className='body'>
				<View style={{ paddingTop: NAVBAR_HEIGHT + 'px' }}>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
					<View>Scroll the page</View>
				</View>
			</View>
		</View>
	);
}
