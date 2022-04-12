import { View, Navigator } from '@tarojs/components';
import TabBar from '@components/Tabbar';
import './index.scss';

export default function() {
	return (
		<View className='index page page-with-tab'>
			<Navigator className='nav-buttons' url='/pages/components/skeleton/index'>
				skeleton 骨架屏示例
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/components/custom-navbar/index'>
				自定义导航栏
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/components/popover/index'>
				Popover 示例
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/components/calendar/index'>
				Calendar 示例
			</Navigator>
			<TabBar current={2} />
		</View>
	);
}
