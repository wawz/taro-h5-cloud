import React, { useState } from 'react';

import { View } from '@tarojs/components';
import { PopoverProps } from './typing';
import './index.scss';

// 注：Children组合必须render开头，并且不能解构，@see参考文档 https://taro-docs.jd.com/taro/docs/children#%E7%BB%84%E5%90%88

/**
 * @description: 4个方位的popover
 * @param {position} string 具体方位值
 * @param {renderBody} JSX Element 需要点击的element
 * @param {renderContent} JSX Element popover内容的element
 * @return {*}
 */

export default React.memo((props: PopoverProps) => {
	const { position = 'bottom' } = props;
	const [show, setShow] = useState<boolean>(false);

	const handleClick = () => {
		setShow(!show);
	};

	return (
		<View className={`popover-wrapper ${position}`}>
			<View onClick={handleClick}>{props.renderBody}</View>
			{show && <View className='triangle'></View>}
			{show && <View className={`container`}>{props.renderContent}</View>}
		</View>
	);
});
