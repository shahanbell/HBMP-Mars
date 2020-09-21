"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var drawQrcode = require("../../../utils/weapp.qrcode.min.js");
var app = getApp();
var restUrl;
var eventChannel;
Page({
    data: {
        option1: [
            { text: '路程开始时间', value: 1 },
            { text: '到达时间', value: 2 },
            { text: '离开时间', value: 3 },
            { text: '路程结束时间', value: 4 },
        ],
        problemView: false,
        showModal: false,
        circle: '',
        modalHidden: true,
        selectValue: 1,
        dateview: '',
        addressView: '',
        addressNameView: '',
        roadStartDate: '',
        arrivalDate: '',
        leaveDate: '',
        roadEndtDate: '',
        maintainDescribe: '',
        maintainNumberId: '',
        maintainNumberName: '',
        maintainSerial: '',
        customerName: '',
        productName: '',
        problemId: '',
        problemName: '',
        maintainTypeId: '',
        punchDate: '',
        punchDateView: '',
        loadingHidden: false
    },
    onLoad: function (option) {
        var _this_1 = this;
        var that = this;
        wx.getStorage({
            key: 'pageData',
            success: function (res) {
                var myData = res.data;
                if (JSON.stringify(myData) == '{}') {
                    that.setData({
                        selectValue: 1
                    });
                }
                else {
                    that.setData({
                        maintainTypeId: myData.maintainTypeId,
                        maintainNumberId: myData.maintainNumberId,
                        maintainSerial: myData.mainSerial,
                        customerName: myData.customerName,
                        productName: myData.productName,
                        problemId: myData.problemId,
                        problemName: myData.problemName,
                        roadStartDate: myData.roadStartDate,
                        arrivalDate: myData.arrivalDate,
                        leaveDate: myData.leaveDate,
                        roadEndtDate: myData.roadEndtDate,
                        selectValue: myData.selectValue,
                        maintainDescribe: myData.handlingInfo
                    });
                }
            }
        });
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/repmq/maintainform/' + app.globalData.employeeId,
            data: {
                appid: app.globalData.restId,
                token: app.globalData.restToken
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                var list = res.data.data;
                if (list.length != 1) {
                    wx.showModal({
                        title: '系统提示',
                        content: '员工维修单号存在异常，请联系管理员',
                        showCancel: false
                    });
                }
                _this_1.setData({
                    maintainTypeId: res.data.data[0].key
                });
                var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repte/validateDate/' + app.globalData.employeeId;
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
                        _this_1.setData({
                            loadingHidden: true
                        });
                        if (res.data.code == 201) {
                            _this_1.setData({
                                problemView: true
                            });
                        }
                    },
                    fail: function (fail) {
                        console.log(fail);
                    }
                });
                var that = _this_1;
                that.getTime();
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    },
    utf16to8: function (str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            }
            else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
            else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },
    queryIp: function (res) {
        var that = this;
        if (that.data.maintainTypeId == '' || that.data.maintainNumberId == '' || that.data.customerName == '') {
            wx.showModal({
                title: '系统提示',
                content: "请先绑定表单",
                showCancel: false
            });
            return;
        }
        var txt = "maintainDescribe_" + that.data.maintainTypeId + "_" + that.data.maintainNumberId + "_" + app.globalData.employeeId + "_" + app.globalData.employeeName + "_" + that.data.customerName;
        var state = that.utf16to8(txt);
        var qrcode_width = 300;
        var qrcode_typeNumber = 7;
        var qrcode_background = "#FFFFFF";
        var qrcode_foreground = "#000000";
        var qrcode_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx197c3762bc4258f0&redirect_uri=" + app.globalData.weChatCallBack + "&response_type=code&scope=snsapi_userinfo&state=" + state + "&#wechat_redirect";
        var qrcode_url_length = qrcode_url.length;
        if (qrcode_url_length < 64) {
            qrcode_typeNumber = 7;
        }
        else if (qrcode_url_length >= 64 && qrcode_url_length < 119) {
            qrcode_typeNumber = 10;
        }
        else if (qrcode_url_length >= 119 && qrcode_url_length < 129) {
            qrcode_typeNumber = 15;
        }
        else if (qrcode_url_length >= 129 && qrcode_url_length < 382) {
            qrcode_typeNumber = 20;
        }
        else {
            qrcode_typeNumber = 27;
        }
        if (qrcode_url) {
            drawQrcode({
                width: 256,
                height: 256,
                x: 20,
                y: 20,
                canvasId: 'logoQRCode',
                typeNumber: qrcode_typeNumber,
                text: qrcode_url,
                background: qrcode_background,
                foreground: qrcode_foreground,
                correctLevel: 2,
            });
            that.setData({
                modalHidden: false
            });
        }
        else {
            wx.showToast({
                title: "请输入字符串，可以是网址、文本等",
                icon: "none",
                duration: 1000
            });
        }
    },
    modalCandel: function () {
        this.setData({
            modalHidden: true
        });
    },
    modalConfirm: function () {
        this.setData({
            modalHidden: true
        });
    },
    onSwitch2Change: function (detail) {
        this.setData({
            selectValue: detail.detail
        });
    },
    eject: function () {
        this.setData({
            showModal: true
        });
    },
    back: function () {
        this.setData({
            showModal: false
        });
    },
    wish_put: function (e) {
        this.setData({
            maintainDescribe: e.detail.value
        });
    },
    ok: function () {
        console.log(this.data.maintainDescribe);
        this.setData({
            showModal: false
        });
    },
    bindLocationSelect: function () {
        var that = this;
        that.getPermission(that, "RoadStartDate");
    },
    bindMatainFormSelect: function () {
        var that = this;
        var url = './maintainNumberselect?maintaintype=' + that.data.maintainTypeId + '&type=1';
        if (that.data.problemView == true) {
            wx.showModal({
                title: '系统提示',
                content: '您有维修描述存在问题，是否查看',
                showCancel: true,
                cancelText: '取消',
                confirmText: '查看',
                success: function (res) {
                    if (res.confirm == true) {
                        url = './maintainNumberselect?maintaintype=' + that.data.maintainTypeId + '&type=0';
                        wx.navigateTo({
                            url: url,
                            events: {
                                returnMaintainNumberSelect: function (res) {
                                    if (res) {
                                        that.setData({
                                            maintainNumberId: res.value.maintainNumberName,
                                            maintainNumberName: res.value.maintainNumberName,
                                            customerName: res.value.customerName,
                                            productName: res.value.productName,
                                            problemId: res.value.problemId,
                                            problemName: res.value.problemName,
                                            maintainSerial: res.value.maintainSerial,
                                            roadStartDate: res.value.roadStartDate,
                                            arrivalDate: res.value.arrivalDate,
                                            leaveDate: res.value.leaveDate,
                                            roadEndtDate: res.value.roadEndDate
                                        });
                                    }
                                }
                            },
                        });
                    }
                    else {
                        wx.navigateTo({
                            url: url,
                            events: {
                                returnMaintainNumberSelect: function (res) {
                                    if (res) {
                                        that.setData({
                                            maintainNumberId: res.value.maintainNumberName,
                                            maintainNumberName: res.value.maintainNumberName,
                                            customerName: res.value.customerName,
                                            productName: res.value.productName,
                                            problemId: res.value.problemId,
                                            problemName: res.value.problemName,
                                            maintainSerial: res.value.maintainSerial,
                                            roadStartDate: res.value.roadStartDate,
                                            arrivalDate: res.value.arrivalDate,
                                            leaveDate: res.value.leaveDate,
                                            roadEndtDate: res.value.roadEndtDate
                                        });
                                    }
                                }
                            },
                        });
                    }
                },
            });
        }
        else {
            wx.navigateTo({
                url: url,
                events: {
                    returnMaintainNumberSelect: function (res) {
                        if (res) {
                            that.setData({
                                maintainNumberId: res.value.maintainNumberName,
                                maintainNumberName: res.value.maintainNumberName,
                                customerName: res.value.customerName,
                                productName: res.value.productName,
                                problemId: res.value.problemId,
                                problemName: res.value.problemName,
                                maintainSerial: res.value.maintainSerial,
                                roadStartDate: res.value.roadStartDate,
                                arrivalDate: res.value.arrivalDate,
                                leaveDate: res.value.leaveDate,
                                roadEndtDate: res.value.roadEndtDate
                            });
                        }
                    }
                },
            });
        }
    },
    commit: function () {
        var that = this;
        var ifCommit = true;
        var msg = '';
        if (that.data.addressView == '' || that.data.addressNameView == '') {
            msg = '请先选择位置';
            ifCommit = false;
        }
        if (that.data.maintainNumberId == '') {
            msg += '请先绑定维修单';
            ifCommit = false;
        }
        if (that.data.selectValue == 3 && that.data.maintainDescribe == '') {
            msg += '描述不能为空';
            ifCommit = false;
        }
        var url;
        if (that.data.maintainSerial == '') {
            url = app.globalData.restAdd + 'Hanbell-JRS/api/crm/repte/create';
        }
        else {
            url = app.globalData.restAdd + 'Hanbell-JRS/api/crm/repte/update';
        }
        if (ifCommit) {
            var _this = this;
            var url = '';
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            var data = {
                maintainTypeId: _this.data.maintainTypeId,
                maintainNumberId: _this.data.maintainNumberId,
                mainSerial: _this.data.maintainSerial,
                maintainerId: app.globalData.employeeId,
                maintainer: app.globalData.employeeName,
                deptno: app.globalData.defaultDeptId,
                dept: app.globalData.defaultDeptName,
                problemId: _this.data.problemId,
                problemName: _this.data.problemName,
                handlingInfo: _this.data.maintainDescribe,
                customerName: _this.data.customerName,
                productName: _this.data.productName,
                punchDate: year + "/" + month + "/" + day + " " + this.data.dateview,
                addressView: _this.data.addressView,
                addressNameView: _this.data.addressNameView,
                roadStartDate: _this.data.roadStartDate,
                arrivalDate: _this.data.arrivalDate,
                leaveDate: _this.data.leaveDate,
                roadEndDate: _this.data.roadEndtDate,
                selectValue: _this.data.selectValue,
                sessionkey: app.globalData.sessionKey,
                openId: app.globalData.openId,
            };
            if (_this.data.maintainSerial == '') {
                url = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repte/create?type=' + _this.data.selectValue + "&" + app.globalData.restAuth;
            }
            else {
                url = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repte/update?type=' + _this.data.selectValue + "&" + app.globalData.restAuth;
            }
            wx.showModal({
                title: '系统提示',
                content: '确定提交吗',
                showCancel: true,
                cancelText: '取消',
                confirmText: '确定',
                success: function (res) {
                    that.setData({
                        loadingHidden: false
                    });
                    if (res.confirm == true) {
                        wx.request({
                            url: url,
                            data: data,
                            header: {
                                'content-type': 'application/json'
                            },
                            method: 'POST',
                            success: function (res) {
                                that.setData({
                                    loadingHidden: false
                                });
                                if (res.data.code == 200) {
                                    if (that.data.selectValue == 1) {
                                        data.roadStartDate = that.data.punchDateView;
                                        data.selectValue = 2;
                                    }
                                    else if (that.data.selectValue == 2) {
                                        data.arrivalDate = that.data.punchDateView;
                                        data.selectValue = 3;
                                    }
                                    else if (that.data.selectValue == 3) {
                                        data.leaveDate = that.data.punchDateView;
                                        data.selectValue = 4;
                                    }
                                    else if (that.data.selectValue == 4) {
                                        data.selectValue = 1;
                                    }
                                    if (res.data.msg != 'success' && res.data.msg != undefined) {
                                        data.mainSerial = res.data.msg;
                                    }
                                    wx.setStorage({
                                        key: 'pageData',
                                        data: data
                                    });
                                    if (data.selectValue == 1) {
                                        wx.setStorage({
                                            key: 'pageData',
                                            data: ({})
                                        });
                                    }
                                    wx.hideLoading();
                                    wx.showModal({
                                        title: '系统消息',
                                        content: "提交成功",
                                        showCancel: false,
                                        success: function (res) {
                                            wx.switchTab({
                                                url: "/pages/index/index"
                                            });
                                        }
                                    });
                                }
                                else {
                                    wx.showModal({
                                        title: '系统消息',
                                        content: "提交失败",
                                        showCancel: false,
                                        success: function (res) {
                                            wx.switchTab({
                                                url: "/pages/index/index"
                                            });
                                        }
                                    });
                                }
                            },
                            fail: function (fail) {
                                wx.hideLoading();
                            }
                        });
                    }
                    else {
                        that.setData({
                            loadingHidden: true
                        });
                    }
                }
            });
        }
        else {
            wx.showModal({
                title: '系统提示',
                content: msg,
                showCancel: false
            });
        }
    },
    getTime: function () {
        var that = this;
        var nowTime = new Date();
        var hours = nowTime.getHours();
        var minutes = nowTime.getMinutes();
        var seconds = nowTime.getSeconds();
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        var dateview = hours + ":" + minutes + ":" + seconds;
        this.setData({
            dateview: dateview,
            punchDateView: hours + ":" + minutes
        });
        setTimeout(function () {
            that.getTime();
        }, 1000);
    },
    getPermission: function (_this, data) {
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var x1 = res.longitude;
                var y1 = res.latitude;
                var speed = res.speed;
                var accuracy = res.accuracy;
                wx.chooseLocation({
                    success: function (res1) {
                        _this.setData({
                            addressView: res1.address,
                            addressNameView: res1.name,
                        });
                        var x2 = res1.longitude;
                        var y2 = res1.latitude;
                        var a = Math.sin(y1);
                        var b = Math.sin(y2);
                        var c = Math.cos(y1);
                        var d = Math.cos(y2);
                        var e = Math.cos(x1 - x2);
                        var v = a * b + c * d * e;
                        var distance = 6371.0 * Math.acos(v) * Math.PI / 180;
                        var rounddistance = Math.round(distance * 1000);
                        if (rounddistance > 70) {
                            _this.setData({
                                addressView: '',
                                addressNameView: '',
                            });
                            wx.showModal({
                                title: '系统提示',
                                content: '选择位置与当前位置为' + rounddistance + ',不得超过70米',
                            });
                        }
                    },
                    fail: function () {
                        wx.getSetting({
                            success: function (res) {
                                var statu = res.authSetting;
                                if (!statu['scope.userLocation']) {
                                    wx.showModal({
                                        title: '是否授权当前位置',
                                        content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                        success: function (tip) {
                                            if (tip.confirm) {
                                                wx.openSetting({
                                                    success: function (data) {
                                                        if (data.authSetting["scope.userLocation"] === true) {
                                                            wx.showToast({
                                                                title: '授权成功',
                                                                icon: 'success',
                                                                duration: 1000
                                                            });
                                                            wx.chooseLocation({
                                                                success: function (res) {
                                                                    _this.setData({
                                                                        addressView: '',
                                                                        addressNameView: '',
                                                                    });
                                                                },
                                                            });
                                                        }
                                                        else {
                                                            wx.showToast({
                                                                title: '授权失败',
                                                                icon: 'success',
                                                                duration: 1000
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            },
                            fail: function (res) {
                                wx.showToast({
                                    title: '调用授权窗口失败',
                                    icon: 'success',
                                    duration: 1000
                                });
                            }
                        });
                    }
                });
            },
            fail: function (res) {
                wx.showToast({
                    title: '微信服务未允许',
                    icon: 'warn',
                    duration: 1000
                });
            }
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnRhaW5EZXNjcmliZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW50YWluRGVzY3JpYmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrREFBa0U7QUFDbEUsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxPQUFlLENBQUM7QUFDcEIsSUFBSSxZQUFZLENBQUM7QUFDakIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFO1lBQ1AsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7WUFDNUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7WUFDMUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7WUFDMUIsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7U0FDN0I7UUFDRCxXQUFXLEVBQUUsS0FBSztRQUNsQixTQUFTLEVBQUUsS0FBSztRQUNoQixNQUFNLEVBQUUsRUFBRTtRQUNWLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFdBQVcsRUFBRSxDQUFDO1FBQ2QsUUFBUSxFQUFFLEVBQUU7UUFDWixXQUFXLEVBQUUsRUFBRTtRQUNmLGVBQWUsRUFBRSxFQUFFO1FBQ25CLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLFdBQVcsRUFBRSxFQUFFO1FBQ2YsU0FBUyxFQUFFLEVBQUU7UUFDYixZQUFZLEVBQUUsRUFBRTtRQUNoQixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsa0JBQWtCLEVBQUUsRUFBRTtRQUN0QixjQUFjLEVBQUUsRUFBRTtRQUNsQixZQUFZLEVBQUUsRUFBRTtRQUNoQixXQUFXLEVBQUUsRUFBRTtRQUNmLFNBQVMsRUFBRSxFQUFFO1FBQ2IsV0FBVyxFQUFFLEVBQUU7UUFDZixjQUFjLEVBQUUsRUFBRTtR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QUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCc7XHJcbmltcG9ydCAqIGFzIGRyYXdRcmNvZGUgIGZyb20gJy4uLy4uLy4uL3V0aWxzL3dlYXBwLnFyY29kZS5taW4uanMnO1xyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcbmxldCByZXN0VXJsOiBzdHJpbmc7XHJcbmxldCBldmVudENoYW5uZWw7XHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIG9wdGlvbjE6IFtcclxuICAgICAgeyB0ZXh0OiAn6Lev56iL5byA5aeL5pe26Ze0JywgdmFsdWU6IDEgfSxcclxuICAgICAgeyB0ZXh0OiAn5Yiw6L6+5pe26Ze0JywgdmFsdWU6IDIgfSxcclxuICAgICAgeyB0ZXh0OiAn56a75byA5pe26Ze0JywgdmFsdWU6IDMgfSxcclxuICAgICAgeyB0ZXh0OiAn6Lev56iL57uT5p2f5pe26Ze0JywgdmFsdWU6IDQgfSxcclxuICAgIF0sXHJcbiAgICBwcm9ibGVtVmlldzogZmFsc2UsXHJcbiAgICBzaG93TW9kYWw6IGZhbHNlLFxyXG4gICAgY2lyY2xlOiAnJyxcclxuICAgIG1vZGFsSGlkZGVuOiB0cnVlLFxyXG4gICAgc2VsZWN0VmFsdWU6IDEsXHJcbiAgICBkYXRldmlldzogJycsXHJcbiAgICBhZGRyZXNzVmlldzogJycsXHJcbiAgICBhZGRyZXNzTmFtZVZpZXc6ICcnLFxyXG4gICAgcm9hZFN0YXJ0RGF0ZTogJycsXHJcbiAgICBhcnJpdmFsRGF0ZTogJycsXHJcbiAgICBsZWF2ZURhdGU6ICcnLFxyXG4gICAgcm9hZEVuZHREYXRlOiAnJyxcclxuICAgIG1haW50YWluRGVzY3JpYmU6ICcnLFxyXG4gICAgbWFpbnRhaW5OdW1iZXJJZDogJycsXHJcbiAgICBtYWludGFpbk51bWJlck5hbWU6ICcnLFxyXG4gICAgbWFpbnRhaW5TZXJpYWw6ICcnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnJyxcclxuICAgIHByb2JsZW1JZDogJycsXHJcbiAgICBwcm9ibGVtTmFtZTogJycsXHJcbiAgICBtYWludGFpblR5cGVJZDogJycsXHJcbiAgICBwdW5jaERhdGU6ICcnLFxyXG4gICAgcHVuY2hEYXRlVmlldzogJycsXHJcbiAgICBsb2FkaW5nSGlkZGVuOiBmYWxzZVxyXG4gIH0sXHJcblxyXG4gIG9uTG9hZChvcHRpb24pIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICBrZXk6ICdwYWdlRGF0YScsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcbiAgICAgICAgdmFyIG15RGF0YSA9IHJlcy5kYXRhOy8v6K+75Y+Wa2V55YC85Li6bXlEYXRh55qE57yT5a2Y5pWw5o2uXHJcbiAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KG15RGF0YSkgPT0gJ3t9Jykge1xyXG4gICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgc2VsZWN0VmFsdWU6IDFcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIG1haW50YWluVHlwZUlkOiBteURhdGEubWFpbnRhaW5UeXBlSWQsXHJcbiAgICAgICAgICAgIG1haW50YWluTnVtYmVySWQ6IG15RGF0YS5tYWludGFpbk51bWJlcklkLFxyXG4gICAgICAgICAgICBtYWludGFpblNlcmlhbDogbXlEYXRhLm1haW5TZXJpYWwsXHJcbiAgICAgICAgICAgIGN1c3RvbWVyTmFtZTogbXlEYXRhLmN1c3RvbWVyTmFtZSxcclxuICAgICAgICAgICAgcHJvZHVjdE5hbWU6IG15RGF0YS5wcm9kdWN0TmFtZSxcclxuICAgICAgICAgICAgcHJvYmxlbUlkOiBteURhdGEucHJvYmxlbUlkLFxyXG4gICAgICAgICAgICBwcm9ibGVtTmFtZTogbXlEYXRhLnByb2JsZW1OYW1lLFxyXG4gICAgICAgICAgICByb2FkU3RhcnREYXRlOiBteURhdGEucm9hZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgYXJyaXZhbERhdGU6IG15RGF0YS5hcnJpdmFsRGF0ZSxcclxuICAgICAgICAgICAgbGVhdmVEYXRlOiBteURhdGEubGVhdmVEYXRlLFxyXG4gICAgICAgICAgICByb2FkRW5kdERhdGU6IG15RGF0YS5yb2FkRW5kdERhdGUsXHJcbiAgICAgICAgICAgIHNlbGVjdFZhbHVlOiBteURhdGEuc2VsZWN0VmFsdWUsXHJcbiAgICAgICAgICAgIG1haW50YWluRGVzY3JpYmU6IG15RGF0YS5oYW5kbGluZ0luZm9cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtSlJTL2FwaS9jcm0vcmVwbXEvbWFpbnRhaW5mb3JtLycgKyBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH0sXHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICB2YXIgbGlzdCA9IHJlcy5kYXRhLmRhdGE7XHJcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoICE9IDEpIHtcclxuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICAgICAgY29udGVudDogJ+WRmOW3pee7tOS/ruWNleWPt+WtmOWcqOW8guW4uO+8jOivt+iBlOezu+euoeeQhuWRmCcsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgbWFpbnRhaW5UeXBlSWQ6IHJlcy5kYXRhLmRhdGFbMF0ua2V5XHJcbiAgICAgICAgfSlcclxuICAgICAgICB2YXIgcmVzdFVybCA9IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtSlJTL2FwaS9jcm0vcmVwdGUvdmFsaWRhdGVEYXRlLycgKyBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkO1xyXG4gICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBhcHBpZDogYXBwLmdsb2JhbERhdGEucmVzdElkLFxyXG4gICAgICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICBsb2FkaW5nSGlkZGVuOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAocmVzLmRhdGEuY29kZSA9PSAyMDEpIHtcclxuICAgICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgcHJvYmxlbVZpZXc6IHRydWVcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoYXQuZ2V0VGltZSgpO1xyXG4gICAgICB9LFxyXG4gICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICB1dGYxNnRvOChzdHIpIHtcclxuICAgIHZhciBvdXQsIGksIGxlbiwgYztcclxuICAgIG91dCA9IFwiXCI7XHJcbiAgICBsZW4gPSBzdHIubGVuZ3RoO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgICAgaWYgKChjID49IDB4MDAwMSkgJiYgKGMgPD0gMHgwMDdGKSkge1xyXG4gICAgICAgIG91dCArPSBzdHIuY2hhckF0KGkpO1xyXG4gICAgICB9IGVsc2UgaWYgKGMgPiAweDA3RkYpIHtcclxuICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgweEUwIHwgKChjID4+IDEyKSAmIDB4MEYpKTtcclxuICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgweDgwIHwgKChjID4+IDYpICYgMHgzRikpO1xyXG4gICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGMgPj4gMCkgJiAweDNGKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhDMCB8ICgoYyA+PiA2KSAmIDB4MUYpKTtcclxuICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgweDgwIHwgKChjID4+IDApICYgMHgzRikpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG4gIH0sXHJcblxyXG5cclxuICBxdWVyeUlwOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICBpZiAodGhhdC5kYXRhLm1haW50YWluVHlwZUlkID09ICcnIHx8IHRoYXQuZGF0YS5tYWludGFpbk51bWJlcklkID09ICcnIHx8IHRoYXQuZGF0YS5jdXN0b21lck5hbWUgPT0gJycpIHtcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogXCLor7flhYjnu5HlrprooajljZVcIixcclxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdmFyIHR4dCA9IFwibWFpbnRhaW5EZXNjcmliZV9cIiArIHRoYXQuZGF0YS5tYWludGFpblR5cGVJZCArIFwiX1wiICsgdGhhdC5kYXRhLm1haW50YWluTnVtYmVySWQgKyBcIl9cIiArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQgKyBcIl9cIiArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZSArIFwiX1wiICsgdGhhdC5kYXRhLmN1c3RvbWVyTmFtZTtcclxuICAgIHZhciBzdGF0ZSA9IHRoYXQudXRmMTZ0bzgodHh0KTtcclxuICAgIHZhciBxcmNvZGVfd2lkdGggPSAzMDA7XHJcbiAgICB2YXIgcXJjb2RlX3R5cGVOdW1iZXIgPSA3O1xyXG4gICAgdmFyIHFyY29kZV9iYWNrZ3JvdW5kID0gXCIjRkZGRkZGXCI7XHJcbiAgICB2YXIgcXJjb2RlX2ZvcmVncm91bmQgPSBcIiMwMDAwMDBcIjtcclxuICAgIHZhciBxcmNvZGVfdXJsID0gXCJodHRwczovL29wZW4ud2VpeGluLnFxLmNvbS9jb25uZWN0L29hdXRoMi9hdXRob3JpemU/YXBwaWQ9d3gxOTdjMzc2MmJjNDI1OGYwJnJlZGlyZWN0X3VyaT1cIiArIGFwcC5nbG9iYWxEYXRhLndlQ2hhdENhbGxCYWNrK1wiJnJlc3BvbnNlX3R5cGU9Y29kZSZzY29wZT1zbnNhcGlfdXNlcmluZm8mc3RhdGU9XCIgKyBzdGF0ZSArIFwiJiN3ZWNoYXRfcmVkaXJlY3RcIjtcclxuICAgIHZhciBxcmNvZGVfdXJsX2xlbmd0aCA9IHFyY29kZV91cmwubGVuZ3RoO1xyXG4gICAgaWYgKHFyY29kZV91cmxfbGVuZ3RoIDwgNjQpIHtcclxuICAgICAgcXJjb2RlX3R5cGVOdW1iZXIgPSA3O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocXJjb2RlX3VybF9sZW5ndGggPj0gNjQgJiYgcXJjb2RlX3VybF9sZW5ndGggPCAxMTkpIHtcclxuICAgICAgcXJjb2RlX3R5cGVOdW1iZXIgPSAxMDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHFyY29kZV91cmxfbGVuZ3RoID49IDExOSAmJiBxcmNvZGVfdXJsX2xlbmd0aCA8IDEyOSkge1xyXG4gICAgICBxcmNvZGVfdHlwZU51bWJlciA9IDE1O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocXJjb2RlX3VybF9sZW5ndGggPj0gMTI5ICYmIHFyY29kZV91cmxfbGVuZ3RoIDwgMzgyKSB7XHJcbiAgICAgIHFyY29kZV90eXBlTnVtYmVyID0gMjA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcXJjb2RlX3R5cGVOdW1iZXIgPSAyNztcclxuICAgIH1cclxuICAgIGlmIChxcmNvZGVfdXJsKSB7XHJcbiAgICAgIGRyYXdRcmNvZGUoe1xyXG4gICAgICAgIHdpZHRoOiAyNTYsXHJcbiAgICAgICAgaGVpZ2h0OiAyNTYsXHJcbiAgICAgICAgeDogMjAsXHJcbiAgICAgICAgeTogMjAsXHJcbiAgICAgICAgY2FudmFzSWQ6ICdsb2dvUVJDb2RlJyxcclxuICAgICAgICB0eXBlTnVtYmVyOiBxcmNvZGVfdHlwZU51bWJlcixcclxuICAgICAgICB0ZXh0OiBxcmNvZGVfdXJsLFxyXG4gICAgICAgIGJhY2tncm91bmQ6IHFyY29kZV9iYWNrZ3JvdW5kLFxyXG4gICAgICAgIGZvcmVncm91bmQ6IHFyY29kZV9mb3JlZ3JvdW5kLFxyXG4gICAgICAgIGNvcnJlY3RMZXZlbDogMixcclxuICAgICAgfSk7XHJcbiAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgbW9kYWxIaWRkZW46IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgdGl0bGU6IFwi6K+36L6T5YWl5a2X56ym5Liy77yM5Y+v5Lul5piv572R5Z2A44CB5paH5pys562JXCIsXHJcbiAgICAgICAgaWNvbjogXCJub25lXCIsXHJcbiAgICAgICAgZHVyYXRpb246IDEwMDBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW9kYWxDYW5kZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGRvIHNvbWV0aGluZ1xyXG4gICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgbW9kYWxIaWRkZW46IHRydWVcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgbW9kYWxDb25maXJtOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBkbyBzb21ldGhpbmdcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIG1vZGFsSGlkZGVuOiB0cnVlXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIG9uU3dpdGNoMkNoYW5nZShkZXRhaWwpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzZWxlY3RWYWx1ZTogZGV0YWlsLmRldGFpbFxyXG4gICAgfSlcclxuICB9LFxyXG4gIGVqZWN0KCkge1xyXG4gICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgc2hvd01vZGFsOiB0cnVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmFjaygpIHtcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIHNob3dNb2RhbDogZmFsc2VcclxuICAgIH0pXHJcbiAgfSxcclxuICB3aXNoX3B1dChlKSB7XHJcbiAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICBtYWludGFpbkRlc2NyaWJlOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIG9rKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5kYXRhLm1haW50YWluRGVzY3JpYmUpXHJcbiAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICBzaG93TW9kYWw6IGZhbHNlXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGJpbmRMb2NhdGlvblNlbGVjdCgpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoYXQuZ2V0UGVybWlzc2lvbih0aGF0LCBcIlJvYWRTdGFydERhdGVcIik7XHJcbiAgfSxcclxuICBiaW5kTWF0YWluRm9ybVNlbGVjdCgpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgdmFyIHVybCA9ICcuL21haW50YWluTnVtYmVyc2VsZWN0P21haW50YWludHlwZT0nICsgdGhhdC5kYXRhLm1haW50YWluVHlwZUlkICsgJyZ0eXBlPTEnO1xyXG4gICAgaWYgKHRoYXQuZGF0YS5wcm9ibGVtVmlldyA9PSB0cnVlKSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6ICfmgqjmnInnu7Tkv67mj4/ov7DlrZjlnKjpl67popjvvIzmmK/lkKbmn6XnnIsnLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IHRydWUsXHJcbiAgICAgICAgY2FuY2VsVGV4dDogJ+WPlua2iCcsXHJcbiAgICAgICAgY29uZmlybVRleHQ6ICfmn6XnnIsnLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAvL+ehruiupFxyXG4gICAgICAgICAgICB1cmwgPSAnLi9tYWludGFpbk51bWJlcnNlbGVjdD9tYWludGFpbnR5cGU9JyArIHRoYXQuZGF0YS5tYWludGFpblR5cGVJZCArICcmdHlwZT0wJztcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5NYWludGFpbk51bWJlclNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICAgIG1haW50YWluTnVtYmVySWQ6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtYWludGFpbk51bWJlck5hbWU6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjdXN0b21lck5hbWU6IHJlcy52YWx1ZS5jdXN0b21lck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogcmVzLnZhbHVlLnByb2R1Y3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvYmxlbUlkOiByZXMudmFsdWUucHJvYmxlbUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvYmxlbU5hbWU6IHJlcy52YWx1ZS5wcm9ibGVtTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgIG1haW50YWluU2VyaWFsOiByZXMudmFsdWUubWFpbnRhaW5TZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICByb2FkU3RhcnREYXRlOiByZXMudmFsdWUucm9hZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiByZXMudmFsdWUuYXJyaXZhbERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsZWF2ZURhdGU6IHJlcy52YWx1ZS5sZWF2ZURhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICByb2FkRW5kdERhdGU6IHJlcy52YWx1ZS5yb2FkRW5kRGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5NYWludGFpbk51bWJlclNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICAgIG1haW50YWluTnVtYmVySWQ6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtYWludGFpbk51bWJlck5hbWU6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjdXN0b21lck5hbWU6IHJlcy52YWx1ZS5jdXN0b21lck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogcmVzLnZhbHVlLnByb2R1Y3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvYmxlbUlkOiByZXMudmFsdWUucHJvYmxlbUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvYmxlbU5hbWU6IHJlcy52YWx1ZS5wcm9ibGVtTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgIG1haW50YWluU2VyaWFsOiByZXMudmFsdWUubWFpbnRhaW5TZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICByb2FkU3RhcnREYXRlOiByZXMudmFsdWUucm9hZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiByZXMudmFsdWUuYXJyaXZhbERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsZWF2ZURhdGU6IHJlcy52YWx1ZS5sZWF2ZURhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICByb2FkRW5kdERhdGU6IHJlcy52YWx1ZS5yb2FkRW5kdERhdGVcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICByZXR1cm5NYWludGFpbk51bWJlclNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIG1haW50YWluTnVtYmVySWQ6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICBtYWludGFpbk51bWJlck5hbWU6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21lck5hbWU6IHJlcy52YWx1ZS5jdXN0b21lck5hbWUsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogcmVzLnZhbHVlLnByb2R1Y3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgcHJvYmxlbUlkOiByZXMudmFsdWUucHJvYmxlbUlkLFxyXG4gICAgICAgICAgICAgICAgcHJvYmxlbU5hbWU6IHJlcy52YWx1ZS5wcm9ibGVtTmFtZSxcclxuICAgICAgICAgICAgICAgIG1haW50YWluU2VyaWFsOiByZXMudmFsdWUubWFpbnRhaW5TZXJpYWwsXHJcbiAgICAgICAgICAgICAgICByb2FkU3RhcnREYXRlOiByZXMudmFsdWUucm9hZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiByZXMudmFsdWUuYXJyaXZhbERhdGUsXHJcbiAgICAgICAgICAgICAgICBsZWF2ZURhdGU6IHJlcy52YWx1ZS5sZWF2ZURhdGUsXHJcbiAgICAgICAgICAgICAgICByb2FkRW5kdERhdGU6IHJlcy52YWx1ZS5yb2FkRW5kdERhdGVcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbW1pdCgpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHZhciBpZkNvbW1pdCA9IHRydWU7XHJcbiAgICB2YXIgbXNnID0gJyc7XHJcbiAgICBpZiAodGhhdC5kYXRhLmFkZHJlc3NWaWV3ID09ICcnIHx8IHRoYXQuZGF0YS5hZGRyZXNzTmFtZVZpZXcgPT0gJycpIHtcclxuICAgICAgbXNnID0gJ+ivt+WFiOmAieaLqeS9jee9ridcclxuICAgICAgaWZDb21taXQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICh0aGF0LmRhdGEubWFpbnRhaW5OdW1iZXJJZCA9PSAnJykge1xyXG4gICAgICBtc2cgKz0gJ+ivt+WFiOe7keWumue7tOS/ruWNlSc7XHJcbiAgICAgIGlmQ29tbWl0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAodGhhdC5kYXRhLnNlbGVjdFZhbHVlID09IDMgJiYgdGhhdC5kYXRhLm1haW50YWluRGVzY3JpYmUgPT0gJycpIHtcclxuICAgICAgbXNnICs9ICfmj4/ov7DkuI3og73kuLrnqbonO1xyXG4gICAgICBpZkNvbW1pdCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdmFyIHVybDtcclxuICAgIGlmICh0aGF0LmRhdGEubWFpbnRhaW5TZXJpYWwgPT0gJycpIHtcclxuICAgICAgLy/liJvlu7rkuIDmnaHnu7Tkv67mj4/ov7BcclxuICAgICAgdXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICdIYW5iZWxsLUpSUy9hcGkvY3JtL3JlcHRlL2NyZWF0ZSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvL+abtOaWsOS4gOadoee7tOS/ruaPj+i/sFxyXG4gICAgICB1cmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJ0hhbmJlbGwtSlJTL2FwaS9jcm0vcmVwdGUvdXBkYXRlJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaWZDb21taXQpIHtcclxuICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICB2YXIgdXJsID0gJyc7XHJcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICB2YXIgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xyXG4gICAgICB2YXIgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgIHZhciBkYXkgPSBub3cuZ2V0RGF0ZSgpO1xyXG5cclxuICAgICAgaWYgKG1vbnRoIDwgMTApIHtcclxuICAgICAgICBtb250aCA9IFwiMFwiICsgbW9udGg7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRheSA8IDEwKSB7XHJcbiAgICAgICAgZGF5ID0gXCIwXCIgKyBkYXk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIG1haW50YWluVHlwZUlkOiBfdGhpcy5kYXRhLm1haW50YWluVHlwZUlkLFxyXG4gICAgICAgIG1haW50YWluTnVtYmVySWQ6IF90aGlzLmRhdGEubWFpbnRhaW5OdW1iZXJJZCxcclxuICAgICAgICBtYWluU2VyaWFsOiBfdGhpcy5kYXRhLm1haW50YWluU2VyaWFsLFxyXG4gICAgICAgIG1haW50YWluZXJJZDogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgICBtYWludGFpbmVyOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZU5hbWUsXHJcbiAgICAgICAgZGVwdG5vOiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkLFxyXG4gICAgICAgIGRlcHQ6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZSxcclxuICAgICAgICBwcm9ibGVtSWQ6IF90aGlzLmRhdGEucHJvYmxlbUlkLFxyXG4gICAgICAgIHByb2JsZW1OYW1lOiBfdGhpcy5kYXRhLnByb2JsZW1OYW1lLFxyXG4gICAgICAgIGhhbmRsaW5nSW5mbzogX3RoaXMuZGF0YS5tYWludGFpbkRlc2NyaWJlLFxyXG4gICAgICAgIGN1c3RvbWVyTmFtZTogX3RoaXMuZGF0YS5jdXN0b21lck5hbWUsXHJcbiAgICAgICAgcHJvZHVjdE5hbWU6IF90aGlzLmRhdGEucHJvZHVjdE5hbWUsXHJcbiAgICAgICAgcHVuY2hEYXRlOiB5ZWFyICsgXCIvXCIgKyBtb250aCArIFwiL1wiICsgZGF5ICsgXCIgXCIgKyB0aGlzLmRhdGEuZGF0ZXZpZXcsXHJcbiAgICAgICAgYWRkcmVzc1ZpZXc6IF90aGlzLmRhdGEuYWRkcmVzc1ZpZXcsXHJcbiAgICAgICAgYWRkcmVzc05hbWVWaWV3OiBfdGhpcy5kYXRhLmFkZHJlc3NOYW1lVmlldyxcclxuICAgICAgICByb2FkU3RhcnREYXRlOiBfdGhpcy5kYXRhLnJvYWRTdGFydERhdGUsXHJcbiAgICAgICAgYXJyaXZhbERhdGU6IF90aGlzLmRhdGEuYXJyaXZhbERhdGUsXHJcbiAgICAgICAgbGVhdmVEYXRlOiBfdGhpcy5kYXRhLmxlYXZlRGF0ZSxcclxuICAgICAgICByb2FkRW5kRGF0ZTogX3RoaXMuZGF0YS5yb2FkRW5kdERhdGUsXHJcbiAgICAgICAgc2VsZWN0VmFsdWU6IF90aGlzLmRhdGEuc2VsZWN0VmFsdWUsXHJcbiAgICAgICAgc2Vzc2lvbmtleTogYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleSxcclxuICAgICAgICBvcGVuSWQ6IGFwcC5nbG9iYWxEYXRhLm9wZW5JZCxcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF90aGlzLmRhdGEubWFpbnRhaW5TZXJpYWwgPT0gJycpIHtcclxuICAgICAgICB1cmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvY3JtL3JlcHRlL2NyZWF0ZT90eXBlPScgKyBfdGhpcy5kYXRhLnNlbGVjdFZhbHVlICsgXCImXCIgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1cmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvY3JtL3JlcHRlL3VwZGF0ZT90eXBlPScgKyBfdGhpcy5kYXRhLnNlbGVjdFZhbHVlICsgXCImXCIgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aDtcclxuICAgICAgfVxyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcclxuICAgICAgICBzaG93Q2FuY2VsOiB0cnVlLFxyXG4gICAgICAgIGNhbmNlbFRleHQ6ICflj5bmtognLFxyXG4gICAgICAgIGNvbmZpcm1UZXh0OiAn56Gu5a6aJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgbG9hZGluZ0hpZGRlbjogZmFsc2VcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IHVybFxyXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgICAgbG9hZGluZ0hpZGRlbjogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLmRhdGEuY29kZSA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHRoYXQuZGF0YS5zZWxlY3RWYWx1ZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5yb2FkU3RhcnREYXRlID0gdGhhdC5kYXRhLnB1bmNoRGF0ZVZpZXc7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zZWxlY3RWYWx1ZSA9IDI7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhhdC5kYXRhLnNlbGVjdFZhbHVlID09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmFycml2YWxEYXRlID0gdGhhdC5kYXRhLnB1bmNoRGF0ZVZpZXc7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zZWxlY3RWYWx1ZSA9IDM7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhhdC5kYXRhLnNlbGVjdFZhbHVlID09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmxlYXZlRGF0ZSA9IHRoYXQuZGF0YS5wdW5jaERhdGVWaWV3O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2VsZWN0VmFsdWUgPSA0O1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoYXQuZGF0YS5zZWxlY3RWYWx1ZSA9PSA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zZWxlY3RWYWx1ZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLm1zZyAhPSAnc3VjY2VzcycgJiYgcmVzLmRhdGEubXNnICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEubWFpblNlcmlhbCA9IHJlcy5kYXRhLm1zZztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAvL+aUvuWFpee8k+WtmFxyXG4gICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYWdlRGF0YScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZWxlY3RWYWx1ZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICBrZXk6ICdwYWdlRGF0YScsXHJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAoe30pXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi5o+Q5Lqk5oiQ5YqfXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvcGFnZXMvaW5kZXgvaW5kZXhcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIuaPkOS6pOWksei0pVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3BhZ2VzL2luZGV4L2luZGV4XCJcclxuICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgbG9hZGluZ0hpZGRlbjogdHJ1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6IG1zZyxcclxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0VGltZSgpIHtcclxuXHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgdmFyIG5vd1RpbWUgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgIHZhciBob3VycyA9IG5vd1RpbWUuZ2V0SG91cnMoKTtcclxuICAgIHZhciBtaW51dGVzID0gbm93VGltZS5nZXRNaW51dGVzKCk7XHJcbiAgICB2YXIgc2Vjb25kcyA9IG5vd1RpbWUuZ2V0U2Vjb25kcygpO1xyXG5cclxuICAgIGlmIChob3VycyA8IDEwKSB7XHJcbiAgICAgIGhvdXJzID0gJzAnICsgaG91cnM7XHJcbiAgICB9XHJcbiAgICBpZiAobWludXRlcyA8IDEwKSB7XHJcbiAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xyXG4gICAgfVxyXG4gICAgaWYgKHNlY29uZHMgPCAxMCkge1xyXG4gICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcclxuICAgIH1cclxuICAgIHZhciBkYXRldmlldyA9IGhvdXJzICsgXCI6XCIgKyBtaW51dGVzICsgXCI6XCIgKyBzZWNvbmRzXHJcbiAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICBkYXRldmlldzogZGF0ZXZpZXcsXHJcbiAgICAgIHB1bmNoRGF0ZVZpZXc6IGhvdXJzICsgXCI6XCIgKyBtaW51dGVzXHJcbiAgICB9KVxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB0aGF0LmdldFRpbWUoKTtcclxuXHJcbiAgICB9LCAxMDAwKTtcclxuXHJcbiAgfSxcclxuICAvL+iOt+WPlueUqOaIt+WcsOeQhuS9jee9ruadg+mZkFxyXG4gIGdldFBlcm1pc3Npb246IGZ1bmN0aW9uIChfdGhpcywgZGF0YSkge1xyXG4gICAgd3guZ2V0TG9jYXRpb24oe1xyXG4gICAgICB0eXBlOiAnZ2NqMDInLFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGNvbnN0IHgxID0gcmVzLmxvbmdpdHVkZVxyXG4gICAgICAgIGNvbnN0IHkxID0gcmVzLmxhdGl0dWRlXHJcbiAgICAgICAgY29uc3Qgc3BlZWQgPSByZXMuc3BlZWRcclxuICAgICAgICBjb25zdCBhY2N1cmFjeSA9IHJlcy5hY2N1cmFjeVxyXG4gICAgICAgIHd4LmNob29zZUxvY2F0aW9uKHtcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMxKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgIGFkZHJlc3NWaWV3OiByZXMxLmFkZHJlc3MsXHJcbiAgICAgICAgICAgICAgYWRkcmVzc05hbWVWaWV3OiByZXMxLm5hbWUsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGNvbnN0IHgyID0gcmVzMS5sb25naXR1ZGVcclxuICAgICAgICAgICAgY29uc3QgeTIgPSByZXMxLmxhdGl0dWRlXHJcbiAgICAgICAgICAgIHZhciBhID0gTWF0aC5zaW4oeTEpO1xyXG4gICAgICAgICAgICB2YXIgYiA9IE1hdGguc2luKHkyKTtcclxuICAgICAgICAgICAgdmFyIGMgPSBNYXRoLmNvcyh5MSk7XHJcbiAgICAgICAgICAgIHZhciBkID0gTWF0aC5jb3MoeTIpO1xyXG4gICAgICAgICAgICB2YXIgZSA9IE1hdGguY29zKHgxIC0geDIpO1xyXG4gICAgICAgICAgICB2YXIgdiA9IGEgKiBiICsgYyAqIGQgKiBlO1xyXG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSA2MzcxLjAgKiBNYXRoLmFjb3ModikgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICAgICAgICB2YXIgcm91bmRkaXN0YW5jZSA9IE1hdGgucm91bmQoZGlzdGFuY2UgKiAxMDAwKTtcclxuICAgICAgICAgICAgaWYgKHJvdW5kZGlzdGFuY2UgPiA3MCkge1xyXG4gICAgICAgICAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgYWRkcmVzc1ZpZXc6ICcnLFxyXG4gICAgICAgICAgICAgICAgYWRkcmVzc05hbWVWaWV3OiAnJyxcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAn6YCJ5oup5L2N572u5LiO5b2T5YmN5L2N572u5Li6JyArIHJvdW5kZGlzdGFuY2UgKyAnLOS4jeW+l+i2hei/hzcw57GzJyxcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3eC5nZXRTZXR0aW5nKHtcclxuICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdHUgPSByZXMuYXV0aFNldHRpbmc7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXN0YXR1WydzY29wZS51c2VyTG9jYXRpb24nXSkge1xyXG4gICAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5piv5ZCm5o6I5p2D5b2T5YmN5L2N572uJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAn6ZyA6KaB6I635Y+W5oKo55qE5Zyw55CG5L2N572u77yM6K+356Gu6K6k5o6I5p2D77yM5ZCm5YiZ5Zyw5Zu+5Yqf6IO95bCG5peg5rOV5L2/55SoJyxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAodGlwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodGlwLmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3gub3BlblNldHRpbmcoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5hdXRoU2V0dGluZ1tcInNjb3BlLnVzZXJMb2NhdGlvblwiXSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o6I5p2D5oiQ5YqfJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/mjojmnYPmiJDlip/kuYvlkI7vvIzlho3osIPnlKhjaG9vc2VMb2NhdGlvbumAieaLqeWcsOaWuVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5jaG9vc2VMb2NhdGlvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NWaWV3OiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzc05hbWVWaWV3OiAnJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfmjojmnYPlpLHotKUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ+iwg+eUqOaOiOadg+eql+WPo+Wksei0pScsXHJcbiAgICAgICAgICAgICAgICAgIGljb246ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDBcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcbiAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgdGl0bGU6ICflvq7kv6HmnI3liqHmnKrlhYHorrgnLFxyXG4gICAgICAgICAgaWNvbjogJ3dhcm4nLFxyXG4gICAgICAgICAgZHVyYXRpb246IDEwMDBcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbn0pXHJcbiJdfQ==