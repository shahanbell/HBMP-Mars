"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../utils/util");
var app = getApp();
var d = new Date();
Page({
    data: {
        calendarConfig: {
            multi: false,
            defaultDay: d.toISOString().substring(0, 10)
        },
        dataList: [],
        startDays: [],
        deptId: null,
        deptName: null,
        leaderId: null,
        leader: null,
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
                leaderId: app.globalData.employeeId,
                leader: app.globalData.employeeName
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
        var _this_1 = this;
        this.calendar.setTodoLabels({
            pos: 'bottom',
            dotColor: '#40',
            circle: true
        });
        if (this.data.startDays.length > 0) {
            var days_1 = [];
            this.data.startDays.forEach(function (o, index) {
                days_1.push(util_1.formatDate(o));
            });
            this.calendar.setTodoLabels({
                days: days_1
            });
        }
        else {
            this.afterLoadDataCallback = function (res) {
                var days = [];
                res.LS.forEach(function (o, index) {
                    days.push(util_1.formatDate(o));
                });
                _this_1.calendar.setTodoLabels({
                    days: days
                });
            };
        }
    },
    onShow: function () {
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
                    _this.loadData();
                }
            },
            success: function (res) {
                res.eventChannel.emit('openDetail', {
                    data: {
                        deptId: _this.data.deptId,
                        deptName: _this.data.deptName,
                        leaderId: _this.data.leaderId,
                        leader: _this.data.leader
                    }, isNew: true
                });
            }
        });
    },
    bindEditDetailTap: function (e) {
        var _this = this;
        var index = e.currentTarget.dataset.index;
        console.log(index);
        wx.navigateTo({
            url: './taskdetail',
            events: {
                returnDetail: function (res) {
                    _this.loadData();
                }
            },
            success: function (res) {
                var currentObject = _this.data.dataList[index];
                res.eventChannel.emit('openDetail', {
                    data: {
                        deptId: _this.data.deptId,
                        deptName: _this.data.deptName,
                        id: currentObject.id,
                        name: currentObject.name,
                        description: currentObject.description,
                        leaderId: currentObject.leaderId,
                        leader: currentObject.leader,
                        plannedStartDate: currentObject.plannedStartDate,
                        plannedStartTime: currentObject.plannedStartTime,
                        plannedFinishDate: currentObject.plannedFinishDate,
                        plannedFinishTime: currentObject.plannedFinishTime,
                        actualStartDate: currentObject.actualStartDate,
                        actualStartTime: currentObject.actualStartTime,
                        actualFinishDate: currentObject.actualFinishDate,
                        actualFinishTime: currentObject.actualFinishTime,
                        location: currentObject.location
                    }, isNew: false
                });
            }
        });
    },
    loadData: function () {
        var _this_1 = this;
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/jobtask',
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
                    dataList: res.data.data,
                    startDays: res.data.LS
                });
                if (_this_1.afterLoadDataCallback) {
                    _this_1.afterLoadDataCallback(res.data);
                }
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5Q0FBOEM7QUFFOUMsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtBQUNsQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixjQUFjLEVBQUU7WUFDZCxLQUFLLEVBQUUsS0FBSztZQUNaLFVBQVUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDN0M7UUFDRCxRQUFRLEVBQUUsRUFBRTtRQUNaLFNBQVMsRUFBRSxFQUFZO1FBQ3ZCLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxJQUFJO1FBQ1osU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxNQUFNO1FBQ0osRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNiLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQTtRQUNGLFVBQVUsQ0FBQztZQUNULEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNsQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDUixJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQzdCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVTtnQkFDbkMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWTthQUNwQyxDQUFDLENBQUE7U0FDSDtRQUNELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7WUFDaEMsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixNQUFNLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhO2dCQUNw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RTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO2dCQUM3QixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2dCQUNyQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2FBQ3RDO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBRVYsT0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO29CQUN2QixTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2lCQUN2QixDQUFDLENBQUE7Z0JBQ0YsSUFBSSxPQUFJLENBQUMscUJBQXFCLEVBQUU7b0JBQzlCLE9BQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ3JDO1lBQ0gsQ0FBQztZQUNELElBQUksRUFBRSxVQUFBLElBQUk7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNuQixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCc7XHJcbmltcG9ydCB7IGZvcm1hdERhdGUgfSBmcm9tICcuLi8uLi91dGlscy91dGlsJztcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IGQgPSBuZXcgRGF0ZSgpXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIGNhbGVuZGFyQ29uZmlnOiB7XHJcbiAgICAgIG11bHRpOiBmYWxzZSxcclxuICAgICAgZGVmYXVsdERheTogZC50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMClcclxuICAgIH0sXHJcbiAgICBkYXRhTGlzdDogW10sXHJcbiAgICBzdGFydERheXM6IFtdIGFzIERhdGVbXSxcclxuICAgIGRlcHRJZDogbnVsbCxcclxuICAgIGRlcHROYW1lOiBudWxsLFxyXG4gICAgbGVhZGVySWQ6IG51bGwsXHJcbiAgICBsZWFkZXI6IG51bGwsXHJcbiAgICBjYW5TdWJtaXQ6IGZhbHNlXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgIHRpdGxlOiAnTG9hZGluZydcclxuICAgIH0pXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgfSwgMjAwMClcclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGxlYWRlcklkOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgIGxlYWRlcjogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVOYW1lXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCkge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBkZXB0SWQ6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQsXHJcbiAgICAgICAgZGVwdE5hbWU6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQgKyAnLScgKyBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdE5hbWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIHRoaXMubG9hZERhdGEoKTtcclxuICB9LFxyXG4gIG9uUmVhZHkoKSB7XHJcbiAgICB0aGlzLmNhbGVuZGFyLnNldFRvZG9MYWJlbHMoe1xyXG4gICAgICAvLyDlvoXlip7ngrnmoIforrDorr7nva5cclxuICAgICAgcG9zOiAnYm90dG9tJywgLy8g5b6F5Yqe54K55qCH6K6w5L2N572uIFsndG9wJywgJ2JvdHRvbSddXHJcbiAgICAgIGRvdENvbG9yOiAnIzQwJywgLy8g5b6F5Yqe54K55qCH6K6w6aKc6ImyXHJcbiAgICAgIC8vIOW+heWKnuWchuWciOagh+iusOiuvue9ru+8iOWmguWchuWciOagh+iusOW3suetvuWIsOaXpeacn++8ie+8jOivpeiuvue9ruS4jueCueagh+iusOiuvue9ruS6kuaWpVxyXG4gICAgICBjaXJjbGU6IHRydWUgLy8g5b6F5YqeXHJcbiAgICB9KTtcclxuICAgIGlmICh0aGlzLmRhdGEuc3RhcnREYXlzLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IGRheXMgPSBbXSBhcyBEYXRlW11cclxuICAgICAgdGhpcy5kYXRhLnN0YXJ0RGF5cy5mb3JFYWNoKChvOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICBkYXlzLnB1c2goZm9ybWF0RGF0ZShvKSlcclxuICAgICAgfSlcclxuICAgICAgdGhpcy5jYWxlbmRhci5zZXRUb2RvTGFiZWxzKHtcclxuICAgICAgICBkYXlzOiBkYXlzXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyDms6jlhozlm57osIPlh73mlbBcclxuICAgICAgdGhpcy5hZnRlckxvYWREYXRhQ2FsbGJhY2sgPSAocmVzKSA9PiB7XHJcbiAgICAgICAgbGV0IGRheXMgPSBbXSBhcyBEYXRlW11cclxuICAgICAgICByZXMuTFMuZm9yRWFjaCgobzogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICBkYXlzLnB1c2goZm9ybWF0RGF0ZShvKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmNhbGVuZGFyLnNldFRvZG9MYWJlbHMoe1xyXG4gICAgICAgICAgZGF5czogZGF5c1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIG9uU2hvdygpIHtcclxuXHJcbiAgfSxcclxuICBhZnRlclRhcERheShlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKVxyXG4gIH0sXHJcbiAgYmluZEFkZERldGFpbFRhcChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi90YXNrZGV0YWlsJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuRGV0YWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBfdGhpcy5sb2FkRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICByZXMuZXZlbnRDaGFubmVsLmVtaXQoJ29wZW5EZXRhaWwnLCB7XHJcbiAgICAgICAgICBkYXRhOlxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBkZXB0SWQ6IF90aGlzLmRhdGEuZGVwdElkLFxyXG4gICAgICAgICAgICBkZXB0TmFtZTogX3RoaXMuZGF0YS5kZXB0TmFtZSxcclxuICAgICAgICAgICAgbGVhZGVySWQ6IF90aGlzLmRhdGEubGVhZGVySWQsXHJcbiAgICAgICAgICAgIGxlYWRlcjogX3RoaXMuZGF0YS5sZWFkZXJcclxuICAgICAgICAgIH0sIGlzTmV3OiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRFZGl0RGV0YWlsVGFwKGUpIHtcclxuICAgIGxldCBfdGhpcyA9IHRoaXNcclxuICAgIGxldCBpbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XHJcbiAgICBjb25zb2xlLmxvZyhpbmRleClcclxuICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICB1cmw6ICcuL3Rhc2tkZXRhaWwnLFxyXG4gICAgICBldmVudHM6IHtcclxuICAgICAgICByZXR1cm5EZXRhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIF90aGlzLmxvYWREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGxldCBjdXJyZW50T2JqZWN0ID0gX3RoaXMuZGF0YS5kYXRhTGlzdFtpbmRleF07XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjdXJyZW50T2JqZWN0KVxyXG4gICAgICAgIHJlcy5ldmVudENoYW5uZWwuZW1pdCgnb3BlbkRldGFpbCcsIHtcclxuICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRlcHRJZDogX3RoaXMuZGF0YS5kZXB0SWQsXHJcbiAgICAgICAgICAgIGRlcHROYW1lOiBfdGhpcy5kYXRhLmRlcHROYW1lLFxyXG4gICAgICAgICAgICBpZDogY3VycmVudE9iamVjdC5pZCxcclxuICAgICAgICAgICAgbmFtZTogY3VycmVudE9iamVjdC5uYW1lLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogY3VycmVudE9iamVjdC5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgbGVhZGVySWQ6IGN1cnJlbnRPYmplY3QubGVhZGVySWQsXHJcbiAgICAgICAgICAgIGxlYWRlcjogY3VycmVudE9iamVjdC5sZWFkZXIsXHJcbiAgICAgICAgICAgIHBsYW5uZWRTdGFydERhdGU6IGN1cnJlbnRPYmplY3QucGxhbm5lZFN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgcGxhbm5lZFN0YXJ0VGltZTogY3VycmVudE9iamVjdC5wbGFubmVkU3RhcnRUaW1lLFxyXG4gICAgICAgICAgICBwbGFubmVkRmluaXNoRGF0ZTogY3VycmVudE9iamVjdC5wbGFubmVkRmluaXNoRGF0ZSxcclxuICAgICAgICAgICAgcGxhbm5lZEZpbmlzaFRpbWU6IGN1cnJlbnRPYmplY3QucGxhbm5lZEZpbmlzaFRpbWUsXHJcbiAgICAgICAgICAgIGFjdHVhbFN0YXJ0RGF0ZTogY3VycmVudE9iamVjdC5hY3R1YWxTdGFydERhdGUsXHJcbiAgICAgICAgICAgIGFjdHVhbFN0YXJ0VGltZTogY3VycmVudE9iamVjdC5hY3R1YWxTdGFydFRpbWUsXHJcbiAgICAgICAgICAgIGFjdHVhbEZpbmlzaERhdGU6IGN1cnJlbnRPYmplY3QuYWN0dWFsRmluaXNoRGF0ZSxcclxuICAgICAgICAgICAgYWN0dWFsRmluaXNoVGltZTogY3VycmVudE9iamVjdC5hY3R1YWxGaW5pc2hUaW1lLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogY3VycmVudE9iamVjdC5sb2NhdGlvblxyXG4gICAgICAgICAgfSwgaXNOZXc6IGZhbHNlXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGxvYWREYXRhKCkge1xyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9qb2J0YXNrJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIG9wZW5pZDogYXBwLmdsb2JhbERhdGEub3BlbklkLFxyXG4gICAgICAgIHNlc3Npb25rZXk6IGFwcC5nbG9iYWxEYXRhLnNlc3Npb25LZXksXHJcbiAgICAgICAgZW1wbG95ZWVpZDogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZFxyXG4gICAgICB9XHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgZGF0YUxpc3Q6IHJlcy5kYXRhLmRhdGEsXHJcbiAgICAgICAgICBzdGFydERheXM6IHJlcy5kYXRhLkxTXHJcbiAgICAgICAgfSlcclxuICAgICAgICBpZiAodGhpcy5hZnRlckxvYWREYXRhQ2FsbGJhY2spIHtcclxuICAgICAgICAgIHRoaXMuYWZ0ZXJMb2FkRGF0YUNhbGxiYWNrKHJlcy5kYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiJdfQ==