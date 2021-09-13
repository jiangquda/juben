const Service = require('egg').Service
const crypto = require('crypto')
const {RES_MAP, mapToResp} = require('../respcode');
const {ASSETS_TYPE,CFG_LEVEL,SKILL_TYPE,CFG_SKILL} = require('../config/const')
const USER_INFO_EXPIRES = 60 * 60 * 24 * 7;
const _ = require('lodash');
class UserService extends Service {

  async signToDb(userInfo) {
    try {
      //let password = crypto.createHash('md5').update(userInfo.password).digest('hex')
      let password = this.getMd5Data(userInfo.password)
      let now = new Date()
      await this.ctx.model.User.create({
        user_name:userInfo.username,
        password:password,
        create_dt:now,
        modify_dt:now,
      });
    } catch (e) {
      this.ctx.logger.error(e);
      return mapToResp(RES_MAP.UNKNOWN_ERROR, e.toString());
    }

    const [user] = await this.ctx.model.User.findAll({
      where: {user_name: userInfo.username},
      limit: 1,
    });
    if (!user) {
      return mapToResp(RES_MAP.UNKNOWN_ERROR, '用户创建失败');
    }
    return mapToResp(RES_MAP.SUCCESS, user);
  }

  async updateCoin(count,channel,type,uid,exp=0,star=0,diamond=0,transaction){
    const {ctx} = this
    const {User, AssetLog} = ctx.model
    const {literal} = this.app.Sequelize;
    const redisClient = this.app.redis.get('cache');
    let userinfo = await User.findOne({
      where:{
        id: uid
      }
    })
    count =+count
    let prev_amount = userinfo.coin
    const promises = [
      AssetLog.create({
        user_id:uid,
        amount: count,
        prev_amount,
        channel,
        type
      },
      {transaction})
    ]
    let cur_exp = userinfo.exp
    let cur_level = userinfo.level
    exp = 0
    if(exp){
      while(CFG_LEVEL[cur_level.toString()] && CFG_LEVEL[cur_level.toString()].exp <= cur_exp+exp){
        cur_level++
      }
      
      promises.push(
        ctx.model.User.update({
          level: cur_level,
          exp:literal(`exp + ${exp}`),
          coin: literal(`coin + ${count}`),
          star: literal(`star + ${star}`),
          diamond:literal(`diamond + ${diamond}`),
          updated_at: new Date(),
        },{
          where:{
            id:uid
          }
        },
        {transaction})
      )
      promises.push(
        redisClient.hmset(`HASH:USER:INFO:${uid}`,'star',userinfo.star+star)
      )

      promises.push(
        redisClient.hmset(`HASH:USER:INFO:${uid}`,'exp',userinfo.exp+exp)
      )
      promises.push(
        redisClient.hmset(`HASH:USER:INFO:${uid}`,'diamond',userinfo.diamond+diamond)
      )
      promises.push(
        redisClient.hmset(`HASH:USER:INFO:${uid}`,'level',cur_level)
      )
    }else{
      promises.push(
        ctx.model.User.update({
          coin: literal(`coin + ${count}`), 
          star: literal(`star + ${star}`),
          diamond:literal(`diamond + ${diamond}`),
          updated_at: new Date(),
        },{
          where:{
            id:uid
          }
        },
        {transaction})
      )
    }
    promises.push(
      redisClient.hmset(`HASH:USER:INFO:${uid}`,'star',userinfo.star+star)
    )
    promises.push(
      redisClient.hmset(`HASH:USER:INFO:${uid}`,'coin',userinfo.coin+count)
    )
    promises.push(
      redisClient.hmset(`HASH:USER:INFO:${uid}`,'diamond',userinfo.diamond+diamond)
    )
    await Promise.all(promises)
    return {new_coin:userinfo.coin+count,new_level:cur_level,
      new_exp:userinfo.exp+exp,new_star:userinfo.star+star,
      new_diamond:userinfo.diamond+diamond}
  }

