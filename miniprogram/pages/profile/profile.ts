//profile.ts
//获取应用实例
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wechatUser: {
      employeeId: '',
      employeeName: '',
      mobile: ''
    },
    checkCode: '',
    btnSendDisplay: '获取验证码',
    canSendCode: true,
    canSubmit: false
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData!({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    wx.getStorage({
      key: 'wechatUser',
      success: res => {
        this.setData!({
          wechatUser: res.data
        })
      }
    })
  },
  getUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    let mobile = 'wechatUser.mobile';
    this.setData!({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      // [mobile]: e.detail.userInfo.mobile
    })
    //授权后存储openid
    wx.request({
      url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser',
      data: {
        openId: app.globalData.openId,
        nickName: app.globalData.userInfo.nickName
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: res => {
        if (res.data.code == '202') {
          app.globalData.authorized = true
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },
  bindEmployeeIdChange(e) {
    let employeeId = 'wechatUser.employeeId';
    this.setData!({
      [employeeId]: e.detail
    })
  },
  bindEmployeeNameChange(e) {
    let employeeName = 'wechatUser.employeeName';
    this.setData!({
      [employeeName]: e.detail
    })
  },
  bindMobileChange(e) {
    let mobile = 'wechatUser.mobile';
    this.setData!({
      [mobile]: e.detail
    })
  },
  bindCheckCodeChange(e) {
    this.setData!({
      checkCode: e.detail
    })
  },
  bindSendCodeTap(e) {
    let canSend = true
    let errmsg = ''
    // let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (!this.data.wechatUser.mobile || this.data.wechatUser.mobile == '' || this.data.wechatUser.mobile.length != 11) {
      canSend = false;
      errmsg += '手机号码长度错误\r\n'
    }
    // if (!reg.test(this.data.wechatUser.mobile)) {
    //   canSend = false
    //   errmsg += '手机号码格式错误\r\n'
    // }
    if (canSend) {
      let waits: number = 60
      let fn = setInterval(() => {
        waits--
        let v = '等待(' + waits + ')秒'
        this.setData!({
          btnSendDisplay: v
        })
      }, 1000, waits)
      setTimeout(() => {
        this.setData!({
          btnSendDisplay: '获取验证码',
          canSendCode: true
        })
        clearInterval(fn)
      }, 60000)
      // 获取校验码
      wx.request({
        url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/checkcode',
        data: {
          openid: app.globalData.openId,
          sessionkey: app.globalData.sessionKey,
          mobile: this.data.wechatUser.mobile
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: res => {
          // console.log(res.data)
          this.setData!({
            canSubmit: true,
            canSendCode: false
          })
        },
        fail: fail => {
          console.log(fail.errMsg)
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
  formSubmit(e) {
    let canSend = true
    let errmsg = ''
    //更新用户状态
    if (!app.globalData.userInfo) {
      canSend = false;
      errmsg += 'UserInfo错误\r\n'
    }
    if (!app.globalData.sessionKey || app.globalData.sessionKey == '') {
      canSend = false;
      errmsg += 'SessionKey错误\r\n'
    }
    if (!this.data.checkCode || this.data.checkCode == '') {
      canSend = false;
      errmsg += '验证码错误\r\n'
    }
    if (canSend) {
      let urlStr = app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser/' + app.globalData.openId + '?sessionkey=' + app.globalData.sessionKey + '&checkcode=' + this.data.checkCode;
      wx.request({
        url: urlStr,
        data: {
          openid: app.globalData.openId,
          nickName: app.globalData.userInfo.nickName,
          employeeId: this.data.wechatUser.employeeId,
          employeeName: this.data.wechatUser.employeeName,
          mobile: this.data.wechatUser.mobile
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'PUT',
        success: res => {
          // console.log(res)
          if (res.data.code == '200') {
            app.globalData.authorized = res.data.authorized
            app.globalData.employeeId = res.data.employeeId
            app.globalData.employeeName = res.data.employeeName
            app.globalData.defaultDeptId = res.data.deptno
            app.globalData.defaultDeptName = res.data.deptName
            app.globalData.defaultCompany = res.data.company
            app.globalData.defaultCompanyName = res.data.companyName
          } else {
            app.globalData.authorized = false
          }
          this.setData!({
            canSubmit: false
          })
          wx.setStorageSync('wechatUser', this.data.wechatUser)
          wx.showModal({
            title: '系统消息',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (app.globalData.authorized) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }
          })
        },
        fail: fail => {
          console.log(fail.errMsg)
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
    console.log('form发生了reset事件');
  }
})
