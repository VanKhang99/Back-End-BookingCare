const db = require("../models/index");
const { Buffer } = require("buffer");
const { getManyImageFromS3, getOneImageFromS3 } = require("./awsS3controller");

exports.getAllSpecialtiesByClinicId = async (req, res) => {
  try {
    const clinicId = +req.params.clinicId;

    const specialties = await getManyImageFromS3("Clinic_Specialty", clinicId);

    if (!specialties.length) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

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

exports.getSpecialtyOfClinic = async (req, res) => {
  try {
    const { clinicId, specialtyId } = req.params;

    const specialtyClinicData = await getOneImageFromS3("Clinic_Specialty", clinicId, specialtyId);

    if (!specialtyClinicData) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

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
      const infoCreated = await db.Clinic_Specialty.create(
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

exports.deleteSpecialtyClinic = async (req, res) => {
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
