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
    keyword: null
  },
  onLoad(option) {
    this.requestUserSelect(option);
  },
  requestUserSelect(options?: any) {
    restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/f'

    //搜索人员部分
    if (options.userInfo) {
      let reg = /^[\u3220-\uFA29]+$/;
      if (!reg.test(options.userInfo)){
        restUrl += ';id=' + options.userInfo
      }else{
        restUrl += ';userName=' + options.userInfo 
    } 
    }
//通过部门带出所有人
      if (options.dept){
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/functions/organizationunit/f'
        restUrl += ';organizationUnit.id=' + options.dept

}

      restUrl += '/s'
   
    restUrl += '/' + this.data.offset + '/' + this.data.pageSize
    //console.log(restUrl)
    wx.request({
      url: encodeURI(restUrl),
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
  budUserQuery() {
    console.log("查找");
    let word = this.data.keyword;
    this.requestUserSelect({'userInfo':word});
    
  },
  bindUserSelected(e) {
    console.log(e)
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
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
            eventChannel.emit('returnUserSelect', that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})
