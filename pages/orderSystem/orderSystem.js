// pages/orderSystem.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preview: '',
    desk_number: '',
    shop_name: '',
    shop_account_id: '',
    type_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    list1: [],
    list2: [],
    // foodImage: require('./images/food1.jpg'),	// 测试
    countShow: false,
    foodOrderList: [],	// 创建一个新数组存储点后菜单
    allCount: 0,
    allPrice: 0,
    allPrePrice: 0,
    toastShow: false,
    loading: false,
    // showPositionValue: true
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      preview : options.preview,
      shop_account_id : options.shopid,
      desk_number : "A11"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loading = true
    console.log(this.shop_account_id)
    // 获得菜品类型列表
    wx.request({
      url: "http://www.biu233.com/181mall/get_dish_type_list/" + this.data.shop_account_id,
      method: "GET",
      header: {
        'Cookie': app.globalData.sessionId
      },
      success: response => {
        console.log("获取申请:", response.data);
        var data = response.data;
        this.setData({
          list1 : data.list
        })
      },
      fail: function (error) {
        console.log("获取申请error:", error);
      }
    });


    // 获得所有菜品条目
    wx.request({
      url: "http://www.biu233.com/181mall/select_dish_list?shop_account_id=" + this.data.shop_account_id,
      method: "GET",
      header: {
        'Cookie': app.globalData.sessionId
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

    if (!this.data.preview) {
      // 通过shopId获取shopName
      wx.request({
        url: "http://www.biu233.com/181mall/shop/info?shop_account_id=" + this.data.shop_account_id,
        method: "GET",
        header: {
          'Cookie': app.globalData.sessionId
        },
        success: response => {
          console.log("获取申请:", response.data);
          var data = response.data;
          this.setData({
            shop_name: data.shop_name,
          })
        },
        fail: function (error) {
          console.log("获取申请error:", error);
        }
      });
    }
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

  dishScroll: function (event) {
    console.log(event.currentTarget.dataset.type)
    var type = event.currentTarget.dataset.type;
    // var typeId = document.getElementsByClassName("typeId");
    // for (var i = 0; i < typeId.length; i++) {
    //   typeId[i].style.background = "#dbdde5";
    //   if (i == type) {
    //     typeId[type].scrollIntoView(true);
    //     typeId[type].style.background = "#f3f3f3";
    //   }
    // }
    this.setData({
      index:type
    })
  },
  plusClick: function (foodOne, index, type) {
    var minusCount = document.getElementById(type + "minusCount" + index);
    var plusCount = document.getElementById(type + "plusCount" + index);
    var plusPre = document.getElementById(type + "plusPre" + index);
    plusPre.style.display = "none";
    minusCount.style.display = "inline-block";
    plusCount.style.display = "inline-block";
    foodOne.dish_num += 1;
    this.type_num[type] += 1;
    this.allCount += 1;
    this.allPrice = parseFloat(this.allPrice) + parseFloat(foodOne.dish_pay_price);
    this.allPrePrice = parseFloat(this.allPrePrice) + parseFloat(foodOne.dish_price);
    this.allPrice = this.allPrice.toFixed(2)
    this.allPrePrice = this.allPrePrice.toFixed(2)
  },
  plusCountClick: function (foodOne, index, type) {
    var minusCount = document.getElementById(type + "minusCount" + index);
    var plusCount = document.getElementById(type + "plusCount" + index);
    var plusPre = document.getElementById(type + "plusPre" + index);
    // this.foodOrderList.push({dish_name:this.foodOne[this.index].dish_name});
    foodOne.dish_num += 1;
    this.type_num[type] += 1;
    this.allCount += 1;
    this.allPrice = parseFloat(this.allPrice) + parseFloat(foodOne.dish_pay_price);
    this.allPrePrice = parseFloat(this.allPrePrice) + parseFloat(foodOne.dish_price);
    this.allPrice = this.allPrice.toFixed(2)
    this.allPrePrice = this.allPrePrice.toFixed(2)
  },
  minusCountClick: function (foodOne, index, type) {
    var minusCount = document.getElementById(type + "minusCount" + index);
    var plusCount = document.getElementById(type + "plusCount" + index);
    var plusPre = document.getElementById(type + "plusPre" + index);
    if (foodOne.dish_num == 1) {
      // foodOne.dish_num -= 1;
      plusPre.style.display = "inline-block";
      minusCount.style.display = "none";
      plusCount.style.display = "none";
    }
    foodOne.dish_num -= 1;
    this.type_num[type] -= 1;
    this.allCount -= 1;
    this.allPrice = parseFloat(this.allPrice) - parseFloat(foodOne.dish_pay_price);
    this.allPrePrice = parseFloat(this.allPrePrice) - parseFloat(foodOne.dish_price);
    this.allPrice = this.allPrice.toFixed(2)
    this.allPrePrice = this.allPrePrice.toFixed(2)
  },
  // 提交已选菜单，并存入localStorage，跳转到确认菜单界面
  submit: function () {
    // for (var i = 0; i < this.dishTypeList.length; i++) {
    // 	for (var j = 0; j < this.dishTypeList[i].foodList.length; j++) {
    // 		if(this.dishTypeList[i].foodList[j].dish_num !== 0){
    // 			this.foodOrderList.push({dish_name:this.dishTypeList[i].foodList[j].dish_name, dish_pay_price:this.dishTypeList[i].foodList[j].dish_pay_price, dish_num:this.dishTypeList[i].foodList[j].dish_num, dish_price:this.dishTypeList[i].foodList[j].dish_price});
    // 		}
    // 	}
    // }
    if (this.allCount !== 0) {
      localStorage.clear();
      for (var i = 0; i < this.list2.length; i++) {
        if (this.list2[i].dish_num !== 0) {
          this.foodOrderList.push({ dish_name: this.list2[i].dish_name, dish_pay_price: this.list2[i].dish_pay_price, dish_num: this.list2[i].dish_num, dish_price: this.list2[i].dish_price, dish_id: this.list2[i].dish_id, dish_pic: this.list2[i].dish_pic })
        }
      }
      console.log(this.foodOrderList)
      console.log(JSON.stringify(this.foodOrderList))
      localStorage.setItem('orderList', JSON.stringify(this.foodOrderList));
      localStorage.setItem('allCount', this.allCount);
      localStorage.setItem('allPrice', this.allPrice);
      localStorage.setItem('shop_name', this.shop_name);
      localStorage.setItem('shop_account_id', this.shop_account_id);
      localStorage.setItem('allPrePrice', this.allPrePrice);
      localStorage.setItem('desk_number', this.desk_number);
      // location.href = '#/confirmMenu';
      this.$router.push({ path: '/confirmMenu', query: { shop_account_id: this.shop_account_id } })
    } else if (this.allCount == 0) {
      this.toastShow = true;
    }
  }
})