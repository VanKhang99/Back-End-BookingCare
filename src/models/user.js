"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Allcode
      User.belongsTo(models.Allcode, {
        foreignKey: "positionId",
        targetKey: "keyMap",
        as: "positionData",
      });
      User.belongsTo(models.Allcode, {
        foreignKey: "roleId",
        targetKey: "keyMap",
        as: "roleData",
      });
      User.belongsTo(models.Allcode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });

      //Doctor
      User.hasOne(models.Doctor, {
        foreignKey: "doctorId",
        as: "moreData",
      });

      //Booking
      User.hasOne(models.Booking, {
        foreignKey: "patientId",
        as: "patientData",
      });

      User.hasMany(models.Booking, {
        foreignKey: "doctorId",
        as: "doctorName",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.STRING,
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
      confirmCode: DataTypes.STRING,
      isConfirmed: DataTypes.BOOLEAN,
      passwordChangedAt: DataTypes.STRING,
      googleFlag: DataTypes.BOOLEAN,
      facebookFlag: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
