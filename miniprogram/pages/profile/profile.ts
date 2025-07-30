//profile.ts
//获取应用实例
import { IMyApp } from '../../app'
const app = getApp<IMyApp>()
Page({
  data: {
    userInfo: {},
    isAuth: true,
    canIUse: wx.canIUse('button.open-type.chooseAvatar'),
    imgData: "",
    isShowInfo:false,
    phone:"",
    employeeid:"",
    employeename:"",
    deptno:"",
    deptname:""
  },
  onLoad(){
    if (app.globalData.authorized) {
      this.setData!({
        isAuth: false,
        imgData: app.globalData.profileData,
        isShowInfo:true,
        employeeid:app.globalData.employeeId,
        employeename:app.globalData.employeeName,
        deptno:app.globalData.defaultDeptId,
        deptname:app.globalData.defaultDeptName
      })

    }
  },
  onShow(){
    if (app.globalData.authorized) {
      this.setData!({
        isAuth: false,
        imgData: app.globalData.profileData,
        isShowInfo:true,
        employeeid:app.globalData.employeeId,
        employeename:app.globalData.employeeName,
        deptno:app.globalData.defaultDeptId,
        deptname:app.globalData.defaultDeptName
      })
    }
  },
  onTabBarSwitch() {
    if (app.globalData.authorized) {
      this.setData!({
        isAuth: false
      })
    }
  },
  onChooseAvatar(e) {
    var that=this;
    var fileManager = wx.getFileSystemManager();
    fileManager.readFile({
      filePath: e.detail.avatarUrl, 
      encoding: 'base64',
      success: function(res) {
          // 输出base64码
          var base64Data = res.data;
          that.setData({
            isAuth: false,
            imgData: base64Data
          })
      }
    });
      
  },
  bindVailPhone(e) {
    var that=this;
    console.info("e.detail.code="+JSON.stringify(e.detail))
    wx.showLoading({
      title: 'Loading',
    })
        let urlStr =  app.globalData.restAdd +'/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser/' +e.detail.code + '?sessionkey=' + app.globalData.sessionKey;
        wx.request({
          url: urlStr,
          header: {
            'content-type': 'application/json'
          },
          method: 'PUT',
          data: {
            openId: app.globalData.openId,
            profile: this.data.imgData
          },
          success:res => {
       
            if(res.data.code==200){
              console.info("赋值成功")
              console.info("res.data="+JSON.stringify(res.data))
              app.globalData.authorized = res.data.authorized;
              app.globalData.employeeId = res.data.employeeId;
              app.globalData.employeeName = res.data.employeeName;
              app.globalData.profileData=res.data.profile;
              app.globalData.profileCommit=true;
              wx.hideLoading();
      
              wx.switchTab({
                url: '/pages/index/index'
              })
            }else{
              wx.showModal({
                title: '系统提示',
                content: res.data.msg,
                showCancel: false
              });
              wx.hideLoading();
            }
          },
          fail:res =>{
            wx.hideLoading();
          }
        })
  },
  loginout(){
    var that=this;
    wx.request({
      url: app.globalData.restAdd +'/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser/logout/' +app.globalData.openId + '?sessionkey=' + app.globalData.sessionKey,
      header: {
        'content-type': 'application/json'
      },
      method: 'PUT',
      data: {
        openId: app.globalData.openId,
        profile: this.data.imgData
      },
      success:res => {
        app.globalData.authorized = false;
        app.globalData.employeeId = "";
        app.globalData.employeeName = "";
        app.globalData.profileData="";
        that.setData({
          isShowInfo:false,
          isAuth:true
        })
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
  })
},
  formReset() {
    console.log('form发生了reset事件');
  }
})
