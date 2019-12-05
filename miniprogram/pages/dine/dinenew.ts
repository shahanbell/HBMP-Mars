import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    userid: null,
    username: null,
    deptid: null,
    deptname: null,
    lunch: false,
    dinner: false,
    dinedate: d.toISOString().substring(0, 10),
    address: '总部',
    startdate: d.toISOString().substring(0, 10),
  },

  onLoad() {
    wx.showLoading({
      title: 'Loading',
    })
    if (app.globalData.openId) {
      this.setData!({
        hasOpenId: true
      })
    }
    if (app.globalData.authorized) {
      this.setData!({
        userid: app.globalData.employeeId,
        username: app.globalData.employeeName
      })
    }
    if (app.globalData.defaultDeptId) {
      this.setData!({
        deptid: app.globalData.defaultDeptId,
        deptname: app.globalData.defaultDeptName,
      })
      wx.hideLoading()
    }
  },
  bindDineDateChange(e) {
    this.setData!({
      dinedate: e.detail.value,
    })
  },
  radioAdressChange(e) {
    this.setData!({
      address: e.detail.value,
    })
  },
  checkboxChange(e) {
    this.setData!({
      lunch: false,
      dinner: false,
    })
    let index = e.detail.value.length
    if (index > 0) {
      for (var i = 0; i < e.detail.value.length; i++) {
        var aaa = e.detail.value[i];
        if (aaa == 'lunch') {
          this.data.lunch = true
        }
        if (aaa == 'dinner') {
          this.data.dinner = true
        }
      }
    }
  },
  formSubmit(e) {
    console.log(e)
    let canSubmit = true
    let errmsg = ''
    if (!app.globalData.authorized) {
      canSubmit = false
      errmsg += '账号未授权\r\n'
    }
    if (!this.data.lunch && !this.data.dinner) {
      canSubmit = false
      errmsg += "请选择报餐项\r\n"
    }
    if (this.data.dinedate == d.toISOString().substring(0, 10)) {
      console.log("dinedate——" + this.data.dinedate + "_____今天" + d.toISOString().substring(0, 10) + "小时" + d.getHours())
      if (d.getHours() > 9) {
        canSubmit = false
        errmsg += "今日报餐已过9点，无法发起预约\r\n"
      }
    }
    if (canSubmit) {
      wx.request({
        url: app.globalData.restAdd + '/Hanbell-WCO/api/wco/dineinfo/verify?' + app.globalData.restAuth,
        // url: 'http://localhost:8480' + '/Hanbell-WCO/api/wco/dineinfo/verify?' + app.globalData.restAuth,
        data: {
          userid: this.data.userid,
          dinedate: new Date(this.data.dinedate.replace(/-/g, '/')),
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: res => {
          if (res.data.code != '200') {
            wx.showModal({
              title: '系统提示!',
              content: "该报餐日期已有报餐记录\r\n",
              showCancel: false
            })
          } else {
            let _this = this
            wx.showModal({
              title: '系统提示',
              content: '确定提交吗?',
              success(res) {
                wx.showLoading({
                  title: 'Sending'
                })
                if (res.confirm) {
                  wx.request({
                    url: app.globalData.restAdd + '/Hanbell-WCO/api/wco/dineinfo/create?' + app.globalData.restAuth,
                    // url: 'http://localhost:8480' + '/Hanbell-WCO/api/wco/dineinfo/create?' + app.globalData.restAuth,
                    data: {
                      userid: _this.data.userid,
                      username: _this.data.username,
                      deptid: _this.data.deptid,
                      deptname: _this.data.deptname,
                      lunch: _this.data.lunch,
                      dinner: _this.data.dinner,
                      dinedate: new Date(_this.data.dinedate.replace(/-/g, '/')),
                      address: _this.data.address,
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    method: 'POST',
                    success: res => {
                      wx.hideLoading()
                      wx.showModal({
                        title: '系统消息',
                        content: res.data.msg,
                        showCancel: false,
                        success(res) {
                          wx.navigateBack({
                            delta: 1
                          })
                        }
                      })
                    },
                    fail: fail => {
                      wx.hideLoading()
                      console.log(fail)
                    }
                  })
                } else {
                  wx.hideLoading()
                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '系统提示!',
        content: errmsg,
        showCancel: false
      })
    }
  },
  formReset() {
    //console.log('form发生了reset事件');
  }

})
