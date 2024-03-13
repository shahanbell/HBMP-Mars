// efgp/pages/safetymeasures/hiddenDangerDetail.js
import Dialog from '../../../component/vant/dialog/dialog';
var util = require("../../../utils/eamCommonUtils.js");
const years = []
const months = []
const days = []
var dateTemp = null;
const date = new Date()
var app = getApp();
var hiddenDocDta = null;
var suppleFirstInit = true;
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formReadOnly: true,
    userListHeight: null,
    nodataType: 7,
    showUpload:true,
    showRectificationUpload:true,
    uploaderNum:0,
    uploaderList: [],
    uploaderRectificationNum:0,
    uploaderRectificationList: [],
    activeNames: [],
    infoCard: {
      // formId: 'BQ21070003',
      // deptName: '圆型加工课',
      // displayType: '品名',
      // assetDesc: '加工机',
      // assetFormId: 'SA302-01-15-0028',
      // pictureurl: 'http://www.longlychina.com/UploadFiles/Product/20200622164756_87008.jpg'
    },
    detailListViewHeight: '0',
    expandFlag: false,
    suppleStartDateObj: {},
    suppleCompleteDateObj: {},
    hiddenTypeList: [{hiddenParameterName:'请选择',hiddenParameterValue:'-1'}],
    rectificationTypeList: [],
    rectifierList:[],
    eqpMaintainDetailList_dispatch: [],
    maintainResult: [],
    secureList:[],
    presentingName: null,
    hiddenSource: null,
    createTime: null,
    hiddenLocation: null,
    hiddenDescribe: null,
    hiddenImage: null,
    rectifierName: null,
    rectifierId: null,
    checkName: null,
 
    hiddenType: null,
    rectificationType: null,
    rectificationDeadline: null,
    rectificationMeasures: null,
    rectificationCompletionDate: null,
    rectificationImage: null,
    acceptanceOpinions: null,
    acceptedId: null,
    acceptedName: null,
    checkOpinions:null,
    rstatus: null,
    status: null,
    showConfirm: false,
    showRectification: false,
    showCheck: false,
    showSubBtn:true,
    chechke1:false,
    chechke2:true,
    chechke3:false,
    chechkeAccepted:false,
    chechkeOpinions:false,
    chechkeRectDta:false,
    docId: null,
    docPid:null,
    id: null,
    hiddenParameterValue: null,
    hiddenParameterName: null,
    rectifierParameterValue: null,
    rectifierParameterName: null,
    troubleDesc: null,
    uploaderList: [],
    rectificationUploaderList: [],
    show:{
      hiddenMethodSelectorPopup:false,
      rectifierMethodSelectorPopup:false,
      rectificationMethodSelectorPopup:false,
      rectificationDeadlineMethodSelectorPopup:false
    },
    showTextArea:{
      rectificationMeasures:false,
      acceptanceOpinions:false,
      hiddenDescribe:false,
      checkOpinions:false,
      
    },
    minDate: null,
    maxDate: null,
    defaultDate: [,],
    currentDate: null,
    progressInfo: {
      doneCount: '0',
      totalCount: '0',
      tagType: 'warning'
    },
    activeDateTemp: null,
    dispatchMode: false,
    submitBtnInfo:{
      type:'info',
      name:'提交'
    },
    formatter(type, value) {
      
      if (type === 'year') {
  
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    dateTemp = new Date();
    console.log(options)
    this.setData({
      // currentDate: new Date(2024 ,1, 1).getTime(), 
      // minCompleteDate: new Date(2023 ,1, 1).getTime(), 
      docFormidId:options.docFormidId,
      createTime:util.dateFormatForFilter(new Date()),
      presentingId:app.globalData.employeeId,
      hiddenDescribe:'',
      rectificationMeasures:'',
      acceptanceOpinions:'',
      presentingName:app.globalData.employeeName,
      hiddenSource:options.docType,
      docPid:options.docPid,
      hiddenParameterName:'请选择',
      hiddenParameterValue:'-1',
      rectifierParameterName:'请选择',
      rectifierParameterValue:'-1',
      rectificationParameterName:'请选择',
      rectificationParameterValue:'-1',

      // _this.data.rectificationParameterName=res.data[2][0].parameterName;
      // _this.data.rectificationParameterValue=res.data[2][0].parameterValue;
      
    })

  
    this.getHiddenDocInfo(this.data.docFormidId)
    this.getHiddenDocImageInfo(this.data.docFormidId,this.data.hiddenSource)

  },
  
  getHiddenDocImageInfo: function (formid,docType) {
    var _this = this;
    console.log("docType")
    console.log(docType)
    // restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/assetcardtest';
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/getHiddenDocImageInfo';
    restUrl += '/f;pid=' + formid + ';company=' + app.globalData.defaultCompany+ ';deptno=' + app.globalData.defaultDeptId+ ';docType=' + docType;
    restUrl += '/s/' + 0 + '/' + 20;
    restUrl = encodeURI(restUrl);
    //console.log(restUrl);
    wx.showLoading({
      title: '获取中...',
      mask: true
    });
    wx.request({
      url: restUrl,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json;charset=utf-8'
      },
      method: 'GET',
      success: function (res) {
        console.log(_this.data.hiddenType);

        if(res.data == "" || res.statusCode != 200){
          //console.log("no Data");
          wx.hideLoading();
          return;
        }
    
        var dataLen = res.data[0].length;
        var imagePathArray = [];
        var imageRectificationPathArray = [];
        for(var i = 0;i < dataLen;i++){
          
          if(res.data[0][i].fileType=="隐患图片")
          {
          var pathArray = res.data[0][i].filePath.split("/");
          imagePathArray = imagePathArray.concat([app.globalData.restAdd + "/Hanbell-EAM/resources/app/res/" + pathArray.pop()]);
          }
          if(res.data[0][i].fileType=="整改图片")
          {
          var pathArray = res.data[0][i].filePath.split("/");
          imageRectificationPathArray = imageRectificationPathArray.concat([app.globalData.restAdd + "/Hanbell-EAM/resources/app/res/" + pathArray.pop()]);
          }
        }
    

        for(var i = 0;i < res.data[1].length; i++){
          let newItem = { hiddenParameterName: "" , hiddenParameterValue: ""};
          newItem.hiddenParameterName = res.data[1][i].parameterName;
          newItem.hiddenParameterValue = res.data[1][i].parameterValue;
          if(newItem.hiddenParameterValue==_this.data.hiddenType)
          {
            _this.data.hiddenParameterName=newItem.hiddenParameterName
            _this.data.hiddenParameterValue=newItem.hiddenParameterValue
          }
          _this.data.hiddenTypeList.push(newItem);
        }
      
  
        for(var i = 0;i < res.data[2].length; i++){
          let newItem = { rectificationParameterName: "" , rectificationParameterValue: ""};
          newItem.rectificationParameterName = res.data[2][i].parameterName;
          newItem.rectificationParameterValue = res.data[2][i].parameterValue;
          if(newItem.rectificationParameterValue==_this.data.rectificationType)
          {
            _this.data.rectificationParameterName=newItem.rectificationParameterName
            _this.data.rectificationParameterValue=newItem.rectificationParameterValue
          }
          _this.data.rectificationTypeList.push(newItem);
        }
    
        for(var i = 0;i < res.data[3].length; i++){
          let newItem = { rectifierParameterName: "" , rectifierParameterValue: ""};
          newItem.rectifierParameterName =res.data[3][i].secureId+"-"+ res.data[3][i].secureName;
          newItem.rectifierParameterValue = res.data[3][i].secureId;
          newItem.rectifierParameterDept = res.data[3][i].deptNo;
          if(newItem.rectifierParameterValue==_this.data.rectifierId)
          {
            _this.data.rectifierParameterName=newItem.rectifierParameterName
            _this.data.rectifierParameterValue=newItem.rectifierParameterValue
          }
          _this.data.rectifierList.push(newItem);
        }
        if(hiddenDocDta)
        {
        if(res.data[5][0].secureId==app.globalData.employeeId)
        {
          if(hiddenDocDta.rstatus=='75')
          {
            _this.data.showSubBtn=true;
            _this.data.chechkeOpinions=true;
          }
        }
        if(hiddenDocDta.hiddenSource=='安全专员巡查')
        {
          if(hiddenDocDta.rstatus>='75'){
           
            _this.data.chechke3=true;
          }
        }
      }
      console.log("ccccccccccc")
        console.log(res.data)
        _this.setData({
          showSubBtn: _this.data.showSubBtn,
          hiddenParameterValue:_this.data.hiddenParameterValue,
          hiddenParameterName:_this.data.hiddenParameterName,
          rectifierParameterName:_this.data.rectifierParameterName,
          rectifierParameterValue:_this.data.rectifierParameterValue,
          rectificationParameterName:_this.data.rectificationParameterName,
          rectificationParameterValue:_this.data.rectificationParameterValue,
          uploaderList:imagePathArray,
          uploaderRectificationList:imageRectificationPathArray,
          acceptedId:_this.data.acceptedId,
          acceptedName:_this.data.acceptedName,
          acceptanceOpinions:_this.data.acceptanceOpinions,
          rectifierList:_this.data.rectifierList,
          rectificationTypeList:_this.data.rectificationTypeList,
          hiddenTypeList:_this.data.hiddenTypeList,
          chechke3:_this.data.chechke3,
          chechkeOpinions:_this.data.chechkeOpinions,
          docId:_this.data.id,
          secureList:res.data[4]
          // troubleDetailInfo:res.data[0].filemark
        });

        wx.hideLoading();
      },
      fail: function (fail) {
        wx.hideLoading();
        console.log(fail.data);
        Dialog.alert({
          title: '系统消息',
          message: fail.data + "-" + fail.statusCode + "-" + fail.header + "-" + fail.cookies,
        }).then(() => {
          // on close
          //initProInfo(_this);
        });
      }
    });
  },



  ifshowArea:function(e){
    console.log("44444443434")
    console.log(e)
    if(e.type == "tap"){
      this.setData({
        ["showTextArea."+e.currentTarget.dataset.show]:true
      });
    }
    else if(e.type == "blur"){
      this.setData({
        ["showTextArea."+e.currentTarget.dataset.show]:false
      });
    }
  },

  textAreaProInput:function(e){
    this.setData({
      [e.currentTarget.dataset.show]: e.detail.value
    });
  },
  /**
   * 选择弹出层开启Pro
   */
  showSelectorDtaPopup: function(event){
    console.log("整改期限弹出")
    // console.log(this.data.rectificationType)
    
    var selectorTemp = {};
    selectorTemp[event.currentTarget.dataset.selector + "SelectorPopup"] = true;
    if(this.data.chechkeRectDta&&this.data.rectificationType!="01"){ 
    this.setData({
      show:{rectificationDeadlineMethodSelectorPopup:true}
    });
  }
  },

  showSelectorPopup: function(event){
    if(this.data.chechke2){ this.showHiddenSelectorPopup();}
   
  },
  
  /**
   * 隐患类型选择弹出层开启
   */
  showHiddenSelectorPopup: function(){
    if(this.data.chechkeRectDta){
    this.setData({
      show:{hiddenMethodSelectorPopup:true}
    });
  }
},
 /**
  * 隐患类型选择弹出层关闭
  */
 closeHiddenSelectorPopup: function(){
 
  this.setData({
    show:{hiddenMethodSelectorPopup:false}
  });

},
  onHiddenPickerChange: function(event){
    //  console.log(event);
    const { picker, value, index } = event.detail;
    this.setData({
      hiddenParameterName: value.hiddenParameterName,
      hiddenParameterValue: value.hiddenParameterValue,
    });
  },

  onHiddenPickerConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      hiddenType:value.hiddenParameterValue,
      hiddenParameterName: value.hiddenParameterName,
      hiddenParameterValue: value.hiddenParameterValue,
    });
    this.closeHiddenSelectorPopup();
  },
  onHiddenPickerCancel: function(event){
    this.closeHiddenSelectorPopup();
  },


  /**
   * 整改人选择弹出层开启
   */
  showRectifierSelectorPopup: function(){
    if(this.data.chechkeRectDta){
      this.setData({
        show:{rectifierMethodSelectorPopup:true}
      });
    }
 
},

