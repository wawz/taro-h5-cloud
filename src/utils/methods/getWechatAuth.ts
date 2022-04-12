declare const wx: any;

/** 微信授权的相关权限枚举 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 */
type WechatScopes =
	//地理位置
	// 涉及接口	wx.getLocation, wx.chooseLocation, wx.startLocationUpdate
	| 'scope.userLocation'
	//后台定位
	// 涉及接口	wx.startLocationUpdateBackground
	| 'scope.userLocationBackground'
	//麦克风
	// 涉及接口	wx.startRecord, wx.joinVoIPChat, RecorderManager.start
	| 'scope.record'
	//摄像头
	// 涉及接口	camera组件, wx.createVKSession
	| 'scope.camera'
	//蓝牙
	// 涉及接口	wx.openBluetoothAdapter, wx.createBLEPeripheralServer
	| 'scope.bluetooth'
	//添加到相册
	// 涉及接口	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum
	| 'scope.writePhotosAlbum'
	//添加到联系人
	// 涉及接口	wx.wx.addPhoneContact
	| 'scope.addPhoneContact'
	//添加到日历
	// 涉及接口	wx.addPhoneRepeatCalendar, wx.addPhoneCalendar
	| 'scope.addPhoneCalendar'
	//微信运动步数
	// 涉及接口	wx.getWeRunData
	| 'scope.werun'
	//通讯地址（已取消授权，可以直接调用对应接口）
	// 涉及接口	wx.chooseAddress
	| 'scope.address'
	//发票抬头（已取消授权，可以直接调用对应接口）
	// 涉及接口	wx.chooseInvoiceTitle
	| 'scope.invoiceTitle'
	//获取发票（已取消授权，可以直接调用对应接口）
	// 涉及接口	wx.chooseInvoice
	| 'scope.invoice';

type GetAuthOption = {
	/**
	 * 指定授权的scope
	 */
	scope: WechatScopes;

	/**
	 * 强制授权时的弹窗提示文字
	 *
	 * 指定时，用户必须授权（或打开设置）才resolve，不指定时，无论用户接受还是拒绝，都进入resolve
	 *
	 * 效果：当访问一个以被拒绝的scope时，弹窗提示‘forceMsg’才能继续，并引导用户打开设置
	 *
	 * 场景：保存图片至本地时，如果用户未授权writePhotosAlbum，提示（需要相册权限才能保存）
	 */
	forceMsg?: string;

	/**
	 * 首次授权时，用户同意授权的回调
	 * 常用于页面提示或埋点
	 */
	onAgree?: () => void;

	/**
	 * 首次授权时，用户拒绝授权的回调
	 * 常用于页面提示或埋点
	 */
	onReject?: () => void;
};
/**
 * 微信授权接口的封装
 * @param {string} scope              指定授权的scope
 * @param {string} forceMsg        强制授权时的弹窗提示文字
 * @param {function} onAgree    首次授权时，用户同意授权的回调
 * @param {function} onReject    首次授权时，用户拒绝授权的回调
 *
 *
 * @description 用于在调用相关接口前先授权，保证后续的接口调用可以放行
 *
 * **注意**: 该方法不包含手机授权和个人信息授权，且resolve仅代表用户授权，不代表相关接口都能顺利调用
 *
 * 例如：用户未开启手机定位时访问getLocation
 *
 * 此类情况仍然需在相关接口的回调中进行处理
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/authorize/wx.authorize.html
 * @example
 * ```js
 * // 不强制用户授权
 * getWechatAuth({
 *      scope: 'scope.writePhotosAlbum',
 *      onAgree:()=>{//首次授权同意后的回调},
 *      onReject:()=>{//首次授权拒绝后的回调}
 * })
 *
 * // 强制用户授权
 *  getWechatAuth({
 *      scope: 'scope.writePhotosAlbum',
 *      forceMsg: '需要授权相册权限才能继续哦',
 *      onAgree:()=>{//首次授权同意后的回调},
 *      onReject:()=>{//首次授权拒绝后的回调}
 *  }).catch(() => console.log('用户还是没同意'));
 * ```
 */
export function getWechatAuth(authOption: GetAuthOption): Promise<void> {
	// 授权弹窗有两种方式: 1.在调用相关接口时自动弹出，2.使用wx.authorize主动弹出
	// 方式1的失败也有两种可能，用户拒绝或者在用户在设置中关闭该scope
	// 且同一 scope 只能 wx.authorize 一次（拒绝后再次调用会走fail）
	// 所以采用方式2实现要求用户必须授权等逻辑
	const { scope: authScope, forceMsg: forceMsg, onAgree, onReject } = authOption;
	return new Promise((resolve, reject) => {
		// resolve()，可以调用相关接口
		// reject()，用户未同意接口权限

		//通过getSetting获取用户设置，有三种情况
		wx.getSetting({
			fail: reject,
			success: (originalSetting) => {
				if (originalSetting.authSetting[authScope] === undefined) {
					//1.该scope为undefined，意味着小程序未曾向用户申请授权该scope
					// 主动唤起授权框
					wx.authorize({
						scope: authScope,
						success: (authResult) => {
							console.log(`getWechatAuth ${authScope} ${authResult.errMsg}`);
							if (authResult.errMsg === 'authorize:ok') {
								//用户同意授权
								onAgree?.();
								resolve();
							} else {
								//用户拒绝授权，如果未指定强制授权信息，resolve
								//用户拒绝授权，如果指定了强制授权信息，reject
								forceMsg === undefined ? resolve() : reject();
							}
						},
						fail: () => {
							onReject?.();
							//用户拒绝授权，如果未指定强制授权信息，resolve
							//用户拒绝授权，如果指定了强制授权信息，reject
							forceMsg === undefined ? resolve() : reject();
						},
					});
				} else if (!originalSetting.authSetting[authScope]) {
					//2.该scope为false，意味着小程序曾向用户申请授权该scope，但用户拒绝了
					forceMsg === undefined
						? //如果未指定强制授权信息，resolve
						  resolve()
						: //如果指定了强制授权的信息，则弹窗提示用户去设置
						  wx.showModal({
								content: forceMsg || '需要开启相关权限才能继续使用此功能。',
								confirmText: '去设置',
								success: (confirmResult) => {
									if (confirmResult.confirm) {
										// 打开用户setting
										wx.openSetting({
											success: (newSetting) => {
												// 用户返回后再次检查授权结果，此时肯定不为undefined，直接判断
												newSetting.authSetting[authScope] ? resolve() : reject();
											},
											fail: (res) => {
												reject(res);
											},
										});
									} else {
										reject();
									}
								},
								fail: reject,
						  });
				} else {
					//3.该scope为true，意味着小程序曾向用户申请授权该scope，且用户同意
					resolve();
				}
			},
		});
	});
}
