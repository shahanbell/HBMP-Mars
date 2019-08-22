import * as echarts from '../../component/ec-canvas/echarts';



const option = {
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

}

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    chartTitle: '销售金额达成率'
  },
  onLoad() {
    this.ecComponent = this.selectComponent('#mychart')
    this.ecInit()//获取数据
    setTimeout(() => {
      this.loadData()
    }, 5000);
  },
  onReady() {

  },
  ecInit() {
    this.ecComponent.init((canvas, width, height) => {
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.showLoading();
      chart.setOption(option)
      // 注册chart对象
      this.chart = chart;
      // 返回 chart 实例
      return chart;
    });
  },
  loadData() {
    if (this.chart) {
      this.chart.hideLoading();
      this.chart.setOption({ series: [{ max: 2000, data: [{ value: 120, name: '达成率' }] }] })
    } else {
      console.log('!this.chart')
    }
  }
})
