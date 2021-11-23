// miniprogram/pages/eqpManagement/startEqpRepair.js
import Dialog from '../../../component/vant/dialog/dialog';
import Toast from '../../../component/vant/toast/toast';
var util = require("../../../utils/eamCommonUtils.js");

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
var repairAreaDta = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collapseActiveNames: [],

    repairBasicInfoCardHeight: '400',
    completeFlag:true,
    totalPrice:null,
    spareCost:null,
    laborCost:null,
    repairCost:null,
    repairTime:null,
    repairTimestamp:null,
    downTimestamp: null,
    exceptTime:'0',
    stopWorkTime:'0',
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
    spareDetailList:[],
    serviceUserList:[], 
    hitchDutyList:[],
    repairHisList:[],
    repairHelperList:[],
    repairAreaObj:null,
    repairAreaList:[{repairAreaDesc:'请选择',repairAreaValue:'-1'}],
    abraseHitchList:[{abraseHitchId : '01',abraseHitchDesc: '使用不当'},
                     {abraseHitchId : '02',abraseHitchDesc: '保养不当'},
                     {abraseHitchId : '03',abraseHitchDesc: '维修不当'},
                     {abraseHitchId : '04',abraseHitchDesc: '劣质配件'},
                     {abraseHitchId : '05',abraseHitchDesc: '正常使用寿命'}],
    //hitchTypeList:[{hitchTypeCode: '0', hitchTypeName: '一般故障'},{hitchTypeCode: '1', hitchTypeName: '严重故障'}],
    hitchTypeList:[],
    hitchSort01List:[],
    hitchTypeCode:null,
    hitchTypeName:null,
    refreshTrigger: false,
    currentTab: 0,     //当前显示tab的下标
    navTab: ['全部', '处理中', '已完成'],
    navTabPro: [],
    images: [],
    uploaderList: [],
    uploaderObjInfoList:[],
    uploaderNum:0,
    showUpload:true,
    troubleTypeCol: ['操作员点检','设备突发故障','维修员点检'],
    show:{
      eqpSelectorPopup: false,
      hitchDutySelectorPopup: false,
      repairHelperSelectorPopup: false,
      hitchSort01SelectorPopup: false,
      abraseSelectorPopup: false,
      hitchTypeSelectorPopup: false,
      dateFilterPopup: false,
      statusFilterPopup: false,
      dateSelector: false,
      queryInfo: false,
      repairAreaSelectorPopup: false,
    },
    showTextArea:{
      deliveryRemark:false,
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
    hitchDutyDeptObj: {hitchDutyDeptNo:null,hitchDutyDeptName:null},
    hitchDutyUserObj: {hitchDutyUserId:null,hitchDutyUserName:null},
    abraseHitchObj:null,
    hitchSort01Obj:null,
    hitchTypeObj:null,
    repairMethod: null,
    formdate: null,
    formdateTS: null,
    assetCardId: null,
    serviceuser: 'TEST',
    serviceusername: 'CTEST',
    focusTroubleDetailField:'false',
    textareaDisabled:false,
    serviceuserPickerIndex: null,
    hitchAlarm:'',
    repairMethod:'',
    deliveryRemark:'',
    hitchReason:'',
    repairProcess:'',
    measure:'',
    arrivalDelayReason:'',
    reRepairFlag: null,
    formCreDate:'',
    formCreator:'',

    tabActive: 0,

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

  onCollapseChange(event) {
    console.log(event);
    this.setData({
      collapseActiveNames: event.detail,
    });
  },

    /**
   * 滑动单元格关闭事件
   */
  onSwipeClose: function(event){
    console.log(event);
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
        //this.getAssetInfo(this.data.barCodeId);
        instance.close();
        break;
    }
  },

  on2ndRepairChange(event){
    console.log(event);
    this.setData({
      reRepairFlag:event.detail
    });
  },

  bindServiceUserPickerChange(e) {
    const val = e.detail.value;
    //console.log(e);
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

  /**
   * 打开备件详细信息弹窗
   */
  showSpareDetailPopup: function(e){
    console.log(e);
    var itemStockCurrentListTemp = this.data.spareUsedList[e.currentTarget.dataset.itemindex].itemStockCurrentList;
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

  onEqpSelResetClick(){
    this.setData({
      //orderList: [],
      eqpListScrollTop:0,
      });
  },

  /**
   * 责任人信息单元格点击事件
   */
  onHitchDutyCellTap: function(){
    this.setData({
      show:{
        hitchDutySelectorPopup: true
      }
    });
  },

  /**
   * 设备信息选择弹窗关闭事件
   */
  closeHitchDutySelectorPopup: function(){
    //console.log("HitchDutyListClose!");
    this.setData({
      show:{
        hitchDutySelectorPopup: false
      }
    });
  },

  onHitchDutySelBackClick: function(){
    this.closeHitchDutySelectorPopup();
    this.setData({
      //orderList: [],
      eqpListScrollTop:0,
      });
  },

  onHitchDutySelResetClick(){
    hitchDutyListDta = null;
    this.setData({
      //orderList: [],
      hitchDutyList:[],
      hitchDutyDeptObj: {hitchDutyDeptNo:null,hitchDutyDeptName:null},
      hitchDutyUserObj: {hitchDutyUserId:null,hitchDutyUserName:null},
      eqpListScrollTop:0,
      });
      this.closeHitchDutySelectorPopup();
  },

    /**
   * 辅助人员信息单元格点击事件
   */
  onRepairHelperCellTap: function(){
    this.setData({
      show:{
        repairHelperSelectorPopup: true
      }
    });
  },

    /**
   * 辅助人员选择弹窗关闭事件
   */
  closeRepairHelperSelectorPopup: function(){
    //console.log("HitchDutyListClose!");
    this.setData({
      show:{
        repairHelperSelectorPopup: false
      }
    });
  },

  onRepairHelperSelBackClick: function(){
    this.closeRepairHelperSelectorPopup();
    this.setData({
      //orderList: [],
      eqpListScrollTop:0,
      });
  },

  onRepairHelperSelResetClick(){
    hitchDutyListDta = null;
    this.setData({
      //orderList: [],
      hitchDutyList:[],
      eqpListScrollTop:0,
      });
      this.closeRepairHelperSelectorPopup();
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



      console.log("start set time out");

      setTimeout(function(){
        _this.setData({
          orderList: _this.data.orderList,
          eqpListLoading: false
        });
        canLoadNewData = true;
        console.log("start load more data");
       }, 2000);
    }

    //  var p = new Promise(function(resolve, reject){
    //   setTimeout(function(){
    //     resolve("foo");
    //     console.log("first");
    //   }, 1000);
    // });
    
    // p.then(function(value){
    //   console.log(value);
    // });

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
        spareList:[]
      });
      this.getRetreatSpareListInfo(res);
    },

    getRetreatSpareListInfo: function(res){
      let _this = this;
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/sparemanagement/getRetreatSpareList';
      restUrl += '/f;docFormid=' + this.data.docFormid + ';basicInfo=' + res;
      restUrl = encodeURI(restUrl);
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
          if(res.data.length > 0){
            spareListDta = res.data;
          }

          // var dataLen = res.data.length;
          // if(dataLen > 10){
          //   dataLen = 10;
          // }

          for(var i = 0;i < spareListDta.length; i++){
            let newItem = {id:'', spareNo: "A119-01", shopurl: "/images/1.jpg", origin: "TaoBao", orderstate: "", pictureurl: "/images/1.jpg", itemDisplayName: "备件名称", spareDesc: "副齿轮检验轴AA-2600I", productcount: 1, spareNum: "SDFA1111", uPrice:100, spareUserName: "技术员", userNo:'' , qty: 1, maxQty:0, itemStockDataList:'', itemStockCurrentList:[]};
            newItem.Id = spareListDta[i].spareInfo.sparenum;
            newItem.spareNo = spareListDta[i].spareInfo.sparenum;
            newItem.spareDesc = spareListDta[i].spareInfo.sparedesc;
            newItem.spareNum = spareListDta[i].qty;
            newItem.spareModel = spareListDta[i].spareInfo.sparemodel;
            newItem.uPrice = spareListDta[i].equipmentSpareRecodeDtaList[0].uprice;
            newItem.totalPrice = spareListDta[i].totalPrice;
            newItem.brand = spareListDta[i].spareInfo.brand;
            newItem.unit = spareListDta[i].spareInfo.unit.unit;
            newItem.spareUserName = app.globalData.employeeName;
            newItem.userNo = app.globalData.employeeId;
            newItem.maxQty = spareListDta[i].qty;
            newItem.itemStockDataList = spareListDta[i].equipmentSpareRecodeDtaList;
            if(newItem.itemStockDataList.length > 0){
              let spareItemTemp = JSON.parse(JSON.stringify(newItem.itemStockDataList[0]));
              spareItemTemp.qty = 1;
              newItem.itemStockCurrentList.push(spareItemTemp);
            }
            _this.data.spareList.push(newItem);
          }

          _this.setData({
            spareList: _this.data.spareList,
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

    onHitchDutySearchStart:function(e){
        
      let res = e.detail;
      canLoadNewData = true;
      this.setData({
        hitchDutyList:[]
      });
      this.getHitchDutyListInfo(res);
    },

    eqpCardSelect:function(e){
      //console.log(spareListDta);
      var eqpIndex = 0;
      var findFlag = false;
      let _this = this;
      if(e.currentTarget.id.split('_').length > 1){
        eqpIndex = e.currentTarget.id.split('_')[1];
      }
      var spareUsedList = this.data.spareUsedList;
      let spareListTemp = this.data.spareList;
      let spareListItem = JSON.parse(JSON.stringify(spareListTemp[eqpIndex]));

      for(var i = 0 ; i< spareUsedList.length;i++){
        if(spareUsedList[i].spareNo == spareListItem.spareNo){
          //_this.data.spareUsedList[i].qty = _this.data.spareUsedList[i].qty + 1;
          _this.spareQtyChange(i,_this.data.spareUsedList[i].qty + 1);
          findFlag = true;
          break;
        }
      }

      if(!findFlag){
        this.data.spareUsedList.push(spareListItem);
      }

      findFlag = false;

      this.setData({
        spareUsedList: _this.data.spareUsedList,
      });

      this.getTotalPrice();

      //console.log(this.data.spareUsedList);
      
      this.closeEqpSelectorPopup();
    },

    hitchDutyCardSelect:function(e){
      //console.log(spareListDta);
      var eqpIndex = 0;
      var findFlag = false;
      let _this = this;
      if(e.currentTarget.id.split('_').length > 1){
        eqpIndex = e.currentTarget.id.split('_')[1];
      }

      let hitchDutyListTemp = this.data.hitchDutyList;
      let hitchDutyListItem = JSON.parse(JSON.stringify(hitchDutyListTemp[eqpIndex]));

      //console.log(hitchDutyListItem);

      this.setData({
        hitchDutyDeptObj: {hitchDutyDeptNo:hitchDutyListItem.deptNo,hitchDutyDeptName:hitchDutyListItem.dept},
        hitchDutyUserObj:{hitchDutyUserId:hitchDutyListItem.userId,hitchDutyUserName:hitchDutyListItem.userName}
      });

      this.closeHitchDutySelectorPopup();
    },

    repairHelperCardSelect:function(e){
      //console.log(spareListDta);
      var eqpIndex = 0;
      var findFlag = false;
      let _this = this;
      if(e.currentTarget.id.split('_').length > 1){
        eqpIndex = e.currentTarget.id.split('_')[1];
      }
      var repairHelperList = this.data.repairHelperList;
      var hitchDutyList = this.data.hitchDutyList;
      let repairHelperItem = hitchDutyList[eqpIndex];

      //console.log(spareListItem);

      if(app.globalData.employeeId == repairHelperItem.userId){
        findFlag = true;
      }

      for(var i = 0 ; i< repairHelperList.length;i++){
        if(repairHelperList[i].CurNode == repairHelperItem.userId){
          findFlag = true;
          break;
        }
      }

      if(!findFlag){
        let newItem = {Id: '',Company:'',Pid:'',Seq:'',Rtype:'',CurNode:'',CurNode2:'',UserNo:''};
        newItem.Id = repairHelperItem.userId;
        newItem.Company = "C";
        newItem.Pid = this.data.docFormid;
        newItem.Rtype = "0";
        newItem.CurNode =repairHelperItem.userId;
        newItem.CurNode2 = repairHelperItem.userName;
        newItem.UserNo = '';
        this.data.repairHelperList.push(newItem);
      }

      findFlag = false;

      this.setData({
        repairHelperList: _this.data.repairHelperList,
      });

      //console.log(this.data.spareUsedList);
      
      this.closeRepairHelperSelectorPopup();
    },

    onHitchSort01CellTap:function(){
      this.showHitchSort01SelectorPopup();
    },

    onRepairAreaCellTap:function(){
      this.showRepairAreaSelectorPopup();
    },
    
    onHitchTypeCellTap:function(){
      this.showHitchTypeSelectorPopup();
    },


        /**
   * 故障来源选择弹出层开启
   */
  showHitchTypeSelectorPopup: function(){
    this.setData({
      show:{hitchTypeSelectorPopup:true}
    });
},

  /**
   * 故障来源选择弹出层关闭
   */
  closeHitchTypeSelectorPopup: function(){
    this.setData({
      show:{hitchTypeSelectorPopup:false}
    });
  },

    /**
   * 故障来源选择弹出层开启
   */
  showHitchSort01SelectorPopup: function(){
      this.setData({
        show:{hitchSort01SelectorPopup:true}
      });
  },

  /**
   * 故障来源选择弹出层关闭
   */
  closeHitchSort01SelectorPopup: function(){
    this.setData({
      show:{hitchSort01SelectorPopup:false}
    });
  },

        /**
   * 所属厂区选择弹出层开启
   */
  showRepairAreaSelectorPopup: function(){
    this.setData({
      show:{repairAreaSelectorPopup:true}
    });
},

  /**
   * 所属厂区选择弹出层关闭
   */
  closeRepairAreaSelectorPopup: function(){
    this.setData({
      show:{repairAreaSelectorPopup:false}
    });
  },

    /**
   * 故障来源选择器事件
   */
  onHitchTypePickerChange: function(event){
    //console.log(event);
    const { picker, value, index } = event.detail;
    this.setData({
      hitchTypeObj:value,
    });
  },

  onHitchTypePickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      hitchTypeObj:value,
    });
    this.closeHitchTypeSelectorPopup();
  },

  onHitchTypePickerCancel: function(event){
    this.closeHitchTypeSelectorPopup();
  },

  /**
   * 故障来源选择器事件
   */
  onHitchSort01PickerChange: function(event){
    //console.log(event);
    const { picker, value, index } = event.detail;
    this.setData({
      hitchSort01Obj:value,
    });
  },

  onHitchSort01PickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      hitchSort01Obj:value,
    });
    this.closeHitchSort01SelectorPopup();
  },

  onHitchSort01PickerCancel: function(event){
    this.closeHitchSort01SelectorPopup();
  },


  /**
   * 磨损性故障选择器事件
   */
  onRepairAreaPickerChange: function(event){
    //console.log(event);
    const { picker, value, index } = event.detail;
    this.setData({
      repairAreaObj:value
    });
  },

  onRepairAreaPickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      repairAreaObj:value
    });
    this.closeRepairAreaSelectorPopup();
  },

  onRepairAreaPickerCancel: function(event){
    this.closeRepairAreaSelectorPopup();
  },

  handleContentInput:function(e){
    this.setData({
      repairMethod: e.detail.value
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
    //console.log(new Date(event.detail));
    this.setData({
      formdate: dateTemp,
      formdateTS: event.detail,
    });
  },

  spareDeliveryFormSubmit: function(e){
    var that = this;
    const FileSystemManager = wx.getFileSystemManager();
    //var opedesc = e.currentTarget.dataset.opedesc;
    var canSubmit = this.checkFormDtaBeforeSubmit();
    //var errmsg = '';

    var jsonArrayTemp = [];
    jsonArrayTemp.push(that.data.spareUsedList);
    console.log(jsonArrayTemp);

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
          console.log(that.data);
          wx.showLoading({
            title: 'Sending',
            mask: true
          });
          var jsonArray = [];
          jsonArray.push(that.data.spareDetailList);
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/sparemanagement/startSpareRetreat' + '?' + app.globalData.restAuth,
            data: {
              company: app.globalData.defaultCompany,
              relano: that.data.docFormid,
              deptno: app.globalData.defaultDeptId,
              deptname: app.globalData.defaultDeptName,
              status: JSON.stringify(jsonArray),
              creator: app.globalData.employeeId
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
                if(res.data.code != "200"){
                  resMsg = '提交失败，请重试';
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
                  message: "退库成功",
                  }).then(() => {
                    // on close
                      wx.navigateBack({delta: 2});
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
  
  getFormInitData:function(){
      var _this = this;
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairUserList';
      restUrl += '/f;company=' + app.globalData.defaultCompany + '/s';
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
          if(res.data.length > 2){
            repairAreaDta = res.data[3];
            dateTemp = res.data.length < 5 ? new Date() : new Date(util.utcInit(res.data[4]));
          }

          for(var i = 0;i < repairAreaDta.length; i++){
            let newItem = { repairAreaValue: "" , repairAreaDesc: ""};
            newItem.repairAreaValue = repairAreaDta[i].cdesc;
            newItem.repairAreaDesc = repairAreaDta[i].cdesc;
            _this.data.repairAreaList.push(newItem);
          }

          _this.setData({
            repairAreaList: _this.data.repairAreaList,
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
  },

  getFormInfo:function(){
    var _this = this;
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/sparemanagement/getSpareDeliveryInfo';
    restUrl += '/f;docFormid=' + 'CK21050001';
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;

    this.setData({
      docId: options.docId,
      docFormid: options.docFormid,
    })

    let _this = this;
    let heightTemp = app.globalData.screenHeight - 90 - app.globalData.statusBarHeight;
    heightTemp = heightTemp * 0.95 - 64;
    dateTemp = new Date();
    //console.log("heightTest:" + heightTemp);

    //this.getFormInitData();
    //this.getRepairAuditInitDta(app.globalData.employeeId,this.data.docId);
    //this.getRepairHisDta(app.globalData.employeeId,this.data.docFormid);

    //写你自己的接口
    this.setData({
      //docId: options.docId,
      //docFormid: options.docFormid,
      //eqpRepairInfoList: [JSON.parse(options.eqpInfo)],
      eqpListHeight : heightTemp,
      minDate: new Date(dateTemp.getFullYear() -1 ,dateTemp.getMonth(), 1).getTime(),
      maxDate: dateTemp.getTime(),
      currentDate: dateTemp.getTime(),
      repairuser: app.globalData.employeeId,
      repairUserName: app.globalData.employeeName,
      //abraseHitchObj: _this.data.abraseHitchList[0],
      //hitchTypeObj:_this.data.hitchTypeList[0],
      focusTroubleDetailField: false,

      formCreDate: util.dateFormatForFilter(dateTemp),
      formCreator: app.globalData.employeeName,
    });
  },

  onSpareLeftIconClick:function(e){
    var itemIndex = e.currentTarget.dataset.itemindex;
    var currentQty = this.data.spareUsedList[itemIndex].qty;
    if(currentQty > 1){
      this.spareQtyChange(itemIndex,currentQty - 1);
    }
  },

  onSpareRightIconClick:function(e){
    var itemIndex = e.currentTarget.dataset.itemindex;
    var currentQty = this.data.spareUsedList[itemIndex].qty;
    this.spareQtyChange(itemIndex,currentQty + 1);
  },

  spareQtyChange:function(index,newQty){
    var itemIndex = index;
    console.log(this.data.spareUsedList[itemIndex]);
    var spareItem = this.data.spareUsedList[itemIndex];
    var itemStockList = this.data.spareUsedList[itemIndex].itemStockDataList;
    var currentQty = this.data.spareUsedList[itemIndex].qty;
    var maxQty = this.data.spareUsedList[itemIndex].maxQty;
    var stockMaxIndex = -1;
    var stockQtyTemp = 0;
    var totalPrice = 0;

    if(newQty > maxQty){
      Toast('超出已有库存数量');
      return;
    }
    spareItem.itemStockCurrentList = [];
    for(var i = 0;i<itemStockList.length;i++)
    {
      stockQtyTemp = stockQtyTemp + itemStockList[i].cqty;
      if(newQty <= stockQtyTemp){
        stockMaxIndex = i;
        let spareItemTemp = JSON.parse(JSON.stringify(itemStockList[i]));
        spareItemTemp.cqty = newQty - (stockQtyTemp - itemStockList[i].cqty);
        spareItem.itemStockCurrentList.push(spareItemTemp);
        totalPrice = totalPrice + spareItemTemp.uprice * spareItemTemp.cqty;
        break;
      }
      else{
        let spareItemTemp = JSON.parse(JSON.stringify(itemStockList[i]));
        spareItem.itemStockCurrentList.push(spareItemTemp);
        totalPrice = totalPrice + spareItemTemp.uprice * spareItemTemp.cqty;
      }
    }
    if(stockMaxIndex == -1){
      Toast('超出已有库存数量');
      return;
    }

    this.data.spareUsedList[itemIndex].qty = newQty;
    this.data.spareUsedList[itemIndex].uPrice = totalPrice;
    this.setData({
      spareUsedList: this.data.spareUsedList
    });
    console.log(this.data.spareUsedList);
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
    //console.log(this.data.spareUsedList[e.currentTarget.dataset.itemindex])
    let _this = this;


    Dialog.confirm({
      title: '系统提示',
      message: '确认删除吗?',
      zIndex: 1000,
    })
      .then(() => {

        if(_this.data.spareUsedList[e.currentTarget.dataset.itemindex].Id == '' || _this.data.spareUsedList[e.currentTarget.dataset.itemindex].Id == null){
          var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/deleteAuditSpareDta' + '?' + app.globalData.restAuth;
          //console.log(restUrl);
          wx.showLoading({
            title: '获取中...',
            mask: true
          });
          wx.request({
            url: restUrl,
            data: {
              id:_this.data.spareUsedList[e.currentTarget.dataset.itemindex].docId,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              //console.log(res);

              if(res.data == "" || res.statusCode != 200){
                //console.log("no Data");
                wx.hideLoading();
                return;
              }

              _this.data.spareUsedList.splice(e.currentTarget.dataset.itemindex,1);
              _this.setData({
                spareUsedList : _this.data.spareUsedList
              });
              _this.getTotalPrice();

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
                wx.navigateBack();
              });
            }
          });
        }
        else{
          _this.data.spareUsedList.splice(e.currentTarget.dataset.itemindex,1);
          _this.setData({
            spareUsedList : _this.data.spareUsedList
          });
          _this.getTotalPrice();
        }
      })
      .catch(() => {
        // on cancel
      });

  },

  onRepairHelperSwipeClose:function(e){
    console.log(e);
    const { position, instance } = e.detail;
    instance.close();
    if(e.detail.position != "right"){
      return;
    }
    //console.log(this.data.spareUsedList[e.currentTarget.dataset.itemindex])
    let _this = this;


    Dialog.confirm({
      title: '系统提示',
      message: '确认删除吗?',
      zIndex: 1000,
    })
      .then(() => {
        console.log(_this.data.repairHelperList[e.currentTarget.dataset.itemindex]);
        if(_this.data.repairHelperList[e.currentTarget.dataset.itemindex].Id == '' || _this.data.repairHelperList[e.currentTarget.dataset.itemindex].Id == null){
          var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/deleteRepairHelperDta' + '?' + app.globalData.restAuth;
          //console.log(restUrl);
          wx.showLoading({
            title: '获取中...',
            mask: true
          });
          wx.request({
            url: restUrl,
            data: {
              id:_this.data.repairHelperList[e.currentTarget.dataset.itemindex].docId,
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              //console.log(res);

              if(res.data == "" || res.statusCode != 200){
                //console.log("no Data");
                wx.hideLoading();
                return;
              }

              _this.data.repairHelperList.splice(e.currentTarget.dataset.itemindex,1);
              _this.setData({
                repairHelperList : _this.data.repairHelperList
              });
              _this.updateLaborCost();
              _this.getTotalPrice();
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
                wx.navigateBack();
              });
            }
          });
        }
        else{
          _this.data.repairHelperList.splice(e.currentTarget.dataset.itemindex,1);
          _this.setData({
            repairHelperList : _this.data.repairHelperList
          });
          _this.updateLaborCost();
          _this.getTotalPrice();
        }
      })
      .catch(() => {
        // on cancel
      });

  },

  inputConfirmTest:function(e){
    console.log(e);
  },

  getTotalPrice:function(){
    var spareListTemp = this.data.spareUsedList;
    var totalPrice = 0;
    var spareCostTemp = 0;
    var repairCostTemp = isNaN(parseFloat(this.data.repairCost)) ? 0 : parseFloat(this.data.repairCost);
    var laborCostTemp = isNaN(parseFloat(this.data.laborCost)) ? 0 : parseFloat(this.data.laborCost);
    for(var i = 0 ; i < spareListTemp.length ; i++){
      totalPrice = totalPrice + spareListTemp[i].uPrice * spareListTemp[i].qty;
    }
    spareCostTemp = totalPrice;
    totalPrice = (totalPrice + repairCostTemp + laborCostTemp).toFixed(2) * 100;
    this.setData({
      totalPrice : totalPrice,
      spareCost : spareCostTemp,
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


  checkFormDtaBeforeSubmit: function(){

    this.setData({
      textareaDisabled:true
    });

    var spareUsedListTemp = this.data.spareUsedList;
    var spareTotalListTemp = [];

    if(spareUsedListTemp.length < 1){
      Dialog.alert({
      title: '系统消息',
      message: "请选择备件!",
      zIndex:1000,
      }).then(() => {
        this.setData({
          textareaDisabled:false
        });
      });
      return false;
    }

    for(var i = 0;i<spareUsedListTemp.length;i++){
      for(var j =0;j<spareUsedListTemp[i].itemStockCurrentList.length;j++){
        spareTotalListTemp.push(spareUsedListTemp[i].itemStockCurrentList[j]);
      }
    }

    this.setData({
      spareDetailList: spareTotalListTemp
    });
    console.log(this.data.spareDetailList);
  
    return true;
  },
  
  timestampInit_toMinutes:function(timestampTemp){
    // let day = parseInt(timestampTemp/1000/3600/24);
    // let hours = parseInt(timestampTemp/1000/3600%24);
    // let minutes = parseInt((timestampTemp/1000/3600%24 - hours) * 60);
    //let hours = (timestampTemp/1000/3600).toFixed(1);
    let minutes = parseInt(timestampTemp/1000/60);
    return minutes;
  },

  timestampInit_toHours:function(timestampTemp){
    // let day = parseInt(timestampTemp/1000/3600/24);
    // let hours = parseInt(timestampTemp/1000/3600%24);
    // let minutes = parseInt((timestampTemp/1000/3600%24 - hours) * 60);
    let hours = (timestampTemp/1000/3600).toFixed(1);
    //let minutes = parseInt(timestampTemp/1000/60);
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
