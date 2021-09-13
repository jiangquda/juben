const Controller = require('egg').Controller
const _ = require('lodash');
const { RES_MAP, mapToResp } = require('../respcode');
const crypto = require('crypto')

class playStoreController extends Controller {

   //获取剧本店信息
   async plsyStoreInfos(){
      //获取订单信息
      const {ctx} = this;
      //ctx.model.PlayStore.findAll()
      const { start,end } = _.defaults(ctx.request.body,{
         start: 0,
         end: 0,
      })

      if(start == 0 || end == 0){
         return mapToResp(RES_MAP.UNKNOWN_ERROR, '参数异常');
      }
      ctx.body = await ctx.service.playStore.getPlayStoreList(start,end);
   }

   //添加剧本店信息
   async addPlayStoreInfo(){
      const {ctx,app} = this;
      const {ps_name,ps_address,tel,remark} = _.defaults(ctx.request.body,{
         ps_name: '',
         ps_address: '',
         tel: 0,
         remark: ''
      })
      if(ps_name == '' || ps_address == '' || !tel){
         return mapToResp(RES_MAP.PARAM_ERROR, '参数异常');
      }
      let params = {
         ps_name: ps_name,
         ps_address: ps_address,
         tel: tel,
         remark: remark
      }
      ctx.body = await ctx.service.playStore.addPlayStore(params);
   } 

   //删除剧本店信息
   async delPlayStoreInfo(){
      const {ctx} = this;
      const {id} = _.defaults(ctx.request.body,{
         id: 0,
      })
      if(!id){
         return mapToResp(RES_MAP.PARAM_ERROR, '参数异常');
      }
      ctx.body = await ctx.service.playStore.delPlayStore(id);
   }

   //修改剧本店信息
   async updatePlayStore(){
      const {ctx} = this;
      const {id,ps_name,ps_address,tel,remark} = _.defaults(ctx.request.body,{
         id: 0,
         ps_name: '',
         ps_address: '',
         tel: 0,
         remark: ''
      }) 
      if(!id){
         return mapToResp(RES_MAP.PARAM_ERROR, '参数异常');
      }
      params = {
         id: id,
         ps_name: ps_name,
         ps_address: ps_address,
         tel: tel,
         remark: remark
      }

      ctx.body = await ctx.service.playStore.updatePlayStore(params);
   }

   //上传，修改剧本店照片
   async uploadPlayStore(){
      const {ctx,app} = this;
      //调用
      //ctx.saveAvatar();



   }


}

module.exports = playStoreController