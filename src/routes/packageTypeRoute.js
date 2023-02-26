const express = require("express");
const packageTypeController = require("../controllers/packageTypeController");

const router = express.Router();

router
  .route("/")
  .get(packageTypeController.getAllPackagesType)
  .post(packageTypeController.createUpdatePackageType);

router
  .route("/:packageTypeId")
  .get(packageTypeController.getPackageType)
  .delete(packageTypeController.deletePackageType);

module.exports = router;