bindSafetyOfficeSelect: function () {
  var checkItem='';
  var chekeDept=false;//判断验收部门

  if(hiddenDocDta)
  {
    if(hiddenDocDta.rstatus>='10')
    {
      return;
    }
   
  }
  if(this.data.hiddenSource=='岗位自查'||this.data.hiddenSource=='班组巡查'||this.data.hiddenSource=='课长巡查')
  {
    chekeDept=true;
 
    checkItem='?deptNo='+app.globalData.defaultDeptId.slice(0,2)
    console.log("ccccccccccccccccccccca")
    console.log(checkItem)
  }
  // console.log(this.data.hiddenSource)
  // console.log(checkItem)
  var _this = this;
  wx.navigateTo({
      url: '../../../pages/userSelect/safetySelect'+checkItem,
      events: {
          returnUserSelect: function (res) {
         if(chekeDept)//判断是否由整改人所在课长验收还是由提报人验收
         {
          for(var i = 0;i < _this.data.secureList.length; i++){
          if(_this.data.secureList[i].deptNo.slice(0,3)==res.deptNo.slice(0,3))
          {
            _this.data.acceptedId=_this.data.secureList[i].secureId
            _this.data.acceptedName=_this.data.secureList[i].secureName
          }
        }
         }else{
          _this.data.acceptedId=res.k
          _this.data.acceptedName=res.v
         }
              if (res) {
                  var _wx = wx;
                  _wx.showLoading({
                      title: '加载中'
                  });
                  _this.setData({
                    rectifierParameterId: res.k,
                      rectifierParameterName: res.k + '-' + res.v,
                      rectifierId: res.k ,
                      rectifierName: res.k + '-' + res.v,
                      acceptedId:_this.data.acceptedId,
                      acceptedName:_this.data.acceptedName,
                      ajaxShow: true
                  });
              }
          }
      },
      success: function (res) {
      }
  });
},

