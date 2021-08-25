import Dialog from '../../../component/vant/dialog/dialog';
var app = getApp();
var util = require("../../../utils/eamCommonUtils.js");

var detailTotalCount = 0;
var detailDoneCount = 0;
var progressTagType = 'warning';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formReadOnly: true,
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
    eqpMaintainDetailList: [],
    maintainResult: [],
    progressInfo: {
      doneCount: '0',
      totalCount: '0',
      tagType: 'warning'
    },
    activeDateTemp: null,
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

    this.getEqpMaintainInitDta(options.docId);
    this.setData({
      detailListViewHeight: windowHeight - 10 - 44 - 44,
      progressInfo: {
        doneCount: detailDoneCount,
        totalCount: detailTotalCount,
        tagType: progressTagType
      }
    });
  },

  onCollapseCellClick(event) {
    console.log(event);
    var index = event.currentTarget.dataset.selector;
    var expandFlag = true;
    if (event.detail.length == 0) {
      expandFlag = false;
    }
    var activeNamesTemp = "activeNames[" + index + "]";
    var expandFlagTemp = "expandFlag[" + index + "]";
    //this.updateDetailDataStartDate(index);
    this.setData({
      [activeNamesTemp]: event.detail,
      [expandFlagTemp]: expandFlag,
      //activeNames:event.detail,
      //supplementFlag:supplementFlag,
      suppleStartDateObj: {},
      suppleCompleteDateObj: {},
      activeDateTemp: util.getNowDateStr()
    });
  },

  onResultChange: function (e) {
    console.log(e);
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

  eqpMaintainFormSubmit: function (event) {
    var dataTemp = this.data.eqpMaintainDetailList;
    console.log(dataTemp);

    var _this = this;
    //var canSubmit = this.checkFormDtaBeforeSubmit();
    var canSubmit = true;
    //var errmsg = '';

    var jsonArrayTemp = [];
    jsonArrayTemp.push(_this.data.eqpMaintainDetailList);
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
          console.log(_this.data);
          wx.showLoading({
            title: 'Sending',
            mask: true
          });
          var jsonArray = [];
          jsonArray.push(_this.data.eqpMaintainDetailList);
          console.log(JSON.stringify(jsonArray));
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/eqpmaintenance/autonomous-maintain-start' + '?' + app.globalData.restAuth,
            data: {
              id: _this.data.infoCard.docId,
              formid: _this.data.infoCard.formId,
              company: app.globalData.defaultCompany,
              optuser: app.globalData.employeeId,
              status: JSON.stringify(jsonArray),
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              wx.hideLoading();
              var resMsg = '';
              console.log(res);
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

        if (res.data == "" || res.statusCode != 200) {
          //console.log("no Data");
          wx.hideLoading();
          return;
        }

        if (res.data.length > 1) {
          var maintainInfoTemp = res.data[0];
          var maintainDetailListTemp = res.data[1];
          let newInfoItem = {
            docId: '',
            formId: '',
            deptName: '',
            displayType: '',
            assetDesc: '',
            assetFormId: '',
            pictureurl: '',
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
              sDate: '',
              eDate: ''
            };
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
            newItem.sDate = maintainDetailListTemp[i].sdate == null ? '' : util.utcInit(maintainDetailListTemp[i].sdate);
            newItem.eDate = maintainDetailListTemp[i].edate == null ? '' : util.utcInit(maintainDetailListTemp[i].edate);
            if (maintainDetailListTemp[i].analysisresult != null && (maintainDetailListTemp[i].analysisresult == '正常' || maintainDetailListTemp[i].analysisresult == '异常')) {
              newItem.result = maintainDetailListTemp[i].analysisresult;
              newItem.tagType = _this.getTagType(maintainDetailListTemp[i].analysisresult);
            } else {
              _this.data.formReadOnly = false;
              newItem.result = '待检';
              newItem.tagType = 'warning';
            }
            _this.data.maintainResult.push(maintainDetailListTemp[i].analysisresult);
            _this.data.eqpMaintainDetailList.push(newItem);
          }
          _this.setData({
            formReadOnly: _this.data.formReadOnly,
            infoCard: newInfoItem,
            eqpMaintainDetailList: _this.data.eqpMaintainDetailList,
            maintainResult: _this.data.maintainResult
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