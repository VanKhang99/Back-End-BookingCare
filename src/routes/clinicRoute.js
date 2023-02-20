const express = require("express");
const clinicController = require("../controllers/clinicController.js");

const router = express.Router();

router.get("/all/:type", clinicController.handleGetAllClinic);
router.post("/", clinicController.handleSaveInfoClinic);

router.get("/:clinicId", clinicController.handleGetInfoClinic);
router.delete("/:clinicId", clinicController.handleDeleteClinic);

module.exports = router;
