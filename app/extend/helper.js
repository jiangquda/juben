'use strict';
const moment = require('moment')

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss')

// 处理成功响应
// exports.success = ({ ctx, res = null, msg = '请求成功' })=> {
//   ctx.body = {
//     code: 0,
//     data: res,
//     msg
//   }
//   ctx.status = 200
// }
module.exports = {
    parseMsg(action, payload = {}, metadata = {}) {
      const meta = Object.assign({}, {
        timestamp: Date.now(),
      }, metadata);
  
      return {
        meta,
        data: {
          action,
          payload,
        },
      };
    },
    getCurDateFormat() {
      const now = new Date();
      const year = now.getFullYear();
      let month = now.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      let date = now.getDate();
      date = date < 10 ? '0' + date : date;
      let hours = now.getHours();
      hours = hours < 10 ? '0' + hours : hours;
      let min = now.getMinutes();
      min = min < 10 ? '0' + min : min;
      let sec = now.getSeconds();
      sec = sec < 10 ? '0' + sec : sec;
      return '' + year + month + date + hours + min + sec + Math.random().toString().substr(2, 3);
    }
  };