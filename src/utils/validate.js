/**
 * Created by jiachenpan on 16/11/18.
 */
/* 英文 数字 . _ */
export function isvalidUser(str) {
  str = String(str)
  const reg = /^[0-9a-zA-Z\s\u4e00-\u9fa5\\.\\_\\·]+$/
  return reg.test(str.trim())
}

/* 英文名 . _ */
export function isvalidEg(str) {
  str = String(str)
  const reg = /^[a-zA-Z\s\\·\\_\\.]+$/
  return reg.test(str.trim())
}

/* 不能中文 */
export function isvalidNoChn(str) {
  str = String(str)
  const reg = /[\u4e00-\u9fa5]/g
  return !reg.test(str.trim())
}

/* 中文 英文 数字 . _ · */
export function isvalidName(str) {
  str = String(str)
  const reg = /^[0-9a-zA-Z\s\\.\\_\\·\u4e00-\u9fa5]+$/
  return reg.test(str.trim())
}

/* 判断中文 */
export function isChn(str) {
  str = String(str)
  const reg = /^[\u4E00-\u9FA5]+$/
  return reg.test(str.trim())
}

/* 判断数字 */
export function isnumber(num) {
  var str = String(num)
  const reg = /^[0-9]+$/
  return reg.test(str.trim())
}

/* 中文英文 */
export function validatName(str) {
  str = String(str)
  const reg = /^[a-zA-Z\s\u4e00-\u9fa5]+$/
  return reg.test(str.trim())
}

/* 判断用户名是否符合要求，英文字母与数字组合 */
export function isvalidUsername(str) {
  const usernameregex = /^[a-zA-Z0-9]*$/
  return usernameregex.test(str)
}

/* 判断字符串位数 */
export function enoughLength(str, length) {
  str = String(str)
  return str.length >= length
}

/* 合法网址 */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 判断手机号合法 */
export function checkPhone(phone) {
  const reg = /^1[3456789][0-9]{9}$/
  return reg.test(phone)
}

/* 判断邮箱格式 */
export function checkEmail(email) {
  const reg = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  return reg.test(email)
}

/* 身份证号验证 */
export function testId(id) {
  id = String(id)
  // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
  const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
   // 号码规则校验
  if (!format.test(id)) {
    return false
  }
   // 区位码校验
   // 出生年月日校验  前正则限制起始年份为1900;
  const year = id.substr(6, 4) // 身份证年
  const month = id.substr(10, 2) // 身份证月
  const date = id.substr(12, 2) // 身份证日
  const time = Date.parse(month + '-' + date + '-' + year) // 身份证日期时间戳date
  const nowtime = Date.parse(new Date()) // 当前时间戳
  const dates = (new Date(year, month, 0)).getDate() // 身份证当月天数
  if (time > nowtime || date > dates) {
    return false
  }
   // 校验码判断
  const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
  const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
  const idarray = id.split('')
  var sum = 0
  for (var k = 0; k < 17; k++) {
    sum += parseInt(idarray[k]) * parseInt(c[k])
  }
  if (idarray[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
    return false
  }
  return true
}

export function validatPlatName(str) {
  str = String(str)
  const reg = /^[0-9a-zA-Z\s\u4e00-\u9fa5]+$/
  return reg.test(str.trim())
}

/* 判断是否数字和.开头 */
export function validatfirst(str) {
  str = String(str)
  const reg = /^[0-9\\.\\_\\·]+/
  return !reg.test(str.trim())
}

/* 判断英文与数字 */
export function egandnum(str) {
  str = String(str)
  const reg = /^[0-9a-zA-Z\s]+$/
  return reg.test(str.trim())
}

/* 判断关键字 */
export function keywords(str) {
  str = String(str)
  const reg = /^[0-9a-zA-Z\s\u4e00-\u9fa5\\、]+$/
  return reg.test(str.trim())
}

/* 固定电话 */
export function fixedphone(str) {
  str = String(str)
  const reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/
  return reg.test(str.trim())
}

/* 最大值 */
export function maxNumber(num, max) {
  return num > max
}

/* 最小值 */
export function minNumber(num, min) {
  return num < min
}
