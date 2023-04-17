const db = require("../models/index");

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
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Bulk create schedules error from the server.",
    });
  }
};

exports.handleGetSchedules = async (req, res) => {
  try {
    const { keyMap, id, timeStamp } = req.params;

    if (!id || !timeStamp || !keyMap) {
      return res.status(400).json({
        status: "error",
        message: "Missing parameter to execute request!",
      });
    }

    const schedules = await db.Schedule.findAll({
      where: {
        [`${keyMap}`]: +id,
        date: timeStamp,
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

    return res.status(200).json({
      status: "success",
      data: {
        schedules: schedules.length > 0 ? schedules : [],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get schedules error from the server.",
    });
  }
};

exports.handleDeleteSchedules = async (req, res) => {
  try {
    const { typeId, id, date } = req.params;
    const schedules = req.body;

    if (!typeId || !id || !date) {
      return res.status(404).json({
        status: "error",
        message: "Invalid keyMap or id",
      });
    }

    for (const schedule of schedules) {
      await db.Schedule.destroy({
        where: {
          [`${typeId}`]: id,
          timeType: `${schedule.keyMap}`,
          date,
        },
      });
    }

    return res.status(204).json({
      status: "success",
      message: "Schedules are deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete schedules error from the server.",
    });
  }
};
