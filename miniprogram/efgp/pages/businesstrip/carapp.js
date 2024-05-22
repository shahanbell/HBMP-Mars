"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var userInput = '';
var eventChannel;
Page({
    data: {
        detailList: [],
        clxz: '1',
        clxzDesc: '1-公务车',
        privatedriver: '',
        privatedriverno: '',
        privatecarno: '',
        telcontact: '',
        purpose: '',
        purposeDesc: '',
        hmark1: '',
        isStayShow: false,
        staykey: "2",
        stayValue: "不住宿",
        stays: [{ key: "1", name: "住宿" }, { key: "2", name: "不住宿" }],
        isDeparturePopShow: false,
        departurekey: "",
        departurevalue: "",
        staydepartures: [{ key: "1", name: "枫泾厂出发" }, { key: "2", name: "兴塔产出发" }, { key: "3", name: "分公司出发" }, { key: "4", name: "汉声厂出发" }, { key: "5", name: "汉扬厂出发" }],
        isRegistrationPopShow: false,
        registrationkey: "2",
        registrationvalue: "不办理",
        registrations: [{ key: "1", name: "办理" }, { key: "2", name: "不办理" }],
    },
    onLoad: function () {
        var that = this;
        eventChannel = this.getOpenerEventChannel();
        eventChannel.on('openDetail', function (res) {
            if (res.isNew) {
                that.setData({
                    privatedriver: app.globalData.employeeId + '-' + app.globalData.employeeName,
                    privatedriverno: app.globalData.employeeId
                });
            }
            else {
                that.setData({
                    clxz: res.data.clxz,
                    clxzDesc: res.data.clxzDesc,
                    privatedriver: res.data.privatedriver,
                    privatedriverno: res.data.privatedriverno,
                    privatecarno: res.data.privatecarno,
                    telcontact: res.data.telcontact,
                    purpose: res.data.purpose,
                    purposeDesc: res.data.purposeDesc,
                    hmark1: res.data.hmark1,
                    staykey: res.data.staykey,
                    stayValue: res.data.stayValue,
                    departurekey: res.data.departurekey,
                    departurevalue: res.data.departurevalue,
                    registrationkey: res.data.registrationkey,
                    registrationvalue: res.data.registrationvalue
                });
            }
        });
    },
    bindIsStayShow: function () {
        var _this = this;
        if (!_this.data.isStayShow) {
            _this.setData({
                isStayShow: true
            });
        }
    },
    bindStayClose: function () {
        var _this = this;
        if (_this.data.isStayShow) {
            _this.setData({
                isStayShow: false
            });
        }
    },
    bindStaySelect: function (e) {
        var _this = this;
        _this.setData({
            staykey: e.detail.value.key,
            stayValue: e.detail.value.name,
            isStayShow: false
        });
    },
    bindDeparturePopShow: function () {
        var _this = this;
        if (!_this.data.isDeparturePopShow) {
            _this.setData({
                isDeparturePopShow: true
            });
        }
    },
    bindDeparturePopClose: function () {
        var _this = this;
        if (_this.data.isDeparturePopShow) {
            _this.setData({
                isDeparturePopShow: false
            });
        }
    },
    bindDepartureSelect: function (e) {
        var _this = this;
        _this.setData({
            departurekey: e.detail.value.key,
            departurevalue: e.detail.value.name,
            isDeparturePopShow: false
        });
    },
    bindRegistrationPopShow: function () {
        var _this = this;
        if (!_this.data.isRegistrationPopShow) {
            _this.setData({
                isRegistrationPopShow: true
            });
        }
    },
    bindRegistrationPopClose: function () {
        var _this = this;
        if (_this.data.isRegistrationPopShow) {
            _this.setData({
                isRegistrationPopShow: false
            });
        }
    },
    bindRegistrationSelect: function (e) {
        var _this = this;
        _this.setData({
            registrationkey: e.detail.value.key,
            registrationvalue: e.detail.value.name,
            isRegistrationPopShow: false
        });
    },
    bindClzx: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../carapp/carType',
            events: {
                returncarTypeSelect: function (res) {
                    if (res) {
                        that.setData({
                            clxz: res.k,
                            clxzDesc: res.k + '-' + res.v
                        });
                    }
                }
            },
            success: function (res) {
                console.log(res);
            }
        });
    },
    bindUserSelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../../../pages/userSelect/userSelect?userInfo=' + userInput,
            events: {
                returnUserSelect: function (res) {
                    if (res) {
                        that.setData({
                            privatedriver: res.k + '-' + res.v,
                            privatedriverno: res.k
                        });
                    }
                }
            },
            success: function (res) {
                console.log(res);
            }
        });
    },
    bindPurpose: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../carapp/purpose',
            events: {
                returnPurposeSelect: function (res) {
                    if (res) {
                        that.setData({
                            purpose: res.k,
                            purposeDesc: res.k + '-' + res.v
                        });
                    }
                }
            },
            success: function (res) {
                console.log(res);
            }
        });
    },
    bindTelcontactChange: function (e) {
        this.setData({
            telcontact: e.detail
        });
    },
    bindPrivatecarnoChange: function (e) {
        this.setData({
            privatecarno: e.detail
        });
    },
    bindHmark1Change: function (e) {
        this.setData({
            hmark1: e.detail.value
        });
    },
    formSubmit: function (e) {
        var errmsg = '';
        if (this.data.clxzDesc == '') {
            errmsg += "请选择车辆性质\r\n";
        }
        if (this.data.privatedriver == '') {
            errmsg += "请选择驾驶员\r\n";
        }
        if (this.data.purposeDesc == '') {
            errmsg += "请选择用车原因\r\n";
        }
        if (this.data.departurevalue == '') {
            errmsg += "请选择始发地r\n";
        }
        if (this.data.registrationvalue == '') {
            errmsg += "请选择是否临时登记\r\n";
        }
        if (this.data.telcontact == '') {
            errmsg += "请输入联系方式\r\n";
        }
        if (errmsg != '') {
            wx.showModal({
                title: '系统提示',
                content: errmsg,
                showCancel: false
            });
            return;
        }
        var newObject = {
            clxz: this.data.clxz,
            clxzDesc: this.data.clxzDesc,
            privatedriver: this.data.privatedriver,
            privatedriverno: this.data.privatedriverno,
            privatecarno: this.data.privatecarno,
            telcontact: this.data.telcontact,
            purpose: this.data.purpose,
            purposeDesc: this.data.purposeDesc,
            hmark1: this.data.hmark1,
            staykey: this.data.staykey,
            stayValue: this.data.stayValue,
            departurekey: this.data.departurekey,
            departurevalue: this.data.departurevalue,
            registrationkey: this.data.registrationkey,
            registrationvalue: this.data.registrationvalue
        };
        eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('returnDetail', { data: newObject, isNew: false });
        wx.navigateBack({
            delta: 1
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FyYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLElBQUksWUFBWSxDQUFDO0FBRWpCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFVBQVUsRUFBRSxFQUFTO1FBQ3JCLElBQUksRUFBRSxHQUFHO1FBQ1QsUUFBUSxFQUFFLE9BQU87UUFDakIsYUFBYSxFQUFFLEVBQUU7UUFDakIsZUFBZSxFQUFDLEVBQUU7UUFDbEIsWUFBWSxFQUFFLEVBQUU7UUFDaEIsVUFBVSxFQUFFLEVBQUU7UUFDZCxPQUFPLEVBQUUsRUFBRTtRQUNYLFdBQVcsRUFBRSxFQUFFO1FBQ2YsTUFBTSxFQUFFLEVBQUU7UUFDVixVQUFVLEVBQUMsS0FBSztRQUNoQixPQUFPLEVBQUMsR0FBRztRQUNYLFNBQVMsRUFBQyxLQUFLO1FBQ2YsS0FBSyxFQUFDLENBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBQyxDQUFDO1FBQ2hELGtCQUFrQixFQUFDLEtBQUs7UUFDeEIsWUFBWSxFQUFDLEVBQUU7UUFDZixjQUFjLEVBQUMsRUFBRTtRQUNqQixjQUFjLEVBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLEVBQUMsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsRUFBQyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxFQUFDLEVBQUMsR0FBRyxFQUFD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QUMsSUFBSSxDQUFDLGVBQWU7WUFDekMsWUFBWSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUNuQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO1lBQ2hDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87WUFDMUIsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVztZQUNsQyxNQUFNLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQ3ZCLE9BQU8sRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87WUFDekIsU0FBUyxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztZQUM3QixZQUFZLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZO1lBQ25DLGNBQWMsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFDdkMsZUFBZSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZTtZQUN6QyxpQkFBaUIsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQjtTQUM5QyxDQUFBO1FBQ0QsWUFBWSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO1FBQzNDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQTtRQUNuRSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ2QsS0FBSyxFQUFFLENBQUM7U0FDVCxDQUFDLENBQUE7SUFDSixDQUFDO0NBRUYsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vLi4vYXBwJ1xyXG5cclxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxyXG5sZXQgdXNlcklucHV0ID0gJydcclxubGV0IGV2ZW50Q2hhbm5lbDtcclxuXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIGRldGFpbExpc3Q6IFtdIGFzIGFueSxcclxuICAgIGNseHo6ICcxJyxcclxuICAgIGNseHpEZXNjOiAnMS3lhazliqHovaYnLFxyXG4gICAgcHJpdmF0ZWRyaXZlcjogJycsXHJcbiAgICBwcml2YXRlZHJpdmVybm86JycsXHJcbiAgICBwcml2YXRlY2Fybm86ICcnLFxyXG4gICAgdGVsY29udGFjdDogJycsXHJcbiAgICBwdXJwb3NlOiAnJyxcclxuICAgIHB1cnBvc2VEZXNjOiAnJyxcclxuICAgIGhtYXJrMTogJycsXHJcbiAgICBpc1N0YXlTaG93OmZhbHNlLFxyXG4gICAgc3RheWtleTpcIjJcIixcclxuICAgIHN0YXlWYWx1ZTpcIuS4jeS9j+Wuv1wiLFxyXG4gICAgc3RheXM6W3trZXk6XCIxXCIsbmFtZTpcIuS9j+Wuv1wifSx7a2V5OlwiMlwiLG5hbWU6XCLkuI3kvY/lrr9cIn1dLFxyXG4gICAgaXNEZXBhcnR1cmVQb3BTaG93OmZhbHNlLFxyXG4gICAgZGVwYXJ0dXJla2V5OlwiXCIsXHJcbiAgICBkZXBhcnR1cmV2YWx1ZTpcIlwiLFxyXG4gICAgc3RheWRlcGFydHVyZXM6W3trZXk6XCIxXCIsbmFtZTpcIuaeq+azvuWOguWHuuWPkVwifSx7a2V5OlwiMlwiLG5hbWU6XCLlhbTloZTkuqflh7rlj5FcIn0se2tleTpcIjNcIixuYW1lOlwi5YiG5YWs5Y+45Ye65Y+RXCJ9LHtrZXk6XCI0XCIsbmFtZTpcIuaxieWjsOWOguWHuuWPkVwifSx7a2V5OlwiNVwiLG5hbWU6XCLmsYnmiazljoLlh7rlj5FcIn1dLFxyXG4gICAgaXNSZWdpc3RyYXRpb25Qb3BTaG93OmZhbHNlLFxyXG4gICAgcmVnaXN0cmF0aW9ua2V5OlwiMlwiLFxyXG4gICAgcmVnaXN0cmF0aW9udmFsdWU6XCLkuI3lip7nkIZcIixcclxuICAgIHJlZ2lzdHJhdGlvbnM6W3trZXk6XCIxXCIsbmFtZTpcIuWKnueQhlwifSx7a2V5OlwiMlwiLG5hbWU6XCLkuI3lip7nkIZcIn1dLFxyXG4gIH0sXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgdmFyIHRoYXQ9dGhpc1xyXG4gICAgZXZlbnRDaGFubmVsID0gdGhpcy5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxyXG4gICAgZXZlbnRDaGFubmVsLm9uKCdvcGVuRGV0YWlsJywgKHJlcykgPT4ge1xyXG4gICAgICBpZiAocmVzLmlzTmV3KSB7XHJcbiAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgIHByaXZhdGVkcml2ZXI6YXBwLmdsb2JhbERhdGEuZW1wbG95ZWVJZCsnLScrYXBwLmdsb2JhbERhdGEuZW1wbG95ZWVOYW1lLFxyXG4gICAgICAgICAgcHJpdmF0ZWRyaXZlcm5vOmFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWRcclxuICAgICAgICB9KVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgICBjbHh6OnJlcy5kYXRhLmNseHosXHJcbiAgICAgICAgICBjbHh6RGVzYzogcmVzLmRhdGEuY2x4ekRlc2MsXHJcbiAgICAgICAgICBwcml2YXRlZHJpdmVyOiByZXMuZGF0YS5wcml2YXRlZHJpdmVyLFxyXG4gICAgICAgICAgcHJpdmF0ZWRyaXZlcm5vOnJlcy5kYXRhLnByaXZhdGVkcml2ZXJubyxcclxuICAgICAgICAgIHByaXZhdGVjYXJubzpyZXMuZGF0YS5wcml2YXRlY2Fybm8sXHJcbiAgICAgICAgICB0ZWxjb250YWN0OiByZXMuZGF0YS50ZWxjb250YWN0LFxyXG4gICAgICAgICAgcHVycG9zZTogcmVzLmRhdGEucHVycG9zZSxcclxuICAgICAgICAgIHB1cnBvc2VEZXNjOiByZXMuZGF0YS5wdXJwb3NlRGVzYyxcclxuICAgICAgICAgIGhtYXJrMTpyZXMuZGF0YS5obWFyazEsXHJcbiAgICAgICAgICBzdGF5a2V5OnJlcy5kYXRhLnN0YXlrZXksXHJcbiAgICAgICAgICBzdGF5VmFsdWU6cmVzLmRhdGEuc3RheVZhbHVlLFxyXG4gICAgICAgICAgZGVwYXJ0dXJla2V5OnJlcy5kYXRhLmRlcGFydHVyZWtleSxcclxuICAgICAgICAgIGRlcGFydHVyZXZhbHVlOnJlcy5kYXRhLmRlcGFydHVyZXZhbHVlLFxyXG4gICAgICAgICAgcmVnaXN0cmF0aW9ua2V5OnJlcy5kYXRhLnJlZ2lzdHJhdGlvbmtleSxcclxuICAgICAgICAgIHJlZ2lzdHJhdGlvbnZhbHVlOnJlcy5kYXRhLnJlZ2lzdHJhdGlvbnZhbHVlXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRJc1N0YXlTaG93KCkge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGlmICghX3RoaXMuZGF0YS5pc1N0YXlTaG93KSB7XHJcbiAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgIGlzU3RheVNob3c6IHRydWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGJpbmRTdGF5Q2xvc2UoKXtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBpZiAoX3RoaXMuZGF0YS5pc1N0YXlTaG93KSB7XHJcbiAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgIGlzU3RheVNob3c6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBiaW5kU3RheVNlbGVjdChlKXtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgc3RheWtleTogZS5kZXRhaWwudmFsdWUua2V5LFxyXG4gICAgICBzdGF5VmFsdWU6IGUuZGV0YWlsLnZhbHVlLm5hbWUsXHJcbiAgICAgIGlzU3RheVNob3c6IGZhbHNlXHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZERlcGFydHVyZVBvcFNob3coKXtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICBpZiAoIV90aGlzLmRhdGEuaXNEZXBhcnR1cmVQb3BTaG93KSB7XHJcbiAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgIGlzRGVwYXJ0dXJlUG9wU2hvdzogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmluZERlcGFydHVyZVBvcENsb3NlKCl7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgaWYgKF90aGlzLmRhdGEuaXNEZXBhcnR1cmVQb3BTaG93KSB7XHJcbiAgICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICAgIGlzRGVwYXJ0dXJlUG9wU2hvdzogZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGJpbmREZXBhcnR1cmVTZWxlY3QoZSl7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgX3RoaXMuc2V0RGF0YSh7XHJcbiAgICAgIGRlcGFydHVyZWtleTogZS5kZXRhaWwudmFsdWUua2V5LFxyXG4gICAgICBkZXBhcnR1cmV2YWx1ZTogZS5kZXRhaWwudmFsdWUubmFtZSxcclxuICAgICAgaXNEZXBhcnR1cmVQb3BTaG93OiBmYWxzZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRSZWdpc3RyYXRpb25Qb3BTaG93KCl7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgaWYgKCFfdGhpcy5kYXRhLmlzUmVnaXN0cmF0aW9uUG9wU2hvdykge1xyXG4gICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICBpc1JlZ2lzdHJhdGlvblBvcFNob3c6IHRydWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIGJpbmRSZWdpc3RyYXRpb25Qb3BDbG9zZSgpe1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIGlmIChfdGhpcy5kYXRhLmlzUmVnaXN0cmF0aW9uUG9wU2hvdykge1xyXG4gICAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgICBpc1JlZ2lzdHJhdGlvblBvcFNob3c6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICBiaW5kUmVnaXN0cmF0aW9uU2VsZWN0KGUpe1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgIF90aGlzLnNldERhdGEoe1xyXG4gICAgICByZWdpc3RyYXRpb25rZXk6IGUuZGV0YWlsLnZhbHVlLmtleSxcclxuICAgICAgcmVnaXN0cmF0aW9udmFsdWU6IGUuZGV0YWlsLnZhbHVlLm5hbWUsXHJcbiAgICAgIGlzUmVnaXN0cmF0aW9uUG9wU2hvdzogZmFsc2VcclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kQ2x6eChlKSB7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICB1cmw6ICcuLi9jYXJhcHAvY2FyVHlwZScsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybmNhclR5cGVTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XHJcbiAgICAgICAgICAgICAgY2x4ejogcmVzLmssXHJcbiAgICAgICAgICAgICAgY2x4ekRlc2M6IHJlcy5rICsgJy0nICsgcmVzLnZcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZFVzZXJTZWxlY3QoZSkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vLi4vLi4vcGFnZXMvdXNlclNlbGVjdC91c2VyU2VsZWN0P3VzZXJJbmZvPScgKyB1c2VySW5wdXQsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVyblVzZXJTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgdGhhdC5zZXREYXRhISh7XHJcbiAgICAgICAgICAgICAgcHJpdmF0ZWRyaXZlcjogcmVzLmsgKyAnLScgKyByZXMudixcclxuICAgICAgICAgICAgICBwcml2YXRlZHJpdmVybm86cmVzLmtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICB9LFxyXG4gIGJpbmRQdXJwb3NlKGUpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4uL2NhcmFwcC9wdXJwb3NlJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuUHVycG9zZVNlbGVjdDogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgICAgICBwdXJwb3NlOiByZXMuayxcclxuICAgICAgICAgICAgICBwdXJwb3NlRGVzYzogcmVzLmsgKyAnLScgKyByZXMudlxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kVGVsY29udGFjdENoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICB0ZWxjb250YWN0OiBlLmRldGFpbFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBiaW5kUHJpdmF0ZWNhcm5vQ2hhbmdlKGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgIHByaXZhdGVjYXJubzogZS5kZXRhaWxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgYmluZEhtYXJrMUNoYW5nZShlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgaG1hcmsxOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGZvcm1TdWJtaXQoZSkge1xyXG4gICAgbGV0IGVycm1zZyA9ICcnXHJcbiAgICBpZiAodGhpcy5kYXRhLmNseHpEZXNjID09ICcnKSB7XHJcbiAgICAgIGVycm1zZyArPSBcIuivt+mAieaLqei9pui+huaAp+i0qFxcclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5kYXRhLnByaXZhdGVkcml2ZXIgPT0gJycpIHtcclxuICAgICAgZXJybXNnICs9IFwi6K+36YCJ5oup6am+6am25ZGYXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmRhdGEucHVycG9zZURlc2MgPT0gJycpIHtcclxuICAgICAgZXJybXNnICs9IFwi6K+36YCJ5oup55So6L2m5Y6f5ZugXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmRhdGEuZGVwYXJ0dXJldmFsdWUgPT0gJycpIHtcclxuICAgICAgZXJybXNnICs9IFwi6K+36YCJ5oup5aeL5Y+R5ZywclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5kYXRhLnJlZ2lzdHJhdGlvbnZhbHVlID09ICcnKSB7XHJcbiAgICAgIGVycm1zZyArPSBcIuivt+mAieaLqeaYr+WQpuS4tOaXtueZu+iusFxcclxcblwiXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5kYXRhLnRlbGNvbnRhY3QgPT0gJycpIHtcclxuICAgICAgZXJybXNnICs9IFwi6K+36L6T5YWl6IGU57O75pa55byPXFxyXFxuXCJcclxuICAgIH1cclxuICAgIGlmKGVycm1zZyE9Jycpe1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBlcnJtc2csXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgICByZXR1cm4gO1xyXG4gICAgfVxyXG4gICAgbGV0IG5ld09iamVjdCA9IHtcclxuICAgICAgY2x4ejp0aGlzLmRhdGEuY2x4eixcclxuICAgICAgY2x4ekRlc2M6IHRoaXMuZGF0YS5jbHh6RGVzYyxcclxuICAgICAgcHJpdmF0ZWRyaXZlcjogdGhpcy5kYXRhLnByaXZhdGVkcml2ZXIsXHJcbiAgICAgIHByaXZhdGVkcml2ZXJubzp0aGlzLmRhdGEucHJpdmF0ZWRyaXZlcm5vLFxyXG4gICAgICBwcml2YXRlY2Fybm86dGhpcy5kYXRhLnByaXZhdGVjYXJubyxcclxuICAgICAgdGVsY29udGFjdDogdGhpcy5kYXRhLnRlbGNvbnRhY3QsXHJcbiAgICAgIHB1cnBvc2U6IHRoaXMuZGF0YS5wdXJwb3NlLFxyXG4gICAgICBwdXJwb3NlRGVzYzogdGhpcy5kYXRhLnB1cnBvc2VEZXNjLFxyXG4gICAgICBobWFyazE6dGhpcy5kYXRhLmhtYXJrMSxcclxuICAgICAgc3RheWtleTp0aGlzLmRhdGEuc3RheWtleSxcclxuICAgICAgc3RheVZhbHVlOnRoaXMuZGF0YS5zdGF5VmFsdWUsXHJcbiAgICAgIGRlcGFydHVyZWtleTp0aGlzLmRhdGEuZGVwYXJ0dXJla2V5LFxyXG4gICAgICBkZXBhcnR1cmV2YWx1ZTp0aGlzLmRhdGEuZGVwYXJ0dXJldmFsdWUsXHJcbiAgICAgIHJlZ2lzdHJhdGlvbmtleTp0aGlzLmRhdGEucmVnaXN0cmF0aW9ua2V5LFxyXG4gICAgICByZWdpc3RyYXRpb252YWx1ZTp0aGlzLmRhdGEucmVnaXN0cmF0aW9udmFsdWVcclxuICAgIH1cclxuICAgIGV2ZW50Q2hhbm5lbCA9IHRoaXMuZ2V0T3BlbmVyRXZlbnRDaGFubmVsKClcclxuICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5EZXRhaWwnLCB7IGRhdGE6IG5ld09iamVjdCwgaXNOZXc6IGZhbHNlfSlcclxuICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgIGRlbHRhOiAxXHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG59KVxyXG4iXX0=