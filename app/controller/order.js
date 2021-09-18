const Controller = require('egg').Controller
const _ = require('lodash');
const { RES_MAP, mapToResp } = require('../respcode');
const crypto = require('crypto')

class OrderController extends Controller {

   //我的订单
   async myOrderInfo(){
      //获取订单信息
      const {app,ctx} = this;
      const {sid} = ctx.session;

      const {type,limit,offset} = _.defaults(ctx.request.body,{
         type:"0",
         limit:0,
         offset:0
      })
      if(!limit){
         return mapToResp(RES_MAP.UNKNOWN_ERROR, '参数异常');
      }
      let params = {sid,type,limit,offset}
      ctx.body = await ctx.service.order.findOrderInfo(params);

   }

   //创建订单
   async createOrder(){
      const {app,ctx} = this;
      const { play_id,playStore_id,remark,order_price,start_time } = _.defaults(ctx.request.body,{
         play_id: 0,
         playStore_id: 0,
         remark:'',
         order_price:0,
         start_time:'',
      })
      if(!play_id || !playStore_id || !order_price || start_time==''){
         return mapToResp(RES_MAP.UNKNOWN_ERROR, '参数异常');
      }
      const {sid} = ctx.session;
      let params = {sid,play_id,playStore_id,remark,order_price,start_time};
      ctx.body = await ctx.service.order.createOrder(params);

   }

   //取消订单
   async cancelOrder(){
      const {app,ctx} = this;
      const {order_id} = _.defaults(ctx.request.body,{
         order_id: 0,
      })
      if(!order_id){
         return mapToResp(RES_MAP.UNKNOWN_ERROR, '订单数据异常');
      }
      ctx.body = await ctx.service.order.cancelOrder(order_id);
   }

   //确认接单
   async confirmOrder(){
      const {app,ctx} = this;
      const {order_id} = _.defaults(ctx.request.body,{
         order_id: 0,
      })
      if(!order_id){
         return mapToResp(RES_MAP.UNKNOWN_ERROR, '订单数据异常');
      }
      const {sid} = ctx.session;
      ctx.body = await ctx.service.order.confirmOrder(id,sid);
   }

   //到场确认--用户/陪玩
   async showUpConfirm(){
      const {app,ctx} = this;
      const {order_id,type} = _.defaults(ctx.request.body,{
         order_id: 0,
         type:'',
      })
      if(!order_id || type == ''){
         return mapToResp(RES_MAP.UNKNOWN_ERROR, '订单数据异常');
      }
      const {sid} = ctx.session;
      //ctx.body = await ctx.this.service.order.

   }

   //结束确认--用户/陪玩
   async endConfirm(){


   }
   
   //结算订单
   async settleOrder(){

   }




}

module.exports = OrderController