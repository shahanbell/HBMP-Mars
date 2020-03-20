"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var echarts = require("../../component/ec-canvas/echarts");
var option = {
    title: {
        text: '8月销售金额达成(万元)'
    },
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
            name: '业务指标',
            type: 'gauge',
            min: 0,
            max: 0,
            detail: {
                formatter: '0%'
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 30,
                    shadowBlur: 0,
                    color: [
                        [0.6, '#88d2ac'],
                        [0.8, '#37a2da'],
                        [1.0, '#fd666d']
                    ]
                }
            },
            data: []
        }]
};
Page({
    data: {
        ec: {
            lazyLoad: true
        },
        chartTitle: '销售金额达成率'
    },
    onLoad: function () {
        var _this = this;
        this.ecComponent = this.selectComponent('#mychart');
        this.ecInit();
        setTimeout(function () {
            _this.loadData();
        }, 5000);
    },
    onReady: function () {
    },
    ecInit: function () {
        var _this = this;
        this.ecComponent.init(function (canvas, width, height) {
            var chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            chart.showLoading();
            chart.setOption(option);
            _this.chart = chart;
            return chart;
        });
    },
    loadData: function () {
        if (this.chart) {
            this.chart.hideLoading();
            this.chart.setOption({ series: [{ max: 2000, data: [{ value: 120, name: '达成率' }] }] });
        }
        else {
            console.log('!this.chart');
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNoYXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQTZEO0FBSTdELElBQU0sTUFBTSxHQUFHO0lBQ2IsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGNBQWM7S0FDckI7SUFDRCxLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztJQUN4QyxNQUFNLEVBQUUsQ0FBQztZQUNQLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLE9BQU87WUFDYixHQUFHLEVBQUUsQ0FBQztZQUNOLEdBQUcsRUFBRSxDQUFDO1lBQ04sTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRSxJQUFJO2dCQUNWLFNBQVMsRUFBRTtvQkFDVCxLQUFLLEVBQUUsRUFBRTtvQkFDVCxVQUFVLEVBQUUsQ0FBQztvQkFDYixLQUFLLEVBQUU7d0JBQ0wsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDO3dCQUNoQixDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7d0JBQ2hCLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQztxQkFDakI7aUJBQ0Y7YUFDRjtZQUNELElBQUksRUFBRSxFQUFFO1NBRVQsQ0FBQztDQUVILENBQUE7QUFFRCxJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixFQUFFLEVBQUU7WUFDRixRQUFRLEVBQUUsSUFBSTtTQUNmO1FBQ0QsVUFBVSxFQUFFLFNBQVM7S0FDdEI7SUFDRCxNQUFNO1FBQU4saUJBTUM7UUFMQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ2IsVUFBVSxDQUFDO1lBQ1QsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ2pCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxPQUFPO0lBRVAsQ0FBQztJQUNELE1BQU07UUFBTixpQkFjQztRQWJDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNO1lBRTFDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFDdkMsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUV2QixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUVuQixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBQ3ZGO2FBQU07WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1NBQzNCO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjaGFydHMgZnJvbSAnLi4vLi4vY29tcG9uZW50L2VjLWNhbnZhcy9lY2hhcnRzJztcclxuXHJcblxyXG5cclxuY29uc3Qgb3B0aW9uID0ge1xyXG4gIHRpdGxlOiB7XHJcbiAgICB0ZXh0OiAnOOaciOmUgOWUrumHkeminei+vuaIkCjkuIflhYMpJ1xyXG4gIH0sXHJcbiAgY29sb3I6IFtcIiMzN0EyREFcIiwgXCIjMzJDNUU5XCIsIFwiIzY3RTBFM1wiXSxcclxuICBzZXJpZXM6IFt7XHJcbiAgICBuYW1lOiAn5Lia5Yqh5oyH5qCHJyxcclxuICAgIHR5cGU6ICdnYXVnZScsXHJcbiAgICBtaW46IDAsXHJcbiAgICBtYXg6IDAsXHJcbiAgICBkZXRhaWw6IHtcclxuICAgICAgZm9ybWF0dGVyOiAnMCUnXHJcbiAgICB9LFxyXG4gICAgYXhpc0xpbmU6IHtcclxuICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIHNoYWRvd0JsdXI6IDAsXHJcbiAgICAgICAgY29sb3I6IFtcclxuICAgICAgICAgIFswLjYsICcjODhkMmFjJ10sXHJcbiAgICAgICAgICBbMC44LCAnIzM3YTJkYSddLFxyXG4gICAgICAgICAgWzEuMCwgJyNmZDY2NmQnXVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRhdGE6IFtdXHJcblxyXG4gIH1dXHJcblxyXG59XHJcblxyXG5QYWdlKHtcclxuICBkYXRhOiB7XHJcbiAgICBlYzoge1xyXG4gICAgICBsYXp5TG9hZDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGNoYXJ0VGl0bGU6ICfplIDllK7ph5Hpop3ovr7miJDnjocnXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICB0aGlzLmVjQ29tcG9uZW50ID0gdGhpcy5zZWxlY3RDb21wb25lbnQoJyNteWNoYXJ0JylcclxuICAgIHRoaXMuZWNJbml0KCkvL+iOt+WPluaVsOaNrlxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMubG9hZERhdGEoKVxyXG4gICAgfSwgNTAwMCk7XHJcbiAgfSxcclxuICBvblJlYWR5KCkge1xyXG5cclxuICB9LFxyXG4gIGVjSW5pdCgpIHtcclxuICAgIHRoaXMuZWNDb21wb25lbnQuaW5pdCgoY2FudmFzLCB3aWR0aCwgaGVpZ2h0KSA9PiB7XHJcbiAgICAgIC8vIOWcqOi/memHjOWIneWni+WMluWbvuihqFxyXG4gICAgICBjb25zdCBjaGFydCA9IGVjaGFydHMuaW5pdChjYW52YXMsIG51bGwsIHtcclxuICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHRcclxuICAgICAgfSk7XHJcbiAgICAgIGNoYXJ0LnNob3dMb2FkaW5nKCk7XHJcbiAgICAgIGNoYXJ0LnNldE9wdGlvbihvcHRpb24pXHJcbiAgICAgIC8vIOazqOWGjGNoYXJ05a+56LGhXHJcbiAgICAgIHRoaXMuY2hhcnQgPSBjaGFydDtcclxuICAgICAgLy8g6L+U5ZueIGNoYXJ0IOWunuS+i1xyXG4gICAgICByZXR1cm4gY2hhcnQ7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGxvYWREYXRhKCkge1xyXG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcclxuICAgICAgdGhpcy5jaGFydC5oaWRlTG9hZGluZygpO1xyXG4gICAgICB0aGlzLmNoYXJ0LnNldE9wdGlvbih7IHNlcmllczogW3sgbWF4OiAyMDAwLCBkYXRhOiBbeyB2YWx1ZTogMTIwLCBuYW1lOiAn6L6+5oiQ546HJyB9XSB9XSB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJyF0aGlzLmNoYXJ0JylcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==