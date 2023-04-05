"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      roleId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      positionId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      confirmCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      isConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      passwordChangedAt: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      googleFlag: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      facebookFlag: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
