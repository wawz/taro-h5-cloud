/* eslint-disable import/first */
import { Button, View, Map, CoverView, CoverImage } from '@tarojs/components';
import { useRef, useState, useCallback } from 'react';
import Taro, { useReady } from '@tarojs/taro';
import centerPoinIconPath from '@assets/tabbar/mp_off.png';
import coverIconPath from '@assets/tabbar/comp_off.png';
import locMarkeIconPath from '@assets/tabbar/react_off.png';
import ideaIconPath from '@assets/tabbar/idea_off.png';

import chCont from '@constants/translations/ch_zn.json';
import enCont from '@constants/translations/en.json';
import { getWechatAuth } from '@utils/methods';

import './index.scss';

import {
	CIRCLES,
	POLYGONS,
	POLYLINE,
	POINTS,
	POSITION,
	CUSTOMLAYERID,
	SUBKEY,
	GROUNDOVERLAYID,
	ADDMARKERIDS,
	ARCID,
	VISUAILAYERID,
	CENTERLOCATION,
	MAPMARKERS,
	PATHFORMOVEALONG,
	ADDMARKERS,
} from '@constants/mapdata';

/**
 * mapContect 小程序地图,可以获取当前、设置定位、地图缩放比例、视野;增删移动markers, 设置指定路径移动 marker;增删更新图层;
 */

interface setting {
	longitude: number;
	latitude: number;
	scale?: number;
	skew?: number;
	rotate?: number;
	showLocation?: boolean;
	showScale?: false;
	subkey?: string; // taro文档字段为subkey,微信文档字段为subKey,需注意taro使用subKey将无效
	layerStyle?: number;
	enableZoom?: boolean;
	enableScroll?: boolean;
	enableRotate?: boolean;
	showCompass?: boolean;
	enable3D?: boolean;
	enableOverlooking?: boolean;
	enableSatellite?: boolean;
	enableTraffic?: boolean;
}

const defaultCircles: object[] = [
	{
		latitude: undefined,
		longitude: undefined,
	},
];

const defaultMapSetting = {
	longitude: MAPMARKERS[0].longitude,
	latitude: MAPMARKERS[0].latitude,
	scale: 12,
	subkey: SUBKEY,
	enableRotate: true,
	enableScroll: true,
	enableZoom: true,
	showLocation: true,
};

