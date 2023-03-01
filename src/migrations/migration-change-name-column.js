module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Package_Types", "typeVi", "nameVi");
    await queryInterface.renameColumn("Package_Types", "typeEn", "nameEn");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("Package_Types", "nameVi", "typeVi");
    await queryInterface.renameColumn("Package_Types", "nameEn", "typeEn");
  },
};
