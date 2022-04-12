// CanvasRenderingContext2D.prototype.drawMultiLine = drawMultiLine; TODO

type FillTextareaOption = {
	/**
	 * 通过 SelectorQuery 获取的canvas对象
	 */
	canvas: any;
	/**
	 * 文字内容
	 */
	content: string;
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
	 * 绘制高度 若不提供高度，则无限换行
	 */
	height?: number;
	/**
	 * 行高，默认24，本质还是逐行绘制，所以必须提供行高以计算每行的间距
	 */
	lineHeight?: number;
	/**
	/**
	 * 对齐模式
	 */
	textAlign?: 'left' | 'right' | 'center';

	/**
	 * 省略字符样式 例如 ……
	 */
	ellipsis?: string;
};

/** 在画布上绘制文本域， 并返回文字高度
 * @description: 本质还是逐行绘制，所以必须提供行高以计算每行的间距，该函数不处理样式，颜色、字体及baseLine需在外部处理好
 * @param {Canvas} canvas 通过 SelectorQuery 获取的canvas对象
 * @param {content} content 文字内容
 * @param {number} x	绘制坐标X
 * @param {number} y	绘制坐标Y
 * @param {number} width 文本域宽度
 * @param {number} height 文本域高度
 * @param {number} lineHeight  行高 默认24，本质还是逐行绘制，所以必须提供行高以计算每行的间距
 * @param {string} textAlign  对齐模式
 * @param {string} ellipsis  省略字符样式 例如 ……
 * @return {number} 返回文字高度
 *
 * @example
 * ```js
 * drawMultiLine({
 * 	canvas,
 * 	content: '若给定ellipsis，则多出的部分省略省略省略省略省略省略省略省略省略省略'
 * 	x: 260,
 * 	y: 100,
 * 	width: 100,
 * 	height: 100,
 * 	ellipsis: '……………',
 * });
 * ```
 */
export function fillTextarea(defaultOpt: FillTextareaOption): number {
	const {
		canvas,
		content,
		x,
		y,
		width,
		height = 0,
		lineHeight = 24,
		textAlign = 'left',
		ellipsis: ellipsisStyle = '',
	} = defaultOpt;
	if (!canvas.getContext || !canvas.createImage) {
		return 0;
	}
	const ctx = canvas.getContext('2d');
	let lineStack: string[] = [];
	let prevIndex = 0;
	//循环判断行数，大等于文本域宽度时，视为一行，并推入绘制栈
	for (let i = 1; i < content.length; i++) {
		const { width: measureddWidth } = ctx.measureText(content.slice(prevIndex, i));
		if (measureddWidth > width) {
			lineStack.push(content.slice(prevIndex, i));
			prevIndex = i;
		}
	}
	// 经过循环，最后一行肯定不会大于设定宽度，手动推入绘制栈
	lineStack.push(content.slice(prevIndex));

	let linesToDraw: number;
	if (height === 0) {
		// 在不指定文本域高度的情况下，所有绘制栈中都会渲染
		linesToDraw = lineStack.length;
	} else if (height < lineHeight) {
		// 如果给定文本域高度小于行高
		// 则一行都不绘制
		linesToDraw = 0;
	} else {
		// 最多绘制行数为文本域高度除以行高
		linesToDraw = Math.floor(height / lineHeight);

		if (lineStack.length > linesToDraw && ellipsisStyle?.trim?.()) {
			// 此时如果提供了 非空 ellipsisStyle，自动将段落尾部等宽内容替换为ellipsisStyle
			lineStack = [...lineStack.slice(0, linesToDraw)];

			// 由于ellipsis的长度可能超过给定宽度
			// 所以需要将截取的绘制栈再次拼接，并从尾部开始删除等宽的内容
			const trimmedText = lineStack.join('');

			// 计算填充字符的长度
			const { width: ellipsisWidth } = ctx.measureText(ellipsisStyle);

			// 从尾部开始找到大于填充字符宽度的内容
			let charCountToReplace = 1;
			while (ellipsisWidth > ctx.measureText(trimmedText?.slice(0 - charCountToReplace)).width) {
				charCountToReplace += 1;
			}

			// 将截取内容与填充字符拼接，重新绘制，
			// 由于此时肯定不会超出文本域高度，所以给定height为0, 减少判断
			// 其余参数保持不变
			return fillTextarea({
				...defaultOpt,
				content: trimmedText.slice(0, -charCountToReplace) + ellipsisStyle,
				height: 0,
			});
		}
	}

	//快照，不影响外部ctx状态
	ctx.save();

	ctx.textAlign = textAlign;
	let distX = x;
	switch (textAlign) {
		default:
		case 'left':
			break;
		case 'right':
			distX = x + width;
			break;
		case 'center':
			distX = x + width / 2;
	}
	lineStack.slice(0, linesToDraw).forEach((item, index) => {
		ctx.fillText(item, distX, y + lineHeight * index);
	});
	ctx.restore();
	return linesToDraw * lineHeight;
}
