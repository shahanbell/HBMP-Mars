"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var eventChannel;
Page({
    data: {
        offset: 0,
        pageSize: 20,
        dataList: [],
        selectedKey: null,
        selectedObject: {},
        keyword: '',
        eventName: '',
        showWin: '',
        loadingHidden: false,
        url: '',
    },
    onLoad: function () {
        this.requestdata();
    },
    requestdata: function (options) {
        var _this = this;
        wx.request({
            url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/repmi/productQuality?searchWord=' + this.data.keyword,
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
                    dataList: res.data.data,
                    loadingHidden: true,
                });
            },
            fail: function (fail) {
                console.log("JSON==" + JSON.stringify(fail));
            }
        });
    },
    sltwordInput: function (e) {
        this.setData({
            keyword: e.detail.value
        });
    },
    budDataQuery: function () {
        this.setData({
            loadingHidden: false,
        });
        var word = this.data.keyword;
        this.requestdata({ 'keyword': word });
    },
    bindDataSelected: function (e) {
        var _this = this;
        console.log(e);
        this.setData({
            selectedKey: e.detail.value
        });
        this.data.dataList.forEach(function (o, i) {
            if (o.key == e.detail.value) {
                _this.setData({
                    selectedObject: o
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
                        eventChannel.emit('returnProductQualitySelect', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdFF1YWxpdHlTZWxlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9kdWN0UXVhbGl0eVNlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBRTVCLElBQUksWUFBWSxDQUFDO0FBRWpCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLE1BQU0sRUFBRSxDQUFXO1FBQ25CLFFBQVEsRUFBRSxFQUFZO1FBQ3RCLFFBQVEsRUFBRSxFQUFFO1FBQ1osV0FBVyxFQUFFLElBQUk7UUFDakIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsT0FBTyxFQUFFLEVBQUU7UUFDWCxTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRSxFQUFFO1FBQ1gsYUFBYSxFQUFFLEtBQUs7UUFDcEIsR0FBRyxFQUFFLEVBQUU7S0FDUjtJQUNELE1BQU07UUFDSixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUNELFdBQVcsWUFBQyxPQUFhO1FBQXpCLGlCQXFCQztRQXBCQyxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ1QsR0FBRyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLHVEQUF1RCxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztZQUN6RyxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTtnQkFDNUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUzthQUNoQztZQUNELE1BQU0sRUFBRTtnQkFDTixjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNWLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSTtvQkFDdkIsYUFBYSxFQUFFLElBQUk7aUJBQ3BCLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUM5QyxDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFlBQVksWUFBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNaLE9BQU8sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDeEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFlBQVk7UUFDVixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osYUFBYSxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxnQkFBZ0IsWUFBQyxDQUFDO1FBQWxCLGlCQTRCQztRQTNCQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNaLFdBQVcsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDNUIsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUMzQixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLGNBQWMsRUFBRSxDQUFDO2lCQUNsQixDQUFDLENBQUE7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUM1QixJQUFJLE1BQUksR0FBRyxJQUFJLENBQUE7WUFDZixFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixPQUFPLFlBQUMsR0FBRztvQkFDVCxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7d0JBQ2YsWUFBWSxHQUFHLE1BQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO3dCQUMzQyxZQUFZLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLE1BQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7d0JBQ3pFLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQ2QsS0FBSyxFQUFFLENBQUM7eUJBQ1QsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXHJcblxyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcblxyXG5sZXQgZXZlbnRDaGFubmVsO1xyXG5cclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgb2Zmc2V0OiAwIGFzIG51bWJlcixcclxuICAgIHBhZ2VTaXplOiAyMCBhcyBudW1iZXIsXHJcbiAgICBkYXRhTGlzdDogW10sXHJcbiAgICBzZWxlY3RlZEtleTogbnVsbCxcclxuICAgIHNlbGVjdGVkT2JqZWN0OiB7fSxcclxuICAgIGtleXdvcmQ6ICcnLFxyXG4gICAgZXZlbnROYW1lOiAnJyxcclxuICAgIHNob3dXaW46ICcnLFxyXG4gICAgbG9hZGluZ0hpZGRlbjogZmFsc2UsXHJcbiAgICB1cmw6ICcnLFxyXG4gIH0sXHJcbiAgb25Mb2FkKCkge1xyXG4gICAgdGhpcy5yZXF1ZXN0ZGF0YSgpO1xyXG4gIH0sXHJcbiAgcmVxdWVzdGRhdGEob3B0aW9ucz86IGFueSkge1xyXG4gICAgd3gucmVxdWVzdCh7XHJcbiAgICAgIHVybDogYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2NybS9yZXBtaS9wcm9kdWN0UXVhbGl0eT9zZWFyY2hXb3JkPScgKyB0aGlzLmRhdGEua2V5d29yZCxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGFwcGlkOiBhcHAuZ2xvYmFsRGF0YS5yZXN0SWQsXHJcbiAgICAgICAgdG9rZW46IGFwcC5nbG9iYWxEYXRhLnJlc3RUb2tlblxyXG4gICAgICB9LFxyXG4gICAgICBoZWFkZXI6IHtcclxuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBkYXRhTGlzdDogcmVzLmRhdGEuZGF0YSxcclxuICAgICAgICAgIGxvYWRpbmdIaWRkZW46IHRydWUsXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJKU09OPT1cIiArIEpTT04uc3RyaW5naWZ5KGZhaWwpKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgc2x0d29yZElucHV0KGUpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBrZXl3b3JkOiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJ1ZERhdGFRdWVyeSgpIHtcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBsb2FkaW5nSGlkZGVuOiBmYWxzZSxcclxuICAgIH0pXHJcbiAgICBsZXQgd29yZCA9IHRoaXMuZGF0YS5rZXl3b3JkO1xyXG4gICAgdGhpcy5yZXF1ZXN0ZGF0YSh7ICdrZXl3b3JkJzogd29yZCB9KTtcclxuICB9LFxyXG5cclxuICBiaW5kRGF0YVNlbGVjdGVkKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgc2VsZWN0ZWRLZXk6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gICAgdGhpcy5kYXRhLmRhdGFMaXN0LmZvckVhY2goKG8sIGkpID0+IHtcclxuICAgICAgaWYgKG8ua2V5ID09IGUuZGV0YWlsLnZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBzZWxlY3RlZE9iamVjdDogb1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICBpZiAodGhpcy5kYXRhLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICBjb250ZW50OiAn5bey6YCJ5oupLOaYr+WQpui/lOWbnicsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBldmVudENoYW5uZWwgPSB0aGF0LmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5Qcm9kdWN0UXVhbGl0eVNlbGVjdCcsIHRoYXQuZGF0YS5zZWxlY3RlZE9iamVjdClcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==