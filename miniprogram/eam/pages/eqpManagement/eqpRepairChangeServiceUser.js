// miniprogram/pages/eqpManagement/startEqpRepair.js
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}



var endVal = null;
var app = getApp();
var startVal = null;
var canLoadNewData = true;
var eqpListDta = null;
var spareListDta = null;
var hitchDutyListDta = null;
var serviceUserDta = null;
var troubleReasonDta = null;
var dateTemp = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auditContenctType:'接受',
    totalPrice:null,
    laborCost:null,
    repairCost:null,
    repairTimestamp:null,
    exceptTime:null,
    stopWorkTime:null,
    spareSelectPopup: null,
    textareaIsShow:false,
    textareaValue:"",
    docId:null,
    docFormid:null,
    eqpInfo: null,
    eqpIntoViewTest: null,
    eqpListScrollTop: 0,
    eqpListHeight: null,
    nodataType: 7,
    orderList: [{ shop: "A119-01", shopurl: "/images/1.jpg", origin: "TaoBao", orderstate: "", pictureurl: "/images/1.jpg", couponname: "品名", orderdtt: "副齿轮检验轴AA-2600I", productcount: 1, ordernum: "202054654654466", payamount: "技术员" }],    //订单列表数据，接口获取
    eqpRepairInfoList:[],
    spareList: [],
    spareUsedList:[],
    serviceUserList:[], 
    repairHisList:[],
    hitchDutyList:[{userId:'C2090',deptNo:'13100',dept:'资讯室',userName:'沈越',email:'841873930@qq.com',phone:'18323491234'}],
    abraseHitchList:[{abraseHitchId : '1',abraseHitchDesc: '非正常磨损'},{abraseHitchId : '2',abraseHitchDesc: '正常磨损'}],
    hitchTypeList:[{hitchTypeCode: '0', hitchTypeName: '一般故障'},{hitchTypeCode: '1', hitchTypeName: '严重故障'}],
    auditContenctList:[{contenctId:'接受',contenctDesc:'接受'},{contenctId:'不接受',contenctDesc:'不接受'}],
    hitchSort01List:[],
    hitchTypeCode:null,
    hitchTypeName:null,
    refreshTrigger: false,
    currentTab: 0,     //当前显示tab的下标
    navTab: ['全部', '处理中', '已完成'],
    navTabPro: [],
    images: [],
    uploaderList: [],
    uploaderNum:0,
    showUpload:false,
    showDelete:false,
    showSpareEditBtn: false,
    troubleTypeCol: ['操作员点检','设备突发故障','维修员点检'],
    show:{
      eqpSelectorPopup: false,
      hitchDutySelectorPopup: false,
      hitchSort01SelectorPopup: false,
      contenctSelectorPopup:false,
      abraseSelectorPopup: false,
      hitchTypeSelectorPopup: false,
      dateFilterPopup: false,
      statusFilterPopup: false,
      dateSelector: false,
      queryInfo: false,
    },
    showTextArea:{
      changeReason: false
    },
    eqpListLoading: false,
    eqpListLoadingTest2: true,
    date: null,
    // minDate: new Date(new Date().getFullYear() -1 ,new Date().getMonth(), 1).getTime(),
    // maxDate: new Date().getTime(),
    // defaultDate: [new Date().getTime() ,new Date().getTime()],
    // currentDate: new Date().getTime(),

    minDate: null,
    maxDate: null,
    defaultDate: [,],
    currentDate: null,

    repairuser: null,
    repairUserName: null,
    assetno: null,
    itemdsc: null,
    itemno: null,
    hitchDutyUserObj:null,
    hitchDutyDeptObj:null,
    abraseHitchObj:null,
    hitchSort01Obj:null,
    hitchTypeObj:null,
    auditContenctObj:null,
    repairMethod: null,
    formdate: null,
    formdateTS: null,
    assetCardId: null,
    serviceuser: 'TEST',
    serviceusername: 'CTEST',
    focusTroubleDetailField:'false',
    textareaDisabled:false,
    serviceuserPickerIndex: null,
    auditNote:'',
    changeReason:'',
    hitchAlarm:'',
    repairMethod:'',
    hitchDesc:'',
    hitchReason:'',
    repairProcess:'',
    measure:'',

    auditTabActive: 0,

    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },

  },

  onServiceUserCellTap:function(){
    this.showServiceUserSelectorPopup();
  },

    /**
   * 故障来源选择弹出层开启
   */
  showServiceUserSelectorPopup: function(){
      this.setData({
        show:{serviceUserSelectorPopup:true}
      });
  },

  /**
   * 故障来源选择弹出层关闭
   */
  closeServiceUserSelectorPopup: function(){
    this.setData({
      show:{serviceUserSelectorPopup:false}
    });
  },

  /**
   * 故障来源选择器事件
   */
  onServiceUserPickerChange: function(event){
    //console.log(event);
    const { picker, value, index } = event.detail;
    this.setData({
      serviceuser: value.userId,
      serviceusername: value.userName,
    });
  },

  onServiceUserPickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      serviceuser: value.userId,
      serviceusername: value.userName,
    });
    this.closeServiceUserSelectorPopup();
  },

  onServiceUserPickerCancel: function(event){
    this.closeServiceUserSelectorPopup();
  },

  scrollFn(e) { 
    // 防抖，优化性能
    // 当滚动时，滚动条位置距离页面顶部小于设定值时，触发下拉刷新
    // 通过将设定值尽可能小，并且初始化scroll-view组件竖向滚动条位置为设定值。来实现下拉刷新功能，但没有官方的体验好
      // clearTimeout(this.timer)
      // if (e.detail.scrollTop < this.data.scrollTop) {     
      //   this.timer = setTimeout( () => {
      //     this.refresh()
      //   }, 350)
      // }
      //console.log(e.detail.scrollTop);
    },

    listTouchStart(){
      wx.createSelectorQuery().select('#eqpList').boundingClientRect(function(rect){

        //console.log("eqpList dta");
        //console.log(rect);
  
      }).exec();
    },

  changeServiceUserFormSubmit: function(e){
    var that = this;
    //console.log(e);
    //console.log(this.data.uploaderList);
    const FileSystemManager = wx.getFileSystemManager();
    console.log(this.data);
    //var canSubmit = this.checkFormDtaBeforeSubmit();
    var canSubmit = true;
    var apiTemp = 'changeServiceUser';
    var errmsg = '';
    if (!app.globalData.authorized) {
      canSubmit = false;
      errmsg += '账号未授权\r\n';
    }
    if (canSubmit) {
      Dialog.confirm({
        title: '系统提示',
        message: '确认转派吗?',
        mask: false,
        zIndex: 1000,
      })
        .then(() => {

          //console.log(that.data);

          // on confirm
          wx.showLoading({
            title: 'Sending',
            mask: true
          });
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/' + apiTemp + '?' + app.globalData.restAuth,
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              id: that.data.docId,
              pid: that.data.docFormid,
              repairuser: app.globalData.employeeId,
              repairusername: app.globalData.employeeName,
              serviceuser: that.data.serviceuser,
              serviceusername: that.data.serviceusername,
              remark: that.data.changeReason,
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
                resMsg = '转派成功';
              }
              else{
                resMsg = '转派失败';
              }
              Dialog.alert({
                title: '系统消息',
                zIndex: 1000,
                mask:false,
                message: resMsg,
                  }).then(() => {
                   // on close
                   //initProInfo(_this);
                   wx.navigateBack({delta: 2});
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
        })
        .catch(() => {
          // on cancel
          this.setData({
            textareaDisabled:false
          });
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
    // let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;


    //console.log(options);

    this.setData({
      docId: options.docId,
      docFormid: options.docFormid,
    })

    let _this = this;

    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairUserList';
    restUrl += '/f' + '/s';
    restUrl += '/' + 0 + '/' + 20;

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
        //console.log(res);
        if(res.data == "" || res.statusCode != 200){
          //console.log("no Data");
          wx.hideLoading();
          return;
        }
        if(res.data.length > 2){
          serviceUserDta = res.data[0];
        }

        var dataLen = res.data.length;

        for(var i = 0;i < serviceUserDta.length; i++){
          let newItem = { userId: "" , userName: "" , userInfo:""};
          newItem.userId = serviceUserDta[i].userid;
          newItem.userName = serviceUserDta[i].username;
          newItem.userInfo = serviceUserDta[i].userid + "-" + serviceUserDta[i].username;
          _this.data.serviceUserList.push(newItem);
        }

        _this.setData({
          serviceUserList: _this.data.serviceUserList,
          serviceuser: _this.data.serviceUserList[0].userId,
          serviceusername: _this.data.serviceUserList[0].userName,
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
          //initProInfo(_this);
        });
      }
    });



    //写你自己的接口
    this.setData({
      docId: options.docId,
      docFormid: options.docFormid,
      eqpRepairInfoList: [JSON.parse(options.eqpInfo)],
      approveUserId: app.globalData.employeeId,
      approveUserName: app.globalData.employeeName,
      abraseHitchObj: _this.data.abraseHitchList[0],
      auditContenctObj: _this.data.auditContenctList[0],
      hitchTypeObj:_this.data.hitchTypeList[0],
      focusTroubleDetailField: false,
    });
  },

  onSpareLeftIconClick:function(e){
    //console.log(e);
    var itemIndex = e.currentTarget.dataset.itemindex;
    var currentQty = this.data.spareUsedList[itemIndex].qty;
    if(currentQty > 1){
      this.data.spareUsedList[itemIndex].qty = parseInt(currentQty) - 1;
    }
    this.setData({
      spareUsedList: this.data.spareUsedList
    });

    this.getTotalPrice();
  },

  onSpareRightIconClick:function(e){
    //console.log(e);
    var itemIndex = e.currentTarget.dataset.itemindex;
    var currentQty = this.data.spareUsedList[itemIndex].qty;
    this.data.spareUsedList[itemIndex].qty = parseInt(currentQty) + 1;
    this.setData({
      spareUsedList: this.data.spareUsedList
    });
    this.getTotalPrice();
  },

  onSpareQtyInput:function(e){
    //console.log(e);
    var itemIndex = e.target.dataset.itemindex;
    var valueTemp = e.detail.value;
    //console.log(parseInt(e.detail.value));
    if(valueTemp == null || valueTemp == '' || valueTemp < 1 || isNaN(parseInt(valueTemp))){
      this.data.spareUsedList[itemIndex].qty = 1;
    }
    else{
      this.data.spareUsedList[itemIndex].qty = parseInt(e.detail.value);
    }
    
    this.setData({
      spareUsedList: this.data.spareUsedList
    });

    this.getTotalPrice();
  },

  onClearSpareIconClick:function(e){
    //console.log(e);
    let _this = this;


    Dialog.confirm({
      title: '系统提示',
      message: '确认删除吗?',
      zIndex: 1000,
    })
      .then(() => {

        _this.data.spareUsedList.splice(e.currentTarget.dataset.itemindex,1);
        _this.setData({
          spareUsedList : _this.data.spareUsedList
        });

        _this.getTotalPrice();
      })
      .catch(() => {
        // on cancel
      });

  },

  inputConfirmTest:function(e){
    //console.log(e);
  },

  getTotalPrice:function(){
    var spareListTemp = this.data.spareUsedList;
    var totalPrice = 0;
    var repairCostTemp = isNaN(parseInt(this.data.repairCost)) ? 0 : parseInt(this.data.repairCost);
    var laborCostTemp = isNaN(parseInt(this.data.laborCost)) ? 0 : parseInt(this.data.laborCost);
    for(var i = 0 ; i < spareListTemp.length ; i++){
      totalPrice = totalPrice + spareListTemp[i].uPrice * spareListTemp[i].qty;
    }
    totalPrice = (totalPrice + repairCostTemp + laborCostTemp) * 100;
    this.setData({
      totalPrice : totalPrice
    });
  },

  onContenctChange:function(e){
    //console.log(e);
    this.setData({
      auditContenctType:e.detail,
    });
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

  dateFormatForFilter(date){
    let dateTemp = new Date(date);
    let year = dateTemp.getFullYear();
    let month = dateTemp.getMonth() + 1;
    let day = dateTemp.getDate();
    let hour = dateTemp.getHours();
    let minute = dateTemp.getMinutes();
    let dayTemp = year + "/" + month + "/" + day + "  " + hour + ":" + minute;
    return dayTemp;
  },


  utcInit: function(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0,T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
    var new_datetimeInit = new_datetime.replace(/-/g, '/');

    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetimeInit));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;

    // 增加8个小时，北京时间比utc时间多八个时区
    var timestamp = timestamp+8*60*60;

    // 时间戳转为时间
    //var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");

    let dateTemp = new Date(parseInt(timestamp) * 1000);
    let year = dateTemp.getFullYear();
    let month = dateTemp.getMonth() + 1;
    let day = dateTemp.getDate();
    let hour = dateTemp.getHours();
    let minute = dateTemp.getMinutes();
    let dayTemp = year + "/" + month + "/" + day + "  " + hour + ":" + minute;
    return dayTemp;


    //return beijing_datetime; // 2017-03-31 16:02:06
  },

  checkFormDtaBeforeSubmit: function(){

    this.setData({
      textareaDisabled:true
    });

    if(this.data.hitchTypeCode == null || this.data.docId == null || this.data.docFormid == null || this.data.repairMethod == null){
      Dialog.alert({
        title: '系统消息',
        message: "请将信息填写完整",
        zIndex:1000,
        }).then(() => {
          this.setData({
            textareaDisabled:false
          });
        });
      return false;
    }
  
    return true;
  },

  onTroubleDetailFieldClick:function(e){
    this.setData({
      focusTroubleDetailField: true
    });
  },

  timestampInit:function(timestampTemp){
    // let day = parseInt(timestampTemp/1000/3600/24);
    // let hours = parseInt(timestampTemp/1000/3600%24);
    // let minutes = parseInt((timestampTemp/1000/3600%24 - hours) * 60);
    let hours = (timestampTemp/1000/3600).toFixed(1);
    return hours;
  },

  ifshowArea:function(e){
    if(e.type == "tap"){
      this.setData({
        ["showTextArea."+e.currentTarget.dataset.show]:true
      });
    }
    else if(e.type == "blur"){
      this.setData({
        ["showTextArea."+e.currentTarget.dataset.show]:false
      });
    }
  },
  textAreaProInput:function(e){
    this.setData({
      [e.currentTarget.dataset.show]: e.detail.value
    });
  }

})

function initProInfo(that) {
  that.setData({
    //repairUserName: res.data.username,
    assetno: null,
    itemdsc: null,
    itemno: null,
  });
}
