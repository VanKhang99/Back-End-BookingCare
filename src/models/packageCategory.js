"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PackageCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PackageCategory.belongsTo(models.Package, {
        foreignKey: "packageId",
        targetKey: "id",
        as: "packageCategoryData",
      });

      PackageCategory.belongsTo(models.Category, {
        foreignKey: "categoryId",
        targetKey: "id",
        as: "packageCategory",
      });
    }
  }
  PackageCategory.init(
    {
      packageId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PackageCategory",
    }
  );
  return PackageCategory;
};
