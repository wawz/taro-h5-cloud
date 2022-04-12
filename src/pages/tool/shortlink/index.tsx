/* eslint-disable import/first */
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { Button, View, Text } from '@tarojs/components';
import './index.scss';
import { ENDID } from '@/constants/cloud';

declare const wx: any;

/**
 * 云开发获取小程序短链
 */

export default function() {
	const [shortLink, setLink] = useState<string>('');

	function getShortLink(): void {
		Taro.showLoading({ title: '加载中', mask: true });
		wx.cloud
			.callFunction({
				name: 'quickstartFunctions',
				config: {
					env: ENDID,
				},
				data: {
					type: 'getShortlink',
					data: {
						pageUrl: 'pages/index/index?id=34',
						pageTitle: 'Hello Shortlink',
						isPermanent: false,
					},
				},
			})
			.then((resp) => {
				const { link, errCode, errMsg } = resp.result;
				let msg = link ? link : `errCode:${errCode},errMsg:${errMsg}`;
				setLink(msg);
				Taro.hideLoading();
			})
			.catch(() => {
				Taro.hideLoading();
			});
	}

	function copyLink(): void {
		Taro.setClipboardData({
			data: shortLink,
			success: () => {
				Taro.getClipboardData({
					success: function(res) {
						console.log(res.data);
						Taro.showToast({ title: '内容已复制', icon: 'none' });
					},
				});
			},
		});
	}

	return (
		<View className='qrcode-index page'>
			<View className='cont-wrap'>
				<Button className='namt-btn' onClick={getShortLink}>
					openapi.shortlink.generate
				</Button>
				<View className='title'>
					获取小程序 Short
					Link，适用于微信内拉起小程序的业务场景。目前只开放给电商类目。通过该接口，可以选择生成到期失效和永久有效的小程序短链。
				</View>
				{shortLink && (
					<View className='link-cont'>
						<View className='link-title'>shortlink:</View>
						<View>
							{shortLink}
							<Text className='copy-text' onClick={copyLink}>
								复制
							</Text>
						</View>
					</View>
				)}
			</View>
		</View>
	);
}
