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
