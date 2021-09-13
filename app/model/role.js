'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const Role = app.model.define(
    'role',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      role_name:{type: STRING(32), defaultValue: function(){return shortid.gen()}},
      role_name_en: {type:STRING(32),allowNull: false},
      create_dt: {type: DATE, allowNull: false, defaultValue: NOW},
      modify_dt: {type: DATE, allowNull: false, defaultValue: NOW},
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );


  return Role;
};
