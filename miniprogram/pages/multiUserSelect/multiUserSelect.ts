import { IMyApp } from '../../app'

const app = getApp<IMyApp>()

let restUrl: string;
let eventChannel;

Page({
  data: {
    offset: 0 as number,
    pageSize: 20 as number,
    dataList: [],
    result: [],
    selectAll: null
  },
  onLoad(option) {
    this.requestDeptSelect(option);
  },
  requestDeptSelect(options?: any) {
    restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/f'
    //搜索人员部分
    if (options.userInfo) {
      let reg = /^[\u3220-\uFA29]+$/;
      if (!reg.test(options.userInfo)) {
        restUrl += ';id=' + options.userInfo
      } else {
        restUrl += ';userName=' + options.userInfo
      }
    }
    //通过部门带出所有人
    if (options.dept) {
      restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/functions/organizationunit/f'
      restUrl += ';organizationUnit.id=' + options.dept

    }

    restUrl += '/s'
    restUrl += '/' + this.data.offset + '/' + this.data.pageSize
    //console.log(restUrl)
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
             var list=[];
              res.data.forEach(function (o, i) {
                  list[i]=({ ...o, isSelect:false})
              });
        this.setData!({
          dataList: list
        })
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },
  bindClickSelectAll(e){
    var _this = this
    console.info("-1111-" + JSON.stringify(e))
    //取消全选
    if (_this.data.selectAll == '1') {
      _this.setData({
        selectAll: 0,
        result: []
      });
    } else {
      //全选
      const { name } = e.currentTarget.dataset;
      var list = [];
      _this.data.dataList.forEach(function (o, i) {
        list[i] = o.id
      });
      this.setData({
        selectAll: name,
        result: list
      });
    }
  },
  bindUserSelected(e) {
    console.log(e)
    console.info('3+++' + JSON.stringify(e))
    var _this = this;

    _this.setData({
      result: e.detail,
    });

    this.data.dataList.forEach(function (o, i) {
      if (o.id == e.detail.value) {
        o.isSelect = true
      }
    });
  
  },
submitForm(e) {
  var list=[]
  var _this=this
  _this.data.dataList.forEach(function (o, i) {
    o.isSelect = false
    _this.data.result.forEach(function(o1,i1){
        if(o.id==o1){
          o.isSelect=true
          list.push(o);
        }
    })
  });
    console.info('==='+JSON.stringify(this.data.result))
    console.log('123124'+JSON.stringify(this.data.dataList));


  eventChannel = _this.getOpenerEventChannel()
  eventChannel.emit('returnUserSelect', list)
  wx.navigateBack({
    delta: 1
  })
    
  }
})
