const express = require("express");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.post("/", bookingController.handleCreateBooking);

router.get("/all-patients/:doctorId/:dateBooked", bookingController.handleGetAllPatientsBookingDoctor);

router.patch("/verify-booking/:token&:id&:confirmPackage?", bookingController.handleVerifyBooking);
router.patch("/confirm-exam-complete/:token&:patientId", bookingController.handleConfirmExamComplete);

module.exports = router;
