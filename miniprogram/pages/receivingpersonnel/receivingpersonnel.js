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
                        eventChannel.emit('returnreceivingpersonnel', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjZWl2aW5ncGVyc29ubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVjZWl2aW5ncGVyc29ubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFDNUIsSUFBSSxPQUFlLENBQUM7QUFDcEIsSUFBSSxZQUFZLENBQUM7QUFDakIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osTUFBTSxFQUFFLENBQVc7UUFDbkIsUUFBUSxFQUFFLEVBQVk7UUFDdEIsUUFBUSxFQUFFLEVBQUU7UUFDWixXQUFXLEVBQUUsSUFBSTtRQUNqQixjQUFjLEVBQUUsRUFBRTtLQUNuQjtJQUNELE1BQU0sWUFBQyxNQUFNO1FBQ1gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0QsV0FBVyxZQUFDLE9BQWE7UUFBekIsaUJBc0JDO1FBckJDLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxnQ0FBZ0MsQ0FBQTtRQUVuRSxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ1QsR0FBRyxFQUFFLE9BQU87WUFDWixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTtnQkFDNUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUzthQUNoQztZQUNELE1BQU0sRUFBRTtnQkFDTixjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNWLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJO2lCQUNuQixDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsSUFBSSxFQUFFLFVBQUEsSUFBSTtnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ25CLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsZ0JBQWdCLFlBQUMsQ0FBQztRQUFsQixpQkE0QkM7UUEzQkMsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNaLFdBQVcsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDNUIsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUN6QixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUNuQyxDQUFDLENBQUE7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUM1QixJQUFJLE1BQUksR0FBRyxJQUFJLENBQUE7WUFDZixFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxNQUFNO2dCQUNiLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixPQUFPLFlBQUMsR0FBRztvQkFDVCxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7d0JBQ2YsWUFBWSxHQUFHLE1BQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO3dCQUMzQyxZQUFZLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLE1BQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7d0JBQ3ZFLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQ2QsS0FBSyxFQUFFLENBQUM7eUJBQ1QsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXHJcblxyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcbmxldCByZXN0VXJsOiBzdHJpbmc7XHJcbmxldCBldmVudENoYW5uZWw7XHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIG9mZnNldDogMCBhcyBudW1iZXIsXHJcbiAgICBwYWdlU2l6ZTogMjAgYXMgbnVtYmVyLFxyXG4gICAgZGF0YUxpc3Q6IFtdLFxyXG4gICAgc2VsZWN0ZWRLZXk6IG51bGwsXHJcbiAgICBzZWxlY3RlZE9iamVjdDoge31cclxuICB9LFxyXG4gIG9uTG9hZChvcHRpb24pIHtcclxuICAgIHRoaXMucmVxdWVzdERhdGEob3B0aW9uKTtcclxuICB9LFxyXG4gIHJlcXVlc3REYXRhKG9wdGlvbnM/OiBhbnkpIHtcclxuICAgIHJlc3RVcmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvZWZncC93b3JrdHlwZSdcclxuICAgIC8vY29uc29sZS5sb2cocmVzdFVybClcclxuICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IHJlc3RVcmwsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBhcHBpZDogYXBwLmdsb2JhbERhdGEucmVzdElkLFxyXG4gICAgICAgIHRva2VuOiBhcHAuZ2xvYmFsRGF0YS5yZXN0VG9rZW5cclxuICAgICAgfVxyXG4gICAgICBoZWFkZXI6IHtcclxuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBkYXRhTGlzdDogcmVzLmRhdGFcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG4gICAgICBmYWlsOiBmYWlsID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZERlcHRTZWxlY3RlZChlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgc2VsZWN0ZWRLZXk6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gICAgdGhpcy5kYXRhLmRhdGFMaXN0LmZvckVhY2goKG8sIGkpID0+IHtcclxuICAgICAgaWYgKG8uayA9PSBlLmRldGFpbC52YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgc2VsZWN0ZWRPYmplY3Q6IHsgazogby5rLCB2OiBvLnYgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuZGF0YS5zZWxlY3RlZE9iamVjdClcclxuICAgIGlmICh0aGlzLmRhdGEuc2VsZWN0ZWRPYmplY3QpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxyXG4gICAgICAgIGNvbnRlbnQ6ICflt7LpgInmi6ks5piv5ZCm6L+U5ZueJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbCA9IHRoYXQuZ2V0T3BlbmVyRXZlbnRDaGFubmVsKClcclxuICAgICAgICAgICAgZXZlbnRDaGFubmVsLmVtaXQoJ3JldHVybnJlY2VpdmluZ3BlcnNvbm5lbCcsIHRoYXQuZGF0YS5zZWxlY3RlZE9iamVjdClcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==