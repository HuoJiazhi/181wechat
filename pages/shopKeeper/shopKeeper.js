// pages/shopKeeper.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_load: false,
    show_alert: false,
    show_number: null,
    queue: [
      {
        name: "小桌",
        num: -1,
        thres: 0,
        type: 1
      },
      {
        name: "中桌",
        num: -1,
        thres: 0,
        type: 2
      },
      {
        name: "大桌",
        num: -1,
        thres: 0,
        type: 3
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取每个桌型规定人数
    wx.request({
      url: "http://42.121.193.25:8888/181mall/queue/get_queue_thres/1712266646",
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid2")
      },
      success: response => {
        console.log("获取申请:", response);
        var data = response.data;
        var list = this.data.queue;
        list[0].thres = data.small_thres;
        list[1].thres = data.middle_thres;
        list[2].thres = data.big_thres;
        this.setData({
          queue: list
        })
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });

    // 获取等待排队桌数信息
    wx.request({
      url: "http://42.121.193.25:8888/181mall/queue/queue_num/1712266646",
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid2")
      },
      success: response => {
        console.log("获取申请:", response.data);
        var data = response.data;
        var list = this.data.queue;
        list[0].num = data.small_queue_num;
        list[1].num = data.middle_queue_num;
        list[2].num = data.big_queue_num;
        this.setData({
          queue: list
        })
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  add: function (event) {
    wx.request({
      url: "http://42.121.193.25:8888/181mall/queue/get_queue_num/1712266646?queue_type=" + event.currentTarget.id,
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid2")
      },
      success: response => {
        console.log("获取申请:", response.data);
        var data = response.data;
        var list = this.data.queue;
        list[event.currentTarget.id - 1].num++;
        this.setData({
          queue: list,
          show_alert: true,
          show_number: data.queue_no
        })
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });
  },

  reduce: function (event) {
    wx.request({
      url: "http://42.121.193.25:8888/181mall/queue/poll_queue_num/" + event.currentTarget.id,
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid2")
      },
      success: response => {
        console.log("获取申请:", response.data);
        var data = response.data;
        var list = this.data.queue; 
        list[event.currentTarget.id - 1].num--;
        this.setData({
          queue:list,
          show_alert: true,
          show_number: data
        })
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });
  },
  onCancel() {
    this.setData({
      show_alert: false
    })
    console.log('on cancel')
  },
  onConfirm() {
    this.setData({
      show_alert: false
    })
    console.log('on cancel')
  }
})