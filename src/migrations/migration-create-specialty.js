"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Specialties", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      specialtyId: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.BLOB("long"),
        allowNull: true,
      },
      imageRemote: {
        type: Sequelize.BLOB("long"),
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
      descriptionHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      descriptionMarkdown: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      descriptionRemoteHTML: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      descriptionRemoteMarkdown: {
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
    await queryInterface.dropTable("Specialties");
  },
};
