import { Button, View, Picker, Image, Block } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

import { ENDID, CLOUN_ERRMSG_OBJ } from '@constants/cloud';
import { bankcardType, businessLicenseType, idcardType, printedTextType } from './type.d';

interface objParamType {
	label: string;
	key: string;
}
type ocrFncType = 'getOCRBankcard' | 'getOCRBusinessLicense' | 'getOCRIdcard' | 'getOCRPrintedText';
type ocrResType = bankcardType | businessLicenseType | idcardType | printedTextType;

const busLcsObj: objParamType[] = [
	{
		label: '注册号',
		key: 'regNum',
	},
	{
		label: '编号',
		key: 'serial',
	},
	{
		label: '法定代表人姓名',
		key: 'legalRepresentative',
	},
	{
		label: '企业名称',
		key: 'enterpriseName',
	},
	{
		label: '组成形式',
		key: 'typeOfOrganization',
	},
	{
		label: '经营场所/企业住所',
		key: 'address',
	},
	{
		label: '公司类型',
		key: 'typeOfEnterprise',
	},
	{
		label: '经营范围',
		key: 'businessScope',
	},
	{
		label: '注册资本',
		key: 'registeredCapital',
	},
	{
		label: '实收资本',
		key: 'paidInCapital',
	},
	{
		label: '营业期限',
		key: 'validPeriod',
	},
	{
		label: '注册日期/成立日期',
		key: 'registeredDate',
	},
];
const idcardOBj: objParamType[] = [
	{
		label: '住址',
		key: 'addr',
	},
	{
		label: '生日',
		key: 'birth',
	},
	{
		label: '身份证第几代',
		key: 'cardProperty',
	},
	{
		label: '性别',
		key: 'gender',
	},
	{
		label: '身份证号',
		key: 'id',
	},
	{
		label: '姓名',
		key: 'name',
	},
	{
		label: '民族',
		key: 'nationality',
	},
];
const ocrTypeRange: string[] = [
	'ocr.bankcard',
	'ocr.businessLicense',
	'ocr.idcard',
	'ocr.printedText',
];

const ocrFncData: ocrFncType[] = [
	'getOCRBankcard',
	'getOCRBusinessLicense',
	'getOCRIdcard',
	'getOCRPrintedText',
];
const exampleImgUrls: string[][] = [
	[
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/bk-1.png',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/bk-2.jpeg',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/bk-3.jpeg',
	],
	[
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/bl-1.png',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/bl-2.jpeg',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/bl-3.jpeg',
	],
	[
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/id-b-1.jpeg',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/id-f-1.jpeg',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/id-f-2.jpeg',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/id-f-3.jpeg',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/id-f-4.jpeg',
	],
	[
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/pt-1.jpeg',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/pt-2.png',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/pt-3.jpeg',
		'https://636c-cloud1-3g4eupn4d01f54c5-1310105033.tcb.qcloud.la/imgs/tmp/pt-4.png',
	],
];

const apiErrMsgObj: object = {
	'-1': '系统错误，请稍后重试',
	'101000': '图片URL错误或拉取URL图像错误',
	'101001': '图片中无法找到证件',
	'101002': '图片数据无效',
};

const maxSize: number = 1024 * 1024 * 2; // 图片上传最大尺寸
const eftTime: number = 60 * 60 * 24; // 图片的访问有效期

