"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
App({
    onLaunch: function () {
        var _this = this;
        wx.login({
            success: function (_res) {
                wx.request({
                    url: _this.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/session',
                    data: {
                        code: _res.code
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    method: 'GET',
                    success: function (res) {
                        _this.globalData.openId = res.data.openId;
                        _this.globalData.sessionKey = res.data.sessionKey;
                        _this.globalData.hasOpenId = true;
                        _this.globalData.authorized = res.data.authorized;
                        if (res.data.authorized) {
                            _this.globalData.employeeId = res.data.employeeId;
                            _this.globalData.employeeName = res.data.employeeName;
                            wx.request({
                                url: _this.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/' + _this.globalData.employeeId,
                                data: {
                                    appid: _this.globalData.restId,
                                    token: _this.globalData.restToken
                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                method: 'GET',
                                success: function (res) {
                                    _this.globalData.defaultCompany = res.data.company,
                                        _this.globalData.defaultCompanyName = res.data.companyName,
                                        _this.globalData.defaultDeptId = res.data.deptno,
                                        _this.globalData.defaultDeptName = res.data.deptname;
                                },
                                fail: function (fail) {
                                    console.log(fail);
                                }
                            });
                            wx.request({
                                url: _this.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/AuthValidation',
                                data: {
                                    employeeid: _this.globalData.employeeId,
                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                method: 'GET',
                                success: function (res) {
                                    var data = res.data;
                                    _this.globalData.auth = data;
                                },
                                fail: function (fail) {
                                    wx.showModal({
                                        title: '系统提示',
                                        content: "权限获取失败，请联系管理员",
                                        showCancel: false
                                    });
                                }
                            });
                        }
                        if (_this.sessionInfoReadyCallback) {
                            _this.sessionInfoReadyCallback(res.data);
                        }
                    },
                    fail: function (fail) {
                        console.log(fail);
                    }
                });
            }
        });
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            _this.globalData.userInfo = res.userInfo;
                            if (_this.userInfoReadyCallback) {
                                _this.userInfoReadyCallback(res.userInfo);
                            }
                        }
                    });
                }
                else {
                    wx.switchTab({
                        url: '/pages/profile/profile'
                    });
                }
            }
        });
    },
    onHide: function () {
        console.log("Quit MicroPrg");
    },
    globalData: {
        restAdd: 'https://i2.hanbell.com.cn',
        restId: '1505912014724',
        restToken: '0ec858293fccfad55575e26b0ce31177',
        restAuth: 'appid=1505912014724&token=0ec858293fccfad55575e26b0ce31177'
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBd0JBLEdBQUcsQ0FBUztJQUNWLFFBQVE7UUFBUixpQkF5R0M7UUF2R0MsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNQLE9BQU8sRUFBRSxVQUFBLElBQUk7Z0JBRVgsRUFBRSxDQUFDLE9BQU8sQ0FBQztvQkFDVCxHQUFHLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsMENBQTBDO29CQUN6RSxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUNoQjtvQkFDRCxNQUFNLEVBQUU7d0JBQ04sY0FBYyxFQUFFLGtCQUFrQjtxQkFDbkM7b0JBQ0QsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsT0FBTyxFQUFFLFVBQUEsR0FBRzt3QkFFVixLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTt3QkFDeEMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUE7d0JBQ2hELEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTt3QkFDaEMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUE7d0JBQ2hELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7NEJBQ3ZCLEtBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFBOzRCQUNoRCxLQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQTs0QkFDcEQsRUFBRSxDQUFDLE9BQU8sQ0FBQztnQ0FDVCxHQUFHLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsOEJBQThCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVO2dDQUMxRixJQUFJLEVBQUU7b0NBQ0osS0FBSyxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsTUFBTTtvQ0FDN0IsS0FBSyxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUztpQ0FDakM7Z0NBQ0QsTUFBTSxFQUFFO29DQUNOLGNBQWMsRUFBRSxrQkFBa0I7aUNBQ25DO2dDQUNELE1BQU0sRUFBRSxLQUFLO2dDQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7b0NBRVIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPO3dDQUNqRCxLQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVzt3Q0FDekQsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNO3dDQUMvQyxLQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQTtnQ0FDdkQsQ0FBQztnQ0FDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO29DQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7Z0NBQ25CLENBQUM7NkJBQ0YsQ0FBQyxDQUFBOzRCQUVGLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0NBSVQsR0FBRyxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFFLGlEQUFpRDtnQ0FDL0UsSUFBSSxFQUFFO29DQUNKLFVBQVUsRUFBRSxLQUFJLENBQUMsVUFBVSxDQUFDLFVBQVU7aUNBQ3ZDO2dDQUNELE1BQU0sRUFBRTtvQ0FDTixjQUFjLEVBQUUsa0JBQWtCO2lDQUNuQztnQ0FDRCxNQUFNLEVBQUUsS0FBSztnQ0FDYixPQUFPLEVBQUUsVUFBQSxHQUFHO29DQUNWLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0NBQ3BCLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQ0FDOUIsQ0FBQztnQ0FDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO29DQUNSLEVBQUUsQ0FBQyxTQUFTLENBQUM7d0NBQ1gsS0FBSyxFQUFFLE1BQU07d0NBQ2IsT0FBTyxFQUFFLGVBQWU7d0NBQ3hCLFVBQVUsRUFBRSxLQUFLO3FDQUNsQixDQUFDLENBQUE7Z0NBQ0osQ0FBQzs2QkFDRixDQUFDLENBQUE7eUJBRUg7d0JBQ0QsSUFBSSxLQUFJLENBQUMsd0JBQXdCLEVBQUU7NEJBQ2pDLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7eUJBQ3hDO29CQUNILENBQUM7b0JBQ0QsSUFBSSxFQUFFLFVBQUEsSUFBSTt3QkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUNuQixDQUFDO2lCQUNGLENBQUMsQ0FBQTtZQUNKLENBQUM7U0FDRixDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osT0FBTyxFQUFFLFVBQUMsR0FBRztnQkFDWCxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtvQkFFckMsRUFBRSxDQUFDLFdBQVcsQ0FBQzt3QkFDYixPQUFPLEVBQUUsVUFBQSxHQUFHOzRCQUVWLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUE7NEJBR3ZDLElBQUksS0FBSSxDQUFDLHFCQUFxQixFQUFFO2dDQUM5QixLQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBOzZCQUN6Qzt3QkFDSCxDQUFDO3FCQUNGLENBQUMsQ0FBQTtpQkFDSDtxQkFBTTtvQkFFTCxFQUFFLENBQUMsU0FBUyxDQUFDO3dCQUNYLEdBQUcsRUFBRSx3QkFBd0I7cUJBQzlCLENBQUMsQ0FBQTtpQkFDSDtZQUNILENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsTUFBTTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELFVBQVUsRUFBRTtRQUVWLE9BQU8sRUFBRSwyQkFBMkI7UUFFcEMsTUFBTSxFQUFFLGVBQWU7UUFDdkIsU0FBUyxFQUFFLGtDQUFrQztRQUM3QyxRQUFRLEVBQUUsNERBQTREO0tBQ3ZFO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9hcHAudHNcclxuZXhwb3J0IGludGVyZmFjZSBJTXlBcHAge1xyXG4gIHVzZXJJbmZvUmVhZHlDYWxsYmFjaz8ocmVzOiB3eC5Vc2VySW5mbyk6IHZvaWRcclxuICBzZXNzaW9uSW5mb1JlYWR5Q2FsbGJhY2s/KGRhdGE6IHt9KTogdm9pZFxyXG4gIGdsb2JhbERhdGE6IHtcclxuICAgIHJlc3RBZGQ/OiBzdHJpbmcsXHJcbiAgICByZXN0SWQ/OiBzdHJpbmcsXHJcbiAgICByZXN0VG9rZW4/OiBzdHJpbmcsXHJcbiAgICByZXN0QXV0aD86IHN0cmluZyxcclxuICAgIGhhc09wZW5JZD86IGJvb2xlYW4sXHJcbiAgICBvcGVuSWQ/OiBzdHJpbmcsXHJcbiAgICBzZXNzaW9uS2V5Pzogc3RyaW5nLFxyXG4gICAgdXNlckluZm8/OiB3eC5Vc2VySW5mbyxcclxuICAgIGF1dGhvcml6ZWQ/OiBib29sZWFuLFxyXG4gICAgZW1wbG95ZWVJZD86IHN0cmluZyxcclxuICAgIGVtcGxveWVlTmFtZT86IHN0cmluZyxcclxuICAgIGRlZmF1bHRDb21wYW55Pzogc3RyaW5nLFxyXG4gICAgZGVmYXVsdENvbXBhbnlOYW1lPzogc3RyaW5nLFxyXG4gICAgZGVmYXVsdERlcHRJZD86IHN0cmluZyxcclxuICAgIGRlZmF1bHREZXB0TmFtZT86IHN0cmluZyxcclxuICAgIGF1dGg/OiBBcnJheVtzdHJpbmddLFxyXG4gIH1cclxufVxyXG5cclxuQXBwPElNeUFwcD4oe1xyXG4gIG9uTGF1bmNoKCkge1xyXG4gICAgLy8g55m75b2VXHJcbiAgICB3eC5sb2dpbih7XHJcbiAgICAgIHN1Y2Nlc3M6IF9yZXMgPT4ge1xyXG4gICAgICAgIC8vIOWPkemAgSBfcmVzLmNvZGUg5Yiw5ZCO5Y+w5o2i5Y+WIG9wZW5JZCwgc2Vzc2lvbktleSwgdW5pb25JZFxyXG4gICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgdXJsOiB0aGlzLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9zZXNzaW9uJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgY29kZTogX3Jlcy5jb2RlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMuZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLm9wZW5JZCA9IHJlcy5kYXRhLm9wZW5JZFxyXG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEuc2Vzc2lvbktleSA9IHJlcy5kYXRhLnNlc3Npb25LZXlcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmhhc09wZW5JZCA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmF1dGhvcml6ZWQgPSByZXMuZGF0YS5hdXRob3JpemVkXHJcbiAgICAgICAgICAgIGlmIChyZXMuZGF0YS5hdXRob3JpemVkKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmVtcGxveWVlSWQgPSByZXMuZGF0YS5lbXBsb3llZUlkXHJcbiAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmVtcGxveWVlTmFtZSA9IHJlcy5kYXRhLmVtcGxveWVlTmFtZVxyXG4gICAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiB0aGlzLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2VmZ3AvdXNlcnMvJyArIHRoaXMuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICBhcHBpZDogdGhpcy5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICAgICAgICAgICAgdG9rZW46IHRoaXMuZ2xvYmFsRGF0YS5yZXN0VG9rZW5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiVXNlcuS/oeaBr++8mlwiICsgcmVzLmRhdGEpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmRlZmF1bHRDb21wYW55ID0gcmVzLmRhdGEuY29tcGFueSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEuZGVmYXVsdENvbXBhbnlOYW1lID0gcmVzLmRhdGEuY29tcGFueU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmRlZmF1bHREZXB0SWQgPSByZXMuZGF0YS5kZXB0bm8sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZSA9IHJlcy5kYXRhLmRlcHRuYW1lXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAvL+a1i+ivleWcsOWdgFxyXG4gICAgICAgICAgICAgICAgLy8gdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4NDgwL0hhbmJlbGwtV0NPL2FwaS9wcmc5ZjI0N2FiNmQ1ZTQvQXV0aFZhbGlkYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgLy/mraPlvI/lnLDlnYBcclxuICAgICAgICAgICAgICAgIHVybDogdGhpcy5nbG9iYWxEYXRhLnJlc3RBZGQgKycvSGFuYmVsbC1XQ08vYXBpL3ByZzlmMjQ3YWI2ZDVlNC9BdXRoVmFsaWRhdGlvbicsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgIGVtcGxveWVlaWQ6IHRoaXMuZ2xvYmFsRGF0YS5lbXBsb3llZUlkLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS5hdXRoID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+ezu+e7n+aPkOekuicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogXCLmnYPpmZDojrflj5blpLHotKXvvIzor7fogZTns7vnrqHnkIblkZhcIixcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlc3Npb25JbmZvUmVhZHlDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm9SZWFkeUNhbGxiYWNrKHJlcy5kYXRhKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBr1xyXG4gICAgd3guZ2V0U2V0dGluZyh7XHJcbiAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcclxuICAgICAgICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XHJcbiAgICAgICAgICAvLyDlt7Lnu4/mjojmnYPvvIzlj6/ku6Xnm7TmjqXosIPnlKggZ2V0VXNlckluZm8g6I635Y+W5aS05YOP5pi156ew77yM5LiN5Lya5by55qGGXHJcbiAgICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgLy8g5Y+v5Lul5bCGIHJlcyDlj5HpgIHnu5nlkI7lj7Dop6PnoIHlh7ogdW5pb25JZFxyXG4gICAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xyXG4gICAgICAgICAgICAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXHJcbiAgICAgICAgICAgICAgLy8g5omA5Lul5q2k5aSE5Yqg5YWlIGNhbGxiYWNrIOS7pemYsuatoui/meenjeaDheWGtVxyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJJbmZvUmVhZHlDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VySW5mb1JlYWR5Q2FsbGJhY2socmVzLnVzZXJJbmZvKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy/ov5jmnKrmjojmnYNcclxuICAgICAgICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgICAgICAgIHVybDogJy9wYWdlcy9wcm9maWxlL3Byb2ZpbGUnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIG9uSGlkZSgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiUXVpdCBNaWNyb1ByZ1wiKTtcclxuICB9LFxyXG4gIGdsb2JhbERhdGE6IHtcclxuICAgIC8vcmVzdEFkZDonaHR0cHM6Ly9qcnMuaGFuYmVsbC5jb20uY24nLFxyXG4gICAgcmVzdEFkZDogJ2h0dHBzOi8vaTIuaGFuYmVsbC5jb20uY24nLFxyXG4gICAgLy8gcmVzdEFkZDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODQ4MCcsXHJcbiAgICByZXN0SWQ6ICcxNTA1OTEyMDE0NzI0JyxcclxuICAgIHJlc3RUb2tlbjogJzBlYzg1ODI5M2ZjY2ZhZDU1NTc1ZTI2YjBjZTMxMTc3JyxcclxuICAgIHJlc3RBdXRoOiAnYXBwaWQ9MTUwNTkxMjAxNDcyNCZ0b2tlbj0wZWM4NTgyOTNmY2NmYWQ1NTU3NWUyNmIwY2UzMTE3NydcclxuICB9XHJcbn0pXHJcbiJdfQ==