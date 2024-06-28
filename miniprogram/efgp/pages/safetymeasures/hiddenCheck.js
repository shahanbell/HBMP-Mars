// efgp/pages/safetymeasures/safetyManagement.js
var app = getApp();
var searchBarHeight;
var topTabHeight;
var bottomTabHeight;
var dateFilterType;
var backlogCount = -1;
import Dialog from '../../../component/vant/dialog/dialog';
Page({



  /**
   * 页面的初始数据
   */
  data: {
    interval_getBacklog: null,
    active: "home",
    tabData:["home","search","friends","setting","setting","setting","setting"],
    tabHeight: null,
    endHeight: null,
    startHeight: null,
    menuBtnStyle: "width:700rpx;border-radius:32rpx;font-size:35rpx;border:none;box-shadow:0px 2px 4px 4px #F0F0F0;",
    menuViewStyle: "height:8px",
    menuBtnHeight: null,
    repairBacklogList:[{pId:'PR20090064',userNo:'C2090',creDate:'2020/09/14 14:50',contenct:'责任回复',isRead:'N'},
                       {pId:'PR20090054',userNo:'C2090',creDate:'2020/09/13 14:50',contenct:'维修完成',isRead:'Y'}],
    showBacklogDot:false,


  },


  onGridClick(event){
    let that = this;
   
      wx.createSelectorQuery().in(this).select('#end').boundingClientRect(function(rect){
        //console.log("endHeight: "+ rect.bottom);  // 节点的高度
        //console.log(rect);
        // //let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;
        // let heightTemp = app.globalData.windowHeight - searchBarHeight - topTabHeight;
        // console.log("true height:" + heightTemp);
        console.log("CCCCCC")
        let viewStyle = "height:" + rect.bottom + "px";
        let btnHeight = rect.bottom / 7;
        let marginTemp = btnHeight / 7;

        let btnStyle = that.data.menuBtnStyle + "height:" + btnHeight + "px;margin-top:" + marginTemp + "px;";
        

        //console.log("viewHeight:" + rect.bottom + " btnHeight:" + btnHeight);

        that.setData({
          //bottomTabHeight: rect.height,
          endHeight : rect.bottom,
          menuViewStyle: viewStyle,
          menuBtnStyle: btnStyle,
        });
        //that.getStartBottom();
      }).exec();
  },


  getStartBottom(event){
    let that = this;
      wx.createSelectorQuery().in(this).select('#menuStart').boundingClientRect(function(rect){
        //console.log("endHeight: "+ rect.bottom);  // 节点的高度
        //console.log(rect);
        // //let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;
        // let heightTemp = app.globalData.windowHeight - searchBarHeight - topTabHeight;
        // console.log("true height:" + heightTemp);
        let viewHeight = that.data.endHeight-rect.bottom;
        let viewStyle = "height:" + viewHeight + "px";
        let btnHeight = viewHeight / 6.5;
        let marginTemp = btnHeight / 4;

        let btnStyle = that.data.menuBtnStyle + "height:" + btnHeight + "px;margin-top:" + marginTemp + "px;";
        

        //console.log("viewHeight:" + viewHeight + " btnHeight:" + btnHeight);
        that.setData({
          //bottomTabHeight: rect.height,
          startHeight : rect.bottom,
          menuViewStyle: viewStyle,
          menuBtnStyle: btnStyle,
        });
        //that.getTempBtnBottom();
      }).exec();
  },


    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info("demo2 load");
    let that = this;
    this.onGridClick();
    backlogCount = -1;
    if(this.data.interval_getBacklog == null){
      var interval = setInterval(function(){
        //console.log("interval start");
        // that.getHiddenBacklogInfo(app.globalData.employeeId);
      },30000);
      this.setData({
        interval_getBacklog: interval
      });
    }
    //this.getRepairBacklogInfo(app.globalData.employeeId);
  },
  onScheMaintainBtnClick: function(){
    wx.navigateTo({
      url: '../safetymeasures/hiddenDanger'
    })
  },
//岗位自查跳转
  onSecurityCheckBtnClick: function(){
    wx.navigateTo({
      url: '../safetymeasures/postSecureInspect?docType=' + "岗位自查"
    })
  },
//班组巡查跳转
  onClassBtnClick: function(){
    wx.navigateTo({
      url: '../safetymeasures/postSecureInspect?docType=' + "班组巡查"
    })
  },
  //课长巡查跳转
  onCourseBtnClick: function(){
    wx.navigateTo({
      url: '../safetymeasures/postSecureInspect?docType=' + "课长巡查"
    })
  },
  
  //轮值课长巡查跳转
  onRotationCourseBtnClick: function(){
    wx.navigateTo({
      url: '../safetymeasures/postSecureInspect?docType=' + "安全课长巡查"
    })
  }, 
   //安全员巡查跳转
   onSafetyOfficerBtnClick: function(){
    wx.navigateTo({
      url: '../safetymeasures/postSecureInspect?docType=' + "安全员巡查"
    })
  }, 

    //安全专员巡查跳转
    onCommissionerBtnClick: function(){
      wx.navigateTo({
        url: '../safetymeasures/hiddenDangerDetail?docType=' + "安全专员巡查"
      })
    }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options){
    let that = this;
    //console.log("demo2 show");
    //console.log(this.data.interval_getBacklog);
    if(this.data.interval_getBacklog == null){
      var interval = setInterval(function(){
        //console.log("interval start");
        // that.getHiddenBacklogInfo(app.globalData.employeeId);
      },30000);
      this.setData({
        interval_getBacklog: interval
      });
    }
    // this.getHiddenBacklogInfo(app.globalData.employeeId);
  },
  onTabbarChange(event){
    let _this = this;
    //console.log(event);
    // this.getHiddenBacklogInfo(app.globalData.employeeId);
    if(event.detail == "friends"){
      this.data.showBacklogDot = false;
    }
    this.setData({
      active: event.detail, 
      showBacklogDot: _this.data.showBacklogDot
    });
  },

  getHiddenBacklogInfo: function (res) {
    var _this = this;
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/getHiddenBacklogInfo';

    restUrl += '/f;userid=' + res;

    restUrl += '/s/' + 0 + '/' + 20;

    console.log(res);
    wx.request({
      url: restUrl,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        //console.log(res);

        if(res.data == "" || res.statusCode != 200){
          //console.log("no Data");
          backlogCount = -1;
          _this.setData({
            showDocEmpty: true
          });
          wx.hideLoading();
          return;
        }

        //console.log("backlogCount:" + backlogCount);

        if(backlogCount != -1){
          if(backlogCount < res.data){
            _this.setData({
              showBacklogDot:true,
            });
          }
          backlogCount = res.data;
        }
        else if(res.data > 0){
          backlogCount = res.data;
          _this.setData({
            showBacklogDot:true,
          });
        }
        

      },
      fail: function (fail) {
        wx.hideLoading();
        console.log(fail.data);
        Dialog.alert({
          title: '系统消息',
          message: '检测到系统已离线，请重新登录!',
        }).then(() => {
          // on close
          //initProInfo(_this);
          wx.reLaunch({
            url: '../../../pages/index/index'
          })
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})