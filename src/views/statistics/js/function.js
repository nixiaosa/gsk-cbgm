import moment from 'moment'

export function getDateArray(date1, date2) { // 传递两个date，返回一个数组，从新到旧，[{date: '2018-10-20', dateWeek: '2018-10-20'}, {date: '2018-10-18', dateWeek: '2018-10-21 星期六'}]
  const startDate = moment(new Date(date1)).format('YYYY/MM/DD') // YYYY/MM/DD 获取data格式相比 YYYY-MM-DD 准确
  const endDate = moment(new Date(date2)).format('YYYY/MM/DD')
  const apartNum = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) // 获取差值天数
  var data = []
  const absNum = Math.abs(apartNum) // 绝对值
  for (let i = 0; i < (absNum + 1); i++) {
    const obj = {}
    const newTime = apartNum >= 0 ? new Date(endDate) - (1000 * 60 * 60 * 24 * i) : new Date(startDate) - (1000 * 60 * 60 * 24 * i)
    const newDate = moment(newTime).format('YYYY-MM-DD')
    obj.date = newDate // {date: '2018-10-16'}
    obj.dateWeek = new Date(newTime).getDay() === 6 ? newDate + ' ' + '星期六'
                  : new Date(newTime).getDay() === 0 ? newDate + ' ' + '星期日'
                  : newDate
    data.push(obj)
  }
  return data
}

export function getSomeDay(days) { // 获取未来过去第几天的时间 1为明天，0为今天，-1为昨天，-30为30天前
  var date1 = new Date()
  var date2 = new Date(date1)
  date2.setDate(date1.getDate() + days)
  return moment(new Date(date2)).format('YYYY-MM-DD')
}

export function strToJson(str) {
  var num2 = str.indexOf('}')
  var theRequest = {}
  var str1 = str.substring(1, num2)
  var strarr = str1.split(',')
  for (var i = 0; i < strarr.length; i++) {
    theRequest[strarr[i].split(':')[0]] = (strarr[i].split(':')[1])
  }
  return theRequest
}
