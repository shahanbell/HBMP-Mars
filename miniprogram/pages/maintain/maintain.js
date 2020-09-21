"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var d = new Date();
Page({
    data: {
        detailList: [],
        employeeId: null,
        employeeName: null,
        deptId: null,
        deptName: null,
        maintainTypeId: '',
        maintainTypeName: '',
        repairKindId: '',
        repairKindName: '',
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
        productUnit: '',
        remark: '',
        maintainer: '',
        maintainerId: '',
        warehouseId: '',
        warehouseName: '',
        incentoryformId: '',
        incentoryformName: '',
        tradingreasonId: '',
        tradingreasonName: '',
        deliveryremark: '',
        deliverydeptId: '',
        deliverydeptName: ''
    },
    onLoad: function () {
        wx.showLoading({
            title: 'Loading',
        });
        setTimeout(function () {
            wx.hideLoading();
        }, 2000);
        if (app.globalData.openId) {
            this.setData({
                hasOpenId: true
            });
        }
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
    bindMaintainTypeSelect: function (e) {
        var that = this;
        if (this.data.maintainer == null || this.data.maintainer == "") {
            wx.showModal({
                title: '系统提示',
                content: "请先选择维修人员",
                showCancel: false
            });
        }
        else {
            wx.navigateTo({
                url: '../customercomplaint/select?type=' + 'maintainType&id=' + this.data.maintainer,
                events: {
                    returnMaintainTypeSelect: function (res) {
                        if (res) {
                            that.setData({
                                maintainTypeId: res.key,
                                maintainTypeName: res.key + '-' + res.value
                            });
                        }
                    }
                },
                success: function (res) {
                }
            });
        }
    },
    bindRepairKind: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../sendjob/repairKind',
            events: {
                returnRepairKind: function (res) {
                    if (res) {
                        that.setData({
                            repairKindId: res.k,
                            repairKindName: res.k + '-' + res.v
                        });
                    }
                }
            }
        });
    },
    bindRepairnoChange: function (e) {
        var that = this;
        if (that.data.repairKindId != '' && that.data.repairKindId != null) {
            wx.navigateTo({
                url: '../customercomplaint/selectSearch?type=' + 'repairno&&id=' + this.data.repairKindId,
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
                                repairno: res.key,
                                remark: res.ta017
                            });
                        }
                    }
                },
                success: function (res) {
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
            url: '../maintain/maintainDetail?warehouse=' + _this.data.warehouseName + "&warehouseId=" + _this.data.warehouseId,
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
    bindEditDetailTap: function (e) {
        var _this = this;
        var index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: './maintainDetail',
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
                        productQuality: currentObject.productQuality,
                        product_name: currentObject.product_name,
                        productStandard: currentObject.productStandard,
                        warrantyStart: currentObject.warrantyStart,
                        warrantyEnd: currentObject.warrantyEnd,
                        planMaintainCount: currentObject.planMaintainCount,
                        maintainCategoryId: currentObject.maintainCategoryId,
                        maintainCategoryName: currentObject.maintainCategoryName,
                        warehouseId: currentObject.warehouseId,
                        warehouseName: currentObject.warehouseName,
                        productUnit: currentObject.productUnit
                    }, isNew: false
                });
            }
        });
    },
    bindMaintainNumberSelect: function (e) {
        var that = this;
        if (that.data.repairKindId == '' && that.data.repairKindId == null) {
            wx.showModal({
                title: '系统提示',
                content: "请先选择叫修单号",
                showCancel: false
            });
        }
        else {
            wx.navigateTo({
                url: '../customercomplaint/select?type=maintainNumber&&id=' + this.data.repairKindId + "|" + this.data.repairno,
                events: {
                    returnMaintainNumberSelect: function (res) {
                        if (res) {
                            that.setData({
                                maintainer: res.key,
                                maintaineId: res.key + '-' + res.value,
                                warehouseId: res.value1,
                                warehouseName: res.value1 + "-" + res.value2
                            });
                        }
                    }
                }
            });
        }
    },
    bindIncentoryformSelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../customercomplaint/select?type=incentoryform',
            events: {
                returnIncentoryformSelect: function (res) {
                    if (res) {
                        that.setData({
                            incentoryformId: res.key,
                            incentoryformName: res.key + "-" + res.value
                        });
                    }
                }
            }
        });
    },
    bindTradingReasonSelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../customercomplaint/select?type=tradingreason&id=' + that.data.incentoryformId,
            events: {
                returnTradingreasonSelect: function (res) {
                    if (res) {
                        that.setData({
                            tradingreasonId: res.key,
                            tradingreasonName: res.key + "-" + res.value
                        });
                    }
                }
            }
        });
    },
    bindDeliverydeptSelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../customercomplaint/selectSearch?type=deliverydept',
            events: {
                returnDeliverydeptSelect: function (res) {
                    if (res) {
                        that.setData({
                            deliverydeptId: res.key,
                            deliverydeptName: res.key + "-" + res.value
                        });
                    }
                }
            }
        });
    },
    bindDeliveryremarkChange: function (e) {
        var that = this;
        that.setData({
            deliveryremark: e.detail.value
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
        if (!this.data.maintainTypeId || this.data.maintainTypeId == '') {
            canSubmit = false;
            errmsg += "请选择维修单别\r\n";
        }
        if (!this.data.repairKindId || this.data.repairKindId == '') {
            canSubmit = false;
            errmsg += "请选择叫修单别\r\n";
        }
        if (!this.data.repairno || this.data.repairno == '') {
            canSubmit = false;
            errmsg += "请选择叫修单号\r\n";
        }
        if (!this.data.maintainer || this.data.maintainer == '') {
            canSubmit = false;
            errmsg += "请选择维修人员\r\n";
        }
        if (!this.data.incentoryformId || this.data.incentoryformId == '') {
            canSubmit = false;
            errmsg += "请选择库存交易单别\r\n";
        }
        if (!this.data.deliverydeptId || this.data.deliverydeptId == '') {
            canSubmit = false;
            errmsg += "请选择发货部门\r\n";
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
                            url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/reptc/createMaintain?' + app.globalData.restAuth,
                            data: {
                                maintainTypeId: _this_1.data.maintainTypeId,
                                repairKindId: _this_1.data.repairKindId,
                                repairno: _this_1.data.repairno,
                                customer: _this_1.data.customer,
                                employeeId: _this_1.data.employeeId,
                                deptId: _this_1.data.deptId,
                                reptds: _this_1.data.detailList,
                                remark: _this_1.data.remark,
                                maintainer: _this_1.data.maintainer,
                                sessionkey: app.globalData.sessionKey,
                                openId: app.globalData.openId,
                                incentoryform: _this_1.data.incentoryformId,
                                tradingreason: _this_1.data.tradingreasonId,
                                deliveryremark: _this_1.data.deliveryremark,
                                deliverydeptId: _this_1.data.deliverydeptId
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnRhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWludGFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7QUFDbEIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsSUFBSTtRQUNoQixZQUFZLEVBQUUsSUFBSTtRQUNsQixNQUFNLEVBQUUsSUFBSTtRQUNaLFFBQVEsRUFBRSxJQUFJO1FBQ2QsY0FBYyxFQUFFLEVBQUU7UUFDbEIsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixZQUFZLEVBQUUsRUFBRTtRQUNoQixjQUFjLEVBQUUsRUFBRTtRQUNsQixRQUFRLEVBQUUsRUFBRTtRQUNaLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsRUFBRTtRQUNaLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULFNBQVMsRUFBRSxFQUFFO1FBQ2IsS0FBSyxFQUFFLEVBQUU7UUFDVCxNQUFNLEVBQUUsRUFBRTtRQUNWLEtBQUssRUFBRSxFQUFFO1FBQ1QsS0FBSyxFQUFFLEVBQUU7UUFDVCxLQUFLLEVBQUUsRUFBRTtRQUNULFFBQVEsRUFBRSxFQUFFO1FBQ1osV0FBVyxFQUFFLEVBQUU7UUFDZixNQUFNLEVBQUUsRUFBRTtRQUNWLFVBQVUsRUFBRSxFQUFFO1FBQ2QsWUFBWSxFQUFFLEVBQUU7UUFDaEIsV0FBVyxFQUFFLEVBQUU7UUFDZixhQUFhLEVBQUUsRUFBRTtRQUNqQixlQUFlLEVBQUUsRUFBRTtRQUNuQixpQkFBaUIsRUFBRSxFQUFF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Qzs0QkFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dDQUNSLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTs0QkFDbEIsQ0FBQzt5QkFDRixDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztJQUNELFNBQVM7SUFDVCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9sZWF2ZS50c1xyXG5pbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXHJcblxyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcbmxldCBkID0gbmV3IERhdGUoKVxyXG5QYWdlKHtcclxuICBkYXRhOiB7XHJcbiAgICBkZXRhaWxMaXN0OiBbXSwvL+aYjue7huWNlei6q+aVsOaNrlxyXG4gICAgZW1wbG95ZWVJZDogbnVsbCxcclxuICAgIGVtcGxveWVlTmFtZTogbnVsbCxcclxuICAgIGRlcHRJZDogbnVsbCxcclxuICAgIGRlcHROYW1lOiBudWxsLFxyXG4gICAgbWFpbnRhaW5UeXBlSWQ6ICcnLFxyXG4gICAgbWFpbnRhaW5UeXBlTmFtZTogJycsXHJcbiAgICByZXBhaXJLaW5kSWQ6ICcnLC8v5Y+r5L+u5Y2V5YirXHJcbiAgICByZXBhaXJLaW5kTmFtZTogJycsXHJcbiAgICBjdXN0b21lcjogJycsICAvL+WuouaIt1xyXG4gICAgY3VzbmE6ICcnLFxyXG4gICAgdGEwMDk6ICcnLCAvL+aOpeWNleS6uuWRmFxyXG4gICAgcmVjZWl2ZXI6ICcnLFxyXG4gICAgdGEwMDU6ICcnLFxyXG4gICAgdGEwMDY6ICcnLFxyXG4gICAgdGEwMDc6ICcnLFxyXG4gICAgdGEwMTM6ICcnLFxyXG4gICAgdGE1MDA6ICcnLFxyXG4gICAgdGExOTc6ICcnLFxyXG4gICAgcHJvZHVjdG5hOiAnJyxcclxuICAgIHRhMTk4OiAnJyxcclxuICAgIGFyZWFuYTogJycsXHJcbiAgICB0YTA3MTogJycsXHJcbiAgICB0YTAxMDogJycsXHJcbiAgICB0YTAwMzogJycsXHJcbiAgICByZXBhaXJubzogJycsLy/lj6vkv67ljZXlj7dcclxuICAgIHByb2R1Y3RVbml0OiAnJyxcclxuICAgIHJlbWFyazogJycsXHJcbiAgICBtYWludGFpbmVyOiAnJyxcclxuICAgIG1haW50YWluZXJJZDogJycsXHJcbiAgICB3YXJlaG91c2VJZDogJycsXHJcbiAgICB3YXJlaG91c2VOYW1lOiAnJyxcclxuICAgIGluY2VudG9yeWZvcm1JZDogJycsXHJcbiAgICBpbmNlbnRvcnlmb3JtTmFtZTogJycsXHJcbiAgICB0cmFkaW5ncmVhc29uSWQ6ICcnLFxyXG4gICAgdHJhZGluZ3JlYXNvbk5hbWU6ICcnLFxyXG4gICAgZGVsaXZlcnlyZW1hcms6ICcnLFxyXG4gICAgZGVsaXZlcnlkZXB0SWQ6ICcnLFxyXG4gICAgZGVsaXZlcnlkZXB0TmFtZTogJydcclxuICB9LFxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgdGl0bGU6ICdMb2FkaW5nJyxcclxuICAgIH0pXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgfSwgMjAwMClcclxuXHJcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEub3BlbklkKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGhhc09wZW5JZDogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgZW1wbG95ZWVJZDogYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcclxuICAgICAgICBlbXBsb3llZU5hbWU6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgZGVwdElkOiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkLFxyXG4gICAgICAgIGRlcHROYW1lOiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkICsgJy0nICsgYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHROYW1lXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBiaW5kTWFpbnRhaW5UeXBlU2VsZWN0KGUpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgaWYgKHRoaXMuZGF0YS5tYWludGFpbmVyID09IG51bGwgfHwgdGhpcy5kYXRhLm1haW50YWluZXI9PVwiXCIpe1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBcIuivt+WFiOmAieaLqee7tOS/ruS6uuWRmFwiLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9ZWxzZXtcclxuICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICB1cmw6ICcuLi9jdXN0b21lcmNvbXBsYWludC9zZWxlY3Q/dHlwZT0nICsgJ21haW50YWluVHlwZSZpZD0nICsgdGhpcy5kYXRhLm1haW50YWluZXIsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybk1haW50YWluVHlwZVNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBtYWludGFpblR5cGVJZDogcmVzLmtleSxcclxuICAgICAgICAgICAgICBtYWludGFpblR5cGVOYW1lOiByZXMua2V5ICsgJy0nICsgcmVzLnZhbHVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmluZFJlcGFpcktpbmQoZSkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vc2VuZGpvYi9yZXBhaXJLaW5kJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuUmVwYWlyS2luZDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICByZXBhaXJLaW5kSWQ6IHJlcy5rLFxyXG4gICAgICAgICAgICAgIHJlcGFpcktpbmROYW1lOiByZXMuayArICctJyArIHJlcy52XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGJpbmRSZXBhaXJub0NoYW5nZShlKSB7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgIGlmICh0aGF0LmRhdGEucmVwYWlyS2luZElkICE9ICcnICYmIHRoYXQuZGF0YS5yZXBhaXJLaW5kSWQgIT0gbnVsbCkge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6ICcuLi9jdXN0b21lcmNvbXBsYWludC9zZWxlY3RTZWFyY2g/dHlwZT0nICsgJ3JlcGFpcm5vJiZpZD0nICsgdGhpcy5kYXRhLnJlcGFpcktpbmRJZCxcclxuICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgIHJldHVyblJlcGFpcm5vU2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICAgIC8vIOWPq+S/ruWNleWPt++8jOWNleaNruaXpeacn++8jOWuouaIt+e8luWPtywg5o6l5Y2V5Lq65ZGYLCDkuqflk4Hlk4Hlj7fvvIzkuqflk4Hlk4HlkI3vvIzkuqflk4Hop4TmoLzvvIzkuqflk4Hluo/lj7csIOacuuWeiywg5Lqn5ZOB5Yir77yM5Yy65Z+f5YirLCDpl67popjku6Plj7fvvIzpl67popjmj4/ov7BcclxuICAgICAgICAgICAgICAgIC8vIFRBMDAyLCAgICBUQTAwMywgICBUQTAwNCwgICBUQTAwOSwgICAgVEEwMDUsICAgVEEwMDYsICAgVEEwMDcsICAgIFRBMDEzLCBUQTUwMCwgVEExOTcsICBUQTE5OCwgICBUQTA3MSwgICBUQTAxMFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tZXI6IHJlcy50YTAwNCwgIC8v5a6i5oi3XHJcbiAgICAgICAgICAgICAgICBjdXNuYTogcmVzLmN1c25hLFxyXG4gICAgICAgICAgICAgICAgdGEwMDk6IHJlcy50YTAwOSwgLy/mjqXljZXkurrlkZhcclxuICAgICAgICAgICAgICAgIHJlY2VpdmVyOiByZXMucmVjZWl2ZXIsXHJcbiAgICAgICAgICAgICAgICB0YTAwNTogcmVzLnRhMDA1LFxyXG4gICAgICAgICAgICAgICAgdGEwMDY6IHJlcy50YTAwNixcclxuICAgICAgICAgICAgICAgIHRhMDA3OiByZXMudGEwMDcsXHJcbiAgICAgICAgICAgICAgICB0YTAxMzogcmVzLnRhMDEzLFxyXG4gICAgICAgICAgICAgICAgdGE1MDA6IHJlcy50YTUwMCxcclxuICAgICAgICAgICAgICAgIHRhMTk3OiByZXMudGExOTcsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0bmE6IHJlcy5wcm9kdWN0bmEsXHJcbiAgICAgICAgICAgICAgICB0YTE5ODogcmVzLnRhMTk4LFxyXG4gICAgICAgICAgICAgICAgYXJlYW5hOiByZXMuYXJlYW5hLFxyXG4gICAgICAgICAgICAgICAgdGEwNzE6IHJlcy50YTA3MSxcclxuICAgICAgICAgICAgICAgIHRhMDEwOiByZXMudGEwMTAsXHJcbiAgICAgICAgICAgICAgICB0YTAwMzogcmVzLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgcmVwYWlybm86IHJlcy5rZXlcclxuICAgICAgICAgICAgICAgIHJlbWFyazogcmVzLnRhMDE3XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBcIuivt+WFiOmAieaLqeWPq+S/ruWNleWIq1wiLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYmluZEFkZERldGFpbFRhcChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vbWFpbnRhaW4vbWFpbnRhaW5EZXRhaWw/d2FyZWhvdXNlPScgKyBfdGhpcy5kYXRhLndhcmVob3VzZU5hbWUgKyBcIiZ3YXJlaG91c2VJZD1cIiArIF90aGlzLmRhdGEud2FyZWhvdXNlSWQsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybkRldGFpbDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgbGV0IGRldGFpbHMgPSBfdGhpcy5kYXRhLmRldGFpbExpc3RcclxuICAgICAgICAgIGRldGFpbHMucHVzaChyZXMuZGF0YSlcclxuICAgICAgICAgIGRldGFpbHMuZm9yRWFjaCgobywgaSkgPT4ge1xyXG4gICAgICAgICAgICBvLnNlcSA9IGkgKyAxXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgX3RoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIGRldGFpbExpc3Q6IGRldGFpbHMsXHJcbiAgICAgICAgICAgIGNhblN1Ym1pdDogdHJ1ZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgcmVzLmV2ZW50Q2hhbm5lbC5lbWl0KCdvcGVuRGV0YWlsJywge1xyXG4gICAgICAgICAgZGF0YTpcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZW1wbG95ZWVJZDogX3RoaXMuZGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICBlbXBsb3llZU5hbWU6IF90aGlzLmRhdGEuZW1wbG95ZWVOYW1lLFxyXG4gICAgICAgICAgICBkZXB0SWQ6IF90aGlzLmRhdGEuZGVwdElkLFxyXG4gICAgICAgICAgICBkZXB0TmFtZTogX3RoaXMuZGF0YS5kZXB0TmFtZVxyXG4gICAgICAgICAgfSwgaXNOZXc6IHRydWVcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGJpbmRSZW1vdmVEZXRhaWxUYXAoZSkge1xyXG4gICAgbGV0IGRldGFpbHMgPSB0aGlzLmRhdGEuZGV0YWlsTGlzdFxyXG4gICAgbGV0IGluZGV4ID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaW5kZXhcclxuICAgIGRldGFpbHMuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgZGV0YWlscy5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgIG8uc2VxID0gaSArIDFcclxuICAgIH0pXHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgZGV0YWlsTGlzdDogZGV0YWlsc1xyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICBiaW5kRWRpdERldGFpbFRhcChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICBsZXQgaW5kZXggPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleFxyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4vbWFpbnRhaW5EZXRhaWwnLFxyXG4gICAgICBldmVudHM6IHtcclxuICAgICAgICByZXR1cm5EZXRhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGxldCBkZXRhaWxzID0gX3RoaXMuZGF0YS5kZXRhaWxMaXN0XHJcbiAgICAgICAgICBkZXRhaWxzLnNwbGljZShpbmRleCwgMSlcclxuICAgICAgICAgIGRldGFpbHMucHVzaChyZXMuZGF0YSlcclxuICAgICAgICAgIGRldGFpbHMuZm9yRWFjaCgobywgaSkgPT4ge1xyXG4gICAgICAgICAgICBvLnNlcSA9IGkgKyAxXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgX3RoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICBkZXRhaWxMaXN0OiBkZXRhaWxzLFxyXG4gICAgICAgICAgICBjYW5TdWJtaXQ6IHRydWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgIGxldCBjdXJyZW50T2JqZWN0ID0gX3RoaXMuZGF0YS5kZXRhaWxMaXN0W2luZGV4XVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJlcy5ldmVudENoYW5uZWwuZW1pdCgnb3BlbkRldGFpbCcsIHtcclxuICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHByb2R1Y3RRdWFsaXR5OiBjdXJyZW50T2JqZWN0LnByb2R1Y3RRdWFsaXR5LFxyXG4gICAgICAgICAgICBwcm9kdWN0X25hbWU6IGN1cnJlbnRPYmplY3QucHJvZHVjdF9uYW1lLFxyXG4gICAgICAgICAgICBwcm9kdWN0U3RhbmRhcmQ6IGN1cnJlbnRPYmplY3QucHJvZHVjdFN0YW5kYXJkLFxyXG4gICAgICAgICAgICB3YXJyYW50eVN0YXJ0OiBjdXJyZW50T2JqZWN0LndhcnJhbnR5U3RhcnQsXHJcbiAgICAgICAgICAgIHdhcnJhbnR5RW5kOiBjdXJyZW50T2JqZWN0LndhcnJhbnR5RW5kLFxyXG4gICAgICAgICAgICBwbGFuTWFpbnRhaW5Db3VudDogY3VycmVudE9iamVjdC5wbGFuTWFpbnRhaW5Db3VudCxcclxuICAgICAgICAgICAgbWFpbnRhaW5DYXRlZ29yeUlkOiBjdXJyZW50T2JqZWN0Lm1haW50YWluQ2F0ZWdvcnlJZCxcclxuICAgICAgICAgICAgbWFpbnRhaW5DYXRlZ29yeU5hbWU6IGN1cnJlbnRPYmplY3QubWFpbnRhaW5DYXRlZ29yeU5hbWUsXHJcbiAgICAgICAgICAgIHdhcmVob3VzZUlkOiBjdXJyZW50T2JqZWN0LndhcmVob3VzZUlkLFxyXG4gICAgICAgICAgICB3YXJlaG91c2VOYW1lOiBjdXJyZW50T2JqZWN0LndhcmVob3VzZU5hbWUsXHJcbiAgICAgICAgICAgIHByb2R1Y3RVbml0OiBjdXJyZW50T2JqZWN0LnByb2R1Y3RVbml0XHJcbiAgICAgICAgICB9LCBpc05ldzogZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGJpbmRNYWludGFpbk51bWJlclNlbGVjdChlKSB7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgIGlmICh0aGF0LmRhdGEucmVwYWlyS2luZElkID09ICcnICYmIHRoYXQuZGF0YS5yZXBhaXJLaW5kSWQgPT0gbnVsbCkge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBcIuivt+WFiOmAieaLqeWPq+S/ruWNleWPt1wiLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICB1cmw6ICcuLi9jdXN0b21lcmNvbXBsYWludC9zZWxlY3Q/dHlwZT1tYWludGFpbk51bWJlciYmaWQ9JyArIHRoaXMuZGF0YS5yZXBhaXJLaW5kSWQgKyBcInxcIiArIHRoaXMuZGF0YS5yZXBhaXJubywvL+WPq+S/ruWNleWPt1xyXG4gICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgcmV0dXJuTWFpbnRhaW5OdW1iZXJTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgICAgbWFpbnRhaW5lcjogcmVzLmtleSxcclxuICAgICAgICAgICAgICAgIG1haW50YWluZUlkOiByZXMua2V5ICsgJy0nICsgcmVzLnZhbHVlLFxyXG4gICAgICAgICAgICAgICAgd2FyZWhvdXNlSWQ6IHJlcy52YWx1ZTEsXHJcbiAgICAgICAgICAgICAgICB3YXJlaG91c2VOYW1lOiByZXMudmFsdWUxICsgXCItXCIgKyByZXMudmFsdWUyXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuXHJcbiAgYmluZEluY2VudG9yeWZvcm1TZWxlY3QoZSkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgIHVybDogJy4uL2N1c3RvbWVyY29tcGxhaW50L3NlbGVjdD90eXBlPWluY2VudG9yeWZvcm0nLFxyXG4gICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgcmV0dXJuSW5jZW50b3J5Zm9ybVNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XHJcbiAgICAgICAgICAgICAgICBpbmNlbnRvcnlmb3JtSWQ6cmVzLmtleSxcclxuICAgICAgICAgICAgICAgIGluY2VudG9yeWZvcm1OYW1lOnJlcy5rZXkrXCItXCIrcmVzLnZhbHVlXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICB9LFxyXG5cclxuICBiaW5kVHJhZGluZ1JlYXNvblNlbGVjdChlKSB7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICB1cmw6ICcuLi9jdXN0b21lcmNvbXBsYWludC9zZWxlY3Q/dHlwZT10cmFkaW5ncmVhc29uJmlkPScrdGhhdC5kYXRhLmluY2VudG9yeWZvcm1JZCxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuVHJhZGluZ3JlYXNvblNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICB0cmFkaW5ncmVhc29uSWQ6IHJlcy5rZXksXHJcbiAgICAgICAgICAgICAgdHJhZGluZ3JlYXNvbk5hbWU6IHJlcy5rZXkrXCItXCIrcmVzLnZhbHVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG5cclxuICBiaW5kRGVsaXZlcnlkZXB0U2VsZWN0KGUpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4uL2N1c3RvbWVyY29tcGxhaW50L3NlbGVjdFNlYXJjaD90eXBlPWRlbGl2ZXJ5ZGVwdCcsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybkRlbGl2ZXJ5ZGVwdFNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBkZWxpdmVyeWRlcHRJZDogcmVzLmtleSxcclxuICAgICAgICAgICAgICBkZWxpdmVyeWRlcHROYW1lOiByZXMua2V5ICsgXCItXCIgKyByZXMudmFsdWVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBcclxuICBiaW5kRGVsaXZlcnlyZW1hcmtDaGFuZ2UoZSkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgZGVsaXZlcnlyZW1hcms6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGZvcm1TdWJtaXQoZSkge1xyXG4gICAgbGV0IGNhblN1Ym1pdCA9IHRydWVcclxuICAgIGxldCBlcnJtc2cgPSAnJ1xyXG4gICAgaWYgKCFhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6LSm5Y+35pyq5o6I5p2DXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmRhdGEuZW1wbG95ZWVJZCB8fCB0aGlzLmRhdGEuZW1wbG95ZWVJZCA9PSAnJykge1xyXG4gICAgICBjYW5TdWJtaXQgPSBmYWxzZVxyXG4gICAgICBlcnJtc2cgKz0gJ+ivt+Whq+WGmeeUs+ivt+S6uuWRmFxcclxcbidcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLmRlcHRJZCB8fCB0aGlzLmRhdGEuZGVwdElkID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSBcIuivt+Whq+WGmeeUs+ivt+mDqOmXqFxcclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5tYWludGFpblR5cGVJZCB8fCB0aGlzLmRhdGEubWFpbnRhaW5UeXBlSWQgPT0gJycpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+36YCJ5oup57u05L+u5Y2V5YirXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLnJlcGFpcktpbmRJZCB8fCB0aGlzLmRhdGEucmVwYWlyS2luZElkID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSBcIuivt+mAieaLqeWPq+S/ruWNleWIq1xcclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5yZXBhaXJubyB8fCB0aGlzLmRhdGEucmVwYWlybm8gPT0gJycpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+36YCJ5oup5Y+r5L+u5Y2V5Y+3XFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLm1haW50YWluZXIgfHwgdGhpcy5kYXRhLm1haW50YWluZXIgPT0gJycpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+36YCJ5oup57u05L+u5Lq65ZGYXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLmluY2VudG9yeWZvcm1JZCB8fCB0aGlzLmRhdGEuaW5jZW50b3J5Zm9ybUlkID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSBcIuivt+mAieaLqeW6k+WtmOS6pOaYk+WNleWIq1xcclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5kZWxpdmVyeWRlcHRJZCB8fCB0aGlzLmRhdGEuZGVsaXZlcnlkZXB0SWQgPT0gJycpIHtcclxuICAgICAgY2FuU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9IFwi6K+36YCJ5oup5Y+R6LSn6YOo6ZeoXFxyXFxuXCJcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2FuU3VibWl0KSB7XHJcbiAgICAgIGxldCBfdGhpcyA9IHRoaXNcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogJ+ehruWumuaPkOS6pOWQlycsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgICAgICAgICAgdGl0bGU6ICdTZW5kaW5nJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtSlJTL2FwaS9jcm0vcmVwdGMvY3JlYXRlTWFpbnRhaW4/JyArIGFwcC5nbG9iYWxEYXRhLnJlc3RBdXRoLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIG1haW50YWluVHlwZUlkOiBfdGhpcy5kYXRhLm1haW50YWluVHlwZUlkLFxyXG4gICAgICAgICAgICAgICAgcmVwYWlyS2luZElkOiBfdGhpcy5kYXRhLnJlcGFpcktpbmRJZCxcclxuICAgICAgICAgICAgICAgIHJlcGFpcm5vOiBfdGhpcy5kYXRhLnJlcGFpcm5vLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tZXI6IF90aGlzLmRhdGEuY3VzdG9tZXIsXHJcbiAgICAgICAgICAgICAgICBlbXBsb3llZUlkOiBfdGhpcy5kYXRhLmVtcGxveWVlSWQsXHJcbiAgICAgICAgICAgICAgICBkZXB0SWQ6IF90aGlzLmRhdGEuZGVwdElkLFxyXG4gICAgICAgICAgICAgICAgcmVwdGRzOiBfdGhpcy5kYXRhLmRldGFpbExpc3QsXHJcbiAgICAgICAgICAgICAgICByZW1hcms6IF90aGlzLmRhdGEucmVtYXJrLFxyXG4gICAgICAgICAgICAgICAgbWFpbnRhaW5lcjogX3RoaXMuZGF0YS5tYWludGFpbmVyLFxyXG4gICAgICAgICAgICAgICAgc2Vzc2lvbmtleTogYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleSxcclxuICAgICAgICAgICAgICAgIG9wZW5JZDogYXBwLmdsb2JhbERhdGEub3BlbklkLFxyXG4gICAgICAgICAgICAgICAgaW5jZW50b3J5Zm9ybTogX3RoaXMuZGF0YS5pbmNlbnRvcnlmb3JtSWQsXHJcbiAgICAgICAgICAgICAgICB0cmFkaW5ncmVhc29uOiBfdGhpcy5kYXRhLnRyYWRpbmdyZWFzb25JZCxcclxuICAgICAgICAgICAgICAgIGRlbGl2ZXJ5cmVtYXJrOiBfdGhpcy5kYXRhLmRlbGl2ZXJ5cmVtYXJrLFxyXG4gICAgICAgICAgICAgICAgZGVsaXZlcnlkZXB0SWQ6IF90aGlzLmRhdGEuZGVsaXZlcnlkZXB0SWRcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiByZXMuZGF0YS5tc2csXHJcbiAgICAgICAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3BhZ2VzL2luZGV4L2luZGV4XCJcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6IGVycm1zZyxcclxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZm9ybVJlc2V0KCkge1xyXG4gIH1cclxufSlcclxuIl19