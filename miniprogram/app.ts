//app.ts
export interface IMyApp {
  authInfoReadyCallback?(res:{}): void
  sessionInfoReadyCallback?(data: {}): void
  globalData: {
    restAdd?: string,
    restId?: string,
    restToken?: string,
    restAuth?: string,
    restEdw?:string,
    hasOpenId?: boolean,
    openId?: string,
    sessionKey?: string,
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
    profileData?: string,
    authData?: Array<string>[],
    profileCommit?: boolean ,
  }
}

App<IMyApp>({

  
  onLaunch() {
    

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
    openId:'',
    //URL转码
    weChatCallBack: 'https%3a%2f%2fi2.hanbell.com.cn%2fHanbell-WCO%2fAuthCallBackServlet',
    restId: '1505912014724',
    restToken: '0ec858293fccfad55575e26b0ce31177',
    restAuth: 'appid=1505912014724&token=0ec858293fccfad55575e26b0ce31177',
    profileCommit:false
  },
})
