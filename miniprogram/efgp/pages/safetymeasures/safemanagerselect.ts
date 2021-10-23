import { IMyApp } from '../../app'

const app = getApp<IMyApp>()

let restUrl: string;
let eventChannel;

Page({
  data: {
    keyword: null,
    offset: 0 as number,
    pageSize: 20 as number,
    dataList: [],
    selectedKey: null,
    selectedObject: {}
  },
  onLoad(option) {
    var _this=this
    var o = [{ "username": "周成", "userid": "C0208" },
    { "username": "蔡惠强", "userid": "C0347" },
    { "username": "倪华伟", "userid": "C0049" },
    { "username": "彭希民", "userid": "C0235" },
    { "username": "胡其明", "userid": "C0252" },
    { "username": "谢士峰", "userid": "C0127" },
    { "username": "吴晓勋", "userid": "C0423" },
    { "username": "付春芳", "userid": "C0481" },
    { "username": "姚军华", "userid": "C0320" },
    { "username": "郁建峰", "userid": "C0808" },
    { "username": "沈志光", "userid": "C0270" },
    { "username": "徐斌", "userid": "K0027" },
    { "username": "张勤建", "userid": "K0076" },
    { "username": "陈后迎", "userid": "C0584" },
    { "username": "周贤", "userid": "C0677" },
    { "username": "唐剑", "userid": "C0779" },
    { "username": "俞江华", "userid": "C0048" },
    { "username": "杨称峰", "userid": "C0313" },
    { "username": "陆迎春", "userid": "C0054" }];
    _this.setData({
      dataList:o
    })
  },
  bindSafeManagerSelect(e) {
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {
      if (o.userid == e.detail.value) {
        this.setData!({
          selectedObject: { k: o.userid, v: o.username }
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
            eventChannel.emit('returnSafeManagerSelect', that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})
