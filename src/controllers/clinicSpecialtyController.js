const db = require("../models/index");
const { Buffer } = require("buffer");
const { checkInfo } = require("../utils/helpers");

exports.handleGetAllSpecialtiesByClinicId = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const specialties = await db.Clinic_Specialty.findAll({
      where: { clinicId },
      attributes: ["clinicId", "specialtyId", "address"],
      include: [
        {
          model: db.Allcode,
          as: "nameSpecialty",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      nest: true,
      raw: true,
    });

    if (!specialties.length) {
      return res.status(404).json({
        status: "error",
        message: "Invalid clinicId!",
      });
    }

    // specialties.forEach((specialty) => {
    //   if(specialty?.image) {
    //     specialty.image = new Buffer(specialty.image, "base64").toString("binary");
    //   }
    // })

    return res.status(200).json({
      status: "success",
      data: {
        data: specialties,
      },
    });
  } catch (error) {
    console.log("Get all specialties by clinicId error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleGetSpecialtyOfClinic = async (req, res) => {
  try {
    const { specialtyId, clinicId } = req.params;

    const specialty = await db.Clinic_Specialty.findOne({
      where: { specialtyId, clinicId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Allcode,
          as: "nameSpecialty",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!specialty) {
      return res.status(404).json({
        status: "error",
        message: "Invalid specialtyId or clinicId",
      });
    }

    if (specialty?.image) {
      specialty.image = new Buffer(specialty.image, "base64").toString("binary");
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: specialty ? specialty : {},
      },
    });
  } catch (error) {
    console.log("Get specialty of clinic error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleAddSpecialtyClinic = async (req, res) => {
  try {
    const { data } = req.body;
    const { clinicId, specialtyId, action } = data;

    if (action === "create") {
      const infoCreated = await db.Clinic_Specialty.create(
        {
          ...data,
        },
        { raw: true }
      );

      return res.status(201).json({
        status: "success",
        data: {
          info: infoCreated ? infoCreated : {},
        },
      });
    }

    const infoUpdated = await db.Clinic_Specialty.update(
      {
        ...data,
        updatedAt: new Date(),
      },
      {
        where: { clinicId, specialtyId },
      }
    );

    if (!infoUpdated[0]) {
      return res.status(404).json({
        status: "error",
        message: "No record found with that ID or data is not enough!",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        info: infoUpdated,
      },
    });
  } catch (error) {
    console.log("Add specialty for clinic error", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};
