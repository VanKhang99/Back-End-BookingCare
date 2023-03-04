const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.get("/:type", doctorController.getAllDoctors);
router.post("/", doctorController.saveInfoDoctor);

router.get("/detail/:doctorId", doctorController.getDoctor);
router.get("/:nameColumnMap/:id", doctorController.getAllDoctorsById);
router.delete("/:doctorId", doctorController.deleteDoctor);

router.get("/:keyMapId&:remote", doctorController.getDoctorsBaseKeyMap);

module.exports = router;
