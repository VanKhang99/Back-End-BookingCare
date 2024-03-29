"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //DOCTOR_INFO
      Specialty.hasMany(models.Doctor, {
        foreignKey: "specialtyId",
        as: "specialtyData",
      });

      //CLINIC-SPECIALTY
      Specialty.hasMany(models.ClinicSpecialty, {
        foreignKey: "specialtyId",
        as: "specialtyName",
      });

      //PACKAGE
      Specialty.hasMany(models.Package, {
        foreignKey: "specialtyId",
        as: "specialty",
      });
    }
  }
  Specialty.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nameVi: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      image: DataTypes.STRING,
      imageRemote: DataTypes.STRING,
      popular: DataTypes.BOOLEAN,
      remote: DataTypes.BOOLEAN,
      descriptionHTML: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
      descriptionRemoteHTML: DataTypes.TEXT,
      descriptionRemoteMarkdown: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialty",
    }
  );
  return Specialty;
};