closeRectifierSelectorPopup: function(){
  this.setData({
    show:{rectifierMethodSelectorPopup:false}
  });
},

onRectifierPickerChange: function(event){
    // console.log("000000000000000000000");
  const { picker, value, index } = event.detail;
  this.setData({
    rectifierParameterName: value.rectifierParameterName,
    rectifierParameterValue: value.rectifierParameterValue,
  });
},
onRectifierPickerConfirm: function(event){
  console.log("999999999999999")
  const { picker, value, index } = event.detail;
  if(this.data.hiddenSource=='岗位自查'||this.data.hiddenSource=='班组巡查'||this.data.hiddenSource=='课长巡查'){//选择整改人时带出验收人,注:
  for(var i = 0;i < this.data.secureList.length; i++){
   if(this.data.secureList[i].deptNo==value.rectifierParameterDept)
   {
     
      this.data.acceptedId=this.data.secureList[i].secureId
      this.data.acceptedName=this.data.secureList[i].secureName
   }
  }
  }else{
    this.data.acceptedId=this.data.rectifierId
    this.data.acceptedName=this.data.rectifierName
  }
  this.setData({
    rectifierId:value.rectifierParameterValue,
    rectifierName:value.rectifierParameterName,
    rectifierParameterName: value.rectifierParameterName,
    rectifierParameterValue: value.rectifierParameterValue,
    acceptedId:this.data.acceptedId,
    acceptedName:this.data.acceptedName
  });
  console.log(this.data.acceptedId)
  this.closeRectifierSelectorPopup();
},




  /**
   * 整改类型选择弹出层开启
   */
  showRectificationSelectorPopup: function(){
    if(this.data.chechkeRectDta){ 
    this.setData({
      show:{rectificationMethodSelectorPopup:true}
    });
  }
},
closeRectificationSelectorPopup: function(){
  this.setData({
    show:{rectificationMethodSelectorPopup:false}
  });
},

