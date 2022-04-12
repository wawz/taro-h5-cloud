import { Button, Canvas, View } from '@tarojs/components';
import './index.scss';
import CustomNavbar, { useTransparentNavbar, NAVBAR_HEIGHT } from '@components/CustomNavbar';
import { fillTextarea, drawImage, getWechatAuth } from '@utils/methods';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import HTTP from '@services/request';
import GAService from '@services/ga.services';

async function handle401() {
	HTTP.get(`/v2/stores/1`)
		.then(() => console.log('1 then'))
		.catch(() => console.log('1 catch'))
		.finally(() => console.log('1 finally'));
	// HTTP.get(`/v2/stores/2`)
	// 	.then(() => console.log('2 then'))
	// 	.catch(() => console.log('2 catch'))
	// 	.finally(() => console.log('2 finally'));
}
async function handleHTTPTest() {
	const token = await Taro.login();
	HTTP.post('/v1/customers', { wechat_token: token.code }).then((res) => {
		console.log(new Date());
	});
}
export default function () {
	const transparentNav = useTransparentNavbar();

	useDidShow(() => {});
	useEffect(() => {}, []);

	return (
		<View className='index' style={{ padding: '20rpx' }}>
			<CustomNavbar transparent={transparentNav} backgroundColor='#ff0000' holdPlace={false}>
				<View>Logo，按钮，title 等</View>
			</CustomNavbar>
			<View
				style={{
					paddingTop: NAVBAR_HEIGHT + 'px',
				}}
			></View>

			<Button onClick={handle401}>401 测试</Button>
			<Button onClick={handleHTTPTest}>HTTP 测试</Button>
		</View>
	);
}
