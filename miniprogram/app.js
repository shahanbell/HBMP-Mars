"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
App({
    onLaunch: function () {
        var _this = this;
        wx.login({
            success: function (_res) {
                wx.request({
                    url: _this.globalData.restAdd + '/WeChatOpen/api/prg26c450ac24f4/session',
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
                                        _this.globalData.defaultDeptId = res.data.deptno,
                                        _this.globalData.defaultDeptName = res.data.deptname;
                                },
                                fail: function (fail) {
                                    console.log(fail);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBc0JBLEdBQUcsQ0FBUztJQUNWLFFBQVE7UUFBUixpQkE4RUM7UUE1RUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNQLE9BQU8sRUFBRSxVQUFBLElBQUk7Z0JBRVgsRUFBRSxDQUFDLE9BQU8sQ0FBQztvQkFDVCxHQUFHLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcseUNBQXlDO29CQUN4RSxJQUFJLEVBQUU7d0JBQ0osSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUNoQjtvQkFDRCxNQUFNLEVBQUU7d0JBQ04sY0FBYyxFQUFFLGtCQUFrQjtxQkFDbkM7b0JBQ0QsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsT0FBTyxFQUFFLFVBQUEsR0FBRzt3QkFFVixLQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTt3QkFDeEMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUE7d0JBQ2hELEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTt3QkFDaEMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUE7d0JBQ2hELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7NEJBQ3ZCLEtBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFBOzRCQUNoRCxLQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQTs0QkFDcEQsRUFBRSxDQUFDLE9BQU8sQ0FBQztnQ0FDVCxHQUFHLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsOEJBQThCLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVO2dDQUMxRixJQUFJLEVBQUU7b0NBQ0osS0FBSyxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsTUFBTTtvQ0FDN0IsS0FBSyxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUztpQ0FDakM7Z0NBQ0QsTUFBTSxFQUFFO29DQUNOLGNBQWMsRUFBRSxrQkFBa0I7aUNBQ25DO2dDQUNELE1BQU0sRUFBRSxLQUFLO2dDQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7b0NBRVYsS0FBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPO3dDQUMvQyxLQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07d0NBQy9DLEtBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFBO2dDQUN2RCxDQUFDO2dDQUNELElBQUksRUFBRSxVQUFBLElBQUk7b0NBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQ0FDbkIsQ0FBQzs2QkFDRixDQUFDLENBQUE7eUJBQ0g7d0JBQ0QsSUFBSSxLQUFJLENBQUMsd0JBQXdCLEVBQUU7NEJBQ2pDLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7eUJBQ3hDO29CQUNILENBQUM7b0JBQ0QsSUFBSSxFQUFFLFVBQUEsSUFBSTt3QkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUNuQixDQUFDO2lCQUNGLENBQUMsQ0FBQTtZQUNKLENBQUM7U0FDRixDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osT0FBTyxFQUFFLFVBQUMsR0FBRztnQkFDWCxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtvQkFFckMsRUFBRSxDQUFDLFdBQVcsQ0FBQzt3QkFDYixPQUFPLEVBQUUsVUFBQSxHQUFHOzRCQUVWLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUE7NEJBR3ZDLElBQUksS0FBSSxDQUFDLHFCQUFxQixFQUFFO2dDQUM5QixLQUFJLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBOzZCQUN6Qzt3QkFDSCxDQUFDO3FCQUNGLENBQUMsQ0FBQTtpQkFDSDtxQkFBTTtvQkFFTCxFQUFFLENBQUMsU0FBUyxDQUFDO3dCQUNYLEdBQUcsRUFBRSx3QkFBd0I7cUJBQzlCLENBQUMsQ0FBQTtpQkFDSDtZQUNILENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsTUFBTTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELFVBQVUsRUFBRTtRQUVWLE9BQU8sRUFBRSwyQkFBMkI7UUFDcEMsTUFBTSxFQUFFLGVBQWU7UUFDdkIsU0FBUyxFQUFFLGtDQUFrQztRQUM3QyxRQUFRLEVBQUUsNERBQTREO0tBQ3ZFO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9hcHAudHNcbmV4cG9ydCBpbnRlcmZhY2UgSU15QXBwIHtcbiAgdXNlckluZm9SZWFkeUNhbGxiYWNrPyhyZXM6IHd4LlVzZXJJbmZvKTogdm9pZFxuICBzZXNzaW9uSW5mb1JlYWR5Q2FsbGJhY2s/KGRhdGE6IHt9KTogdm9pZFxuICBnbG9iYWxEYXRhOiB7XG4gICAgcmVzdEFkZD86IHN0cmluZyxcbiAgICByZXN0SWQ/OiBzdHJpbmcsXG4gICAgcmVzdFRva2VuPzogc3RyaW5nLFxuICAgIHJlc3RBdXRoPzogc3RyaW5nLFxuICAgIGhhc09wZW5JZD86IGJvb2xlYW4sXG4gICAgb3BlbklkPzogc3RyaW5nLFxuICAgIHNlc3Npb25LZXk/OiBzdHJpbmcsXG4gICAgdXNlckluZm8/OiB3eC5Vc2VySW5mbyxcbiAgICBhdXRob3JpemVkPzogYm9vbGVhbixcbiAgICBlbXBsb3llZUlkPzogc3RyaW5nLFxuICAgIGVtcGxveWVlTmFtZT86IHN0cmluZyxcbiAgICBkZWZhdWx0Q29tcGFueT86IHN0cmluZyxcbiAgICBkZWZhdWx0RGVwdElkPzogc3RyaW5nLFxuICAgIGRlZmF1bHREZXB0TmFtZT86IHN0cmluZ1xuICB9XG59XG5cbkFwcDxJTXlBcHA+KHtcbiAgb25MYXVuY2goKSB7XG4gICAgLy8g55m75b2VXG4gICAgd3gubG9naW4oe1xuICAgICAgc3VjY2VzczogX3JlcyA9PiB7XG4gICAgICAgIC8vIOWPkemAgSBfcmVzLmNvZGUg5Yiw5ZCO5Y+w5o2i5Y+WIG9wZW5JZCwgc2Vzc2lvbktleSwgdW5pb25JZFxuICAgICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgICB1cmw6IHRoaXMuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9XZUNoYXRPcGVuL2FwaS9wcmcyNmM0NTBhYzI0ZjQvc2Vzc2lvbicsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY29kZTogX3Jlcy5jb2RlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzLmRhdGEpXG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEub3BlbklkID0gcmVzLmRhdGEub3BlbklkXG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEuc2Vzc2lvbktleSA9IHJlcy5kYXRhLnNlc3Npb25LZXlcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS5oYXNPcGVuSWQgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEuYXV0aG9yaXplZCA9IHJlcy5kYXRhLmF1dGhvcml6ZWRcbiAgICAgICAgICAgIGlmIChyZXMuZGF0YS5hdXRob3JpemVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS5lbXBsb3llZUlkID0gcmVzLmRhdGEuZW1wbG95ZWVJZFxuICAgICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEuZW1wbG95ZWVOYW1lID0gcmVzLmRhdGEuZW1wbG95ZWVOYW1lXG4gICAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogdGhpcy5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtSlJTL2FwaS9lZmdwL3VzZXJzLycgKyB0aGlzLmdsb2JhbERhdGEuZW1wbG95ZWVJZCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBhcHBpZDogdGhpcy5nbG9iYWxEYXRhLnJlc3RJZCxcbiAgICAgICAgICAgICAgICAgIHRva2VuOiB0aGlzLmdsb2JhbERhdGEucmVzdFRva2VuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzLmRhdGEpXG4gICAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEuZGVmYXVsdENvbXBhbnkgPSByZXMuZGF0YS5jb21wYW55LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbERhdGEuZGVmYXVsdERlcHRJZCA9IHJlcy5kYXRhLmRlcHRubyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLmRlZmF1bHREZXB0TmFtZSA9IHJlcy5kYXRhLmRlcHRuYW1lXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmYWlsOiBmYWlsID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc2Vzc2lvbkluZm9SZWFkeUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Vzc2lvbkluZm9SZWFkeUNhbGxiYWNrKHJlcy5kYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbDogZmFpbCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBr1xuICAgIHd4LmdldFNldHRpbmcoe1xuICAgICAgc3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgICAgICAgLy8g5bey57uP5o6I5p2D77yM5Y+v5Lul55u05o6l6LCD55SoIGdldFVzZXJJbmZvIOiOt+WPluWktOWDj+aYteensO+8jOS4jeS8muW8ueahhlxuICAgICAgICAgIHd4LmdldFVzZXJJbmZvKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgIC8vIOWPr+S7peWwhiByZXMg5Y+R6YCB57uZ5ZCO5Y+w6Kej56CB5Ye6IHVuaW9uSWRcbiAgICAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gcmVzLnVzZXJJbmZvXG4gICAgICAgICAgICAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXG4gICAgICAgICAgICAgIC8vIOaJgOS7peatpOWkhOWKoOWFpSBjYWxsYmFjayDku6XpmLLmraLov5nnp43mg4XlhrVcbiAgICAgICAgICAgICAgaWYgKHRoaXMudXNlckluZm9SZWFkeUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VySW5mb1JlYWR5Q2FsbGJhY2socmVzLnVzZXJJbmZvKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL+i/mOacquaOiOadg1xuICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICB1cmw6ICcvcGFnZXMvcHJvZmlsZS9wcm9maWxlJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBvbkhpZGUoKSB7XG4gICAgY29uc29sZS5sb2coXCJRdWl0IE1pY3JvUHJnXCIpO1xuICB9LFxuICBnbG9iYWxEYXRhOiB7XG4gICAgLy9yZXN0QWRkOidodHRwczovL2pycy5oYW5iZWxsLmNvbS5jbicsXG4gICAgcmVzdEFkZDogJ2h0dHBzOi8vaTIuaGFuYmVsbC5jb20uY24nLFxuICAgIHJlc3RJZDogJzE1MDU5MTIwMTQ3MjQnLFxuICAgIHJlc3RUb2tlbjogJzBlYzg1ODI5M2ZjY2ZhZDU1NTc1ZTI2YjBjZTMxMTc3JyxcbiAgICByZXN0QXV0aDogJ2FwcGlkPTE1MDU5MTIwMTQ3MjQmdG9rZW49MGVjODU4MjkzZmNjZmFkNTU1NzVlMjZiMGNlMzExNzcnXG4gIH1cbn0pXG4iXX0=