//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.request({
      url: "http://www.biu233.com/181mall/registerlogin",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        "phone": "13402821603",
        "msg_identification_code": "1234",
        "role": "1"
      },
      success: response => {
        console.log("登录成功:", response.header["Set-Cookie"].split(";")[0].split("=")[1]);
        var JSESSIONID = response.header["Set-Cookie"].split(";")[0].split("=")[1];
        //设置全局sessionId 变量
        app.globalData.sessionId = "JSESSIONID="+JSESSIONID;
        wx.navigateTo({
          url: '../shopInfo/shopInfo?cookie=' + JSESSIONID
        })
      },
      fail: function (error) {
        console.log("登录error:", error);
      }
    });
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
