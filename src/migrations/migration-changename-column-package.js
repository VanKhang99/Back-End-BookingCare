module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Packages", "priceId", "price");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Packages", "price", "priceId");
  },
};
