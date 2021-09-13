'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const Attention = app.model.define(
    'attention',
    {
        id: {
            autoIncrement: true,
            type: INTEGER,
            primaryKey: true
          },
          user_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          attention_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          appId: {
            type: STRING(32),
            allowNull: false,
            defaultValue: 0
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


  return Attention;
};
