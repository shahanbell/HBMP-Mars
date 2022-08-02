//index.js
//获取应用实例
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()

Page({
  data: {
    menu: [
      { id: 'menu01', name: '维修单', imgUrl: '../../images/mantainbody.png', url: '/pages/maintain/maintain', parentid: -1 },
      { id: 'menu02', name: '维修描述', imgUrl: '../../images/maintaindescribe.png', url: '/pages/maintainmodule/mataindescribe/maintainDescribe', parentid: -1 },
      ]
  },
  onLoad(option) {
 
  },
  onShow() {
 
  },
})
