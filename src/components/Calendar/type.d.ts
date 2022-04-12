import { FC } from 'react';

/**
 * cellrender item 参数
 */
export type CalendarDateItem = {
	//日期数据
	value: Date;
	//该日期是否为指定月份内的日期
	isCurrentMonth: boolean;
	//该日期是否为指定年份内的日期
	isCurrentYear: boolean;
	//该日期是否是周末
	isWeekEnd: boolean;
	//该日期是否是今天
	isToday: boolean;
};

/**
 * Calendar 参数
 */
export interface CalendarProps {
	//年份，默认今年
	year?: number;
	//月份，默认当月
	month?: number;
	// 日历宽度
	width?: number | string;
	// 是否显示网格，默认undefined，不显示
	grid?: {
		// 网格线类型
		type: 'center' | 'all-in' | 'bottom';
		// 网格线宽度
		width?: string;
		// 网格线颜色
		color?: string;
	};
	// 周起始 默认周日=0 周一=1，以此类推
	weekStart?: number;
	// 是否显示上个月月末或者下个月初的日子
	padDates?: boolean;
	children?: (date: CalendarDateItem) => JSX.Element | JSX.Element[];
	onClick?: (date: CalendarDateItem) => void;
}

declare const Calendar: FC<CalendarProps>;
export default Calendar;
