import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let userInput = ''
let eventChannel;

Page({
  data: {
    detailList: [] as any,
    clxz: '1',
    clxzDesc: '1-公务车',
    privatedriver: '',
    privatedriverno:'',
    privatecarno: '',
    telcontact: '',
    purpose: '',
    purposeDesc: '',
    hmark1: '',
    isStayShow:false,
    staykey:"2",
    stayValue:"不住宿",
    stays:[{key:"1",name:"住宿"},{key:"2",name:"不住宿"}],
    isDeparturePopShow:false,
    departurekey:"",
    departurevalue:"",
    staydepartures:[{key:"1",name:"枫泾厂出发"},{key:"2",name:"兴塔产出发"},{key:"3",name:"分公司出发"},{key:"4",name:"汉声厂出发"},{key:"5",name:"汉扬厂出发"}],
    isRegistrationPopShow:false,
    registrationkey:"2",
    registrationvalue:"不办理",
    registrations:[{key:"1",name:"办理"},{key:"2",name:"不办理"}],
  },
  onLoad() {
    var that=this
    eventChannel = this.getOpenerEventChannel()
    eventChannel.on('openDetail', (res) => {
      if (res.isNew) {
        that.setData({
          privatedriver:app.globalData.employeeId+'-'+app.globalData.employeeName,
          privatedriverno:app.globalData.employeeId
        })
      } else {
        that.setData({
          clxz:res.data.clxz,
          clxzDesc: res.data.clxzDesc,
          privatedriver: res.data.privatedriver,
          privatedriverno:res.data.privatedriverno,
          privatecarno:res.data.privatecarno,
          telcontact: res.data.telcontact,
          purpose: res.data.purpose,
          purposeDesc: res.data.purposeDesc,
          hmark1:res.data.hmark1,
          staykey:res.data.staykey,
          stayValue:res.data.stayValue,
          departurekey:res.data.departurekey,
          departurevalue:res.data.departurevalue,
          registrationkey:res.data.registrationkey,
          registrationvalue:res.data.registrationvalue
        })
      }
    })
  },
  bindIsStayShow() {
    var _this = this;
    if (!_this.data.isStayShow) {
      _this.setData({
        isStayShow: true
      })
    }
  },
  bindStayClose(){
    var _this = this;
    if (_this.data.isStayShow) {
      _this.setData({
        isStayShow: false
      })
    }
  },
  bindStaySelect(e){
    var _this = this;
    _this.setData({
      staykey: e.detail.value.key,
      stayValue: e.detail.value.name,
      isStayShow: false
    })
  },
  bindDeparturePopShow(){
    var _this = this;
    if (!_this.data.isDeparturePopShow) {
      _this.setData({
        isDeparturePopShow: true
      })
    }
  },
  bindDeparturePopClose(){
    var _this = this;
    if (_this.data.isDeparturePopShow) {
      _this.setData({
        isDeparturePopShow: false
      })
    }
  },
  bindDepartureSelect(e){
    var _this = this;
    _this.setData({
      departurekey: e.detail.value.key,
      departurevalue: e.detail.value.name,
      isDeparturePopShow: false
    })
  },
  bindRegistrationPopShow(){
    var _this = this;
    if (!_this.data.isRegistrationPopShow) {
      _this.setData({
        isRegistrationPopShow: true
      })
    }
  },
  bindRegistrationPopClose(){
    var _this = this;
    if (_this.data.isRegistrationPopShow) {
      _this.setData({
        isRegistrationPopShow: false
      })
    }
  },
  bindRegistrationSelect(e){
    var _this = this;
    _this.setData({
      registrationkey: e.detail.value.key,
      registrationvalue: e.detail.value.name,
      isRegistrationPopShow: false
    })
  },
  bindClzx(e) {
    let that = this
    wx.navigateTo({
      url: '../carapp/carType',
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
  bindUserSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/userSelect/userSelect?userInfo=' + userInput,
      events: {
        returnUserSelect: function (res) {
          if (res) {
            that.setData!({
              privatedriver: res.k + '-' + res.v,
              privatedriverno:res.k
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
      url: '../carapp/purpose',
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
  formSubmit(e) {
    let errmsg = ''
    if (this.data.clxzDesc == '') {
      errmsg += "请选择车辆性质\r\n"
    }
    if (this.data.privatedriver == '') {
      errmsg += "请选择驾驶员\r\n"
    }
    if (this.data.purposeDesc == '') {
      errmsg += "请选择用车原因\r\n"
    }
    if (this.data.departurevalue == '') {
      errmsg += "请选择始发地r\n"
    }
    if (this.data.registrationvalue == '') {
      errmsg += "请选择是否临时登记\r\n"
    }
    if (this.data.telcontact == '') {
      errmsg += "请输入联系方式\r\n"
    }
    if(errmsg!=''){
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
    });
      return ;
    }
    let newObject = {
      clxz:this.data.clxz,
      clxzDesc: this.data.clxzDesc,
      privatedriver: this.data.privatedriver,
      privatedriverno:this.data.privatedriverno,
      privatecarno:this.data.privatecarno,
      telcontact: this.data.telcontact,
      purpose: this.data.purpose,
      purposeDesc: this.data.purposeDesc,
      hmark1:this.data.hmark1,
      staykey:this.data.staykey,
      stayValue:this.data.stayValue,
      departurekey:this.data.departurekey,
      departurevalue:this.data.departurevalue,
      registrationkey:this.data.registrationkey,
      registrationvalue:this.data.registrationvalue
    }
    eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('returnDetail', { data: newObject, isNew: false})
    wx.navigateBack({
      delta: 1
    })
  },

})
