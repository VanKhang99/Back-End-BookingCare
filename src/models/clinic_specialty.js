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
        targetKey: "clinicId",
        as: "moreData",
      });
    }
  }
  Clinic_Specialty.init(
    {
      clinicId: DataTypes.STRING,
      specialtyId: DataTypes.STRING,
      address: DataTypes.STRING,
      image: DataTypes.BLOB("long"),

      bookingHTML: DataTypes.TEXT("long"),
      bookingMarkdown: DataTypes.TEXT("long"),
      introductionHTML: DataTypes.TEXT("long"),
      introductionMarkdown: DataTypes.TEXT("long"),
      examAndTreatmentHTML: DataTypes.TEXT("long"),
      examAndTreatmentMarkdown: DataTypes.TEXT("long"),
      strengthsHTML: DataTypes.TEXT("long"),
      strengthsMarkdown: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Clinic_Specialty",
    }
  );
  return Clinic_Specialty;
};
