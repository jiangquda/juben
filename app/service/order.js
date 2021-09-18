'use strict'

const Service = require('egg').Service
const { RES_MAP, mapToResp } = require('../respcode');
const {ORDER_STATE,ORDER_MEN_STATE} = require('../config/const')

class OrderService extends Service {

    //查询订单-全部/已完成/进行中
    async findOrderInfo(params){
        const {app,ctx} = this;

        let whereObj = {};
        let result = await ctx.model.UserOrder.findAll({
            where:{
                order_state:params.type,
                user_id:params.sid,
            },
            order:{
                order_time:-1,
            }
        },{
            offset : params.offset,
            limit: params.limit,
        });

    }


    //创建订单
    async createOrder(params){
        const {app,ctx} = this;
        let user = await ctx.model.User.findByPk(params.sid);
        let playStore = await ctx.model.PlayStore.findByPk(params.playStore_id);

        let order = await ctx.model.UserOrder.create({
            user_id : params.sid,
            play_id : params.play_id,
            order_state : ORDER_STATE.NO_ORDER_RECEIVE,  //订单状态-未接单
            order_address : playStore.ps_address,
            user_state : ORDER_MEN_STATE.NO_SHOW_UP_CONFIRM,   //未确认
            play_state : ORDER_MEN_STATE.NO_SHOW_UP_CONFIRM,   //未确认
            order_remark : params.remark,
            order_price : params.order_price,
            order_money : params.order_price,
            start_time: params.start_time  
        })

        //给目标用户推送订单消息

        
        if(!order){
            return mapToResp(RES_MAP.UNKNOWN_ERROR, '订单创建失败');
        }
        return mapToResp(RES_MAP.SUCCESS, order);
    }

    //取消订单
    async cancelOrder(id){
        const {app,ctx} = this;

        let order = await ctx.model.UserOrder.findByPk(id);
        if(!order && order.order_state == ORDER_STATE.ORDER_RECEIVE){
            return mapToResp(RES_MAP.UNKNOWN_ERROR, '订单已接，不可取消');
        }

        await ctx.model.UserOrder.update({
            order_state : ORDER_STATE.CANCEL
        },{
            where:{
                id:id
            }
        })
        return mapToResp(RES_MAP.SUCCESS,null);
    }

    //确认接单
    async confirmOrder(id,uid){
        const {app,ctx} = this;

        await ctx.model.UserOrder.update({
            order_state : ORDER_STATE.ORDER_RECEIVE
        },{
            where :{
                id:id
            }
        })

        //接单之后，是否需要把陪玩该段时间的信息取消掉？

        return mapToResp(RES_MAP.SUCCESS,null);
    }

    //确认到场
    async showUpConfirm(id,type){
        const {app,ctx} = this;
        if(type == "user"){
            
        }

    }

    


}

module.exports = OrderService