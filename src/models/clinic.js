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

      // Clinic.belongsTo(models.Doctor_Info, {
      //   foreignKey: "clinicId",
      //   targetKey: "clinicId",
      //   as: "doctors",
      // });
      Clinic.hasMany(models.Doctor_Info, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "clinic",
      });

      Clinic.hasMany(models.Package, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "clinicData",
      });
      Clinic.hasMany(models.Clinic_Specialty, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "moreData",
      });
    }
  }
  Clinic.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nameVi: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      address: DataTypes.STRING,
      keyWord: DataTypes.STRING(100),
      haveSpecialtyPage: DataTypes.BOOLEAN,
      popular: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      logo: DataTypes.STRING,

      noteHTML: DataTypes.TEXT,
      noteMarkdown: DataTypes.TEXT,
      bookingHTML: DataTypes.TEXT,
      bookingMarkdown: DataTypes.TEXT,
      introductionHTML: DataTypes.TEXT,
      introductionMarkdown: DataTypes.TEXT,
      strengthsHTML: DataTypes.TEXT,
      strengthsMarkdown: DataTypes.TEXT,
      equipmentHTML: DataTypes.TEXT,
      equipmentMarkdown: DataTypes.TEXT,
      locationHTML: DataTypes.TEXT,
      locationMarkdown: DataTypes.TEXT,
      processHTML: DataTypes.TEXT,
      processMarkdown: DataTypes.TEXT,
      priceHTML: DataTypes.TEXT,
      priceMarkdown: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Clinic",
    }
  );
  return Clinic;
};
