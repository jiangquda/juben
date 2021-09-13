'use strict';
const shortid = require('js-shortid')

module.exports = app => {
  const {NOW, STRING, INTEGER, DATE, BIGINT, TINYINT,DECIMAL} = app.Sequelize;
  const DiamonedWater = app.model.define(
    'diamoned_water',
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
      count: {
        type: DECIMAL(11,2),
        allowNull: false,
        defaultValue: 0.00
      },
      present_count: {
        type: DECIMAL(11,2),
        allowNull: false,
        defaultValue: 0.00
      },
      water_type: {
        type: STRING(1),
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


  return DiamonedWater;
};
