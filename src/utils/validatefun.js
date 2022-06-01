/*
  * isvalidUser 英文 数字 . _
  * isvalidEg 英文名 . _
  * isvalidNoChn 不能中文
  * isvalidName 中文 英文 数字 . _ ·
  * isChn 判断中文
  * isnumber 判断数字
  * validatName 中文英文
  * enoughLength 判断字符串位数
  * validateURL 合法网址
  * validateLowerCase 小写字母
  * validateUpperCase 大写字母
  * validatAlphabets 大小写字母
  * checkPhone 手机号
  * checkEmail 邮箱
  * testId 身份证
  * validatfirst 以特殊字符开头
  * egandnum 英文和数字
  * keywords 关键字
  * fixedphone 固话
  * maxNumber
  * minNumber
*/
import { isvalidUser, isvalidEg, isvalidNoChn, isvalidName, isChn, isnumber, validatName, validateURL, checkPhone, checkEmail, enoughLength, validatfirst, egandnum, keywords, fixedphone, maxNumber, minNumber } from '@/utils/validate'

export const validatePass = (rule, value, callback) => { // 密码输入框，不能包括中文名，位数大于6位
  if (!isvalidNoChn(value)) {
    callback(new Error('密码不能包含中文'))
  } else if (!enoughLength(value, 6)) {
    // callback(new Error('密码不能小于6位'))
    callback(new Error('密码错误，请输入正确密码'))
  } else if (enoughLength(value, 33)) {
    callback(new Error('密码不能大于32位'))
  } else {
    callback()
  }
}

export const validateUsername = (rule, value, callback) => { // 后台帐号用户名输入框：英文、数字、. 、_ 组成
  if (!isvalidNoChn(value)) {
    callback(new Error('用户名不能包含中文'))
  } else if (!isvalidUser(value)) {
    callback(new Error('用户名只能由英文、数字以及特殊符号(".","_","·")'))
  } else if (!validatfirst(value)) {
    callback(new Error('用户名不能以数字和特殊字符开头'))
  } else if (!enoughLength(value, 4)) {
    callback(new Error('用户名不能小于4位'))
  } else if (enoughLength(value, 16)) {
    callback(new Error('用户名不能大于15位'))
  } else {
    callback()
  }
}

export const isPhone = (rule, value, callback) => { // 手机号
  if (!checkPhone(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

export const isEmail = (rule, value, callback) => { // 邮箱
  if (!checkEmail(value)) {
    callback(new Error('请输入正确邮箱'))
  } else {
    callback()
  }
}

export const isChinese = (rule, value, callback) => { // 中文
  if (!isChn(value)) {
    callback(new Error('由中文组成'))
  } else if (enoughLength(value, 20)) {
    callback(new Error('不能大于20位'))
  } else {
    callback()
  }
}

export const validateName = (rule, value, callback) => { // 姓名输入框
  if (!isvalidName(value)) {
    callback(new Error('姓名只能包含中文、英文以及特殊符号("·"，".","_")'))
  } else if (!enoughLength(value, 2)) {
    callback(new Error('姓名不能小于2位'))
  } else if (enoughLength(value, 16)) {
    callback(new Error('姓名不能大于15位'))
  } else {
    callback()
  }
}

export const sixNumber = (rule, value, callback) => { // 6位验证码
  if (!isnumber(value)) {
    callback(new Error('验证码由数字组成'))
  } else if (!enoughLength(value, 6)) {
    callback(new Error('验证码由6位组成'))
  } else if (enoughLength(value, 7)) {
    callback(new Error('验证码由6位组成'))
  } else {
    callback()
  }
}

export const fourNumber = (rule, value, callback) => { // 4位验证码
  if (!isnumber(value)) {
    callback(new Error('验证码由数字组成'))
  } else if (!enoughLength(value, 4)) {
    callback(new Error('验证码由4位组成'))
  } else if (enoughLength(value, 5)) {
    callback(new Error('验证码由4位组成'))
  } else {
    callback()
  }
}

export const EgandChn = (rule, value, callback) => { // 各种名称输入框
  if (!validatName(value)) {
    callback(new Error('只能包含中文、英文'))
  } else if (enoughLength(value, 21)) {
    callback(new Error('不能大于20位'))
  } else {
    callback()
  }
}

export const EgandNum = (rule, value, callback) => { // 英文数字输入框
  if (!egandnum(value)) {
    callback(new Error('只能包含英文和数字'))
  } else if (enoughLength(value, 21)) {
    callback(new Error('不能大于20位'))
  } else {
    callback()
  }
}

export const KeyandCopy20 = (rule, value, callback) => { // 关键字版权等
  if (!keywords(value)) {
    callback(new Error('只能由中文英文数字以及(、)组成'))
  } else if (enoughLength(value, 21)) {
    callback(new Error('不能大于20位'))
  } else {
    callback()
  }
}

export const KeyandCopy50 = (rule, value, callback) => { // 关键字版权等
  if (!keywords(value)) {
    callback(new Error('只能由中文英文数字以及(、)组成'))
  } else if (enoughLength(value, 51)) {
    callback(new Error('不能大于50位'))
  } else {
    callback()
  }
}

export const indulge20 = (rule, value, callback) => { // 任意字符20
  if (enoughLength(value, 21)) {
    callback(new Error('不能大于20位'))
  } else {
    callback()
  }
}

export const indulge50 = (rule, value, callback) => { // 任意字符50
  if (enoughLength(value, 51)) {
    callback(new Error('不能大于50位'))
  } else {
    callback()
  }
}

export const indulge200 = (rule, value, callback) => { // 任意字符200
  if (enoughLength(value, 201)) {
    callback(new Error('不能大于200位'))
  } else {
    callback()
  }
}

export const indulge2000 = (rule, value, callback) => { // 任意字符2000
  if (enoughLength(value, 2001)) {
    callback(new Error('不能大于2000位'))
  } else {
    callback()
  }
}

export const fixedTel = (rule, value, callback) => { // 固话
  if (!fixedphone(value)) {
    callback(new Error('请输入正确的固定电话格式'))
  } else {
    callback()
  }
}

export const moneyRangeE7 = (rule, value, callback) => { // 合同价格金额范围
  if (minNumber(value)) {
    callback(new Error('最小不能小于1'))
  } else if (maxNumber(value)) {
    callback(new Error('最大不能大于10000000元'))
  } else {
    callback()
  }
}

export const moneyRangeE3 = (rule, value, callback) => { // 合同价格金额范围
  if (minNumber(value)) {
    callback(new Error('必须大于1'))
  } else if (maxNumber(value)) {
    callback(new Error('金额不能大于1000'))
  } else {
    callback()
  }
}

export const EglishName = (rule, value, callback) => { // 英文20
  if (!isvalidEg(value)) {
    callback(new Error('请输入正确的英文名'))
  } else if (enoughLength(value, 21)) {
    callback(new Error('不能大于20位'))
  } else {
    callback()
  }
}

export const isUrl = (rule, value, callback) => { // 网址
  if (!validateURL(value)) {
    callback(new Error('请输入正确的网址'))
  } else {
    callback()
  }
}
