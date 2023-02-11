module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Schedules", "timestampOfFrame");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Schedules", "timestampOfFrame", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
