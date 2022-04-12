import Taro from '@tarojs/taro';
import React, { useState, useCallback, useEffect } from 'react';
import { Button, View, Image, Picker, Input } from '@tarojs/components';
import './index.scss';
import { ENDID } from '@/constants/cloud';
import useForm from '@utils/hooks/useForm';

declare const wx: any;

/**
 * 云开发获取小程序二维码
 * @param {string} scene // scene必填,其他属性非必填
 * @param {string} page // 扫码进入的小程序页面路径,如果不填写这个字段，默认跳主页面
 * @param {boolean} checkPath // 检查 page 是否存在,为 true 时 page 必须是已经发布的小程序存在的页面（否则报错）；为 false 时允许小程序未发布或者 page 不存在
 * @param {string} envVersion // 要打开的小程序版本。正式版为 release，体验版为 trial，开发版为 develop
 * @param {number} width // 二维码的宽度，单位 px。最小 280px，最大 1280px
 * @param {boolean} autoColor // 是否自动配置线条颜色
 * @param {object} lineColor // auto_color 为 false 时生效，使用 rgb 设置颜色
 * @param {boolean} isHyaline // 是否需要透明底色
 */

const ChildInput = React.memo((props: any) => {
	return (
		<View className='input-wrapper'>
			<View className='input-wrapper__label'>{props.label}</View>
			<Input
				maxlength={props.maxlength}
				className={`input-wrapper__field ${props.error ? 'error' : ''}`}
				value={props.value}
				onInput={props.onInput}
				placeholder={props.placeholder}
			></Input>
			{props.errorMsg?.map((msg) => (
				<View className='input-wrapper__errmsg'>{msg}</View>
			))}
		</View>
	);
});
const ChildPicker = React.memo((props: any) => {
	return (
		<View className='picker-wrapper'>
			<View className='picker-wrapper__label'>{props.label}</View>
			<Picker className='picker-wrapper__cont' onChange={props.onChange} range={props.range}>
				<View class='picker-wrapper__text'>{props.range[props.value] || props.placeholder}</View>
			</Picker>
		</View>
	);
});
const ChildRadio = React.memo((props: any) => {
	return (
		<View className='radio-wrapper'>
			<View
				onClick={props.RadioOne.onClick}
				className={`radio ${props.value === props.RadioOne.value ? 'active' : ''}`}
			>
				{props.RadioOne.text}
			</View>
			<View
				onClick={props.RadioTwo.onClick}
				className={`radio ${props.value === props.RadioTwo.value ? 'active' : ''}`}
			>
				{props.RadioTwo.text}
			</View>
		</View>
	);
});
const envVersionArr: string[] = ['release', 'trial', 'develop'];
const releasePageArr: string[] = [
	'pages/landing/index',
	'pages/index/index',
	'pages/result/index',
	'pages/aboutus/index',
];
const trialPageArr: string[] = [
	'pages/landing/index',
	'pages/index/index',
	'pages/result/index',
	'pages/aboutus/index',
	'pages/web-view/index',
];
const dvpPageArr: string[] = [
	'pages/landing/index',
	'pages/index/index',
	'pages/result/index',
	'pages/aboutus/index',
	'pages/web-view/index',
	'pages/tool/qrcode/index',
];
const widthArr: number[] = [280, 400, 600, 1000, 1280];

