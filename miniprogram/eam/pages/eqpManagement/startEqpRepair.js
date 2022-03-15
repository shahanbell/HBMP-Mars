// miniprogram/pages/eqpManagement/startEqpRepair.js
import Dialog from '../../../component/vant/dialog/dialog';
var util = require("../../../utils/eamCommonUtils.js");
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


var suppleFirstInit = true;
var endVal = null;
var app = getApp();
var startVal = null;
var canLoadNewData = true;
var eqpListDta = null;
var serviceUserDta = null;
var autonoRepairUserDta = null;
var troubleReasonDta = null;
var hitchUrgencyDta = null;
var repairAreaDta = null;
var dateTemp = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    searchBarDta:'',
    isShow:'none',
    showExSearchOverlay: false,
    eqpIntoViewTest: null,
    eqpListScrollTop: 0,
    eqpListHeight: null,
    nodataType: 7,
    orderList: [],    //订单列表数据，接口获取
    serviceUserList:[{userId:null,userName:'请选择',userInfo:'请选择'}], 
    repairServiceUserList:[{userId:null,userName:'请选择',userInfo:'请选择'}], 
    autonoServiceUserList:[{userId:null,userName:'请选择',userInfo:'请选择'}], 
    troubleReasonList:[],
    hitchUrgencyList:[{hitchUrgencyDesc:'请选择',hitchUrgencyId:'-1'}],
    repairAreaList:[{repairAreaDesc:'请选择',repairAreaValue:'-1'}],
    repairMethodList:[{repairMethodDesc:'维修课维修',repairMethodValue:'1'},
                      {repairMethodDesc:'现场自主维修',repairMethodValue:'2'},
                      {repairMethodDesc:'委外维修',repairMethodValue:'3'}],
    needSpareList:[{needSpareDesc:'请选择',needSpareValue:'-1'},
                      {needSpareDesc:'领用',needSpareValue:'Y'},
                      {needSpareDesc:'不领用',needSpareValue:'N'}],
    searchItemList:[{itemSelected:false,searchItemName:'formid',searchItemDesc:'编号',searchItemValue:''},
                    {itemSelected:false,searchItemName:'assetSpec',searchItemDesc:'规格',searchItemValue:''},
                    {itemSelected:false,searchItemName:'otherEqp',searchItemDesc:'其它设备',searchItemValue:''}],
    refreshTrigger: false,
    currentTab: 0,     //当前显示tab的下标
    navTab: ['全部', '处理中', '已完成'],
    navTabPro: [{value:'全部',showScrollBar:true}, {value:'处理中',showScrollBar:false}, {value:'已完成',showScrollBar:false}],
    images: [],
    uploaderList: [],
    uploaderNum:0,
    showUpload:true,
    troubleTypeCol: ['操作员点检','设备突发故障','维修员点检'],
    show:{
      eqpSelectorPopup: false,
      troubleSelectorPopup: false,
      serviceUserSelectorPopup:false,
      hitchUrgencySelectorPopup:false,
      repairMethodSelectorPopup:false,
      suppleStartDateSelectorPopup:false,
      suppleCompleteDateSelectorPopup: false,
      repairAreaSelectorPopup:false,
      needSpareSelectorPopup:false,
      dateFilterPopup: false,
      statusFilterPopup: false,
      dateSelector: false,
      queryInfo: false,
    },
    showTextArea:{
      troubleDetailInfo:false,
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

    docFormidId: null,
    repairuser: null,
    repairUserName: null,
    assetno: null,
    itemdsc: null,
    itemno: null,
    troubleFrom: null,
    troubleDesc: null,
    troubleDetailInfo: '',
    hitchUrgencyId:null,
    hitchUrgencyDesc:null,
    repairMethodObj:null,
    repairAreaObj:null,
    needSpareObj:{needSpareDesc:'请选择',needSpareValue:'-1'},
    formdate: null,
    formdateTS: null,
    suppleStartDateObj:{},
    suppleCompleteDateObj:{},
    assetCardId: null,
    serviceuser: 'TEST',
    serviceusername: 'CTEST',
    assetPosition:null,
    focusTroubleDetailField:'false',
    textareaDisabled:false,
    serviceuserPickerIndex: null,
    reRepairFlag: false,
    supplementFlag: false,
    activeNames: [],
    disableServiceUser: false,
    autonoRepairFlag: false,

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

  noop() {},

  onSupplementChangePro(event){
    var supplementFlag = true;
    if(event.detail.length == 0){
      supplementFlag = false;
    }
    this.setData({
      activeNames:event.detail,
      supplementFlag:supplementFlag,
      suppleStartDateObj: {},
      suppleCompleteDateObj: {},
    });
  },

  on2ndRepairChange(event){
    console.log(event);
    this.setData({
      reRepairFlag:event.detail
    });
  },

  onExSearchItemChange(event) {
    console.log(event);
    var itemName = "searchItemList[" + event.target.dataset.itemindex + "].itemSelected";
    this.setData({
      [itemName]:event.detail,
    });
  },

  toggle(event) {
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  onClickHide(e) {
    this.setData({ showExSearchOverlay: false });
  },

  onClickShow(e) {
    this.setData({ showExSearchOverlay: true });
  },

  bindServiceUserPickerChange(e) {
    const val = e.detail.value;
    console.log(e);
    this.setData({
      serviceusername: this.data.serviceUserList[val].userName,
      serviceuser: this.data.serviceUserList[val].userId,
    })
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
        showExSearchOverlay: false,
        orderList:[]
      });
      this.getAssetListInfo(res);
    },


    getAssetListInfo: function (res) {
      var _this = this;
      // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest/getAssetCardList';
      //var restUrl = app.globalData.restLocalAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairUserList';
      //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
      // if (options.employeeid) {
      //     restUrl += '/f;users.id=' + options.employeeid + '/s';
      // }
      // else {
      //     restUrl += '/f/s';
      // }
      //restUrl += '/f;deptno=' + '13000' + '/s';
      //restUrl += '/f;formid=' + '0005' + '/s';
      restUrl += '/f;';

      var exSearchArray = this.data.searchItemList;
      var otherEqpSelectFlag = false;
      for(var i = 0;i<exSearchArray.length;i++){
        if(exSearchArray[i].itemSelected){
          if(exSearchArray[i].searchItemDesc == '其它设备'){
            otherEqpSelectFlag = true;
            break;
          }
          restUrl += exSearchArray[i].searchItemName + '=' + exSearchArray[i].searchItemValue + ';';
        }
      }

      if(res.indexOf('其他') > -1 || res.indexOf('其它') > -1 || otherEqpSelectFlag){
        let otherItem = {id:"-1",assetDesc:"其它设备",formid:"无",assetItem:{itemno:'9'},repairuser:'',repairusername:'',username:'无',qty:'1',position1:{name:'无'},position2:{name:''}};
        eqpListDta = new Array(otherItem);
        let newItem = { shop: "A119-01", shopurl: "/images/1.jpg", origin: "TaoBao", orderstate: "", pictureurl: "/images/1.jpg", couponname: "品名", orderdtt: "副齿轮检验轴AA-2600I", productcount: 1, ordernum: "202054654654466", type: "维修", payamount: "技术员" };
        newItem.shop = eqpListDta[0].assetItem.itemno;
        newItem.orderdtt = eqpListDta[0].assetDesc;
        newItem.productcount = eqpListDta[0].qty;
        newItem.ordernum = eqpListDta[0].formid;
        newItem.payamount = eqpListDta[0].username;
        _this.data.orderList.push(newItem);


        _this.setData({
          orderList: _this.data.orderList
        });
        return;
      }

      //restUrl += '/s' + '/' + 0 + '/' + 20 + '?searchInfo=' + res + '&deptNo=1N240';
      restUrl += '/s' + '/' + 0 + '/' + 20 + '?searchInfo=' + res + '&deptCheckCode=' + app.globalData.defaultCompany + '_' + app.globalData.defaultDeptId;
      restUrl = encodeURI(restUrl);
      //console.log(restUrl);
      wx.showLoading({
        title: 'Sending',
        mask: true
      });
      wx.request({
        url: restUrl,
        data: {
          appid: app.globalData.restId,
          token: app.globalData.restToken,
          //searchInfo: res,
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          console.log(res);
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
      this.setEqpRepairArea(eqpListDta[eqpIndex].position2.position);
      this.setData({
        //repairUserName: eqpListDta[eqpIndex].username,
        assetno: eqpListDta[eqpIndex].formid,
        itemdsc: eqpListDta[eqpIndex].assetDesc,
        itemno: eqpListDta[eqpIndex].assetItem.itemno,
        serviceuser: eqpListDta[eqpIndex].repairuser == null ? this.data.serviceuser : eqpListDta[eqpIndex].repairuser,
        serviceusername: eqpListDta[eqpIndex].repairusername == null ? this.data.serviceusername : eqpListDta[eqpIndex].repairusername,
        assetCardId: eqpListDta[eqpIndex].id,
        assetPosition: eqpListDta[eqpIndex].position1.name + eqpListDta[eqpIndex].position2.name,

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
    //console.log(event);
    const { picker, value, index } = event.detail;
    this.setData({
      troubleFrom: value.troubleId,
      troubleDesc: value.troubleDesc,
    });
  },

  onTroublePickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      troubleFrom: value.troubleId,
      troubleDesc: value.troubleDesc,
    });
    this.closeTroubleSelectorPopup();
  },

  onTroublePickerCancel: function(event){
    this.closeTroubleSelectorPopup();
  },


  onHitchUrgencyCellTap:function(){
    this.showHitchUrgencySelectorPopup();
  },

  /**
 * 故障来源选择弹出层开启
 */
showHitchUrgencySelectorPopup: function(){
    this.setData({
      show:{hitchUrgencySelectorPopup:true}
    });
},

/**
 * 故障来源选择弹出层关闭
 */
closeHitchUrgencySelectorPopup: function(){
  this.setData({
    show:{hitchUrgencySelectorPopup:false}
  });
},

/**
 * 故障来源选择器事件
 */
onHitchUrgencyPickerChange: function(event){
  //console.log(event);
  const { picker, value, index } = event.detail;
  this.setData({
    hitchUrgencyId: value.hitchUrgencyId,
    hitchUrgencyDesc: value.hitchUrgencyDesc,
  });
},

onHitchUrgencyPickerConfirm: function(event){
  const { picker, value, index } = event.detail;
  this.setData({
    hitchUrgencyId: value.hitchUrgencyId,
    hitchUrgencyDesc: value.hitchUrgencyDesc,
  });
  this.closeHitchUrgencySelectorPopup();
},

onHitchUrgencyPickerCancel: function(event){
  this.closeHitchUrgencySelectorPopup();
},

  handleContentInput:function(e){
    this.setData({
      troubleDetailInfo: e.detail.value
    });
  },

  
  onServiceUserCellTap:function(){
    if(this.data.disableServiceUser){
      return;
    }
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
    let dateTemp = this.dateFormatForFilter(event.detail);
    this.setData({
      formdate: dateTemp,
      formdateTS: event.detail,
    });
  },

  eqpRepairFormSubmit: function(e){
    var that = this;
    //console.log(this.data.uploaderList);
    const FileSystemManager = wx.getFileSystemManager();
    var canSubmit = this.checkFormDtaBeforeSubmit();
    console.log(that.data);
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
          var startDateTemp = null;
          var completeDateTemp = null;
          if(that.data.supplementFlag){
            if(that.data.suppleStartDateObj != null && JSON.stringify(that.data.suppleStartDateObj) != '{}'){
              startDateTemp = new Date(that.data.suppleStartDateObj.dateTS);
            }
            if(that.data.suppleCompleteDateObj != null && JSON.stringify(that.data.suppleCompleteDateObj) != '{}'){
              completeDateTemp = new Date(that.data.suppleCompleteDateObj.dateTS);
            }
          }        

          wx.showLoading({
            title: 'Sending',
            mask: true
          });
          wx.request({
            //url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/createEqpRepairHad?' + app.globalData.restAuth + "&assetCardId=" + that.data.assetCardId + "&openId=" + app.globalData.openId + "&sessionKey=" + app.globalData.sessionKey,
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/createEqpRepairHad?' + app.globalData.restAuth + "&assetCardId=" + that.data.assetCardId + "&openId=oJJhp5GvX45x3nZgoX9Ae9DyWak4" + "&sessionKey=ca80bf276a4948909ff4197095f1103a",
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              company: app.globalData.defaultCompany,
              //assetno: that.data.assetno,
              itemno: that.data.itemno,
              repairuser: app.globalData.employeeId,
              repairusername: app.globalData.employeeName,
              hitchtime: new Date(that.data.formdateTS),
              troublefrom: that.data.troubleFrom,
              hitchdesc:that.data.troubleDetailInfo,
              serviceusername: that.data.serviceusername,
              serviceuser: that.data.serviceuser,
              creator: app.globalData.employeeId,
              repairarea: that.data.repairAreaObj.repairAreaValue,
              repairdeptno: app.globalData.defaultDeptId,
              repairdeptname: app.globalData.defaultDeptName,
              hitchurgency: that.data.hitchUrgencyId,
              repairmethodtype: that.data.repairMethodObj.repairMethodValue,
              isneedspare: that.data.needSpareObj.needSpareValue,
              remark: that.data.reRepairFlag.toString(),
              servicearrivetime: startDateTemp,
              completetime: completeDateTemp,
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
              fileFrom: '报修图片'
              //fileMark: _this.data.troubleDetailInfo,
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
    // let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;
    let _this = this;
    console.log(app.globalData);
    //console.log("windowsHeightTemp:" + app.globalData.windowHeight);
    //let heightTemp = app.globalData.windowHeight - 100;
    let heightTemp = app.globalData.screenHeight - 90 - app.globalData.statusBarHeight;
    heightTemp = heightTemp * 0.95 - 64;
    dateTemp = new Date();
    //console.log("heightTest:" + heightTemp);


    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairUserList';
      //var restUrl = app.globalData.restLocalAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairUserList';
      //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
      // if (options.employeeid) {
      //     restUrl += '/f;users.id=' + options.employeeid + '/s';
      // }
      // else {
      //     restUrl += '/f/s';
      // }
      //restUrl += '/f;deptno=' + '13000' + '/s';
      //restUrl += '/f;formid=' + res + '/s';
      var userDeptNo = app.globalData.defaultDeptId;
      //restUrl += '/f;deptno=' + userDeptNo + '/s';
      restUrl += '/f;deptno=' + userDeptNo + ';company=' + app.globalData.defaultCompany + '/s';
      //restUrl += '/f;deptno=1P100' + '/s';
      restUrl += '/' + 0 + '/' + 20;
      console.log(restUrl);
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
            //console.log("no Data");
            wx.hideLoading();
            return;
          }
          if(res.data.length > 2){
            serviceUserDta = res.data[0];
            troubleReasonDta = res.data[1];
            hitchUrgencyDta = res.data[2];
            repairAreaDta = res.data[3];
            autonoRepairUserDta = res.data[5];
            //dateTemp = new Date(util.utcInit(res.data[4]));
            dateTemp = res.data.length < 5 ? new Date() : new Date(util.utcInit(res.data[4]));
          }

          var dataLen = res.data.length;
          // if(dataLen > 10){
          //   dataLen = 10;
          // }

          for(var i = 0;i < serviceUserDta.length; i++){
            let newItem = { userId: "" , userName: "" , userInfo:""};
            newItem.userId = serviceUserDta[i].userid;
            newItem.userName = serviceUserDta[i].username;
            newItem.userInfo = serviceUserDta[i].userid + "-" + serviceUserDta[i].username;
            _this.data.repairServiceUserList.push(newItem);
          }

          for(var i = 0;i < autonoRepairUserDta.length; i++){
            let newItem = { userId: "" , userName: "" , userInfo:""};
            newItem.userId = autonoRepairUserDta[i].cvalue;
            newItem.userName = autonoRepairUserDta[i].cdesc;
            newItem.userInfo = autonoRepairUserDta[i].cvalue + "-" + autonoRepairUserDta[i].cdesc;
            _this.data.autonoServiceUserList.push(newItem);
          }

          for(var i = 0;i < troubleReasonDta.length; i++){
            let newItem = { troubleId: "" , troubleDesc: ""};
            newItem.troubleId = troubleReasonDta[i].cvalue;
            newItem.troubleDesc = troubleReasonDta[i].cdesc;
            _this.data.troubleReasonList.push(newItem);
          }

          for(var i = 0;i < hitchUrgencyDta.length; i++){
            let newItem = { hitchUrgencyId: "" , hitchUrgencyDesc: ""};
            newItem.hitchUrgencyId = hitchUrgencyDta[i].cvalue;
            newItem.hitchUrgencyDesc = hitchUrgencyDta[i].cdesc;
            _this.data.hitchUrgencyList.push(newItem);
          }

          for(var i = 0;i < repairAreaDta.length; i++){
            let newItem = { repairAreaValue: "" , repairAreaDesc: ""};
            newItem.repairAreaValue = repairAreaDta[i].cdesc;
            newItem.repairAreaDesc = repairAreaDta[i].cdesc;
            _this.data.repairAreaList.push(newItem);
          }

          _this.data.serviceUserList = _this.data.repairServiceUserList;
          //_this.data.serviceUserList = _this.data.autonoServiceUserList;

          _this.setData({
            serviceUserList: _this.data.serviceUserList,
            repairServiceUserList: _this.data.repairServiceUserList,
            autonoServiceUserList: _this.data.autonoServiceUserList,
            troubleReasonList: _this.data.troubleReasonList,
            hitchUrgencyList: _this.data.hitchUrgencyList,
            repairAreaList: _this.data.repairAreaList,
            serviceuser: _this.data.serviceUserList[0].userId,
            serviceusername: _this.data.serviceUserList[0].userName,
            troubleFrom: _this.data.troubleReasonList[0].troubleId,
            troubleDesc: _this.data.troubleReasonList[0].troubleDesc,
            hitchUrgencyId: _this.data.hitchUrgencyList[0].hitchUrgencyId,
            hitchUrgencyDesc: _this.data.hitchUrgencyList[0].hitchUrgencyDesc,
            repairMethodObj: _this.data.repairMethodList[0],
            repairAreaObj:_this.data.repairAreaList[0],

            minDate: new Date(dateTemp.getFullYear() -1 ,dateTemp.getMonth(), 1).getTime(),
            minCompleteDate: new Date(dateTemp.getFullYear() ,dateTemp.getMonth(), dateTemp.getDate() - 7).getTime(), 
            maxDate: dateTemp.getTime(),
            currentDate: dateTemp.getTime(),
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
      orderList: [],
      eqpListHeight : heightTemp,
      // minDate: new Date(dateTemp.getFullYear() -1 ,dateTemp.getMonth(), 1).getTime(),
      // minCompleteDate: new Date(dateTemp.getFullYear() ,dateTemp.getMonth(), dateTemp.getDate() - 7).getTime(), 
      // maxDate: dateTemp.getTime(),
      // currentDate: dateTemp.getTime(),
      repairuser: app.globalData.employeeId,
      repairUserName: app.globalData.employeeName,
      focusTroubleDetailField: false,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    suppleFirstInit = false;
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

  textAreaProInput:function(e){
    this.setData({
      [e.currentTarget.dataset.show]: e.detail.value
    });
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

  dateFormatForFilter(date){
    let dateTemp = new Date(date);
    let year = dateTemp.getFullYear();
    let month = dateTemp.getMonth() + 1;
    let day = dateTemp.getDate();
    let hour = dateTemp.getHours();
    let minute = dateTemp.getMinutes();

    if(month < '10'){
      month = "0" + month;
    }
  
    if(day < '10'){
      day = "0" + day;
    }
  
    if(hour < '10'){
      hour = "0" + hour;
    }
  
    if(minute < '10'){
      minute = "0" + minute;
    }

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
          initProInfo(_this);
          _this.setData({
            show:{queryInfo:true}
          });
          wx.hideLoading();
          return;
        }
        _this.setEqpRepairArea(res.data.position2.position);
        _this.setData({
          assetno: res.data.formid,
          itemdsc: res.data.assetDesc,
          itemno: res.data.assetItem.itemno,
          serviceuser: res.data.repairuser == null ? _this.data.serviceuser : res.data.repairuser,
          serviceusername: res.data.repairusername == null ? _this.data.serviceusername : res.data.repairusername,
          assetCardId: res.data.id,
          assetPosition: res.data.position1.name + res.data.position2.name,
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
          mask:false,
          zIndex:1000,
        }).then(() => {
          // on close
          initProInfo(_this);
        });
      }
    });
  },
  checkFormDtaBeforeSubmit: function(){

    this.setData({
      textareaDisabled:true
    });

    if(this.data.assetno == null){
      Dialog.alert({
        title: '系统消息',
        message: "请选择需要维修的设备",
        zIndex:1000,
        }).then(() => {
          this.setData({
            textareaDisabled:false
          });
        });
      return false;
    }
    console.log(this.data.serviceuser);
    if(this.data.troubleFrom == null || this.data.formdateTS == null || (this.data.serviceuser == null && !this.data.disableServiceUser) || this.data.troubleDetailInfo == null || this.data.uploaderList.length < 1 || this.data.repairAreaObj.repairAreaValue == '-1' || this.data.hitchUrgencyId == "-1" ){
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

    console.log(this.data.formdateTS);
    console.log(this.data.suppleStartDateObj);

    if(this.data.supplementFlag){

      if(this.data.suppleStartDateObj == null || JSON.stringify(this.data.suppleStartDateObj) === '{}'){
        Dialog.alert({
          title: '系统消息',
          message: "请选择维修到达时间",
          zIndex:1000,
          }).then(() => {
            this.setData({
              textareaDisabled:false
            });
          });
        return false;
      }

      var startDateTSTemp = (this.data.suppleStartDateObj == null || JSON.stringify(this.data.suppleStartDateObj) === '{}') ? 0 : this.data.suppleStartDateObj.dateTS;
      var completeDateTSTemp = (this.data.suppleCompleteDateObj == null || JSON.stringify(this.data.suppleCompleteDateObj) === '{}') ? 0 : this.data.suppleCompleteDateObj.dateTS;
      if(startDateTSTemp < this.data.formdateTS || (completeDateTSTemp < startDateTSTemp && completeDateTSTemp != 0)){
        Dialog.alert({
          title: '系统消息',
          message: "请确认故障到达和完成时间是否填写正确",
          zIndex:1000,
          }).then(() => {
            this.setData({
              textareaDisabled:false
            });
          });
        return false;
      }
    }
  
    return true;
  },

  onTroubleDetailFieldClick:function(e){
    this.setData({
      focusTroubleDetailField: true
    });
  },

  ch2Unicdoe:function(str){
      if(!str){
          return;
      }
      var unicode = '';
      for (var i = 0; i <  str.length; i++) {
          var temp = str.charAt(i);
          if(temp){
              unicode += '\\u' +  temp.charCodeAt(0).toString(16);
          }
          else{
              unicode += temp;
          }
      }
      return unicode;
    },

    onExSearchClearBtnClick:function(e){
      var exSearchArray = this.data.searchItemList;
      for(var i=0;i<exSearchArray.length;i++){
        exSearchArray[i].itemSelected = false;
        exSearchArray[i].searchItemValue = '';
      }
      this.setData({
        searchItemList: this.data.searchItemList
      });
    },

    onExSearchBtnClick:function(e){
      var res = {detail:this.data.searchBarDta};
      this.onEqpSearchStart(res);
    },

    onTagClose(event) {
      var exSearchItemName = 'searchItemList[' + event.currentTarget.dataset.itemid + '].itemSelected';
      this.setData({
        [exSearchItemName]: false,
      });
    },

    sendRepairMsg(){
      wx.request({
        //url: app.globalData.restAdd + '/Hanbell-WCO/api/sendmsg/send',
        url: 'https://jrs.hanbell.com.cn' + '/Hanbell-WCO/api/sendmsg/send',
        //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
        data: {
          userId:'C2090',
          msg:'test4wxapp',
          openid: 'oJJhp5GvX45x3nZgoX9Ae9DyWak4',
          sessionkey: 'ca80bf276a4948909ff4197095f1103a'
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          //wx.hideLoading();
          var resMsg = '';
          console.log(res);
          if(res.statusCode == 200 && res.data.msg != null){
            resMsg = '提交成功';
            //that.fileUpLoadByQueue(FileSystemManager,0);
          }
          else{
            resMsg = '提交失败';
          }
        },
        fail: function (fail) {
          // wx.hideLoading();
          // wx.showModal({
          //   title: '系统提示',
          //   content: "请联系管理员:" + fail,
          //   showCancel: false
          // });
          console.log("发送消息失败");
        }
      });
    },

  /**
   * 选择弹出层开启Pro
   */
  showSelectorPopup: function(event){
    var selectorTemp = {};
    selectorTemp[event.currentTarget.dataset.selector + "SelectorPopup"] = true;
    this.setData({
      show:selectorTemp
    });
  },

  /**
  * 故障来源选择弹出层关闭
  */
  closeSelectorPopup: function(event){
    var selectorTemp = {};
    selectorTemp[event.currentTarget.dataset.selector + "SelectorPopup"] = false;
    this.setData({
      show:selectorTemp
    });
  },

  /**
  * 故障来源选择器事件
  */
  onPickerChange: function(event){
    const { picker, value, index } = event.detail;
    var selectorName = event.currentTarget.dataset.selector + "Obj";
    this.pickerChangeDapter(event);
    this.setData({
      [selectorName]:value
    });
  },

  pickerChangeDapter:function(event){
    const { picker, value, index } = event.detail;
    if(event.currentTarget.dataset.selector == "repairMethod"){
      var serviceUserListTemp = [];
      var disableServiceUserTemp = false;
      var isShowTemp="none";
      if(value.repairMethodValue == '2'){
        serviceUserListTemp = this.data.autonoServiceUserList;
        disableServiceUserTemp = serviceUserListTemp.length > 1 ? false : true;
        isShowTemp="block";
      }
      else{
        serviceUserListTemp = this.data.repairServiceUserList;
        disableServiceUserTemp = false;
        isShowTemp="none";
      }
      this.setData({
        disableServiceUser: disableServiceUserTemp,
        serviceUserList: serviceUserListTemp,
        serviceuser: serviceUserListTemp[0].userId,
        serviceusername: serviceUserListTemp[0].userName,
        isShow:isShowTemp,
      });
    }
    else if(event.currentTarget.dataset.selector == "repairArea" && this.data.itemno == "9"){
      if("枫泾厂" == value.repairAreaValue || "枫泾总部" == value.repairAreaValue){
        this.setData({
          serviceuser: 'C0567',
          serviceusername: '张国荣',
        });
      }
      else if("兴塔厂" == value.repairAreaValue || "枫泾一厂" == value.repairAreaValue){
        this.setData({
          serviceuser: 'C1233',
          serviceusername: '曹雪平',
        });
      }
    }
  },

  onPickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    var selectorName = event.currentTarget.dataset.selector + "Obj";
    this.setData({
      [selectorName]:value
    });
    this.closeSelectorPopup(event);
  },

  onPickerCancel: function(event){
    this.closeSelectorPopup(event);
  },

  onDatePickerInput(event){
    if(suppleFirstInit){
      return;
    }
    var selectorName = event.currentTarget.dataset.selector + "Obj";
    let dateTemp = this.dateFormatForFilter(event.detail);
    var selectorTemp = {};
    selectorTemp['dateFormatStr'] = dateTemp;
    selectorTemp['dateTS'] = event.detail;
    this.setData({
      [selectorName]: selectorTemp
    });
  }, 

  onDatePickerConfirm: function(event){
    var selectorName = event.currentTarget.dataset.selector + "Obj";
    let dateTemp = this.dateFormatForFilter(event.detail);
    var selectorTemp = {};
    selectorTemp['dateFormatStr'] = dateTemp;
    selectorTemp['dateTS'] = event.detail;
    this.setData({
      [selectorName]: selectorTemp
    });
    this.closeSelectorPopup(event);
  },

  onDatePickerCancel: function(event){
    var selectorName = event.currentTarget.dataset.selector + "Obj";
    this.setData({
      [selectorName]:{}
    });
    this.closeSelectorPopup(event);
  },

  setEqpRepairArea:function(positionCode){
    var positionName = '';
    var positionNameOld = '';
    if(positionCode == 'C0-1'){
      positionName = '枫泾厂';
      positionNameOld = '枫泾总部';
    }
    else{
      positionName = '兴塔厂'
      positionNameOld = '枫泾一厂';
    }
    var repairAreaListTemp = this.data.repairAreaList;
    for(var i = 0;i < repairAreaListTemp.length;i++){
      if((positionName == repairAreaListTemp[i].repairAreaValue) || (positionNameOld == repairAreaListTemp[i].repairAreaValue)){
        this.setData({
          repairAreaObj: repairAreaListTemp[i]
        });
        return;
      }
    }

    this.setData({
      repairAreaObj: repairAreaListTemp[0],
      serviceuser: null,
      serviceusername: '请选择',
    });

    // if("枫泾总部" == this.data.repairAreaObj.repairAreaDesc){
    //   this.setData({
    //     serviceuser: 'C0567',
    //     serviceusername: '张国荣',
    //   });
    // }
    // else if("枫泾一厂" == this.data.repairAreaObj.repairAreaDesc){
    //   this.setData({
    //     serviceuser: 'C1233',
    //     serviceusername: '曹雪平',
    //   });
    // }
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
