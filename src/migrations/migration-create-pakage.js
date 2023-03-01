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
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      packageTypeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      popular: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      introductionHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      introductionMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contentHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contentMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      listExaminationHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      listExaminationMarkdown: {
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
    await queryInterface.dropTable("Packages");
  },
};
