const db = require("../models/index");
const Email = require("../utils/email");
const { v4: uuidv4 } = require("uuid");

const buildURLConfirmBooking = (doctorId, token, packageId) => {
  let URLConfirm;
  if (doctorId) {
    URLConfirm = `${process.env.URL_REACT}/confirm-booking/token/${token}/doctorId/${doctorId}`;
  } else {
    URLConfirm = `${process.env.URL_REACT}/confirm-booking/token/${token}/packageId/${packageId}`;
  }

  return URLConfirm;
};

const userIsExisted = async (email) => {
  const user = await db.User.findOne({
    where: { email },
    raw: true,
  });

  return {
    id: user?.id,
    result: user?.email ? true : false,
  };
};

const quantityBooked = async (id, timeType, idBookingFor) => {
  const dataHourBooked = await db.Schedule.findOne({
    where: {
      [`${idBookingFor}`]: id,
      timeType,
    },
    attributes: ["currentNumber", "maxNumber", "timeType"],
    raw: true,
  });

  return {
    data: dataHourBooked,
    result: dataHourBooked.currentNumber < dataHourBooked.maxNumber,
  };
};

const statusExamPast = async (patientId) => {
  const examPast = await db.Booking.findAll({
    where: { patientId },
    raw: true,
  });

  const checkStatusId = examPast.every((exam) => exam.statusId === "S3");
  return checkStatusId;
};

