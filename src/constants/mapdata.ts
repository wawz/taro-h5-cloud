import centerPoinIconPath from '../assets/tabbar/mp_off.png';
import coverIconPath from '../assets/tabbar/comp_off.png';

export const MAPMARKERIDS = [1, 2, 3];
export const GROUNDOVERLAYID = 10;
export const ADDMARKERIDS = [20, 21, 22, 23, 24, 25, 26, 27];
export const ARCID = 40;
export const VISUAILAYERID = '99fb5fa1802a';
export const CUSTOMLAYERID = '62314ad80279';
export const SUBKEY = 'LGHBZ-GM6CR-AAQWZ-WIFNN-ZREH3-2DFRT';
export const CENTERLOCATION = [
	{
		longitude: 120.721408,
		latitude: 31.276551,
		name: '独墅湖图书馆',
	},
	{
		longitude: 120.673312,
		latitude: 31.315413,
		name: '中海财富广场',
	},
	{
		latitude: 31.260708,
		longitude: 120.727432,
		name: '月亮湾4号口',
	},
];
export const CALLOUTOBJ = [
	{
		content: '园区湖西CBD',
		color: '#3092ff',
		fontSize: 14,
		anchorX: -15,
		anchorY: -15,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#3092ff',
		bgColor: '#fff',
		padding: 1,
		display: 'BYCLICK',
		textAlign: 'center',
	},
];
export const MAPMARKERS = [
	{
		id: MAPMARKERIDS[0],
		latitude: CENTERLOCATION[0].latitude,
		longitude: CENTERLOCATION[0].longitude,
		title: CENTERLOCATION[0].name,
		label: CALLOUTOBJ[0],
		iconPath: coverIconPath,
		width: 30,
		height: 30,
	},
	{
		id: MAPMARKERIDS[1],
		latitude: CENTERLOCATION[1].latitude,
		longitude: CENTERLOCATION[1].longitude,
		title: CENTERLOCATION[1].name,
		callout: CALLOUTOBJ[0],
		iconPath: coverIconPath,
		width: 30,
		height: 30,
	},
	{
		id: MAPMARKERIDS[2],
		latitude: CENTERLOCATION[2].latitude,
		longitude: CENTERLOCATION[2].longitude,
		title: CENTERLOCATION[2].name,
		iconPath: coverIconPath,
		width: 30,
		height: 30,
		customCallout: {
			display: 'ALWAYS',
			anchorX: -20,
			anchorY: 20,
		},
	},
];
export const PATHFORMOVEALONG = [
	{
		latitude: 31.26218,
		longitude: 120.727609,
	},
	{
		latitude: 31.26395,
		longitude: 120.727652,
	},
	{
		latitude: 31.268306,
		longitude: 120.726675,
	},
	{
		latitude: 31.275147,
		longitude: 120.724819,
	},
	{
		latitude: 31.279388,
		longitude: 120.725012,
	},
	{
		latitude: 31.286081,
		longitude: 120.724932,
	},
	{
		latitude: 31.290564,
		longitude: 120.724835,
	},
	{
		latitude: 31.299283,
		longitude: 120.724471,
	},
	{
		latitude: 31.299255,
		longitude: 120.731037,
	},
	{
		latitude: 31.299292,
		longitude: 120.734277,
	},
	{
		latitude: 31.279681,
		longitude: 120.734223,
	},
	{
		latitude: 31.264119,
		longitude: 120.740732,
	},
	{
		latitude: 31.260042,
		longitude: 120.728627,
	},
];
export const ADDMARKERS = [
	{
		id: ADDMARKERIDS[0],
		latitude: 31.310902,
		longitude: 120.625566,
		title: '观前街',
		iconPath: centerPoinIconPath,
		joinCluster: true,
		rotate: 78,
		width: 50,
		height: 50,
	},
	{
		id: ADDMARKERIDS[1],
		latitude: 31.299315,
		longitude: 120.634664,
		joinCluster: true,
		title: '网师园',
		iconPath: centerPoinIconPath,
		rotate: 78,
		width: 50,
		height: 50,
	},
	{
		id: ADDMARKERIDS[2],
		latitude: 31.262398,
		longitude: 120.724023,
		joinCluster: true,
		title: '慧湖大厦',
		iconPath: centerPoinIconPath,
		rotate: 78,
		width: 50,
		height: 50,
	},
	{
		id: ADDMARKERIDS[3],
		latitude: 31.262673,
		longitude: 120.725643,
		joinCluster: true,
		title: '中新大厦',
		iconPath: centerPoinIconPath,
		rotate: 78,
		width: 50,
		height: 50,
	},
	{
		id: ADDMARKERIDS[4],
		latitude: 31.262975,
		longitude: 120.726791,
		joinCluster: true,
		title: '环吸巨幕',
		iconPath: centerPoinIconPath,
		rotate: 78,
		width: 50,
		height: 50,
	},
	{
		id: ADDMARKERIDS[5],
		latitude: 31.261838,
		longitude: 120.723304,
		joinCluster: true,
		title: '西南门',
		iconPath: centerPoinIconPath,
		rotate: 78,
		width: 50,
		height: 50,
	},
	{
		id: ADDMARKERIDS[6],
		latitude: 31.261416,
		longitude: 120.724506,
		joinCluster: true,
		title: '西北门',
		iconPath: centerPoinIconPath,
		rotate: 78,
		width: 50,
		height: 50,
	},
	{
		id: ADDMARKERIDS[7],
		latitude: 31.261288,
		longitude: 120.722275,
		joinCluster: true,
		title: '苏州福朋喜雷登酒店',
		iconPath: centerPoinIconPath,
		rotate: 78,
		width: 50,
		height: 50,
	},
];
export const POINTS = [
	{
		latitude: 31.705029,
		longitude: 120.872587,
	},
	{
		latitude: 31.322194,
		longitude: 121.483701,
	},
	{
		latitude: 30.811677,
		longitude: 120.494932,
	},
	{
		latitude: 31.271735,
		longitude: 119.848111,
	},
];
export const POSITION = [
	{
		latitude: 31.195216,
		longitude: 121.436795,
		name: '徐家汇',
	},
	{
		latitude: 31.260708,
		longitude: 120.727432,
		name: '月亮湾4号口',
	},
	{
		latitude: 31.260324,
		longitude: 120.726627,
		name: '独墅湖',
	},
	{
		latitude: 31.261303,
		longitude: 120.722232,
		name: '苏州福朋喜来登酒店',
	},
];
export const POLYLINEPOINTS = [
	{
		latitude: 31.240825,
		longitude: 120.735267,
	},
	{
		latitude: 31.243402,
		longitude: 120.733422,
	},
	{
		latitude: 31.246934,
		longitude: 120.731609,
	},
	{
		latitude: 31.250539,
		longitude: 120.729876,
	},
	{
		latitude: 31.253712,
		longitude: 120.728438,
	},
	{
		latitude: 31.260242,
		longitude: 120.727837,
	},
	{
		latitude: 31.264021,
		longitude: 120.727752,
	},
	{
		latitude: 31.263434,
		longitude: 120.72331,
	},
];
export const POLYLINE = [
	{
		points: POLYLINEPOINTS,
		color: '#3092ff',
		colorList: ['#f0e91f', '#f0e91f', '#ee9905', '#ef6109', '#ef3b09'],
		width: 14,
		arrowLine: true,
		borderColor: '#ccc',
		borderWidth: 1,
		textStyle: {
			textColor: '#3092ff',
			fontSize: 16,
		},
		segmentTexts: [
			{
				name: '松泽五区',
				startIndex: 1,
				endIndex: 4,
			},
			// {
			// 	name: '普惠高中',
			// 	startIndex: 1,
			// 	endIndex: 2,
			// },
			// {
			// 	name: '星洲大厦',
			// 	startIndex: 2,
			// 	endIndex: 3,
			// },
			// {
			// 	name: '同程大厦',
			// 	startIndex: 3,
			// 	endIndex: 4,
			// },
			// {
			// 	name: '月亮湾美颂花园',
			// 	startIndex: 4,
			// 	endIndex: 5,
			// },
			// {
			// 	name: '星湖街',
			// 	startIndex: 5,
			// 	endIndex: 6,
			// },
		],
	},
];
export const POLYGONPOINTS = [
	{
		latitude: 31.298514,
		longitude: 120.717318,
	},
	{
		latitude: 31.295039,
		longitude: 120.717426,
	},
	{
		latitude: 31.294498,
		longitude: 120.714636,
	},
	{
		latitude: 31.297634,
		longitude: 120.712426,
	},
	{
		latitude: 31.298321,
		longitude: 120.712619,
	},
];
export const POLYGONS = [
	{
		dashArray: [10, 5],
		points: POLYGONPOINTS,
		strokeWidth: 2,
		fillColor: '#3092ff',
	},
];
export const CIRCLES = [
	{
		latitude: 31.284203,
		longitude: 120.709418,
		name: '金鸡湖大酒店',
		color: '#3092ff',
		fillColor: '#5f98ca',
		radius: 1000,
		strokeWidth: 2,
	},
];
