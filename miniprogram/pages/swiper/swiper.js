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
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3dpcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RCxJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUU7WUFDUCxpRUFBaUU7WUFDakUsaUVBQWlFO1lBQ2pFLGlFQUFpRTtTQUNsRTtRQUNELGFBQWEsRUFBRSxLQUFLO1FBQ3BCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRTtZQUNSLFNBQVMsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPO1NBQ25HO0tBQ0Y7SUFDRCxrQkFBa0IsWUFBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7U0FDeEMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELGNBQWMsWUFBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNaLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtTQUM5QixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsY0FBYyxFQUFFLFVBQVUsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUN6QixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsY0FBYyxZQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osUUFBUSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztTQUN6QixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICBpbWdVcmxzOiBbXG4gICAgICAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1NTEzMzQ3ODctMjFlNmJkM2FiMTM1P3c9NjQwJyxcbiAgICAgICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU1MTIxNDAxMi04NGY5NWUwNjBkZWU/dz02NDAnLFxuICAgICAgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTUxNDQ2NTkxLTE0Mjg3NWE5MDFhMT93PTY0MCdcbiAgICBdLFxuICAgIGluZGljYXRvckRvdHM6IGZhbHNlLFxuICAgIGF1dG9wbGF5OiBmYWxzZSxcbiAgICBpbnRlcnZhbDogNTAwMCxcbiAgICBkdXJhdGlvbjogMTAwMCxcbiAgICBpY29uVHlwZTogW1xuICAgICAgJ3N1Y2Nlc3MnLCAnc3VjY2Vzc19ub19jaXJjbGUnLCAnaW5mbycsICd3YXJuJywgJ3dhaXRpbmcnLCAnY2FuY2VsJywgJ2Rvd25sb2FkJywgJ3NlYXJjaCcsICdjbGVhcidcbiAgICBdXG4gIH0sXG4gIGNoYW5nZUluZGljYXRvRG90cyhlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBpbmRpY2F0b3JEb3RzOiAhdGhpcy5kYXRhLmluZGljYXRvckRvdHNcbiAgICB9KVxuICB9LFxuICBjaGFuZ2VBdXRvcGxheShlKSB7XG4gICAgdGhpcy5zZXREYXRhISh7XG4gICAgICBhdXRvcGxheTogIXRoaXMuZGF0YS5hdXRvcGxheVxuICAgIH0pXG4gIH0sXG4gIGludGVydmFsQ2hhbmdlOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgaW50ZXJ2YWw6IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfSxcbiAgZHVyYXRpb25DaGFuZ2UoZSkge1xuICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgZHVyYXRpb246IGUuZGV0YWlsLnZhbHVlXG4gICAgfSlcbiAgfVxufSlcbiJdfQ==