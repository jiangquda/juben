const Controller = require('egg').Controller
const _ = require('lodash');
const { RES_MAP, mapToResp } = require('../respcode');
const crypto = require('crypto')

class OrderController extends Controller {

   //我的订单
   async myOrderInfo(){
      //获取订单信息
      const {ctx} = this;
      



   }

   //创建订单
   async createOrder(){

   }

   //结算订单
   async settleOrder(){

   }
    




}

module.exports = OrderController