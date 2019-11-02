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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFza2RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhc2tkZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5Q0FBNkM7QUFFN0MsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxZQUFZLENBQUE7QUFDaEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtBQUNsQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsSUFBSTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsRUFBRSxFQUFFLENBQUMsQ0FBVztRQUNoQixJQUFJLEVBQUUsRUFBRTtRQUNSLFdBQVcsRUFBRSxFQUFFO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtRQUNaLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsRCxnQkFBZ0IsRUFBRSxpQkFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdELGlCQUFpQixFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNuRCxpQkFBaUIsRUFBRSxpQkFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlELGVBQWUsRUFBRSxFQUFFO1FBQ25CLGVBQWUsRUFBRSxFQUFFO1FBQ25CLGdCQUFnQixFQUFFLEVBQUU7UUFDcEIsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixRQUFRLEVBQUUsRUFBRTtRQUNaLEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUs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TSxFQUFFO2dDQUNOLGNBQWMsRUFBRSxrQkFBa0I7NkJBQ25DOzRCQUNELE1BQU0sRUFBRSxRQUFROzRCQUNoQixPQUFPLEVBQUUsVUFBQSxHQUFHO2dDQUVWLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtnQ0FDaEIsWUFBWSxHQUFHLE9BQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO2dDQUM1QyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtnQ0FDeEUsRUFBRSxDQUFDLFlBQVksQ0FBQztvQ0FDZCxLQUFLLEVBQUUsQ0FBQztpQ0FDVCxDQUFDLENBQUE7NEJBQ0osQ0FBQzs0QkFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dDQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7NEJBQ25CLENBQUM7eUJBQ0YsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL292ZXJkZXRhaWwudHNcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcbmltcG9ydCB7IGZvcm1hdFRpbWUgfSBmcm9tICcuLi8uLi91dGlscy91dGlsJ1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXG5sZXQgZXZlbnRDaGFubmVsXG5sZXQgZCA9IG5ldyBEYXRlKClcblBhZ2Uoe1xuICBkYXRhOiB7XG4gICAgZGVwdElkOiBudWxsLFxuICAgIGRlcHROYW1lOiBudWxsLFxuICAgIGlkOiAtMSBhcyBudW1iZXIsXG4gICAgbmFtZTogJycsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGxlYWRlcklkOiBudWxsLFxuICAgIGxlYWRlcjogbnVsbCxcbiAgICBwbGFubmVkU3RhcnREYXRlOiBkLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKSxcbiAgICBwbGFubmVkU3RhcnRUaW1lOiBmb3JtYXRUaW1lKGQudG9JU09TdHJpbmcoKSkuc3Vic3RyaW5nKDAsIDUpLFxuICAgIHBsYW5uZWRGaW5pc2hEYXRlOiBkLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKSxcbiAgICBwbGFubmVkRmluaXNoVGltZTogZm9ybWF0VGltZShkLnRvSVNPU3RyaW5nKCkpLnN1YnN0cmluZygwLCA1KSxcbiAgICBhY3R1YWxTdGFydERhdGU6ICcnLFxuICAgIGFjdHVhbFN0YXJ0VGltZTogJycsXG4gICAgYWN0dWFsRmluaXNoRGF0ZTogJycsXG4gICAgYWN0dWFsRmluaXNoVGltZTogJycsXG4gICAgbG9jYXRpb246ICcnLFxuICAgIGlzTmV3OiBmYWxzZSxcbiAgICBjYW5EZWxldGU6IGZhbHNlLFxuICAgIG5vd0RhdGU6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxuICAgIG5vd1RpbWU6IGZvcm1hdFRpbWUoZC50b0lTT1N0cmluZygpKS5zdWJzdHJpbmcoMCwgNSlcbiAgfSxcbiAgb25Mb2FkKCkge1xuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgIHRpdGxlOiAn5Yqg6L295LitJyxcbiAgICB9KVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgIH0sIDIwMDApXG4gICAgZXZlbnRDaGFubmVsID0gdGhpcy5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxuICAgIGV2ZW50Q2hhbm5lbC5vbignb3BlbkRldGFpbCcsIChyZXMpID0+IHtcbiAgICAgIGlmIChyZXMuaXNOZXcpIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgZGVwdElkOiByZXMuZGF0YS5kZXB0SWQsXG4gICAgICAgICAgZGVwdE5hbWU6IHJlcy5kYXRhLmRlcHROYW1lLFxuICAgICAgICAgIGxlYWRlcklkOiByZXMuZGF0YS5sZWFkZXJJZCxcbiAgICAgICAgICBsZWFkZXI6IHJlcy5kYXRhLmxlYWRlcixcbiAgICAgICAgICBpc05ldzogcmVzLmlzTmV3XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBkZXB0SWQ6IHJlcy5kYXRhLmRlcHRJZCxcbiAgICAgICAgICBkZXB0TmFtZTogcmVzLmRhdGEuZGVwdE5hbWUsXG4gICAgICAgICAgaWQ6IHJlcy5kYXRhLmlkLFxuICAgICAgICAgIG5hbWU6IHJlcy5kYXRhLm5hbWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHJlcy5kYXRhLmRlc2NyaXB0aW9uLFxuICAgICAgICAgIGxlYWRlcklkOiByZXMuZGF0YS5sZWFkZXJJZCxcbiAgICAgICAgICBsZWFkZXI6IHJlcy5kYXRhLmxlYWRlcixcbiAgICAgICAgICBwbGFubmVkU3RhcnREYXRlOiByZXMuZGF0YS5wbGFubmVkU3RhcnREYXRlLFxuICAgICAgICAgIHBsYW5uZWRTdGFydFRpbWU6IHJlcy5kYXRhLnBsYW5uZWRTdGFydFRpbWUsXG4gICAgICAgICAgcGxhbm5lZEZpbmlzaERhdGU6IHJlcy5kYXRhLnBsYW5uZWRGaW5pc2hEYXRlLFxuICAgICAgICAgIHBsYW5uZWRGaW5pc2hUaW1lOiByZXMuZGF0YS5wbGFubmVkRmluaXNoVGltZSxcbiAgICAgICAgICBhY3R1YWxTdGFydERhdGU6IHJlcy5kYXRhLmFjdHVhbFN0YXJ0RGF0ZSxcbiAgICAgICAgICBhY3R1YWxTdGFydFRpbWU6IHJlcy5kYXRhLmFjdHVhbFN0YXJ0VGltZSxcbiAgICAgICAgICBhY3R1YWxGaW5pc2hEYXRlOiByZXMuZGF0YS5hY3R1YWxGaW5pc2hEYXRlLFxuICAgICAgICAgIGFjdHVhbEZpbmlzaFRpbWU6IHJlcy5kYXRhLmFjdHVhbEZpbmlzaFRpbWUsXG4gICAgICAgICAgbG9jYXRpb246IHJlcy5kYXRhLmxvY2F0aW9uID09IHVuZGVmaW5lZCA/ICcnIDogcmVzLmRhdGEubG9jYXRpb24sXG4gICAgICAgICAgaXNOZXc6IHJlcy5pc05ldyxcbiAgICAgICAgICBjYW5EZWxldGU6IHJlcy5kYXRhLnN0YXR1cyA9PSAnVicgPyBmYWxzZSA6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kRGVwdFNlbGVjdChlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpc1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnLi4vZGVwdFNlbGVjdC9kZXB0U2VsZWN0P2VtcGxveWVlaWQ9JyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgcmV0dXJuRGVwdFNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgZGVwdElkOiByZXMuayxcbiAgICAgICAgICAgICAgZGVwdE5hbWU6IHJlcy5rICsgJy0nICsgcmVzLnZcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGJpbmROYW1lQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIG5hbWU6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZFBsYW5uZWRTdGFydERhdGVDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgcGxhbm5lZFN0YXJ0RGF0ZTogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kUGxhbm5lZFN0YXJ0VGltZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBwbGFubmVkU3RhcnRUaW1lOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmRQbGFubmVkRmluaXNoRGF0ZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBwbGFubmVkRmluaXNoRGF0ZTogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kUGxhbm5lZEZpbmlzaFRpbWVDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgcGxhbm5lZEZpbmlzaFRpbWU6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZEFjdHVhbFN0YXJ0RGF0ZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBhY3R1YWxTdGFydERhdGU6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZEFjdHVhbFN0YXJ0VGltZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBhY3R1YWxTdGFydFRpbWU6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZEFjdHVhbEZpbmlzaERhdGVDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgYWN0dWFsRmluaXNoRGF0ZTogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kQWN0dWFsRmluaXNoVGltZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBhY3R1YWxGaW5pc2hUaW1lOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmRDb250ZW50Q2hhbmdlKGUpIHtcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIGRlc2NyaXB0aW9uOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGZvcm1TdWJtaXQoZSkge1xuICAgIGxldCBjYW5TdWJtaXQgPSB0cnVlXG4gICAgbGV0IGVycm1zZyA9ICcnXG4gICAgaWYgKGNhblN1Ym1pdCkge1xuICAgICAgbGV0IF90aGlzID0gdGhpc1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdTZW5kaW5nJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmIChfdGhpcy5kYXRhLmlzTmV3KSB7XG4gICAgICAgICAgICAgIGxldCBjdXJyZW50T2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IF90aGlzLmRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogX3RoaXMuZGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICBsZWFkZXJJZDogX3RoaXMuZGF0YS5sZWFkZXJJZCxcbiAgICAgICAgICAgICAgICBsZWFkZXI6IF90aGlzLmRhdGEubGVhZGVyLFxuICAgICAgICAgICAgICAgIHBsYW5uZWRTdGFydERhdGU6IF90aGlzLmRhdGEucGxhbm5lZFN0YXJ0RGF0ZSxcbiAgICAgICAgICAgICAgICBwbGFubmVkU3RhcnRUaW1lOiBfdGhpcy5kYXRhLnBsYW5uZWRTdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgcGxhbm5lZEZpbmlzaERhdGU6IF90aGlzLmRhdGEucGxhbm5lZEZpbmlzaERhdGUsXG4gICAgICAgICAgICAgICAgcGxhbm5lZEZpbmlzaFRpbWU6IF90aGlzLmRhdGEucGxhbm5lZEZpbmlzaFRpbWUsXG4gICAgICAgICAgICAgICAgYWN0dWFsU3RhcnREYXRlOiAnJyxcbiAgICAgICAgICAgICAgICBhY3R1YWxTdGFydFRpbWU6ICcnLFxuICAgICAgICAgICAgICAgIGFjdHVhbEZpbmlzaERhdGU6ICcnLFxuICAgICAgICAgICAgICAgIGFjdHVhbEZpbmlzaFRpbWU6ICcnLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ04nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy/lrZjlgqhcbiAgICAgICAgICAgICAgbGV0IHVybCA9IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtV0NPL2FwaS9wcmc5ZjI0N2FiNmQ1ZTQvam9idGFzaz9vcGVuaWQ9JyArIGFwcC5nbG9iYWxEYXRhLm9wZW5JZCArICcmc2Vzc2lvbmtleT0nICsgYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleTtcbiAgICAgICAgICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogY3VycmVudE9iamVjdCxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzLmRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICBldmVudENoYW5uZWwgPSBfdGhpcy5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxuICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5EZXRhaWwnLCB7IGRhdGE6IGN1cnJlbnRPYmplY3QsIGlzTmV3OiBfdGhpcy5kYXRhLmlzTmV3IH0pXG4gICAgICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmFpbClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsZXQgc3RhdHVzID0gX3RoaXMuZGF0YS5hY3R1YWxGaW5pc2hEYXRlICE9ICcnID8gJ1YnIDogJ04nXG4gICAgICAgICAgICAgIGxldCBjdXJyZW50T2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIGlkOiBfdGhpcy5kYXRhLmlkLFxuICAgICAgICAgICAgICAgIG5hbWU6IF90aGlzLmRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogX3RoaXMuZGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICBsZWFkZXJJZDogX3RoaXMuZGF0YS5sZWFkZXJJZCxcbiAgICAgICAgICAgICAgICBsZWFkZXI6IF90aGlzLmRhdGEubGVhZGVyLFxuICAgICAgICAgICAgICAgIHBsYW5uZWRTdGFydERhdGU6IF90aGlzLmRhdGEucGxhbm5lZFN0YXJ0RGF0ZSxcbiAgICAgICAgICAgICAgICBwbGFubmVkU3RhcnRUaW1lOiBfdGhpcy5kYXRhLnBsYW5uZWRTdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgcGxhbm5lZEZpbmlzaERhdGU6IF90aGlzLmRhdGEucGxhbm5lZEZpbmlzaERhdGUsXG4gICAgICAgICAgICAgICAgcGxhbm5lZEZpbmlzaFRpbWU6IF90aGlzLmRhdGEucGxhbm5lZEZpbmlzaFRpbWUsXG4gICAgICAgICAgICAgICAgYWN0dWFsU3RhcnREYXRlOiBfdGhpcy5kYXRhLmFjdHVhbFN0YXJ0RGF0ZSxcbiAgICAgICAgICAgICAgICBhY3R1YWxTdGFydFRpbWU6IF90aGlzLmRhdGEuYWN0dWFsU3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgIGFjdHVhbEZpbmlzaERhdGU6IF90aGlzLmRhdGEuYWN0dWFsRmluaXNoRGF0ZSxcbiAgICAgICAgICAgICAgICBhY3R1YWxGaW5pc2hUaW1lOiBfdGhpcy5kYXRhLmFjdHVhbEZpbmlzaFRpbWUsXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IF90aGlzLmRhdGEubG9jYXRpb24sXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvL+WtmOWCqFxuICAgICAgICAgICAgICBsZXQgdXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9qb2J0YXNrLycgKyBfdGhpcy5kYXRhLmlkICsgJz9vcGVuaWQ9JyArIGFwcC5nbG9iYWxEYXRhLm9wZW5JZCArICcmc2Vzc2lvbmtleT0nICsgYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleTtcbiAgICAgICAgICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogY3VycmVudE9iamVjdCxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiByZXMuZGF0YS5tc2csXG4gICAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Q2hhbm5lbCA9IF90aGlzLmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXG4gICAgICAgICAgICAgICAgICAgICAgZXZlbnRDaGFubmVsLmVtaXQoJ3JldHVybkRldGFpbCcsIHsgZGF0YTogY3VycmVudE9iamVjdCwgaXNOZXc6IF90aGlzLmRhdGEuaXNOZXcgfSlcbiAgICAgICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsdGE6IDFcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmFpbDogZmFpbCA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcbiAgICAgICAgY29udGVudDogZXJybXNnLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGJpbmRSZW1vdmVEZXRhaWxUYXAoZSkge1xuICAgIGlmICh0aGlzLmRhdGEuY2FuRGVsZXRlKSB7XG4gICAgICBsZXQgX3RoaXMgPSB0aGlzXG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXG4gICAgICAgIGNvbnRlbnQ6ICfnoa7lrprliKDpmaTlkJcnLFxuICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgICAgICB0aXRsZTogJ0RlbGV0aW5nJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8v5Yig6ZmkXG4gICAgICAgICAgICBsZXQgdXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9qb2J0YXNrLycgKyBfdGhpcy5kYXRhLmlkICsgJz9vcGVuaWQ9JyArIGFwcC5nbG9iYWxEYXRhLm9wZW5JZCArICcmc2Vzc2lvbmtleT0nICsgYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleTtcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgICAgICAgICAgICBldmVudENoYW5uZWwgPSBfdGhpcy5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxuICAgICAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5EZXRhaWwnLCB7IGRhdGE6IHt9LCBpc05ldzogX3RoaXMuZGF0YS5pc05ldyB9KVxuICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgICAgICAgICAgICBkZWx0YTogMVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufSlcbiJdfQ==