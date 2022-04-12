import { useCallback, useEffect, useState } from 'react';

declare const wx: any;
/**
 * wx.localStorage 的钩子函数
 *
 * 读取缓存中key值，并返回 set 和 remove 方法
 *
 * 由于缓存了状态，set会触发刷新哦
 *
 * @example
 * ```tsx
 * const [local, setLocal,removeLocal] = useStorage('key');
 * setLocal('blah blah'); // 此时本地缓存中的key值为blah blah
 * removeLocal(); // 此时本地缓存中的key值为undefined
 * ```
 *
 * @param key 要查询的键
 * @returns [值，设置函数，清除函数]
 */
export default function useStorage(key: string): [any, (any) => void, () => void] {
	const [value, setValue] = useState(wx.getStorageSync(key));
	const setter = useCallback(
		(value) => {
			setValue(value);
			wx.setStorageSync(key, value);
		},
		[key]
	);
	const remover = useCallback(() => {
		setValue(undefined);
		wx.removeStorageSync(key);
	}, [key]);
	return [value, setter, remover];
}
