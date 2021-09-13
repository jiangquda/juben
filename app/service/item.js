const Service = require('egg').Service
const {RES_MAP, mapToResp} = require('../respcode');
const {ASSETS_TYPE} = require('../config/const')
const _ = require('lodash');
const shortid = require('js-shortid')
let {CFG_WINE, CFG_BOTTLE,WINE_STATUS} = require('../config/const');

class ItemService extends Service {

    async addMaterial(material_id, from, uid){
        const {ctx,app} = this
        const {UserItem} = ctx.model
        let material = await UserItem.findOne({
            where:{
                user_id: uid,
                item_id: material_id,
                group_id:ASSETS_TYPE.MATERIAL
            }
        })
        let {count} = _.defaults(
            material,{
                count:0
            }
        )
        count++
        await ctx.model.UserItem.upsert({
            user_id:uid,
            item_id: material_id,
            group_id:ASSETS_TYPE.MATERIAL,
            count,
            updated_at: new Date()
        })
        app.bull.get('LogQueue').add({ action: 'item',log:{uid,item_id:material_id,group_id:ASSETS_TYPE.MATERIAL,count,from} });
    }

    async useMaterial(material_id, from, uid, use_count){
        const {ctx,app} = this
        const {UserItem} = ctx.model
        const {literal} = this.app.Sequelize
        await UserItem.update({
            count:literal(`count - ${use_count}`),
            updated_at: new Date()
        },{
            where:{
                user_id:uid,
                item_id: material_id,
                group_id:ASSETS_TYPE.MATERIAL,
            }
        })
        app.bull.get('LogQueue').add({ action: 'item',log:{uid,item_id:material_id,group_id:ASSETS_TYPE.MATERIAL,count:-use_count,from} });
    }

    async sellWine(wine_id,count,uid,from){
        const {ctx,app} = this
        const {Op,literal} = this.app.Sequelize;
        await ctx.model.UserItem.update({
            count: literal(`count - ${count}`), 
            updated_at: new Date(),
          },{
            where:{
              user_id:uid,
              item_id:wine_id,
              group_id:ASSETS_TYPE.WINE
            }
        })
        app.bull.get('LogQueue').add({ action: 'item',log:{uid,item_id:wine_id,count:-count,from,group_id:ASSETS_TYPE.WINE}});
    }


    //==================================================================
    //保留老接口：用默认瓶子、最大香气值、未上架
    async addWine(wine_id, uid, from=null) {
        const {ctx,app} = this
        const redisClient = this.ctx.app.redis.get('cache')
        const {literal} = this.app.Sequelize;

        let aroma_range = JSON.parse(CFG_WINE[wine_id].aroma_scope)
        let aromaValue = aroma_range[1]
        let count = CFG_BOTTLE[101].wbCapacity
        let bottleId = 1

        let now = this.getNow()
        let wine_uuid = shortid.gen()
        await ctx.model.UserItem.create({
            item_uuid : wine_uuid,
            user_id : uid,
            item_id : wine_id,
            group_id : ASSETS_TYPE.WINE,
            count : count,
            aroma_value : aromaValue,
            wb_id : bottleId,
            botting_time : now,
            sell_flag : 0,
            updated_at : new Date()
        })

        await redisClient.hmset(this.REDIS_WINE(uid, CFG_WINE[wine_id].group, wine_uuid), {
            group_id : CFG_WINE[wine_id].group,
            wine_id : wine_id,
            wine_uuid : wine_uuid,
            aroma_value : aromaValue,
            make_time : now,
            wb_id : bottleId,
            count : count,
            botting_time : now,
            status : WINE_STATUS.BOTTLE
        })

        if (wine_id == 2653) {
            await ctx.model.MaotaiActivity.update({
                count:literal(`count + ${1}`),
            },{
                where:{
                    user_id:uid,
                }
            })
        }

        //暂不出售茅台
        if (wine_id != 2653) {
            await this.pushSellList(uid, CFG_WINE[wine_id].group, wine_uuid)
            await this.setSelling(uid,CFG_WINE[wine_id].group);
        }

        if(!from){
            app.bull.get('LogQueue').add({ action: 'item',log:{uid,item_id:wine_id,group_id:ASSETS_TYPE.WINE,count,from:UserItemLog.TYPE.MAKE_WINE} });
        }else{
            app.bull.get('LogQueue').add({ action: 'item',log:{uid,item_id:wine_id,group_id:ASSETS_TYPE.WINE,count,from} });
        }
        return wine_uuid;
    }

