var app = getApp();
var searchBarHeight;
var topTabHeight;
var bottomTabHeight;
var dateFilterType;
var backlogCount = -1;
import Dialog from '../../../component/vant/dialog/dialog';
Page({
  data: {
    interval_getBacklog: null,
    active: "home",
    tabData:["home","search","friends","setting"],
    tabHeight: null,
    endHeight: null,
    startHeight: null,
    menuBtnStyle: "width:700rpx;border-radius:32rpx;font-size:35rpx;border:none;box-shadow:0px 2px 4px 4px #F0F0F0;",
    menuViewStyle: "height:10px",
    menuBtnHeight: null,
    repairBacklogList:[{pId:'PR20090064',userNo:'C2090',creDate:'2020/09/14 14:50',contenct:'责任回复',isRead:'N'},
                       {pId:'PR20090054',userNo:'C2090',creDate:'2020/09/13 14:50',contenct:'维修完成',isRead:'Y'}],
    showBacklogDot:false,
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
        that.getRepairBacklogInfo(app.globalData.employeeId);
      },30000);
      this.setData({
        interval_getBacklog: interval
      });
    }
    this.getRepairBacklogInfo(app.globalData.employeeId);
  },

  onShow: function(options){
    let that = this;
    //console.log("demo2 show");
    //console.log(this.data.interval_getBacklog);
    if(this.data.interval_getBacklog == null){
      var interval = setInterval(function(){
        //console.log("interval start");
        that.getRepairBacklogInfo(app.globalData.employeeId);
      },30000);
      this.setData({
        interval_getBacklog: interval
      });
    }
    this.getRepairBacklogInfo(app.globalData.employeeId);
  },

  onUnload:function () {
    //console.log("demo2 unload");
    var that = this;
    that.clearTimeInterval(that)
  },

  onHide:function () {
    //console.log("demo2 hide");
      var that = this;
      that.clearTimeInterval(that)
  },

  onTabbarChange(event){
    let _this = this;
    //console.log(event);
    this.getRepairBacklogInfo(app.globalData.employeeId);
    if(event.detail == "friends"){
      this.data.showBacklogDot = false;
    }
    this.setData({
      active: event.detail, 
      showBacklogDot: _this.data.showBacklogDot
    });
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

  getTempBtnBottom(event){
    let that = this;
      wx.createSelectorQuery().in(this).select('#menuBtnTemp').boundingClientRect(function(rect){
        //console.log("menuBtnHeight: "+ rect.height);  // 节点的高度
        //console.log(rect);
        // //let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;
        // let heightTemp = app.globalData.windowHeight - searchBarHeight - topTabHeight;
        // console.log("true height:" + heightTemp);
        that.setData({
          //bottomTabHeight: rect.height,
          menuBtnHeight: rect.height,
        });
      }).exec();
  },

  onGridClick(event){
    let that = this;
      wx.createSelectorQuery().in(this).select('#end').boundingClientRect(function(rect){
        //console.log("endHeight: "+ rect.bottom);  // 节点的高度
        //console.log(rect);
        // //let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;
        // let heightTemp = app.globalData.windowHeight - searchBarHeight - topTabHeight;
        // console.log("true height:" + heightTemp);

        let viewStyle = "height:" + rect.bottom + "px";
        let btnHeight = rect.bottom / 6.5;
        let marginTemp = btnHeight / 4;

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

  startEqpRepair: function(){
    wx.navigateTo({
      url: '../eqpManagement/startEqpRepair'
    })
  },

  startStockCheck: function(){
    wx.navigateTo({
      url: '../stockCheck/stockCheck'
    })
  },

  onSearchDocBtnClick: function(){
    this.setData({ active: "search" });
  },

  getRepairBacklogInfo: function (res) {
    var _this = this;
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairBacklogInfo';
    if(app.globalData.defaultDeptId.indexOf("1P000") >= 0){
      restUrl += '/f;repairmanager=' + res;
    }
    else if(app.globalData.defaultDeptId.indexOf("1W3") >= 0){
      restUrl += '/f;serviceuser=' + res;
    }
    else{
      restUrl += '/f;repairuser=' + res;
    }
    restUrl += ';ALL=ALL';
    restUrl += '/s/' + 0 + '/' + 20;

    //console.log(restUrl);
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
          message: fail.data + "-" + fail.statusCode + "-" + fail.header + "-" + fail.cookies,
        }).then(() => {
          // on close
          //initProInfo(_this);
        });
      }
    });
  },

  clearTimeInterval: function (that) {
    var interval = that.data.interval_getBacklog;
    clearInterval(interval);
    this.setData({
      interval_getBacklog : null
    });
  },
})

//var filterPopupFlag = false;

