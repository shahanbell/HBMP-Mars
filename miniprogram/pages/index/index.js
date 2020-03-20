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
        menu: [],
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
        if (app.globalData.auth) {
            var arr = Authotities();
            this.setData({
                menu: arr
            });
        }
        else {
            app.sessionInfoReadyCallback = function (data) {
                var arr = Authotities();
                _this.setData({
                    menu: arr
                });
            };
        }
        function Authotities() {
            var list = app.globalData.auth;
            var array = [];
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            var routepage = currentPage.route;
            list.forEach(function (val, idx, arr) {
                if (val.pageroute == routepage) {
                    array.push(val);
                }
            });
            return array;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBRTVCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFVBQVUsRUFBRSxLQUFLO1FBQ2pCLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ25ELE9BQU8sRUFBRTtZQUNQLGlFQUFpRTtZQUNqRSxpRUFBaUU7WUFDakUsaUVBQWlFO1NBQ2xFO1FBQ0QsSUFBSSxFQUFFLEVBQUU7UUFDUixhQUFhLEVBQUUsS0FBSztRQUNwQixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLElBQUk7S0FDZjtJQUNELE1BQU07UUFBTixpQkFnRUM7UUEvREMsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUc1QixHQUFHLENBQUMscUJBQXFCLEdBQUcsVUFBQyxHQUFHO2dCQUM5QixLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFdBQVcsRUFBRSxJQUFJO2lCQUNsQixDQUFDLENBQUE7WUFDSixDQUFDLENBQUE7U0FDRjthQUFNO1lBRUwsRUFBRSxDQUFDLFdBQVcsQ0FBQztnQkFDYixPQUFPLEVBQUUsVUFBQSxHQUFHO29CQUNWLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUE7b0JBQ3RDLEtBQUksQ0FBQyxPQUFRLENBQUM7d0JBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO3dCQUN0QixXQUFXLEVBQUUsSUFBSTtxQkFDbEIsQ0FBQyxDQUFBO2dCQUNKLENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtRQUNELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDekIsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVO2FBQ3RDLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxHQUFHLENBQUMsd0JBQXdCLEdBQUcsVUFBQyxJQUFJO2dCQUNsQyxLQUFJLENBQUMsT0FBUSxDQUFDO29CQUNaLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtpQkFDNUIsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFBO1NBQ0Y7UUFFRCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ3ZCLElBQUksR0FBRyxHQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFRLENBQUM7Z0JBQ1osSUFBSSxFQUFFLEdBQUc7YUFDVixDQUFDLENBQUE7U0FDSDthQUFNO1lBQ0wsR0FBRyxDQUFDLHdCQUF3QixHQUFHLFVBQUMsSUFBSTtnQkFDbEMsSUFBSSxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUM7Z0JBQ3hCLEtBQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osSUFBSSxFQUFFLEdBQUc7aUJBQ1YsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFBO1NBQ0Y7UUFDRCxTQUFTLFdBQVc7WUFDbEIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDL0IsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsSUFBSSxLQUFLLEdBQUcsZUFBZSxFQUFFLENBQUE7WUFDN0IsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFDekMsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO2dCQUN6QixJQUFJLEdBQUcsQ0FBQyxTQUFTLElBQUksU0FBUyxFQUFFO29CQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNqQjtZQUNILENBQUMsQ0FBQyxDQUFBO1lBQ0osT0FBTyxLQUFLLENBQUM7UUFDYixDQUFDO0lBRUgsQ0FBQztJQUNELE1BQU07UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDckQsSUFBSSxDQUFDLE9BQVEsQ0FBQztnQkFDWixXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUE7U0FDSDtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRTtZQUN0RCxJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNaLFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQztJQUVELGdCQUFnQixZQUFDLENBQUM7UUFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNYLEdBQUcsRUFBRSx3QkFBd0I7U0FDOUIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vaW5kZXguanNcclxuLy/ojrflj5blupTnlKjlrp7kvotcclxuaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJ1xyXG5cclxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxyXG5cclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgaGFzVXNlckluZm86IGZhbHNlLFxyXG4gICAgYXV0aG9yaXplZDogZmFsc2UsXHJcbiAgICBjYW5JVXNlOiB3eC5jYW5JVXNlKCdidXR0b24ub3Blbi10eXBlLmdldFVzZXJJbmZvJyksXHJcbiAgICBpbWdVcmxzOiBbXHJcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MTMzNDc4Ny0yMWU2YmQzYWIxMzU/dz02NDAnLFxyXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTEyMTQwMTItODRmOTVlMDYwZGVlP3c9NjQwJyxcclxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUxNDQ2NTkxLTE0Mjg3NWE5MDFhMT93PTY0MCdcclxuICAgIF0sXHJcbiAgICBtZW51OiBbXSxcclxuICAgIGluZGljYXRvckRvdHM6IGZhbHNlLFxyXG4gICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICBpbnRlcnZhbDogNTAwMCxcclxuICAgIGR1cmF0aW9uOiAxMDAwXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICBpZiAoYXBwLmdsb2JhbERhdGEudXNlckluZm8pIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgaGFzVXNlckluZm86IHRydWVcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhLmNhbklVc2UpIHtcclxuICAgICAgLy8g55Sx5LqOIGdldFVzZXJJbmZvIOaYr+e9kee7nOivt+axgu+8jOWPr+iDveS8muWcqCBQYWdlLm9uTG9hZCDkuYvlkI7miY3ov5Tlm55cclxuICAgICAgLy8g5omA5Lul5q2k5aSE5Yqg5YWlIGFwcCDmlrnms5XvvIzlj6/ku6XlnKggYXBwLnRzIOS4rSBjYWxsYmFjayDku6XpmLLmraLov5nnp43mg4XlhrVcclxuICAgICAgYXBwLnVzZXJJbmZvUmVhZHlDYWxsYmFjayA9IChyZXMpID0+IHtcclxuICAgICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8g5Zyo5rKh5pyJIG9wZW4tdHlwZT1nZXRVc2VySW5mbyDniYjmnKznmoTlhbzlrrnlpITnkIZcclxuICAgICAgd3guZ2V0VXNlckluZm8oe1xyXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xyXG4gICAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICAgIHVzZXJJbmZvOiByZXMudXNlckluZm8sXHJcbiAgICAgICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIGlmIChhcHAuZ2xvYmFsRGF0YS5vcGVuSWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgYXV0aG9yaXplZDogYXBwLmdsb2JhbERhdGEuYXV0aG9yaXplZFxyXG4gICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXBwLnNlc3Npb25JbmZvUmVhZHlDYWxsYmFjayA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBhdXRob3JpemVkOiBkYXRhLmF1dGhvcml6ZWRcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFwcC5nbG9iYWxEYXRhLmF1dGgpIHtcclxuICAgICAgdmFyIGFycj1BdXRob3RpdGllcygpO1xyXG4gICAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgICBtZW51OiBhcnJcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFwcC5zZXNzaW9uSW5mb1JlYWR5Q2FsbGJhY2sgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHZhciBhcnIgPSBBdXRob3RpdGllcygpO1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgbWVudTogYXJyXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gQXV0aG90aXRpZXMoKSB7XHJcbiAgICAgIGxldCBsaXN0ID0gYXBwLmdsb2JhbERhdGEuYXV0aDtcclxuICAgICAgbGV0IGFycmF5ID0gW107XHJcbiAgICAgIHZhciBwYWdlcyA9IGdldEN1cnJlbnRQYWdlcygpXHJcbiAgICAgIHZhciBjdXJyZW50UGFnZSA9IHBhZ2VzW3BhZ2VzLmxlbmd0aCAtIDFdXHJcbiAgICAgIHZhciByb3V0ZXBhZ2UgPSBjdXJyZW50UGFnZS5yb3V0ZTtcclxuICAgICAgbGlzdC5mb3JFYWNoKCh2YWwsIGlkeCwgYXJyKSA9PiB7XHJcbiAgICAgICAgaWYgKHZhbC5wYWdlcm91dGUgPT0gcm91dGVwYWdlKSB7XHJcbiAgICAgICAgICBhcnJheS5wdXNoKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG5cclxuICB9LFxyXG4gIG9uU2hvdygpIHtcclxuICAgIGlmICghdGhpcy5kYXRhLmhhc1VzZXJJbmZvICYmIGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XHJcbiAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuZGF0YS5hdXRob3JpemVkICYmIGFwcC5nbG9iYWxEYXRhLmF1dGhvcml6ZWQpIHtcclxuICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgYXV0aG9yaXplZDogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8g5LqL5Lu25aSE55CG5Ye95pWwXHJcbiAgYmluZEF1dGhvcml6ZVRhcChlKSB7XHJcbiAgICB3eC5zd2l0Y2hUYWIoe1xyXG4gICAgICB1cmw6ICcvcGFnZXMvcHJvZmlsZS9wcm9maWxlJ1xyXG4gICAgfSlcclxuICB9XHJcbn0pXHJcbiJdfQ==