onRectificationPickerChange: function(event){
  //  console.log(event);
  const { picker, value, index } = event.detail;
  this.setData({

    rectificationParameterName: value.rectificationParameterName,
    rectificationParameterValue: value.rectificationParameterValue,
  });
},
onRectificationPickerConfirm: function(event){

  const { picker, value, index } = event.detail;
  if(value.rectificationParameterValue=='01')
  {
    this.setData({
      rectificationDeadline:this.dateFormatForFilter(new Date())
    });
  }
  this.setData({
    
    rectificationType: value.rectificationParameterValue,
    rectificationParameterName: value.rectificationParameterName,
    rectificationParameterValue: value.rectificationParameterValue,
  });
  this.closeRectificationSelectorPopup();
},

handleContentInput:function(e){
  this.setData({
    hiddenDescribe: e.detail.value
  });
},
/**
 * 整改期限弹出框
 */
showRectificationDeadlineMethodSelectorPopup: function(){
  this.setData({
    show:{rectificationDeadlineMethodSelectorPopup:true}
  });
},


onDatePickerCancel: function(event){
  // console.log("111123232")
  var selectorName = event.currentTarget.dataset.selector + "Obj";
  this.setData({
    [selectorName]:{}
  });
  this.closeRectificationSelectorPopup(event);
},

onDatePickerInput(event){
  if(suppleFirstInit){
    return;
  }
  var selectorName = event.currentTarget.dataset.selector + "Obj";
  let dateTemp = this.dateFormatForFilter(event.detail);
  var selectorTemp = {};
  selectorTemp['dateFormatStr'] = dateTemp;

  this.setData({
    rectificationDeadline : event.detail
  });
}, 

onDatePickerConfirm: function(event){
  let dateTemp = this.dateFormatForFilter(event.detail);
  this.setData({
    rectificationDeadline:dateTemp
  });
  this.closeRectificationSelectorPopup(event);
},
onDatePickerCancel: function(event){
  var selectorName = event.currentTarget.dataset.selector + "Obj";
  this.setData({
    [selectorName]:{}
  });
  this.closeRectificationSelectorPopup(event);
},
closeRectificationSelectorPopup: function(){
  this.setData({
    show:{rectificationDeadlineMethodSelectorPopup:false}
  });
},

