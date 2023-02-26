const db = require("../models/index");
const { Buffer } = require("buffer");
const { getManyImageFromS3, getOneImageFromS3, deleteImageFromS3 } = require("./awsS3controller");

exports.getAllClinic = async (req, res) => {
  try {
    const { type } = req.params;

    let clinics = await getManyImageFromS3("Clinic");

    if (type === "popular") {
      clinics = clinics.filter((clinic) => clinic.popular);
    }

    if (clinics?.length > 0) {
      return res.status(200).json({
        status: "success",
        results: clinics.length,
        data: {
          clinics,
        },
      });
    }
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
    const dataClinic = await getOneImageFromS3("Clinic", +clinicId);

    if (!dataClinic) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

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
