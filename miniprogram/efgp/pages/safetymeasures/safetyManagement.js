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
    tabData:["home","search","friends","setting"],
    tabHeight: null,
    endHeight: null,
    startHeight: null,
    menuBtnStyle: "width:700rpx;border-radius:32rpx;font-size:35rpx;border:none;box-shadow:0px 2px 4px 4px #F0F0F0;",
    menuViewStyle: "height:10px",
    menuBtnHeight: null,
  
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
  onLoad(options) {
    this.onGridClick();

  },


  onAutoMaintainBtnClick: function(){
    wx.navigateTo({
      url: '../safetymeasures/hiddenCheck'
    })
  },
//环境安全培训
  onSafetyTrainingBtnClick: function(){
       console.log("cccccccccccccccc");
    Dialog.alert({
      title: '系统消息',
      message: "待开发",
      zIndex:1000,
      }).then(() => {
        this.setData({
     
        });
      });
  },
  //安全隐患整改单
  onSafetyRectificationBtnClick: function(){
    wx.navigateTo({
      url: '../safetymeasures/safetymeasures'
    })
  },
//员工自学
onStudyIndependentlyBtnClick: function(){
  Dialog.alert({
    title: '系统消息',
    message: "待开发",
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
  onShow() {

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