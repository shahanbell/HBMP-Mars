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
 *  UTC日期字符串转UTC+8时区的日期
 * @param {string} utc_datetime UTC日期字符串
 */
export function utcInit2Date(utc_datetime) {
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

  if(month < '10'){
    month = "0" + month;
  }

  if(day < '10'){
    day = "0" + day;
  }


  let dayTemp = year + "/" + month + "/" + day;

  return dayTemp;


  //return beijing_datetime; // 2017-03-31
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

/**
 *  获取当前时间字符串
 */
export function getNowDateStr(){
  let dateTemp = new Date();
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

/**
 *  获取备件备库单据类型
 * @param {string} acceptType 类型代码
 */
export function getSpareFormType(acceptType){
  switch(acceptType) {
    case "10":
        return "手工入库单";
    case "20":
        return "手工出库单";
    case "25":
        return "维修领料单";
    case "30":
        return "手工退库单";
    case "35":
        return "维修退料单";
    default:
        return;
  }
}

/**
 *  获取设备保全单据类型
 * @param {string} formid 单号
 */
export function getEqpMaintainFormType(formid){
  if(formid.indexOf("一级") > -1){
    return "自主保全单";
  }
  else
    return "计划保全单";
}

/**
 *  检查是否是维修课长
 * @param {string} employeeId 部门代号
 */
export function checkRepairDeptManger(employeeId){
  if(employeeId.indexOf("C0235") >= 0 || employeeId.indexOf("H0092") >= 0 || employeeId.indexOf("H0692") >= 0){
    return true;
  }
  else
    return false;
}

/**
 *  检查是否是维修课人员
 * @param {string} deptno 部门代号
 */
export function checkEqpRepairDepartment(deptno){
  if(deptno.indexOf("1W3") >= 0 || deptno.indexOf("2F6") >= 0 || deptno.indexOf("7C2") >= 0|| deptno.indexOf("2AB") >= 0){
    return true;
  }
  else
    return false;
}

/**
 *  获取维修课对应公司别过滤参数
 * @param {string} deptno 部门代号
 */
export function getRepairDeptCompanyFilter(deptno){
  if(deptno.indexOf("1W3") >= 0){
    return ";RepairCompanyFilter=HANBELL";
  }
  else if(deptno.indexOf("2A8") >= 0){
    return ";RepairCompanyFilter=HANSON";
  }
  else if(deptno.indexOf("7C2") >= 0){
    return ";RepairCompanyFilter=HANYOUNG";
  }
}


/**
 *  检查是否是维修经理
 * @param {string} employeeId 工号
 */
export function checkEqpRepairManager(employeeId){
  if(employeeId.indexOf("C0016") >= 0 || employeeId.indexOf("Y0080") >= 0 || employeeId.indexOf("H0752") >= 0){
    return true;
  }
  else
    return false;
}

/**
 *  获取维修经理对应公司别过滤参数
 * @param {string} employeeId 工号
 */
export function getRepairManagerCompanyFilter(employeeId){
  if(employeeId.indexOf("C0016") >= 0){
    return ";RepairCompanyFilter=HANBELL";
  }
  else if(employeeId.indexOf("Y0080") >= 0){
    return ";RepairCompanyFilter=HANYOUNG";
  }
  else if(employeeId.indexOf("H0752") >= 0){
    return ";RepairCompanyFilter=HANSON";
  }
}
