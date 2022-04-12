import { useCallback, useEffect, useRef } from 'react';
/**
 * 创建防抖函数的钩子
 * @description 延时执行一个函数，期间无论执行多少次，只有最后一次会执行
 *
 * 应用场景：
 * 当用户的连续输入停止后，才执行搜索
 * 当屏幕滚动停止后，才执行复杂的运算
 *
 * @example
 * ```ts
 * const debouncedCallback = useDebounce((event) => {
 *	 console.log('run after 1000ms passed');
 * }, 1000);
 * ```
 *
 * @param callback 需要防抖的函数
 * @param delay 防抖时间
 * @param deps 外部依赖数组
 * @returns {()=>void} 由于延时执行只能返回void
 */
export default function useDebounce<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
	deps: any[] = []
): (...args: any[]) => void {
	const timer = useRef<any>();
	useEffect(() => {
		return () => {
			clearTimeout(timer.current);
		};
	}, []);
	const debouncedCallback = useCallback(
		(...args) => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
			timer.current = setTimeout(() => {
				return callback(...args);
			}, delay);
		},
		[delay, ...deps]
	);
	return debouncedCallback;
}
