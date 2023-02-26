"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Package_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Package_Type.init(
    {
      typeVi: DataTypes.STRING,
      typeEn: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Package_Type",
    }
  );
  return Package_Type;
};