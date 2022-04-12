import { useRef } from 'react';

/**
 * 在一个钩子函数的生命周期中只执行一次的自定义钩子
 *
 * 例如: 只需加载一次的页面数据
 *
 * @example
 * ```tsx
 * useOnce(() => {
 *		console.log('this only runs once');
 *	});
 * ```
 *
 * @param callback 执行的函数
 * @returns {void}
 */
export default function useOnce(callback: () => void): void {
	const isCallbackRunned = useRef<boolean>(false);
	if (!isCallbackRunned.current) {
		isCallbackRunned.current = true;
		callback();
	}
}
