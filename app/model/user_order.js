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
        allowNull: false
      },
      start_time: {
        type: DATE,
        allowNull: false
      },
      end_time: {
        type: DATE,
        allowNull: false
      },
      order_remark: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      }



    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );


  return UserOrder;
};
