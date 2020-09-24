import { IMyApp } from '../../app';
import * as drawQrcode  from '../../../utils/weapp.qrcode.min.js';
const app = getApp<IMyApp>()
let restUrl: string;
let eventChannel;
Page({
  data: {
    option1: [
      { text: '路程开始时间', value: 1 },
      { text: '到达时间', value: 2 },
      { text: '离开时间', value: 3 },
      { text: '路程结束时间', value: 4 },
    ],
    problemView: false,
    showModal: false,
    circle: '',
    modalHidden: true,
    selectValue: 1,
    dateview: '',
    addressView: '',
    addressNameView: '',
    roadStartDate: '',
    arrivalDate: '',
    leaveDate: '',
    roadEndtDate: '',
    maintainDescribe: '',
    maintainNumberId: '',
    maintainNumberName: '',
    maintainSerial: '',
    customerName: '',
    productName: '',
    problemId: '',
    problemName: '',
    maintainTypeId: '',
    punchDate: '',
    punchDateView: '',
    loadingHidden: false
  },

  onLoad(option) {
    var that = this;
    wx.getStorage({
      key: 'pageData',
      success: function (res) {

        var myData = res.data;//读取key值为myData的缓存数据
        if (JSON.stringify(myData) == '{}') {
          that.setData({
            selectValue: 1
          })
        } else {
          that.setData({
            maintainTypeId: myData.maintainTypeId,
            maintainNumberId: myData.maintainNumberId,
            maintainSerial: myData.mainSerial,
            customerName: myData.customerName,
            productName: myData.productName,
            problemId: myData.problemId,
            problemName: myData.problemName,
            roadStartDate: myData.roadStartDate,
            arrivalDate: myData.arrivalDate,
            leaveDate: myData.leaveDate,
            roadEndtDate: myData.roadEndtDate,
            selectValue: myData.selectValue,
            maintainDescribe: myData.handlingInfo
          })
        }
      }
    })

    wx.request({
      url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/repmq/maintainform/' + app.globalData.employeeId,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        var list = res.data.data;
        if (list.length != 1) {
          wx.showModal({
            title: '系统提示',
            content: '员工维修单号存在异常，请联系管理员',
            showCancel: false
          })
        }
        this.setData({
          maintainTypeId: res.data.data[0].key
        })
        var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repte/validateDate/' + app.globalData.employeeId;
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
          success: res => {
            this.setData({
              loadingHidden: true
            });
            if (res.data.code == 201) {
              this.setData({
                problemView: true
              })
            }
          },
          fail: fail => {
            console.log(fail)
          }
        });
        var that = this;
        that.getTime();
      },
      fail: fail => {
        console.log(fail)
      }
    });
  },

  utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  },


  queryIp: function (res) {
    var that = this;
    if (that.data.maintainTypeId == '' || that.data.maintainNumberId == '' || that.data.customerName == '') {
      wx.showModal({
        title: '系统提示',
        content: "请先绑定表单",
        showCancel: false
      });
      return;
    }
    var txt = "maintainDescribe_" + that.data.maintainTypeId + "_" + that.data.maintainNumberId + "_" + app.globalData.employeeId + "_" + app.globalData.employeeName + "_" + that.data.customerName;
    var state = that.utf16to8(txt);
    var qrcode_width = 300;
    var qrcode_typeNumber = 7;
    var qrcode_background = "#FFFFFF";
    var qrcode_foreground = "#000000";
    var qrcode_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx197c3762bc4258f0&redirect_uri=" + app.globalData.weChatCallBack+"&response_type=code&scope=snsapi_userinfo&state=" + state + "&#wechat_redirect";
    var qrcode_url_length = qrcode_url.length;
    if (qrcode_url_length < 64) {
      qrcode_typeNumber = 7;
    }
    else if (qrcode_url_length >= 64 && qrcode_url_length < 119) {
      qrcode_typeNumber = 10;
    }
    else if (qrcode_url_length >= 119 && qrcode_url_length < 129) {
      qrcode_typeNumber = 15;
    }
    else if (qrcode_url_length >= 129 && qrcode_url_length < 382) {
      qrcode_typeNumber = 20;
    }
    else {
      qrcode_typeNumber = 27;
    }
    if (qrcode_url) {
      drawQrcode({
        width: 256,
        height: 256,
        x: 20,
        y: 20,
        canvasId: 'logoQRCode',
        typeNumber: qrcode_typeNumber,
        text: qrcode_url,
        background: qrcode_background,
        foreground: qrcode_foreground,
        correctLevel: 2,
      });
      that.setData({
        modalHidden: false
      });
    }
    else {
      wx.showToast({
        title: "请输入字符串，可以是网址、文本等",
        icon: "none",
        duration: 1000
      });
    }
  },

  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  modalConfirm: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  onSwitch2Change(detail) {
    this.setData!({
      selectValue: detail.detail
    })
  },
  eject() {
    this.setData({
      showModal: true
    })
  },
  back() {
    this.setData({
      showModal: false
    })
  },
  wish_put(e) {
    this.setData({
      maintainDescribe: e.detail.value
    })
  },
  ok() {
    console.log(this.data.maintainDescribe)
    this.setData({
      showModal: false
    })
  },

  bindLocationSelect() {
    var that = this;
    that.getPermission(that, "RoadStartDate");
  },
  bindMatainFormSelect() {
    var that = this
    var url = './maintainNumberselect?maintaintype=' + that.data.maintainTypeId + '&type=1';
    if (that.data.problemView == true) {
      wx.showModal({
        title: '系统提示',
        content: '您有维修描述存在问题，是否查看',
        showCancel: true,
        cancelText: '取消',
        confirmText: '查看',
        success: res => {
          if (res.confirm == true) {
            //确认
            url = './maintainNumberselect?maintaintype=' + that.data.maintainTypeId + '&type=0';
            wx.navigateTo({
              url: url,
              events: {
                returnMaintainNumberSelect: function (res) {
                  if (res) {
                    that.setData({
                      maintainNumberId: res.value.maintainNumberName,
                      maintainNumberName: res.value.maintainNumberName,
                      customerName: res.value.customerName,
                      productName: res.value.productName,
                      problemId: res.value.problemId,
                      problemName: res.value.problemName,
                      maintainSerial: res.value.maintainSerial,
                      roadStartDate: res.value.roadStartDate,
                      arrivalDate: res.value.arrivalDate,
                      leaveDate: res.value.leaveDate,
                      roadEndtDate: res.value.roadEndDate
                    })
                  }
                }
              },
            })
          } else {
            wx.navigateTo({
              url: url,
              events: {
                returnMaintainNumberSelect: function (res) {
                  if (res) {
                    that.setData({
                      maintainNumberId: res.value.maintainNumberName,
                      maintainNumberName: res.value.maintainNumberName,
                      customerName: res.value.customerName,
                      productName: res.value.productName,
                      problemId: res.value.problemId,
                      problemName: res.value.problemName,
                      maintainSerial: res.value.maintainSerial,
                      roadStartDate: res.value.roadStartDate,
                      arrivalDate: res.value.arrivalDate,
                      leaveDate: res.value.leaveDate,
                      roadEndtDate: res.value.roadEndtDate
                    })
                  }
                }
              },
            })
          }
        },
      })
    } else {
      wx.navigateTo({
        url: url,
        events: {
          returnMaintainNumberSelect: function (res) {
            if (res) {
              that.setData({
                maintainNumberId: res.value.maintainNumberName,
                maintainNumberName: res.value.maintainNumberName,
                customerName: res.value.customerName,
                productName: res.value.productName,
                problemId: res.value.problemId,
                problemName: res.value.problemName,
                maintainSerial: res.value.maintainSerial,
                roadStartDate: res.value.roadStartDate,
                arrivalDate: res.value.arrivalDate,
                leaveDate: res.value.leaveDate,
                roadEndtDate: res.value.roadEndtDate
              })
            }
          }
        },
      })
    }
  },
  commit() {
    var that = this;
    var ifCommit = true;
    var msg = '';
    if (that.data.addressView == '' || that.data.addressNameView == '') {
      msg = '请先选择位置'
      ifCommit = false;
    }
    if (that.data.maintainNumberId == '') {
      msg += '请先绑定维修单';
      ifCommit = false;
    }
    if (that.data.selectValue == 3 && that.data.maintainDescribe == '') {
      msg += '描述不能为空';
      ifCommit = false;
    }
    var url;
    if (that.data.maintainSerial == '') {
      //创建一条维修描述
      url = app.globalData.restAdd + 'Hanbell-JRS/api/crm/repte/create';
    } else {
      //更新一条维修描述
      url = app.globalData.restAdd + 'Hanbell-JRS/api/crm/repte/update';
    }

    if (ifCommit) {
      let _this = this
      var url = '';
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();

      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }

      var data = {
        maintainTypeId: _this.data.maintainTypeId,
        maintainNumberId: _this.data.maintainNumberId,
        mainSerial: _this.data.maintainSerial,
        maintainerId: app.globalData.employeeId,
        maintainer: app.globalData.employeeName,
        deptno: app.globalData.defaultDeptId,
        dept: app.globalData.defaultDeptName,
        problemId: _this.data.problemId,
        problemName: _this.data.problemName,
        handlingInfo: _this.data.maintainDescribe,
        customerName: _this.data.customerName,
        productName: _this.data.productName,
        punchDate: year + "/" + month + "/" + day + " " + this.data.dateview,
        addressView: _this.data.addressView,
        addressNameView: _this.data.addressNameView,
        roadStartDate: _this.data.roadStartDate,
        arrivalDate: _this.data.arrivalDate,
        leaveDate: _this.data.leaveDate,
        roadEndDate: _this.data.roadEndtDate,
        selectValue: _this.data.selectValue,
        sessionkey: app.globalData.sessionKey,
        openId: app.globalData.openId,
      }

      if (_this.data.maintainSerial == '') {
        url = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repte/create?type=' + _this.data.selectValue + "&" + app.globalData.restAuth;
      } else {
        url = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repte/update?type=' + _this.data.selectValue + "&" + app.globalData.restAuth;
      }
      wx.showModal({
        title: '系统提示',
        content: '确定提交吗',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success(res) {
          that.setData({
            loadingHidden: false
          })
          if (res.confirm == true) {
            wx.request({
              url: url,
              data: data,
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: res => {
                that.setData({
                  loadingHidden: false
                })
                if (res.data.code == 200) {
                  if (that.data.selectValue == 1) {
                    data.roadStartDate = that.data.punchDateView;
                    data.selectValue = 2;
                  } else if (that.data.selectValue == 2) {
                    data.arrivalDate = that.data.punchDateView;
                    data.selectValue = 3;
                  } else if (that.data.selectValue == 3) {
                    data.leaveDate = that.data.punchDateView;
                    data.selectValue = 4;
                  } else if (that.data.selectValue == 4) {
                    data.selectValue = 1;
                  }
                  if (res.data.msg != 'success' && res.data.msg != undefined) {
                    data.mainSerial = res.data.msg;
                  }
                  //放入缓存
                  wx.setStorage({
                    key: 'pageData',
                    data: data
                  })
                  if (data.selectValue == 1) {
                    wx.setStorage({
                      key: 'pageData',
                      data: ({})
                    })
                  }
                  wx.hideLoading()
                  wx.showModal({
                    title: '系统消息',
                    content: "提交成功",
                    showCancel: false,
                    success(res) {
                      wx.switchTab({
                        url: "/pages/index/index"
                      })
                    }
                  })
                } else {
                  wx.showModal({
                    title: '系统消息',
                    content: "提交失败",
                    showCancel: false,
                    success(res) {
                      wx.switchTab({
                        url: "/pages/index/index"
                      })
                    }
                  })

                }
              },
              fail: fail => {
                wx.hideLoading()
              }
            })
          } else {
            that.setData({
              loadingHidden: true
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: msg,
        showCancel: false
      })
    }
  },
  getTime() {

    var that = this;

    var nowTime = new Date();

    var hours = nowTime.getHours();
    var minutes = nowTime.getMinutes();
    var seconds = nowTime.getSeconds();

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    var dateview = hours + ":" + minutes + ":" + seconds
    this.setData({
      dateview: dateview,
      punchDateView: hours + ":" + minutes
    })
    setTimeout(function () {

      that.getTime();

    }, 1000);

  },
  //获取用户地理位置权限
  getPermission: function (_this, data) {
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const x1 = res.longitude
        const y1 = res.latitude
        const speed = res.speed
        const accuracy = res.accuracy
        wx.chooseLocation({
          success: function (res1) {
            _this.setData({
              addressView: res1.address,
              addressNameView: res1.name,
            })
            const x2 = res1.longitude
            const y2 = res1.latitude
            var a = Math.sin(y1);
            var b = Math.sin(y2);
            var c = Math.cos(y1);
            var d = Math.cos(y2);
            var e = Math.cos(x1 - x2);
            var v = a * b + c * d * e;
            var distance = 6371.0 * Math.acos(v) * Math.PI / 180;
            var rounddistance = Math.round(distance * 1000);
            if (rounddistance > 70) {
              _this.setData({
                addressView: '',
                addressNameView: '',
              })
              wx.showModal({
                title: '系统提示',
                content: '选择位置与当前位置为' + rounddistance + ',不得超过70米',
              })
            }
          },
          fail: function () {
            wx.getSetting({
              success: function (res) {
                var statu = res.authSetting;
                if (!statu['scope.userLocation']) {
                  wx.showModal({
                    title: '是否授权当前位置',
                    content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                    success: function (tip) {
                      if (tip.confirm) {
                        wx.openSetting({
                          success: function (data) {
                            if (data.authSetting["scope.userLocation"] === true) {
                              wx.showToast({
                                title: '授权成功',
                                icon: 'success',
                                duration: 1000
                              })
                              //授权成功之后，再调用chooseLocation选择地方
                              wx.chooseLocation({
                                success: function (res) {
                                  _this.setData({
                                    addressView: '',
                                    addressNameView: '',
                                  })
                                },
                              })
                            } else {
                              wx.showToast({
                                title: '授权失败',
                                icon: 'success',
                                duration: 1000
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '调用授权窗口失败',
                  icon: 'success',
                  duration: 1000
                })
              }
            })
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '微信服务未允许',
          icon: 'warn',
          duration: 1000
        })
      }
    })
  },
})
