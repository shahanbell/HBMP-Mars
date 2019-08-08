"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var restUrl;
var eventChannel;
Page({
    data: {
        offset: 0,
        pageSize: 20,
        dataList: [],
        selectedKey: null,
        selectedObject: {}
    },
    onLoad: function (option) {
        this.requestDeptSelect(option);
    },
    requestDeptSelect: function (options) {
        var _this = this;
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/functions';
        if (options.employeeid) {
            restUrl += '/f;users.id=' + options.employeeid + '/s';
        }
        else {
            restUrl += '/f/s';
        }
        restUrl += '/' + this.data.offset + '/' + this.data.pageSize;
        wx.request({
            url: restUrl,
            data: {
                appid: app.globalData.restId,
                token: app.globalData.restToken
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                _this.setData({
                    dataList: res.data
                });
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    },
    bindDeptSelected: function (e) {
        var _this = this;
        this.setData({
            selectedKey: e.detail.value
        });
        this.data.dataList.forEach(function (o, i) {
            if (o.organizationUnit.id == e.detail.value) {
                _this.setData({
                    selectedObject: { k: o.organizationUnit.id, v: o.organizationUnit.organizationUnitName }
                });
            }
        });
        if (this.data.selectedObject) {
            var that_1 = this;
            wx.showModal({
                title: '系统消息',
                content: '已选择,是否返回',
                success: function (res) {
                    if (res.confirm) {
                        eventChannel = that_1.getOpenerEventChannel();
                        eventChannel.emit('returnDeptSelect', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwdFNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcHRTZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUU1QixJQUFJLE9BQWUsQ0FBQztBQUNwQixJQUFJLFlBQVksQ0FBQztBQUVqQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsQ0FBVztRQUNuQixRQUFRLEVBQUUsRUFBWTtRQUN0QixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGNBQWMsRUFBRSxFQUFFO0tBQ25CO0lBQ0QsTUFBTSxZQUFDLE1BQU07UUFDWCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELGlCQUFpQixZQUFDLE9BQWE7UUFBL0IsaUJBMkJDO1FBMUJDLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxpQ0FBaUMsQ0FBQTtRQUNwRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsT0FBTyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtTQUN0RDthQUFNO1lBQ0wsT0FBTyxJQUFJLE1BQU0sQ0FBQTtTQUNsQjtRQUNELE9BQU8sSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQzVELEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDVCxHQUFHLEVBQUUsT0FBTztZQUNaLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO2dCQUM1QixLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTO2FBQ2hDO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ1YsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUk7aUJBQ25CLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbkIsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxnQkFBZ0IsWUFBQyxDQUFDO1FBQWxCLGlCQTRCQztRQTNCQyxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUM1QixDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRTtpQkFDekYsQ0FBQyxDQUFBO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDNUIsSUFBSSxNQUFJLEdBQUcsSUFBSSxDQUFBO1lBQ2YsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxLQUFLLEVBQUUsTUFBTTtnQkFDYixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsT0FBTyxZQUFDLEdBQUc7b0JBQ1QsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO3dCQUNmLFlBQVksR0FBRyxNQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTt3QkFDM0MsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3dCQUMvRCxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUNkLEtBQUssRUFBRSxDQUFDO3lCQUNULENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXG5cbmxldCByZXN0VXJsOiBzdHJpbmc7XG5sZXQgZXZlbnRDaGFubmVsO1xuXG5QYWdlKHtcbiAgZGF0YToge1xuICAgIG9mZnNldDogMCBhcyBudW1iZXIsXG4gICAgcGFnZVNpemU6IDIwIGFzIG51bWJlcixcbiAgICBkYXRhTGlzdDogW10sXG4gICAgc2VsZWN0ZWRLZXk6IG51bGwsXG4gICAgc2VsZWN0ZWRPYmplY3Q6IHt9XG4gIH0sXG4gIG9uTG9hZChvcHRpb24pIHtcbiAgICB0aGlzLnJlcXVlc3REZXB0U2VsZWN0KG9wdGlvbik7XG4gIH0sXG4gIHJlcXVlc3REZXB0U2VsZWN0KG9wdGlvbnM/OiBhbnkpIHtcbiAgICByZXN0VXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2VmZ3AvZnVuY3Rpb25zJ1xuICAgIGlmIChvcHRpb25zLmVtcGxveWVlaWQpIHtcbiAgICAgIHJlc3RVcmwgKz0gJy9mO3VzZXJzLmlkPScgKyBvcHRpb25zLmVtcGxveWVlaWQgKyAnL3MnXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3RVcmwgKz0gJy9mL3MnXG4gICAgfVxuICAgIHJlc3RVcmwgKz0gJy8nICsgdGhpcy5kYXRhLm9mZnNldCArICcvJyArIHRoaXMuZGF0YS5wYWdlU2l6ZVxuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiByZXN0VXJsLFxuICAgICAgZGF0YToge1xuICAgICAgICBhcHBpZDogYXBwLmdsb2JhbERhdGEucmVzdElkLFxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXG4gICAgICB9XG4gICAgICBoZWFkZXI6IHtcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBkYXRhTGlzdDogcmVzLmRhdGFcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBmYWlsOiBmYWlsID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBiaW5kRGVwdFNlbGVjdGVkKGUpIHtcbiAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgIHNlbGVjdGVkS2V5OiBlLmRldGFpbC52YWx1ZVxuICAgIH0pXG4gICAgdGhpcy5kYXRhLmRhdGFMaXN0LmZvckVhY2goKG8sIGkpID0+IHtcbiAgICAgIGlmIChvLm9yZ2FuaXphdGlvblVuaXQuaWQgPT0gZS5kZXRhaWwudmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgc2VsZWN0ZWRPYmplY3Q6IHsgazogby5vcmdhbml6YXRpb25Vbml0LmlkLCB2OiBvLm9yZ2FuaXphdGlvblVuaXQub3JnYW5pemF0aW9uVW5pdE5hbWUgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmRhdGEuc2VsZWN0ZWRPYmplY3QpXG4gICAgaWYgKHRoaXMuZGF0YS5zZWxlY3RlZE9iamVjdCkge1xuICAgICAgbGV0IHRoYXQgPSB0aGlzXG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogJ+ezu+e7n+a2iOaBrycsXG4gICAgICAgIGNvbnRlbnQ6ICflt7LpgInmi6ks5piv5ZCm6L+U5ZueJyxcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbCA9IHRoYXQuZ2V0T3BlbmVyRXZlbnRDaGFubmVsKClcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5EZXB0U2VsZWN0JywgdGhhdC5kYXRhLnNlbGVjdGVkT2JqZWN0KVxuICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgICAgICAgZGVsdGE6IDFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufSlcbiJdfQ==