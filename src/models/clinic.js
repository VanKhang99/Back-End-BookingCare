"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic.belongsTo(models.Allcode, {
        foreignKey: "clinicId",
        targetKey: "keyMap",
        as: "nameClinicData",
      });

      // Clinic.belongsTo(models.Doctor_Info, {
      //   foreignKey: "clinicId",
      //   targetKey: "clinicId",
      //   as: "doctors",
      // });

      Clinic.hasMany(models.Doctor_Info, {
        foreignKey: "clinicId",
        targetKey: "clinicId",
        as: "doctors",
      });

      Clinic.hasMany(models.Package, {
        foreignKey: "clinicId",
        targetKey: "clinicId",
        as: "clinicData",
      });

      Clinic.hasMany(models.Clinic_Specialty, {
        foreignKey: "clinicId",
        targetKey: "clinicId",
        as: "moreData",
      });
    }
  }
  Clinic.init(
    {
      clinicId: DataTypes.STRING,
      address: DataTypes.STRING,
      keyWord: DataTypes.STRING(100),
      image: DataTypes.BLOB("long"),
      logo: DataTypes.BLOB("long"),
      haveSpecialtyPage: DataTypes.BOOLEAN,
      popular: DataTypes.BOOLEAN,
      noteHTML: DataTypes.TEXT("long"),
      noteMarkdown: DataTypes.TEXT("long"),

      bookingHTML: DataTypes.TEXT("long"),
      bookingMarkdown: DataTypes.TEXT("long"),
      introductionHTML: DataTypes.TEXT("long"),
      introductionMarkdown: DataTypes.TEXT("long"),
      strengthsHTML: DataTypes.TEXT("long"),
      strengthsMarkdown: DataTypes.TEXT("long"),
      equipmentHTML: DataTypes.TEXT("long"),
      equipmentMarkdown: DataTypes.TEXT("long"),
      locationHTML: DataTypes.TEXT("long"),
      locationMarkdown: DataTypes.TEXT("long"),
      processHTML: DataTypes.TEXT("long"),
      processMarkdown: DataTypes.TEXT("long"),
      priceHTML: DataTypes.TEXT("long"),
      priceMarkdown: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Clinic",
    }
  );
  return Clinic;
};
