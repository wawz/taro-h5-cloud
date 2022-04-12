import React from 'react';
import Taro from '@tarojs/taro';
import { View, Block } from '@tarojs/components';
import classnames from 'classnames';
import { SkeletonProps } from './type';
import './index.scss';

const DEFAULT_ROW_WIDTH = '100%';
const DEFAULT_DESIGN_WIDTH = 750;

/**
 * 骨架屏组件
 * @example ``` 
<Skeleton row={3} loading={loading}>
  <Text>实际内容</Text>
</Skeleton>
```
	* @see https://github.com/31ten/miniprogram_taro_react_template/tree/develop/src/components/Skeleton/README.md
 */
export default function Skeleton(props: SkeletonProps) {
	const {
		loading = true,
		bgColor = '#ebebeb',
		radius = 2,
		type = 'row',
		contentPD = {},
		row = 0,
		rowWidth = DEFAULT_ROW_WIDTH,
		rowHeight = 24,
		rowProps,
		rowAlignStyle = 'left',
		avatar,
		avatarSize = 60,
		avatarShape = 'round',
		action,
		actionSize,
		rect,
		rectSize = { width: '100%', height: 400 },
		animate = true,
		animateName = 'blink',
		animateDuration = 1.5,
		designWidth = DEFAULT_DESIGN_WIDTH,
		className,
		children,
	}: SkeletonProps = props;
	if (!loading) {
		return <Block>{children}</Block>;
	}

	const getCustomWidth = (index: number, key: string = 'rowProps') => {
		if (props[key]) {
			if (Array.isArray(props[key])) {
				return props[key][index].width || '';
			}
			return props[key].width || '';
		}

		if (key === 'rowProps') {
			if (rowWidth === DEFAULT_ROW_WIDTH) {
				return DEFAULT_ROW_WIDTH;
			}
			if (Array.isArray(rowWidth)) {
				return rowWidth[index];
			}
			return rowWidth;
		}
		return null;
	};

	const getCustomHeight = (index: number, key: string = 'rowProps') => {
		if (props[key]) {
			if (Array.isArray(props[key])) {
				return props[key][index].height || '';
			}
			return props[key].height || '';
		}

		if (key === 'rowProps') {
			if (Array.isArray(rowHeight)) {
				return rowHeight[index];
			}
			return rowHeight;
		}
		return null;
	};

	const addUnit = (value?: string | number) => {
		return typeof value === 'number' ? Taro.pxTransform(value, designWidth) : value;
	};

	const renderAvatar = (): JSX.Element | null => {
		if (avatar) {
			const avatarClass = classnames('skeleton-avatar', {
				'skeleton-avatar-round': avatarShape === 'round',
			});
			return (
				<View
					className={avatarClass}
					style={`
					width: ${addUnit(avatarSize)};
					height: ${addUnit(avatarSize)}
					`}
				/>
			);
		}
		return null;
	};

	const renderRect = (): JSX.Element | null => {
		if (rect) {
			return (
				<View
					className='skeleton-rect'
					style={
						rectSize &&
						`width: ${addUnit(getCustomWidth(0, 'rectSize'))};height: ${addUnit(
							getCustomHeight(0, 'rectSize')
						)}`
					}
				/>
			);
		}
		return null;
	};

	const renderAction = (): JSX.Element | null => {
		if (action && type !== 'column') {
			return (
				<View
					className='skeleton-action'
					style={
						actionSize &&
						`width: ${addUnit(getCustomWidth(0, 'actionSize'))};height: ${addUnit(
							getCustomHeight(0, 'actionSize')
						)}`
					}
				/>
			);
		}
		return null;
	};

	const renderRows = (): JSX.Element | null => {
		if (row) {
			const rowArray = Array.apply(null, Array(row)).map((_, index) => index);
			const Rows = rowArray.map((item, index) => (
				<View
					key={item}
					className='skeleton-row'
					style={`width: ${addUnit(getCustomWidth(index))}; height: ${addUnit(
						getCustomHeight(index)
					)}`}
				/>
			));
			return (
				<View className='skeleton-rows' style={{ textAlign: rowAlignStyle }}>
					{Rows}
				</View>
			);
		}
		return null;
	};

	const rootClass = classnames('skeleton', className, {
		[`skeleton-type-${type}`]: true,
		'skeleton-animate-blink': animate && animateName === 'blink',
		'skeleton-animate-elastic': animate && animateName === 'elastic',
	});

	return (
		<View
			className={rootClass}
			style={{
				'--bgColor': bgColor,
				'--radius': radius,
				'--aniDuration': `${animateDuration}s`,
				...contentPD,
			}}
		>
			{renderAvatar()}
			{renderRect()}
			{renderRows()}
			{renderAction()}
		</View>
	);
}
Skeleton.options = {
	addGlobalClass: true,
};
