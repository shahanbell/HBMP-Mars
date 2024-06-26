
import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let eventChannel
let d = new Date()
Page({
  data: {
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    ycrq: d.toISOString().substring(0, 10),
    kr: '',
    contact: '',
    cfsf: "",
    cfcs: "",
    address1: "",
    mdsf: "",
    mdcs: "",
    address2: "",
    sy: '',
    keyuser: '',
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
    company:""
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    eventChannel = this.getOpenerEventChannel()
    eventChannel.on('openDetail', (res) => {
      if (res.isNew) {
        this.setData!({
          ycrq: this.dateFormatForYYMMDD(new Date()),
          employeeId: app.globalData.employeeId,
          employeeName: app.globalData.employeeName,
          deptId: app.globalData.defaultDeptId,
          deptName: app.globalData.defaultDeptName,
          
        })
      } else {
        this.setData!({
          employeeId: res.data.employeeId,
          employeeName: res.data.employeeName,
          deptId: res.data.deptId,
          deptName: res.data.deptName,
          ycrq: res.data.ycrq,
          kr: res.data.kr,
          contact: res.data.contact,
          cfsf: res.data.cfsf,
          cfcs: res.data.cfcs,
          address1: res.data.address1,
          mdsf: res.data.mdsf,
          mdcs: res.data.mdcs,
          address2: res.data.address2,
          sy: res.data.sy,
          company:res.data.company
        })
      }
    })
    wx.hideLoading()
  },
  sltwordInput(e) {
    this.setData!({
      keyuser: e.detail.value
    })
  },

  bindUserSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/userSelect/userSelect?userInfo=' + userInput,
      events: {
        returnUserSelect: function (res) {
          if (res) {
            that.setData({
              employeeId: res.k,
              employeeName:res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })

  },
  bindDeptSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../deptSelect/deptSelect?employeeid=' + this.data.employeeId,
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

  bindOvertimeChange(e) {
    this.setData!({
      hour: e.detail.value
    })
  },
  bindKrChange(e) {
    this.setData({
      kr: e.detail
    })
  },
  bindContactChange(e) {
    this.setData({
      contact: e.detail
    })
  },
  bindCfsfChange(e) {
    this.setData({
      cfsf: e.detail
    })
  },
  bindCfcsChange(e) {
    this.setData({
      cfcs: e.detail
    })
  },
  bindAddress1Change(e) {
    this.setData({
      address1: e.detail
    })
  },
  bindMdsfChange(e) {
    this.setData({
      mdsf: e.detail
    })
  },
  bindMdcsChange(e) {
    this.setData({
      mdcs: e.detail
    })
  },
  bindAddress2Change(e) {
    this.setData({
      address2: e.detail
    })
  },
  bindCompanyChange(e) {
    this.setData({
      company: e.detail
    })
  },
  bindSyChange(e) {
    this.setData!({
      sy: e.detail.value
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
      ycrq: this.dateFormatForYYMMDD(e.detail)
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
    let dayTemp = year + "/" + month + "/" + day;
    return dayTemp;
  },

  formSubmit(e) {
    let errmsg = ''
    if (this.data.ycrq == '') {
      errmsg += "请选择用车日期\r\n"
    }
    if (this.data.cfsf == '') {
      errmsg += "请输入出发省份\r\n"
    }
    if (this.data.cfcs == '') {
      errmsg += "请输入出发城市\r\n"
    }
    if (this.data.address1 == '') {
      errmsg += "请输入出发详细地址\r\n"
    }
    if (this.data.mdsf == '') {
      errmsg += "请输入目的省份\r\n"
    }
    if (this.data.mdcs == '') {
      errmsg += "请输入目的城市\r\n"
    }
    if (this.data.address2 == '') {
      errmsg += "请输入目的详细地址\r\n"
    }
    if (this.data.sy == '') {
      errmsg += "请输入事由\r\n"
    }
    if(errmsg!=''){
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
    });
        return;
    }
      let newObject = {
        employeeId: this.data.employeeId,
        employeeName: this.data.employeeName,
        deptId: this.data.deptId,
        deptName: this.data.deptName,
        ycrq: this.data.ycrq,
        kr: this.data.kr,
        contact: this.data.contact,
        cfsf: this.data.cfsf,
        cfcs: this.data.cfcs,
        address1: this.data.address1,
        mdsf: this.data.mdsf,
        mdcs: this.data.mdcs,
        address2: this.data.address2,
        sy: this.data.sy,
        company:this.data.company
      }
      eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('returnDetail', { data: newObject, isNew:true })
      wx.navigateBack({
        delta: 1
      })
  }
})
