const { Op } = require("sequelize");
const db = require("../models/index");
const { Buffer } = require("buffer");
const { checkInfo } = require("../utils/helpers");

exports.handleGetOutStandingDoctor = async (req, res) => {
  try {
    // const { limit } = req.params;
    // if (!limit) req.params.limit = 10;

    const doctors = await db.Doctor_Info.findAll({
      // limit: +limit,
      where: {
        popular: true,
      },
      // order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.User,
          as: "anotherInfo",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "imageName"],
          },
          include: [
            {
              model: db.Allcode,
              as: "roleData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.Allcode,
          as: "clinicData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "specialtyData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    doctors.forEach((doctor) => {
      doctor.anotherInfo.image = new Buffer(doctor.anotherInfo.image, "base64").toString("binary");
    });

    return res.status(200).json({
      status: "success",
      results: doctors.length,
      data: {
        doctors,
      },
    });
  } catch (error) {
    console.log("Get outstanding doctor error", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handelGetAllDoctors = async (req, res) => {
  try {
    const doctors = await db.User.findAll({
      where: {
        [Op.or]: [
          { roleId: "R2" },
          { roleId: "R3" },
          { roleId: "R4" },
          { roleId: "R5" },
          { roleId: "R6" },
          { roleId: "R8" },
        ],
      },
      attributes: {
        exclude: ["password", "image", "createdAt", "updatedAt", "imageName"],
      },
      raw: true,
    });

    return res.status(200).json({
      status: "success",
      results: doctors.length,
      data: {
        doctors,
      },
    });
  } catch (error) {
    console.log("Get all doctors error", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleSaveInfoDoctor = async (req, res) => {
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
          info: infoCreated ? infoCreated : {},
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
        info: infoUpdated ? infoUpdated : {},
      },
    });
  } catch (error) {
    console.log("Post info doctor error", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleGetDetailDoctor = async (req, res) => {
  try {
    const id = +req.params.doctorId;

    const info = await db.User.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "gender", "address", "createdAt", "updatedAt", "imageName"],
      },
      include: [
        {
          model: db.Allcode,
          as: "positionData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "roleData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Doctor_Info,
          as: "anotherInfo",
          attributes: {
            exclude: ["createdAt, updatedAt", "doctorId", "id", "nameClinic"],
          },
          include: [
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "clinicData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "specialtyData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
        },
      ],
      raw: true,
      nest: true,
    });

    // console.log(info);

    if (!info) {
      return res.status(400).json({
        status: "error",
        message: "No document found with that ID!",
      });
    }

    if (info && info.image) {
      info.image = new Buffer(info.image, "base64").toString("binary");
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: info ? info : {},
      },
    });
  } catch (error) {
    console.log("Get detail doctor error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleGetInfoAddressPriceAssurance = async (req, res) => {
  try {
    const id = +req.params.doctorId;

    if (!id) {
      return res.status(404).json({
        status: "error",
        message: "The doctor you are looking for does not exist!",
      });
    }

    const info = await db.Doctor_Info.findOne({
      where: { doctorId: id },
      attributes: {
        exclude: ["paymentId", "provinceId", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Allcode,
          as: "priceData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "provinceData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "paymentData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "specialtyData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "clinicData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    return res.status(200).json({
      status: "success",
      data: {
        data: info ? info : {},
      },
    });
  } catch (error) {
    console.log("Get info address price assurance error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleGetDoctorsBaseKeyMap = async (req, res) => {
  try {
    const { keyMapId, remote } = req.params;
    const columnMap = keyMapId.startsWith("SPE") ? "specialtyId" : "clinicId";
    // console.log(columnMap);

    if (!keyMapId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid input keyMapId. Please check and try again!",
      });
    }

    const doctors = await db.Doctor_Info.findAll({
      where: { [`${columnMap}`]: keyMapId, remote },
      include: [
        {
          model: db.User,
          as: "anotherInfo",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "roleData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.Allcode,
          as: "paymentData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "priceData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "provinceData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "specialtyData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (doctors.length > 0) {
      doctors.forEach((doctor) => {
        if (doctor?.anotherInfo?.image) {
          doctor.anotherInfo.image = new Buffer(doctor.anotherInfo.image, "base64").toString("binary");
        }
      });
    }

    return res.status(200).json({
      status: "success",
      results: doctors.length,
      data: {
        data: doctors,
      },
    });
  } catch (error) {
    console.log("Get all doctor belong to a specialty error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};
