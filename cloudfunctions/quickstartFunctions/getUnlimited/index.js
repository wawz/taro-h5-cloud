const cloud = require('wx-server-sdk')
/**
 * 
 */
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
/**
 * openapi.wxacode.getUnlimited 所需的参数类型
 */
const defalutParamType = {
  scene: 'a=1', // scene必填,其他属性非必填
  page: 'pages/index/index', // 扫码进入的小程序页面路径,如果不填写这个字段，默认跳主页面
  checkPath: false, // 检查 page 是否存在,为 true 时 page 必须是已经发布的小程序存在的页面（否则报错）；为 false 时允许小程序未发布或者 page 不存在
  envVersion: 'develop', // 要打开的小程序版本。正式版为 release，体验版为 trial，开发版为 develop
  width: 430,// 二维码的宽度，单位 px。最小 280px，最大 1280px
  autoColor: false,// 自动配置线条颜色
  lineColor: { "r": 0, "g": 0, "b": 0 }, // auto_color 为 false 时生效，使用 rgb 设置颜色 
  isHyaline: false, // 是否需要透明底色
}

exports.main = async (event, context) => {
  try {
    const defalutParam = {
      scene: event.data.scene,
    };
    for (let i in event.data) {
      if (event.data[i] !== undefined) {
        defalutParam[i] = event.data[i];
      }
    }
    console.log(defalutParam, 'default-param');
    const result = await cloud.openapi.wxacode.getUnlimited(defalutParam)
    return result
  } catch (err) {
    return err
  }
}