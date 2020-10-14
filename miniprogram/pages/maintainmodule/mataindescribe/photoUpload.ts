import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()

Page({
  data: {
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    maintainType: '',
    maintainNumber: '',
    photoInfo: [],
    remark: "",
    addressView: '',
    addressNameView: '',
    maintainDescribe: ''
  },
  // 删除图片
  clearImg: function (e) {
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据

    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
  },
  //上传图片
  upload: function (e) {
    var that = this;
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
        });
        //放入缓存
        wx.setStorage({
          key: 'maintainPhoto',
          data: that.data.uploaderList
        })
        wx.setStorage({
          key: 'maintainNumber',
          data: that.data.maintainType + that.data.maintainNumber
        })
      }
    })
  },
  //提交
  eqpRepairFormSubmit: function (e) {
    var that = this;
    var canSubmit = true
    var errmsg = '';
    if (!app.globalData.authorized) {
      canSubmit = false;
      errmsg += '账号未授权\r\n';
    }
    if (canSubmit) {
      const FileSystemManager = that.data.uploaderList;
      that.fileUpLoadByQueue(FileSystemManager, 0);
    }
  },
  fileUpLoadByQueue: function (file, i) {
    var that = this;
    if (i == this.data.uploaderList.length) {
      //清空缓存
      wx.setStorage({
        key: 'maintainPhoto',
        data: {}
      })
      wx.setStorage({
        key: 'maintainNumber',
        data: {}
      })
      wx.request({
        url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/dupld/uploadEqpRepairPic',
        method: 'POST',
        data: {
          entityList: that.data.photoInfo,
          sessionkey: app.globalData.sessionKey
          openid: app.globalData.openId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code == 500) {

          } else {
            wx.navigateTo({
              url: '/pages/maintainmodule/mataindescribe/maintainDescribe?addressView=' + that.data.addressView + '&addressNameView=' + that.data.addressNameView + '&maintainDescribe=' + that.data.maintainDescribe
            })
          }
        }
      })

    }
    wx.showLoading({
      title: "图片[" + i + "]上传中...",
      mask: true
    });

    wx.uploadFile({
      url: 'https://i2.hanbell.com.cn/FileUploadServer/FileUploadServlet',
      filePath: file[i],
      name: 'file',
      success: function (res) {
        var obj = new Object();
        var data = JSON.parse(unescape(res.data))
        that.data.photoInfo.push(
          {
            maintainType: that.data.maintainType,
            maintainNumber: that.data.maintainNumber,
            employeeId: app.globalData.employeeId,
            uuid: data.files[0].uid,
            url: data.files[0].url,
            filename: data.files[0].name,
            company: app.globalData.defaultCompany,
          }
        )
        that.fileUpLoadByQueue(file, i + 1);
      }
    });

  },
  onLoad(option) {
    var that = this;
    that.setData!({
      maintainType: option.maintainType,
      maintainNumber: option.maintainNumber,
      addressView: option.addressView,
      addressNameView: option.addressNameView,
      maintainDescribe: option.maintainDescribe,
    })
    var m = that.data.maintainType + that.data.maintainNumber
    wx.getStorage({
      key: 'maintainNumber',
      success: function (res) {
        console.info("res==" + JSON.stringify(res.data))
        if (m == res.data) {
          wx.getStorage({
            key: 'maintainPhoto',
            success: function (r) {
              console.info("缓存中的图片有=" + JSON.stringify(r.data))
              that.setData!({
                uploaderList: r.data
              })
            }
          })
        }
      }
    })
  },
  onShow() {
  },
})
