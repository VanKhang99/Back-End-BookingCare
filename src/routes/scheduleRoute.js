const express = require("express");
const scheduleController = require("../controllers/scheduleController");

const router = express.Router();

router.route("/").post(scheduleController.bulkCreateSchedule);

router.route("/:keyMap=:id&:timeStamp").get(scheduleController.handleGetSchedules);

router.patch("/:typeId/:id/:date", scheduleController.handleDeleteSchedules);

// route.get("/:doctorId/:date", scheduleController.handleGetScheduleByDoctorId);

module.exports = router;
