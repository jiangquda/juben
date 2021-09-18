'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const UserOrder = app.model.define(
    'user_order',
    {
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
      play_id: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      order_state: {
        type: STRING(1),
        allowNull: false,
        defaultValue: ""
      },
      order_address: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      order_time: {
        type: DATE,
        allowNull: false,
        defaultValue: NOW
      },
      user_state: {
        type: STRING(1),
        allowNull: false,
        defaultValue: "0"
      },
      play_state: {
        type: STRING(1),
        allowNull: false,
        defaultValue: "0"
      },
      start_time: {
        type: DATE,
        allowNull: false,
        defaultValue: ""
      },
      end_time: {
        type: DATE,
        allowNull: false,
        defaultValue: ""
      },
      order_remark: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      order_price:{
        type: DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00
      },
      order_money:{
        type: DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00
      }


    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );


  return UserOrder;
};
