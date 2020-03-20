"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../utils/util");
var app = getApp();
var eventChannel;
var d = new Date();
Page({
    data: {
        deptId: null,
        deptName: null,
        id: -1,
        name: '',
        description: '',
        leaderId: null,
        leader: null,
        plannedStartDate: d.toISOString().substring(0, 10),
        plannedStartTime: util_1.formatTime(d.toISOString()).substring(0, 5),
        plannedFinishDate: d.toISOString().substring(0, 10),
        plannedFinishTime: util_1.formatTime(d.toISOString()).substring(0, 5),
        actualStartDate: '',
        actualStartTime: '',
        actualFinishDate: '',
        actualFinishTime: '',
        location: '',
        isNew: false,
        canDelete: false,
        nowDate: d.toISOString().substring(0, 10),
        nowTime: util_1.formatTime(d.toISOString()).substring(0, 5)
    },
    onLoad: function () {
        var _this_1 = this;
        wx.showLoading({
            title: '加载中',
        });
        setTimeout(function () {
            wx.hideLoading();
        }, 2000);
        eventChannel = this.getOpenerEventChannel();
        eventChannel.on('openDetail', function (res) {
            if (res.isNew) {
                _this_1.setData({
                    deptId: res.data.deptId,
                    deptName: res.data.deptName,
                    leaderId: res.data.leaderId,
                    leader: res.data.leader,
                    isNew: res.isNew
                });
            }
            else {
                _this_1.setData({
                    deptId: res.data.deptId,
                    deptName: res.data.deptName,
                    id: res.data.id,
                    name: res.data.name,
                    description: res.data.description,
                    leaderId: res.data.leaderId,
                    leader: res.data.leader,
                    plannedStartDate: res.data.plannedStartDate,
                    plannedStartTime: res.data.plannedStartTime,
                    plannedFinishDate: res.data.plannedFinishDate,
                    plannedFinishTime: res.data.plannedFinishTime,
                    actualStartDate: res.data.actualStartDate,
                    actualStartTime: res.data.actualStartTime,
                    actualFinishDate: res.data.actualFinishDate,
                    actualFinishTime: res.data.actualFinishTime,
                    location: res.data.location == undefined ? '' : res.data.location,
                    isNew: res.isNew,
                    canDelete: res.data.status == 'V' ? false : true
                });
            }
        });
    },
    bindDeptSelect: function (e) {
        var _this = this;
        wx.navigateTo({
            url: '../deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
            events: {
                returnDeptSelect: function (res) {
                    if (res) {
                        _this.setData({
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
    bindNameChange: function (e) {
        this.setData({
            name: e.detail.value
        });
    },
    bindPlannedStartDateChange: function (e) {
        this.setData({
            plannedStartDate: e.detail.value
        });
    },
    bindPlannedStartTimeChange: function (e) {
        this.setData({
            plannedStartTime: e.detail.value
        });
    },
    bindPlannedFinishDateChange: function (e) {
        this.setData({
            plannedFinishDate: e.detail.value
        });
    },
    bindPlannedFinishTimeChange: function (e) {
        this.setData({
            plannedFinishTime: e.detail.value
        });
    },
    bindActualStartDateChange: function (e) {
        this.setData({
            actualStartDate: e.detail.value
        });
    },
    bindActualStartTimeChange: function (e) {
        this.setData({
            actualStartTime: e.detail.value
        });
    },
    bindActualFinishDateChange: function (e) {
        this.setData({
            actualFinishDate: e.detail.value
        });
    },
    bindActualFinishTimeChange: function (e) {
        this.setData({
            actualFinishTime: e.detail.value
        });
    },
    bindContentChange: function (e) {
        this.setData({
            description: e.detail.value
        });
    },
    formSubmit: function (e) {
        var canSubmit = true;
        var errmsg = '';
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
                        if (_this_2.data.isNew) {
                            var currentObject_1 = {
                                name: _this_2.data.name,
                                description: _this_2.data.description,
                                leaderId: _this_2.data.leaderId,
                                leader: _this_2.data.leader,
                                plannedStartDate: _this_2.data.plannedStartDate,
                                plannedStartTime: _this_2.data.plannedStartTime,
                                plannedFinishDate: _this_2.data.plannedFinishDate,
                                plannedFinishTime: _this_2.data.plannedFinishTime,
                                actualStartDate: '',
                                actualStartTime: '',
                                actualFinishDate: '',
                                actualFinishTime: '',
                                status: 'N'
                            };
                            var url = app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/jobtask?openid=' + app.globalData.openId + '&sessionkey=' + app.globalData.sessionKey;
                            wx.request({
                                url: url,
                                data: currentObject_1,
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
                                            eventChannel = _this_2.getOpenerEventChannel();
                                            eventChannel.emit('returnDetail', { data: currentObject_1, isNew: _this_2.data.isNew });
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                        }
                                    });
                                },
                                fail: function (fail) {
                                    console.log(fail);
                                }
                            });
                        }
                        else {
                            var status_1 = _this_2.data.actualFinishDate != '' ? 'V' : 'N';
                            var currentObject_2 = {
                                id: _this_2.data.id,
                                name: _this_2.data.name,
                                description: _this_2.data.description,
                                leaderId: _this_2.data.leaderId,
                                leader: _this_2.data.leader,
                                plannedStartDate: _this_2.data.plannedStartDate,
                                plannedStartTime: _this_2.data.plannedStartTime,
                                plannedFinishDate: _this_2.data.plannedFinishDate,
                                plannedFinishTime: _this_2.data.plannedFinishTime,
                                actualStartDate: _this_2.data.actualStartDate,
                                actualStartTime: _this_2.data.actualStartTime,
                                actualFinishDate: _this_2.data.actualFinishDate,
                                actualFinishTime: _this_2.data.actualFinishTime,
                                location: _this_2.data.location,
                                status: status_1
                            };
                            var url = app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/jobtask/' + _this_2.data.id + '?openid=' + app.globalData.openId + '&sessionkey=' + app.globalData.sessionKey;
                            wx.request({
                                url: url,
                                data: currentObject_2,
                                header: {
                                    'content-type': 'application/json'
                                },
                                method: 'PUT',
                                success: function (res) {
                                    wx.hideLoading();
                                    wx.showModal({
                                        title: '系统消息',
                                        content: res.data.msg,
                                        showCancel: false,
                                        success: function (res) {
                                            eventChannel = _this_2.getOpenerEventChannel();
                                            eventChannel.emit('returnDetail', { data: currentObject_2, isNew: _this_2.data.isNew });
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                        }
                                    });
                                },
                                fail: function (fail) {
                                    console.log(fail);
                                }
                            });
                        }
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
    bindRemoveDetailTap: function (e) {
        if (this.data.canDelete) {
            var _this_3 = this;
            wx.showModal({
                title: '系统提示',
                content: '确定删除吗',
                success: function (res) {
                    if (res.confirm) {
                        wx.showLoading({
                            title: 'Deleting'
                        });
                        var url = app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/jobtask/' + _this_3.data.id + '?openid=' + app.globalData.openId + '&sessionkey=' + app.globalData.sessionKey;
                        wx.request({
                            url: url,
                            header: {
                                'content-type': 'application/json'
                            },
                            method: 'DELETE',
                            success: function (res) {
                                wx.hideLoading();
                                eventChannel = _this_3.getOpenerEventChannel();
                                eventChannel.emit('returnDetail', { data: {}, isNew: _this_3.data.isNew });
                                wx.navigateBack({
                                    delta: 1
                                });
                            },
                            fail: function (fail) {
                                console.log(fail);
                            }
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFza2RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhc2tkZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5Q0FBNkM7QUFFN0MsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxZQUFZLENBQUE7QUFDaEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtBQUNsQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsSUFBSTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsRUFBRSxFQUFFLENBQUMsQ0FBVztRQUNoQixJQUFJLEVBQUUsRUFBRTtRQUNSLFdBQVcsRUFBRSxFQUFFO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtRQUNaLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsRCxnQkFBZ0IsRUFBRSxpQkFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdELGlCQUFpQixFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNuRCxpQkFBaUIsRUFBRSxpQkFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlELGVBQWUsRUFBRSxFQUFFO1FBQ25CLGVBQWUsRUFBRSxFQUFFO1FBQ25CLGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixRQUFRLEVBQUUsRUFBRTtRQUNaLEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUs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TSxFQUFFO2dDQUNOLGNBQWMsRUFBRSxrQkFBa0I7NkJBQ25DOzRCQUNELE1BQU0sRUFBRSxRQUFROzRCQUNoQixPQUFPLEVBQUUsVUFBQSxHQUFHO2dDQUVWLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtnQ0FDaEIsWUFBWSxHQUFHLE9BQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO2dDQUM1QyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtnQ0FDeEUsRUFBRSxDQUFDLFlBQVksQ0FBQztvQ0FDZCxLQUFLLEVBQUUsQ0FBQztpQ0FDVCxDQUFDLENBQUE7NEJBQ0osQ0FBQzs0QkFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dDQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7NEJBQ25CLENBQUM7eUJBQ0YsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL292ZXJkZXRhaWwudHNcclxuaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xyXG5pbXBvcnQgeyBmb3JtYXRUaW1lIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IGV2ZW50Q2hhbm5lbFxyXG5sZXQgZCA9IG5ldyBEYXRlKClcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgZGVwdElkOiBudWxsLFxyXG4gICAgZGVwdE5hbWU6IG51bGwsXHJcbiAgICBpZDogLTEgYXMgbnVtYmVyLFxyXG4gICAgbmFtZTogJycsXHJcbiAgICBkZXNjcmlwdGlvbjogJycsXHJcbiAgICBsZWFkZXJJZDogbnVsbCxcclxuICAgIGxlYWRlcjogbnVsbCxcclxuICAgIHBsYW5uZWRTdGFydERhdGU6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxyXG4gICAgcGxhbm5lZFN0YXJ0VGltZTogZm9ybWF0VGltZShkLnRvSVNPU3RyaW5nKCkpLnN1YnN0cmluZygwLCA1KSxcclxuICAgIHBsYW5uZWRGaW5pc2hEYXRlOiBkLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKSxcclxuICAgIHBsYW5uZWRGaW5pc2hUaW1lOiBmb3JtYXRUaW1lKGQudG9JU09TdHJpbmcoKSkuc3Vic3RyaW5nKDAsIDUpLFxyXG4gICAgYWN0dWFsU3RhcnREYXRlOiAnJyxcclxuICAgIGFjdHVhbFN0YXJ0VGltZTogJycsXHJcbiAgICBhY3R1YWxGaW5pc2hEYXRlOiAnJyxcclxuICAgIGFjdHVhbEZpbmlzaFRpbWU6ICcnLFxyXG4gICAgbG9jYXRpb246ICcnLFxyXG4gICAgaXNOZXc6IGZhbHNlLFxyXG4gICAgY2FuRGVsZXRlOiBmYWxzZSxcclxuICAgIG5vd0RhdGU6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxyXG4gICAgbm93VGltZTogZm9ybWF0VGltZShkLnRvSVNPU3RyaW5nKCkpLnN1YnN0cmluZygwLCA1KVxyXG4gIH0sXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICB0aXRsZTogJ+WKoOi9veS4rScsXHJcbiAgICB9KVxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgIH0sIDIwMDApXHJcbiAgICBldmVudENoYW5uZWwgPSB0aGlzLmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICBldmVudENoYW5uZWwub24oJ29wZW5EZXRhaWwnLCAocmVzKSA9PiB7XHJcbiAgICAgIGlmIChyZXMuaXNOZXcpIHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGRlcHRJZDogcmVzLmRhdGEuZGVwdElkLFxyXG4gICAgICAgICAgZGVwdE5hbWU6IHJlcy5kYXRhLmRlcHROYW1lLFxyXG4gICAgICAgICAgbGVhZGVySWQ6IHJlcy5kYXRhLmxlYWRlcklkLFxyXG4gICAgICAgICAgbGVhZGVyOiByZXMuZGF0YS5sZWFkZXIsXHJcbiAgICAgICAgICBpc05ldzogcmVzLmlzTmV3XHJcbiAgICAgICAgfSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGRlcHRJZDogcmVzLmRhdGEuZGVwdElkLFxyXG4gICAgICAgICAgZGVwdE5hbWU6IHJlcy5kYXRhLmRlcHROYW1lLFxyXG4gICAgICAgICAgaWQ6IHJlcy5kYXRhLmlkLFxyXG4gICAgICAgICAgbmFtZTogcmVzLmRhdGEubmFtZSxcclxuICAgICAgICAgIGRlc2NyaXB0aW9uOiByZXMuZGF0YS5kZXNjcmlwdGlvbixcclxuICAgICAgICAgIGxlYWRlcklkOiByZXMuZGF0YS5sZWFkZXJJZCxcclxuICAgICAgICAgIGxlYWRlcjogcmVzLmRhdGEubGVhZGVyLFxyXG4gICAgICAgICAgcGxhbm5lZFN0YXJ0RGF0ZTogcmVzLmRhdGEucGxhbm5lZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgIHBsYW5uZWRTdGFydFRpbWU6IHJlcy5kYXRhLnBsYW5uZWRTdGFydFRpbWUsXHJcbiAgICAgICAgICBwbGFubmVkRmluaXNoRGF0ZTogcmVzLmRhdGEucGxhbm5lZEZpbmlzaERhdGUsXHJcbiAgICAgICAgICBwbGFubmVkRmluaXNoVGltZTogcmVzLmRhdGEucGxhbm5lZEZpbmlzaFRpbWUsXHJcbiAgICAgICAgICBhY3R1YWxTdGFydERhdGU6IHJlcy5kYXRhLmFjdHVhbFN0YXJ0RGF0ZSxcclxuICAgICAgICAgIGFjdHVhbFN0YXJ0VGltZTogcmVzLmRhdGEuYWN0dWFsU3RhcnRUaW1lLFxyXG4gICAgICAgICAgYWN0dWFsRmluaXNoRGF0ZTogcmVzLmRhdGEuYWN0dWFsRmluaXNoRGF0ZSxcclxuICAgICAgICAgIGFjdHVhbEZpbmlzaFRpbWU6IHJlcy5kYXRhLmFjdHVhbEZpbmlzaFRpbWUsXHJcbiAgICAgICAgICBsb2NhdGlvbjogcmVzLmRhdGEubG9jYXRpb24gPT0gdW5kZWZpbmVkID8gJycgOiByZXMuZGF0YS5sb2NhdGlvbixcclxuICAgICAgICAgIGlzTmV3OiByZXMuaXNOZXcsXHJcbiAgICAgICAgICBjYW5EZWxldGU6IHJlcy5kYXRhLnN0YXR1cyA9PSAnVicgPyBmYWxzZSA6IHRydWVcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZERlcHRTZWxlY3QoZSkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4uL2RlcHRTZWxlY3QvZGVwdFNlbGVjdD9lbXBsb3llZWlkPScgKyBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICBldmVudHM6IHtcclxuICAgICAgICByZXR1cm5EZXB0U2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBkZXB0SWQ6IHJlcy5rLFxyXG4gICAgICAgICAgICAgIGRlcHROYW1lOiByZXMuayArICctJyArIHJlcy52XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmROYW1lQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBuYW1lOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRQbGFubmVkU3RhcnREYXRlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBwbGFubmVkU3RhcnREYXRlOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRQbGFubmVkU3RhcnRUaW1lQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBwbGFubmVkU3RhcnRUaW1lOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRQbGFubmVkRmluaXNoRGF0ZUNoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgcGxhbm5lZEZpbmlzaERhdGU6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFBsYW5uZWRGaW5pc2hUaW1lQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBwbGFubmVkRmluaXNoVGltZTogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kQWN0dWFsU3RhcnREYXRlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBhY3R1YWxTdGFydERhdGU6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZEFjdHVhbFN0YXJ0VGltZUNoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgYWN0dWFsU3RhcnRUaW1lOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRBY3R1YWxGaW5pc2hEYXRlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBhY3R1YWxGaW5pc2hEYXRlOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRBY3R1YWxGaW5pc2hUaW1lQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBhY3R1YWxGaW5pc2hUaW1lOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRDb250ZW50Q2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBkZXNjcmlwdGlvbjogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBmb3JtU3VibWl0KGUpIHtcclxuICAgIGxldCBjYW5TdWJtaXQgPSB0cnVlXHJcbiAgICBsZXQgZXJybXNnID0gJydcclxuICAgIGlmIChjYW5TdWJtaXQpIHtcclxuICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ1NlbmRpbmcnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChfdGhpcy5kYXRhLmlzTmV3KSB7XHJcbiAgICAgICAgICAgICAgbGV0IGN1cnJlbnRPYmplY3QgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBfdGhpcy5kYXRhLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogX3RoaXMuZGF0YS5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgIGxlYWRlcklkOiBfdGhpcy5kYXRhLmxlYWRlcklkLFxyXG4gICAgICAgICAgICAgICAgbGVhZGVyOiBfdGhpcy5kYXRhLmxlYWRlcixcclxuICAgICAgICAgICAgICAgIHBsYW5uZWRTdGFydERhdGU6IF90aGlzLmRhdGEucGxhbm5lZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgIHBsYW5uZWRTdGFydFRpbWU6IF90aGlzLmRhdGEucGxhbm5lZFN0YXJ0VGltZSxcclxuICAgICAgICAgICAgICAgIHBsYW5uZWRGaW5pc2hEYXRlOiBfdGhpcy5kYXRhLnBsYW5uZWRGaW5pc2hEYXRlLFxyXG4gICAgICAgICAgICAgICAgcGxhbm5lZEZpbmlzaFRpbWU6IF90aGlzLmRhdGEucGxhbm5lZEZpbmlzaFRpbWUsXHJcbiAgICAgICAgICAgICAgICBhY3R1YWxTdGFydERhdGU6ICcnLFxyXG4gICAgICAgICAgICAgICAgYWN0dWFsU3RhcnRUaW1lOiAnJyxcclxuICAgICAgICAgICAgICAgIGFjdHVhbEZpbmlzaERhdGU6ICcnLFxyXG4gICAgICAgICAgICAgICAgYWN0dWFsRmluaXNoVGltZTogJycsXHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdOJ1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAvL+WtmOWCqFxyXG4gICAgICAgICAgICAgIGxldCB1cmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLVdDTy9hcGkvcHJnOWYyNDdhYjZkNWU0L2pvYnRhc2s/b3BlbmlkPScgKyBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQgKyAnJnNlc3Npb25rZXk9JyArIGFwcC5nbG9iYWxEYXRhLnNlc3Npb25LZXk7XHJcbiAgICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGN1cnJlbnRPYmplY3QsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+a2iOaBrycsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzLmRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBldmVudENoYW5uZWwgPSBfdGhpcy5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgZXZlbnRDaGFubmVsLmVtaXQoJ3JldHVybkRldGFpbCcsIHsgZGF0YTogY3VycmVudE9iamVjdCwgaXNOZXc6IF90aGlzLmRhdGEuaXNOZXcgfSlcclxuICAgICAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxldCBzdGF0dXMgPSBfdGhpcy5kYXRhLmFjdHVhbEZpbmlzaERhdGUgIT0gJycgPyAnVicgOiAnTidcclxuICAgICAgICAgICAgICBsZXQgY3VycmVudE9iamVjdCA9IHtcclxuICAgICAgICAgICAgICAgIGlkOiBfdGhpcy5kYXRhLmlkLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogX3RoaXMuZGF0YS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IF90aGlzLmRhdGEuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICBsZWFkZXJJZDogX3RoaXMuZGF0YS5sZWFkZXJJZCxcclxuICAgICAgICAgICAgICAgIGxlYWRlcjogX3RoaXMuZGF0YS5sZWFkZXIsXHJcbiAgICAgICAgICAgICAgICBwbGFubmVkU3RhcnREYXRlOiBfdGhpcy5kYXRhLnBsYW5uZWRTdGFydERhdGUsXHJcbiAgICAgICAgICAgICAgICBwbGFubmVkU3RhcnRUaW1lOiBfdGhpcy5kYXRhLnBsYW5uZWRTdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICBwbGFubmVkRmluaXNoRGF0ZTogX3RoaXMuZGF0YS5wbGFubmVkRmluaXNoRGF0ZSxcclxuICAgICAgICAgICAgICAgIHBsYW5uZWRGaW5pc2hUaW1lOiBfdGhpcy5kYXRhLnBsYW5uZWRGaW5pc2hUaW1lLFxyXG4gICAgICAgICAgICAgICAgYWN0dWFsU3RhcnREYXRlOiBfdGhpcy5kYXRhLmFjdHVhbFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGFjdHVhbFN0YXJ0VGltZTogX3RoaXMuZGF0YS5hY3R1YWxTdGFydFRpbWUsXHJcbiAgICAgICAgICAgICAgICBhY3R1YWxGaW5pc2hEYXRlOiBfdGhpcy5kYXRhLmFjdHVhbEZpbmlzaERhdGUsXHJcbiAgICAgICAgICAgICAgICBhY3R1YWxGaW5pc2hUaW1lOiBfdGhpcy5kYXRhLmFjdHVhbEZpbmlzaFRpbWUsXHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogX3RoaXMuZGF0YS5sb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC8v5a2Y5YKoXHJcbiAgICAgICAgICAgICAgbGV0IHVybCA9IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtV0NPL2FwaS9wcmc5ZjI0N2FiNmQ1ZTQvam9idGFzay8nICsgX3RoaXMuZGF0YS5pZCArICc/b3BlbmlkPScgKyBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQgKyAnJnNlc3Npb25rZXk9JyArIGFwcC5nbG9iYWxEYXRhLnNlc3Npb25LZXk7XHJcbiAgICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGN1cnJlbnRPYmplY3QsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiByZXMuZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Q2hhbm5lbCA9IF90aGlzLmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICBldmVudENoYW5uZWwuZW1pdCgncmV0dXJuRGV0YWlsJywgeyBkYXRhOiBjdXJyZW50T2JqZWN0LCBpc05ldzogX3RoaXMuZGF0YS5pc05ldyB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDFcclxuICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBlcnJtc2csXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGJpbmRSZW1vdmVEZXRhaWxUYXAoZSkge1xyXG4gICAgaWYgKHRoaXMuZGF0YS5jYW5EZWxldGUpIHtcclxuICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5Yig6Zmk5ZCXJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ0RlbGV0aW5nJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAvL+WIoOmZpFxyXG4gICAgICAgICAgICBsZXQgdXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9qb2J0YXNrLycgKyBfdGhpcy5kYXRhLmlkICsgJz9vcGVuaWQ9JyArIGFwcC5nbG9iYWxEYXRhLm9wZW5JZCArICcmc2Vzc2lvbmtleT0nICsgYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleTtcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgICAgICAgICAgICAgIGV2ZW50Q2hhbm5lbCA9IF90aGlzLmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgICAgICAgICAgICBldmVudENoYW5uZWwuZW1pdCgncmV0dXJuRGV0YWlsJywgeyBkYXRhOiB7fSwgaXNOZXc6IF90aGlzLmRhdGEuaXNOZXcgfSlcclxuICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=