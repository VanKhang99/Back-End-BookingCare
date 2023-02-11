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

      // Doctor_Info
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "priceId",
        as: "priceData",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "provinceId",
        as: "provinceData",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "paymentId",
        as: "paymentData",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "specialtyId",
        as: "specialtyData",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "clinicId",
        as: "clinicData",
      });

      // Specialty
      Allcode.hasMany(models.Specialty, {
        foreignKey: "specialtyId",
        as: "nameData",
      });

      // Clinic
      Allcode.hasOne(models.Clinic, {
        foreignKey: "clinicId",
        as: "nameClinicData",
      });

      //Package
      Allcode.hasMany(models.Package, {
        foreignKey: "priceId",
        as: "pricePackage",
      });
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
      Allcode.hasOne(models.Clinic_Specialty, {
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
      // hooks: {
      //   beforeCreate: async (allcode) => {

      //   }
      // }
    }
  );
  return Allcode;
};
