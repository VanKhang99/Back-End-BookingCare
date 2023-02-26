const express = require("express");
const clinicSpecialtyController = require("../controllers/clinicSpecialtyController");

const router = express.Router();

router.get("/:clinicId", clinicSpecialtyController.getAllSpecialtiesByClinicId);
router.get("/:clinicId/:specialtyId", clinicSpecialtyController.getSpecialtyOfClinic);
router.post("/add-specialty", clinicSpecialtyController.addUpdateSpecialtyClinic);

router.delete("/:specialtyId/:clinicId", clinicSpecialtyController.deleteSpecialtyClinic);

module.exports = router;
