"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Doctor.belongsTo(models.Allcode, {
      //   foreignKey: "priceId",
      //   targetKey: "keyMap",
      //   as: "priceData",
      // });

      Doctor.belongsTo(models.Allcode, {
        foreignKey: "provinceId",
        targetKey: "keyMap",
        as: "provinceData",
      });

      Doctor.belongsTo(models.Allcode, {
        foreignKey: "paymentId",
        targetKey: "keyMap",
        as: "paymentData",
      });

      //USER
      Doctor.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "moreData",
      });

      //CLINIC
      Doctor.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "clinic",
      });

      //SPECIALTY
      Doctor.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        targetKey: "id",
        as: "specialtyData",
      });

      //BOOKING
      Doctor.hasMany(models.Booking, {
        foreignKey: "doctorId",
        as: "remoteDoctor",
      });

      Doctor.hasMany(models.Booking, {
        foreignKey: "doctorId",
        as: "doctorData",
      });
    }
  }
  Doctor.init(
    {
      doctorId: DataTypes.INTEGER,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,

      price: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      popular: DataTypes.BOOLEAN,
      remote: DataTypes.BOOLEAN,
      note: DataTypes.STRING,

      introductionHTML: DataTypes.TEXT,
      introductionMarkdown: DataTypes.TEXT,
      aboutHTML: DataTypes.TEXT,
      aboutMarkdown: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Doctor",
    }
  );
  return Doctor;
};
