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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya1R5cGVTZWxlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3b3JrVHlwZVNlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksT0FBZSxDQUFDO0FBQ3BCLElBQUksWUFBWSxDQUFDO0FBQ2pCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLE1BQU0sRUFBRSxDQUFXO1FBQ25CLFFBQVEsRUFBRSxFQUFZO1FBQ3RCLFFBQVEsRUFBRSxFQUFFO1FBQ1osV0FBVyxFQUFFLElBQUk7UUFDakIsY0FBYyxFQUFFLEVBQUU7S0FDbkI7SUFDRCxNQUFNLFlBQUMsTUFBTTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNELFdBQVcsWUFBQyxPQUFhO1FBQXpCLGlCQXNCQztRQXJCQyxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsZ0NBQWdDLENBQUE7UUFFbkUsRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNULEdBQUcsRUFBRSxPQUFPO1lBQ1osSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07Z0JBQzVCLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVM7YUFDaEM7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sY0FBYyxFQUFFLGtCQUFrQjthQUNuQztZQUNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDVixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSTtpQkFDbkIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNELElBQUksRUFBRSxVQUFBLElBQUk7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNuQixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELGdCQUFnQixZQUFDLENBQUM7UUFBbEIsaUJBNEJDO1FBM0JDLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixXQUFXLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQzVCLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDekIsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDbkMsQ0FBQyxDQUFBO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDNUIsSUFBSSxNQUFJLEdBQUcsSUFBSSxDQUFBO1lBQ2YsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxLQUFLLEVBQUUsTUFBTTtnQkFDYixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsT0FBTyxZQUFDLEdBQUc7b0JBQ1QsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO3dCQUNmLFlBQVksR0FBRyxNQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTt3QkFDM0MsWUFBWSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxNQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3dCQUNuRSxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUNkLEtBQUssRUFBRSxDQUFDO3lCQUNULENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXG5sZXQgcmVzdFVybDogc3RyaW5nO1xubGV0IGV2ZW50Q2hhbm5lbDtcblBhZ2Uoe1xuICBkYXRhOiB7XG4gICAgb2Zmc2V0OiAwIGFzIG51bWJlcixcbiAgICBwYWdlU2l6ZTogMjAgYXMgbnVtYmVyLFxuICAgIGRhdGFMaXN0OiBbXSxcbiAgICBzZWxlY3RlZEtleTogbnVsbCxcbiAgICBzZWxlY3RlZE9iamVjdDoge31cbiAgfSxcbiAgb25Mb2FkKG9wdGlvbikge1xuICAgIHRoaXMucmVxdWVzdERhdGEob3B0aW9uKTtcbiAgfSxcbiAgcmVxdWVzdERhdGEob3B0aW9ucz86IGFueSkge1xuICAgIHJlc3RVcmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvZWZncC93b3JrdHlwZSdcbiAgICAvL2NvbnNvbGUubG9nKHJlc3RVcmwpXG4gICAgd3gucmVxdWVzdCh7XG4gICAgICB1cmw6IHJlc3RVcmwsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGFwcGlkOiBhcHAuZ2xvYmFsRGF0YS5yZXN0SWQsXG4gICAgICAgIHRva2VuOiBhcHAuZ2xvYmFsRGF0YS5yZXN0VG9rZW5cbiAgICAgIH1cbiAgICAgIGhlYWRlcjoge1xuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgIGRhdGFMaXN0OiByZXMuZGF0YVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhmYWlsKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGJpbmREZXB0U2VsZWN0ZWQoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgc2VsZWN0ZWRLZXk6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgICB0aGlzLmRhdGEuZGF0YUxpc3QuZm9yRWFjaCgobywgaSkgPT4ge1xuICAgICAgaWYgKG8uayA9PSBlLmRldGFpbC52YWx1ZSkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBzZWxlY3RlZE9iamVjdDogeyBrOiBvLmssIHY6IG8udiB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuZGF0YS5zZWxlY3RlZE9iamVjdClcbiAgICBpZiAodGhpcy5kYXRhLnNlbGVjdGVkT2JqZWN0KSB7XG4gICAgICBsZXQgdGhhdCA9IHRoaXNcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcbiAgICAgICAgY29udGVudDogJ+W3sumAieaLqSzmmK/lkKbov5Tlm54nLFxuICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgICAgZXZlbnRDaGFubmVsID0gdGhhdC5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxuICAgICAgICAgICAgZXZlbnRDaGFubmVsLmVtaXQoJ3JldHVybldvcmtUeXBlU2VsZWN0JywgdGhhdC5kYXRhLnNlbGVjdGVkT2JqZWN0KVxuICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgICAgICAgZGVsdGE6IDFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxufSlcbiJdfQ==