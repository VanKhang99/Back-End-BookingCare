const express = require("express");
const specialtyController = require("../controllers/specialtyController");

const router = express.Router();

router.post("/", specialtyController.createUpdateSpecialty);

router.get("/type=:type", specialtyController.getAllSpecialties);

// router.get("/remote", specialtyController.getAllSpecialtiesRemote);

// router.route("/save-info-specialty").post(specialtyController.handleSaveInfoSpecialty);
router.get("/:specialtyId/remote=:remote", specialtyController.getSpecialtyByIdAndRemote);

router
  .route("/:specialtyId")
  .get(specialtyController.getSpecialty)
  .delete(specialtyController.deleteSpecialty);

module.exports = router;
