module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "googleFlag", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn("Users", "facebookFlag", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("tableName", "columnName1"),
      queryInterface.removeColumn("tableName", "columnName2"),
    ]);
  },
};
