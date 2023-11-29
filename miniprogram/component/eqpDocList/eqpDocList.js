// component/eqpDocList/eqpDocList.js
import Notify from '../../component/vant/notify/notify';
import Dialog from '../../component/vant/dialog/dialog';

var util = require("../../utils/eamCommonUtils.js");
var app = getApp();
var searchBarHeight;
var topTabHeight;
var bottomTabHeight;
var dateFilterType;
var tabClickFlag;
var repairDocListDta;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    endHeight: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    nodataType: 7,
    enablePullDown: true,
    repairDocList: [],    //订单列表数据，接口获取
    repairDocListArray: [[],[],[]],
    currentPage: 1,
    isNoMoreData: false,
    orderState: null,
    winHeight: 900,
    currentTab: 0,     //当前显示tab的下标
    extraFilterValue:'', //查询页面主页搜索框
    navTab: ['处理中', '全部', '已完成'],
    navTabPro: [{value:'处理中',showScrollBar:true}, {value:'全部',showScrollBar:false}, {value:'已完成',showScrollBar:false}],
    loading: true,
    refreshTrigger: false,
    show:{
      filterPopup: false,
      dateFilterPopup: false,
      statusFilterPopup: false,
      dateSelector: false,
    },
    showDocEmpty: true,

    date: null,
    currentDate: new Date().getTime(),
    minDate: new Date(new Date().getFullYear() -1 ,new Date().getMonth(), 1).getTime(),
    maxDate: new Date().getTime(),
    defaultDate: [new Date().getTime() ,new Date().getTime()],
    searchBarHeight: null,
    topTabHeight: null,
    bottomTabHeight: null,
    startDateFilter: null,
    endDateFilter: null,
    deptFilterChecked: false,
    dateFilterChecked: false,
    statusFilterData:[{statusDesc:'请选择',statusCode:null},
    {statusDesc:'已报修',statusCode:'10'},
    {statusDesc:'维修到达',statusCode:'20'},
    {statusDesc:'维修完成',statusCode:'30'},
    {statusDesc:'维修验收',statusCode:'40'},
    {statusDesc:'责任回复',statusCode:'50'},
    {statusDesc:'组长审核',statusCode:'55'},
    {statusDesc:'课长审核',statusCode:'60'},
    {statusDesc:'经理审核',statusCode:'70'},
    {statusDesc:'已结案',statusCode:'95'}],
    statusFilterObj: {statusDesc:'请选择',statusCode:null},
    statusFilterValue: "请选择",
    barCodeId: null,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData(currentPage) {

      //写你自己的接口
      this.setData({
        repairDocList: []
      })
  
    },
    switchNav(e) {  //点击 这个方法会触发bindChange()方法
      let isSelect = e.target.dataset.current;
      //console.log("switchNav");
      //console.log(isSelect);

      tabClickFlag = true;
      this.swiperChange(isSelect);
    },
  
    pullDownTest(){
      //console.log("test");

      this.getRepairDocListInfo(app.globalData.employeeId);

      this.setData({
        refreshTrigger: false,
        showDocEmpty: false
      });
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
    //this.getAssetInfo(res);
    Notify({ type: 'success', message: '扫码成功:'+ res });
  },
    bindChange(e) {    //切换swiper
      if(tabClickFlag){
        tabClickFlag = false;
        return;
      }
      let isSelect = e.detail.current;
      //console.log("bindChange");
      //console.log(isSelect);
      this.swiperChange(isSelect);
    },

    swiperChange(isSelect){
      if (isSelect != 0) {
        this.setData({
          orderState: isSelect
        })
      }
      else {
        this.setData({
          orderState: null
        })
      }

      var currentTemp = this.data.currentTab;
      var current = "navTabPro[" + isSelect + "].showScrollBar";   //注意：这里不用写this.data.
      var before = "navTabPro[" + currentTemp + "].showScrollBar";   //注意：这里不用写this.data.
      var showCurrent = true;
      var showBefore = false;
      if(current == before){
        showBefore = true;
      }

      //console.log("repairDocListArray_Length:" + this.data.repairDocListArray.length);
      var showEmpty = false;
      if(this.data.repairDocListArray[isSelect].length < 1){
        showEmpty = true;
      }

      this.setData({
        isNoMoreData: false,
        loading: true,
        currentTab: isSelect,
        //repairDocList: this.data.repairDocListArray[isSelect],
        //active: 'home',
        [current]: showCurrent,
        [before]: showBefore,
        showDocEmpty: showEmpty
      })

      //console.log(this.data);

      if(showEmpty){
        this.pullDownTest();
      }
      //this.initData(1)
    },

    docCardSelect(e) {
      //console.log(e);
      //console.log(e.currentTarget.dataset.item.shop);
      wx.navigateTo({
        url: '../eqpManagement/eqpRepairDocDetail?docFormidId=' + e.currentTarget.dataset.item.shop
      })
    },
  
    onTabbarChange(event){
      this.setData({ active: event.detail });
    },
    /**
    * 页面上拉触底事件的处理函数
    */
    onReachBottom: function () {    //上拉加载分页
      this.setData({
        loading: true
      })
      if (!this.data.isNoMoreData && this.data.repairDocList.length > 0) {
        this.initData(++this.data.currentPage);
      }
    },
  
  
    /**
     * 搜索栏右边按钮点击事件处理函数
     */
    onSearchRIconClick:function(){
        this.setData({
          show:{
            filterPopup : true,
          }
        });
  
        //console.log(this.data.show.filterPopup);
    },
  
    onSearchFilterButtonClick:function(){
      this.setData({
        show:{filterPopup:true}
      });
  
      wx.createSelectorQuery().select('#proBottomTab').boundingClientRect(function(rect){
        //console.log("test2: "+ rect.height);  // 节点的高度
        //let heightTemp = app.globalData.windowHeight-that.data.searchBarHeight-that.data.topTabHeight;
        //console.log("true height:" + heightTemp);
      }).exec();
    },
  
      /**
     * 数字选择弹出层关闭
     */
    closeSearchFilterPopup: function(){
      // console.log(filterPopupFlag);
      // if(filterPopupFlag){
      //   filterPopupFlag = false;
      //   return;
      // }
      this.setData({
        show:{filterPopup:false}
      });
    },
  
    // onDateSelectorDisplay() {
    //   //filterPopupFlag = true;
    //   this.setData({
    //      show:{dateSelector: true,filterPopup: true }
    //   });
    // },
    onDateSelectorClose() {
      this.setData({
        show:{
          dateSelector: false,
          filterPopup:true,
        }
     });
    },
    formatDate(date) {
      date = new Date(date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onDateSelectorConfirm(event) {
      const [start, end] = event.detail;
      this.setData({
        show: {
          dateSelector:false,
          filterPopup:true
        },
        date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
      });
    },
  
    getSearchBarRect () {
      let that = this;
      wx.createSelectorQuery().in(this).select('#proSearchBar').boundingClientRect(function(rect){
        // rect.id      // 节点的ID
        // rect.dataset // 节点的dataset
        // rect.left    // 节点的左边界坐标
        // rect.right   // 节点的右边界坐标
        // rect.top     // 节点的上边界坐标
        // rect.bottom  // 节点的下边界坐标
        // rect.width   // 节点的宽度 
        //console.log("test2: "+ rect.height);  // 节点的高度

        searchBarHeight = rect.height;
        that.getTopTabRect();
      }).exec();
    },
  
    getTopTabRect () {
      let that = this;
      wx.createSelectorQuery().in(this).select('#proTopTab').boundingClientRect(function(rect){
        //console.log("test2: "+ rect.height);  // 节点的高度
        topTabHeight = rect.height;
        that.getBottomTabRect();
      }).exec();
    },
  
    getBottomTabRect () {
      let that = this;
      let heightTemp = app.globalData.windowHeight - searchBarHeight - topTabHeight;
        //console.log("true height:" + heightTemp);
        that.setData({
          //bottomTabHeight: rect.height,
          winHeight : heightTemp
        });
    },
    onStartFilterTap(){
      //console.log("onStartFilterTap");
      dateFilterType = "startDateFilter";
      this.setData({
        show:{
          dateFilterPopup: true,
          filterPopup:true,
        }
      });
    },
  
    onEndFilterTap(){
      //console.log("onEndFilterTap");
      dateFilterType = "endDateFilter";
      this.setData({
        show:{
          dateFilterPopup: true,
          filterPopup:true,
        }
      });
    },
  
    closeDateFilterPopup(){
      //console.log("closeDateFilterPopup");
      dateFilterType = null;
      this.setData({
        show:{
          dateFilterPopup: false,
          filterPopup:true,
        }
      });
    },
  
    onDateFilterInput(event){
      let dateTemp = this.dateFormatForFilter(event.detail);
      //console.log(dateTemp);
      if(dateFilterType == null){
        return;
      }
      this.setData({
        //currentDate: event.detail,
        dateFilterChecked: true,
        [dateFilterType]: dateTemp
      });
    },
  
    onDateFilterConfirm(event){
      //console.log("onDateFilterConfirm");
      let dateTemp = this.dateFormatForFilter(event.detail);
      //console.log(dateFilterType + " " + dateTemp);
      if(dateFilterType == null){
        return;
      }
      this.setData({
        show:{
          dateFilterPopup: false,
          filterPopup:true,
        },
        dateFilterChecked: true,
        [dateFilterType]: dateTemp,
      });
    },
  
    onDateFilterCancel(event){
      //console.log("onDateFilterCancel");
      this.setData({
        show:{
          dateFilterPopup: false,
          filterPopup:true,
        },
        [dateFilterType]: null,
        deptFilterChecked:false,
        dateFilterChecked:false,
      });
    },

    onDeptFilterSwitchChange(event){
      //console.log("dateFilterSwitchChange " + event.detail);
      this.setData({
        deptFilterChecked: event.detail
      });
    },
  
    onDateFilterSwitchChange(event){
      //console.log("dateFilterSwitchChange " + event.detail);
      this.setData({
        dateFilterChecked: event.detail
      });
    },
  
    dateFormatForFilter(date){
      let dateTemp = new Date(date);
      //console.log(event);
      let year = dateTemp.getFullYear();
      let month = dateTemp.getMonth() + 1;
      let day = dateTemp.getDate();
      let dayTemp = year + "/" + month + "/" + day;
      return dayTemp;
    },
  
    onStatusFilterCellClick(event){
      //console.log("onStatusFilterCellClick");
      this.setData({
        show:{
          statusFilterPopup: true,
          filterPopup:true,
        }
      });
    },
  
    closeStatusFilterPopup(event){
      //console.log("closeStatusFilterPopup");
      this.setData({
        show:{
          statusFilterPopup:false,
          filterPopup:true,
        }
      });
    },
  
    onStatusFilterPickerChange(event){
      const { picker, value, index } = event.detail;
      //Toast(`当前值：${value}, 当前索引：${index}`);
      this.setData({
        statusFilterObj: value
      });
    },
  
    onStatusFilterPickerConfirm(event){
      //console.log("onStatusFilterPickerConfirm");
      this.setData({
        show:{
          statusFilterPopup:false,
          filterPopup:true,
        },
      });
    },
    
    onStatusFilterPickerCancel(event){
      //console.log("onStatusFilterPickerCancel");
      this.setData({
        show:{
          statusFilterPopup:false,
          filterPopup:true,
        },
      });
    },
  
    onFilterResetClick(event){
      //console.log("onFilterResetClick");
      this.setData({
        statusFilterValue: "请选择",
        statusFilterObj: {statusDesc:'请选择',statusCode:null},
        deptFilterChecked: false,
        dateFilterChecked: false,
        startDateFilter: null,
        endDateFilter:null
      });
    },
  
    onFilterConfirmClick(event){
      this.pullDownTest();
      //console.log("onFilterResetClick");
      this.setData({
        show:{filterPopup: false}
      });
    },

    getRepairDocListInfo: function (res) {
      var _this = this;
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairDocList';

      if(util.checkEqpRepairManager(app.globalData.employeeId)){
        var managerCompanyFilter = util.getRepairManagerCompanyFilter(app.globalData.employeeId);
        restUrl += '/f' + managerCompanyFilter;
      }
      else if(this.data.deptFilterChecked == true){
        if(util.checkEqpRepairDepartment(app.globalData.defaultDeptId)){
          var repairDeptCompanyFilter = util.getRepairDeptCompanyFilter(app.globalData.defaultDeptId);
          restUrl += '/f' + repairDeptCompanyFilter;
        }
        else{
          restUrl += '/f;repairdeptno=' + app.globalData.defaultDeptId;
        }
      }
      else if(util.checkEqpRepairDepartment(app.globalData.defaultDeptId)){
        restUrl += '/f;serviceuser=' + res;
      }
      else{
        restUrl += '/f;repairuser=' + res;
      }

      if(this.data.currentTab == '2'){
        restUrl += ';rstatus=95';
      }
      else if(this.data.statusFilterObj.statusCode != null &&  this.data.statusFilterObj.statusCode != ''){
        restUrl += ';rstatus=' + this.data.statusFilterObj.statusCode;
      }
      else if(this.data.currentTab == '0'){
        restUrl += ';ALL=ALL';
      }

      if(this.data.dateFilterChecked == true){
        if(this.data.startDateFilter != null && this.data.startDateFilter != ''){
          var startDateTemp = this.data.startDateFilter.replace(new RegExp('/', 'g'), '-');
          if(startDateTemp != ''){
            restUrl += ';formdateBegin=' + startDateTemp;
          }
        }
        if(this.data.endDateFilter != null && this.data.endDateFilter != ''){
          var endtDateTemp = this.data.endDateFilter.replace(new RegExp('/', 'g'), '-');
          if(endtDateTemp != ''){
            restUrl += ';formdateEnd=' + endtDateTemp;
          }
        }
      }

      //查询页面主页搜索框
      if(this.data.extraFilterValue != '' && this.data.extraFilterValue != null){
        restUrl += ';ExtraFilter=' + this.data.extraFilterValue;
      }

      //restUrl += '/f;ALL=ALL/s';
      restUrl += '/s/' + 0 + '/' + 20;
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

          var currentTemp = _this.data.currentTab;
          var repairDocListArrayTemp = "repairDocListArray[" + currentTemp + "]";   //注意：这里不用写this.data.

          repairDocListDta = null;
          // _this.setData({
          //   repairDocList: []
          // });

          _this.setData({
            [repairDocListArrayTemp]: []
          });

          if(res.data == "" || res.statusCode != 200){
            //console.log("no Data");
            _this.setData({
              showDocEmpty: true
            });
            wx.hideLoading();
            return;
          }

          repairDocListDta = res.data;
          var dataLen = res.data.length;
          // if(dataLen > 10){
          //   dataLen = 10;
          // }

          for(var i = 0;i < dataLen; i++){
            let newItem = { shop: "A119-01", shopurl: "/images/1.jpg", origin: "TaoBao", orderstate: "", pictureurl: "/images/1.jpg", couponname: "", orderdtt: "副齿轮检验轴AA-2600I", productcount: 1, ordernum: "202054654654466", type: "维修", payamount: "技术员",remark:"MC" };
            newItem.shop = repairDocListDta[i].formid;
            newItem.orderstate = _this.getDocStatus(repairDocListDta[i].rstatus);
            newItem.orderdtt = repairDocListDta[i].assetno == null ? '其他设备' : repairDocListDta[i].assetno.assetDesc;
            newItem.couponname = '品名';
            newItem.productcount = repairDocListDta[i].assetno == null ? '1' : repairDocListDta[i].assetno.qty;
            newItem.ordernum = util.utcInit(repairDocListDta[i].hitchtime);
            newItem.payamount = repairDocListDta[i].repairusername;
            newItem.remark = repairDocListDta[i].assetno == null ? '1': repairDocListDta[i].assetno.remark;
            _this.data.repairDocListArray[currentTemp].push(newItem);
          }

          _this.setData({
            //repairDocList: _this.data.repairDocList,
            [repairDocListArrayTemp]: _this.data.repairDocListArray[currentTemp],
          });

          //console.log(_this.data.repairDocListArray);

          wx.hideLoading();
        },
        fail: function (fail) {
          wx.hideLoading();
          //console.log(fail.data);
          // Dialog.alert({
          //   title: '系统消息',
          //   message: '检测到系统已离线，请重新登录!',
          // }).then(() => {
          //   // on close
          //   //initProInfo(_this);
          //   wx.reLaunch({
          //     url: '../eqpManagement/eqpManageIndex'
          //   })
          // });
        }
      });
    },

    getStartViewHeight(){
      let that = this;
      wx.createSelectorQuery().in(this).select('#start').boundingClientRect(function(rect){
        //console.log("test2: "+ rect.bottom);  // 节点的高度
        //console.log(rect);
        //console.log("endHeight" + that.properties.endHeight);
        let heightTemp = that.properties.endHeight-rect.bottom;
        heightTemp = parseInt(heightTemp);
        that.setData({
          winHeight:heightTemp
        });
      }).exec();
    },
    
    getDocStatus: function(statusCode){
      switch(statusCode) {
        case "10":
            return "已报修";
        case "15":
            return "已受理";
        case "20":
            return "维修到达";
        case "25":
            return "维修中";
        case "28":
            return "维修暂停";
        case "30":
            return "维修完成";
        case "40":
            return "维修验收";
        case "50":
            return "责任回复";
            case "55":
              return "组长审核";
        case "60":
            return "课长审核";
        case "70":
            return "经理审核";
        case "95":
            return "报修结案";
        case "98":
            return "已作废";
        default:
            return;
      } 
    },
    getDocStatusCodeByTabId: function(currentTab){
      switch(currentTab) {
        case "1":
            return '';
        case "0":
            return 'ALL';
        case "2":
            return '95';
        default:
            return;
      }
    },
    utcInit: function(utc_datetime) {
      if(utc_datetime == null || utc_datetime == ''){
        return;
      }
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
    /**
     * Fields数据绑定
     */
    bindData(event){
      let name = event.currentTarget.dataset.name;
      this.setData({
      [name]:event.detail
      })
    }
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.initData(1);    //获取数据的方法
    },
    ready: function(){
      //视图层布局完成
      //this.getSearchBarRect();
      var statusFilterValueTemp = "请选择";
      var statusFilterObjTemp = {statusDesc:'请选择',statusCode:null};
      this.getStartViewHeight();
      if(app.globalData.defaultDeptId.indexOf("1P000") >= 0){
        statusFilterValueTemp = "经理审核";
        statusFilterObjTemp = {statusDesc:'经理审核',statusCode:'70'};
      }
      this.setData({
        statusFilterValue: statusFilterValueTemp,
        statusFilterObj: statusFilterObjTemp,
        deptFilterChecked: false,
        dateFilterChecked: false,
        startDateFilter: null,
        endDateFilter:null
      });
      this.pullDownTest();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      //console.log('component show');
      this.pullDownTest();
     },
    hide: function () { },
    resize: function () { },
  },

})
