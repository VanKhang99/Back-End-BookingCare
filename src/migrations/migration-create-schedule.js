"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      packageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      currentNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      maxNumber: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timeType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      frameTimestamp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Schedules");
  },
};
