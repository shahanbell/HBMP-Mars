// component/eqpDocList/eqpDocList.js
import Notify from '../../../component/vant/notify/notify';
import Dialog from '../../../component/vant/dialog/dialog';
var util = require("../../../utils/eamCommonUtils.js");
var app = getApp();
var searchBarHeight;
var topTabHeight;
var dateFilterType;
var tabClickFlag;
var hazardInspectionList;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    endHeight: {
      type: Number,
      value: 0
    },
    defaultFormType:{
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    nodataType: 3,
    enablePullDown: true,
    maintainDocList: [],    //订单列表数据，接口获取
    hazardInspectionListArray: [[],[],[]],
    currentPage: 1,
    isNoMoreData: false,
    orderState: null,
    winHeight: 400,
    currentTab: 0,     //当前显示tab的下标
    extraFilterValue:'', //查询页面主页搜索框
    navTab: ['待处理', '处理中', '全部'],
    navTabPro: [{value:'待处理',showScrollBar:true}, {value:'处理中',showScrollBar:false}, {value:'全部',showScrollBar:false}],
    loading: true,
    refreshTrigger: false,
    show:{
      filterPopup: false,
      dateFilterPopup: false,
      typeFilterPopup: false,
      dateSelector: false,
    },
    showDocEmpty: false,
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
    typeFilterData:[{typeDesc:'岗位安全自查单',typeCode:'GW'},
    {typeDesc:'班组日安全巡查单',typeCode:'JH'},
    {typeDesc:'所有',typeCode:null}],
    typeFilterObj: {typeDesc:'岗位安全自查单',typeCode:'GW'},
    typeFilterValue: "岗位安全自查单",
    barCodeId: null,
    docType: null,
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
        hiddenDocList: []
      })
  
    },

    onLoad(options) {
      this.setData({
        docType: options.docType,
      });
      this.getPostSecureInspectModel(this.data.docType);
    
    },
    switchNav(e) {  //点击 这个方法会触发bindChange()方法
      let isSelect = e.target.dataset.current;
      //console.log("switchNav");
      //console.log(isSelect);

      tabClickFlag = true;
      this.swiperChange(isSelect);
    },

  
    onSearchStart(){
      console.log("BBBBBBBBBBBB")
      this.getPostSecureInspectModel(this.data.docType);
      this.setData({
        refreshTrigger: false,
        showDocEmpty: false
      });
    },

