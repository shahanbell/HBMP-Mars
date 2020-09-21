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
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repmq/f;mq003=a1/s/0/10';
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
                    dataList: res.data.data
                });
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    },
    bindSelected: function (e) {
        var _this = this;
        console.log(e);
        this.setData({
            selectedKey: e.detail.value
        });
        this.data.dataList.forEach(function (o, i) {
            console.log(o);
            if (o.mq001 == e.detail.value) {
                _this.setData({
                    selectedObject: { k: o.mq001, v: o.mq002 }
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
                        eventChannel.emit('returnRepairKind', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwYWlyS2luZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcGFpcktpbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUM1QixJQUFJLE9BQWUsQ0FBQztBQUNwQixJQUFJLFlBQVksQ0FBQztBQUNqQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsQ0FBVztRQUNuQixRQUFRLEVBQUUsRUFBWTtRQUN0QixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGNBQWMsRUFBRSxFQUFFO0tBQ25CO0lBQ0QsTUFBTSxZQUFDLE1BQU07UUFDWCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDRCxXQUFXLFlBQUMsT0FBYTtRQUF6QixpQkFzQkM7UUFyQkMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLDhDQUE4QyxDQUFBO1FBQ2pGLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDVCxHQUFHLEVBQUUsT0FBTztZQUNaLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO2dCQUM1QixLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTO2FBQ2hDO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBRVYsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJO2lCQUN4QixDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsSUFBSSxFQUFFLFVBQUEsSUFBSTtnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ25CLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsWUFBWSxZQUFDLENBQUM7UUFBZCxpQkE4QkM7UUE3QkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixXQUFXLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQzVCLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDZCxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQzdCLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUU7aUJBQzNDLENBQUMsQ0FBQTthQUNIO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzVCLElBQUksTUFBSSxHQUFHLElBQUksQ0FBQTtZQUNmLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE9BQU8sWUFBQyxHQUFHO29CQUNULElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTt3QkFDZixZQUFZLEdBQUcsTUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7d0JBQzNDLFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsTUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTt3QkFDL0QsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDZCxLQUFLLEVBQUUsQ0FBQzt5QkFDVCxDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IHJlc3RVcmw6IHN0cmluZztcclxubGV0IGV2ZW50Q2hhbm5lbDtcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgb2Zmc2V0OiAwIGFzIG51bWJlcixcclxuICAgIHBhZ2VTaXplOiAyMCBhcyBudW1iZXIsXHJcbiAgICBkYXRhTGlzdDogW10sXHJcbiAgICBzZWxlY3RlZEtleTogbnVsbCxcclxuICAgIHNlbGVjdGVkT2JqZWN0OiB7fVxyXG4gIH0sXHJcbiAgb25Mb2FkKG9wdGlvbikge1xyXG4gICAgdGhpcy5yZXF1ZXN0RGF0YShvcHRpb24pO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGEob3B0aW9ucz86IGFueSkge1xyXG4gICAgcmVzdFVybCA9IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKyAnL0hhbmJlbGwtSlJTL2FwaS9jcm0vcmVwbXEvZjttcTAwMz1hMS9zLzAvMTAnXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH1cclxuICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGRhdGFMaXN0OiByZXMuZGF0YS5kYXRhXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRTZWxlY3RlZChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNlbGVjdGVkS2V5OiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICAgIHRoaXMuZGF0YS5kYXRhTGlzdC5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKG8pXHJcbiAgICAgIGlmIChvLm1xMDAxID09IGUuZGV0YWlsLnZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBzZWxlY3RlZE9iamVjdDogeyBrOiBvLm1xMDAxLCB2OiBvLm1xMDAyIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmRhdGEuc2VsZWN0ZWRPYmplY3QpXHJcbiAgICBpZiAodGhpcy5kYXRhLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICBjb250ZW50OiAn5bey6YCJ5oupLOaYr+WQpui/lOWbnicsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBldmVudENoYW5uZWwgPSB0aGF0LmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5SZXBhaXJLaW5kJywgdGhhdC5kYXRhLnNlbGVjdGVkT2JqZWN0KVxyXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19