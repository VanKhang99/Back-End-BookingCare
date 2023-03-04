const db = require("../models/index");
const { Buffer } = require("buffer");
const { getManyImageFromS3, getOneImageFromS3, deleteImageFromS3 } = require("./awsS3controller");

exports.getAllClinics = async (req, res) => {
  try {
    const { type } = req.params;
    const clinics = await db.Clinic.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!clinics.length) {
      return res.status(404).json({
        status: "error",
        message: "Something went wrong!",
      });
    }

    let clinicsData = await getManyImageFromS3("Clinic", clinics);

    if (type === "popular") {
      clinicsData = clinicsData.filter((clinic) => clinic.popular);
    }

    return res.status(200).json({
      status: "success",
      results: clinicsData.length,
      data: {
        clinics: clinicsData,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all clinic popular last week error from the server.",
    });
  }
};

exports.getClinic = async (req, res) => {
  try {
    const clinicId = +req.params.clinicId;
    const clinic = await db.Clinic.findOne({
      where: { id: clinicId },
    });

    if (!clinic) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    const dataClinic = await getOneImageFromS3("Clinic", clinic);

    return res.status(200).json({
      status: "success",
      data: {
        data: dataClinic,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get info clinic error from the server.",
    });
  }
};

exports.createUpdateClinic = async (req, res) => {
  try {
    const { data } = req.body;
    const { id, action } = data;

    if (action === "create") {
      const infoCreated = await db.Clinic.create(
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

    const infoUpdated = await db.Clinic.update(
      {
        ...data,
        updatedAt: new Date(),
      },
      {
        where: { id: +id },
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
      message: "Save info clinic error from the server.",
    });
  }
};

exports.deleteClinic = async (req, res) => {
  try {
    const clinicId = +req.params.clinicId;

    if (!clinicId)
      return res.status(400).json({
        status: "error",
        message: "Invalid clinicId",
      });

    await db.Clinic.destroy({
      where: {
        id: clinicId,
      },
    });

    return res.status(204).json({
      status: "success",
      message: "Hospital (Clinic) is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete clinic error from the server.",
    });
  }
};
