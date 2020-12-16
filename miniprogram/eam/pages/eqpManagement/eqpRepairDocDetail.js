// miniprogram/pages/eqpManagement/startEqpRepair.js
import Dialog from '../../../component/vant/dialog/dialog';
var eamUtil = require('../../../utils/eamCommonUtils.js');
var endVal = null;
var app = getApp();
var startVal = null;
var canLoadNewData = true;
var eqpListDta = null;
var dateTemp = null;
var repairDocDta = null;
var repairUserInfo = null;
var serviceUserInfo = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eqpIntoViewTest: null,
    eqpListScrollTop: 0,
    eqpListHeight: null,
    nodataType: 7,
    orderList: [],    //订单列表数据，接口获取
    refreshTrigger: false,
    currentTab: 0,     //当前显示tab的下标
    navTab: ['全部', '处理中', '已完成'],
    navTabPro: [{value:'全部',showScrollBar:true}, {value:'处理中',showScrollBar:false}, {value:'已完成',showScrollBar:false}],
    images: [],
    uploaderList: [],
    uploaderNum:0,
    showUpload:false,
    troubleTypeCol: ['操作员点检','设备突发故障','维修员点检'],
    show:{
      eqpSelectorPopup: false,
      troubleSelectorPopup: false,
      dateFilterPopup: false,
      statusFilterPopup: false,
      dateSelector: false,
      queryInfo: false,
    },
    showBtn:{
      deleteBtn:false,
      arrivalCheckBtn:false,
      finishCheckBtn:false,
      startAuditBtn:false,
      saveRepairInfoBtn:false,
      responseDutyBtn:false,
      approveAuditBtn:false,
      examAuditBtn: false,
      detailCheckBtn: false,
      stopRepairBtn: false,
      startRepairBtn: false,
      changeServiceUserBtn: false,
    },
    disableBtn:{
      arrivalCheckBtn: false,
      finishCheckBtn:false,
      stopRepairBtn: false,
      startRepairBtn: false,
      saveRepairInfoBtn: false,
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
    contactTime:null,
    repairTime:null,
    repairTimestamp:null,
    downTime:null,
    downTimestamp:null,

    docId: null,
    docFormidId: null,
    repairuser: null,
    repairUserName: null,
    repairUserMobile: null,
    assetno: null,
    itemdsc: null,
    itemno: null,
    troubleFrom: null,
    troubleDetailInfo: null,
    formdate: null,
    formdateTS: null,
    serviceArriveTime: null,
    completeTime: null,
    assetCardId: null,
    serviceuser: 'TEST',
    serviceusername: 'CTEST',
    serviceuserMobile: null,
    assetPosition:null,
    hitchUrgency:null,

    steps: [
      {
        text: '已报修',
        //desc: '描述信息',
      },
      {
        text: '维修到达',
        //desc: '描述信息',
      },
      {
        text: '维修完成',
        //desc: '描述信息',
      },
      {
        text: '报修结案',
        //desc: '描述信息',
      },
    ],
    steps_info: [
      {
        text: '已报修',
        //desc: '描述信息',
      },
      {
        text: '维修到达',
        //desc: '描述信息',
      },
      {
        text: '维修完成',
        //desc: '描述信息',
      },
      {
        text: '报修结案',
        //desc: '描述信息',
      },
    ],
    steps_repair: [
      {
        text: '已报修',
        //desc: '描述信息',
      },
      {
        text: '维修到达',
        //desc: '描述信息',
      },
      {
        text: '维修完成',
        //desc: '描述信息',
      },
      {
        text: '维修验收',
        //desc: '描述信息',
      },
    ],
    steps_audit: [
      {
        text: '维修验收',
        //desc: '描述信息',
      },
      {
        text: '责任回复',
        //desc: '描述信息',
      },
      {
        text: '课长审核',
        //desc: '描述信息',
      },
      {
        text: '经理审核',
        //desc: '描述信息',
      },
      {
        text: '维修结案',
        //desc: '描述信息',
      },
    ],

    repairStepActive: '-1',

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

  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.data.images = images.length <= 3 ? images : images.slice(0, 3) 
        $digest(this)
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },


  // 删除图片
  clearImg:function(e){
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据
    
    for (let i = 0; i < uploaderList.length;i++){
        if (i == e.currentTarget.dataset.index){
            continue;
        }else{
            nowList.push(uploaderList[i])
        }
    }
    this.setData({
        uploaderNum: this.data.uploaderNum - 1,
        uploaderList: nowList,
        showUpload: true
    })
},
//展示图片
showImg:function(e){
    var that=this;
    wx.previewImage({
        urls: that.data.uploaderList,
        current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
},
//上传图片
upload: function(e) {
    var that = this;
    //console.log("upload Test");
    wx.chooseImage({
        count: 3 - that.data.uploaderNum, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
            //console.log(res)
            //console.log(that.data.uploaderNum);
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            let tempFilePaths = res.tempFilePaths;
            let uploaderList = that.data.uploaderList.concat(tempFilePaths);
            if (uploaderList.length==3){
                that.setData({
                    showUpload:false
                })
            }
            //console.log(uploaderList);
            that.setData({
                uploaderList: uploaderList,
                uploaderNum: uploaderList.length,
            })
        }
    })
},


  /**
   * 设备编号单元格点击事件
   */
  onEqpSelectorTap: function(){
    this.setData({
      show:{
        eqpSelectorPopup: true
      }
    });
  },

  /**
   * 设备信息选择弹窗关闭事件
   */
  closeEqpSelectorPopup: function(){
    //console.log("eqpListClose!");
    this.setData({
      show:{
        eqpSelectorPopup: false
      }
    });
  },

  onEqpSelBackClick: function(){
    this.closeEqpSelectorPopup();
    this.setData({
      orderList: [],
      eqpListScrollTop:0,
      });
    eqpListDta = null;
  },

  onEqpSelResetClick(){
    this.setData({
      orderList: [],
      eqpListScrollTop:0,
      });
  },

  pullDownTest(){
    //console.log("test");
    this.setData({
      refreshTrigger: false
    });
  },

  loadMore() { // 触底加载更多
    //console.log("start load");
    if(canLoadNewData){
      canLoadNewData = false;
      //console.log("show eqpListLoading");
      
      let len = this.data.orderList.length;
      let newCount = 5;
      let lastItem = this.data.orderList[len - 1];
      let _this = this;

      if(len + newCount > eqpListDta.length)
      {
        newCount = eqpListDta.length - len;
      }

      if(newCount < 1){
        //console.log("no more dta");
        return;
      }

      this.setData({
        eqpListLoading: true,
      });

      for(var i = 0;i < newCount; i++){
        let newItem = { shop: "A119-01", shopurl: "/images/1.jpg", origin: "TaoBao", orderstate: "", pictureurl: "/images/1.jpg", couponname: "品名", orderdtt: "副齿轮检验轴AA-2600I", productcount: 1, ordernum: "202054654654466", type: "维修", payamount: "技术员" };
        let index = len + i;
        newItem.shop = eqpListDta[index].assetItem.itemno;
        newItem.orderdtt = eqpListDta[index].assetDesc;
        newItem.productcount = eqpListDta[index].qty;
        newItem.ordernum = eqpListDta[index].formid;
        newItem.payamount = eqpListDta[index].username;
        this.data.orderList.push(newItem);
      }



      //console.log("start set time out");

      setTimeout(function(){
        _this.setData({
          orderList: _this.data.orderList,
          eqpListLoading: false
        });
        canLoadNewData = true;
        //console.log("start load more data");
       }, 2000);
    }
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

    onEqpSearchStart:function(e){
        
      let res = e.detail;
      canLoadNewData = true;
      this.setData({
        orderList:[]
      });
      this.getAssetListInfo(res);
    },


    getAssetListInfo: function (res) {
      var _this = this;
      // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest/getAssetCardList';
      //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
      // if (options.employeeid) {
      //     restUrl += '/f;users.id=' + options.employeeid + '/s';
      // }
      // else {
      //     restUrl += '/f/s';
      // }
      //restUrl += '/f;deptno=' + '13000' + '/s';
      restUrl += '/f;formid=' + res + '/s';
      restUrl += '/' + 0 + '/' + 20;
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
          //console.log(res);
          if(res.data == "" || res.statusCode != 200){
            //console.log("no Data");
            wx.hideLoading();
            return;
          }
          eqpListDta = res.data;

          var dataLen = res.data.length;
          if(dataLen > 10){
            dataLen = 10;
          }

          for(var i = 0;i < dataLen; i++){
            let newItem = { shop: "A119-01", shopurl: "/images/1.jpg", origin: "TaoBao", orderstate: "", pictureurl: "/images/1.jpg", couponname: "品名", orderdtt: "副齿轮检验轴AA-2600I", productcount: 1, ordernum: "202054654654466", type: "维修", payamount: "技术员" };
            newItem.shop = eqpListDta[i].assetItem.itemno;
            newItem.orderdtt = eqpListDta[i].assetDesc;
            newItem.productcount = eqpListDta[i].qty;
            newItem.ordernum = eqpListDta[i].formid;
            newItem.payamount = eqpListDta[i].username;
            _this.data.orderList.push(newItem);
          }

          _this.setData({
            orderList: _this.data.orderList
          });


          // _this.setData({
          //   itdsc: res.data.assetDesc,
          //   username: res.data.username,
          //   depInfo: res.data.deptno + '-' + res.data.deptname,
          //   qty: res.data.qty,
          //   userno: res.data.userno,
          //   itnbr: res.data.assetItem.itemno,
          //   deptno: res.data.deptno,
          //   deptname: res.data.deptname,
          //   address: res.data.position1.name + '-' + res.data.position2.name,
          //   show:{queryInfo:false}
          // });
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

    eqpCardSelect:function(e){
      var eqpIndex = 0;
      if(e.currentTarget.id.split('_').length > 1){
        eqpIndex = e.currentTarget.id.split('_')[1];
      }
      this.setData({
        //repairUserName: eqpListDta[eqpIndex].username,
        assetno: eqpListDta[eqpIndex].formid,
        itemdsc: eqpListDta[eqpIndex].assetDesc,
        itemno: eqpListDta[eqpIndex].assetItem.itemno,
        assetCardId: eqpListDta[eqpIndex].id,
      });
      this.closeEqpSelectorPopup();
    },

    onTroubleCellTap:function(){
      this.showTroubleSelectorPopup();
    },

    /**
   * 故障来源选择弹出层开启
   */
  showTroubleSelectorPopup: function(){
      this.setData({
        show:{troubleSelectorPopup:true}
      });
  },

  /**
   * 故障来源选择弹出层关闭
   */
  closeTroubleSelectorPopup: function(){
    this.setData({
      show:{troubleSelectorPopup:false}
    });
  },

  /**
   * 故障来源选择器事件
   */
  onTroublePickerChange: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      troubleFrom: value
    });
  },

  onTroublePickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      troubleFrom: value
    });
    this.closeTroubleSelectorPopup();
  },

  onTroublePickerCancel: function(event){
    this.closeTroubleSelectorPopup();
  },

  handleContentInput:function(e){
    this.setData({
      troubleDetailInfo: e.detail.value
    });
  },

  onFormDateCellTap:function(){
    this.openDateFilterPopup();
  },

  openDateFilterPopup:function(){
    this.setData({
      show: {dateFilterPopup: true}
    });
  },

  closeDateFilterPopup: function(){
    this.setData({
      show: {dateFilterPopup: false}
    });
  },

  onDateFilterCancel: function(){
    this.setData({
      show:{dateFilterPopup : false},
      //currentDate: dateTemp.getTime(),
    });
  },

  onDateFilterConfirm: function(){
    this.setData({
      show:{dateFilterPopup : false},
    });
  },

  onDateFilterInput(event){
    //console.log(event);
    // let dateTemp = this.dateFormatForFilter(event.detail);
    // this.setData({
    //   formdate: dateTemp,
    //   formdateTS: event.detail,
    // });
  },

  onDeleteBtnClick: function(){

    var _this = this;
    Dialog.confirm({
      mask: false,
      title: '系统提示',
      message: '确认作废吗?',
      zIndex: 1000,
    })
      .then(() => {

        //console.log(_this.data);

        // on confirm
        wx.showLoading({
          title: 'Sending',
          mask: true
        });
        wx.request({
          url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/deleteRepairDoc?' + app.globalData.restAuth,
          //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
          data: {
            company: "C",
            formid: _this.data.docFormidId,
            id: _this.data.docId,
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            wx.hideLoading();
            var resMsg = '';
            //console.log(res);
            if(res.statusCode == 200 && res.data.msg != null){
              resMsg = '作废成功';
            }
            else{
              resMsg = '作废失败';
            }
            //console.log("update status success!");
            Dialog.alert({
            title: '系统消息',
            zIndex: 1000,
            mask:false,
            message: resMsg,
              }).then(() => {
               // on close
               //initProInfo(_this);
               wx.navigateBack();
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
      });
  },

  onCheckBtnClick: function(){

    var _this = this;
    Dialog.confirm({
      mask: false,
      title: '系统提示',
      message: '确认提交吗?',
      zIndex: 1000,
    })
      .then(() => {

        //console.log(_this.data);

        // on confirm
        wx.showLoading({
          title: 'Sending',
          mask: true
        });
        wx.request({
          url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/serviceStart?' + app.globalData.restAuth,
          //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
          data: {
            company: "C",
            formid: _this.data.docFormidId,
            id: _this.data.docId,
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            wx.hideLoading();
            var resMsg = '';
            //console.log(res);
            if(res.statusCode == 200 && res.data.msg != null){
              resMsg = '提交成功';
            }
            else{
              resMsg = '提交失败';
            }
            //console.log("update status success!");
            Dialog.alert({
            title: '系统消息',
            zIndex: 1000,
            mask:false,
            message: resMsg,
              }).then(() => {
               // on close
               //initProInfo(_this);
               wx.navigateBack();
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
  },

  onFinishBtnClick: function(e){
    let that = this;
    //console.log(this.data.uploaderList);
    const FileSystemManager = wx.getFileSystemManager();
    //console.log(this.data);
    //var canSubmit = this.checkFormDtaBeforeSubmit();
    var canSubmit = true;
    var errmsg = '';
    if (!app.globalData.authorized) {
      canSubmit = false;
      errmsg += '账号未授权\r\n';
    }
    if (canSubmit) {
      Dialog.confirm({
        title: '系统提示',
        message: '确认提交吗?',
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
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/repairFinish?' + app.globalData.restAuth,
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              id: that.data.docId,
              formid: that.data.docFormid,
              company: app.globalData.defaultCompany,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              wx.hideLoading();
              var resMsg = '';
              //console.log(res);
              if(res.statusCode == 200 && res.data.msg != null){
                resMsg = '提交成功';
              }
              else{
                resMsg = '提交失败';
              }
              Dialog.alert({
                title: '系统消息',
                zIndex: 1000,
                mask:false,
                message: resMsg,
                  }).then(() => {
                   // on close
                   //initProInfo(_this);
                   wx.navigateBack({delta: 1});
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
  onDetailBtnClick: function(e){
    let that = this;
    //console.log(e);
    var eqpInfo = { formId: that.data.docFormidId,displayType: "品名", assetDesc: that.data.itemdsc, productcount: 1, assetFormId: that.data.assetno, repairUserName: that.data.repairUserName,creDate: that.data.formdate,serviceUserName: that.data.serviceusername,serviceArriveTime:that.data.serviceArriveTime,completeTime:that.data.completeTime,contactTime:that.data.contactTime,repairTime:that.data.repairTime,repairTimestamp:that.data.repairTimestamp,downTime:that.data.downTime,downTimestamp: that.data.downTimestamp};
    var eqpInfoObj = JSON.stringify(eqpInfo);
    wx.navigateTo({
      url: '../eqpManagement/eqpRepairDetailCheck?eqpInfo=' + eqpInfoObj + '&docFormid=' + that.data.docFormidId + '&docId=' + that.data.docId
    });
  },

  onAuditBtnClick: function(e){
    let that = this;
    //console.log(e);
    var eqpInfo = { formId: that.data.docFormidId,displayType: "品名", assetDesc: that.data.itemdsc, productcount: 1, assetFormId: that.data.assetno, repairUserName: that.data.repairUserName,creDate: that.data.formdate,serviceUserName: that.data.serviceusername,serviceArriveTime:that.data.serviceArriveTime,completeTime:that.data.completeTime,contactTime:that.data.contactTime,repairTime:that.data.repairTime,repairTimestamp:that.data.repairTimestamp,downTime:that.data.downTime,downTimestamp: that.data.downTimestamp};
    var eqpInfoObj = JSON.stringify(eqpInfo);
    wx.navigateTo({
      url: '../eqpManagement/eqpRepairAuditCheck?eqpInfo=' + eqpInfoObj + '&docFormid=' + that.data.docFormidId + '&docId=' + that.data.docId
    });
  },

  onApproveBtnClick: function(e){
    let that = this;
    //console.log(e);
    var eqpInfo = { formId: that.data.docFormidId,displayType: "品名", assetDesc: that.data.itemdsc, productcount: 1, assetFormId: that.data.assetno, repairUserName: that.data.repairUserName,creDate: that.data.formdate,serviceUserName: that.data.serviceusername,serviceArriveTime:that.data.serviceArriveTime,completeTime:that.data.completeTime,contactTime:that.data.contactTime,repairTime:that.data.repairTime,repairTimestamp:that.data.repairTimestamp,downTime:that.data.downTime,downTimestamp: that.data.downTimestamp};
    var eqpInfoObj = JSON.stringify(eqpInfo);
    wx.navigateTo({
      url: '../eqpManagement/eqpRepairApprove?eqpInfo=' + eqpInfoObj + '&docFormid=' + that.data.docFormidId + '&docId=' + that.data.docId
    });
  },

  onDutyResBtnClick: function(e){
    let that = this;
    var eqpInfo = { formId: that.data.docFormidId,displayType: "品名", assetDesc: that.data.itemdsc, productcount: 1, assetFormId: that.data.assetno, repairUserName: that.data.repairUserName,creDate: that.data.formdate,serviceUserName: that.data.serviceusername,serviceArriveTime:that.data.serviceArriveTime,completeTime:that.data.completeTime,contactTime:that.data.contactTime,repairTime:that.data.repairTime,repairTimestamp:that.data.repairTimestamp};
    var eqpInfoObj = JSON.stringify(eqpInfo);
    wx.navigateTo({
      url: '../eqpManagement/eqpRepairDutyResponse?eqpInfo=' + eqpInfoObj + '&docFormid=' + that.data.docFormidId + '&docId=' + that.data.docId + '&downTime=' + that.data.downTime
    });
  },

  onStopBtnClick: function(e){
    let that = this;
    //console.log(e);
    var eqpInfo = { formId: that.data.docFormidId,displayType: "品名", assetDesc: that.data.itemdsc, productcount: 1, assetFormId: that.data.assetno, repairUserName: that.data.repairUserName,creDate: that.data.formdate,serviceUserName: that.data.serviceusername,serviceArriveTime:that.data.serviceArriveTime,completeTime:that.data.completeTime,contactTime:that.data.contactTime,repairTime:that.data.repairTime,repairTimestamp:that.data.repairTimestamp };
    var eqpInfoObj = JSON.stringify(eqpInfo);
    wx.navigateTo({
      url: '../eqpManagement/eqpRepairStop?eqpInfo=' + eqpInfoObj + '&docFormid=' + that.data.docFormidId + '&docId=' + that.data.docId
    });
  },

  onStartBtnClick: function(e){
    let that = this;
    //console.log(this.data.uploaderList);
    const FileSystemManager = wx.getFileSystemManager();
    //console.log(this.data);
    //var canSubmit = this.checkFormDtaBeforeSubmit();
    var canSubmit = true;
    var errmsg = '';
    if (!app.globalData.authorized) {
      canSubmit = false;
      errmsg += '账号未授权\r\n';
    }
    if (canSubmit) {
      Dialog.confirm({
        title: '系统提示',
        message: '确认开始吗?',
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
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/repairStart?' + app.globalData.restAuth,
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              id: that.data.docId,
              pid: that.data.docFormidId,
              company: app.globalData.defaultCompany,
              userno:app.globalData.employeeId,
              contenct:"开始维修",
              note:"解除暂停,开始维修",
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
                resMsg = '提交成功';
              }
              else{
                resMsg = '提交失败';
              }
              Dialog.alert({
                title: '系统消息',
                zIndex: 1000,
                mask:false,
                message: resMsg,
                  }).then(() => {
                   // on close
                   //initProInfo(_this);
                   wx.navigateBack({delta: 1});
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
                content: "网络异常请重试:" + fail,
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

  onChangeServiceUserBtnClick: function(e){
    let that = this;
    //console.log(e);
    var eqpInfo = { formId: that.data.docFormidId,displayType: "品名", assetDesc: that.data.itemdsc, productcount: 1, assetFormId: that.data.assetno, repairUserName: that.data.repairUserName,creDate: that.data.formdate,serviceUserName: that.data.serviceusername};
    var eqpInfoObj = JSON.stringify(eqpInfo);
    wx.navigateTo({
      url: '../eqpManagement/eqpRepairChangeServiceUser?eqpInfo=' + eqpInfoObj + '&docFormid=' + that.data.docFormidId + '&docId=' + that.data.docId
    });
  },

  eqpRepairFormSubmit: function(e){
    var that = this;
    //console.log(this.data.uploaderList);
    const FileSystemManager = wx.getFileSystemManager();
    //console.log(this.data);
    //var canSubmit = this.checkFormDtaBeforeSubmit();
    var canSubmit = true;
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

          //console.log(that.data);

          // on confirm
          wx.showLoading({
            title: 'Sending',
            mask: true
          });
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/createEqpRepairHad?' + app.globalData.restAuth + '&itemno=' + that.data.itemno + "&assetCardId=" + that.data.assetCardId,
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              company: "C",
              assetno: that.data.assetno,
              //itemno: that.data.itemno,
              repairuser: app.globalData.employeeId,
              repairusername: app.globalData.employeeName,
              formdate: new Date(that.data.formdateTS),
              troublefrom: that.data.troubleFrom,
              serviceusername: that.data.serviceusername,
              serviceuser: that.data.serviceuser,
              creator: app.globalData.employeeId,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              //wx.hideLoading();
              var resMsg = '';
              //console.log(res);
              if(res.statusCode == 200 && res.data.msg != null){
                //resMsg = '提交成功';
                that.setData({
                  docFormidId: res.data.msg
                });
                that.fileUpLoadByQueue(FileSystemManager,0);
              }
              else{
                resMsg = '提交失败';
              }
              // Dialog.alert({
              //   title: '系统消息',
              //   message: resMsg,
              // }).then(() => {
              //   // on close
              //   initProInfo(that);
              // });
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

  fileUpLoadByQueue:function(FileSystemManager,imageListIndex){
    if(imageListIndex == this.data.uploaderList.length){
      wx.hideLoading();
      return ;
    }


    //console.log("now uploading the [" + imageListIndex + "] image");

    wx.showLoading({
      title: "图片[" + imageListIndex + "]上传中...",
      mask: true
    });

    let _this = this;
    var imagePathTemp = _this.data.uploaderList[imageListIndex].split('.');

    var imageType = imagePathTemp[imagePathTemp.length - 1];

    //console.log("image Type: " + imageType);

    FileSystemManager.readFile({ //读文件
      //filePath: wx.env.USER_DATA_PATH + "/" + fileName,
      filePath: _this.data.uploaderList[imageListIndex],
      //encoding: 'utf8',
      encoding: 'base64',
      success(res) {
        if (res.data) {
          //let obj = JSON.parse(res.data);
          //resolve(obj)
          //console.log(res);
          var obj = res.data;

          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/uploadEqpRepairPic',
            method: 'POST',
            data: {
              company: 'C',
              pid: _this.data.docFormidId,
              fileIndex: imageListIndex + 1,
              fileDta: obj,
              fileType: imageType,
              fileMark: _this.data.troubleDetailInfo,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success (res) {
              //console.log(res.data);
              if(imageListIndex < _this.data.uploaderList.length - 1){
                imageListIndex ++;
                _this.fileUpLoadByQueue(FileSystemManager,imageListIndex);
              }
              else{
                  //console.log("all image upload success!");
                  wx.hideLoading();
                  Dialog.alert({
                  title: '系统消息',
                  message: "提交成功",
                  }).then(() => {
                    // on close
                      initProInfo(_this);
                      wx.navigateBack();
                  });

              }
            }
          })

        }
      },
      fail(err) {
        console.log('读取失败', err)
        //reject(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // if(app.globalData.defaultDeptId.indexOf("13") > -1){
    //   that.data.showBtn.deleteBtn = true;
    //   that.data.showBtn.arrivalCheckBtn = true;
    //   that.data.showBtn.finishCheckBtn = true;
    // }

    this.setData({
      docFormidId:options.docFormidId,
      showBtn:that.data.showBtn
    })
    //console.log(this.data.docFormidId);
    // let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;
    //console.log("eqpRepairDocDetailOpen");
    let heightTemp = app.globalData.windowHeight - 100;
    dateTemp = new Date();

    this.getRepairDocInfo(app.globalData.employeeId,this.data.docFormidId);
    this.getRepairDocImageInfo(this.data.docFormidId);

    //写你自己的接口
    // this.setData({
    //   orderList: [],
    //   minDate: new Date(dateTemp.getFullYear() -1 ,dateTemp.getMonth(), 1).getTime(),
    //   maxDate: dateTemp.getTime(),
    //   currentDate: dateTemp.getTime(),
    //   //repairuser: app.globalData.employeeId,
    //   //repairUserName: app.globalData.employeeName,
    //   //troubleFrom: this.data.troubleTypeCol[0],
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log(this.data.docFormidId);
    //console.log('get gloDta');
    //console.log(app.globalData);
    // this.getRepairDocInfo(app.globalData.employeeId,this.data.docFormidId);
    // this.getRepairDocImageInfo(this.data.docFormidId);
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

    /**
   * 扫barcode
   */
  startScanCode: function () {
    //console.log('test scan code');
    var that = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        //console.log(res);
        that.scanCodeCallBack(res.result);
        //that.scanCodeCallBack('SA607-01-12-0288');
      }
    });
    //that.getAssetInfo();
    //that.insertAssetInfo();
  },

  scanCodeCallBack: function (res) {
    this.setData({
      barCodeId: res,
    });
    this.getAssetInfo(res);
  },

  getRepairDocInfo: function (userId,formid) {
    var _this = this;
    // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairDocInfo';
    //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
    // if (options.employeeid) {
    //     restUrl += '/f;users.id=' + options.employeeid + '/s';
    // }
    // else {
    //     restUrl += '/f/s';
    // }
    //restUrl += '/f;deptno=' + '13000' + '/s';
    //restUrl += '/f;repairuser=' + userId + ';';
    restUrl += '/f;formid=' + formid + ';userId=' + userId + '/s';
    restUrl += '/' + 0 + '/' + 20;
    //console.log(restUrl);
    wx.showLoading({
      title: '获取中...',
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

        repairDocDta = null;
        var repairManagerInfo = null;

        if(res.data == "" || res.statusCode != 200){
          //console.log("no Data");
          wx.hideLoading();
          return;
        }

        var dataLen = res.data.length;
        if(dataLen > 4){
          //console.log("data Error");
          wx.hideLoading();
          return;
        }

        repairDocDta = res.data[0];
        repairManagerInfo = res.data[1];
        repairUserInfo = null;
        serviceUserInfo = null;
        if(res.data.length > 2){
          repairUserInfo = res.data[2];
        }
        if(res.data.length > 3){
          serviceUserInfo = res.data[3];
        }
        var stepCode = null;

        //隐藏或显示按钮
        if(repairDocDta.rstatus <= "40"){
          _this.data.steps = _this.data.steps_repair;
        }
        else{
          _this.data.steps = _this.data.steps_audit;
        }
        if(repairDocDta.rstatus == "10"){
          stepCode = 0;
        }
        if(repairDocDta.rstatus >= "20" && repairDocDta.rstatus < "30"){
          stepCode = 1;
        }
        if(repairDocDta.rstatus == "30"){
          stepCode = 2;
        }
        if(repairDocDta.rstatus == '40'){
          stepCode = 3;
        }
        if(repairDocDta.rstatus == '50'){
          stepCode = 1;
        }
        if(repairDocDta.rstatus == '60'){
          stepCode = 2;
        }
        if(repairDocDta.rstatus == '70'){
          stepCode = 3;
        }

        _this.data.showBtn.detailCheckBtn = true;

        if(app.globalData.defaultDeptId.indexOf(repairDocDta.repairdeptno.substring(0,3)) >= 0){
          _this.data.steps = _this.data.steps_info;
          if(repairDocDta.rstatus == "10"){
            _this.data.showBtn.deleteBtn = true;
            _this.data.showBtn.arrivalCheckBtn = true;
            stepCode = 0;
          }
          if(repairDocDta.rstatus >= "20" && repairDocDta.rstatus < "30" && repairDocDta.rstatus != "28"){
            _this.data.showBtn.deleteBtn = true;
            _this.data.showBtn.finishCheckBtn = true;
            stepCode = 1;
          }
          if(repairDocDta.rstatus == "28"){
            _this.data.showBtn.deleteBtn = true;
            _this.data.showBtn.finishCheckBtn = true;
            _this.data.disableBtn.finishCheckBtn = true;
            stepCode = 1;
            _this.data.steps[stepCode].text = "暂停维修"
          }
          if(repairDocDta.rstatus >= "30"){
            _this.data.showBtn.detailCheckBtn = true;
            stepCode = 2;
          }
          if(repairDocDta.rstatus == "95"){
            _this.data.showBtn.detailCheckBtn = true;
            stepCode = 3;
          }
        }

        if(repairDocDta.hitchdutyuser == app.globalData.employeeId){
          _this.data.steps = _this.data.steps_audit;
          if(repairDocDta.rstatus == "50"){
            _this.data.showBtn.responseDutyBtn = true;
            stepCode = 1;
          }
        }


        if(repairDocDta.serviceuser == app.globalData.employeeId && repairDocDta.repairmethodtype != "2"){
          if(repairDocDta.rstatus <= "40"){
            _this.data.steps = _this.data.steps_repair;
          }
          else{
            _this.data.steps = _this.data.steps_audit;
          }
          if(repairDocDta.rstatus == "10"){
            _this.data.showBtn.deleteBtn = true;
            _this.data.showBtn.changeServiceUserBtn = true;
            stepCode = 0;
          }
          if(repairDocDta.rstatus >= "20" && repairDocDta.rstatus < "30" && repairDocDta.rstatus != "28"){
            _this.data.showBtn.saveRepairInfoBtn = true;
            _this.data.showBtn.stopRepairBtn = true;
            stepCode = 1;
          }
          if(repairDocDta.rstatus == "28"){
            _this.data.showBtn.saveRepairInfoBtn = true;
            _this.data.showBtn.startRepairBtn = true;
            _this.data.disableBtn.saveRepairInfoBtn = true;
            stepCode = 1;
            _this.data.steps[stepCode].text = "暂停维修"
          }
          if(repairDocDta.rstatus == "30"){
            _this.data.showBtn.startAuditBtn = true;
            stepCode = 2;
          }
          if(repairDocDta.rstatus == '40'){
            _this.data.showBtn.startAuditBtn = true;
            stepCode = 3;
          }
          if(repairDocDta.rstatus == '50'){
            _this.data.showBtn.detailCheckBtn = true;
            stepCode = 1;
          }
          if(repairDocDta.rstatus == '60'){
            _this.data.showBtn.detailCheckBtn = true;
            stepCode = 2;
          }
          if(repairDocDta.rstatus == '70'){
            _this.data.showBtn.detailCheckBtn = true;
            stepCode = 3;
          }
          if(repairDocDta.rstatus == '95'){
            _this.data.showBtn.detailCheckBtn = true;
            stepCode = 4;
          }
        }
        else if(repairDocDta.serviceuser == app.globalData.employeeId && repairDocDta.repairmethodtype == "2"){
          if(repairDocDta.rstatus >= "20" && repairDocDta.rstatus < "30" && repairDocDta.rstatus != "28"){
            _this.data.showBtn.saveRepairInfoBtn = true;
            _this.data.showBtn.stopRepairBtn = true;
            stepCode = 1;
          }
          if(repairDocDta.rstatus == "28"){
            _this.data.showBtn.saveRepairInfoBtn = true;
            _this.data.showBtn.startRepairBtn = true;
            _this.data.disableBtn.saveRepairInfoBtn = true;
            stepCode = 1;
            _this.data.steps[stepCode].text = "暂停维修"
          }
        }

        if(app.globalData.defaultDeptId == "1W300" || app.globalData.defaultDeptId == "13130"){
          if(repairDocDta.rstatus == "60"){
            _this.data.showBtn.approveAuditBtn = true;
          }
        }

        if(app.globalData.employeeId == repairManagerInfo.cvalue){
          if(repairDocDta.rstatus == "70"){
            _this.data.showBtn.examAuditBtn = true;
          }
        }

        if(repairDocDta.rstatus == "95"){
          _this.data.steps = _this.data.steps_info;
          _this.data.showBtn.detailCheckBtn = true;
          stepCode = 3;
        }

        if(repairUserInfo != null){
          _this.data.repairUserMobile = repairUserInfo.phone;
        }

        if(serviceUserInfo != null){
          _this.data.serviceuserMobile = serviceUserInfo.phone;
        }

        var formDate_bj = eamUtil.utcInit(repairDocDta.hitchtime);
        var creDateTemp = new Date(formDate_bj);
        var arrivalDate_bj = null;
        var completeDate_bj = null;
        if(repairDocDta.servicearrivetime != null){
          arrivalDate_bj = eamUtil.utcInit(repairDocDta.servicearrivetime);
          var arrivalDateTemp = new Date(arrivalDate_bj);
          _this.data.contactTime = _this.timestampInit(arrivalDateTemp-creDateTemp);

          if(repairDocDta.completetime != null){
            completeDate_bj = eamUtil.utcInit(repairDocDta.completetime);
            var completeDataTemp = new Date(completeDate_bj);
            _this.data.repairTime = _this.timestampInit(completeDataTemp - arrivalDateTemp);
            _this.data.repairTimestamp = completeDataTemp-arrivalDateTemp;

            if(repairDocDta.excepttime != null){
              _this.data.downTime = _this.timestampInit(completeDataTemp - creDateTemp - repairDocDta.excepttime * 60000);
            }
            else{
              _this.data.downTime = _this.timestampInit(completeDataTemp - creDateTemp);
            }
            _this.data.downTimestamp = completeDataTemp-creDateTemp;

          }
        }

        _this.setData({
          //docFormidId: repairDocDta.formid,
          docId: repairDocDta.id,
          repairuser: repairDocDta.repairuser,
          repairUserName: repairDocDta.repairusername,
          repairUserMobile: _this.data.repairUserMobile,
          assetno: repairDocDta.assetno == null ? '无' : repairDocDta.assetno.formid,
          itemdsc: repairDocDta.assetno == null ? '其他设备' : repairDocDta.assetno.assetDesc,
          itemno: repairDocDta.itemno,
          troubleFrom: repairDocDta.troublefrom,
          troubleDetailInfo: repairDocDta.hitchdesc,
          formdate: formDate_bj,
          serviceArriveTime: arrivalDate_bj,
          completeTime: completeDate_bj,
          //formdateTS: null,
          serviceuser: repairDocDta.serviceuser,
          serviceusername: repairDocDta.serviceusername,
          serviceuserMobile: _this.data.serviceuserMobile,
          repairStepActive: stepCode,
          disableBtn: _this.data.disableBtn,
          showBtn: _this.data.showBtn,
          steps: _this.data.steps,
          contactTime: _this.data.contactTime,
          repairTime : _this.data.repairTime,
          assetPosition: repairDocDta.assetno == null ? repairDocDta.repairarea : repairDocDta.assetno.position1.name + repairDocDta.assetno.position2.name,
          hitchUrgency: repairDocDta.hitchurgency != null ? repairDocDta.hitchurgency : '',
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
  },

  timestampInit:function(timestampTemp){
    // let day = parseInt(timestampTemp/1000/3600/24);
    // let hours = parseInt(timestampTemp/1000/3600%24);
    // let minutes = parseInt((timestampTemp/1000/3600%24 - hours) * 60);

    let hours = (timestampTemp/1000/3600).toFixed(1);
    //let minutes = parseInt(timestampTemp/1000/60);

    return hours;
  },

  getRepairDocImageInfo: function (formid) {
    var _this = this;
    // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairDocImageList';
    //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
    // if (options.employeeid) {
    //     restUrl += '/f;users.id=' + options.employeeid + '/s';
    // }
    // else {
    //     restUrl += '/f/s';
    // }
    //restUrl += '/f;deptno=' + '13000' + '/s';
    restUrl += '/f;pid=' + formid + ';filefrom=报修图片' + '/s';
    restUrl += '/' + 0 + '/' + 20;
    restUrl = encodeURI(restUrl);
    //console.log(restUrl);
    wx.showLoading({
      title: '获取中...',
      mask: true
    });
    wx.request({
      url: restUrl,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json;charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        //console.log(res);

        if(res.data == "" || res.statusCode != 200){
          //console.log("no Data");
          wx.hideLoading();
          return;
        }

        var dataLen = res.data.length;
        var imagePathArray = [];
        for(var i = 0;i < dataLen;i++){
          var pathArray = res.data[i].filepath.split("/");
          imagePathArray = imagePathArray.concat([app.globalData.restAdd + ":443/Hanbell-EAM/resources/app/res/" + pathArray.pop()]);
        }

        //console.log(imagePathArray);

        _this.setData({
          uploaderList:imagePathArray,
          troubleDetailInfo:res.data[0].filemark
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
  },

  checkFormDtaBeforeSubmit: function(){

    if(this.data.assetno == null){
      Dialog.alert({
        title: '系统消息',
        message: "请选择需要维修的设备",
        }).then(() => {
        });
      return false;
    }
    if(this.data.troubleFrom == null || this.data.formdateTS == null || this.data.serviceuser == null || this.data.troubleDetailInfo == null ){
      Dialog.alert({
        title: '系统消息',
        message: "请将信息填写完整",
        }).then(() => {
        });
      return false;
    }
  
    return true;
  },

  getRepairStepCode: function(rstatus){
    switch(rstatus) {
      case "10":
         return 0;
      case "20":
         return 1;
      case "30":
      case "40":
      case "50":
         return 2;
      case "95":
         return 3;
      default:
         return -1;
    } 
  },

  getAuditStepCode: function(rstatus){
    switch(rstatus) {
      case "30":
         return 0;
      case "40":
         return 1;
      case "50":
         return 2;
      case "95":
         return 3;
      default:
         return -1;
    } 
  },

  mobileIconClick:function(res){
    var mobile = this.data[res.currentTarget.dataset.mobile];
    if(mobile != null){
      Dialog.confirm({
        title: '系统提示',
        message: '将拨打:' + mobile,
        mask: false,
        zIndex: 1000,
      })
      .then(() => {
        wx.makePhoneCall({
          phoneNumber: mobile
        });
      })
      .catch(() => {
        // on cancel
      });
    }
    else{
      Dialog.alert({
        title: '系统消息',
        message: "无号码信息",
        zIndex:1000,
      });
    }
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
