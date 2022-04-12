import { useCallback, useEffect, useRef } from 'react';
/**
 * 创建节流函数的钩子
 * @description 给定内时间函数只会执行一次
 *
 * 应用场景：
 * 当屏幕连续滚动时，按固定周期执行复杂的运算
 *
 * @example
 * ```ts
 * const debouncedCallback = useThrottle((event) => {
 *	 console.log('runs once every 1000ms');
 * }, 1000);
 * ```
 *
 * @param callback 需要节流的函数
 * @param delay 节流间隔
 * @param deps 外部依赖
 * @returns {()=>void} 由于延时执行只能返回void
 */
export default function useThrottle<T extends (...args: any[]) => any>(
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
	const throttledCallback = useCallback(
		(...args) => {
			if (!timer.current) {
				callback(...args);
				timer.current = setTimeout(() => {
					timer.current = null;
				}, delay);
			}
		},
		[delay, ...deps]
	);
	return throttledCallback;
}
