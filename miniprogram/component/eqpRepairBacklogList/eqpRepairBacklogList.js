var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  
  options: {
    addGlobalClass: true
  },
  properties: {
    endHeight: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    repairBacklogList:[],
    winHeight: 574,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getRepairBacklogList: function (res) {
      var _this = this;
      var repairBacklogList = null;
      var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/getRepairBacklogList';
      if(app.globalData.defaultDeptId.indexOf("1W3") >= 0){
        restUrl += '/f;serviceuser=' + res;
      }
      else{
        restUrl += '/f;repairuser=' + res;
      }
      restUrl += ';ALL=ALL';

      restUrl += '/s/' + 0 + '/' + 20;
      //console.log(restUrl);
      wx.showLoading({
        title: '获取中...',
        mask: true
      });
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
        success: function (res) {
          //console.log(res);
  
          repairBacklogList = null;
  
          _this.setData({
            repairBacklogList: []
          });
  
          if(res.data == "" || res.statusCode != 200){
            //console.log("no Data");
            _this.setData({
              showDocEmpty: true
            });
            wx.hideLoading();
            return;
          }
  
          repairBacklogList = res.data;
          var dataLen = res.data.length;
  
          for(var i = 0;i < dataLen; i++){
            let newItem = {pId:'',userNo:'',creDate:'',contenct:'',isRead:''};
            newItem.pId = repairBacklogList[i].formid;
            newItem.userNo = repairBacklogList[i].repairusername;
            newItem.creDate = _this.utcInit(repairBacklogList[i].hitchtime);
            newItem.contenct = _this.getDocStatus(repairBacklogList[i].rstatus);
            newItem.isRead = repairBacklogList[i].status;
            _this.data.repairBacklogList.push(newItem);
          }
  
          _this.setData({
            //repairDocList: _this.data.repairDocList,
            repairBacklogList: _this.data.repairBacklogList,
          });
  
          //console.log(_this.data.repairBacklogList);
  
          wx.hideLoading();
        },
        fail: function (fail) {
          wx.hideLoading();
          console.log(fail.data);
          Dialog.alert({
            title: '系统消息',
            message: fail.data + "-" + fail.statusCode + "-" + fail.header + "-" + fail.cookies,
          }).then(() => {
            // on close
            //initProInfo(_this);
          });
        }
      });
    },

    utcInit: function(utc_datetime) {
      if(utc_datetime == null || utc_datetime == ''){
        return;
      }
      // 转为正常的时间格式 年-月-日 时:分:秒
      var T_pos = utc_datetime.indexOf('T');
      var Z_pos = utc_datetime.indexOf('Z');
      var year_month_day = utc_datetime.substr(0,T_pos);
      var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
      var new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06
  
      // 处理成为时间戳
      timestamp = new Date(Date.parse(new_datetime));
      timestamp = timestamp.getTime();
      timestamp = timestamp/1000;
  
      // 增加8个小时，北京时间比utc时间多八个时区
      var timestamp = timestamp+8*60*60;
  
      // 时间戳转为时间
      //var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
  
      let dateTemp = new Date(parseInt(timestamp) * 1000);
      //console.log(event);
      let year = dateTemp.getFullYear();
      let month = dateTemp.getMonth() + 1;
      let day = dateTemp.getDate();
      let hour = dateTemp.getHours();
      let minute = dateTemp.getMinutes();
      let dayTemp = year + "/" + month + "/" + day + "  " + hour + ":" + minute;
      return dayTemp;
  
  
      //return beijing_datetime; // 2017-03-31 16:02:06
    },

    backlogCardSelect: function(e) {
      //console.log(e);
      //console.log(e.currentTarget.dataset.item.pId);
      wx.navigateTo({
        url: '../eqpManagement/eqpRepairDocDetail?docFormidId=' + e.currentTarget.dataset.item.pId
      })
    },

    getDocStatus: function(statusCode){
      switch(statusCode) {
        case "10":
            return "已报修";
        case "20":
            return "维修到达";
        case "30":
            return "维修完成";
        case "40":
            return "维修验收";
        case "50":
            return "责任回复";
        case "60":
            return "课长审核";
        case "70":
            return "经理审核";
        case "95":
            return "报修结案";
        case "98":
            return "已作废";
        default:
            return;
      } 
    },

    getStartViewHeight(){
      let that = this;
      wx.createSelectorQuery().in(this).select('#start').boundingClientRect(function(rect){
        //console.log("test2: "+ rect.bottom);  // 节点的高度
        //console.log(rect);
        //console.log("endHeight" + that.properties.endHeight);
        let heightTemp = that.properties.endHeight-rect.bottom;
        that.setData({
          winHeight:heightTemp
        });
      }).exec();
    },
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    ready: function(){
      //视图层布局完成
      //this.getSearchBarRect();
      this.getStartViewHeight();
      this.getRepairBacklogList(app.globalData.employeeId);
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      //console.log('component show');
      this.getRepairBacklogList(app.globalData.employeeId);
     },
    hide: function () { },
    resize: function () { },
  },
})
