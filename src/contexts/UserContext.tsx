import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import HTTP from '@services/request';

type UserCtxValueType = {
	userData: any;
	login?: () => void;
	updateToken?: () => void;
};
const UserContext = React.createContext<UserCtxValueType>({
	userData: null,
	login: () => {
		console.log('login2n');
	},
	updateToken: () => {},
});
export default UserContext;
export function UserContextProvider(props) {
	const [user, setUser] = useState({ name: 'no login' });
	const login = async () => {
		const token = await Taro.login();
		await HTTP.post('/v1/customers', { wechat_token: token.code }).then((res) => {
			console.log('login in');
			setUser(res.data);
			Taro.setStorageSync('LOCAL_USER', res.data);
		});
	};
	const updateToken = () => {};
	return (
		<UserContext.Provider
			value={{
				userData: user,
				login,
				updateToken,
			}}
		>
			{props.children}
		</UserContext.Provider>
	);
}
