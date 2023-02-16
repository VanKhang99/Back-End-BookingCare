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
      clinicId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      keyWord: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      image: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      logo: {
        type: Sequelize.BLOB("long"),
        allowNull: false,
      },
      haveSpecialtyPage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      popular: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      noteHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      noteMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
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
      strengthsHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      strengthsMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      equipmentHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      equipmentMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      locationHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      locationMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      processHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      processMarkdown: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      priceHTML: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      priceMarkdown: {
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
    await queryInterface.dropTable("Clinics");
  },
};
