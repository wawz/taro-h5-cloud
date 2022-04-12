/**
 * 客户验收环境配置文件
 * 此处的修改需要重新编译才能生效
 */
export default {
	//小程序appid,编译时会注入project.config.json
	appid: '"touristappid"',
	env: {
		NODE_ENV: '"uat"',
	},
	defineConstants: {
		//一些根据环境变化的常量，例如各类埋点工具id，订阅消息模板，对应环境的接口地址等
		//声明后可以在代码中作为全局常量访问
		//例：注意引号的嵌套
		//API_URL: '"https://a.b.com/api/"',
		//
		//亦或可以写成
		//API_URL: JSON.stringify("https://a.b.com/api/"),
	},
};
