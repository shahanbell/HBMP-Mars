var app = getApp();
import Dialog from '../../../component/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    facno: "",
    facnoname: "",
    employeeNo: "",
    employeeName: "",
    depeNo: "",
    deptName: "",
    post: "",
    postDesc: "",
    grade: "",
    workStartDate: null,
    workStartDateDesc: "",

    isProofActionShow: false,
    proofTypeActions: [{
      name: '在职证明',
      key: 'ZZ'
    }, {
      name: '收入证明',
      key: 'SR'
    }],
    proofType: "",
    proofDesc: "",

    isReasonActionShow: false,
    reasonCodeActions: [{
        name: '购房',
        key: 'GF'
      },
      {
        name: '购车',
        key: 'GC'
      },
      {
        name: '办信用卡',
        key: 'XYK'
      },
      {
        name: '办理误工费证明',
        key: 'WGF'
      },
      {
        name: '大病/医药费报销',
        key: 'YFBX'
      },
      {
        name: '其他',
        key: 'QT'
      }
    ],
    reasonCode: "",
    reasonCdesc: "",

    money: "",
    sumrry: "",

    countdown: 0,
    showCountdown: false,

    uploaderList: [],
    showUpload: true,
    hkgl082Files: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'Loading'
    });
    this.setData({
      employeeNo: app.globalData.employeeId,
      employeeName: app.globalData.employeeName,
      depeNo: app.globalData.defaultDeptId,
      deptName: app.globalData.defaultDeptName
    });
    var that = this;
    wx.request({
      url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl082/userInfo?userid=' + this.data.employeeNo + '&' + app.globalData.restAuth,
      // url: 'http://localhost:8480/Hanbell-JRS/api/efgp/hkgl082/userInfo?userid=' + this.data.employeeNo + '&' + app.globalData.restAuth,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.info(JSON.stringify(res))
        that.setData({
          facno: res.data.facno,
          facnoname: res.data.facnoname,
          grade: res.data.grade,
          post: res.data.post,
          postDesc: res.data.postDesc,
          workStartDate: new Date(res.data.workDate),
          workStartDateDesc: that.formatDate(new Date(res.data.workDate))
        });
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();

      }
    });

  },



  showProofAction: function () {
    this.setData({
      isProofActionShow: true,
    });
  },


  onProofActionsClose: function () {
    this.setData({
      isProofActionShow: false,
    });
  },

  onProofActionsSelect: function (value) {
    console.info(JSON.stringify(value))
    this.setData({
      proofType: value.detail.key,
      proofDesc: value.detail.name,
    });
  },

  showReasonAction: function () {
    this.setData({
      isReasonActionShow: true,
    });
  },


  onReasonActionsClose: function () {
    this.setData({
      isReasonActionShow: false,
    });
  },

  onReasonActionsSelect: function (value) {
    console.info(JSON.stringify(value))
    this.setData({
      reasonCode: value.detail.key,
      reasonCdesc: value.detail.name,
    });
  },



  bindSumrryChange: function (value) {
    console.info(JSON.stringify(value.detail))
    console.info(JSON.stringify(value))
    this.setData({
      sumrry: value.detail.value
    });
  },
  bindMoneyChange: function (value) {
    console.info(JSON.stringify(value.detail))
    console.info(JSON.stringify(value))
    this.setData({
      money: value.detail.value
    });
  },

  
clearImg: function (e) {
  var nowList = [];
  var uploaderList = this.data.uploaderList;
  for (var i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
          continue;
      }
      else {
          nowList.push(uploaderList[i]);
      }
  }
  this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
  });
},
initFile: function () {
  var nowList = [];
  var _this = this;
  var FileSystemManager = wx.getFileSystemManager();
  _this.data.uploaderList.forEach(function (o, i) {
      var baselib = FileSystemManager.readFileSync(_this.data.uploaderList[i], 'base64');
      var imagePathTemp = _this.data.uploaderList[i].split('.');
      var imageType = imagePathTemp[imagePathTemp.length - 1];
      var obj = { data: baselib, imageType: imageType };
      nowList.push(obj);
  });
  _this.setData({
    hkgl082Files: nowList
  });
},

