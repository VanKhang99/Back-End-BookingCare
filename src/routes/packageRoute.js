const express = require("express");
const packageController = require("../controllers/packageController");

const router = express.Router();

// router.get("/clinicId/:valueClinicId", packageController.getAllPackagesByClinicId);

router.get("/", packageController.getAllPackages);
router.post("/", packageController.createPackage);
router.get("/:packageId", packageController.getPackage);
router.delete("/:packageId", packageController.deletePackage);

module.exports = router;
