import Dialog from '../../../component/vant/dialog/dialog';
var app = getApp();
var util = require("../../../utils/eamCommonUtils.js");
const date = new Date()
const years = []
const months = []
const days = []
var detailTotalCount = 0;
var detailDoneCount = 0;
var progressTagType = 'warning';
var analysisUserSelectIndex = -1;
var dateTemp = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formReadOnly: false,
    userListHeight: null,
    nodataType: 7,
    showUpload:true,
    uploaderNum:0,
    uploaderList: [],
    activeNames: [],
    infoCard: {
      // formId: 'BQ21070003',
      // deptName: '圆型加工课',
      // displayType: '品名',
      // assetDesc: '加工机',
      // assetFormId: 'SA302-01-15-0028',
      // pictureurl: 'http://www.longlychina.com/UploadFiles/Product/20200622164756_87008.jpg'
    },
    detailListViewHeight: '0',
    expandFlag: true,
    tabActive: 0,
    reportPopup:false,
    suppleStartDateObj: {},
    suppleCompleteDateObj: {},
    analysisUserList: [],
    eqpMaintainDetailList: [],
    eqpMaintainDetailList_maintain: [],
    eqpMaintainDetailList_dispatch: [],
    maintainResult: [],
    patrolId : null,
    currentDate: new Date().getTime(), // 当前选中日期（时间戳）
    disabledDays: [ // 允许选择的日期列表（格式：YYYY-MM-DD）
      "2025-08-01", 
      "2025-08-15", 
      "2025-08-20"
    ],
    minDate: null,
    maxDate: null,
    presentingName : null,
    patrolPost : null,
    patrolDeptName : null,
    patrolType : null,
    boolRdpm :true,
    progressInfo: {
      doneCount: '0',
      totalCount: '0',
      tagType: 'warning'
    },
    activeDateTemp: null,
    showItem:{
      dispatchBtn:false
    },
    show:{
      analysisUserSelectPopup:false
    },
    dispatchMode: false,
    ReportingDate: null,
    dispatchBtnInfo: {
      type:'warning',
      name:'派工'
    },
    submitBtnInfo:{
      type:'info',
      name:'提交'
    },
   
  },

    
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
    var windowHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight;
      }
    });
    const ReportingDateItem =new Date().toISOString().substring(0, 10); // "2025-07-26"[5](@ref)
    console.log("ReportingDateItem")
    console.log(ReportingDateItem)
    let heightTemp = app.globalData.screenHeight - 90 - app.globalData.statusBarHeight;
    heightTemp = heightTemp * 0.95 - 64;
    this.getRdpmSubjectUserReportsModel(ReportingDateItem);
    
    this.setData({
      detailListViewHeight: windowHeight - 10 - 44 - 44,
      userListHeight: heightTemp,
      currentDate:new Date().getTime(),
      minDate: new Date(2025,6,21).getTime(),
     ReportingDate:ReportingDateItem,
      progressInfo: {
        doneCount: detailDoneCount,
        totalCount: detailTotalCount,
        tagType: progressTagType
      }
    });
  },


  closeSelectorPopup: function(event){
    this.setData({
      reportPopup:false
    });
  },
  showSelectorPopup: function(event){
    this.setData({
      reportPopup:true
    });
  },

 
  dateFormatForFilter(date){
    let dateTemp = new Date(date);
    let year = dateTemp.getFullYear();
    let month = dateTemp.getMonth() + 1;
    let day = dateTemp.getDate();

    if(month < '10'){
      month = "0" + month;
    }
  
    if(day < '10'){
      day = "0" + day;
    }
  
  

    let dayTemp = year + "-" + month + "-" + day ;
    return dayTemp;
  },
  onDatePickerConfirm: function(event){
    var _this = this;
    let dateTemp = _this.dateFormatForFilter(event.detail);
    _this.getRdpmSubjectUserReportsChangesModel(dateTemp, function(err, result) {;
    console.log(dateTemp)
    console.log(_this.data.boolRdpm)
   if(_this.data.boolRdpm){
    _this.setData({
      ReportingDate: dateTemp
    });
   }else{
    Dialog.alert({
      title: '系统消息',
      message: "选择的日期已进行汇报过，不能修改",
    })
    _this.getRdpmSubjectUserReportsModel(_this.data.ReportingDate);
   }
   _this.closeSelectorPopup(event);
  })
  },





   
  onBlurResult: function (e) {
   console.log("AAAA")
   
    // this.updateDetailDataEndDate(index);
    let name = e.currentTarget.dataset.name;
    let val =  e.detail.value.replace(/[^\d]/g, "").replace(/^0+/, "");
    e.detail.value = (parseInt(val) > 0) ? val : "0";
    this.setData({
      [name]: e.detail.value
    })
   
    this.updateFormProgressInfo();
  
  },

  updateFormProgressInfo: function () {
    var eqpMaintainDetailListTemp = this.data.eqpMaintainDetailList;
    detailTotalCount = eqpMaintainDetailListTemp.length;
    var sumSubjectWorkPercent = 0;
    var sumSubjectWorkPercentItem = 0;
    var SubjectWorkPercent01=0;
    eqpMaintainDetailListTemp.forEach(function (element) {
      if(element.subjectNo!='01')
      {
        sumSubjectWorkPercent+= parseInt(element.subjectWorkPercent) ;
        if(sumSubjectWorkPercent<100)
        {
          sumSubjectWorkPercentItem+=parseInt(element.subjectWorkPercent) ;

        }
      
        if(sumSubjectWorkPercent>100){
          element.subjectWorkPercent=0;
          sumSubjectWorkPercent=sumSubjectWorkPercentItem;
          Dialog.alert({
            title: '系统消息',
            message: "工作比例超过100%请重新确认",
          })
        return;
        }
      }
     else if(element.subjectNo=='01')
      {
        SubjectWorkPercent01= 100-sumSubjectWorkPercent ;
        element.subjectWorkPercent=SubjectWorkPercent01;
      }
    });
    console.log(SubjectWorkPercent01);
    this.setData({
      eqpMaintainDetailList:eqpMaintainDetailListTemp
    });
  },

  
  saveReportFormSubmit: function(e){
    var that = this;
    var bol=false;
    var eqpMaintainDetailListTemp = that.data.eqpMaintainDetailList;
    eqpMaintainDetailListTemp.forEach(function (element) {
      console.log(element.subjectNo)
     if(element.subjectNo=='01')
      {
        if(parseInt(element.subjectWorkPercent) >0)
        {
          console.log("sdfadfasd")
          bol=true;
        }
      }
    });
    if(bol){
      Dialog.alert({
        title: '系统消息',
        message: "非研发工作比例只能是0%",
        }).then(() => {
          // on close
        });
        return;
    }
    var jsonArrayTemp = [];
   
    jsonArrayTemp.push(that.data.eqpMaintainDetailList);

    console.log(jsonArrayTemp);
    var  canSubmit=true;
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
          jsonArray.push(that.data.eqpMaintainDetailList);
          console.log("AAA")
          console.log(jsonArray)
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/rdpm/saveReport' + '?' + app.globalData.restAuth+"&reportingDate="+that.data.ReportingDate+"",
            //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
            data: {
              jsonObj1: JSON.stringify(jsonArray),
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
                  //resMsg = '提交失败，请重试';
                  resMsg = res.data.msg;
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
                  message: "提交成功",
                  }).then(() => {
                    // on close
                      wx.navigateBack({delta: 1});
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
  
  /**
   * 信息单元格点击事件
   */
  onAnalysisUserCellTap: function(event){
    analysisUserSelectIndex = event.currentTarget.dataset.itemindex;
    this.setData({
      show:{
        analysisUserselectPopup: true
      }
    });
  },







  updateForm: function (index) {
    var dataTemp = this.data.eqpMaintainDetailList;
    var dispatchModeTemp = this.data.dispatchMode;
    var nowList = [];//新数据//转换后的数据
    var apiName = 'updateForm';

    var _this = this;
    var canSubmit = true;
    var jsonArrayTemp = [];
    console.log(_this.data.eqpMaintainDetailList)
    jsonArrayTemp.push(_this.data.eqpMaintainDetailList);
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
         // console.log(_this.data);
          wx.showLoading({
            title: 'Sending',
            mask: true
          });
          var jsonArray = [];
          jsonArray.push(_this.data.eqpMaintainDetailList);
        
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/' + apiName + '?' + app.globalData.restAuth,
            data: {
              id: _this.data.eqpMaintainDetailList[index].id,
              pid: _this.data.eqpMaintainDetailList[index].pid,
              company: _this.data.eqpMaintainDetailList[index].company,
              seq: _this.data.eqpMaintainDetailList[index].seq,
              project: _this.data.eqpMaintainDetailList[index].project,
              result: _this.data.eqpMaintainDetailList[index].result,
              hiddenDangerId: _this.data.eqpMaintainDetailList[index].hiddenDangerId,
              hiddenDangerId: _this.data.eqpMaintainDetailList[index].hiddenDangerId,
              createTime: _this.data.eqpMaintainDetailList[index].createTime,
              createId: _this.data.eqpMaintainDetailList[index].createId,
              updateId: app.globalData.employeeId,
          
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              wx.hideLoading();
              var resMsg = '';
             
              if (res.statusCode == 200 && res.data.msg != null) {
                resMsg = '提交成功';
                if (res.data.code != "200") {
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
                  message: "提交成功",
                }).then(() => {
                  // on close
                  // wx.navigateBack({
                  //   delta: 1
                  // });
                  console.log(_this.data.eqpMaintainDetailList[index].result)
                  if(_this.data.eqpMaintainDetailList[index].result=='异常')
                  {
                    wx.navigateTo({
                      url: '../safetymeasures/hiddenDangerDetail?docPid=' + _this.data.eqpMaintainDetailList[index].id+'&docType='+_this.data.patrolType
                    })
                  }
              
                });
              } else {
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
            textareaDisabled: false
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

  getRdpmSubjectUserReportsModel: function (docId) {
    var _this = this;
    _this.data.eqpMaintainDetailList_dispatch=[]
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/rdpm/getRdpmSubjectUserReportsModel';
    restUrl += '/f;pid=' + docId + '/s';
    restUrl += '/' + 0 + '/' + 20;
    // console.log("aaaaaa"+restUrl);
    wx.showLoading({
      title: '获取中...',
      mask: true
    });
    wx.request({
      url: restUrl,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken,
        rDate :docId,
        userId: app.globalData.employeeId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
      
        if (res.data == "" || res.statusCode != 200) {
          //console.log("no Data");
          wx.hideLoading();
          return;
        }
        console.log("res.data ")
        console.log(res.data )
        if (res.data.length > 1) {
          var maintainInfoTemp = res.data;
          var maintainDetailListTemp = res.data;
          console.log("res.data111 ")
          console.log(maintainDetailListTemp);
          var autoMaintainFlag =true;
          var expandFlag = true;
          var boolRdpmTemp=true;
          for (var i = 0; i < maintainDetailListTemp.length; i++) {
            if(maintainDetailListTemp[i].subjectNo=='01'&&parseInt(maintainDetailListTemp[i].subjectWorkPercent)!=100)
            {
              boolRdpmTemp=false;
              _this.setData({
                boolRdpm: boolRdpmTemp
              });
              console.log("AAAAAAAAA")
              console.log(_this.data.boolRdpm)
            
            }else if(maintainDetailListTemp[i].subjectNo=='01'&&parseInt(maintainDetailListTemp[i].subjectWorkPercent)==100){
              boolRdpmTemp=true;
              _this.setData({
                boolRdpm: boolRdpmTemp
              });
              console.log("BBBBBBBBB")
              console.log(_this.data.boolRdpm)
            
            }
            var activeNamesTemp = "activeNames[" + i + "]";
            var expandFlagTemp = "expandFlag[" + i + "]";
            let newItem = {
              id: '',
              subjectNo: '',
              subjectName: '',
              subjectUserNo: '',
              subjectUserName: '',
              uType: '',
              subjectWorkPercent: '',
              subjectWorkDateTime:''
            };
            newItem.subjectWorkDateTime = maintainDetailListTemp[i].subjectWorkDateTime;
            newItem.id = maintainDetailListTemp[i].id;
            newItem.subjectNo = maintainDetailListTemp[i].subjectNo;
            newItem.subjectName = maintainDetailListTemp[i].subjectName;
            newItem.subjectUserNo = maintainDetailListTemp[i].subjectUserNo;
            newItem.subjectUserName = maintainDetailListTemp[i].subjectUserName;
            newItem.uType = maintainDetailListTemp[i].uType;
            newItem.subjectWorkPercent = maintainDetailListTemp[i].subjectWorkPercent;
            _this.data.eqpMaintainDetailList_dispatch.push(newItem)
            _this.setData({
              [activeNamesTemp]: [i],
              [expandFlagTemp]: expandFlag,
            })
          }
          _this.setData({
            eqpMaintainDetailList: _this.data.eqpMaintainDetailList_dispatch,
            eqpMaintainDetailList_dispatch:[],
            maintainResult: _this.data.maintainResult,
            showItem: _this.data.showItem,
            boolRdpm: boolRdpmTemp
          });
          console.log(_this.data.eqpMaintainDetailList)
        }
        console.log(_this.data.eqpMaintainDetailList)
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


  getRdpmSubjectUserReportsChangesModel: function (docId, callback) {
    var _this = this;
    _this.data.eqpMaintainDetailList_dispatch=[]
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/rdpm/getRdpmSubjectUserReportsModel';
    restUrl += '/f;pid=' + docId + '/s';
    restUrl += '/' + 0 + '/' + 20;
    // console.log("aaaaaa"+restUrl);
    wx.showLoading({
      title: '获取中...',
      mask: true
    });
    wx.request({
      url: restUrl,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken,
        rDate :docId,
        userId: app.globalData.employeeId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
      
        if (res.data == "" || res.statusCode != 200) {
          //console.log("no Data");
          wx.hideLoading();
          return;
        }
        console.log("res.data ")
        console.log(res.data )
        if (res.data.length > 1) {
          var maintainInfoTemp = res.data;
          var maintainDetailListTemp = res.data;
          console.log("res.data111 ")
          console.log(maintainDetailListTemp);
          var autoMaintainFlag =true;
          var expandFlag = true;
          var boolRdpmTemp=true;
          for (var i = 0; i < maintainDetailListTemp.length; i++) {
            if(maintainDetailListTemp[i].subjectNo=='01'&&parseInt(maintainDetailListTemp[i].subjectWorkPercent)!=100)
            {
              boolRdpmTemp=false;
              _this.setData({
                boolRdpm: boolRdpmTemp
              });
              console.log("AAAAAAAAA")
              console.log(_this.data.boolRdpm)
            
            }else if(maintainDetailListTemp[i].subjectNo=='01'&&parseInt(maintainDetailListTemp[i].subjectWorkPercent)==100){
              boolRdpmTemp=true;
              _this.setData({
                boolRdpm: boolRdpmTemp
              });
              console.log("BBBBBBBBB")
              console.log(_this.data.boolRdpm)
            
            }
            var activeNamesTemp = "activeNames[" + i + "]";
            var expandFlagTemp = "expandFlag[" + i + "]";
            let newItem = {
              id: '',
              subjectNo: '',
              subjectName: '',
              subjectUserNo: '',
              subjectUserName: '',
              uType: '',
              subjectWorkPercent: '',
              subjectWorkDateTime:''
            };
            newItem.subjectWorkDateTime = maintainDetailListTemp[i].subjectWorkDateTime;
            newItem.id = maintainDetailListTemp[i].id;
            newItem.subjectNo = maintainDetailListTemp[i].subjectNo;
            newItem.subjectName = maintainDetailListTemp[i].subjectName;
            newItem.subjectUserNo = maintainDetailListTemp[i].subjectUserNo;
            newItem.subjectUserName = maintainDetailListTemp[i].subjectUserName;
            newItem.uType = maintainDetailListTemp[i].uType;
            newItem.subjectWorkPercent = maintainDetailListTemp[i].subjectWorkPercent;
            _this.data.eqpMaintainDetailList_dispatch.push(newItem)
            _this.setData({
              [activeNamesTemp]: [i],
              [expandFlagTemp]: expandFlag,
            })
          }
          _this.setData({
            eqpMaintainDetailList: _this.data.eqpMaintainDetailList_dispatch,
            eqpMaintainDetailList_dispatch:[],
            maintainResult: _this.data.maintainResult,
            showItem: _this.data.showItem,
            boolRdpm: boolRdpmTemp
          });callback(null, res.data);
          console.log(_this.data.eqpMaintainDetailList)
        }
        console.log(_this.data.eqpMaintainDetailList)
        wx.hideLoading();
      },
      fail: function (fail) {
        callback(fail); 
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


  analysisUserCardSelect:function(event){
    // console.log(event);
    var item = event.currentTarget.dataset.item;
    var userIdVarName = "eqpMaintainDetailList[" + analysisUserSelectIndex + "].analysisUser";
    var userNameVarName = "eqpMaintainDetailList[" + analysisUserSelectIndex + "].analysisUserName";
    this.setData({
      [userIdVarName]:item.userId,
      [userNameVarName]:item.userName
    });
    analysisUserSelectIndex = -1;
    this.closeAnalysisUserSelectPopup();
  },


  /**
   * Fields数据绑定
   */
  bindData(event) {
    let name = event.currentTarget.dataset.name;
    this.setData({
      [name]: event.detail
    })
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