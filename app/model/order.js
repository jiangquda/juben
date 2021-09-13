'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const Order = app.model.define(
    'order',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id:{type: STRING(32), allowNull: false,defaultValue: 0},
      staff_id: {type:STRING(32),allowNull: false,defaultValue: 0},
      price:{type:DECIMAL(10,2),allowNull: false,defaultValue: 0.00},
      address:{type:STRING(255),allowNull: false,defaultValue: ""},
      juben:{type:STRING(255),allowNull: false,defaultValue: ""},
      start_time: {type: DATE, allowNull: false, defaultValue: NOW},
      end_time: {type: DATE, allowNull: false, defaultValue: NOW},
      state:{type:INTEGER(32),allowNull: false,defaultValue: 0},
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );


  return Order;
};
