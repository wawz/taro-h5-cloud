import { Block, Button, View } from '@tarojs/components';
import React from 'react';
import useCallbackList from '@utils/hooks/useCallbackList';
import { useState } from 'react';
import useOnce from '@utils/hooks/useOnce';
import './index.scss';
interface ChildProp {
	onClick: (a: number) => void;
	base: number;
	children?: any;
	index: number;
}
const Child = React.memo((props: ChildProp) => {
	console.log('children render at ' + props.index);
	function childClick() {
		props.onClick(props.base);
	}
	return <Button onClick={childClick}>{props.children}</Button>;
});

export default function () {
	console.log('father render');
	const [noUseState, setNoUseState] = useState(Math.random());
	const [array, setArray] = useState(new Array(5).fill(1).map((v, i) => i + 1));

	const clickHandlers = useCallbackList(
		array,
		(item, index) => {
			return (fromChild) => {
				console.log(array[0] + fromChild);
				setArray((prevState) => {
					const newArr = [...prevState];
					newArr[index] = fromChild + array[0];
					return newArr;
				});
			};
		},
		[array[0]]
	);
	function changeLoopData() {
		setNoUseState(Math.random());
	}
	function addData() {
		setArray([...array, 1]);
	}

	function removeData() {
		setArray([...array.slice(0, -1)]);
	}
	function removeFromMiddle() {
		setArray([array[0], array[1], ...array.slice(3)]);
	}

	return (
		<View className='cb-list page'>
			<View>子渲染=子组件渲染，父渲染=父组件渲染</View>
			<View>-------------------------------</View>
			<View>无关依赖: {noUseState}</View>
			<Button onClick={changeLoopData}> 改变无关依赖(1次父渲染) </Button>
			<View>-------------------------------</View>
			<View>打印每个数+第一个数并纳入下次计算</View>
			<View>-------------------------------</View>
			<View>
				{array.map((item, index) => (
					<Child index={index} base={item} onClick={clickHandlers[index]}>{`${item} + ${
						array[0]
					} = ? (${index == 0 ? '所有子渲染和1次父渲染' : '1次子渲染和1次父渲染'})`}</Child>
				))}
			</View>
			<Button onClick={addData}> 添加一个数(新的子渲染和1次父渲染)</Button>
			<Button onClick={removeData}> 删除最后一个数(1次父渲染)</Button>
			{array.length > 2 && (
				<Block>
					<Button onClick={removeFromMiddle}>
						删除第三个数(最多{array.length - 3}次子渲染和1次父渲染){' '}
					</Button>
				</Block>
			)}
			<View>我他妈已经不认识这两个字了</View>
			<View>渲染浣柒</View>
		</View>
	);
}
