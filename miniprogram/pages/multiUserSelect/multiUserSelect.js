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
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users';
        if (options.userInfo) {
            var reg = /^[\u3220-\uFA29]+$/;
            if (!reg.test(options.userInfo)) {
                restUrl += '/f;id=' + options.userInfo + '/s';
            }
            else {
                restUrl += '/f;userName=' + options.userInfo + '/s';
            }
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
    bindUserSelected: function (e) {
        var _this = this;
        console.log(e);
        this.setData({
            selectedKey: e.detail.value
        });
        this.data.dataList.forEach(function (o, i) {
            if (o.id == e.detail.value) {
                _this.setData({
                    selectedObject: { k: o.id, v: o.userName }
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
                        eventChannel.emit('returnUserSelect', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlVc2VyU2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibXVsdGlVc2VyU2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFVLENBQUE7QUFFNUIsSUFBSSxPQUFlLENBQUM7QUFDcEIsSUFBSSxZQUFZLENBQUM7QUFFakIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osTUFBTSxFQUFFLENBQVc7UUFDbkIsUUFBUSxFQUFFLEVBQVk7UUFDdEIsUUFBUSxFQUFFLEVBQUU7UUFDWixXQUFXLEVBQUUsSUFBSTtRQUNqQixjQUFjLEVBQUUsRUFBRTtLQUNuQjtJQUNELE1BQU0sWUFBQyxNQUFNO1FBQ1gsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxpQkFBaUIsWUFBQyxPQUFhO1FBQS9CLGlCQWtDQztRQWpDQyxPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsNkJBQTZCLENBQUE7UUFDaEUsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3BCLElBQUksR0FBRyxHQUFHLG9CQUFvQixDQUFDO1lBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDL0IsT0FBTyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTthQUM5QztpQkFBTTtnQkFDTCxPQUFPLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO2FBQ3BEO1NBRUY7YUFBTTtZQUNMLE9BQU8sSUFBSSxNQUFNLENBQUE7U0FDbEI7UUFDRCxPQUFPLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQTtRQUU1RCxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ1QsR0FBRyxFQUFFLE9BQU87WUFDWixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTTtnQkFDNUIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUzthQUNoQztZQUNELE1BQU0sRUFBRTtnQkFDTixjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNWLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJO2lCQUNuQixDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsSUFBSSxFQUFFLFVBQUEsSUFBSTtnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ25CLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsZ0JBQWdCLFlBQUMsQ0FBQztRQUFsQixpQkE2QkM7UUE1QkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixXQUFXLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQzVCLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtnQkFDMUIsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRTtpQkFDM0MsQ0FBQyxDQUFBO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDNUIsSUFBSSxNQUFJLEdBQUcsSUFBSSxDQUFBO1lBQ2YsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxLQUFLLEVBQUUsTUFBTTtnQkFDYixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsT0FBTyxZQUFDLEdBQUc7b0JBQ1QsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO3dCQUNmLFlBQVksR0FBRyxNQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTt3QkFDM0MsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3dCQUMvRCxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUNkLEtBQUssRUFBRSxDQUFDO3lCQUNULENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xyXG5cclxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxyXG5cclxubGV0IHJlc3RVcmw6IHN0cmluZztcclxubGV0IGV2ZW50Q2hhbm5lbDtcclxuXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIG9mZnNldDogMCBhcyBudW1iZXIsXHJcbiAgICBwYWdlU2l6ZTogMjAgYXMgbnVtYmVyLFxyXG4gICAgZGF0YUxpc3Q6IFtdLFxyXG4gICAgc2VsZWN0ZWRLZXk6IG51bGwsXHJcbiAgICBzZWxlY3RlZE9iamVjdDoge31cclxuICB9LFxyXG4gIG9uTG9hZChvcHRpb24pIHtcclxuICAgIHRoaXMucmVxdWVzdERlcHRTZWxlY3Qob3B0aW9uKTtcclxuICB9LFxyXG4gIHJlcXVlc3REZXB0U2VsZWN0KG9wdGlvbnM/OiBhbnkpIHtcclxuICAgIHJlc3RVcmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvZWZncC91c2VycydcclxuICAgIGlmIChvcHRpb25zLnVzZXJJbmZvKSB7XHJcbiAgICAgIGxldCByZWcgPSAvXltcXHUzMjIwLVxcdUZBMjldKyQvO1xyXG4gICAgICBpZiAoIXJlZy50ZXN0KG9wdGlvbnMudXNlckluZm8pKSB7XHJcbiAgICAgICAgcmVzdFVybCArPSAnL2Y7aWQ9JyArIG9wdGlvbnMudXNlckluZm8gKyAnL3MnXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdFVybCArPSAnL2Y7dXNlck5hbWU9JyArIG9wdGlvbnMudXNlckluZm8gKyAnL3MnXHJcbiAgICAgIH1cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN0VXJsICs9ICcvZi9zJ1xyXG4gICAgfVxyXG4gICAgcmVzdFVybCArPSAnLycgKyB0aGlzLmRhdGEub2Zmc2V0ICsgJy8nICsgdGhpcy5kYXRhLnBhZ2VTaXplXHJcbiAgICAvL2NvbnNvbGUubG9nKHJlc3RVcmwpXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH1cclxuICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgZGF0YUxpc3Q6IHJlcy5kYXRhXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmRVc2VyU2VsZWN0ZWQoZSkge1xyXG4gICAgY29uc29sZS5sb2coZSlcclxuICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICBzZWxlY3RlZEtleTogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgICB0aGlzLmRhdGEuZGF0YUxpc3QuZm9yRWFjaCgobywgaSkgPT4ge1xyXG4gICAgICBpZiAoby5pZCA9PSBlLmRldGFpbC52YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgc2VsZWN0ZWRPYmplY3Q6IHsgazogby5pZCwgdjogby51c2VyTmFtZSB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIC8vY29uc29sZS5sb2codGhpcy5kYXRhLnNlbGVjdGVkT2JqZWN0KVxyXG4gICAgaWYgKHRoaXMuZGF0YS5zZWxlY3RlZE9iamVjdCkge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgICB0aXRsZTogJ+ezu+e7n+a2iOaBrycsXHJcbiAgICAgICAgY29udGVudDogJ+W3sumAieaLqSzmmK/lkKbov5Tlm54nLFxyXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgZXZlbnRDaGFubmVsID0gdGhhdC5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxyXG4gICAgICAgICAgICBldmVudENoYW5uZWwuZW1pdCgncmV0dXJuVXNlclNlbGVjdCcsIHRoYXQuZGF0YS5zZWxlY3RlZE9iamVjdClcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==