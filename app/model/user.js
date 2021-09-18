'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const User = app.model.define(
    'user',
    {
      // id: { type: INTEGER, primaryKey: false, autoIncrement: false },
      // uuid:{type: STRING(32), defaultValue: function(){return shortid.gen()}},
      // user_name: {type:STRING(32),allowNull: false},
      // password:{type:STRING(32),allowNull: false},
      // role_id:{type:INTEGER(32),allowNull: false},
      // create_dt: {type: DATE, allowNull: false, defaultValue: NOW},npm run 
      // modify_dt: {type: DATE, allowNull: false, defaultValue: NOW},


      id: {
        autoIncrement: true,
        type: INTEGER,
        allowNull: false,
        primaryKey: true
      },
      openId: {
        type: STRING(64),
        allowNull: false,
        defaultValue: ''
      },
      user_name: {
        type: STRING(32),
        allowNull: false,
        defaultValue: ''
      },
      appId: {
        type: STRING(32),
        allowNull: false,
        defaultValue: ''
      },
      photo: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      sex: {
        type: STRING(32),
        allowNull: false,
        defaultValue: 0
      },
      age: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tag: {
        type: STRING(32),
        allowNull: false,
        defaultValue: ''
      },
      title: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      rates: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      good_rate: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      order_count: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      remark: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      letter_place: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      prefer_play: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ''
      },
      state: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      coin: {
        type: DECIMAL(11,2),
        allowNull: false,
        defaultValue: 0.00
      },
      diamond: {
        type: DECIMAL(11,2),
        allowNull: false,
        defaultValue: 0.00
      },
      create_dt: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW
      }
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );


  return User;
};
