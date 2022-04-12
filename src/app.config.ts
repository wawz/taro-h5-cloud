/** 微信小程序配置
 * @see https://taro-docs.jd.com/taro/docs/app-config/
 * Taro 小程序配置
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE
 *
 * 二者大部分内容相同，Taro为集成多端能力，会有一些额外配置，目前只需要专注于微信小程序相关部分。
 */
export default {
	pages: [
		'pages/miniprograms/index/index',

		'pages/sandbox/index',
		'pages/sandbox/threejs/index',
		'pages/sandbox/vksession/index',
		'pages/sandbox/face-detect/index',
		'pages/sandbox/choose-poi/index',
		'pages/sandbox/ocr/index',
		'pages/sandbox/mapcontext/index',
		'pages/sandbox/editor/index',

		'pages/components/index',
		'pages/components/skeleton/index',
		'pages/components/custom-navbar/index',
		'pages/components/popover/index',
		'pages/components/calendar/index',

		'pages/methods/index',
		'pages/methods/get-authorization/index',
		'pages/methods/canvas/index',
		'pages/methods/use-callback-list/index',
		'pages/methods/use-form/index',
		'pages/methods/use-context/index',
		'pages/methods/use-async/index',
		'pages/methods/get-phone-number/index',

		'pages/tool/index',
		'pages/tool/qrcode/index',
		'pages/tool/shortlink/index',
	],
	window: {
		backgroundTextStyle: 'light',
		navigationBarBackgroundColor: '#fff',
		navigationBarTitleText: 'WeChat',
		navigationStyle: 'custom',
		navigationBarTextStyle: 'black',
	},
	tabBar: {
		custom: true,
		color: '#8a8a8a',
		selectedColor: '#000000',
		backgroundColor: '#ffffff',
		list: [
			{
				pagePath: 'pages/miniprograms/index/index',
				text: '小程序',
				iconPath: 'assets/tabbar/mp_off.png',
				selectedIconPath: 'assets/tabbar/mp_on.png',
			},
			{
				pagePath: 'pages/sandbox/index',
				text: '沙箱',
				iconPath: 'assets/tabbar/idea_off.png',
				selectedIconPath: 'assets/tabbar/idea_on.png',
			},
			{
				pagePath: 'pages/components/index',
				text: '组件',
				iconPath: 'assets/tabbar/comp_off.png',
				selectedIconPath: 'assets/tabbar/comp_on.png',
			},
			{
				pagePath: 'pages/methods/index',
				text: '方法',
				iconPath: 'assets/tabbar/react_off.png',
				selectedIconPath: 'assets/tabbar/react_on.png',
			},
			{
				pagePath: 'pages/tool/index',
				text: '工具',
				iconPath: 'assets/tabbar/tool_off.png',
				selectedIconPath: 'assets/tabbar/tool_on.png',
			},
		],
	},
	usingComponents: {},
	permission: {
		'scope.userLocation': {
			desc: '你的位置信息将用于小程序位置接口的效果展示',
		},
	},
};

