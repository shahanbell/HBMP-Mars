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
    suppleStartDateObj: {},
    suppleCompleteDateObj: {},
    analysisUserList: [],
    eqpMaintainDetailList: [],
    eqpMaintainDetailList_maintain: [],
    eqpMaintainDetailList_dispatch: [],
    maintainResult: [],
    patrolId : null,
    presentingName : null,
    patrolPost : null,
    patrolDeptName : null,
    patrolType : null,
    
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
    console.log(options)
    var windowHeight = 0;
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight;
      }
    });
    let heightTemp = app.globalData.screenHeight - 90 - app.globalData.statusBarHeight;
    heightTemp = heightTemp * 0.95 - 64;
    this.getPostSecureInspectDtaModel(options.docFormidId);
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
  
    // if(eqpMaintainDetailList[index].filePath!=null&&eqpMaintainDetailList[index].filePath!='')
    // {
    //   imagePathArray = imagePathArray.concat([app.globalData.restAdd + ":443/Hanbell-EAM/resources/app/res/" + pathArray.pop()]);
    //   nowList=nowList.concat([app.globalData.restAdd + ":443/Hanbell-EAM/resources/app/res/" + eqpMaintainDetailList[index].filePath]);
    //   var pathArray = eqpMaintainDetailList[index].filePath.split("/");
    //   nowList = nowList.concat([app.globalData.restAdd + ":443/Hanbell-EAM/resources/app/res/" + pathArray.pop()]);
    //   eqpMaintainDetailList[index].uploadList=nowList;
     
    // }
    console.log(this.data.expandFlag)
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
    console.log(index)
    this.updateForm(index);
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

getPostSecureInspectDtaModel: function (docId) {
    var _this = this;
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/getPostSecureInspectDtaModel';
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
        token: app.globalData.restToken
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

        if (res.data.length > 1) {
          var maintainInfoTemp = res.data[0];
          var maintainDetailListTemp = res.data[1];
          console.log(maintainDetailListTemp);
          var autoMaintainFlag =true;
           console.log(res.data);
          let newInfoItem = {
            id: '',
            pid: '',
            project: '',
            result: '',
            patrolDept: '',
            patrolDeptName: '',
            patrolId: '',
            patrolName: '',
            patrolType: '',
            patrolPost: '',
          };
          newInfoItem.id = maintainInfoTemp[0].id;
          newInfoItem.patrolDept = maintainInfoTemp[0].patrolDept;
          _this.data.patrolDeptName = maintainInfoTemp[0].patrolDeptName;
          newInfoItem.result = maintainInfoTemp[0].result;
          _this.data.patrolId = maintainInfoTemp[0].patrolId;
          _this.data.patrolName = maintainInfoTemp[0].patrolName;
           _this.data.patrolPost = maintainInfoTemp[0].patrolPost;
           _this.data.patrolType = maintainInfoTemp[0].patrolType;
          var expandFlag = true;
          for (var i = 0; i < maintainDetailListTemp.length; i++) {
            var activeNamesTemp = "activeNames[" + i + "]";
            var expandFlagTemp = "expandFlag[" + i + "]";
            let newItem = {
              id: '',
              pid: '',
              company:'',
              seq:'',
              project: '',
              result: '',
              hiddenDangerId: '',
              createTime: '',
              createId: '',
            };
            newItem.id = maintainDetailListTemp[i].id;
            newItem.pid = maintainDetailListTemp[i].pid;
            newItem.company = maintainDetailListTemp[i].company;
            newItem.seq = maintainDetailListTemp[i].seq;
            newItem.createTime = maintainDetailListTemp[i].createTime;
            newItem.createId = maintainDetailListTemp[i].createId;
            newItem.project = maintainDetailListTemp[i].project;
            newItem.result = maintainDetailListTemp[i].result;
            newItem.hiddenDangerId = maintainDetailListTemp[i].hiddenDangerId;
            _this.data.maintainResult.push(maintainDetailListTemp[i].result);
            _this.data.eqpMaintainDetailList_dispatch.push(newItem)
            _this.setData({
              [activeNamesTemp]: [i],
              [expandFlagTemp]: expandFlag,
            })
          }
          _this.setData({
            formReadOnly: _this.data.formReadOnly,
            infoCard: newInfoItem,
            patrolId: _this.data.patrolId,
            patrolName: _this.data.patrolName,
            patrolPost: _this.data.patrolPost,
            patrolType: _this.data.patrolType,
            patrolDeptName: _this.data.patrolDeptName,
            eqpMaintainDetailList_maintain:_this.data.eqpMaintainDetailList_maintain,
            eqpMaintainDetailList: _this.data.eqpMaintainDetailList_dispatch,
            maintainResult: _this.data.maintainResult,
            showItem: _this.data.showItem,
          });
        
          _this.updateFormProgressInfo();
          console.log(_this.data.infoCard)
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