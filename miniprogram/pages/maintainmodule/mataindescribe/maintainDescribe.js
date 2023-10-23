"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        if (option.addressView != undefined && option.addressView != '') {
            that.setData({
                addressView: option.addressView
            });
        }
        if (option.addressNameView != undefined && option.addressNameView != '') {
            that.setData({
                addressNameView: option.addressNameView
            });
        }
        if (option.maintainDescribe != undefined && option.maintainDescribe != '') {
            that.setData({
                maintainDescribe: option.maintainDescribe
            });
            var pagedate = wx.getStorageSync('pageData');
            pagedate.handlingInfo = option.maintainDescribe;
            wx.setStorageSync('pageData', __assign({}, pagedate));
        }
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
    photoUpload: function (res) {
        var that = this;
        if (that.data.maintainTypeId == '' || that.data.maintainNumberId == '' || that.data.customerName == '') {
            wx.showModal({
                title: '系统提示',
                content: "请先绑定表单",
                showCancel: false
            });
            return;
        }
        wx.navigateTo({
            url: './photoUpload?maintainType=' + that.data.maintainTypeId + "&maintainNumber=" + that.data.maintainNumberId + "&addressView=" + that.data.addressView + "&addressNameView=" + that.data.addressNameView + "&maintainDescribe=" + that.data.maintainDescribe
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnRhaW5EZXNjcmliZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW50YWluRGVzY3JpYmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLCtEQUFpRTtBQUNqRSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUM1QixJQUFJLE9BQWUsQ0FBQztBQUNwQixJQUFJLFlBQVksQ0FBQztBQUNqQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUU7WUFDUCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtZQUM1QixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtZQUMxQixFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtZQUMxQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRTtTQUM3QjtRQUNELFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLE1BQU0sRUFBRSxFQUFFO1FBQ1YsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLENBQUM7UUFDZCxRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxFQUFFO1FBQ2YsZUFBZSxFQUFFLEVBQUU7UUFDbkIsYUFBYSxFQUFFLEVBQUU7UUFDakIsV0FBVyxFQUFFLEVBQUU7UUFDZixTQUFTLEVBQUUsRUFBRTtRQUNiLFlBQVksRUFBRSxFQUFFO1FBQ2hCLGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixrQkFBa0IsRUFBRSxFQUFFO1FBQ3RCLGNBQWMsRUFBRSxFQUFFO1FBQ2xCLFlBQVksRUFBRSxFQUFFO1FBQ2hCLFdBQVcsRUFBRSxFQUFFO1FBQ2YsU0FBUyxFQUFFLEVBQUU7UUFDYixXQUFXLEVBQUUsRUFBRTtRQUNmLGNBQWMs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RUFBRSxVQUFVO29DQUNqQixJQUFJLEVBQUUsU0FBUztvQ0FDZixRQUFRLEVBQUUsSUFBSTtpQ0FDZixDQUFDLENBQUE7NEJBQ0osQ0FBQzt5QkFDRixDQUFDLENBQUE7b0JBQ0osQ0FBQztpQkFDRixDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsSUFBSSxFQUFFLFVBQVUsR0FBRztnQkFDakIsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDWCxLQUFLLEVBQUUsU0FBUztvQkFDaEIsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLElBQUk7aUJBQ2YsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnO1xyXG5pbXBvcnQgKiBhcyBkcmF3UXJjb2RlIGZyb20gJy4uLy4uLy4uL3V0aWxzL3dlYXBwLnFyY29kZS5taW4uanMnO1xyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcbmxldCByZXN0VXJsOiBzdHJpbmc7XHJcbmxldCBldmVudENoYW5uZWw7XHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIG9wdGlvbjE6IFtcclxuICAgICAgeyB0ZXh0OiAn6Lev56iL5byA5aeL5pe26Ze0JywgdmFsdWU6IDEgfSxcclxuICAgICAgeyB0ZXh0OiAn5Yiw6L6+5pe26Ze0JywgdmFsdWU6IDIgfSxcclxuICAgICAgeyB0ZXh0OiAn56a75byA5pe26Ze0JywgdmFsdWU6IDMgfSxcclxuICAgICAgeyB0ZXh0OiAn6Lev56iL57uT5p2f5pe26Ze0JywgdmFsdWU6IDQgfSxcclxuICAgIF0sXHJcbiAgICBwcm9ibGVtVmlldzogZmFsc2UsXHJcbiAgICBzaG93TW9kYWw6IGZhbHNlLFxyXG4gICAgY2lyY2xlOiAnJyxcclxuICAgIG1vZGFsSGlkZGVuOiB0cnVlLFxyXG4gICAgc2VsZWN0VmFsdWU6IDEsXHJcbiAgICBkYXRldmlldzogJycsXHJcbiAgICBhZGRyZXNzVmlldzogJycsXHJcbiAgICBhZGRyZXNzTmFtZVZpZXc6ICcnLFxyXG4gICAgcm9hZFN0YXJ0RGF0ZTogJycsXHJcbiAgICBhcnJpdmFsRGF0ZTogJycsXHJcbiAgICBsZWF2ZURhdGU6ICcnLFxyXG4gICAgcm9hZEVuZHREYXRlOiAnJyxcclxuICAgIG1haW50YWluRGVzY3JpYmU6ICcnLFxyXG4gICAgbWFpbnRhaW5OdW1iZXJJZDogJycsXHJcbiAgICBtYWludGFpbk51bWJlck5hbWU6ICcnLFxyXG4gICAgbWFpbnRhaW5TZXJpYWw6ICcnLFxyXG4gICAgY3VzdG9tZXJOYW1lOiAnJyxcclxuICAgIHByb2R1Y3ROYW1lOiAnJyxcclxuICAgIHByb2JsZW1JZDogJycsXHJcbiAgICBwcm9ibGVtTmFtZTogJycsXHJcbiAgICBtYWludGFpblR5cGVJZDogJycsXHJcbiAgICBwdW5jaERhdGU6ICcnLFxyXG4gICAgcHVuY2hEYXRlVmlldzogJycsXHJcbiAgICBsb2FkaW5nSGlkZGVuOiBmYWxzZVxyXG4gIH0sXHJcblxyXG4gIG9uTG9hZChvcHRpb24pIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIFxyXG4gICAgaWYgKG9wdGlvbi5hZGRyZXNzVmlldyAhPSB1bmRlZmluZWQgJiYgb3B0aW9uLmFkZHJlc3NWaWV3ICE9ICcnKSB7XHJcbiAgICAgIHRoYXQuc2V0RGF0YSEoe1xyXG4gICAgICAgIGFkZHJlc3NWaWV3OiBvcHRpb24uYWRkcmVzc1ZpZXdcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmIChvcHRpb24uYWRkcmVzc05hbWVWaWV3ICE9IHVuZGVmaW5lZCAmJiBvcHRpb24uYWRkcmVzc05hbWVWaWV3ICE9ICcnKSB7XHJcbiAgICAgIHRoYXQuc2V0RGF0YSEoe1xyXG4gICAgICAgIGFkZHJlc3NOYW1lVmlldzogb3B0aW9uLmFkZHJlc3NOYW1lVmlld1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbi5tYWludGFpbkRlc2NyaWJlICE9IHVuZGVmaW5lZCAmJiBvcHRpb24ubWFpbnRhaW5EZXNjcmliZSAhPSAnJykge1xyXG4gICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICBtYWludGFpbkRlc2NyaWJlOiBvcHRpb24ubWFpbnRhaW5EZXNjcmliZVxyXG4gICAgICB9KVxyXG4gICAgICAvL+S/ruaUuee8k+WtmOS4reeahOaVsOaNru+8jOS/ruaUueS8mumAoOaIkOS/ruaUueS5i+WJjeeahOaVsOaNrlxyXG4gICAgICB2YXIgcGFnZWRhdGU9d3guZ2V0U3RvcmFnZVN5bmMoJ3BhZ2VEYXRhJyk7XHJcbiAgICAgIHBhZ2VkYXRlLmhhbmRsaW5nSW5mbyA9IG9wdGlvbi5tYWludGFpbkRlc2NyaWJlO1xyXG4gICAgICB3eC5zZXRTdG9yYWdlU3luYygncGFnZURhdGEnLCB7IC4uLnBhZ2VkYXRlfSk7XHJcbiAgICB9XHJcbiAgICB3eC5nZXRTdG9yYWdlKHtcclxuICAgICAga2V5OiAncGFnZURhdGEnLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgdmFyIG15RGF0YSA9IHJlcy5kYXRhOy8v6K+75Y+Wa2V55YC85Li6bXlEYXRh55qE57yT5a2Y5pWw5o2uXHJcbiAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KG15RGF0YSkgPT0gJ3t9Jykge1xyXG4gICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgc2VsZWN0VmFsdWU6IDFcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIG1haW50YWluVHlwZUlkOiBteURhdGEubWFpbnRhaW5UeXBlSWQsXHJcbiAgICAgICAgICAgIG1haW50YWluTnVtYmVySWQ6IG15RGF0YS5tYWludGFpbk51bWJlcklkLFxyXG4gICAgICAgICAgICBtYWludGFpblNlcmlhbDogbXlEYXRhLm1haW5TZXJpYWwsXHJcbiAgICAgICAgICAgIGN1c3RvbWVyTmFtZTogbXlEYXRhLmN1c3RvbWVyTmFtZSxcclxuICAgICAgICAgICAgcHJvZHVjdE5hbWU6IG15RGF0YS5wcm9kdWN0TmFtZSxcclxuICAgICAgICAgICAgcHJvYmxlbUlkOiBteURhdGEucHJvYmxlbUlkLFxyXG4gICAgICAgICAgICBwcm9ibGVtTmFtZTogbXlEYXRhLnByb2JsZW1OYW1lLFxyXG4gICAgICAgICAgICByb2FkU3RhcnREYXRlOiBteURhdGEucm9hZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgYXJyaXZhbERhdGU6IG15RGF0YS5hcnJpdmFsRGF0ZSxcclxuICAgICAgICAgICAgbGVhdmVEYXRlOiBteURhdGEubGVhdmVEYXRlLFxyXG4gICAgICAgICAgICByb2FkRW5kdERhdGU6IG15RGF0YS5yb2FkRW5kdERhdGUsXHJcbiAgICAgICAgICAgIHNlbGVjdFZhbHVlOiBteURhdGEuc2VsZWN0VmFsdWUsXHJcbiAgICAgICAgICAgIG1haW50YWluRGVzY3JpYmU6IG15RGF0YS5oYW5kbGluZ0luZm9cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2NybS9yZXBtcS9tYWludGFpbmZvcm0vJyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBhcHBpZDogYXBwLmdsb2JhbERhdGEucmVzdElkLFxyXG4gICAgICAgIHRva2VuOiBhcHAuZ2xvYmFsRGF0YS5yZXN0VG9rZW5cclxuICAgICAgfSxcclxuICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIHZhciBsaXN0ID0gcmVzLmRhdGEuZGF0YTtcclxuICAgICAgICBpZiAobGlzdC5sZW5ndGggIT0gMSkge1xyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgICAgICBjb250ZW50OiAn5ZGY5bel57u05L+u5Y2V5Y+35a2Y5Zyo5byC5bi477yM6K+36IGU57O7566h55CG5ZGYJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICBtYWludGFpblR5cGVJZDogcmVzLmRhdGEuZGF0YVswXS5rZXlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHZhciByZXN0VXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2NybS9yZXB0ZS92YWxpZGF0ZURhdGUvJyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQ7XHJcbiAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICB1cmw6IHJlc3RVcmwsXHJcbiAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGFwcGlkOiBhcHAuZ2xvYmFsRGF0YS5yZXN0SWQsXHJcbiAgICAgICAgICAgIHRva2VuOiBhcHAuZ2xvYmFsRGF0YS5yZXN0VG9rZW5cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgIGxvYWRpbmdIaWRkZW46IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChyZXMuZGF0YS5jb2RlID09IDIwMSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICBwcm9ibGVtVmlldzogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC5nZXRUaW1lKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIHV0ZjE2dG84KHN0cikge1xyXG4gICAgdmFyIG91dCwgaSwgbGVuLCBjO1xyXG4gICAgb3V0ID0gXCJcIjtcclxuICAgIGxlbiA9IHN0ci5sZW5ndGg7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICBpZiAoKGMgPj0gMHgwMDAxKSAmJiAoYyA8PSAweDAwN0YpKSB7XHJcbiAgICAgICAgb3V0ICs9IHN0ci5jaGFyQXQoaSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoYyA+IDB4MDdGRikge1xyXG4gICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RTAgfCAoKGMgPj4gMTIpICYgMHgwRikpO1xyXG4gICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGMgPj4gNikgJiAweDNGKSk7XHJcbiAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHg4MCB8ICgoYyA+PiAwKSAmIDB4M0YpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgweEMwIHwgKChjID4+IDYpICYgMHgxRikpO1xyXG4gICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ODAgfCAoKGMgPj4gMCkgJiAweDNGKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbiAgfSxcclxuXHJcbiAgcGhvdG9VcGxvYWQ6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIGlmICh0aGF0LmRhdGEubWFpbnRhaW5UeXBlSWQgPT0gJycgfHwgdGhhdC5kYXRhLm1haW50YWluTnVtYmVySWQgPT0gJycgfHwgdGhhdC5kYXRhLmN1c3RvbWVyTmFtZSA9PSAnJykge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBcIuivt+WFiOe7keWumuihqOWNlVwiLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi9waG90b1VwbG9hZD9tYWludGFpblR5cGU9JyArIHRoYXQuZGF0YS5tYWludGFpblR5cGVJZCArIFwiJm1haW50YWluTnVtYmVyPVwiICsgdGhhdC5kYXRhLm1haW50YWluTnVtYmVySWQgKyBcIiZhZGRyZXNzVmlldz1cIiArIHRoYXQuZGF0YS5hZGRyZXNzVmlldyArIFwiJmFkZHJlc3NOYW1lVmlldz1cIiArIHRoYXQuZGF0YS5hZGRyZXNzTmFtZVZpZXcgKyBcIiZtYWludGFpbkRlc2NyaWJlPVwiICsgdGhhdC5kYXRhLm1haW50YWluRGVzY3JpYmVcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgcXVlcnlJcDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgaWYgKHRoYXQuZGF0YS5tYWludGFpblR5cGVJZCA9PSAnJyB8fCB0aGF0LmRhdGEubWFpbnRhaW5OdW1iZXJJZCA9PSAnJyB8fCB0aGF0LmRhdGEuY3VzdG9tZXJOYW1lID09ICcnKSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6IFwi6K+35YWI57uR5a6a6KGo5Y2VXCIsXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciB0eHQgPSBcIm1haW50YWluRGVzY3JpYmVfXCIgKyB0aGF0LmRhdGEubWFpbnRhaW5UeXBlSWQgKyBcIl9cIiArIHRoYXQuZGF0YS5tYWludGFpbk51bWJlcklkICsgXCJfXCIgKyBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkICsgXCJfXCIgKyBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZU5hbWUgKyBcIl9cIiArIHRoYXQuZGF0YS5jdXN0b21lck5hbWU7XHJcbiAgICB2YXIgc3RhdGUgPSB0aGF0LnV0ZjE2dG84KHR4dCk7XHJcbiAgICB2YXIgcXJjb2RlX3dpZHRoID0gMzAwO1xyXG4gICAgdmFyIHFyY29kZV90eXBlTnVtYmVyID0gNztcclxuICAgIHZhciBxcmNvZGVfYmFja2dyb3VuZCA9IFwiI0ZGRkZGRlwiO1xyXG4gICAgdmFyIHFyY29kZV9mb3JlZ3JvdW5kID0gXCIjMDAwMDAwXCI7XHJcbiAgICB2YXIgcXJjb2RlX3VybCA9IFwiaHR0cHM6Ly9vcGVuLndlaXhpbi5xcS5jb20vY29ubmVjdC9vYXV0aDIvYXV0aG9yaXplP2FwcGlkPXd4MTk3YzM3NjJiYzQyNThmMCZyZWRpcmVjdF91cmk9XCIgKyBhcHAuZ2xvYmFsRGF0YS53ZUNoYXRDYWxsQmFjayArIFwiJnJlc3BvbnNlX3R5cGU9Y29kZSZzY29wZT1zbnNhcGlfdXNlcmluZm8mc3RhdGU9XCIgKyBzdGF0ZSArIFwiJiN3ZWNoYXRfcmVkaXJlY3RcIjtcclxuICAgIHZhciBxcmNvZGVfdXJsX2xlbmd0aCA9IHFyY29kZV91cmwubGVuZ3RoO1xyXG4gICAgaWYgKHFyY29kZV91cmxfbGVuZ3RoIDwgNjQpIHtcclxuICAgICAgcXJjb2RlX3R5cGVOdW1iZXIgPSA3O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocXJjb2RlX3VybF9sZW5ndGggPj0gNjQgJiYgcXJjb2RlX3VybF9sZW5ndGggPCAxMTkpIHtcclxuICAgICAgcXJjb2RlX3R5cGVOdW1iZXIgPSAxMDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHFyY29kZV91cmxfbGVuZ3RoID49IDExOSAmJiBxcmNvZGVfdXJsX2xlbmd0aCA8IDEyOSkge1xyXG4gICAgICBxcmNvZGVfdHlwZU51bWJlciA9IDE1O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocXJjb2RlX3VybF9sZW5ndGggPj0gMTI5ICYmIHFyY29kZV91cmxfbGVuZ3RoIDwgMzgyKSB7XHJcbiAgICAgIHFyY29kZV90eXBlTnVtYmVyID0gMjA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcXJjb2RlX3R5cGVOdW1iZXIgPSAyNztcclxuICAgIH1cclxuICAgIGlmIChxcmNvZGVfdXJsKSB7XHJcbiAgICAgIGRyYXdRcmNvZGUoe1xyXG4gICAgICAgIHdpZHRoOiAyNTYsXHJcbiAgICAgICAgaGVpZ2h0OiAyNTYsXHJcbiAgICAgICAgeDogMjAsXHJcbiAgICAgICAgeTogMjAsXHJcbiAgICAgICAgY2FudmFzSWQ6ICdsb2dvUVJDb2RlJyxcclxuICAgICAgICB0eXBlTnVtYmVyOiBxcmNvZGVfdHlwZU51bWJlcixcclxuICAgICAgICB0ZXh0OiBxcmNvZGVfdXJsLFxyXG4gICAgICAgIGJhY2tncm91bmQ6IHFyY29kZV9iYWNrZ3JvdW5kLFxyXG4gICAgICAgIGZvcmVncm91bmQ6IHFyY29kZV9mb3JlZ3JvdW5kLFxyXG4gICAgICAgIGNvcnJlY3RMZXZlbDogMixcclxuICAgICAgfSk7XHJcbiAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgbW9kYWxIaWRkZW46IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgdGl0bGU6IFwi6K+36L6T5YWl5a2X56ym5Liy77yM5Y+v5Lul5piv572R5Z2A44CB5paH5pys562JXCIsXHJcbiAgICAgICAgaWNvbjogXCJub25lXCIsXHJcbiAgICAgICAgZHVyYXRpb246IDEwMDBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW9kYWxDYW5kZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGRvIHNvbWV0aGluZ1xyXG4gICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgbW9kYWxIaWRkZW46IHRydWVcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgbW9kYWxDb25maXJtOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBkbyBzb21ldGhpbmdcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIG1vZGFsSGlkZGVuOiB0cnVlXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIG9uU3dpdGNoMkNoYW5nZShkZXRhaWwpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzZWxlY3RWYWx1ZTogZGV0YWlsLmRldGFpbFxyXG4gICAgfSlcclxuICB9LFxyXG4gIGVqZWN0KCkge1xyXG4gICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgc2hvd01vZGFsOiB0cnVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmFjaygpIHtcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIHNob3dNb2RhbDogZmFsc2VcclxuICAgIH0pXHJcbiAgfSxcclxuICB3aXNoX3B1dChlKSB7XHJcbiAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICBtYWludGFpbkRlc2NyaWJlOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIG9rKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5kYXRhLm1haW50YWluRGVzY3JpYmUpXHJcbiAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICBzaG93TW9kYWw6IGZhbHNlXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGJpbmRMb2NhdGlvblNlbGVjdCgpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoYXQuZ2V0UGVybWlzc2lvbih0aGF0LCBcIlJvYWRTdGFydERhdGVcIik7XHJcbiAgfSxcclxuICBiaW5kTWF0YWluRm9ybVNlbGVjdCgpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpc1xyXG4gICAgdmFyIHVybCA9ICcuL21haW50YWluTnVtYmVyc2VsZWN0P21haW50YWludHlwZT0nICsgdGhhdC5kYXRhLm1haW50YWluVHlwZUlkICsgJyZ0eXBlPTEnO1xyXG4gICAgaWYgKHRoYXQuZGF0YS5wcm9ibGVtVmlldyA9PSB0cnVlKSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6ICfmgqjmnInnu7Tkv67mj4/ov7DlrZjlnKjpl67popjvvIzmmK/lkKbmn6XnnIsnLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IHRydWUsXHJcbiAgICAgICAgY2FuY2VsVGV4dDogJ+WPlua2iCcsXHJcbiAgICAgICAgY29uZmlybVRleHQ6ICfmn6XnnIsnLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAvL+ehruiupFxyXG4gICAgICAgICAgICB1cmwgPSAnLi9tYWludGFpbk51bWJlcnNlbGVjdD9tYWludGFpbnR5cGU9JyArIHRoYXQuZGF0YS5tYWludGFpblR5cGVJZCArICcmdHlwZT0wJztcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5NYWludGFpbk51bWJlclNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICAgIG1haW50YWluTnVtYmVySWQ6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtYWludGFpbk51bWJlck5hbWU6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjdXN0b21lck5hbWU6IHJlcy52YWx1ZS5jdXN0b21lck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogcmVzLnZhbHVlLnByb2R1Y3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvYmxlbUlkOiByZXMudmFsdWUucHJvYmxlbUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvYmxlbU5hbWU6IHJlcy52YWx1ZS5wcm9ibGVtTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgIG1haW50YWluU2VyaWFsOiByZXMudmFsdWUubWFpbnRhaW5TZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICByb2FkU3RhcnREYXRlOiByZXMudmFsdWUucm9hZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiByZXMudmFsdWUuYXJyaXZhbERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsZWF2ZURhdGU6IHJlcy52YWx1ZS5sZWF2ZURhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICByb2FkRW5kdERhdGU6IHJlcy52YWx1ZS5yb2FkRW5kRGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5NYWludGFpbk51bWJlclNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICAgIG1haW50YWluTnVtYmVySWQ6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtYWludGFpbk51bWJlck5hbWU6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjdXN0b21lck5hbWU6IHJlcy52YWx1ZS5jdXN0b21lck5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogcmVzLnZhbHVlLnByb2R1Y3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvYmxlbUlkOiByZXMudmFsdWUucHJvYmxlbUlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvYmxlbU5hbWU6IHJlcy52YWx1ZS5wcm9ibGVtTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgIG1haW50YWluU2VyaWFsOiByZXMudmFsdWUubWFpbnRhaW5TZXJpYWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICByb2FkU3RhcnREYXRlOiByZXMudmFsdWUucm9hZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiByZXMudmFsdWUuYXJyaXZhbERhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsZWF2ZURhdGU6IHJlcy52YWx1ZS5sZWF2ZURhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICByb2FkRW5kdERhdGU6IHJlcy52YWx1ZS5yb2FkRW5kdERhdGVcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICByZXR1cm5NYWludGFpbk51bWJlclNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIG1haW50YWluTnVtYmVySWQ6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICBtYWludGFpbk51bWJlck5hbWU6IHJlcy52YWx1ZS5tYWludGFpbk51bWJlck5hbWUsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21lck5hbWU6IHJlcy52YWx1ZS5jdXN0b21lck5hbWUsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogcmVzLnZhbHVlLnByb2R1Y3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgcHJvYmxlbUlkOiByZXMudmFsdWUucHJvYmxlbUlkLFxyXG4gICAgICAgICAgICAgICAgcHJvYmxlbU5hbWU6IHJlcy52YWx1ZS5wcm9ibGVtTmFtZSxcclxuICAgICAgICAgICAgICAgIG1haW50YWluU2VyaWFsOiByZXMudmFsdWUubWFpbnRhaW5TZXJpYWwsXHJcbiAgICAgICAgICAgICAgICByb2FkU3RhcnREYXRlOiByZXMudmFsdWUucm9hZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGFycml2YWxEYXRlOiByZXMudmFsdWUuYXJyaXZhbERhdGUsXHJcbiAgICAgICAgICAgICAgICBsZWF2ZURhdGU6IHJlcy52YWx1ZS5sZWF2ZURhdGUsXHJcbiAgICAgICAgICAgICAgICByb2FkRW5kdERhdGU6IHJlcy52YWx1ZS5yb2FkRW5kdERhdGVcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbW1pdCgpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHZhciBpZkNvbW1pdCA9IHRydWU7XHJcbiAgICB2YXIgbXNnID0gJyc7XHJcbiAgICBpZiAodGhhdC5kYXRhLmFkZHJlc3NWaWV3ID09ICcnIHx8IHRoYXQuZGF0YS5hZGRyZXNzTmFtZVZpZXcgPT0gJycpIHtcclxuICAgICAgbXNnID0gJ+ivt+WFiOmAieaLqeS9jee9ridcclxuICAgICAgaWZDb21taXQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICh0aGF0LmRhdGEubWFpbnRhaW5OdW1iZXJJZCA9PSAnJykge1xyXG4gICAgICBtc2cgKz0gJ+ivt+WFiOe7keWumue7tOS/ruWNlSc7XHJcbiAgICAgIGlmQ29tbWl0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAodGhhdC5kYXRhLnNlbGVjdFZhbHVlID09IDMgJiYgdGhhdC5kYXRhLm1haW50YWluRGVzY3JpYmUgPT0gJycpIHtcclxuICAgICAgbXNnICs9ICfmj4/ov7DkuI3og73kuLrnqbonO1xyXG4gICAgICBpZkNvbW1pdCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdmFyIHVybDtcclxuICAgIGlmICh0aGF0LmRhdGEubWFpbnRhaW5TZXJpYWwgPT0gJycpIHtcclxuICAgICAgLy/liJvlu7rkuIDmnaHnu7Tkv67mj4/ov7BcclxuICAgICAgdXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICdIYW5iZWxsLUpSUy9hcGkvY3JtL3JlcHRlL2NyZWF0ZSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvL+abtOaWsOS4gOadoee7tOS/ruaPj+i/sFxyXG4gICAgICB1cmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJ0hhbmJlbGwtSlJTL2FwaS9jcm0vcmVwdGUvdXBkYXRlJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaWZDb21taXQpIHtcclxuICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICB2YXIgdXJsID0gJyc7XHJcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICB2YXIgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xyXG4gICAgICB2YXIgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgIHZhciBkYXkgPSBub3cuZ2V0RGF0ZSgpO1xyXG5cclxuICAgICAgaWYgKG1vbnRoIDwgMTApIHtcclxuICAgICAgICBtb250aCA9IFwiMFwiICsgbW9udGg7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRheSA8IDEwKSB7XHJcbiAgICAgICAgZGF5ID0gXCIwXCIgKyBkYXk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIG1haW50YWluVHlwZUlkOiBfdGhpcy5kYXRhLm1haW50YWluVHlwZUlkLFxyXG4gICAgICAgIG1haW50YWluTnVtYmVySWQ6IF90aGlzLmRhdGEubWFpbnRhaW5OdW1iZXJJZCxcclxuICAgICAgICBtYWluU2VyaWFsOiBfdGhpcy5kYXRhLm1haW50YWluU2VyaWFsLFxyXG4gICAgICAgIG1haW50YWluZXJJZDogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgICBtYWludGFpbmVyOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZU5hbWUsXHJcbiAgICAgICAgZGVwdG5vOiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkLFxyXG4gICAgICAgIGRlcHQ6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZSxcclxuICAgICAgICBwcm9ibGVtSWQ6IF90aGlzLmRhdGEucHJvYmxlbUlkLFxyXG4gICAgICAgIHByb2JsZW1OYW1lOiBfdGhpcy5kYXRhLnByb2JsZW1OYW1lLFxyXG4gICAgICAgIGhhbmRsaW5nSW5mbzogX3RoaXMuZGF0YS5tYWludGFpbkRlc2NyaWJlLFxyXG4gICAgICAgIGN1c3RvbWVyTmFtZTogX3RoaXMuZGF0YS5jdXN0b21lck5hbWUsXHJcbiAgICAgICAgcHJvZHVjdE5hbWU6IF90aGlzLmRhdGEucHJvZHVjdE5hbWUsXHJcbiAgICAgICAgcHVuY2hEYXRlOiB5ZWFyICsgXCIvXCIgKyBtb250aCArIFwiL1wiICsgZGF5ICsgXCIgXCIgKyB0aGlzLmRhdGEuZGF0ZXZpZXcsXHJcbiAgICAgICAgYWRkcmVzc1ZpZXc6IF90aGlzLmRhdGEuYWRkcmVzc1ZpZXcsXHJcbiAgICAgICAgYWRkcmVzc05hbWVWaWV3OiBfdGhpcy5kYXRhLmFkZHJlc3NOYW1lVmlldyxcclxuICAgICAgICByb2FkU3RhcnREYXRlOiBfdGhpcy5kYXRhLnJvYWRTdGFydERhdGUsXHJcbiAgICAgICAgYXJyaXZhbERhdGU6IF90aGlzLmRhdGEuYXJyaXZhbERhdGUsXHJcbiAgICAgICAgbGVhdmVEYXRlOiBfdGhpcy5kYXRhLmxlYXZlRGF0ZSxcclxuICAgICAgICByb2FkRW5kRGF0ZTogX3RoaXMuZGF0YS5yb2FkRW5kdERhdGUsXHJcbiAgICAgICAgc2VsZWN0VmFsdWU6IF90aGlzLmRhdGEuc2VsZWN0VmFsdWUsXHJcbiAgICAgICAgc2Vzc2lvbmtleTogYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleSxcclxuICAgICAgICBvcGVuSWQ6IGFwcC5nbG9iYWxEYXRhLm9wZW5JZCxcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF90aGlzLmRhdGEubWFpbnRhaW5TZXJpYWwgPT0gJycpIHtcclxuICAgICAgICB1cmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvY3JtL3JlcHRlL2NyZWF0ZT90eXBlPScgKyBfdGhpcy5kYXRhLnNlbGVjdFZhbHVlICsgXCImXCIgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1cmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvY3JtL3JlcHRlL3VwZGF0ZT90eXBlPScgKyBfdGhpcy5kYXRhLnNlbGVjdFZhbHVlICsgXCImXCIgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aDtcclxuICAgICAgfVxyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcclxuICAgICAgICBzaG93Q2FuY2VsOiB0cnVlLFxyXG4gICAgICAgIGNhbmNlbFRleHQ6ICflj5bmtognLFxyXG4gICAgICAgIGNvbmZpcm1UZXh0OiAn56Gu5a6aJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgbG9hZGluZ0hpZGRlbjogZmFsc2VcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0gPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgIGxvYWRpbmdIaWRkZW46IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLmNvZGUgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0aGF0LmRhdGEuc2VsZWN0VmFsdWUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucm9hZFN0YXJ0RGF0ZSA9IHRoYXQuZGF0YS5wdW5jaERhdGVWaWV3O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2VsZWN0VmFsdWUgPSAyO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoYXQuZGF0YS5zZWxlY3RWYWx1ZSA9PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5hcnJpdmFsRGF0ZSA9IHRoYXQuZGF0YS5wdW5jaERhdGVWaWV3O1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2VsZWN0VmFsdWUgPSAzO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoYXQuZGF0YS5zZWxlY3RWYWx1ZSA9PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5sZWF2ZURhdGUgPSB0aGF0LmRhdGEucHVuY2hEYXRlVmlldztcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnNlbGVjdFZhbHVlID0gNDtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGF0LmRhdGEuc2VsZWN0VmFsdWUgPT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2VsZWN0VmFsdWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5tc2cgIT0gJ3N1Y2Nlc3MnICYmIHJlcy5kYXRhLm1zZyAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLm1haW5TZXJpYWwgPSByZXMuZGF0YS5tc2c7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgLy/mlL7lhaXnvJPlrZhcclxuICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZSh7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5OiAncGFnZURhdGEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2VsZWN0VmFsdWUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAga2V5OiAncGFnZURhdGEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogKHt9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIuaPkOS6pOaIkOWKn1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3BhZ2VzL2luZGV4L2luZGV4XCJcclxuICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+a2iOaBrycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCLmj5DkuqTlpLHotKVcIixcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9wYWdlcy9pbmRleC9pbmRleFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEoe1xyXG4gICAgICAgICAgICAgIGxvYWRpbmdIaWRkZW46IHRydWVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBtc2csXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGdldFRpbWUoKSB7XHJcblxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgIHZhciBub3dUaW1lID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICB2YXIgaG91cnMgPSBub3dUaW1lLmdldEhvdXJzKCk7XHJcbiAgICB2YXIgbWludXRlcyA9IG5vd1RpbWUuZ2V0TWludXRlcygpO1xyXG4gICAgdmFyIHNlY29uZHMgPSBub3dUaW1lLmdldFNlY29uZHMoKTtcclxuXHJcbiAgICBpZiAoaG91cnMgPCAxMCkge1xyXG4gICAgICBob3VycyA9ICcwJyArIGhvdXJzO1xyXG4gICAgfVxyXG4gICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xyXG4gICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcclxuICAgIH1cclxuICAgIGlmIChzZWNvbmRzIDwgMTApIHtcclxuICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XHJcbiAgICB9XHJcbiAgICB2YXIgZGF0ZXZpZXcgPSBob3VycyArIFwiOlwiICsgbWludXRlcyArIFwiOlwiICsgc2Vjb25kc1xyXG4gICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgZGF0ZXZpZXc6IGRhdGV2aWV3LFxyXG4gICAgICBwdW5jaERhdGVWaWV3OiBob3VycyArIFwiOlwiICsgbWludXRlc1xyXG4gICAgfSlcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgdGhhdC5nZXRUaW1lKCk7XHJcblxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG4gIH0sXHJcbiAgLy/ojrflj5bnlKjmiLflnLDnkIbkvY3nva7mnYPpmZBcclxuICBnZXRQZXJtaXNzaW9uOiBmdW5jdGlvbiAoX3RoaXMsIGRhdGEpIHtcclxuICAgIHd4LmdldExvY2F0aW9uKHtcclxuICAgICAgdHlwZTogJ2djajAyJyxcclxuICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICBjb25zdCB4MSA9IHJlcy5sb25naXR1ZGVcclxuICAgICAgICBjb25zdCB5MSA9IHJlcy5sYXRpdHVkZVxyXG4gICAgICAgIGNvbnN0IHNwZWVkID0gcmVzLnNwZWVkXHJcbiAgICAgICAgY29uc3QgYWNjdXJhY3kgPSByZXMuYWNjdXJhY3lcclxuICAgICAgICB3eC5jaG9vc2VMb2NhdGlvbih7XHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzMSkge1xyXG4gICAgICAgICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICBhZGRyZXNzVmlldzogcmVzMS5hZGRyZXNzLFxyXG4gICAgICAgICAgICAgIGFkZHJlc3NOYW1lVmlldzogcmVzMS5uYW1lLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zdCB4MiA9IHJlczEubG9uZ2l0dWRlXHJcbiAgICAgICAgICAgIGNvbnN0IHkyID0gcmVzMS5sYXRpdHVkZVxyXG4gICAgICAgICAgICB2YXIgYSA9IE1hdGguc2luKHkxKTtcclxuICAgICAgICAgICAgdmFyIGIgPSBNYXRoLnNpbih5Mik7XHJcbiAgICAgICAgICAgIHZhciBjID0gTWF0aC5jb3MoeTEpO1xyXG4gICAgICAgICAgICB2YXIgZCA9IE1hdGguY29zKHkyKTtcclxuICAgICAgICAgICAgdmFyIGUgPSBNYXRoLmNvcyh4MSAtIHgyKTtcclxuICAgICAgICAgICAgdmFyIHYgPSBhICogYiArIGMgKiBkICogZTtcclxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gNjM3MS4wICogTWF0aC5hY29zKHYpICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICAgICAgdmFyIHJvdW5kZGlzdGFuY2UgPSBNYXRoLnJvdW5kKGRpc3RhbmNlICogMTAwMCk7XHJcbiAgICAgICAgICAgIGlmIChyb3VuZGRpc3RhbmNlID4gNzApIHtcclxuICAgICAgICAgICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIGFkZHJlc3NWaWV3OiAnJyxcclxuICAgICAgICAgICAgICAgIGFkZHJlc3NOYW1lVmlldzogJycsXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogJ+mAieaLqeS9jee9ruS4juW9k+WJjeS9jee9ruS4uicgKyByb3VuZGRpc3RhbmNlICsgJyzkuI3lvpfotoXov4c3MOexsycsXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd3guZ2V0U2V0dGluZyh7XHJcbiAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXR1ID0gcmVzLmF1dGhTZXR0aW5nO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzdGF0dVsnc2NvcGUudXNlckxvY2F0aW9uJ10pIHtcclxuICAgICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aYr+WQpuaOiOadg+W9k+WJjeS9jee9ricsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+mcgOimgeiOt+WPluaCqOeahOWcsOeQhuS9jee9ru+8jOivt+ehruiupOaOiOadg++8jOWQpuWImeWcsOWbvuWKn+iDveWwhuaXoOazleS9v+eUqCcsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHRpcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHRpcC5jb25maXJtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuYXV0aFNldHRpbmdbXCJzY29wZS51c2VyTG9jYXRpb25cIl0gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aOiOadg+aIkOWKnycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5o6I5p2D5oiQ5Yqf5LmL5ZCO77yM5YaN6LCD55SoY2hvb3NlTG9jYXRpb27pgInmi6nlnLDmlrlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guY2hvb3NlTG9jYXRpb24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzVmlldzogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3NOYW1lVmlldzogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o6I5p2D5aSx6LSlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfosIPnlKjmjojmnYPnqpflj6PlpLHotKUnLFxyXG4gICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG4gICAgICBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgIHRpdGxlOiAn5b6u5L+h5pyN5Yqh5pyq5YWB6K64JyxcclxuICAgICAgICAgIGljb246ICd3YXJuJyxcclxuICAgICAgICAgIGR1cmF0aW9uOiAxMDAwXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG59KVxyXG4iXX0=