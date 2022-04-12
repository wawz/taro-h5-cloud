import Taro from '@tarojs/taro';
//TODO, 一个项目多个api 地址的情况（实例化）
//TODO, 如果要实例化，而taro拦截器是全局的，则需要自行实现拦截器
//TODO, 更优雅的refresherValidator

type HTTPRequestInitOption = {
	/**
	 * api 前缀，请求时会拼接为url
	 */
	baseURL?: string;

	/**
	 * 将获取token的方法对外暴露，初始化配置后
	 * 每次请求时都会调用该方法以获取当前token
	 */
	getToken?: () => string;

	/**
	 * 对外暴露token刷新方法
	 */
	refreshToken?: () => Promise<any>;

	/**
	 * token刷新请求的验证器
	 * 由于401后所有请求都会被拦截，该函数用于判断当前是否为刷新请求
	 * 若不指定 或当返回false时，请求就会被拦截并推入请求栈
	 * @param requestParams
	 */
	refresherValidator?: (requestParams) => boolean;
};
export default class HTTP {
	private static isRefreshingToken = false; // 是否正在刷新的标记
	private static pendingRequests: Set<() => void> = new Set(); // 由401刷新token造成阻塞的请求池
	private static baseURL: string;
	private static getToken: (() => string) | undefined;
	private static refreshToken: (() => Promise<any>) | undefined;

	/**
	 * @param baseURL
	 * api 前缀，请求时会拼接为url
	 *
	 * @param getToken
	 * 将获取token的方法对外暴露，初始化配置后
	 * 每次请求时都会调用该方法以获取当前token
	 *
	 * @param refreshToken
	 * 对外暴露token刷新方法
	 *
	 *
	 * @param refresherValidator
	 * token刷新请求的验证器
	 * 由于401后所有请求都会被拦截，该函数用于判断当前是否为刷新请求
	 * 若不指定 或当返回false时，请求就会被拦截并推入请求栈
	 */

	public static init({
		baseURL = '',
		getToken = undefined,
		refreshToken = undefined,
		refresherValidator = undefined,
	}: HTTPRequestInitOption) {
		this.baseURL = baseURL;
		this.getToken = getToken;
		this.refreshToken = refreshToken;

		this.refreshToken = refreshToken;

		const interceptor = (chain) => {
			//拦截器需要调用proceed 才能进入下一个拦截器
			//利用Promise不resolve就不执行的特性，用Promise包裹proceed，便于在token更新后调用
			return new Promise((resolve) => {
				const requestParams = chain.requestParams;
				const proceedBody = () => {
					resolve(
						chain.proceed(requestParams).then((res) => {
							switch (true) {
								default:
									return res;
								case res.statusCode === 401 &&
									refreshToken !== undefined &&
									!this.isRefreshingToken:
									this.isRefreshingToken = true;
									console.warn('HTTP: ', '正在刷新Token');
									this.refreshToken?.()
										.then(() => {
											console.warn('HTTP: ', 'Token刷新成功');
											this.isRefreshingToken = false;
											this.pendingRequests.forEach((pendedRequest) => pendedRequest?.());
											this.pendingRequests.clear();
											return res;
										})
										.catch(() => {
											console.warn('HTTP: ', 'Token刷新失败');
											return res;
										});
									break;
							}
						})
					);
				};
				if (
					this.isRefreshingToken &&
					!(refresherValidator ? refresherValidator(chain.requestParams) : false)
				) {
					// 如果此时正在刷新token，且该请求不是刷新Token的请求
					// 则将proceed加入请求池，待刷新完成后调用
					console.warn(`正在刷新token, ${requestParams.url} 进入请求栈`);
					this.pendingRequests.add(proceedBody);
				} else {
					// 否则直接执行proceed
					proceedBody();
				}
			});
		};
		Taro.addInterceptor(interceptor);
	}
	private static responseHandler(
		response: Taro.request.SuccessCallbackResult,
		resolve: (res: Taro.request.SuccessCallbackResult) => any,
		reject: (res: Taro.request.SuccessCallbackResult) => any
	) {
		response.statusCode < 400 ? resolve(response) : reject(response);
	}
	public static getBasicHeader(token?: string): any {
		return {
			'Authorization': token || this.getToken?.(),
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'cache': 'no-cache',
			'crossdomain': 'true',
		};
	}
	/**
	 * static get
	 */
	public static get(url, data?, config?: Taro.request.Option): Promise<any> {
		const requestParams = {
			url: this.baseURL + url,
			data,
			method: 'GET',
			header: this.getBasicHeader(),
		};
		const getPromise = new Promise((resolve, reject) => {
			Taro.request({
				...(requestParams as any),
				...config,
				success: (response) => {
					if (response.statusCode === 401) {
						console.warn(`HTTP: 正在刷新token, ${requestParams.url} 进入请求栈`);
						this.pendingRequests.add(() => {
							console.warn(`HTTP: ${requestParams.url} 延时执行`);
							// 成功
							// Taro.login({
							// 	success: (token) => {
							// 		this.post('/v1/customers', { wechat_token: token.code }).then((res) => {
							// 			this.responseHandler(res, resolve, reject);
							// 		});
							// 	},
							// });

							// 失败

							this.get(url, data, config)
								.then((res) => {
									this.responseHandler(res, resolve, reject);
								})
								.catch((res) => {
									this.responseHandler(res, resolve, reject);
								});
						});
					} else {
						this.responseHandler(response, resolve, reject);
					}
				},
				fail: (response) => {
					reject(response);
				},
			});
		});
		return getPromise;
	}
	/**
	 * static post
	 */
	public static post(url, data, config?: Taro.request.Option): Promise<any> {
		return new Promise((resolve, reject) => {
			Taro.request({
				url: this.baseURL + url,
				data,
				method: 'POST',
				header: this.getBasicHeader(),
				...config,
				success: (response) => {
					this.responseHandler(response, resolve, reject);
				},
				fail: (response) => {
					reject(response);
				},
			});
		});
	}
	/**
	 * static get
	 */
	public static delete(url, data, config?: Taro.request.Option) {}
	/**
	 * static put
	 */
	public static put(url, data, config?: Taro.request.Option) {}
	/**
	 * static patch
	 */
	public static patch(url, data, config?: Taro.request.Option) {}
	/**
	 * static option
	 */
	public static option(url, config?: Taro.request.Option) {}
	/**
	 * static head
	 */
	public static head(url, config?: Taro.request.Option) {}
}
