const db = require("../models/index");
const { Op } = require("sequelize");
const sendEmail = require("../utils/email");
const { v4: uuidv4 } = require("uuid");

const buildURLConfirmBooking = (doctorId, token, packageId) => {
  let URLConfirm;
  if (doctorId) {
    URLConfirm = `${process.env.URL_REACT}/verify-booking/token=${token}&doctorId=${doctorId}`;
  } else {
    URLConfirm = `${process.env.URL_REACT}/verify-booking/token=${token}&packageId=${packageId}`;
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

const quantityBooked = async (doctorId, timeType) => {
  const dataHourBooked = await db.Schedule.findOne({
    where: { doctorId, timeType },
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

  console.log(examPast);

  const checkStatusId = examPast.every((exam) => exam.statusId === "S3");

  return checkStatusId;
};

exports.handleCreateBooking = async (req, res) => {
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

    if (!email || !birthday || !timeType || !dateBooked || !priceId || !timeFrame) {
      return res.status(400).json({
        status: "error",
        message: "Invalid inputs data. Please check your data sent to server again!",
      });
    }

    const token = uuidv4();
    const checkEmail = await userIsExisted(email);
    const checkHourQuantityBooked = await quantityBooked(doctorId, timeType);
    let booking;

    if (checkEmail.result) {
      const statusIdExamPast = await statusExamPast(+checkEmail.id);
      console.log(statusIdExamPast);

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
          },
          { raw: true }
        );
      }
    }

    if (booking.dataValues.statusId === "S1") {
      const personNameBook = language === "vi" ? `${lastName} ${firstName}` : `${firstName} ${lastName}`;
      await sendEmail({
        email,
        language,
        [`${doctorName ? "doctorName" : "packageName"}`]: doctorName ? doctorName : packageName,
        clinicName,
        dateBooked,
        timeFrame,
        personNameBook,
        URLConfirm: buildURLConfirmBooking(doctorId, token, packageId),
        remote,
      });

      return res.status(200).json({
        status: "success",
        data: {
          booking,
        },
      });
    }
  } catch (error) {
    console.log("Create booking error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleVerifyBooking = async (req, res) => {
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
    console.log("Verify booking error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleGetAllPatientsBookingDoctor = async (req, res) => {
  try {
    const { doctorId, dateBooked } = req.params;
    console.log(dateBooked);

    const patients = await db.Booking.findAll({
      where: { doctorId, statusId: "S2", dateBooked },
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
          model: db.Doctor_Info,
          as: "remoteDoctor",
          attributes: ["remote"],
        },
      ],
      nest: true,
      raw: true,
    });

    if (!patients.length) {
      return res.status(404).json({
        status: "error",
        message:
          "Currently, there are no patients scheduled for medical examination. Please choose another date!",
      });
    }

    return res.status(200).json({
      status: "success",
      results: patients.length,
      data: {
        data: patients,
      },
    });
  } catch (error) {
    console.log("Get all patients booking for a certain doctor error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleConfirmExamComplete = async (req, res) => {
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
      await sendEmail(
        {
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
          // remote,
        },
        "confirmExamComplete"
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
    console.log("Confirm examination complete error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

// 1.Check schedule time frame is full or not

// 2. If not full => create user
// const [user, created] = await db.User.findOrCreate({
//   where: { email },
//   defaults: {
//     email,
//     roleId: "R7",
//     firstName,
//     lastName,
//     gender,
//     phoneNumber,
//     address,
//   },
//   raw: true,
// });

// 3. User create success => create booking for that user
// if (user) {
//   let token = uuidv4();

//   const scheduleBooked = await db.Schedule.findOne({
//     where: { doctorId, timeType },
//     attributes: ["currentNumber", "maxNumber", "timeType"],
//     raw: true,
//   });

//   if (scheduleBooked.currentNumber < scheduleBooked.maxNumber) {
//     await db.Schedule.update(
//       {
//         currentNumber: scheduleBooked.currentNumber + 1,
//       },
//       {
//         where: { doctorId, timeType },
//       }
//     );
//   } else {
//     return res.status(400).json({
//       status: "error",
//       message: "The scheduled time frame is full. Please choose another time slot, thank you very much!",
//     });
//   }

//   const booking = await db.Booking.findOrCreate({
//     where: {
//       patientId: user.id,
//     },
//     defaults: {
//       [`${doctorId ? "doctorId" : "packageId"}`]: doctorId ? doctorId : packageId,
//       statusId: "S1",
//       patientId: user.id,
//       birthday,
//       timeType,
//       dateBooked,
//       reason,
//       token,
//       priceId,
//     },
//   });

//   // booking new user, new email --> send email because prevent email spam to user
// if (booking[1]) {
//   const personNameBook = language === "vi" ? `${lastName} ${firstName}` : `${firstName} ${lastName}`;
//   await sendEmail({
//     email,
//     language,
//     [`${doctorName ? "doctorName" : "packageName"}`]: doctorName ? doctorName : packageName,
//     clinicName,
//     dateBooked,
//     timeFrame,
//     personNameBook,
//     URLConfirm: buildURLConfirmBooking(doctorId, token, packageId),
//     remote,
//   });

//   return res.status(200).json({
//     status: "success",
//     data: {
//       booking,
//     },
//   });
//   }
// }
