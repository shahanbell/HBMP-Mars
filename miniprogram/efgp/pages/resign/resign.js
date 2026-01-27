var app = getApp();
import Dialog from '../../../component/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    employeeNo: "",
    employeeName: "",
    depeNo: "",
    deptName: "",
    post: "",
    postDesc: "",
    grade: "",
    isAdmin: "",
    isAdminDesc: "",
    isAdminActionShow: false,
    isAdminActions: [{
      name: '是',
      color: '#323233'
    }, {
      name: '否',
      color: '#FF0000'
    }],

    workdate: new Date().getTime(),
    workdateDesc: "",
    isWorkDatePickerShow: false,

    resigndate: new Date().getTime(),
    resigndateDesc: "",
    isResignDatePickerShow: false,

    reason: "",

    mindate: new Date(2009, 1, 1).getTime()


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'Loading'
    });
    this.setData({
      employeeNo: app.globalData.employeeId,
      employeeName: app.globalData.employeeName,
      depeNo: app.globalData.defaultDeptId,
      deptName: app.globalData.defaultDeptName
    });
    var that = this;
    wx.request({
       url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl016/userInfo?userid='+ this.data.employeeNo + '&' + app.globalData.restAuth,
      //url: 'http://localhost:8480/Hanbell-JRS/api/efgp/hkgl016/userInfo?userid=' + this.data.employeeNo + '&' + app.globalData.restAuth,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          post: res.data.post,
          postDesc: res.data.postDesc,
          grade: res.data.grade,
        });
        wx.hideLoading();
      },
      fail:function(res){

        wx.hideLoading();
      }
    });

  },



  showWorkdatePicker: function () {
    this.setData({
      isWorkDatePickerShow: true,
    });
  },
  onWorkDatePickerClose: function () {
    console.info("关闭")
    this.setData({
      isWorkDatePickerShow: false,
    });
  },
  onWorkDatePickerConfirm: function (item) {
    console.info(JSON.stringify(item))
    let date = new Date(item.detail);

    this.setData({
      isWorkDatePickerShow: false,
      workdate: item.detail,
      workdateDesc: this.formatDate(date)
    });
  },
  onWorkDatePickerCancel: function () {
    this.setData({
      isWorkDatePickerShow: false,
    });
  },


  showResignDatePicker: function () {
    this.setData({
      isResignDatePickerShow: true,
    });

  },
  onResignDatePickerClose: function () {
    this.setData({
      isResignDatePickerShow: false,
    });
  },

  onResignDatePickerConfirm: function (item) {
    let date = new Date(item.detail);

    this.setData({
      isResignDatePickerShow: false,
      resigndate: item.detail,
      resigndateDesc: this.formatDate(date)
    });
  },
  onResignDatePickerCancel: function () {
    this.setData({
      isResignDatePickerShow: false,
    });
  },

  showIsAdminAction: function () {
    this.setData({
      isAdminActionShow: true,
    });
  },


  onIsAdminActionsClose: function () {
    this.setData({
      isAdminActionShow: false,
    });
  },

  onIsAdminActionsSelect: function (value) {

    this.setData({
      isAdmin: value.detail.name == "是",
      isAdminDesc: value.detail.name == "是" ? "是" : "否"
    });
  },
  bindReasonChange: function (value) {
    this.setData({
      reason: value.detail.value
    });
  },
  formSubmit: function () {
    wx.showLoading({
      title: 'Loading'
    });
    var errmsg = '';
    if (!app.globalData.authorized) {
      errmsg += '账号未授权\r\n';
    }
    if (this.data.employeeNo == null || this.data.employeeNo == '') {
      errmsg += '申请人员不能为空\r\n';
    }
    if (this.data.depeNo == null || this.data.depeNo == '') {
      errmsg += '申请部门不能为空\r\n';
    }

    if (this.data.post == null || this.data.post == '') {
      errmsg += '岗位不能为空\r\n';
    }

    if (this.data.grade == null || this.data.grade == '') {
      errmsg += '职等不能为空\r\n';
    }

    if (this.data.isAdminDesc == null || this.data.isAdminDesc == '') {
      errmsg += '是否行政职不能为空\r\n';
    }

    if (this.data.workdateDesc == null || this.data.workdateDesc == '') {
      errmsg += '首次签订合同日期不能为空\r\n';
    }
    if (this.data.resigndateDesc == null || this.data.resigndateDesc == '') {
      errmsg += '申请离职日期不能为空\r\n';
    }
    if (this.data.reason == null || this.data.reason == '') {
      errmsg += '离职原因\r\n';
    }
    console.info(errmsg.length )
    if (errmsg.length > 0) {
      wx.showModal({
        title: '提示',
        content:errmsg,
      });
      wx.hideLoading();
      return;
    }

    var that = this;
    let params = {
      ...this.data
    }
    wx.showModal({
      title: '系统提示',
      content: '确定提交吗',
      success: function (res) {
        wx.request({
          url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl016/wechat?'+ app.globalData.restAuth,
          // url: 'http://localhost:8480/Hanbell-JRS/api/efgp/hkgl016/wechat?' + app.globalData.restAuth,
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          data:  {
            employeeNo:that.data.employeeNo,
            employeeName:that.data.employeeName,
            depeNo:that.data.depeNo,
            deptName:that.data.deptName,
            post:that.data.post,
            postDesc:that.data.postDesc,
            grade:that.data.grade,
            isAdmin:that.data.isAdmin?"Y":"N",
            // workdate:null,
            // resigndate:null,
            workdate: new Date(that.data.workdate),
            resigndate: new Date(that.data.resigndate),
            reason:that.data.reason
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.code == "200") {
              wx.showModal({
                title: '系统提示',
                content: res.data.msg,
                showCancel: false,
                success: () => {
                  wx.switchTab({
                    url: "/pages/index/index"
                  });
              
                }
              });
            }else{
              wx.showModal({
                title: '系统提示',
                content: res.data.msg,
              });
            }
          },
        });

      },
      fail: function (res) {
        wx.showModal({
          title: '失败',
          content: JSON.stringify(res),
        });
        wx.hideLoading();
      },
    });


  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

})