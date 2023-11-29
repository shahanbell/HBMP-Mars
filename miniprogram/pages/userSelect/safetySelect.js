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
        selectedObject: {},
        keyword: null
    },
    onLoad: function (option) {
        this.requestUserSelect(option);
    },
    requestUserSelect: function (options) {
        var _this = this;
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/secureUser/f';
        console.log("options")
        console.log(options)
        if (options.userInfo) {
            var reg = /^[\u3220-\uFA29]+$/;
            if (!reg.test(options.userInfo)) {
                restUrl += ';secureId=' + options.userInfo;
            }
            else {
                restUrl += ';secureName=' + options.userInfo;
            }
        }
        if (options.deptNo) {
          restUrl += ';deptNo=' + options.deptNo;
        }

        if (options.dept) {
            restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/secureUser/f';
            restUrl += ';organizationUnit.id=' + options.dept;
        }
        restUrl += '/s';
        restUrl += '/' + this.data.offset + '/' + this.data.pageSize;
        restUrl = encodeURI(restUrl);
        wx.request({
            url: restUrl,
            data: {
                appid: app.globalData.restId,
                token: app.globalData.restToken
            },
            header: {
              'content-type': 'application/json;charset=utf-8'
            },
            method: 'GET',
            success: function (res) {
                  console.log(res);
              if(res.data == "" || res.statusCode != 200){
                wx.hideLoading();
                return;
              }
                _this.setData({
                    dataList: res.data
                });
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    },
    sltwordInput: function (e) {
        this.setData({
            keyword: e.detail.value
        });
    },
    budUserQuery: function () {
        console.log("查找");
        var word = this.data.keyword;
        this.requestUserSelect({ 'userInfo': word });
    },
    bindUserSelected: function (e) {
        var _this = this;
        console.log(e);
        console.log("33333333");
        this.setData({
            selectedKey: e.detail.value
        });
        this.data.dataList.forEach(function (o, i) {
            if (o.secureId == e.detail.value) {
                _this.setData({
                    selectedObject: { k: o.secureId, v: o.secureName }
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
                        eventChannel.emit('returnUserSelect', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
