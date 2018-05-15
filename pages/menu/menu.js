// pages/menu/menu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preview: '',
    swiperTitle: [{
      text: "点菜",
      id: 1
    }, {
      text: "评价",
      id: 2
    }, {
      text: "商家",
      id: 3
    }],
    menu: [],
    desk_number: '',
    list1: [],
    list2: [],
    shop_account_id: '',
    currentPage: 1,
    selected: 0,
    howMuch: 12,
    cost: 0,
    pullBar: false
  },
  pullBar: function () {
    this.setData({
      pullBar: !this.data.pullBar
    })
  }
  ,
  addToTrolley: function (e) {
    var info = this.data.menu;
    info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb++;
    this.setData({
      cost: this.data.cost + this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
      menu: info,
    })
  },
  removeFromTrolley: function (e) {
    var info = this.data.menu;
    if (info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb != 0) {
      info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb--;
      this.setData({
        cost: this.data.cost - this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
        menu: info,
      })
    }
  },
  turnPage: function (e) {
    this.setData({
      currentPage: e.currentTarget.dataset.index
    })
  },
  turnTitle: function (e) {
    if (e.detail.source == "touch") {
      this.setData({
        currentPage: e.detail.current
      })
    }
  },
  turnMenu: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
    console.log(e.currentTarget.dataset.index);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      preview: options.preview,
      shop_account_id: options.shopid,
    })
    var that = this;
    // 获得菜品类型列表
    wx.request({
      url: "http://42.121.193.25:8888/181mall/get_dish_type_list/" + this.data.shop_account_id,
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log("获取申请:", response.data);
        var data = response.data;
        this.setData({
          list1: data.list
        })
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });


    // 获得所有菜品条目
    wx.request({
      url: "http://42.121.193.25:8888/181mall/select_dish_list?shop_account_id=" + this.data.shop_account_id,
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log("获取申请:", response.data);
        var data = response.data;
        this.setData({
          list2: data.list,
          loading: false
        })
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });
    wx.request({
      url: "https://www.easy-mock.com/mock/5a9fb7372111737f5936260a/181wechat/menu",
      method: "GET",
      success: function (res) {
        console.log(res);
        that.setData({
          menu: res.data,
        })
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

  }
})