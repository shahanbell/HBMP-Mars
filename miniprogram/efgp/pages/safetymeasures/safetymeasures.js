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
        applyUserId: null,
        applyUserName: null,
        applyDeptId: null,
        applyDeptName: null,
        company: null,
        safetyOfficeId: null,
        safetyOfficeName: null,
        safetyDeptId: null,
        safetyDeptName: null,
        deptManager1Id: null,
        deptManager1Name: null,
        deptManager2Id: null,
        deptManager2Name: null,
        monthSafetyOfficeId: null,
        monthSafetyOfficeName: null,
        isChargeShow: false,
        chargeId: null,
        chargeName: null,
        charges: [
            {
                key: '1',
                name: '立即停产',
            },
            {
                key: '2',
                name: '立即停止施工',
            },
            {
                key: '3',
                name: '立即改善',
            },
            {
                key: '4',
                name: '之后整改',
            },
        ],
        isDateShow: false,
        showDateInit: new Date().getTime(),
        endDate: "",
        formatter: function (type, value) {
            if (type === 'year') {
                return value + "\u5E74";
            }
            else if (type === 'month') {
                return value + "\u6708";
            }
            else if (type === 'day') {
                return value + "\u65E5";
            }
            return value;
        },
        dateSelect: null,
        address: null,
        constructionSide: null,
        deduction: null,
        uploaderList: [],
        showUpload: true,
        hkpb033Files: [],
        ajaxShow: false
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
                applyUserId: app.globalData.employeeId,
                applyUserName: app.globalData.employeeName
            });
        }
        if (app.globalData.defaultDeptId) {
            this.setData({
                applyDeptId: app.globalData.defaultDeptId,
                applyDeptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName,
                company: app.globalData.defaultCompany + '-' + app.globalData.defaultCompanyName
            });
        }
    },
    bindSafetyOfficeSelect: function () {
        var _this = this;
        wx.navigateTo({
            url: '../../../pages/userSelect/userSelect',
            events: {
                returnUserSelect: function (res) {
                    if (res) {
                        console.info("===");
                        var _wx = wx;
                        _wx.showLoading({
                            title: '加载中'
                        });
                        _this.setData({
                            safetyOfficeId: res.k,
                            safetyOfficeName: res.k + '-' + res.v,
                            ajaxShow: true
                        });
                        _this.getSafetyOfficeDept(res.k, _wx);
                    }
                }
            },
            success: function (res) {
            }
        });
    },
    getSafetyOfficeDept: function (userid, _wx) {
        var _this = this;
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/functions/f;users.id=' + userid + '/s/0/20',
            data: {
                appid: app.globalData.restId,
                token: app.globalData.restToken
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                var data = res.data;
                if (data) {
                    data.forEach(function (o, i) {
                        if (o.isMain == 1) {
                            _this.setData({
                                safetyDeptId: o.organizationUnit.id,
                                safetyDeptName: o.organizationUnit.id + '-' + o.organizationUnit.organizationUnitName,
                            });
                        }
                    });
                }
                else {
                    _this.setData({
                        ajaxShow: false
                    });
                    wx.showModal({
                        title: '系统提示',
                        content: "获取部门失败",
                        showCancel: false
                    });
                }
                _this.getManage1rUser(userid, _wx);
            },
            fail: function (fail) {
            }
        });
    },
    getManage1rUser: function (userid, _wx) {
        var _this = this;
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/functions/functionlevel/manager/' + userid + '/课长级?' + app.globalData.restAuth,
            data: {
                appid: app.globalData.restId,
                token: app.globalData.restToken
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                var data = res.data;
                if (data.code == '200') {
                    _this.setData({
                        deptManager1Id: data.object.id,
                        deptManager1Name: data.object.userName,
                    });
                }
                else {
                    _this.setData({
                        ajaxShow: false
                    });
                    wx.showModal({
                        title: '系统提示',
                        content: "获取课级主管失败",
                        showCancel: false
                    });
                }
                _this.getManage2rUser(userid, _wx);
            },
            fail: function (fail) {
            }
        });
    },
    getManage2rUser: function (userid, _wx) {
        var _this = this;
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/functions/functionlevel/manager/' + userid + '/经理级?' + app.globalData.restAuth,
            data: {
                appid: app.globalData.restId,
                token: app.globalData.restToken
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                var data = res.data;
                if (data.code == '200') {
                    _this.setData({
                        deptManager2Id: data.object.id,
                        deptManager2Name: data.object.userName,
                        ajaxShow: false
                    });
                }
                else {
                    _this.setData({
                        ajaxShow: false
                    });
                    wx.showModal({
                        title: '系统提示',
                        content: "获取经理级主管失败",
                        showCancel: false
                    });
                }
            },
            fail: function (fail) {
            }
        });
    },
    bindMonthSafetyOfficeSelect: function () {
        var _this = this;
        wx.navigateTo({
            url: 'safemanagerselect',
            events: {
                returnSafeManagerSelect: function (res) {
                    if (res) {
                        _this.setData({
                            monthSafetyOfficeId: res.k,
                            monthSafetyOfficeName: res.v
                        });
                    }
                }
            },
            success: function (res) {
                console.log(res);
            }
        });
    },
    bindDescribehange: function (e) {
        var _this = this;
        _this.setData({
            describe: e.detail
        });
    },
    bindChargeShow: function () {
        var _this = this;
        if (!_this.data.isChargeShow) {
            _this.setData({
                isChargeShow: true
            });
        }
    },
    bindChargesClose: function () {
        var _this = this;
        _this.setData({
            isChargeShow: false
        });
    },
    bindChargesSelect: function (e) {
        var _this = this;
        _this.setData({
            chargeId: e.detail.value.key,
            chargeName: e.detail.value.name,
            isChargeShow: false
        });
    },
    bindOpenDate: function (e) {
        var _this = this;
        _this.setData({
            isDateShow: true,
            dateSelect: e.target.id
        });
    },
    bindCloseDate: function (e) {
        var _this = this;
        _this.setData({
            isDateShow: false,
        });
    },
    bindDateConfirm: function (e) {
        var _this = this;
        var list = _this.data.month;
        _this.setData({
            month: list,
            isDateShow: false,
            endDate: this.dateFormatForYYMMDD(e.detail)
        });
    },
    bindAddressChange: function (e) {
        this.setData({
            address: e.detail
        });
    },
    bindConstructionSideChange: function (e) {
        this.setData({
            constructionSide: e.detail
        });
    },
    bindConstructionProjectChange: function (e) {
        this.setData({
            constructionProject: e.detail
        });
    },
    bindDeductionChange: function (e) {
        var reg = /^[\+\-]?(\d*\.\d?|\d+(\.\d{0,2})?)$/;
        var _this = this;
        var data = e.detail;
        if (reg.test(e.detail)) {
            _this.setData({
                deduction: e.detail
            });
        }
        else {
            _this.setData({
                deduction: ''
            });
        }
    },
    clearImg: function (e) {
        var nowList = [];
        var uploaderList = this.data.uploaderList;
        for (var i = 0; i < uploaderList.length; i++) {
            if (i == e.currentTarget.dataset.index) {
                continue;
            }
            else {
                nowList.push(uploaderList[i]);
            }
        }
        this.setData({
            uploaderNum: this.data.uploaderNum - 1,
            uploaderList: nowList,
            showUpload: true
        });
    },
    showImg: function (e) {
        var that = this;
        wx.previewImage({
            urls: that.data.uploaderList,
            current: that.data.uploaderList[e.currentTarget.dataset.index]
        });
    },
    dateFormatForYYMMDD: function (date) {
        var dateTemp = new Date(date);
        var year = dateTemp.getFullYear();
        var month = dateTemp.getMonth() + 1;
        var day = dateTemp.getDate();
        var dayTemp = year + "/" + month + "/" + day;
        return dayTemp;
    },
    upload: function (e) {
        var that = this;
        wx.chooseImage({
            count: 3 - that.data.uploaderNum,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                console.info('tempFilePaths==' + JSON.stringify(tempFilePaths));
                var uploaderList = that.data.uploaderList.concat(tempFilePaths);
                if (uploaderList.length == 3) {
                    that.setData({
                        showUpload: false
                    });
                }
                that.setData({
                    uploaderList: uploaderList,
                    uploaderNum: uploaderList.length,
                });
            }
        });
    },
    initFile: function () {
        console.info("1111");
        var nowList = [];
        var _this = this;
        var FileSystemManager = wx.getFileSystemManager();
        _this.data.uploaderList.forEach(function (o, i) {
            console.info("222");
            var baselib = FileSystemManager.readFileSync(_this.data.uploaderList[i], 'base64');
            var imagePathTemp = _this.data.uploaderList[i].split('.');
            var imageType = imagePathTemp[imagePathTemp.length - 1];
            var obj = { data: baselib, imageType: imageType };
            nowList.push(obj);
        });
        _this.setData({
            hkpb033Files: nowList
        });
    },
    formSubmit: function (e) {
        var isSubmit = true;
        var errmsg = '';
        var _this = this;
        _this.initFile();
        if (!app.globalData.authorized) {
            isSubmit = false;
            errmsg += '账号未授权\r\n';
        }
        if (_this.data.safetyOfficeName == '' || _this.data.safetyOfficeName == null) {
            isSubmit = false;
            errmsg += '请选择单位安全员\r\n';
        }
        if (_this.data.deptManager1Name == '' || _this.data.deptManager1Name == null) {
            isSubmit = false;
            errmsg += '请选择部门主管\r\n';
        }
        if (_this.data.deptManager2Name == '' || _this.data.deptManager2Name == null) {
            isSubmit = false;
            errmsg += '请选择单位主管\r\n';
        }
        if (_this.data.address == '' || _this.data.address == null) {
            isSubmit = false;
            errmsg += '请填写地址\r\n';
        }
        if (_this.data.monthSafetyOfficeName == '' || _this.data.monthSafetyOfficeName == null) {
            isSubmit = false;
            errmsg += '请选择当月安全课长\r\n';
        }
        if (_this.data.monthSafetyOfficeName == '' || _this.data.monthSafetyOfficeName == null) {
            isSubmit = false;
            errmsg += '请选择当月安全课长\r\n';
        }
        if (_this.data.hkpb033Files.length == 0) {
            isSubmit = false;
            errmsg += '请上传图片\r\n';
        }
        if (_this.data.chargeId == 4 && this.data.endDate == "") {
            isSubmit = false;
            errmsg += '当责令是之后整改时，整改时间必填\r\n';
        }
        console.info("res=" + _this.data.hkpb033Files);
        if (isSubmit) {
            wx.showModal({
                title: '系统提示',
                content: '确定提交吗',
                success: function (res) {
                    if (res.confirm) {
                        wx.showLoading({
                            title: 'Sending'
                        });
                        wx.request({
                            url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkpb033/wechat?' + app.globalData.restAuth,
                            data: __assign({}, _this.data),
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FmZXR5bWVhc3VyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzYWZldHltZWFzdXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtBQUNsQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixXQUFXLEVBQUUsSUFBSTtRQUNqQixhQUFhLEVBQUUsSUFBSTtRQUNuQixXQUFXLEVBQUUsSUFBSTtRQUNqQixhQUFhLEVBQUUsSUFBSTtRQUNuQixPQUFPLEVBQUUsSUFBSTtRQUViLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsY0FBYyxFQUFFLElBQUk7UUFFcEIsY0FBYyxFQUFFLElBQUk7UUFDcEIsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixjQUFjLEVBQUUsSUFBSTtRQUNwQixnQkFBZ0IsRUFBRSxJQUFJO1FBRXRCLG1CQUFtQixFQUFFLElBQUk7UUFDekIscUJBQXFCLEVBQUUsSUFBSTtRQUMzQixZQUFZLEVBQUUsS0FBSztRQUNuQixRQUFRLEVBQUUsSUFBSTtRQUNkLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLE9BQU8sRUFBRTtZQUNQO2dCQUNFLEdBQUcsRUFBRSxHQUFHO2dCQUNSLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxHQUFHLEVBQUUsR0FBRztnQkFDUixJQUFJLEVBQUUsUUFBUTthQUNmO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLEdBQUc7Z0JBQ1IsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNEO2dCQUNFLEdBQUcsRUFBRSxHQUFHO2dCQUNSLElBQUksRUFBRSxNQUFNO2FBQ2I7U0FDRjtRQUNELFVBQVUsRUFBRSxLQUFLO1FBQ2pCLFlBQVksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFD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U0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztDQUVGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vbGVhdmUudHNcclxuaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vLi4vYXBwJ1xyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcbmxldCBkID0gbmV3IERhdGUoKVxyXG5QYWdlKHtcclxuICBkYXRhOiB7XHJcbiAgICBhcHBseVVzZXJJZDogbnVsbCxcclxuICAgIGFwcGx5VXNlck5hbWU6IG51bGwsXHJcbiAgICBhcHBseURlcHRJZDogbnVsbCxcclxuICAgIGFwcGx5RGVwdE5hbWU6IG51bGwsXHJcbiAgICBjb21wYW55OiBudWxsLFxyXG5cclxuICAgIHNhZmV0eU9mZmljZUlkOiBudWxsLFxyXG4gICAgc2FmZXR5T2ZmaWNlTmFtZTogbnVsbCxcclxuICAgIHNhZmV0eURlcHRJZDogbnVsbCxcclxuICAgIHNhZmV0eURlcHROYW1lOiBudWxsLFxyXG5cclxuICAgIGRlcHRNYW5hZ2VyMUlkOiBudWxsLFxyXG4gICAgZGVwdE1hbmFnZXIxTmFtZTogbnVsbCxcclxuICAgIGRlcHRNYW5hZ2VyMklkOiBudWxsLFxyXG4gICAgZGVwdE1hbmFnZXIyTmFtZTogbnVsbCxcclxuXHJcbiAgICBtb250aFNhZmV0eU9mZmljZUlkOiBudWxsLFxyXG4gICAgbW9udGhTYWZldHlPZmZpY2VOYW1lOiBudWxsLFxyXG4gICAgaXNDaGFyZ2VTaG93OiBmYWxzZSxcclxuICAgIGNoYXJnZUlkOiBudWxsLFxyXG4gICAgY2hhcmdlTmFtZTogbnVsbCxcclxuICAgIGNoYXJnZXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJzEnLFxyXG4gICAgICAgIG5hbWU6ICfnq4vljbPlgZzkuqcnLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnMicsXHJcbiAgICAgICAgbmFtZTogJ+eri+WNs+WBnOatouaWveW3pScsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICczJyxcclxuICAgICAgICBuYW1lOiAn56uL5Y2z5pS55ZaEJyxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJzQnLFxyXG4gICAgICAgIG5hbWU6ICfkuYvlkI7mlbTmlLknLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICAgIGlzRGF0ZVNob3c6IGZhbHNlLFxyXG4gICAgc2hvd0RhdGVJbml0OiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcclxuICAgIGVuZERhdGU6IFwiXCIsXHJcbiAgICBmb3JtYXR0ZXIodHlwZSwgdmFsdWUpIHtcclxuICAgICAgaWYgKHR5cGUgPT09ICd5ZWFyJykge1xyXG4gICAgICAgIHJldHVybiBgJHt2YWx1ZX3lubRgO1xyXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgICByZXR1cm4gYCR7dmFsdWV95pyIYDtcclxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGF5Jykge1xyXG4gICAgICAgIHJldHVybiBgJHt2YWx1ZX3ml6VgO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICBkYXRlU2VsZWN0OiBudWxsLFxyXG4gICAgYWRkcmVzczogbnVsbCxcclxuICAgIGNvbnN0cnVjdGlvblNpZGU6IG51bGwsXHJcbiAgICBkZWR1Y3Rpb246IG51bGwsXHJcbiAgICB1cGxvYWRlckxpc3Q6IFtdLFxyXG4gICAgc2hvd1VwbG9hZDogdHJ1ZSxcclxuICAgIGhrcGIwMzNGaWxlczogW10sXHJcbiAgICBhamF4U2hvdzogZmFsc2VcclxuICB9LFxyXG5cclxuICBvbkxvYWQoKSB7XHJcblxyXG4gICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICB0aXRsZTogJ0xvYWRpbmcnLFxyXG4gICAgfSlcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB3eC5oaWRlTG9hZGluZygpXHJcbiAgICB9LCAyMDAwKVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLm9wZW5JZCkge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBoYXNPcGVuSWQ6IHRydWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGFwcGx5VXNlcklkOiBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgIGFwcGx5VXNlck5hbWU6IGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgYXBwbHlEZXB0SWQ6IGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQsXHJcbiAgICAgICAgYXBwbHlEZXB0TmFtZTogYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCArICctJyArIGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZSxcclxuICAgICAgICBjb21wYW55OiBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0Q29tcGFueSArICctJyArIGFwcC5nbG9iYWxEYXRhLmRlZmF1bHRDb21wYW55TmFtZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJpbmRTYWZldHlPZmZpY2VTZWxlY3QoKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vLi4vLi4vcGFnZXMvdXNlclNlbGVjdC91c2VyU2VsZWN0JyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuVXNlclNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmluZm8oXCI9PT1cIik7XHJcbiAgICAgICAgICAgIHZhciBfd3ggPSB3eDtcclxuICAgICAgICAgICAgX3d4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICB0aXRsZTogJ+WKoOi9veS4rSdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIHNhZmV0eU9mZmljZUlkOiByZXMuayxcclxuICAgICAgICAgICAgICBzYWZldHlPZmZpY2VOYW1lOiByZXMuayArICctJyArIHJlcy52LFxyXG4gICAgICAgICAgICAgIGFqYXhTaG93OiB0cnVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIF90aGlzLmdldFNhZmV0eU9mZmljZURlcHQocmVzLmssIF93eCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGdldFNhZmV0eU9mZmljZURlcHQodXNlcmlkLCBfd3gpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXNcclxuICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgICsgJy9IYW5iZWxsLUpSUy9hcGkvZWZncC9mdW5jdGlvbnMvZjt1c2Vycy5pZD0nICsgdXNlcmlkICsgJy9zLzAvMjAnO1xyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH0sXHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICB2YXIgZGF0YSA9IHJlcy5kYXRhO1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAvL+W+queOr+iOt+WPluS4u+mDqOmXqFxyXG4gICAgICAgICAgZGF0YS5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvLmlzTWFpbiA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICBzYWZldHlEZXB0SWQ6IG8ub3JnYW5pemF0aW9uVW5pdC5pZCxcclxuICAgICAgICAgICAgICAgIHNhZmV0eURlcHROYW1lOiBvLm9yZ2FuaXphdGlvblVuaXQuaWQgKyAnLScgKyBvLm9yZ2FuaXphdGlvblVuaXQub3JnYW5pemF0aW9uVW5pdE5hbWUsXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBhamF4U2hvdzogZmFsc2VcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFwi6I635Y+W6YOo6Zeo5aSx6LSlXCIsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBfdGhpcy5nZXRNYW5hZ2UxclVzZXIodXNlcmlkLCBfd3gpO1xyXG4gICAgICB9LFxyXG4gICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgfSxcclxuICAvL+iOt+WPluivvumVv+e6p+S4u+euoVxyXG4gIGdldE1hbmFnZTFyVXNlcih1c2VyaWQsIF93eCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpc1xyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCAgKyAnL0hhbmJlbGwtSlJTL2FwaS9lZmdwL2Z1bmN0aW9ucy9mdW5jdGlvbmxldmVsL21hbmFnZXIvJyArIHVzZXJpZCArICcv6K++6ZW/57qnPycgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aCxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGFwcGlkOiBhcHAuZ2xvYmFsRGF0YS5yZXN0SWQsXHJcbiAgICAgICAgdG9rZW46IGFwcC5nbG9iYWxEYXRhLnJlc3RUb2tlblxyXG4gICAgICB9LFxyXG4gICAgICBoZWFkZXI6IHtcclxuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAnMjAwJykge1xyXG4gICAgICAgICAgX3RoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIGRlcHRNYW5hZ2VyMUlkOiBkYXRhLm9iamVjdC5pZCxcclxuICAgICAgICAgICAgZGVwdE1hbmFnZXIxTmFtZTogZGF0YS5vYmplY3QudXNlck5hbWUsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgYWpheFNob3c6IGZhbHNlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgICAgICBjb250ZW50OiBcIuiOt+WPluivvue6p+S4u+euoeWksei0pVwiLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIF90aGlzLmdldE1hbmFnZTJyVXNlcih1c2VyaWQsIF93eClcclxuXHJcbiAgICAgIH0sXHJcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICB9LFxyXG4gIC8v6I635Y+W57uP55CG57qn5Li7566hXHJcbiAgZ2V0TWFuYWdlMnJVc2VyKHVzZXJpZCwgX3d4KSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzXHJcblxyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCAgKyAnL0hhbmJlbGwtSlJTL2FwaS9lZmdwL2Z1bmN0aW9ucy9mdW5jdGlvbmxldmVsL21hbmFnZXIvJyArIHVzZXJpZCArICcv57uP55CG57qnPycgKyBhcHAuZ2xvYmFsRGF0YS5yZXN0QXV0aCxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGFwcGlkOiBhcHAuZ2xvYmFsRGF0YS5yZXN0SWQsXHJcbiAgICAgICAgdG9rZW46IGFwcC5nbG9iYWxEYXRhLnJlc3RUb2tlblxyXG4gICAgICB9LFxyXG4gICAgICBoZWFkZXI6IHtcclxuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YTtcclxuICAgICAgICBpZiAoZGF0YS5jb2RlID09ICcyMDAnKSB7XHJcbiAgICAgICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgZGVwdE1hbmFnZXIySWQ6IGRhdGEub2JqZWN0LmlkLFxyXG4gICAgICAgICAgICBkZXB0TWFuYWdlcjJOYW1lOiBkYXRhLm9iamVjdC51c2VyTmFtZSxcclxuICAgICAgICAgICAgYWpheFNob3c6IGZhbHNlXHJcblxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgYWpheFNob3c6IGZhbHNlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgICAgICBjb250ZW50OiBcIuiOt+WPlue7j+eQhue6p+S4u+euoeWksei0pVwiLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICB9LFxyXG4gIC8v5b2T5pyI5a6J5YWo6K++6ZW/XHJcbiAgYmluZE1vbnRoU2FmZXR5T2ZmaWNlU2VsZWN0KCkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJ3NhZmVtYW5hZ2Vyc2VsZWN0JyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuU2FmZU1hbmFnZXJTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIG1vbnRoU2FmZXR5T2ZmaWNlSWQ6IHJlcy5rLFxyXG4gICAgICAgICAgICAgIG1vbnRoU2FmZXR5T2ZmaWNlTmFtZTogcmVzLnZcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZERlc2NyaWJlaGFuZ2UoZSkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICBkZXNjcmliZTogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kQ2hhcmdlU2hvdygpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBpZiAoIV90aGlzLmRhdGEuaXNDaGFyZ2VTaG93KSB7XHJcbiAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgIGlzQ2hhcmdlU2hvdzogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmluZENoYXJnZXNDbG9zZSgpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgaXNDaGFyZ2VTaG93OiBmYWxzZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRDaGFyZ2VzU2VsZWN0KGUpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgY2hhcmdlSWQ6IGUuZGV0YWlsLnZhbHVlLmtleSxcclxuICAgICAgY2hhcmdlTmFtZTogZS5kZXRhaWwudmFsdWUubmFtZSxcclxuICAgICAgaXNDaGFyZ2VTaG93OiBmYWxzZVxyXG4gICAgfSlcclxuXHJcbiAgfSxcclxuICBiaW5kT3BlbkRhdGUoZSkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICBpc0RhdGVTaG93OiB0cnVlLFxyXG4gICAgICBkYXRlU2VsZWN0OiBlLnRhcmdldC5pZFxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRDbG9zZURhdGUoZSkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICBpc0RhdGVTaG93OiBmYWxzZSxcclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgYmluZERhdGVDb25maXJtKGUpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB2YXIgbGlzdCA9IF90aGlzLmRhdGEubW9udGhcclxuICAgIC8vIGxpc3QuZm9yRWFjaCgobywgaSkgPT4ge1xyXG4gICAgLy8gICBpZiAoby5pZCA9PSB0aGlzLmRhdGEuZGF0ZVNlbGVjdCkge1xyXG4gICAgLy8gICAgIG8uZW5kRGF0ZSA9IHRoaXMuZGF0ZUZvcm1hdEZvcllZTU1ERChlLmRldGFpbClcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfSlcclxuXHJcbiAgICBfdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIG1vbnRoOiBsaXN0LFxyXG4gICAgICBpc0RhdGVTaG93OiBmYWxzZSxcclxuICAgICAgZW5kRGF0ZTogdGhpcy5kYXRlRm9ybWF0Rm9yWVlNTUREKGUuZGV0YWlsKVxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICBiaW5kQWRkcmVzc0NoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICBhZGRyZXNzOiBlLmRldGFpbFxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRDb25zdHJ1Y3Rpb25TaWRlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIGNvbnN0cnVjdGlvblNpZGU6IGUuZGV0YWlsXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZENvbnN0cnVjdGlvblByb2plY3RDaGFuZ2UoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgY29uc3RydWN0aW9uUHJvamVjdDogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRGVkdWN0aW9uQ2hhbmdlKGUpIHtcclxuICAgIC8vIF4gKFswIC0gOV0gKnwgZCAqLmR7IDEgfT9kICopJFxyXG4gICAgdmFyIHJlZyA9IC9eW1xcK1xcLV0/KFxcZCpcXC5cXGQ/fFxcZCsoXFwuXFxkezAsMn0pPykkLztcclxuICAgIHZhciBfdGhpcyA9IHRoaXNcclxuICAgIHZhciBkYXRhID0gZS5kZXRhaWw7XHJcblxyXG4gICAgaWYgKHJlZy50ZXN0KGUuZGV0YWlsKSkge1xyXG4gICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICBkZWR1Y3Rpb246IGUuZGV0YWlsXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICBkZWR1Y3Rpb246ICcnXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy8g5Yig6Zmk5Zu+54mHXHJcbiAgY2xlYXJJbWcoZSkge1xyXG4gICAgdmFyIG5vd0xpc3QgPSBbXTsvL+aWsOaVsOaNrlxyXG4gICAgdmFyIHVwbG9hZGVyTGlzdCA9IHRoaXMuZGF0YS51cGxvYWRlckxpc3Q7Ly/ljp/mlbDmja5cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVwbG9hZGVyTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoaSA9PSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleCkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5vd0xpc3QucHVzaCh1cGxvYWRlckxpc3RbaV0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIHVwbG9hZGVyTnVtOiB0aGlzLmRhdGEudXBsb2FkZXJOdW0gLSAxLFxyXG4gICAgICB1cGxvYWRlckxpc3Q6IG5vd0xpc3QsXHJcbiAgICAgIHNob3dVcGxvYWQ6IHRydWVcclxuICAgIH0pXHJcbiAgfSxcclxuICAvL+WxleekuuWbvueJh1xyXG4gIHNob3dJbWcoZSkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgd3gucHJldmlld0ltYWdlKHtcclxuICAgICAgdXJsczogdGhhdC5kYXRhLnVwbG9hZGVyTGlzdCxcclxuICAgICAgY3VycmVudDogdGhhdC5kYXRhLnVwbG9hZGVyTGlzdFtlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pbmRleF1cclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgZGF0ZUZvcm1hdEZvcllZTU1ERChkYXRlKSB7XHJcbiAgICBsZXQgZGF0ZVRlbXAgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgIGxldCB5ZWFyID0gZGF0ZVRlbXAuZ2V0RnVsbFllYXIoKTtcclxuICAgIGxldCBtb250aCA9IGRhdGVUZW1wLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgbGV0IGRheSA9IGRhdGVUZW1wLmdldERhdGUoKTtcclxuICAgIGxldCBkYXlUZW1wID0geWVhciArIFwiL1wiICsgbW9udGggKyBcIi9cIiArIGRheTtcclxuICAgIHJldHVybiBkYXlUZW1wXHJcbiAgfSxcclxuXHJcbiAgLy/kuIrkvKDlm77niYdcclxuICB1cGxvYWQoZSkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgLy9jb25zb2xlLmxvZyhcInVwbG9hZCBUZXN0XCIpO1xyXG4gICAgd3guY2hvb3NlSW1hZ2Uoe1xyXG4gICAgICBjb3VudDogMyAtIHRoYXQuZGF0YS51cGxvYWRlck51bSwgLy8g6buY6K6kOVxyXG4gICAgICBzaXplVHlwZTogWydvcmlnaW5hbCcsICdjb21wcmVzc2VkJ10sIC8vIOWPr+S7peaMh+WumuaYr+WOn+Wbvui/mOaYr+WOi+e8qeWbvu+8jOm7mOiupOS6jOiAhemDveaciVxyXG4gICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLCAvLyDlj6/ku6XmjIflrprmnaXmupDmmK/nm7jlhozov5jmmK/nm7jmnLrvvIzpu5jorqTkuozogIXpg73mnIlcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhhdC5kYXRhLnVwbG9hZGVyTnVtKTtcclxuICAgICAgICAvLyDov5Tlm57pgInlrprnhafniYfnmoTmnKzlnLDmlofku7bot6/lvoTliJfooajvvIx0ZW1wRmlsZVBhdGjlj6/ku6XkvZzkuLppbWfmoIfnrb7nmoRzcmPlsZ7mgKfmmL7npLrlm77niYdcclxuICAgICAgICBsZXQgdGVtcEZpbGVQYXRocyA9IHJlcy50ZW1wRmlsZVBhdGhzO1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbygndGVtcEZpbGVQYXRocz09JyArIEpTT04uc3RyaW5naWZ5KHRlbXBGaWxlUGF0aHMpKVxyXG4gICAgICAgIGxldCB1cGxvYWRlckxpc3QgPSB0aGF0LmRhdGEudXBsb2FkZXJMaXN0LmNvbmNhdCh0ZW1wRmlsZVBhdGhzKTtcclxuICAgICAgICBpZiAodXBsb2FkZXJMaXN0Lmxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgICB0aGF0LnNldERhdGEoe1xyXG4gICAgICAgICAgICBzaG93VXBsb2FkOiBmYWxzZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgIHVwbG9hZGVyTGlzdDogdXBsb2FkZXJMaXN0LFxyXG4gICAgICAgICAgdXBsb2FkZXJOdW06IHVwbG9hZGVyTGlzdC5sZW5ndGgsXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGluaXRGaWxlKCkge1xyXG4gICAgY29uc29sZS5pbmZvKFwiMTExMVwiKTtcclxuICAgIHZhciBub3dMaXN0ID0gW107XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgdmFyIEZpbGVTeXN0ZW1NYW5hZ2VyID0gd3guZ2V0RmlsZVN5c3RlbU1hbmFnZXIoKTtcclxuICAgIF90aGlzLmRhdGEudXBsb2FkZXJMaXN0LmZvckVhY2goZnVuY3Rpb24gKG8sIGkpIHtcclxuICAgICAgY29uc29sZS5pbmZvKFwiMjIyXCIpO1xyXG4gICAgICB2YXIgYmFzZWxpYiA9IEZpbGVTeXN0ZW1NYW5hZ2VyLnJlYWRGaWxlU3luYyhfdGhpcy5kYXRhLnVwbG9hZGVyTGlzdFtpXSwgJ2Jhc2U2NCcpO1xyXG4gICAgICB2YXIgaW1hZ2VQYXRoVGVtcCA9IF90aGlzLmRhdGEudXBsb2FkZXJMaXN0W2ldLnNwbGl0KCcuJyk7XHJcbiAgICAgIHZhciBpbWFnZVR5cGUgPSBpbWFnZVBhdGhUZW1wW2ltYWdlUGF0aFRlbXAubGVuZ3RoIC0gMV07XHJcbiAgICAgIHZhciBvYmogPSB7IGRhdGE6IGJhc2VsaWIsIGltYWdlVHlwZTogaW1hZ2VUeXBlIH07XHJcbiAgICAgIG5vd0xpc3QucHVzaChvYmopO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX3RoaXMuc2V0RGF0YSh7XHJcbiAgICAgIGhrcGIwMzNGaWxlczogbm93TGlzdFxyXG4gICAgfSlcclxuICB9LFxyXG5cclxuICBmb3JtU3VibWl0KGUpIHtcclxuICAgIHZhciBpc1N1Ym1pdCA9IHRydWU7XHJcbiAgICBsZXQgZXJybXNnID0gJydcclxuICAgIHZhciBfdGhpcyA9IHRoaXNcclxuICAgIF90aGlzLmluaXRGaWxlKClcclxuICAgIGlmICghYXBwLmdsb2JhbERhdGEuYXV0aG9yaXplZCkge1xyXG4gICAgICBpc1N1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6LSm5Y+35pyq5o6I5p2DXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKF90aGlzLmRhdGEuc2FmZXR5T2ZmaWNlTmFtZSA9PSAnJyB8fCBfdGhpcy5kYXRhLnNhZmV0eU9mZmljZU5hbWUgPT0gbnVsbCkge1xyXG4gICAgICBpc1N1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+36YCJ5oup5Y2V5L2N5a6J5YWo5ZGYXFxyXFxuJ1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChfdGhpcy5kYXRhLmRlcHRNYW5hZ2VyMU5hbWUgPT0gJycgfHwgX3RoaXMuZGF0YS5kZXB0TWFuYWdlcjFOYW1lID09IG51bGwpIHtcclxuICAgICAgaXNTdWJtaXQgPSBmYWxzZVxyXG4gICAgICBlcnJtc2cgKz0gJ+ivt+mAieaLqemDqOmXqOS4u+euoVxcclxcbidcclxuICAgIH1cclxuXHJcbiAgICBpZiAoX3RoaXMuZGF0YS5kZXB0TWFuYWdlcjJOYW1lID09ICcnIHx8IF90aGlzLmRhdGEuZGVwdE1hbmFnZXIyTmFtZSA9PSBudWxsKSB7XHJcbiAgICAgIGlzU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9ICfor7fpgInmi6nljZXkvY3kuLvnrqFcXHJcXG4nXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKF90aGlzLmRhdGEuYWRkcmVzcyA9PSAnJyB8fCBfdGhpcy5kYXRhLmFkZHJlc3MgPT0gbnVsbCkge1xyXG4gICAgICBpc1N1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+35aGr5YaZ5Zyw5Z2AXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKF90aGlzLmRhdGEubW9udGhTYWZldHlPZmZpY2VOYW1lID09ICcnIHx8IF90aGlzLmRhdGEubW9udGhTYWZldHlPZmZpY2VOYW1lID09IG51bGwpIHtcclxuICAgICAgaXNTdWJtaXQgPSBmYWxzZVxyXG4gICAgICBlcnJtc2cgKz0gJ+ivt+mAieaLqeW9k+aciOWuieWFqOivvumVv1xcclxcbidcclxuICAgIH1cclxuXHJcbiAgICBpZiAoX3RoaXMuZGF0YS5tb250aFNhZmV0eU9mZmljZU5hbWUgPT0gJycgfHwgX3RoaXMuZGF0YS5tb250aFNhZmV0eU9mZmljZU5hbWUgPT0gbnVsbCkge1xyXG4gICAgICBpc1N1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+36YCJ5oup5b2T5pyI5a6J5YWo6K++6ZW/XFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKF90aGlzLmRhdGEuaGtwYjAzM0ZpbGVzLmxlbmd0aCAgPT0gMCkge1xyXG4gICAgICBpc1N1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+35LiK5Lyg5Zu+54mHXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKF90aGlzLmRhdGEuY2hhcmdlSWQgPT0gNCAmJiB0aGlzLmRhdGEuZW5kRGF0ZSA9PSBcIlwiKSB7XHJcbiAgICAgIGlzU3VibWl0ID0gZmFsc2VcclxuICAgICAgZXJybXNnICs9ICflvZPotKPku6TmmK/kuYvlkI7mlbTmlLnml7bvvIzmlbTmlLnml7bpl7Tlv4XloatcXHJcXG4nXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmluZm8oXCJyZXM9XCIgKyBfdGhpcy5kYXRhLmhrcGIwMzNGaWxlcyk7XHJcblxyXG4gICAgaWYgKGlzU3VibWl0KSB7XHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgIGNvbnRlbnQ6ICfnoa7lrprmj5DkuqTlkJcnLFxyXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICAgICAgICAgIHRpdGxlOiAnU2VuZGluZydcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgdXJsOiBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICArICcvSGFuYmVsbC1KUlMvYXBpL2VmZ3AvaGtwYjAzMy93ZWNoYXQ/JyArIGFwcC5nbG9iYWxEYXRhLnJlc3RBdXRoLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIC4uLl90aGlzLmRhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzLmRhdGEubXNnLFxyXG4gICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9wYWdlcy9pbmRleC9pbmRleFwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogXCLor7fogZTns7vnrqHnkIblkZg6XCIgKyBmYWlsLFxyXG4gICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogZXJybXNnLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbn0pXHJcbiJdfQ==