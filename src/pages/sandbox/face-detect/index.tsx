import { useEffect, useState, useRef, useCallback } from 'react';
import { Button, View, Camera, Canvas } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';

declare const wx: any;
/*
pointArray数值代表
0-32 脸部轮廓
33-37 左眉上轮廓
64-67 左眉下轮廓
38-42 右眉上轮廓
68-71 右眉下轮廓

52-57 左眼轮廓
58-63 右眼轮廓

43-46 鼻梁
47-51 鼻子下缘
78-83 每个一点分辨是鼻子左右轮廓
84-90 上唇上沿
91-95 下唇下沿
96-100 上唇下沿
101-103 下唇上沿

104左眼瞳孔， 105右眼瞳孔

72 左眼上眼睑最高点，73左眼下眼睑最低点 74 左眼轮廓中心
75 左眼上眼睑最高点，76 左眼下眼睑最低点 77 左眼轮廓中心
 */

function initFaceDetect(): Promise<null> {
	return new Promise((resolve, reject) => {
		wx.initFaceDetect({
			success: resolve,
			fail: reject,
		});
	});
}
let ctx: any = undefined;
let frameWidth = 480;
let frameHeight = 640;

const CANVAS_WIDTH = 375;
const CANVAS_HEIGHT = 375;
const colorList = ['rgba(179, 88, 103, .6)', '#a54b49', '#bc6470', 'rgba(169, 233, 122, .3)'];
export default function Index() {
	const [showCamera, setShowCamera] = useState<boolean>(false);
	const [detectorReady, setDetectorReady] = useState<boolean>(false);
	const [detectResult, setDetectResult] = useState<string>('');
	const [selectColor, setSelectColor] = useState<string>(colorList[0]);
	const cameraFrameListener = useRef<any>();
	const cameraContext = useRef<any>();
	const canvasRef = useRef<any>(undefined);
	useEffect(() => {
		//初始化一次
		initFaceDetect().then(() => setDetectorReady(true));
		Taro.nextTick(() => {
			const query = Taro.createSelectorQuery();
			query
				.select('#testCanvas')
				.node((res) => {
					canvasRef.current = res.node;
					canvasRef.current.width = CANVAS_WIDTH;
					canvasRef.current.height = CANVAS_HEIGHT;
					ctx = canvasRef.current.getContext('2d');
				})
				.exec();
		});
		return () => {
			//清除函数
			try {
				wx.stopFaceDetect();
				cameraFrameListener.current?.stop();
				cameraFrameListener.current = null;
				cameraContext.current = null;
			} catch (error) {}
		};
	}, []);
	const handleClickDetect = () => {
		setShowCamera(true);
		startFaceDetect();
	};
	const detectionErrHandler = useCallback((err) => {
		setDetectResult(err.errMsg);
	}, []);
	const drawPortrait = useCallback(
		(canvas: any, pointArray: any[]) => {
			const offsetY = (frameHeight - frameWidth) / 2;
			const ratio = canvas.width / frameWidth || 1;
			ctx.clearRect(0, 0, canvas?.width, canvas?.height);
			pointArray.forEach((value) => {
				value.x = value.x * ratio;
				value.y = (value.y - offsetY) * ratio;
			});

			const targetArr = pointArray.slice(84, 96);
			const start = targetArr.shift();
			// ctx.fillStyle = 'rgba(200,16,90,0.8)';
			ctx.fillStyle = selectColor;
			ctx.beginPath();
			ctx.moveTo(start.x, start.y);
			targetArr.forEach((position) => {
				ctx.lineTo(position.x, position.y);
			});
			ctx.lineTo(start.x, start.y);
			ctx.closePath();
			ctx.fill();

			ctx.save();
			const innerArr = pointArray.slice(96, 104);
			const innerStart = innerArr.shift();
			ctx.beginPath();
			ctx.moveTo(innerStart.x, innerStart.y);
			innerArr.forEach((position) => {
				ctx.lineTo(position.x, position.y);
			});
			ctx.lineTo(innerStart.x, innerStart.y);
			ctx.closePath();
			ctx.clip();
			ctx.clearRect(0, 0, canvas?.width, canvas?.height);
			ctx.restore();
		},
		[selectColor]
	);
	const faceDetectHandler = useCallback(
		(faceData) => {
			setDetectResult('检测到人脸');
			drawPortrait(canvasRef.current, faceData?.pointArray || []);
		},
		[drawPortrait]
	);
	const cameraFrameHandler = useCallback(
		(frame) => {
			frameWidth = frame.width;
			frameHeight = frame.height;
			wx.faceDetect({
				frameBuffer: frame.data,
				width: frame.width,
				height: frame.height,
				enablePoint: true,
				// enableConf: true,
				// enableAngle: true,
				// enableMultiFace: true,
				success: faceDetectHandler,
				fail: detectionErrHandler,
			});
		},
		[faceDetectHandler]
	);

	useEffect(() => {
		if (cameraContext.current && cameraFrameListener.current) {
			cameraFrameListener.current?.stop();
			cameraFrameListener.current = cameraContext.current?.onCameraFrame(cameraFrameHandler);
			cameraFrameListener.current.start();
		}
	}, [cameraFrameHandler]);
	const startFaceDetect = useCallback(() => {
		// 获取并缓存唯一的相机上下文
		if (!cameraContext.current) cameraContext.current = wx.createCameraContext();
		// 监听并缓存唯一的相机帧回调，以便后续清除
		cameraFrameListener.current = cameraContext.current?.onCameraFrame(cameraFrameHandler);
		cameraFrameListener.current.start();
	}, []);

	return (
		<View className='face-page'>
			{showCamera ? (
				<View>
					<Camera
						className='camera'
						devicePosition='front'
						resolution='high'
						style='width: 375px; height: 375px;'
					></Camera>
					<View>{detectResult}</View>
					<View>试色卡{selectColor}</View>
					<View className='colorList'>
						{colorList.map((color) => (
							<View
								className={`colorItem ${selectColor == color ? 'selectedColor' : ''}`}
								style={{ background: color }}
								onClick={() => setSelectColor(color)}
							></View>
						))}
					</View>
					{/* <Button className='detectButton' onClick={handleCancelDetect}>
						取消人脸识别
					</Button> */}
				</View>
			) : detectorReady ? (
				<Button className='detectButton' onClick={handleClickDetect}>
					开始识别
				</Button>
			) : (
				<Button className='detectButton' disabled>
					人脸识别初始化失败
				</Button>
			)}
			<Canvas
				type='2d'
				style={{ width: '375px', height: '375px', position: 'absolute', top: 0 }}
				id='testCanvas'
				canvasId='testCanvas'
			></Canvas>
		</View>
	);
}
