"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ClinicSpecialties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bookingHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bookingMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      introductionHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      introductionMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      examAndTreatmentHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      examAndTreatmentMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      strengthsHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      strengthsMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable("ClinicSpecialties");
  },
};
