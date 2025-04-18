import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let d = new Date();
let userInput = ''
Page({
  data: {
    detailList: [] as any,
    hasOpenId: false,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    sqrqDate: d.toISOString().substring(0, 10),
    clxz: '1',
    clxzDesc: '1-公务车',
    departure:'1',
    departureDesc:'1-枫泾厂出发',
    privatedriver: '',
    privatecarno: '',
    telcontact: '',
    purpose: '',
    purposeDesc: '',
    hmark1: '',
    checkArray: [
      {
        name: "trafficfee",
        value: 0,
        notempty: { key: true, msg: "不能为空" },
        isnumber: { key: true, msg: "数字!" }
      }],
    showTime: false,
    showDateInit: new Date().getTime(),
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
    mksystems: [
      {
        key: '0',
        name: '请选择',
      },
      {
        key: 'Y',
        name: '是',
      },
      {
        key: 'N',
        name: '否',
      },
    ],
    mksystemKey:'0',
    mksystemName:'',
    isMkShow:false,
    hdnDept: "",
  },
  onLoad() {
    wx.request({
     
      // url: that.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/session',
      url: app.globalData.restAdd+'/Hanbell-JRS/api/efgp/functions/functionlevel/manager/'+app.globalData.employeeId+ '/经理级'+'?'+ app.globalData.restAuth,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        wx.showLoading({
          title: 'Loading',
        })
    
        console.info("主管领导是="+JSON.stringify(res))

        this.setData!({
          hdnDept: res.data.object.id
        })
        console.info(this.data.hdnDept)

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
            employeeId: app.globalData.employeeId,
            employeeName: app.globalData.employeeName
          })
        }
        if (app.globalData.defaultDeptId) {
          this.setData!({
            deptId: app.globalData.defaultDeptId,
            deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName,
            company: app.globalData.defaultCompany + '-' + app.globalData.defaultCompanyName
          })
    
        }
      }
    });
   
  },
  bindDeptSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
      events: {
        returnDeptSelect: function (res) {
          if (res) {
            that.setData!({
              deptId: res.k,
              deptName: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindClzx(e) {
    let that = this
    wx.navigateTo({
      url: './carType',
      events: {
        returncarTypeSelect: function (res) {
          if (res) {
            that.setData!({
              clxz: res.k,
              clxzDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindDeparture(e) {
    let that = this
    wx.navigateTo({
      url: './startaddress',
      events: {
        returnStartAddressSelect: function (res) {
          if (res) {
            console.info("res=="+JSON.stringify(res))
            that.setData!({
              departure: res.k,
              departureDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindUserInput(e) {
    userInput = e.detail.value
  },
  bindUserSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/userSelect/userSelect?userInfo=' + userInput,
      events: {
        returnUserSelect: function (res) {
          if (res) {
            that.setData!({
              privatedriver: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })

  },
  bindPurpose(e) {
    let that = this
    wx.navigateTo({
      url: './purpose',
      events: {
        returnPurposeSelect: function (res) {
          if (res) {
            that.setData!({
              purpose: res.k,
              purposeDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './carappdetail',
      events: {
        returnDetail: function (res) {
          console.log(res.data);
          console.log(_this.data.detailList);
          let details = _this.data.detailList
          details.push(res.data)
          details.forEach((o, i) => {
            o.seq = i + 1
          })
          _this.setData({
            detailList: details,
            canSubmit: true
          })
        }
      },
      success(res) {
        res.eventChannel.emit('openDetail', {
          data:
          {
            employeeId: _this.data.employeeId,
            employeeName: _this.data.employeeName,
            deptId: _this.data.deptId,
            deptName: _this.data.deptName
          }, isNew: true
        })
      }
    })
  },
  bindEditDetailTap(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './carappdetail',
      events: {
        returnDetail: function (res) {
          let details = _this.data.detailList
          details.splice(index, 1)
          details.push(res.data)
          details.forEach((o, i) => {
            o.seq = i + 1
          })
          _this.setData!({
            detailList: details,
            canSubmit: true
          })
        }
      },
      success(res) {
        let currentObject = _this.data.detailList[index]
        res.eventChannel.emit('openDetail', {
          data:
          {
            employeeId: currentObject.employeeId,
            employeeName: currentObject.employeeName,
            deptId: currentObject.deptId,
            deptName: currentObject.deptName,
            ycrq: currentObject.ycrq,
            kr: currentObject.kr,
            contact: currentObject.contact,
            cfsf: currentObject.cfsf,
            cfcs: currentObject.cfcs,
            address1: currentObject.address1,
            mdsf: currentObject.mdsf,
            mdcs: currentObject.mdcs,
            address2: currentObject.address2,
            sy: currentObject.sy
          }, isNew: false
        })
      }
    })
  },
  bindRemoveDetailTap(e) {
    let details = this.data.detailList
    let index = e.currentTarget.dataset.index
    details.splice(index, 1)
    details.forEach((o, i) => {
      o.seq = i + 1
    })
    this.setData!({
      detailList: details
    })
  },

  bindTelcontactChange(e) {
    this.setData({
      telcontact: e.detail
    });
  },
  bindPrivatecarnoChange(e) {
    this.setData({
      privatecarno: e.detail
    });
  },
  bindHmark1Change(e) {
    this.setData!({
      hmark1: e.detail.value
    })
  },


  bindPickerDate(e) {
    this.openPickerDate();
  },
  bindCloseDate(e) {
    this.closePickerDate();
  },

  bindDateCancel(e) {
    this.closePickerDate();
  },
  bindDateConfirm(e) {
    this.setData!({
      sqrqDate: this.dateFormatForYYMMDD(e.detail)
    })
    this.closePickerDate();
  },

  openPickerDate() {
    this.setData!({
      showDate: true
    })
  },
  closePickerDate() {
    this.setData!({
      showDate: false
    })
  },
  dateFormatForYYMMDD(date) {
    let dateTemp = new Date(date);
    let year = dateTemp.getFullYear();
    let month = dateTemp.getMonth() + 1;
    let day = dateTemp.getDate();
    let hour = dateTemp.getHours();
    let minute = dateTemp.getMinutes();
    let dayTemp = year + "-" + month + "-" + day;
    return dayTemp;
  },
  bindMkShow() {
    var _this = this;
    if (!_this.data.isMkShow) {
      _this.setData({
        isMkShow: true
      })
    }
  },
  bindMkSelect(e) {
    var _this = this;
    _this.setData({
      mksystemKey: e.detail.value.key,
      mksystemName: e.detail.value.name,
      isMkShow: false
    })
  },
  bindMkClose() {
    var _this = this;
    _this.setData({
      isMkShow: false
    })
  },

  formSubmit(e) {

    let canSubmit = true
    let errmsg = ''
    if (!app.globalData.authorized) {
      canSubmit = false
      errmsg += '账号未授权\r\n'
    }
    if (!this.data.employeeId || this.data.employeeId == '') {
      canSubmit = false
      errmsg += '请填写申请人员\r\n'
    }
    if (!this.data.deptId || this.data.deptId == '') {
      canSubmit = false
      errmsg += "请填写申请部门\r\n"
    }
    if (this.data.clxzDesc == '') {
      canSubmit = false
      errmsg += "请选择车辆性质\r\n"
    }

    if (this.data.telcontact == '') {
      canSubmit = false
      errmsg += "请输入手机号\r\n"
    }

    if (this.data.clxz == "2") {
      if (this.data.privatedriver == "") {
        errmsg += "请填写私车驾驶员\r\n"
        canSubmit = false
      }
      if (this.data.privatecarno == "") {
        errmsg += "请填写私车车牌号\r\n"
        canSubmit = false
      }
    }
    if (this.data.purposeDesc == '') {
      canSubmit = false
      errmsg += "请选择用车原因\r\n"
    }

    if (this.data.purpose == "13" && this.data.hmark1 == "") {
      errmsg += "其他用车请输入备注说明\r\n"
      canSubmit = false
    }

    let t = this.data.sqrqDate
    if (t == '') {
      canSubmit = false
      errmsg += "请填写申请日期\r\n"
    }
    if (!this.data.detailList) {
      canSubmit = false
      errmsg += "请填写明细资料\r\n"
    }
    if (this.data.clxz == "2" && this.data.mksystemKey == "0") {
      canSubmit = false
      errmsg += "请选择是否每刻报销\r\n"
    }
    if (this.data.clxz != "2" && this.data.mksystemKey == "Y") {
      canSubmit = false
      errmsg += "私车公用才能每刻报销,请调整！\r\n"
    }

    if (canSubmit) {
      let _this = this
      wx.showModal({
        title: '系统提示',
        content: '确定提交吗',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: 'Sending'
            })
            console.log(_this.data)
            console.log(e)
            wx.request({
              url:  app.globalData.restAdd+'/Hanbell-JRS/api/efgp/hkgl037/wechat?' + app.globalData.restAuth,
              data: {
                employeeId: _this.data.employeeId,
                employeeName: _this.data.employeeName,
                deptId: _this.data.deptId,
                deptName: _this.data.deptName,
                sqrqDate: _this.data.sqrqDate,
                clxz: _this.data.clxz,
                clxzDesc: _this.data.clxzDesc,
                privatedriver: _this.data.privatedriver,
                privatecarno: _this.data.privatecarno,
                purpose: _this.data.purpose,
                purposeDesc: _this.data.purposeDesc,
                telcontact: _this.data.telcontact,
                hmark1: _this.data.hmark1,
                detailList: _this.data.detailList,
                mksystem: _this.data.mksystemKey,
                hdnDept:  _this.data.hdnDept,
                departure: _this.data.departure
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
                wx.hideLoading()
                console.log(fail)
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
  formReset() {
    //console.log('form发生了reset事件');
  }

})
