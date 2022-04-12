type DrawOption = {
	/**
	 * 通过 SelectorQuery 获取的canvas对象
	 */
	canvas: any;
	/**
	 * 本地或网络图像的路径
	 */
	url: string;
	/**
	 * 绘制坐标x
	 */
	x: number;
	/**
	 * 绘制坐标y
	 */
	y: number;
	/**
	 * 绘制宽度
	 */
	width: number;
	/**
	 * 绘制高度
	 */
	height: number;
	/**
	 * 缩放模式
	 */
	mode?: 'aspectFit' | 'aspectFill' | 'scaleToFill';
};

/** 将网络或本地图片绘制到画布
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html
 * @param {any} canvas              通过 SelectorQuery 获取的canvas对象
 * @param {string} url        本地或网络图像的路径
 * @param {number} x    绘制坐标x
 * @param {number} y    绘制坐标y
 * @param {number} width        绘制宽度
 * @param {number} height       绘制高度
 * @param {string} mode        缩放模式，支持'aspectFit','aspectFill','scaleToFill', 释义同Image组件 默认'scaleToFill'
 * @return {*}
 */
export function drawImage({
	canvas,
	url: imagePath,
	x: drawPositionX,
	y: drawPositionY,
	width: drawWidth,
	height: drawHeight,
	mode: scaleMode = 'scaleToFill',
}: DrawOption): Promise<any> {
	if (!canvas.getContext || !canvas.createImage) {
		return Promise.reject('invalid canvas object');
	}
	return new Promise((reslove, reject) => {
		const ctx = canvas.getContext('2d');
		const img = canvas.createImage();
		img.onerror = (e) => {
			console.warn('fail drawing:', imagePath);
			reject(e);
		};

		img.onload = () => {
			const distRect = {
				x: drawPositionX,
				y: drawPositionY,
				width: drawWidth,
				height: drawHeight,
			};
			const sourceRect = {
				x: 0,
				y: 0,
				width: img.width,
				height: img.height,
			};
			if (scaleMode && scaleMode != 'scaleToFill') {
				console.log('modifying scale');
				let distRatio = drawWidth / drawHeight;
				let srcRatio = img.width / img.height;
				switch (scaleMode) {
					case 'aspectFill':
						if (distRatio > srcRatio) {
							sourceRect.x = 0;
							sourceRect.y = (img.height - (img.width / drawWidth) * drawHeight) / 2;
							sourceRect.width = img.width;
							sourceRect.height = (img.width / drawWidth) * drawHeight;
						} else {
							sourceRect.y = 0;
							sourceRect.x = (img.width - (img.height / drawHeight) * drawWidth) / 2;
							sourceRect.width = (img.height / drawHeight) * drawWidth;
							sourceRect.height = img.height;
						}
						break;
					case 'aspectFit':
						if (distRatio > srcRatio) {
							distRect.y = drawPositionY;
							distRect.x = drawPositionX + (drawWidth - (drawHeight / img.height) * img.width) / 2;
							distRect.height = drawHeight;
							distRect.width = (drawHeight / img.height) * img.width;
						} else {
							distRect.x = drawPositionX;
							distRect.y = drawPositionY + (drawHeight - (drawWidth / img.width) * img.height) / 2;
							distRect.width = drawWidth;
							distRect.height = (drawWidth / img.width) * img.height;
						}
						break;
					default:
						break;
				}
			}
			ctx.drawImage(
				img,
				sourceRect.x,
				sourceRect.y,
				sourceRect.width,
				sourceRect.height,
				distRect.x,
				distRect.y,
				distRect.width,
				distRect.height
			);
			reslove(null);
		};
		img.src = imagePath;
	});
}
