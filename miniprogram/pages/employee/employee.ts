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
    keyword : ''
  },
  onLoad(option) {
    this.requestData(option);
  },
  requestData(options?: any) {
    restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/f;/s/0/10/'
    //restUrl = 'http://172.16.80.99:8480/Hanbell-JRS/api/efgp/users/f;/s/0/10/'
    //console.log(restUrl)
    wx.request({
      url: restUrl,
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
          dataList: res.data
        })
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },
  employeeQuery() {
    console.log("查找");
    let word = this.data.keyword;
    console.log(word);
    let list = this.data.dataList;
    let showlist = [];
    list.forEach((value, index, array) => {
      //console.log("value："+value+"--index："+index);
      console.log(array[index].id);
      let k = array[index].id;
      let v = array[index].userName;
      if (k.indexOf(word) > -1 || v.indexOf(word) > -1) {
        showlist.push(array[index]);
      }
    });

      this.setData!({
        dataList: showlist
      })
   
  },
  sltwordInput(e) {
    this.setData!({
      keyword: e.detail.value
    })
  },
  bindSelected(e) {
    console.log(e)
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
      console.log(o)
      if (o.id == e.detail.value) {
        this.setData!({
          selectedObject: { k: o.id, v: o.userName }
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
            eventChannel.emit('returnemployee', that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})
