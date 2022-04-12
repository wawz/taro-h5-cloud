import { Button, Canvas, View } from '@tarojs/components';
import './index.scss';
import { fillTextarea, drawImage } from '@utils/methods';
import { useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
function testDraw(canvas) {
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = '#00ccff';
	ctx.fillRect(0, 0, 375, 375);
	drawImage({
		canvas,
		url: 'https://prettier.io/icon.png',
		x: 0,
		y: 0,
		width: 80,
		height: 80,
	});

	ctx.fillStyle = '#003366';
	ctx.font = '18px arial';
	fillTextarea({
		canvas,
		content:
			'若不提供高度，则无限换行若不提供高度，则无限换行若不提供高度，则无限换行若不提供高度，则无限换行若不提供高度，则无限换行若不提供高度，则无限换行',
		x: 0,
		y: 100,
		width: 100,
	});

	fillTextarea({
		canvas,
		content: '若给定高度，则多出的部分不显示不显示不显示不显示不显示',
		x: 135,
		y: 100,
		width: 100,
		height: 100,
	});

	fillTextarea({
		canvas,
		content: '这个是居中效果',
		x: 135,
		y: 235,
		width: 100,
		height: 100,
		textAlign: 'center',
	});

	fillTextarea({
		canvas,
		content: '若给定ellipsis，则多出的部分123456789012345678901234567890',
		x: 260,
		y: 100,
		width: 100,
		height: 100,
		ellipsis: '……………',
	});

	fillTextarea({
		canvas,
		content: '这个是右对齐效果',
		x: 260,
		y: 235,
		width: 100,
		height: 100,
		textAlign: 'right',
	});
}

export default function () {
	const canvasRef = useRef<any>(undefined);

	useEffect(() => {
		Taro.nextTick(() => {
			const query = Taro.createSelectorQuery();
			query
				.select('#testCanvas')
				.node((res) => {
					canvasRef.current = res.node;
					canvasRef.current.width = 375;
					canvasRef.current.height = 375;
					testDraw(canvasRef.current);
				})
				.exec();
		});
	}, []);

	return (
		<View className='index page' style={{ padding: '20rpx' }}>
			<View>这是一个375*375的画布</View>
			<Canvas
				type='2d'
				style={{ width: '375px', height: '375px', marginLeft: '-20rpx' }}
				id='testCanvas'
				canvasId='testCanvas'
			></Canvas>
		</View>
	);
}
