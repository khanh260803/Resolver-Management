'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Post.init({
    title:DataTypes.STRING,
    description:DataTypes.STRING,
    topic:DataTypes.STRING,
    tag:DataTypes.STRING,
    status:DataTypes.STRING,
    user_id:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};