export default function GetOCRMsg() {
	const [orcType, setOrcType] = useState<number>(0);
	const [tempFileUrl, setTempFileUrl] = useState<string>('');
	const [cont, setCont] = useState<ocrResType>({});
	const [showCont, setShowCont] = useState<boolean>(false);
	const [chooseType, setChooseType] = useState<number>(1);
	const [imgChoosed, setImgChoosed] = useState<string>('');

	const handleTypeChange = (e): void => {
		const { value: v } = e.detail;
		if (orcType !== Number(v)) {
			setShowCont(false);
		}
		setOrcType(Number(v));
	};

	const handleImgUpload = async (): Promise<void> => {
		const imgResult = await Taro.chooseMedia({
			count: 1,
			mediaType: ['image'],
			sourceType: ['album', 'camera'],
			camera: 'back',
		});
		console.log(imgResult, 'imgresult====>');
		const { tempFiles = [] } = imgResult;
		if (tempFiles[0].size > maxSize) {
			Taro.showToast({
				title: '图片要小于2M哦',
				icon: 'none',
			});
		} else {
			setTempFileUrl(tempFiles[0].tempFilePath);
		}
	};

	/**
	 * ocr需要使用可下载图片, 需将本地临时图片传入云数据库，再获取云数据库对应图片的临时(可自由设置有效时间:maxAge)线上可下载地址
	 * @returns
	 */
	const getDowLoadUrl = async (): Promise<string | boolean> => {
		const uploadResult = await wx.cloud.uploadFile({
			filePath: tempFileUrl,
			cloudPath: 'imgs/' + tempFileUrl.split('http://')[1],
		});
		if (!uploadResult.fileID) {
			Taro.hideLoading();
			Taro.showToast({
				title: '图片上传失败,请重新尝试',
				icon: 'none',
			});
			return false;
		}
		const getTmpResult = await wx.cloud.getTempFileURL({
			fileList: [
				{
					fileID: uploadResult.fileID,
					maxAge: eftTime,
				},
			],
		});
		if (getTmpResult.fileList[0].status === 0) {
			return getTmpResult.fileList[0].tempFileURL;
		} else {
			Taro.showToast({
				title: '图片上传失败,请重新尝试',
				icon: 'none',
			});
		}
		Taro.hideLoading();
		return false;
	};

	const handleImgPreview = (): void => {
		Taro.previewImage({
			urls: [tempFileUrl],
		});
	};

	const handleImgOcr = async (): Promise<any> => {
		setShowCont(false);
		Taro.showLoading({ title: 'checking', mask: true });
		if ((!tempFileUrl && chooseType === 2) || (chooseType === 1 && !imgChoosed)) {
			Taro.hideLoading();
			Taro.showToast({
				title: '未选择图片无法检测哦',
				icon: 'none',
			});
			return false;
		}
		// 获取临时路径的可下载线上地址URL
		const url = chooseType === 1 ? imgChoosed : await getDowLoadUrl();
		console.log(url, 'url===>');
		if (!!url) {
			const ocrResult = await wx.cloud.callFunction({
				name: 'quickstartFunctions',
				config: {
					env: ENDID,
				},
				data: {
					type: ocrFncData[orcType],
					data: {
						imgUrl: url,
					},
				},
			});
			Taro.hideLoading();
			const { result, errMsg } = ocrResult;
			console.log(ocrResult);
			setCont({ errMsg, ...result });
			setShowCont(true);
		}
	};

	const handleChooseType = (type: number): void => {
		if (type !== chooseType) {
			setCont({});
			setShowCont(false);
		}
		setChooseType(type);
	};

	const chooseEmpImg = (item: string): void => {
		Taro.previewImage({
			current: item,
			urls: exampleImgUrls[orcType],
		});
	};

	return (
		<View className='ocr-index page'>
			<View className='tips'>接口限制: 免费次数限制为100次/天。</View>
			<View className='picker-wrapper'>
				<View className='picker-wrapper__label'>OCR类型</View>
				<Picker className='picker-wrapper__cont' onChange={handleTypeChange} range={ocrTypeRange}>
					<View class='picker-wrapper__text'>{ocrTypeRange[orcType] || '请选择请选择OCR类型'}</View>
				</Picker>
			</View>
			<View className='choose-wrapper'>
				<View
					onClick={() => handleChooseType(1)}
					className={`choose-wrapper__radio ${chooseType === 1 && 'active'}`}
				>
					使用示例图片
				</View>
				<View
					onClick={() => handleChooseType(2)}
					className={`choose-wrapper__radio ${chooseType === 2 && 'active'}`}
				>
					使用上传图片
				</View>
			</View>
			{chooseType === 1 && (
				<View className='example-wrapper'>
					<View className='example-wrapper__title'>你可以选择下列图片进行测试</View>
					<View className='example-wrapper__flexbox'>
						{exampleImgUrls[orcType].map((item) => (
							<View className={`flexbox__cont ${imgChoosed === item && 'active'}`}>
								<Image
									onClick={() => chooseEmpImg(item)}
									mode='aspectFit'
									className='flexbox__cont__img'
									src={item}
								/>
								<View className={`flexbox__cont__label `} onClick={() => setImgChoosed(item)}>
									{imgChoosed !== item ? '点击此处选择图片' : '已选中该图片'}
								</View>
							</View>
						))}
					</View>
				</View>
			)}
			{chooseType === 2 && (
				<View className='photo-wrapper'>
					<View onClick={handleImgUpload} className='photo-wrapper__title'>
						点击上传图片(图片size需小于2M哦)
					</View>
					{tempFileUrl && (
						<Image
							mode='aspectFit'
							onClick={handleImgPreview}
							className='photo-wrapper__img'
							src={tempFileUrl}
						/>
					)}
				</View>
			)}
			<Button onClick={handleImgOcr}>check</Button>
			<View className='result-wrapper'>
				{cont.errCode !== 0 && showCont && (
					<View className='result-wrapper__box'>
						<View className='result-wrapper__error'>errCode: {cont.errCode}</View>
						<View className='result-wrapper__error'>
							errMsg: {apiErrMsgObj[cont.errCode] || CLOUN_ERRMSG_OBJ[cont.errCode] || cont.errMsg}
						</View>
					</View>
				)}
				{cont.errCode === 0 && showCont && (
					<View className='result-wrapper'>
						{orcType === 0 && cont && (
							<View className='result-wrapper__row'>银行卡号: {cont.number}</View>
						)}
						{orcType === 1 && cont && (
							<View>
								{busLcsObj.map((item) => (
									<View className='result-wrapper__row'>
										{item.label}: {cont[item.key]}
									</View>
								))}
								<View className='result-wrapper__row'>营业执照位置 :</View>
								<View className='result-wrapper__row'>
									leftBottom: x:{cont.certPosition?.pos.leftBottom.x} y:
									{cont.certPosition?.pos.leftBottom.y}
								</View>
								<View className='result-wrapper__row'>
									leftTop: x:{cont.certPosition?.pos.leftTop.x} y:{cont.certPosition?.pos.leftTop.y}
								</View>
								<View className='result-wrapper__row'>
									rightBottom: x:{cont.certPosition?.pos.rightBottom.x} y:
									{cont.certPosition?.pos.rightBottom.y}
								</View>
								<View className='result-wrapper__row'>
									rightTop x:{cont.certPosition?.pos.rightTop.x} y:
									{cont.certPosition?.pos.rightTop.y}
								</View>
								<View className='result-wrapper__row'>
									图片尺寸：width: {cont.imgSize?.w} height: {cont.imgSize?.h}
								</View>
							</View>
						)}
						{orcType === 2 && cont && (
							<Block>
								<View className='result-wrapper__row'>
									该图片是身份证{cont.type === 'Front' ? '正面' : '反面'}
								</View>
								{cont.type === 'Front' ? (
									idcardOBj.map((item) => (
										<View className='result-wrapper__row'>
											{item.label}: {cont[item.key]}
										</View>
									))
								) : (
									<View className='result-wrapper__row'>身份证有效期: {cont.validDate}</View>
								)}
							</Block>
						)}
						{orcType === 3 && cont && (
							<Block>
								{cont.items.length > 0 &&
									cont.items.map((item, index) => (
										<View className='result-wrapper__row'>
											<View>
												{index + 1}、cont:{item.text}
											</View>
											<View>{index + 1}、pos:</View>
											<View>
												leftBottom: x:{item.pos.leftBottom.x} y:{item.pos.leftBottom.y}
											</View>
											<View>
												leftTop: x:{item.pos.leftTop.x} y:{item.pos.leftTop.y}
											</View>
											<View>
												rightBottom: x:{item.pos.rightBottom.x} y:{item.pos.rightBottom.y}
											</View>
											<View>
												rightTop x:{item.pos.rightTop.x} y:{item.pos.rightTop.y}
											</View>
										</View>
									))}
								<View className='result-wrapper__row'>
									图片尺寸：width: {cont.imgSize?.w} height: {cont.imgSize?.h}
								</View>
							</Block>
						)}
					</View>
				)}
			</View>
		</View>
	);
}
