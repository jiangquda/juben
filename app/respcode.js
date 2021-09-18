const RES_MAP = {
    SUCCESS: {code: 0, message: '成功', data: {}},
    UNKNOWN_ERROR:{code:100000,message:"未知错误",data:null},
    PARAM_ERROR:{code:100001,message:"参数错误",data:null},
    AUTH_ERROR:{code:100002,message:"用户登录验证错误",data:null},
    OPERATION_OVER:{code:100003,message:"操作过于频繁，稍后再试",data:null},
    PHONE_UNVALIDATE: {code: 100004, message: '手机号码不正确', data: null},

    LOGIN_ERROR:{code:200000,message:"账号或密码错误",data:null},
    REGISTER_ERROR:{code:200001,message:"注册失败",data:null},
    OFFLINE_REWARD_ERROR:{code:200002,message:"离线经验领取失败",data:null},
    COIN_NOT_ENOUGH:{code:200003,message:"金币不足",data:null},
    LEVEL_NOT_ENOUGH:{code:200004,message:"等级不足",data:null},
    MATERIAL_NOT_ENOUGH:{code:200005,message:"材料不足",data:null},
    WINE_NOT_ENOUGH:{code:200006,message:"出售酒不足",data:null},
    BUY_COUNT_NOT_ENOUGH:{code:200007,message:"收购数量不足",data:null},
    CUT_COUNT_NOT_ENOUGH:{code:200008,message:"砍价次数不足",data:null},
    EXCHANGE_CLOSED:{code:200009,message:"市场未开启",data:null},
    EXCHANGE_OPEND:{code:200010,message:"市场开启中",data:null},
    STAR_NOT_ENOUGH:{code:200011,message:"星级不足",data:null},
    DIAMOND_NOT_ENOUGH:{code:200012,message:"钻石不足",data:null},
    MAOTAI_NOT_ENOUGH:{code:200013,message:"茅台兑换数量不足",data:null},

    WINE_GROUP_UNLOCK:{code:300000,message:"酒坊解锁失败",data:null},
    WINE_GROUP_NOT_FOUND:{code:300001,message:"酒坊不存在",data:null},
    WINE_NOT_FOUND:{code:300002,message:"酒不存在",data:null},
    WINE_CONDITION_ERROR:{code:300003,message:"酿酒失败",data:null},
    WINE_MAKE_ZERO:{code:300004,message:"酿酒次数已用完",data:{}},
    WINE_CAN_NOT_MIX:{code:300005,message:"该酒不能勾兑",data:{}},
    WINE_GROUP_EXIST:{code:300006,message:"酒坊已解锁",data:{}},
    WINE_LOCKED:{code:300007,message:"酒未解锁",data:null},
    WINE_IS_UNLOCK:{code:300008,message:"酒已解锁",data:null},
    WINE_GROUP_LOCKED:{code:300009,message:"酒坊未解锁",data:null},
    WINE_GROUP_REWARD_FINISH:{code:300010,message:"奖励已领取",data:null},
    WINE_GROUP_REWARD_ENABLE:{code:300011,message:"领取条件不足",data:null},
    WINE_EXIST_OTHER:{code:300012,message:"一次只能酿造一种酒",data:null},
    WINE_COUNT_DOWN_NOT_END:{code:300013,message:"酿酒倒计时尚未结束",data:null},
    ALREADY_BOTTLE:{code:300014,message:"已装瓶的酒不可再装",data:null},
    
    BEYOND_TODAY_LOTTERY_NUM:{code:300015,message:"今日抽奖次数已用完",data:null},

    HAVE_UNBOTTLE_WINE:{code:300016,message:"该酒坊有未装瓶的酒，请装瓶",data:null},

    AD_ERROR:{code:400000,message:"广告未完成",data:null}

  };
  
  module.exports = {
    RES_MAP,
    mapToResp(type, data) {
      if (type == null) {
        return RES_MAP.UNKNOWN_ERROR;
      }
  
      const resp = Object.assign({}, type);
      resp.data = data || {};
      return resp;
    },
  };
  