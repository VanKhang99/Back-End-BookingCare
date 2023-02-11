const express = require("express");
const clinicController = require("../controllers/clinicController.js");

const router = express.Router();

router.get("/popular", clinicController.handleGetAllClinicPopular);
router.post("/", clinicController.handleSaveInfoClinic);
router.get("/:clinicId", clinicController.handleGetInfoClinic);

module.exports = router;
