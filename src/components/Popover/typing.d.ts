interface PopoverProps {
	/** popover 的位置 4个方位3个位置12种组合
	 * @default bottom
	 * @type string
	 */
	position?:
		| 'tl'
		| 'top'
		| 'tr'
		| 'lt'
		| 'left'
		| 'lb'
		| 'bl'
		| 'bottom'
		| 'br'
		| 'rt'
		| 'right'
		| 'rb'
		| string;

	/**
	 * 需要点击的element
	 */
	renderBody: JSX.Element | null;
	/**
	 * popover 框的内容
	 */

	renderContent: JSX.Element | null;
}
export { PopoverProps };
