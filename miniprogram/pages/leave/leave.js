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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsZWF2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7QUFDbEIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLEVBQVM7UUFDbkIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLEtBQUssRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkMsS0FBSyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN2QyxLQUFLLEVBQUUsT0FBTztRQUNkLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLEdBQUc7UUFDYixZQUFZLEVBQUUsT0FBTztRQUNyQixRQUFRLEVBQUUsR0FBRztRQUNiLFlBQVksRUFBRSxNQUFNO1FBQ3BCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsWUFBWSxFQUFFLGtCQUFrQjtRQUNoQyxRQUFRLEVBQUUsQ0FBVztRQUNyQixTQUFTLEVBQUUsQ0FBVztRQUN0QixXQUFXLEVBQUUsQ0FBVztRQUN4QixNQUFNLEVBQUUsRUFBRTtLQUNYO0lBQ0QsTUFBTTtRQUNKLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDYixLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDLENBQUE7UUFDRixVQUFVLENBQUM7WUFDVCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ1IsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLE1B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VUFBVSxFQUFFLEtBQUs7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0lBQ0QsU0FBUztJQUVULENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL2xlYXZlLnRzXG5pbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXG5cbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcbmxldCBkID0gbmV3IERhdGUoKVxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICBkYXRhTGlzdDogW10gYXMgYW55LFxuICAgIGhhc09wZW5JZDogZmFsc2UsXG4gICAgZW1wbG95ZWVJZDogbnVsbCxcbiAgICBlbXBsb3llZU5hbWU6IG51bGwsXG4gICAgZGVwdElkOiBudWxsLFxuICAgIGRlcHROYW1lOiBudWxsLFxuICAgIGRhdGUxOiBkLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKSxcbiAgICBkYXRlMjogZC50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCksXG4gICAgdGltZTE6IFwiMDg6MDBcIixcbiAgICB0aW1lMjogXCIxNzoxMFwiLFxuICAgIGZvcm1UeXBlOiAnMScsXG4gICAgZm9ybVR5cGVEZXNjOiAn5pmu6YCa5bel5L2c5pelJyxcbiAgICBmb3JtS2luZDogJzInLFxuICAgIGZvcm1LaW5kRGVzYzogJzIt5LqL5YGHJyxcbiAgICB3b3JrVHlwZTogJzEnLFxuICAgIHdvcmtUeXBlRGVzYzogJzEt5bi45pel54+tIDg6MDAtMTc6MTAnLFxuICAgIGxlYXZlRGF5OiAxIGFzIG51bWJlcixcbiAgICBsZWF2ZUhvdXI6IDAgYXMgbnVtYmVyLFxuICAgIGxlYXZlTWludXRlOiAwIGFzIG51bWJlcixcbiAgICByZWFzb246ICcnXG4gIH0sXG4gIG9uTG9hZCgpIHtcbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICB0aXRsZTogJ0xvYWRpbmcnLFxuICAgIH0pXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgfSwgMjAwMClcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEub3BlbklkKSB7XG4gICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgaGFzT3BlbklkOiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoYXBwLmdsb2JhbERhdGEuYXV0aG9yaXplZCkge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGVtcGxveWVlSWQ6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXG4gICAgICAgIGVtcGxveWVlTmFtZTogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVOYW1lXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCkge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGRlcHRJZDogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCxcbiAgICAgICAgZGVwdE5hbWU6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQgKyAnLScgKyBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdE5hbWVcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuICBiaW5kRGVwdFNlbGVjdChlKSB7XG4gICAgbGV0IHRoYXQgPSB0aGlzXG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcuLi9kZXB0U2VsZWN0L2RlcHRTZWxlY3Q/ZW1wbG95ZWVpZD0nICsgYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICByZXR1cm5EZXB0U2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgIGRlcHRJZDogcmVzLmssXG4gICAgICAgICAgICAgIGRlcHROYW1lOiByZXMuayArICctJyArIHJlcy52XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kRm9ybVR5cGVDaGFuZ2UoZSkge1xuICAgIGlmIChlLmRldGFpbC52YWx1ZSkge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGZvcm1UeXBlOiAnMicsXG4gICAgICAgIGZvcm1UeXBlRGVzYzogJ+azleWumuiKguWBh+WBh+aXpeWJjeWQjidcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICBmb3JtVHlwZTogJzEnLFxuICAgICAgICBmb3JtVHlwZURlc2M6ICfmma7pgJrlt6XkvZzml6UnXG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgYmluZExlYXZlS2luZFNlbGVjdChlKSB7XG4gICAgbGV0IHRoYXQgPSB0aGlzXG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcuL2xlYXZlS2luZFNlbGVjdCcsXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgcmV0dXJuTGVhdmVLaW5kU2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgIGZvcm1LaW5kOiByZXMuayxcbiAgICAgICAgICAgICAgZm9ybUtpbmREZXNjOiByZXMuayArICctJyArIHJlcy52XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kV29ya1R5cGVTZWxlY3QoZSkge1xuICAgIGxldCB0aGF0ID0gdGhpc1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnLi4vd29ya1R5cGVTZWxlY3Qvd29ya1R5cGVTZWxlY3QnLFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIHJldHVybldvcmtUeXBlU2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XG4gICAgICAgICAgICAgIHdvcmtUeXBlOiByZXMuayxcbiAgICAgICAgICAgICAgd29ya1R5cGVEZXNjOiByZXMuayArICctJyArIHJlcy52XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kRGF0ZTFDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgZGF0ZTE6IGUuZGV0YWlsLnZhbHVlLFxuICAgICAgZGF0ZTI6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZFRpbWUxQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIHRpbWUxOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmREYXRlMkNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBkYXRlMjogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kVGltZTJDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgdGltZTI6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZExlYXZlRGF5Q2hhbmdlKGUpIHtcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIGxlYXZlRGF5OiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmRMZWF2ZUhvdXJDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgbGVhdmVIb3VyOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmRMZWF2ZU1pbnV0ZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBsZWF2ZU1pbnV0ZTogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kUmVhc29uQ2hhbmdlKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgcmVhc29uOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGZvcm1TdWJtaXQoZSkge1xuICAgIGxldCBjYW5TdWJtaXQgPSB0cnVlXG4gICAgbGV0IGVycm1zZyA9ICcnXG4gICAgaWYgKCFhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XG4gICAgICBjYW5TdWJtaXQgPSBmYWxzZVxuICAgICAgZXJybXNnICs9ICfotKblj7fmnKrmjojmnYNcXHJcXG4nXG4gICAgfVxuICAgIGlmICghdGhpcy5kYXRhLmVtcGxveWVlSWQgfHwgdGhpcy5kYXRhLmVtcGxveWVlSWQgPT0gJycpIHtcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXG4gICAgICBlcnJtc2cgKz0gJ+ivt+Whq+WGmeeUs+ivt+S6uuWRmFxcclxcbidcbiAgICB9XG4gICAgaWYgKCF0aGlzLmRhdGEuZGVwdElkIHx8IHRoaXMuZGF0YS5kZXB0SWQgPT0gJycpIHtcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXG4gICAgICBlcnJtc2cgKz0gXCLor7floavlhpnnlLPor7fpg6jpl6hcXHJcXG5cIlxuICAgIH1cbiAgICBpZiAoIXRoaXMuZGF0YS5yZWFzb24gfHwgdGhpcy5kYXRhLnJlYXNvbiA9PSAnJykge1xuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcbiAgICAgIGVycm1zZyArPSBcIuivt+Whq+WGmeivt+WBh+WOn+WboFxcclxcblwiXG4gICAgfVxuICAgIGxldCB0ID0gdGhpcy5kYXRhLmxlYXZlRGF5ICsgdGhpcy5kYXRhLmxlYXZlSG91ciArIHRoaXMuZGF0YS5sZWF2ZU1pbnV0ZVxuICAgIGlmICh0IDwgMSkge1xuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcbiAgICAgIGVycm1zZyArPSBcIuivt+Whq+WGmeivt+WBh+aXtumXtFxcclxcblwiXG4gICAgfVxuICAgIGlmIChjYW5TdWJtaXQpIHtcbiAgICAgIGxldCBfdGhpcyA9IHRoaXNcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcbiAgICAgICAgY29udGVudDogJ+ehruWumuaPkOS6pOWQlycsXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XG4gICAgICAgICAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICAgICAgICAgIHRpdGxlOiAnU2VuZGluZydcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgICAgICAgdXJsOiBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvZWZncC9oa2dsMDA0L3dlY2hhdD8nICsgYXBwLmdsb2JhbERhdGEucmVzdEF1dGgsXG4gICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBlbXBsb3llZTogX3RoaXMuZGF0YS5lbXBsb3llZUlkLFxuICAgICAgICAgICAgICAgIGZvcm1UeXBlOiBfdGhpcy5kYXRhLmZvcm1UeXBlLFxuICAgICAgICAgICAgICAgIGZvcm1UeXBlRGVzYzogX3RoaXMuZGF0YS5mb3JtVHlwZURlc2MsXG4gICAgICAgICAgICAgICAgZm9ybUtpbmQ6IF90aGlzLmRhdGEuZm9ybUtpbmQsXG4gICAgICAgICAgICAgICAgZm9ybUtpbmREZXNjOiBfdGhpcy5kYXRhLmZvcm1LaW5kRGVzYyxcbiAgICAgICAgICAgICAgICB3b3JrVHlwZTogX3RoaXMuZGF0YS53b3JrVHlwZSxcbiAgICAgICAgICAgICAgICB3b3JrVHlwZURlc2M6IF90aGlzLmRhdGEud29ya1R5cGVEZXNjLFxuICAgICAgICAgICAgICAgIGRhdGUxOiBfdGhpcy5kYXRhLmRhdGUxLFxuICAgICAgICAgICAgICAgIHRpbWUxOiBfdGhpcy5kYXRhLnRpbWUxLFxuICAgICAgICAgICAgICAgIGRhdGUyOiBfdGhpcy5kYXRhLmRhdGUyLFxuICAgICAgICAgICAgICAgIHRpbWUyOiBfdGhpcy5kYXRhLnRpbWUyLFxuICAgICAgICAgICAgICAgIGxlYXZlRGF5OiBfdGhpcy5kYXRhLmxlYXZlRGF5LFxuICAgICAgICAgICAgICAgIGxlYXZlSG91cjogX3RoaXMuZGF0YS5sZWF2ZUhvdXIsXG4gICAgICAgICAgICAgICAgbGVhdmVNaW51dGU6IF90aGlzLmRhdGEubGVhdmVNaW51dGUsXG4gICAgICAgICAgICAgICAgcmVhc29uOiBfdGhpcy5kYXRhLnJlYXNvblxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxuICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzLmRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xuICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvcGFnZXMvaW5kZXgvaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxuICAgICAgICBjb250ZW50OiBlcnJtc2csXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgZm9ybVJlc2V0KCkge1xuICAgIC8vY29uc29sZS5sb2coJ2Zvcm3lj5HnlJ/kuoZyZXNldOS6i+S7ticpO1xuICB9XG59KVxuIl19