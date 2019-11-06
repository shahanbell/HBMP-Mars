import { IMyApp } from '../../app';
import { formatDate } from '../../utils/util';

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    calendarConfig: {
      multi: false,
      defaultDay: d.toISOString().substring(0, 10)
    },
    dataList: [],
    startDays: [] as Date[],
    deptId: null,
    deptName: null,
    leaderId: null,
    leader: null,
    canSubmit: false
  },
  onLoad() {
    wx.showLoading({
      title: 'Loading'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    if (app.globalData.authorized) {
      this.setData!({
        leaderId: app.globalData.employeeId,
        leader: app.globalData.employeeName
      })
    }
    if (app.globalData.defaultDeptId) {
      this.setData!({
        deptId: app.globalData.defaultDeptId,
        deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName
      })
    }
    this.loadData();
  },
  onReady() {
    this.calendar.setTodoLabels({
      // 待办点标记设置
      pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
      dotColor: '#40', // 待办点标记颜色
      // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
      circle: true // 待办
    });
    if (this.data.startDays.length > 0) {
      let days = [] as Date[]
      this.data.startDays.forEach((o: string, index: number) => {
        days.push(formatDate(o))
      })
      this.calendar.setTodoLabels({
        days: days
      })
    } else {
      // 注册回调函数
      this.afterLoadDataCallback = (res) => {
        let days = [] as Date[]
        res.LS.forEach((o: string, index: number) => {
          days.push(formatDate(o));
        })
        this.calendar.setTodoLabels({
          days: days
        })
      }
    }
  },
  onShow() {

  },
  afterTapDay(e) {
    console.log(e)
  },
  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './taskdetail',
      events: {
        returnDetail: function (res) {
          _this.loadData();
        }
      },
      success(res) {
        res.eventChannel.emit('openDetail', {
          data:
          {
            deptId: _this.data.deptId,
            deptName: _this.data.deptName,
            leaderId: _this.data.leaderId,
            leader: _this.data.leader
          }, isNew: true
        })
      }
    })
  },
  bindEditDetailTap(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    wx.navigateTo({
      url: './taskdetail',
      events: {
        returnDetail: function (res) {
          _this.loadData();
        }
      },
      success(res) {
        let currentObject = _this.data.dataList[index];
        //console.log(currentObject)
        res.eventChannel.emit('openDetail', {
          data:
          {
            deptId: _this.data.deptId,
            deptName: _this.data.deptName,
            id: currentObject.id,
            name: currentObject.name,
            description: currentObject.description,
            leaderId: currentObject.leaderId,
            leader: currentObject.leader,
            plannedStartDate: currentObject.plannedStartDate,
            plannedStartTime: currentObject.plannedStartTime,
            plannedFinishDate: currentObject.plannedFinishDate,
            plannedFinishTime: currentObject.plannedFinishTime,
            actualStartDate: currentObject.actualStartDate,
            actualStartTime: currentObject.actualStartTime,
            actualFinishDate: currentObject.actualFinishDate,
            actualFinishTime: currentObject.actualFinishTime,
            location: currentObject.location
          }, isNew: false
        })
      }
    })
  },
  loadData() {
    wx.request({
      url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/jobtask',
      data: {
        openid: app.globalData.openId,
        sessionkey: app.globalData.sessionKey,
        employeeid: app.globalData.employeeId
      }
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        //console.log(res.data)
        this.setData!({
          dataList: res.data.data,
          startDays: res.data.LS
        })
        if (this.afterLoadDataCallback) {
          this.afterLoadDataCallback(res.data)
        }
      },
      fail: fail => {
        console.log(fail)
      }
    })
  }
})
