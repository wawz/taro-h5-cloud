// import OrbitControls from '../../lib/jsm/controls/OrbitControls.js';
import { createScopedThreejs } from 'threejs-miniprogram';
import { registerGLTFLoader } from '../../../lib/gltf-loader';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button, View, Camera, Canvas } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';

const CANVAS_WIDTH = 375;
const CANVAS_HEIGHT = 375;
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
function detectFace(frame): Promise<any> {
	return new Promise((resolve, reject) => {
		wx.faceDetect({
			frameBuffer: frame.data,
			width: frame.width,
			height: frame.height,
			enablePoint: false,
			enableConf: true,
			enableAngle: true,
			enableMultiFace: false,
			success: resolve,
			fail: reject,
		});
	});
}
function drawPortrait(canvas: any, pointArray: any[], frame: any) {
	const ctx = canvas.getContext('2d');

	const offsetY = (frame?.height - frame?.width) / 2;
	const ratio = canvas.width / frame?.width || 1;
	ctx.clearRect(0, 0, canvas?.width, canvas?.height);
	pointArray.forEach((value) => {
		value.x = value.x * ratio;
		value.y = (value.y - offsetY) * ratio;
	});

	const targetArr = pointArray.slice(84, 96);
	const start = targetArr.shift();
	ctx.fillStyle = 'rgba(200,16,90,0.8)';
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
}

let disposing = false;
let frameId = -1;
let platform: any;
let mixers: any[] = [];

let THREE: any = null;
let renderer: any = null;
let model: any = null;
let camera: any = null;
let scene: any = null;

function threeTest(canvas) {
	THREE = createScopedThreejs(canvas);
	registerGLTFLoader(THREE);
	renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
	camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
	scene = new THREE.Scene();
	// const controls = new OrbitControls(camera, canvas);
	// controls.enableDamping = true;

	// const gltfLoader = new THREE.GLTFLoader();
	// gltfLoader.load(
	// 	'https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb',
	// 	(gltf) => {
	// 		// @ts-ignore
	// 		model = gltf;
	// 		gltf.parser = null;
	// 		gltf.scene.position.y = -2;
	// 		console.log(gltf.animations);
	// 		console.log(gltf.scene.children);
	// 		let mixer = new THREE.AnimationMixer(gltf.scene.children[0]);
	// 		mixer.clipAction(gltf.animations[0]).play();
	// 		mixers.push(mixer);
	// 		scene.add(gltf.scene);
	// 	}
	// );
	let geo = new THREE.BoxGeometry(2, 2, 2);
	new THREE.TextureLoader().load(
		'https://th.bing.com/th/id/OIP.VFZzFEoVJwJgUrbhSUGmugHaHa?pid=ImgDet&w=393&h=393&rs=1',
		(texture) => {
			var material = new THREE.MeshBasicMaterial({ map: texture });

			model = new THREE.Mesh(geo, material);
			scene.add(model);
			scene && camera && renderer?.render(scene, camera);
		}
	);

	camera.position.z = 5;
	renderer.outputEncoding = THREE.sRGBEncoding;
	scene.add(new THREE.AmbientLight(0xffffff, 1.0));
	scene.add(new THREE.DirectionalLight(0xffffff, 1.0));
}
const render = (face) => {
	// controls.update();
	// mixers[0]?.update(clock.getDelta());
	console.log('render');
	model.setRotationFromEuler(
		new THREE.Euler(-face.angleArray.pitch, -face.angleArray.yaw, -face.angleArray.roll)
	);
	scene && camera && renderer?.render(scene, camera);
};
export default function() {
	const cameraFrameListener = useRef<any>();
	const cameraContext = useRef<any>();
	const canvasRef = useRef<any>(undefined);
	useEffect(() => {
		//初始化一次
		initFaceDetect().then();
		Taro.nextTick(() => {
			const query = Taro.createSelectorQuery();
			query
				.select('#testCanvas')
				.node((res) => {
					canvasRef.current = res.node;
					canvasRef.current.width = CANVAS_WIDTH;
					canvasRef.current.height = CANVAS_HEIGHT;
					threeTest(canvasRef.current);
				})
				.exec();
		});
		return () => {
			//清除函数
			cameraFrameListener.current?.stop?.();
			try {
				wx.stopFaceDetect();
				cameraFrameListener.current?.stop();
				cameraFrameListener.current = null;
				cameraContext.current = null;
			} catch (error) {}
		};
	}, [cameraFrameListener]);
	const detectionErrHandler = useCallback((err) => {}, []);
	const startFaceDetect = useCallback(() => {
		// 获取并缓存唯一的相机上下文
		if (!cameraContext.current) cameraContext.current = wx.createCameraContext();
		// 监听并缓存唯一的相机帧回调，以便后续清除
		cameraFrameListener.current = cameraContext.current?.onCameraFrame(cameraFrameHandler);
		cameraFrameListener.current.start();
	}, []);
	const cameraFrameHandler = useCallback((frame) => {
		detectFace(frame)
			.then((faceData) => {
				const face = faceData;
				render(face);
			})
			.catch(detectionErrHandler);
	}, []);

	return (
		<View className='three-js page'>
			<Camera
				className='camera'
				devicePosition='front'
				resolution='high'
				style='width: 375px; height: 375px;'
			></Camera>
			<Canvas
				style={{ width: 375 + 'px', height: 375 + 'px' }}
				canvasId='testCanvas'
				type='webgl'
				id='testCanvas'
				className='canvas'
			></Canvas>
			<Button onClick={startFaceDetect}>start</Button>
		</View>
	);
}
