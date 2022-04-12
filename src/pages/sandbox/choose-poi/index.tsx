import Taro from '@tarojs/taro';
import { useState, useCallback } from 'react';
import { Button, View } from '@tarojs/components';
import './index.scss';

declare const wx: any;

/**
 * wx.choosePoi 打开POI列表选择位置，支持模糊定位（精确到市）和精确定位混选
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.choosePoi.html
 * @returns success return object
 * @param {number} type 选择城市时, 值为1; 选择精确位置时, 值为2; 选择不显示位置时, 值为0
 * @param {string} city 城市名称, type为1时返回
 * @param {string} name 位置名称, type为2时返回
 * @param {string} address 详细地址, type为2时返回【特殊情况：在POI列表新增地址时, 不返回address】
 * @param {number} latitude 纬度, type为2时返回 浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系
 * @param {number} longitude 经度, type为2时返回 浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系
 */

interface poiResult {
	type: number;
	city?: string;
	name?: string;
	address?: string;
	latitude?: number;
	longitude?: number;
	latText?: string;
	lgtText?: string;
}

export default function() {
	// 用户是否开启定位过
	const [userPoi, setUserPoi] = useState<string>('');
	// poiType:wx.choosePoitype返回的type
	const [poiType, setPoiType] = useState<number>(-1);
	const [userPoiObj, setUserPoiObj] = useState<poiResult | null>(null);

	const choosePoi = () => {
		wx.choosePoi({
			success: function(res) {
				const { type, name, city, latitude, longitude } = res;
				const poi = type === 1 ? city : type === 2 ? name : undefined;
				const latText = `${latitude < 0 ? '南纬: ' : '北纬: '}${Math.abs(latitude)}`;
				const lgtText = `${longitude < 0 ? '西经: ' : '东经: '}${Math.abs(longitude)}`;
				setUserPoi(poi);
				setPoiType(type);
				setUserPoiObj({ ...res, latText, lgtText });
			},
			fail: function(res) {
				const { errMsg } = res;
				if (errMsg === 'choosePoi:fail cancel') {
					// Taro.showToast({ title: '取消定位', icon: 'none' });
				} else {
					Taro.showToast({ title: '发生错误,请重新尝试', icon: 'none' });
				}
			},
		});
	};

	const openPoi = () => {
		wx.openLocation({
			latitude: userPoiObj?.latitude,
			longitude: userPoiObj?.longitude,
			name: userPoiObj?.name,
		});
	};

	return (
		<View className='index page'>
			<Button className='base-btn' onClick={choosePoi}>
				{!userPoi && '点击按钮选择你的定位'}
				{!!userPoi && '点击按钮更改你的定位'}
			</Button>
			<View className='content'>
				{poiType === 0 && '不显示位置'}
				{poiType === 1 && `你选择的城市是: ${userPoi}`}
				{poiType === 2 && `你选择的定位是: ${userPoi}`}
			</View>
			{userPoiObj && userPoiObj.latitude && (
				<View className='address'>
					{userPoiObj.address && <View>地址：{userPoiObj.address}</View>}
					<View>{userPoiObj.latText}</View>
					<View>{userPoiObj.lgtText}</View>
					<Button className='base-btn small-size mt-20' onClick={openPoi}>
						定位到此地点
					</Button>
				</View>
			)}
			<View className='tips'>仅支持真机选择定位，开发者工具暂不支持。</View>
		</View>
	);
}
