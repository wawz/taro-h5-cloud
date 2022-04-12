import { useContext, useState } from 'react';
import { Button, View } from '@tarojs/components';
import HTTP from '@services/request';
import UserContext from '@contexts/UserContext';
import './index.scss';
import Taro from '@tarojs/taro';

export default function() {
	const { userData } = useContext(UserContext);
	const [phone, setPhone] = useState<number>();

	const handleGetPhoneNumber = async (e) => {
		if (e.detail?.code || (e.detail?.encryptedData && e.detail?.iv)) {
			let params: any = {
				encrypted_data: e.detail?.encryptedData,
				iv: e.detail?.iv,
			};
			if (e.detail?.code) {
				params = {
					code: e.detail.code,
				};
			}
			Taro.showLoading();
			await HTTP.post('/v1/customers/get-phone-number', {
				...params,
				customer_id: userData.id,
			})
				.then((res) => {
					console.log('-------------解码成功');
					console.log(res.data.phone_info);
					Taro.hideLoading();
					setPhone(res.data.phone_info.phoneNumber);
				})
				.catch((err) => {
					Taro.hideLoading();
				});
		}
	};

	return (
		<View className='index page'>
			<Button openType='getPhoneNumber' onGetPhoneNumber={handleGetPhoneNumber}>
				手机号授权
			</Button>
			{phone && <View>你的手机号：{phone}</View>}
		</View>
	);
}
