"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Category.hasMany(models.Package, {
      //   foreignKey: "packageTypeId",
      //   as: "category",
      // });
      // Category.belongsToMany(models.Package, {
      //   through: models.PackageCategory,
      //   foreignKey: "categoryId",
      // });
      // Category.hasMany(models.PackageCategory, {
      //   foreignKey: "categoryId",
      //   as: "packageCategory",
      // });
    }
  }
  Category.init(
    {
      nameVi: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};