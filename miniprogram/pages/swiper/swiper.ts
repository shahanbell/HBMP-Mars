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
  changeIndicatoDots(e) {
    this.setData!({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData!({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData!({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData!({
      duration: e.detail.value
    })
  }
})
