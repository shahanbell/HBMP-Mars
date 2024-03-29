import Dialog from '../../../component/vant/dialog/dialog';
var app = getApp();
var util = require("../../../utils/eamCommonUtils.js");

var detailTotalCount = 0;
var detailDoneCount = 0;
var progressTagType = 'warning';
var analysisUserSelectIndex = -1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formReadOnly: true,
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
    expandFlag: false,
    suppleStartDateObj: {},
    suppleCompleteDateObj: {},
    analysisUserList: [],
    eqpMaintainDetailList: [],
    eqpMaintainDetailList_maintain: [],
    eqpMaintainDetailList_dispatch: [],
    maintainResult: [],
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
    var windowHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight;
      }
    });
   
    let heightTemp = app.globalData.screenHeight - 90 - app.globalData.statusBarHeight;
    heightTemp = heightTemp * 0.95 - 64;
    
    this.getEqpMaintainInitDta(options.docId);
    this.setData({
      detailListViewHeight: windowHeight - 10 - 44 - 44,
      userListHeight: heightTemp,
      progressInfo: {
        doneCount: detailDoneCount,
        totalCount: detailTotalCount,
        tagType: progressTagType
      }
    });
  },

  onCollapseCellClick(event) {
    // console.log(event);
    var index = event.currentTarget.dataset.selector;
    var eqpMaintainDetailList = this.data.eqpMaintainDetailList;
    var nowList = [];//新数据
  
    if(eqpMaintainDetailList[index].filePath!=null&&eqpMaintainDetailList[index].filePath!='')
    {
      //imagePathArray = imagePathArray.concat([app.globalData.restAdd + ":443/Hanbell-EAM/resources/app/res/" + pathArray.pop()]);
      // nowList=nowList.concat([app.globalData.restAdd + ":443/Hanbell-EAM/resources/app/res/" + eqpMaintainDetailList[index].filePath]);
      var pathArray = eqpMaintainDetailList[index].filePath.split("/");
      nowList = nowList.concat([app.globalData.restAdd + ":443/Hanbell-EAM/resources/app/res/" + pathArray.pop()]);
      eqpMaintainDetailList[index].uploadList=nowList;
     
    }

    var expandFlag = true;
    if (event.detail.length == 0) {
      expandFlag = false;
    }
    var activeNamesTemp = "activeNames[" + index + "]";
    var expandFlagTemp = "expandFlag[" + index + "]";

    //this.updateDetailDataStartDate(index);
    this.setData({
      [activeNamesTemp]: event.detail,
      eqpMaintainDetailList:eqpMaintainDetailList,
      [expandFlagTemp]: expandFlag,
      //activeNames:event.detail,
      //supplementFlag:supplementFlag,
      suppleStartDateObj: {},
      suppleCompleteDateObj: {},
      activeDateTemp: util.getNowDateStr()
    });
  },

  
  // 删除图片
  clearImg:function(e){
    var index =e.currentTarget.dataset.selector;
    // console.log(index);
    var eqpMaintainDetailList = this.data.eqpMaintainDetailList;
    eqpMaintainDetailList[index].filePath=null;
    eqpMaintainDetailList[index].uploadList=null;
    // for (let i = 0; i < uploaderList.length;i++){
    //     if (i == e.currentTarget.dataset.index){
    //         continue;
    //     }else{
    //         nowList.push(uploaderList[i])
    //     }
    // }
    this.setData({
        eqpMaintainDetailList:eqpMaintainDetailList,
    })
},
//展示图片
showImg2:function(e){
    var that=this;
    var index = e.currentTarget.dataset.selector;
    wx.previewImage({
       // urls: that.data.uploaderList,
        urls: that.data.eqpMaintainDetailList[index].filePath,
        current: that.data.eqpMaintainDetailList[index].filePath
       // current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
},
//上传图片
upload: function(e) {
  var that = this;
  //console.log("upload Test");
  var eqpMaintainDetailListTemp= this.data.eqpMaintainDetailList;
  var index = e.currentTarget.dataset.selector;
 
 
 
  wx.chooseImage({
      count: 3 - that.data.uploaderNum, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
      
          //console.log(that.data.uploaderNum);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
            eqpMaintainDetailListTemp[index].filePath=tempFilePaths[0];
          let uploaderList = that.data.uploaderList.concat(tempFilePaths);
          eqpMaintainDetailListTemp[index].uploadList=uploaderList
          if (eqpMaintainDetailListTemp[index]!=null||eqpMaintainDetailListTemp[index]!=''){
              that.setData({
                  showUpload:false,
                  eqpMaintainDetailList:eqpMaintainDetailListTemp
              })
          }
          that.setData({
              uploaderNum: uploaderList.length,
              eqpMaintainDetailList:eqpMaintainDetailListTemp,
          })
      }
  })
},
  onResultChange: function (e) {
  
    var index = e.currentTarget.dataset.selector;
    var resultTemp = "maintainResult[" + index + "]";
    var detailResultTemp = "eqpMaintainDetailList[" + index + "].result";
    var detailTagTypeTemp = "eqpMaintainDetailList[" + index + "].tagType";
    var tagTypeTemp = "warning";
    // if (e.detail == "正常") {
    //   tagTypeTemp = "success";
    // } else if (e.detail == "异常") {
    //   tagTypeTemp = "danger";
    // }
    tagTypeTemp = this.getTagType(e.detail);
    this.updateDetailDataEndDate(index);
    this.setData({
      [resultTemp]: e.detail,
      [detailResultTemp]: e.detail,
      [detailTagTypeTemp]: tagTypeTemp
    });
    this.updateFormProgressInfo();
    // Dialog.confirm({
    //     title: '系统提示',
    //     message: '展开下一项?',
    //     mask: false,
    //     zIndex: 1000,
    //   })
    //   .then(() => {
    //     var index_Next = index + 1;
    //     var activeNamesTemp = "activeNames[" + index + "]";
    //     var expandFlagTemp = "expandFlag[" + index + "]";
    //     var expandFlagTemp_Next = "expandFlag[" + index_Next + "]";
    //     var activeNamesTemp_Next = "activeNames[" + index_Next + "]";
    //     this.setData({
    //       [activeNamesTemp]: [],
    //       [expandFlagTemp]: false,
    //       [activeNamesTemp_Next]: [index_Next],
    //       [expandFlagTemp_Next]: true,
    //     })
    //   }).catch(() => {
    //     // on cancel
    //   });
  },

  onDispatchBtnClick:function(event){
    var _this = this;
    var dispatchModeTemp = this.data.dispatchMode;
    var dispatchBtnInfoTemp = this.data.dispatchBtnInfo;
    var submitBtnInfoTemp = this.data.submitBtnInfo;
    dispatchModeTemp = !dispatchModeTemp;
    if(dispatchModeTemp){
      dispatchBtnInfoTemp.type = 'info';
      dispatchBtnInfoTemp.name = '作业';
      submitBtnInfoTemp.type = 'warning';
      submitBtnInfoTemp.name = '派工';
      _this.data.eqpMaintainDetailList = this.data.eqpMaintainDetailList_dispatch;
    }
    else{
      dispatchBtnInfoTemp.type = 'warning';
      dispatchBtnInfoTemp.name = '派工';
      submitBtnInfoTemp.type = 'info';
      submitBtnInfoTemp.name = '提交';
      _this.data.eqpMaintainDetailList = this.data.eqpMaintainDetailList_maintain;
    }
    this.setData({
      dispatchMode: dispatchModeTemp,
      dispatchBtnInfo: dispatchBtnInfoTemp,
      submitBtnInfo: submitBtnInfoTemp,
      eqpMaintainDetailList: _this.data.eqpMaintainDetailList
    });
  },

  
  /**
   * 保养人信息单元格点击事件
   */
  onAnalysisUserCellTap: function(event){
    analysisUserSelectIndex = event.currentTarget.dataset.itemindex;
    this.setData({
      show:{
        analysisUserselectPopup: true
      }
    });
  },

  /**
   * 设备信息选择弹窗关闭事件
   */
  closeAnalysisUserSelectPopup: function(){
    //console.log("HitchDutyListClose!");
    this.setData({
      show:{
        analysisUserselectPopup: false
      }
    });
  },

  onAnalysisUserSelectBackClick: function(){
    this.closeAnalysisUserSelectPopup();
  },

  onAnalysisUserSelectResetClick(){
    //逻辑
    this.closeAnalysisUserSelectPopup();
  },

  eqpMaintainFormSubmit: function (event) {
    var dataTemp = this.data.eqpMaintainDetailList;
    var dispatchModeTemp = this.data.dispatchMode;
    const FileSystemManager = wx.getFileSystemManager();
    var nowList = [];//新数据//转换后的数据
     for (let i = 0; i < dataTemp.length;i++){
      var filepath =dataTemp[i].filePath ;
      filepath=filepath.substring(0,4)
        if(dataTemp[i].uploadList!=null){
          FileSystemManager.readFile({ //读文件
            filePath: dataTemp[i].uploadList[0],
            encoding: 'base64',
            success(res) {
              if (res.data) {
                var obj = res.data;
                dataTemp[i].filePath=obj;
              }
            },
            fail(err) {
              console.log('读取失败', err)
              reject(err)
            }
          })

        }
    }
    var apiName = 'autonomous-maintain-start';
    if(dispatchModeTemp){
      apiName = 'autonomous-maintain-dispatch';
    }

    var _this = this;
    //var canSubmit = this.checkFormDtaBeforeSubmit();
    var canSubmit = true;
    //var errmsg = '';

    var jsonArrayTemp = [];
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
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/eqpmaintenance/' + apiName + '?' + app.globalData.restAuth,
            data: {
              id: _this.data.infoCard.docId,
              formid: _this.data.infoCard.formId,
              company: app.globalData.defaultCompany,
              optuser: app.globalData.employeeId,
              upload:nowList,
              status: JSON.stringify(jsonArray),
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
                  wx.navigateBack({
                    delta: 1
                  });
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

  onAnalysisUserSearchStart:function(e){
    let res = e.detail;
    this.getAnalysisUserListInfo(res);
  },

  getAnalysisUserListInfo: function (res) {
    if(res==null || res=='')
      return;
    var _this = this;
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getHitchDutyList';
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

        var dataLen = res.data.length;
        if(dataLen > 30){
          dataLen = 30;
        }

        for(var i = 0;i < dataLen; i++){
          let newItem = { userId: '', userName:'', dept: '', deptNo: '', phone:'', email: ''};
          newItem.userId = res.data[i].userid;
          newItem.userName = res.data[i].username;
          newItem.dept = res.data[i].dept == null ? '' : res.data[i].dept.dept;
          newItem.deptNo = res.data[i].dept == null ? '' : res.data[i].dept.deptno;
          newItem.phone = res.data[i].phone;
          newItem.email = res.data[i].email;
          _this.data.analysisUserList.push(newItem);
        }

        _this.setData({
          analysisUserList: _this.data.analysisUserList
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

  updateFormProgressInfo: function () {
    var eqpMaintainDetailListTemp = this.data.eqpMaintainDetailList;
    detailTotalCount = eqpMaintainDetailListTemp.length;
    detailDoneCount = 0;
    progressTagType = 'warning';
    eqpMaintainDetailListTemp.forEach(function (element) {
      if (element.result == '异常') {
        progressTagType = 'danger';
        detailDoneCount = detailDoneCount + 1;
      } else if (element.result != '待检') {
        detailDoneCount = detailDoneCount + 1;
      }

      if (detailDoneCount == detailTotalCount && progressTagType != 'danger') {
        progressTagType = 'success';
      }
    });
    
    this.setData({
      progressInfo: {
        doneCount: detailDoneCount,
        totalCount: detailTotalCount,
        tagType: progressTagType
      }
    });
  },

  updateDetailDataStartDate: function (index) {
    var eqpMaintainDetailListTemp = this.data.eqpMaintainDetailList;
    if (eqpMaintainDetailListTemp[index].sDate == '' || eqpMaintainDetailListTemp[index].sDate == null) {
      eqpMaintainDetailListTemp[index].sDate = util.getNowDateStr();
      this.setData({
        eqpMaintainDetailList: eqpMaintainDetailListTemp
      });
    }
  },

  updateDetailDataEndDate: function (index) {
    var eqpMaintainDetailListTemp = this.data.eqpMaintainDetailList;
    var activeDateTemp = this.data.activeDateTemp;
    var nowDateStrTemp = util.getNowDateStr();
    if (eqpMaintainDetailListTemp[index].sDate == '' || eqpMaintainDetailListTemp[index].sDate == null) {
      eqpMaintainDetailListTemp[index].sDate = activeDateTemp;
    }
    eqpMaintainDetailListTemp[index].eDate = nowDateStrTemp;
    this.setData({
      eqpMaintainDetailList: eqpMaintainDetailListTemp,
      activeDateTemp: nowDateStrTemp
    });
  },

  getEqpMaintainInitDta: function (docId) {
    var _this = this;
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/eqpmaintenance/autonomous-maintain-detailinfo';
    restUrl += '/f;docId=' + docId + '/s';
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
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data == "" || res.statusCode != 200) {
          //console.log("no Data");
          wx.hideLoading();
          return;
        }

        if (res.data.length > 1) {
          var maintainInfoTemp = res.data[0];
          var maintainDetailListTemp = res.data[1];
          var autoMaintainFlag = maintainInfoTemp.standardlevel.indexOf("一级") > -1 ? true : false;
          // console.log(autoMaintainFlag);
          let newInfoItem = {
            docId: '',
            formId: '',
            deptName: '',
            displayType: '',
            assetDesc: '',
            assetFormId: '',
            pictureurl: '',
            isspotcheck: '',
            formDate: '',
            maintainUserId: '',
            maintainUserName: ''
          };
          newInfoItem.docId = docId;
          newInfoItem.formId = maintainInfoTemp.formid;
          newInfoItem.deptName = maintainInfoTemp.deptname;
          newInfoItem.displayType = '品名';
          newInfoItem.assetDesc = maintainInfoTemp.assetdesc;
          newInfoItem.assetFormId = maintainInfoTemp.assetno;
          newInfoItem.isspotcheck = maintainInfoTemp.isspotcheck;
          newInfoItem.pictureurl = app.globalData.restAdd + ":443/Hanbell-EAM/resources/app/res/CNCEQP_DefaultImage.jpg";
          newInfoItem.formDate = util.utcInit2Date(maintainInfoTemp.formdate);
          newInfoItem.maintainUserId = app.globalData.employeeId;
          newInfoItem.maintainUserName = app.globalData.employeeName;
          for (var i = 0; i < maintainDetailListTemp.length; i++) {
            let newItem = {
              Id: '',
              checkArea: '',
              checkContent: '',
              judgeStandard: '',
              method: '',
              methodName: '',
              areaImage:'',
              downTime: '',
              downUnit:'',
              result: '',
              tagType: '',
              exception: '',
              problemSolve: '',
              filePath: '',
              uploadList:[],
              sDate: '',
              eDate: ''
            };
            // console.log(maintainDetailListTemp);
            newItem.Id = maintainDetailListTemp[i].id;
            newItem.checkArea = maintainDetailListTemp[i].checkarea;
            newItem.checkContent = maintainDetailListTemp[i].checkcontent;
            newItem.judgeStandard = maintainDetailListTemp[i].judgestandard;
            newItem.method = maintainDetailListTemp[i].method;
            newItem.methodName = maintainDetailListTemp[i].methodname;
            newItem.areaImage = (maintainDetailListTemp[i].areaimage == null || maintainDetailListTemp[i].areaimage == '') ? '' : app.globalData.restAdd + ":443/Hanbell-EAM/" + maintainDetailListTemp[i].areaimage.replace(new RegExp('../../', 'g'), '');
            newItem.downTime = maintainDetailListTemp[i].downtime;
            newItem.downUnit = maintainDetailListTemp[i].downunit;
            newItem.exception = maintainDetailListTemp[i].exception == null ? '':maintainDetailListTemp[i].exception;
            newItem.problemSolve = maintainDetailListTemp[i].problemsolve == null ? '':maintainDetailListTemp[i].problemsolve;
            newItem.filePath = maintainDetailListTemp[i].filepath == null ? '':maintainDetailListTemp[i].filepath;
            newItem.uploadList = maintainDetailListTemp[i].uploadList == null ? null:maintainDetailListTemp[i].uploadList;
            newItem.sDate = maintainDetailListTemp[i].sdate == null ? '' : util.utcInit(maintainDetailListTemp[i].sdate);
            newItem.eDate = maintainDetailListTemp[i].edate == null ? '' : util.utcInit(maintainDetailListTemp[i].edate);
            newItem.analysisUser = maintainDetailListTemp[i].analysisuser == null ? '':maintainDetailListTemp[i].analysisuser;
            newItem.analysisUserName = maintainDetailListTemp[i].lastanalysisuser == null ? '':maintainDetailListTemp[i].lastanalysisuser;
            if (maintainDetailListTemp[i].analysisresult != null && (maintainDetailListTemp[i].analysisresult == '正常' || maintainDetailListTemp[i].analysisresult == '异常')) {
              newItem.result = maintainDetailListTemp[i].analysisresult;
              newItem.tagType = _this.getTagType(maintainDetailListTemp[i].analysisresult);
            } else {
              _this.data.formReadOnly = false;
              newItem.result = '待检';
              newItem.tagType = 'warning';
              _this.data.eqpMaintainDetailList_dispatch.push(newItem);
            }
            
            if(autoMaintainFlag || (maintainDetailListTemp[i].analysisuser != null && app.globalData.employeeId == maintainDetailListTemp[i].analysisuser)){
              _this.data.maintainResult.push(maintainDetailListTemp[i].analysisresult);
              _this.data.eqpMaintainDetailList_maintain.push(newItem);
            }
          }


          if(!autoMaintainFlag){
            _this.data.showItem.dispatchBtn = true;
          }

          _this.setData({
            formReadOnly: _this.data.formReadOnly,
            infoCard: newInfoItem,
            eqpMaintainDetailList_maintain:_this.data.eqpMaintainDetailList_maintain,
            eqpMaintainDetailList_dispatch:_this.data.eqpMaintainDetailList_dispatch,
            eqpMaintainDetailList: _this.data.eqpMaintainDetailList_maintain,
            maintainResult: _this.data.maintainResult,
            showItem: _this.data.showItem
          });
          _this.updateFormProgressInfo();
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

  getTagType: function (resultInfo) {
    switch (resultInfo) {
      case '待检':
        return 'warning';
      case '正常':
        return 'success';
      case '异常':
        return 'danger';
      default:
        return 'warning';
    }
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

  //展示图片
  showImg:function(e){
    //console.log(e);
    var currentImg = this.data.eqpMaintainDetailList[e.currentTarget.dataset.selector].areaImage;
    if(currentImg == null || currentImg == ''){
      currentImg = this.data.infoCard.pictureurl;
    }
    var imgUrls = new Array();
    imgUrls[0] = currentImg;
    wx.previewImage({
        urls: imgUrls,
        current: currentImg
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