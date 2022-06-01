/*
 * @Author: your name
 * @Date: 2021-04-22 12:33:24
 * @LastEditTime: 2021-04-28 11:55:31
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/common/data.js
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
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

export function changetime(time) {
  time = Number(time)
  var date = new Date(time)
  return formatDate(date, 'yyyy-MM-dd hh:mm')
}

export function getRightDate(start, end) {
  let result = ''
  if (start === null || end === null || start === '' || end === '' || start === undefined || end === undefined) {
    result = ''
  } else {
    start = changetime(start)
    end = changetime(end)
    let sDate = start.substring(0, 10)
    let eDate = end.substring(0, 10)
    let sTime = start.substring(11, 18)
    let eTime = end.substring(11, 18)
    let nDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss').substring(0, 10)
    if (sDate === nDate && eDate === nDate) {
      result = `今日  ${sTime}-${eTime}`
    } else if (sDate === eDate) {
      let mon = sDate.substring(5, 10).replace('-', '月')
      mon += '日'
      result = `${mon}   ${sTime}-${eTime}`
    } else {
      let smon = sDate.substring(5, 10).replace('-', '月')
      smon += '日'
      let emon = eDate.substring(5, 10).replace('-', '月')
      emon += '日'
      result = `${smon} ${sTime}-${emon} ${eTime}`
    }
  }
  return result
}
