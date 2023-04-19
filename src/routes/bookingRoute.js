const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post("/", bookingController.createBooking);

router.get("/all-patients/:doctorId/:dateBooked", bookingController.getAllPatientsBookingDoctor);

router.patch("/confirm-booking/:token&:id&:confirmPackage?", bookingController.confirmBooking);
router.patch("/confirm-exam-complete/:token&:patientId", bookingController.confirmExamComplete);
router.get("/history-booked/:patientId", bookingController.getAllHistoryBookedById);

module.exports = router;
