/**
 * Measurement Protocol 参数参考
 * @see https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
 */

/*global wx*/
/*global getCurrentPages*/

console.log('GAS');

const systemInfo = wx.getSystemInfoSync();
const userAgent = buildUserAgentFromSystemInfo(systemInfo);
let prevScene = wx.getStorageSync('PREV_ENDER_SCENE');
let launchParam = {};

//每次进入判断场景值变化，如果变化了，则使用新的启动参数
wx.onAppShow(() => {
	const enterOption = wx.getEnterOptionsSync();
	if (prevScene === enterOption.scene) {
		launchParam = wx.getStorageSync('PREV_ENTER_QUERY');
	} else {
		launchParam = enterOption.query;
		wx.setStorageSync('PREV_ENDER_SCENE', enterOption.scene);
		wx.setStorageSync('PREV_ENTER_QUERY', launchParam);
	}
});

export default class GAService {
	static pageTilteCache = '';
	static basicPayload = {
		v: 1,
		cid: getCid(),
		ds: 'web',
		ul: systemInfo.language,
		de: 'UTF-8',
		dh: 'google.31ten.cn',
		ua: userAgent,
		cs: (launchParam && launchParam.utm_source) || '',
		cm: (launchParam && launchParam.utm_medium) || '',
		cc: (launchParam && launchParam.utm_content) || '',
		cn: (launchParam && launchParam.utm_campaign) || '',
	};
	/** 上报配置
	 * @param basicConfig 基础参数，第一次调用必须配置tid，即常说的ga_id
	 * Measurement Protocol 参数参考
	 * @see https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
	 */
	static config(basicConfig) {
		this.basicPayload = {
			...this.basicPayload,
			...basicConfig,
		};
	}
	static async send(type, payload) {
		payload = {
			...this.basicPayload,
			...payload,
			dp: getCurrentPagePath(),
		};
		if (!payload.tid) {
			throw new Error('tid未指定，请检查config配置项');
		}

		if (!payload.cid && !payload.uid) {
			throw new Error('无用户标识uid或客户端标识cid，请检查上报内容');
		}

		if (
			![
				'pageview',
				'screenview',
				'event',
				'transaction',
				'item',
				'social',
				'exception',
				'timing',
			].includes(type)
		) {
			console.error(
				`匹配的类型。必须是'pageview','screenview','event','transaction','item','social','exception','timing”中的一个。`
			);
			throw new Error('匹配类型未指定');
		}

		if (!payload.dp && !payload.dl) {
			throw new Error('必须指定dh+dp或者dl');
		}
		console.table(payload);

		let reqOption = {
			url: `https://google.31ten.cn/collect`,
			method: 'POST',
			data: encodePayload({
				t: type,
				...payload,
				z: Math.random(),
			}),
		};
		wx.request({ ...reqOption });
	}
	static pageView(pageTitle, extraData = {}) {
		this.pageTilteCache = pageTitle;
		this.send('pageview', {
			dt: pageTitle || '',
			...extraData,
		});
	}

	static async post(payload) {
		this.send('event', {
			dt: this.pageTilteCache,
			...payload,
		});
	}
}

function getCurrentPagePath() {
	return getCurrentPages().pop().route;
}

/**
 * @description: 将报文对象转化为query字符串
 * @param {any} payload
 * @return {*}
 */
function encodePayload(payload) {
	return Object.entries(payload)
		.map((pair) => `${pair[0]}=${encodeURIComponent(pair[1].toString())}`)
		.join('&');
}

/** uuid生成器
 * 生成一个UUID作为cid并保存在本地
 * @description: 上报时cid 和 uid 至少得有一个作为用户标识
 * @return {string} 字符串
 */
function getCid() {
	if (wx.getStorageSync('_ga')) {
		return wx.getStorageSync('_ga');
	} else {
		var s = [];
		var hexDigits = '0123456789abcdef';
		for (var i = 0; i < 36; i++) {
			let start = Math.floor(Math.random() * 0x10);
			s[i] = hexDigits.slice(start, start + 1);
		}
		s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010

		s[19] = hexDigits.slice((s[19] & 0x3) | 0x8, ((s[19] & 0x3) | 0x8) + 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = '-';

		var uuid = s.join('');
		wx.setStorageSync('_ga', uuid);
		return uuid;
	}
}

/**
 * @description: 由于微信没有useragent，所以这里需要仿造一个
 * @param {getSystemInfo.result} systemInfo wx.getSystemInfoSync 返回的对象 https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfo.html
 * @return {string}
 */
function buildUserAgentFromSystemInfo(_systemInfo) {
	const isAndroid = _systemInfo.system.toLowerCase().indexOf('android') > -1;
	const isIPad = !isAndroid && _systemInfo.model.toLowerCase().indexOf('iphone') == -1;

	const { system, model, version } = _systemInfo;
	if (isAndroid) {
		return `Mozilla/5.0 (Linux; U; ${system}; ${model} Build/000000) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 Chrome/49.0.0.0Mobile Safari/537.36 MicroMessenger/
			${version}`;
	} else if (!isIPad) {
		// iOS
		const v = system
			.replace(/^.*?([0-9.]+).*?$/, function (x, y) {
				return y;
			})
			.replace(/\./g, '_');
		return `Mozilla/5.0 (iPhone; CPU iPhone OS ${v} like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92 MicroMessenger/${version}`;
	} else {
		// iPad
		const v = system
			.replace(/^.*?([0-9.]+).*?$/, function (x, y) {
				return y;
			})
			.replace(/\./g, '_');
		return `Mozilla/5.0 (iPad; CPU OS ${v} like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/10A406 MicroMessenger/${version}`;
	}
}