upload: function (e) {
  var that = this;
  wx.chooseImage({
      count: 3 - that.data.uploaderNum,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          var uploaderList = that.data.uploaderList.concat(tempFilePaths);
          if (uploaderList.length == 3) {
              that.setData({
                  showUpload: false
              });
          }
          that.setData({
              uploaderList: uploaderList,
              uploaderNum: uploaderList.length,
          });
      }
  });
},


  formSubmit: function () {
    this.initFile();
    wx.showLoading({
      title: 'Loading'
    });
    var errmsg = '';
    if (!app.globalData.authorized) {
      errmsg += '账号未授权\r\n';
    }
    if (this.data.facno == null || this.data.facno == '') {
      errmsg += '公司别不能为空\r\n';
    }
    if (this.data.facno == null || this.data.facno == '') {
      errmsg += '公司别不能为空\r\n';
    }

    if (this.data.depeNo == null || this.data.depeNo == '') {
      errmsg += '申请部门不能为空\r\n';
    }
    if (this.data.depeNo == null || this.data.depeNo == '') {
      errmsg += '申请部门不能为空\r\n';
    }

    if (this.data.post == null || this.data.post == '') {
      errmsg += '岗位不能为空\r\n';
    }

    if (this.data.grade == null || this.data.grade == '') {
      errmsg += '职等不能为空\r\n';
    }

    if (this.data.workStartDateDesc == null || this.data.workStartDateDesc == '') {
      errmsg += '入职日期不能为空\r\n';
    }

    if (this.data.proofDesc == null || this.data.proofDesc == '') {
      errmsg += '证明类型不能为空\r\n';
    }
    if (this.data.reasonCdesc == null || this.data.reasonCdesc == '') {
      errmsg += '申请事由不能为空\r\n';
    }
    if (this.data.sumrry == null || this.data.sumrry == '') {
      errmsg += '说明不能为空\r\n';
    }
    if (this.data.reasonCode.startsWith("G") && (this.data.money == null || this.data.money == '')) {
      errmsg += '当购房购车时，请写入贷款金额\r\n';
    }
    if(this.data.uploaderList.length==0){
      errmsg += '请上传图片\r\n';
    }
    if (errmsg.length > 0) {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      });
      wx.hideLoading();
      return;
    }

    var that = this;

    wx.showModal({
      title: '系统提示',
      content: '确定提交吗',
      success: function (res) {
        wx.request({
           url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl082/wechat?' + app.globalData.restAuth,
         //url: 'http://localhost:8480/Hanbell-JRS/api/efgp/hkgl082/wechat?' + app.globalData.restAuth,
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          data: {
            facno: that.data.facno,
            facnoname: that.data.facnoname,
            employeeNo: that.data.employeeNo,
            employeeName: that.data.employeeName,
            depeNo: that.data.depeNo,
            deptName: that.data.deptName,
            post: that.data.post,
            postDesc: that.data.postDesc,
            grade: that.data.grade,
            workStartDate: that.data.workStartDate,
            workStartDateDesc: that.data.workStartDateDesc,
            proofType: that.data.proofType,
            proofDesc: that.data.proofDesc,

            reasonCode: that.data.reasonCode,
            reasonCdesc: that.data.reasonCdesc,
            sumrry: that.data.sumrry,
            money: that.data.money+'万元',

            hkgl082Files: that.data.hkgl082Files
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.code == "200") {
              wx.showModal({
                title: '系统提示',
                content: res.data.msg,
                showCancel: false,
                success: () => {
                  wx.switchTab({
                    url: "/pages/index/index"
                  });
                  // let count = 3;
                  // that.setData({
                  //   countdown: count,
                  //   showCountdown: true
                  // });
                  // wx.showToast({
                  //   title: `${that.data.countdown}秒后返回`,
                  //   icon: 'none',
                  //   duration: 3000
                  // });

                  // 每秒更新倒计时
                  // const timer = setInterval(() => {
                  //   count--;
                  //   that.setData({ countdown: count });

                  //   if (count <= 0) {
                  //     clearInterval(timer);
                  //     wx.switchTab({
                  //       url: "/pages/index/index"
                  //   });
                  //   }
                  // }, 1000);

                  // that.setData({ timer });
                }
              });
            }

          },
        });

      },
      fail: function (res) {
        wx.showModal({
          title: '系统提示',
          content: res,
          showCancel: false
        });
      },
    });


  },

  formatDate(date) {

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  onUnload() {
    console.info("页面卸载");
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  }

})