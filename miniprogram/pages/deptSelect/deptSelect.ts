import { IMyApp } from '../../app'

const app = getApp<IMyApp>()

let restUrl: string;
let eventChannel;

Page({
  data: {
    keyword:null,
    offset: 0 as number,
    pageSize: 20 as number,
    dataList: [],
    selectedKey: null,
    selectedObject: {}
  },
  onLoad(option) {
    this.requestDeptSelect(option);
  },
  requestDeptSelect(options?: any) {
    restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/functions/f'

  //用于人可直接带出部门
    if (options.employeeid) {
      restUrl += ';users.id=' + options.employeeid
    }
    //搜索功能
    
    if (options.dept){
      let reg = /^[\u3220-\uFA29]+$/;
      //非中文默认为部门编号查找
      if (!reg.test(options.dept)) {
        restUrl += ';organizationUnit.id=' + options.dept
      } else {
        //中文默认使用部门名称查找
        restUrl += ';organizationUnit.organizationUnitName=' + options.dept
      }

    }
    restUrl+='/s'
    restUrl += '/' + this.data.offset + '/' + this.data.pageSize
    
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

  sltwordInput(e) {
    this.setData!({
      keyword: e.detail.value
    })
  },
  bindDeptQuery(e) {
    console.log("查找");
    var word = this.data.keyword;
    this.requestDeptSelect({ 'dept': word });
  },
  bindDeptSelected(e) {
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
      if (o.organizationUnit.id == e.detail.value) {
        this.setData!({
          selectedObject: { k: o.organizationUnit.id, v: o.organizationUnit.organizationUnitName }
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
            eventChannel.emit('returnDeptSelect', that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})
