const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
/**
 * 获取小程序 Short Link
 * @param {*} pageUrl 通过 Short Link 进入的小程序页面路径，必须是已经发布的小程序存在的页面，可携带 query，最大1024个字符
 * @param {*} page_title 页面标题，不能包含违法信息，超过20字符会用... 截断代替
 * @param {*} ispermanent 生成的 Short Link 类型，短期有效：false，永久有效：true
 */


exports.main = async (event, context) => {
  try {
    const { pageUrl, pageTitle, isPermanent = false } = event.data;
    const result = await cloud.openapi.shortlink.generate({
      pageUrl,
      pageTitle,
      isPermanent,
    })
    return result
  } catch (err) {
    return err
  }
}
