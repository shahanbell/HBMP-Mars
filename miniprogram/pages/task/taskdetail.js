"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var eventChannel;
var d = new Date();
Page({
    data: {
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        name: '',
        description: '',
        plannedStartDate: d.toISOString().substring(0, 10),
        plannedStartTime: "08:00",
        plannedFinishDate: d.toISOString().substring(0, 10),
        plannedFinishTime: "08:00",
        isNew: false
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
                    employeeId: res.data.employeeId,
                    employeeName: res.data.employeeName,
                    deptId: res.data.deptId,
                    deptName: res.data.deptName,
                    isNew: res.isNew
                });
            }
            else {
                _this_1.setData({
                    isNew: res.isNew
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
                        var newObject_1 = {
                            name: _this_2.data.name,
                            description: _this_2.data.description,
                            leaderId: _this_2.data.employeeId,
                            leader: _this_2.data.employeeName,
                            plannedStartDate: _this_2.data.plannedStartDate,
                            plannedFinishDate: _this_2.data.plannedFinishDate,
                            status: 'N'
                        };
                        var url = app.globalData.restAdd + '/WeChatOpen/api/prg26c450ac24f4/jobtask?openid=' + app.globalData.openId + '&sessionkey=' + app.globalData.sessionKey;
                        wx.request({
                            url: url,
                            data: {
                                name: _this_2.data.name,
                                description: _this_2.data.description,
                                leaderId: _this_2.data.employeeId,
                                leader: _this_2.data.employeeName,
                                plannedStartDate: _this_2.data.plannedStartDate,
                                plannedFinishDate: _this_2.data.plannedFinishDate,
                                status: 'N'
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
                                        eventChannel = this.getOpenerEventChannel();
                                        eventChannel.emit('returnDetail', { data: newObject_1, isNew: this.data.isNew });
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
            });
        }
        else {
            wx.showModal({
                title: '系统提示',
                content: errmsg,
                showCancel: false
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFza2RldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhc2tkZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUM1QixJQUFJLFlBQVksQ0FBQTtBQUNoQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0FBQ2xCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxJQUFJLEVBQUUsRUFBRTtRQUNSLFdBQVcsRUFBRSxFQUFFO1FBQ2YsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ2xELGdCQUFnQixFQUFFLE9BQU87UUFDekIsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ25ELGlCQUFpQixFQUFFLE9BQU87UUFDMUIsS0FBSyxFQUFFLEtBQUs7S0FDYjtJQUNELE1BQU07UUFBTixtQkF1QkM7UUF0QkMsRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFBO1FBQ0YsVUFBVSxDQUFDO1lBQ1QsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNSLFlBQVksR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtRQUMzQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFDLEdBQUc7WUFDaEMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUNiLE9BQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osVUFBVSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVTtvQkFDL0IsWUFBWSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWTtvQkFDbkMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTTtvQkFDdkIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTtvQkFDM0IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO2lCQUNqQixDQUFDLENBQUE7YUFDSDtpQkFBTTtnQkFDTCxPQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSztpQkFDakIsQ0FBQyxDQUFBO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxjQUFjLFlBQUMsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQTtRQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLHNDQUFzQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVTtZQUN2RSxNQUFNLEVBQUU7Z0JBQ04sZ0JBQWdCLEVBQUUsVUFBVSxHQUFHO29CQUM3QixJQUFJLEdBQUcsRUFBRTt3QkFDUCxLQUFLLENBQUMsT0FBUSxDQUFDOzRCQUNiLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFDYixRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7eUJBQzlCLENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0Y7WUFDRCxPQUFPLFlBQUMsR0FBRztnQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2xCLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsY0FBYyxZQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUNyQixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsMEJBQTBCLFlBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQ2pDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCwwQkFBMEIsWUFBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixnQkFBZ0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDakMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELDJCQUEyQixZQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNaLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUNsQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsMkJBQTJCLFlBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQ2xDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxpQkFBaUIsWUFBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixXQUFXLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQzVCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxVQUFVLFlBQUMsQ0FBQztRQUNWLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQTtRQUNwQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7UUFDZixJQUFJLFNBQVMsRUFBRTtZQUNiLElBQUksT0FBSyxHQUFHLElBQUksQ0FBQTtZQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixPQUFPLFlBQUMsR0FBRztvQkFDVCxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7d0JBQ2YsRUFBRSxDQUFDLFdBQVcsQ0FBQzs0QkFDYixLQUFLLEVBQUUsU0FBUzt5QkFDakIsQ0FBQyxDQUFBO3dCQUNGLElBQUksV0FBUyxHQUFHOzRCQUNkLElBQUksRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7NEJBQ3JCLFdBQVcsRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLFdBQVc7NEJBQ25DLFFBQVEsRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLFVBQVU7NEJBQy9CLE1BQU0sRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLFlBQVk7NEJBQy9CLGdCQUFnQixFQUFFLE9BQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCOzRCQUM3QyxpQkFBaUIsRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQjs0QkFDL0MsTUFBTSxFQUFFLEdBQUc7eUJBQ1osQ0FBQTt3QkFFRCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxpREFBaUQsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxjQUFjLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUM7d0JBQzFKLEVBQUUsQ0FBQyxPQUFPLENBQUM7NEJBQ1QsR0FBRyxFQUFFLEdBQUc7NEJBQ1IsSUFBSSxFQUFFO2dDQUNKLElBQUksRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLElBQUk7Z0NBQ3JCLFdBQVcsRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0NBQ25DLFFBQVEsRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLFVBQVU7Z0NBQy9CLE1BQU0sRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLFlBQVk7Z0NBQy9CLGdCQUFnQixFQUFFLE9BQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCO2dDQUM3QyxpQkFBaUIsRUFBRSxPQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQjtnQ0FDL0MsTUFBTSxFQUFFLEdBQUc7NkJBQ1o7NEJBQ0QsTUFBTSxFQUFFO2dDQUNOLGNBQWMsRUFBRSxrQkFBa0I7NkJBQ25DOzRCQUNELE1BQU0sRUFBRSxNQUFNOzRCQUNkLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0NBRVYsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO2dDQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDO29DQUNYLEtBQUssRUFBRSxNQUFNO29DQUNiLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUc7b0NBQ3JCLFVBQVUsRUFBRSxLQUFLO29DQUNqQixPQUFPLFlBQUMsR0FBRzt3Q0FDVCxZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7d0NBQzNDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO3dDQUM5RSxFQUFFLENBQUMsWUFBWSxDQUFDOzRDQUNkLEtBQUssRUFBRSxDQUFDO3lDQUNULENBQUMsQ0FBQTtvQ0FDSixDQUFDO2lDQUNGLENBQUMsQ0FBQTs0QkFDSixDQUFDOzRCQUNELElBQUksRUFBRSxVQUFBLElBQUk7Z0NBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTs0QkFDbkIsQ0FBQzt5QkFDRixDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vb3ZlcmRldGFpbC50c1xuaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXG5sZXQgZXZlbnRDaGFubmVsXG5sZXQgZCA9IG5ldyBEYXRlKClcblBhZ2Uoe1xuICBkYXRhOiB7XG4gICAgZW1wbG95ZWVJZDogbnVsbCxcbiAgICBlbXBsb3llZU5hbWU6IG51bGwsXG4gICAgZGVwdElkOiBudWxsLFxuICAgIGRlcHROYW1lOiBudWxsLFxuICAgIG5hbWU6ICcnLFxuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBwbGFubmVkU3RhcnREYXRlOiBkLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKSxcbiAgICBwbGFubmVkU3RhcnRUaW1lOiBcIjA4OjAwXCIsXG4gICAgcGxhbm5lZEZpbmlzaERhdGU6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxuICAgIHBsYW5uZWRGaW5pc2hUaW1lOiBcIjA4OjAwXCIsXG4gICAgaXNOZXc6IGZhbHNlXG4gIH0sXG4gIG9uTG9hZCgpIHtcbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICB0aXRsZTogJ+WKoOi9veS4rScsXG4gICAgfSlcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICB9LCAyMDAwKVxuICAgIGV2ZW50Q2hhbm5lbCA9IHRoaXMuZ2V0T3BlbmVyRXZlbnRDaGFubmVsKClcbiAgICBldmVudENoYW5uZWwub24oJ29wZW5EZXRhaWwnLCAocmVzKSA9PiB7XG4gICAgICBpZiAocmVzLmlzTmV3KSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgIGVtcGxveWVlSWQ6IHJlcy5kYXRhLmVtcGxveWVlSWQsXG4gICAgICAgICAgZW1wbG95ZWVOYW1lOiByZXMuZGF0YS5lbXBsb3llZU5hbWUsXG4gICAgICAgICAgZGVwdElkOiByZXMuZGF0YS5kZXB0SWQsXG4gICAgICAgICAgZGVwdE5hbWU6IHJlcy5kYXRhLmRlcHROYW1lLFxuICAgICAgICAgIGlzTmV3OiByZXMuaXNOZXdcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgIGlzTmV3OiByZXMuaXNOZXdcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kRGVwdFNlbGVjdChlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpc1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnLi4vZGVwdFNlbGVjdC9kZXB0U2VsZWN0P2VtcGxveWVlaWQ9JyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgcmV0dXJuRGVwdFNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgZGVwdElkOiByZXMuayxcbiAgICAgICAgICAgICAgZGVwdE5hbWU6IHJlcy5rICsgJy0nICsgcmVzLnZcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGJpbmROYW1lQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIG5hbWU6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZFBsYW5uZWRTdGFydERhdGVDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgcGxhbm5lZFN0YXJ0RGF0ZTogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kUGxhbm5lZFN0YXJ0VGltZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBwbGFubmVkU3RhcnRUaW1lOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmRQbGFubmVkRmluaXNoRGF0ZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBwbGFubmVkRmluaXNoRGF0ZTogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kUGxhbm5lZEZpbmlzaFRpbWVDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgcGxhbm5lZEZpbmlzaFRpbWU6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZENvbnRlbnRDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgZGVzY3JpcHRpb246IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgZm9ybVN1Ym1pdChlKSB7XG4gICAgbGV0IGNhblN1Ym1pdCA9IHRydWVcbiAgICBsZXQgZXJybXNnID0gJydcbiAgICBpZiAoY2FuU3VibWl0KSB7XG4gICAgICBsZXQgX3RoaXMgPSB0aGlzXG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXG4gICAgICAgIGNvbnRlbnQ6ICfnoa7lrprmj5DkuqTlkJcnLFxuICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgICAgICB0aXRsZTogJ1NlbmRpbmcnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgbGV0IG5ld09iamVjdCA9IHtcbiAgICAgICAgICAgICAgbmFtZTogX3RoaXMuZGF0YS5uYW1lLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogX3RoaXMuZGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgbGVhZGVySWQ6IF90aGlzLmRhdGEuZW1wbG95ZWVJZCxcbiAgICAgICAgICAgICAgbGVhZGVyOiBfdGhpcy5kYXRhLmVtcGxveWVlTmFtZSxcbiAgICAgICAgICAgICAgcGxhbm5lZFN0YXJ0RGF0ZTogX3RoaXMuZGF0YS5wbGFubmVkU3RhcnREYXRlLFxuICAgICAgICAgICAgICBwbGFubmVkRmluaXNoRGF0ZTogX3RoaXMuZGF0YS5wbGFubmVkRmluaXNoRGF0ZSxcbiAgICAgICAgICAgICAgc3RhdHVzOiAnTidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5a2Y5YKoXG4gICAgICAgICAgICBsZXQgdXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvV2VDaGF0T3Blbi9hcGkvcHJnMjZjNDUwYWMyNGY0L2pvYnRhc2s/b3BlbmlkPScgKyBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQgKyAnJnNlc3Npb25rZXk9JyArIGFwcC5nbG9iYWxEYXRhLnNlc3Npb25LZXk7XG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBfdGhpcy5kYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IF90aGlzLmRhdGEuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgbGVhZGVySWQ6IF90aGlzLmRhdGEuZW1wbG95ZWVJZCxcbiAgICAgICAgICAgICAgICBsZWFkZXI6IF90aGlzLmRhdGEuZW1wbG95ZWVOYW1lLFxuICAgICAgICAgICAgICAgIHBsYW5uZWRTdGFydERhdGU6IF90aGlzLmRhdGEucGxhbm5lZFN0YXJ0RGF0ZSxcbiAgICAgICAgICAgICAgICBwbGFubmVkRmluaXNoRGF0ZTogX3RoaXMuZGF0YS5wbGFubmVkRmluaXNoRGF0ZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdOJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxuICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzLmRhdGEubXNnLFxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBldmVudENoYW5uZWwgPSB0aGlzLmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5EZXRhaWwnLCB7IGRhdGE6IG5ld09iamVjdCwgaXNOZXc6IHRoaXMuZGF0YS5pc05ldyB9KVxuICAgICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgICAgICAgICAgIGRlbHRhOiAxXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZmFpbDogZmFpbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmFpbClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcbiAgICAgICAgY29udGVudDogZXJybXNnLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pXG4iXX0=