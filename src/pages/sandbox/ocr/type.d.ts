interface bankcardType {
	/** 错误码
	 */
	errCode?: number;
	/** 错误信息
	 */
	errMsg?: string;
	/** 银行卡号
	 */
	number?: string;
}

interface businessLicenseType {
	/** 错误码
	 */
	errCode?: number;
	/** 错误信息
	 */
	errMsg?: string;
	/** 注册号
	 */
	regNum?: string;
	/** 编号
	 */
	serial?: string;
	/** 法定代表人姓名
	 */
	legalRepresentative?: string;
	/** 企业名称
	 */
	enterpriseName?: string;
	/** 组成形式
	 */
	typeOfOrganization?: string;
	/** 经营场所/企业住所
	 */
	address?: string;
	/** 公司类型
	 */
	typeOfEnterprise?: string;
	/** 经营范围
	 */
	businessScope?: string;
	/** 注册资本
	 */
	registeredCapital?: string;
	/** 实收资本
	 */
	paidInCapital?: string;
	/** 营业期限
	 */
	validPeriod?: string;
	/** 注册日期/成立日期
	 */
	registeredDate?: string;
	/** 营业执照位置
	 */
	certPosition?: string;
	/** 图片大小
	 */
	imgSize?: string;
}

interface idcardType {
	/** 错误码
	 */
	errCode?: number;
	/** 错误信息
	 */
	errMsg?: string;
	/** 正面或背面，Front / Back
	 */
	type?: string;
	/** 有效期
	 */
	validDate?: string;
	/** 住址
	 */
	addr?: string;
	/** 生日
	 */
	birth?: string;
	/** 身份证类型
	 */
	cardProperty?: number;
	/** 性别
	 */
	gender?: string;
	/** 身份证号
	 */
	id?: string;
	/** 姓名
	 */
	name?: string;
	/** 民族
	 */
	nationality?: string;
}

interface printedTextType {
	/** 错误码
	 */
	errCode?: number;
	/** 错误信息
	 */
	errMsg?: string;
	/** 识别结果
	 */
	items?: string;
	/**图片大小
	 */
	imgSize?: string;
}

export { bankcardType, businessLicenseType, idcardType, printedTextType };
