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
            data: {
                openId: app.globalData.openId,
                nickName: app.globalData.userInfo.nickName
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                if (res.data.code == '202') {
                    app.globalData.authorized = true;
                    wx.switchTab({
                        url: '/pages/index/index?loadinghidden=true'
                    });
                }
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
            _a[employeeId] = e.detail,
            _a));
    },
    bindEmployeeNameChange: function (e) {
        var _a;
        var employeeName = 'wechatUser.employeeName';
        this.setData((_a = {},
            _a[employeeName] = e.detail,
            _a));
    },
    bindMobileChange: function (e) {
        var _a;
        var mobile = 'wechatUser.mobile';
        this.setData((_a = {},
            _a[mobile] = e.detail,
            _a));
    },
    bindCheckCodeChange: function (e) {
        this.setData({
            checkCode: e.detail
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
                            if (app.globalData.authorized) {
                              app.globalData.mainLoadingHidden=true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUU1QixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELFVBQVUsRUFBRTtZQUNWLFVBQVUsRUFBRSxFQUFFO1lBQ2QsWUFBWSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxFQUFFLEVBQUU7U0FDWDtRQUNELFNBQVMsRUFBRSxFQUFFO1FBQ2IsY0FBYyxFQUFFLE9BQU87UUFDdkIsV0FBVyxFQUFFLElBQUk7UUFDakIsU0FBUyxFQUFFLEtBQUs7S0FDakI7SUFDRCxNQUFNO1FBQU4saUJBZUM7UUFkQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUTtnQkFDakMsV0FBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLFlBQVk7WUFDakIsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSTtpQkFDckIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxXQUFXLFlBQUMsQ0FBQztRQUNYLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO1FBQzNDLElBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDO1FBQ2pDLElB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LFlBQUMsR0FBRzs0QkFDVCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO2dDQUM3QixFQUFFLENBQUMsU0FBUyxDQUFDO29DQUNYLEdBQUcsRUFBRSxvQkFBb0I7aUNBQzFCLENBQUMsQ0FBQTs2QkFDSDt3QkFDSCxDQUFDO3FCQUNGLENBQUMsQ0FBQTtnQkFDSixDQUFDO2dCQUNELElBQUksRUFBRSxVQUFBLElBQUk7b0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQzFCLENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDthQUFNO1lBQ0wsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxLQUFLLEVBQUUsTUFBTTtnQkFDYixPQUFPLEVBQUUsTUFBTTtnQkFDZixVQUFVLEVBQUUsS0FBSzthQUNsQixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7SUFDRCxTQUFTO1FBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL3Byb2ZpbGUudHNcclxuLy/ojrflj5blupTnlKjlrp7kvotcclxuaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xyXG5cclxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxyXG5cclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgdXNlckluZm86IHt9LFxyXG4gICAgaGFzVXNlckluZm86IGZhbHNlLFxyXG4gICAgY2FuSVVzZTogd3guY2FuSVVzZSgnYnV0dG9uLm9wZW4tdHlwZS5nZXRVc2VySW5mbycpLFxyXG4gICAgd2VjaGF0VXNlcjoge1xyXG4gICAgICBlbXBsb3llZUlkOiAnJyxcclxuICAgICAgZW1wbG95ZWVOYW1lOiAnJyxcclxuICAgICAgbW9iaWxlOiAnJ1xyXG4gICAgfSxcclxuICAgIGNoZWNrQ29kZTogJycsXHJcbiAgICBidG5TZW5kRGlzcGxheTogJ+iOt+WPlumqjOivgeeggScsXHJcbiAgICBjYW5TZW5kQ29kZTogdHJ1ZSxcclxuICAgIGNhblN1Ym1pdDogZmFsc2VcclxuICB9LFxyXG4gIG9uTG9hZCgpIHtcclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS51c2VySW5mbykge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICB1c2VySW5mbzogYXBwLmdsb2JhbERhdGEudXNlckluZm8sXHJcbiAgICAgICAgaGFzVXNlckluZm86IHRydWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIHd4LmdldFN0b3JhZ2Uoe1xyXG4gICAgICBrZXk6ICd3ZWNoYXRVc2VyJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIHdlY2hhdFVzZXI6IHJlcy5kYXRhXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGdldFVzZXJJbmZvKGUpIHtcclxuICAgIGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvID0gZS5kZXRhaWwudXNlckluZm9cclxuICAgIGxldCBtb2JpbGUgPSAnd2VjaGF0VXNlci5tb2JpbGUnO1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHVzZXJJbmZvOiBlLmRldGFpbC51c2VySW5mbyxcclxuICAgICAgaGFzVXNlckluZm86IHRydWUsXHJcbiAgICAgIC8vIFttb2JpbGVdOiBlLmRldGFpbC51c2VySW5mby5tb2JpbGVcclxuICAgIH0pXHJcbiAgICAvL+aOiOadg+WQjuWtmOWCqG9wZW5pZFxyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC93ZWNoYXR1c2VyJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIG9wZW5JZDogYXBwLmdsb2JhbERhdGEub3BlbklkLFxyXG4gICAgICAgIG5pY2tOYW1lOiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mby5uaWNrTmFtZVxyXG4gICAgICB9LFxyXG4gICAgICBoZWFkZXI6IHtcclxuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIGlmIChyZXMuZGF0YS5jb2RlID09ICcyMDInKSB7XHJcbiAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkID0gdHJ1ZVxyXG4gICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2luZGV4L2luZGV4J1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRW1wbG95ZWVJZENoYW5nZShlKSB7XHJcbiAgICBsZXQgZW1wbG95ZWVJZCA9ICd3ZWNoYXRVc2VyLmVtcGxveWVlSWQnO1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIFtlbXBsb3llZUlkXTogZS5kZXRhaWxcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kRW1wbG95ZWVOYW1lQ2hhbmdlKGUpIHtcclxuICAgIGxldCBlbXBsb3llZU5hbWUgPSAnd2VjaGF0VXNlci5lbXBsb3llZU5hbWUnO1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIFtlbXBsb3llZU5hbWVdOiBlLmRldGFpbFxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRNb2JpbGVDaGFuZ2UoZSkge1xyXG4gICAgbGV0IG1vYmlsZSA9ICd3ZWNoYXRVc2VyLm1vYmlsZSc7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgW21vYmlsZV06IGUuZGV0YWlsXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZENoZWNrQ29kZUNoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgY2hlY2tDb2RlOiBlLmRldGFpbFxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRTZW5kQ29kZVRhcChlKSB7XHJcbiAgICBsZXQgY2FuU2VuZCA9IHRydWVcclxuICAgIGxldCBlcnJtc2cgPSAnJ1xyXG4gICAgLy8gbGV0IHJlZyA9IC9eKCgoMTNbMC05XXsxfSl8KDE1WzAtOV17MX0pfCgxOFswLTldezF9KXwoMTdbMC05XXsxfSkpK1xcZHs4fSkkL1xyXG4gICAgaWYgKCF0aGlzLmRhdGEud2VjaGF0VXNlci5tb2JpbGUgfHwgdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlID09ICcnIHx8IHRoaXMuZGF0YS53ZWNoYXRVc2VyLm1vYmlsZS5sZW5ndGggIT0gMTEpIHtcclxuICAgICAgY2FuU2VuZCA9IGZhbHNlO1xyXG4gICAgICBlcnJtc2cgKz0gJ+aJi+acuuWPt+eggemVv+W6pumUmeivr1xcclxcbidcclxuICAgIH1cclxuICAgIC8vIGlmICghcmVnLnRlc3QodGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlKSkge1xyXG4gICAgLy8gICBjYW5TZW5kID0gZmFsc2VcclxuICAgIC8vICAgZXJybXNnICs9ICfmiYvmnLrlj7fnoIHmoLzlvI/plJnor69cXHJcXG4nXHJcbiAgICAvLyB9XHJcbiAgICBpZiAoY2FuU2VuZCkge1xyXG4gICAgICBsZXQgd2FpdHM6IG51bWJlciA9IDYwXHJcbiAgICAgIGxldCBmbiA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICB3YWl0cy0tXHJcbiAgICAgICAgbGV0IHYgPSAn562J5b6FKCcgKyB3YWl0cyArICcp56eSJ1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgYnRuU2VuZERpc3BsYXk6IHZcclxuICAgICAgICB9KVxyXG4gICAgICB9LCAxMDAwLCB3YWl0cylcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBidG5TZW5kRGlzcGxheTogJ+iOt+WPlumqjOivgeeggScsXHJcbiAgICAgICAgICBjYW5TZW5kQ29kZTogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChmbilcclxuICAgICAgfSwgNjAwMDApXHJcbiAgICAgIC8vIOiOt+WPluagoemqjOeggVxyXG4gICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtV0NPL2FwaS9wcmc5ZjI0N2FiNmQ1ZTQvY2hlY2tjb2RlJyxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBvcGVuaWQ6IGFwcC5nbG9iYWxEYXRhLm9wZW5JZCxcclxuICAgICAgICAgIHNlc3Npb25rZXk6IGFwcC5nbG9iYWxEYXRhLnNlc3Npb25LZXksXHJcbiAgICAgICAgICBtb2JpbGU6IHRoaXMuZGF0YS53ZWNoYXRVc2VyLm1vYmlsZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICBjYW5TdWJtaXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGNhblNlbmRDb2RlOiBmYWxzZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZmFpbC5lcnJNc2cpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogZXJybXNnLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBmb3JtU3VibWl0KGUpIHtcclxuICAgIGxldCBjYW5TZW5kID0gdHJ1ZVxyXG4gICAgbGV0IGVycm1zZyA9ICcnXHJcbiAgICAvL+abtOaWsOeUqOaIt+eKtuaAgVxyXG4gICAgaWYgKCFhcHAuZ2xvYmFsRGF0YS51c2VySW5mbykge1xyXG4gICAgICBjYW5TZW5kID0gZmFsc2U7XHJcbiAgICAgIGVycm1zZyArPSAnVXNlckluZm/plJnor69cXHJcXG4nXHJcbiAgICB9XHJcbiAgICBpZiAoIWFwcC5nbG9iYWxEYXRhLnNlc3Npb25LZXkgfHwgYXBwLmdsb2JhbERhdGEuc2Vzc2lvbktleSA9PSAnJykge1xyXG4gICAgICBjYW5TZW5kID0gZmFsc2U7XHJcbiAgICAgIGVycm1zZyArPSAnU2Vzc2lvbktleemUmeivr1xcclxcbidcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLmNoZWNrQ29kZSB8fCB0aGlzLmRhdGEuY2hlY2tDb2RlID09ICcnKSB7XHJcbiAgICAgIGNhblNlbmQgPSBmYWxzZTtcclxuICAgICAgZXJybXNnICs9ICfpqozor4HnoIHplJnor69cXHJcXG4nXHJcbiAgICB9XHJcbiAgICBpZiAoY2FuU2VuZCkge1xyXG4gICAgICBsZXQgdXJsU3RyID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC93ZWNoYXR1c2VyLycgKyBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQgKyAnP3Nlc3Npb25rZXk9JyArIGFwcC5nbG9iYWxEYXRhLnNlc3Npb25LZXkgKyAnJmNoZWNrY29kZT0nICsgdGhpcy5kYXRhLmNoZWNrQ29kZTtcclxuICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgdXJsOiB1cmxTdHIsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgb3BlbmlkOiBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQsXHJcbiAgICAgICAgICBuaWNrTmFtZTogYXBwLmdsb2JhbERhdGEudXNlckluZm8ubmlja05hbWUsXHJcbiAgICAgICAgICBlbXBsb3llZUlkOiB0aGlzLmRhdGEud2VjaGF0VXNlci5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgZW1wbG95ZWVOYW1lOiB0aGlzLmRhdGEud2VjaGF0VXNlci5lbXBsb3llZU5hbWUsXHJcbiAgICAgICAgICBtb2JpbGU6IHRoaXMuZGF0YS53ZWNoYXRVc2VyLm1vYmlsZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgICAgICBpZiAocmVzLmRhdGEuY29kZSA9PSAnMjAwJykge1xyXG4gICAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkID0gcmVzLmRhdGEuYXV0aG9yaXplZFxyXG4gICAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZUlkID0gcmVzLmRhdGEuZW1wbG95ZWVJZFxyXG4gICAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZU5hbWUgPSByZXMuZGF0YS5lbXBsb3llZU5hbWVcclxuICAgICAgICAgICAgYXBwLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCA9IHJlcy5kYXRhLmRlcHRub1xyXG4gICAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdE5hbWUgPSByZXMuZGF0YS5kZXB0TmFtZVxyXG4gICAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5kZWZhdWx0Q29tcGFueSA9IHJlcy5kYXRhLmNvbXBhbnlcclxuICAgICAgICAgICAgYXBwLmdsb2JhbERhdGEuZGVmYXVsdENvbXBhbnlOYW1lID0gcmVzLmRhdGEuY29tcGFueU5hbWVcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQgPSBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICAgIGNhblN1Ym1pdDogZmFsc2VcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygnd2VjaGF0VXNlcicsIHRoaXMuZGF0YS53ZWNoYXRVc2VyKVxyXG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxyXG4gICAgICAgICAgICBjb250ZW50OiByZXMuZGF0YS5tc2csXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgICAgICAgICAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvaW5kZXgvaW5kZXgnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZmFpbC5lcnJNc2cpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgY29udGVudDogZXJybXNnLFxyXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBmb3JtUmVzZXQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnZm9ybeWPkeeUn+S6hnJlc2V05LqL5Lu2Jyk7XHJcbiAgfVxyXG59KVxyXG4iXX0=