module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Clinics", "keyWord", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Clinics", "keyWord");
  },

  // down: (queryInterface, Sequelize) => {
  //   return queryInterface.removeColumn("Clinics", "keyWord");
  // },
};
