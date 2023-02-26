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
      //Allcode
      Clinic_Specialty.belongsTo(models.Allcode, {
        foreignKey: "specialtyId",
        targetKey: "keyMap",
        as: "nameSpecialty",
      });

      Clinic_Specialty.belongsTo(models.Allcode, {
        foreignKey: "clinicId",
        targetKey: "keyMap",
        as: "nameClinic",
      });

      //Clinic
      Clinic_Specialty.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "moreData",
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
