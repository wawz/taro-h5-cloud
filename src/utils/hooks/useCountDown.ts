import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 执行倒计时的钩子函数
 * 常用场景: 按钮或者活动倒计时
 * @param duration 倒计时需要的时间（单位是ms）
 * @param interval 倒计时间隔（可选:默认为1ms）
 * @returns object 包含以下属性
 * @returns remain: 倒计时剩余时间（单位为ms）;
 * @returns running: 倒计时是否还在进行;
 * @returns start: 倒计时开始函数;
 * @returns cancel: 取消倒计时函数;
 */

interface useCountdownReturnType {
	remain: number;
	running: boolean;
	start: () => void;
	cancel: () => void;
}

export default function useCountdown(
	duration: number,
	interval: number = 1000
): useCountdownReturnType {
	const [countdownRemain, setRemain] = useState<number>(duration);
	const [countdownRunning, setRunning] = useState<boolean>(false);
	const timer = useRef<any>({});

	useEffect(() => {
		return () => {
			cancelCountdown();
		};
	}, []);

	const intervalFnc = useCallback(() => {
		timer.current = setInterval(() => {
			setRemain((_remain) => {
				if (_remain - interval > 0) {
					return _remain - interval;
				} else {
					clearInterval(timer.current);
					setRunning(false);
					return 0;
				}
			});
		}, interval);
	}, [interval]);

	const cancelCountdown = useCallback(() => {
		setRunning(false);
		setRemain(duration);
		clearInterval(timer.current);
	}, [duration]);

	const startCountdown = useCallback(() => {
		cancelCountdown();
		setRunning(true);
		intervalFnc();
	}, []);

	return {
		remain: countdownRemain,
		running: countdownRunning,
		start: startCountdown,
		cancel: cancelCountdown,
	};
}
