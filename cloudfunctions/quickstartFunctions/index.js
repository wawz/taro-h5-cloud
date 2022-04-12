/* eslint-disable import/no-commonjs */
const getUnlimited = require('./getUnlimited/index');
const getShortlink = require('./getShortlink/index');
const getOCRBankcard = require('./ocr-bankcard/index');
const getOCRBusinessLicense = require('./ocr-businessLicense/index');
const getOCRIdcard = require('./ocr-idcard/index');
const getOCRPrintedText = require('./ocr-printedText/index');

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getUnlimited':
      return await getUnlimited.main(event, context);
    case 'getShortlink':
      return await getShortlink.main(event, context);
    case 'getOCRBankcard':
      return await getOCRBankcard.main(event, context);
    case 'getOCRBusinessLicense':
      return await getOCRBusinessLicense.main(event, context);
    case 'getOCRIdcard':
      return await getOCRIdcard.main(event, context);
    case 'getOCRPrintedText':
      return await getOCRPrintedText.main(event, context);
  }
};
