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
            { id: 'menu01', name: '请假', imgUrl: '../../images/outline_date_range_blue_24dp.png', url: '/pages/leave/leave' },
            { id: 'menu02', name: '加班', imgUrl: '../../images/outline_work_outline_orange_24dp.png', url: '/pages/overtime/overtime' },
            { id: 'menu03', name: '出差', imgUrl: 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640', url: '/pages/pie/index' },
            { id: 'menu04', name: '厂商', imgUrl: 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640', url: '/pages/form/form' },
            { id: 'menu05', name: '请购', imgUrl: 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640', url: '/pages/form/form' },
            { id: 'menu06', name: '采购', imgUrl: 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640', url: '/pages/form/form' }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBRTVCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELE9BQU8sRUFBRTtZQUNQLGlFQUFpRTtZQUNqRSxpRUFBaUU7WUFDakUsaUVBQWlFO1NBQ2xFO1FBQ0QsSUFBSSxFQUFFO1lBQ0osRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLCtDQUErQyxFQUFFLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtZQUNoSCxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsbURBQW1ELEVBQUUsR0FBRyxFQUFFLDBCQUEwQixFQUFFO1lBQzFILEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxpRUFBaUUsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7WUFDaEksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGlFQUFpRSxFQUFFLEdBQUcsRUFBRSxrQkFBa0IsRUFBRTtZQUNoSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsaUVBQWlFLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixFQUFFO1lBQ2hJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxpRUFBaUUsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7U0FDakk7UUFDRCxhQUFhLEVBQUUsS0FBSztRQUNwQixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELE1BQU07UUFBTixpQkFvQ0M7UUFuQ0MsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUc1QixHQUFHLENBQUMscUJBQXFCLEdBQUcsVUFBQyxHQUFHO2dCQUM5QixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFdBQVcsRUFBRSxJQUFJO2lCQUNsQixDQUFDLENBQUE7WUFDSixDQUFDLENBQUE7U0FDRjthQUFNO1lBRUwsRUFBRSxDQUFDLFdBQVcsQ0FBQztnQkFDYixPQUFPLEVBQUUsVUFBQSxHQUFHO29CQUNWLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUE7b0JBQ3RDLEtBQUksQ0FBQyxPQUFRLENBQUM7d0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO3dCQUN0QixXQUFXLEVBQUUsSUFBSTtxQkFDbEIsQ0FBQyxDQUFBO2dCQUNKLENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtRQUNELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDekIsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2FBQ3RDLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxHQUFHLENBQUMsd0JBQXdCLEdBQUcsVUFBQyxJQUFJO2dCQUNsQyxLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtpQkFDNUIsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFBO1NBQ0Y7SUFDSCxDQUFDO0lBQ0QsTUFBTTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNyRCxJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQ3RELElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLFlBQUMsQ0FBQztRQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1gsR0FBRyxFQUFFLHdCQUF3QjtTQUM5QixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9pbmRleC5qc1xuLy/ojrflj5blupTnlKjlrp7kvotcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcblxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxuXG5QYWdlKHtcbiAgZGF0YToge1xuICAgIGhhc1VzZXJJbmZvOiBmYWxzZSxcbiAgICBhdXRob3JpemVkOiBmYWxzZSxcbiAgICBjYW5JVXNlOiB3eC5jYW5JVXNlKCdidXR0b24ub3Blbi10eXBlLmdldFVzZXJJbmZvJyksXG4gICAgaW1nVXJsczogW1xuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUxMzM0Nzg3LTIxZTZiZDNhYjEzNT93PTY0MCcsXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTEyMTQwMTItODRmOTVlMDYwZGVlP3c9NjQwJyxcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MTQ0NjU5MS0xNDI4NzVhOTAxYTE/dz02NDAnXG4gICAgXSxcbiAgICBtZW51OiBbXG4gICAgICB7IGlkOiAnbWVudTAxJywgbmFtZTogJ+ivt+WBhycsIGltZ1VybDogJy4uLy4uL2ltYWdlcy9vdXRsaW5lX2RhdGVfcmFuZ2VfYmx1ZV8yNGRwLnBuZycsIHVybDogJy9wYWdlcy9sZWF2ZS9sZWF2ZScgfSxcbiAgICAgIHsgaWQ6ICdtZW51MDInLCBuYW1lOiAn5Yqg54+tJywgaW1nVXJsOiAnLi4vLi4vaW1hZ2VzL291dGxpbmVfd29ya19vdXRsaW5lX29yYW5nZV8yNGRwLnBuZycsIHVybDogJy9wYWdlcy9vdmVydGltZS9vdmVydGltZScgfSxcbiAgICAgIHsgaWQ6ICdtZW51MDMnLCBuYW1lOiAn5Ye65beuJywgaW1nVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTE0NDY1OTEtMTQyODc1YTkwMWExP3c9NjQwJywgdXJsOiAnL3BhZ2VzL3BpZS9pbmRleCcgfSxcbiAgICAgIHsgaWQ6ICdtZW51MDQnLCBuYW1lOiAn5Y6C5ZWGJywgaW1nVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTE0NDY1OTEtMTQyODc1YTkwMWExP3c9NjQwJywgdXJsOiAnL3BhZ2VzL2Zvcm0vZm9ybScgfSxcbiAgICAgIHsgaWQ6ICdtZW51MDUnLCBuYW1lOiAn6K+36LStJywgaW1nVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTE0NDY1OTEtMTQyODc1YTkwMWExP3c9NjQwJywgdXJsOiAnL3BhZ2VzL2Zvcm0vZm9ybScgfSxcbiAgICAgIHsgaWQ6ICdtZW51MDYnLCBuYW1lOiAn6YeH6LStJywgaW1nVXJsOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTE0NDY1OTEtMTQyODc1YTkwMWExP3c9NjQwJywgdXJsOiAnL3BhZ2VzL2Zvcm0vZm9ybScgfVxuICAgIF0sXG4gICAgaW5kaWNhdG9yRG90czogZmFsc2UsXG4gICAgYXV0b3BsYXk6IHRydWUsXG4gICAgaW50ZXJ2YWw6IDUwMDAsXG4gICAgZHVyYXRpb246IDEwMDBcbiAgfSxcbiAgb25Mb2FkKCkge1xuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS51c2VySW5mbykge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhLmNhbklVc2UpIHtcbiAgICAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXG4gICAgICAvLyDmiYDku6XmraTlpITliqDlhaUgYXBwIOaWueazle+8jOWPr+S7peWcqCBhcHAudHMg5LitIGNhbGxiYWNrIOS7pemYsuatoui/meenjeaDheWGtVxuICAgICAgYXBwLnVzZXJJbmZvUmVhZHlDYWxsYmFjayA9IChyZXMpID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5Zyo5rKh5pyJIG9wZW4tdHlwZT1nZXRVc2VySW5mbyDniYjmnKznmoTlhbzlrrnlpITnkIZcbiAgICAgIHd4LmdldFVzZXJJbmZvKHtcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xuICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgdXNlckluZm86IHJlcy51c2VySW5mbyxcbiAgICAgICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLm9wZW5JZCkge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGF1dGhvcml6ZWQ6IGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWRcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGFwcC5zZXNzaW9uSW5mb1JlYWR5Q2FsbGJhY2sgPSAoZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICBhdXRob3JpemVkOiBkYXRhLmF1dGhvcml6ZWRcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG9uU2hvdygpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5oYXNVc2VySW5mbyAmJiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbykge1xuICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoIXRoaXMuZGF0YS5hdXRob3JpemVkICYmIGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICBhdXRob3JpemVkOiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgLy8g5LqL5Lu25aSE55CG5Ye95pWwXG4gIGJpbmRBdXRob3JpemVUYXAoZSkge1xuICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICB1cmw6ICcvcGFnZXMvcHJvZmlsZS9wcm9maWxlJ1xuICAgIH0pXG4gIH1cbn0pXG4iXX0=