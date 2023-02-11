const express = require("express");
const clinicSpecialtyController = require("../controllers/clinicSpecialtyController");

const router = express.Router();

router.get("/:clinicId", clinicSpecialtyController.handleGetAllSpecialtiesByClinicId);
router.get("/:specialtyId/:clinicId", clinicSpecialtyController.handleGetSpecialtyOfClinic);
router.post("/add-specialty", clinicSpecialtyController.handleAddSpecialtyClinic);

module.exports = router;
