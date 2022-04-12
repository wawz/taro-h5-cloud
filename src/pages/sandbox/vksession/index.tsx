import { Button, Canvas, CoverView, View } from '@tarojs/components';
import { useCallback, useEffect, useRef, useState } from 'react';
import Taro, { useDidHide } from '@tarojs/taro';
import './index.scss';
// const THREE = require('../../libs/three.min.js');
import { createScopedThreejs } from 'threejs-miniprogram';
import { registerGLTFLoader } from '../../../lib/gltf-loader';
// import { WechatPlatform } from 'three-platformize/src/WechatPlatform';
// import { GLTF, GLTFLoader } from 'three-platformize/examples/jsm/loaders/GLTFLoader

const NEAR = 0.001;
const FAR = 1000;
let disposed = false;

const sysInfo = Taro.getSystemInfoSync();
let _program: any = null;
function renderGL(renderer, frame) {
	const gl = renderer.getContext();
	gl.disable(gl.DEPTH_TEST);
	const { yTexture, uvTexture } = frame.getCameraTexture(gl, 'yuv');
	const displayTransform = frame.getDisplayTransform();
	if (yTexture && uvTexture) {
		const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
		const currentTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
		gl.useProgram(_program);

		const posAttr = gl.getAttribLocation(_program, 'a_position');
		const pos = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pos);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(posAttr);

		const texcoordAttr = gl.getAttribLocation(_program, 'a_texCoord');
		const texcoord = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(texcoordAttr);

		const dt = gl.getUniformLocation(_program, 'displayTransform');
		gl.uniformMatrix3fv(dt, false, displayTransform);

		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

		gl.activeTexture(gl.TEXTURE0 + 5);
		gl.bindTexture(gl.TEXTURE_2D, yTexture);

		gl.activeTexture(gl.TEXTURE0 + 6);
		gl.bindTexture(gl.TEXTURE_2D, uvTexture);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		gl.useProgram(currentProgram);
		gl.activeTexture(currentTexture);
	}
}
function initGL(renderer) {
	const gl = renderer.getContext();
	const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
	const vs = `
	  attribute vec2 a_position;
	  attribute vec2 a_texCoord;
	  uniform mat3 displayTransform;
	  varying vec2 v_texCoord;
	  void main() {
		vec3 p = displayTransform * vec3(a_position, 0);
		gl_Position = vec4(p, 1);
		v_texCoord = a_texCoord;
	  }
	`;
	const fs = `
	  precision highp float;

	  uniform sampler2D y_texture;
	  uniform sampler2D uv_texture;
	  varying vec2 v_texCoord;
	  void main() {
		vec4 y_color = texture2D(y_texture, v_texCoord);
		vec4 uv_color = texture2D(uv_texture, v_texCoord);

		float Y, U, V;
		float R ,G, B;
		Y = y_color.r;
		U = uv_color.r - 0.5;
		V = uv_color.a - 0.5;
		
		R = Y + 1.402 * V;
		G = Y - 0.344 * U - 0.714 * V;
		B = Y + 1.772 * U;
		
		gl_FragColor = vec4(R, G, B, 1.0);
	  }
	`;
	const vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, vs);
	gl.compileShader(vertShader);

	const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, fs);
	gl.compileShader(fragShader);

	const program = gl.createProgram();
	_program = program;
	_program.gl = gl;
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.deleteShader(vertShader);
	gl.deleteShader(fragShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	const uniformYTexture = gl.getUniformLocation(program, 'y_texture');
	gl.uniform1i(uniformYTexture, 5);
	const uniformUVTexture = gl.getUniformLocation(program, 'uv_texture');
	gl.uniform1i(uniformUVTexture, 6);

	gl.useProgram(currentProgram);
}
let THREE: any = null;
export default function() {
	const canvasRef = useRef<any>(undefined);
	const sessionRef = useRef<any>(undefined);
	console.warn('PAGE RENDER');
	const [data, setData] = useState<any>('21312');

	const disposing = useRef<boolean>(false);
	const frameId = useRef<number>(-1);
	// const platform = useRef<WechatPlatform | undefined>(undefined);
	const renderer = useRef<any>(null);
	const threeCamera = useRef<any>(null);
	const scene = useRef<any>(null);
	useDidHide(() => {
		disposing.current = true;
		// PLATFORM.dispose();
		sessionRef.current.cancelAnimationFrame(frameId.current);
		sessionRef.current.stop();
		sessionRef.current.destroy();

		if (renderer.current) {
			renderer.current.dispose();
			renderer.current = null;
		}
		if (scene.current) {
			scene.current.clear();
			scene.current = null;
		}
		_program.gl.deleteProgram(_program);
		_program = null;
	});
	useEffect(() => {
		Taro.nextTick(() => {
			const query = Taro.createSelectorQuery();
			query
				.select('#testCanvas')
				.node((res) => {})
				.exec((res) => {
					canvasRef.current = res[0].node;
					canvasRef.current.width = sysInfo.windowWidth * sysInfo.pixelRatio;
					canvasRef.current.height = sysInfo.windowHeight * sysInfo.pixelRatio;

					initThree(canvasRef.current);

					sessionRef.current = wx.createVKSession({
						track: {
							plane: { mode: 3 },
						},
						version: 'v2',
					});

					sessionRef.current.start((err) => {
						if (!err) frameId.current = sessionRef.current.requestAnimationFrame(onFrame);
					});
				});
		});
		return () => {
			disposing.current = true;
			sessionRef.current.cancelAnimationFrame(frameId.current);
			// PLATFORM.dispose();
			sessionRef.current.destroy();
		};
	}, []);

	const onFrame = (timestamp) => {
		const frame = sessionRef.current.getVKFrame(
			canvasRef.current.width / 2,
			canvasRef.current.height / 2
		);
		if (frame) {
			// 分析完毕，可以拿到帧对象
			// doRender(frame);
			renderGL(renderer.current!, frame);
			// setData(frame.camera);
			const { camera } = frame;
			if (camera) {
				setData(frame.timestamp);
				threeCamera.current!.matrixAutoUpdate = false;
				threeCamera.current!.matrixWorldInverse.fromArray(camera.viewMatrix);
				threeCamera.current!.matrixWorld.getInverse(threeCamera.current!.matrixWorldInverse);

				const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR);
				threeCamera.current!.projectionMatrix.fromArray(projectionMatrix);
				threeCamera.current!.projectionMatrixInverse.getInverse(
					threeCamera.current!.projectionMatrix
				);
			}
		}
		renderer.current!.autoClearColor = false;
		renderer.current?.render(scene.current!, threeCamera.current!);
		renderer.current?.state.setCullFace(THREE.CullFaceNone);
		sessionRef.current.requestAnimationFrame(onFrame);
	};
	const initThree = (canvas) => {
		THREE = createScopedThreejs(canvas);
		// platform.current = new WechatPlatform(canvas);
		// PLATFORM.set(platform.current);

		renderer.current = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		initGL(renderer.current);
		threeCamera.current = new THREE.Camera();

		// threeCamera.current = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
		scene.current = new THREE.Scene();
		scene.current.background = new THREE.Color('#333');

		const light1 = new THREE.HemisphereLight(0xffffff, 0x444444); // 半球光
		light1.position.set(0, 0.2, 0);
		scene.current.add(light1);
		const light2 = new THREE.DirectionalLight(0xffffff); // 平行光
		light2.position.set(0, 0.2, 0.1);
		scene.current.add(light2);

		// const geometry = new BoxBufferGeometry(200, 200, 200);

		// // const texture = new TextureLoader().load(
		// // 	'https://www.bing.com/th?id=OIP.TO2kmGufyJQg4xFCfUgp8QHaHV&w=175&h=170&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2'
		// // );
		// // const material = new MeshBasicMaterial({ map: texture });

		// const material = new MeshBasicMaterial({ color: 0x44aa88 });
		// const mesh = new Mesh(geometry, material);
		// scene.current.add(mesh);

		registerGLTFLoader(THREE);
		const loader = new THREE.GLTFLoader();
		loader.load(
			'https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb',
			// 'https://dldir1.qq.com/weixin/miniprogram/space_27f8c621878e44d8b05916163ce83b40.glb',
			(gltf) => {
				console.log('ADDING GALAXY');
				const model = gltf.scene;
				model.matrixAutoUpdate = false;
				model.position.y = -10;
				model.scale.set(0.05, 0.05, 0.05);
				scene.current!.add(model);
			}
		);
	};

	// const onTx = useCallback(
	// 	(e) => {
	// 		platform.current?.dispatchTouchEvent(e);
	// 	},
	// 	[platform.current]
	// );

	return (
		<View className='three-js page'>
			<Canvas
				// onTouchStart={onTx}
				// onTouchMove={onTx}
				// onTouchEnd={onTx}
				style={{ width: sysInfo.windowWidth + 'px', height: sysInfo.windowHeight + 'px' }}
				canvasId='testCanvas'
				type='webgl'
				id='testCanvas'
				className='canvas'
			></Canvas>
			<View className='debug'>{data}</View>
		</View>
	);
}
