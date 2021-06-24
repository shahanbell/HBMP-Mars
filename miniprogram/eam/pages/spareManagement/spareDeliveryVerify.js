// miniprogram/eam/pages/spareManagement/spareDeliveryVerify.js
import Dialog from '../../../component/vant/dialog/dialog';
import Toast from '../../../component/vant/toast/toast';
var util = require("../../../utils/eamCommonUtils.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docId:null,
    docFormid:null,
    formCreDate:null,
    formCreator:null,
    formType:null,
    acceptType:null,
    sarea:null,
    deliveryRemark:null,
    spareUsedList:[],
    spareDetailList:[],
    tabActive: 0,
    showSubmitBtn: false,
    show:{
      spareDetailPopup: false,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      docId: options.docId,
      docFormid: options.docFormid,
    })

    let _this = this;
    this.getFormInfo();

  },

  getFormInfo:function(){
    var _this = this;
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/sparemanagement/getSpareDeliveryInfo';
    restUrl += '/f;docFormid=' + this.data.docFormid + ';userId=' + app.globalData.employeeId + ';actionName=equipmentSpareDelivery';
    //restUrl += '/' + 0 + '/' + 20;
    //console.log(restUrl);
    wx.showLoading({
      title: 'Sending',
      mask: true
    });
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
        console.log(res);
        if(res.data == "" || res.statusCode != 200){
          console.log("no Data");
          wx.hideLoading();
          return;
        }
        var docInfoTemp = null;
        var spareDataTemp = null;
        var verifyFlag = null;


        if(res.data.length > 1){
          docInfoTemp = res.data[0];
          spareDataTemp = res.data[1];
          verifyFlag = res.data[2];
          var dateTemp = new Date(docInfoTemp.credate);
          dateTemp.setHours(dateTemp.getHours() - 14);
          _this.setData({
            docId:docInfoTemp.id,
            docFormid:docInfoTemp.formid,
            formCreDate:util.dateFormatForFilter(dateTemp),
            formCreator:docInfoTemp.creator,
            formType:util.getSpareFormType(docInfoTemp.accepttype),
            acceptType:docInfoTemp.accepttype,
            sarea:docInfoTemp.sarea,
            deliveryRemark:docInfoTemp.remark == null ? '':docInfoTemp.remark,
            spareUsedList:spareDataTemp,
            showSubmitBtn: verifyFlag,
          });
        }

        wx.hideLoading();
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

  spareDeliveryVerify:function(){
    let that = this;
    var canSubmit = true;
    var errmsg = '';
    if (!app.globalData.authorized) {
      canSubmit = false;
      errmsg += '账号未授权\r\n';
    }
    if (canSubmit) {
      Dialog.confirm({
        title: '系统提示',
        message: '确认核准吗?',
        mask: false,
        zIndex: 1000,
      })
        .then(() => {

          console.log(that.data);

          // on confirm
          wx.showLoading({
            title: 'Sending',
            mask: true
          });
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/sparemanagement/verifySpareDelivery?' + app.globalData.restAuth,
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              id: that.data.docId,
              formid: that.data.docFormid,
              accepttype: that.data.acceptType,
              cfmuser: app.globalData.employeeId,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              wx.hideLoading();
              var resMsg = '';
              console.log(res);
              if(res.statusCode == 200 && res.data.msg != null){
                resMsg = '审核成功';
                if(res.data.code != "200"){
                  resMsg = res.data.msg;
                  Dialog.alert({
                    title: '系统消息',
                    message: resMsg,
                    }).then(() => {
                      // on close
                    });
                  return;
                }
                wx.hideLoading();
                Dialog.alert({
                title: '系统消息',
                message: resMsg,
                }).then(() => {
                  // on close
                    wx.navigateBack({delta: 1});
                });
              }
              else{
                resMsg = '提交失败';
                Dialog.alert({
                  title: '系统消息',
                  message: resMsg,
                  }).then(() => {
                    // on close
                  });
              }
            },
            fail: function (fail) {
              console.log(fail);
              wx.hideLoading();
              wx.showModal({
                title: '系统提示',
                content: "请联系管理员:" + fail,
                showCancel: false
              });
            }
          });
        })
        .catch(() => {
          // on cancel
          this.setData({
            textareaDisabled:false
          });
        });
    } else {
      return;
    }
  },

  showNextPage:function(){
    this.setData({
      tabActive: 1
    });
  },

  onTabChange:function(event){
    this.setData({
      tabActive: event.detail.index
    });
  },

    /**
   * 打开备件详细信息弹窗
   */
  showSpareDetailPopup: function(e){
    console.log(e);
    var itemStockCurrentListTemp = this.data.spareUsedList[e.currentTarget.dataset.itemindex].equipmentSpareRecodeDtaList;
    console.log(itemStockCurrentListTemp);
    this.setData({
      show:{
        spareDetailPopup: true
      },
      spareDetailList:itemStockCurrentListTemp
    });
  },

    /**
   * 备件详细信息弹窗关闭事件
   */
  closeSpareDetailPopup: function(){
    //console.log("eqpListClose!");
    this.setData({
      show:{
        spareDetailPopup: false
      }
    });
  },

  onEqpSelBackClick: function(){
    this.closeEqpSelectorPopup();
    this.setData({
      //orderList: [],
      eqpListScrollTop:0,
      });
    eqpListDta = null;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})