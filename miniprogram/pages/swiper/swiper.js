"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Page({
    data: {
        imgUrls: [
            'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
            'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
            'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        iconType: [
            'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
        ]
    },
    changeIndicatoDots: function (e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        });
    },
    changeAutoplay: function (e) {
        this.setData({
            autoplay: !this.data.autoplay
        });
    },
    intervalChange: function (e) {
        this.setData({
            interval: e.detail.value
        });
    },
    durationChange: function (e) {
        this.setData({
            duration: e.detail.value
        });
    },
    bindScanTap: function (e) {
        wx.getSetting({
            success: function (res) {
                if (!res.authSetting['scope.camera']) {
                    wx.authorize({
                        scope: 'scope.camera',
                        success: function () {
                            console.log('用户已经同意小程序使用Camera');
                        }
                    });
                }
                else {
                    wx.scanCode({
                        onlyFromCamera: true,
                        success: function (res) {
                            console.log(res);
                        }
                    });
                }
            }
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3dpcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RCxJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUU7WUFDUCxpRUFBaUU7WUFDakUsaUVBQWlFO1lBQ2pFLGlFQUFpRTtTQUNsRTtRQUNELGFBQWEsRUFBRSxLQUFLO1FBQ3BCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRTtZQUNSLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPO1NBQ25HO0tBQ0Y7SUFDRCxrQkFBa0IsWUFBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7U0FDeEMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELGNBQWMsWUFBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNaLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtTQUM5QixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsY0FBYyxFQUFFLFVBQVUsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUN6QixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsY0FBYyxZQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUN6QixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsV0FBVyxZQUFDLENBQUM7UUFDWCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osT0FBTyxZQUFDLEdBQUc7Z0JBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEVBQUU7b0JBQ3BDLEVBQUUsQ0FBQyxTQUFTLENBQUM7d0JBQ1gsS0FBSyxFQUFFLGNBQWM7d0JBQ3JCLE9BQU87NEJBRUwsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO3dCQUNsQyxDQUFDO3FCQUNGLENBQUMsQ0FBQTtpQkFDSDtxQkFBTTtvQkFDTCxFQUFFLENBQUMsUUFBUSxDQUFDO3dCQUNWLGNBQWMsRUFBRSxJQUFJO3dCQUNwQixPQUFPLFlBQUMsR0FBRzs0QkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO3dCQUNsQixDQUFDO3FCQUNGLENBQUMsQ0FBQTtpQkFDSDtZQUNILENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICBpbWdVcmxzOiBbXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTEzMzQ3ODctMjFlNmJkM2FiMTM1P3c9NjQwJyxcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MTIxNDAxMi04NGY5NWUwNjBkZWU/dz02NDAnLFxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUxNDQ2NTkxLTE0Mjg3NWE5MDFhMT93PTY0MCdcbiAgICBdLFxuICAgIGluZGljYXRvckRvdHM6IGZhbHNlLFxuICAgIGF1dG9wbGF5OiBmYWxzZSxcbiAgICBpbnRlcnZhbDogNTAwMCxcbiAgICBkdXJhdGlvbjogMTAwMCxcbiAgICBpY29uVHlwZTogW1xuICAgICAgJ3N1Y2Nlc3MnLCAnc3VjY2Vzc19ub19jaXJjbGUnLCAnaW5mbycsICd3YXJuJywgJ3dhaXRpbmcnLCAnY2FuY2VsJywgJ2Rvd25sb2FkJywgJ3NlYXJjaCcsICdjbGVhcidcbiAgICBdXG4gIH0sXG4gIGNoYW5nZUluZGljYXRvRG90cyhlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBpbmRpY2F0b3JEb3RzOiAhdGhpcy5kYXRhLmluZGljYXRvckRvdHNcbiAgICB9KVxuICB9LFxuICBjaGFuZ2VBdXRvcGxheShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBhdXRvcGxheTogIXRoaXMuZGF0YS5hdXRvcGxheVxuICAgIH0pXG4gIH0sXG4gIGludGVydmFsQ2hhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgaW50ZXJ2YWw6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgZHVyYXRpb25DaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgZHVyYXRpb246IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgYmluZFNjYW5UYXAoZSkge1xuICAgIHd4LmdldFNldHRpbmcoe1xuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgaWYgKCFyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLmNhbWVyYSddKSB7XG4gICAgICAgICAgd3guYXV0aG9yaXplKHtcbiAgICAgICAgICAgIHNjb3BlOiAnc2NvcGUuY2FtZXJhJyxcbiAgICAgICAgICAgIHN1Y2Nlc3MoKSB7XG4gICAgICAgICAgICAgIC8vIOeUqOaIt+W3sue7j+WQjOaEj+Wwj+eoi+W6j+S9v+eUqENhbWVyYVxuICAgICAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi35bey57uP5ZCM5oSP5bCP56iL5bqP5L2/55SoQ2FtZXJhJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHd4LnNjYW5Db2RlKHtcbiAgICAgICAgICAgIG9ubHlGcm9tQ2FtZXJhOiB0cnVlLFxuICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG59KVxuIl19