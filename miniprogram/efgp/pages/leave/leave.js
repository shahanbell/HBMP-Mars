"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var d = new Date();
Page({
    data: {
        dataList: [],
        hasOpenId: false,
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        showRowDate1: null,
        showRowDate2: null,
        showRowTime: null,
        showRowSameDate: null,
        date1: null,
        date2: null,
        sameDate: null,
        yearDays: 0,
        sameDays: 0,
        time1: "08:00",
        time2: "17:10",
        formType: '1',
        formTypeDesc: '普通工作日',
        formKind: '1',
        formKindDesc: '1-年休假',
        workType: '1',
        workTypeDesc: '1-常日班 8:00-17:10',
        leaveDay: 1,
        leaveHour: 0,
        leaveMinute: 0,
        reason: '',
        checked: false,
        showTime1: false,
        showTime2: false,
        showDate1: false,
        showDate2: false,
        showSameDate: false,
        isOverdue: false,
        formatter: function (type, value) {
            if (type === 'year') {
                return value + "\u5E74";
            }
            else if (type === 'month') {
                return value + "\u6708";
            }
            else if (type === 'day') {
                return value + "\u65E5";
            }
            return value;
        },
        uploaderList: [],
        showUpload: true,
        hkgl004Files: []
    },
    onLoad: function () {
        var _this_1 = this;
        var that = this;
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/shberp/nianjia/' + app.globalData.employeeId + '?' + app.globalData.restAuth,
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                wx.showLoading({
                    title: 'Loading',
                });
                setTimeout(function () {
                    wx.hideLoading();
                }, 2000);
                var dateTemp = new Date(new Date().getTime());
                var year = dateTemp.getFullYear();
                var month = dateTemp.getMonth() + 1;
                var day = dateTemp.getDate();
                var dayTemp = year + "-" + month + "-" + day;
                that.setData({
                    date1: _this_1.dateFormatForYYMMDD(new Date().getTime()),
                    date2: _this_1.dateFormatForYYMMDD(new Date().getTime()),
                    yearDays: res.data.object
                });
                if (app.globalData.openId) {
                    _this_1.setData({
                        hasOpenId: true
                    });
                }
                if (app.globalData.authorized) {
                    _this_1.setData({
                        employeeId: app.globalData.employeeId,
                        employeeName: app.globalData.employeeName
                    });
                }
                if (app.globalData.defaultDeptId) {
                    _this_1.setData({
                        deptId: app.globalData.defaultDeptId,
                        deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName
                    });
                }
            }
        });
    },
    bindDeptSelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../../../pages/deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
            events: {
                returnDeptSelect: function (res) {
                    if (res) {
                        that.setData({
                            deptId: res.k,
                            deptName: res.k + '-' + res.v
                        });
                    }
                }
            },
            success: function (res) {
                console.log(res);
            }
        });
    },
    bindFormTypeChange: function (e) {
        if (e.detail) {
            this.setData({
                formType: '2',
                formTypeDesc: '法定节假假日前后',
                checked: true
            });
        }
        else {
            this.setData({
                formType: '1',
                formTypeDesc: '普通工作日',
                checked: false
            });
        }
    },
    bindIsOverdueChange: function (e) {
        this.setData({
            isOverdue: e.detail
        });
    },
    bindLeaveKindSelect: function (e) {
        var that = this;
        console.info("13123123");
        wx.navigateTo({
            url: './leaveKindSelect',
            events: {
                returnLeaveKindSelect: function (res) {
                    if (res) {
                        that.setData({
                            formKind: res.k,
                            formKindDesc: res.k + '-' + res.v
                        });
                    }
                }
            },
            success: function (res) {
                console.log(res);
            }
        });
    },
    bindWorkTypeSelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../../../pages/workTypeSelect/workTypeSelect',
            events: {
                returnWorkTypeSelect: function (res) {
                    if (res) {
                        that.setData({
                            workType: res.k,
                            workTypeDesc: res.k + '-' + res.v
                        });
                    }
                }
            },
            success: function (res) {
                console.log(res);
            }
        });
    },
    bindLeaveDayChange: function (e) {
        this.setData({
            leaveDay: e.detail
        });
    },
    bindLeaveHourChange: function (e) {
        this.setData({
            leaveHour: e.detail
        });
    },
    bindLeaveMinuteChange: function (e) {
        this.setData({
            leaveMinute: e.detail
        });
    },
    bindReasonChange: function (e) {
        console.log(e);
        this.setData({
            reason: e.detail.value
        });
    },
    bindPickerTime1: function (e) {
        this.openPickerTime1();
    },
    bindCloseTime1: function (e) {
        this.closePickerTime1();
    },
    bindTime1Cencel: function (e) {
        this.closePickerTime1();
    },
    bindTime1Confirm: function (e) {
        this.setData({
            time1: e.detail
        });
        this.closePickerTime1();
    },
    openPickerTime1: function () {
        this.setData({
            showTime1: true
        });
    },
    closePickerTime1: function () {
        this.setData({
            showTime1: false
        });
    },
    bindPickerTime2: function (e) {
        this.openPickerTime2();
    },
    bindCloseTime2: function (e) {
        this.closePickerTime2();
    },
    bindTime2Cencel: function (e) {
        this.closePickerTime2();
    },
    bindTime2Confirm: function (e) {
        this.setData({
            time2: e.detail
        });
        this.closePickerTime2();
    },
    openPickerTime2: function () {
        this.setData({
            showTime2: true
        });
    },
    closePickerTime2: function () {
        this.setData({
            showTime2: false
        });
    },
    bindPickerDate1: function (e) {
        this.setData({
            showRowDate1: this.formatYYMMDDToDate(this.data.date1)
        });
        this.openPickerDate1();
    },
    bindCloseDate1: function (e) {
        this.closePickerDate1();
    },
    bindDate1Cancel: function (e) {
        this.closePickerDate1();
    },
    bindDate1Confirm: function (e) {
        if (e.detail != 1262275200000) {
            this.setData({
                date1: this.dateFormatForYYMMDD(e.detail)
            });
        }
        this.closePickerDate1();
    },
    openPickerDate1: function () {
        this.setData({
            showDate1: true
        });
    },
    closePickerDate1: function () {
        this.setData({
            showDate1: false
        });
    },
    bindPickerDate2: function (e) {
        this.setData({
            showRowDate2: this.formatYYMMDDToDate(this.data.date2)
        });
        this.openPickerDate2();
    },
    bindCloseDate2: function (e) {
        this.closePickerDate2();
    },
    bindDate2Cancel: function (e) {
        this.closePickerDate2();
    },
    bindDate2Confirm: function (e) {
        if (e.detail != 1262275200000) {
            this.setData({
                date2: this.dateFormatForYYMMDD(e.detail)
            });
        }
        this.closePickerDate2();
    },
    openPickerDate2: function () {
        this.setData({
            showDate2: true
        });
    },
    closePickerDate2: function () {
        this.setData({
            showDate2: false
        });
    },
    bindPickerSameDate: function (e) {
        console.info("123123");
        var a = this.dateFormatForYYMMDD(new Date().getTime());
        var b = this.formatYYMMDDToDate(a);
        this.setData({
            showRowSameDate: b
        });
        this.openPickerSameDate();
    },
    bindCloseSameDate: function (e) {
        this.closePickerSameDate();
    },
    bindSameDateCancel: function (e) {
        this.closePickerSameDate();
    },
    bindSameDateConfirm: function (e) {
        if (e.detail != 1262275200000) {
            this.setData({
                sameDate: this.dateFormatForYYMMDD(e.detail)
            });
        }
        this.closePickerSameDate();
    },
    openPickerSameDate: function () {
        this.setData({
            showSameDate: true
        });
    },
    closePickerSameDate: function () {
        this.setData({
            showSameDate: false
        });
    },
    bindSameDaysChange: function (e) {
        this.setData({
            sameDays: e.detail
        });
    },
    formatYYMMDDToDate: function (value) {
        console.info("value" + value);
        var str = value.replace(/-/g, '/');
        var date = new Date(str);
        return date.getTime();
    },
    clearImg: function (e) {
        var nowList = [];
        var uploaderList = this.data.uploaderList;
        for (var i = 0; i < uploaderList.length; i++) {
            if (i == e.currentTarget.dataset.index) {
                continue;
            }
            else {
                nowList.push(uploaderList[i]);
            }
        }
        this.setData({
            uploaderNum: this.data.uploaderNum - 1,
            uploaderList: nowList,
            showUpload: true
        });
    },
    showImg: function (e) {
        var that = this;
        wx.previewImage({
            urls: that.data.uploaderList,
            current: that.data.uploaderList[e.currentTarget.dataset.index]
        });
    },
    upload: function (e) {
        var that = this;
        wx.chooseImage({
            count: 3 - that.data.uploaderNum,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                console.info('tempFilePaths==' + JSON.stringify(tempFilePaths));
                var uploaderList = that.data.uploaderList.concat(tempFilePaths);
                if (uploaderList.length == 3) {
                    that.setData({
                        showUpload: false
                    });
                }
                that.setData({
                    uploaderList: uploaderList,
                    uploaderNum: uploaderList.length,
                });
            }
        });
    },
    dateFormatForYYMMDD: function (date) {
        var dateTemp = new Date(date);
        var year = dateTemp.getFullYear();
        var month = dateTemp.getMonth() + 1;
        var day = dateTemp.getDate();
        var hour = dateTemp.getHours();
        var minute = dateTemp.getMinutes();
        var dayTemp = year + "-" + month + "-" + day;
        return dayTemp;
    },
    initFile: function () {
        console.info("1111");
        var nowList = [];
        var _this = this;
        var FileSystemManager = wx.getFileSystemManager();
        _this.data.uploaderList.forEach(function (o, i) {
            console.info("222");
            var baselib = FileSystemManager.readFileSync(_this.data.uploaderList[i], 'base64');
            var imagePathTemp = _this.data.uploaderList[i].split('.');
            var imageType = imagePathTemp[imagePathTemp.length - 1];
            var obj = { data: baselib, imageType: imageType };
            nowList.push(obj);
        });
        _this.setData({
            hkgl004Files: nowList
        });
    },
    formSubmit: function (e) {
        var canSubmit = true;
        var errmsg = '';
        this.initFile();
        if (!app.globalData.authorized) {
            canSubmit = false;
            errmsg += '账号未授权\r\n';
        }
        if (!this.data.employeeId || this.data.employeeId == '') {
            canSubmit = false;
            errmsg += '请填写申请人员\r\n';
        }
        if (!this.data.deptId || this.data.deptId == '') {
            canSubmit = false;
            errmsg += "请填写申请部门\r\n";
        }
        if (!this.data.reason || this.data.reason == '') {
            canSubmit = false;
            errmsg += "请填写请假原因\r\n";
        }
        if (this.data.formKind == '3' || this.data.formKind == '10') {
            if (this.data.sameDate == null || this.data.sameDate == '') {
                canSubmit = false;
                errmsg += "请填写同假别首次请假日期\r\n";
            }
            if (this.data.sameDays == 0) {
                canSubmit = false;
                errmsg += "请填写同假别累计天数\r\n";
            }
        }
        var t = this.data.leaveDay + this.data.leaveHour + this.data.leaveMinute;
        if (t < 1) {
            canSubmit = false;
            errmsg += "请填写请假时间\r\n";
        }
        if (canSubmit) {
            var _this_2 = this;
            wx.showModal({
                title: '系统提示',
                content: '确定提交吗',
                success: function (res) {
                    if (res.confirm) {
                        wx.showLoading({
                            title: 'Sending'
                        });
                        wx.request({
                            url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl004/wechat?' + app.globalData.restAuth,
                            data: {
                                employee: _this_2.data.employeeId,
                                formType: _this_2.data.formType,
                                formTypeDesc: _this_2.data.formTypeDesc,
                                formKind: _this_2.data.formKind,
                                formKindDesc: _this_2.data.formKindDesc,
                                workType: _this_2.data.workType,
                                workTypeDesc: _this_2.data.workTypeDesc,
                                date1: _this_2.data.date1,
                                time1: _this_2.data.time1,
                                date2: _this_2.data.date2,
                                time2: _this_2.data.time2,
                                sameDate: _this_2.data.sameDate,
                                sameDays: _this_2.data.sameDays,
                                leaveDay: _this_2.data.leaveDay,
                                leaveHour: _this_2.data.leaveHour,
                                leaveMinute: _this_2.data.leaveMinute,
                                reason: _this_2.data.reason,
                                overdue: _this_2.data.isOverdue ? "Y" : "N",
                                hkgl004Files: _this_2.data.hkgl004Files
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            method: 'POST',
                            success: function (res) {
                                wx.hideLoading();
                                wx.showModal({
                                    title: '系统消息',
                                    content: res.data.msg,
                                    showCancel: false,
                                    success: function (res) {
                                        wx.switchTab({
                                            url: "/pages/index/index"
                                        });
                                    }
                                });
                            },
                            fail: function (fail) {
                                wx.hideLoading();
                                wx.showModal({
                                    title: '系统提示',
                                    content: "请联系管理员:" + fail,
                                    showCancel: false
                                });
                            }
                        });
                    }
                }
            });
        }
        else {
            wx.showModal({
                title: '系统提示',
                content: errmsg,
                showCancel: false
            });
        }
    },
    formReset: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsZWF2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7QUFDbEIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLEVBQVM7UUFDbkIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFlBQVksRUFBRSxJQUFJO1FBQ2xCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGVBQWUsRUFBRSxJQUFJO1FBQ3JCLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLElBQUk7UUFDWCxRQUFRLEVBQUMsSUFBSTtRQUNiLFFBQVEsRUFBQyxDQUFDO1FBQ1YsUUFBUSxFQUFDLENBQUM7UUFDVixLQUFLLEVBQUUsT0FBTztRQUNkLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLEdBQUc7UUFDYixZQUFZLEVBQUUsT0FBTztRQUNyQixRQUFRLEVBQUUsR0FBRztRQUNiLFlBQVksRUFBRSxPQUFPO1FBQ3JCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsWUFBWSxFQUFFLGtCQUFrQjtRQUNoQyxRQUFRLEVBQUUsQ0FBVztRQUNyQixTQUFTLEVBQUUsQ0FBVztRQUN0QixXQUFXLEVBQUUsQ0FBVztRQUN4QixNQUFNLEVBQUUsRUFBRTtRQUNWLE9BQU8sRUFBRSxLQUFLO1FBQ2QsU0FBUyxFQUFFLEtBQUs7UUFDaEIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsWUFBWSxFQUFFLEtBQUs7UUFDbkIsU0FBUyxFQUFDLEtB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QUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHO29DQUNyQixVQUFVLEVBQUUsS0FBSztvQ0FDakIsT0FBTyxZQUFDLEdBQUc7d0NBQ1QsRUFBRSxDQUFDLFNBQVMsQ0FBQzs0Q0FDWCxHQUFHLEVBQUUsb0JBQW9CO3lDQUMxQixDQUFDLENBQUE7b0NBQ0osQ0FBQztpQ0FDRixDQUFDLENBQUE7NEJBQ0osQ0FBQzs0QkFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dDQUNSLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQ0FDakIsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQ0FDWCxLQUFLLEVBQUUsTUFBTTtvQ0FDYixPQUFPLEVBQUUsU0FBUyxHQUFHLElBQUk7b0NBQ3pCLFVBQVUsRUFBRSxLQUFLO2lDQUNsQixDQUFDLENBQUE7NEJBQ0osQ0FBQzt5QkFDRixDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztJQUNELFNBQVM7SUFFVCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9sZWF2ZS50c1xyXG5pbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi8uLi9hcHAnXHJcblxyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcbmxldCBkID0gbmV3IERhdGUoKVxyXG5QYWdlKHtcclxuICBkYXRhOiB7XHJcbiAgICBkYXRhTGlzdDogW10gYXMgYW55LFxyXG4gICAgaGFzT3BlbklkOiBmYWxzZSxcclxuICAgIGVtcGxveWVlSWQ6IG51bGwsXHJcbiAgICBlbXBsb3llZU5hbWU6IG51bGwsXHJcbiAgICBkZXB0SWQ6IG51bGwsXHJcbiAgICBkZXB0TmFtZTogbnVsbCxcclxuICAgIHNob3dSb3dEYXRlMTogbnVsbCxcclxuICAgIHNob3dSb3dEYXRlMjogbnVsbCxcclxuICAgIHNob3dSb3dUaW1lOiBudWxsLFxyXG4gICAgc2hvd1Jvd1NhbWVEYXRlOiBudWxsLFxyXG4gICAgZGF0ZTE6IG51bGwsXHJcbiAgICBkYXRlMjogbnVsbCxcclxuICAgIHNhbWVEYXRlOm51bGwsXHJcbiAgICB5ZWFyRGF5czowLFxyXG4gICAgc2FtZURheXM6MCxcclxuICAgIHRpbWUxOiBcIjA4OjAwXCIsXHJcbiAgICB0aW1lMjogXCIxNzoxMFwiLFxyXG4gICAgZm9ybVR5cGU6ICcxJyxcclxuICAgIGZvcm1UeXBlRGVzYzogJ+aZrumAmuW3peS9nOaXpScsXHJcbiAgICBmb3JtS2luZDogJzEnLFxyXG4gICAgZm9ybUtpbmREZXNjOiAnMS3lubTkvJHlgYcnLFxyXG4gICAgd29ya1R5cGU6ICcxJyxcclxuICAgIHdvcmtUeXBlRGVzYzogJzEt5bi45pel54+tIDg6MDAtMTc6MTAnLFxyXG4gICAgbGVhdmVEYXk6IDEgYXMgbnVtYmVyLFxyXG4gICAgbGVhdmVIb3VyOiAwIGFzIG51bWJlcixcclxuICAgIGxlYXZlTWludXRlOiAwIGFzIG51bWJlcixcclxuICAgIHJlYXNvbjogJycsXHJcbiAgICBjaGVja2VkOiBmYWxzZSxcclxuICAgIHNob3dUaW1lMTogZmFsc2UsXHJcbiAgICBzaG93VGltZTI6IGZhbHNlLFxyXG4gICAgc2hvd0RhdGUxOiBmYWxzZSxcclxuICAgIHNob3dEYXRlMjogZmFsc2UsXHJcbiAgICBzaG93U2FtZURhdGU6IGZhbHNlLFxyXG4gICAgaXNPdmVyZHVlOmZhbHNlLFxyXG4gICAgZm9ybWF0dGVyKHR5cGUsIHZhbHVlKSB7XHJcbiAgICAgIGlmICh0eXBlID09PSAneWVhcicpIHtcclxuICAgICAgICByZXR1cm4gYCR7dmFsdWV95bm0YDtcclxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnbW9udGgnKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3ZhbHVlfeaciGA7XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RheScpIHtcclxuICAgICAgICByZXR1cm4gYCR7dmFsdWV95pelYDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9LFxyXG4gICAgdXBsb2FkZXJMaXN0OiBbXSxcclxuICAgIHNob3dVcGxvYWQ6IHRydWUsXHJcbiAgICBoa2dsMDA0RmlsZXM6IFtdXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICBcclxuICAgICAgLy8gdXJsOiB0aGF0Lmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9zZXNzaW9uJyxcclxuICAgICAgdXJsOiBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkKycvSGFuYmVsbC1KUlMvYXBpL3NoYmVycC9uaWFuamlhLycgKyBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkKyc/JysgYXBwLmdsb2JhbERhdGEucmVzdEF1dGgsXHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgICAgICB0aXRsZTogJ0xvYWRpbmcnLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICAgICAgfSwgMjAwMClcclxuICAgICAgICBsZXQgZGF0ZVRlbXAgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcbiAgICAgICAgbGV0IHllYXIgPSBkYXRlVGVtcC5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgIGxldCBtb250aCA9IGRhdGVUZW1wLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgICAgIGxldCBkYXkgPSBkYXRlVGVtcC5nZXREYXRlKCk7XHJcbiAgICAgICAgbGV0IGRheVRlbXAgPSB5ZWFyICsgXCItXCIgKyBtb250aCArIFwiLVwiICsgZGF5O1xyXG4gICAgICAgIHRoYXQuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgZGF0ZTE6IHRoaXMuZGF0ZUZvcm1hdEZvcllZTU1ERChuZXcgRGF0ZSgpLmdldFRpbWUoKSksXHJcbiAgICAgICAgICBkYXRlMjogdGhpcy5kYXRlRm9ybWF0Rm9yWVlNTUREKG5ldyBEYXRlKCkuZ2V0VGltZSgpKSxcclxuICAgICAgICAgIHllYXJEYXlzOnJlcy5kYXRhLm9iamVjdFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgaWYgKGFwcC5nbG9iYWxEYXRhLm9wZW5JZCkge1xyXG4gICAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICAgIGhhc09wZW5JZDogdHJ1ZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICBlbXBsb3llZUlkOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICBlbXBsb3llZU5hbWU6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQpIHtcclxuICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICBkZXB0SWQ6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQsXHJcbiAgICAgICAgICAgIGRlcHROYW1lOiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkICsgJy0nICsgYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHROYW1lXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBiaW5kRGVwdFNlbGVjdChlKSB7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICB1cmw6ICcuLi8uLi8uLi9wYWdlcy9kZXB0U2VsZWN0L2RlcHRTZWxlY3Q/ZW1wbG95ZWVpZD0nICsgYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuRGVwdFNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBkZXB0SWQ6IHJlcy5rLFxyXG4gICAgICAgICAgICAgIGRlcHROYW1lOiByZXMuayArICctJyArIHJlcy52XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRGb3JtVHlwZUNoYW5nZShlKSB7XHJcbiAgICBpZiAoZS5kZXRhaWwpIHtcclxuICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICBmb3JtVHlwZTogJzInLFxyXG4gICAgICAgIGZvcm1UeXBlRGVzYzogJ+azleWumuiKguWBh+WBh+aXpeWJjeWQjicsXHJcbiAgICAgICAgY2hlY2tlZDogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICBmb3JtVHlwZTogJzEnLFxyXG4gICAgICAgIGZvcm1UeXBlRGVzYzogJ+aZrumAmuW3peS9nOaXpScsXHJcbiAgICAgICAgY2hlY2tlZDogZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiaW5kSXNPdmVyZHVlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIGlzT3ZlcmR1ZTogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kTGVhdmVLaW5kU2VsZWN0KGUpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgY29uc29sZS5pbmZvKFwiMTMxMjMxMjNcIilcclxuICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICB1cmw6ICcuL2xlYXZlS2luZFNlbGVjdCcsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybkxlYXZlS2luZFNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBmb3JtS2luZDogcmVzLmssXHJcbiAgICAgICAgICAgICAgZm9ybUtpbmREZXNjOiByZXMuayArICctJyArIHJlcy52XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRXb3JrVHlwZVNlbGVjdChlKSB7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICB1cmw6ICcuLi8uLi8uLi9wYWdlcy93b3JrVHlwZVNlbGVjdC93b3JrVHlwZVNlbGVjdCcsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybldvcmtUeXBlU2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIHdvcmtUeXBlOiByZXMuayxcclxuICAgICAgICAgICAgICB3b3JrVHlwZURlc2M6IHJlcy5rICsgJy0nICsgcmVzLnZcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZExlYXZlRGF5Q2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBsZWF2ZURheTogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kTGVhdmVIb3VyQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBsZWF2ZUhvdXI6IGUuZGV0YWlsXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZExlYXZlTWludXRlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBsZWF2ZU1pbnV0ZTogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kUmVhc29uQ2hhbmdlKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgcmVhc29uOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICAvL+W8gOWni+aXtumXtOeahOe7hOS7tuWbnuiwg+WHveaVsFxyXG4gIGJpbmRQaWNrZXJUaW1lMShlKSB7XHJcbiAgICB0aGlzLm9wZW5QaWNrZXJUaW1lMSgpO1xyXG4gIH0sXHJcbiAgYmluZENsb3NlVGltZTEoZSkge1xyXG4gICAgdGhpcy5jbG9zZVBpY2tlclRpbWUxKCk7XHJcbiAgfSxcclxuICBiaW5kVGltZTFDZW5jZWwoZSkge1xyXG4gICAgdGhpcy5jbG9zZVBpY2tlclRpbWUxKCk7XHJcbiAgfSxcclxuICBiaW5kVGltZTFDb25maXJtKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICB0aW1lMTogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgICB0aGlzLmNsb3NlUGlja2VyVGltZTEoKTtcclxuICB9LFxyXG4gIG9wZW5QaWNrZXJUaW1lMSgpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzaG93VGltZTE6IHRydWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBjbG9zZVBpY2tlclRpbWUxKCkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNob3dUaW1lMTogZmFsc2VcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgLy/miKrmraLml7bpl7TnmoTnu4Tku7blm57osINcclxuXHJcbiAgYmluZFBpY2tlclRpbWUyKGUpIHtcclxuICAgIHRoaXMub3BlblBpY2tlclRpbWUyKCk7XHJcbiAgfSxcclxuICBiaW5kQ2xvc2VUaW1lMihlKSB7XHJcbiAgICB0aGlzLmNsb3NlUGlja2VyVGltZTIoKTtcclxuICB9LFxyXG4gIGJpbmRUaW1lMkNlbmNlbChlKSB7XHJcbiAgICB0aGlzLmNsb3NlUGlja2VyVGltZTIoKTtcclxuICB9LFxyXG4gIGJpbmRUaW1lMkNvbmZpcm0oZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHRpbWUyOiBlLmRldGFpbFxyXG4gICAgfSlcclxuICAgIHRoaXMuY2xvc2VQaWNrZXJUaW1lMigpO1xyXG4gIH0sXHJcblxyXG4gIG9wZW5QaWNrZXJUaW1lMigpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzaG93VGltZTI6IHRydWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBjbG9zZVBpY2tlclRpbWUyKCkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNob3dUaW1lMjogZmFsc2VcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcblxyXG4gIC8vIOW8gOWni+aXpeacn+eahOaXtumXtOe7hOS7tuWbnuiwg1xyXG4gIGJpbmRQaWNrZXJEYXRlMShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgc2hvd1Jvd0RhdGUxOiB0aGlzLmZvcm1hdFlZTU1ERFRvRGF0ZSh0aGlzLmRhdGEuZGF0ZTEpXHJcbiAgICB9KVxyXG4gICAgdGhpcy5vcGVuUGlja2VyRGF0ZTEoKTtcclxuICB9LFxyXG4gIGJpbmRDbG9zZURhdGUxKGUpIHtcclxuICAgIHRoaXMuY2xvc2VQaWNrZXJEYXRlMSgpO1xyXG4gIH0sXHJcblxyXG4gIGJpbmREYXRlMUNhbmNlbChlKSB7XHJcbiAgICB0aGlzLmNsb3NlUGlja2VyRGF0ZTEoKTtcclxuICB9LFxyXG4gIGJpbmREYXRlMUNvbmZpcm0oZSkge1xyXG4gICAgLy/pppbmrKHliqDovb3lm57osIPmmL7npLrpg73mmK8yMDEwLzEvMSxcclxuICAgIGlmIChlLmRldGFpbCAhPSAxMjYyMjc1MjAwMDAwKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGRhdGUxOiB0aGlzLmRhdGVGb3JtYXRGb3JZWU1NREQoZS5kZXRhaWwpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLmNsb3NlUGlja2VyRGF0ZTEoKTtcclxuICB9LFxyXG4gIG9wZW5QaWNrZXJEYXRlMSgpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzaG93RGF0ZTE6IHRydWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBjbG9zZVBpY2tlckRhdGUxKCkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNob3dEYXRlMTogZmFsc2VcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgLy/miKrmraLml7bpl7TnmoTml6XmnJ/nu4Tku7blm57osINcclxuICBiaW5kUGlja2VyRGF0ZTIoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNob3dSb3dEYXRlMjogdGhpcy5mb3JtYXRZWU1NRERUb0RhdGUodGhpcy5kYXRhLmRhdGUyKVxyXG4gICAgfSlcclxuICAgIHRoaXMub3BlblBpY2tlckRhdGUyKCk7XHJcbiAgfSxcclxuICBiaW5kQ2xvc2VEYXRlMihlKSB7XHJcbiAgICB0aGlzLmNsb3NlUGlja2VyRGF0ZTIoKTtcclxuICB9LFxyXG5cclxuICBiaW5kRGF0ZTJDYW5jZWwoZSkge1xyXG4gICAgdGhpcy5jbG9zZVBpY2tlckRhdGUyKCk7XHJcbiAgfSxcclxuICBiaW5kRGF0ZTJDb25maXJtKGUpIHtcclxuICAgIGlmIChlLmRldGFpbCAhPSAxMjYyMjc1MjAwMDAwKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGRhdGUyOiB0aGlzLmRhdGVGb3JtYXRGb3JZWU1NREQoZS5kZXRhaWwpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLmNsb3NlUGlja2VyRGF0ZTIoKTtcclxuICB9LFxyXG4gIG9wZW5QaWNrZXJEYXRlMigpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzaG93RGF0ZTI6IHRydWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBjbG9zZVBpY2tlckRhdGUyKCkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNob3dEYXRlMjogZmFsc2VcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcblxyXG4gIC8v5ZCM5YGH5Yir55qE5pel5pyf57uE5Lu25Zue6LCDXHJcbiAgYmluZFBpY2tlclNhbWVEYXRlKGUpIHtcclxuICAgIGNvbnNvbGUuaW5mbyhcIjEyMzEyM1wiKVxyXG4gICAgbGV0IGE9IHRoaXMuZGF0ZUZvcm1hdEZvcllZTU1ERChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcbiAgICBsZXQgYj0gIHRoaXMuZm9ybWF0WVlNTUREVG9EYXRlKGEpO1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNob3dSb3dTYW1lRGF0ZTogYlxyXG4gICAgfSlcclxuICAgIHRoaXMub3BlblBpY2tlclNhbWVEYXRlKCk7XHJcbiAgfSxcclxuICBiaW5kQ2xvc2VTYW1lRGF0ZShlKSB7XHJcbiAgICB0aGlzLmNsb3NlUGlja2VyU2FtZURhdGUoKTtcclxuICB9LFxyXG5cclxuICBiaW5kU2FtZURhdGVDYW5jZWwoZSkge1xyXG4gICAgdGhpcy5jbG9zZVBpY2tlclNhbWVEYXRlKCk7XHJcbiAgfSxcclxuICBiaW5kU2FtZURhdGVDb25maXJtKGUpIHtcclxuICAgIGlmIChlLmRldGFpbCAhPSAxMjYyMjc1MjAwMDAwKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIHNhbWVEYXRlOiB0aGlzLmRhdGVGb3JtYXRGb3JZWU1NREQoZS5kZXRhaWwpXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLmNsb3NlUGlja2VyU2FtZURhdGUoKTtcclxuICB9LFxyXG4gIG9wZW5QaWNrZXJTYW1lRGF0ZSgpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzaG93U2FtZURhdGU6IHRydWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBjbG9zZVBpY2tlclNhbWVEYXRlKCkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNob3dTYW1lRGF0ZTogZmFsc2VcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgYmluZFNhbWVEYXlzQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzYW1lRGF5czogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgZm9ybWF0WVlNTUREVG9EYXRlKHZhbHVlKSB7XHJcbiAgICBjb25zb2xlLmluZm8oXCJ2YWx1ZVwiK3ZhbHVlKVxyXG4gICAgdmFyIHN0ciA9IHZhbHVlLnJlcGxhY2UoLy0vZywgJy8nKTtcclxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoc3RyKVxyXG4gICAgcmV0dXJuIGRhdGUuZ2V0VGltZSgpO1xyXG4gIH0sXHJcblxyXG4gIC8vIOWIoOmZpOWbvueJh1xyXG4gIGNsZWFySW1nKGUpIHtcclxuICAgIHZhciBub3dMaXN0ID0gW107Ly/mlrDmlbDmja5cclxuICAgIHZhciB1cGxvYWRlckxpc3QgPSB0aGlzLmRhdGEudXBsb2FkZXJMaXN0Oy8v5Y6f5pWw5o2uXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cGxvYWRlckxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGkgPT0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXgpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBub3dMaXN0LnB1c2godXBsb2FkZXJMaXN0W2ldKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICB1cGxvYWRlck51bTogdGhpcy5kYXRhLnVwbG9hZGVyTnVtIC0gMSxcclxuICAgICAgdXBsb2FkZXJMaXN0OiBub3dMaXN0LFxyXG4gICAgICBzaG93VXBsb2FkOiB0cnVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgLy/lsZXnpLrlm77niYdcclxuICBzaG93SW1nKGUpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHd4LnByZXZpZXdJbWFnZSh7XHJcbiAgICAgIHVybHM6IHRoYXQuZGF0YS51cGxvYWRlckxpc3QsXHJcbiAgICAgIGN1cnJlbnQ6IHRoYXQuZGF0YS51cGxvYWRlckxpc3RbZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhdXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIC8v5LiK5Lyg5Zu+54mHXHJcbiAgdXBsb2FkKGUpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIC8vY29uc29sZS5sb2coXCJ1cGxvYWQgVGVzdFwiKTtcclxuICAgIHd4LmNob29zZUltYWdlKHtcclxuICAgICAgY291bnQ6IDMgLSB0aGF0LmRhdGEudXBsb2FkZXJOdW0sIC8vIOm7mOiupDlcclxuICAgICAgc2l6ZVR5cGU6IFsnb3JpZ2luYWwnLCAnY29tcHJlc3NlZCddLCAvLyDlj6/ku6XmjIflrprmmK/ljp/lm77ov5jmmK/ljovnvKnlm77vvIzpu5jorqTkuozogIXpg73mnIlcclxuICAgICAgc291cmNlVHlwZTogWydhbGJ1bScsICdjYW1lcmEnXSwgLy8g5Y+v5Lul5oyH5a6a5p2l5rqQ5piv55u45YaM6L+Y5piv55u45py677yM6buY6K6k5LqM6ICF6YO95pyJXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoYXQuZGF0YS51cGxvYWRlck51bSk7XHJcbiAgICAgICAgLy8g6L+U5Zue6YCJ5a6a54Wn54mH55qE5pys5Zyw5paH5Lu26Lev5b6E5YiX6KGo77yMdGVtcEZpbGVQYXRo5Y+v5Lul5L2c5Li6aW1n5qCH562+55qEc3Jj5bGe5oCn5pi+56S65Zu+54mHXHJcbiAgICAgICAgbGV0IHRlbXBGaWxlUGF0aHMgPSByZXMudGVtcEZpbGVQYXRocztcclxuICAgICAgICBjb25zb2xlLmluZm8oJ3RlbXBGaWxlUGF0aHM9PScgKyBKU09OLnN0cmluZ2lmeSh0ZW1wRmlsZVBhdGhzKSlcclxuICAgICAgICBsZXQgdXBsb2FkZXJMaXN0ID0gdGhhdC5kYXRhLnVwbG9hZGVyTGlzdC5jb25jYXQodGVtcEZpbGVQYXRocyk7XHJcbiAgICAgICAgaWYgKHVwbG9hZGVyTGlzdC5sZW5ndGggPT0gMykge1xyXG4gICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgc2hvd1VwbG9hZDogZmFsc2VcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgICB1cGxvYWRlckxpc3Q6IHVwbG9hZGVyTGlzdCxcclxuICAgICAgICAgIHVwbG9hZGVyTnVtOiB1cGxvYWRlckxpc3QubGVuZ3RoLFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBkYXRlRm9ybWF0Rm9yWVlNTUREKGRhdGUpIHtcclxuICAgIGxldCBkYXRlVGVtcCA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgbGV0IHllYXIgPSBkYXRlVGVtcC5nZXRGdWxsWWVhcigpO1xyXG4gICAgbGV0IG1vbnRoID0gZGF0ZVRlbXAuZ2V0TW9udGgoKSArIDE7XHJcbiAgICBsZXQgZGF5ID0gZGF0ZVRlbXAuZ2V0RGF0ZSgpO1xyXG4gICAgbGV0IGhvdXIgPSBkYXRlVGVtcC5nZXRIb3VycygpO1xyXG4gICAgbGV0IG1pbnV0ZSA9IGRhdGVUZW1wLmdldE1pbnV0ZXMoKTtcclxuICAgIGxldCBkYXlUZW1wID0geWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRheTtcclxuICAgIHJldHVybiBkYXlUZW1wO1xyXG4gIH0sXHJcbiAgaW5pdEZpbGUoKSB7XHJcbiAgICBjb25zb2xlLmluZm8oXCIxMTExXCIpO1xyXG4gICAgdmFyIG5vd0xpc3QgPSBbXTtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB2YXIgRmlsZVN5c3RlbU1hbmFnZXIgPSB3eC5nZXRGaWxlU3lzdGVtTWFuYWdlcigpO1xyXG4gICAgX3RoaXMuZGF0YS51cGxvYWRlckxpc3QuZm9yRWFjaChmdW5jdGlvbiAobywgaSkge1xyXG4gICAgICBjb25zb2xlLmluZm8oXCIyMjJcIik7XHJcbiAgICAgIHZhciBiYXNlbGliID0gRmlsZVN5c3RlbU1hbmFnZXIucmVhZEZpbGVTeW5jKF90aGlzLmRhdGEudXBsb2FkZXJMaXN0W2ldLCAnYmFzZTY0Jyk7XHJcbiAgICAgIHZhciBpbWFnZVBhdGhUZW1wID0gX3RoaXMuZGF0YS51cGxvYWRlckxpc3RbaV0uc3BsaXQoJy4nKTtcclxuICAgICAgdmFyIGltYWdlVHlwZSA9IGltYWdlUGF0aFRlbXBbaW1hZ2VQYXRoVGVtcC5sZW5ndGggLSAxXTtcclxuICAgICAgdmFyIG9iaiA9IHsgZGF0YTogYmFzZWxpYiwgaW1hZ2VUeXBlOiBpbWFnZVR5cGUgfTtcclxuICAgICAgbm93TGlzdC5wdXNoKG9iaik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgaGtnbDAwNEZpbGVzOiBub3dMaXN0XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgZm9ybVN1Ym1pdChlKSB7XHJcbiAgICBsZXQgY2FuU3VibWl0ID0gdHJ1ZVxyXG4gICAgbGV0IGVycm1zZyA9ICcnXHJcbiAgICB0aGlzLmluaXRGaWxlKCk7XHJcbiAgICBpZiAoIWFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9ICfotKblj7fmnKrmjojmnYNcXHJcXG4nXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5lbXBsb3llZUlkIHx8IHRoaXMuZGF0YS5lbXBsb3llZUlkID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+35aGr5YaZ55Sz6K+35Lq65ZGYXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmRhdGEuZGVwdElkIHx8IHRoaXMuZGF0YS5kZXB0SWQgPT0gJycpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ55Sz6K+36YOo6ZeoXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLnJlYXNvbiB8fCB0aGlzLmRhdGEucmVhc29uID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSBcIuivt+Whq+WGmeivt+WBh+WOn+WboFxcclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5kYXRhLmZvcm1LaW5kPT0nMycgfHwgdGhpcy5kYXRhLmZvcm1LaW5kPT0nMTAnICkge1xyXG4gICAgICBpZih0aGlzLmRhdGEuc2FtZURhdGU9PW51bGwgfHwgdGhpcy5kYXRhLnNhbWVEYXRlPT0nJyl7XHJcbiAgICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgICBlcnJtc2cgKz0gXCLor7floavlhpnlkIzlgYfliKvpppbmrKHor7flgYfml6XmnJ9cXHJcXG5cIlxyXG4gICAgICB9XHJcbiAgICAgIGlmKHRoaXMuZGF0YS5zYW1lRGF5cz09MCApe1xyXG4gICAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ5ZCM5YGH5Yir57Sv6K6h5aSp5pWwXFxyXFxuXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IHQgPSB0aGlzLmRhdGEubGVhdmVEYXkgKyB0aGlzLmRhdGEubGVhdmVIb3VyICsgdGhpcy5kYXRhLmxlYXZlTWludXRlXHJcbiAgICBpZiAodCA8IDEpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ6K+35YGH5pe26Ze0XFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmIChjYW5TdWJtaXQpIHtcclxuICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ1NlbmRpbmcnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgIC8vdXJsOiAgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODQ4MC9IYW5iZWxsLUpSUy9hcGkvZWZncC9oa2dsMDA0L3dlY2hhdD8nICsgYXBwLmdsb2JhbERhdGEucmVzdEF1dGgsXHJcbiAgICAgICAgICAgICAgdXJsOiBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkKyAnL0hhbmJlbGwtSlJTL2FwaS9lZmdwL2hrZ2wwMDQvd2VjaGF0PycgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aCxcclxuICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBlbXBsb3llZTogX3RoaXMuZGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICAgICAgZm9ybVR5cGU6IF90aGlzLmRhdGEuZm9ybVR5cGUsXHJcbiAgICAgICAgICAgICAgICBmb3JtVHlwZURlc2M6IF90aGlzLmRhdGEuZm9ybVR5cGVEZXNjLFxyXG4gICAgICAgICAgICAgICAgZm9ybUtpbmQ6IF90aGlzLmRhdGEuZm9ybUtpbmQsXHJcbiAgICAgICAgICAgICAgICBmb3JtS2luZERlc2M6IF90aGlzLmRhdGEuZm9ybUtpbmREZXNjLFxyXG4gICAgICAgICAgICAgICAgd29ya1R5cGU6IF90aGlzLmRhdGEud29ya1R5cGUsXHJcbiAgICAgICAgICAgICAgICB3b3JrVHlwZURlc2M6IF90aGlzLmRhdGEud29ya1R5cGVEZXNjLFxyXG4gICAgICAgICAgICAgICAgZGF0ZTE6IF90aGlzLmRhdGEuZGF0ZTEsXHJcbiAgICAgICAgICAgICAgICB0aW1lMTogX3RoaXMuZGF0YS50aW1lMSxcclxuICAgICAgICAgICAgICAgIGRhdGUyOiBfdGhpcy5kYXRhLmRhdGUyLFxyXG4gICAgICAgICAgICAgICAgdGltZTI6IF90aGlzLmRhdGEudGltZTIsXHJcbiAgICAgICAgICAgICAgICBzYW1lRGF0ZTogX3RoaXMuZGF0YS5zYW1lRGF0ZSxcclxuICAgICAgICAgICAgICAgIHNhbWVEYXlzOiBfdGhpcy5kYXRhLnNhbWVEYXlzLFxyXG4gICAgICAgICAgICAgICAgbGVhdmVEYXk6IF90aGlzLmRhdGEubGVhdmVEYXksXHJcbiAgICAgICAgICAgICAgICBsZWF2ZUhvdXI6IF90aGlzLmRhdGEubGVhdmVIb3VyLFxyXG4gICAgICAgICAgICAgICAgbGVhdmVNaW51dGU6IF90aGlzLmRhdGEubGVhdmVNaW51dGUsXHJcbiAgICAgICAgICAgICAgICByZWFzb246IF90aGlzLmRhdGEucmVhc29uLFxyXG4gICAgICAgICAgICAgICAgb3ZlcmR1ZTpfdGhpcy5kYXRhLmlzT3ZlcmR1ZSA/IFwiWVwiOlwiTlwiLFxyXG4gICAgICAgICAgICAgICAgaGtnbDAwNEZpbGVzOiBfdGhpcy5kYXRhLmhrZ2wwMDRGaWxlc1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLmRhdGEpXHJcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+a2iOaBrycsXHJcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLm1zZyxcclxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvcGFnZXMvaW5kZXgvaW5kZXhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi6K+36IGU57O7566h55CG5ZGYOlwiICsgZmFpbCxcclxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6IGVycm1zZyxcclxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZm9ybVJlc2V0KCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2Zvcm3lj5HnlJ/kuoZyZXNldOS6i+S7ticpO1xyXG4gIH1cclxufSlcclxuIl19