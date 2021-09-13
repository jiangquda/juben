/* eslint valid-jsdoc: "off" */

'use strict';
var path = require("path")

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1614921324537_9586';

  // add your middleware config here
  // 加载 errorHandler 中间件
  config.middleware = [ 'errorHandler' ]

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'maotai_shuzhi',
    username: 'root', // 数据库用户名
    password: '123', // 数据库密码
    timezone: '+08:00' ,// 保存为本地时区
    logging: true,
    dialectOptions: {
      dateStrings: true,
      typeCast(field, next) {
        // for reading from database
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      }
    }
  };

  // config.sequelize = {
  //   dialect: 'mysql',
  //   host: '183.131.147.91',
  //   port: 3306,
  //   database: 'maotai',
  //   username: 'root', // 数据库用户名
  //   password: 'Xk4ise&nCFH6L>26aX', // 数据库密码
  //   timezone: '+08:00' ,// 保存为本地时区
  //   dialectOptions: {
  //     dateStrings: true,
  //     typeCast(field, next) {
  //       // for reading from database
  //       if (field.type === "DATETIME") {
  //         return field.string();
  //       }
  //       return next();
  //     }
  //   }
  // };
  config.sessionRedis = {
    name: 'session',
  };
  config.bull = {
    default: {
       redis: {
         host: '127.0.0.1',
         port: 6379,
         db:8
       },
       prefix: "queue_", // 用于所有Redis密钥的前缀
       defaultJobOptions: {
        attempts: 1,
        removeOnComplete: true,
        backoff: false,
        delay: 0,
        // attempts: 100, // 尝试完成该工作之前的总尝试次数
        // removeOnComplete: true, // 一个布尔值，如果为true，则在成功完成工作时将其删除。为数字时，它指定要保留的作业数量。默认行为是将作业保留在失败集中
        // backoff: 1, // 如果作业失败，自动重试的退避设置
        // delay: 5000, // 等待此作业可以处理的毫秒数。 *请注意，为了获得准确的延迟，服务器和客户端都应使其时钟同步。
    },
    limiter: {
        max: 2000000, // 处理的最大作业数
        duration: 1000, // 每个持续时间（以毫秒为单位）
    },
    settings: {
        stalledInterval: 5000, // 多久检查一次停顿的工作（使用0表示从不检查）
        maxStalledCount: 1, // 停顿的工作将被重新处理的最大次数
        guardInterval: 2000, // 重新调度延迟,*轮询间隔，用于延迟的作业和新增的作业
        retryProcessDelay: 500, // 如果发生内部错误，则延迟处理下一个作业
        drainDelay: 50000 // 空队列时brpoplpush的等待时间
    },
     },
     clients: {
       LogQueue: {topic: 'log'},
       UserQueue: {topic: 'user'}
     },
     app: true,
     agent: false
 };
  config.redis = {
    clients: {
      cache: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: '',
            db: 4, // 数据库
        },
      session: {
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            password: '',
            db: 5, // 数据库
        },
    }

};
  config.corrs = {
    origin:'*', // 解决跨域问题
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true
  };
  config.security ={
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['http://localhost:'],//允许访问接口的白名单
  },
  config.jwt = {
    secret: "123456"
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.logger = {
    // level: 'WARN', // 避免记录数据库执行语句
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
    dir: path.join(__dirname, '../logs/dev/app')
  };

  config.refresh_key = "STRING:CFG_REFRESH:SHUZHI";
  

  return {
    ...config,
    ...userConfig,
  };
};
