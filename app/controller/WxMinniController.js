'use script'

const Controller = require('egg').Controller;

// https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
const wxConfig = {
    appid: 'wx******************8',
    appSecret: '91*******************f'
}

class WxMinniController extends Controller {
    // 获取用户openid
    // 经过 wx.login 接口得到临时登陆凭证 code 后传到开发者服务器调用此接口完成登陆流程
    async openid() {
      const { ctx } = this;
      const urlStr = 'https://api.weixin.qq.com/sns/jscode2session'
      const data = {
        appid: wxConfig.appid,           // 小程序 appId
        secret: wxConfig.appSecret,      // 小程序 appSecret
        js_code: ctx.query.code,         // 登陆时获取的 code
        grant_type: 'authorization_code' // 受权类型，此处只需填写 authorization_code
      }
      const result = await ctx.curl(urlStr, {
        data: data,
        dataType: 'json',
      });
      if(result.data.errmsg){
        ctx.body = {
          status: 101,
          msg: '操做失败',
          errcode: result.data.errcode,
          errmsg: result.data.errmsg
        };
        /*
          errcode: 40163
          errmsg: "code been used, hints: [ req_id: NfjCxzNre- ]"
          msg: "操做失败"
          status: 101
         */
      }else{
        ctx.body = {
          status: 100,
          msg: '操做成功',
          openid: result.data.openid,
          session_key: result.data.session_key
        };
        /*
          msg: "操做成功"
          openid: "oC4Dk5NfT-I-joYZGQSPHOpD2PYQ"
          session_key: "Qheu52JzXVhZuAK372micw=="
          status: 100
        */
      }
    }
  }
  
  module.exports = WxMinniController;





























