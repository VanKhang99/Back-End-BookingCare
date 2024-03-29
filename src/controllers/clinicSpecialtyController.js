const db = require("../models/index");
const { Buffer } = require("buffer");
const { getManyImageFromS3, getOneImageFromS3 } = require("./awsS3controller");

exports.getAllSpecialtiesByClinicId = async (req, res) => {
  try {
    const clinicId = +req.params.clinicId;

    const specialties = await db.ClinicSpecialty.findAll({
      where: { clinicId: +clinicId },
      attributes: ["clinicId", "specialtyId", "address", "image"],
      include: [
        {
          model: db.Specialty,
          as: "specialtyName",
          attributes: ["nameVi", "nameEn"],
        },
        {
          model: db.Clinic,
          as: "clinicInfo",
          attributes: ["nameVi", "nameEn", "image"],
        },
      ],
      nest: true,
      raw: true,
    });

    if (!specialties.length) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    const specialtiesData = await getManyImageFromS3("ClinicSpecialty", specialties);

    return res.status(200).json({
      status: "success",
      data: {
        data: specialtiesData,
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

exports.getAllSpecialtiesOfClinic = async (req, res) => {
  try {
    const { clinicId, specialtyId } = req.params;
    const specialtyClinic = await db.ClinicSpecialty.findOne({
      where: {
        clinicId: +clinicId,
        specialtyId: +specialtyId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Specialty,
          as: "specialtyName",
          attributes: ["nameVi", "nameEn"],
        },
        {
          model: db.Clinic,
          as: "clinicInfo",
          attributes: ["nameVi", "nameEn", "image", "logo", "processHTML", "priceHTML", "noteHTML"],
        },
      ],
      nest: true,
      raw: true,
    });

    if (!specialtyClinic) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that IDs. Please check your IDs and try again!",
      });
    }

    const specialtyClinicData = await getOneImageFromS3("ClinicSpecialty", specialtyClinic);

    return res.status(200).json({
      status: "success",
      data: {
        data: specialtyClinicData,
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

exports.addUpdateSpecialtyClinic = async (req, res) => {
  try {
    const { data } = req.body;
    const { clinicId, specialtyId, action } = data;

    if (action === "create") {
      const infoCreated = await db.ClinicSpecialty.create(
        {
          ...data,
        },
        { raw: true }
      );

      return res.status(201).json({
        status: "success",
        data: {
          info: infoCreated,
        },
      });
    }

    const infoUpdated = await db.ClinicSpecialty.update(
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

exports.deleteSpecialtyClinic = async (req, res) => {
  try {
    const { specialtyId, clinicId } = req.params;

    if (!specialtyId || !clinicId) {
      return res.status(404).json({
        status: "error",
        message: "Invalid specialtyId or clinicId",
      });
    }

    await db.ClinicSpecialty.destroy({
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
