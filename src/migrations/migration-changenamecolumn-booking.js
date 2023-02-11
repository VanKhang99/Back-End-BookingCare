module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.renameColumn("Bookings", "date", "birthday")]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.renameColumn("Bookings", "birthday", "date")]);
  },
};
