module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Users", "passwordChangedAt", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Users", "passwordChangedAt", {
        type: Sequelize.DATEONLY,
        allowNull: true,
      }),
    ]);
  },
};
