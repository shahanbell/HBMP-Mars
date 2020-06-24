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
    typeList: [
      { key: 'customerCode', value: '客户代号', url: '/Hanbell-JRS/api/crm/crmgg/customercode', eventName: 'returnCustomerCodeSelect' },
      { key: 'machineType', value: '机型', url: '/Hanbell-JRS/api/crm/djx/machinetype', eventName: 'returnMachineTypeSelect' },
      { key: 'incidentProvince', value: '事发省', url: '/Hanbell-JRS/api/crm/dsh/incidentProvince', eventName: 'returnIncidentProvinceSelect' },
      { key: 'problemType', value: '问题分类', url: '/Hanbell-JRS/api/crm/serac/problemtype', eventName: 'returnProblemTypeSelect' },
      { key: 'incidentCity', value: '事发市', url: '/Hanbell-JRS/api/crm/dcs/incidentCity', eventName: 'returnIncidentCitySelect' },
      { key: 'productNumber', value: '产品序号', url: '/Hanbell-JRS/api/crm/repmi/productNumber', eventName: 'returnProductNumberSelect' },
      { key: 'repairno', value: '叫修单号', url: '/Hanbell-JRS/api/crm/repta/repair', eventName: 'returnRepairnoSelect' },
      { key: 'warehouse', value: '仓库', url: '/Hanbell-JRS/api/crm/warmj/warehouse', eventName: 'returnWarehouseSelect' },
      { key: 'deliverydept', value: '发货部门', url: '/Hanbell-JRS/api/crm/cmsme/deliverydept', eventName: 'returnDeliverydeptSelect' },
    ]
  }, 
  onLoad(option) {
    var type = option.type;
    this.data.typeList.forEach((o, i) => {
      if (o.key == type) {
        this.setData!({
          showWin: o.value,
          eventName: o.eventName
        })
        if ('' != o.url) {
          this.setData!({
            url: o.url
          })
          if (option.id != null) {
            this.setData!({
              url: o.url + '/' + option.id
            })
          }
          this.requestdata(option);
        }
      }
    })
  },
  requestdata(options?: any) {
    wx.request({
      url: app.globalData.restAdd+ this.data.url + '?searchWord=' + this.data.keyword,
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
        console.log("JSON=="+JSON.stringify(fail))
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