dateFormatForFilter(date){
  let dateTemp = new Date(date);
  let year = dateTemp.getFullYear();
  let month = dateTemp.getMonth() + 1;
  let day = dateTemp.getDate();
  let hour = dateTemp.getHours();
  let minute = dateTemp.getMinutes();

  if(month < '10'){
    month = "0" + month;
  }

  if(day < '10'){
    day = "0" + day;
  }

  if(hour < '10'){
    hour = "0" + hour;
  }

  if(minute < '10'){
    minute = "0" + minute;
  }

  let dayTemp = year + "/" + month + "/" + day;
  return dayTemp;
},

  getHiddenDocInfo: function (formid) {
    var _this = this;
    var restUrl = app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/getHiddenDangerModel';
    restUrl += '/f;id=' + formid + ';company=' + app.globalData.defaultCompany + '/s';
    restUrl += '/' + 0 + '/' + 20;
    wx.showLoading({
      title: '获取中...',
      mask: true
    });
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
        hiddenDocDta = null;
        var repairManagerInfo = null;
        if(res.data == "" || res.statusCode != 200){
          //console.log("no Data");
          wx.hideLoading();
          return;
        }
        var dataLen = res.data.length;
        if(dataLen > 4){
          //console.log("data Error");
          wx.hideLoading();
          return;
        }
        hiddenDocDta = res.data[0];
        repairManagerInfo = res.data[1];
        var show1 = false;
        var show2 = false;
        var show3 = false;
        var hiddenShow=true;
        var rectificationShow=true;
     
        //隐藏或显示按钮
        if(hiddenDocDta.rstatus >= "10"){
          show1=true;
          hiddenShow=false;
          _this.data.showConfirm=true;
          _this.data.chechke1=true;
          _this.data.chechkeRectDta=true;
        }  
        if(hiddenDocDta.rstatus == "10"|| hiddenDocDta.rstatus == "30"){
         
          _this.data.showConfirm=true;
          if(hiddenDocDta.rectifierId==app.globalData.employeeId){
            _this.data.showSubBtn=true;
            _this.data.chechke2=true;
          }else{
            _this.data.showSubBtn=false;
            _this.data.chechke2=false;
          }
        } 
       
        if(hiddenDocDta.rstatus >= "30"){
          _this.data.chechkeRectDta=false;
          _this.data.showUpload=false;
          show2=true;
          _this.data.showRectificationUpload=false;
          _this.data.showRectification=true;
        }
        if(hiddenDocDta.rstatus >= "45"){
          rectificationShow=false;
          show3=true;
          _this.data.showCheck=true;
          _this.data.chechke2=false;
        }
      
        if(hiddenDocDta.presentingId==app.globalData.employeeId)
        {
          if(hiddenDocDta.rstatus=="10"||hiddenDocDta.rstatus=="30"||hiddenDocDta.rstatus=="95")
          {
            if(hiddenDocDta.rstatus=="30")
            {
            
         
              console.log( _this.data.rectificationCompletion)
            }
            _this.data.showSubBtn=false;
          }else{
            _this.data.showSubBtn=true;
          }
        }

        if(hiddenDocDta.rectifierId==app.globalData.employeeId)
        {
          if(hiddenDocDta.rstatus=="60"||hiddenDocDta.rstatus=="75"||hiddenDocDta.rstatus=="95")
          {
            _this.data.showSubBtn=false;
          }else{
            _this.data.showSubBtn=true;
          }
        }

      
        if(hiddenDocDta.rstatus == "45"){
          if(hiddenDocDta.acceptedId==app.globalData.employeeId)
          {
            _this.data.showSubBtn=true;
          }else{
            _this.data.showSubBtn=false;
          }
          _this.data.chechkeAccepted=false;
          show3=false;
        }

          if(hiddenDocDta.rstatus=="60")
          {
            if(hiddenDocDta.acceptedId==app.globalData.employeeId)
            {
              _this.data.chechkeAccepted=true;
              _this.data.showSubBtn=true;
            }else{
              _this.data.showSubBtn=false;
            }
            if(hiddenDocDta.hiddenSource=='安全专员巡查'||hiddenDocDta.hiddenSource=='安全员巡查'||hiddenDocDta.hiddenSource=='安全课长巡查')
            {
              _this.data.showSubBtn=false;
              if(hiddenDocDta.presentingId==app.globalData.employeeId)
              {
                _this.data.showSubBtn=true;
                _this.data.chechkeAccepted=true;
              }else{
                _this.data.chechkeAccepted=false;
                _this.data.showSubBtn=false;
              }
            }
          }
      
          if(hiddenDocDta.createTime=='null')
          console.log("hiddenDocDta")
          console.log(hiddenDocDta)
        _this.setData({
          minDate: new Date(dateTemp.getFullYear() -1 ,dateTemp.getMonth(), 1).getTime(),
          currentDate: new Date(dateTemp.getFullYear()+1 ,dateTemp.getMonth(), dateTemp.getDate() - 7).getTime(), 
          maxDate: dateTemp.getTime(),
          minCompleteDate: dateTemp.getTime(),
          hiddenSource:hiddenDocDta.hiddenSource,
          createTime:util.utcInit(hiddenDocDta.createTime),
          hiddenDescribe:hiddenDocDta.hiddenDescribe,
          hiddenLocation:hiddenDocDta.hiddenLocation,
          hiddenSource:hiddenDocDta.hiddenSource,
          hiddenType:hiddenDocDta.hiddenType,
          rectificationType:hiddenDocDta.rectificationType,
          presentingName:hiddenDocDta.presentingName,
          presentingId:hiddenDocDta.presentingId,
          rectifierName:hiddenDocDta.rectifierName,
          rectifierId:hiddenDocDta.rectifierId,
          rectificationDeadline:util.utcInit2Date(hiddenDocDta.rectificationDeadline),
          rectificationMeasures:hiddenDocDta.rectificationMeasures,
          acceptedId:hiddenDocDta.acceptedId,
          acceptedName:hiddenDocDta.acceptedName,
          acceptanceOpinions:hiddenDocDta.acceptanceOpinions,
          checkOpinions:hiddenDocDta.checkOpinions,
          rstatus:hiddenDocDta.rstatus,
          status:hiddenDocDta.status,
          id:hiddenDocDta.id,
          rectificationCompletionDate:util.utcInit(hiddenDocDta.rectificationCompletionDate),
          showConfirm:show1,
          showRectification:show2,
          showCheck:show3,
          showUpload:hiddenShow,
          showRectificationUpload:rectificationShow,
          showSubBtn: _this.data.showSubBtn,
          chechke1: _this.data.chechke1,
          chechkeRectDta: _this.data.chechkeRectDta,
          chechkeAccepted: _this.data.chechkeAccepted,
          chechkeOpinions: _this.data.chechkeOpinions,
          chechke2: _this.data.chechke2,
          chechke3: _this.data.chechke3
        });
        wx.hideLoading();
      },
      fail: function (fail) {
        wx.hideLoading();
        console.log("fail.data");
        Dialog.alert({
          title: '系统消息',
          message: fail.data + "-" + fail.statusCode + "-" + fail.header + "-" + fail.cookies,
        }).then(() => {
          // on close
          //initProInfo(_this);
        });
      }
    });
  },

  // 删除隐患图片
  clearImg:function(e){
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据
    
    for (let i = 0; i < uploaderList.length;i++){
        if (i == e.currentTarget.dataset.index){
            continue;
        }else{
            nowList.push(uploaderList[i])
        }
    }
    this.setData({
        uploaderNum: this.data.uploaderNum - 1,
        uploaderList: nowList,
        // showUpload: true
    })
},
//展示隐患图片
showImg:function(e){
    var that=this;
    wx.previewImage({
        urls: that.data.uploaderList,
        current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
},
//上传隐患图片
upload: function(e) {
    var that = this;
    //console.log("upload Test");
    wx.chooseImage({
        count: 3 - that.data.uploaderNum, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
            //console.log(res)
            //console.log(that.data.uploaderNum);
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            let tempFilePaths = res.tempFilePaths;
            let uploaderList = that.data.uploaderList.concat(tempFilePaths);
            if (uploaderList.length==3){
                that.setData({
                    showUpload:false
                })
            }
            //console.log(uploaderList);
            that.setData({
                uploaderList: uploaderList,
                uploaderNum: uploaderList.length,
            })
        }
    })
},



  // 删除整改图片
  clearImgRectification:function(e){
    var nowList = [];//新数据
    var uploaderRectificationList = this.data.uploaderRectificationList;//原数据
    
    for (let i = 0; i < uploaderRectificationList.length;i++){
        if (i == e.currentTarget.dataset.index){
            continue;
        }else{
            nowList.push(uploaderRectificationList[i])
        }
    }
    this.setData({
        uploaderRectificationNum: this.data.uploaderRectificationNum - 1,
        uploaderRectificationList: nowList,
        showRectificationUpload: true
    })
},
//展示整改图片
showImgRectification:function(e){
    var that=this;
    wx.previewImage({
        urls: that.data.uploaderRectificationList,
        current: that.data.uploaderRectificationList[e.currentTarget.dataset.index]
    })
},
//上传整改图片
uploadRectification: function(e) {
    var that = this;
    //console.log("upload Test");
    wx.chooseImage({
        count: 3 - that.data.uploaderRectificationNum, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
            //console.log(res)
            //console.log(that.data.uploaderNum);
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            let tempFilePaths = res.tempFilePaths;
            let uploaderRectificationList = that.data.uploaderRectificationList.concat(tempFilePaths);
            if (uploaderRectificationList.length==3){
                that.setData({
                    showRectificationUpload:false
                })
            }
            //console.log(uploaderList);
            that.setData({
                uploaderRectificationList: uploaderRectificationList,
                uploaderRectificationNum: uploaderRectificationList.length,
            })
        }
    })
},



