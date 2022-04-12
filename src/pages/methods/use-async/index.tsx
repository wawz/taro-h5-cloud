import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import './index.scss';
import { useCallback } from 'react';
import useAsync from '@utils/hooks/useAsync';

// 常量异步函数
const loadData = () => {
	return new Promise<{ data: { msg } }>((resolve, reject) => {
		setTimeout(() => {
			const result = Math.random();
			if (result > 0.5) {
				// 处理数据
				resolve({
					data: {
						msg: result,
					},
				});
			} else {
				reject({
					data: {
						msg: result,
					},
				});
			}
		}, 3000);
	});
};

export default function () {
	// 被useCallback缓存的异步函数
	const loadAnotherData = useCallback(() => {
		return new Promise<string>((resolve) => {
			setTimeout(() => {
				resolve('another async done');
			}, 3000);
		});
	}, []);

	const { status, value, error, execute } = useAsync(loadData);
	// 数据处理
	// 如果有多个异步操作，可以在解构时重命名
	const {
		status: otherStats,
		value: otherValue,
		execute: getData,
	} = useAsync(loadAnotherData, false);

	if (otherStats === 'pending' || status === 'pending') {
		Taro.showNavigationBarLoading();
	} else {
		Taro.hideNavigationBarLoading();
	}
	return (
		<View className='index page'>
			<View>--------------</View>
			<View>通常拉取异步数据时，会使用如下几块代码</View>
			<View>1. loading</View>
			<View>2. 存储异步数据的state, 例如productDetail</View>
			<View>3. 异步函数本身，并在其中调用上述状态的setter</View>

			<View>--------------</View>
			<View>往往使用的是相同的代码结构</View>
			<View>setLoading&gt;fetchData&gt;setData&gt;setLoading</View>
			<View>--------------</View>
			<View>该钩子旨在将异步任务从业务逻辑剥离，节省状态数量</View>
			<View>--------------</View>
			<View>一个useAsync钩子仅维护一个需要状态化的异步任务（或多个无状态的异步任务）</View>
			<View>--------------</View>

			{status === 'pending' && <View>loading page data</View>}
			{status === 'success' && <View>success! : {value?.data.msg}</View>}
			{status === 'error' && <View>error! </View>}
			<View></View>

			{status !== 'idle' && status !== 'pending' && (
				<Button onClick={execute}>重新拉取页面数据</Button>
			)}
			<View style={{ height: '100px' }}></View>
			{otherStats === 'pending' && <View>loading other data</View>}
			{otherStats === 'success' && <View>{otherValue}</View>}
			<Button onClick={getData}>拉取其他数据</Button>
		</View>
	);
}
