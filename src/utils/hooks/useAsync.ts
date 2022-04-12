import { useCallback, useEffect, useState } from 'react';

/**
 * 一个异步操作的常见状态
 */
type UseAsyncStatus = 'idle' | 'pending' | 'success' | 'error';

/**
 * 异步执行函数的钩子
 * @description 注意，异步函数必须是缓存过的或者是固定的，否则每次都会执行
 *
 * 场景：
 * 页面加载数据，通常我们会用
 * 一个loading state来保存加载状态
 * 一个data state 来保存返回数据
 * 一个fetch 函数来执行异步操作，并在其中设置loading和data
 *
 * @param asyncCallback 需要执行的异步函数(需缓存)
 * @param immediate 是否立即执行
 * @returns 返回异步执行的状态，resolve结果，reject结果，和执行函数
 */
export default function useAsync<T>(
	asyncCallback: () => Promise<T>,
	immediate: boolean = true
): {
	/**
	 * 异步状态
	 */
	status: UseAsyncStatus;
	/**
	 * 执行函数
	 */
	execute: () => Promise<void>;
	/**
	 * resolve的值
	 */
	value: T | null;
	/**
	 * reject的值
	 */
	error: any;
} {
	const [status, setStatus] = useState<UseAsyncStatus>('idle');
	const [value, setValue] = useState<T | null>(null);
	const [error, setError] = useState<any>(null);

	// 缓存执行函数，处理异步的前后状态
	const execute = useCallback(() => {
		setStatus('pending');
		setValue(null);
		setError(null);
		return asyncCallback()
			.then((res) => {
				setValue(res);
				setStatus('success');
			})
			.catch((res) => {
				setError(res);
				setStatus('error');
			});
	}, [asyncCallback]);
	// 如果回调函数或immediate变化，则执行“判断是否立刻执行的副作用”
	useEffect(() => {
		if (immediate) {
			execute();
		}
	}, [asyncCallback, immediate]);
	return {
		status,
		value,
		execute,
		error,
	};
}
