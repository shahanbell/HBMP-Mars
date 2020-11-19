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
    collapseActiveNames: [],

    repairBasicInfoCardHeight: '400',
    arriveFlag:false,
    completeFlag:false,
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
    serviceUserList:[], 
    hitchDutyList:[],
    repairHisList:[],
    repairHelperList:[],
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
    showUpload:false,
    showDelete:false,
    showSpareEditBtn: false,
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
    },
    showTextArea:{
      hitchDesc:false,
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
    hitchDesc:'',
    hitchReason:'',
    repairProcess:'',
    measure:'',
    reRepairFlag: null,

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

  onTabChange(event){
    this.setData({
      auditTabActive: event.detail.index
    });
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


  // 删除图片
  clearImg:function(e){
    let _this = this;
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据
    var uploaderObjInfoList = this.data.uploaderObjInfoList;
    var nowObjInfoList = [];

    if(uploaderObjInfoList[e.currentTarget.dataset.index].fileId != null && uploaderObjInfoList[e.currentTarget.dataset.index].fileId != ''){
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/deleteAuditImageDta' + '?' + app.globalData.restAuth;
      //console.log(restUrl);
      wx.showLoading({
        title: '获取中...',
        mask: true
      });
      wx.request({
        url: restUrl,
        data: {
          id:uploaderObjInfoList[e.currentTarget.dataset.index].fileId,
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

          for (let i = 0; i < uploaderList.length;i++){
            if (i == e.currentTarget.dataset.index){
                continue;
            }else{
                nowList.push(uploaderList[i]);
                nowObjInfoList.push(uploaderObjInfoList[i]);
            }
          }
          _this.setData({
              uploaderNum: _this.data.uploaderNum - 1,
              uploaderList: nowList,
              uploaderObjInfoList: nowObjInfoList,
              showUpload: true
          })


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
      for (let i = 0; i < uploaderList.length;i++){
        if (i == e.currentTarget.dataset.index){
            continue;
        }else{
            nowList.push(uploaderList[i]);
            nowObjInfoList.push(uploaderObjInfoList[i]);
        }
      }
      this.setData({
          uploaderNum: this.data.uploaderNum - 1,
          uploaderList: nowList,
          uploaderObjInfoList: nowObjInfoList,
          showUpload: true
      })
    }
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
            let uploaderObjInfoList = that.data.uploaderObjInfoList.concat([{fileId:'',fileName:tempFilePaths[0],type:'0'}]);
            if (uploaderList.length==3){
                that.setData({
                    showUpload:false
                })
            }
            that.setData({
                uploaderList: uploaderList,
                uploaderObjInfoList: uploaderObjInfoList,
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
      // show:{
      //   eqpSelectorPopup: true
      // }
      auditTabActive: 2
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
      this.getSpareListInfo(res);
    },

    getSpareListInfo: function(res){
      let _this = this;
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairSpareList';
      //var restUrl = app.globalData.restLocalAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairUserList';
      //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
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
            newItem.unit = spareListDta[i].unit.id;
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
      // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getHitchDutyList';
      //var restUrl = app.globalData.restLocalAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairUserList';
      //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
      // if (options.employeeid) {
      //     restUrl += '/f;users.id=' + options.employeeid + '/s';
      // }
      // else {
      //     restUrl += '/f/s';
      // }
      //restUrl += '/f;deptno=' + '13000' + '/s';
      restUrl += '/f;basicInfo=' + res + '/s';
      restUrl += '/' + 0 + '/' + 20;
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
          //console.log(fail.data);
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
        if(spareUsedList[i].spareNo == spareListItem.spareNo){
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

    onAbraseHitchCellTap:function(){
      this.showAbraseSelectorPopup();
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
  onAbrasePickerChange: function(event){
    //console.log(event);
    const { picker, value, index } = event.detail;
    this.setData({
      abraseHitchObj:value
    });
  },

  onAbrasePickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      abraseHitchObj:value
    });
    this.closeAbraseSelectorPopup();
  },

  onAbrasePickerCancel: function(event){
    this.closeAbraseSelectorPopup();
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

  eqpRepairFormSubmit: function(e){
    var that = this;
    //console.log(e);
    //console.log(this.data.uploaderList);
    const FileSystemManager = wx.getFileSystemManager();
    //console.log(this.data);
    //var canSubmit = this.checkFormDtaBeforeSubmit();
    var canSubmit = true;
    var opedesc = e.currentTarget.dataset.opedesc;
    var restApiTemp = e.currentTarget.dataset.subtype;
    var errmsg = '';

    var jsonArrayTemp = [];
    jsonArrayTemp.push(that.data.spareUsedList);
    jsonArrayTemp.push(that.data.repairHelperList);
    console.log(jsonArrayTemp);

    if (!app.globalData.authorized) {
      canSubmit = false;
      errmsg += '账号未授权\r\n';
    }
    if (canSubmit) {
      Dialog.confirm({
        title: '系统提示',
        message: '确认' + opedesc + '吗?',
        mask: false,
        zIndex: 1000,
      })
        .then(() => {

          console.log(that.data);
          //console.log(app.globalData);

          // on confirm
          wx.showLoading({
            title: 'Sending',
            mask: true
          });
          var jsonArray = [];
          jsonArray.push(that.data.spareUsedList);
          jsonArray.push(that.data.repairHelperList);
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/' + restApiTemp + '?' + app.globalData.restAuth,
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              id: that.data.docId,
              formid: that.data.docFormid,
              company: app.globalData.defaultCompany,
              excepttime:that.data.exceptTime,
              stopworktime:that.data.stopWorkTime,
              hitchdutydeptno:that.data.hitchDutyDeptObj.hitchDutyDeptNo,
              hitchdutydeptname:that.data.hitchDutyDeptObj.hitchDutyDeptName,
              hitchdutyuser:that.data.hitchDutyUserObj.hitchDutyUserId,
              hitchdutyusername:that.data.hitchDutyUserObj.hitchDutyUserName,
              abrasehitch:that.data.abraseHitchObj.abraseHitchId,
              hitchtype:that.data.hitchTypeObj.hitchTypeCode,
              hitchsort1:that.data.hitchSort01Obj.troubleId,
              hitchdesc:that.data.hitchDesc,
              hitchalarm:that.data.hitchAlarm,
              hitchreason:that.data.hitchReason,
              repairmethod:that.data.repairMethod,
              repairprocess:that.data.repairProcess,
              measure:that.data.measure,
              sparecost:that.data.spareCost,
              repaircost:that.data.repairCost,
              laborcosts:that.data.laborCost,
              remark: JSON.stringify(jsonArray),
              optuser: that.data.reRepairFlag.toString(),
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
                if(that.data.uploaderList.length < 1){
                  //console.log("no image upload!");
                  wx.hideLoading();
                  Dialog.alert({
                  title: '系统消息',
                  message: opedesc + "成功",
                  }).then(() => {
                    // on close
                      wx.navigateBack({delta: 2});
                  });
                }
                else{
                  that.fileUpLoadByQueue(FileSystemManager,0);
                }
              }
              else{
                resMsg = '提交失败';
              }
              // Dialog.alert({
              //   title: '系统消息',
              //   zIndex: 1000,
              //   mask:false,
              //   message: resMsg,
              //     }).then(() => {
              //      // on close
              //      //initProInfo(_this);
              //      wx.navigateBack({delta: 2});
              //   });
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

  fileUpLoadByQueue:function(FileSystemManager,imageListIndex){
    if(imageListIndex == this.data.uploaderList.length){
      wx.hideLoading();
      wx.navigateBack({delta: 2});
      return ;
    }

    let _this = this;

    if(this.data.uploaderObjInfoList[imageListIndex].fileId != null && this.data.uploaderObjInfoList[imageListIndex].fileId != ''){
      if(imageListIndex < _this.data.uploaderList.length - 1){
        imageListIndex ++;
        _this.fileUpLoadByQueue(FileSystemManager,imageListIndex);
      }
      else{
          //console.log("all image upload success!");
          wx.hideLoading();
          Dialog.alert({
          title: '系统消息',
          message: "成功",
          }).then(() => {
            // on close
              initProInfo(_this);
              wx.navigateBack({delta: 2});
          });
      }
    }
    else{
      //console.log("now uploading the [" + imageListIndex + "] image");
      wx.showLoading({
        title: "图片[" + imageListIndex + "]上传中...",
        mask: true
      });
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
                    message: "成功",
                    }).then(() => {
                      // on close
                        initProInfo(_this);
                        wx.navigateBack({delta: 2});
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
      });
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
      downTimestamp:JSON.parse(options.eqpInfo).downTimestamp,
      repairTimestamp:JSON.parse(options.eqpInfo).repairTimestamp
    })

    let _this = this;
    //console.log("windowsHeightTemp:" + app.globalData.windowHeight);
    //let heightTemp = app.globalData.windowHeight;
    let heightTemp = app.globalData.screenHeight - 90 - app.globalData.statusBarHeight;
    heightTemp = heightTemp * 0.95 - 64;
    dateTemp = new Date();
    //console.log("heightTest:" + heightTemp);

    this.getRepairAuditInitDta(app.globalData.employeeId,this.data.docId);
    this.getRepairHisDta(app.globalData.employeeId,this.data.docFormid);

    //写你自己的接口
    this.setData({
      docId: options.docId,
      docFormid: options.docFormid,
      eqpRepairInfoList: [JSON.parse(options.eqpInfo)],
      eqpListHeight : heightTemp,
      minDate: new Date(dateTemp.getFullYear() -1 ,dateTemp.getMonth(), 1).getTime(),
      maxDate: dateTemp.getTime(),
      currentDate: dateTemp.getTime(),
      repairuser: app.globalData.employeeId,
      repairUserName: app.globalData.employeeName,
      //abraseHitchObj: _this.data.abraseHitchList[0],
      //hitchTypeObj:_this.data.hitchTypeList[0],
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
    console.log("total price start");
    // var spareListTemp = this.data.spareUsedList;
    // var totalPrice = 0;
    // var spareCostTemp = 0;
    // var repairCostTemp = isNaN(parseFloat(this.data.repairCost)) ? 0 : parseFloat(this.data.repairCost);
    // var laborCostTemp = isNaN(parseFloat(this.data.laborCost)) ? 0 : parseFloat(this.data.laborCost);
    // for(var i = 0 ; i < spareListTemp.length ; i++){
    //   totalPrice = totalPrice + spareListTemp[i].uPrice * spareListTemp[i].qty;
    // }
    // spareCostTemp = totalPrice;
    // totalPrice = (totalPrice + repairCostTemp + laborCostTemp).toFixed(2) * 100;
    // this.setData({
    //   totalPrice : totalPrice,
    //   spareCost : spareCostTemp,
    // });
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

  /**
   * Fields数据绑定
   */
  bindLaborTime(event){
    let name = event.currentTarget.dataset.name;
    this.setData({
     [name]:event.detail
    })
    this.updateLaborCost();
    this.getTotalPrice();
  },

  /**
   * Fields数据绑定
   */
  bindStopWorkTime(event){
    let _this = this;
    if(event.detail == null || event.detail == ''){
      this.setData({
        stopWorkTime: '0'
      });
      return;
    }
    if(isNaN(event.detail)){
      this.setData({
        stopWorkTime: _this.data.stopWorkTime
      });
      return;
    }
    let name = event.currentTarget.dataset.name;
    this.setData({
     [name]:parseInt(event.detail)
    })
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

  getRepairAuditInitDta: function (userId,docId) {
    var _this = this;
    // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairAuditInitDta';
    //var restUrl = 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/assetcardtest';
    // if (options.employeeid) {
    //     restUrl += '/f;users.id=' + options.employeeid + '/s';
    // }
    // else {
    //     restUrl += '/f/s';
    // }
    //restUrl += '/f;deptno=' + '13000' + '/s';
    // restUrl += '/f;repairuser=' + userId + ';';
    // restUrl += 'docId=' + docId + '/s';
    restUrl += '/f;docId=' + docId + '/s';
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
        
        if(res.data.length > 2){
          var dataFindFlag = 0;
          var eqpRepairInfo = res.data[0];
          var fileUploadList = res.data[3];
          var spareUsedList = res.data[4];
          var repairHelperList = res.data[5];
          console.log(repairHelperList);
          var abraseHitchList = _this.data.abraseHitchList;
          var abraseHitchObjTemp = abraseHitchList[0];
          var hitchSort01ObjTemp = null;
          var hitchTypeObjTemp = null;

          if(eqpRepairInfo.rstatus < "20"){
            _this.data.arriveFlag = false;
            _this.data.completeFlag = false;
            _this.data.repairBasicInfoCardHeight = '315'
          }
          else if(eqpRepairInfo.rstatus >= "20" && eqpRepairInfo.rstatus < "30"){
            _this.data.arriveFlag = true;
            _this.data.completeFlag = false;
            _this.data.repairBasicInfoCardHeight = '400'
          }
          else{
            _this.data.arriveFlag = true;
            _this.data.completeFlag = true;
            _this.data.repairBasicInfoCardHeight = '485'
          }

          for(var i = 0;i<abraseHitchList.length;i++){
            if(abraseHitchList[i].abraseHitchId == eqpRepairInfo.abrasehitch){
              abraseHitchObjTemp = abraseHitchList[i];
              break;
            }
          }

          for(var i = 0; i<res.data[1].length;i++){
            var itemTemp = {troubleId:res.data[1][i].troubleid,troubleName:res.data[1][i].troublename};
            if(dataFindFlag == 0){
              if(eqpRepairInfo.hitchsort1 == itemTemp.troubleId){
                hitchSort01ObjTemp = itemTemp;
                dataFindFlag = 1;
              }
            }
            _this.data.hitchSort01List.push(itemTemp);
          }
          if(hitchSort01ObjTemp == null && dataFindFlag == 0){
            hitchSort01ObjTemp = _this.data.hitchSort01List[0];
          }
          dataFindFlag = 0;

          for(var i = 0; i<res.data[2].length;i++){
            var itemTemp = {hitchTypeCode:res.data[2][i].cvalue,hitchTypeName:res.data[2][i].cdesc};
            if(dataFindFlag == 0){
              if(eqpRepairInfo.hitchtype == itemTemp.hitchTypeCode){
                hitchTypeObjTemp = itemTemp;
                dataFindFlag = 1;
              }
            }
            _this.data.hitchTypeList.push(itemTemp);
          }

          if(hitchTypeObjTemp == null && dataFindFlag == 0){
            hitchTypeObjTemp = _this.data.hitchTypeList[0];
          }


          var dataLen = res.data[3].length;
          var uploaderObjInfoList = [];
          var imagePathArray = [];
          if(dataLen >= 3){
            _this.data.uploaderNum = 3;
            _this.data.showUpload = false;
          }

          for(var i = 0;i < dataLen;i++){
            imagePathArray = imagePathArray.concat([app.globalData.restAdd + "/Hanbell-EAM/resources/app/res/" + fileUploadList[i].filename]);
            uploaderObjInfoList.push({fileId:fileUploadList[i].id,fileName:fileUploadList[i].filename,type:'1'});
          }

          for(var i = 0;i < spareUsedList.length; i++){
            let newItem = {id:'', spareNo: "A119-01", shopurl: "/images/1.jpg", origin: "TaoBao", orderstate: "", pictureurl: "/images/1.jpg", itemDisplayName: "备件名称", spareDesc: "副齿轮检验轴AA-2600I", productcount: 1, spareNum: "SDFA1111", uPrice:100, spareUserName: "技术员", userNo:'' , qty: 1};
            newItem.Id = '';
            newItem.docId = spareUsedList[i].id;
            newItem.spareNo = spareUsedList[i].spareno;
            newItem.spareDesc = spareUsedList[i].sparenum.sparedesc;
            newItem.spareNum = spareUsedList[i].sparenum.sparenum;
            newItem.uPrice = spareUsedList[i].uprice;
            newItem.brand = spareUsedList[i].brand;
            newItem.unit = spareUsedList[i].unit;
            newItem.qty = spareUsedList[i].qty;
            newItem.spareUserName = app.globalData.employeeName;
            newItem.userNo = app.globalData.employeeId;
            _this.data.spareUsedList.push(newItem);
          }

          for(var i = 0;i < repairHelperList.length; i++){
            if(repairHelperList[i].rtype != "0"){
              let newItem = {Id: '',Company:'',Pid:'',Seq:'',Rtype:'',CurNode:'',CurNode2:'',UserNo:''};
              newItem.Id = '';
              newItem.docId = repairHelperList[i].id;
              newItem.Company = repairHelperList[i].company;
              newItem.Pid = repairHelperList[i].pid;
              newItem.Seq = repairHelperList[i].seq;
              newItem.Rtype = repairHelperList[i].rtype;
              newItem.CurNode = repairHelperList[i].curnode;
              newItem.CurNode2 = repairHelperList[i].curnode2;
              newItem.UserNo = repairHelperList[i].userno;
              _this.data.repairHelperList.push(newItem);
            }
          }

          _this.setData({
            completeFlag: _this.data.completeFlag,
            arriveFlag: _this.data.arriveFlag,
            repairBasicInfoCardHeight: _this.data.repairBasicInfoCardHeight,
            //hitchDesc: res.data[0].hitchdesc,
            hitchSort01List : _this.data.hitchSort01List,
            //hitchSort01Obj: _this.data.hitchSort01List[0],
            hitchTypeList: _this.data.hitchTypeList,
            //hitchTypeObj: _this.data.hitchTypeList[0],


            exceptTime: eqpRepairInfo.excepttime == null ? '0' : eqpRepairInfo.excepttime,
            stopWorkTime: eqpRepairInfo.stopworktime == null ? '0' : eqpRepairInfo.stopworktime,
            hitchDutyDeptObj: {hitchDutyDeptName:eqpRepairInfo.hitchdutydeptname == null ? null : eqpRepairInfo.hitchdutydeptname,
                               hitchDutyDeptNo:eqpRepairInfo.hitchdutydeptno == null ? null : eqpRepairInfo.hitchdutydeptno},
            hitchDutyUserObj: {hitchDutyUserName:eqpRepairInfo.hitchdutyusername == null ? null : eqpRepairInfo.hitchdutyusername,
                               hitchDutyUserId:eqpRepairInfo.hitchdutyuser == null ? null : eqpRepairInfo.hitchdutyuser},
            abraseHitchObj: abraseHitchObjTemp,
            hitchTypeObj: hitchTypeObjTemp,
            reRepairFlag: eqpRepairInfo.remark == null ? 'false' : (eqpRepairInfo.remark == "true"),
            hitchDesc:eqpRepairInfo.hitchdesc == null ? '' : eqpRepairInfo.hitchdesc,
            hitchAlarm:eqpRepairInfo.hitchalarm == null ? '' : eqpRepairInfo.hitchalarm,
            hitchReason:eqpRepairInfo.hitchreason == null ? '' : eqpRepairInfo.hitchreason,
            repairMethod:eqpRepairInfo.repairmethod == null ? '' : eqpRepairInfo.repairmethod,
            repairProcess:eqpRepairInfo.repairprocess == null ? '' : eqpRepairInfo.repairprocess,
            measure:eqpRepairInfo.measure == null ? '' : eqpRepairInfo.measure,
            repairCost:eqpRepairInfo.repaircost == null ? '0' : eqpRepairInfo.repaircost,
            laborCost:eqpRepairInfo.laborcosts == null ? '0' : eqpRepairInfo.laborcosts,
            rStatus: eqpRepairInfo.rstatus == null ? '' : eqpRepairInfo.rstatus,
            hitchSort01Obj: hitchSort01ObjTemp,

            uploaderList:imagePathArray,
            uploaderObjInfoList:uploaderObjInfoList,
            spareUsedList: _this.data.spareUsedList,
            repairHelperList:_this.data.repairHelperList,

            uploaderNum: _this.data.uploaderNum,
            showUpload: _this.data.showUpload,
          });

          _this.updateDownTime(_this.data.exceptTime);
          _this.updateRepairTime(_this.data.exceptTime);
          _this.getTotalPrice();
        }


        wx.hideLoading();
      },
      fail: function (fail) {
        wx.hideLoading();
        //console.log(fail.data);
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

  getRepairHisDta: function (userId,docFormid) {
    var _this = this;
    // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairHistoryDta';
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
          
          for(var i= 0;i<repairHisListInfo.length;i++){
            let newItem = {pId:'', userNo: '', userName: '', creDate: '', contenct: '', note:''};
            newItem.pId = repairHisListInfo[i].pid;
            newItem.userNo = repairHisListInfo[i].userno;
            newItem.userName = repairHisListInfo[i].username;
            newItem.creDate = _this.utcInit(repairHisListInfo[i].credate);
            newItem.contenct = repairHisListInfo[i].contenct;
            newItem.note = repairHisListInfo[i].note;
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
    let _this = this;
    var exceptTimeTemp = e.detail;
    var downTimestamp = this.data.repairTimestamp == null ? parseInt('0') : this.data.repairTimestamp;
    if(e.detail == null || e.detail == ''){
      exceptTimeTemp = '0'
      this.setData({
        exceptTime: '0'
      });
    }
    else if(isNaN(e.detail)){
      exceptTimeTemp = this.data.exceptTime
      this.setData({
        exceptTime: _this.data.exceptTime
      });
    }
    else if(e.detail * 60000 > downTimestamp){
      exceptTimeTemp = '0'
      this.setData({
        exceptTime: '0',
      });
    }
    this.updateDownTime(parseInt(exceptTimeTemp));
    this.updateRepairTime(parseInt(exceptTimeTemp));
    this.getTotalPrice();
  },

  updateDownTime:function(dta){
    //console.log(dta);
    var downTimestamp = this.data.downTimestamp == null ? parseInt('0') : this.data.downTimestamp;
    downTimestamp = downTimestamp - dta * 60000;
    if(downTimestamp < 0){
      downTimestamp = 0;
    }
    var downTimeTemp = this.timestampInit_toHours(downTimestamp);
    this.setData({
      exceptTime:dta,
      downTime:downTimeTemp,
      //downTimestamp: downTimestamp
    });

    //this.updateLaborCost();
  },

  updateRepairTime:function(dta){
    //console.log(dta);
    var repairTimestamp = this.data.repairTimestamp == null ? parseInt('0') : this.data.repairTimestamp;
    repairTimestamp = repairTimestamp - dta * 60000;
    if(repairTimestamp < 0){
      repairTimestamp = 0;
    }
    var repairTimeTemp = this.timestampInit_toMinutes(repairTimestamp);
    this.setData({
      exceptTime:dta,
      repairTime:repairTimeTemp,
      //downTimestamp: downTimestamp
    });

    this.updateLaborCost();
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

  updateLaborCost:function(){
    // var repairHelperList = this.data.repairHelperList;
    // //var downTime_minute = this.data.downTime == null ? '0' : this.data.downTime;
    // var repairTime_minute = this.data.repairTime == null ? '0' : this.data.repairTime;
    // var totalTime = parseInt('0');
    // totalTime = totalTime + parseInt(repairTime_minute);
    // for(var i = 0;i < repairHelperList.length;i++){
    //   if(repairHelperList[i].rtype != "0"){
    //     totalTime = totalTime + (isNaN(parseInt(repairHelperList[i].UserNo)) ? 0 : parseInt(repairHelperList[i].UserNo));
    //   }
    // }
    // console.log(totalTime);
    // var laborCost = (totalTime * 0.7).toFixed(1);
    // this.setData({
    //   laborCost: laborCost
    // });
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