//生成岗位自查单
createPostForm:function (index) {
  console.log("333")
  console.log(index)
      var apiName = 'createPost';
      var _this = this;
      if (!app.globalData.authorized) {
        canSubmit = false;
        errmsg += '账号未授权\r\n';
      }
      wx.showLoading({
        title: 'Sending',
        mask: true
      });

      wx.request({
        url: app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/' + apiName + '?' + app.globalData.restAuth,
        data: {
          post: index,
          company :app.globalData.defaultCompany,
          deptNo: app.globalData.defaultDeptId,
          deptName: app.globalData.defaultDeptName,
          referencespeciFications: app.globalData.defaultDeptName,
          createId:app.globalData.employeeId,
          updateId:app.globalData.employeeName,
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
       
          var resMsg = '';
            var resMsg = '';
            if(res.statusCode == 200 && res.data.msg != null){
             
              resMsg = '生成成功';
              _this.getPostSecureInspectModel(_this.data.docType);
              _this.setData({
             
              });
            }
            else{
              resMsg = '生成失败';
            }
         
         
            Dialog.alert({
              title: '系统消息',
              message: resMsg,
            }).then(() => {
              console.log("AAAAAAAAAAAAAAAAAAA")
                 wx.navigateBack({
                    delta: 0
                  });
              // on close
            });
            wx.hideLoading();
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
        
    },
      /**
   * 扫barcode
   */
   startScanCode: function () {
    var that = this;
    var post =null;
    // 允许从相机和相册扫码
    wx.scanCode({
      success(res) {
        that.createPostForm(res.result)//sheng
    
      }

    });
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
      if(this.data.hazardInspectionListArray[isSelect].length < 1){
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
      console.log("AAAAAAAAAAAAA");
      
      wx.navigateTo({
        url: '../safetymeasures/postSecureInspectDetail?docFormidId=' + e.currentTarget.dataset.item.id
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
        typeFilterValue: "岗位安全自查单",
        typeFilterObj: {typeDesc:'岗位安全自查单',typeCode:'BQ'},
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

    getPostSecureInspectModel: function (res) {
      var _this = this;
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/getPostSecureInspectModel';

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
      console.log(app.globalData)
        restUrl += '/f;patrolType=' + res;
      
        if(res=='班组巡查'||res=='安全员巡查')
        {
          var dept=app.globalData.defaultDeptId;
          dept=dept.substr(0, 2)
          restUrl += ';patrolDept=' + dept;
        }else{
          restUrl += ';patrolId=' + app.globalData.employeeId;
        }
       
        
        restUrl += ';company=' + app.globalData.defaultCompany;
      if(this.data.currentTab == '2'){
        restUrl += ';status=T';
      }
      if(this.data.currentTab == '0'){
        restUrl += ';status=S';
      }
      if(this.data.currentTab == '1'){
        restUrl += ';status=V';
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
          

          var currentTemp = _this.data.currentTab;
          var hazardInspectionListArrayTemp = "hazardInspectionListArray[" + currentTemp + "]";   //注意：这里不用写this.data.

          hazardInspectionList = null;
          // _this.setData({
          //   repairDocList: []
          // });

          _this.setData({
            [hazardInspectionListArrayTemp]: []
          });

          if(res.data == "" || res.statusCode != 200){
            //console.log("no Data");
            _this.setData({
              showDocEmpty: false
            });
            wx.hideLoading();
            return;
          }

          hazardInspectionList = res.data;
        console.log(hazardInspectionList)
          var dataLen = res.data.length;
          // if(dataLen > 10){
          //   dataLen = 10;
          // }
          for(var i = 0;i < dataLen; i++){
            let newItem = { id: "A119-01", origin: "normal", createTime: "", patrolId: "TaoBao", patrolName: "", patrolType: "",status:"" };
            newItem.id = hazardInspectionList[i].id;
            newItem.rstatus = _this.getDocStatus(hazardInspectionList[i].rstatus);
            newItem.createTime = util.utcInit(hazardInspectionList[i].createTime);
            newItem.patrolType = hazardInspectionList[i].patrolType;
            newItem.patrolId = hazardInspectionList[i].patrolId;
            newItem.patrolName = hazardInspectionList[i].patrolName;
            newItem.status = hazardInspectionList[i].status;
            _this.data.hazardInspectionListArray[currentTemp].push(newItem);
          }
          console.log( '2222')
          _this.setData({
            //repairDocList: _this.data.repairDocList,hazardInspectionListArray
            [hazardInspectionListArrayTemp]: _this.data.hazardInspectionListArray[currentTemp],
            
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
    getDocStatus: function(typeCode){
      switch(typeCode) {
        case "10":
            return "已提报";
        case "30":
            return "整改中";
        case "45":
            return "验收中";
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

  // lifetimes: {
  //   attached: function() {
  //     // 在组件实例进入页面节点树时执行
  //     this.initData(1);    //获取数据的方法
  //   },
    
  //   ready: function(){
  //     //视图层布局完成
  //     //this.getSearchBarRect();
  //     var typeFilterValueTemp = "岗位安全自查单";
  //     var typeFilterObjTemp = {typeDesc:'岗位安全自查单',typeCode:'BQ'};
  //     if(this.properties.defaultFormType == "JH"){
  //       typeFilterValueTemp = "计划保全单";
  //       typeFilterObjTemp = {typeDesc:'计划保全单',typeCode:'JH'};
  //     }
  //     this.getStartViewHeight();
  //     this.setData({
  //       typeFilterValue: typeFilterValueTemp,
  //       typeFilterObj: typeFilterObjTemp,
  //       deptFilterChecked: false,
  //       dateFilterChecked: false,
  //       startDateFilter: null,
  //       endDateFilter:null
  //     });
  //     this.onSearchStart();
  //     console.log('CCCCC')
  //   },
  //   detached: function() {
  //     // 在组件实例被从页面节点树移除时执行
  //   },
  // },

  // pageLifetimes: {
  //   // 组件所在页面的生命周期函数
  //   show: function () {
  //     //console.log('component show');
  //     this.onSearchStart();
  //     console.log('DDDD')
  //    },
  //   hide: function () { },
  //   resize: function () { },
  // },

})
