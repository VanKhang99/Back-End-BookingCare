const express = require("express");
const packageController = require("../controllers/packageController");

const router = express.Router();

router.get("/clinicId/:valueClinicId", packageController.handleGetAllPackagesByClinicId);

router.route("/").get(packageController.handleGetAllPackages).post(packageController.handleCreatePackage);
router.get("/:packageId", packageController.handleGetPackage);
router.delete("/:packageId", packageController.handleDeletePackage);

router.get("/:specialtyId/:clinicId", packageController.handleGetAllPackagesByIds);

module.exports = router;
