const ASSETS_TYPE = {
    MATERIAL: 1,
    WINE: 2,
    COIN: 3,
    DIAMOND: 4,
    BOTTLE:5
}
const COIN_TYPE = {
    MAKE_WINE:1,
    SELL_JIUZAO:2
}
const SKILL_TYPE = {
    ONILINE_COIN_PER : 0,
    ONLINE_COIN : 1,
    OFFLINE_COIN_PER: 2,
    OFFLINE_COIN: 3,
    OFFLINE_EXTRA: 4,
    WINE_CAP: 5,
    UNLOCK_WINE_GROUP_PER: 6,
    UNLOCK_WINE_PER: 7,
    BUY_MATERIAL_PER: 8,
    SELL_WINE_COUNT: 9,
    SELL_WINE_PRICE_PER: 10,
    PICK_WINE: 11

}
let CFG_WINE = {}
let CFG_WINE_GROUP = {}
const CFG_MATERIAL = {}
let CFG_LEVEL = {}
let CFG_BOTTLE = {}
let CFG_LOTTERY = {}
const CFG_MATERIAL_ARRAY = require('./cfg_material')
for(let k in CFG_MATERIAL_ARRAY){
    let v = CFG_MATERIAL_ARRAY[k]
    CFG_MATERIAL[v.id] = v
}
// let level = require('./cfg_level')
// for(let k in level){
//     let v = level[k]
//     CFG_LEVEL[v.id] = v
// }
let pack = require('./cfg_material_pack')
const CFG_MATERIAL_PACK = {}
for(let k in pack){
    let v = pack[k]
    CFG_MATERIAL_PACK[v.id] = v
}

// let skill = require('./cfg_skill')
let CFG_SKILL = {}
// CFG_SKILL[0] = {
//     "id": "0",
//     "level": "0",
//     "cost": "0",
//     "effect": "[0,0,0,0,0,0,0,0,0,0,0,0]"
// }
// for(let k in skill){
//     let v = skill[k]
//     if(!CFG_SKILL[v.skill_id]){
//         CFG_SKILL[v.skill_id] = {}
//     }
//     CFG_SKILL[v.skill_id][v.level] = v
// }

const CFG_GUIDE = {}
let guide = require('./cfg_guide')
for(let k in guide){
    let v = guide[k]
    if(!CFG_GUIDE[v.guide_group]){
        CFG_GUIDE[v.guide_group] = {}
    }
    if(!CFG_GUIDE[v.guide_group][v.guide_step]){
        CFG_GUIDE[v.guide_group][v.guide_step] = v
    }
}

const WINE_STATUS = {
    LOOSE : 1,  //散酒
    BOTTLE : 2, //装瓶
    SELL : 3,   //待售
    SOLD : 4,   //已售
}

const AD_FINISH_TYPE = {
    DOUBLE_COIN : 1,        //双倍金币
}

module.exports = {
    ASSETS_TYPE,
    COIN_TYPE,
    CFG_WINE,
    CFG_WINE_GROUP,
    CFG_MATERIAL,
    CFG_MATERIAL_ARRAY,
    CFG_LEVEL,
    CFG_MATERIAL_PACK,
    CFG_SKILL,
    SKILL_TYPE,
    CFG_GUIDE,
    CFG_BOTTLE,
    CFG_LOTTERY,
    WINE_STATUS,
    AD_FINISH_TYPE
}