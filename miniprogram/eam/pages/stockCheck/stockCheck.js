// miniprogram/pages/stockCheck/stockCheck.js
import Dialog from '../../../component/vant/dialog/dialog';
"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
var app = getApp();
var assetInfoRes = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formid:null,
    barCodeId: null,
    proName: null,
    itdsc: null,
    qty: null,
    username: null,
    userno: null,
    itnbr: null,
    depInfo: null,
    deptno: null,
    deptname: null,
    type: '0',
    address: null,
    iaddress: null,
    formuser: null,
    remark:"",
    offset: 0,
    pageSize: 20,
    numPickerCol: ['1','2','3','4','5','6'],
    show: {
      queryInfo: false,
      popupBottom: false,
    }
  },

  /**
   * Fields数据绑定
   */
  bindData(event){
    let name = event.currentTarget.dataset.name;
    this.setData({
     [name]:event.detail
    })
  },

  /**
   * 扫barcode
   */
  startScanCode: function () {
    console.log('test scan code');
    var that = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        console.log(res);
        that.scanCodeCallBack(res.result);
        //that.scanCodeCallBack('SA607-01-12-0288');
      }
    });
    //that.getAssetInfo();
    //that.insertAssetInfo();
  },

  stockTypeRadioChange: function (e) {
    this.setData({
      type: e.detail.value,
    });
    console.log(this.data.type);
  },

  scanCodeCallBack: function (res) {
    this.setData({
      barCodeId: res,
    });
    this.getAssetInfo(res);
  },

  getAssetInfo: function (res) {
    var _this = this;
    // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest/getAssetCardModel';
    //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
    // if (options.employeeid) {
    //     restUrl += '/f;users.id=' + options.employeeid + '/s';
    // }
    // else {
    //     restUrl += '/f/s';
    // }
    //restUrl += '/f;deptno=' + '13000' + '/s';
    restUrl += '/f;formid=' + res;
    //restUrl += '/' + this.data.offset + '/' + this.data.pageSize;
    console.log(restUrl);
    wx.showLoading({
      title: 'Sending'
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
          initProInfo(_this);
          _this.setData({
            show:{queryInfo:true}
          });
          wx.hideLoading();
          return;
        }
        assetInfoRes = res.data;
        var positionList = new Array();
        positionList[0] = assetInfoRes.position1 == null ? "" : assetInfoRes.position1.name;
        positionList[1] = assetInfoRes.position2 == null ? "" : assetInfoRes.position2.name;
        positionList[2] = assetInfoRes.position3 == null ? "" : assetInfoRes.position3.name;
        positionList[3] = assetInfoRes.position4 == null ? "" : assetInfoRes.position4.name;
        var positionStrTemp = positionList[1];

        for(var i = positionList.length - 1;i > 1;i--){
          if(positionList[i] != ""){
            positionStrTemp = positionStrTemp + "-" + positionList[i];
            break;
          }
        }

        _this.setData({
          itdsc: res.data.assetDesc,
          username: res.data.username,
          depInfo: res.data.deptno + '-' + res.data.deptname,
          qty: res.data.qty,
          userno: res.data.userno,
          itnbr: res.data.assetItem.itemno,
          deptno: res.data.deptno,
          deptname: res.data.deptname,
          address: positionStrTemp,
          show:{queryInfo:false}
        });
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
          initProInfo(_this);
        });
      }
    });
  },

  /**
   * 数字选择弹出层开启
   */
  showPopupBottom: function(){
      this.setData({
        show:{popupBottom:true}
      });
  },

  /**
   * 数字选择弹出层关闭
   */
  closePopupBotton: function(){
    this.setData({
      show:{popupBottom:false}
    });
  },

  /**
   * 数字选择器事件
   */
  onNumPickerChange: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      qty: value
    });
  },

  onNumPickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      qty: value
    });
    this.closePopupBotton();
  },

  onNumPickerCancel: function(event){
    this.closePopupBotton();
  },

  /**
   * 单选框事件
   */
  onTypeChange:function(event){
    this.setData({
      type: event.detail,
    });
  },

  /**
   * 滑动单元格关闭事件
   */
  onSwipeClose: function(event){
    var that = this;
    const { position, instance } = event.detail;
    console.log("position:" + position);
    switch (position) {
      case 'right':
      case 'cell':
        instance.close();
        break;
      case 'left':
        console.log(that.data.barCodeId);
        console.log(app.globalData);
        this.getAssetInfo(this.data.barCodeId);
        instance.close();
        break;
    }
  },

  onQtyTap: function(event){
    this.showPopupBottom();
  },

  onQtyStepperChange:function(event){
    this.setData({
      qty: event.detail
    });
  },

  // equipInvenTemp.setFormid(entity.getFormid());
  // equipInvenTemp.setItdsc(entity.getItdsc());
  // equipInvenTemp.setQty(entity.getQty());
  // equipInvenTemp.setUsername(entity.getUsername());
  // equipInvenTemp.setUserno(entity.getUserno());
  // equipInvenTemp.setAssetno(entity.getAssetno());
  // equipInvenTemp.setDeptno(entity.getDeptno());
  // equipInvenTemp.setDeptname(entity.getDeptname());
  // equipInvenTemp.setType(entity.getType());
  // equipInvenTemp.setAddress(entity.getAddress());
  // equipInvenTemp.setFormuser(entity.getFormuser());
  // LocalDateTime localDateTime = LocalDateTime.now();
  // Date date = Date.from( localDateTime.atZone( ZoneId.systemDefault()).toInstant());
  // equipInvenTemp.setFormdate(date);
  insertAssetInfo: function (e) {
    var _this_1 = this;
    wx.showModal({
      title: '系统提示',
      content: '确定提交吗',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: 'Sending'
          });
          wx.request({
            //url: 'http://localhost:8480' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,\
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              formid: null,
              itnbr: null,
              itdsc: null,
              qty: null,
              username: null,
              userno: null,
              assetno: null,
              deptno: null,
              deptname: null,
              type: null,
              address: null,
              formuser: null,
              dmark: null,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '系统消息',
                content: res.data.msg,
                showCancel: false,
                success: function (res) {
                  wx.switchTab({
                    url: "/pages/index/index"
                  });
                }
              });
            },
            fail: function (fail) {
              wx.hideLoading();
              wx.showModal({
                title: '系统提示',
                content: "请联系管理员:" + fail,
                showCancel: false
              });
            }
          });
        }
      }
    });
  },

  checkFormDtaBeforeSubmit: function(){

    if(assetInfoRes == null){
      Dialog.alert({
        title: '系统消息',
        message: "请先输入资产编号或直接扫码",
        zIndex:1000,
        }).then(() => {
        });
      return false;
    }
    return true;
  },

  formSubmit: function (e) {
    var that = this;
    console.log(that.data);
    var canSubmit = this.checkFormDtaBeforeSubmit();
    var errmsg = '';
    if (!app.globalData.authorized) {
      canSubmit = false;
      errmsg += '账号未授权\r\n';
    }
    if (canSubmit) {
      // wx.showModal({
      //   title: '系统提示',
      //   content: '确定提交吗',
      //   success: function (res) {
      //     if (res.confirm) {
            
      //     }
      //   }
      // });
      Dialog.confirm({
        title: '系统提示',
        message: '确认提交吗?',
      })
        .then(() => {
          // on confirm
          wx.showLoading({
            title: 'Sending'
          });
          wx.request({
            //url: 'http://localhost:8480' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcheck/startassetcheck?' + app.globalData.restAuth,
            data: {
              company: app.globalData.defaultCompany,
              formid: that.data.formid,
              assetno: that.data.barCodeId,
              itemno: assetInfoRes.assetItem.itemno,
              assetDesc: assetInfoRes.assetDesc == null ? "" : assetInfoRes.assetDesc,
              assetSpec: assetInfoRes.assetSpec == null ? "" : assetInfoRes.assetSpec,
              // itnbr: that.data.itnbr,
              // itdsc: that.data.itdsc,
              qty: that.data.qty,
              username: that.data.username,
              userno: that.data.userno,
              // assetno: that.data.itnbr,
              deptno: that.data.deptno,
              deptname: that.data.deptname,
              itimes: that.data.type,
              address: that.data.address,
              iaddress: that.data.iaddress,
              creator: app.globalData.employeeId,
              remark: that.data.remark,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              wx.hideLoading();
              var resMsg = '';
              console.log(res);
              if(res.statusCode == 200){
                resMsg = '提交成功';
                if(res.data.code == "208"){
                  resMsg = '无盘点单信息';
                  Dialog.alert({
                    title: '系统消息',
                    message: resMsg,
                  }).then(() => {
                    // on close
                  });
                  return;
                }
                if(res.data.code == "209"){
                  resMsg = '资产盘点数据异常';
                  Dialog.alert({
                    title: '系统消息',
                    message: resMsg,
                  }).then(() => {
                    // on close
                  });
                  return;
                }
              }
              else{
                resMsg = '提交失败';
              }
              Dialog.alert({
                title: '系统消息',
                message: resMsg,
              }).then(() => {
                // on close
                setAssetCheckStorage(that);
                initProInfo(that);
              });
              // wx.showModal({
              //   title: '系统消息',
              //   content: res.data.msg,
              //   content: '提交成功',
              //   showCancel: false,
              //   success: function (res) {
              //     initProInfo(that);
              //   }
              // });
            },
            fail: function (fail) {
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
        });
    } else {
      // wx.showModal({
      //   title: '系统提示!',
      //   content: errmsg,
      //   showCancel: false
      // });
      return;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getAssetCheckStorage(this);
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

function setProInfo(that) {
  that.setData({

  });

}

function initProInfo(that) {
  assetInfoRes = null;
  that.setData({
    barCodeId: null,
    proName: null,
    itdsc: null,
    qty: null,
    username: null,
    userno: null,
    itnbr: null,
    depInfo: null,
    deptno: null,
    deptname: null,
    address: null,
    formuser: null,
    remark:null,
    show:{queryInfo:false},
    offset: 0,
    pageSize: 20,
  });
}

function setAssetCheckStorage(that){
  var assetCheckDataTemp = {
    formid:that.data.formid,
    type:that.data.type,
    iaddress:that.data.iaddress
  };
  wx.setStorage({
    key:"assetCheckData",
    data:assetCheckDataTemp
  });
}

function getAssetCheckStorage(that){
  wx.getStorage({
    key: 'assetCheckData',
    success (res) {
      console.log(res);
      that.setData({
        formid:res.data.formid,
        type:res.data.type,
        iaddress:res.data.iaddress,
      });
    },
    fail(res){
      console.log(res);
    },
  })
}