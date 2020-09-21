import * as moment from 'moment.min';

export function formatDate(d: string): any {
  var date = new Date(d);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return { year, month, day }
}

export function formatTime(d: string): string {
  var date = new Date(d);
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')

}

const formatNumber = (n: number) => {
  const str = n.toString()
  return str[1] ? str : '0' + str;
}

export function getCurrentDate(d: String): any {
  var myDate = new Date(d.substring(0, 19));
  myDate = myDate.setDate(myDate.getDate() + 1);
  myDate = new Date(myDate);
  const year = myDate.getFullYear(); //年
  const month = myDate.getMonth() + 1; //月
  const day = myDate.getDate(); //日
  const days = myDate.getDay();
  var week = "";
  switch (days) {
    case 1:
      week = '星期一';
      break;
    case 2:
      week = '星期二';
      break;
    case 3:
      week = '星期三';
      break;
    case 4:
      week = '星期四';
      break;
    case 5:
      week = '星期五';
      break;
    case 6:
      week = '星期六';
      break;
    case 0:
      week = '星期日';
      break;
  }
  var str = year + "/" + month + "/" + day + "  " + week;
  return str;
}

export function getLocalDate({ localFormat = 'YYYY-MM-DD' } = {}) {
  return moment().format(localFormat);
}

export function getLocalTime({ localFormat = 'HH:mm' } = {}) {
  return moment().format(localFormat);
}

export function utc2Local(value: any, { length = 20, utcFormat = 'YYYY-MM-DDTHH:mm:ssZ', localFormat = 'YYYY-MM-DD' } = {}) {
  if (localFormat) {
    return moment(value.substring(0, length), utcFormat).format(localFormat);
  } else {
    return moment(value.substring(0, length), utcFormat);
  }
}

export function local2UTC(date: Date | string, format?: string) {
  if (format) {
    return moment.utc(moment(date, format)).format();
  }
  return moment.utc(date).format();
}