bindData(event){
  let name = event.currentTarget.dataset.name;
  this.setData({
   [name]:event.detail
  })
},

hiddenFormSubmit: function(e){
  var that = this;

  const FileSystemManager = wx.getFileSystemManager();
  var canSubmit = this.checkFormDtaBeforeSubmit();
  
  var errmsg = '';
  if (!app.globalData.authorized) {
    canSubmit = false;
    errmsg += '账号未授权\r\n';
  }
  if (canSubmit) {
    Dialog.confirm({
      title: '系统提示',
      message: '确认提交吗?',
      mask: false,
      zIndex: 1000,
    })
      .then(() => {

        //console.log(that.data);

        // on confirm
        var createTimeDateTemp = null;
        var rectificationDeadlineDateTemp = null;
        var rectificationCompletionDateTemp = null;
        if(that.data.rectificationDeadline){
          rectificationDeadlineDateTemp= new Date(that.data.rectificationDeadline);
        }    
        if(that.data.createTime){
          createTimeDateTemp= new Date(that.data.createTime);
        }    
        if(that.data.rectificationCompletion){
          rectificationCompletionDateTemp= new Date(that.data.rectificationCompletion);
        }  
       
        wx.showLoading({
          title: 'Sending',
          mask: true
        });
        wx.request({
          //url: app.globalData.restAdd + '/Hanbell-JRS/api/shbeam/equipmentrepair/createEqpRepairHad?' + app.globalData.restAuth + "&assetCardId=" + that.data.assetCardId + "&openId=" + app.globalData.openId + "&sessionKey=" + app.globalData.sessionKey,
          url: app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/submitHiddenDangerHad?' + app.globalData.restAuth +  "&openId=oJJhp5GvX45x3nZgoX9Ae9DyWak4" + "&sessionKey=ca80bf276a4948909ff4197095f1103a"+ "&docPid="+that.data.docPid,
          //url: 'http://325810l80q.qicp.vip' + '/Hanbell-JRS/api/shbeam/equipmentinventory/insertStockInfo4MicroApp?' + app.globalData.restAuth,
          data: {
          company: app.globalData.defaultCompany,
          id:that.data.id,
          hiddenDescribe:that.data.hiddenDescribe,
          hiddenLocation:that.data.hiddenLocation,
          hiddenSource:that.data.hiddenSource,
          hiddenType:that.data.hiddenType,
          rectificationType:that.data.rectificationType,
          presentingName:that.data.presentingName,
          presentingId:that.data.presentingId,
          rectifierName:that.data.rectifierName,
          rectifierId:that.data.rectifierId,
          acceptedId:that.data.acceptedId,
          acceptedName:that.data.acceptedName,
          rectificationDeadline:rectificationDeadlineDateTemp,
          rectificationMeasures:that.data.rectificationMeasures,
          acceptanceOpinions:that.data.acceptanceOpinions,
          checkOpinions:that.data.checkOpinions,
          createTime:createTimeDateTemp,
          rectificationCompletionDate:rectificationCompletionDateTemp,
          rstatus:that.data.rstatus,
          status:that.data.status,
          docPid:that.data.docPid,
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            var resMsg = '';
            if(res.statusCode == 200 && res.data.msg != null){
              resMsg = '提交成功';
              that.setData({
                docId: res.data.msg
              });
               that.fileUpLoadByQueue(FileSystemManager,0);
               that.fileUpLoadRectificationByQueue(FileSystemManager,0);
            }
            else{
              resMsg = '提交失败';
            }
            wx.hideLoading();
            Dialog.alert({
              title: '系统消息',
              message: resMsg,
            }).then(() => {
                 wx.navigateBack({
                    delta: 1
                  });
              // on close
            });
            // wx.showModal({
            //   title: '系统消息',
            //   content: res.data.msg,
            //   content: '提交成功',
            //   showCancel: false,
            //   success: function (res) {
            //     initProInfo(that);
            //   }
            // });
          },
          fail: function (fail) {
            wx.hideLoading();
            wx.showModal({
              title: '系统提示',
              content: "请联系管理员:" + fail,
              showCancel: false
            });
          }
        });
      })
      .catch(() => {
        // on cancel
        this.setData({
          textareaDisabled:false
        });
      });

  } else {
    // wx.showModal({
    //   title: '系统提示!',
    //   content: errmsg,
    //   showCancel: false
    // });
    return;
  }
},
checkFormDtaBeforeSubmit: function(){
  if(this.data.hiddenLocation == null){
    Dialog.alert({
      title: '系统消息',
      message: "请输入隐患地点",
      zIndex:1000,
      }).then(() => {
        this.setData({
          textareaDisabled:false
        });
      });
    return false;
  }
  if(this.data.hiddenDescribe == null){
    Dialog.alert({
      title: '系统消息',
      message: "请输入隐患描述",
      zIndex:1000,
      }).then(() => {
        this.setData({
          textareaDisabled:false
        });
      });
    return false;
  }
  if(this.data.rstatus==null)
  {
    if(this.data.uploaderList.length == 0){
      Dialog.alert({
        title: '系统消息',
        message: "请选择隐患图片",
        zIndex:1000,
        }).then(() => {
          this.setData({
            textareaDisabled:false
          });
        });
      return false;
    }
  }

  if(this.data.rectifierId == null){
    Dialog.alert({
      title: '系统消息',
      message: "请选择整改人",
      zIndex:1000,
      }).then(() => {
        this.setData({
          textareaDisabled:false
        });
      });
    return false;
  }
  if(this.data.rstatus>10)
  {
    if(this.data.hiddenType == null){
      Dialog.alert({
        title: '系统消息',
        message: "请选择隐患类型",
        zIndex:1000,
        }).then(() => {
          this.setData({
            textareaDisabled:false
          });
        });
      return false;
    }
  }
  if(this.data.rstatus>10)
  {
    if(this.data.rectificationMeasures == null){
      Dialog.alert({
        title: '系统消息',
        message: "请输入整改对策",
        zIndex:1000,
        }).then(() => {
          this.setData({
            textareaDisabled:false
          });
        });
      return false;
    }
  }
  if(this.data.rstatus==30&&this.data.rectificationType!='03')
  {
    if(this.data.uploaderRectificationList.length == 0){
      Dialog.alert({
        title: '系统消息',
        message: "请选择整改完成图片",
        zIndex:1000,
        }).then(() => {
          this.setData({
            textareaDisabled:false
          });
        });
      return false;
    }
  }
  if(this.data.rstatus>10)
  {
    if(this.data.rectificationType == null){
      Dialog.alert({
        title: '系统消息',
        message: "请选择整改类型",
        zIndex:1000,
        }).then(() => {
          this.setData({
            textareaDisabled:false
          });
        });
      return false;
    }
  }
  if(this.data.rstatus>10&&this.data.rectificationType!='03')
  {
    
    if(this.data.rectificationDeadline == null){
      Dialog.alert({
        title: '系统消息',
        message: "请选择整改期限",
        zIndex:1000,
        }).then(() => {
          this.setData({
            textareaDisabled:false
          });
        });
      return false;
    }
  }
  return true;
},

