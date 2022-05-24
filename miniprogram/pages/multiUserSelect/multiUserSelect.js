"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var restUrl;
var eventChannel;
Page({
    data: {
        offset: 0,
        pageSize: 20,
        dataList: [],
        result: [],
        selectAll: null
    },
    onLoad: function (option) {
        this.requestDeptSelect(option);
    },
    requestDeptSelect: function (options) {
        var _this_1 = this;
        restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/f';
        if (options.userInfo) {
            var reg = /^[\u3220-\uFA29]+$/;
            if (!reg.test(options.userInfo)) {
                restUrl += ';id=' + options.userInfo;
            }
            else {
                restUrl += ';userName=' + options.userInfo;
            }
        }
        if (options.dept) {
            restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/functions/organizationunit/f';
            restUrl += ';organizationUnit.id=' + options.dept;
        }
        restUrl += '/s';
        restUrl += '/' + this.data.offset + '/' + this.data.pageSize;
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
                var list = [];
                res.data.forEach(function (o, i) {
                    list[i] = (__assign({}, o, { isSelect: false }));
                });
                _this_1.setData({
                    dataList: list
                });
            },
            fail: function (fail) {
                console.log(fail);
            }
        });
    },
    bindClickSelectAll: function (e) {
        var _this = this;
        console.info("-1111-" + JSON.stringify(e));
        if (_this.data.selectAll == '1') {
            _this.setData({
                selectAll: 0,
                result: []
            });
        }
        else {
            var name_1 = e.currentTarget.dataset.name;
            var list = [];
            _this.data.dataList.forEach(function (o, i) {
                list[i] = o.id;
            });
            this.setData({
                selectAll: name_1,
                result: list
            });
        }
    },
    bindUserSelected: function (e) {
        console.log(e);
        console.info('3+++' + JSON.stringify(e));
        var _this = this;
        _this.setData({
            result: e.detail,
        });
        this.data.dataList.forEach(function (o, i) {
            if (o.id == e.detail.value) {
                o.isSelect = true;
            }
        });
    },
    submitForm: function (e) {
        var list = [];
        var _this = this;
        _this.data.dataList.forEach(function (o, i) {
            o.isSelect = false;
            _this.data.result.forEach(function (o1, i1) {
                if (o.id == o1) {
                    o.isSelect = true;
                    list.push(o);
                }
            });
        });
        console.info('===' + JSON.stringify(this.data.result));
        console.log('123124' + JSON.stringify(this.data.dataList));
        eventChannel = _this.getOpenerEventChannel();
        eventChannel.emit('returnUserSelect', list);
        wx.navigateBack({
            delta: 1
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlVc2VyU2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibXVsdGlVc2VyU2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUU1QixJQUFJLE9BQWUsQ0FBQztBQUNwQixJQUFJLFlBQVksQ0FBQztBQUVqQixJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixNQUFNLEVBQUUsQ0FBVztRQUNuQixRQUFRLEVBQUUsRUFBWTtRQUN0QixRQUFRLEVBQUUsRUFBRTtRQUNaLE1BQU0sRUFBRSxFQUFFO1FBQ1YsU0FBUyxFQUFFLElBQUk7S0FDaEI7SUFDRCxNQUFNLFlBQUMsTUFBTTtRQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ0QsaUJBQWlCLFlBQUMsT0FBYTtRQUEvQixtQkE0Q0M7UUEzQ0MsT0FBTyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLCtCQUErQixDQUFBO1FBRWxFLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNwQixJQUFJLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQztZQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQy9CLE9BQU8sSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQTthQUNyQztpQkFBTTtnQkFDTCxPQUFPLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7YUFDM0M7U0FDRjtRQUVELElBQUksT0FBTyxDQUFDLElBQUksRUFBRTtZQUNoQixPQUFPLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsMERBQTBELENBQUE7WUFDN0YsT0FBTyxJQUFJLHVCQUF1QixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7U0FFbEQ7UUFFRCxPQUFP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QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1lBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUUsRUFBQyxFQUFFO2dCQUNwQyxJQUFHLENBQUMsQ0FBQyxFQUFFLElBQUUsRUFBRSxFQUFDO29CQUNWLENBQUMsQ0FBQyxRQUFRLEdBQUMsSUFBSSxDQUFBO29CQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2Q7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFHM0QsWUFBWSxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO1FBQzVDLFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDM0MsRUFBRSxDQUFDLFlBQVksQ0FBQztZQUNkLEtBQUssRUFBRSxDQUFDO1NBQ1QsQ0FBQyxDQUFBO0lBRUYsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNeUFwcCB9IGZyb20gJy4uLy4uL2FwcCdcclxuXHJcbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcclxuXHJcbmxldCByZXN0VXJsOiBzdHJpbmc7XHJcbmxldCBldmVudENoYW5uZWw7XHJcblxyXG5QYWdlKHtcclxuICBkYXRhOiB7XHJcbiAgICBvZmZzZXQ6IDAgYXMgbnVtYmVyLFxyXG4gICAgcGFnZVNpemU6IDIwIGFzIG51bWJlcixcclxuICAgIGRhdGFMaXN0OiBbXSxcclxuICAgIHJlc3VsdDogW10sXHJcbiAgICBzZWxlY3RBbGw6IG51bGxcclxuICB9LFxyXG4gIG9uTG9hZChvcHRpb24pIHtcclxuICAgIHRoaXMucmVxdWVzdERlcHRTZWxlY3Qob3B0aW9uKTtcclxuICB9LFxyXG4gIHJlcXVlc3REZXB0U2VsZWN0KG9wdGlvbnM/OiBhbnkpIHtcclxuICAgIHJlc3RVcmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvZWZncC91c2Vycy9mJ1xyXG4gICAgLy/mkJzntKLkurrlkZjpg6jliIZcclxuICAgIGlmIChvcHRpb25zLnVzZXJJbmZvKSB7XHJcbiAgICAgIGxldCByZWcgPSAvXltcXHUzMjIwLVxcdUZBMjldKyQvO1xyXG4gICAgICBpZiAoIXJlZy50ZXN0KG9wdGlvbnMudXNlckluZm8pKSB7XHJcbiAgICAgICAgcmVzdFVybCArPSAnO2lkPScgKyBvcHRpb25zLnVzZXJJbmZvXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdFVybCArPSAnO3VzZXJOYW1lPScgKyBvcHRpb25zLnVzZXJJbmZvXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8v6YCa6L+H6YOo6Zeo5bim5Ye65omA5pyJ5Lq6XHJcbiAgICBpZiAob3B0aW9ucy5kZXB0KSB7XHJcbiAgICAgIHJlc3RVcmwgPSBhcHAuZ2xvYmFsRGF0YS5yZXN0QWRkICsgJy9IYW5iZWxsLUpSUy9hcGkvZWZncC91c2Vycy9mdW5jdGlvbnMvb3JnYW5pemF0aW9udW5pdC9mJ1xyXG4gICAgICByZXN0VXJsICs9ICc7b3JnYW5pemF0aW9uVW5pdC5pZD0nICsgb3B0aW9ucy5kZXB0XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJlc3RVcmwgKz0gJy9zJ1xyXG4gICAgcmVzdFVybCArPSAnLycgKyB0aGlzLmRhdGEub2Zmc2V0ICsgJy8nICsgdGhpcy5kYXRhLnBhZ2VTaXplXHJcbiAgICAvL2NvbnNvbGUubG9nKHJlc3RVcmwpXHJcbiAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgdXJsOiByZXN0VXJsLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgYXBwaWQ6IGFwcC5nbG9iYWxEYXRhLnJlc3RJZCxcclxuICAgICAgICB0b2tlbjogYXBwLmdsb2JhbERhdGEucmVzdFRva2VuXHJcbiAgICAgIH0sXHJcbiAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgIHZhciBsaXN0PVtdO1xyXG4gICAgICAgICAgICAgIHJlcy5kYXRhLmZvckVhY2goZnVuY3Rpb24gKG8sIGkpIHtcclxuICAgICAgICAgICAgICAgICAgbGlzdFtpXT0oeyAuLi5vLCBpc1NlbGVjdDpmYWxzZX0pXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XHJcbiAgICAgICAgICBkYXRhTGlzdDogbGlzdFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcbiAgICAgIGZhaWw6IGZhaWwgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZhaWwpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuICBiaW5kQ2xpY2tTZWxlY3RBbGwoZSl7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzXHJcbiAgICBjb25zb2xlLmluZm8oXCItMTExMS1cIiArIEpTT04uc3RyaW5naWZ5KGUpKVxyXG4gICAgLy/lj5bmtojlhajpgIlcclxuICAgIGlmIChfdGhpcy5kYXRhLnNlbGVjdEFsbCA9PSAnMScpIHtcclxuICAgICAgX3RoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgc2VsZWN0QWxsOiAwLFxyXG4gICAgICAgIHJlc3VsdDogW11cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvL+WFqOmAiVxyXG4gICAgICBjb25zdCB7IG5hbWUgfSA9IGUuY3VycmVudFRhcmdldC5kYXRhc2V0O1xyXG4gICAgICB2YXIgbGlzdCA9IFtdO1xyXG4gICAgICBfdGhpcy5kYXRhLmRhdGFMaXN0LmZvckVhY2goZnVuY3Rpb24gKG8sIGkpIHtcclxuICAgICAgICBsaXN0W2ldID0gby5pZFxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICBzZWxlY3RBbGw6IG5hbWUsXHJcbiAgICAgICAgcmVzdWx0OiBsaXN0XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmluZFVzZXJTZWxlY3RlZChlKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgY29uc29sZS5pbmZvKCczKysrJyArIEpTT04uc3RyaW5naWZ5KGUpKVxyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICBfdGhpcy5zZXREYXRhKHtcclxuICAgICAgcmVzdWx0OiBlLmRldGFpbCxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZGF0YS5kYXRhTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChvLCBpKSB7XHJcbiAgICAgIGlmIChvLmlkID09IGUuZGV0YWlsLnZhbHVlKSB7XHJcbiAgICAgICAgby5pc1NlbGVjdCA9IHRydWVcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgXHJcbiAgfSxcclxuc3VibWl0Rm9ybShlKSB7XHJcbiAgdmFyIGxpc3Q9W11cclxuICB2YXIgX3RoaXM9dGhpc1xyXG4gIF90aGlzLmRhdGEuZGF0YUxpc3QuZm9yRWFjaChmdW5jdGlvbiAobywgaSkge1xyXG4gICAgby5pc1NlbGVjdCA9IGZhbHNlXHJcbiAgICBfdGhpcy5kYXRhLnJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uKG8xLGkxKXtcclxuICAgICAgICBpZihvLmlkPT1vMSl7XHJcbiAgICAgICAgICBvLmlzU2VsZWN0PXRydWVcclxuICAgICAgICAgIGxpc3QucHVzaChvKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gIH0pO1xyXG4gICAgY29uc29sZS5pbmZvKCc9PT0nK0pTT04uc3RyaW5naWZ5KHRoaXMuZGF0YS5yZXN1bHQpKVxyXG4gICAgY29uc29sZS5sb2coJzEyMzEyNCcrSlNPTi5zdHJpbmdpZnkodGhpcy5kYXRhLmRhdGFMaXN0KSk7XHJcblxyXG5cclxuICBldmVudENoYW5uZWwgPSBfdGhpcy5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxyXG4gIGV2ZW50Q2hhbm5lbC5lbWl0KCdyZXR1cm5Vc2VyU2VsZWN0JywgbGlzdClcclxuICB3eC5uYXZpZ2F0ZUJhY2soe1xyXG4gICAgZGVsdGE6IDFcclxuICB9KVxyXG4gICAgXHJcbiAgfVxyXG59KVxyXG4iXX0=