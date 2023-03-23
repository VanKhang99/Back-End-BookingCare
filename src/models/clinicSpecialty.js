"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClinicSpecialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //SPECIALTY
      ClinicSpecialty.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        targetKey: "id",
        as: "specialtyName",
      });

      //CLINIC
      ClinicSpecialty.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "clinicInfo",
      });
    }
  }
  ClinicSpecialty.init(
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
      modelName: "ClinicSpecialty",
    }
  );
  return ClinicSpecialty;
};