export default function() {
	const mapCtx = useRef<any>(undefined);
	const [featureCont, setFeatureCont] = useState<string>('');
	// const isResetMapCenter = useRef<boolean>(false);
	const [circles, setCircles] = useState<any[]>([]);
	const [polygons, setPolygons] = useState<object[]>([]);
	const [polyline, setPolyline] = useState<object[]>([]);
	const [markers, setMarkers] = useState<object[]>([]);
	const [mapSetting, setMapSetting] = useState<setting>(defaultMapSetting);

	useReady(() => {
		mapCtx.current = Taro.createMapContext('myMap');
		clusterFunc();
	});

	function clusterFunc(): void {
		mapCtx.current.initMarkerCluster({
			enableDefaultStyle: false,
			zoomOnClick: true,
			success() {
				console.log('点聚合初始化', true);
			},
		});
		mapCtx.current.on('markerClusterCreate', (res: { clusters: any }) => {
			console.log('聚合触发：', true);
			let clusters = res.clusters;
			let cluMarkers = clusters.map((cluster: { center: any; clusterId: any; markerIds: any }) => {
				const { center, clusterId, markerIds } = cluster;
				return {
					...center,
					canshow: true,
					width: 20,
					height: 20,
					clusterId, // most important
					iconPath: ideaIconPath,
					label: {
						content: 'There are ' + markerIds.length + ' marker~',
						color: '#3CB371',
						fontSize: 12,
						borderRadius: 30,
						borderWidth: 1,
						borderColor: '#dddddd',
						bgColor: '#ffffffbb',
						padding: 10,
						anchorX: -60,
						anchorY: -60,
					},
				};
			});
			mapCtx.current.addMarkers({
				markers: cluMarkers,
				clear: false,
				success() {
					console.log('clusterCreate addMarkers', true);
				},
			});
		});
	}

	function addGroundOverlay(): void {
		mapCtx.current.addGroundOverlay({
			id: GROUNDOVERLAYID, // number type instead string
			src: centerPoinIconPath,
			bounds: {
				// 松涛街文星广场
				southwest: {
					latitude: 31.263586,
					longitude: 120.73982,
				},
				northeast: {
					latitude: 31.284897,
					longitude: 120.754326,
				},
			},
			visible: true,
			zIndex: 99,
			opacity: 1,
			complete: () => {
				const cont = `${chCont['mapExplanation']['addGroundOverlay']}\n\n${enCont['mapExplanation']['addGroundOverlay']}`;
				setFeatureCont(cont);
			},
		});
	}

	function updateGroundOverlay(): void {
		mapCtx.current.updateGroundOverlay({
			id: GROUNDOVERLAYID, // number type instead string
			src: coverIconPath,
			bounds: {
				// 松涛街文星广场
				southwest: {
					latitude: 31.260542,
					longitude: 120.727032,
				},
				northeast: {
					latitude: 31.285117,
					longitude: 120.754669,
				},
			},
			visible: true,
			zIndex: 99,
			opacity: 0.5,
			complete: () => {
				const cont = `${chCont['mapExplanation']['updateGroundOverlay']}\n\n${enCont['mapExplanation']['updateGroundOverlay']}`;
				setFeatureCont(cont);
			},
		});
	}

	function removeGroundOverlay(): void {
		mapCtx.current.removeGroundOverlay({
			id: GROUNDOVERLAYID,
			complete: () => {
				const cont = `${chCont['mapExplanation']['removeGroundOverlay']}\n\n${enCont['mapExplanation']['removeGroundOverlay']}`;
				setFeatureCont(cont);
			},
		});
	}

	function addMarkers(): void {
		mapCtx.current.addMarkers({
			markers: ADDMARKERS,
			clear: false,
			complete: () => {
				const cont = `${chCont['mapExplanation']['addMarkers']}\n\n${enCont['mapExplanation']['addMarkers']}`;
				setFeatureCont(cont);
			},
		});
	}

	function translateMarker(): void {
		mapCtx.current.translateMarker({
			markerId: MAPMARKERS[0].id,
			destination: {
				latitude: 31.308586,
				longitude: 120.744198,
			},
			autoRotate: true,
			rotate: 80,
			moveWithRotate: true,
			duration: 6000,
			animationEnd: (res: any) => {
				console.log(res, 'animationEnd');
			},
			complete: () => {
				const cont = `${chCont['mapExplanation']['translateMarker']}\n\n${enCont['mapExplanation']['translateMarker']}`;
				setFeatureCont(cont);
			},
		});
	}

	function removeMarkers(): void {
		mapCtx.current.removeMarkers({
			markerIds: ADDMARKERIDS,
			complete: () => {
				const cont = `${chCont['mapExplanation']['removeMarkers']}\n\n${enCont['mapExplanation']['removeMarkers']}`;
				setFeatureCont(cont);
			},
		});
	}

	function addArc(): void {
		mapCtx.current.addArc({
			id: ARCID,
			start: {
				latitude: 31.255065,
				longitude: 120.732273,
			},
			end: {
				latitude: 31.254093,
				longitude: 120.7206,
			},
			pass: {
				latitude: 31.253689,
				longitude: 120.728432,
			},
			angle: 23,
			width: 3,
			color: '#3092ff',
			complete: () => {
				const cont = `${chCont['mapExplanation']['addArc']}\n\n${enCont['mapExplanation']['addArc']}`;
				setFeatureCont(cont);
			},
		});
	}

	function removeArc(): void {
		mapCtx.current.removeArc({
			id: ARCID,
			complete: () => {
				const cont = `${chCont['mapExplanation']['removeArc']}\n\n${enCont['mapExplanation']['removeArc']}`;
				setFeatureCont(cont);
			},
		});
	}

	function addCustomLayer(): void {
		mapCtx.current.addCustomLayer({
			layerId: CUSTOMLAYERID,
			complete: () => {
				const cont = `${chCont['mapExplanation']['addCustomLayer']}\n\n${enCont['mapExplanation']['addCustomLayer']}`;
				setFeatureCont(cont);
			},
		});
	}

	function removeCustomLayer(): void {
		mapCtx.current.removeCustomLayer({
			layerId: CUSTOMLAYERID,
			complete: () => {
				const cont = `${chCont['mapExplanation']['removeCustomLayer']}\n\n${enCont['mapExplanation']['removeCustomLayer']}`;
				setFeatureCont(cont);
			},
		});
	}

	function addVisualLayer(): void {
		mapCtx.current.addVisualLayer({
			layerId: VISUAILAYERID,
			interval: 20,
			// zIndex: 10,
			// opacity: 1,
			complete: () => {
				const cont = `${chCont['mapExplanation']['addVisualLayer']}\n\n${enCont['mapExplanation']['addVisualLayer']}`;
				setFeatureCont(cont);
			},
		});
	}

	function removeVisualLayer(): void {
		mapCtx.current.removeVisualLayer({
			layerId: VISUAILAYERID,
			complete: () => {
				const cont = `${chCont['mapExplanation']['removeVisualLayer']}\n\n${enCont['mapExplanation']['removeVisualLayer']}`;
				setFeatureCont(cont);
			},
		});
	}

	function getCenterLocation(): void {
		mapCtx.current.getCenterLocation({
			iconPath: centerPoinIconPath,
			complete: (res: { longitude: any; latitude: any }) => {
				const { longitude, latitude } = res;
				const cont = `${chCont['mapExplanation']['getCenterLocation']}\n\n${enCont['mapExplanation']['getCenterLocation']}\n\nlongitude：${longitude}\nlatitude：${latitude}`;
				setFeatureCont(cont);
			},
		});
	}

	function getRegion(): void {
		mapCtx.current.getRegion({
			complete: (res: { southwest: any; northeast: any }) => {
				const { southwest, northeast } = res;
				const cont = `${chCont['mapExplanation']['getRegion']}\n\n${enCont['mapExplanation']['getRegion']}\n\nsouthwest：\n经度${southwest.longitude}\n纬度：${southwest.latitude}\nnortheast：\n经度${northeast.longitude}\n纬度：${northeast.latitude}`;
				setFeatureCont(cont);
			},
		});
	}

	function getRotate(): void {
		mapCtx.current.getRotate({
			complete: (res: { rotate: any }) => {
				const cont = `${chCont['mapExplanation']['getRotate']}\n\n${enCont['mapExplanation']['getRotate']}\n\nrotate：${res.rotate}`;
				setFeatureCont(cont);
			},
		});
	}

	function getScale(): void {
		mapCtx.current.getScale({
			complete: (res: { scale: any }) => {
				const cont = `${chCont['mapExplanation']['getScale']}\n\n${enCont['mapExplanation']['getScale']}\n\nscale:${res.scale}`;
				setFeatureCont(cont);
			},
		});
	}

	function getSkew(): void {
		mapCtx.current.getSkew({
			complete: (res: { skew: any }) => {
				const cont = `${chCont['mapExplanation']['getSkew']}\n\n${enCont['mapExplanation']['getSkew']}\n\nskew:${res.skew}`;
				setFeatureCont(cont);
			},
		});
	}

	function includePoints(): void {
		mapCtx.current.includePoints({
			points: POINTS,
			padding: [2], // ios 可设置4个值, android 只可识别第一项
			complete: () => {
				const cont = `${chCont['mapExplanation']['includePoints']}\n\n${enCont['mapExplanation']['includePoints']}`;
				setFeatureCont(cont);
			},
		});
	}

	function moveAlong(): void {
		mapCtx.current.moveAlong({
			markerId: 3,
			path: PATHFORMOVEALONG,
			autoRotate: true,
			duration: 15000, // ms
			complete: () => {
				const cont = `${chCont['mapExplanation']['moveAlong']}\n\n${enCont['mapExplanation']['moveAlong']}`;
				setFeatureCont(cont);
			},
		});
	}

	function moveToLocation(): void {
		getWechatAuth({
			scope: 'scope.userLocation',
			forceMsg: '需要授权定位哦',
			onReject: () =>
				Taro.showToast({ title: '拒绝定位无法将地图中心移置当前定位点哦', icon: 'none' }),
		}).then(() => {
			// const { longitude, latitude } = isResetMapCenter.current
			// 	? CENTERLOCATION[0]
			// 	: CENTERLOCATION[1];
			// isResetMapCenter.current = !isResetMapCenter.current;
			Taro.showLoading({ title: '加载中', mask: true });
			mapCtx.current.moveToLocation({
				// longitude,
				// latitude,
				complete: () => {
					Taro.hideLoading();
					const cont = `${chCont['mapExplanation']['moveToLocation']}\n\n${enCont['mapExplanation']['moveToLocation']}`;
					setFeatureCont(cont);
				},
			});
		});
	}

	function openMapApp(): void {
		mapCtx.current.openMapApp({
			longitude: POSITION[0].longitude,
			latitude: POSITION[0].latitude,
			destination: POSITION[0].name,
			complete: () => {
				const cont = `${chCont['mapExplanation']['openMapApp']}\n\n${enCont['mapExplanation']['openMapApp']}`;
				setFeatureCont(cont);
			},
		});
	}

	function setBoundary(): void {
		mapCtx.current.setBoundary({
			southwest: {
				latitude: 31.124233,
				longitude: 120.274618,
			},
			northeast: {
				latitude: 31.518997,
				longitude: 121.039541,
			},
			complete: () => {
				const cont = `${chCont['mapExplanation']['setBoundary']}\n\n${enCont['mapExplanation']['setBoundary']}`;
				setFeatureCont(cont);
			},
		});
	}

	function getScreenLocation(): void {
		mapCtx.current.toScreenLocation({
			latitude: CENTERLOCATION[0].latitude,
			longitude: CENTERLOCATION[0].longitude,
			complete: () => {
				const cont = `${chCont['mapExplanation']['toScreenLocation']}\n\n${enCont['mapExplanation']['toScreenLocation']}`;
				setFeatureCont(cont);
			},
		});
	}

	// 设置地图中心点偏移，向后向下为增长，屏幕比例范围(0.25~0.75)，默认偏移为[0.5, 0.5]
	function setCenterOffset(): void {
		mapCtx.current.setCenterOffset({
			offset: [0.7, 0.7],
			complete: () => {
				const cont = `${chCont['mapExplanation']['setCenterOffset']}\n\n${enCont['mapExplanation']['setCenterOffset']}`;
				setFeatureCont(cont);
			},
		});
	}

	// 暂未提供clearLocMarkrIcon方法或者重置LocMarkrIcon方法
	function setLocMarkerIcon(setLocMarkerIconStatus?: object): void {
		mapCtx.current.setLocMarkerIcon({
			iconPath: setLocMarkerIconStatus ? locMarkeIconPath : ideaIconPath,
			complete: () => {
				if (setLocMarkerIconStatus) {
					const cont = `${chCont['mapExplanation']['setLocMarkerIcon']}\n\n${enCont['mapExplanation']['setLocMarkerIcon']}`;
					setFeatureCont(cont);
				}
			},
		});
	}

	function fromScreenLocation(): void {
		mapCtx.current.fromScreenLocation({
			x: 0,
			y: 0,
			complete: () => {
				const cont = `${chCont['mapExplanation']['fromScreenLocation']}\n\n${enCont['mapExplanation']['fromScreenLocation']}`;
				setFeatureCont(cont);
			},
		});
	}

	function addMapMarkers(): void {
		const data = markers.length > 0 ? [] : MAPMARKERS;
		setMarkers(data);
		const cont = `${chCont['mapExplanation']['addMapMarkers']}\n\n${enCont['mapExplanation']['addMapMarkers']}`;
		setFeatureCont(cont);
	}

	// circles 重置为[]，不会clear circles,新增一个circle且经纬度设置为undefined，可clear circles.此方法真机正常，工具报错。
	function addCircles(): void {
		const data = circles.length > 0 && !!circles[0].latitude ? defaultCircles : CIRCLES;
		setCircles(data);
		const cont = `${chCont['mapExplanation']['addCircles']}\n\n${enCont['mapExplanation']['addCircles']}`;
		setFeatureCont(cont);
	}

	function addMapPolyGons(): void {
		const data = polygons.length > 0 ? [] : POLYGONS;
		setPolygons(data);
		const cont = `${chCont['mapExplanation']['addMapPolyGons']}\n\n${enCont['mapExplanation']['addMapPolyGons']}`;
		setFeatureCont(cont);
	}

	function addMapPolyLine(): void {
		const data = polyline.length > 0 ? [] : POLYLINE;
		setPolyline(data);
		const cont = `${chCont['mapExplanation']['addMapPolyLine']}\n\n${enCont['mapExplanation']['addMapPolyLine']}`;
		setFeatureCont(cont);
	}

	function changeSetting(): void {
		const data =
			mapSetting.scale === 12
				? { ...mapSetting, ...{ scale: 14 } }
				: { ...mapSetting, ...{ scale: 12 } };
		setMapSetting(data);
	}

	function clearMapObjs(): void {
		setMarkers([]);
		setPolygons([]);
		setPolyline([]);
		setCircles(defaultCircles);
		setLocMarkerIcon();
		removeArc();
		removeMarkers();
		removeCustomLayer();
		removeGroundOverlay();
		removeVisualLayer();
		setFeatureCont('');
	}

	function clearAll(): void {
		Taro.showLoading({ title: '清除中...', mask: true });
		clearMapObjs();
		Taro.hideLoading();
	}

	function resetPoi(fnc: any): void {
		getWechatAuth({
			scope: 'scope.userLocation',
			forceMsg: '需要授权定位哦',
			onReject: () => Taro.showToast({ title: '拒绝定位无法将地图中心重置哦', icon: 'none' }),
		}).then(() => {
			Taro.showLoading({ title: '加载中...', mask: true });
			const { longitude, latitude } = CENTERLOCATION[0];
			mapCtx.current.moveToLocation({
				longitude,
				latitude,
				complete: () => {
					typeof fnc === 'function' && fnc();
					setMapSetting({ ...defaultMapSetting });
					Taro.hideLoading();
				},
			});
		});
	}

	function clearAllAndResetPoi(): void {
		resetPoi(clearMapObjs);
	}

	function clearCont(): void {
		setFeatureCont('');
	}

	function handTap(): void {
		const cont = featureCont + `\n\nYou click the map.`;
		setFeatureCont(cont);
	}

	function onRegionChange(): void {
		const cont = featureCont + `\n\nvision changes`;
		setFeatureCont(cont);
	}

	function onMarkerTap(e: { detail: { markerId: any } }): void {
		const { markerId } = e.detail;
		setFeatureCont(`You click the marker which's id is ${markerId}.`);
	}

	function onCalloutTap(e: { detail: { markerId: any } }): void {
		const { markerId } = e.detail;
		setFeatureCont(`You click the callout bubble.It is on the marker which's id is ${markerId}`);
	}

	function onLabelTap(e: { detail: { markerId: any } }): void {
		const { markerId } = e.detail;
		setFeatureCont(`You click the label bubble.It is on the marker which's id is ${markerId}`);
	}

	function onPoiTap(e: { detail: { latitude: any; longitude: any; name: any } }): void {
		const { latitude, longitude, name } = e.detail;
		const cont = !!name
			? `You click the position of ${name}\nlatitude: ${latitude}\nlongitude:${longitude}`
			: '';
		setFeatureCont(cont);
	}

	function onUpdated(): void {
		const cont = featureCont ? featureCont + `\n\nMap updates.` : '';
		setFeatureCont(cont);
	}

	return (
		<View className='mapcontext page'>
			<View className='wrap'>
				<Button className='btn' onClick={addMapMarkers}>
					addordelMapMarkers
				</Button>
				<Button className='btn' onClick={addCircles}>
					addordelCircles
				</Button>
				<Button className='btn' onClick={addMapPolyGons}>
					addordelMapPolyGons
				</Button>
				<Button className='btn' onClick={addMapPolyLine}>
					addordelMapPolyLine
				</Button>
				<Button className='btn' onClick={addArc}>
					addArc
				</Button>
				<Button className='btn' onClick={removeArc}>
					removeArc
				</Button>
				<Button className='btn' onClick={addCustomLayer}>
					addCustomLayer
				</Button>
				<Button className='btn' onClick={removeCustomLayer}>
					removeCustomLayer
				</Button>
				<Button className='btn' onClick={addVisualLayer}>
					addVisualLayer
				</Button>
				<Button className='btn' onClick={removeVisualLayer}>
					removeVisualLayer
				</Button>
				<Button className='btn' onClick={addGroundOverlay}>
					addGroundOverlay
				</Button>
				<Button className='btn' onClick={updateGroundOverlay}>
					updateGroundOverlay
				</Button>
				<Button className='btn' onClick={removeGroundOverlay}>
					removeGroundOverlay
				</Button>
				<Button className='btn' onClick={addMarkers}>
					addMarkers
				</Button>
				<Button className='btn' onClick={translateMarker}>
					translateMarker
				</Button>
				<Button className='btn' onClick={removeMarkers}>
					removeMarkers
				</Button>
				<Button className='btn' onClick={getCenterLocation}>
					getCenterLocation
				</Button>
				<Button className='btn' onClick={getRegion}>
					getRegion
				</Button>
				<Button className='btn' onClick={getRotate}>
					getRotate
				</Button>
				<Button className='btn' onClick={getScale}>
					getScale
				</Button>
				<Button className='btn' onClick={getSkew}>
					getSkew
				</Button>
				<Button className='btn' onClick={setBoundary}>
					setBoundary
				</Button>
				<Button className='btn' onClick={setCenterOffset}>
					setCenterOffset
				</Button>
				<Button className='btn' onClick={fromScreenLocation}>
					fromScreenLocation
				</Button>
				<Button className='btn' onClick={moveAlong}>
					moveAlong
				</Button>
				<Button className='btn' onClick={moveToLocation}>
					moveToLocation
				</Button>
				<Button className='btn' onClick={getScreenLocation}>
					toScreenLocation
				</Button>
				<Button className='btn' onClick={setLocMarkerIcon}>
					setLocMarkerIcon
				</Button>
				<Button className='btn' onClick={includePoints}>
					includePoints
				</Button>
				<Button className='btn' onClick={openMapApp}>
					openMapApp
				</Button>
				<Button className='btn' onClick={changeSetting}>
					changeScale
				</Button>
				<Button className='btn' onClick={clearAll}>
					clearAll
				</Button>
				<Button className='btn' onClick={resetPoi}>
					resetPosition
				</Button>
				<Button className='btn' onClick={clearAllAndResetPoi}>
					clearAllAndResetPoi
				</Button>
			</View>
			<Map
				id='myMap'
				className='map-container'
				markers={markers}
				polyline={polyline}
				circles={circles}
				polygons={polygons}
				setting={mapSetting}
				onTap={handTap}
				onRegionChange={onRegionChange}
				onMarkerTap={onMarkerTap}
				onLabelTap={onLabelTap}
				onPoiTap={onPoiTap}
				onCalloutTap={onCalloutTap}
				onUpdated={onUpdated}
			>
				<CoverView slot='callout'>
					<CoverView className='callout-box' markerId={MAPMARKERS[2].id}>
						<CoverImage className='callout-img' src={locMarkeIconPath} />
						<CoverView>custom callout</CoverView>
					</CoverView>
				</CoverView>
			</Map>
			<View className='content' dangerouslySetInnerHTML={{ __html: featureCont }}></View>
			<Button className='fixed-btn' onClick={clearCont}>
				clear
			</Button>
		</View>
	);
}
