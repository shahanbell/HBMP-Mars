import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let restUrl: string;
let eventChannel;
Page({
  data: {
    offset: 0 as number,
    pageSize: 20 as number,
    dataList: [],
    selectedKey: null,
    selectedObject: {},
    eventName: '',
    showWin: '',
    loadingHidden:false,
    typeList: [
      { key: 'complaintType', value: '客诉类型', url: '', eventName: 'returnComplaintTypeSelect'},
      { key: 'productType', value: '品号类别', url: '/Hanbell-JRS/api/crm/warma/wechat/producttype', eventName: 'returnProductTypeSelect' },
      { key: 'area', value: '区域别', url: '/Hanbell-JRS/api/crm/porbg/wechat/area', eventName: 'returnAreaSelect' },
      { key: 'form', value: '单别', url: '/Hanbell-JRS/api/crm/repmq/wechat/form', eventName: 'returnFormSelect' },
      { key: 'product', value: '产品别', url: '/Hanbell-JRS/api/crm/dfwel/wechat/product', eventName: 'returnProductSelect' },
    ]
  },
  onLoad(option) {
    
    var type = option.type;
    this.data.typeList.forEach((o, i) => {
      if (o.key == type) {
        this.setData!({
          showWin: '请选择' + o.value,
          eventName: o.eventName
        })
        //路径为空，则自定义数据
        if ('' == o.url) {
          this.setData!({
            dataList: [
              { key: '1', value: '客户投诉' },
              { key: '2', value: '营业要求赠送' },
              { key: '3', value: '技术支持' },
              { key: '4', value: '统包服务' },
              { key: '5', value: '例行巡检' },
              { key: '6', value: '客户财产维修' },
              { key: '7', value: '收费服务' },
              { key: '8', value: '新机调试' },
              { key: '9', value: '服务要求赠送' }
            ],
            loadingHidden: true
          })

        } else {
          wx.request({
            url: app.globalData.restAdd + o.url,
            data: {
              appid: app.globalData.restId,
              token: app.globalData.restToken
            }
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            success: res => {
              this.setData!({
                dataList: res.data.data,
                loadingHidden: true
              })
            },
            fail: fail => {
              console.log(fail)
            }
          })

        }
      }
    })
  },
  bindSelected(e) {
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
      if (o.key == e.detail.value) {
        this.setData!({
          selectedObject: { key: o.key, value: o.value }
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
            eventChannel.emit(that.data.eventName, that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
    
  }
})
