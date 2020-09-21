import { IMyApp } from '../../app';
import { utc2Local } from '../../utils/util';
import { local2UTC } from '../../utils/util';

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
    deptId: "" as string,
    deptName: "" as string,
    executorId: "" as string,
    executor: "" as string,
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
        executorId: app.globalData.employeeId,
        executor: app.globalData.employeeName
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
    if (this.data.dataList.length > 0) {
      let days = [] as Date[]
      this.data.dataList.forEach((o: any, index: number) => {
        days.push(o.plannedStartDate)
      })
      this.calendar.setTodoLabels({
        days: days
      })
    } else {
      // 注册回调函数
      this.afterLoadDataCallback = (res) => {
        // console.log("执行注册回调函数")
        let days = [] as Date[]
        this.data.dataList.forEach((o: any, index: number) => {
          days.push(o.plannedStartDate)
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
            executorId: _this.data.executorId,
            executor: _this.data.executor
          }, isNew: true
        })
      }
    })
  },
  bindEditDetailTap(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    // console.log(index)
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
            executorId: currentObject.executorId,
            executor: currentObject.executor,
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
      url: app.globalData.restAdd + '/Hanbell-JRS/api/eap/task/executor/' + app.globalData.employeeId,
      data: {
        status: 'N',
        offset: 0,
        pageSize: 50,
        appid: app.globalData.restId,
        token: app.globalData.restToken,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        let tasks = res.data.data;
        if (tasks) {
          tasks.forEach((o: any, index: number) => {
            o.plannedStartDate = o.plannedStartDate ? utc2Local(o.plannedStartDate) : null
            o.plannedStartTime = o.plannedStartTime ? utc2Local(o.plannedStartTime, { localFormat: 'HH:mm' }) : null
            o.plannedFinishDate = o.plannedFinishDate ? utc2Local(o.plannedFinishDate) : null
            o.plannedFinishTime = o.plannedFinishTime ? utc2Local(o.plannedFinishTime, { localFormat: 'HH:mm' }) : null
            o.actualStartDate = o.actualStartDate ? utc2Local(o.actualStartDate) : null
            o.actualStartTime = o.actualStartTime ? utc2Local(o.actualStartTime, { localFormat: 'HH:mm' }) : null
            o.actualFinishDate = o.actualFinishDate ? utc2Local(o.actualFinishDate) : null
            o.actualFinishTime = o.actualFinishTime ? utc2Local(o.actualFinishTime, { localFormat: 'HH:mm' }) : null
          })
        }
        this.setData!({
          dataList: tasks,
          startDays: []
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
