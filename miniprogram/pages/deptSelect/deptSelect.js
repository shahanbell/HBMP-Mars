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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwdFNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcHRTZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUU1QixJQUFJLE9BQWUsQ0FBQztBQUNwQixJQUFJLFlBQVksQ0FBQztBQUVqQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsQ0FBVztRQUNuQixRQUFRLEVBQUUsRUFBWTtRQUN0QixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGNBQWMsRUFBRSxFQUFFO0tBQ25CO0lBQ0QsTUFBTSxZQUFDLE1BQU07UUFDWCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELGlCQUFpQixZQUFDLE9BQWE7UUFBL0IsaUJBMkJDO1FBMUJDLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxpQ0FBaUMsQ0FBQTtRQUNwRSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsT0FBTyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtTQUN0RDthQUFNO1lBQ0wsT0FBTyxJQUFJLE1BQU0sQ0FBQTtTQUNsQjtRQUNELE9BQU8sSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQzVELEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDVCxHQUFHLEVBQUUsT0FBTztZQUNaLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO2dCQUM1QixLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTO2FBQ2hDO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7Z0JBQ1YsS0FBSSxDQUFDLE9BQVEsQ0FBQztvQkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUk7aUJBQ25CLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBQSxJQUFJO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbkIsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxnQkFBZ0IsWUFBQyxDQUFDO1FBQWxCLGlCQTRCQztRQTNCQyxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUM1QixDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRTtpQkFDekYsQ0FBQyxDQUFBO2FBQ0g7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDNUIsSUFBSSxNQUFJLEdBQUcsSUFBSSxDQUFBO1lBQ2YsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxLQUFLLEVBQUUsTUFBTTtnQkFDYixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsT0FBTyxZQUFDLEdBQUc7b0JBQ1QsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO3dCQUNmLFlBQVksR0FBRyxNQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTt3QkFDM0MsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO3dCQUMvRCxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUNkLEtBQUssRUFBRSxDQUFDO3lCQUNULENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xyXG5cclxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxyXG5cclxubGV0IHJlc3RVcmw6IHN0cmluZztcclxubGV0IGV2ZW50Q2hhbm5lbDtcclxuXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIG9mZnNldDogMCBhcyBudW1iZXIsXHJcbiAgICBwYWdlU2l6ZTogMjAgYXMgbnVtYmVyLFxyXG4gICAgZGF0YUxpc3Q6IFtdLFxyXG4gICAgc2VsZWN0ZWRLZXk6IG51bGwsXHJcbiAgICBzZWxlY3RlZE9iamVjdDoge31cclxuICB9LFxyXG4gIG9uTG9hZChvcHRpb24pIHtcclxuICAgIHRoaXMucmVxdWVzdERlcHRTZWxlY3Qob3B0aW9uKTtcclxuICB9LFxyXG4gIHJlcXVlc3REZXB0U2VsZWN0KG9wdGlvbnM/OiBhbnkpIHtcclxuICAgIHJlc3RVcmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvZWZncC9mdW5jdGlvbnMnXHJcbiAgICBpZiAob3B0aW9ucy5lbXBsb3llZWlkKSB7XHJcbiAgICAgIHJlc3RVcmwgKz0gJy9mO3VzZXJzLmlkPScgKyBvcHRpb25zLmVtcGxveWVlaWQgKyAnL3MnXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN0VXJsICs9ICcvZi9zJ1xyXG4gICAgfVxyXG4gICAgcmVzdFVybCArPSAnLycgKyB0aGlzLmRhdGEub2Zmc2V0ICsgJy8nICsgdGhpcy5kYXRhLnBhZ2VTaXplXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH1cclxuICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICB9LFxyXG4gICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgZGF0YUxpc3Q6IHJlcy5kYXRhXHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LFxyXG4gIGJpbmREZXB0U2VsZWN0ZWQoZSkge1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHNlbGVjdGVkS2V5OiBlLmRldGFpbC52YWx1ZVxyXG4gICAgfSlcclxuICAgIHRoaXMuZGF0YS5kYXRhTGlzdC5mb3JFYWNoKChvLCBpKSA9PiB7XHJcbiAgICAgIGlmIChvLm9yZ2FuaXphdGlvblVuaXQuaWQgPT0gZS5kZXRhaWwudmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIHNlbGVjdGVkT2JqZWN0OiB7IGs6IG8ub3JnYW5pemF0aW9uVW5pdC5pZCwgdjogby5vcmdhbml6YXRpb25Vbml0Lm9yZ2FuaXphdGlvblVuaXROYW1lIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLmRhdGEuc2VsZWN0ZWRPYmplY3QpXHJcbiAgICBpZiAodGhpcy5kYXRhLnNlbGVjdGVkT2JqZWN0KSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5raI5oGvJyxcclxuICAgICAgICBjb250ZW50OiAn5bey6YCJ5oupLOaYr+WQpui/lOWbnicsXHJcbiAgICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBldmVudENoYW5uZWwgPSB0aGF0LmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5EZXB0U2VsZWN0JywgdGhhdC5kYXRhLnNlbGVjdGVkT2JqZWN0KVxyXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgICAgICAgIGRlbHRhOiAxXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19