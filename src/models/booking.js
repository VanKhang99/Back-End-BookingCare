"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //USER
      Booking.belongsTo(models.User, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "patientData",
      });

      Booking.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "doctorName",
      });

      //ALLCODE
      Booking.belongsTo(models.Allcode, {
        foreignKey: "timeType",
        targetKey: "keyMap",
        as: "timeFrameData",
      });

      Booking.belongsTo(models.Allcode, {
        foreignKey: "priceId",
        targetKey: "keyMap",
        as: "bookingPrice",
      });

      //DOCTORS
      Booking.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        targetKey: "doctorId",
        as: "remoteDoctor",
      });

      Booking.belongsTo(models.Doctor, {
        foreignKey: "doctorId",
        targetKey: "doctorId",
        as: "doctorData",
      });

      //PACKAGE
      Booking.belongsTo(models.Package, {
        foreignKey: "packageId",
        targetKey: "id",
        as: "packageData",
      });
    }
  }
  Booking.init(
    {
      statusId: DataTypes.STRING,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      packageId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      bookingFor: DataTypes.STRING,
      birthday: DataTypes.DATEONLY,
      timeType: DataTypes.STRING,
      dateBooked: DataTypes.DATEONLY,
      reason: DataTypes.STRING,
      token: DataTypes.STRING,
      invoiceNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
