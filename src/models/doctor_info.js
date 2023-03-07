"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Doctor_Info.belongsTo(models.Allcode, {
      //   foreignKey: "priceId",
      //   targetKey: "keyMap",
      //   as: "priceData",
      // });

      Doctor_Info.belongsTo(models.Allcode, {
        foreignKey: "provinceId",
        targetKey: "keyMap",
        as: "provinceData",
      });

      Doctor_Info.belongsTo(models.Allcode, {
        foreignKey: "paymentId",
        targetKey: "keyMap",
        as: "paymentData",
      });

      //USER
      Doctor_Info.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "moreData",
      });

      //CLINIC
      Doctor_Info.belongsTo(models.Clinic, {
        foreignKey: "clinicId",
        targetKey: "id",
        as: "clinic",
      });

      //SPECIALTY
      Doctor_Info.belongsTo(models.Specialty, {
        foreignKey: "specialtyId",
        targetKey: "id",
        as: "specialtyData",
      });

      //BOOKING
      Doctor_Info.hasMany(models.Booking, {
        foreignKey: "doctorId",
        as: "remoteDoctor",
      });
    }
  }
  Doctor_Info.init(
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
      modelName: "Doctor_Info",
    }
  );
  return Doctor_Info;
};
