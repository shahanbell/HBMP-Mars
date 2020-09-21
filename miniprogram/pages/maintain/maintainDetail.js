"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var eventChannel;
var restUrl;
var d = new Date();
Page({
    data: {
        productQuality: '',
        product_name: '',
        productStandard: '',
        warrantyStart: '',
        warrantyEnd: '',
        planMaintainCount: '',
        maintainCategoryId: '',
        maintainCategoryName: '',
        warehouseId: '',
        warehouseName: '',
        productUnit: '',
    },
    onLoad: function (option) {
        var _this_1 = this;
        var _this = this;
        this.setData({
            warehouseName: option.warehouse,
            warehouseId: option.warehouseId
        });
        var eventChannel = _this.getOpenerEventChannel();
        eventChannel.on('openDetail', function (res) {
            if (res.isNew) {
            }
            else {
                _this_1.setData({
                    productQuality: res.data.productQuality,
                    product_name: res.data.product_name,
                    productStandard: res.data.productStandard,
                    warrantyStart: res.data.warrantyStart,
                    warrantyEnd: res.data.warrantyEnd,
                    planMaintainCount: res.data.planMaintainCount,
                    maintainCategoryId: res.data.maintainCategoryId,
                    maintainCategoryName: res.data.maintainCategoryName,
                    warehouseId: res.data.warehouseId,
                    warehouseName: res.data.warehouseName,
                    productUnit: res.data.productUnit
                });
            }
        });
    },
    bindMaintainTypeSelect: function (e) {
        var _this = this;
        wx.navigateTo({
            url: '../customercomplaint/select?type=maintainCategory',
            events: {
                returnMaintainCategorySelect: function (res) {
                    if (res) {
                        _this.setData({
                            maintainCategoryId: res.key,
                            maintainCategoryName: res.key + '-' + res.value
                        });
                    }
                }
            },
            success: function (res) {
            }
        });
    },
    bindProductQualitySelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: './productQualitySelect',
            events: {
                returnProductQualitySelect: function (res) {
                    if (res) {
                        that.setData({
                            productQuality: res.value,
                            product_name: res.value1,
                            productStandard: res.value2,
                            warrantyStart: res.value3,
                            warrantyEnd: res.value4,
                            productUnit: res.value5
                        });
                    }
                }
            },
            success: function (res) {
            }
        });
    },
    bindPlanMaintainCountChange: function (e) {
        var match = /^[0-9]*$/;
        var _this = this;
        if (match.test(e.detail.value)) {
            _this.setData({
                planMaintainCount: e.detail.value
            });
        }
        else {
            wx.showModal({
                title: '系统提示',
                content: '请输入一个整数',
                showCancel: false
            });
        }
    },
    bindWarehouseSelect: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../customercomplaint/selectSearch?type=' + 'warehouse',
            events: {
                returnWarehouseSelect: function (res) {
                    if (res) {
                        that.setData({
                            warehouseId: res.key,
                            warehouseName: res.key + "-" + res.value
                        });
                    }
                }
            },
        });
    },
    formSubmit: function (e) {
        var canSubmit = true;
        var errmsg = '';
        if (!this.data.warehouseId || this.data.warehouseId == '') {
            canSubmit = false;
            errmsg += '请选择仓库 ';
        }
        if (!this.data.planMaintainCount || this.data.planMaintainCount == '') {
            canSubmit = false;
            errmsg += '请输入预计维修数量 ';
        }
        if (canSubmit) {
            var newObject = {
                productQuality: this.data.productQuality,
                product_name: this.data.product_name,
                productStandard: this.data.productStandard,
                warrantyStart: this.data.warrantyStart,
                warrantyEnd: this.data.warrantyEnd,
                planMaintainCount: this.data.planMaintainCount,
                maintainCategoryId: this.data.maintainCategoryId,
                maintainCategoryName: this.data.maintainCategoryName,
                warehouseId: this.data.warehouseId,
                warehouseName: this.data.warehouseName,
                productUnit: this.data.productUnit
            };
            eventChannel = this.getOpenerEventChannel();
            eventChannel.emit('returnDetail', { data: newObject, isNew: this.data.isNew });
            wx.navigateBack({
                delta: 1
            });
        }
        else {
            wx.showModal({
                title: '系统提示',
                content: errmsg,
                showCancel: false
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnRhaW5EZXRhaWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWludGFpbkRldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLElBQUksWUFBWSxDQUFBO0FBQ2hCLElBQUksT0FBZSxDQUFDO0FBQ3BCLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7QUFDbEIsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osY0FBYyxFQUFFLEVBQUU7UUFDbEIsWUFBWSxFQUFFLEVBQUU7UUFDaEIsZUFBZSxFQUFFLEVBQUU7UUFDbkIsYUFBYSxFQUFFLEVBQUU7UUFDakIsV0FBVyxFQUFFLEVBQUU7UUFDZixpQkFBaUIsRUFBRSxFQUFFO1FBQ3JCLGtCQUFrQixFQUFFLEVBQUU7UUFDdEIsb0JBQW9CLEVBQUUsRUFBRTtRQUN4QixXQUFXLEVBQUUsRUFBRTtRQUNmLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLFdBQVcsRUFBRSxFQUFFO0tBQ2hCO0lBQ0QsTUFBTSxZQUFDLE1BQU07UUFBYixtQkEyQkM7UUExQkMsSUFBSSxLQUFLLEdBQUMsSUFBSSxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQVEsQ0FBQztZQUNaLGFBQWEsRUFBRSxNQUFNLENBQUMsU0FBUztZQUMvQixXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7U0FFaEMsQ0FBQyxDQUFBO1FBQ0YsSUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixFQUFFLENBQUE7UUFDbEQsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBQyxHQUFHO1lBQ2hDLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTthQUVkO2lCQUFNO2dCQUNMLE9BQUksQ0FBQyxPQUFRLENBQUM7b0JBQ1osY0FBYyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYztvQkFDdkMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxJQUFJ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QWlCO2dCQUM5QyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQjtnQkFDaEQsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0I7Z0JBQ3BELFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ2xDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7Z0JBQ3RDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVc7YUFDbkMsQ0FBQTtZQUNELFlBQVksR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtZQUMzQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtZQUM5RSxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUNkLEtBQUssRUFBRSxDQUFDO2FBQ1QsQ0FBQyxDQUFBO1NBQ0g7YUFBTTtZQUNMLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsVUFBVSxFQUFFLEtBQUs7YUFDbEIsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy9vdmVyZGV0YWlsLnRzXHJcbmltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxubGV0IGV2ZW50Q2hhbm5lbFxyXG5sZXQgcmVzdFVybDogc3RyaW5nO1xyXG5sZXQgZCA9IG5ldyBEYXRlKClcclxuUGFnZSh7XHJcbiAgZGF0YToge1xyXG4gICAgcHJvZHVjdFF1YWxpdHk6ICcnLFxyXG4gICAgcHJvZHVjdF9uYW1lOiAnJyxcclxuICAgIHByb2R1Y3RTdGFuZGFyZDogJycsXHJcbiAgICB3YXJyYW50eVN0YXJ0OiAnJyxcclxuICAgIHdhcnJhbnR5RW5kOiAnJyxcclxuICAgIHBsYW5NYWludGFpbkNvdW50OiAnJyxcclxuICAgIG1haW50YWluQ2F0ZWdvcnlJZDogJycsXHJcbiAgICBtYWludGFpbkNhdGVnb3J5TmFtZTogJycsXHJcbiAgICB3YXJlaG91c2VJZDogJycsXHJcbiAgICB3YXJlaG91c2VOYW1lOiAnJyxcclxuICAgIHByb2R1Y3RVbml0OiAnJyxcclxuICB9LFxyXG4gIG9uTG9hZChvcHRpb24pIHtcclxuICAgIHZhciBfdGhpcz10aGlzO1xyXG4gICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgIHdhcmVob3VzZU5hbWU6IG9wdGlvbi53YXJlaG91c2UsXHJcbiAgICAgIHdhcmVob3VzZUlkOiBvcHRpb24ud2FyZWhvdXNlSWRcclxuICAgICAgXHJcbiAgICB9KVxyXG4gICAgY29uc3QgZXZlbnRDaGFubmVsID0gX3RoaXMuZ2V0T3BlbmVyRXZlbnRDaGFubmVsKClcclxuICAgIGV2ZW50Q2hhbm5lbC5vbignb3BlbkRldGFpbCcsIChyZXMpID0+IHtcclxuICAgICAgaWYgKHJlcy5pc05ldykge1xyXG4gICAgICAgIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgcHJvZHVjdFF1YWxpdHk6IHJlcy5kYXRhLnByb2R1Y3RRdWFsaXR5LFxyXG4gICAgICAgICAgcHJvZHVjdF9uYW1lOiByZXMuZGF0YS5wcm9kdWN0X25hbWUsXHJcbiAgICAgICAgICBwcm9kdWN0U3RhbmRhcmQ6IHJlcy5kYXRhLnByb2R1Y3RTdGFuZGFyZCxcclxuICAgICAgICAgIHdhcnJhbnR5U3RhcnQ6IHJlcy5kYXRhLndhcnJhbnR5U3RhcnQsXHJcbiAgICAgICAgICB3YXJyYW50eUVuZDogcmVzLmRhdGEud2FycmFudHlFbmQsXHJcbiAgICAgICAgICBwbGFuTWFpbnRhaW5Db3VudDogcmVzLmRhdGEucGxhbk1haW50YWluQ291bnQsXHJcbiAgICAgICAgICBtYWludGFpbkNhdGVnb3J5SWQ6IHJlcy5kYXRhLm1haW50YWluQ2F0ZWdvcnlJZCxcclxuICAgICAgICAgIG1haW50YWluQ2F0ZWdvcnlOYW1lOiByZXMuZGF0YS5tYWludGFpbkNhdGVnb3J5TmFtZSxcclxuICAgICAgICAgIHdhcmVob3VzZUlkOiByZXMuZGF0YS53YXJlaG91c2VJZCxcclxuICAgICAgICAgIHdhcmVob3VzZU5hbWU6IHJlcy5kYXRhLndhcmVob3VzZU5hbWUsXHJcbiAgICAgICAgICBwcm9kdWN0VW5pdDogcmVzLmRhdGEucHJvZHVjdFVuaXRcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcbiAgYmluZE1haW50YWluVHlwZVNlbGVjdChlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi4vY3VzdG9tZXJjb21wbGFpbnQvc2VsZWN0P3R5cGU9bWFpbnRhaW5DYXRlZ29yeScsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVybk1haW50YWluQ2F0ZWdvcnlTZWxlY3Q6IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIG1haW50YWluQ2F0ZWdvcnlJZDogcmVzLmtleSxcclxuICAgICAgICAgICAgICBtYWludGFpbkNhdGVnb3J5TmFtZTogcmVzLmtleSArICctJyArIHJlcy52YWx1ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzcyhyZXMpIHtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9LCBcclxuICBcclxuICBiaW5kUHJvZHVjdFF1YWxpdHlTZWxlY3QoZSkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzXHJcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgdXJsOiAnLi9wcm9kdWN0UXVhbGl0eVNlbGVjdCcsXHJcbiAgICAgIGV2ZW50czoge1xyXG4gICAgICAgIHJldHVyblByb2R1Y3RRdWFsaXR5U2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIHByb2R1Y3RRdWFsaXR5OiByZXMudmFsdWUsXHJcbiAgICAgICAgICAgICAgcHJvZHVjdF9uYW1lOiByZXMudmFsdWUxLFxyXG4gICAgICAgICAgICAgIHByb2R1Y3RTdGFuZGFyZDogcmVzLnZhbHVlMixcclxuICAgICAgICAgICAgICB3YXJyYW50eVN0YXJ0OiByZXMudmFsdWUzLFxyXG4gICAgICAgICAgICAgIHdhcnJhbnR5RW5kOiByZXMudmFsdWU0LFxyXG4gICAgICAgICAgICAgIHByb2R1Y3RVbml0OiByZXMudmFsdWU1XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzKHJlcykge1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sXHJcblxyXG4gIGJpbmRQbGFuTWFpbnRhaW5Db3VudENoYW5nZShlKSB7XHJcbiAgICB2YXIgbWF0Y2ggPS9eWzAtOV0qJC8gO1xyXG4gICAgIGxldCBfdGhpcyA9IHRoaXNcclxuICAgIGlmIChtYXRjaC50ZXN0KGUuZGV0YWlsLnZhbHVlKSl7XHJcbiAgICAgIF90aGlzLnNldERhdGEhKHtcclxuICAgICAgICBwbGFuTWFpbnRhaW5Db3VudDogZS5kZXRhaWwudmFsdWVcclxuICAgICAgfSlcclxuICAgIH1lbHNle1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiAn6K+36L6T5YWl5LiA5Liq5pW05pWwJyxcclxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sIFxyXG5cclxuICBiaW5kV2FyZWhvdXNlU2VsZWN0KGUpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpc1xyXG4gICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgIHVybDogJy4uL2N1c3RvbWVyY29tcGxhaW50L3NlbGVjdFNlYXJjaD90eXBlPScgKyAnd2FyZWhvdXNlJyxcclxuICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgcmV0dXJuV2FyZWhvdXNlU2VsZWN0OiBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2V0RGF0YSEoe1xyXG4gICAgICAgICAgICAgIHdhcmVob3VzZUlkOiByZXMua2V5LFxyXG4gICAgICAgICAgICAgIHdhcmVob3VzZU5hbWU6IHJlcy5rZXkrXCItXCIrcmVzLnZhbHVlXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfSlcclxuICB9LFxyXG4gIFxyXG4gIGZvcm1TdWJtaXQoZSkge1xyXG4gICAgbGV0IGNhblN1Ym1pdCA9IHRydWVcclxuICAgIGxldCBlcnJtc2cgPSAnJ1xyXG4gIFxyXG4gICAgaWYgKCF0aGlzLmRhdGEud2FyZWhvdXNlSWQgfHwgdGhpcy5kYXRhLndhcmVob3VzZUlkID09ICcnKSB7XHJcbiAgICAgIGNhblN1Ym1pdCA9IGZhbHNlXHJcbiAgICAgIGVycm1zZyArPSAn6K+36YCJ5oup5LuT5bqTICdcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5kYXRhLnBsYW5NYWludGFpbkNvdW50IHx8IHRoaXMuZGF0YS5wbGFuTWFpbnRhaW5Db3VudCA9PSAnJykge1xyXG4gICAgICBjYW5TdWJtaXQgPSBmYWxzZVxyXG4gICAgICBlcnJtc2cgKz0gJ+ivt+i+k+WFpemihOiuoee7tOS/ruaVsOmHjyAnXHJcbiAgICB9XHJcbiAgICBpZiAoY2FuU3VibWl0KSB7XHJcbiAgICAgIGxldCBuZXdPYmplY3QgPSB7XHJcbiAgICAgICAgcHJvZHVjdFF1YWxpdHk6IHRoaXMuZGF0YS5wcm9kdWN0UXVhbGl0eSxcclxuICAgICAgICBwcm9kdWN0X25hbWU6IHRoaXMuZGF0YS5wcm9kdWN0X25hbWUsXHJcbiAgICAgICAgcHJvZHVjdFN0YW5kYXJkOiB0aGlzLmRhdGEucHJvZHVjdFN0YW5kYXJkLFxyXG4gICAgICAgIHdhcnJhbnR5U3RhcnQ6IHRoaXMuZGF0YS53YXJyYW50eVN0YXJ0LFxyXG4gICAgICAgIHdhcnJhbnR5RW5kOiB0aGlzLmRhdGEud2FycmFudHlFbmQsXHJcbiAgICAgICAgcGxhbk1haW50YWluQ291bnQ6IHRoaXMuZGF0YS5wbGFuTWFpbnRhaW5Db3VudCxcclxuICAgICAgICBtYWludGFpbkNhdGVnb3J5SWQ6IHRoaXMuZGF0YS5tYWludGFpbkNhdGVnb3J5SWQsXHJcbiAgICAgICAgbWFpbnRhaW5DYXRlZ29yeU5hbWU6IHRoaXMuZGF0YS5tYWludGFpbkNhdGVnb3J5TmFtZSxcclxuICAgICAgICB3YXJlaG91c2VJZDogdGhpcy5kYXRhLndhcmVob3VzZUlkLFxyXG4gICAgICAgIHdhcmVob3VzZU5hbWU6IHRoaXMuZGF0YS53YXJlaG91c2VOYW1lLFxyXG4gICAgICAgIHByb2R1Y3RVbml0OiB0aGlzLmRhdGEucHJvZHVjdFVuaXRcclxuICAgICAgfVxyXG4gICAgICBldmVudENoYW5uZWwgPSB0aGlzLmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXHJcbiAgICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5EZXRhaWwnLCB7IGRhdGE6IG5ld09iamVjdCwgaXNOZXc6IHRoaXMuZGF0YS5pc05ldyB9KVxyXG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgICAgIGRlbHRhOiAxXHJcbiAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3eC5zaG93TW9kYWwoe1xyXG4gICAgICAgIHRpdGxlOiAn57O757uf5o+Q56S6JyxcclxuICAgICAgICBjb250ZW50OiBlcnJtc2csXHJcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==