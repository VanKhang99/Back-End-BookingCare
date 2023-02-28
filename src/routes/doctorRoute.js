const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.get("/:type", doctorController.getAllDoctors);
router.post("/", doctorController.saveInfoDoctor);
router.delete("/:doctorId", doctorController.deleteDoctor);
router.get("/detail/:doctorId", doctorController.getDetailDoctor);
router.get("/:keyMapId&:remote", doctorController.getDoctorsBaseKeyMap);

// router.get("/address-price-assurance/:doctorId", doctorController.getInfoAddressPriceAssurance);

module.exports = router;
