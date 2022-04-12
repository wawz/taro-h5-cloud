const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

/**
 * 提供基于小程序的身份证 OCR 识别
 * @param {*} imgUrl	string:	要检测的图片 url，传这个则不用传 img 参数。
 * @param {*} img	FormData: form-data 中媒体文件标识，有filename、filelength、content-type等信息，传这个则不用传 img_url。
 * img 结构
 * @param {*}  contentType	string: 数据类型，传入 MIME Type
 * @param {*}  value	Buffer:文件 Buffer
 * @returns object 包含以下内容
 * @returns errCode	string	错误码
 * @returns errMsg	string	错误信息
 * @returns type	string	正面或背面，Front / Back
 * @returns valid_date	string	有效期
 */
exports.main = async (event) => {
  try {
    const result = await cloud.openapi.ocr.idcard(event.data);
    return result
  } catch (err) {
    return err
  }
}