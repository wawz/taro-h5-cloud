const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

/**
 * 提供基于小程序的银行卡 OCR 识别
 * @param {*} imgUrl	string:	要检测的图片 url，传这个则不用传 img 参数。
 * @param {*} img	FormData: form-data 中媒体文件标识，有filename、filelength、content-type等信息，传这个则不用传 img_url。
 * img 结构
 * @param {*}  contentType	string: 数据类型，传入 MIME Type
 * @param {*}  value	Buffer:文件 Buffer
 * @returns 
 */
exports.main = async (event) => {
  try {
    console.log(event.data, 'data===>');
    const result = await cloud.openapi.ocr.bankcard(event.data);
    return result
  } catch (err) {
    return err
  }
}