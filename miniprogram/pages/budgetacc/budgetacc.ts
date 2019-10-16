import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let restUrl: string;
let eventChannel;
Page({
  data: {
    offset: 0 as number,
    pageSize: 200 as number,
    dataList: [],
    selectedKey: null,
    selectedObject: {},
    keyword:null
  },
  onLoad(option) {
    this.requestData(option);
  },
  requestData(options?: any) {
    let list = wx.getStorageSync("budgetaccList");
    console.log(list)
    if(list != null&&list.length>0){
      this.setData!({
        dataList: list
      });
      console.log("缓存获取")
     return; 
    }
    console.log("api获取")
    restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/erp/budgetcenteracc/f;budgetcenteraccdetailPK.facno=C;budgetcenteraccdetailPK.centerid=13000/s/' +this.data.offset + '/' +this.data.pageSize+'/',
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
       // console.log(res.data)
        this.setData!({
          dataList: res.data
      
        });
        //将数据存储在本地缓存中指定的 key 中
        wx.setStorage({
          key: "budgetaccList",
          data: res.data
        })
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },

  budgetaccQuery(){
    console.log("查找");
    let word = this.data.keyword;
    let list = this.data.dataList;
    let showlist=[];
    list.forEach((value, index, array)=>{
      //console.log("value："+value+"--index："+index);
      console.log(array[index].budgetCenterAccDetailPK);
      let k = array[index].budgetCenterAccDetailPK.budgetacc;
      let v = array[index].budgetAccount.accname;
      if (k.indexOf(word) > -1 || v.indexOf(word)>-1){
        showlist.push(array[index]);
      }
    });
    
   
      if(showlist.length <1){
        this.setData!({
          dataList:wx.getStorage("budgetaccList")
        })
      }else{
        this.setData!({
          dataList: showlist
        })
      }
        
      

     
    
  },
  bindBudgetaccSelected(e) {
    console.log(e.detail.value)
    this.setData!({
      selectedKey: e.detail.value
    })
    this.data.dataList.forEach((o, i) => {

      if (o.budgetCenterAccDetailPK.budgetacc == e.detail.value) {
        this.setData!({
          selectedObject: { k: o.budgetCenterAccDetailPK.budgetacc, v: o.budgetAccount.accname }
        })
      }
    })
    console.log(this.data.selectedObject)
    if (this.data.selectedObject) {
      let that = this
      wx.showModal({
        title: '系统消息',
        content: '已选择,是否返回',
        success(res) {
          if (res.confirm) {
            eventChannel = that.getOpenerEventChannel()
            eventChannel.emit('returnBudgetacc', that.data.selectedObject)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  sltwordInput(e){
    this.setData!({
      keyword: e.detail.value
    })
  }
})
