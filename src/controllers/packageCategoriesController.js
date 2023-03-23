const db = require("../models/index");

exports.bulkCreatePackageCategories = async (data) => {
  if (!data.categoryIds.length) return null;

  try {
    for (const id of data.categoryIds) {
      const categoriesPackage = await db.PackageCategory.create({
        packageId: +data.packageId,
        categoryId: +id,
      });
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

exports.updatePackageCategories = (data) => {
  return async (req, res) => {};
};
