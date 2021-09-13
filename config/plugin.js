'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  validate : {
    enable: true,
    package: 'egg-validate',
  },
  bcrypt : {
    enable: true,
    package: 'egg-bcrypt'
  },
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  sessionRedis : {
    enable: true,
    package: 'egg-session-redis',
  },
  redis:{
    enable: true,
    package: 'egg-redis'
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  jwt : {
    enable: true,
    package: 'egg-jwt',
  },
  cors : {
    enable: true,
    package: 'egg-cors',
  },
  bull : {
    enable: true,
    package: 'egg-bull',
  },
  io : {
    enable: true,
    package: 'egg-socket.io',
  },
  tx : {
    enable: true,
    package: 'egg-tx',
  }
};
