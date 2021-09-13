'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const Fans = app.model.define(
    'fans',
    {
    //   id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    //   user_id:{type: STRING(32), allowNull: false},
    //   staff_id: {type:STRING(32),allowNull: false},
    //   price:{type:DECIMAL(10,2),allowNull: false},
    //   address:{type:STRING(255),allowNull: false},
    //   juben:{type:STRING(255),allowNull: false},
    //   start_time: {type: DATE, allowNull: false, defaultValue: NOW},
    //   end_time: {type: DATE, allowNull: false, defaultValue: NOW},
    //   state:{type:INTEGER(32),allowNull: false},
    id: {
        autoIncrement: true,
        type: INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      fans_id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      appId: {
        type: STRING(32),
        allowNull: false,
        defaultValue: ""
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


  return Fans;
};
