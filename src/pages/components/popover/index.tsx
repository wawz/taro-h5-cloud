import { View } from '@tarojs/components';
import CustomNavbar from '@components/CustomNavbar';
import './index.scss';

const top: string[] = ['tl', 'top', 'tr'];
const left: string[] = ['left', 'lt', 'lb'];
const bottom: string[] = ['bl', 'bottom', 'br'];
const right: string[] = ['right', 'rt', 'rb'];

import Popover from '@components/Popover';
import './index.scss';
export default function() {
	return (
		<View className='popover'>
			<CustomNavbar holdPlace={true}>
				<View className='header'>popover Demos</View>
			</CustomNavbar>

			<View className='popover-block'>
				{left.map((item) => (
					<View className='popover-inner'>
						<Popover
							position={item}
							renderBody={<View className='popover-button'>{item.toLocaleUpperCase()}</View>}
							renderContent={<View className=''>我是{item}，请来替换我啊！</View>}
						/>
					</View>
				))}
			</View>

			<View className='popover-block'>
				{top.map((item) => (
					<View className='popover-inner'>
						<Popover
							position={item}
							renderBody={<View className='popover-button'>{item.toLocaleUpperCase()}</View>}
							renderContent={<View className=''>我是{item}，请来替换我啊！</View>}
						/>
					</View>
				))}
			</View>
			<View className='popover-block'>
				{bottom.map((item) => (
					<View className='popover-inner'>
						<Popover
							position={item}
							renderBody={<View className='popover-button'>{item.toLocaleUpperCase()}</View>}
							renderContent={<View className=''>我是{item}，请来替换我啊！</View>}
						/>
					</View>
				))}
			</View>
			<View className='popover-block'>
				{right.map((item) => (
					<View className='popover-inner'>
						<Popover
							position={item}
							renderBody={<View className='popover-button'>{item.toLocaleUpperCase()}</View>}
							renderContent={<View className=''>我是{item}，请来替换我啊！</View>}
						/>
					</View>
				))}
			</View>
		</View>
	);
}
