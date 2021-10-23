//leave.ts
import { IMyApp } from '../../../app'
const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    applyUserId: null,
    applyUserName: null,
    applyDeptId: null,
    applyDeptName: null,
    company: null,

    safetyOfficeId: null,
    safetyOfficeName: null,
    safetyDeptId: null,
    safetyDeptName: null,

    deptManager1Id: null,
    deptManager1Name: null,
    deptManager2Id: null,
    deptManager2Name: null,

    monthSafetyOfficeId: null,
    monthSafetyOfficeName: null,
    isChargeShow: false,
    chargeId: null,
    chargeName: null,
    charges: [
      {
        key: '1',
        name: '立即停产',
      },
      {
        key: '2',
        name: '立即停止施工',
      },
      {
        key: '3',
        name: '立即改善',
      },
      {
        key: '4',
        name: '之后整改',
      },
    ],
    isDateShow: false,
    showDateInit: new Date().getTime(),
    endDate: "",
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    dateSelect: null,
    address: null,
    constructionSide: null,
    deduction: null,
    uploaderList: [],
    showUpload: true,
    hkpb033Files: [],
    ajaxShow: false
  },

  onLoad() {

    wx.showLoading({
      title: 'Loading',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    if (app.globalData.openId) {
      this.setData!({
        hasOpenId: true
      })
    }
    if (app.globalData.authorized) {
      this.setData!({
        applyUserId: app.globalData.employeeId,
        applyUserName: app.globalData.employeeName
      })
    }
    if (app.globalData.defaultDeptId) {
      this.setData!({
        applyDeptId: app.globalData.defaultDeptId,
        applyDeptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName,
        company: app.globalData.defaultCompany + '-' + app.globalData.defaultCompanyName
      })
    }
  },

  bindSafetyOfficeSelect() {
    let _this = this
    wx.navigateTo({
      url: '../../../pages/userSelect/userSelect',
      events: {
        returnUserSelect: function (res) {
          if (res) {
            console.info("===");
            var _wx = wx;
            _wx.showLoading({
              title: '加载中'
            })
            _this.setData!({
              safetyOfficeId: res.k,
              safetyOfficeName: res.k + '-' + res.v,
              ajaxShow: true
            })
            _this.getSafetyOfficeDept(res.k, _wx);
          }
        }
      },
      success(res) {
      }
    })
  },

  getSafetyOfficeDept(userid, _wx) {
    var _this = this
    wx.request({
      url: app.globalData.restAdd  + '/Hanbell-JRS/api/efgp/functions/f;users.id=' + userid + '/s/0/20';
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        var data = res.data;
        if (data) {
          //循环获取主部门
          data.forEach((o, i) => {
            if (o.isMain == 1) {
              _this.setData({
                safetyDeptId: o.organizationUnit.id,
                safetyDeptName: o.organizationUnit.id + '-' + o.organizationUnit.organizationUnitName,
              })
            }

          })
        } else {
          _this.setData({
            ajaxShow: false
          })
          wx.showModal({
            title: '系统提示',
            content: "获取部门失败",
            showCancel: false
          })
        }
        _this.getManage1rUser(userid, _wx);
      },
      fail: fail => {
      }
    })

  },
  //获取课长级主管
  getManage1rUser(userid, _wx) {
    var _this = this
    wx.request({
      url: app.globalData.restAdd  + '/Hanbell-JRS/api/efgp/functions/functionlevel/manager/' + userid + '/课长级?' + app.globalData.restAuth,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        var data = res.data;

        if (data.code == '200') {
          _this.setData({
            deptManager1Id: data.object.id,
            deptManager1Name: data.object.userName,
          })
        } else {
          _this.setData({
            ajaxShow: false
          })
          wx.showModal({
            title: '系统提示',
            content: "获取课级主管失败",
            showCancel: false
          })

        }
        _this.getManage2rUser(userid, _wx)

      },
      fail: fail => {
      }
    })

  },
  //获取经理级主管
  getManage2rUser(userid, _wx) {
    var _this = this

    wx.request({
      url: app.globalData.restAdd  + '/Hanbell-JRS/api/efgp/functions/functionlevel/manager/' + userid + '/经理级?' + app.globalData.restAuth,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        var data = res.data;
        if (data.code == '200') {
          _this.setData({
            deptManager2Id: data.object.id,
            deptManager2Name: data.object.userName,
            ajaxShow: false

          })
        }
        else {
          _this.setData({
            ajaxShow: false
          })
          wx.showModal({
            title: '系统提示',
            content: "获取经理级主管失败",
            showCancel: false
          })
        }
      },
      fail: fail => {
      }
    })

  },
  //当月安全课长
  bindMonthSafetyOfficeSelect() {
    let _this = this
    wx.navigateTo({
      url: 'safemanagerselect',
      events: {
        returnSafeManagerSelect: function (res) {
          if (res) {
            _this.setData!({
              monthSafetyOfficeId: res.k,
              monthSafetyOfficeName: res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindDescribehange(e) {
    var _this = this;
    _this.setData({
      describe: e.detail
    })
  },
  bindChargeShow() {
    var _this = this;
    if (!_this.data.isChargeShow) {
      _this.setData({
        isChargeShow: true
      })
    }
  },
  bindChargesClose() {
    var _this = this;
    _this.setData({
      isChargeShow: false
    })
  },
  bindChargesSelect(e) {
    var _this = this;
    _this.setData({
      chargeId: e.detail.value.key,
      chargeName: e.detail.value.name,
      isChargeShow: false
    })

  },
  bindOpenDate(e) {
    var _this = this;
    _this.setData({
      isDateShow: true,
      dateSelect: e.target.id
    })
  },
  bindCloseDate(e) {
    var _this = this;
    _this.setData({
      isDateShow: false,
    })
  },

  bindDateConfirm(e) {
    var _this = this;
    var list = _this.data.month
    // list.forEach((o, i) => {
    //   if (o.id == this.data.dateSelect) {
    //     o.endDate = this.dateFormatForYYMMDD(e.detail)
    //   }
    // })

    _this.setData!({
      month: list,
      isDateShow: false,
      endDate: this.dateFormatForYYMMDD(e.detail)
    })
  },

  bindAddressChange(e) {
    this.setData({
      address: e.detail
    })
  },
  bindConstructionSideChange(e) {
    this.setData({
      constructionSide: e.detail
    })
  },
  bindConstructionProjectChange(e) {
    this.setData({
      constructionProject: e.detail
    })
  },
  bindDeductionChange(e) {
    // ^ ([0 - 9] *| d *.d{ 1 }?d *)$
    var reg = /^[\+\-]?(\d*\.\d?|\d+(\.\d{0,2})?)$/;
    var _this = this
    var data = e.detail;

    if (reg.test(e.detail)) {
      _this.setData({
        deduction: e.detail
      })
    } else {
      _this.setData({
        deduction: ''
      })
    }
  },

  // 删除图片
  clearImg(e) {
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据

    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
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
  showImg(e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },

  dateFormatForYYMMDD(date) {
    let dateTemp = new Date(date);
    let year = dateTemp.getFullYear();
    let month = dateTemp.getMonth() + 1;
    let day = dateTemp.getDate();
    let dayTemp = year + "/" + month + "/" + day;
    return dayTemp
  },

  //上传图片
  upload(e) {
    var that = this;
    //console.log("upload Test");
    wx.chooseImage({
      count: 3 - that.data.uploaderNum, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res)
        //console.log(that.data.uploaderNum);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        console.info('tempFilePaths==' + JSON.stringify(tempFilePaths))
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length == 3) {
          that.setData({
            showUpload: false
          })
        }
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
        })
      }
    })
  },
  initFile() {
    console.info("1111");
    var nowList = [];
    var _this = this;
    var FileSystemManager = wx.getFileSystemManager();
    _this.data.uploaderList.forEach(function (o, i) {
      console.info("222");
      var baselib = FileSystemManager.readFileSync(_this.data.uploaderList[i], 'base64');
      var imagePathTemp = _this.data.uploaderList[i].split('.');
      var imageType = imagePathTemp[imagePathTemp.length - 1];
      var obj = { data: baselib, imageType: imageType };
      nowList.push(obj);
    });

    _this.setData({
      hkpb033Files: nowList
    })
  },

  formSubmit(e) {
    var isSubmit = true;
    let errmsg = ''
    var _this = this
    _this.initFile()
    if (!app.globalData.authorized) {
      isSubmit = false
      errmsg += '账号未授权\r\n'
    }
    if (_this.data.safetyOfficeName == '' || _this.data.safetyOfficeName == null) {
      isSubmit = false
      errmsg += '请选择单位安全员\r\n'
    }

    if (_this.data.deptManager1Name == '' || _this.data.deptManager1Name == null) {
      isSubmit = false
      errmsg += '请选择部门主管\r\n'
    }

    if (_this.data.deptManager2Name == '' || _this.data.deptManager2Name == null) {
      isSubmit = false
      errmsg += '请选择单位主管\r\n'
    }

    if (_this.data.address == '' || _this.data.address == null) {
      isSubmit = false
      errmsg += '请填写地址\r\n'
    }
    if (_this.data.monthSafetyOfficeName == '' || _this.data.monthSafetyOfficeName == null) {
      isSubmit = false
      errmsg += '请选择当月安全课长\r\n'
    }

    if (_this.data.monthSafetyOfficeName == '' || _this.data.monthSafetyOfficeName == null) {
      isSubmit = false
      errmsg += '请选择当月安全课长\r\n'
    }
    if (_this.data.hkpb033Files.length  == 0) {
      isSubmit = false
      errmsg += '请上传图片\r\n'
    }
    if (_this.data.chargeId == 4 && this.data.endDate == "") {
      isSubmit = false
      errmsg += '当责令是之后整改时，整改时间必填\r\n'
    }
    console.info("res=" + _this.data.hkpb033Files);

    if (isSubmit) {
      wx.showModal({
        title: '系统提示',
        content: '确定提交吗',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: 'Sending'
            })
            wx.request({
              url: app.globalData.restAdd  + '/Hanbell-JRS/api/efgp/hkpb033/wechat?' + app.globalData.restAuth,
              data: {
                ..._this.data
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: res => {
                wx.hideLoading()
                wx.showModal({
                  title: '系统消息',
                  content: res.data.msg,
                  showCancel: false,
                  success(res) {
                    wx.switchTab({
                      url: "/pages/index/index"
                    })
                  }
                })
              },
              fail: fail => {
                wx.hideLoading();
                wx.showModal({
                  title: '系统提示',
                  content: "请联系管理员:" + fail,
                  showCancel: false
                })
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      })
    }
  },

})
