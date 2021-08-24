//overtime.ts
import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    formTypes: [{
      formType: '1',
      formTypeDesc: '平日加班'
    }, {
      formType: '2',
      formTypeDesc: '双休加班'
    }, {
      formType: '3',
      formTypeDesc: '节日加班'
    }],
    formType: '1',
    formTypeDesc: '平日加班',
    detailList: [] as any,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    canSubmit: false,
    employees:''
  },
  onLoad() {
    wx.showLoading({
      title: 'Loading'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    if (app.globalData.authorized) {
      this.setData!({
        employeeId: app.globalData.employeeId,
        employeeName: app.globalData.employeeName
      })
    }
    if (app.globalData.defaultDeptId) {
      this.setData!({
        deptId: app.globalData.defaultDeptId,
        deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName
      })
    }
  },
  bindDeptSelect(e) {
    let _this = this
    wx.navigateTo({
      url: '../../../pages/deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
      events: {
        returnDeptSelect: function (res) {
          if (res) {
            _this.setData!({
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

  onChange(e){
    this.setData({
      formType:e.detail,
    });
    console.log("当前选择了"+e.detail)
  },
  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './overdetail',
      events: {
        returnDetail: function (res) {
          let details = _this.data.detailList
          details.push(res.data)
          details.forEach((o, i) => {
            o.seq = i + 1
          });
         
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
      url: './overdetail',
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
            lunch: currentObject.lunch,
            dinner: currentObject.dinner,
            date1: currentObject.date1,
            time1: currentObject.time1,
            time2: currentObject.time2,
            hour: currentObject.hour,
            content: currentObject.content,
            listEmployees: currentObject.listEmployees
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
  onChange1(event){
    var index = event.target.dataset.index;
    var _this=this
    _this.data.detailList.forEach(function (o, i) {
      console.info('进入循环')
      if (o.seq == index) {
        console.info('进入判断')
        o.openFold = event.detail;
      }
    });
    _this.setData({
      detailList: this.data.detailList
    });
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
    if (!this.data.detailList) {
      canSubmit = false
      errmsg += "请填写明细资料\r\n"
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
            //明细拆分
            var index=0;
            var detailDatas=[];
            _this.data.detailList.forEach((o, i) => {
              o.listEmployees.forEach((m,index)=>{
                index = index+1;
                detailDatas.push({ seq: index, ...o, employeeId: m.id, employeeName: m.id +'-'+ m.userName});
              })
            })
            console.info('detaillist==' + JSON.stringify(detailDatas))
            wx.request({
              url: app.globalData.restAdd +'/Hanbell-JRS/api/efgp/hkgl034/wechat?' + app.globalData.restAuth,
              data: {
                employee: _this.data.employeeId,
                formType: _this.data.formType,
                formTypeDesc: _this.data.formTypeDesc,
                detailList: detailDatas
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
  formReset() {
    // console.log('form发生了reset事件');
  }
})
