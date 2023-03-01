module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Packages", "packageTypeId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("Packages", "image", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Packages", "popular", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Packages", "packageTypeId"),
      queryInterface.removeColumn("Packages", "image"),
      queryInterface.removeColumn("Packages", "popular"),
    ]);
  },
};
