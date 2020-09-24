import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let restUrl: string;
let eventChannel;
Page({
  data: {
    offset: 0 as number,
    pageSize: 20 as number,
    dataList: [],
    selectedKey: null,
    selectedObject: {}
  },
  onLoad(option) {
    this.requestData(option);
  },
  requestData(options?: any) {
    restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl037/carType'
    //restUrl = 'http://172.16.80.99:8480' + '/Hanbell-JRS/api/efgp/hkgl037/carType'
    console.log(restUrl)
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
        this.setData!({
          dataList: res.data
        })
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },
  bindSelected(e) {
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
      if (o.k == e.detail.value) {
        this.setData!({
          selectedObject: { k: o.k, v: o.v }
        })
      }
    })
    //console.log(this.data.selectedObject)
    if (this.data.selectedObject) {
      let that = this
      wx.showModal({
        title: '系统消息',
        content: '已选择,是否返回',
        success(res) {
          if (res.confirm) {
            eventChannel = that.getOpenerEventChannel()
            eventChannel.emit('returncarTypeSelect', that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})
