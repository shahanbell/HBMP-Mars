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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNoYXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQTZEO0FBSTdELElBQU0sTUFBTSxHQUFHO0lBQ2IsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLGNBQWM7S0FDckI7SUFDRCxLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztJQUN4QyxNQUFNLEVBQUUsQ0FBQztZQUNQLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLE9BQU87WUFDYixHQUFHLEVBQUUsQ0FBQztZQUNOLEdBQUcsRUFBRSxDQUFDO1lBQ04sTUFBTSxFQUFFO2dCQUNOLFNBQVMsRUFBRSxJQUFJO2FBQ2hCO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRSxJQUFJO2dCQUNWLFNBQVMsRUFBRTtvQkFDVCxLQUFLLEVBQUUsRUFBRTtvQkFDVCxVQUFVLEVBQUUsQ0FBQztvQkFDYixLQUFLLEVBQUU7d0JBQ0wsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDO3dCQUNoQixDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7d0JBQ2hCLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQztxQkFDakI7aUJBQ0Y7YUFDRjtZQUNELElBQUksRUFBRSxFQUFFO1NBRVQsQ0FBQztDQUVILENBQUE7QUFFRCxJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixFQUFFLEVBQUU7WUFDRixRQUFRLEVBQUUsSUFBSTtTQUNmO1FBQ0QsVUFBVSxFQUFFLFNBQVM7S0FDdEI7SUFDRCxNQUFNO1FBQU4saUJBTUM7UUFMQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ2IsVUFBVSxDQUFDO1lBQ1QsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ2pCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxPQUFPO0lBRVAsQ0FBQztJQUNELE1BQU07UUFBTixpQkFjQztRQWJDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNO1lBRTFDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFDdkMsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUV2QixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUVuQixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBQ3ZGO2FBQU07WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1NBQzNCO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjaGFydHMgZnJvbSAnLi4vLi4vY29tcG9uZW50L2VjLWNhbnZhcy9lY2hhcnRzJztcblxuXG5cbmNvbnN0IG9wdGlvbiA9IHtcbiAgdGl0bGU6IHtcbiAgICB0ZXh0OiAnOOaciOmUgOWUrumHkeminei+vuaIkCjkuIflhYMpJ1xuICB9LFxuICBjb2xvcjogW1wiIzM3QTJEQVwiLCBcIiMzMkM1RTlcIiwgXCIjNjdFMEUzXCJdLFxuICBzZXJpZXM6IFt7XG4gICAgbmFtZTogJ+S4muWKoeaMh+aghycsXG4gICAgdHlwZTogJ2dhdWdlJyxcbiAgICBtaW46IDAsXG4gICAgbWF4OiAwLFxuICAgIGRldGFpbDoge1xuICAgICAgZm9ybWF0dGVyOiAnMCUnXG4gICAgfSxcbiAgICBheGlzTGluZToge1xuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIGxpbmVTdHlsZToge1xuICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgIHNoYWRvd0JsdXI6IDAsXG4gICAgICAgIGNvbG9yOiBbXG4gICAgICAgICAgWzAuNiwgJyM4OGQyYWMnXSxcbiAgICAgICAgICBbMC44LCAnIzM3YTJkYSddLFxuICAgICAgICAgIFsxLjAsICcjZmQ2NjZkJ11cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0sXG4gICAgZGF0YTogW11cblxuICB9XVxuXG59XG5cblBhZ2Uoe1xuICBkYXRhOiB7XG4gICAgZWM6IHtcbiAgICAgIGxhenlMb2FkOiB0cnVlXG4gICAgfSxcbiAgICBjaGFydFRpdGxlOiAn6ZSA5ZSu6YeR6aKd6L6+5oiQ546HJ1xuICB9LFxuICBvbkxvYWQoKSB7XG4gICAgdGhpcy5lY0NvbXBvbmVudCA9IHRoaXMuc2VsZWN0Q29tcG9uZW50KCcjbXljaGFydCcpXG4gICAgdGhpcy5lY0luaXQoKS8v6I635Y+W5pWw5o2uXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmxvYWREYXRhKClcbiAgICB9LCA1MDAwKTtcbiAgfSxcbiAgb25SZWFkeSgpIHtcblxuICB9LFxuICBlY0luaXQoKSB7XG4gICAgdGhpcy5lY0NvbXBvbmVudC5pbml0KChjYW52YXMsIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgIC8vIOWcqOi/memHjOWIneWni+WMluWbvuihqFxuICAgICAgY29uc3QgY2hhcnQgPSBlY2hhcnRzLmluaXQoY2FudmFzLCBudWxsLCB7XG4gICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgIH0pO1xuICAgICAgY2hhcnQuc2hvd0xvYWRpbmcoKTtcbiAgICAgIGNoYXJ0LnNldE9wdGlvbihvcHRpb24pXG4gICAgICAvLyDms6jlhoxjaGFydOWvueixoVxuICAgICAgdGhpcy5jaGFydCA9IGNoYXJ0O1xuICAgICAgLy8g6L+U5ZueIGNoYXJ0IOWunuS+i1xuICAgICAgcmV0dXJuIGNoYXJ0O1xuICAgIH0pO1xuICB9LFxuICBsb2FkRGF0YSgpIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5oaWRlTG9hZGluZygpO1xuICAgICAgdGhpcy5jaGFydC5zZXRPcHRpb24oeyBzZXJpZXM6IFt7IG1heDogMjAwMCwgZGF0YTogW3sgdmFsdWU6IDEyMCwgbmFtZTogJ+i+vuaIkOeOhycgfV0gfV0gfSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJyF0aGlzLmNoYXJ0JylcbiAgICB9XG4gIH1cbn0pXG4iXX0=