//隐患图片上传保存
fileUpLoadByQueue:function(FileSystemManager,imageListIndex){
  if(imageListIndex == this.data.uploaderList.length){
    wx.hideLoading();
    return ;
  }


  //console.log("now uploading the [" + imageListIndex + "] image");

  wx.showLoading({
    title: "图片[" + imageListIndex + "]上传中...",
    mask: true
  });
  let _this = this;
  var imagePathTemp = _this.data.uploaderList[imageListIndex].split('.');

  var imageType = imagePathTemp[imagePathTemp.length - 1];

  //console.log("image Type: " + imageType);

  FileSystemManager.readFile({ //读文件
    //filePath: wx.env.USER_DATA_PATH + "/" + fileName,
    filePath: _this.data.uploaderList[imageListIndex],
    //encoding: 'utf8',
    encoding: 'base64',
    success(res) {
      if (res.data) {
        //let obj = JSON.parse(res.data);
        //resolve(obj)
        //console.log(res);
        var obj = res.data;

        wx.request({
          url: app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/uploadHiddendImg',
          method: 'POST',
          data: {
            company: 'C',
            pid: _this.data.docId,
            fileIndex: imageListIndex + 1,
            fileDta: obj,
            fileType: imageType,
            fileFrom: '隐患图片'
            //fileMark: _this.data.troubleDetailInfo,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            //console.log(res.data);
            if(imageListIndex < _this.data.uploaderList.length - 1){
              imageListIndex ++;
              _this.fileUpLoadByQueue(FileSystemManager,imageListIndex);
            }
            else{
                //console.log("all image upload success!");
                wx.hideLoading();
                Dialog.alert({
                title: '系统消息',
                message: "提交成功",
                }).then(() => {
                  // on close
                    // initProInfo(_this);
                    wx.navigateBack();
                });

            }
          }
        })

      }
    },
    fail(err) {
      console.log('读取失败', err)
      //reject(err)
    }
  })
},


