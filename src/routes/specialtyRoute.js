const express = require("express");
const specialtyController = require("../controllers/specialtyController");

const router = express.Router();

router.get("/remote", specialtyController.handleGetAllSpecialtiesRemote);

router
  .route("/")
  .get(specialtyController.handleGetAllSpecialtiesPopular)
  .post(specialtyController.handleSaveInfoSpecialty);
// router.route("/save-info-specialty").post(specialtyController.handleSaveInfoSpecialty);

router
  .route("/:specialtyId")
  .get(specialtyController.handleGetInfoSpecialty)
  .delete(specialtyController.handleDeleteInfoSpecialty);

module.exports = router;