export default function() {
	const [codeImg, setCodeImg] = useState<string>('');
	const [errMsg, setErrMsg] = useState<string>('');

	const { formData, register, formErrors, resetForm } = useForm(
		{
			scene: '',
			checkPath: 2,
			isHyaline: 2,
			width: '0',
			envVersion: '0',
			pageIpt: '',
			pageResIdx: '',
			pageTalIdx: '',
			pageDvpIdx: '',
		},
		{}
	);

	const getUnlimitedQRCode = (): void => {
		const reg = /^(\d|[A-Z]|[a-z]|[\-!#$'*()+~:,=_.@]){1,32}$/;
		if (!(formData.scene && reg.test(formData.scene))) {
			Taro.showToast({ title: 'scene必填,输入不合法', icon: 'none' });
			return;
		}
		if (
			formData.checkPath === 1 &&
			((formData.envVersion === '0' && formData.pageResIdx === '') ||
				(formData.envVersion === '1' && formData.pageTalIdx === '') ||
				(formData.envVersion === '2' && formData.pageDvpIdx === ''))
		) {
			Taro.showToast({ title: '请选择小程序路径', icon: 'none' });
			return;
		}
		Taro.showLoading({ title: '加载中', mask: true });
		wx.cloud
			.callFunction({
				name: 'quickstartFunctions',
				config: {
					env: ENDID,
				},
				data: {
					type: 'getUnlimited',
					data: {
						scene: formData.scene,
						page:
							formData.checkPath === 2
								? formData.pageIpt
								: formData.envVersion === '0' && formData.pageResIdx !== ''
								? releasePageArr[formData.pageResIdx]
								: formData.envVersion === '1' && formData.pageTalIdx !== ''
								? trialPageArr[formData.pageTalIdx]
								: formData.envVersion === '2' && formData.pageDvpIdx !== ''
								? dvpPageArr[formData.pageDvpIdx]
								: '',
						width: widthArr[formData.width],
						checkPath: formData.checkPath === 1,
						envVersion: envVersionArr[formData.envVersion],
						isHyaline: formData.isHyaline === 1,
					},
				},
			})
			.then((resp) => {
				console.log(resp, 'resp====>');
				const { buffer, errCode, errMsg: msg, contentType } = resp.result;
				if (errCode) {
					setErrMsg(msg);
					setCodeImg('');
					Taro.hideLoading();
					return;
				}
				setErrMsg('');
				let bufferImg = 'data:' + 'image/png' + ';base64,' + wx.arrayBufferToBase64(buffer);
				setCodeImg(bufferImg);
				Taro.hideLoading();
			})
			.catch((err) => {
				console.log(err, 'err====>');
				Taro.hideLoading();
			});
	};

	const previewImg = (): void => {
		Taro.previewImage({
			urls: [codeImg],
		});
	};

	const envVersionHandler = (v: string): void => {
		register('envVersion', { value: v })();
		// if (Number(v) === 2) {
		// 	checkPathHandler(2); // envVersion -> checkPath true;
		// }
	};

	const checkPathHandler = (v): void => {
		register('checkPath', { value: v })();
		// if (v === 1) envVersionHandler('0');
	};

	return (
		<View className='qrcode-index page'>
			<View>
				<ChildInput
					value={formData.scene}
					label="scene:只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~"
					maxlength={32}
					placeholder='请输入scene'
					error={formErrors.has('scene')}
					errorMsg={formErrors.get('scene')}
					onInput={register('scene', 'detail.value')}
				></ChildInput>
				<ChildPicker
					value={formData.width}
					label='width'
					range={widthArr}
					placeholder='请选择宽度'
					onChange={register('width', 'detail.value')}
				></ChildPicker>
				<ChildRadio
					value={formData.isHyaline}
					RadioOne={{
						value: 1,
						text: '需要透明底色',
						onClick: register('isHyaline', { value: 1 }),
					}}
					RadioTwo={{
						value: 2,
						text: '不需要透明底色',
						onClick: register('isHyaline', { value: 2 }),
					}}
				></ChildRadio>
				<ChildRadio
					value={formData.checkPath}
					RadioOne={{
						value: 1,
						text: '必须是已经发布的小程序存在的页面',
						onClick: () => checkPathHandler(1),
					}}
					RadioTwo={{
						value: 2,
						text: '允许小程序未发布或者page不存在',
						onClick: () => checkPathHandler(2),
					}}
				></ChildRadio>
				<ChildPicker
					value={formData.envVersion}
					label='envVersion'
					range={envVersionArr}
					onChange={(e) => envVersionHandler(e.detail.value)}
				></ChildPicker>
				{formData.checkPath === 1 && (
					<View style={{ margin: '-10px auto 10px' }}>
						<View className='title tips'>pages/web-view/index page only exist in the trial</View>
						<View className='title tips'>
							pages/tool/qrcode/index page only exist in the develop
						</View>
					</View>
				)}
				{/* checkPath === true -> Page is a select */}
				{formData.envVersion === '0' && formData.checkPath === 1 && (
					<ChildPicker
						value={formData.pageResIdx}
						label='page'
						range={releasePageArr}
						placeholder='请选择正式版小程序路径'
						onChange={register('pageResIdx', 'detail.value')}
					></ChildPicker>
				)}
				{formData.envVersion === '1' && formData.checkPath === 1 && (
					<ChildPicker
						value={formData.pageTalIdx}
						label='page'
						range={trialPageArr}
						placeholder='请选择体验版小程序路径'
						onChange={register('pageTalIdx', 'detail.value')}
					></ChildPicker>
				)}
				{formData.envVersion === '2' && formData.checkPath === 1 && (
					<ChildPicker
						value={formData.pageDvpIdx}
						label='page'
						range={dvpPageArr}
						placeholder='请选择开发版小程序路径'
						onChange={register('pageDvpIdx', 'detail.value')}
					></ChildPicker>
				)}
				{/* checkPath === false -> Page is a simple input */}
				{formData.checkPath === 2 && (
					<ChildInput
						value={formData.pageIpt}
						label='page'
						placeholder='请输入小程序路径'
						onInput={register('pageIpt', 'detail.value')}
					></ChildInput>
				)}
			</View>
			<View className='cont-wrapper'>
				<Button className='namt-btn' onClick={resetForm}>
					重置内容
				</Button>

				<Button className='namt-btn' onClick={getUnlimitedQRCode}>
					openapi.wxacode.getUnlimited
				</Button>

				<View className='title'>获取小程序码,支持特定scene传参，无次数限制</View>
				{errMsg && <View className='title tips'>{errMsg}</View>}
				<View className='img-box'>
					{codeImg && (
						<Image
							mode='aspectFit'
							className='code-img'
							src={codeImg}
							showMenuByLongpress
							onClick={previewImg}
						/>
					)}
				</View>
			</View>
		</View>
	);
}
