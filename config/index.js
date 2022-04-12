import * as fs from 'fs';
import * as path from 'path';
import TestConfig from './test';
import UatConfig from './uat';
import ProdConfig from './prod';

// Taro项目的编译配置
// https://taro-docs.jd.com/taro/docs/config-detail

const defaultConfig = {
	projectName: 'Taro-MP-Template',
	date: '2022-1-17',
	designWidth: 375,
	deviceRatio: {
		375: 2,
		640: 2.34 / 2,
		750: 1,
		828: 1.81 / 2,
	},
	sourceRoot: 'src',
	outputRoot: `dist/${process.env.TARO_ENV}`,
	plugins: [],
	defineConstants: {},
	copy: {
		patterns: [],
		options: {},
	},
	framework: 'react',
	mini: {
		postcss: {
			pxtransform: {
				enable: true,
				config: {},
			},
			url: {
				enable: true,
				config: {
					limit: 1024, // 设定转换尺寸上限
				},
			},
			cssModules: {
				enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
				config: {
					namingPattern: 'module', // 转换模式，取值为 global/module
					generateScopedName: '[name]__[local]___[hash:base64:5]',
				},
			},
		},
	},
	h5: {
		publicPath: '/',
		staticDirectory: 'static',
		postcss: {
			autoprefixer: {
				enable: true,
				config: {},
			},
			cssModules: {
				enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
				config: {
					namingPattern: 'module', // 转换模式，取值为 global/module
					generateScopedName: '[name]__[local]___[hash:base64:5]',
				},
			},
		},
	},
	alias: {
		'@': path.resolve(__dirname, '..', 'src/'),
		'@app.config': path.resolve(__dirname, '..', 'src/app.config.ts'),
		'@contexts': path.resolve(__dirname, '..', 'src/contexts'),
		'@actions': path.resolve(__dirname, '..', 'src/actions'),
		'@assets': path.resolve(__dirname, '..', 'src/assets'),
		'@components': path.resolve(__dirname, '..', 'src/components'),
		'@constants': path.resolve(__dirname, '..', 'src/constants'),
		'@reducers': path.resolve(__dirname, '..', 'src/reducers'),
		'@styles': path.resolve(__dirname, '..', 'src/styles'),
		'@utils': path.resolve(__dirname, '..', 'src/utils'),
		'@services': path.resolve(__dirname, '..', 'src/services'),
		'@models': path.resolve(__dirname, '..', 'src/models'),
		'@store': path.resolve(__dirname, '..', 'src/store'),
	},
};

//通常小程序的开发阶段和交付阶段使用的是不同的appid
//为保留本地开发工具中的配置，且切换环境时不触发git文件修改
//project.config.json 将被gitignore忽略
//appid将根据命令动态写入project.config.json
//旨在帮助开发者快速切换环境，减少需要需配置的文件

//根据环境读取配置文件
let enviromentConfig;
switch (process.env.NODE_ENV) {
	default:
	case 'test':
		enviromentConfig = TestConfig;
		break;
	case 'uat':
		enviromentConfig = UatConfig;
		break;
	case 'production':
		enviromentConfig = ProdConfig;
		break;
}

console.log(`读取 ${process.env.NODE_ENV} 环境配置文件`);
//检查配置文件中的APPID
if (!enviromentConfig.appid) {
	console.error(`${process.env.NODE_ENV} 环境配置文件中未定义appid`);
	process.exit(1);
}
console.log(`发现 ${process.env.NODE_ENV} 环境配置文件`);

const projectConfigPath = './project.config.json';
let projectConfig;

try {
	console.log(`读取 ${projectConfigPath} 项目配置文件`);
	projectConfig = JSON.parse(fs.readFileSync(projectConfigPath).toString());
} catch (error) {
	console.log(`未发现项目配置文件，生成默认配置`);
	//小程序默认配置
	projectConfig = {
		miniprogramRoot: 'dist/',
		projectname: 'Taro_MP_Template',
		description: 'Taro_MP_Template',
		setting: { urlCheck: process.env.NODE_ENV === 'production' },
		compileType: 'miniprogram',
	};
}

//根据环境直接将appid写入配置
projectConfig.appid = enviromentConfig.appid;
try {
	console.log(`将appid: ${enviromentConfig.appid} 写入 ${projectConfigPath}`);
	fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfig));
} catch (error) {
	console.log(`环境appid写入失败，请手动配置${projectConfigPath}`);
}

export default function (merge) {
	return merge({}, defaultConfig, enviromentConfig);
}
