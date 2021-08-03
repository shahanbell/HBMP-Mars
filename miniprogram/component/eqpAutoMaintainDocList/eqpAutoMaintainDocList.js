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
var maintainDocListDta;

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
    maintainDocList: [],    //订单列表数据，接口获取
    maintainDocListArray: [[],[],[]],
    currentPage: 1,
    isNoMoreData: false,
    orderState: null,
    winHeight: 900,
    currentTab: 0,     //当前显示tab的下标
    extraFilterValue:'', //查询页面主页搜索框
    navTab: ['待实施', '实施中', '已完成'],
    navTabPro: [{value:'待实施',showScrollBar:true}, {value:'实施中',showScrollBar:false}, {value:'已完成',showScrollBar:false}],
    loading: true,
    refreshTrigger: false,
    show:{
      filterPopup: false,
      dateFilterPopup: false,
      typeFilterPopup: false,
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
    typeFilterData:[{typeDesc:'自主保全单',typeCode:'BQ'},
    {typeDesc:'计划保全单',typeCode:'JH'},
    {typeDesc:'所有',typeCode:null}],
    typeFilterObj: {typeDesc:'自主保全单',typeCode:'BQ'},
    typeFilterValue: "自主保全单",
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
        maintainDocList: []
      })
  
    },
    switchNav(e) {  //点击 这个方法会触发bindChange()方法
      let isSelect = e.target.dataset.current;
      //console.log("switchNav");
      //console.log(isSelect);

      tabClickFlag = true;
      this.swiperChange(isSelect);
    },
  
    onSearchStart(){

      this.getMaintainDocListInfo(app.globalData.employeeId);
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

      var showEmpty = false;
      if(this.data.maintainDocListArray[isSelect].length < 1){
        showEmpty = true;
      }

      this.setData({
        isNoMoreData: false,
        loading: true,
        currentTab: isSelect,
        //active: 'home',
        [current]: showCurrent,
        [before]: showBefore,
        showDocEmpty: showEmpty
      })

      //console.log(this.data);

      if(showEmpty){
        this.onSearchStart();
      }
      //this.initData(1)
    },

    docCardSelect(e) {
      console.log(e);
      //console.log(e.currentTarget.dataset.item.shop);
      wx.navigateTo({
        url: '../maintenanceManagement/eqpMaintainStart?docId=' + e.currentTarget.dataset.item.Id
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
      if (!this.data.isNoMoreData && this.data.maintainDocList.length > 0) {
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
  
    onTypeFilterCellClick(event){
      //console.log("onTypeFilterCellClick");
      this.setData({
        show:{
          typeFilterPopup: true,
          filterPopup:true,
        }
      });
    },
  
    closeTypeFilterPopup(event){
      //console.log("closeTypeFilterPopup");
      this.setData({
        show:{
          typeFilterPopup:false,
          filterPopup:true,
        }
      });
    },
  
    onTypeFilterPickerChange(event){
      const { picker, value, index } = event.detail;
      //Toast(`当前值：${value}, 当前索引：${index}`);
      this.setData({
        typeFilterObj: value
      });
    },
  
    onTypeFilterPickerConfirm(event){
      //console.log("ontypeFilterPickerConfirm");
      this.setData({
        show:{
          typeFilterPopup:false,
          filterPopup:true,
        },
      });
    },
    
    onTypeFilterPickerCancel(event){
      //console.log("ontypeFilterPickerCancel");
      this.setData({
        show:{
          typeFilterPopup:false,
          filterPopup:true,
        },
      });
    },
  
    onFilterResetClick(event){
      //console.log("onFilterResetClick");
      this.setData({
        typeFilterValue: "自主保全单",
        typeFilterObj: {typeDesc:'自主保全单',typeCode:'BQ'},
        deptFilterChecked: false,
        dateFilterChecked: false,
        startDateFilter: null,
        endDateFilter:null
      });
    },
  
    onFilterConfirmClick(event){
      this.onSearchStart();
      //console.log("onFilterResetClick");
      this.setData({
        show:{filterPopup: false}
      });
    },

    getMaintainDocListInfo: function (res) {
      var _this = this;
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/eqpmaintenance/autonomous-maintain-tasks';

      if(app.globalData.defaultDeptId.indexOf("1P000") >= 0){
        restUrl += '/f';
      }
      else if(this.data.deptFilterChecked == false){
        if(app.globalData.defaultDeptId.indexOf("1W3") >= 0){
          restUrl += '/f';
        }
        else{
          restUrl += '/f;deptno=' + app.globalData.defaultDeptId;
        }
      }
      else{
        restUrl += '/f';
      }

      if(this.data.currentTab == '2'){
        restUrl += ';status=V';
      }
      else if(this.data.currentTab == '1'){
        restUrl += ';status=S';
      }
      else if(this.data.currentTab == '0'){
        restUrl += ';status=N';
      }

      if(this.data.typeFilterObj.typeCode != null &&  this.data.typeFilterObj.typeCode != ''){
        restUrl += ';MaintainType=' + this.data.typeFilterObj.typeCode;
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
          console.log(res);

          var currentTemp = _this.data.currentTab;
          var maintainDocListArrayTemp = "maintainDocListArray[" + currentTemp + "]";   //注意：这里不用写this.data.

          maintainDocListDta = null;

          _this.setData({
            [maintainDocListArrayTemp]: []
          });

          if(res.data == "" || res.statusCode != 200){
            //console.log("no Data");
            _this.setData({
              showDocEmpty: true
            });
            wx.hideLoading();
            return;
          }

          maintainDocListDta = res.data;
          var dataLen = res.data.length;

          for(var i = 0;i < dataLen; i++){
            let newItem = {Id:"",docType:"", docId: "A119-01", origin: "normal", docState: "", pictureurl: "https://jrs.hanbell.com.cn:443/Hanbell-EAM/resources/app/res/CNCEQP_DefaultImage.jpg", locationText: "", slocation: "副齿轮检验轴AA-2600I", sarea: "", credate: "202054654654466", type: "维修", creator: "技术员" };
            newItem.Id = maintainDocListDta[i].id;
            newItem.docType = util.getEqpMaintainFormType(maintainDocListDta[i].formid);
            newItem.docId = maintainDocListDta[i].formid;
            newItem.docState = _this.getDocStatus(maintainDocListDta[i].status);
            newItem.assetNo = maintainDocListDta[i].assetno == null ? '无' : maintainDocListDta[i].assetno;
            newItem.assetNoText = '资产编号';
            newItem.analysisResult = maintainDocListDta[i].analysisresult == null ? ' ' : maintainDocListDta[i].analysisresult;
            newItem.formDate = util.utcInit2Date(maintainDocListDta[i].formdate);
            newItem.deptName = maintainDocListDta[i].deptname;
            _this.data.maintainDocListArray[currentTemp].push(newItem);
          }


          _this.setData({
            //maintainDocList: _this.data.maintainDocList,
            [maintainDocListArrayTemp]: _this.data.maintainDocListArray[currentTemp],
          });

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
    getDocStatus: function(typeCode){
      switch(typeCode) {
        case "N":
            return "待实施";
        case "S":
            return "实施中";
        case "V":
            return "已完成";
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
      var typeFilterValueTemp = "自主保全单";
      var typeFilterObjTemp = {typeDesc:'自主保全单',typeCode:'BQ'};
      this.getStartViewHeight();
      this.setData({
        typeFilterValue: typeFilterValueTemp,
        typeFilterObj: typeFilterObjTemp,
        deptFilterChecked: false,
        dateFilterChecked: false,
        startDateFilter: null,
        endDateFilter:null
      });
      this.onSearchStart();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      //console.log('component show');
      this.onSearchStart();
     },
    hide: function () { },
    resize: function () { },
  },

})
