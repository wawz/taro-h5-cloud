import { View, Navigator } from '@tarojs/components';
import TabBar from '@components/Tabbar';

import './index.scss';

export default function() {
	return (
		<View className='index page page-with-tab'>
			<Navigator className='nav-buttons' url='/pages/tool/qrcode/index'>
				小程序二维码 wxacode.getUnlimited
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/tool/shortlink/index'>
				小程序短链 shortlink.generate
			</Navigator>
			<TabBar current={4} />
		</View>
	);
}
