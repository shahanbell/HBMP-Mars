"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var d = new Date();
Page({
    data: {
        calendarConfig: {
            multi: false,
            defaultDay: d.toISOString().substring(0, 10)
        },
        dataList: [],
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        canSubmit: false
    },
    onLoad: function () {
        wx.showLoading({
            title: 'Loading'
        });
        setTimeout(function () {
            wx.hideLoading();
        }, 2000);
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
        this.loadData();
    },
    onReady: function () {
        this.calendar.setTodoLabels({
            pos: 'bottom',
            dotColor: '#40',
            circle: true
        });
    },
    afterTapDay: function (e) {
        console.log(e);
    },
    bindAddDetailTap: function (e) {
        var _this = this;
        wx.navigateTo({
            url: './taskdetail',
            events: {
                returnDetail: function (res) {
                    this.loadData();
                }
            },
            success: function (res) {
                res.eventChannel.emit('openDetail', {
                    data: {
                        employeeId: _this.data.employeeId,
                        employeeName: _this.data.employeeName,
                        deptId: _this.data.deptId,
                        deptName: _this.data.deptName
                    }, isNew: true
                });
            }
        });
    },
    bindEditDetailTap: function (e) {
        var _this = this;
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: './overdetail',
            events: {
                returnDetail: function (res) {
                    var details = _this.data.detailList;
                    details.splice(index, 1);
                    details.push(res.data);
                    details.forEach(function (o, i) {
                        o.seq = i + 1;
                    });
                    _this.setData({
                        detailList: details,
                        canSubmit: true
                    });
                }
            },
            success: function (res) {
                var currentObject = _this.data.detailList[index];
                res.eventChannel.emit('openDetail', {
                    data: {
                        employeeId: currentObject.employeeId,
                        employeeName: currentObject.employeeName,
                        deptId: currentObject.deptId,
                        deptName: currentObject.deptName,
                        lunch: currentObject.lunch,
                        dinner: currentObject.dinner,
                        date1: currentObject.date1,
                        time1: currentObject.time1,
                        time2: currentObject.time2,
                        hour: currentObject.hour,
                        content: currentObject.content
                    }, isNew: false
                });
            }
        });
    },
    bindScanTap: function (e) {
        wx.getSetting({
            success: function (res) {
                if (!res.authSetting['scope.camera']) {
                    wx.authorize({
                        scope: 'scope.camera',
                        success: function () {
                            console.log('用户已经同意小程序使用Camera');
                        }
                    });
                }
                else {
                    wx.scanCode({
                        onlyFromCamera: true,
                        success: function (res) {
                            console.log(res);
                        }
                    });
                }
            }
        });
    },
    loadData: function () {
        var _this_1 = this;
        wx.request({
            url: app.globalData.restAdd + '/WeChatOpen/api/prg26c450ac24f4/jobtask',
            data: {
                openid: app.globalData.openId,
                sessionkey: app.globalData.sessionKey,
                employeeid: app.globalData.employeeId
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                _this_1.setData({
                    dataList: res.data.data
                });
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUM1QixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0FBQ2xCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLGNBQWMsRUFBRTtZQUNkLEtBQUssRUFBRSxLQUFLO1lBQ1osVUFBVSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUM3QztRQUNELFFBQVEsRUFBRSxFQUFFO1FBQ1osVUFBVSxFQUFFLElBQUk7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFNBQVMsRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsTUFBTTtRQUNKLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDYixLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDLENBQUE7UUFDRixVQUFVLENBQUM7WUFDVCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ1IsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUM3QixJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVU7Z0JBQ3JDLFlBQVksRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVk7YUFDMUMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osTUFBTSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsYUFBYTtnQkFDcEMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMs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QUFrQjthQUNuQztZQUNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFFVixPQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUk7aUJBQ3hCLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbkIsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FFRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXG5cbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcbmxldCBkID0gbmV3IERhdGUoKVxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICBjYWxlbmRhckNvbmZpZzoge1xuICAgICAgbXVsdGk6IGZhbHNlLFxuICAgICAgZGVmYXVsdERheTogZC50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMClcbiAgICB9LFxuICAgIGRhdGFMaXN0OiBbXSxcbiAgICBlbXBsb3llZUlkOiBudWxsLFxuICAgIGVtcGxveWVlTmFtZTogbnVsbCxcbiAgICBkZXB0SWQ6IG51bGwsXG4gICAgZGVwdE5hbWU6IG51bGwsXG4gICAgY2FuU3VibWl0OiBmYWxzZVxuICB9LFxuICBvbkxvYWQoKSB7XG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICdMb2FkaW5nJ1xuICAgIH0pXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgfSwgMjAwMClcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEuYXV0aG9yaXplZCkge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGVtcGxveWVlSWQ6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXG4gICAgICAgIGVtcGxveWVlTmFtZTogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVOYW1lXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCkge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGRlcHRJZDogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCxcbiAgICAgICAgZGVwdE5hbWU6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQgKyAnLScgKyBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdE5hbWVcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMubG9hZERhdGEoKTtcbiAgfSxcbiAgb25SZWFkeSgpIHtcbiAgICB0aGlzLmNhbGVuZGFyLnNldFRvZG9MYWJlbHMoe1xuICAgICAgLy8g5b6F5Yqe54K55qCH6K6w6K6+572uXG4gICAgICBwb3M6ICdib3R0b20nLCAvLyDlvoXlip7ngrnmoIforrDkvY3nva4gWyd0b3AnLCAnYm90dG9tJ11cbiAgICAgIGRvdENvbG9yOiAnIzQwJywgLy8g5b6F5Yqe54K55qCH6K6w6aKc6ImyXG4gICAgICAvLyDlvoXlip7lnIblnIjmoIforrDorr7nva7vvIjlpoLlnIblnIjmoIforrDlt7Lnrb7liLDml6XmnJ/vvInvvIzor6Xorr7nva7kuI7ngrnmoIforrDorr7nva7kupLmlqVcbiAgICAgIGNpcmNsZTogdHJ1ZSAvLyDlvoXlip5cbiAgICB9KTtcbiAgfSxcbiAgYWZ0ZXJUYXBEYXkoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpXG4gIH0sXG4gIGJpbmRBZGREZXRhaWxUYXAoZSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXNcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIHVybDogJy4vdGFza2RldGFpbCcsXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgcmV0dXJuRGV0YWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgcmVzLmV2ZW50Q2hhbm5lbC5lbWl0KCdvcGVuRGV0YWlsJywge1xuICAgICAgICAgIGRhdGE6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZW1wbG95ZWVJZDogX3RoaXMuZGF0YS5lbXBsb3llZUlkLFxuICAgICAgICAgICAgZW1wbG95ZWVOYW1lOiBfdGhpcy5kYXRhLmVtcGxveWVlTmFtZSxcbiAgICAgICAgICAgIGRlcHRJZDogX3RoaXMuZGF0YS5kZXB0SWQsXG4gICAgICAgICAgICBkZXB0TmFtZTogX3RoaXMuZGF0YS5kZXB0TmFtZVxuICAgICAgICAgIH0sIGlzTmV3OiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgYmluZEVkaXREZXRhaWxUYXAoZSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXNcbiAgICBsZXQgaW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnLi9vdmVyZGV0YWlsJyxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICByZXR1cm5EZXRhaWw6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICBsZXQgZGV0YWlscyA9IF90aGlzLmRhdGEuZGV0YWlsTGlzdFxuICAgICAgICAgIGRldGFpbHMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgIGRldGFpbHMucHVzaChyZXMuZGF0YSlcbiAgICAgICAgICBkZXRhaWxzLmZvckVhY2goKG8sIGkpID0+IHtcbiAgICAgICAgICAgIG8uc2VxID0gaSArIDFcbiAgICAgICAgICB9KVxuICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGRldGFpbExpc3Q6IGRldGFpbHMsXG4gICAgICAgICAgICBjYW5TdWJtaXQ6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRPYmplY3QgPSBfdGhpcy5kYXRhLmRldGFpbExpc3RbaW5kZXhdXG4gICAgICAgIHJlcy5ldmVudENoYW5uZWwuZW1pdCgnb3BlbkRldGFpbCcsIHtcbiAgICAgICAgICBkYXRhOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVtcGxveWVlSWQ6IGN1cnJlbnRPYmplY3QuZW1wbG95ZWVJZCxcbiAgICAgICAgICAgIGVtcGxveWVlTmFtZTogY3VycmVudE9iamVjdC5lbXBsb3llZU5hbWUsXG4gICAgICAgICAgICBkZXB0SWQ6IGN1cnJlbnRPYmplY3QuZGVwdElkLFxuICAgICAgICAgICAgZGVwdE5hbWU6IGN1cnJlbnRPYmplY3QuZGVwdE5hbWUsXG4gICAgICAgICAgICBsdW5jaDogY3VycmVudE9iamVjdC5sdW5jaCxcbiAgICAgICAgICAgIGRpbm5lcjogY3VycmVudE9iamVjdC5kaW5uZXIsXG4gICAgICAgICAgICBkYXRlMTogY3VycmVudE9iamVjdC5kYXRlMSxcbiAgICAgICAgICAgIHRpbWUxOiBjdXJyZW50T2JqZWN0LnRpbWUxLFxuICAgICAgICAgICAgdGltZTI6IGN1cnJlbnRPYmplY3QudGltZTIsXG4gICAgICAgICAgICBob3VyOiBjdXJyZW50T2JqZWN0LmhvdXIsXG4gICAgICAgICAgICBjb250ZW50OiBjdXJyZW50T2JqZWN0LmNvbnRlbnRcbiAgICAgICAgICB9LCBpc05ldzogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kU2NhblRhcChlKSB7XG4gICAgd3guZ2V0U2V0dGluZyh7XG4gICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICBpZiAoIXJlcy5hdXRoU2V0dGluZ1snc2NvcGUuY2FtZXJhJ10pIHtcbiAgICAgICAgICB3eC5hdXRob3JpemUoe1xuICAgICAgICAgICAgc2NvcGU6ICdzY29wZS5jYW1lcmEnLFxuICAgICAgICAgICAgc3VjY2VzcygpIHtcbiAgICAgICAgICAgICAgLy8g55So5oi35bey57uP5ZCM5oSP5bCP56iL5bqP5L2/55SoQ2FtZXJhXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnlKjmiLflt7Lnu4/lkIzmhI/lsI/nqIvluo/kvb/nlKhDYW1lcmEnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3guc2NhbkNvZGUoe1xuICAgICAgICAgICAgb25seUZyb21DYW1lcmE6IHRydWUsXG4gICAgICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGxvYWREYXRhKCkge1xuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9XZUNoYXRPcGVuL2FwaS9wcmcyNmM0NTBhYzI0ZjQvam9idGFzaycsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9wZW5pZDogYXBwLmdsb2JhbERhdGEub3BlbklkLFxuICAgICAgICBzZXNzaW9ua2V5OiBhcHAuZ2xvYmFsRGF0YS5zZXNzaW9uS2V5LFxuICAgICAgICBlbXBsb3llZWlkOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkXG4gICAgICB9XG4gICAgICBoZWFkZXI6IHtcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlcy5kYXRhKVxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBkYXRhTGlzdDogcmVzLmRhdGEuZGF0YVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxufSlcbiJdfQ==