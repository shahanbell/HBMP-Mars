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
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repma/f;/s/0/100';
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
        console.log(e);
        this.setData({
            selectedKey: e.detail.value
        });
        this.data.dataList.forEach(function (o, i) {
            if (o.ma001 == e.detail.value) {
                _this.setData({
                    selectedObject: { k: o.ma001, v: o.ma002 }
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
                        console.log(that_1.data.selectedObject);
                        eventChannel.emit('returnStation', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGlvbktpbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aW9uS2luZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksT0FBZSxDQUFDO0FBQ3BCLElBQUksWUFBWSxDQUFDO0FBQ2pCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLE1BQU0sRUFBRSxDQUFXO1FBQ25CLFFBQVEsRUFBRSxFQUFZO1FBQ3RCLFFBQVEsRUFBRSxFQUFFO1FBQ1osV0FBVyxFQUFFLElBQUk7UUFDakIsY0FBYyxFQUFFLEVBQUU7S0FDbkI7SUFDRCxNQUFNLFlBQUMsTUFBTTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNELFdBQVcsWUFBQyxPQUFhO1FBQXpCLGlCQXdCQztRQXZCQyxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUUsdUNBQXVDLENBQUE7UUFFekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNwQixFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ1QsR0FBRyxFQUFFLE9BQU87WUFDWixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTtnQkFDNUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUzthQUNoQztZQUNELE1BQU0sRUFBRTtnQkFDTixjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUVWLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSTtpQkFDeEIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNELElBQUksRUFBRSxVQUFBLElBQUk7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNuQixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFlBQVksWUFBQyxDQUFDO1FBQWQsaUJBK0JDO1FBOUJDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZCxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUM1QixDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztZQUU5QixJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQzdCLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUU7aUJBQzNDLENBQUMsQ0FBQTthQUNIO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzVCLElBQUksTUFBSSxHQUFHLElBQUksQ0FBQTtZQUNmLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE9BQU8sWUFBQyxHQUFHO29CQUNULElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTt3QkFDZixZQUFZLEdBQUcsTUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7d0JBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTt3QkFDckMsWUFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTt3QkFDNUQsRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDZCxLQUFLLEVBQUUsQ0FBQzt5QkFDVCxDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IHJlc3RVcmw6IHN0cmluZztcclxubGV0IGV2ZW50Q2hhbm5lbDtcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgb2Zmc2V0OiAwIGFzIG51bWJlcixcclxuICAgIHBhZ2VTaXplOiAyMCBhcyBudW1iZXIsXHJcbiAgICBkYXRhTGlzdDogW10sXHJcbiAgICBzZWxlY3RlZEtleTogbnVsbCxcclxuICAgIHNlbGVjdGVkT2JqZWN0OiB7fVxyXG4gIH0sXHJcbiAgb25Mb2FkKG9wdGlvbikge1xyXG4gICAgdGhpcy5yZXF1ZXN0RGF0YShvcHRpb24pO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGEob3B0aW9ucz86IGFueSkge1xyXG4gICAgcmVzdFVybCA9IGFwcC5nbG9iYWxEYXRhLnJlc3RBZGQgKycvSGFuYmVsbC1KUlMvYXBpL2NybS9yZXBtYS9mOy9zLzAvMTAwJ1xyXG4gICAgLy9yZXN0VXJsID0gJ2h0dHA6Ly8xNzIuMTYuODAuOTk6ODQ4MC9IYW5iZWxsLUpSUy9hcGkvY3JtL3JlcG1hL2Y7L3MvMC8yMCdcclxuICAgIGNvbnNvbGUubG9nKHJlc3RVcmwpXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH1cclxuICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG5cclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGRhdGFMaXN0OiByZXMuZGF0YS5kYXRhXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRTZWxlY3RlZChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNlbGVjdGVkS2V5OiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICAgIHRoaXMuZGF0YS5kYXRhTGlzdC5mb3JFYWNoKChvLCBpKSA9PiB7XHJcblxyXG4gICAgICBpZiAoby5tYTAwMSA9PSBlLmRldGFpbC52YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgc2VsZWN0ZWRPYmplY3Q6IHsgazogby5tYTAwMSwgdjogby5tYTAwMiB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8vY29uc29sZS5sb2codGhpcy5kYXRhLnNlbGVjdGVkT2JqZWN0KVxyXG4gICAgaWYgKHRoaXMuZGF0YS5zZWxlY3RlZE9iamVjdCkge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+a2iOaBrycsXHJcbiAgICAgICAgY29udGVudDogJ+W3sumAieaLqSzmmK/lkKbov5Tlm54nLFxyXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgZXZlbnRDaGFubmVsID0gdGhhdC5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGF0LmRhdGEuc2VsZWN0ZWRPYmplY3QpXHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5TdGF0aW9uJywgdGhhdC5kYXRhLnNlbGVjdGVkT2JqZWN0KVxyXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19