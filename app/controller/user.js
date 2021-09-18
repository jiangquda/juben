const Controller = require('egg').Controller
const _ = require('lodash');
const { RES_MAP, mapToResp } = require('../respcode');
const crypto = require('crypto')
const USERNAME_REG = /^[a-zA-Z0-9]{4,16}$/;
class UserController extends Controller {

  /**
 * @desc: 用户登录
   */
  async login() {
    const { ctx,app } = this;
    const { code } = _.defaults(ctx.request.body, {
      code: '',
    });
    if(code == ''){
      return mapToResp(RES_MAP.UNKNOWN_ERROR, '参数异常');
    }
    //调用微信登录，获取openId
    let openId = 'qwerasdfrgrgwe214312e12';
    
    let user = await ctx.model.User.findOne({
      where: { openId:openId }
    });

    if (!user) {
      const signResult = await ctx.service.user.signToDb({
        openId
      });

      if (signResult.code) {
        ctx.body = signResult;
        return;
      }
      user = _.get(signResult, 'data', {});
    }
    // else{
    //   if (user.password != crypto.createHash('md5').update(password).digest('hex')){
    //     ctx.body = mapToResp(RES_MAP.LOGIN_ERROR,{});
    //     return;
    //   }
    // }
    //await ctx.service.user.checkOfflineReward(user.id)
    ctx.session.sid = user.id;
    ctx.session.openId = user.openId;
    ctx.session.maxAge = 30 * 24 * 60 * 60 * 1000;   // 存储30天
    let key = `LOGIN:SESSION:${user.id}`
    let newkey = ctx.session._sessCtx.externalKey
    let redisClient = ctx.app.redis.get('cache')
    let lastkey = await redisClient.get(key)
    if(lastkey != newkey){
      await redisClient.set(key,newkey)
      if(lastkey){
        let sessionClient = ctx.app.redis.get('session')
        await sessionClient.del(lastkey)
      }
    }
    //app.bull.get('UserQueue').add({ action: 'update_login',uid:user.id });
    ctx.body = mapToResp(RES_MAP.SUCCESS, {
        uid: user.id || '',
        openId: user.openId,
        uuid: user.uuid || '',
        server_time: Math.floor(new Date().getTime() / 1000)
    });
    ctx.body = mapToResp(RES_MAP.SUCCESS, user);
  }


  /**
   * 用户登出
   */
  async logout() {
    const { ctx } = this;
    let time_now = new Date().getTime()
    await ctx.service.redis.set("offline_"+ctx.session.sid, time_now)
    ctx.session = null;
    ctx.body = mapToResp(RES_MAP.SUCCESS);
  }

  async getUserItem(){
    const { ctx } = this;
    const {sid} = ctx.session;
    ctx.body = await ctx.service.user.getUserInfo(sid)
  }

  async getUserItemInfo(){
    const {ctx} = this;
    const {sid} = ctx.session;
    ctx.body = await ctx.service.user.getUserInfoAndRole(sid)
  }

  async getUserExtraInfo(){
    const {ctx} = this;
    const {sid} = ctx.session;
    ctx.body = await ctx.service.user.getUserExtra(sid)
  }

  async updateUserExtra(){
    const {ctx} = this;
    const {sid} = ctx.session;
    const { name } = _.defaults(ctx.request.body,{
      group_id: '',
    })
    if(name==''){
      ctx.body = mapToResp(RES_MAP.PARAM_ERROR)
    }

    ctx.body = await ctx.service.user.updateUserExtra(sid,name)
  }




  //修改数据
  async updateUser(){

  }

  //确认接单时间
  async confirmWorkTime(){



  }

  



}


module.exports = UserController