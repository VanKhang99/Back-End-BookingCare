const express = require("express");
const packageController = require("../controllers/packageController");

const router = express.Router();

// router.get("/clinicId/:valueClinicId", packageController.getAllPackagesByClinicId);

router.post("/", packageController.createPackage);
router.get("/:packageId", packageController.getPackage);
router.delete("/:packageId", packageController.deletePackage);

router.get("/:specialtyId/:clinicId/:getAll", packageController.getAllPackages);

module.exports = router;
