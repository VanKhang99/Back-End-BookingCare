const express = require("express");
const specialtyController = require("../controllers/specialtyController");

const router = express.Router();

router.post("/", specialtyController.createUpdateSpecialty);

router.get("/type=:type", specialtyController.getAllSpecialties);
router.get("/:specialtyId/remote=:remote", specialtyController.getSpecialtyByIdAndRemote);
router.get("/mental-health", specialtyController.getAllSpecialtiesMentalHealth);

router
  .route("/:specialtyId")
  .get(specialtyController.getSpecialty)
  .delete(specialtyController.deleteSpecialty);

module.exports = router;
