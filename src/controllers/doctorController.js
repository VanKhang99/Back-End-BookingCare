const { Op } = require("sequelize");
const db = require("../models/index");
const { Buffer } = require("buffer");
const { getManyImageFromS3, getOneImageFromS3 } = require("./awsS3controller");

exports.getAllDoctors = async (req, res) => {
  try {
    const { type } = req.params;
    const doctors = await db.Doctor_Info.findAll({
      attributes: ["doctorId", "popular", "remote"],
      include: [
        {
          model: db.User,
          as: "moreData",
          attributes: ["id", "firstName", "lastName", "image", "roleId", "positionId"],
          include: [
            {
              model: db.Allcode,
              as: "roleData",
              attributes: ["keyMap", "valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["keyMap", "valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.Specialty,
          as: "specialtyData",
          attributes: ["id", "nameEn", "nameVi"],
        },
      ],
      nest: true,
      raw: true,
    });

    if (!doctors.length)
      return res.status(400).json({
        status: "error",
        message: "Something went wrong!",
      });

    let dataDoctors = await getManyImageFromS3("Doctor_Info", doctors);

    if (type === "popular") {
      dataDoctors = dataDoctors.filter((doctor) => doctor.popular);
    }

    if (type === "remote") {
      dataDoctors = dataDoctors.filter((doctor) => doctor.remote);
    }
    if (type === "all") {
      const roleDoctors = ["R2", "R3", "R4", "R5", "R6", "R8"];
      dataDoctors = dataDoctors.filter((doctor) => roleDoctors.includes(doctor.moreData.roleId));
    }

    return res.status(200).json({
      status: "success",
      results: dataDoctors.length,
      data: {
        doctors: dataDoctors,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all doctors error from the server.",
    });
  }
};

exports.getAllDoctorsById = async (req, res) => {
  try {
    const { nameColumnMap, id } = req.params;
    const doctors = await db.Doctor_Info.findAll({
      where: {
        [`${nameColumnMap}`]: +id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "provinceId", "priceId", "paymentId", "specialtyId"],
      },
      include: [
        {
          model: db.User,
          as: "moreData",
          attributes: ["id", "firstName", "lastName", "image", "roleId", "positionId"],
          include: [
            {
              model: db.Allcode,
              as: "roleData",
              attributes: ["keyMap", "valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["keyMap", "valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.Clinic,
          as: "clinic",
          attributes: ["nameEn", "nameVi", "address"],
        },
        {
          model: db.Specialty,
          as: "specialtyData",
          attributes: ["id", "nameEn", "nameVi"],
        },
        {
          model: db.Allcode,
          as: "priceData",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "paymentData",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "provinceData",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
      ],
      nest: true,
      raw: true,
    });

    if (!doctors.length) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    let dataDoctors = await getManyImageFromS3("Doctor_Info", doctors);

    return res.status(200).json({
      status: "success",
      data: {
        doctors: dataDoctors,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error get all doctors by id from the server.",
    });
  }
};

exports.saveInfoDoctor = async (req, res) => {
  try {
    const {
      doctorId,
      priceId,
      paymentId,
      provinceId,
      specialtyId,
      clinicId,
      addressClinic,
      popular,
      remote,
      note,
      introductionHTML,
      introductionMarkdown,
      aboutHTML,
      aboutMarkdown,
      action,
    } = req.body;

    console.log(doctorId, action);

    if (action === "create") {
      const infoCreated = await db.Doctor_Info.create(
        {
          doctorId,
          priceId,
          paymentId,
          provinceId,
          specialtyId,
          clinicId,
          addressClinic,
          popular,
          remote,
          note,
          introductionHTML,
          introductionMarkdown,
          aboutHTML,
          aboutMarkdown,
        },
        { raw: true }
      );

      return res.status(200).json({
        status: "success",
        data: {
          info: infoCreated,
        },
      });
    }

    const infoUpdated = await db.Doctor_Info.update(
      {
        ...req.body,
        updatedAt: new Date(),
      },
      {
        where: { doctorId: req.body.doctorId },
      }
    );

    if (!infoUpdated[0]) {
      return res.status(404).json({
        status: "error",
        message: "No record found with that ID or update data is empty!",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        info: infoUpdated,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Post info doctor error from the server.",
    });
  }
};

exports.getDoctor = async (req, res) => {
  try {
    const doctorId = +req.params.doctorId;
    const doctor = await db.Doctor_Info.findOne({
      where: {
        doctorId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "provinceId", "priceId", "paymentId", "specialtyId"],
      },
      include: [
        {
          model: db.User,
          as: "moreData",
          attributes: ["id", "firstName", "lastName", "image", "roleId", "positionId"],
          include: [
            {
              model: db.Allcode,
              as: "roleData",
              attributes: ["keyMap", "valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["keyMap", "valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.Clinic,
          as: "clinic",
          attributes: ["nameEn", "nameVi", "address"],
        },

        {
          model: db.Specialty,
          as: "specialtyData",
          attributes: ["id", "nameEn", "nameVi"],
        },
        {
          model: db.Allcode,
          as: "priceData",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "paymentData",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "provinceData",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
      ],
      nest: true,
      raw: true,
    });

    const doctorData = await getOneImageFromS3("Doctor_Info", doctor);

    if (!doctorData) {
      return res.status(400).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: doctorData,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get detail doctor error from the server.",
    });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(404).json({
        status: "error",
        message: "Invalid doctorId",
      });
    }

    await db.Doctor_Info.destroy({
      where: { doctorId },
    });

    return res.status(204).json({
      status: "success",
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete doctor error from the server.",
    });
  }
};

// exports.getDoctorsBaseKeyMap = async (req, res) => {
//   try {
//     const { keyMapId, remote } = req.params;
//     const columnMap = keyMapId.startsWith("SPE") ? "specialtyId" : "clinicId";
//     // console.log(columnMap);

//     if (!keyMapId) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid input keyMapId. Please check and try again!",
//       });
//     }

//     const doctors = await db.Doctor_Info.findAll({
//       where: { [`${columnMap}`]: keyMapId, remote },
//       include: [
//         {
//           model: db.User,
//           as: "anotherInfo",
//           attributes: {
//             exclude: ["password", "createdAt", "updatedAt"],
//           },
//           include: [
//             {
//               model: db.Allcode,
//               as: "positionData",
//               attributes: ["valueEn", "valueVi"],
//             },
//             {
//               model: db.Allcode,
//               as: "roleData",
//               attributes: ["valueEn", "valueVi"],
//             },
//           ],
//         },
//         {
//           model: db.Allcode,
//           as: "paymentData",
//           attributes: ["valueEn", "valueVi"],
//         },
//         {
//           model: db.Allcode,
//           as: "priceData",
//           attributes: ["valueEn", "valueVi"],
//         },
//         {
//           model: db.Allcode,
//           as: "provinceData",
//           attributes: ["valueEn", "valueVi"],
//         },
//         {
//           model: db.Allcode,
//           as: "specialtyData",
//           attributes: ["valueEn", "valueVi"],
//         },
//       ],
//       raw: true,
//       nest: true,
//     });

//     if (doctors.length > 0) {
//       doctors.forEach((doctor) => {
//         if (doctor?.anotherInfo?.image) {
//           doctor.anotherInfo.image = new Buffer(doctor.anotherInfo.image, "base64").toString("binary");
//         }
//       });
//     }

//     return res.status(200).json({
//       status: "success",
//       results: doctors.length,
//       data: {
//         data: doctors,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: "error",
//       message: "Get all doctor belong to a specialty error from the server.",
//     });
//   }
// };
