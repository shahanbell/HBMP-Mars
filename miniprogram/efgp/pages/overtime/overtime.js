"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var d = new Date();
Page({
    data: {
        formTypes: [{
                formType: '1',
                formTypeDesc: '平日加班'
            }, {
                formType: '2',
                formTypeDesc: '双休加班'
            }, {
                formType: '3',
                formTypeDesc: '法定假日加班'
            }],
        formType: '1',
        formTypeDesc: '平日加班',
        detailList: [],
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        canSubmit: false,
        employees: '',
        isOverdue: false,
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
    },
    bindDeptSelect: function (e) {
        var _this = this;
        wx.navigateTo({
            url: '../../../pages/deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
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
    onChange: function (e) {
        this.setData({
            formType: e.detail,
        });
        console.log("当前选择了" + e.detail);
    },
    bindAddDetailTap: function (e) {
        var _this = this;
        wx.navigateTo({
            url: './overdetail',
            events: {
                returnDetail: function (res) {
                    var details = _this.data.detailList;
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
                        content: currentObject.content,
                        listEmployees: currentObject.listEmployees
                    }, isNew: false
                });
            }
        });
    },
    bindRemoveDetailTap: function (e) {
        var details = this.data.detailList;
        var index = e.currentTarget.dataset.index;
        details.splice(index, 1);
        details.forEach(function (o, i) {
            o.seq = i + 1;
        });
        this.setData({
            detailList: details
        });
    },
    onChange1: function (event) {
        var index = event.target.dataset.index;
        var _this = this;
        _this.data.detailList.forEach(function (o, i) {
            console.info('进入循环');
            if (o.seq == index) {
                console.info('进入判断');
                o.openFold = event.detail;
            }
        });
        _this.setData({
            detailList: this.data.detailList
        });
    },
    bindIsOverdueChange: function (e) {
        this.setData({
            isOverdue: e.detail
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
        if (!this.data.detailList) {
            canSubmit = false;
            errmsg += "请填写明细资料\r\n";
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
                        var index = 0;
                        var detailDatas = [];
                        _this_1.data.detailList.forEach(function (o, i) {
                            o.listEmployees.forEach(function (m, index) {
                                index = index + 1;
                                detailDatas.push(__assign({ seq: index }, o, { employeeId: m.id, employeeName: m.id + '-' + m.userName }));
                            });
                        });
                        console.info('detaillist==' + JSON.stringify(detailDatas));
                        wx.request({
                            url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl034/wechat?' + app.globalData.restAuth,
                            data: {
                                employee: _this_1.data.employeeId,
                                formType: _this_1.data.formType,
                                formTypeDesc: _this_1.data.formTypeDesc,
                                overdue: _this_1.data.isOverdue ? "Y" : "N",
                                detailList: detailDatas
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcnRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdmVydGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtBQUNsQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixTQUFTLEVBQUUsQ0FBQztnQkFDVixRQUFRLEVBQUUsR0FBRztnQkFDYixZQUFZLEVBQUUsTUFBTTthQUNyQixFQUFFO2dCQUNELFFBQVEsRUFBRSxHQUFHO2dCQUNiLFlBQVksRUFBRSxNQUFNO2FBQ3JCLEVBQUU7Z0JBQ0QsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsWUFBWSxFQUFFLFFBQVE7YUFDdkIsQ0FBQztRQUNGLFFBQVEsRUFBRSxHQUFHO1FBQ2IsWUFBWSxFQUFFLE1BQU07UUFDcEIsVUFBVSxFQUFFLEVBQVM7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLFNBQVMsRUFBQyxFQUFFO1FBQ1osU0FBUyxFQUFDLEtBQUs7S0FDaEI7SUFDRCxNQUFNO1FBQ0osRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNiLEtBQUssRUFBRSxTQUFTO1NBQ2pCLENBQUMsQ0FBQTtRQUNGLFVBQVUsQ0FBQztZQUNULEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNsQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDUixJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQzdCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVTtnQkFDckMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMs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R0FBRztnQ0FDdEMsVUFBVSxFQUFFLFdBQVc7NkJBQ3hCOzRCQUNELE1BQU0sRUFBRTtnQ0FDTixjQUFjLEVBQUUsa0JBQWtCOzZCQUNuQzs0QkFDRCxNQUFNLEVBQUUsTUFBTTs0QkFDZCxPQUFPLEVBQUUsVUFBQSxHQUFHO2dDQUNWLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtnQ0FDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQ0FDWCxLQUFLLEVBQUUsTUFBTTtvQ0FDYixPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHO29DQUNyQixVQUFVLEVBQUUsS0FBSztvQ0FDakIsT0FBTyxZQUFDLEdBQUc7d0NBQ1QsRUFBRSxDQUFDLFNBQVMsQ0FBQzs0Q0FDWCxHQUFHLEVBQUUsb0JBQW9CO3lDQUMxQixDQUFDLENBQUE7b0NBQ0osQ0FBQztpQ0FDRixDQUFDLENBQUE7NEJBQ0osQ0FBQzs0QkFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dDQUNSLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQ0FDakIsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQ0FDWCxLQUFLLEVBQUUsTUFBTTtvQ0FDYixPQUFPLEVBQUUsU0FBUyxHQUFHLElBQUk7b0NBQ3pCLFVBQVUsRUFBRSxLQUFLO2lDQUNsQixDQUFDLENBQUE7NEJBQ0osQ0FBQzt5QkFDRixDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztJQUNELFNBQVM7SUFFVCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vLi4vYXBwJ1xyXG5cclxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxyXG5sZXQgZCA9IG5ldyBEYXRlKClcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgZm9ybVR5cGVzOiBbe1xyXG4gICAgICBmb3JtVHlwZTogJzEnLFxyXG4gICAgICBmb3JtVHlwZURlc2M6ICflubPml6XliqDnj60nXHJcbiAgICB9LCB7XHJcbiAgICAgIGZvcm1UeXBlOiAnMicsXHJcbiAgICAgIGZvcm1UeXBlRGVzYzogJ+WPjOS8keWKoOePrSdcclxuICAgIH0sIHtcclxuICAgICAgZm9ybVR5cGU6ICczJyxcclxuICAgICAgZm9ybVR5cGVEZXNjOiAn5rOV5a6a5YGH5pel5Yqg54+tJ1xyXG4gICAgfV0sXHJcbiAgICBmb3JtVHlwZTogJzEnLFxyXG4gICAgZm9ybVR5cGVEZXNjOiAn5bmz5pel5Yqg54+tJyxcclxuICAgIGRldGFpbExpc3Q6IFtdIGFzIGFueSxcclxuICAgIGVtcGxveWVlSWQ6IG51bGwsXHJcbiAgICBlbXBsb3llZU5hbWU6IG51bGwsXHJcbiAgICBkZXB0SWQ6IG51bGwsXHJcbiAgICBkZXB0TmFtZTogbnVsbCxcclxuICAgIGNhblN1Ym1pdDogZmFsc2UsXHJcbiAgICBlbXBsb3llZXM6JycsXHJcbiAgICBpc092ZXJkdWU6ZmFsc2UsXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgIHRpdGxlOiAnTG9hZGluZydcclxuICAgIH0pXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgfSwgMjAwMClcclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGVtcGxveWVlSWQ6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgICAgZW1wbG95ZWVOYW1lOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZU5hbWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGRlcHRJZDogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCxcclxuICAgICAgICBkZXB0TmFtZTogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCArICctJyArIGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmluZERlcHRTZWxlY3QoZSkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4uLy4uLy4uL3BhZ2VzL2RlcHRTZWxlY3QvZGVwdFNlbGVjdD9lbXBsb3llZWlkPScgKyBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICBldmVudHM6IHtcclxuICAgICAgICByZXR1cm5EZXB0U2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBkZXB0SWQ6IHJlcy5rLFxyXG4gICAgICAgICAgICAgIGRlcHROYW1lOiByZXMuayArICctJyArIHJlcy52XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICBvbkNoYW5nZShlKXtcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIGZvcm1UeXBlOmUuZGV0YWlsLFxyXG4gICAgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIuW9k+WJjemAieaLqeS6hlwiK2UuZGV0YWlsKVxyXG4gIH0sXHJcbiAgYmluZEFkZERldGFpbFRhcChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi9vdmVyZGV0YWlsJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuRGV0YWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBsZXQgZGV0YWlscyA9IF90aGlzLmRhdGEuZGV0YWlsTGlzdFxyXG4gICAgICAgICAgZGV0YWlscy5wdXNoKHJlcy5kYXRhKVxyXG4gICAgICAgICAgZGV0YWlscy5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIG8uc2VxID0gaSArIDFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICBcclxuICAgICAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBkZXRhaWxMaXN0OiBkZXRhaWxzLFxyXG4gICAgICAgICAgICBjYW5TdWJtaXQ6IHRydWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIHJlcy5ldmVudENoYW5uZWwuZW1pdCgnb3BlbkRldGFpbCcsIHtcclxuICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGVtcGxveWVlSWQ6IF90aGlzLmRhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgICAgICAgZW1wbG95ZWVOYW1lOiBfdGhpcy5kYXRhLmVtcGxveWVlTmFtZSxcclxuICAgICAgICAgICAgZGVwdElkOiBfdGhpcy5kYXRhLmRlcHRJZCxcclxuICAgICAgICAgICAgZGVwdE5hbWU6IF90aGlzLmRhdGEuZGVwdE5hbWVcclxuICAgICAgICAgIH0sIGlzTmV3OiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRFZGl0RGV0YWlsVGFwKGUpIHtcclxuICAgIGxldCBfdGhpcyA9IHRoaXNcclxuICAgIGxldCBpbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi9vdmVyZGV0YWlsJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuRGV0YWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBsZXQgZGV0YWlscyA9IF90aGlzLmRhdGEuZGV0YWlsTGlzdFxyXG4gICAgICAgICAgZGV0YWlscy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgICAgICBkZXRhaWxzLnB1c2gocmVzLmRhdGEpXHJcbiAgICAgICAgICBkZXRhaWxzLmZvckVhY2goKG8sIGkpID0+IHtcclxuICAgICAgICAgICAgby5zZXEgPSBpICsgMVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgICAgZGV0YWlsTGlzdDogZGV0YWlscyxcclxuICAgICAgICAgICAgY2FuU3VibWl0OiB0cnVlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICBsZXQgY3VycmVudE9iamVjdCA9IF90aGlzLmRhdGEuZGV0YWlsTGlzdFtpbmRleF1cclxuICAgICAgICByZXMuZXZlbnRDaGFubmVsLmVtaXQoJ29wZW5EZXRhaWwnLCB7XHJcbiAgICAgICAgICBkYXRhOlxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBlbXBsb3llZUlkOiBjdXJyZW50T2JqZWN0LmVtcGxveWVlSWQsXHJcbiAgICAgICAgICAgIGVtcGxveWVlTmFtZTogY3VycmVudE9iamVjdC5lbXBsb3llZU5hbWUsXHJcbiAgICAgICAgICAgIGRlcHRJZDogY3VycmVudE9iamVjdC5kZXB0SWQsXHJcbiAgICAgICAgICAgIGRlcHROYW1lOiBjdXJyZW50T2JqZWN0LmRlcHROYW1lLFxyXG4gICAgICAgICAgICBsdW5jaDogY3VycmVudE9iamVjdC5sdW5jaCxcclxuICAgICAgICAgICAgZGlubmVyOiBjdXJyZW50T2JqZWN0LmRpbm5lcixcclxuICAgICAgICAgICAgZGF0ZTE6IGN1cnJlbnRPYmplY3QuZGF0ZTEsXHJcbiAgICAgICAgICAgIHRpbWUxOiBjdXJyZW50T2JqZWN0LnRpbWUxLFxyXG4gICAgICAgICAgICB0aW1lMjogY3VycmVudE9iamVjdC50aW1lMixcclxuICAgICAgICAgICAgaG91cjogY3VycmVudE9iamVjdC5ob3VyLFxyXG4gICAgICAgICAgICBjb250ZW50OiBjdXJyZW50T2JqZWN0LmNvbnRlbnQsXHJcbiAgICAgICAgICAgIGxpc3RFbXBsb3llZXM6IGN1cnJlbnRPYmplY3QubGlzdEVtcGxveWVlc1xyXG4gICAgICAgICAgfSwgaXNOZXc6IGZhbHNlXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRSZW1vdmVEZXRhaWxUYXAoZSkge1xyXG4gICAgbGV0IGRldGFpbHMgPSB0aGlzLmRhdGEuZGV0YWlsTGlzdFxyXG4gICAgbGV0IGluZGV4ID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcclxuICAgIGRldGFpbHMuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgZGV0YWlscy5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgIG8uc2VxID0gaSArIDFcclxuICAgIH0pXHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgZGV0YWlsTGlzdDogZGV0YWlsc1xyXG4gICAgfSlcclxuICB9LFxyXG4gIG9uQ2hhbmdlMShldmVudCl7XHJcbiAgICB2YXIgaW5kZXggPSBldmVudC50YXJnZXQuZGF0YXNldC5pbmRleDtcclxuICAgIHZhciBfdGhpcz10aGlzXHJcbiAgICBfdGhpcy5kYXRhLmRldGFpbExpc3QuZm9yRWFjaChmdW5jdGlvbiAobywgaSkge1xyXG4gICAgICBjb25zb2xlLmluZm8oJ+i/m+WFpeW+queOrycpXHJcbiAgICAgIGlmIChvLnNlcSA9PSBpbmRleCkge1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbygn6L+b5YWl5Yik5patJylcclxuICAgICAgICBvLm9wZW5Gb2xkID0gZXZlbnQuZGV0YWlsO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICBkZXRhaWxMaXN0OiB0aGlzLmRhdGEuZGV0YWlsTGlzdFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBiaW5kSXNPdmVyZHVlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIGlzT3ZlcmR1ZTogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgZm9ybVN1Ym1pdChlKSB7XHJcbiAgICBsZXQgY2FuU3VibWl0ID0gdHJ1ZVxyXG4gICAgbGV0IGVycm1zZyA9ICcnXHJcbiAgICBpZiAoIWFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9ICfotKblj7fmnKrmjojmnYNcXHJcXG4nXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5lbXBsb3llZUlkIHx8IHRoaXMuZGF0YS5lbXBsb3llZUlkID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+35aGr5YaZ55Sz6K+35Lq65ZGYXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmRhdGEuZGVwdElkIHx8IHRoaXMuZGF0YS5kZXB0SWQgPT0gJycpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ55Sz6K+36YOo6ZeoXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLmRldGFpbExpc3QpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ5piO57uG6LWE5paZXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmIChjYW5TdWJtaXQpIHtcclxuICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ1NlbmRpbmcnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC8v5piO57uG5ouG5YiGXHJcbiAgICAgICAgICAgIHZhciBpbmRleD0wO1xyXG4gICAgICAgICAgICB2YXIgZGV0YWlsRGF0YXM9W107XHJcbiAgICAgICAgICAgIF90aGlzLmRhdGEuZGV0YWlsTGlzdC5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgby5saXN0RW1wbG95ZWVzLmZvckVhY2goKG0saW5kZXgpPT57XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4KzE7XHJcbiAgICAgICAgICAgICAgICBkZXRhaWxEYXRhcy5wdXNoKHsgc2VxOiBpbmRleCwgLi4ubywgZW1wbG95ZWVJZDogbS5pZCwgZW1wbG95ZWVOYW1lOiBtLmlkICsnLScrIG0udXNlck5hbWV9KTtcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ2RldGFpbGxpc3Q9PScgKyBKU09OLnN0cmluZ2lmeShkZXRhaWxEYXRhcykpXHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArJy9IYW5iZWxsLUpSUy9hcGkvZWZncC9oa2dsMDM0L3dlY2hhdD8nICsgYXBwLmdsb2JhbERhdGEucmVzdEF1dGgsXHJcbiAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgZW1wbG95ZWU6IF90aGlzLmRhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgICAgICAgICAgIGZvcm1UeXBlOiBfdGhpcy5kYXRhLmZvcm1UeXBlLFxyXG4gICAgICAgICAgICAgICAgZm9ybVR5cGVEZXNjOiBfdGhpcy5kYXRhLmZvcm1UeXBlRGVzYyxcclxuICAgICAgICAgICAgICAgIG92ZXJkdWU6X3RoaXMuZGF0YS5pc092ZXJkdWUgPyBcIllcIjpcIk5cIixcclxuICAgICAgICAgICAgICAgIGRldGFpbExpc3Q6IGRldGFpbERhdGFzXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+a2iOaBrycsXHJcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLm1zZyxcclxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvcGFnZXMvaW5kZXgvaW5kZXhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi6K+36IGU57O7566h55CG5ZGYOlwiICsgZmFpbCxcclxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6IGVycm1zZyxcclxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZm9ybVJlc2V0KCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2Zvcm3lj5HnlJ/kuoZyZXNldOS6i+S7ticpO1xyXG4gIH1cclxufSlcclxuIl19