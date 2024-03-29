const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.route("/").get(categoryController.getAllCategories).post(categoryController.createUpdateCategory);

router.route("/:categoryId").get(categoryController.getCategory).delete(categoryController.deleteCategory);

module.exports = router;
