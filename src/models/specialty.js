"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //SPECIALTY
      Specialty.hasMany(models.Doctor_Info, {
        foreignKey: "specialtyId",
        as: "specialtyData",
      });
    }
  }
  Specialty.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nameVi: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      image: DataTypes.STRING,
      imageRemote: DataTypes.STRING,
      popular: DataTypes.BOOLEAN,
      remote: DataTypes.BOOLEAN,
      descriptionHTML: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
      descriptionRemoteHTML: DataTypes.TEXT,
      descriptionRemoteMarkdown: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialty",
    }
  );
  return Specialty;
};
