"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
Page({
    data: {
        hasUserInfo: false,
        authorized: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        menu: [
            { id: 'menu01', name: '请假', imgUrl: '../../images/leave.png', url: '../../efgp/pages/leave/leave', parentid: -1 },
            { id: 'menu02', name: '加班', imgUrl: '../../images/overtime.png', url: '../../efgp/pages/overtime/overtime', parentid: -1 },
            { id: 'menu03', name: '出差', imgUrl: '../../images/business.png', url: '../../efgp/pages/businesstrip/businesstrip', parentid: -1 },
            { id: 'menu04', name: '派车', imgUrl: '../../images/car.png', url: '../../efgp/pages/carapp/carapp', parentid: -1 },
            { id: 'menu05', name: '借支', imgUrl: '../../images/loan.png', url: '../../efgp/pages/loan/loan', parentid: -1 },
            { id: 'menu012', name: '安全隐患整改', imgUrl: '../../images/safe.png', url: '../../efgp/pages/safetymeasures/safetyManagement', parentid: -1 },
            { id: 'menu09', name: '设备管理', imgUrl: '../../images/eqpManagement.png', url: '../../eam/pages/eqpManagement/eqpManageIndex', parentid: -1 },
            { id: 'menu10', name: '备件管理', imgUrl: '../../images/spareManagement.png', url: '../../eam/pages/spareManagement/spareManagementIndex', parentid: -1 },
            { id: 'menu11', name: '设备保全', imgUrl: '../../images/eqpMaintenance.png', url: '../../eam/pages/maintenanceManagement/eqpMaintainIndex', parentid: -1 },
            { id: 'menu12', name: '扫码签到', imgUrl: '../../images/leanProduction.png', url: '../../pages/leanProductionScan/leanProductionScan', parentid: -1 }
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000
    },
    onLoad: function () {
        var _this = this;
        var that = this;
        if (app.globalData.userInfo) {
            this.setData({
                hasUserInfo: true
            });
        }
        else if (this.data.canIUse || app.globalData.auth.length == undefined) {
            app.userInfoReadyCallback = function (res) {
                _this.setData({
                    hasUserInfo: true
                });
            };
        }
        else {
            wx.getUserInfo({
                success: function (res) {
                    app.globalData.userInfo = res.userInfo;
                    _this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        }
        if (app.globalData.openId) {
            this.setData({
                authorized: app.globalData.authorized
            });
        }
        else {
            app.sessionInfoReadyCallback = function (data) {
                _this.setData({
                    authorized: data.authorized
                });
            };
        }
        if (app.globalData.authData.length == 0) {
            app.authInfoReadyCallback = function (date) {
                var list = that.data.menu;
                for (var _i = 0, _a = date; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    list.push(entry);
                }
                that.setData({
                    menu: list
                });
            };
        }
        else {
            var list = that.data.menu;
            for (var _i = 0, _a = app.globalData.authData; _i < _a.length; _i++) {
                var entry = _a[_i];
                list.push(entry);
            }
            that.setData({
                menu: list
            });
        }
    },
    onShow: function () {
        if (!this.data.hasUserInfo && app.globalData.userInfo) {
            this.setData({
                hasUserInfo: true
            });
        }
        if (!this.data.authorized && app.globalData.authorized) {
            this.setData({
                authorized: true
            });
        }
    },
    bindAuthorizeTap: function (e) {
        wx.switchTab({
            url: '/pages/profile/profile'
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBRTVCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELE9BQU8sRUFBRTtZQUNQLGlFQUFpRTtZQUNqRSxpRUFBaUU7WUFDakUsaUVBQWlFO1NBQ2xFO1FBQ0QsSUFBSSxFQUFFO1lBQ0osRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLHdCQUF3QixFQUFFLEdBQUcsRUFBRSw4QkFBOEIsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDakgsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDJCQUEyQixFQUFFLEdBQUcsRUFBRSxvQ0FBb0MsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDMUgsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDJCQUEyQixFQUFFLEdBQUcsRUFBRSw0Q0FBNEMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDbEksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxnQ0FBZ0MsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDakgsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixFQUFFLEdBQUcsRUFBRSw0QkFBNEIsRUFBRSxR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O1FBQ2hCLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDWCxHQUFHLEVBQUUsd0JBQXdCO1NBQzlCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL2luZGV4LmpzXHJcbi8v6I635Y+W5bqU55So5a6e5L6LXHJcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxuXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIGhhc1VzZXJJbmZvOiBmYWxzZSxcclxuICAgIGF1dGhvcml6ZWQ6IGZhbHNlLFxyXG4gICAgY2FuSVVzZTogd3guY2FuSVVzZSgnYnV0dG9uLm9wZW4tdHlwZS5nZXRVc2VySW5mbycpLFxyXG4gICAgaW1nVXJsczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTEzMzQ3ODctMjFlNmJkM2FiMTM1P3c9NjQwJyxcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUxMjE0MDEyLTg0Zjk1ZTA2MGRlZT93PTY0MCcsXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MTQ0NjU5MS0xNDI4NzVhOTAxYTE/dz02NDAnXHJcbiAgICBdLFxyXG4gICAgbWVudTogW1xyXG4gICAgICB7IGlkOiAnbWVudTAxJywgbmFtZTogJ+ivt+WBhycsIGltZ1VybDogJy4uLy4uL2ltYWdlcy9sZWF2ZS5wbmcnLCB1cmw6ICcuLi8uLi9lZmdwL3BhZ2VzL2xlYXZlL2xlYXZlJywgcGFyZW50aWQ6IC0xIH0sXHJcbiAgICAgIHsgaWQ6ICdtZW51MDInLCBuYW1lOiAn5Yqg54+tJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL292ZXJ0aW1lLnBuZycsIHVybDogJy4uLy4uL2VmZ3AvcGFnZXMvb3ZlcnRpbWUvb3ZlcnRpbWUnLCBwYXJlbnRpZDogLTEgfSxcclxuICAgICAgeyBpZDogJ21lbnUwMycsIG5hbWU6ICflh7rlt64nLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvYnVzaW5lc3MucG5nJywgdXJsOiAnLi4vLi4vZWZncC9wYWdlcy9idXNpbmVzc3RyaXAvYnVzaW5lc3N0cmlwJywgcGFyZW50aWQ6IC0xIH0sXHJcbiAgICAgIHsgaWQ6ICdtZW51MDQnLCBuYW1lOiAn5rS+6L2mJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL2Nhci5wbmcnLCB1cmw6ICcuLi8uLi9lZmdwL3BhZ2VzL2NhcmFwcC9jYXJhcHAnLCBwYXJlbnRpZDogLTEgfSxcclxuICAgICAgeyBpZDogJ21lbnUwNScsIG5hbWU6ICflgJ/mlK8nLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvbG9hbi5wbmcnLCB1cmw6ICcuLi8uLi9lZmdwL3BhZ2VzL2xvYW4vbG9hbicsIHBhcmVudGlkOiAtMSB9LFxyXG4gICAgICB7IGlkOiAnbWVudTAxMicsIG5hbWU6ICflronlhajpmpDmgqPmlbTmlLknLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvc2FmZS5wbmcnLCB1cmw6ICcuLi8uLi9lZmdwL3BhZ2VzL3NhZmV0eW1lYXN1cmVzL3NhZmV0eW1lYXN1cmVzJywgcGFyZW50aWQ6IC0xIH0sXHJcbiAgICAgIHsgaWQ6ICdtZW51MDknLCBuYW1lOiAn6K6+5aSH566h55CGJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL2VxcE1hbmFnZW1lbnQucG5nJywgdXJsOiAnLi4vLi4vZWFtL3BhZ2VzL2VxcE1hbmFnZW1lbnQvZXFwTWFuYWdlSW5kZXgnLCBwYXJlbnRpZDogLTEgfSxcclxuICAgICAgeyBpZDogJ21lbnUxMCcsIG5hbWU6ICflpIfku7bnrqHnkIYnLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvc3BhcmVNYW5hZ2VtZW50LnBuZycsIHVybDogJy4uLy4uL2VhbS9wYWdlcy9zcGFyZU1hbmFnZW1lbnQvc3BhcmVNYW5hZ2VtZW50SW5kZXgnLCBwYXJlbnRpZDogLTEgfSxcclxuICAgICAgeyBpZDogJ21lbnUxMScsIG5hbWU6ICforr7lpIfkv53lhagnLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvZXFwTWFpbnRlbmFuY2UucG5nJywgdXJsOiAnLi4vLi4vZWFtL3BhZ2VzL21haW50ZW5hbmNlTWFuYWdlbWVudC9lcXBNYWludGFpbkluZGV4JywgcGFyZW50aWQ6IC0xIH0sXHJcbiAgICAgIHsgaWQ6ICdtZW51MTInLCBuYW1lOiAn5omr56CB562+5YiwJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL2xlYW5Qcm9kdWN0aW9uLnBuZycsIHVybDogJy4uLy4uL3BhZ2VzL2xlYW5Qcm9kdWN0aW9uU2Nhbi9sZWFuUHJvZHVjdGlvblNjYW4nLCBwYXJlbnRpZDogLTEgfVxyXG4gICAgXSxcclxuICAgIGluZGljYXRvckRvdHM6IGZhbHNlLFxyXG4gICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICBpbnRlcnZhbDogNTAwMCxcclxuICAgIGR1cmF0aW9uOiAxMDAwXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YS5jYW5JVXNlIHx8IGFwcC5nbG9iYWxEYXRhLmF1dGgubGVuZ3RoID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAvLyDnlLHkuo4gZ2V0VXNlckluZm8g5piv572R57uc6K+35rGC77yM5Y+v6IO95Lya5ZyoIFBhZ2Uub25Mb2FkIOS5i+WQjuaJjei/lOWbnlxyXG4gICAgICAvLyDmiYDku6XmraTlpITliqDlhaUgYXBwIOaWueazle+8jOWPr+S7peWcqCBhcHAudHMg5LitIGNhbGxiYWNrIOS7pemYsuatoui/meenjeaDheWGtVxyXG4gICAgICBhcHAudXNlckluZm9SZWFkeUNhbGxiYWNrID0gKHJlcykgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgaGFzVXNlckluZm86IHRydWVcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9IFxyXG4gICAgZWxzZSB7XHJcbiAgICAgIC8vIOWcqOayoeaciSBvcGVuLXR5cGU9Z2V0VXNlckluZm8g54mI5pys55qE5YW85a655aSE55CGXHJcbiAgICAgIHd4LmdldFVzZXJJbmZvKHtcclxuICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgYXBwLmdsb2JhbERhdGEudXNlckluZm8gPSByZXMudXNlckluZm9cclxuICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICB1c2VySW5mbzogcmVzLnVzZXJJbmZvLFxyXG4gICAgICAgICAgICBoYXNVc2VySW5mbzogdHJ1ZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEub3BlbklkKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGF1dGhvcml6ZWQ6IGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWRcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFwcC5zZXNzaW9uSW5mb1JlYWR5Q2FsbGJhY2sgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgYXV0aG9yaXplZDogZGF0YS5hdXRob3JpemVkXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5hdXRoRGF0YS5sZW5ndGg9PTApIHtcclxuICAgICAgICBhcHAuYXV0aEluZm9SZWFkeUNhbGxiYWNrID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgIHZhciBsaXN0ID0gdGhhdC5kYXRhLm1lbnU7XHJcbiAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gZGF0ZTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0gX2FbX2ldO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goZW50cnkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgICAgbWVudTogbGlzdFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdmFyIGxpc3QgPSB0aGF0LmRhdGEubWVudTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gYXBwLmdsb2JhbERhdGEuYXV0aERhdGE7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICB2YXIgZW50cnkgPSBfYVtfaV07XHJcbiAgICAgICAgICBsaXN0LnB1c2goZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgICAgICBtZW51OiBsaXN0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICB9LFxyXG4gIG9uU2hvdygpIHtcclxuICAgIGlmICghdGhpcy5kYXRhLmhhc1VzZXJJbmZvICYmIGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5hdXRob3JpemVkICYmIGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgYXV0aG9yaXplZDogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8g5LqL5Lu25aSE55CG5Ye95pWwXHJcbiAgYmluZEF1dGhvcml6ZVRhcChlKSB7XHJcbiAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICB1cmw6ICcvcGFnZXMvcHJvZmlsZS9wcm9maWxlJ1xyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiJdfQ==