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
        date1: d.toISOString().substring(0, 10),
        date2: d.toISOString().substring(0, 10),
        time1: "08:00",
        time2: "17:10",
        formType: '1',
        formTypeDesc: '普通工作日',
        formKind: '2',
        formKindDesc: '2-事假',
        workType: '1',
        workTypeDesc: '1-常日班 8:00-17:10',
        leaveDay: 1,
        leaveHour: 0,
        leaveMinute: 0,
        reason: ''
    },
    onLoad: function () {
        wx.showLoading({
            title: 'Loading',
        });
        setTimeout(function () {
            wx.hideLoading();
        }, 2000);
        if (app.globalData.openId) {
            this.setData({
                hasOpenId: true
            });
        }
        if (app.globalData.authorized) {
            this.setData({
                employeeId: app.globalData.employeeId,
                employeeName: app.globalData.employeeName
            });
        }
        if (app.globalData.defaultDeptId) {
            this.setData({
                deptId: app.globalData.defaultDeptId,
                deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName
            });
        }
    },
    bindDeptSelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
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
        if (e.detail.value) {
            this.setData({
                formType: '2',
                formTypeDesc: '法定节假假日前后'
            });
        }
        else {
            this.setData({
                formType: '1',
                formTypeDesc: '普通工作日'
            });
        }
    },
    bindLeaveKindSelect: function (e) {
        var that = this;
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
            url: '../workTypeSelect/workTypeSelect',
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
    bindDate1Change: function (e) {
        this.setData({
            date1: e.detail.value,
            date2: e.detail.value
        });
    },
    bindTime1Change: function (e) {
        this.setData({
            time1: e.detail.value
        });
    },
    bindDate2Change: function (e) {
        this.setData({
            date2: e.detail.value
        });
    },
    bindTime2Change: function (e) {
        this.setData({
            time2: e.detail.value
        });
    },
    bindLeaveDayChange: function (e) {
        this.setData({
            leaveDay: e.detail.value
        });
    },
    bindLeaveHourChange: function (e) {
        this.setData({
            leaveHour: e.detail.value
        });
    },
    bindLeaveMinuteChange: function (e) {
        this.setData({
            leaveMinute: e.detail.value
        });
    },
    bindReasonChange: function (e) {
        console.log(e);
        this.setData({
            reason: e.detail.value
        });
    },
    formSubmit: function (e) {
        var canSubmit = true;
        var errmsg = '';
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
        var t = this.data.leaveDay + this.data.leaveHour + this.data.leaveMinute;
        if (t < 1) {
            canSubmit = false;
            errmsg += "请填写请假时间\r\n";
        }
        if (canSubmit) {
            var _this_1 = this;
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
                                employee: _this_1.data.employeeId,
                                formType: _this_1.data.formType,
                                formTypeDesc: _this_1.data.formTypeDesc,
                                formKind: _this_1.data.formKind,
                                formKindDesc: _this_1.data.formKindDesc,
                                workType: _this_1.data.workType,
                                workTypeDesc: _this_1.data.workTypeDesc,
                                date1: _this_1.data.date1,
                                time1: _this_1.data.time1,
                                date2: _this_1.data.date2,
                                time2: _this_1.data.time2,
                                leaveDay: _this_1.data.leaveDay,
                                leaveHour: _this_1.data.leaveHour,
                                leaveMinute: _this_1.data.leaveMinute,
                                reason: _this_1.data.reason
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
                                console.log(fail);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsZWF2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7QUFDbEIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLEVBQVM7UUFDbkIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkMsS0FBSyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN2QyxLQUFLLEVBQUUsT0FBTztRQUNkLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLEdBQUc7UUFDYixZQUFZLEVBQUUsT0FBTztRQUNyQixRQUFRLEVBQUUsR0FBRztRQUNiLFlBQVksRUFBRSxNQUFNO1FBQ3BCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsWUFBWSxFQUFFLGtCQUFrQjtRQUNoQyxRQUFRLEVBQUUsQ0FBVztRQUNyQixTQUFTLEVBQUUsQ0FBVztRQUN0QixXQUFXLEVBQUUsQ0FBVztRQUN4QixNQUFNLEVBQUUsRUFBRTtLQUNYO0lBQ0QsTUFBTTtRQUNKLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDYixLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDLENBQUE7UUFDRixVQUFVLENBQUM7WUFDVCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ1IsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLE1B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VUFBVSxFQUFFLEtBQUs7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0lBQ0QsU0FBUztJQUVULENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL2xlYXZlLnRzXHJcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IGQgPSBuZXcgRGF0ZSgpXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIGRhdGFMaXN0OiBbXSBhcyBhbnksXHJcbiAgICBoYXNPcGVuSWQ6IGZhbHNlLFxyXG4gICAgZW1wbG95ZWVJZDogbnVsbCxcclxuICAgIGVtcGxveWVlTmFtZTogbnVsbCxcclxuICAgIGRlcHRJZDogbnVsbCxcclxuICAgIGRlcHROYW1lOiBudWxsLFxyXG4gICAgZGF0ZTE6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxyXG4gICAgZGF0ZTI6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxyXG4gICAgdGltZTE6IFwiMDg6MDBcIixcclxuICAgIHRpbWUyOiBcIjE3OjEwXCIsXHJcbiAgICBmb3JtVHlwZTogJzEnLFxyXG4gICAgZm9ybVR5cGVEZXNjOiAn5pmu6YCa5bel5L2c5pelJyxcclxuICAgIGZvcm1LaW5kOiAnMicsXHJcbiAgICBmb3JtS2luZERlc2M6ICcyLeS6i+WBhycsXHJcbiAgICB3b3JrVHlwZTogJzEnLFxyXG4gICAgd29ya1R5cGVEZXNjOiAnMS3luLjml6Xnj60gODowMC0xNzoxMCcsXHJcbiAgICBsZWF2ZURheTogMSBhcyBudW1iZXIsXHJcbiAgICBsZWF2ZUhvdXI6IDAgYXMgbnVtYmVyLFxyXG4gICAgbGVhdmVNaW51dGU6IDAgYXMgbnVtYmVyLFxyXG4gICAgcmVhc29uOiAnJ1xyXG4gIH0sXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICB0aXRsZTogJ0xvYWRpbmcnLFxyXG4gICAgfSlcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICB9LCAyMDAwKVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLm9wZW5JZCkge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBoYXNPcGVuSWQ6IHRydWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGVtcGxveWVlSWQ6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgICAgZW1wbG95ZWVOYW1lOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZU5hbWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGRlcHRJZDogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCxcclxuICAgICAgICBkZXB0TmFtZTogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCArICctJyArIGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmluZERlcHRTZWxlY3QoZSkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vZGVwdFNlbGVjdC9kZXB0U2VsZWN0P2VtcGxveWVlaWQ9JyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybkRlcHRTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XHJcbiAgICAgICAgICAgICAgZGVwdElkOiByZXMuayxcclxuICAgICAgICAgICAgICBkZXB0TmFtZTogcmVzLmsgKyAnLScgKyByZXMudlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRm9ybVR5cGVDaGFuZ2UoZSkge1xyXG4gICAgaWYgKGUuZGV0YWlsLnZhbHVlKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGZvcm1UeXBlOiAnMicsXHJcbiAgICAgICAgZm9ybVR5cGVEZXNjOiAn5rOV5a6a6IqC5YGH5YGH5pel5YmN5ZCOJ1xyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgZm9ybVR5cGU6ICcxJyxcclxuICAgICAgICBmb3JtVHlwZURlc2M6ICfmma7pgJrlt6XkvZzml6UnXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBiaW5kTGVhdmVLaW5kU2VsZWN0KGUpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4vbGVhdmVLaW5kU2VsZWN0JyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuTGVhdmVLaW5kU2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIGZvcm1LaW5kOiByZXMuayxcclxuICAgICAgICAgICAgICBmb3JtS2luZERlc2M6IHJlcy5rICsgJy0nICsgcmVzLnZcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFdvcmtUeXBlU2VsZWN0KGUpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4uL3dvcmtUeXBlU2VsZWN0L3dvcmtUeXBlU2VsZWN0JyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuV29ya1R5cGVTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XHJcbiAgICAgICAgICAgICAgd29ya1R5cGU6IHJlcy5rLFxyXG4gICAgICAgICAgICAgIHdvcmtUeXBlRGVzYzogcmVzLmsgKyAnLScgKyByZXMudlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRGF0ZTFDaGFuZ2UoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIGRhdGUxOiBlLmRldGFpbC52YWx1ZSxcclxuICAgICAgZGF0ZTI6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFRpbWUxQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICB0aW1lMTogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRGF0ZTJDaGFuZ2UoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIGRhdGUyOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRUaW1lMkNoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgdGltZTI6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZExlYXZlRGF5Q2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBsZWF2ZURheTogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kTGVhdmVIb3VyQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBsZWF2ZUhvdXI6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZExlYXZlTWludXRlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBsZWF2ZU1pbnV0ZTogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kUmVhc29uQ2hhbmdlKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgcmVhc29uOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGZvcm1TdWJtaXQoZSkge1xyXG4gICAgbGV0IGNhblN1Ym1pdCA9IHRydWVcclxuICAgIGxldCBlcnJtc2cgPSAnJ1xyXG4gICAgaWYgKCFhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6LSm5Y+35pyq5o6I5p2DXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmRhdGEuZW1wbG95ZWVJZCB8fCB0aGlzLmRhdGEuZW1wbG95ZWVJZCA9PSAnJykge1xyXG4gICAgICBjYW5TdWJtaXQgPSBmYWxzZVxyXG4gICAgICBlcnJtc2cgKz0gJ+ivt+Whq+WGmeeUs+ivt+S6uuWRmFxcclxcbidcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLmRlcHRJZCB8fCB0aGlzLmRhdGEuZGVwdElkID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSBcIuivt+Whq+WGmeeUs+ivt+mDqOmXqFxcclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5yZWFzb24gfHwgdGhpcy5kYXRhLnJlYXNvbiA9PSAnJykge1xyXG4gICAgICBjYW5TdWJtaXQgPSBmYWxzZVxyXG4gICAgICBlcnJtc2cgKz0gXCLor7floavlhpnor7flgYfljp/lm6BcXHJcXG5cIlxyXG4gICAgfVxyXG4gICAgbGV0IHQgPSB0aGlzLmRhdGEubGVhdmVEYXkgKyB0aGlzLmRhdGEubGVhdmVIb3VyICsgdGhpcy5kYXRhLmxlYXZlTWludXRlXHJcbiAgICBpZiAodCA8IDEpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ6K+35YGH5pe26Ze0XFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmIChjYW5TdWJtaXQpIHtcclxuICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ1NlbmRpbmcnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2VmZ3AvaGtnbDAwNC93ZWNoYXQ/JyArIGFwcC5nbG9iYWxEYXRhLnJlc3RBdXRoLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGVtcGxveWVlOiBfdGhpcy5kYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgICAgICAgICAgICBmb3JtVHlwZTogX3RoaXMuZGF0YS5mb3JtVHlwZSxcclxuICAgICAgICAgICAgICAgIGZvcm1UeXBlRGVzYzogX3RoaXMuZGF0YS5mb3JtVHlwZURlc2MsXHJcbiAgICAgICAgICAgICAgICBmb3JtS2luZDogX3RoaXMuZGF0YS5mb3JtS2luZCxcclxuICAgICAgICAgICAgICAgIGZvcm1LaW5kRGVzYzogX3RoaXMuZGF0YS5mb3JtS2luZERlc2MsXHJcbiAgICAgICAgICAgICAgICB3b3JrVHlwZTogX3RoaXMuZGF0YS53b3JrVHlwZSxcclxuICAgICAgICAgICAgICAgIHdvcmtUeXBlRGVzYzogX3RoaXMuZGF0YS53b3JrVHlwZURlc2MsXHJcbiAgICAgICAgICAgICAgICBkYXRlMTogX3RoaXMuZGF0YS5kYXRlMSxcclxuICAgICAgICAgICAgICAgIHRpbWUxOiBfdGhpcy5kYXRhLnRpbWUxLFxyXG4gICAgICAgICAgICAgICAgZGF0ZTI6IF90aGlzLmRhdGEuZGF0ZTIsXHJcbiAgICAgICAgICAgICAgICB0aW1lMjogX3RoaXMuZGF0YS50aW1lMixcclxuICAgICAgICAgICAgICAgIGxlYXZlRGF5OiBfdGhpcy5kYXRhLmxlYXZlRGF5LFxyXG4gICAgICAgICAgICAgICAgbGVhdmVIb3VyOiBfdGhpcy5kYXRhLmxlYXZlSG91cixcclxuICAgICAgICAgICAgICAgIGxlYXZlTWludXRlOiBfdGhpcy5kYXRhLmxlYXZlTWludXRlLFxyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBfdGhpcy5kYXRhLnJlYXNvblxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiByZXMuZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3BhZ2VzL2luZGV4L2luZGV4XCJcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBlcnJtc2csXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGZvcm1SZXNldCgpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ2Zvcm3lj5HnlJ/kuoZyZXNldOS6i+S7ticpO1xyXG4gIH1cclxufSlcclxuIl19