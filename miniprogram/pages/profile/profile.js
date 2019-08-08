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
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        wx.request({
            url: app.globalData.restAdd + '/WeChatOpen/api/prg26c450ac24f4/wechatuser',
            data: {
                openid: app.globalData.openId,
                nickName: app.globalData.userInfo.nickName
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                console.log(res);
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
                url: app.globalData.restAdd + '/WeChatOpen/api/prg26c450ac24f4/checkcode',
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
            url: app.globalData.restAdd + '/WeChatOpen/api/prg26c450ac24f4/wechatuser/' + app.globalData.openId + '?sessionkey=' + app.globalData.sessionKey + '&checkcode=' + this.data.checkCode,
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
                _this.setData({
                    canSubmit: false
                });
                app.globalData.authorized = true;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUU1QixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELFVBQVUsRUFBRTtZQUNWLFVBQVUsRUFBRSxFQUFFO1lBQ2QsWUFBWSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxFQUFFLEVBQUU7U0FDWDtRQUNELFNBQVMsRUFBRSxFQUFFO1FBQ2IsY0FBYyxFQUFFLE9BQU87UUFDdkIsV0FBVyxFQUFFLElBQUk7UUFDakIsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxNQUFNO1FBQU4saUJBZUM7UUFkQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQzNCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUTtnQkFDakMsV0FBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLFlBQVk7WUFDakIsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFVBQVUsRUFBRSxHQUFHLENBQUMsSUFBSTtpQkFDckIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxXQUFXLFlBQUMsQ0FBQztRQUNYLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO1FBQzNDLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixRQUFRLEVBQUUs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QUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzFCLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsU0FBUztRQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9wcm9maWxlLnRzXG4vL+iOt+WPluW6lOeUqOWunuS+i1xuaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXG5cblBhZ2Uoe1xuICBkYXRhOiB7XG4gICAgdXNlckluZm86IHt9LFxuICAgIGhhc1VzZXJJbmZvOiBmYWxzZSxcbiAgICBjYW5JVXNlOiB3eC5jYW5JVXNlKCdidXR0b24ub3Blbi10eXBlLmdldFVzZXJJbmZvJyksXG4gICAgd2VjaGF0VXNlcjoge1xuICAgICAgZW1wbG95ZWVJZDogJycsXG4gICAgICBlbXBsb3llZU5hbWU6ICcnLFxuICAgICAgbW9iaWxlOiAnJ1xuICAgIH0sXG4gICAgY2hlY2tDb2RlOiAnJyxcbiAgICBidG5TZW5kRGlzcGxheTogJ+iOt+WPlumqjOivgeeggScsXG4gICAgY2FuU2VuZENvZGU6IHRydWUsXG4gICAgY2FuU3VibWl0OiB0cnVlXG4gIH0sXG4gIG9uTG9hZCgpIHtcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEudXNlckluZm8pIHtcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICB1c2VySW5mbzogYXBwLmdsb2JhbERhdGEudXNlckluZm8sXG4gICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgICB3eC5nZXRTdG9yYWdlKHtcbiAgICAgIGtleTogJ3dlY2hhdFVzZXInLFxuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgd2VjaGF0VXNlcjogcmVzLmRhdGFcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBnZXRVc2VySW5mbyhlKSB7XG4gICAgYXBwLmdsb2JhbERhdGEudXNlckluZm8gPSBlLmRldGFpbC51c2VySW5mb1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgdXNlckluZm86IGUuZGV0YWlsLnVzZXJJbmZvLFxuICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICB9KVxuICAgIC8v5o6I5p2D5ZCO5a2Y5YKob3BlbmlkXG4gICAgd3gucmVxdWVzdCh7XG4gICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL1dlQ2hhdE9wZW4vYXBpL3ByZzI2YzQ1MGFjMjRmNC93ZWNoYXR1c2VyJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3BlbmlkOiBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQsXG4gICAgICAgIG5pY2tOYW1lOiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mby5uaWNrTmFtZVxuICAgICAgfSxcbiAgICAgIGhlYWRlcjoge1xuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpXG4gICAgICB9LFxuICAgICAgZmFpbDogZmFpbCA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgYmluZEVtcGxveWVlSWRDaGFuZ2UoZSkge1xuICAgIGxldCBlbXBsb3llZUlkID0gJ3dlY2hhdFVzZXIuZW1wbG95ZWVJZCc7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBbZW1wbG95ZWVJZF06IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZEVtcGxveWVlTmFtZUNoYW5nZShlKSB7XG4gICAgbGV0IGVtcGxveWVlTmFtZSA9ICd3ZWNoYXRVc2VyLmVtcGxveWVlTmFtZSc7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBbZW1wbG95ZWVOYW1lXTogZS5kZXRhaWwudmFsdWVcbiAgICB9KVxuICB9LFxuICBiaW5kTW9iaWxlQ2hhbmdlKGUpIHtcbiAgICBsZXQgbW9iaWxlID0gJ3dlY2hhdFVzZXIubW9iaWxlJztcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIFttb2JpbGVdOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmRDaGVja0NvZGVDaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgY2hlY2tDb2RlOiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gIH0sXG4gIGJpbmRTZW5kQ29kZVRhcChlKSB7XG4gICAgbGV0IGNhblNlbmQgPSB0cnVlXG4gICAgbGV0IGVycm1zZyA9ICcnXG4gICAgbGV0IHJlZyA9IC9eKCgoMTNbMC05XXsxfSl8KDE1WzAtOV17MX0pfCgxOFswLTldezF9KXwoMTdbMC05XXsxfSkpK1xcZHs4fSkkL1xuICAgIGlmICghdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlIHx8IHRoaXMuZGF0YS53ZWNoYXRVc2VyLm1vYmlsZSA9PSAnJyB8fCB0aGlzLmRhdGEud2VjaGF0VXNlci5tb2JpbGUubGVuZ3RoICE9IDExKSB7XG4gICAgICBjYW5TZW5kID0gZmFsc2VcbiAgICAgIGVycm1zZyArPSAn5omL5py65Y+356CB6ZW/5bqm6ZSZ6K+vXFxyXFxuJ1xuICAgIH1cbiAgICBpZiAoIXJlZy50ZXN0KHRoaXMuZGF0YS53ZWNoYXRVc2VyLm1vYmlsZSkpIHtcbiAgICAgIGNhblNlbmQgPSBmYWxzZVxuICAgICAgZXJybXNnICs9ICfmiYvmnLrlj7fnoIHmoLzlvI/plJnor69cXHJcXG4nXG4gICAgfVxuICAgIGlmIChjYW5TZW5kKSB7XG4gICAgICBsZXQgd2FpdHM6IG51bWJlciA9IDYwXG4gICAgICBsZXQgZm4gPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHdhaXRzLS1cbiAgICAgICAgbGV0IHYgPSAn562J5b6FKCcgKyB3YWl0cyArICcp56eSJ1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBidG5TZW5kRGlzcGxheTogdlxuICAgICAgICB9KVxuICAgICAgfSwgMTAwMCwgd2FpdHMpXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgYnRuU2VuZERpc3BsYXk6ICfojrflj5bpqozor4HnoIEnLFxuICAgICAgICAgIGNhblNlbmRDb2RlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIGNsZWFySW50ZXJ2YWwoZm4pXG4gICAgICB9LCA2MDAwMClcbiAgICAgIC8vIOiOt+WPluagoemqjOeggVxuICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvV2VDaGF0T3Blbi9hcGkvcHJnMjZjNDUwYWMyNGY0L2NoZWNrY29kZScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBvcGVuaWQ6IGFwcC5nbG9iYWxEYXRhLm9wZW5JZCxcbiAgICAgICAgICBzZXNzaW9ua2V5OiBhcHAuZ2xvYmFsRGF0YS5zZXNzaW9uS2V5LFxuICAgICAgICAgIG1vYmlsZTogdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlXG4gICAgICAgIH0sXG4gICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcy5kYXRhKVxuICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgY2FuU3VibWl0OiB0cnVlLFxuICAgICAgICAgICAgY2FuU2VuZENvZGU6IGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogZmFpbCA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZmFpbC5lcnJNc2cpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcbiAgICAgICAgY29udGVudDogZXJybXNnLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG4gIGZvcm1TdWJtaXQoZSkge1xuICAgIC8v5pu05paw55So5oi354q25oCBXG4gICAgd3gucmVxdWVzdCh7XG4gICAgICB1cmw6IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL1dlQ2hhdE9wZW4vYXBpL3ByZzI2YzQ1MGFjMjRmNC93ZWNoYXR1c2VyLycgKyBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQgKyAnP3Nlc3Npb25rZXk9JyArIGFwcC5nbG9iYWxEYXRhLnNlc3Npb25LZXkgKyAnJmNoZWNrY29kZT0nICsgdGhpcy5kYXRhLmNoZWNrQ29kZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3BlbmlkOiBhcHAuZ2xvYmFsRGF0YS5vcGVuSWQsXG4gICAgICAgIG5pY2tOYW1lOiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mby5uaWNrTmFtZSxcbiAgICAgICAgZW1wbG95ZWVJZDogdGhpcy5kYXRhLndlY2hhdFVzZXIuZW1wbG95ZWVJZCxcbiAgICAgICAgZW1wbG95ZWVOYW1lOiB0aGlzLmRhdGEud2VjaGF0VXNlci5lbXBsb3llZU5hbWUsXG4gICAgICAgIG1vYmlsZTogdGhpcy5kYXRhLndlY2hhdFVzZXIubW9iaWxlXG4gICAgICB9LFxuICAgICAgaGVhZGVyOiB7XG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgIH0sXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgY2FuU3VibWl0OiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgICBhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkID0gdHJ1ZVxuICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygnd2VjaGF0VXNlcicsIHRoaXMuZGF0YS53ZWNoYXRVc2VyKVxuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcbiAgICAgICAgICBjb250ZW50OiByZXMuZGF0YS5tc2csXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICAgIHVybDogJy9wYWdlcy9pbmRleC9pbmRleCdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhmYWlsLmVyck1zZylcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBmb3JtUmVzZXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2Zvcm3lj5HnlJ/kuoZyZXNldOS6i+S7ticpO1xuICB9XG59KVxuIl19