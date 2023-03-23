"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //User
      Allcode.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      Allcode.hasMany(models.User, { foreignKey: "roleId", as: "roleData" });
      Allcode.hasMany(models.User, { foreignKey: "gender", as: "genderData" });

      //Schedule
      Allcode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });

      // Doctor
      Allcode.hasMany(models.Doctor, {
        foreignKey: "provinceId",
        as: "provinceData",
      });
      Allcode.hasMany(models.Doctor, {
        foreignKey: "paymentId",
        as: "paymentData",
      });
      Allcode.hasMany(models.Doctor, {
        foreignKey: "specialtyId",
        as: "specialtyData",
      });
      Allcode.hasMany(models.Doctor, {
        foreignKey: "clinicId",
        as: "clinicData",
      });

      // Specialty

      // Clinic
      Allcode.hasOne(models.Clinic, {
        foreignKey: "id",
        as: "nameClinicData",
      });

      //Package
      // Allcode.hasMany(models.Package, {
      //   foreignKey: "priceId",
      //   as: "pricePackage",
      // });
      Allcode.hasMany(models.Package, {
        foreignKey: "provinceId",
        as: "provincePackage",
      });
      Allcode.hasMany(models.Package, {
        foreignKey: "paymentId",
        as: "paymentPackage",
      });
      Allcode.hasMany(models.Package, {
        foreignKey: "specialtyId",
        as: "specialtyPackage",
      });
      // Allcode.hasMany(models.Package, {
      //   foreignKey: "clinicId",
      //   as: "clinicPackage",
      // });

      Allcode.hasMany(models.Package, {
        foreignKey: "clinicId",
        as: "clinicName",
      });

      //Clinic - Specialty
      Allcode.hasMany(models.ClinicSpecialty, {
        foreignKey: "specialtyId",
        as: "nameClinic",
      });

      Allcode.hasOne(models.ClinicSpecialty, {
        foreignKey: "specialtyId",
        as: "nameSpecialty",
      });

      //Booking
      Allcode.hasMany(models.Booking, {
        foreignKey: "timeType",
        as: "timeFrameData",
      });

      Allcode.hasMany(models.Booking, {
        foreignKey: "priceId",
        as: "bookingPrice",
      });
    }
  }
  Allcode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
    }
  );
  return Allcode;
};
