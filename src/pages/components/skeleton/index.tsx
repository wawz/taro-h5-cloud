import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import CustomNavbar from '@components/CustomNavbar';
import Skeleton from '@components/Skeleton';
import './index.scss';

export default function Index() {
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	}, []);
	return (
		<View className='skeleton-page'>
			<Skeleton
				className='skeleton__header-navbar'
				contentPD={{ paddingTop: '48px', paddingBottom: '8px' }}
				row={1}
				rowProps={{
					width: '50%',
					height: 32,
				}}
				loading={loading}
			>
				<CustomNavbar holdPlace={true}>
					<View className='header'>Skeleton Demos</View>
				</CustomNavbar>
			</Skeleton>

			<View>Rect, 设置Rect 尺寸</View>
			<Skeleton
				rect
				contentPD={{ padding: '10px 0' }}
				rectSize={{ width: '100%', height: '100px' }}
			/>

			<View>Row 分别设置每行宽度（设置占位图背景色、 Row对齐方式）</View>
			<Skeleton row={2} />
			<Skeleton row={2} bgColor={'#ff0e0020'} rowWidth={['60%', '80%']} rowAlignStyle='right' />
			<Skeleton row={2} rowWidth={['70%', '100%']} rowHeight={42} />

			<View>Row, Avatar, 按 row 方式排列（设置Avatar 尺寸， 形状）</View>
			<Skeleton avatar />
			<Skeleton avatar avatarShape='square' avatarSize={50} row={3} />

			<View>Row, Avatar, 按 column 方式排列</View>
			<Skeleton type='column' avatar avatarSize={35} row={1} />
			<Skeleton type='column' avatar avatarSize={35} row={1} />
			<Skeleton type='column' avatar avatarSize={35} row={1} />

			<View>Action， 并设置操作按钮占位图尺寸</View>
			<Skeleton row={2} action />
			<Skeleton row={2} rowWidth={['70%', '100%']} action actionSize={{ width: 40, height: 24 }} />

			<View>animate, animateName, animateDuration, 设置动画类型、时间</View>
			<Skeleton row={3} animate />
			<Skeleton row={3} animateName='elastic' />
			<Skeleton row={3} animateName='elastic' animateDuration={3} />
		</View>
	);
}
