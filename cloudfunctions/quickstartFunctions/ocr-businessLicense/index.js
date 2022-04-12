const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

/**
 * 提供基于小程序的营业执照 OCR 识别
 * @param {*} imgUrl	string:	要检测的图片 url，传这个则不用传 img 参数。
 * @param {*} img	FormData: form-data 中媒体文件标识，有filename、filelength、content-type等信息，传这个则不用传 img_url。
 * img 结构
 * @param {*}  contentType	string: 数据类型，传入 MIME Type
 * @param {*}  value	Buffer:文件 Buffer
 * @returns object 包含以下内容
 * @returns errCode	string	错误码
 * @returns errMsg	string	错误信息
 * @returns regNum	string	注册号
 * @returns serial	string	编号
 * @returns legalRepresentative	string	法定代表人姓名
 * @returns enterpriseName	string	企业名称
 * @returns typeOfOrganization	string	组成形式
 * @returns address	string	经营场所/企业住所
 * @returns typeOfEnterprise	string	公司类型
 * @returns businessScope	string	经营范围
 * @returns registeredCapital	string	注册资本
 * @returns paidInCapital	string	实收资本
 * @returns validPeriod	string	营业期限
 * @returns registeredDate	string	注册日期/成立日期
 * @returns certPosition	string	营业执照位置
 * @returns imgSize	string	图片大小
 */
exports.main = async (event) => {
  try {
    const result = await cloud.openapi.ocr.businessLicense(event.data);
    return result
  } catch (err) {
    return err
  }
}