exports.createBooking = async (req, res) => {
  try {
    const {
      email,
      doctorId,
      packageId,
      birthday,
      timeType,
      firstName,
      lastName,
      gender,
      phoneNumber,
      address,
      reason,
      language,
      timeFrame,
      dateBooked,
      doctorName,
      clinicName,
      packageName,
      priceId,
      remote,
    } = req.body;

    console.log(email);

    if (!email || !birthday || !timeType || !dateBooked || !priceId || !timeFrame) {
      return res.status(400).json({
        status: "error",
        message: "Invalid inputs data. Please check your data sent to server again!",
      });
    }

    const token = uuidv4();
    const checkEmail = await userIsExisted(email);
    const idBookingFor = doctorName ? "doctorId" : "packageId";
    const checkHourQuantityBooked = await quantityBooked(doctorId || packageId, timeType, idBookingFor);
    let booking;

    if (checkEmail.result) {
      const statusIdExamPast = await statusExamPast(+checkEmail.id);
      // console.log(statusIdExamPast);

      if (statusIdExamPast) {
        if (!checkHourQuantityBooked.result) {
          return res.status(400).json({
            status: "error",
            message: `${
              language === "vi"
                ? "Khung giờ đặt lịch đã đủ người. Xin vui lòng chọn khung giờ khác, chân thành cảm ơn!"
                : "The scheduled time frame is full. Please choose another time slot, thank you very much!"
            }`,
          });
        }

        await db.Schedule.update(
          {
            currentNumber: checkHourQuantityBooked.data.currentNumber + 1,
          },
          {
            where: { doctorId, timeType },
          }
        );

        booking = await db.Booking.create(
          {
            [`${doctorId ? "doctorId" : "packageId"}`]: doctorId ? doctorId : packageId,
            statusId: "S1",
            patientId: +checkEmail.id,
            birthday,
            timeType,
            dateBooked,
            reason,
            token,
            priceId,
            bookingFor: `${lastName} ${firstName}`,
          },
          { raw: true }
        );
      } else {
        return res.status(400).json({
          status: "error",
          message: `${
            language === "vi"
              ? "Bạn đã đặt lịch khám bệnh trước đó. Hãy hoàn thành lịch khám đã đặt trước và quay lại đặt 1 lịch khám khác. Xin chân thành cảm ơn!"
              : "You have already booked a medical appointment. Please complete your pre-booked appointment and come back to book another appointment. Sincerely thank!"
          }`,
        });
      }
    }

    if (!checkEmail.result) {
      if (!checkHourQuantityBooked.result) {
        return res.status(400).json({
          status: "error",
          message: `${
            language === "vi"
              ? "Khung giờ đặt lịch đã đủ người. Xin vui lòng chọn khung giờ khác, chân thành cảm ơn!"
              : "The scheduled time frame is full. Please choose another time slot, thank you very much!"
          }`,
        });
      }

      const [user, created] = await db.User.findOrCreate({
        where: { email },
        defaults: {
          email,
          roleId: "R7",
          firstName,
          lastName,
          gender,
          phoneNumber,
          address,
        },
        raw: true,
      });

      if (user) {
        const dataScheduleBooked = checkHourQuantityBooked.data;

        await db.Schedule.update(
          {
            currentNumber: dataScheduleBooked.currentNumber + 1,
          },
          {
            where: { doctorId, timeType },
          }
        );

        booking = await db.Booking.create(
          {
            [`${doctorId ? "doctorId" : "packageId"}`]: doctorId ? doctorId : packageId,
            statusId: "S1",
            patientId: +user.id,
            birthday,
            timeType,
            dateBooked,
            reason,
            token,
            priceId,
            bookingFor: `${lastName} ${firstName}`,
          },
          { raw: true }
        );
      }
    }

    if (booking.dataValues.statusId === "S1") {
      const personNameBook = language === "vi" ? `${lastName} ${firstName}` : `${firstName} ${lastName}`;

      //Send email
      const dataEmail = {
        email,
        [`${doctorName ? "doctorName" : "packageName"}`]: doctorName ? doctorName : packageName,
        clinicName,
        dateBooked,
        timeFrame,
        personNameBook,
        URLConfirm: buildURLConfirmBooking(doctorId, token, packageId),
        remote,
      };
      await new Email("createBooking", language).sendCreateBooking(dataEmail);

      return res.status(200).json({
        status: "success",
        data: {
          booking,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Create booking error from the server.",
    });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const { token, id, confirmPackage } = req.params;

    if (!token || !id) {
      return res.status(400).json({
        status: "error",
        message: "Invalid inputs data. Please check your data sent to server again!",
      });
    }

    const updateBookingInDb = await db.Booking.update(
      {
        statusId: "S2",
        updatedAt: new Date(),
      },
      {
        where: {
          token,
          [confirmPackage === "confirm-booking-package" ? "packageId" : "doctorId"]: id,
          statusId: "S1",
        },
      }
    );

    if (updateBookingInDb[0]) {
      return res.status(200).json({
        status: "success",
        message: "Medical appointment confirmed",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "The medical appointment is verified or does not exist. Please check again!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Verify booking error from the server.",
    });
  }
};

exports.getAllPatientsBookingDoctor = async (req, res) => {
  try {
    const { doctorId, dateBooked } = req.params;

    const patients = await db.Booking.findAll({
      where: { doctorId: +doctorId, statusId: "S2", dateBooked },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.User,
          as: "patientData",
          attributes: {
            exclude: ["createdAt", "updatedAt", "image", "password", "imageName", "positionId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
        },
        {
          model: db.User,
          as: "doctorName",
          attributes: ["firstName", "lastName"],
        },

        {
          model: db.Allcode,
          as: "bookingPrice",
          attributes: ["valueVi"],
        },

        {
          model: db.Allcode,
          as: "timeFrameData",
          attributes: ["valueVi", "valueEn"],
        },

        {
          model: db.Doctor,
          as: "remoteDoctor",
          attributes: ["remote"],
        },
      ],
      nest: true,
      raw: true,
    });

    return res.status(200).json({
      status: "success",
      results: patients.length,
      data: {
        data: patients.length ? patients : [],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all patients booking for a certain doctor error from the server.",
    });
  }
};

exports.getAllHistoryBookedById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const listBooked = await db.Booking.findAll({
      where: { patientId: +patientId },
      include: [
        {
          model: db.Allcode,
          as: "timeFrameData",
          attributes: ["valueVi", "valueEn"],
        },

        {
          model: db.Package,
          as: "packageData",
          attributes: ["nameVi", "nameEn", "clinicId"],
          include: [
            {
              model: db.Clinic,
              as: "clinicData",
              attributes: ["nameVi", "nameEn"],
            },
          ],
        },

        {
          model: db.Doctor,
          as: "doctorData",
          attributes: ["doctorId", "clinicId"],
          include: [
            {
              model: db.User,
              as: "moreData",
              attributes: ["firstName", "lastName"],
            },
            {
              model: db.Clinic,
              as: "clinic",
              attributes: ["nameVi", "nameEn"],
            },
          ],
        },
      ],
      nest: true,
      raw: true,
    });

    if (!listBooked.length) {
      return res.status(404).json({
        status: "error",
        message: "Invalid patientId",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        list: listBooked,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "getAllBookedHistoryById API error from the server.",
    });
  }
};

exports.confirmExamComplete = async (req, res) => {
  try {
    const { token, patientId } = req.params;

    if (!token || !patientId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid inputs data. Please check your data sent to server again!",
      });
    }

    const {
      email,
      language,
      patientName,
      doctorName,
      examinationResults,
      invoiceNumber,
      serviceUsed,
      totalFee,
      dateBooked,
      timeFrame,
      remote,
    } = req.body;

    const updateBookingInDb = await db.Booking.update(
      {
        statusId: "S3",
        invoiceNumber,
        updatedAt: new Date(),
      },
      {
        where: {
          token,
          patientId,
        },
      }
    );

    if (updateBookingInDb[0]) {
      //Send email
      const dataEmail = {
        email,
        patientName,
        doctorName,
        examinationResults,
        invoiceNumber,
        serviceUsed,
        totalFee,
        dateBooked,
        timeFrame,
      };

      await new Email("confirmExamComplete", language).sendConfirmExamComplete(
        dataEmail,
        "emailResultExamination"
      );

      return res.status(200).json({
        status: "success",
        message: "Confirm sending information after successful examination!",
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Confirmation of sending information failed after examination.!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Confirm examination complete error from the server.",
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = +req.params.id;

    await db.Booking.destroy({
      where: { id: bookingId },
    });

    return res.status(204).json({
      status: "success",
      message: "Booking deleted successfully!",
    });
    // res.send("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete booking error from the server.",
    });
  }
};
