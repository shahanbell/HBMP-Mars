"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
App({
    onLaunch: function () {
        var _this_1 = this;
        wx.login({
            success: function (_res) {
                wx.request({
                    url: _this_1.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/session',
                    data: {
                        code: _res.code
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    method: 'GET',
                    success: function (res) {
                        _this_1.globalData.openId = res.data.openId;
                        _this_1.globalData.sessionKey = res.data.sessionKey;
                        _this_1.globalData.hasOpenId = true;
                        _this_1.globalData.authorized = res.data.authorized;
                        if (res.data.authorized) {
                            _this_1.globalData.employeeId = res.data.employeeId;
                            _this_1.globalData.employeeName = res.data.employeeName;
                            wx.request({
                                url: _this_1.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/' + _this_1.globalData.employeeId,
                                data: {
                                    appid: _this_1.globalData.restId,
                                    token: _this_1.globalData.restToken
                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                method: 'GET',
                                success: function (res) {
                                    _this_1.globalData.defaultCompany = res.data.company,
                                        _this_1.globalData.defaultCompanyName = res.data.companyName,
                                        _this_1.globalData.defaultDeptId = res.data.deptno,
                                        _this_1.globalData.defaultDeptName = res.data.deptname;
                                },
                                fail: function (fail) {
                                    console.log(fail);
                                }
                            });
                            wx.request({
                                url: _this_1.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/AuthValidation',
                                data: {
                                    employeeid: _this_1.globalData.employeeId,
                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                method: 'GET',
                                success: function (res) {
                                    var that = _this_1;
                                    var data = res.data;
                                    that.globalData.authData = data;
                                    if (that.authInfoReadyCallback) {
                                        that.authInfoReadyCallback(data);
                                    }
                                },
                                fail: function (fail) {
                                    wx.showModal({
                                        title: '系统提示',
                                        content: "权限获取失败，请联系管理员",
                                        showCancel: false
                                    });
                                }
                            });
                            var _this = _this_1;
                            _this.globalData.userInfo = res.userInfo;
                            if (_this.userInfoReadyCallback) {
                                _this.userInfoReadyCallback(res.userInfo);
                            }
                        }
                        else {
                            _this_1.globalData.userInfo = false;
                            wx.getUserProfile({
                                success: function (res) {
                                    wx.getUserInfo({
                                        success: function (res) {
                                        }
                                    });
                                },
                                fail: function (res) {
                                    wx.switchTab({
                                        url: '/pages/profile/profile'
                                    });
                                }
                            });
                        }
                        if (_this_1.sessionInfoReadyCallback) {
                            _this_1.sessionInfoReadyCallback(res.data);
                        }
                    },
                    fail: function (fail) {
                        console.log(fail);
                    }
                });
            }
        });
        wx.getSystemInfo({
            success: function (res) {
                _this_1.globalData.screenHeight = res.screenHeight;
                _this_1.globalData.statusBarHeight = res.statusBarHeight;
                _this_1.globalData.windowHeight = res.windowHeight;
            }
        });
    },
    onHide: function () {
        console.log("Quit MicroPrg");
    },
    globalData: {
        authData: [],
        restAdd: 'https://jrs.hanbell.com.cn',
        restEdw: 'https://edw.hanbell.com.cn/platfm.webapi',
        weChatCallBack: 'https%3a%2f%2fi2.hanbell.com.cn%2fHanbell-WCO%2fAuthCallBackServlet',
        restId: '1505912014724',
        restToken: '0ec858293fccfad55575e26b0ce31177',
        restAuth: 'appid=1505912014724&token=0ec858293fccfad55575e26b0ce31177'
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBOEJBLEdBQUcsQ0FBUztJQUdWLFFBQVE7UUFBUixtQkErR0M7UUE3R0MsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNQLE9BQU8sRUFBRSxVQUFBLElBQUk7Z0JBRVgsRUFBRSxDQUFDLE9BQU8sQ0FBQztvQkFDVCxHQUFHLEVBQUUsT0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsMENBQTBDO29CQUN6RSxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUNoQjtvQkFDRCxNQUFNLEVBQUU7d0JBQ04sY0FBYyxFQUFFLGtCQUFrQjtxQkFDbkM7b0JBQ0QsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsT0FBTyxFQUFFLFVBQUEsR0FBRzt3QkFDVixPQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTt3QkFDeEMsT0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUE7d0JBQ2hELE9BQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTt3QkFDaEMsT0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUE7d0JBQ2hELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7NEJBQ3ZCLE9BQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFBOzRCQUNoRCxPQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQTs0QkFDcEQsRUFBRSxDQUFDLE9BQU8sQ0FBQztnQ0FDVCxHQUFHLEVBQUUsT0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdB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SSxDQUFDLENBQUE7eUJBQ3hDO29CQUNILENBQUM7b0JBQ0QsSUFBSSxFQUFFLFVBQUEsSUFBSTt3QkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUNuQixDQUFDO2lCQUNGLENBQUMsQ0FBQTtZQUNKLENBQUM7U0FDRixDQUFDLENBQUE7UUFHRixFQUFFLENBQUMsYUFBYSxDQUFDO1lBQ2YsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixPQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFBO2dCQUMvQyxPQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFBO2dCQUNyRCxPQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFBO1lBQ2pELENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsTUFBTTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELFVBQVUsRUFBRTtRQUNWLFFBQVEsRUFBRSxFQUFFO1FBQ1osT0FBTyxFQUFDLDRCQUE0QjtRQUNwQyxPQUFPLEVBQUMsMENBQTBDO1FBSWxELGNBQWMsRUFBRSxxRUFBcUU7UUFDckYsTUFBTSxFQUFFLGVBQWU7UUFDdkIsU0FBUyxFQUFFLGtDQUFrQztRQUM3QyxRQUFRLEVBQUUsNERBQTREO0tBQ3ZFO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9hcHAudHNcclxuZXhwb3J0IGludGVyZmFjZSBJTXlBcHAge1xyXG4gIHVzZXJJbmZvUmVhZHlDYWxsYmFjaz8ocmVzOiB3eC5Vc2VySW5mbyk6IHZvaWRcclxuICBhdXRoSW5mb1JlYWR5Q2FsbGJhY2s/KHJlczp7fSk6IHZvaWRcclxuICBzZXNzaW9uSW5mb1JlYWR5Q2FsbGJhY2s/KGRhdGE6IHt9KTogdm9pZFxyXG4gIGdsb2JhbERhdGE6IHtcclxuICAgIHJlc3RBZGQ/OiBzdHJpbmcsXHJcbiAgICByZXN0SWQ/OiBzdHJpbmcsXHJcbiAgICByZXN0VG9rZW4/OiBzdHJpbmcsXHJcbiAgICByZXN0QXV0aD86IHN0cmluZyxcclxuICAgIGhhc09wZW5JZD86IGJvb2xlYW4sXHJcbiAgICBvcGVuSWQ/OiBzdHJpbmcsXHJcbiAgICBzZXNzaW9uS2V5Pzogc3RyaW5nLFxyXG4gICAgdXNlckluZm8/OiB3eC5Vc2VySW5mbyxcclxuICAgIGF1dGhvcml6ZWQ/OiBib29sZWFuLFxyXG4gICAgZW1wbG95ZWVJZD86IHN0cmluZyxcclxuICAgIGVtcGxveWVlTmFtZT86IHN0cmluZyxcclxuICAgIGRlZmF1bHRDb21wYW55Pzogc3RyaW5nLFxyXG4gICAgZGVmYXVsdENvbXBhbnlOYW1lPzogc3RyaW5nLFxyXG4gICAgZGVmYXVsdERlcHRJZD86IHN0cmluZyxcclxuICAgIGRlZmF1bHREZXB0TmFtZT86IHN0cmluZyxcclxuICAgIGF1dGg/OiBBcnJheTxzdHJpbmc+W10sXHJcbiAgICBzY3JlZW5IZWlnaHQ/OiBudW1iZXIsXHJcbiAgICBzdGF0dXNCYXJIZWlnaHQ/OiBudW1iZXIsXHJcbiAgICB3aW5kb3dIZWlnaHQ/OiBudW1iZXIsXHJcbiAgICB3ZUNoYXRDYWxsQmFjaz86IHN0cmluZyxcclxuICAgIGF1dGhEYXRhOiBBcnJheTxzdHJpbmc+W10sXHJcbiAgfVxyXG59XHJcblxyXG5BcHA8SU15QXBwPih7XHJcblxyXG4gIFxyXG4gIG9uTGF1bmNoKCkge1xyXG4gICAgLy8g55m75b2VXHJcbiAgICB3eC5sb2dpbih7XHJcbiAgICAgIHN1Y2Nlc3M6IF9yZXMgPT4ge1xyXG4gICAgICAgIC8vIOWPkemAgSBfcmVzLmNvZGUg5Yiw5ZCO5Y+w5o2i5Y+WIG9wZW5JZCwgc2Vzc2lvbktleSwgdW5pb25JZFxyXG4gICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9zZXNzaW9uJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgY29kZTogX3Jlcy5jb2RlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLm9wZW5JZCA9IHJlcy5kYXRhLm9wZW5JZFxyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEuc2Vzc2lvbktleSA9IHJlcy5kYXRhLnNlc3Npb25LZXlcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmhhc09wZW5JZCA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmF1dGhvcml6ZWQgPSByZXMuZGF0YS5hdXRob3JpemVkXHJcbiAgICAgICAgICAgIGlmIChyZXMuZGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmVtcGxveWVlSWQgPSByZXMuZGF0YS5lbXBsb3llZUlkXHJcbiAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZSA9IHJlcy5kYXRhLmVtcGxveWVlTmFtZVxyXG4gICAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB0aGlzLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2VmZ3AvdXNlcnMvJyArIHRoaXMuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICBhcHBpZDogdGhpcy5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICAgICAgICAgICAgdG9rZW46IHRoaXMuZ2xvYmFsRGF0YS5yZXN0VG9rZW5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlVzZXLkv6Hmga/vvJpcIiArIHJlcy5kYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS5kZWZhdWx0Q29tcGFueSA9IHJlcy5kYXRhLmNvbXBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmRlZmF1bHRDb21wYW55TmFtZSA9IHJlcy5kYXRhLmNvbXBhbnlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdElkID0gcmVzLmRhdGEuZGVwdG5vLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS5kZWZhdWx0RGVwdE5hbWUgPSByZXMuZGF0YS5kZXB0bmFtZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB0aGlzLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9BdXRoVmFsaWRhdGlvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgIGVtcGxveWVlaWQ6IHRoaXMuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgIHRoYXQuZ2xvYmFsRGF0YS5hdXRoRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0aGF0LmF1dGhJbmZvUmVhZHlDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuYXV0aEluZm9SZWFkeUNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfns7vnu5/mj5DnpLonLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwi5p2D6ZmQ6I635Y+W5aSx6LSl77yM6K+36IGU57O7566h55CG5ZGYXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB2YXIgX3RoaXM9dGhpc1xyXG4gICAgICAgICAgICAgIC8v5ZCO5Y+w55m75b2V5bey5o6I5p2DXHJcbiAgICAgICAgICAgICAgX3RoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mbztcclxuICAgICAgICAgICAgICBpZiAoX3RoaXMudXNlckluZm9SZWFkeUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy51c2VySW5mb1JlYWR5Q2FsbGJhY2socmVzLnVzZXJJbmZvKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAvL+iOt+WPluadg+mZkOWksei0pemcgOimgeiupOivgVxyXG4gICAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgIHd4LmdldFVzZXJQcm9maWxlKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgd3guZ2V0VXNlckluZm8oe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgd3guc3dpdGNoVGFiKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvcHJvZmlsZS9wcm9maWxlJ1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXNzaW9uSW5mb1JlYWR5Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICB0aGlzLnNlc3Npb25JbmZvUmVhZHlDYWxsYmFjayhyZXMuZGF0YSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAgLy/ojrflj5bmiYvmnLrlsY/luZUs54q25oCB5qCP55qE6auY5bqmXHJcblxyXG4gICAgd3guZ2V0U3lzdGVtSW5mbyh7XHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgdGhpcy5nbG9iYWxEYXRhLnNjcmVlbkhlaWdodCA9IHJlcy5zY3JlZW5IZWlnaHRcclxuICAgICAgICB0aGlzLmdsb2JhbERhdGEuc3RhdHVzQmFySGVpZ2h0ID0gcmVzLnN0YXR1c0JhckhlaWdodFxyXG4gICAgICAgIHRoaXMuZ2xvYmFsRGF0YS53aW5kb3dIZWlnaHQgPSByZXMud2luZG93SGVpZ2h0XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBvbkhpZGUoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlF1aXQgTWljcm9QcmdcIik7XHJcbiAgfSxcclxuICBnbG9iYWxEYXRhOiB7XHJcbiAgICBhdXRoRGF0YTogW10sLy/pobXpnaLnvJPlrZjmlbDmja5cclxuICAgIHJlc3RBZGQ6J2h0dHBzOi8vanJzLmhhbmJlbGwuY29tLmNuJyxcclxuICAgIHJlc3RFZHc6J2h0dHBzOi8vZWR3LmhhbmJlbGwuY29tLmNuL3BsYXRmbS53ZWJhcGknLFxyXG4gICAgLy8gcmVzdEFkZDogJ2h0dHBzOi8vaTIuaGFuYmVsbC5jb20uY24nLFxyXG4gICAgLy8gcmVzdEFkZDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODQ4MCcsXHJcbiAgICAvL1VSTOi9rOeggVxyXG4gICAgd2VDaGF0Q2FsbEJhY2s6ICdodHRwcyUzYSUyZiUyZmkyLmhhbmJlbGwuY29tLmNuJTJmSGFuYmVsbC1XQ08lMmZBdXRoQ2FsbEJhY2tTZXJ2bGV0JyxcclxuICAgIHJlc3RJZDogJzE1MDU5MTIwMTQ3MjQnLFxyXG4gICAgcmVzdFRva2VuOiAnMGVjODU4MjkzZmNjZmFkNTU1NzVlMjZiMGNlMzExNzcnLFxyXG4gICAgcmVzdEF1dGg6ICdhcHBpZD0xNTA1OTEyMDE0NzI0JnRva2VuPTBlYzg1ODI5M2ZjY2ZhZDU1NTc1ZTI2YjBjZTMxMTc3J1xyXG4gIH0sXHJcbn0pXHJcbiJdfQ==