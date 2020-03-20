"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var d = new Date();
Page({
    data: {
        formTypes: [
            { k: '1', v: '平日加班' },
            { k: '2', v: '双休加班' },
            { k: '3', v: '节日加班' }
        ],
        selectedType: '1',
        formType: '1',
        formTypeDesc: '平日加班',
        detailList: [],
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
    bindFormTypeChange: function (e) {
        if (e.detail.value == '1') {
            this.setData({
                formType: '1',
                formTypeDesc: '平日加班',
                selectedType: e.detail.value
            });
        }
        else if (e.detail.value == '2') {
            this.setData({
                formType: '2',
                formTypeDesc: '双休加班',
                selectedType: e.detail.value
            });
        }
        else {
            this.setData({
                formType: '3',
                formTypeDesc: '节日加班',
                selectedType: e.detail.value
            });
        }
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
                        content: currentObject.content
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
                        wx.request({
                            url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl034/wechat?' + app.globalData.restAuth,
                            data: {
                                employee: _this_1.data.employeeId,
                                formType: _this_1.data.formType,
                                formTypeDesc: _this_1.data.formTypeDesc,
                                detailList: _this_1.data.detailList
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcnRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdmVydGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7QUFDbEIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osU0FBUyxFQUFFO1lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7WUFDckIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7WUFDckIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7U0FDdEI7UUFDRCxZQUFZLEVBQUUsR0FBRztRQUNqQixRQUFRLEVBQUUsR0FBRztRQUNiLFlBQVksRUFBRSxNQUFNO1FBQ3BCLFVBQVUsRUFBRSxFQUFTO1FBQ3JCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxTQUFTLEVBQUUsS0FBSztLQUNqQjtJQUNELE1BQU07UUFDSixFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ2IsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFBO1FBQ0YsVUFBVSxDQUFDO1lBQ1QsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNSLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2dCQUNyQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZO2FBQzFDLENBQUMsQ0FBQTtTQUNIO1FBQ0QsSUFBSSxH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QyxJQUFJLENBQUMsUUFBUTtnQ0FDN0IsWUFBWSxFQUFFLE9BQUssQ0FBQyxJQUFJLENBQUMsWUFBWTtnQ0FDckMsVUFBVSxFQUFFLE9BQUssQ0FBQyxJQUFJLENBQUMsVUFBVTs2QkFDbEM7NEJBQ0QsTUFBTSxFQUFFO2dDQUNOLGNBQWMsRUFBRSxrQkFBa0I7NkJBQ25DOzRCQUNELE1BQU0sRUFBRSxNQUFNOzRCQUNkLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0NBQ1YsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO2dDQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDO29DQUNYLEtBQUssRUFBRSxNQUFNO29DQUNiLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUc7b0NBQ3JCLFVBQVUsRUFBRSxLQUFLO29DQUNqQixPQUFPLFlBQUMsR0FBRzt3Q0FDVCxFQUFFLENBQUMsU0FBUyxDQUFDOzRDQUNYLEdBQUcsRUFBRSxvQkFBb0I7eUNBQzFCLENBQUMsQ0FBQTtvQ0FDSixDQUFDO2lDQUNGLENBQUMsQ0FBQTs0QkFDSixDQUFDOzRCQUNELElBQUksRUFBRSxVQUFBLElBQUk7Z0NBQ1IsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO2dDQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBOzRCQUNuQixDQUFDO3lCQUNGLENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1NBQ0g7YUFBTTtZQUNMLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsVUFBVSxFQUFFLEtBQUs7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0lBQ0QsU0FBUztJQUVULENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL292ZXJ0aW1lLnRzXG5pbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXG5cbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcbmxldCBkID0gbmV3IERhdGUoKVxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICBmb3JtVHlwZXM6IFtcbiAgICAgIHsgazogJzEnLCB2OiAn5bmz5pel5Yqg54+tJyB9LFxuICAgICAgeyBrOiAnMicsIHY6ICflj4zkvJHliqDnj60nIH0sXG4gICAgICB7IGs6ICczJywgdjogJ+iKguaXpeWKoOePrScgfVxuICAgIF0sXG4gICAgc2VsZWN0ZWRUeXBlOiAnMScsXG4gICAgZm9ybVR5cGU6ICcxJyxcbiAgICBmb3JtVHlwZURlc2M6ICflubPml6XliqDnj60nLFxuICAgIGRldGFpbExpc3Q6IFtdIGFzIGFueSxcbiAgICBlbXBsb3llZUlkOiBudWxsLFxuICAgIGVtcGxveWVlTmFtZTogbnVsbCxcbiAgICBkZXB0SWQ6IG51bGwsXG4gICAgZGVwdE5hbWU6IG51bGwsXG4gICAgY2FuU3VibWl0OiBmYWxzZVxuICB9LFxuICBvbkxvYWQoKSB7XG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICdMb2FkaW5nJ1xuICAgIH0pXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgfSwgMjAwMClcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEuYXV0aG9yaXplZCkge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGVtcGxveWVlSWQ6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXG4gICAgICAgIGVtcGxveWVlTmFtZTogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVOYW1lXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCkge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGRlcHRJZDogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCxcbiAgICAgICAgZGVwdE5hbWU6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQgKyAnLScgKyBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdE5hbWVcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuICBiaW5kRGVwdFNlbGVjdChlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpc1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnLi4vZGVwdFNlbGVjdC9kZXB0U2VsZWN0P2VtcGxveWVlaWQ9JyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgcmV0dXJuRGVwdFNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgZGVwdElkOiByZXMuayxcbiAgICAgICAgICAgICAgZGVwdE5hbWU6IHJlcy5rICsgJy0nICsgcmVzLnZcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGJpbmRGb3JtVHlwZUNoYW5nZShlKSB7XG4gICAgaWYgKGUuZGV0YWlsLnZhbHVlID09ICcxJykge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGZvcm1UeXBlOiAnMScsXG4gICAgICAgIGZvcm1UeXBlRGVzYzogJ+W5s+aXpeWKoOePrScsXG4gICAgICAgIHNlbGVjdGVkVHlwZTogZS5kZXRhaWwudmFsdWVcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChlLmRldGFpbC52YWx1ZSA9PSAnMicpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICBmb3JtVHlwZTogJzInLFxuICAgICAgICBmb3JtVHlwZURlc2M6ICflj4zkvJHliqDnj60nLFxuICAgICAgICBzZWxlY3RlZFR5cGU6IGUuZGV0YWlsLnZhbHVlXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgZm9ybVR5cGU6ICczJyxcbiAgICAgICAgZm9ybVR5cGVEZXNjOiAn6IqC5pel5Yqg54+tJyxcbiAgICAgICAgc2VsZWN0ZWRUeXBlOiBlLmRldGFpbC52YWx1ZVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGJpbmRBZGREZXRhaWxUYXAoZSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXNcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIHVybDogJy4vb3ZlcmRldGFpbCcsXG4gICAgICBldmVudHM6IHtcbiAgICAgICAgcmV0dXJuRGV0YWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgbGV0IGRldGFpbHMgPSBfdGhpcy5kYXRhLmRldGFpbExpc3RcbiAgICAgICAgICBkZXRhaWxzLnB1c2gocmVzLmRhdGEpXG4gICAgICAgICAgZGV0YWlscy5mb3JFYWNoKChvLCBpKSA9PiB7XG4gICAgICAgICAgICBvLnNlcSA9IGkgKyAxXG4gICAgICAgICAgfSlcbiAgICAgICAgICBfdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgIGRldGFpbExpc3Q6IGRldGFpbHMsXG4gICAgICAgICAgICBjYW5TdWJtaXQ6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgcmVzLmV2ZW50Q2hhbm5lbC5lbWl0KCdvcGVuRGV0YWlsJywge1xuICAgICAgICAgIGRhdGE6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZW1wbG95ZWVJZDogX3RoaXMuZGF0YS5lbXBsb3llZUlkLFxuICAgICAgICAgICAgZW1wbG95ZWVOYW1lOiBfdGhpcy5kYXRhLmVtcGxveWVlTmFtZSxcbiAgICAgICAgICAgIGRlcHRJZDogX3RoaXMuZGF0YS5kZXB0SWQsXG4gICAgICAgICAgICBkZXB0TmFtZTogX3RoaXMuZGF0YS5kZXB0TmFtZVxuICAgICAgICAgIH0sIGlzTmV3OiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgYmluZEVkaXREZXRhaWxUYXAoZSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXNcbiAgICBsZXQgaW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnLi9vdmVyZGV0YWlsJyxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICByZXR1cm5EZXRhaWw6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICBsZXQgZGV0YWlscyA9IF90aGlzLmRhdGEuZGV0YWlsTGlzdFxuICAgICAgICAgIGRldGFpbHMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgIGRldGFpbHMucHVzaChyZXMuZGF0YSlcbiAgICAgICAgICBkZXRhaWxzLmZvckVhY2goKG8sIGkpID0+IHtcbiAgICAgICAgICAgIG8uc2VxID0gaSArIDFcbiAgICAgICAgICB9KVxuICAgICAgICAgIF90aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGRldGFpbExpc3Q6IGRldGFpbHMsXG4gICAgICAgICAgICBjYW5TdWJtaXQ6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRPYmplY3QgPSBfdGhpcy5kYXRhLmRldGFpbExpc3RbaW5kZXhdXG4gICAgICAgIHJlcy5ldmVudENoYW5uZWwuZW1pdCgnb3BlbkRldGFpbCcsIHtcbiAgICAgICAgICBkYXRhOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVtcGxveWVlSWQ6IGN1cnJlbnRPYmplY3QuZW1wbG95ZWVJZCxcbiAgICAgICAgICAgIGVtcGxveWVlTmFtZTogY3VycmVudE9iamVjdC5lbXBsb3llZU5hbWUsXG4gICAgICAgICAgICBkZXB0SWQ6IGN1cnJlbnRPYmplY3QuZGVwdElkLFxuICAgICAgICAgICAgZGVwdE5hbWU6IGN1cnJlbnRPYmplY3QuZGVwdE5hbWUsXG4gICAgICAgICAgICBsdW5jaDogY3VycmVudE9iamVjdC5sdW5jaCxcbiAgICAgICAgICAgIGRpbm5lcjogY3VycmVudE9iamVjdC5kaW5uZXIsXG4gICAgICAgICAgICBkYXRlMTogY3VycmVudE9iamVjdC5kYXRlMSxcbiAgICAgICAgICAgIHRpbWUxOiBjdXJyZW50T2JqZWN0LnRpbWUxLFxuICAgICAgICAgICAgdGltZTI6IGN1cnJlbnRPYmplY3QudGltZTIsXG4gICAgICAgICAgICBob3VyOiBjdXJyZW50T2JqZWN0LmhvdXIsXG4gICAgICAgICAgICBjb250ZW50OiBjdXJyZW50T2JqZWN0LmNvbnRlbnRcbiAgICAgICAgICB9LCBpc05ldzogZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kUmVtb3ZlRGV0YWlsVGFwKGUpIHtcbiAgICBsZXQgZGV0YWlscyA9IHRoaXMuZGF0YS5kZXRhaWxMaXN0XG4gICAgbGV0IGluZGV4ID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcbiAgICBkZXRhaWxzLnNwbGljZShpbmRleCwgMSlcbiAgICBkZXRhaWxzLmZvckVhY2goKG8sIGkpID0+IHtcbiAgICAgIG8uc2VxID0gaSArIDFcbiAgICB9KVxuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgZGV0YWlsTGlzdDogZGV0YWlsc1xuICAgIH0pXG4gIH0sXG4gIGZvcm1TdWJtaXQoZSkge1xuICAgIGxldCBjYW5TdWJtaXQgPSB0cnVlXG4gICAgbGV0IGVycm1zZyA9ICcnXG4gICAgaWYgKCFhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XG4gICAgICBjYW5TdWJtaXQgPSBmYWxzZVxuICAgICAgZXJybXNnICs9ICfotKblj7fmnKrmjojmnYNcXHJcXG4nXG4gICAgfVxuICAgIGlmICghdGhpcy5kYXRhLmVtcGxveWVlSWQgfHwgdGhpcy5kYXRhLmVtcGxveWVlSWQgPT0gJycpIHtcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXG4gICAgICBlcnJtc2cgKz0gJ+ivt+Whq+WGmeeUs+ivt+S6uuWRmFxcclxcbidcbiAgICB9XG4gICAgaWYgKCF0aGlzLmRhdGEuZGVwdElkIHx8IHRoaXMuZGF0YS5kZXB0SWQgPT0gJycpIHtcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXG4gICAgICBlcnJtc2cgKz0gXCLor7floavlhpnnlLPor7fpg6jpl6hcXHJcXG5cIlxuICAgIH1cbiAgICBpZiAoIXRoaXMuZGF0YS5kZXRhaWxMaXN0KSB7XG4gICAgICBjYW5TdWJtaXQgPSBmYWxzZVxuICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ5piO57uG6LWE5paZXFxyXFxuXCJcbiAgICB9XG4gICAgaWYgKGNhblN1Ym1pdCkge1xuICAgICAgbGV0IF90aGlzID0gdGhpc1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICdTZW5kaW5nJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICAgICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtSlJTL2FwaS9lZmdwL2hrZ2wwMzQvd2VjaGF0PycgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aCxcbiAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGVtcGxveWVlOiBfdGhpcy5kYXRhLmVtcGxveWVlSWQsXG4gICAgICAgICAgICAgICAgZm9ybVR5cGU6IF90aGlzLmRhdGEuZm9ybVR5cGUsXG4gICAgICAgICAgICAgICAgZm9ybVR5cGVEZXNjOiBfdGhpcy5kYXRhLmZvcm1UeXBlRGVzYyxcbiAgICAgICAgICAgICAgICBkZXRhaWxMaXN0OiBfdGhpcy5kYXRhLmRldGFpbExpc3RcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLm1zZyxcbiAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3BhZ2VzL2luZGV4L2luZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmYWlsOiBmYWlsID0+IHtcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmFpbClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcbiAgICAgICAgY29udGVudDogZXJybXNnLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGZvcm1SZXNldCgpIHtcbiAgICAvL2NvbnNvbGUubG9nKCdmb3Jt5Y+R55Sf5LqGcmVzZXTkuovku7YnKTtcbiAgfVxufSlcbiJdfQ==