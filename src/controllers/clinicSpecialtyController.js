const db = require("../models/index");
const { Buffer } = require("buffer");
const { checkInfo } = require("../utils/helpers");

exports.handleGetAllSpecialtiesByClinicId = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const specialties = await db.Clinic_Specialty.findAll({
      where: { clinicId },
      attributes: ["clinicId", "specialtyId", "address", "image"],
      include: [
        {
          model: db.Allcode,
          as: "nameSpecialty",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "nameClinic",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Clinic,
          as: "moreData",
          attributes: ["logo"],
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

    specialties.forEach((specialty) => {
      if (specialty?.image) {
        specialty.image = new Buffer(specialty.image, "base64").toString("binary");
      }

      if (specialty?.moreData?.logo) {
        specialty.moreData.logo = new Buffer(specialty.moreData.logo, "base64").toString("binary");
      }
    });

    return res.status(200).json({
      status: "success",
      data: {
        data: specialties,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all specialties by clinicId error from the server.",
    });
  }
};

exports.handleGetSpecialtyOfClinic = async (req, res) => {
  try {
    const { specialtyId, clinicId } = req.params;
    console.log(specialtyId, clinicId);

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

    console.log(specialty);

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
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get specialty of clinic error from the server.",
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
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Add specialty for clinic error from the server.",
    });
  }
};

exports.handleDeleteSpecialtyClinic = async (req, res) => {
  try {
    const { specialtyId, clinicId } = req.params;

    if (!specialtyId || !clinicId) {
      return res.status(404).json({
        status: "error",
        message: "Invalid specialtyId or clinicId",
      });
    }

    await db.Clinic_Specialty.destroy({
      where: {
        clinicId,
        specialtyId,
      },
    });

    return res.status(204).json({
      status: "success",
      message: "Specialty of clinic is deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete specialty for clinic error from the server.",
    });
  }
};
