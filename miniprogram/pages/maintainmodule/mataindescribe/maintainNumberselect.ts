import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let restUrl: string;
let eventChannel;
Page({
  data: {
    offset: 0 as number,
    pageSize: 200 as number,
    dataList: [],
    selectedKey: null,
    option:{},
    selectedObject: {},
    keyword: '',
    loadingHidden: false
  },
  onLoad(option) {
    var that=this;
    that.setData({
      option: option
    });
    that.requestData()
   
  },
  requestData(){
    var that = this;
    var type = that.data.option.type;
    var restUrl;
    if (type == 0) {
      restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repte/validateDate/' + app.globalData.employeeId+'?searchWord='+that.data.keyword;
    } else if (type == 1) {
      restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/reptc/maintainform/' + that.data.option.maintaintype + '?searchWord=' + that.data.keyword;
    }
   
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
        var list = [];
        var data = res.data.data
        if (type == 1) {
          data.forEach((value, index, array) => {
            var o = array[index];
            list.push({
              key: index, maintainType: o.REPTCPK.tc001, maintainNumberName: o.REPTCPK.tc002, maintainSerial: '', customerName: o.tc036, productName: o.tc009, problemId: o.tc077, problemName: o.tc013, roadStartDate: '', roadEndDate: '', arrivalDate: '', leaveDate: ''
            })
          });

        } else if (type == 0) {
          data.forEach((value, index, array) => {
            var o = array[index];
            
            list.push({
              key: index, maintainType: o.te001, maintainNumberName: o.te002, maintainSerial: o.te004, customerName: o.customerName, productName: o.productName, problemId: o.problemId, problemName: o.problemName, roadStartDate: o.roadStartDate, roadEndDate: o.roadEndDate, arrivalDate: o.arrivalDate, leaveDate: o.leaveDate
            })
          });
        }
        that.setData!({
          dataList: list
        })
      },
      fail: fail => {
        console.log(fail)
      }
    })

  },
  changeSearchWord(e){
    var that=this;
    that.setData({
      keyword:e.detail.value
    })
  },
  budgetaccQuery(e) {
    var that = this;
    that.requestData();

  },
  bindDataSelected(e) {
    console.log("==" + JSON.stringify(e.detail.value))
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
      if (o.key == e.detail.value) {
        this.setData!({
          selectedObject: { key: o.key, value: o }
        })
      }
    })
    if (this.data.selectedObject) {
      let that = this
      wx.showModal({
        title: '系统消息',
        content: '已选择,是否返回',
        success(res) {
          if (res.confirm) {
            eventChannel = that.getOpenerEventChannel();
            eventChannel.emit('returnMaintainNumberSelect', that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  sltwordInput(e) {
    this.setData!({
      keyword: e.detail.value
    })
  }
})
