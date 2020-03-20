"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        wechatUser: {
            employeeId: '',
            employeeName: '',
            mobile: ''
        },
        checkCode: '',
        btnSendDisplay: '获取验证码',
        canSendCode: true,
        canSubmit: false
    },
    onLoad: function () {
        var _this = this;
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        }
        wx.getStorage({
            key: 'wechatUser',
            success: function (res) {
                _this.setData({
                    wechatUser: res.data
                });
            }
        });
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo;
        var mobile = 'wechatUser.mobile';
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
        });
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser',
            // url: 'http://localhost:8480/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser',
            data: {
                openid: app.globalData.openId,
                nickName: app.globalData.userInfo.nickName
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    },
    bindEmployeeIdChange: function (e) {
        var _a;
        var employeeId = 'wechatUser.employeeId';
        this.setData((_a = {},
            _a[employeeId] = e.detail.value,
            _a));
    },
    bindEmployeeNameChange: function (e) {
        var _a;
        var employeeName = 'wechatUser.employeeName';
        this.setData((_a = {},
            _a[employeeName] = e.detail.value,
            _a));
    },
    bindMobileChange: function (e) {
        var _a;
        var mobile = 'wechatUser.mobile';
        this.setData((_a = {},
            _a[mobile] = e.detail.value,
            _a));
    },
    bindCheckCodeChange: function (e) {
        this.setData({
            checkCode: e.detail.value
        });
    },
    bindSendCodeTap: function (e) {
        var _this = this;
        var canSend = true;
        var errmsg = '';
        if (!this.data.wechatUser.mobile || this.data.wechatUser.mobile == '' || this.data.wechatUser.mobile.length != 11) {
            canSend = false;
            errmsg += '手机号码长度错误\r\n';
        }
        if (canSend) {
            var waits_1 = 60;
            var fn_1 = setInterval(function () {
                waits_1--;
                var v = '等待(' + waits_1 + ')秒';
                _this.setData({
                    btnSendDisplay: v
                });
            }, 1000, waits_1);
            setTimeout(function () {
                _this.setData({
                    btnSendDisplay: '获取验证码',
                    canSendCode: true
                });
                clearInterval(fn_1);
            }, 60000);
            wx.request({
                url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/checkcode',
                data: {
                    openid: app.globalData.openId,
                    sessionkey: app.globalData.sessionKey,
                    mobile: this.data.wechatUser.mobile
                },
                header: {
                    'content-type': 'application/json'
                },
                method: 'GET',
                success: function (res) {
                    _this.setData({
                        canSubmit: true,
                        canSendCode: false
                    });
                },
                fail: function (fail) {
                    console.log(fail.errMsg);
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
    formSubmit: function (e) {
        var _this = this;
        var canSend = true;
        var errmsg = '';
        if (!app.globalData.userInfo) {
            canSend = false;
            errmsg += 'UserInfo错误\r\n';
        }
        if (!app.globalData.sessionKey || app.globalData.sessionKey == '') {
            canSend = false;
            errmsg += 'SessionKey错误\r\n';
        }
        if (!this.data.checkCode || this.data.checkCode == '') {
            canSend = false;
            errmsg += '验证码错误\r\n';
        }
        if (canSend) {
            var urlStr = app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser/' + app.globalData.openId + '?sessionkey=' + app.globalData.sessionKey + '&checkcode=' + this.data.checkCode;
            wx.request({
                url: urlStr,
                data: {
                    openid: app.globalData.openId,
                    nickName: app.globalData.userInfo.nickName,
                    employeeId: this.data.wechatUser.employeeId,
                    employeeName: this.data.wechatUser.employeeName,
                    mobile: this.data.wechatUser.mobile
                },
                header: {
                    'content-type': 'application/json'
                },
                method: 'PUT',
                success: function (res) {
                    if (res.data.code == '200') {
                        app.globalData.authorized = res.data.authorized;
                        app.globalData.employeeId = res.data.employeeId;
                        app.globalData.employeeName = res.data.employeeName;
                        app.globalData.defaultDeptId = res.data.deptno;
                        app.globalData.defaultDeptName = res.data.deptName;
                        app.globalData.defaultCompany = res.data.company;
                        app.globalData.defaultCompanyName = res.data.companyName;
                    }
                    else {
                        app.globalData.authorized = false;
                    }
                    _this.setData({
                        canSubmit: false
                    });
                    wx.setStorageSync('wechatUser', _this.data.wechatUser);
                    wx.showModal({
                        title: '系统消息',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {
                            if (app.globalData.authorized = true) {
                                wx.switchTab({
                                    url: '/pages/index/index'
                                });
                            }
                        }
                    });
                },
                fail: function (fail) {
                    console.log(fail.errMsg);
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
        console.log('form发生了reset事件');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUU1QixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELFVBQVUsRUFBRTtZQUNWLFVBQVUsRUFBRSxFQUFFO1lBQ2QsWUFBWSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxFQUFFLEVBQUU7U0FDWDtRQUNELFNBQVMsRUFBRSxFQUFFO1FBQ2IsY0FBYyxFQUFFLE9BQU87UUFDdkIsV0FBVyxFQUFFLElBQUk7UUFDakIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxNQUFNO1FBQU4saUJBZUM7UUFkQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUTtnQkFDakMsV0FBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLFlBQVk7WUFDakIsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSTtpQkFDckIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxXQUFXLFlBQUMsQ0FBQztRQUNYLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO1FBQzNDLElBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDO1FBQ2pDLElB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QUNIO3dCQUNILENBQUM7cUJBQ0YsQ0FBQyxDQUFBO2dCQUNKLENBQUM7Z0JBQ0QsSUFBSSxFQUFFLFVBQUEsSUFBSTtvQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDMUIsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztJQUNELFNBQVM7UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vcHJvZmlsZS50c1xyXG4vL+iOt+WPluW6lOeUqOWunuS+i1xyXG5pbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXHJcblxyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcblxyXG5QYWdlKHtcclxuICBkYXRhOiB7XHJcbiAgICB1c2VySW5mbzoge30sXHJcbiAgICBoYXNVc2VySW5mbzogZmFsc2UsXHJcbiAgICBjYW5JVXNlOiB3eC5jYW5JVXNlKCdidXR0b24ub3Blbi10eXBlLmdldFVzZXJJbmZvJyksXHJcbiAgICB3ZWNoYXRVc2VyOiB7XHJcbiAgICAgIGVtcGxveWVlSWQ6ICcnLFxyXG4gICAgICBlbXBsb3llZU5hbWU6ICcnLFxyXG4gICAgICBtb2JpbGU6ICcnXHJcbiAgICB9LFxyXG4gICAgY2hlY2tDb2RlOiAnJyxcclxuICAgIGJ0blNlbmREaXNwbGF5OiAn6I635Y+W6aqM6K+B56CBJyxcclxuICAgIGNhblNlbmRDb2RlOiB0cnVlLFxyXG4gICAgY2FuU3VibWl0OiBmYWxzZVxyXG4gIH0sXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIHVzZXJJbmZvOiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbyxcclxuICAgICAgICBoYXNVc2VySW5mbzogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgd3guZ2V0U3RvcmFnZSh7XHJcbiAgICAgIGtleTogJ3dlY2hhdFVzZXInLFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgd2VjaGF0VXNlcjogcmVzLmRhdGFcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgZ2V0VXNlckluZm8oZSkge1xyXG4gICAgYXBwLmdsb2JhbERhdGEudXNlckluZm8gPSBlLmRldGFpbC51c2VySW5mb1xyXG4gICAgbGV0IG1vYmlsZSA9ICd3ZWNoYXRVc2VyLm1vYmlsZSc7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgdXNlckluZm86IGUuZGV0YWlsLnVzZXJJbmZvLFxyXG4gICAgICBoYXNVc2VySW5mbzogdHJ1ZSxcclxuICAgICAgLy8gW21vYmlsZV06IGUuZGV0YWlsLnVzZXJJbmZvLm1vYmlsZVxyXG4gICAgfSlcclxuICAgIC8v5o6I5p2D5ZCO5a2Y5YKob3BlbmlkXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsnL0hhbmJlbGwtV0NPL2FwaS9wcmc5ZjI0N2FiNmQ1ZTQvd2VjaGF0dXNlcicsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBvcGVuSWQ6IGFwcC5nbG9iYWxEYXRhLm9wZW5JZCxcclxuICAgICAgICBuaWNrTmFtZTogYXBwLmdsb2JhbERhdGEudXNlckluZm8ubmlja05hbWVcclxuICAgICAgfSxcclxuICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHJlcylcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRFbXBsb3llZUlkQ2hhbmdlKGUpIHtcclxuICAgIGxldCBlbXBsb3llZUlkID0gJ3dlY2hhdFVzZXIuZW1wbG95ZWVJZCc7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgW2VtcGxveWVlSWRdOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRFbXBsb3llZU5hbWVDaGFuZ2UoZSkge1xyXG4gICAgbGV0IGVtcGxveWVlTmFtZSA9ICd3ZWNoYXRVc2VyLmVtcGxveWVlTmFtZSc7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgW2VtcGxveWVlTmFtZV06IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZE1vYmlsZUNoYW5nZShlKSB7XHJcbiAgICBsZXQgbW9iaWxlID0gJ3dlY2hhdFVzZXIubW9iaWxlJztcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBbbW9iaWxlXTogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kQ2hlY2tDb2RlQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBjaGVja0NvZGU6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFNlbmRDb2RlVGFwKGUpIHtcclxuICAgIGxldCBjYW5TZW5kID0gdHJ1ZVxyXG4gICAgbGV0IGVycm1zZyA9ICcnXHJcbiAgICAvLyBsZXQgcmVnID0gL14oKCgxM1swLTldezF9KXwoMTVbMC05XXsxfSl8KDE4WzAtOV17MX0pfCgxN1swLTldezF9KSkrXFxkezh9KSQvXHJcbiAgICBpZiAoIXRoaXMuZGF0YS53ZWNoYXRVc2VyLm1vYmlsZSB8fCB0aGlzLmRhdGEud2VjaGF0VXNlci5tb2JpbGUgPT0gJycgfHwgdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlLmxlbmd0aCAhPSAxMSkge1xyXG4gICAgICBjYW5TZW5kID0gZmFsc2U7XHJcbiAgICAgIGVycm1zZyArPSAn5omL5py65Y+356CB6ZW/5bqm6ZSZ6K+vXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgLy8gaWYgKCFyZWcudGVzdCh0aGlzLmRhdGEud2VjaGF0VXNlci5tb2JpbGUpKSB7XHJcbiAgICAvLyAgIGNhblNlbmQgPSBmYWxzZVxyXG4gICAgLy8gICBlcnJtc2cgKz0gJ+aJi+acuuWPt+eggeagvOW8j+mUmeivr1xcclxcbidcclxuICAgIC8vIH1cclxuICAgIGlmIChjYW5TZW5kKSB7XHJcbiAgICAgIGxldCB3YWl0czogbnVtYmVyID0gNjBcclxuICAgICAgbGV0IGZuID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIHdhaXRzLS1cclxuICAgICAgICBsZXQgdiA9ICfnrYnlvoUoJyArIHdhaXRzICsgJynnp5InXHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBidG5TZW5kRGlzcGxheTogdlxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sIDEwMDAsIHdhaXRzKVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGJ0blNlbmREaXNwbGF5OiAn6I635Y+W6aqM6K+B56CBJyxcclxuICAgICAgICAgIGNhblNlbmRDb2RlOiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgICAgICBjbGVhckludGVydmFsKGZuKVxyXG4gICAgICB9LCA2MDAwMClcclxuICAgICAgLy8g6I635Y+W5qCh6aqM56CBXHJcbiAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9jaGVja2NvZGUnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIG9wZW5pZDogYXBwLmdsb2JhbERhdGEub3BlbklkLFxyXG4gICAgICAgICAgc2Vzc2lvbmtleTogYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleSxcclxuICAgICAgICAgIG1vYmlsZTogdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy5kYXRhKVxyXG4gICAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICAgIGNhblN1Ym1pdDogdHJ1ZSxcclxuICAgICAgICAgICAgY2FuU2VuZENvZGU6IGZhbHNlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsLmVyck1zZylcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBlcnJtc2csXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGZvcm1TdWJtaXQoZSkge1xyXG4gICAgbGV0IGNhblNlbmQgPSB0cnVlXHJcbiAgICBsZXQgZXJybXNnID0gJydcclxuICAgIC8v5pu05paw55So5oi354q25oCBXHJcbiAgICBpZiAoIWFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XHJcbiAgICAgIGNhblNlbmQgPSBmYWxzZTtcclxuICAgICAgZXJybXNnICs9ICdVc2VySW5mb+mUmeivr1xcclxcbidcclxuICAgIH1cclxuICAgIGlmICghYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleSB8fCBhcHAuZ2xvYmFsRGF0YS5zZXNzaW9uS2V5ID09ICcnKSB7XHJcbiAgICAgIGNhblNlbmQgPSBmYWxzZTtcclxuICAgICAgZXJybXNnICs9ICdTZXNzaW9uS2V56ZSZ6K+vXFxyXFxuJ1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmRhdGEuY2hlY2tDb2RlIHx8IHRoaXMuZGF0YS5jaGVja0NvZGUgPT0gJycpIHtcclxuICAgICAgY2FuU2VuZCA9IGZhbHNlO1xyXG4gICAgICBlcnJtc2cgKz0gJ+mqjOivgeeggemUmeivr1xcclxcbidcclxuICAgIH1cclxuICAgIGlmIChjYW5TZW5kKSB7XHJcbiAgICAgIGxldCB1cmxTdHIgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLVdDTy9hcGkvcHJnOWYyNDdhYjZkNWU0L3dlY2hhdHVzZXIvJyArIGFwcC5nbG9iYWxEYXRhLm9wZW5JZCArICc/c2Vzc2lvbmtleT0nICsgYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleSArICcmY2hlY2tjb2RlPScgKyB0aGlzLmRhdGEuY2hlY2tDb2RlO1xyXG4gICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IHVybFN0cixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBvcGVuaWQ6IGFwcC5nbG9iYWxEYXRhLm9wZW5JZCxcclxuICAgICAgICAgIG5pY2tOYW1lOiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mby5uaWNrTmFtZSxcclxuICAgICAgICAgIGVtcGxveWVlSWQ6IHRoaXMuZGF0YS53ZWNoYXRVc2VyLmVtcGxveWVlSWQsXHJcbiAgICAgICAgICBlbXBsb3llZU5hbWU6IHRoaXMuZGF0YS53ZWNoYXRVc2VyLmVtcGxveWVlTmFtZSxcclxuICAgICAgICAgIG1vYmlsZTogdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcylcclxuICAgICAgICAgIGlmIChyZXMuZGF0YS5jb2RlID09ICcyMDAnKSB7XHJcbiAgICAgICAgICAgIGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQgPSByZXMuZGF0YS5hdXRob3JpemVkXHJcbiAgICAgICAgICAgIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQgPSByZXMuZGF0YS5lbXBsb3llZUlkXHJcbiAgICAgICAgICAgIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZSA9IHJlcy5kYXRhLmVtcGxveWVlTmFtZVxyXG4gICAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkID0gcmVzLmRhdGEuZGVwdG5vXHJcbiAgICAgICAgICAgIGFwcC5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZSA9IHJlcy5kYXRhLmRlcHROYW1lXHJcbiAgICAgICAgICAgIGFwcC5nbG9iYWxEYXRhLmRlZmF1bHRDb21wYW55ID0gcmVzLmRhdGEuY29tcGFueVxyXG4gICAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0Q29tcGFueU5hbWUgPSByZXMuZGF0YS5jb21wYW55TmFtZVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXBwLmdsb2JhbERhdGEuYXV0aG9yaXplZCA9IGZhbHNlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgICAgY2FuU3VibWl0OiBmYWxzZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCd3ZWNoYXRVc2VyJywgdGhpcy5kYXRhLndlY2hhdFVzZXIpXHJcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+a2iOaBrycsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLm1zZyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQgPSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvaW5kZXgvaW5kZXgnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZmFpbC5lcnJNc2cpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogZXJybXNnLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBmb3JtUmVzZXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZm9ybeWPkeeUn+S6hnJlc2V05LqL5Lu2Jyk7XHJcbiAgfVxyXG59KVxyXG4iXX0=