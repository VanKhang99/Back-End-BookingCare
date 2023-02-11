"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Markdowns", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contentHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      contentMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      descriptionHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      descriptionMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("Markdowns");
  },
};
