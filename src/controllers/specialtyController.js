const db = require("../models/index");
const { getManyImageFromS3, getOneImageFromS3 } = require("./awsS3controller");

exports.getAllSpecialties = async (req, res) => {
  try {
    const { type } = req.params;
    const specialties = await db.Specialty.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    let specialtiesData = await getManyImageFromS3("Specialty", specialties);

    if (type === "popular") {
      specialtiesData = specialtiesData.filter((specialty) => specialty.popular);
    }

    if (type === "remote") {
      specialtiesData = specialtiesData.filter((specialty) => specialty.remote);
    }

    if (type === "all") {
      specialtiesData = specialties;
    }

    if (specialties?.length > 0) {
      return res.status(200).json({
        status: "success",
        results: specialtiesData.length,
        type,
        data: {
          specialties: specialtiesData,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all info specialty error from the server.",
    });
  }
};

exports.getSpecialty = async (req, res) => {
  try {
    const specialtyId = +req.params.specialtyId;
    const specialty = await db.Specialty.findOne({
      where: { id: specialtyId },
    });

    if (!specialty)
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });

    const dataSpecialty = await getOneImageFromS3("Specialty", specialty);

    return res.status(200).json({
      status: "success",
      data: {
        data: dataSpecialty,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get info specialty error from the server.",
    });
  }
};

exports.getSpecialtyByIdAndRemote = async (req, res) => {
  try {
    const { specialtyId, remote } = req.params;
    const specialty = await db.Specialty.findOne({
      where: {
        id: +specialtyId,
        remote,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });

    if (!specialty)
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });

    const dataSpecialty = await getOneImageFromS3("Specialty", specialty);

    return res.status(200).json({
      status: "success",
      data: {
        data: dataSpecialty,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get info specialty by id and remote error from the server.",
    });
  }
};

exports.createUpdateSpecialty = async (req, res) => {
  try {
    const data = req.body;
    const { id, action } = data;

    if (action === "create") {
      const infoCreated = await db.Specialty.create(
        {
          ...data,
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

    const infoUpdated = await db.Specialty.update(
      {
        ...req.body,
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
        info: infoUpdated ? infoUpdated : {},
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Save info specialty error from the server.",
    });
  }
};

exports.deleteSpecialty = async (req, res) => {
  try {
    const specialtyId = +req.params.specialtyId;

    if (!specialtyId)
      return res.status(404).json({
        status: "error",
        message: "Invalid specialtyId",
      });

    await db.Specialty.destroy({
      where: {
        id: specialtyId,
      },
    });

    return res.status(204).json({
      status: "success",
      message: "specialty is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete info specialty error from the server.",
    });
  }
};
