//app.ts
export interface IMyApp {
  userInfoReadyCallback?(res: wx.UserInfo): void
  authInfoReadyCallback?(res:{}): void
  sessionInfoReadyCallback?(data: {}): void
  globalData: {
    restAdd?: string,
    restId?: string,
    restToken?: string,
    restAuth?: string,
    hasOpenId?: boolean,
    openId?: string,
    sessionKey?: string,
    userInfo?: wx.UserInfo,
    authorized?: boolean,
    employeeId?: string,
    employeeName?: string,
    defaultCompany?: string,
    defaultCompanyName?: string,
    defaultDeptId?: string,
    defaultDeptName?: string,
    auth?: Array<string>[],
    screenHeight?: number,
    statusBarHeight?: number,
    windowHeight?: number,
    weChatCallBack?: string,
    authData: Array<string>[],
  }
}

App<IMyApp>({

  
  onLaunch() {
    // 登录
    wx.login({
      success: _res => {
        // 发送 _res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/session',
          data: {
            code: _res.code
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: res => {
            this.globalData.openId = res.data.openId
            this.globalData.sessionKey = res.data.sessionKey
            this.globalData.hasOpenId = true
            this.globalData.authorized = res.data.authorized
            if (res.data.authorized) {
              this.globalData.employeeId = res.data.employeeId
              this.globalData.employeeName = res.data.employeeName
              wx.request({
                url: this.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/' + this.globalData.employeeId,
                data: {
                  appid: this.globalData.restId,
                  token: this.globalData.restToken
                },
                header: {
                  'content-type': 'application/json'
                },
                method: 'GET',
                success: res => {
                  // console.log("User信息：" + res.data)
                    this.globalData.defaultCompany = res.data.company,
                    this.globalData.defaultCompanyName = res.data.companyName,
                    this.globalData.defaultDeptId = res.data.deptno,
                    this.globalData.defaultDeptName = res.data.deptname
                },
                fail: fail => {
                  console.log(fail)
                }
              })

              wx.request({
                url: this.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/AuthValidation',
                data: {
                  employeeid: this.globalData.employeeId,
                },
                header: {
                  'content-type': 'application/json'
                },
                method: 'GET',
                success: res => {
                  var that=this;
                  var data = res.data;
                  that.globalData.authData = data;
                  if (that.authInfoReadyCallback) {
                    that.authInfoReadyCallback(data);
                  }
                },
                fail: fail => {
                  wx.showModal({
                    title: '系统提示',
                    content: "权限获取失败，请联系管理员",
                    showCancel: false
                  })
                }
              });
              var _this=this
              //后台登录已授权
              _this.globalData.userInfo = res.userInfo;
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res.userInfo);
              }
            }else {
              //获取权限失败需要认证
              this.globalData.userInfo = false;
              wx.getUserProfile({
                success: function (res) {
                  wx.getUserInfo({
                    success: function (res) {
                    }
                  });
                },
                fail: function (res) {
                  wx.switchTab({
                    url: '/pages/profile/profile'
                  });
                }
              });
            }
            if (this.sessionInfoReadyCallback) {
              this.sessionInfoReadyCallback(res.data)
            }
          },
          fail: fail => {
            console.log(fail)
          }
        })
      }
    })
     //获取手机屏幕,状态栏的高度

    wx.getSystemInfo({
      success: res => {
        this.globalData.screenHeight = res.screenHeight
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.windowHeight = res.windowHeight
      }
    })
  },
  onHide() {
    console.log("Quit MicroPrg");
  },
  globalData: {
    authData: [],//页面缓存数据
    restAdd:'https://jrs.hanbell.com.cn',
    restEdw:'https://edw.hanbell.com.cn/platfm.webapi',
    // restAdd: 'https://i2.hanbell.com.cn',
    // restAdd: 'http://localhost:8480',
    //URL转码
    weChatCallBack: 'https%3a%2f%2fi2.hanbell.com.cn%2fHanbell-WCO%2fAuthCallBackServlet',
    restId: '1505912014724',
    restToken: '0ec858293fccfad55575e26b0ce31177',
    restAuth: 'appid=1505912014724&token=0ec858293fccfad55575e26b0ce31177'
  },
})