  async getOnlineReward(coin,uid,id){
    const {ctx} = this
    const {Op} = this.app.Sequelize
    const {AssetLog,UserWineGroup} = ctx.model;
    const redisClient = this.app.redis.get('cache');
    let key = "HASH:ONLINE:"+uid
    let onlineinfo = await redisClient.hgetall(key)
    let {online,online_reward, extra_reward} = onlineinfo
    online = +online || 0
    online_reward = +online_reward
    extra_reward = +extra_reward
    
    let now = new Date()
    let off_time = Math.floor((now.getTime() - online)/1000)
    let minute_reward = await ctx.service.wine.userOnlineReward(uid)
    let skillInfo = await ctx.service.skill.getSkillInfo(uid)
    let effect = JSON.parse(skillInfo.effect)
    console.info(effect)
    console.info(CFG_SKILL[(SKILL_TYPE.ONILINE_COIN_PER+1).toString()][effect[SKILL_TYPE.ONILINE_COIN_PER].toString()])
    console.info(CFG_SKILL[(SKILL_TYPE.ONLINE_COIN+1).toString()][effect[SKILL_TYPE.ONLINE_COIN].toString()])
    let skillcoinper = CFG_SKILL[(SKILL_TYPE.ONILINE_COIN_PER+1).toString()][effect[SKILL_TYPE.ONILINE_COIN_PER].toString()]/100 || 0
    let skillCoinCfg = CFG_SKILL[(SKILL_TYPE.ONLINE_COIN+1).toString()][effect[SKILL_TYPE.ONLINE_COIN].toString()]
    let skillcoin = skillCoinCfg?skillCoinCfg.effect : 0
    console.info(skillcoinper,skillcoin)
    minute_reward = minute_reward + minute_reward*skillcoinper + skillcoin
    console.info(online,online_reward,off_time,minute_reward)
    let can_get = Math.floor(minute_reward/60*off_time) - online_reward + extra_reward
    if(!can_get){
      can_get = 0
    }
    ctx.logger.info("can_get",can_get,"coin",coin,"effect",effect,"uid",uid)
    if(coin > can_get){
      coin = can_get > 0 ? can_get:0
    }
    if(coin > 0){
      online_reward += coin
      let {new_coin,new_level,new_exp} = await this.updateCoin(coin,AssetLog.CHANNEL.ONLINE,AssetLog.TYPE.INCOME,uid,coin)
      await redisClient.hmset(key,"online_reward",online_reward)
      return mapToResp(RES_MAP.SUCCESS,{coin,exp:coin,new_coin,new_level,new_exp,id})
    }else{
      ctx.logger.info("getOnlineReward error",coin)
      return mapToResp(RES_MAP.SUCCESS,{coin,id})
    }
    
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(uid, rebuild = false) {
    const redisClient = this.app.redis.get('cache');
    let user = await redisClient.hgetall(`HASH:USER:INFO:${uid}`);
    user = await this._buildUserInfo(uid, user, rebuild);
    if (!user) {
      return mapToResp(RES_MAP.USER_UNEXISTS);
    }
    return mapToResp(RES_MAP.SUCCESS, user);
  }

  /**
   * 批量获取用户信息
   */
  async getUserInfos(uids) {
    const redisClient = this.app.redis.get('cache');
    const pipeline = redisClient.pipeline();
    for (const uid of uids) {
      pipeline.hgetall(`HASH:USER:INFO:${uid}`);
    }
    const results = await pipeline.exec();
    const infos = {};
    for (const [index, [err, user]] of results.entries()) {
      const uid = uids[index];
      if (err) {
        this.ctx.logger.error(err);
        continue;
      }
      const info = await this._buildUserInfo(uid, user);
      infos[uid] = info ? info : null;
    }
    return mapToResp(RES_MAP.SUCCESS, infos);
  }


  /**
   * 建立缓存留存7天
   */
  async _buildUserInfo(uid, user, rebuild = false) {
    if (user && user.id && !rebuild) {
      //类型修正
      // user.coin = +user.coin;
      // user.level = +user.level;
      // user.exp = +user.exp;
      // user.star = +user.star;
      // user.diamond = +user.diamond;
      return user;
    }

    user = await this.ctx.model.User.findOne({
      where: {id: uid}
    });

    if (!user) {
      return null;
    }

    const result = {
      id: user.id,
      user_name: user.user_name,
      uuid: user.uuid,
    };
    const redisClient = this.app.redis.get('cache');
    const key = `HASH:USER:INFO:${uid}`;
    await redisClient.multi()
      .hmset(key, result)
      .expire(key, USER_INFO_EXPIRES)
      .exec();

    return result;
  }

  /**
   * 更新用户信息
   * 同步更新缓存
   */
  async updateUserInfo(uid, updates = {}, transaction = null) {
    updates.updated_at = new Date();
    await this.ctx.model.User.update(updates, {
      where: {id: uid},
      transaction: transaction
    });

    const redisClient = this.app.redis.get('cache');
    const key = `HASH:USER:INFO:${uid}`;
    const user = await redisClient.hgetall(key);
    if (user && user.id) {
      delete updates.updated_at;
      if (Object.keys(updates).length) {
        await redisClient.hmset(key, updates);
      }
    }
  }


  getMd5Data(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }


  async getUserInfoAndRole(sid){
    const {ctx} = this;
    const roleModel = ctx.model.Role;
    const userModel = ctx.model.User;
    
    userModel.belongsTo(roleModel, {foreignKey: 'role_id'});
    //userModel.hasOne(roleModel,{foreignKey:'role_id',as:'info'})
    const userInfo = await ctx.model.User.findOne({
        where:{
          id:sid
        },
        include:{
          attributes:['role_name','role_name_en'],
          model:roleModel,
          //as : 'info',
          required:false,
        }
      })

    return mapToResp(RES_MAP.SUCCESS, userInfo);
  }


  async getUserExtra(sid){
    const {ctx} = this;
    const userModel = ctx.model.User;
    const userExtraModel = ctx.model.UserExtra;

    userModel.hasMany(userExtraModel);
    userExtraModel.belongsTo(userModel,{foreignKey:'user_id'});

    let userInfo = await ctx.model.User.findAll({
      where:{
        id:sid
      },
      include:{
        attributes:['extra_name'],
        model:userExtraModel,
        required:false,
      }
    })
    return mapToResp(RES_MAP.SUCCESS, userInfo);
  }

  /**
   * @tx
   */
  async updateUserExtra(uid,name){
    const {ctx} = this;
    transaction = await this.ctx.model.transaction();

    try{
      await ctx.model.UserExtra.update({
        extra_name:name
      },{
        where:{
          user_id:uid
        }
      })

      await ctx.model.UserExtra.update({
        extra_name:name
      },{
        where:{
          xxx:uid
        }
      })
      await transaction.commit();
    }catch{
      await transaction.rollback();
    }
    

    let userInfo = await this.getUserExtra(uid);
    let count = 0/0
    return mapToResp(RES_MAP.SUCCESS, userInfo);

  }

}


module.exports = UserService