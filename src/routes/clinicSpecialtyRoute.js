const express = require("express");
const clinicSpecialtyController = require("../controllers/clinicSpecialtyController");

const router = express.Router();

router.get("/:clinicId", clinicSpecialtyController.handleGetAllSpecialtiesByClinicId);
router.get("/:specialtyId/:clinicId", clinicSpecialtyController.handleGetSpecialtyOfClinic);
router.post("/add-specialty", clinicSpecialtyController.handleAddSpecialtyClinic);

router.delete("/:specialtyId/:clinicId", clinicSpecialtyController.handleDeleteSpecialtyClinic);

module.exports = router;