//整改图片上传保存
fileUpLoadRectificationByQueue:function(FileSystemManager,imageListIndex){
  if(imageListIndex == this.data.uploaderRectificationList.length){
    wx.hideLoading();
    return ;
  }


  //console.log("now uploading the [" + imageListIndex + "] image");

  wx.showLoading({
    title: "图片[" + imageListIndex + "]上传中...",
    mask: true
  });
  let _this = this;
  var imagePathTemp = _this.data.uploaderRectificationList[imageListIndex].split('.');

  var imageType = imagePathTemp[imagePathTemp.length - 1];

  //console.log("image Type: " + imageType);

  FileSystemManager.readFile({ //读文件
    //filePath: wx.env.USER_DATA_PATH + "/" + fileName,
    filePath: _this.data.uploaderRectificationList[imageListIndex],
    //encoding: 'utf8',
    encoding: 'base64',
    success(res) {
      if (res.data) {
        //let obj = JSON.parse(res.data);
        //resolve(obj)
        //console.log(res);
        var obj = res.data;

        wx.request({
          url: app.globalData.restAdd + '/Hanbell-JRS/api/shbedw/hiddendanger/uploadHiddendImg',
          method: 'POST',
          data: {
            company: 'C',
            pid: _this.data.docId,
            fileIndex: imageListIndex + 1,
            fileDta: obj,
            fileType: imageType,
            fileFrom: '整改图片'
            //fileMark: _this.data.troubleDetailInfo,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success (res) {
            //console.log(res.data);
            if(imageListIndex < _this.data.uploaderRectificationList.length - 1){
              imageListIndex ++;
              _this.fileUpLoadRectificationByQueue(FileSystemManager,imageListIndex);
            }
            else{
                //console.log("all image upload success!");
                wx.hideLoading();
                Dialog.alert({
                title: '系统消息',
                message: "提交成功",
                }).then(() => {
                  // on close
                    // initProInfo(_this);
                    wx.navigateBack();
                });

            }
          }
        })

      }
    },
    fail(err) {
      console.log('读取失败', err)
      //reject(err)
    }
  })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})