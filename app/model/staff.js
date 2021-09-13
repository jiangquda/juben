'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const Staff = app.model.define(
    'staff',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id:{type: STRING(32), allowNull: false,defaultValue: 0},
      name: {type:STRING(32),allowNull: false},
      extra_name:{type:STRING(32),allowNull: false},
      phone:{type:STRING(32),allowNull: false},
      sex:{type:STRING(32),allowNull: false},
      price: {type: DECIMAL(10,2), allowNull: false, defaultValue: 0.00},
      create_dt: {type: DATE, allowNull: false, defaultValue: NOW},
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );


  return Staff;
};
