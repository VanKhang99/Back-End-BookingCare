const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.get("/all-doctors", doctorController.handelGetAllDoctors);
router.post("/save-info-doctors", doctorController.handleSaveInfoDoctor);

router.get("/outstanding-doctor", doctorController.handleGetOutStandingDoctor);
router.get("/detail/:doctorId", doctorController.handleGetDetailDoctor);
router.get("/address-price-assurance/:doctorId", doctorController.handleGetInfoAddressPriceAssurance);
router.get("/:keyMapId&:remote", doctorController.handleGetDoctorsBaseKeyMap);

module.exports = router;
