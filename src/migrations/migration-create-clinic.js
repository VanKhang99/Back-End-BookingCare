"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Clinics", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nameVi: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      nameEn: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      keyWord: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      haveSpecialtyPage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      popular: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      noteHTML: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      noteMarkdown: {
        type: Sequelize.TEXT,
        allowNull: false,
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
      strengthsHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      strengthsMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      equipmentHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      equipmentMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      locationHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      locationMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      processHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      processMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      priceHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      priceMarkdown: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Clinics");
  },
};
