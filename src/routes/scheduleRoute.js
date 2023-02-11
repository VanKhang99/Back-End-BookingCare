const express = require("express");
const scheduleController = require("../controllers/scheduleController");

const router = express.Router();

router.route("/").post(scheduleController.bulkCreateSchedule);

router.route("/:keyMap=:id&:timeStamp").get(scheduleController.handleGetSchedules);

module.exports = router;
