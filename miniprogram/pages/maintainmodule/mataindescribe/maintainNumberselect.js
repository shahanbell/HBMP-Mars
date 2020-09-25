"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var restUrl;
var eventChannel;
Page({
    data: {
        offset: 0,
        pageSize: 200,
        dataList: [],
        selectedKey: null,
        option: {},
        selectedObject: {},
        keyword: '',
        loadingHidden: false
    },
    onLoad: function (option) {
        var that = this;
        that.setData({
            option: option
        });
        that.requestData();
    },
    requestData: function () {
        var _this = this;
        var that = this;
        var type = that.data.option.type;
        var restUrl;
        if (type == 0) {
            restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/repte/validateDate/' + app.globalData.employeeId + '?searchWord=' + that.data.keyword;
        }
        else if (type == 1) {
            restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/crm/reptc/maintainform/' + that.data.option.maintaintype + '?searchWord=' + that.data.keyword;
        }
        wx.request({
            url: restUrl,
            data: {
                appid: app.globalData.restId,
                token: app.globalData.restToken
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'GET',
            success: function (res) {
                _this.setData({
                    loadingHidden: true
                });
                var list = [];
                var data = res.data.data;
                if (type == 1) {
                    data.forEach(function (value, index, array) {
                        var o = array[index];
                        list.push({
                            key: index, maintainType: o.REPTCPK.tc001, maintainNumberName: o.REPTCPK.tc002, maintainSerial: '', customerName: o.tc036, productName: o.tc009, problemId: o.tc077, problemName: o.tc013, roadStartDate: '', roadEndDate: '', arrivalDate: '', leaveDate: ''
                        });
                    });
                }
                else if (type == 0) {
                    data.forEach(function (value, index, array) {
                        var o = array[index];
                        list.push({
                            key: index, maintainType: o.te001, maintainNumberName: o.te002, maintainSerial: o.te004, customerName: o.customerName, productName: o.productName, problemId: o.problemId, problemName: o.problemName, roadStartDate: o.roadStartDate, roadEndDate: o.roadEndDate, arrivalDate: o.arrivalDate, leaveDate: o.leaveDate
                        });
                    });
                }
                that.setData({
                    dataList: list
                });
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    },
    changeSearchWord: function (e) {
        var that = this;
        that.setData({
            keyword: e.detail.value
        });
    },
    budgetaccQuery: function (e) {
        var that = this;
        that.requestData();
    },
    bindDataSelected: function (e) {
        var _this = this;
        console.log("==" + JSON.stringify(e.detail.value));
        this.setData({
            selectedKey: e.detail.value
        });
        this.data.dataList.forEach(function (o, i) {
            if (o.key == e.detail.value) {
                _this.setData({
                    selectedObject: { key: o.key, value: o }
                });
            }
        });
        if (this.data.selectedObject) {
            var that_1 = this;
            wx.showModal({
                title: '系统消息',
                content: '已选择,是否返回',
                success: function (res) {
                    if (res.confirm) {
                        eventChannel = that_1.getOpenerEventChannel();
                        eventChannel.emit('returnMaintainNumberSelect', that_1.data.selectedObject);
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            });
        }
    },
    sltwordInput: function (e) {
        this.setData({
            keyword: e.detail.value
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnRhaW5OdW1iZXJzZWxlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWludGFpbk51bWJlcnNlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksT0FBZSxDQUFDO0FBQ3BCLElBQUksWUFBWSxDQUFDO0FBQ2pCLElBQUksQ0FBQztJQUNILElBQUksRUFBRTtRQUNKLE1BQU0sRUFBRSxDQUFXO1FBQ25CLFFBQVEsRUFBRSxHQUFhO1FBQ3ZCLFFBQVEsRUFBRSxFQUFFO1FBQ1osV0FBVyxFQUFFLElBQUk7UUFDakIsTUFBTSxFQUFDLEVBQUU7UUFDVCxjQUFjLEVBQUUsRUFBRTtRQUNsQixPQUFPLEVBQUUsRUFBRTtRQUNYLGFBQWEsRUFBRSxLQUFLO0tBQ3JCO0lBQ0QsTUFBTSxZQUFDLE1BQU07UUFDWCxJQUFJLElBQUksR0FBQyxJQUFJLENBQUM7UUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1gsTUFBTSxFQUFFLE1BQU07U0FDZixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7SUFFcEIsQ0FBQztJQUNELFdBQVc7UUFBWCxpQkFvREM7UUFuREMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNqQyxJQUFJLE9BQU8sQ0FBQztRQUNaLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRTtZQUNiLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRywwQ0FBMEMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBQyxjQUFjLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDNUk7YUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7WUFDcEIsT0FBTyxHQUFHLEdB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Q0FBQyxxQkFBcUIsRUFBRSxDQUFDO3dCQUM1QyxZQUFZLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLE1BQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7d0JBQ3pFLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQ2QsS0FBSyxFQUFFLENBQUM7eUJBQ1QsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7SUFDRCxZQUFZLFlBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxPQUFRLENBQUM7WUFDWixPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1NBQ3hCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXHJcblxyXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXHJcbmxldCByZXN0VXJsOiBzdHJpbmc7XHJcbmxldCBldmVudENoYW5uZWw7XHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIG9mZnNldDogMCBhcyBudW1iZXIsXHJcbiAgICBwYWdlU2l6ZTogMjAwIGFzIG51bWJlcixcclxuICAgIGRhdGFMaXN0OiBbXSxcclxuICAgIHNlbGVjdGVkS2V5OiBudWxsLFxyXG4gICAgb3B0aW9uOnt9LFxyXG4gICAgc2VsZWN0ZWRPYmplY3Q6IHt9LFxyXG4gICAga2V5d29yZDogJycsXHJcbiAgICBsb2FkaW5nSGlkZGVuOiBmYWxzZVxyXG4gIH0sXHJcbiAgb25Mb2FkKG9wdGlvbikge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgIG9wdGlvbjogb3B0aW9uXHJcbiAgICB9KTtcclxuICAgIHRoYXQucmVxdWVzdERhdGEoKVxyXG4gICBcclxuICB9LFxyXG4gIHJlcXVlc3REYXRhKCl7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB2YXIgdHlwZSA9IHRoYXQuZGF0YS5vcHRpb24udHlwZTtcclxuICAgIHZhciByZXN0VXJsO1xyXG4gICAgaWYgKHR5cGUgPT0gMCkge1xyXG4gICAgICByZXN0VXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2NybS9yZXB0ZS92YWxpZGF0ZURhdGUvJyArIGFwcC5nbG9iYWxEYXRhLmVtcGxveWVlSWQrJz9zZWFyY2hXb3JkPScrdGhhdC5kYXRhLmtleXdvcmQ7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICByZXN0VXJsID0gYXBwLmdsb2JhbERhdGEucmVzdEFkZCArICcvSGFuYmVsbC1KUlMvYXBpL2NybS9yZXB0Yy9tYWludGFpbmZvcm0vJyArIHRoYXQuZGF0YS5vcHRpb24ubWFpbnRhaW50eXBlICsgJz9zZWFyY2hXb3JkPScgKyB0aGF0LmRhdGEua2V5d29yZDtcclxuICAgIH1cclxuICAgXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH0sXHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgbG9hZGluZ0hpZGRlbjogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBsaXN0ID0gW107XHJcbiAgICAgICAgdmFyIGRhdGEgPSByZXMuZGF0YS5kYXRhXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gMSkge1xyXG4gICAgICAgICAgZGF0YS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBvID0gYXJyYXlbaW5kZXhdO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goe1xyXG4gICAgICAgICAgICAgIGtleTogaW5kZXgsIG1haW50YWluVHlwZTogby5SRVBUQ1BLLnRjMDAxLCBtYWludGFpbk51bWJlck5hbWU6IG8uUkVQVENQSy50YzAwMiwgbWFpbnRhaW5TZXJpYWw6ICcnLCBjdXN0b21lck5hbWU6IG8udGMwMzYsIHByb2R1Y3ROYW1lOiBvLnRjMDA5LCBwcm9ibGVtSWQ6IG8udGMwNzcsIHByb2JsZW1OYW1lOiBvLnRjMDEzLCByb2FkU3RhcnREYXRlOiAnJywgcm9hZEVuZERhdGU6ICcnLCBhcnJpdmFsRGF0ZTogJycsIGxlYXZlRGF0ZTogJydcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gMCkge1xyXG4gICAgICAgICAgZGF0YS5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBvID0gYXJyYXlbaW5kZXhdO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGlzdC5wdXNoKHtcclxuICAgICAgICAgICAgICBrZXk6IGluZGV4LCBtYWludGFpblR5cGU6IG8udGUwMDEsIG1haW50YWluTnVtYmVyTmFtZTogby50ZTAwMiwgbWFpbnRhaW5TZXJpYWw6IG8udGUwMDQsIGN1c3RvbWVyTmFtZTogby5jdXN0b21lck5hbWUsIHByb2R1Y3ROYW1lOiBvLnByb2R1Y3ROYW1lLCBwcm9ibGVtSWQ6IG8ucHJvYmxlbUlkLCBwcm9ibGVtTmFtZTogby5wcm9ibGVtTmFtZSwgcm9hZFN0YXJ0RGF0ZTogby5yb2FkU3RhcnREYXRlLCByb2FkRW5kRGF0ZTogby5yb2FkRW5kRGF0ZSwgYXJyaXZhbERhdGU6IG8uYXJyaXZhbERhdGUsIGxlYXZlRGF0ZTogby5sZWF2ZURhdGVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGF0LnNldERhdGEhKHtcclxuICAgICAgICAgIGRhdGFMaXN0OiBsaXN0XHJcbiAgICAgICAgfSlcclxuICAgICAgfSxcclxuICAgICAgZmFpbDogZmFpbCA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZmFpbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgfSxcclxuICBjaGFuZ2VTZWFyY2hXb3JkKGUpe1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgIHRoYXQuc2V0RGF0YSh7XHJcbiAgICAgIGtleXdvcmQ6ZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfSxcclxuICBidWRnZXRhY2NRdWVyeShlKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGF0LnJlcXVlc3REYXRhKCk7XHJcblxyXG4gIH0sXHJcbiAgYmluZERhdGFTZWxlY3RlZChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIj09XCIgKyBKU09OLnN0cmluZ2lmeShlLmRldGFpbC52YWx1ZSkpXHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgc2VsZWN0ZWRLZXk6IGUuZGV0YWlsLnZhbHVlXHJcbiAgICB9KVxyXG4gICAgdGhpcy5kYXRhLmRhdGFMaXN0LmZvckVhY2goKG8sIGkpID0+IHtcclxuICAgICAgaWYgKG8ua2V5ID09IGUuZGV0YWlsLnZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBzZWxlY3RlZE9iamVjdDogeyBrZXk6IG8ua2V5LCB2YWx1ZTogbyB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIGlmICh0aGlzLmRhdGEuc2VsZWN0ZWRPYmplY3QpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICAgIHd4LnNob3dNb2RhbCh7XHJcbiAgICAgICAgdGl0bGU6ICfns7vnu5/mtojmga8nLFxyXG4gICAgICAgIGNvbnRlbnQ6ICflt7LpgInmi6ks5piv5ZCm6L+U5ZueJyxcclxuICAgICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbCA9IHRoYXQuZ2V0T3BlbmVyRXZlbnRDaGFubmVsKCk7XHJcbiAgICAgICAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5NYWludGFpbk51bWJlclNlbGVjdCcsIHRoYXQuZGF0YS5zZWxlY3RlZE9iamVjdClcclxuICAgICAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcclxuICAgICAgICAgICAgICBkZWx0YTogMVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG4gIHNsdHdvcmRJbnB1dChlKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAga2V5d29yZDogZS5kZXRhaWwudmFsdWVcclxuICAgIH0pXHJcbiAgfVxyXG59KVxyXG4iXX0=