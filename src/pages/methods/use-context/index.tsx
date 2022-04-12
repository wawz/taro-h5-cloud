import UserContext from '@contexts/UserContext';
import { Block, Button, Input, Picker, Swiper, SwiperItem, View } from '@tarojs/components';
import useForm from '@utils/hooks/useForm';
import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './index.scss';

function Child(props) {
	const user = useContext(UserContext);
	console.log('c redner');
	return <View>{user.userData.name}</View>;
}

export default function() {
	console.log('f render');

	return (
		<View>
			<Child></Child>
		</View>
	);
}
