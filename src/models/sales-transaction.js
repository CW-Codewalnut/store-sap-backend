'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sales - transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sales - transaction.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sales-transaction',
  });
  return sales - transaction;
};