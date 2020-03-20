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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcnRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvdmVydGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7QUFDbEIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osU0FBUyxFQUFFO1lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7WUFDckIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7WUFDckIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUU7U0FDdEI7UUFDRCxZQUFZLEVBQUUsR0FBRztRQUNqQixRQUFRLEVBQUUsR0FBRztRQUNiLFlBQVksRUFBRSxNQUFNO1FBQ3BCLFVBQVUsRUFBRSxFQUFTO1FBQ3JCLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLElBQUk7UUFDZCxTQUFTLEVBQUUsS0FBSztLQUNqQjtJQUNELE1BQU07UUFDSixFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ2IsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFBO1FBQ0YsVUFBVSxDQUFDO1lBQ1QsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNSLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2dCQUNyQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZO2FBQzFDLENBQUMsQ0FBQTtTQUNIO1FBQ0QsSUFBSSxH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QyxJQUFJLENBQUMsUUFBUTtnQ0FDN0IsWUFBWSxFQUFFLE9BQUssQ0FBQyxJQUFJLENBQUMsWUFBWTtnQ0FDckMsVUFBVSxFQUFFLE9BQUssQ0FBQyxJQUFJLENBQUMsVUFBVTs2QkFDbEM7NEJBQ0QsTUFBTSxFQUFFO2dDQUNOLGNBQWMsRUFBRSxrQkFBa0I7NkJBQ25DOzRCQUNELE1BQU0sRUFBRSxNQUFNOzRCQUNkLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0NBQ1YsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO2dDQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDO29DQUNYLEtBQUssRUFBRSxNQUFNO29DQUNiLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUc7b0NBQ3JCLFVBQVUsRUFBRSxLQUFLO29DQUNqQixPQUFPLFlBQUMsR0FBRzt3Q0FDVCxFQUFFLENBQUMsU0FBUyxDQUFDOzRDQUNYLEdBQUcsRUFBRSxvQkFBb0I7eUNBQzFCLENBQUMsQ0FBQTtvQ0FDSixDQUFDO2lDQUNGLENBQUMsQ0FBQTs0QkFDSixDQUFDOzRCQUNELElBQUksRUFBRSxVQUFBLElBQUk7Z0NBQ1IsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO2dDQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBOzRCQUNuQixDQUFDO3lCQUNGLENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1NBQ0g7YUFBTTtZQUNMLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsVUFBVSxFQUFFLEtBQUs7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0lBQ0QsU0FBUztJQUVULENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL292ZXJ0aW1lLnRzXHJcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IGQgPSBuZXcgRGF0ZSgpXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIGZvcm1UeXBlczogW1xyXG4gICAgICB7IGs6ICcxJywgdjogJ+W5s+aXpeWKoOePrScgfSxcclxuICAgICAgeyBrOiAnMicsIHY6ICflj4zkvJHliqDnj60nIH0sXHJcbiAgICAgIHsgazogJzMnLCB2OiAn6IqC5pel5Yqg54+tJyB9XHJcbiAgICBdLFxyXG4gICAgc2VsZWN0ZWRUeXBlOiAnMScsXHJcbiAgICBmb3JtVHlwZTogJzEnLFxyXG4gICAgZm9ybVR5cGVEZXNjOiAn5bmz5pel5Yqg54+tJyxcclxuICAgIGRldGFpbExpc3Q6IFtdIGFzIGFueSxcclxuICAgIGVtcGxveWVlSWQ6IG51bGwsXHJcbiAgICBlbXBsb3llZU5hbWU6IG51bGwsXHJcbiAgICBkZXB0SWQ6IG51bGwsXHJcbiAgICBkZXB0TmFtZTogbnVsbCxcclxuICAgIGNhblN1Ym1pdDogZmFsc2VcclxuICB9LFxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgdGl0bGU6ICdMb2FkaW5nJ1xyXG4gICAgfSlcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICB9LCAyMDAwKVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgZW1wbG95ZWVJZDogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgICBlbXBsb3llZU5hbWU6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgZGVwdElkOiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkLFxyXG4gICAgICAgIGRlcHROYW1lOiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkICsgJy0nICsgYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHROYW1lXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBiaW5kRGVwdFNlbGVjdChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vZGVwdFNlbGVjdC9kZXB0U2VsZWN0P2VtcGxveWVlaWQ9JyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybkRlcHRTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIGRlcHRJZDogcmVzLmssXHJcbiAgICAgICAgICAgICAgZGVwdE5hbWU6IHJlcy5rICsgJy0nICsgcmVzLnZcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZEZvcm1UeXBlQ2hhbmdlKGUpIHtcclxuICAgIGlmIChlLmRldGFpbC52YWx1ZSA9PSAnMScpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgZm9ybVR5cGU6ICcxJyxcclxuICAgICAgICBmb3JtVHlwZURlc2M6ICflubPml6XliqDnj60nLFxyXG4gICAgICAgIHNlbGVjdGVkVHlwZTogZS5kZXRhaWwudmFsdWVcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSBpZiAoZS5kZXRhaWwudmFsdWUgPT0gJzInKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGZvcm1UeXBlOiAnMicsXHJcbiAgICAgICAgZm9ybVR5cGVEZXNjOiAn5Y+M5LyR5Yqg54+tJyxcclxuICAgICAgICBzZWxlY3RlZFR5cGU6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBmb3JtVHlwZTogJzMnLFxyXG4gICAgICAgIGZvcm1UeXBlRGVzYzogJ+iKguaXpeWKoOePrScsXHJcbiAgICAgICAgc2VsZWN0ZWRUeXBlOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmluZEFkZERldGFpbFRhcChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi9vdmVyZGV0YWlsJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuRGV0YWlsOiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBsZXQgZGV0YWlscyA9IF90aGlzLmRhdGEuZGV0YWlsTGlzdFxyXG4gICAgICAgICAgZGV0YWlscy5wdXNoKHJlcy5kYXRhKVxyXG4gICAgICAgICAgZGV0YWlscy5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIG8uc2VxID0gaSArIDFcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgZGV0YWlsTGlzdDogZGV0YWlscyxcclxuICAgICAgICAgICAgY2FuU3VibWl0OiB0cnVlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICByZXMuZXZlbnRDaGFubmVsLmVtaXQoJ29wZW5EZXRhaWwnLCB7XHJcbiAgICAgICAgICBkYXRhOlxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBlbXBsb3llZUlkOiBfdGhpcy5kYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgICAgICAgIGVtcGxveWVlTmFtZTogX3RoaXMuZGF0YS5lbXBsb3llZU5hbWUsXHJcbiAgICAgICAgICAgIGRlcHRJZDogX3RoaXMuZGF0YS5kZXB0SWQsXHJcbiAgICAgICAgICAgIGRlcHROYW1lOiBfdGhpcy5kYXRhLmRlcHROYW1lXHJcbiAgICAgICAgICB9LCBpc05ldzogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRWRpdERldGFpbFRhcChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICBsZXQgaW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4vb3ZlcmRldGFpbCcsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybkRldGFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgbGV0IGRldGFpbHMgPSBfdGhpcy5kYXRhLmRldGFpbExpc3RcclxuICAgICAgICAgIGRldGFpbHMuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgZGV0YWlscy5wdXNoKHJlcy5kYXRhKVxyXG4gICAgICAgICAgZGV0YWlscy5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIG8uc2VxID0gaSArIDFcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICBfdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICAgIGRldGFpbExpc3Q6IGRldGFpbHMsXHJcbiAgICAgICAgICAgIGNhblN1Ym1pdDogdHJ1ZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRPYmplY3QgPSBfdGhpcy5kYXRhLmRldGFpbExpc3RbaW5kZXhdXHJcbiAgICAgICAgcmVzLmV2ZW50Q2hhbm5lbC5lbWl0KCdvcGVuRGV0YWlsJywge1xyXG4gICAgICAgICAgZGF0YTpcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZW1wbG95ZWVJZDogY3VycmVudE9iamVjdC5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICBlbXBsb3llZU5hbWU6IGN1cnJlbnRPYmplY3QuZW1wbG95ZWVOYW1lLFxyXG4gICAgICAgICAgICBkZXB0SWQ6IGN1cnJlbnRPYmplY3QuZGVwdElkLFxyXG4gICAgICAgICAgICBkZXB0TmFtZTogY3VycmVudE9iamVjdC5kZXB0TmFtZSxcclxuICAgICAgICAgICAgbHVuY2g6IGN1cnJlbnRPYmplY3QubHVuY2gsXHJcbiAgICAgICAgICAgIGRpbm5lcjogY3VycmVudE9iamVjdC5kaW5uZXIsXHJcbiAgICAgICAgICAgIGRhdGUxOiBjdXJyZW50T2JqZWN0LmRhdGUxLFxyXG4gICAgICAgICAgICB0aW1lMTogY3VycmVudE9iamVjdC50aW1lMSxcclxuICAgICAgICAgICAgdGltZTI6IGN1cnJlbnRPYmplY3QudGltZTIsXHJcbiAgICAgICAgICAgIGhvdXI6IGN1cnJlbnRPYmplY3QuaG91cixcclxuICAgICAgICAgICAgY29udGVudDogY3VycmVudE9iamVjdC5jb250ZW50XHJcbiAgICAgICAgICB9LCBpc05ldzogZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFJlbW92ZURldGFpbFRhcChlKSB7XHJcbiAgICBsZXQgZGV0YWlscyA9IHRoaXMuZGF0YS5kZXRhaWxMaXN0XHJcbiAgICBsZXQgaW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxyXG4gICAgZGV0YWlscy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICBkZXRhaWxzLmZvckVhY2goKG8sIGkpID0+IHtcclxuICAgICAgby5zZXEgPSBpICsgMVxyXG4gICAgfSlcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBkZXRhaWxMaXN0OiBkZXRhaWxzXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgZm9ybVN1Ym1pdChlKSB7XHJcbiAgICBsZXQgY2FuU3VibWl0ID0gdHJ1ZVxyXG4gICAgbGV0IGVycm1zZyA9ICcnXHJcbiAgICBpZiAoIWFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9ICfotKblj7fmnKrmjojmnYNcXHJcXG4nXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5lbXBsb3llZUlkIHx8IHRoaXMuZGF0YS5lbXBsb3llZUlkID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+35aGr5YaZ55Sz6K+35Lq65ZGYXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmRhdGEuZGVwdElkIHx8IHRoaXMuZGF0YS5kZXB0SWQgPT0gJycpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ55Sz6K+36YOo6ZeoXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLmRldGFpbExpc3QpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+35aGr5YaZ5piO57uG6LWE5paZXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmIChjYW5TdWJtaXQpIHtcclxuICAgICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn56Gu5a6a5o+Q5Lqk5ZCXJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ1NlbmRpbmcnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2VmZ3AvaGtnbDAzNC93ZWNoYXQ/JyArIGFwcC5nbG9iYWxEYXRhLnJlc3RBdXRoLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGVtcGxveWVlOiBfdGhpcy5kYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgICAgICAgICAgICBmb3JtVHlwZTogX3RoaXMuZGF0YS5mb3JtVHlwZSxcclxuICAgICAgICAgICAgICAgIGZvcm1UeXBlRGVzYzogX3RoaXMuZGF0YS5mb3JtVHlwZURlc2MsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxMaXN0OiBfdGhpcy5kYXRhLmRldGFpbExpc3RcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzLmRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9wYWdlcy9pbmRleC9pbmRleFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogZXJybXNnLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBmb3JtUmVzZXQoKSB7XHJcbiAgICAvL2NvbnNvbGUubG9nKCdmb3Jt5Y+R55Sf5LqGcmVzZXTkuovku7YnKTtcclxuICB9XHJcbn0pXHJcbiJdfQ==