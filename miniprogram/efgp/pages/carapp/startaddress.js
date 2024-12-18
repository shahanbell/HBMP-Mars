"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var restUrl;
var eventChannel;
Page({
    data: {
        offset: 0,
        pageSize: 20,
        dataList: [],
        selectedKey: null,
        selectedObject: {}
    },
    onLoad: function (option) {
      var that = this;
      console.info("111")
      let a={'k':'1','v':'枫泾厂出发'};
      console.info(typeof( that.data.dataList))
      that.data.dataList.push(a);
      that.setData({
        dataList: [{'k':'1','v':'枫泾厂出发'},
        {'k':'2','v':'兴塔厂出发'},
        {'k':'3','v':'分公司出发'},
        {'k':'4','v':'汉声厂出发'},
        {'k':'5','v':'汉扬厂出发'},
        {'k':'6','v':'楚雄出发'}
      ]
    });
    
  },
    bindSelected: function (e) {
        var _this = this;
        this.setData({
            selectedKey: e.detail.value
        });
        this.data.dataList.forEach(function (o, i) {
            if (o.k == e.detail.value) {
                _this.setData({
                    selectedObject: { k: o.k, v: o.v }
                });
            }
        });
        if (this.data.selectedObject) {
            var that_1 = this;
            wx.showModal({
                title: '系统消息',
                content: '已选择,是否返回',
                success: function (res) {
                    if (res.confirm) {
                        eventChannel = that_1.getOpenerEventChannel();
                        eventChannel.emit('returnStartAddressSelect', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});