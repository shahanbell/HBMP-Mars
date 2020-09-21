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
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/crmgg/f;/s/0/10';
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
                        eventChannel.emit('returnCustomerno', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXJuby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImN1c3RvbWVybm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUM1QixJQUFJLE9BQWUsQ0FBQztBQUNwQixJQUFJLFlBQVksQ0FBQztBQUNqQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsQ0FBVztRQUNuQixRQUFRLEVBQUUsRUFBWTtRQUN0QixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGNBQWMsRUFBRSxFQUFFO0tBQ25CO0lBQ0QsTUFBTSxZQUFDLE1BQU07UUFDWCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDRCxXQUFXLFlBQUMsT0FBYTtRQUF6QixpQkF1QkM7UUF0QkYsT0FBTyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLHNDQUFzQyxDQUFBO1FBRXRFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDcEIsRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNULEdBQUcsRUFBRSxPQUFPO1lBQ1osSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07Z0JBQzVCLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVM7YUFDaEM7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sY0FBYyxFQUFFLGtCQUFrQjthQUNuQztZQUNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUk7aUJBQ3hCLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbkIsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxZQUFZLFlBQUMsQ0FBQztRQUFkLGlCQTRCQztRQTNCQyxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUM1QixDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQ3pCLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7aUJBQ25DLENBQUMsQ0FBQTthQUNIO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzVCLElBQUksTUFBSSxHQUFHLElBQUksQ0FBQTtZQUNmLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE9BQU8sWUFBQyxHQUFHO29CQUNULElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTt3QkFDZixZQUFZLEdBQUcsTUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7d0JBQzNDLFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsTUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTt3QkFDL0QsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDZCxLQUFLLEVBQUUsQ0FBQzt5QkFDVCxDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IHJlc3RVcmw6IHN0cmluZztcclxubGV0IGV2ZW50Q2hhbm5lbDtcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgb2Zmc2V0OiAwIGFzIG51bWJlcixcclxuICAgIHBhZ2VTaXplOiAyMCBhcyBudW1iZXIsXHJcbiAgICBkYXRhTGlzdDogW10sXHJcbiAgICBzZWxlY3RlZEtleTogbnVsbCxcclxuICAgIHNlbGVjdGVkT2JqZWN0OiB7fVxyXG4gIH0sXHJcbiAgb25Mb2FkKG9wdGlvbikge1xyXG4gICAgdGhpcy5yZXF1ZXN0RGF0YShvcHRpb24pO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGEob3B0aW9ucz86IGFueSkge1xyXG5cdHJlc3RVcmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvY3JtL2NybWdnL2Y7L3MvMC8xMCdcclxuICAgIC8vcmVzdFVybCA9ICdodHRwOi8vMTcyLjE2LjgwLjk5Ojg0ODAvSGFuYmVsbC1KUlMvYXBpL2NybS9jcm1nZy9mOy9zLzAvMTAnXHJcbiAgICBjb25zb2xlLmxvZyhyZXN0VXJsKVxyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgIHVybDogcmVzdFVybCxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGFwcGlkOiBhcHAuZ2xvYmFsRGF0YS5yZXN0SWQsXHJcbiAgICAgICAgdG9rZW46IGFwcC5nbG9iYWxEYXRhLnJlc3RUb2tlblxyXG4gICAgICB9XHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGRhdGFMaXN0OiByZXMuZGF0YS5kYXRhXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRTZWxlY3RlZChlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgc2VsZWN0ZWRLZXk6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gICAgdGhpcy5kYXRhLmRhdGFMaXN0LmZvckVhY2goKG8sIGkpID0+IHtcclxuICAgICAgaWYgKG8uayA9PSBlLmRldGFpbC52YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgc2VsZWN0ZWRPYmplY3Q6IHsgazogby5rLCB2OiBvLnYgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuZGF0YS5zZWxlY3RlZE9iamVjdClcclxuICAgIGlmICh0aGlzLmRhdGEuc2VsZWN0ZWRPYmplY3QpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxyXG4gICAgICAgIGNvbnRlbnQ6ICflt7LpgInmi6ks5piv5ZCm6L+U5ZueJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbCA9IHRoYXQuZ2V0T3BlbmVyRXZlbnRDaGFubmVsKClcclxuICAgICAgICAgICAgZXZlbnRDaGFubmVsLmVtaXQoJ3JldHVybkN1c3RvbWVybm8nLCB0aGF0LmRhdGEuc2VsZWN0ZWRPYmplY3QpXHJcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XHJcbiAgICAgICAgICAgICAgZGVsdGE6IDFcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=