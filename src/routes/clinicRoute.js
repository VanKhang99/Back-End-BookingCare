const express = require("express");
const clinicController = require("../controllers/clinicController.js");

const router = express.Router();

router.get("/all/:type", clinicController.getAllClinic);
router.post("/", clinicController.createUpdateClinic);

router.route("/:clinicId").get(clinicController.getClinic).delete(clinicController.deleteClinic);

module.exports = router;
