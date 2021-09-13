'use strict';

const {RES_MAP, mapToResp} = require('../respcode');

module.exports = () => {
  return async function auth(ctx, next) {
    const {sid} = ctx.session;
    
    if (sid) {
      ctx.session.opttime = new Date().getTime()
      await next();
    } else {
      ctx.body = mapToResp(RES_MAP.AUTH_ERROR);
    }
  };
};