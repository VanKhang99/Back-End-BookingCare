"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Packages", {
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
      priceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provinceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nameVi: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      nameEn: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      introductionHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      introductionMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      contentHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      contentMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      listExaminationHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      listExaminationMarkdown: {
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
    await queryInterface.dropTable("Packages");
  },
};
