"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Clinic_Specialties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clinicId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specialtyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.BLOB("long"),
        allowNull: true,
      },
      bookingHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      bookingMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      introductionHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      introductionMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      examAndTreatmentHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      examAndTreatmentMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      strengthsHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      strengthsMarkdown: {
        type: Sequelize.TEXT("long"),
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
    await queryInterface.dropTable("Clinic_Specialties");
  },
};
