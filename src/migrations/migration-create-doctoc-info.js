"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Doctor_Infos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      priceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provinceId: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      paymentId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      addressClinic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      popular: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      remote: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      note: {
        type: Sequelize.STRING,
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
      aboutHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      aboutMarkdown: {
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
    await queryInterface.dropTable("Doctor_Infos");
  },
};