    /**
     * 对数组中的对象，按对象的key进行sortType排序
     * @param key 数组中的对象为object,按object中的key进行排序
     * @param sortType true为降序；false为升序
     */
    keysort(key,sortType) {
        return function(a,b){
            return sortType ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
    }

    getNow() {
        return Math.floor(new Date().getTime()/1000)
    }

    REDIS_ALL_WINE(uid) {
        return `HASH:BOTTLE:${uid}:*`
    }

    REDIS_GROUP_WINE(uid, wine_group) {
        return `HASH:BOTTLE:${uid}:${wine_group}:*`
    }

    REDIS_WINE(uid, wine_group, wine_uuid) {
        return `HASH:BOTTLE:${uid}:${wine_group}:${wine_uuid}`
    }

    REDIS_SELL_TIME(uid) {
        return `HASH:BOTTLE:${uid}:start_sell_time`
    }

    REDIS_SELL_LIST(uid, wine_group) {
        return `LIST:SELL_WINE:${uid}:${wine_group}`
    }

    REDIS_ALL_SELL_LIST(uid) {
        return `LIST:SELL_WINE:${uid}:*`
    }

    REDIS_WALLET(uid) {
        return `STRING:WINE_WALLET:${uid}`
    }

    async getWineInfo(uid, wine_group, wine_uuid) {
        const redisClient = this.ctx.app.redis.get('cache')
        let wineInfo = await redisClient.hgetall(this.REDIS_WINE(uid, wine_group, wine_uuid))

        if (Object.keys(wineInfo).length === 0) {
            return null
        }

        wineInfo.group_id = parseInt(wineInfo.group_id)
        wineInfo.wine_id = parseInt(wineInfo.wine_id)
        wineInfo.aroma_value = parseInt(wineInfo.aroma_value)
        wineInfo.wb_id = parseInt(wineInfo.wb_id)
        wineInfo.count = parseInt(wineInfo.count)
        wineInfo.make_time = parseInt(wineInfo.make_time)
        wineInfo.botting_time = parseInt(wineInfo.botting_time)
        wineInfo.status = parseInt(wineInfo.status)
        return wineInfo
    }

    async getStartSellTime(uid, wine_group) {
        const redisClient = this.ctx.app.redis.get('cache')
        let startSellTime = await redisClient.hget(this.REDIS_SELL_TIME(uid), wine_group)
        return startSellTime != null ? parseInt(startSellTime) : this.getNow()
    }

    //获取所有拥有的酒ID
    async getAllWineGroupIds(uid) {
        let idMap = new Map()
        const redisClient = this.ctx.app.redis.get('cache')
        let keys = await redisClient.keys(this.REDIS_ALL_WINE(uid))
        for (let i in keys) {
            let its = keys[i].split(":")
            let wine_group = its[3]

            if (wine_group != "start_sell_time") {
                wine_group = parseInt(wine_group)
                idMap.set(wine_group, true)
            }
        }

        let groupIds = new Array()
        for (let [wine_group, value] of idMap) {
            groupIds.push(wine_group)
        }

        return groupIds
    }

    async getWineInfos(uid, wine_group, status=null) {
        let wineInfos = new Array()
        const redisClient = this.ctx.app.redis.get('cache')
        let keys = await redisClient.keys(this.REDIS_GROUP_WINE(uid, wine_group))
        for (let i in keys) {
            let its = keys[i].split(":")
            let wine_group = its[3]
            let wine_uuid = its[4]

            let wineInfo = await this.getWineInfo(uid, wine_group, wine_uuid)

            if (!status || wineInfo.status == status) {
                wineInfos.push(wineInfo)
            }
        }

        return wineInfos
    }

    async haveUnbottle(uid, wine_group) {
        let wineInfos = await this.getWineInfos(uid, wine_group, WINE_STATUS.LOOSE)
        return wineInfos.length > 0
    }

    async changeWineStatus(uid, wine_group, wine_uuid, status) {
        const redisClient = this.ctx.app.redis.get('cache')
        await redisClient.hset(this.REDIS_WINE(uid, wine_group, wine_uuid), 'status', status)
    }

    async resetStartSellTime(uid, wine_group) {
        const redisClient = this.ctx.app.redis.get('cache')
        await redisClient.hset(this.REDIS_SELL_TIME(uid), wine_group, this.getNow())
    }

    async changeStartSellTime(uid, wine_group, interval) {
        let startSellTime = await this.getStartSellTime(uid, wine_group)
        startSellTime += interval
        const redisClient = this.ctx.app.redis.get('cache')
        await redisClient.hset(this.REDIS_SELL_TIME(uid), wine_group, startSellTime)
    }

    async delWineKey(uid, wine_group, wine_uuid) {
        const redisClient = this.ctx.app.redis.get('cache')
        await redisClient.del(this.REDIS_WINE(uid, wine_group, wine_uuid))
    }

    async getWineAroma(uid, wine_group, wine_uuid, cut_off_time) {
        let wineInfo = await this.getWineInfo(uid, wine_group, wine_uuid)

        if (!wineInfo) {
            return -1
        }

        let decay = 0
        if (wineInfo.status == WINE_STATUS.BOTTLE || wineInfo.status == WINE_STATUS.SELL) {
            if (cut_off_time - wineInfo.botting_time >= CFG_WINE[wineInfo.wine_id].pad_interval) {
                let decayTimes = Math.floor((cut_off_time - wineInfo.botting_time) / CFG_WINE[wineInfo.wine_id].pad_interval)
                decay = decayTimes * (CFG_WINE[wineInfo.wine_id].pad_value - CFG_BOTTLE[wineInfo.wb_id].wbPadValue)
            }
        }

        let aroma = wineInfo.aroma_value - decay
        if (aroma < CFG_WINE[wineInfo.wine_id].min_aroma) {
            aroma = CFG_WINE[wineInfo.wine_id].min_aroma
        } else if (aroma > CFG_WINE[wineInfo.wine_id].max_aroma) {
            aroma = CFG_WINE[wineInfo.wine_id].max_aroma
        }

        return aroma
    }

    async getWorthBySellTime(uid, wine_group, wine_uuid, startSellTime) {
        let wineInfo = await this.getWineInfo(uid, wine_group, wine_uuid)
        let wineSellTime = await this.getWineSellTime(uid, wine_group, wine_uuid)

        let aroma = await this.getWineAroma(uid, wine_group, wine_uuid, startSellTime + wineSellTime)
        return Math.floor((aroma / CFG_WINE[wineInfo.wine_id].max_aroma) * CFG_WINE[wineInfo.wine_id].price * wineInfo.count)
    }

    async getWineWorth(uid, wine_group, wine_uuid) {
        let wineStartSellTime = await this.getStartSellTime(uid, wine_group, wine_uuid)
        let worth = await this.getWorthBySellTime(uid, wine_group, wine_uuid, wineStartSellTime)
        return worth
    }

    //售卖时间
    async getWineSellTime(uid, wine_group, wine_uuid) {
        let wineInfo = await this.getWineInfo(uid, wine_group, wine_uuid)
        return wineInfo.count * CFG_WINE[wineInfo.wine_id].sell_time
    }

    async hasSelling(uid, wine_group) {
        let wineInfos = await this.getWineInfos(uid, wine_group, WINE_STATUS.SELL)
        return wineInfos && wineInfos.length > 0
    }

    async setSelling(uid, wine_group, isSelling = false) {
        let isHas = await this.hasSelling(uid, wine_group)
        if (isHas) {
            return null
        }

        let firstWineUuid = await this.getWineByIndex(uid, wine_group, 0)
        if (!firstWineUuid) {
            return null
        }
        
        await this.changeWineStatus(uid, wine_group, firstWineUuid, WINE_STATUS.SELL)
        if (!isSelling) {
            await this.resetStartSellTime(uid, wine_group)
        }
        return firstWineUuid
    }

    async findCanSell(uid, group_id=null) {
        let now = this.getNow()
        let groupIds = new Array()
        if (group_id != null) {
            groupIds.push(group_id)
        } else {
            groupIds = await this.getSellListGroupIds(uid)
        }

        let sellList = new Array()
        for (let i in groupIds) {
            let wine_group = groupIds[i]

            let waitSellUuids = await this.getWineSellList(uid, wine_group)
            if (!waitSellUuids || waitSellUuids.length == 0) {
                continue
            }

            let wineStartSellTime = await this.getStartSellTime(uid, wine_group)
            for (let j in waitSellUuids) {
                let wineInfo = await this.getWineInfo(uid, wine_group, waitSellUuids[j])
                if (!wineInfo) {
                    break
                }

                let wineSellTime = await this.getWineSellTime(uid, wine_group, waitSellUuids[j])
                if (wineStartSellTime + wineSellTime > now) {
                    break
                }
                
                sellList.push(wineInfo)
                wineStartSellTime += wineSellTime
            }
        }

        return sellList
    }

    //1-散酒，2-瓶装未上架，3-瓶装已上架，4-待售中
    async makeWine(uid, wine_id, count, aroma_value,wine_uuid) {
        const redisClient = this.app.redis.get('cache')

        if ((!count || count < 0) || (!aroma_value || aroma_value < 0)) {
            return false
        }

        if (!CFG_WINE[wine_id]) {
            return false
        }

        let aroma_range = JSON.parse(CFG_WINE[wine_id].aroma_scope)
        if (aroma_value < aroma_range[0] || aroma_value > aroma_range[1]) {
            return false
        }

        let hashKey = this.REDIS_WINE(uid, CFG_WINE[wine_id].group, wine_uuid)
        let result = {
            group_id : CFG_WINE[wine_id].group,
            wine_id : wine_id,
            wine_uuid : wine_uuid,
            aroma_value : aroma_value,
            make_time : this.getNow(),
            wb_id : 0,
            count : count,
            botting_time : 0,
            status : WINE_STATUS.LOOSE
        }
        await redisClient.hmset(hashKey,result)

        return true
    }

    //装瓶
    async bottingWine(uid, group_id, wine_uuid, bottle_id, count) {
        const {ctx,app} = this
        const redisClient = this.app.redis.get('cache')
        
        let hashKey = this.REDIS_WINE(uid, group_id, wine_uuid)
        let wineInfo = await redisClient.hgetall(hashKey)

        if (!wineInfo) {
            return false
        }

        if (count > wineInfo.count) {
            return false
        }

        let now = this.getNow()

        let wine_bottle_uuid = shortid.gen()
        await ctx.model.UserItem.create({
            item_uuid : wine_bottle_uuid,
            user_id : uid,
            item_id : wineInfo.wine_id,
            group_id : ASSETS_TYPE.WINE,
            count : count,
            aroma_value : wineInfo.aroma_value,
            wb_id : bottle_id,
            botting_time : now,
            sell_flag : 0,
            updated_at : new Date()
        })

        await redisClient.hmset(this.REDIS_WINE(uid, group_id, wine_bottle_uuid), {
            group_id : group_id,
            wine_id : wineInfo.wine_id,
            wine_uuid : wine_bottle_uuid,
            aroma_value : wineInfo.aroma_value,
            make_time : wineInfo.make_time,
            wb_id : bottle_id,
            count : count,
            botting_time : now,
            status : WINE_STATUS.BOTTLE,
        })

        let newCount = await redisClient.hincrby(hashKey, "count", -count)
        if (newCount == 0) {
            await redisClient.del(hashKey)
        }
        await this.pushSellList(uid, group_id, wine_bottle_uuid)
        let bottleWineInfo = await this.getWineInfo(uid, group_id, wine_bottle_uuid);
        bottleWineInfo.sort = await this.getWineIndex(uid, group_id, wine_bottle_uuid)
        return bottleWineInfo
    }

    async getWineWalletCount(uid) {
        const redisClient = this.ctx.app.redis.get('cache')
        let count = await redisClient.get(this.REDIS_WALLET(uid))
        return count == null ? 0 : parseInt(count)
    }

    async addWineWalletCount(uid, count) {
        const redisClient = this.ctx.app.redis.get('cache')
        let newcount = await redisClient.incrby(this.REDIS_WALLET(uid), count)
        return newcount == null ? 0 : parseInt(newcount)
    }

    async clearWineWalletCount(uid) {
        const redisClient = this.ctx.app.redis.get('cache')
        await redisClient.set(this.REDIS_WALLET(uid), 0)
    }

    async getWineSellList(uid, wine_group) {
        const redisClient = this.ctx.app.redis.get('cache')
        return await redisClient.lrange(this.REDIS_SELL_LIST(uid, wine_group), 0, -1)
    }

    async getSellingWine(uid, wine_group) {
        let wine_uuid = await this.getWineByIndex(uid, wine_group, 0)
        if (wine_uuid) {
            return await this.getWineInfo(uid, wine_group, wine_uuid)
        }

        return null
    }

    async getWineIndex(uid, wine_group, wine_uuid) {
        const redisClient = this.ctx.app.redis.get('cache')
        let key = this.REDIS_SELL_LIST(uid, wine_group)
        let len = await redisClient.llen(key)

        let target
        for (let index = 0; index < len; index++) {
            let indexWineUuid = await redisClient.lindex(key, index)
            if (indexWineUuid == wine_uuid) {
                target = index
            }
        }

        return target
    }

    async getWineByIndex(uid, wine_group, index) {
        const redisClient = this.ctx.app.redis.get('cache')
        return await redisClient.lindex(this.REDIS_SELL_LIST(uid, wine_group), index)
    }

    async pushSellList(uid, wine_group, wine_uuid) {
        const redisClient = this.ctx.app.redis.get('cache')
        await redisClient.rpush(this.REDIS_SELL_LIST(uid, wine_group), wine_uuid)
    }

    async insertSellList(uid, wine_group, index, insert_index) {
        let indexWineUuid = await this.getWineByIndex(uid, wine_group, index)
        let insertWineUuid = await this.getWineByIndex(uid, wine_group, insert_index)

        const redisClient = this.ctx.app.redis.get('cache')
        let key = this.REDIS_SELL_LIST(uid, wine_group)
        await redisClient.lrem(key, 0, indexWineUuid)
        await redisClient.linsert(key, "before", insertWineUuid, indexWineUuid)
    }

    async popSellList(uid, wine_group, wine_uuid) {
        const redisClient = this.ctx.app.redis.get('cache')
        await redisClient.lrem(this.REDIS_SELL_LIST(uid, wine_group), 0, wine_uuid)
    }

    async delSellList(uid, wine_group) {
        const redisClient = this.ctx.app.redis.get('cache')
        await redisClient.lpop(this.REDIS_SELL_LIST(uid, wine_group))
    }

    //获取所有拥有的酒ID
    async getSellListGroupIds(uid) {
        const redisClient = this.ctx.app.redis.get('cache')
        let keys = await redisClient.keys(this.REDIS_ALL_SELL_LIST(uid))

        let groupIds = new Array()
        for (let i in keys) {
            let its = keys[i].split(":")
            groupIds.push(+its[3])
        }

        return groupIds
    }

    async getAllSoldWine(uid) {
        let solds = new Array()
        let groupIds = await this.getAllWineGroupIds(uid)
        for (let i in groupIds) {
            let group_id = groupIds[i]
            let wineInfos = await this.getWineInfos(uid, group_id, WINE_STATUS.SOLD)

            for (let j in wineInfos) {
                solds.push(wineInfos[j])
            }
        }

        return solds
    }

    async clearAllSoldWine(uid) {
        let solds = await this.getAllSoldWine(uid)
        for (let i in solds) {
            let wineInfo = solds[i]
            await this.delWineKey(uid, wineInfo.group_id, wineInfo.wine_uuid)
        }
    }

}

module.exports = ItemService