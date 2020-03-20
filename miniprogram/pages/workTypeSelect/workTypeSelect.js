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
        this.requestData(option);
    },
    requestData: function (options) {
        var _this = this;
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/worktype';
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
            if (o.k == e.detail.value) {
                _this.setData({
                    selectedObject: { k: o.k, v: o.v }
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
                        eventChannel.emit('returnWorkTypeSelect', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya1R5cGVTZWxlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3b3JrVHlwZVNlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksT0FBZSxDQUFDO0FBQ3BCLElBQUksWUFBWSxDQUFDO0FBQ2pCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLE1BQU0sRUFBRSxDQUFXO1FBQ25CLFFBQVEsRUFBRSxFQUFZO1FBQ3RCLFFBQVEsRUFBRSxFQUFFO1FBQ1osV0FBVyxFQUFFLElBQUk7UUFDakIsY0FBYyxFQUFFLEVBQUU7S0FDbkI7SUFDRCxNQUFNLFlBQUMsTUFBTTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNELFdBQVcsWUFBQyxPQUFhO1FBQXpCLGlCQXNCQztRQXJCQyxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsZ0NBQWdDLENBQUE7UUFFbkUsRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNULEdBQUcsRUFBRSxPQUFPO1lBQ1osSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07Z0JBQzVCLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVM7YUFDaEM7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sY0FBYyxFQUFFLGtCQUFrQjthQUNuQztZQUNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSTtpQkFDbkIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNELElBQUksRUFBRSxVQUFBLElBQUk7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNuQixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELGdCQUFnQixZQUFDLENBQUM7UUFBbEIsaUJBNEJDO1FBM0JDLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixXQUFXLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQzVCLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDekIsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDbkMsQ0FBQyxDQUFBO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDNUIsSUFBSSxNQUFJLEdBQUcsSUFBSSxDQUFBO1lBQ2YsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxLQUFLLEVBQUUsTUFBTTtnQkFDYixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsT0FBTyxZQUFDLEdBQUc7b0JBQ1QsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO3dCQUNmLFlBQVksR0FBRyxNQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTt3QkFDM0MsWUFBWSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxNQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3dCQUNuRSxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUNkLEtBQUssRUFBRSxDQUFDO3lCQUNULENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xyXG5cclxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxyXG5sZXQgcmVzdFVybDogc3RyaW5nO1xyXG5sZXQgZXZlbnRDaGFubmVsO1xyXG5QYWdlKHtcclxuICBkYXRhOiB7XHJcbiAgICBvZmZzZXQ6IDAgYXMgbnVtYmVyLFxyXG4gICAgcGFnZVNpemU6IDIwIGFzIG51bWJlcixcclxuICAgIGRhdGFMaXN0OiBbXSxcclxuICAgIHNlbGVjdGVkS2V5OiBudWxsLFxyXG4gICAgc2VsZWN0ZWRPYmplY3Q6IHt9XHJcbiAgfSxcclxuICBvbkxvYWQob3B0aW9uKSB7XHJcbiAgICB0aGlzLnJlcXVlc3REYXRhKG9wdGlvbik7XHJcbiAgfSxcclxuICByZXF1ZXN0RGF0YShvcHRpb25zPzogYW55KSB7XHJcbiAgICByZXN0VXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2VmZ3Avd29ya3R5cGUnXHJcbiAgICAvL2NvbnNvbGUubG9nKHJlc3RVcmwpXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH1cclxuICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgZGF0YUxpc3Q6IHJlcy5kYXRhXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmREZXB0U2VsZWN0ZWQoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNlbGVjdGVkS2V5OiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICAgIHRoaXMuZGF0YS5kYXRhTGlzdC5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgIGlmIChvLmsgPT0gZS5kZXRhaWwudmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIHNlbGVjdGVkT2JqZWN0OiB7IGs6IG8uaywgdjogby52IH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmRhdGEuc2VsZWN0ZWRPYmplY3QpXHJcbiAgICBpZiAodGhpcy5kYXRhLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICBjb250ZW50OiAn5bey6YCJ5oupLOaYr+WQpui/lOWbnicsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBldmVudENoYW5uZWwgPSB0aGF0LmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5Xb3JrVHlwZVNlbGVjdCcsIHRoYXQuZGF0YS5zZWxlY3RlZE9iamVjdClcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==