'use strict';

const { tokContexts } = require('acorn');
const logTask = require('./app/task/log_task.js');
const userTask = require('./app/task/user_task')

module.exports = app => {
  if (app.config.bull) {
      logTask(app);
      userTask(app);
  }

  const key = app.config.refresh_key;
  const redisClient = app.redis.get('cache');
  redisClient.set(key,1);
 
  console.info(Math.random()*100);
  app.beforeStart(async () => {
    // 保证应用启动监听端口前数据已经准备好了
    // 后续数据的更新由定时任务自动触发
    await app.runSchedule('refresh_config');
  });
};
