module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Schedules", "maxNumber", {
        type: Sequelize.INTEGER,
        defaultValue: 3,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn("Schedules", "maxNumber", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },
};
