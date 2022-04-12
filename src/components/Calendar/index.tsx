import React, { useEffect, useMemo } from 'react';
import { View } from '@tarojs/components';
import { CalendarProps, CalendarDateItem } from './type';
import './index.scss';

/**
 * 日历组件
 * @description 按照日历形式展示数据的容器。时间基于 Date
 * @example
 * ```tsx
				<Calendar
					year={2022}
					monthIndex={2}
				/>
 * ```
 */
function getYMDd(date: Date) {
	return [date.getFullYear(), date.getMonth(), date.getDate(), date.getDay()];
}
const defaultRenderer = (date: CalendarDateItem) => {
	return <View className='default-date'>{date.value.getDate()}</View>;
};
export default React.memo(
	({
		year = new Date().getFullYear(),
		month = new Date().getMonth(),
		width = '100%',
		grid = undefined,
		children = defaultRenderer,
		padDates = true,
		weekStart = 0,
		onClick = () => {},
	}: CalendarProps) => {
		if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) {
			throw new Error('Calendar: invalid year or month');
		}

		const firstDay = new Date(year, month, 0), // 本月第一天日期
			lastDay = new Date(year, month + 1, 0), // 本月最后一天日期
			curDaysNumber = lastDay.getDate(), // 本月天数
			firstDayiw = firstDay.getDay(), // 本月第一天星期数
			today = new Date(), //获取今天
			[thisYear, thisMonth, thisDate] = getYMDd(today); // 获取今年，这个月，和当天日期

		const renderDates = useMemo<CalendarDateItem[]>(() => {
			const loop = firstDayiw + weekStart + curDaysNumber === 34 && padDates ? 42 : 35;

			return new Array(loop).fill(0).map((_, index) => {
				const value = new Date(year, month, weekStart - firstDayiw + index),
					[valueYear, valueMonth, valueDate, valueDay] = getYMDd(value);

				return {
					value,
					isWeekEnd: valueDay === 0 || valueDay === 6,
					isToday: valueYear === thisYear && valueMonth === thisMonth && valueDate === thisDate,
					isCurrentMonth: valueMonth === month,
					isCurrentYear: valueYear === year,
				};
			});
		}, [year, month]);
		console.log('calendar render');

		return (
			<View
				className='calendar-grid'
				style={`width:${width};--gridWidth:${grid?.width};--gridColor:${grid?.color};`}
			>
				{renderDates.map((date) => (
					<View
						id={getYMDd(date.value)
							.slice(0, 3)
							.join('-')}
						className={`calendar-grid__cell ${grid?.type || ''}`}
						onClick={() => onClick(date)}
					>
						{date.isCurrentMonth || padDates ? children?.(date) : null}
					</View>
				))}
			</View>
		);
	}
);
