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
            { id: 'menu01', name: '请假', imgUrl: '../../images/leave.png', url: '/pages/leave/leave' },
            { id: 'menu02', name: '加班', imgUrl: '../../images/overtime.png', url: '/pages/overtime/overtime' },
            { id: 'menu03', name: '出差', imgUrl: '../../images/business.png', url: '/pages/pie/index' },
            {
                id: 'menu08', name: '派车', imgUrl: '../../images/car.png',
                url: '/pages/carapp/carapp'
            },
            {
                id: 'menu07', name: '借支', imgUrl: '../../images/loan.png',
                url: '/pages/loan/loan'
            },
            {
                id: 'menu08', name: '派工', imgUrl: '../../images/sendjob.png',
                url: '/pages/sendjob/sendjob'
            }
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000
    },
    onLoad: function () {
        var _this = this;
        if (app.globalData.userInfo) {
            this.setData({
                hasUserInfo: true
            });
        }
        else if (this.data.canIUse) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBRTVCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELE9BQU8sRUFBRTtZQUNQLGlFQUFpRTtZQUNqRSxpRUFBaUU7WUFDakUsaUVBQWlFO1NBQ2xFO1FBQ0QsSUFBSSxFQUFFO1lBQ0osRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtZQUN6RixFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsMkJBQTJCLEVBQUUsR0FBRyxFQUFFLDBCQUEwQixFQUFFO1lBQ2xHLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwyQkFBMkIsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7WUFDMUY7Z0JBQ0UsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxzQkFBc0I7Z0JBQ3hELEdBQUcsRUFBRSxzQkFBc0I7YUFDNUI7WUFDRDtnQkFDRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLHVCQUF1QjtnQkFDekQsR0FBRyxFQUFFLGtCQUFrQjthQUN4QjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsMEJBQTBCO2dCQUM1RCxHQUFHLEVBQUUsd0JBQXdCO2FBQzlCO1NBQ0Y7UUFDRCxhQUFhLEVBQUUsS0FBSztRQUNwQixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELE1BQU07UUFBTixpQkFvQ0M7UUFuQ0MsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUc1QixHQUFHLENBQUMscUJBQXFCLEdBQUcsVUFBQyxHQUFHO2dCQUM5QixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFdBQVcsRUFBRSxJQUFJO2lCQUNsQixDQUFDLENBQUE7WUFDSixDQUFDLENBQUE7U0FDRjthQUFNO1lBRUwsRUFBRSxDQUFDLFdBQVcsQ0FBQztnQkFDYixPQUFPLEVBQUUsVUFBQSxHQUFHO29CQUNWLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUE7b0JBQ3RDLEtBQUksQ0FBQyxPQUFRLENBQUM7d0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO3dCQUN0QixXQUFXLEVBQUUsSUFBSTtxQkFDbEIsQ0FBQyxDQUFBO2dCQUNKLENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtRQUNELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDekIsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2FBQ3RDLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxHQUFHLENBQUMsd0JBQXdCLEdBQUcsVUFBQyxJQUFJO2dCQUNsQyxLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtpQkFDNUIsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFBO1NBQ0Y7SUFDSCxDQUFDO0lBQ0QsTUFBTTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNyRCxJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQ3RELElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLFlBQUMsQ0FBQztRQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1gsR0FBRyxFQUFFLHdCQUF3QjtTQUM5QixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9pbmRleC5qc1xyXG4vL+iOt+WPluW6lOeUqOWunuS+i1xyXG5pbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXHJcblxyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcblxyXG5QYWdlKHtcclxuICBkYXRhOiB7XHJcbiAgICBoYXNVc2VySW5mbzogZmFsc2UsXHJcbiAgICBhdXRob3JpemVkOiBmYWxzZSxcclxuICAgIGNhbklVc2U6IHd4LmNhbklVc2UoJ2J1dHRvbi5vcGVuLXR5cGUuZ2V0VXNlckluZm8nKSxcclxuICAgIGltZ1VybHM6IFtcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUxMzM0Nzg3LTIxZTZiZDNhYjEzNT93PTY0MCcsXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MTIxNDAxMi04NGY5NWUwNjBkZWU/dz02NDAnLFxyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTE0NDY1OTEtMTQyODc1YTkwMWExP3c9NjQwJ1xyXG4gICAgXSxcclxuICAgIG1lbnU6IFtcclxuICAgICAgeyBpZDogJ21lbnUwMScsIG5hbWU6ICfor7flgYcnLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvbGVhdmUucG5nJywgdXJsOiAnL3BhZ2VzL2xlYXZlL2xlYXZlJyB9LFxyXG4gICAgICB7IGlkOiAnbWVudTAyJywgbmFtZTogJ+WKoOePrScsIGltZ1VybDogJy4uLy4uL2ltYWdlcy9vdmVydGltZS5wbmcnLCB1cmw6ICcvcGFnZXMvb3ZlcnRpbWUvb3ZlcnRpbWUnIH0sXHJcbiAgICAgIHsgaWQ6ICdtZW51MDMnLCBuYW1lOiAn5Ye65beuJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL2J1c2luZXNzLnBuZycsIHVybDogJy9wYWdlcy9waWUvaW5kZXgnIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogJ21lbnUwOCcsIG5hbWU6ICfmtL7ovaYnLCBpbWdVcmw6ICcuLi8uLi9pbWFnZXMvY2FyLnBuZycsXHJcbiAgICAgICAgdXJsOiAnL3BhZ2VzL2NhcmFwcC9jYXJhcHAnXHJcbiAgICAgIH0sIFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICdtZW51MDcnLCBuYW1lOiAn5YCf5pSvJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL2xvYW4ucG5nJyxcclxuICAgICAgICB1cmw6ICcvcGFnZXMvbG9hbi9sb2FuJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaWQ6ICdtZW51MDgnLCBuYW1lOiAn5rS+5belJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL3NlbmRqb2IucG5nJyxcclxuICAgICAgICB1cmw6ICcvcGFnZXMvc2VuZGpvYi9zZW5kam9iJ1xyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaW5kaWNhdG9yRG90czogZmFsc2UsXHJcbiAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgIGludGVydmFsOiA1MDAwLFxyXG4gICAgZHVyYXRpb246IDEwMDBcclxuICB9LFxyXG4gIG9uTG9hZCgpIHtcclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS51c2VySW5mbykge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBoYXNVc2VySW5mbzogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmRhdGEuY2FuSVVzZSkge1xyXG4gICAgICAvLyDnlLHkuo4gZ2V0VXNlckluZm8g5piv572R57uc6K+35rGC77yM5Y+v6IO95Lya5ZyoIFBhZ2Uub25Mb2FkIOS5i+WQjuaJjei/lOWbnlxyXG4gICAgICAvLyDmiYDku6XmraTlpITliqDlhaUgYXBwIOaWueazle+8jOWPr+S7peWcqCBhcHAudHMg5LitIGNhbGxiYWNrIOS7pemYsuatoui/meenjeaDheWGtVxyXG4gICAgICBhcHAudXNlckluZm9SZWFkeUNhbGxiYWNrID0gKHJlcykgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgaGFzVXNlckluZm86IHRydWVcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyDlnKjmsqHmnIkgb3Blbi10eXBlPWdldFVzZXJJbmZvIOeJiOacrOeahOWFvOWuueWkhOeQhlxyXG4gICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgIGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvID0gcmVzLnVzZXJJbmZvXHJcbiAgICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgICAgdXNlckluZm86IHJlcy51c2VySW5mbyxcclxuICAgICAgICAgICAgaGFzVXNlckluZm86IHRydWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLm9wZW5JZCkge1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBhdXRob3JpemVkOiBhcHAuZ2xvYmFsRGF0YS5hdXRob3JpemVkXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcHAuc2Vzc2lvbkluZm9SZWFkeUNhbGxiYWNrID0gKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGF1dGhvcml6ZWQ6IGRhdGEuYXV0aG9yaXplZFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIG9uU2hvdygpIHtcclxuICAgIGlmICghdGhpcy5kYXRhLmhhc1VzZXJJbmZvICYmIGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5hdXRob3JpemVkICYmIGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgYXV0aG9yaXplZDogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8g5LqL5Lu25aSE55CG5Ye95pWwXHJcbiAgYmluZEF1dGhvcml6ZVRhcChlKSB7XHJcbiAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICB1cmw6ICcvcGFnZXMvcHJvZmlsZS9wcm9maWxlJ1xyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiJdfQ==