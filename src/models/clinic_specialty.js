"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic_Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //SPECIALTY
      Clinic_Specialty.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        targetKey: "id",
        as: "specialtyName",
      });

      //CLINIC
      Clinic_Specialty.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "clinicInfo",
      });
    }
  }
  Clinic_Specialty.init(
    {
      clinicId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      image: DataTypes.STRING,

      bookingHTML: DataTypes.TEXT,
      bookingMarkdown: DataTypes.TEXT,
      introductionHTML: DataTypes.TEXT,
      introductionMarkdown: DataTypes.TEXT,
      examAndTreatmentHTML: DataTypes.TEXT,
      examAndTreatmentMarkdown: DataTypes.TEXT,
      strengthsHTML: DataTypes.TEXT,
      strengthsMarkdown: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Clinic_Specialty",
    }
  );
  return Clinic_Specialty;
};
