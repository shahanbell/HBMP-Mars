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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5Q0FBOEM7QUFFOUMsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtBQUNsQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixjQUFjLEVBQUU7WUFDZCxLQUFLLEVBQUUsS0FBSztZQUNaLFVBQVUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDN0M7UUFDRCxRQUFRLEVBQUUsRUFBRTtRQUNaLFNBQVMsRUFBRSxFQUFZO1FBQ3ZCLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxJQUFJO1FBQ1osU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxNQUFNO1FBQ0osRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNiLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQTtRQUNGLFVBQVUsQ0FBQztZQUNULEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNsQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDUixJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQzdCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVTtnQkFDbkMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsWUFBWTthQUNwQyxDQUFDLENBQUE7U0FDSDtRQUNELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7WUFDaEMsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixNQUFNLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhO2dCQUNwQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZTthQUM5RSxDQUFDLENBQUE7U0FDSDtRQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBQ0QsT0FBTztRQUFQLG1CQTRCQztRQTNCQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUUxQixHQUFHLEVBQUUsUUFBUTtZQUNiLFFBQVEsRUFBRSxLQUFLO1lBRWYsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDLENBQUM7UUFDSCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbEMsSUFBSSxNQUFJLEdBQUcsRUFBWSxDQUFBO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQVMsRUFBRSxLQUFhO2dCQUNuRCxNQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMxQixDQUFDLENBQUMsQ0FBQTtZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO2dCQUMxQixJQUFJLEVBQUUsTUFBSTthQUNYLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFFTCxJQUFJLENBQUMscUJBQXFCLEdBQUcsVUFBQyxHQUFHO2dCQUMvQixJQUFJLElBQUksR0FBRyxFQUFZLENBQUE7Z0JBQ3ZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBUyxFQUFFLEtBQWE7b0JBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQTtnQkFDRixPQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztvQkFDMUIsSUFBSSxFQUFFLElBQUk7aUJBQ1gsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFBO1NBQ0Y7SUFDSCxDQUFDO0lBQ0QsTUFBTTtJQUVOLENBQUM7SUFDRCxXQUFXLFlBQUMsQ0FBQztRQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDaEIsQ0FBQztJQUNELGdCQUFnQixZQUFDLENBQUM7UUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDWixHQUFHLEVBQUUsY0FBYztZQUNuQixNQUFNLEVBQUU7Z0JBQ04sWUFBWSxFQUFFLFVBQVUsR0FBRztvQkFDekIsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNuQixDQUFDO2FBQ0Y7WUFDRCxPQUFPLFlBQUMsR0FBRztnQkFDVCxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ2xDLElBQUksRUFDSjt3QkFDRSxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNO3dCQUN6QixRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRO3dCQUM3QixRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRO3dCQUM3QixNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNO3FCQUMxQixFQUFFLEtBQUssRUFBRSxJQUFJO2lCQUNmLENBQUMsQ0FBQTtZQUNKLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsaUJBQWlCLFlBQUMsQ0FBQztRQUNqQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFBO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEIsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNaLEdBQUcsRUFBRSxjQUFjO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixZQUFZLEVBQUUsVUFBVSxHQUFHO29CQUN6QixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ25CLENBQUM7YUFDRjtZQUNELE9BQU8sWUFBQyxHQUFHO2dCQUNULElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUvQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ2xDLElBQUksRUFDSjt3QkFDRSxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNO3dCQUN6QixRQUFRLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRO3dCQUM3QixFQUFFLEVBQUUsYUFBYSxDQUFDLEVBQUU7d0JBQ3BCLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSTt3QkFDeEIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxXQUFXO3dCQUN0QyxRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVE7d0JBQ2hDLE1BQU0sRUFBRSxhQUFhLENBQUMsTUFBTTt3QkFDNUIsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLGdCQUFnQjt3QkFDaEQsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLGdCQUFnQjt3QkFDaEQsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLGlCQUFpQjt3QkFDbEQsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLGlCQUFpQjt3QkFDbEQsZUFBZSxFQUFFLGFBQWEsQ0FBQyxlQUFlO3dCQUM5QyxlQUFlLEVBQUUsYUFBYSxDQUFDLGVBQWU7d0JBQzlDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxnQkFBZ0I7d0JBQ2hELGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxnQkFBZ0I7d0JBQ2hELFFBQVEsRUFBRSxhQUFhLENBQUMsUUFBUTtxQkFDakMsRUFBRSxLQUFLLEVBQUUsS0FBSztpQkFDaEIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxRQUFRO1FBQVIsbUJBMEJDO1FBekJDLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDVCxHQUFHLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcseUNBQXlDO1lBQ3ZFLElBQUksRUFBRTtnQkFDSixNQUFNLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO2dCQUM3QixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2dCQUNyQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2FBQ3RDO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBRVYsT0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO29CQUN2QixTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2lCQUN2QixDQUFDLENBQUE7Z0JBQ0YsSUFBSSxPQUFJLENBQUMscUJBQXFCLEVBQUU7b0JBQzlCLE9BQUksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ3JDO1lBQ0gsQ0FBQztZQUNELElBQUksRUFBRSxVQUFBLElBQUk7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNuQixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCc7XG5pbXBvcnQgeyBmb3JtYXREYXRlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbCc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcbmxldCBkID0gbmV3IERhdGUoKVxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICBjYWxlbmRhckNvbmZpZzoge1xuICAgICAgbXVsdGk6IGZhbHNlLFxuICAgICAgZGVmYXVsdERheTogZC50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMClcbiAgICB9LFxuICAgIGRhdGFMaXN0OiBbXSxcbiAgICBzdGFydERheXM6IFtdIGFzIERhdGVbXSxcbiAgICBkZXB0SWQ6IG51bGwsXG4gICAgZGVwdE5hbWU6IG51bGwsXG4gICAgbGVhZGVySWQ6IG51bGwsXG4gICAgbGVhZGVyOiBudWxsLFxuICAgIGNhblN1Ym1pdDogZmFsc2VcbiAgfSxcbiAgb25Mb2FkKCkge1xuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgIHRpdGxlOiAnTG9hZGluZydcbiAgICB9KVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgIH0sIDIwMDApXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICBsZWFkZXJJZDogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcbiAgICAgICAgbGVhZGVyOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZU5hbWVcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkKSB7XG4gICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgZGVwdElkOiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkLFxuICAgICAgICBkZXB0TmFtZTogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCArICctJyArIGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5sb2FkRGF0YSgpO1xuICB9LFxuICBvblJlYWR5KCkge1xuICAgIHRoaXMuY2FsZW5kYXIuc2V0VG9kb0xhYmVscyh7XG4gICAgICAvLyDlvoXlip7ngrnmoIforrDorr7nva5cbiAgICAgIHBvczogJ2JvdHRvbScsIC8vIOW+heWKnueCueagh+iusOS9jee9riBbJ3RvcCcsICdib3R0b20nXVxuICAgICAgZG90Q29sb3I6ICcjNDAnLCAvLyDlvoXlip7ngrnmoIforrDpopzoibJcbiAgICAgIC8vIOW+heWKnuWchuWciOagh+iusOiuvue9ru+8iOWmguWchuWciOagh+iusOW3suetvuWIsOaXpeacn++8ie+8jOivpeiuvue9ruS4jueCueagh+iusOiuvue9ruS6kuaWpVxuICAgICAgY2lyY2xlOiB0cnVlIC8vIOW+heWKnlxuICAgIH0pO1xuICAgIGlmICh0aGlzLmRhdGEuc3RhcnREYXlzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBkYXlzID0gW10gYXMgRGF0ZVtdXG4gICAgICB0aGlzLmRhdGEuc3RhcnREYXlzLmZvckVhY2goKG86IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICBkYXlzLnB1c2goZm9ybWF0RGF0ZShvKSlcbiAgICAgIH0pXG4gICAgICB0aGlzLmNhbGVuZGFyLnNldFRvZG9MYWJlbHMoe1xuICAgICAgICBkYXlzOiBkYXlzXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDms6jlhozlm57osIPlh73mlbBcbiAgICAgIHRoaXMuYWZ0ZXJMb2FkRGF0YUNhbGxiYWNrID0gKHJlcykgPT4ge1xuICAgICAgICBsZXQgZGF5cyA9IFtdIGFzIERhdGVbXVxuICAgICAgICByZXMuTFMuZm9yRWFjaCgobzogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgZGF5cy5wdXNoKGZvcm1hdERhdGUobykpO1xuICAgICAgICB9KVxuICAgICAgICB0aGlzLmNhbGVuZGFyLnNldFRvZG9MYWJlbHMoe1xuICAgICAgICAgIGRheXM6IGRheXNcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG9uU2hvdygpIHtcblxuICB9LFxuICBhZnRlclRhcERheShlKSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgfSxcbiAgYmluZEFkZERldGFpbFRhcChlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpc1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnLi90YXNrZGV0YWlsJyxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICByZXR1cm5EZXRhaWw6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICBfdGhpcy5sb2FkRGF0YSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgcmVzLmV2ZW50Q2hhbm5lbC5lbWl0KCdvcGVuRGV0YWlsJywge1xuICAgICAgICAgIGRhdGE6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVwdElkOiBfdGhpcy5kYXRhLmRlcHRJZCxcbiAgICAgICAgICAgIGRlcHROYW1lOiBfdGhpcy5kYXRhLmRlcHROYW1lLFxuICAgICAgICAgICAgbGVhZGVySWQ6IF90aGlzLmRhdGEubGVhZGVySWQsXG4gICAgICAgICAgICBsZWFkZXI6IF90aGlzLmRhdGEubGVhZGVyXG4gICAgICAgICAgfSwgaXNOZXc6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kRWRpdERldGFpbFRhcChlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpc1xuICAgIGxldCBpbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XG4gICAgY29uc29sZS5sb2coaW5kZXgpXG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcuL3Rhc2tkZXRhaWwnLFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIHJldHVybkRldGFpbDogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIF90aGlzLmxvYWREYXRhKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICBsZXQgY3VycmVudE9iamVjdCA9IF90aGlzLmRhdGEuZGF0YUxpc3RbaW5kZXhdO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGN1cnJlbnRPYmplY3QpXG4gICAgICAgIHJlcy5ldmVudENoYW5uZWwuZW1pdCgnb3BlbkRldGFpbCcsIHtcbiAgICAgICAgICBkYXRhOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlcHRJZDogX3RoaXMuZGF0YS5kZXB0SWQsXG4gICAgICAgICAgICBkZXB0TmFtZTogX3RoaXMuZGF0YS5kZXB0TmFtZSxcbiAgICAgICAgICAgIGlkOiBjdXJyZW50T2JqZWN0LmlkLFxuICAgICAgICAgICAgbmFtZTogY3VycmVudE9iamVjdC5uYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGN1cnJlbnRPYmplY3QuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBsZWFkZXJJZDogY3VycmVudE9iamVjdC5sZWFkZXJJZCxcbiAgICAgICAgICAgIGxlYWRlcjogY3VycmVudE9iamVjdC5sZWFkZXIsXG4gICAgICAgICAgICBwbGFubmVkU3RhcnREYXRlOiBjdXJyZW50T2JqZWN0LnBsYW5uZWRTdGFydERhdGUsXG4gICAgICAgICAgICBwbGFubmVkU3RhcnRUaW1lOiBjdXJyZW50T2JqZWN0LnBsYW5uZWRTdGFydFRpbWUsXG4gICAgICAgICAgICBwbGFubmVkRmluaXNoRGF0ZTogY3VycmVudE9iamVjdC5wbGFubmVkRmluaXNoRGF0ZSxcbiAgICAgICAgICAgIHBsYW5uZWRGaW5pc2hUaW1lOiBjdXJyZW50T2JqZWN0LnBsYW5uZWRGaW5pc2hUaW1lLFxuICAgICAgICAgICAgYWN0dWFsU3RhcnREYXRlOiBjdXJyZW50T2JqZWN0LmFjdHVhbFN0YXJ0RGF0ZSxcbiAgICAgICAgICAgIGFjdHVhbFN0YXJ0VGltZTogY3VycmVudE9iamVjdC5hY3R1YWxTdGFydFRpbWUsXG4gICAgICAgICAgICBhY3R1YWxGaW5pc2hEYXRlOiBjdXJyZW50T2JqZWN0LmFjdHVhbEZpbmlzaERhdGUsXG4gICAgICAgICAgICBhY3R1YWxGaW5pc2hUaW1lOiBjdXJyZW50T2JqZWN0LmFjdHVhbEZpbmlzaFRpbWUsXG4gICAgICAgICAgICBsb2NhdGlvbjogY3VycmVudE9iamVjdC5sb2NhdGlvblxuICAgICAgICAgIH0sIGlzTmV3OiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGxvYWREYXRhKCkge1xuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9XZUNoYXRPcGVuL2FwaS9wcmcyNmM0NTBhYzI0ZjQvam9idGFzaycsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9wZW5pZDogYXBwLmdsb2JhbERhdGEub3BlbklkLFxuICAgICAgICBzZXNzaW9ua2V5OiBhcHAuZ2xvYmFsRGF0YS5zZXNzaW9uS2V5LFxuICAgICAgICBlbXBsb3llZWlkOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkXG4gICAgICB9XG4gICAgICBoZWFkZXI6IHtcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlcy5kYXRhKVxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBkYXRhTGlzdDogcmVzLmRhdGEuZGF0YSxcbiAgICAgICAgICBzdGFydERheXM6IHJlcy5kYXRhLkxTXG4gICAgICAgIH0pXG4gICAgICAgIGlmICh0aGlzLmFmdGVyTG9hZERhdGFDYWxsYmFjaykge1xuICAgICAgICAgIHRoaXMuYWZ0ZXJMb2FkRGF0YUNhbGxiYWNrKHJlcy5kYXRhKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZmFpbDogZmFpbCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufSlcbiJdfQ==