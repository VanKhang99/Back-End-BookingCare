"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Package.belongsTo(models.Allcode, {
        foreignKey: "priceId",
        targetKey: "keyMap",
        as: "pricePackage",
      });

      Package.belongsTo(models.Allcode, {
        foreignKey: "provinceId",
        targetKey: "keyMap",
        as: "provincePackage",
      });

      Package.belongsTo(models.Allcode, {
        foreignKey: "paymentId",
        targetKey: "keyMap",
        as: "paymentPackage",
      });

      Package.belongsTo(models.Allcode, {
        foreignKey: "specialtyId",
        targetKey: "keyMap",
        as: "specialtyPackage",
      });

      Package.belongsTo(models.Allcode, {
        foreignKey: "clinicId",
        targetKey: "keyMap",
        as: "clinicName",
      });

      Package.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "clinicData",
      });
    }
  }
  Package.init(
    {
      clinicId: DataTypes.STRING,
      specialtyId: DataTypes.STRING,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,

      nameVi: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      address: DataTypes.STRING,

      introductionHTML: DataTypes.TEXT("long"),
      introductionMarkdown: DataTypes.TEXT("long"),
      contentHTML: DataTypes.TEXT("long"),
      contentMarkdown: DataTypes.TEXT("long"),
      listExaminationHTML: DataTypes.TEXT("long"),
      listExaminationMarkdown: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Package",
    }
  );
  return Package;
};
