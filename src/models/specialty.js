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
      Specialty.belongsTo(models.Allcode, {
        foreignKey: "specialtyId",
        targetKey: "keyMap",
        as: "nameData",
      });
    }
  }
  Specialty.init(
    {
      specialtyId: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      imageRemote: DataTypes.BLOB("long"),
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
