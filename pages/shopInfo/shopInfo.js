// pages/shopInfo/shopInfo.js
const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: {},
    shop_account_id: '1712266646',
    show: false,
    showToast: true,
    small_thres: '-1',
    middle_thres: '-1',
    big_thres: '-1',
    small_queue_num: '',
    middle_queue_num: '',
    big_queue_num: '',
    ifOpenQueue: '1',
    shop_name: '',
    shop_type: '',
    shop_feature: '',
    average_price: '',
    shop_address: '',
    shop_floor_no: '',
    shop_room_no: '',
    business_hours: '',
    shop_tel: '',
    activity_info: '',
    showPositionValue: true,
    whetherLogin: true, // 用户是否登陆
    loading: false,
    is_line: false,
    JSESSIONID: '',
    mealNumber: '',
    JSESSION: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //自动登录
    console.log(options)
  },

  // Do something when page ready.
  onReady: function (options) {
    console.log(this.data.JSESSIONID);
    this.setData({
      shop_account_id: "1712266646"
    });
    // 获取店家详细信息
    wx.request({
      url: "http://42.121.193.25:8888/181mall/shop/info?shop_account_id=1712266646",
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log("获取商家:", response.data);
        var data = response.data;
        if (data.activity_info == '') {
          this.setData({
            activity_info: '本店暂无优惠活动'
          })
        } else if (data.activity_info !== '') {
          this.setData({
            activity_info: data.activity_info
          })
        }
        this.setData({
          average_price: data.average_price,
          business_hours: data.business_hours,
          shop_feature: data.shop_feature,
          shop_address: data.shop_address,
          shop_floor_no: data.shop_floor_no,
          shop_name: data.shop_name,
          shop_type: data.shop_type,
          shop_tel: data.shop_tel,
          loading: true
        })
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });
    //获取店家是否开启排队
    wx.request({
      url: "http://42.121.193.25:8888/181mall/queue/is_open/1712266646",
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log("获取申请:", response);
        var data = response.data;
        if (data == false) {
          // 如果返回为负，不开启排队
          this.setData({
            ifOpenQueue: '-2',
            small_thres: '-1',
            middle_thres: '-1',
            big_thres: '-1'
          })
        } else if (data == true) {
          // // 如果开启了排队功能，请求获取排号信息
          this.setData({
            ifOpenQueue: '1',
          })
          this.getQueueInfo();
        }
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });
  },

  // 若商家已开启排号功能，请求
  getQueueInfo: function () {
    // 获取每个桌型规定人数
    wx.request({
      url: "http://42.121.193.25:8888/181mall/queue/get_queue_thres/1712266646",
      header: {
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log("获取申请:", response);
        var data = response.data;
        this.setData({
          small_thres: data.small_thres,
          middle_thres: data.middle_thres,
          big_thres: data.big_thres,
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
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log("获取申请:", response.data);
        var data = response.data;
        this.setData({
          small_queue_num: data.small_queue_num,
          middle_queue_num: data.middle_queue_num,
          big_queue_num: data.big_queue_num,
        })
        // this.small_queue_num = data.small_queue_num;
        // this.middle_queue_num = data.middle_queue_num;
        // this.big_queue_num = data.big_queue_num;
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });
  },

  getNumber: function () {
    wx.request({
      url: "http://42.121.193.25:8888/181mall/queue/list",
      method: "GET",
      header: {
        'Cookie': wx.getStorageSync("sessionid")
      },
      success: response => {
        console.log(response)
        var list = response.data.list
        for (var i = 0; i < list.length; i++) {
          if (this.data.shop_account_id == list[i].shop_account_id) {
            // 若已有该商家的排队号单，直接跳到排队管理页面
            this.setData({
              is_line: true
            })
            setTimeout(() => {
              this.setData({
                is_line: false
              })
              wx.navigateTo({
                // url: '../shopInfo/shopInfo'
                url: '../lineNumList/lineNumList'
              })
            }, 1000)
          }
        }
        if (this.data.is_line == false) {
          this.setData({
            show: true
          })
        }
      },
      fail: function (error) {
        this.setData({
          show: true
        })
      }
    });
  },
  onHide() {
    console.log('on hide')
  },
  onShow() {
    console.log('on show')
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
    if (this.data.mealNumber) {
      var msg = this.data.mealNumber;
      var queue_type = 0;
      if (0 < msg && msg < this.data.small_thres + 1) {
        queue_type = 1;
      } else if (this.data.small_thres < msg && msg < this.data.middle_thres + 1) {
        queue_type = 2;
      } else if (this.data.middle_thres < msg && msg < this.data.big_thres + 1) {
        queue_type = 3;
      } else {
        wx.showToast({
          title: '领号失败',
          icon: 'loading',
          duration: 2000,
          mask: true
        })
        return
      }
      wx.request({
        url: "http://42.121.193.25:8888/181mall/queue/get_queue_num/1712266646?queue_type=" + queue_type,
        method: "GET",
        header: {
          'Cookie': wx.getStorageSync("sessionid")
        },
        success: response => {
          console.log("排队:", response.data);
          var data = response.data;
          if (data !== []) {
            // 取号成功
            var waiting_no = data.waiting_no;
            var Queue_no = data.Queue_no;
            var Queue_type = data.Queue_type;
            var time = data.time;
            this.showToast = false;
            setTimeout(() => {
              wx.navigateTo({
                // url: '../shopInfo/shopInfo'
                url: '../lineNumList/lineNumList?cookie=' + this.data.JSESSION
              })
            }, 2000)
          } else {
            // 取号失败
            this.showPositionValue = false;
          }
        },
        fail: function (error) {
          console.log("获取申请error:", error);
        }
      });
    }
  },
  //侦听输入
  watchNumber: function (event) {
    console.log(event.detail.value);
    this.setData({
      mealNumber: event.detail.value
    })
  },
  // 拨打店家电话
  callClick: function () {
    if (this.data.shop_tel !== '') {
      var phone = this.data.shop_tel;
      wx.makePhoneCall({
        phoneNumber: phone, //此号码并非真实电话号码，仅用于测试  
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    }
  },

  //打开菜单
  openMenu: function (event) {
    var shopid = event.currentTarget.dataset.albumlist
    var preview = event.currentTarget.dataset.preview
    console.log(shopid);
    console.log(preview);
    wx.navigateTo({
      url: '../menu/menu?shopid=' + shopid + '&preview=' + preview
    })
  },

  // 扫码点菜
  scanOrder: function () {
    // var domain = window.location.origin;
    // // var signature_url = domain + '/shopInfo?shop_account_id=' + this.shop_account_id;
    // // var signature_url = document.location.href.replace(document.location.hash,'')
    // wx.request({
    //   url: "http://42.121.193.25:8888/181mall/wxpay/jssdkparam?signature_url=" + signature_url,
    //   method: "GET",
    //   success: response => {
    //     // console.log("获取申请:", res.data)
    //     var data = res.data;
    //     if (res.status === 200) {
    //       wx.config({
    //         debug: true,   // 开启调试模式,开发时可以开启
    //         appId: data.appid,
    //         timestamp: data.timestamp,
    //         nonceStr: data.noncestr,
    //         signature: data.signature,
    //         jsApiList: ['scanQRCode']
    //       })
    //       wx.ready(() => {
    //         alert('微信接口准备就绪');
    //         wx.scanQRCode({
    //           needResult: 1,  // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
    //           scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
    //           success: function (res) {
    //             var result = res.resultStr; // 当needResult为1时，扫码返回的结果
    //             window.location.href = result;  // 跳转到扫码后获得的点菜页面
    //             alert(result)
    //           },
    //           error: function (res) {
    //             if (res.errMsg.indexOf('function_not_exist') > 0) {
    //               alert('版本过低请升级')
    //             }
    //           }
    //         });
    //       })
    //     }
    //   }
    // });
    var shopId = this.data.shop_account_id;
    console.log(shopId);
    wx.navigateTo({
      // url: '../shopInfo/shopInfo'
      url: '../menu/menu?shopid=' + shopId + '&preview=' + 0
    })
  }
})