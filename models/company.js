'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      
    }
  }
  Company.init({
    Name: DataTypes.STRING,
    Address: DataTypes.STRING,
    Max_users: DataTypes.INTEGER,
    expired: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};