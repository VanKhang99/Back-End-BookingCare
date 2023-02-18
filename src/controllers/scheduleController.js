const db = require("../models/index");
const { Op } = require("sequelize");

exports.bulkCreateSchedule = async (req, res) => {
  try {
    const { dataSchedule, keyMap } = req.body;
    console.log(dataSchedule, keyMap);

    if (!dataSchedule || !dataSchedule.length) {
      return res.status(400).json({
        status: "error",
        message: "Invalid schedules data!",
      });
    }

    let schedules;
    for (const schedule of dataSchedule) {
      schedules = await db.Schedule.findOrCreate({
        where: {
          [`${keyMap}`]: keyMap.startsWith("doctor") ? +schedule.doctorId : +schedule.packageId,
          date: `${schedule.date}`,
          timeType: `${schedule.timeType}`,
        },
        defaults: {
          ...schedule,
        },
        raw: true,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Schedules have been created in the database!",
    });
  } catch (error) {
    console.log("Bulk create schedule error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

const handleScheduleFuture = (schedulesArr) => {
  const curDate = new Date();
  curDate.setMinutes(curDate.getMinutes() + 30);

  const newSchedules = schedulesArr
    .filter((schedule) => {
      const hour = schedule.timeTypeData.valueVi.split(" - ")[0];

      const dateConvertToCompare = new Date();
      dateConvertToCompare.setHours(hour.split(":")[0]);
      dateConvertToCompare.setMinutes(hour.split(":")[1]);
      dateConvertToCompare.setSeconds(0);

      return dateConvertToCompare > curDate;
    })
    .sort((a, b) => +a.frameTimestamp - b.frameTimestamp);

  return [...newSchedules];
};

exports.handleGetSchedules = async (req, res) => {
  try {
    const { id, timeStamp, keyMap, timesFetch } = req.params;

    if (!id || !timeStamp || !keyMap || !timesFetch) {
      return res.status(400).json({
        status: "error",
        message: "Missing parameter to execute request!",
      });
    }

    console.log(timesFetch);

    const schedules = await db.Schedule.findAll({
      where: {
        [Op.and]: [
          {
            [`${keyMap}`]: +id,
            date: timeStamp,
          },
        ],
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: db.Allcode,
          as: "timeTypeData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    const schedulesFuture = handleScheduleFuture(schedules);

    if (schedules && schedules.length > 0) {
      return res.status(200).json({
        status: "success",
        data: {
          schedules: timesFetch === "initial-fetch" ? schedulesFuture : schedules,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        schedules: [],
      },
    });
  } catch (error) {
    console.log("Get schedules error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};
