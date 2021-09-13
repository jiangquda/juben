'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const PlayStore = app.model.define(
    'play_store',
    {
      id: {
        autoIncrement: true,
        type: INTEGER,
        primaryKey: true
      },
      ps_name: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      ps_logo: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      ps_address: {
        type: STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      tel: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      remark: {
        type: STRING(255),
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


  return PlayStore;
};
