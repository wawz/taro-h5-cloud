import { Button, Canvas, View } from '@tarojs/components';
import './index.scss';
import { getWechatAuth } from '@utils/methods';
import { useEffect } from 'react';
import Taro from '@tarojs/taro';

function handleClick() {
	getWechatAuth({
		scope: 'scope.writePhotosAlbum',
		onAgree: () => Taro.showToast({ title: '用户一下子就同意了', icon: 'none' }),
		onReject: () => Taro.showToast({ title: '用户瞬间就拒绝了', icon: 'none' }),
	});
}
function handleForceClick() {
	getWechatAuth({
		scope: 'scope.writePhotosAlbum',
		forceMsg: '需要授权相册权限才能继续哦',
	})
		.then(() => Taro.showToast({ title: '用户终于同意了' }))
		.catch(() => Taro.showToast({ title: '用户还是没同意', icon: 'none' }));
}

export default function () {
	useEffect(() => {}, []);

	return (
		<View className='index page'>
			<View>用户的授权记录会被长久保存，重新测试需要在开发工具中清除用户的授权缓存</View>
			<Button onClick={handleClick}>非强制授权writePhotosAlbum</Button>
			<Button onClick={handleForceClick}>强制授权writePhotosAlbum</Button>
		</View>
	);
}
