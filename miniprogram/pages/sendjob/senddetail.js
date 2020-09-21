"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var eventChannel;
var restUrl;
var d = new Date();
Page({
    data: {
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        stationid: null,
        stationname: '',
        repairmanid: null,
        repairmanname: '',
        repairmanname2: '',
        date1: d.toISOString().substring(0, 10),
        date2: d.toISOString().substring(0, 10),
        date3: d.toISOString().substring(0, 10),
        date4: d.toISOString().substring(0, 10),
        assignmentcode: '1.转维修站',
        hour: 0.5,
        content: '',
        keyuser: '',
        isNew: false,
        repairer: ''
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
                    employeeId: res.data.employeeId,
                    employeeName: res.data.employeeName,
                    deptId: res.data.deptId,
                    deptName: res.data.deptName,
                    date1: res.data.date1,
                    date2: res.data.date2,
                    date3: res.data.date3,
                    date4: res.data.date4,
                    stationname: res.data.stationname,
                    repairmanname: res.data.repairmanname,
                    repairmanname2: res.data.repairmanname2,
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
    bindStation: function (e) {
        var _this = this;
        wx.navigateTo({
            url: './stationKind',
            events: {
                returnStation: function (res) {
                    if (res) {
                        console.log(res);
                        _this.setData({
                            stationid: res.k,
                            stationname: res.k + '-' + res.v
                        });
                    }
                }
            },
        });
    },
    bindRepairman: function (e) {
        var _this = this;
        wx.navigateTo({
            url: '../customercomplaint/select?type=' + 'repairman&id=' + this.data.stationid,
            events: {
                returnRepairmanSelect: function (res) {
                    if (res) {
                        console.log(res);
                        if (_this.data.repairmanname2 == "") {
                            _this.setData({
                                repairmanname2: res.key + '-' + res.value,
                                repairmanid: res.key,
                                repairmanname: res.key + '-' + res.value
                            });
                        }
                        else if (_this.data.repairmanname2.indexOf(res.key) < 0) {
                            _this.setData({
                                repairmanname2: _this.data.repairmanname2 + ";" + res.key + '-' + res.value
                            });
                        }
                    }
                }
            },
        });
    },
    bindDate1Change: function (e) {
        this.setData({
            date1: e.detail.value
        });
    },
    bindDate2Change: function (e) {
        this.setData({
            date2: e.detail.value
        });
    },
    bindDate3Change: function (e) {
        this.setData({
            date3: e.detail.value
        });
    },
    bindDate4Change: function (e) {
        this.setData({
            date4: e.detail.value
        });
    },
    bindRepairmannameChange: function (e) {
        this.setData({
            repairmanname: e.detail.value
        });
    },
    bindRepairmanname2Change: function (e) {
        this.setData({
            repairmanname2: e.detail.value
        });
    },
    formSubmit: function (e) {
        var canSubmit = true;
        var errmsg = '';
        if (!this.data.stationname || this.data.stationname == '') {
            canSubmit = false;
            errmsg += '请输入站别编号';
        }
        if (!this.data.repairmanname || this.data.repairmanname == '') {
            canSubmit = false;
            errmsg += '请输入主要维修人员';
        }
        if (canSubmit) {
            var newObject = {
                employeeId: this.data.employeeId,
                employeeName: this.data.employeeName,
                deptId: this.data.deptId,
                deptName: this.data.deptName,
                seq: -1,
                assignmentcode: this.data.assignmentcode,
                date1: this.data.date1,
                date2: this.data.date2,
                date3: this.data.date3,
                date4: this.data.date4,
                stationname: this.data.stationname,
                repairmanname: this.data.repairmanname,
                repairmanname2: this.data.repairmanname2
            };
            eventChannel = this.getOpenerEventChannel();
            eventChannel.emit('returnSendjobDetail', { data: newObject, isNew: this.data.isNew });
            wx.navigateBack({
                delta: 1
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZGRldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlbmRkZXRhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUM1QixJQUFJLFlBQVksQ0FBQTtBQUNoQixJQUFJLE9BQWUsQ0FBQztBQUNwQixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0FBQ2xCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxTQUFTLEVBQUUsSUFBSTtRQUNmLFdBQVcsRUFBRSxFQUFFO1FBQ2YsV0FBVyxFQUFFLElBQUk7UUFDakIsYUFBYSxFQUFFLEVBQUU7UUFDakIsY0FBYyxFQUFFLEVBQUU7UUFHbEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUN2QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ3ZDLEtBQUssRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDdkMsS0FBSyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUd2QyxjQUFjLEVBQUUsUUFBUTtRQUN4QixJQUFJLEVBQUUsR0FBYTtRQUNuQixPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBQyxFQUFFO1FBQ1YsS0FBSyxFQUFFLEtBQUs7UUFDWixRQUFRLEVBQUMsRUFBRTtLQUNaO0lBQ0QsTUFBTTtRQUFOLG1CQW9DQztRQW5DQyxFQUFFLENBQUMsV0FBVyxDQUFDO1lB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QyxDQUFBO1NBQ0g7YUFBTTtZQUNMLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsVUFBVSxFQUFFLEtBQUs7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9vdmVyZGV0YWlsLnRzXHJcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IGV2ZW50Q2hhbm5lbFxyXG5sZXQgcmVzdFVybDogc3RyaW5nO1xyXG5sZXQgZCA9IG5ldyBEYXRlKClcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgZW1wbG95ZWVJZDogbnVsbCxcclxuICAgIGVtcGxveWVlTmFtZTogbnVsbCxcclxuICAgIGRlcHRJZDogbnVsbCxcclxuICAgIGRlcHROYW1lOiBudWxsLFxyXG4gICAgc3RhdGlvbmlkOiBudWxsLFxyXG4gICAgc3RhdGlvbm5hbWU6ICcnLFxyXG4gICAgcmVwYWlybWFuaWQ6IG51bGwsXHJcbiAgICByZXBhaXJtYW5uYW1lOiAnJyxcclxuICAgIHJlcGFpcm1hbm5hbWUyOiAnJyxcclxuICAgLy8gbHVuY2g6IGZhbHNlLFxyXG4gICAvLyBkaW5uZXI6IGZhbHNlLFxyXG4gICAgZGF0ZTE6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxyXG4gICAgZGF0ZTI6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxyXG4gICAgZGF0ZTM6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxyXG4gICAgZGF0ZTQ6IGQudG9JU09TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLFxyXG4gICAvLyB0aW1lMTogXCIwODowMFwiLFxyXG4gIC8vICB0aW1lMjogXCIxNzoxMFwiLFxyXG4gICAgYXNzaWdubWVudGNvZGU6ICcxLui9rOe7tOS/ruermScsXHJcbiAgICBob3VyOiAwLjUgYXMgbnVtYmVyLFxyXG4gICAgY29udGVudDogJycsXHJcbiAgICBrZXl1c2VyOicnLFxyXG4gICAgaXNOZXc6IGZhbHNlLFxyXG4gICAgcmVwYWlyZXI6JydcclxuICB9LFxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgdGl0bGU6ICfliqDovb3kuK0nLFxyXG4gICAgfSlcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICB9LCAyMDAwKVxyXG4gICAgZXZlbnRDaGFubmVsID0gdGhpcy5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxyXG4gICAgZXZlbnRDaGFubmVsLm9uKCdvcGVuRGV0YWlsJywgKHJlcykgPT4ge1xyXG4gICAgICBpZiAocmVzLmlzTmV3KSB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBlbXBsb3llZUlkOiByZXMuZGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgZW1wbG95ZWVOYW1lOiByZXMuZGF0YS5lbXBsb3llZU5hbWUsXHJcbiAgICAgICAgICBkZXB0SWQ6IHJlcy5kYXRhLmRlcHRJZCxcclxuICAgICAgICAgZGVwdE5hbWU6IHJlcy5kYXRhLmRlcHROYW1lLFxyXG4gICAgICAgICAgaXNOZXc6IHJlcy5pc05ld1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBlbXBsb3llZUlkOiByZXMuZGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgZW1wbG95ZWVOYW1lOiByZXMuZGF0YS5lbXBsb3llZU5hbWUsXHJcbiAgICAgICAgICBkZXB0SWQ6IHJlcy5kYXRhLmRlcHRJZCxcclxuICAgICAgICAgIGRlcHROYW1lOiByZXMuZGF0YS5kZXB0TmFtZSxcclxuXHJcbiAgICAgICAgICBkYXRlMTogcmVzLmRhdGEuZGF0ZTEsXHJcbiAgICAgICAgICBkYXRlMjogcmVzLmRhdGEuZGF0ZTIsXHJcbiAgICAgICAgICBkYXRlMzogcmVzLmRhdGEuZGF0ZTMsXHJcbiAgICAgICAgICBkYXRlNDogcmVzLmRhdGEuZGF0ZTQsXHJcblxyXG4gICAgICAgICAgc3RhdGlvbm5hbWU6IHJlcy5kYXRhLnN0YXRpb25uYW1lLFxyXG4gICAgICAgICAgcmVwYWlybWFubmFtZTogcmVzLmRhdGEucmVwYWlybWFubmFtZSxcclxuICAgICAgICAgIHJlcGFpcm1hbm5hbWUyOiByZXMuZGF0YS5yZXBhaXJtYW5uYW1lMixcclxuICAgICAgICAgIGlzTmV3OiByZXMuaXNOZXdcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZERlcHRTZWxlY3QoZSkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4uL2RlcHRTZWxlY3QvZGVwdFNlbGVjdD9lbXBsb3llZWlkPScgKyBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICBldmVudHM6IHtcclxuICAgICAgICByZXR1cm5EZXB0U2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBkZXB0SWQ6IHJlcy5rLFxyXG4gICAgICAgICAgICAgIGRlcHROYW1lOiByZXMuayArICctJyArIHJlcy52XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRTdGF0aW9uKGUpIHtcclxuICAgIGxldCBfdGhpcyA9IHRoaXNcclxuICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICB1cmw6ICcuL3N0YXRpb25LaW5kJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuU3RhdGlvbjogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBzdGF0aW9uaWQ6IHJlcy5rLFxyXG4gICAgICAgICAgICAgIHN0YXRpb25uYW1lOiByZXMuayArICctJyArIHJlcy52XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRSZXBhaXJtYW4oZSkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4uL2N1c3RvbWVyY29tcGxhaW50L3NlbGVjdD90eXBlPScgKyAncmVwYWlybWFuJmlkPScgKyB0aGlzLmRhdGEuc3RhdGlvbmlkLFxyXG4gICAgICBldmVudHM6IHtcclxuICAgICAgICByZXR1cm5SZXBhaXJtYW5TZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgaWYgKF90aGlzLmRhdGEucmVwYWlybWFubmFtZTIgPT0gXCJcIil7XHJcbiAgICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgICAgcmVwYWlybWFubmFtZTI6IHJlcy5rZXkgKyAnLScgKyByZXMudmFsdWUsXHJcbiAgICAgICAgICAgICAgICByZXBhaXJtYW5pZDogcmVzLmtleSxcclxuICAgICAgICAgICAgICAgIHJlcGFpcm1hbm5hbWU6IHJlcy5rZXkgKyAnLScgKyByZXMudmFsdWVcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKF90aGlzLmRhdGEucmVwYWlybWFubmFtZTIuaW5kZXhPZihyZXMua2V5KTwwKXtcclxuICAgICAgICAgICAgICBfdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICAgICAgICByZXBhaXJtYW5uYW1lMjogX3RoaXMuZGF0YS5yZXBhaXJtYW5uYW1lMiArIFwiO1wiICsgcmVzLmtleSArICctJyArIHJlcy52YWx1ZVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZERhdGUxQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBkYXRlMTogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRGF0ZTJDaGFuZ2UoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIGRhdGUyOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmREYXRlM0NoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgZGF0ZTM6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZERhdGU0Q2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBkYXRlNDogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kUmVwYWlybWFubmFtZUNoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgcmVwYWlybWFubmFtZTogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kUmVwYWlybWFubmFtZTJDaGFuZ2UoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHJlcGFpcm1hbm5hbWUyOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGZvcm1TdWJtaXQoZSkge1xyXG4gICAgbGV0IGNhblN1Ym1pdCA9IHRydWVcclxuICAgIGxldCBlcnJtc2cgPSAnJ1xyXG4gICAgaWYgKCF0aGlzLmRhdGEuc3RhdGlvbm5hbWUgfHx0aGlzLmRhdGEuc3RhdGlvbm5hbWUgPT0gJycpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9ICfor7fovpPlhaXnq5nliKvnvJblj7cnXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5yZXBhaXJtYW5uYW1lIHx8IHRoaXMuZGF0YS5yZXBhaXJtYW5uYW1lID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+36L6T5YWl5Li76KaB57u05L+u5Lq65ZGYJ1xyXG4gICAgfVxyXG4gICAgaWYgKGNhblN1Ym1pdCkge1xyXG4gICAgICBsZXQgbmV3T2JqZWN0ID0ge1xyXG4gICAgICAgIGVtcGxveWVlSWQ6IHRoaXMuZGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgIGVtcGxveWVlTmFtZTogdGhpcy5kYXRhLmVtcGxveWVlTmFtZSxcclxuICAgICAgICBkZXB0SWQ6IHRoaXMuZGF0YS5kZXB0SWQsXHJcbiAgICAgICAgZGVwdE5hbWU6IHRoaXMuZGF0YS5kZXB0TmFtZSxcclxuICAgICAgICBzZXE6IC0xLFxyXG4gICAgICAgIGFzc2lnbm1lbnRjb2RlOiB0aGlzLmRhdGEuYXNzaWdubWVudGNvZGUsXHJcbiAgICAgICAgZGF0ZTE6IHRoaXMuZGF0YS5kYXRlMSxcclxuICAgICAgICBkYXRlMjogdGhpcy5kYXRhLmRhdGUyLFxyXG4gICAgICAgIGRhdGUzOiB0aGlzLmRhdGEuZGF0ZTMsXHJcbiAgICAgICAgZGF0ZTQ6IHRoaXMuZGF0YS5kYXRlNCxcclxuICAgICAgICBzdGF0aW9ubmFtZTogdGhpcy5kYXRhLnN0YXRpb25uYW1lLFxyXG4gICAgICAgIHJlcGFpcm1hbm5hbWU6IHRoaXMuZGF0YS5yZXBhaXJtYW5uYW1lLFxyXG4gICAgICAgIHJlcGFpcm1hbm5hbWUyOiB0aGlzLmRhdGEucmVwYWlybWFubmFtZTJcclxuICAgICAgfVxyXG4gICAgICBldmVudENoYW5uZWwgPSB0aGlzLmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5TZW5kam9iRGV0YWlsJywgeyBkYXRhOiBuZXdPYmplY3QsIGlzTmV3OiB0aGlzLmRhdGEuaXNOZXcgfSlcclxuICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICBkZWx0YTogMVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogZXJybXNnLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=