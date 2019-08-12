"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var echarts = require("../../component/ec-canvas/echarts");
function initChart(canvas, width, height) {
    var chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);
    var option = {
        backgroundColor: "#ffffff",
        color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
        series: [{
                label: {
                    normal: {
                        fontSize: 14
                    }
                },
                type: 'pie',
                center: ['50%', '50%'],
                radius: [0, '60%'],
                data: [{
                        value: 55,
                        name: '北京'
                    }, {
                        value: 20,
                        name: '武汉'
                    }, {
                        value: 10,
                        name: '杭州'
                    }, {
                        value: 20,
                        name: '广州'
                    }, {
                        value: 38,
                        name: '上海'
                    },
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 2, 2, 0.3)'
                    }
                }
            }]
    };
    chart.setOption(option);
    return chart;
}
Page({
    data: {
        ec: {
            onInit: initChart
        }
    }, onReady: function () {
    },
    echartInit: function (e) {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNoYXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQTZEO0FBRTdELFNBQVMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTTtJQUN0QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7UUFDdkMsS0FBSyxFQUFFLEtBQUs7UUFDWixNQUFNLEVBQUUsTUFBTTtLQUNmLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsSUFBSSxNQUFNLEdBQUc7UUFDWCxlQUFlLEVBQUUsU0FBUztRQUMxQixLQUFLLEVBQUUsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztRQUN6RSxNQUFNLEVBQUUsQ0FBQztnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsTUFBTSxFQUFFO3dCQUNOLFFBQVEsRUFBRSxFQUFFO3FCQUNiO2lCQUNGO2dCQUNELElBQUksRUFBRSxLQUFLO2dCQUNYLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7Z0JBQ3RCLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLElBQUksRUFBRSxDQUFDO3dCQUNMLEtBQUssRUFBRSxFQUFFO3dCQUNULElBQUksRUFBRSxJQUFJO3FCQUNYLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsSUFBSSxFQUFFLElBQUk7cUJBQ1gsRUFBRTt3QkFDRCxLQUFLLEVBQUUsRUFBRTt3QkFDVCxJQUFJLEVBQUUsSUFBSTtxQkFDWCxFQUFFO3dCQUNELEtBQUssRUFBRSxFQUFFO3dCQUNULElBQUksRUFBRSxJQUFJO3FCQUNYLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsSUFBSSxFQUFFLElBQUk7cUJBQ1g7aUJBQ0E7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULFFBQVEsRUFBRTt3QkFDUixVQUFVLEVBQUUsRUFBRTt3QkFDZCxhQUFhLEVBQUUsQ0FBQzt3QkFDaEIsV0FBVyxFQUFFLG9CQUFvQjtxQkFDbEM7aUJBQ0Y7YUFDRixDQUFDO0tBQ0gsQ0FBQztJQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEIsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBQ0QsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osRUFBRSxFQUFFO1lBQ0YsTUFBTSxFQUFFLFNBQVM7U0FDbEI7S0FDRixFQUFFLE9BQU87SUFFVixDQUFDO0lBQ0QsVUFBVSxZQUFDLENBQUM7SUFFWixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWNoYXJ0cyBmcm9tICcuLi8uLi9jb21wb25lbnQvZWMtY2FudmFzL2VjaGFydHMnO1xuXG5mdW5jdGlvbiBpbml0Q2hhcnQoY2FudmFzLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIGNvbnN0IGNoYXJ0ID0gZWNoYXJ0cy5pbml0KGNhbnZhcywgbnVsbCwge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9KTtcbiAgY2FudmFzLnNldENoYXJ0KGNoYXJ0KTtcbiAgdmFyIG9wdGlvbiA9IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2ZmZmZmZlwiLFxuICAgIGNvbG9yOiBbXCIjMzdBMkRBXCIsIFwiIzMyQzVFOVwiLCBcIiM2N0UwRTNcIiwgXCIjOTFGMkRFXCIsIFwiI0ZGREI1Q1wiLCBcIiNGRjlGN0ZcIl0sXG4gICAgc2VyaWVzOiBbe1xuICAgICAgbGFiZWw6IHtcbiAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgZm9udFNpemU6IDE0XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0eXBlOiAncGllJyxcbiAgICAgIGNlbnRlcjogWyc1MCUnLCAnNTAlJ10sXG4gICAgICByYWRpdXM6IFswLCAnNjAlJ10sXG4gICAgICBkYXRhOiBbe1xuICAgICAgICB2YWx1ZTogNTUsXG4gICAgICAgIG5hbWU6ICfljJfkuqwnXG4gICAgICB9LCB7XG4gICAgICAgIHZhbHVlOiAyMCxcbiAgICAgICAgbmFtZTogJ+atpuaxiSdcbiAgICAgIH0sIHtcbiAgICAgICAgdmFsdWU6IDEwLFxuICAgICAgICBuYW1lOiAn5p2t5beeJ1xuICAgICAgfSwge1xuICAgICAgICB2YWx1ZTogMjAsXG4gICAgICAgIG5hbWU6ICflub/lt54nXG4gICAgICB9LCB7XG4gICAgICAgIHZhbHVlOiAzOCxcbiAgICAgICAgbmFtZTogJ+S4iua1tydcbiAgICAgIH0sXG4gICAgICBdLFxuICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgIGVtcGhhc2lzOiB7XG4gICAgICAgICAgc2hhZG93Qmx1cjogMTAsXG4gICAgICAgICAgc2hhZG93T2Zmc2V0WDogMCxcbiAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMiwgMiwgMC4zKSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1dXG4gIH07XG4gIGNoYXJ0LnNldE9wdGlvbihvcHRpb24pO1xuICByZXR1cm4gY2hhcnQ7XG59XG5QYWdlKHtcbiAgZGF0YToge1xuICAgIGVjOiB7XG4gICAgICBvbkluaXQ6IGluaXRDaGFydFxuICAgIH1cbiAgfSwgb25SZWFkeSgpIHtcblxuICB9LFxuICBlY2hhcnRJbml0KGUpIHtcbiAgICAvL2luaXRDaGFydChlLmRldGFpbC5jYW52YXMsIGUuZGV0YWlsLndpZHRoLCBlLmRldGFpbC5oZWlnaHQpO1xuICB9XG59KVxuIl19