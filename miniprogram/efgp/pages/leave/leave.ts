//leave.ts
import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    dataList: [] as any,
    hasOpenId: false,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    showRowDate1: null,
    showRowDate2: null,
    showRowTime: null,
    date1: null,
    date2: null,
    yearDays:0,
    time1: "08:00",
    time2: "17:10",
    formType: '1',
    formTypeDesc: '普通工作日',
    formKind: '1',
    formKindDesc: '1-年休假',
    workType: '1',
    workTypeDesc: '1-常日班 8:00-17:10',
    leaveDay: 1 as number,
    leaveHour: 0 as number,
    leaveMinute: 0 as number,
    reason: '',
    checked: false,
    showTime1: false,
    showTime1: false,
    showDate1: false,
    showDate2: false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    uploaderList: [],
    showUpload: true,
    hkgl004Files: []
  },
  onLoad() {
    var that = this;
    wx.request({
     
      // url: that.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/session',
      url: app.globalData.restAdd+'/Hanbell-JRS/api/shberp/nianjia/' + app.globalData.employeeId+'?'+ app.globalData.restAuth,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        console.info("剩余年休假="+JSON.stringify(res))
        wx.showLoading({
          title: 'Loading',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        let dateTemp = new Date(new Date().getTime());
        let year = dateTemp.getFullYear();
        let month = dateTemp.getMonth() + 1;
        let day = dateTemp.getDate();
        let dayTemp = year + "-" + month + "-" + day;
        that.setData!({
          date1: this.dateFormatForYYMMDD(new Date().getTime()),
          date2: this.dateFormatForYYMMDD(new Date().getTime()),
          yearDays:res.data.object
        })
        if (app.globalData.openId) {
          this.setData!({
            hasOpenId: true
          })
        }
        if (app.globalData.authorized) {
          this.setData!({
            employeeId: app.globalData.employeeId,
            employeeName: app.globalData.employeeName
          })
        }
        if (app.globalData.defaultDeptId) {
          this.setData!({
            deptId: app.globalData.defaultDeptId,
            deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName
          })
        }
      }
    });
  },
  bindDeptSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
      events: {
        returnDeptSelect: function (res) {
          if (res) {
            that.setData!({
              deptId: res.k,
              deptName: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindFormTypeChange(e) {
    if (e.detail) {
      this.setData({
        formType: '2',
        formTypeDesc: '法定节假假日前后',
        checked: true
      })
    } else {
      this.setData({
        formType: '1',
        formTypeDesc: '普通工作日',
        checked: false
      })
    }
  },
  bindLeaveKindSelect(e) {
    let that = this
    wx.navigateTo({
      url: './leaveKindSelect',
      events: {
        returnLeaveKindSelect: function (res) {
          if (res) {
            that.setData!({
              formKind: res.k,
              formKindDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindWorkTypeSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/workTypeSelect/workTypeSelect',
      events: {
        returnWorkTypeSelect: function (res) {
          if (res) {
            that.setData!({
              workType: res.k,
              workTypeDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindLeaveDayChange(e) {
    this.setData!({
      leaveDay: e.detail
    })
  },
  bindLeaveHourChange(e) {
    this.setData!({
      leaveHour: e.detail
    })
  },
  bindLeaveMinuteChange(e) {
    this.setData!({
      leaveMinute: e.detail
    })
  },
  bindReasonChange(e) {
    console.log(e)
    this.setData!({
      reason: e.detail.value
    })
  },

  //开始时间的组件回调函数
  bindPickerTime1(e) {
    this.openPickerTime1();
  },
  bindCloseTime1(e) {
    this.closePickerTime1();
  },
  bindTime1Cencel(e) {
    this.closePickerTime1();
  },
  bindTime1Confirm(e) {
    this.setData!({
      time1: e.detail
    })
    this.closePickerTime1();
  },
  openPickerTime1() {
    this.setData!({
      showTime1: true
    })
  },
  closePickerTime1() {
    this.setData!({
      showTime1: false
    })
  },

  //截止时间的组件回调

  bindPickerTime2(e) {
    this.openPickerTime2();
  },
  bindCloseTime2(e) {
    this.closePickerTime2();
  },
  bindTime2Cencel(e) {
    this.closePickerTime2();
  },
  bindTime2Confirm(e) {
    this.setData!({
      time2: e.detail
    })
    this.closePickerTime2();
  },

  openPickerTime2() {
    this.setData!({
      showTime2: true
    })
  },
  closePickerTime2() {
    this.setData!({
      showTime2: false
    })
  },


  // 开始日期的时间组件回调
  bindPickerDate1(e) {
    this.setData!({
      showRowDate1: this.formatYYMMDDToDate(this.data.date1)
    })
    this.openPickerDate1();
  },
  bindCloseDate1(e) {
    this.closePickerDate1();
  },

  bindDate1Cancel(e) {
    this.closePickerDate1();
  },
  bindDate1Confirm(e) {
    //首次加载回调显示都是2010/1/1,
    if (e.detail != 1262275200000) {
      this.setData!({
        date1: this.dateFormatForYYMMDD(e.detail)
      })
    }
    this.closePickerDate1();
  },
  openPickerDate1() {
    this.setData!({
      showDate1: true
    })
  },
  closePickerDate1() {
    this.setData!({
      showDate1: false
    })
  },
  //截止时间的日期组件回调
  bindPickerDate2(e) {
    this.setData!({
      showRowDate2: this.formatYYMMDDToDate(this.data.date2)
    })
    this.openPickerDate2();
  },
  bindCloseDate2(e) {
    this.closePickerDate2();
  },

  bindDate2Cancel(e) {
    this.closePickerDate2();
  },
  bindDate2Confirm(e) {
    if (e.detail != 1262275200000) {
      this.setData!({
        date2: this.dateFormatForYYMMDD(e.detail)
      })
    }
    this.closePickerDate2();
  },
  openPickerDate2() {
    this.setData!({
      showDate2: true
    })
  },
  closePickerDate2() {
    this.setData!({
      showDate2: false
    })
  },

  formatYYMMDDToDate(value) {
    var str = value.replace(/-/g, '/');
    var date = new Date(str)
    return date.getTime();
  },

  // 删除图片
  clearImg(e) {
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据

    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
  },
  //展示图片
  showImg(e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },

  //上传图片
  upload(e) {
    var that = this;
    //console.log("upload Test");
    wx.chooseImage({
      count: 3 - that.data.uploaderNum, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)
        //console.log(that.data.uploaderNum);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        console.info('tempFilePaths==' + JSON.stringify(tempFilePaths))
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length == 3) {
          that.setData({
            showUpload: false
          })
        }
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
        })
      }
    })
  },
  dateFormatForYYMMDD(date) {
    let dateTemp = new Date(date);
    let year = dateTemp.getFullYear();
    let month = dateTemp.getMonth() + 1;
    let day = dateTemp.getDate();
    let hour = dateTemp.getHours();
    let minute = dateTemp.getMinutes();
    let dayTemp = year + "-" + month + "-" + day;
    return dayTemp;
  },
  initFile() {
    console.info("1111");
    var nowList = [];
    var _this = this;
    var FileSystemManager = wx.getFileSystemManager();
    _this.data.uploaderList.forEach(function (o, i) {
      console.info("222");
      var baselib = FileSystemManager.readFileSync(_this.data.uploaderList[i], 'base64');
      var imagePathTemp = _this.data.uploaderList[i].split('.');
      var imageType = imagePathTemp[imagePathTemp.length - 1];
      var obj = { data: baselib, imageType: imageType };
      nowList.push(obj);
    });

    _this.setData({
      hkgl004Files: nowList
    })
  },
  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
    this.initFile();
    if (!app.globalData.authorized) {
      canSubmit = false
      errmsg += '账号未授权\r\n'
    }
    if (!this.data.employeeId || this.data.employeeId == '') {
      canSubmit = false
      errmsg += '请填写申请人员\r\n'
    }
    if (!this.data.deptId || this.data.deptId == '') {
      canSubmit = false
      errmsg += "请填写申请部门\r\n"
    }
    if (!this.data.reason || this.data.reason == '') {
      canSubmit = false
      errmsg += "请填写请假原因\r\n"
    }
    let t = this.data.leaveDay + this.data.leaveHour + this.data.leaveMinute
    if (t < 1) {
      canSubmit = false
      errmsg += "请填写请假时间\r\n"
    }
    if (canSubmit) {
      let _this = this
      wx.showModal({
        title: '系统提示',
        content: '确定提交吗',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: 'Sending'
            })
            wx.request({
              url: app.globalData.restAdd+ '/Hanbell-JRS/api/efgp/hkgl004/wechat?' + app.globalData.restAuth,
              data: {
                employee: _this.data.employeeId,
                formType: _this.data.formType,
                formTypeDesc: _this.data.formTypeDesc,
                formKind: _this.data.formKind,
                formKindDesc: _this.data.formKindDesc,
                workType: _this.data.workType,
                workTypeDesc: _this.data.workTypeDesc,
                date1: _this.data.date1,
                time1: _this.data.time1,
                date2: _this.data.date2,
                time2: _this.data.time2,
                leaveDay: _this.data.leaveDay,
                leaveHour: _this.data.leaveHour,
                leaveMinute: _this.data.leaveMinute,
                reason: _this.data.reason,
                hkgl004Files: _this.data.hkgl004Files
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: res => {
                // console.log(res.data)
                wx.hideLoading()
                wx.showModal({
                  title: '系统消息',
                  content: res.data.msg,
                  showCancel: false,
                  success(res) {
                    wx.switchTab({
                      url: "/pages/index/index"
                    })
                  }
                })
              },
              fail: fail => {
                wx.hideLoading();
                wx.showModal({
                  title: '系统提示',
                  content: "请联系管理员:" + fail,
                  showCancel: false
                })
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      })
    }
  },
  formReset() {
    // console.log('form发生了reset事件');
  }
})
