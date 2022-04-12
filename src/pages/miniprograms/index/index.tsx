import { View, Navigator } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import TabBar from '@components/Tabbar';
import './index.scss';
import { useEffect } from 'react';
import useForm from '@pages/methods/use-form';

export default function() {
	useEffect(() => {
		Taro.hideTabBar();
		const query = Taro.createSelectorQuery();
		query
			.select('html')
			.boundingClientRect((rec) => {
				console.log(rec, 'res====>', query.select('a'));
			})
			.exec();
	}, []);

	return (
		<View className='index page  page-with-tab'>
			<Navigator
				target='miniProgram'
				appId='wxc1b01b366bd87257'
				path='pages/index/index'
				version='release'
				className='nav-buttons'
			>
				Christies
			</Navigator>
			<Navigator
				target='miniProgram'
				appId='wxfea8347254d3ee21'
				path='pages/index/index'
				version='release'
				className='nav-buttons'
			>
				Penhaligon
			</Navigator>
			<Navigator
				target='miniProgram'
				appId='wxffb029eda352530d'
				path='pages/index/index'
				version='release'
				className='nav-buttons'
			>
				Eatwith
			</Navigator>
			<Navigator
				target='miniProgram'
				appId='wxdd66177c6615f6af'
				path='pages/tab-pages/tab-page-1/index'
				version='release'
				className='nav-buttons'
			>
				Yara
			</Navigator>
			<Navigator
				target='miniProgram'
				appId='wx76d8972399525a5b'
				path='pages/index/index'
				version='release'
				className='nav-buttons'
			>
				Tec
			</Navigator>
			<Navigator
				target='miniProgram'
				appId='wxac0d440fb5284062'
				path='pages/index/index'
				version='release'
				className='nav-buttons'
			>
				Hermes QMS
			</Navigator>
			<Navigator
				target='miniProgram'
				appId='wx9444766340193fd1'
				path='pages/index/index'
				version='release'
				className='nav-buttons'
			>
				Caudalie
			</Navigator>
			<Navigator
				target='miniProgram'
				appId='wx544626b4d11e8b60'
				path='pages/index/index'
				version='release'
				className='nav-buttons'
			>
				PVCP
			</Navigator>
			<Navigator
				target='miniProgram'
				appId='wxb30e6d8b55a43ca9'
				path='pages/tab-pages/tab-page-1/index'
				version='release'
				className='nav-buttons'
			>
				Weber
			</Navigator>
			<TabBar current={0} />
		</View>
	);
}

