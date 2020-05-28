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
      { key: 'customerCode', value: '客户代号', url: '/Hanbell-JRS/api/crm/crmgg/wechat/customercode', eventName: 'returnCustomerCodeSelect' },
      { key: 'machineType', value: '机型', url: '/Hanbell-JRS/api/crm/djx/wechat/machinetype', eventName: 'returnMachineTypeSelect' },
      { key: 'incidentProvince', value: '事发省', url: '/Hanbell-JRS/api/crm/dsh/wechat/incidentProvince', eventName: 'returnIncidentProvinceSelect' },
      { key: 'problemType', value: '问题分类', url: '/Hanbell-JRS/api/crm/serac/wechat/problemtype', eventName: 'returnProblemTypeSelect' },
      { key: 'incidentCity', value: '事发市', url: '/Hanbell-JRS/api/crm/dcs/wechat/incidentCity', eventName: 'returnIncidentCitySelect' },
      { key: 'productNumber', value: '产品序号', url: '/Hanbell-JRS/api/crm/repmi/wechat/productNumber', eventName: 'returnProductNumberSelect' },
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
    console.info("5565" + this.data.url);
    wx.request({
      url: app.globalData.restAdd + this.data.url + '?searchWord=' + this.data.keyword,
      data: {
        // appid: app.globalData.restId,
        // token: app.globalData.restToken
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
        console.log(fail)
      }
    })
  },
  sltwordInput(e) {
    this.setData!({
      keyword: e.detail.value
    })
  },
  budDataQuery() {
    let word = this.data.keyword;
    this.requestdata({ 'keyword': word });
  },
  bindDataSelected(e) {
    console.log(e)
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
      console.info("11111")
      if (o.key == e.detail.value) {
        this.setData!({
          selectedObject: o
        })
        console.info("this.data.eventName=" + this.data.eventName)
        if (this.data.eventName == 'returnCustomerCodeSelect') {
          console.info("1111111111111")
          wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/crmgg/wechat/caller/' + o.key,
            data: {
              // appid: app.globalData.restId,
              // token: app.globalData.restToken
            },
            header: {
              'content-type': 'application/json'
            },
            method: 'GET',
            success: res => {
              var m = {};
              var _res = res.data.data;
              m.key = o.key;
              m.value = o.value;
              m.callerUnit = _res[0].GG003;
              m.caller = _res[0].GD005;
              // m.callerPhone
              m.phoneCountry = _res[0].GD025;
              m.phoneArea = _res[0].GD026;
              m.phoneCountry1 = _res[0].GD027;
              m.phoneArea1 = _res[0].GD012;
              m.dealer = _res[0].GD199;
              this.setData!({
                selectedObject: m,
                loadingHidden: true
              })

              if (this.data.selectedObject) {
                let that = this
                wx.showModal({
                  title: '系统消息',
                  content: '已选择,是否返回',
                  success(res) {
                    if (res.confirm) {
                      eventChannel = that.getOpenerEventChannel();
                      console.info("==11" + JSON.stringify(that.data.selectedObject));
                      eventChannel.emit(that.data.eventName, that.data.selectedObject)
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              }

            },
            fail: fail => {
              console.log(fail)
            }
          })
        } else {
          this.setData!({
            selectedObject: o
          })

          if (this.data.selectedObject) {
            let that = this
            wx.showModal({
              title: '系统消息',
              content: '已选择,是否返回',
              success(res) {
                if (res.confirm) {
                  eventChannel = that.getOpenerEventChannel();
                  console.info("==11" + JSON.stringify(that.data.selectedObject));
                  eventChannel.emit(that.data.eventName, that.data.selectedObject)
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }
        }
      }
    })
    //console.log(this.data.selectedObject)

  }
})
