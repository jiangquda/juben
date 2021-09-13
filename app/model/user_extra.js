'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const UserExtra = app.model.define(
    'user_extra',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id:{type: STRING(32), allowNull: false},
      extra_name: {type:STRING(32),allowNull: false},
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );


  return UserExtra;
};
