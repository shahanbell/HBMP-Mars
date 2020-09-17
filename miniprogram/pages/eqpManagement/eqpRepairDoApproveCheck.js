// miniprogram/pages/eqpManagement/startEqpRepair.js
import Dialog from '../../component/vant/dialog/dialog';
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
    auditContenctType:'合格',
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
    auditContenctList:[{contenctId:'合格',contenctDesc:'合格'},{contenctId:'不合格',contenctDesc:'不合格'}],
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
      auditNote:false,
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
    hitchAlarm:'',
    repairMethod:'',
    hitchDesc:'',
    hitchReason:'',
    repairProcess:'',
    measure:'',
    rStatus:'',
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
      hitchDutyDeptObj:null,
      hitchDutyUserObj:null,
      eqpListScrollTop:0,
      });
      this.closeHitchDutySelectorPopup();
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

    //  var p = new Promise(function(resolve, reject){
    //   setTimeout(function(){
    //     resolve("foo");
         //console.log("first");
    //   }, 1000);
    // });
    
    // p.then(function(value){
       //console.log(value);
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
      this.getSpareListInfo(res);
    },

    getSpareListInfo: function(res){
      let _this = this;
      var restUrl = app.globalData.restAdd + '/Hanbell-WCO/api/shbeam/equipmentrepair/getRepairSpareList';
      //var restUrl = app.globalData.restLocalAdd + '/Hanbell-WCO/api/shbeam/equipmentrepair/getRepairUserList';
      //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-WCO/api/shbeam/assetcardtest';
      // if (options.employeeid) {
      //     restUrl += '/f;users.id=' + options.employeeid + '/s';
      // }
      // else {
      //     restUrl += '/f/s';
      // }
      //restUrl += '/f;deptno=' + '13000' + '/s';
      restUrl += '/f;basicInfo=' + res + '/s';
      // restUrl += '/f' + '/s';
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
          if(res.data.length > 0){
            spareListDta = res.data;
          }

          // var dataLen = res.data.length;
          // // if(dataLen > 10){
          // //   dataLen = 10;
          // // }

          for(var i = 0;i < spareListDta.length; i++){
            let newItem = {id:'', spareNo: "A119-01", shopurl: "/images/1.jpg", origin: "TaoBao", orderstate: "", pictureurl: "/images/1.jpg", itemDisplayName: "备件名称", spareDesc: "副齿轮检验轴AA-2600I", productcount: 1, spareNum: "SDFA1111", uPrice:100, spareUserName: "技术员", userNo:'' , qty: 1};
            newItem.Id = spareListDta[i].id;
            newItem.spareNo = spareListDta[i].spareno;
            newItem.spareDesc = spareListDta[i].sparedesc;
            newItem.spareNum = spareListDta[i].sparenum;
            newItem.uPrice = spareListDta[i].uprice;
            newItem.brand = spareListDta[i].brand;
            newItem.unit = spareListDta[i].unit;
            newItem.spareUserName = app.globalData.employeeName;
            newItem.userNo = app.globalData.employeeId;
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


    getHitchDutyListInfo: function (res) {
      if(res==null || res=='')
        return;
      var _this = this;
      // restUrl = app.globalData.restAdd + '/Hanbell-WCO/api/shbeam/assetcardtest';
      var restUrl = app.globalData.restAdd + '/Hanbell-WCO/api/shbeam/equipmentrepair/getHitchDutyList';
      //var restUrl = app.globalData.restLocalAdd + '/Hanbell-WCO/api/shbeam/equipmentrepair/getRepairUserList';
      //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-WCO/api/shbeam/assetcardtest';
      // if (options.employeeid) {
      //     restUrl += '/f;users.id=' + options.employeeid + '/s';
      // }
      // else {
      //     restUrl += '/f/s';
      // }
      //restUrl += '/f;deptno=' + '13000' + '/s';
      restUrl += '/f;basicInfo=' + res + '/s';
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
          hitchDutyListDta = res.data;

          var dataLen = res.data.length;
          if(dataLen > 30){
            dataLen = 30;
          }

          for(var i = 0;i < dataLen; i++){
            let newItem = { userId: '', userName:'', dept: '', deptNo: '', phone:'', email: ''};
            newItem.userId = hitchDutyListDta[i].userid;
            newItem.userName = hitchDutyListDta[i].username;
            newItem.dept = hitchDutyListDta[i].dept == null ? '' : hitchDutyListDta[i].dept.dept;
            newItem.deptNo = hitchDutyListDta[i].dept == null ? '' : hitchDutyListDta[i].dept.deptno;
            newItem.phone = hitchDutyListDta[i].phone;
            newItem.email = hitchDutyListDta[i].email;
            _this.data.hitchDutyList.push(newItem);
          }

          _this.setData({
            hitchDutyList: _this.data.hitchDutyList
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

      //console.log(spareListItem);

      for(var i = 0 ; i< spareUsedList.length;i++){
        if(spareUsedList[i].Id == spareListItem.Id){
          _this.data.spareUsedList[i].qty = _this.data.spareUsedList[i].qty + 1;
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




    onHitchSort01CellTap:function(){
      this.showHitchSort01SelectorPopup();
    },

    onAbraseHitchCellTap:function(){
      this.showAbraseSelectorPopup();
    },
    
    onHitchTypeCellTap:function(){
      //console.log("123");
      this.showHitchTypeSelectorPopup();
    },

    onAuditContenctCellTap:function(){
      this.showContenctSelectorPopup();
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
   * 故障来源选择弹出层开启
   */
  showAbraseSelectorPopup: function(){
    this.setData({
      show:{abraseSelectorPopup:true}
    });
},

  /**
   * 故障来源选择弹出层关闭
   */
  closeAbraseSelectorPopup: function(){
    this.setData({
      show:{abraseSelectorPopup:false}
    });
  },

          /**
   * 故障来源选择弹出层开启
   */
  showContenctSelectorPopup: function(){
    this.setData({
      show:{contenctSelectorPopup:true}
    });
},

  /**
   * 故障来源选择弹出层关闭
   */
  closeContenctSelectorPopup: function(){
    this.setData({
      show:{contenctSelectorPopup:false}
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
   * 审批结果选择器事件
   */
  onContenctPickerChange: function(event){
    //console.log(event);
    const { picker, value, index } = event.detail;
    this.setData({
      auditContenctObj:value
    });
  },

  onContenctPickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      auditContenctObj:value
    });
    this.closeContenctSelectorPopup();
  },

  onContenctPickerCancel: function(event){
    this.closeContenctSelectorPopup();
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

  auditApproveFormSubmit: function(e){
    var that = this;
    //console.log(e);
    //console.log(this.data.uploaderList);
    const FileSystemManager = wx.getFileSystemManager();
    //console.log(this.data);
    //var canSubmit = this.checkFormDtaBeforeSubmit();
    var canSubmit = true;
    var apiTemp = '';
    if(this.data.rStatus == '60'){
      apiTemp = 'repairAuditApprove';
    }
    else if(this.data.rStatus == '70'){
      apiTemp = 'repairAuditExam';
    }
    
    if(e.currentTarget.dataset.btntype != null){
      apiTemp = apiTemp + '_' + e.currentTarget.dataset.btntype
    }
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
            url: app.globalData.restAdd + '/Hanbell-WCO/api/shbeam/equipmentrepair/' + apiTemp + '?' + app.globalData.restAuth,
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-WCO/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              id: that.data.docId,
              pid: that.data.docFormid,
              company: app.globalData.defaultCompany,
              userno:app.globalData.employeeId,
              contenct:that.data.auditContenctType,
              note:that.data.auditNote,
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
                   wx.navigateBack({delta: 3});
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
            url: app.globalData.restAdd + '/Hanbell-WCO/api/shbeam/equipmentrepair/uploadEqpRepairPic',
            method: 'POST',
            data: {
              company: 'C',
              pid: _this.data.docFormid,
              fileIndex: imageListIndex + 1,
              fileDta: obj,
              fileType: imageType,
              fileFrom: '维修图片'
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


    //console.log(options);

    this.setData({
      docId: options.docId,
      docFormid: options.docFormid,
      rStatus:options.rStatus,
      downTime:JSON.parse(options.eqpInfo).repairTime,
      repairTimestamp:JSON.parse(options.eqpInfo).repairTimestamp
    })

    let _this = this;
    //console.log("windowsHeightTemp:" + app.globalData.windowHeight);
    //let heightTemp = app.globalData.windowHeight;
    let heightTemp = app.globalData.screenHeight - 90 - app.globalData.statusBarHeight;
    heightTemp = heightTemp * 0.95 - 64;
    dateTemp = new Date();
    //console.log("heightTest:" + heightTemp);

    this.getRepairApproveInitDta(app.globalData.employeeId,this.data.docFormid);


    //写你自己的接口
    this.setData({
      docId: options.docId,
      docFormid: options.docFormid,
      eqpRepairInfoList: [JSON.parse(options.eqpInfo)],
      eqpListHeight : heightTemp,
      minDate: new Date(dateTemp.getFullYear() -1 ,dateTemp.getMonth(), 1).getTime(),
      maxDate: dateTemp.getTime(),
      currentDate: dateTemp.getTime(),
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

      /**
   * Fields数据绑定
   */
  bindExtraCost(event){
    let name = event.currentTarget.dataset.name;
    this.setData({
     [name]:event.detail
    })
    this.getTotalPrice();
  },

  dateFormatForFilter(date){
    let dateTemp = new Date(date);
    //console.log(event);
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

  getRepairApproveInitDta: function (userId,docFormid) {
    var _this = this;
    // restUrl = app.globalData.restAdd + '/Hanbell-WCO/api/shbeam/assetcardtest';
    var restUrl = app.globalData.restAdd + '/Hanbell-WCO/api/shbeam/equipmentrepair/getRepairHistoryDta';
    //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-WCO/api/shbeam/assetcardtest';
    // if (options.employeeid) {
    //     restUrl += '/f;users.id=' + options.employeeid + '/s';
    // }
    // else {
    //     restUrl += '/f/s';
    // }
    //restUrl += '/f;deptno=' + '13000' + '/s';
    // restUrl += '/f;repairuser=' + userId + ';';
    // restUrl += 'docId=' + docId + '/s';
    restUrl += '/f;docFormid=' + docFormid + '/s';
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

        if(res.data == "" || res.statusCode != 200){
          //console.log("no Data");
          wx.hideLoading();
          return;
        }
        
        if(res.data.length > 0){
          var repairHisListInfo = res.data[0];
          var eqpRepairInfo = res.data[0];
          var abraseHitchTemp = '';
          var hitchTypeTemp = '';
          
          for(var i= 0;i<repairHisListInfo.length;i++){
            let newItem = {pId:'', userNo: '', userName: '', creDate: '', contenct: ''};
            newItem.pId = repairHisListInfo[i].pid;
            newItem.userNo = repairHisListInfo[i].userno;
            newItem.userName = repairHisListInfo[i].username;
            newItem.creDate = _this.utcInit(repairHisListInfo[i].credate);
            newItem.contenct = repairHisListInfo[i].contenct;
            _this.data.repairHisList.push(newItem);
          }

          _this.setData({
            repairHisList: _this.data.repairHisList,
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

  utcInit: function(utc_datetime) {
    // 转为正常的时间格式 年-月-日 时:分:秒
    var T_pos = utc_datetime.indexOf('T');
    var Z_pos = utc_datetime.indexOf('Z');
    var year_month_day = utc_datetime.substr(0,T_pos);
    var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
    var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

    // 处理成为时间戳
    timestamp = new Date(Date.parse(new_datetime));
    timestamp = timestamp.getTime();
    timestamp = timestamp/1000;

    // 增加8个小时，北京时间比utc时间多八个时区
    var timestamp = timestamp+8*60*60;

    // 时间戳转为时间
    //var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");

    let dateTemp = new Date(parseInt(timestamp) * 1000);
    //console.log(event);
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

  onExceptTimeChange:function(e){
    //console.log(e);
    // var downTimestamp = this.data.repairTimestamp;;
    // downTimestamp = downTimestamp - e.detail * 3600000;
    // var downTimeTemp = this.timestampInit(downTimestamp);
    // this.setData({
    //   exceptTime:e.detail,
    //   downTime:downTimeTemp
    // });
    this.updateDownTime(e.detail);
  },

  updateDownTime:function(dta){
    //console.log(dta);
    var downTimestamp = this.data.repairTimestamp;;
    downTimestamp = downTimestamp - dta * 3600000;
    var downTimeTemp = this.timestampInit(downTimestamp);
    this.setData({
      exceptTime:dta,
      downTime:downTimeTemp
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
