// pages/lineNumList/lineNumList.js
const app = getApp()
var Util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getShopList: [],	// 定义一个数组存储shopId的list
    myQueueList: [],
    hasNoneList: false,
    show: false,
    get_waiting_no: '',
    loading: false,
    JSESSIONID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var arrTemp = []; 
    this.setData({
      loading: true
    })
    //自动登录
    console.log(options)
    this.setData({
      JSESSIONID: "JSESSIONID=" + options.cookie
    })
    wx.request({
      url: "http://42.121.193.25:8888/181mall/queue/list",
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log("获取申请:", response.data);
        var data = response.data;
        console.log(data.list)
        if (data.list !== []) {
          this.setData({
            myQueueList: data.list,
            hasNoneList: false
          })
          for (var i = 0; i < this.data.myQueueList.length; i++) {
            arrTemp.push(this.data.myQueueList[i].shop_account_id);
            this.setData({
              getShopList: arrTemp
            })
          }
          console.log("here");
          this._getShop();
        } else if (data.list == []) {	//  && this.shop_name == ''
          this.setData({
            hasNoneList: true
          })
        }
        this.setData({
          loading: false
        })
        console.log(this.data.myQueueList)
      },
      fail: function (error) {
        console.log("获取申请error:", error);
        this.setData({
          loading: false,
          hasNoneList: true
        })
      }
    });
  },

  // 获取商家店名
  _getShop: function () {
    var arr = JSON.stringify(this.data.getShopList);
    console.log(arr);
    var data = Util.json2Form({ shop_account_list:arr});
    wx.request({
      url: "http://42.121.193.25:8888/181mall/logo/list",
      method: "POST",
      header: {
        'Cookie': wx.getStorageSync("sessionid"),
        "content-type": "application/x-www-form-urlencoded"
      },
      data: data,
      success: response => {
        console.log("获取申请shop:", response.data);
        var data = response.data;
        for (var i = 0; i < data.list.length; i++) {
          this.data.myQueueList[i].shop_name = data.list[i].shop_name;
        }
        this.setData({
          myQueueList: this.data.myQueueList
        })
      }
    });
  },
  // 点击查看当前排队等待桌数
  check_waiting_no: function (e) {
    var index = e.currentTarget.dataset.index;
    var shop_account_id = this.data.myQueueList[index].shop_account_id;
    var Queue_no = this.data.myQueueList[index].queue_no;
    wx.request({
      url: 'http://42.121.193.25:8888/181mall/queue/no_status?shop_account_id=' + shop_account_id + '&queue_no=' + Queue_no,
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log("获取申请:", response.data)
        var data = response.data;
        this.setData({
          show:true,
          get_waiting_no: data.waiting_no
        })
      }
    });
  },
  onCancel() {
    this.setData({
      show: false
    })
    console.log('on cancel')
  },
  onConfirm(msg) {
    console.log('on confirm')
    this.setData({
      show: false
    })
  },
})