let systemInfo;
export function getSystemInfo() {
  if (systemInfo) return systemInfo;
  systemInfo = wx.getSystemInfoSync();
  return systemInfo;
}

/**
 *  UTC日期字符串转UTC+8时区的日期
 * @param {string} utc_datetime UTC日期字符串
 */
export function utcInit(utc_datetime) {
  if(utc_datetime == null || utc_datetime == ''){
    return null;
  }
  // 转为正常的时间格式 年-月-日 时:分:秒
  var T_pos = utc_datetime.indexOf('T');
  var Z_pos = utc_datetime.indexOf('Z');
  var year_month_day = utc_datetime.substr(0,T_pos);
  var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
  var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
  var new_datetimeInit = new_datetime.replace(/-/g, '/');
  new_datetimeInit = new_datetimeInit.split('.')[0];

  // 处理成为时间戳
  timestamp = new Date(Date.parse(new_datetimeInit));
  timestamp = timestamp.getTime();
  timestamp = timestamp/1000;

  // 增加8个小时，北京时间比utc时间多八个时区
  var timestamp = timestamp+8*60*60;

  // 时间戳转为时间
  //var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
  let dateTemp = new Date(parseInt(timestamp) * 1000);
  let year = dateTemp.getFullYear();
  let month = dateTemp.getMonth() + 1;
  let day = dateTemp.getDate();
  let hour = dateTemp.getHours();
  let minute = dateTemp.getMinutes();

  if(month < '10'){
    month = "0" + month;
  }

  if(day < '10'){
    day = "0" + day;
  }

  if(hour < '10'){
    hour = "0" + hour;
  }

  if(minute < '10'){
    minute = "0" + minute;
  }

  let dayTemp = year + "/" + month + "/" + day + "  " + hour + ":" + minute;

  return dayTemp;


  //return beijing_datetime; // 2017-03-31 16:02:06
}

/**
 *  日期字符串格式化
 * @param {string} date 日期字符串
 */
export function dateFormatForFilter(date){
  let dateTemp = new Date(date);
  let year = dateTemp.getFullYear();
  let month = dateTemp.getMonth() + 1;
  let day = dateTemp.getDate();
  let hour = dateTemp.getHours();
  let minute = dateTemp.getMinutes();

  if(month < '10'){
    month = "0" + month;
  }

  if(day < '10'){
    day = "0" + day;
  }

  if(hour < '10'){
    hour = "0" + hour;
  }

  if(minute < '10'){
    minute = "0" + minute;
  }

  let dayTemp = year + "/" + month + "/" + day + "  " + hour + ":" + minute;
  return dayTemp;
}
