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
      //DOCTOR_INFO
      Clinic.hasMany(models.Doctor, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "clinic",
      });

      //PACKAGE
      Clinic.hasMany(models.Package, {
        foreignKey: "clinicId",
        as: "clinicData",
      });

      //CLINIC_SPECIALTY
      Clinic.hasMany(models.ClinicSpecialty, {
        foreignKey: "clinicId",
        as: "clinicName",
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
