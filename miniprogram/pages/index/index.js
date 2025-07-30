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
            { id: 'menu012', name: '安全隐患整改', imgUrl: '../../images/safe.png', url: '../../efgp/pages/safetymeasures/hiddenCheck', parentid: -1 },
            { id: 'menu09', name: '设备管理', imgUrl: '../../images/eqpManagement.png', url: '../../eam/pages/eqpManagement/eqpManageIndex', parentid: -1 },
            { id: 'menu10', name: '备件管理', imgUrl: '../../images/spareManagement.png', url: '../../eam/pages/spareManagement/spareManagementIndex', parentid: -1 },
            { id: 'menu11', name: '设备保全', imgUrl: '../../images/eqpMaintenance.png', url: '../../eam/pages/maintenanceManagement/eqpMaintainIndex', parentid: -1 },
            { id: 'menu12', name: '扫码签到', imgUrl: '../../images/leanProduction.png', url: '../../pages/leanProductionScan/leanProductionScan', parentid: -1 },
            { id: 'menu13', name: '研发工作汇报', imgUrl: '../../images/rdpmDailyReport.png', url: '../../efgp/pages/rdpm/rdpmDailyReport', parentid: -1 }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBRTVCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELE9BQU8sRUFBRTtZQUNQLGlFQUFpRTtZQUNqRSxpRUFBaUU7WUFDakUsaUVBQWlFO1NBQ2xFO1FBQ0QsSUFBSSxFQUFFO1lBQ0osRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLHdCQUF3QixFQUFFLEdBQUcsRUFBRSw4QkFBOEIsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDakgsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDJCQUEyQixFQUFFLEdBQUcsRUFBRSxvQ0FBb0MsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDMUgsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDJCQUEyQixFQUFFLEdBQUcsRUFBRSw0Q0FBNEMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDbEksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxnQ0FBZ0MsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDakgsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixFQUFFLEdBQUcsRUFBRSw0QkFBNEIsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDOUcsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixFQUFFLEdBQUcsRUFBRSxrREFBa0QsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDekksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGdDQUFnQyxFQUFFLEdBQUcsRUFBRSw4Q0FBOEMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDM0ksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGtDQUFrQyxFQUFFLEdBQUcsRUFBRSxzREFBc0QsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDckosRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSx3REFBd0QsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDdEosRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSxtREFBbUQsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7U0FDbEo7UUFDRCxhQUFhLEVBQUUsS0FBSztRQUNwQixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELE1BQU07UUFBTixpQkEyREM7UUExREMsSUFBSSxJQUFJLEdBQUMsSUFBSSxDQUFDO1FBQ2QsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksU0FBUyxFQUFFO1lBR3ZFLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxVQUFDLEdBQUc7Z0JBQzlCLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osV0FBVyxFQUFFLElBQUk7aUJBQ2xCLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQTtTQUNGO2FBQ0k7WUFFSCxFQUFFLENBQUMsV0FBVyxDQUFDO2dCQUNiLE9BQU8sRUFBRSxVQUFBLEdBQUc7b0JBQ1YsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQTtvQkFDdEMsS0FBSSxDQUFDLE9BQVEsQ0FBQzt3QkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7d0JBQ3RCLFdBQVcsRUFBRSxJQUFJO3FCQUNsQixDQUFDLENBQUE7Z0JBQ0osQ0FBQzthQUNGLENBQUMsQ0FBQTtTQUNIO1FBQ0QsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUN6QixJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVU7YUFDdEMsQ0FBQyxDQUFBO1NBQ0g7YUFBTTtZQUNMLEdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxVQUFDLElBQUk7Z0JBQ2xDLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO2lCQUM1QixDQUFDLENBQUE7WUFDSixDQUFDLENBQUE7U0FDRjtRQUNBLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFFLENBQUMsRUFBRTtZQUNwQyxHQUFHLENBQUMscUJBQXFCLEdBQUcsVUFBVSxJQUFJO2dCQUN4QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDMUIsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtvQkFDaEQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNsQjtnQkFDRCxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUNYLElBQUksRUFBRSxJQUFJO2lCQUNYLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztTQUNIO2FBQUk7WUFDSCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQ25FLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNsQjtZQUNGLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7YUFDWCxDQUFDLENBQUM7U0FDSjtJQUNMLENBQUM7SUFDRCxNQUFNO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQ3JELElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osV0FBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDdEQsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixVQUFVLEVBQUUsSUFBSTthQUNqQixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7SUFFRCxnQkFBZ0IsWUFBQyxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDWCxHQUFHLEVBQUUsd0JBQXdCO1NBQzlCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvL2luZGV4LmpzXHJcbi8v6I635Y+W5bqU55So5a6e5L6LXHJcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxuXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIGhhc1VzZXJJbmZvOiBmYWxzZSxcclxuICAgIGF1dGhvcml6ZWQ6IGZhbHNlLFxyXG4gICAgY2FuSVVzZTogd3guY2FuSVVzZSgnYnV0dG9uLm9wZW4tdHlwZS5nZXRVc2VySW5mbycpLFxyXG4gICAgaW1nVXJsczogW1xyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTEzMzQ3ODctMjFlNmJkM2FiMTM1P3c9NjQwJyxcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUxMjE0MDEyLTg0Zjk1ZTA2MGRlZT93PTY0MCcsXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MTQ0NjU5MS0xNDI4NzVhOTAxYTE/dz02NDAnXHJcbiAgICBdLFxyXG4gICAgbWVudTogW1xyXG4gICAgICB7IGlkOiAnbWVudTAxJywgbmFtZTogJ+ivt+WBhycsIGltZ1VybDogJy4uLy4uL2ltYWdlcy9sZWF2ZS5wbmcnLCB1cmw6ICcuLi8uLi9lZmdwL3BhZ2VzL2xlYXZlL2xlYXZlJywgcGFyZW50aWQ6IC0xIH0sXHJcbiAgICAgIHsgaWQ6ICdtZW51MDInLCBuYW1lOiAn5Yqg54+tJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL292ZXJ0aW1lLnBuZycsIHVybDogJy4uLy4uL2VmZ3AvcGFnZXMvb3ZlcnRpbWUvb3ZlcnRpbWUnLCBwYXJlbnRpZDogLTEgfSxcclxuICAgICAgeyBpZDogJ21lbnUwMycsIG5hbWU6ICflh7rlt64nLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvYnVzaW5lc3MucG5nJywgdXJsOiAnLi4vLi4vZWZncC9wYWdlcy9idXNpbmVzc3RyaXAvYnVzaW5lc3N0cmlwJywgcGFyZW50aWQ6IC0xIH0sXHJcbiAgICAgIHsgaWQ6ICdtZW51MDQnLCBuYW1lOiAn5rS+6L2mJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL2Nhci5wbmcnLCB1cmw6ICcuLi8uLi9lZmdwL3BhZ2VzL2NhcmFwcC9jYXJhcHAnLCBwYXJlbnRpZDogLTEgfSxcclxuICAgICAgeyBpZDogJ21lbnUwNScsIG5hbWU6ICflgJ/mlK8nLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvbG9hbi5wbmcnLCB1cmw6ICcuLi8uLi9lZmdwL3BhZ2VzL2xvYW4vbG9hbicsIHBhcmVudGlkOiAtMSB9LFxyXG4gICAgICB7IGlkOiAnbWVudTAxMicsIG5hbWU6ICflronlhajpmpDmgqPmlbTmlLknLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvc2FmZS5wbmcnLCB1cmw6ICcuLi8uLi9lZmdwL3BhZ2VzL3NhZmV0eW1lYXN1cmVzL3NhZmV0eU1hbmFnZW1lbnQnLCBwYXJlbnRpZDogLTEgfSxcclxuICAgICAgeyBpZDogJ21lbnUwOScsIG5hbWU6ICforr7lpIfnrqHnkIYnLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvZXFwTWFuYWdlbWVudC5wbmcnLCB1cmw6ICcuLi8uLi9lYW0vcGFnZXMvZXFwTWFuYWdlbWVudC9lcXBNYW5hZ2VJbmRleCcsIHBhcmVudGlkOiAtMSB9LFxyXG4gICAgICB7IGlkOiAnbWVudTEwJywgbmFtZTogJ+Wkh+S7tueuoeeQhicsIGltZ1VybDogJy4uLy4uL2ltYWdlcy9zcGFyZU1hbmFnZW1lbnQucG5nJywgdXJsOiAnLi4vLi4vZWFtL3BhZ2VzL3NwYXJlTWFuYWdlbWVudC9zcGFyZU1hbmFnZW1lbnRJbmRleCcsIHBhcmVudGlkOiAtMSB9LFxyXG4gICAgICB7IGlkOiAnbWVudTExJywgbmFtZTogJ+iuvuWkh+S/neWFqCcsIGltZ1VybDogJy4uLy4uL2ltYWdlcy9lcXBNYWludGVuYW5jZS5wbmcnLCB1cmw6ICcuLi8uLi9lYW0vcGFnZXMvbWFpbnRlbmFuY2VNYW5hZ2VtZW50L2VxcE1haW50YWluSW5kZXgnLCBwYXJlbnRpZDogLTEgfSxcclxuICAgICAgeyBpZDogJ21lbnUxMicsIG5hbWU6ICfmiavnoIHnrb7liLAnLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvbGVhblByb2R1Y3Rpb24ucG5nJywgdXJsOiAnLi4vLi4vcGFnZXMvbGVhblByb2R1Y3Rpb25TY2FuL2xlYW5Qcm9kdWN0aW9uU2NhbicsIHBhcmVudGlkOiAtMSB9XHJcbiAgICBdLFxyXG4gICAgaW5kaWNhdG9yRG90czogZmFsc2UsXHJcbiAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgIGludGVydmFsOiA1MDAwLFxyXG4gICAgZHVyYXRpb246IDEwMDBcclxuICB9LFxyXG4gIG9uTG9hZCgpIHtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEudXNlckluZm8pIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgaGFzVXNlckluZm86IHRydWVcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhLmNhbklVc2UgfHwgYXBwLmdsb2JhbERhdGEuYXV0aC5sZW5ndGggPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXHJcbiAgICAgIC8vIOaJgOS7peatpOWkhOWKoOWFpSBhcHAg5pa55rOV77yM5Y+v5Lul5ZyoIGFwcC50cyDkuK0gY2FsbGJhY2sg5Lul6Ziy5q2i6L+Z56eN5oOF5Ya1XHJcbiAgICAgIGFwcC51c2VySW5mb1JlYWR5Q2FsbGJhY2sgPSAocmVzKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBoYXNVc2VySW5mbzogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0gXHJcbiAgICBlbHNlIHtcclxuICAgICAgLy8g5Zyo5rKh5pyJIG9wZW4tdHlwZT1nZXRVc2VySW5mbyDniYjmnKznmoTlhbzlrrnlpITnkIZcclxuICAgICAgd3guZ2V0VXNlckluZm8oe1xyXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xyXG4gICAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICAgIHVzZXJJbmZvOiByZXMudXNlckluZm8sXHJcbiAgICAgICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5vcGVuSWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgYXV0aG9yaXplZDogYXBwLmdsb2JhbERhdGEuYXV0aG9yaXplZFxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXBwLnNlc3Npb25JbmZvUmVhZHlDYWxsYmFjayA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBhdXRob3JpemVkOiBkYXRhLmF1dGhvcml6ZWRcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAgaWYgKGFwcC5nbG9iYWxEYXRhLmF1dGhEYXRhLmxlbmd0aD09MCkge1xyXG4gICAgICAgIGFwcC5hdXRoSW5mb1JlYWR5Q2FsbGJhY2sgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgICAgdmFyIGxpc3QgPSB0aGF0LmRhdGEubWVudTtcclxuICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBkYXRlOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICB2YXIgZW50cnkgPSBfYVtfaV07XHJcbiAgICAgICAgICAgIGxpc3QucHVzaChlbnRyeSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGF0LnNldERhdGEoe1xyXG4gICAgICAgICAgICBtZW51OiBsaXN0XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB2YXIgbGlzdCA9IHRoYXQuZGF0YS5tZW51O1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBhcHAuZ2xvYmFsRGF0YS5hdXRoRGF0YTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgIHZhciBlbnRyeSA9IF9hW19pXTtcclxuICAgICAgICAgIGxpc3QucHVzaChlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgdGhhdC5zZXREYXRhKHtcclxuICAgICAgICAgIG1lbnU6IGxpc3RcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gIH0sXHJcbiAgb25TaG93KCkge1xyXG4gICAgaWYgKCF0aGlzLmRhdGEuaGFzVXNlckluZm8gJiYgYXBwLmdsb2JhbERhdGEudXNlckluZm8pIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgaGFzVXNlckluZm86IHRydWVcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLmF1dGhvcml6ZWQgJiYgYXBwLmdsb2JhbERhdGEuYXV0aG9yaXplZCkge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBhdXRob3JpemVkOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuICAvLyDkuovku7blpITnkIblh73mlbBcclxuICBiaW5kQXV0aG9yaXplVGFwKGUpIHtcclxuICAgIHd4LnN3aXRjaFRhYih7XHJcbiAgICAgIHVybDogJy9wYWdlcy9wcm9maWxlL3Byb2ZpbGUnXHJcbiAgICB9KVxyXG4gIH1cclxufSlcclxuIl19