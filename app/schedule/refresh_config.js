/**
 * 每小时扫描交易记录生成行情数据
 */

 const Subscription = require('egg').Subscription;
 let {CFG_LEVEL,CFG_SKILL,CFG_WINE,CFG_WINE_GROUP, CFG_BOTTLE, CFG_LOTTERY} = require('../config/const');
 class RefreshConfigSubscription extends Subscription {
   static get schedule() {
     return {
       interval: '1m',
       type: 'all',
       immediate: true, //项目启动时执行一次
    //    disable:true
    //    disable: process.env.EGG_SCHEDULE !== 'true'
     };
   }
 
   async subscribe() {
     return ;
     const {ctx} = this;
     const {Sequelize} = this.app;
     const key = this.app.config.refresh_key;
     const redisClient = this.app.redis.get('cache');
     
     let need_flag = await redisClient.get(key);
     
     ctx.logger.info(need_flag)
     need_flag = +need_flag
     if(!need_flag) return
     let level = await ctx.model.CfgLevel.findAll()
     level = level.map(item => {
        return {
          id: item.id,
          exp: item.exp ,
          level: item.level ,
          winecap: item.winecap ,
        };
      });
     for(let k in level){
         let v = level[k]
         CFG_LEVEL[v.id] = v
     }
    //  let pack = require('./cfg_material_pack')
    //  const CFG_MATERIAL_PACK = {}
    //  for(let k in pack){
    //      let v = pack[k]
    //      CFG_MATERIAL_PACK[v.id] = v
    //  }
     
    let skill = await ctx.model.CfgSkill.findAll()
    // CFG_SKILL = {}
    skill = skill.map(item => {
        return {
          id: item.id,
          level: item.level ,
          cost: item.cost ,
          effect: item.effect ,
          skill_id:item.skill_id,
          unlock: item.unlock
        };
      });
     for(let k in skill){
         let v = skill[k]
         if(!CFG_SKILL[v.skill_id]){
             CFG_SKILL[v.skill_id] = {}
         }
         CFG_SKILL[v.skill_id][v.level] = v
     }

     let wine = await ctx.model.CfgWine.findAll()
     wine = wine.map(item => {
        return {
            id: item.id,
            group:item.group,
            group_name:item.group_name,
            name:item.name,
            level:item.level,
            price:item.price,
            unlock:item.unlock,
            make_material:item.make_material,//{1:100,2:100}
            up_material:item.up_material, 
            make_probability:item.make_probability,//{1:[1,2,3],2:[1,2,3],3:[1,2,3]}
            make_condition:item.make_condition,
            mix_wine_count:item.mix_wine_count,
            mix_bottle_count:item.mix_bottle_count,
            online_reward:item.online_reward,
            offline_reward:item.offline_reward,
            make_exp:item.make_exp,
            make_first_exp:item.make_first_exp,
            shop_price_range:item.shop_price_range,
            group_wine_id: item.group_wine_id,
            star: item.star,
            reward :item.reward,
            make_cost: item.make_cost,
            make_first_diamond:item.make_first_diamond,
            make_weight: item.make_weight,
            make_time: item.make_time,
            aroma_scope : item.aroma_scope,
            pad_value : item.pad_value,
            pad_interval : item.pad_interval,
            amount_scope : item.amount_scope,
            locak_term : item.lock_term,
            sell_time : item.sell_time,
            star_progress : item.star_progress,
            lock_id : item.lock_id,
            max_aroma : item.max_aroma,
            min_aroma : item.min_aroma,
        };
      });

      for(let k in wine){
        let v = wine[k]
        CFG_WINE[v.id] = v
        //启动服务器时，把wine的缓存数据刷新一下
        await redisClient.hmset(`HASH:WINE:INFO:${v.id}`, v);
    }

    let winegroup = await ctx.model.CfgWineGroup.findAll()
    winegroup = winegroup.map(item => {
        return {
            id: item.id,
            group:item.group,
            wines:item.wines,//{1:{cost:1000,unlock:3}}
            // wines_unlock:{type: STRING(255), allowNull: false, defaultValue: ''},
            // wines_cost:{type: STRING(255), allowNull: false, defaultValue: ''},
            reward:item.reward,
            cost:item.cost,
            unlock:item.unlock
        };
      });

      for(let k in winegroup){
        let v = winegroup[k]
        CFG_WINE_GROUP[v.id] = v
    }

    let wineBottle = await ctx.model.CfgWineBottle.findAll()
    wineBottle = wineBottle.map(item => {
      return {
        wbId: item.wb_id,
        wbName : item.wb_name,
        wbDescribe : item.wb_describe,
        wbCapacity : item.wb_capacity,
        skillId : item.skill_id,
        wbPadValue : item.wb_pad_value,
        wbType : item.wbType,
        wbLimit : item.wb_limit,
        consume_bottle: item.consume_bottle
      };
    });
    for(let k in wineBottle){
      let v = wineBottle[k]
      CFG_BOTTLE[v.wbId] = v
    }

    let cfgLottery = await ctx.model.CfgLottery.findAll()
    cfgLottery = cfgLottery.map(item => {
      return {
        id : item.id,
        wb_id : item.wb_id,
        weight : item.weight,
        star : item.star
      };
    });
    for(let k in cfgLottery){
      let v = cfgLottery[k]
      CFG_LOTTERY[v.id] = v
    }

    await redisClient.set(key,0);
   }
 }
 
 module.exports = RefreshConfigSubscription;
 