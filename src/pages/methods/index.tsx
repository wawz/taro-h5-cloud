import { View, Navigator } from '@tarojs/components';
import TabBar from '@components/Tabbar';
import './index.scss';

export default function() {
	return (
		<View className='index page page-with-tab'>
			<Navigator className='nav-buttons' url='/pages/methods/use-callback-list/index'>
				自定义钩子 useCallbackList
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/methods/use-form/index'>
				自定义钩子 useForm TODO
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/methods/use-async/index'>
				自定义钩子 useAsync
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/methods/canvas/index'>
				canvas 工具函数
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/methods/get-authorization/index'>
				用户授权
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/methods/get-phone-number/index'>
				获取手机号
			</Navigator>
			<TabBar current={3} />
		</View>
	);
}

