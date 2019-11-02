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
        canSubmit: true
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
        var _a;
        app.globalData.userInfo = e.detail.userInfo;
        var mobile = 'wechatUser.mobile';
        this.setData((_a = {
                userInfo: e.detail.userInfo,
                hasUserInfo: true
            },
            _a[mobile] = e.detail.userInfo.mobile,
            _a));
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser',
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
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!this.data.wechatUser.mobile || this.data.wechatUser.mobile == '' || this.data.wechatUser.mobile.length != 11) {
            canSend = false;
            errmsg += '手机号码长度错误\r\n';
        }
        if (!reg.test(this.data.wechatUser.mobile)) {
            canSend = false;
            errmsg += '手机号码格式错误\r\n';
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
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/wechatuser/' + app.globalData.openId + '?sessionkey=' + app.globalData.sessionKey + '&checkcode=' + this.data.checkCode,
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
                        wx.switchTab({
                            url: '/pages/index/index'
                        });
                    }
                });
            },
            fail: function (fail) {
                console.log(fail.errMsg);
            }
        });
    },
    formReset: function () {
        console.log('form发生了reset事件');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUU1QixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELFVBQVUsRUFBRTtZQUNWLFVBQVUsRUFBRSxFQUFFO1lBQ2QsWUFBWSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxFQUFFLEVBQUU7U0FDWDtRQUNELFNBQVMsRUFBRSxFQUFFO1FBQ2IsY0FBYyxFQUFFLE9BQU87UUFDdkIsV0FBVyxFQUFFLElBQUk7UUFDakIsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxNQUFNO1FBQU4saUJBZUM7UUFkQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUTtnQkFDakMsV0FBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLFlBQVk7WUFDakIsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSTtpQkFDckIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxXQUFXLFlBQUMsQ0FBQzs7UUFDWCxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQTtRQUMzQyxJQUFJLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztRQUNqQyxJ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QUNqQixDQUFDLENBQUE7Z0JBQ0YsRUFBRSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtnQkFDckQsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDWCxLQUFLLEVBQUUsTUFBTTtvQkFDYixPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHO29CQUNyQixVQUFVLEVBQUUsS0FBSztvQkFDakIsT0FBTyxZQUFDLEdBQUc7d0JBQ1QsRUFBRSxDQUFDLFNBQVMsQ0FBQzs0QkFDWCxHQUFHLEVBQUUsb0JBQW9CO3lCQUMxQixDQUFDLENBQUE7b0JBQ0osQ0FBQztpQkFDRixDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsSUFBSSxFQUFFLFVBQUEsSUFBSTtnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUMxQixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFNBQVM7UUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vcHJvZmlsZS50c1xuLy/ojrflj5blupTnlKjlrp7kvotcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcblxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxuXG5QYWdlKHtcbiAgZGF0YToge1xuICAgIHVzZXJJbmZvOiB7fSxcbiAgICBoYXNVc2VySW5mbzogZmFsc2UsXG4gICAgY2FuSVVzZTogd3guY2FuSVVzZSgnYnV0dG9uLm9wZW4tdHlwZS5nZXRVc2VySW5mbycpLFxuICAgIHdlY2hhdFVzZXI6IHtcbiAgICAgIGVtcGxveWVlSWQ6ICcnLFxuICAgICAgZW1wbG95ZWVOYW1lOiAnJyxcbiAgICAgIG1vYmlsZTogJydcbiAgICB9LFxuICAgIGNoZWNrQ29kZTogJycsXG4gICAgYnRuU2VuZERpc3BsYXk6ICfojrflj5bpqozor4HnoIEnLFxuICAgIGNhblNlbmRDb2RlOiB0cnVlLFxuICAgIGNhblN1Ym1pdDogdHJ1ZVxuICB9LFxuICBvbkxvYWQoKSB7XG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XG4gICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgdXNlckluZm86IGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvLFxuICAgICAgICBoYXNVc2VySW5mbzogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gICAgd3guZ2V0U3RvcmFnZSh7XG4gICAgICBrZXk6ICd3ZWNoYXRVc2VyJyxcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgIHdlY2hhdFVzZXI6IHJlcy5kYXRhXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgZ2V0VXNlckluZm8oZSkge1xuICAgIGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvID0gZS5kZXRhaWwudXNlckluZm9cbiAgICBsZXQgbW9iaWxlID0gJ3dlY2hhdFVzZXIubW9iaWxlJztcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIHVzZXJJbmZvOiBlLmRldGFpbC51c2VySW5mbyxcbiAgICAgIGhhc1VzZXJJbmZvOiB0cnVlLFxuICAgICAgW21vYmlsZV06IGUuZGV0YWlsLnVzZXJJbmZvLm1vYmlsZVxuICAgIH0pXG4gICAgLy/mjojmnYPlkI7lrZjlgqhvcGVuaWRcbiAgICB3eC5yZXF1ZXN0KHtcbiAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC93ZWNoYXR1c2VyJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3BlbmlkOiBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQsXG4gICAgICAgIG5pY2tOYW1lOiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mby5uaWNrTmFtZVxuICAgICAgfSxcbiAgICAgIGhlYWRlcjoge1xuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlcylcbiAgICAgIH0sXG4gICAgICBmYWlsOiBmYWlsID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kRW1wbG95ZWVJZENoYW5nZShlKSB7XG4gICAgbGV0IGVtcGxveWVlSWQgPSAnd2VjaGF0VXNlci5lbXBsb3llZUlkJztcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIFtlbXBsb3llZUlkXTogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kRW1wbG95ZWVOYW1lQ2hhbmdlKGUpIHtcbiAgICBsZXQgZW1wbG95ZWVOYW1lID0gJ3dlY2hhdFVzZXIuZW1wbG95ZWVOYW1lJztcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIFtlbXBsb3llZU5hbWVdOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmRNb2JpbGVDaGFuZ2UoZSkge1xuICAgIGxldCBtb2JpbGUgPSAnd2VjaGF0VXNlci5tb2JpbGUnO1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgW21vYmlsZV06IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZENoZWNrQ29kZUNoYW5nZShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBjaGVja0NvZGU6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZFNlbmRDb2RlVGFwKGUpIHtcbiAgICBsZXQgY2FuU2VuZCA9IHRydWVcbiAgICBsZXQgZXJybXNnID0gJydcbiAgICBsZXQgcmVnID0gL14oKCgxM1swLTldezF9KXwoMTVbMC05XXsxfSl8KDE4WzAtOV17MX0pfCgxN1swLTldezF9KSkrXFxkezh9KSQvXG4gICAgaWYgKCF0aGlzLmRhdGEud2VjaGF0VXNlci5tb2JpbGUgfHwgdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlID09ICcnIHx8IHRoaXMuZGF0YS53ZWNoYXRVc2VyLm1vYmlsZS5sZW5ndGggIT0gMTEpIHtcbiAgICAgIGNhblNlbmQgPSBmYWxzZVxuICAgICAgZXJybXNnICs9ICfmiYvmnLrlj7fnoIHplb/luqbplJnor69cXHJcXG4nXG4gICAgfVxuICAgIGlmICghcmVnLnRlc3QodGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlKSkge1xuICAgICAgY2FuU2VuZCA9IGZhbHNlXG4gICAgICBlcnJtc2cgKz0gJ+aJi+acuuWPt+eggeagvOW8j+mUmeivr1xcclxcbidcbiAgICB9XG4gICAgaWYgKGNhblNlbmQpIHtcbiAgICAgIGxldCB3YWl0czogbnVtYmVyID0gNjBcbiAgICAgIGxldCBmbiA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgd2FpdHMtLVxuICAgICAgICBsZXQgdiA9ICfnrYnlvoUoJyArIHdhaXRzICsgJynnp5InXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgIGJ0blNlbmREaXNwbGF5OiB2XG4gICAgICAgIH0pXG4gICAgICB9LCAxMDAwLCB3YWl0cylcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBidG5TZW5kRGlzcGxheTogJ+iOt+WPlumqjOivgeeggScsXG4gICAgICAgICAgY2FuU2VuZENvZGU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgY2xlYXJJbnRlcnZhbChmbilcbiAgICAgIH0sIDYwMDAwKVxuICAgICAgLy8g6I635Y+W5qCh6aqM56CBXG4gICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgdXJsOiBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLVdDTy9hcGkvcHJnOWYyNDdhYjZkNWU0L2NoZWNrY29kZScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBvcGVuaWQ6IGFwcC5nbG9iYWxEYXRhLm9wZW5JZCxcbiAgICAgICAgICBzZXNzaW9ua2V5OiBhcHAuZ2xvYmFsRGF0YS5zZXNzaW9uS2V5LFxuICAgICAgICAgIG1vYmlsZTogdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlXG4gICAgICAgIH0sXG4gICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcy5kYXRhKVxuICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgY2FuU3VibWl0OiB0cnVlLFxuICAgICAgICAgICAgY2FuU2VuZENvZGU6IGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZmFpbCA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZmFpbC5lcnJNc2cpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcbiAgICAgICAgY29udGVudDogZXJybXNnLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGZvcm1TdWJtaXQoZSkge1xuICAgIC8v5pu05paw55So5oi354q25oCBXG4gICAgd3gucmVxdWVzdCh7XG4gICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtV0NPL2FwaS9wcmc5ZjI0N2FiNmQ1ZTQvd2VjaGF0dXNlci8nICsgYXBwLmdsb2JhbERhdGEub3BlbklkICsgJz9zZXNzaW9ua2V5PScgKyBhcHAuZ2xvYmFsRGF0YS5zZXNzaW9uS2V5ICsgJyZjaGVja2NvZGU9JyArIHRoaXMuZGF0YS5jaGVja0NvZGUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9wZW5pZDogYXBwLmdsb2JhbERhdGEub3BlbklkLFxuICAgICAgICBuaWNrTmFtZTogYXBwLmdsb2JhbERhdGEudXNlckluZm8ubmlja05hbWUsXG4gICAgICAgIGVtcGxveWVlSWQ6IHRoaXMuZGF0YS53ZWNoYXRVc2VyLmVtcGxveWVlSWQsXG4gICAgICAgIGVtcGxveWVlTmFtZTogdGhpcy5kYXRhLndlY2hhdFVzZXIuZW1wbG95ZWVOYW1lLFxuICAgICAgICBtb2JpbGU6IHRoaXMuZGF0YS53ZWNoYXRVc2VyLm1vYmlsZVxuICAgICAgfSxcbiAgICAgIGhlYWRlcjoge1xuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxuICAgICAgICBpZiAocmVzLmRhdGEuY29kZSA9PSAnMjAwJykge1xuICAgICAgICAgIGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQgPSByZXMuZGF0YS5hdXRob3JpemVkXG4gICAgICAgICAgYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCA9IHJlcy5kYXRhLmVtcGxveWVlSWRcbiAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5lbXBsb3llZU5hbWUgPSByZXMuZGF0YS5lbXBsb3llZU5hbWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBjYW5TdWJtaXQ6IGZhbHNlXG4gICAgICAgIH0pXG4gICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCd3ZWNoYXRVc2VyJywgdGhpcy5kYXRhLndlY2hhdFVzZXIpXG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxuICAgICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLm1zZyxcbiAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcbiAgICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgICAgdXJsOiAnL3BhZ2VzL2luZGV4L2luZGV4J1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogZmFpbCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWwuZXJyTXNnKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGZvcm1SZXNldCgpIHtcbiAgICBjb25zb2xlLmxvZygnZm9ybeWPkeeUn+S6hnJlc2V05LqL5Lu2Jyk7XG4gIH1cbn0pXG4iXX0=