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
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/leavekind';
        console.log(restUrl);
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
    bindSelected: function (e) {
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
                        eventChannel.emit('returnLeaveKindSelect', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhdmVLaW5kU2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGVhdmVLaW5kU2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxPQUFlLENBQUM7QUFDcEIsSUFBSSxZQUFZLENBQUM7QUFDakIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osTUFBTSxFQUFFLENBQVc7UUFDbkIsUUFBUSxFQUFFLEVBQVk7UUFDdEIsUUFBUSxFQUFFLEVBQUU7UUFDWixXQUFXLEVBQUUsSUFBSTtRQUNqQixjQUFjLEVBQUUsRUFBRTtLQUNuQjtJQUNELE1BQU0sWUFBQyxNQUFNO1FBQ1gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0QsV0FBVyxZQUFDLE9BQWE7UUFBekIsaUJBc0JDO1FBckJDLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxpQ0FBaUMsQ0FBQTtRQUNwRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3BCLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDVCxHQUFHLEVBQUUsT0FBTztZQUNaLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO2dCQUM1QixLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTO2FBQ2hDO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ1YsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUk7aUJBQ25CLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbkIsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxZQUFZLFlBQUMsQ0FBQztRQUFkLGlCQTRCQztRQTNCQyxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUM1QixDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQ3pCLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7aUJBQ25DLENBQUMsQ0FBQTthQUNIO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzVCLElBQUksTUFBSSxHQUFHLElBQUksQ0FBQTtZQUNmLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE9BQU8sWUFBQyxHQUFHO29CQUNULElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTt3QkFDZixZQUFZLEdBQUcsTUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7d0JBQzNDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsTUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTt3QkFDcEUsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDZCxLQUFLLEVBQUUsQ0FBQzt5QkFDVCxDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IHJlc3RVcmw6IHN0cmluZztcclxubGV0IGV2ZW50Q2hhbm5lbDtcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgb2Zmc2V0OiAwIGFzIG51bWJlcixcclxuICAgIHBhZ2VTaXplOiAyMCBhcyBudW1iZXIsXHJcbiAgICBkYXRhTGlzdDogW10sXHJcbiAgICBzZWxlY3RlZEtleTogbnVsbCxcclxuICAgIHNlbGVjdGVkT2JqZWN0OiB7fVxyXG4gIH0sXHJcbiAgb25Mb2FkKG9wdGlvbikge1xyXG4gICAgdGhpcy5yZXF1ZXN0RGF0YShvcHRpb24pO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGEob3B0aW9ucz86IGFueSkge1xyXG4gICAgcmVzdFVybCA9IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtSlJTL2FwaS9lZmdwL2xlYXZla2luZCdcclxuICAgIGNvbnNvbGUubG9nKHJlc3RVcmwpXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH0sXHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGRhdGFMaXN0OiByZXMuZGF0YVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kU2VsZWN0ZWQoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNlbGVjdGVkS2V5OiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICAgIHRoaXMuZGF0YS5kYXRhTGlzdC5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgIGlmIChvLmsgPT0gZS5kZXRhaWwudmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIHNlbGVjdGVkT2JqZWN0OiB7IGs6IG8uaywgdjogby52IH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmRhdGEuc2VsZWN0ZWRPYmplY3QpXHJcbiAgICBpZiAodGhpcy5kYXRhLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICBjb250ZW50OiAn5bey6YCJ5oupLOaYr+WQpui/lOWbnicsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBldmVudENoYW5uZWwgPSB0aGF0LmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5MZWF2ZUtpbmRTZWxlY3QnLCB0aGF0LmRhdGEuc2VsZWN0ZWRPYmplY3QpXHJcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgZGVsdGE6IDFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=