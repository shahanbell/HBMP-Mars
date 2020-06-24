import { IMyApp } from '../../app'

const app = getApp<IMyApp>()

let eventChannel;

Page({
  data: {
    offset: 0 as number,
    pageSize: 20 as number,
    dataList: [],
    selectedKey: null,
    selectedObject: {},
    keyword: '',
    eventName: '',
    showWin: '',
    loadingHidden: false,
    url: '',
  },
  onLoad() {
    this.requestdata();
  },
  requestdata(options?: any) {
    wx.request({
      url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/repmi/productQuality?searchWord=' + this.data.keyword,
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
          dataList: res.data.data,
          loadingHidden: true,
        })
      },
      fail: fail => {
        console.log("JSON==" + JSON.stringify(fail))
      }
    })
  },
  sltwordInput(e) {
    this.setData!({
      keyword: e.detail.value
    })
  },
  budDataQuery() {
    this.setData!({
      loadingHidden: false,
    })
    let word = this.data.keyword;
    this.requestdata({ 'keyword': word });
  },

  bindDataSelected(e) {
    console.log(e)
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
      if (o.key == e.detail.value) {
        this.setData!({
          selectedObject: o
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
            eventChannel = that.getOpenerEventChannel()
            eventChannel.emit('returnProductQualitySelect', that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})
