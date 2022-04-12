import { Block, Button, Input, Picker, Swiper, SwiperItem, View } from '@tarojs/components';
import useForm from '@utils/hooks/useForm';
import React from 'react';
import { useState } from 'react';
import './index.scss';

const Child = React.memo((props: any) => {
	console.log('child render');
	return (
		<View className='input-wrapper'>
			<View className='input-wrapper__label'>{props.label}</View>
			<Input
				className={`input-wrapper__field ${props.error ? 'error' : ''}`}
				value={props.value}
				onInput={props.onInput}
			></Input>
			{props.errorMsg?.map((msg) => (
				<View className='input-wrapper__errmsg'>{msg}</View>
			))}
		</View>
	);
});
export default function () {
	const { formData, register, formErrors, resetForm } = useForm(
		{
			firstName: '',
			lastName: '77889',
			gender: 1,
			address: {
				street: '',
			},
			option: 0,
		},
		{
			'firstName': (value) => {
				if (value.length === 0) return '不能为空';
			},
			'lastName': [
				(value) => {
					if (value.length === 0) return '不能为空';
				},
				(value, formData) => {
					if (value === 'abc' && formData?.gender === 2) return '女性不能叫abc';
				},
			],
			'address.street': (v) => {
				if (v === '0') return 'street 不能为空';
			},
		}
	);
	function submitForm() {
		console.log(formData);
		console.log(formErrors);
	}
	return (
		<View className='cb-list'>
			<Child
				value={formData.firstName}
				label={'first name'}
				error={formErrors.has('firstName')}
				errorMsg={formErrors.get('firstName')}
				onInput={register('firstName', 'detail.value')}
			></Child>
			<Child
				value={formData.lastName}
				label={'last name'}
				error={formErrors.has('lastName')}
				errorMsg={formErrors.get('lastName')}
				onInput={register('lastName', 'detail.value')}
			></Child>
			<View
				onClick={register('gender', { value: 1 })}
				className={`radio ${formData.gender === 1 ? 'active' : ''}`}
			>
				男
			</View>
			<View
				onClick={register('gender', { value: 2 })}
				className={`radio ${formData.gender === 2 ? 'active' : ''}`}
			>
				女
			</View>
			<Child
				label={'address street'}
				value={formData.address.street}
				error={formErrors.has('address.street')}
				errorMsg={formErrors.get('address.street')}
				onInput={register('address.street', 'detail.value')}
			></Child>
			<Swiper className='swiper' onChange={register('option', 'detail.current')}>
				<SwiperItem>OPTION1</SwiperItem>
				<SwiperItem>OPTION2</SwiperItem>
				<SwiperItem>OPTION3</SwiperItem>
			</Swiper>
			<Button onClick={submitForm}>提交表单</Button>
			<Button onClick={resetForm}>重置表单</Button>
		</View>
	);
}
