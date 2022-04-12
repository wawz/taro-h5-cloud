import Taro, { usePageScroll } from '@tarojs/taro';
import { useState, useRef, useEffect } from 'react';
import { View, Editor, RichText } from '@tarojs/components';
import './index.scss';

/**
 * editor组件, 可插入图片以及文字, 可对内容进行format
 * 该组件尚不少问题,开发中遇到的如下(官方已确认并未修改的问题):
 * 1. insertImage: 连续insertImage多张图片 图片的修改框会共用一个。
 * 2. insertImage: 插入N张图片后，insertImage后会插入N行空行。官方的说法是：想去掉的话可以上传内容时替换掉
 * 3. insertText后, 会自动收起键盘
 * 4. format align 之后,会自动收起键盘
 * 5. editor无法添加获取、设定光标位置功能
 * 6. setContent 插入内容,光标会自动定位在editor首位
 */

const initContImgSrc =
	'https://31tenrocks.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10403?size=xxlarge';

const defaultFormat = {
	bold: false,
	backgroundColor: false,
	align: false,
};

const windowInfo = Taro.getSystemInfoSync();

export default function() {
	const editorCtx = useRef<any>(undefined);
	const [formatAtr, setFormatAtr] = useState<object>(defaultFormat);
	const [editCont, setEditCont] = useState<string>('');
	const [boardHeight, setBoardHeight] = useState<number>(0);
	const [editorHeight, setEditorHeight] = useState<number>(300);
	const [showRichText, setShowRichText] = useState<boolean>(false);
	// const [hidePlaceHolder, setHidePlaceHolder] = useState<boolean>(false);

	useEffect(() => {
		handleBoardHeightChange();
	}, []);

	// 此处是解决弹起键盘后,默认页面高度为变化,设置了fixed的actionwrap仍可以滑动的问题。但是会引起手指滑动页面,页面有点闪烁的问题。
	usePageScroll(() => {
		if (boardHeight === 0) return;
		Taro.pageScrollTo({
			scrollTop: 0,
		});
	});

	const handleBoardHeightChange = () => {
		// 计算编辑器在弹起键盘时可以显示的高度
		Taro.onKeyboardHeightChange((res) => {
			if (res.height > 0) {
				const height = windowInfo.windowHeight - res.height - 80; // 获取键盘弹起时的editor高度，需要减去键盘高度以及底部操作栏高度
				setEditorHeight(height);
				setBoardHeight(res.height);
				setShowRichText(false);
				Taro.pageScrollTo({
					scrollTop: 0,
				});
			} else {
				setBoardHeight(0);
			}
		});
	};

	const handleReady = () => {
		Taro.createSelectorQuery()
			.select('#editor')
			.context((res) => {
				editorCtx.current = res.context;
			})
			.exec();
	};

	const handleFocus = () => {
		editorCtx.current.scrollIntoView();
	};

	const handleBlur = () => {};

	const handleInput = () => {
		// if (!hidePlaceHolder) {
		// 	setHidePlaceHolder(true);
		// }
	};

	const insertDivider = () => {
		editorCtx.current.insertDivider({
			success: () => {},
		});
	};

	const insertImage = () => {
		Taro.chooseImage({
			count: 9,
			sizeType: ['compressed'],
			success: addImageToCtx,
		});
	};

	const insertText = () => {
		editorCtx.current.insertText({
			text: 'hi, only for test',
			succsee: () => {},
		});
	};

	const handleClear = () => {
		editorCtx.current.clear({
			success: () => {},
		});
	};

	const handleRedo = () => {
		editorCtx.current.redo({
			success: () => {},
		});
	};

	const handleUndo = () => {
		editorCtx.current.undo({
			success: () => {},
		});
	};

	const addImageToCtx = (res) => {
		const { tempFilePaths } = res;
		Taro.showLoading({ title: '加载中', mask: true });
		tempFilePaths.forEach(async (src) => {
			// const imgInfo: any = await Taro.getImageInfo({ src });
			// console.log(imgInfo, 'imginfo');
			// let { width, height } = imgInfo;
			// 此处需要设置图片样式，以防图片超出edior宽度
			editorCtx.current.insertImage({
				src,
				extClass: 'ext-img',
			});
		});
		Taro.hideLoading();
	};

	const getContents = () => {
		editorCtx.current.getContents({
			success: (res) => {
				setEditCont(res.html);
			},
		});
	};

	const getSelectionText = () => {
		editorCtx.current.getContents({
			success: (res) => {
				setEditCont(res.text);
			},
		});
	};

	const removeFormat = () => {
		editorCtx.current.removeFormat();
		for (const i in formatAtr) {
			formatAtr[i] = false;
		}
		setFormatAtr({ ...formatAtr });
	};

	const setContents = () => {
		editorCtx.current.setContents({
			html: `<p>hi initContent <p><img src=${initContImgSrc} /></p></p>`,
		});
	};

	const formatCtx = (e) => {
		const { name, value, type } = e.target.dataset;
		if (type === 'boolean') {
			editorCtx.current.format(name);
		} else {
			editorCtx.current.format(name, value);
		}
		formatAtr[name] = !formatAtr[name];
		setFormatAtr({ ...formatAtr });
	};

	const handleShowRichText = () => {
		setShowRichText(!showRichText);
		getContents();
	};

	return (
		<View className='index page' style={{ height: '100vh' }}>
			<Editor
				id='editor'
				style={{ height: editorHeight + 'px' }}
				readOnly={false}
				showImgSize={false}
				showImgResize={false}
				showImgToolbar
				className='editor'
				placeholder='富文本编辑器,请在此处输入'
				onReady={handleReady}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onInput={handleInput}
			></Editor>
			<View
				style={{
					bottom: boardHeight + 'px',
				}}
				className={`'wrap action-wrap' ${!boardHeight && 'hidden'}`}
			>
				<View className='icon' onClick={insertDivider}>
					insertdvi
				</View>
				<View className='icon' onClick={insertImage}>
					insertimg
				</View>
				<View className='icon' onClick={insertText}>
					inserttxt
				</View>
				<View
					className={`icon ${formatAtr.bold && 'active'}`}
					data-name='bold'
					data-type='boolean'
					onClick={formatCtx}
				>
					bold
				</View>
				<View
					className={`icon ${formatAtr.align && 'active'}`}
					data-name='align'
					data-value='center'
					onClick={formatCtx}
				>
					center
				</View>
				<View
					className={`icon ${formatAtr.backgroundColor && 'active'}`}
					data-name='backgroundColor'
					data-value='green'
					onClick={formatCtx}
				>
					bg
				</View>
				<View className='icon' onClick={handleClear}>
					clear
				</View>
				<View className='icon' onClick={handleUndo}>
					undo
				</View>
				<View className='icon' onClick={handleRedo}>
					redo
				</View>
				<View className='icon' onClick={getContents}>
					getCont
				</View>
				<View className='icon' onClick={setContents}>
					setCont
				</View>
				<View className='icon' onClick={handleShowRichText}>
					richtext
				</View>
			</View>
			<View className={`${boardHeight && 'hidden'}`}>
				<View className='info'>
					<View className=''>editor可以做什么</View>
					<View className='tips'>editor组件, 可插入图片以及文字, 可对内容进行format</View>
				</View>
				<View className='info'>
					<View className='tips'>该组件尚存在一些问题,开发中遇到的如下:</View>
					<View className='tips'>
						1. insertImage: 连续insertImage多张图片 图片的修改框会共用一个。
					</View>
					<View className='tips'>2. insertImage: 插入N张图片后，insertImage后会插入N行空行。</View>
					<View className='tips'> 3. insertText后, 会自动收起键盘</View>
					<View className='tips'>4. format align 之后,会自动收起键盘</View>
					<View className='tips'> 5. editor无法添加获取、设定光标位置功能</View>
					<View className='tips'>6. setContent 插入内容,光标会自动定位在editor首位</View>
				</View>
			</View>
			<View className={`${!showRichText && 'hidden'}`}>
				<View className='title'>Show what you typed in the editor above</View>
				<View className='rich-text'>
					<RichText space='nbsp' nodes={editCont}></RichText>
				</View>
			</View>
			{/* {!boardHeight && <Button className='submit-btn'>提交</Button>} */}
			<View style={{ display: 'none' }}>
				<View className='wrap'>
					<View className='icon' onClick={insertDivider}>
						insertDivider
					</View>
					<View className='icon' onClick={insertImage}>
						insertImage
					</View>
					<View className='icon' onClick={insertText}>
						insertText
					</View>
				</View>
				<View className='wrap'>
					<View
						className={`icon ${formatAtr.bold && 'active'}`}
						data-name='bold'
						data-type='boolean'
						onClick={formatCtx}
					>
						format-bold
					</View>
					<View
						className={`icon ${formatAtr.align && 'active'}`}
						data-name='align'
						data-value='center'
						onClick={formatCtx}
					>
						fm-center
					</View>
					<View
						className={`icon ${formatAtr.backgroundColor && 'active'}`}
						data-name='backgroundColor'
						data-value='green'
						onClick={formatCtx}
					>
						fm-bg-green
					</View>
				</View>
				<View className='wrap'>
					<View className='icon' onClick={handleClear}>
						clear
					</View>
					<View className='icon' onClick={handleUndo}>
						undo
					</View>
					<View className='icon' onClick={handleRedo}>
						redo
					</View>
					<View className='icon' onClick={removeFormat}>
						removeFormat
					</View>
					<View className='icon' onClick={getContents}>
						getContents
					</View>
					<View className='icon' onClick={getSelectionText}>
						getSelectionText
					</View>
					<View className='icon' onClick={setContents}>
						setContents
					</View>
				</View>
			</View>
		</View>
	);
}
