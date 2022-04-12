import { View, Navigator } from '@tarojs/components';
import TabBar from '@components/Tabbar';

import './index.scss';

export default function() {
	return (
		<View className='index page page-with-tab'>
			<Navigator className='nav-buttons' url='/pages/sandbox/threejs/index'>
				ThreeJS in MP
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/sandbox/vksession/index'>
				AR
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/sandbox/face-detect/index'>
				口红试色
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/sandbox/choose-poi/index'>
				poi选择
			</Navigator>
			<Navigator className='nav-buttons' url='/pages/sandbox/ocr/index'>
				OCR
			</Navigator>
			<TabBar current={1} />
		</View>
	);
}

