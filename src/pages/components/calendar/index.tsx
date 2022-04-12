import { useCallback, useState } from 'react';
import { Text, View } from '@tarojs/components';
import classnames from 'classnames';
import Calendar from '@components/Calendar';
import './index.scss';

const gridProps = { type: 'center', width: '1px', color: '#f00' };

export default function Index() {
	const dateClick = useCallback((e) => {
		console.log(e);
	}, []);
	const [month, setMonth] = useState(0);
	const renderDates = useCallback(
		(date) => <View className={classnames('date-item', { ...date })}>{date.value.getDate()}</View>,
		[]
	);
	const renderSpecDates = useCallback((date) => {
		return (
			<View className={classnames('date-item', { ...date, isWed: date.value.getDay() === 3 })}>
				{date.value.getDate()}
			</View>
		);
	}, []);
	return (
		<View className='calendar-page'>
			<View className='calendar-page__calendar-block'>
				<View className='title'>2022-3(直接使用)</View>
				<Calendar></Calendar>
			</View>
			<View className='calendar-page__calendar-block'>
				<View className='title'>2022-3 (不填充上下)</View>
				<Calendar padDates={false}></Calendar>
			</View>
			<View className='calendar-page__calendar-block'>
				<View className='title'>2022-3(网格线)</View>
				<Calendar grid={gridProps as any}></Calendar>
			</View>

			<View className='calendar-page__calendar-block'>
				<View className='title'>2022-4 (补全下月的第一周)</View>
				<Calendar year={2022} month={3}>
					{renderDates}
				</Calendar>
			</View>

			<View className='calendar-page__calendar-block'>
				<View className='title'>2022-5（周一开始）</View>
				<Calendar year={2022} month={4} weekStart={1}>
					{renderDates}
				</Calendar>
			</View>

			<View className='calendar-page__calendar-block'>
				<View className='title'>2022-6 (父组件决定样式)</View>
				<Calendar year={2022} month={5} onClick={dateClick}>
					{renderSpecDates}
				</Calendar>
			</View>

			<View className='calendar-page__calendar-block'>
				<View className='title'>
					<Text onClick={() => setMonth(month - 1)}>-</Text>
					<Text>2022-{month + 1} (动态渲染)</Text>
					<Text onClick={() => setMonth(month + 1)}>+</Text>
				</View>

				<Calendar year={2022} month={month} onClick={dateClick}>
					{renderDates}
				</Calendar>
			</View>
		</View>
	);
}
