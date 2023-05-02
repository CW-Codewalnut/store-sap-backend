'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pos - mid - list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pos - mid - list.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pos-mid-list',
  });
  return pos - mid - list;
};