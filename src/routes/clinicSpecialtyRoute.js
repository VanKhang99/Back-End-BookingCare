const express = require("express");
const clinicSpecialtyController = require("../controllers/clinicSpecialtyController");

const router = express.Router();

router.post("/", clinicSpecialtyController.addUpdateSpecialtyClinic);
router.get("/:clinicId", clinicSpecialtyController.getAllSpecialtiesByClinicId);

router
  .route("/:clinicId/:specialtyId")
  .get(clinicSpecialtyController.getAllSpecialtiesOfClinic)
  .delete(clinicSpecialtyController.deleteSpecialtyClinic);

module.exports = router;
