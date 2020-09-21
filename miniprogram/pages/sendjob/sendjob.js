"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var d = new Date();
Page({
    data: {
        selectedType: '1',
        repairKind: '',
        repairKindname: '请选择',
        detailList: [],
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        customer: '',
        cusna: '',
        ta009: '',
        receiver: '',
        ta005: '',
        ta006: '',
        ta007: '',
        ta013: '',
        ta500: '',
        ta197: '',
        productna: '',
        ta198: '',
        areana: '',
        ta071: '',
        ta010: '',
        ta003: '',
        repairno: '',
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
    bindRepairKind: function (e) {
        var that = this;
        wx.navigateTo({
            url: './repairKind',
            events: {
                returnRepairKind: function (res) {
                    if (res) {
                        that.setData({
                            repairKind: res.k,
                            repairKindname: res.k + '-' + res.v
                        });
                    }
                }
            }
        });
    },
    bindReceivingpersonnel: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../receivingpersonnel/receivingpersonnel',
            events: {
                returnreceivingpersonnel: function (res) {
                    if (res) {
                        that.setData({
                            workType: res.k,
                            workTypeDesc: res.k + '-' + res.v
                        });
                    }
                }
            },
            success: function (res) {
            }
        });
    },
    bindDate1Change: function (e) {
        this.setData({
            date1: e.detail.value,
            date2: e.detail.value
        });
    },
    bindRepairnoChange: function (e) {
        var that = this;
        if (that.data.repairKind != '' && that.data.repairKind != null) {
            wx.navigateTo({
                url: '../customercomplaint/selectSearch?type=' + 'repairno&&id=' + this.data.repairKind,
                events: {
                    returnRepairnoSelect: function (res) {
                        if (res) {
                            that.setData({
                                customer: res.ta004,
                                cusna: res.cusna,
                                ta009: res.ta009,
                                receiver: res.receiver,
                                ta005: res.ta005,
                                ta006: res.ta006,
                                ta007: res.ta007,
                                ta013: res.ta013,
                                ta500: res.ta500,
                                ta197: res.ta197,
                                productna: res.productna,
                                ta198: res.ta198,
                                areana: res.areana,
                                ta071: res.ta071,
                                ta010: res.ta010,
                                ta003: res.value,
                                repairno: res.key
                            });
                        }
                    }
                },
                success: function (res) {
                    console.log(res);
                }
            });
        }
        else {
            wx.showModal({
                title: '系统提示',
                content: "请先选择叫修单别",
                showCancel: false
            });
        }
    },
    bindAddDetailTap: function (e) {
        var _this = this;
        wx.navigateTo({
            url: './senddetail',
            events: {
                returnSendjobDetail: function (res) {
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
            url: './senddetail',
            events: {
                returnSendjobDetail: function (res) {
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
                        stationname: currentObject.stationname,
                        repairmanname: currentObject.repairmanname,
                        date1: currentObject.date1,
                        date2: currentObject.date2,
                        date3: currentObject.date3,
                        date4: currentObject.date4,
                        repairmanname2: currentObject.repairmanname2
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
                        console.log(_this_1.data);
                        wx.request({
                            url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/reppw/wechat?' + app.globalData.restAuth,
                            data: {
                                repairKindname: _this_1.data.repairKindname,
                                repairno: _this_1.data.repairno,
                                sessionkey: app.globalData.sessionKey,
                                openId: app.globalData.openId,
                                detailList: _this_1.data.detailList
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log(res);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VuZGpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlbmRqb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUM1QixJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0FBQ2xCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFVBQVUsRUFBRSxFQUFFO1FBQ2QsY0FBYyxFQUFFLEtBQUs7UUFDckIsVUFBVSxFQUFFLEVBQVM7UUFDckIsVUFBVSxFQUFFLElBQUk7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxFQUFFO1FBQ1osS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxFQUFFO1FBQ1osS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRSxFQUFFO1FBQ1QsU0FBUyxFQUFFLEVBQUU7UUFDYixLQUFLLEVBQUUsRUFBRTtRQUNULE1BQU0sRUFBRSxFQUFFO1FBQ1YsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLEVBQUU7UUFDWixTQUFTLEVBQUUsS0FBSztLQUNqQjtJQUNELE1BQU07UUFDSixFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ2IsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFBO1FBQ0YsVUFBVSxDQUFDO1lBQ1QsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNSLElBQUksR0FBRyxD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O3lDQUN6QixDQUFDLENBQUE7b0NBQ0osQ0FBQztpQ0FDRixDQUFDLENBQUE7NEJBQ0osQ0FBQzs0QkFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dDQUNSLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtnQ0FDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTs0QkFDbkIsQ0FBQzt5QkFDRixDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztJQUNELFNBQVM7SUFFVCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xyXG5cclxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxyXG5sZXQgZCA9IG5ldyBEYXRlKClcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgc2VsZWN0ZWRUeXBlOiAnMScsXHJcbiAgICByZXBhaXJLaW5kOiAnJyxcclxuICAgIHJlcGFpcktpbmRuYW1lOiAn6K+36YCJ5oupJyxcclxuICAgIGRldGFpbExpc3Q6IFtdIGFzIGFueSxcclxuICAgIGVtcGxveWVlSWQ6IG51bGwsXHJcbiAgICBlbXBsb3llZU5hbWU6IG51bGwsXHJcbiAgICBkZXB0SWQ6IG51bGwsXHJcbiAgICBkZXB0TmFtZTogbnVsbCxcclxuICAgIGN1c3RvbWVyOiAnJywvL+WuouaIt+e8luWPt+WSjOWuouaIt+WGheWuuVxyXG4gICAgY3VzbmE6ICcnLFxyXG4gICAgdGEwMDk6ICcnLC8v5o6l5Y2V5Lq65ZGYXHJcbiAgICByZWNlaXZlcjogJycsXHJcbiAgICB0YTAwNTogJycsXHJcbiAgICB0YTAwNjogJycsXHJcbiAgICB0YTAwNzogJycsXHJcbiAgICB0YTAxMzogJycsXHJcbiAgICB0YTUwMDogJycsXHJcbiAgICB0YTE5NzogJycsXHJcbiAgICBwcm9kdWN0bmE6ICcnLFxyXG4gICAgdGExOTg6ICcnLFxyXG4gICAgYXJlYW5hOiAnJyxcclxuICAgIHRhMDcxOiAnJyxcclxuICAgIHRhMDEwOiAnJyxcclxuICAgIHRhMDAzOiAnJyxcclxuICAgIHJlcGFpcm5vOiAnJyxcclxuICAgIGNhblN1Ym1pdDogZmFsc2VcclxuICB9LFxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgdGl0bGU6ICdMb2FkaW5nJ1xyXG4gICAgfSlcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICB9LCAyMDAwKVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgZW1wbG95ZWVJZDogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgICBlbXBsb3llZU5hbWU6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZVxyXG4gICAgICB9KVxyXG4gICAgXHJcbiAgICB9XHJcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCkge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBkZXB0SWQ6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQsXHJcbiAgICAgICAgZGVwdE5hbWU6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQgKyAnLScgKyBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdE5hbWVcclxuICAgICAgfSlcclxuICAgICBcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiaW5kRGVwdFNlbGVjdChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vZGVwdFNlbGVjdC9kZXB0U2VsZWN0P2VtcGxveWVlaWQ9JyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybkRlcHRTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIGRlcHRJZDogcmVzLmssXHJcbiAgICAgICAgICAgICAgZGVwdE5hbWU6IHJlcy5rICsgJy0nICsgcmVzLnZcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFJlcGFpcktpbmQoZSkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi9yZXBhaXJLaW5kJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuUmVwYWlyS2luZDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICByZXBhaXJLaW5kOiByZXMuayxcclxuICAgICAgICAgICAgICByZXBhaXJLaW5kbmFtZTogcmVzLmsgKyAnLScgKyByZXMudlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRSZWNlaXZpbmdwZXJzb25uZWwoZSkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vcmVjZWl2aW5ncGVyc29ubmVsL3JlY2VpdmluZ3BlcnNvbm5lbCcsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybnJlY2VpdmluZ3BlcnNvbm5lbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICB3b3JrVHlwZTogcmVzLmssXHJcbiAgICAgICAgICAgICAgd29ya1R5cGVEZXNjOiByZXMuayArICctJyArIHJlcy52XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRGF0ZTFDaGFuZ2UoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIGRhdGUxOiBlLmRldGFpbC52YWx1ZSxcclxuICAgICAgZGF0ZTI6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFJlcGFpcm5vQ2hhbmdlKGUpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgaWYgKHRoYXQuZGF0YS5yZXBhaXJLaW5kICE9ICcnICYmIHRoYXQuZGF0YS5yZXBhaXJLaW5kICE9bnVsbCl7XHJcbiAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICB1cmw6ICcuLi9jdXN0b21lcmNvbXBsYWludC9zZWxlY3RTZWFyY2g/dHlwZT0nICsgJ3JlcGFpcm5vJiZpZD0nICsgdGhpcy5kYXRhLnJlcGFpcktpbmQsXHJcbiAgICBldmVudHM6IHtcclxuICAgICAgcmV0dXJuUmVwYWlybm9TZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgLy8g5Y+r5L+u5Y2V5Y+377yM5Y2V5o2u5pel5pyf77yM5a6i5oi357yW5Y+3LCDmjqXljZXkurrlkZgsIOS6p+WTgeWTgeWPt++8jOS6p+WTgeWTgeWQje+8jOS6p+WTgeinhOagvO+8jOS6p+WTgeW6j+WPtywg5py65Z6LLCDkuqflk4HliKvvvIzljLrln5/liKssIOmXrumimOS7o+WPt++8jOmXrumimOaPj+i/sFxyXG4gICAgICAgICAgICAvLyBUQTAwMiwgVEEwMDMsIFRBMDA0LCBUQTAwOSwgVEEwMDUsIFRBMDA2LCBUQTAwNywgVEEwMTMsIFRBNTAwLCBUQTE5NywgVEExOTgsIFRBMDcxLCBUQTAxMFxyXG4gICAgICAgICAgICBjdXN0b21lcjogcmVzLnRhMDA0LCAgLy/lrqLmiLdcclxuICAgICAgICAgICAgY3VzbmE6IHJlcy5jdXNuYSxcclxuICAgICAgICAgICAgdGEwMDk6IHJlcy50YTAwOSwgLy/mjqXljZXkurrlkZhcclxuICAgICAgICAgICAgcmVjZWl2ZXI6IHJlcy5yZWNlaXZlcixcclxuICAgICAgICAgICAgdGEwMDU6IHJlcy50YTAwNSxcclxuICAgICAgICAgICAgdGEwMDY6IHJlcy50YTAwNixcclxuICAgICAgICAgICAgdGEwMDc6IHJlcy50YTAwNyxcclxuICAgICAgICAgICAgdGEwMTM6IHJlcy50YTAxMyxcclxuICAgICAgICAgICAgdGE1MDA6IHJlcy50YTUwMCxcclxuICAgICAgICAgICAgdGExOTc6IHJlcy50YTE5NyxcclxuICAgICAgICAgICAgcHJvZHVjdG5hOiByZXMucHJvZHVjdG5hLFxyXG4gICAgICAgICAgICB0YTE5ODogcmVzLnRhMTk4LFxyXG4gICAgICAgICAgICBhcmVhbmE6IHJlcy5hcmVhbmEsXHJcbiAgICAgICAgICAgIHRhMDcxOiByZXMudGEwNzEsXHJcbiAgICAgICAgICAgIHRhMDEwOiByZXMudGEwMTAsXHJcbiAgICAgICAgICAgIHRhMDAzOiByZXMudmFsdWUsXHJcbiAgICAgICAgICAgIHJlcGFpcm5vOiByZXMua2V5XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgIH1cclxuICB9KVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6IFwi6K+35YWI6YCJ5oup5Y+r5L+u5Y2V5YirXCIsXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgfSlcclxuXHJcbn1cclxuICB9LFxyXG4gIGJpbmRBZGREZXRhaWxUYXAoZSkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4vc2VuZGRldGFpbCcsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVyblNlbmRqb2JEZXRhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGxldCBkZXRhaWxzID0gX3RoaXMuZGF0YS5kZXRhaWxMaXN0XHJcbiAgICAgICAgICBkZXRhaWxzLnB1c2gocmVzLmRhdGEpXHJcbiAgICAgICAgICBkZXRhaWxzLmZvckVhY2goKG8sIGkpID0+IHtcclxuICAgICAgICAgICAgby5zZXEgPSBpICsgMVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBkZXRhaWxMaXN0OiBkZXRhaWxzLFxyXG4gICAgICAgICAgICBjYW5TdWJtaXQ6IHRydWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIHJlcy5ldmVudENoYW5uZWwuZW1pdCgnb3BlbkRldGFpbCcsIHtcclxuICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGVtcGxveWVlSWQ6IF90aGlzLmRhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgICAgICAgZW1wbG95ZWVOYW1lOiBfdGhpcy5kYXRhLmVtcGxveWVlTmFtZSxcclxuICAgICAgICAgICAgZGVwdElkOiBfdGhpcy5kYXRhLmRlcHRJZCxcclxuICAgICAgICAgICAgZGVwdE5hbWU6IF90aGlzLmRhdGEuZGVwdE5hbWVcclxuICAgICAgICAgIH0sIGlzTmV3OiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRFZGl0RGV0YWlsVGFwKGUpIHtcclxuICAgIGxldCBfdGhpcyA9IHRoaXNcclxuICAgIGxldCBpbmRleCA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZGV4XHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi9zZW5kZGV0YWlsJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuU2VuZGpvYkRldGFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgbGV0IGRldGFpbHMgPSBfdGhpcy5kYXRhLmRldGFpbExpc3RcclxuICAgICAgICAgIGRldGFpbHMuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgZGV0YWlscy5wdXNoKHJlcy5kYXRhKVxyXG4gICAgICAgICAgZGV0YWlscy5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIG8uc2VxID0gaSArIDFcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICBfdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICAgIGRldGFpbExpc3Q6IGRldGFpbHMsXHJcbiAgICAgICAgICAgIGNhblN1Ym1pdDogdHJ1ZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRPYmplY3QgPSBfdGhpcy5kYXRhLmRldGFpbExpc3RbaW5kZXhdXHJcbiAgICAgICAgcmVzLmV2ZW50Q2hhbm5lbC5lbWl0KCdvcGVuRGV0YWlsJywge1xyXG4gICAgICAgICAgZGF0YTpcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZW1wbG95ZWVJZDogY3VycmVudE9iamVjdC5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICBlbXBsb3llZU5hbWU6IGN1cnJlbnRPYmplY3QuZW1wbG95ZWVOYW1lLFxyXG4gICAgICAgICAgICBkZXB0SWQ6IGN1cnJlbnRPYmplY3QuZGVwdElkLFxyXG4gICAgICAgICAgICBkZXB0TmFtZTogY3VycmVudE9iamVjdC5kZXB0TmFtZSxcclxuICAgICAgICAgICAgc3RhdGlvbm5hbWU6IGN1cnJlbnRPYmplY3Quc3RhdGlvbm5hbWUsXHJcbiAgICAgICAgICAgIHJlcGFpcm1hbm5hbWU6IGN1cnJlbnRPYmplY3QucmVwYWlybWFubmFtZSxcclxuICAgICAgICAgICAgZGF0ZTE6IGN1cnJlbnRPYmplY3QuZGF0ZTEsXHJcbiAgICAgICAgICAgIGRhdGUyOiBjdXJyZW50T2JqZWN0LmRhdGUyLFxyXG4gICAgICAgICAgICBkYXRlMzogY3VycmVudE9iamVjdC5kYXRlMyxcclxuICAgICAgICAgICAgZGF0ZTQ6IGN1cnJlbnRPYmplY3QuZGF0ZTQsXHJcbiAgICAgICAgICAgIHJlcGFpcm1hbm5hbWUyOiBjdXJyZW50T2JqZWN0LnJlcGFpcm1hbm5hbWUyXHJcbiAgICAgICAgICB9LCBpc05ldzogZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFJlbW92ZURldGFpbFRhcChlKSB7XHJcbiAgICBsZXQgZGV0YWlscyA9IHRoaXMuZGF0YS5kZXRhaWxMaXN0XHJcbiAgICBsZXQgaW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxyXG4gICAgZGV0YWlscy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICBkZXRhaWxzLmZvckVhY2goKG8sIGkpID0+IHtcclxuICAgICAgby5zZXEgPSBpICsgMVxyXG4gICAgfSlcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBkZXRhaWxMaXN0OiBkZXRhaWxzXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGZvcm1TdWJtaXQoZSkge1xyXG4gICAgbGV0IGNhblN1Ym1pdCA9IHRydWVcclxuICAgIGxldCBlcnJtc2cgPSAnJ1xyXG4gICAgLy8gaWYgKCFhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAvLyAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAvLyAgIGVycm1zZyArPSAn6LSm5Y+35pyq5o6I5p2DXFxyXFxuJ1xyXG4gICAgLy8gfVxyXG4gICAgLy8gaWYgKCF0aGlzLmRhdGEuZW1wbG95ZWVJZCB8fCB0aGlzLmRhdGEuZW1wbG95ZWVJZCA9PSAnJykge1xyXG4gICAgLy8gICBjYW5TdWJtaXQgPSBmYWxzZVxyXG4gICAgLy8gICBlcnJtc2cgKz0gJ+ivt+Whq+WGmeeUs+ivt+S6uuWRmFxcclxcbidcclxuICAgIC8vIH1cclxuICAgIC8vIGlmICghdGhpcy5kYXRhLmRlcHRJZCB8fCB0aGlzLmRhdGEuZGVwdElkID09ICcnKSB7XHJcbiAgICAvLyAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAvLyAgIGVycm1zZyArPSBcIuivt+Whq+WGmeeUs+ivt+mDqOmXqFxcclxcblwiXHJcbiAgICAvLyB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5kZXRhaWxMaXN0KSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSBcIuivt+Whq+WGmeaYjue7hui1hOaWmVxcclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAoY2FuU3VibWl0KSB7XHJcbiAgICAgIGxldCBfdGhpcyA9IHRoaXNcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogJ+ehruWumuaPkOS6pOWQlycsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdTZW5kaW5nJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5kYXRhKVxyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtSlJTL2FwaS9jcm0vcmVwcHcvd2VjaGF0PycgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aCxcclxuICAgICAgICAgICAgICAvL3VybDonaHR0cDovLzE3Mi4xNi44MC45OTo4NDgwL0hhbmJlbGwtSlJTL2FwaS9jcm0vcmVwcHcvd2VjaGF0PycgK2FwcC5nbG9iYWxEYXRhLnJlc3RBdXRoLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIHJlcGFpcktpbmRuYW1lOiBfdGhpcy5kYXRhLnJlcGFpcktpbmRuYW1lLFxyXG4gICAgICAgICAgICAgICAgcmVwYWlybm86IF90aGlzLmRhdGEucmVwYWlybm8sXHJcbiAgICAgICAgICAgICAgICBzZXNzaW9ua2V5OiBhcHAuZ2xvYmFsRGF0YS5zZXNzaW9uS2V5LFxyXG4gICAgICAgICAgICAgICAgb3BlbklkOiBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQsXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxMaXN0OiBfdGhpcy5kYXRhLmRldGFpbExpc3RcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzLmRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3BhZ2VzL2luZGV4L2luZGV4XCJcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBlcnJtc2csXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGZvcm1SZXNldCgpIHtcclxuICAgIC8vY29uc29sZS5sb2coJ2Zvcm3lj5HnlJ/kuoZyZXNldOS6i+S7ticpO1xyXG4gIH1cclxufSlcclxuIl19