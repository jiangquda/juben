'use strict'

const Service = require('egg').Service
const { RES_MAP, mapToResp } = require('../respcode');

class PlayStoreService extends Service {
    
    async getPlayStoreList(start,end){
        const {ctx,app} = this;
        let playStore = await ctx.model.PlayStore.findAll({
            where: {state: 0}
        },{
            offset : start,
            limit: end,
        });
        playStore = playStore.map(item => {
            return {
                id: item.id,
                ps_name: item.ps_name ,
                ps_logo: item.ps_logo ,
                ps_address: item.ps_address ,
                tel: item.tel,
                remark: item.remark,
            };
        });

        if(playStore == null){
            return mapToResp(RES_MAP.UNKNOWN_ERROR, '查询剧本店信息失败');
        }else{
            return mapToResp(RES_MAP.SUCCESS, playStore);
        }
        
    }

    async addPlayStore(params){
        const {ctx,app} = this;

        let result = await ctx.model.PlayStore.create({
            ps_name: params.ps_name,
            ps_address: params.ps_address,
            tel: params.tel,
            remark: params.remark,
        })
        if(!result){
            return mapToResp(RES_MAP.UNKNOWN_ERROR, '添加剧本店信息失败');
        }else{
            return mapToResp(RES_MAP.SUCCESS, result);
        }

    }

    async delPlayStore(id){
        const {ctx,app} = this

        let result = await ctx.model.playStore.update({
            state:1,
        },{
            where: {id:id}
        });

        if(!result){
            return mapToResp(RES_MAP.UNKNOWN_ERROR, '删除剧本店信息失败');
        }else{
            return mapToResp(RES_MAP.SUCCESS, result);
        }

    }


    async updatePlayStore(params){
        const {ctx} = this
        let result = await ctx.model.playStore.update({
            ps_name: params.ps_name,
            ps_address: params.ps_address,
            tel: params.tel,
            remark: params.remark,
        },{
            where :{id: params.id}
        });
        
        if(!result){
            return mapToResp(RES_MAP.UNKNOWN_ERROR, '修改剧本店信息失败');
        }else{
            return mapToResp(RES_MAP.SUCCESS, result);
        }

    }


}

module.exports = PlayStoreService
