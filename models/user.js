'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Company,{foreignKey:'company',targetKey:'Name',as:'companyData'});    
      User.hasMany(models.Post, { foreignKey: 'user_id' ,as: 'posts'}); 
    }
  }
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    role: DataTypes.STRING,
    image: DataTypes.STRING,
    dob: DataTypes.DATE,
    status: DataTypes.STRING,
    company: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};