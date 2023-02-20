const db = require("../models/index");
const { Buffer } = require("buffer");
const { checkInfo } = require("../utils/helpers");

exports.handleGetAllSpecialtiesPopular = async (req, res) => {
  try {
    const specialties = await db.Specialty.findAll({
      where: { popular: true },
      attributes: {
        exclude: ["createdAt", "updatedAt", "id", "imageRemote"],
      },
      include: [
        {
          model: db.Allcode,
          as: "nameData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    specialties.forEach((specialty) => {
      specialty.image = new Buffer(specialty.image, "base64").toString("binary");
    });

    return res.status(200).json({
      status: "success",
      data: {
        specialties,
      },
    });
  } catch (error) {
    console.log("Get all info specialty error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleGetAllSpecialtiesRemote = async (req, res) => {
  try {
    const specialties = await db.Specialty.findAll({
      where: { remote: true },
      attributes: ["imageRemote", "specialtyId"],
      include: [
        {
          model: db.Allcode,
          as: "nameData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    specialties.forEach((specialty) => {
      specialty.imageRemote = new Buffer(specialty.imageRemote, "base64").toString("binary");
    });

    return res.status(200).json({
      status: "success",
      result: specialties.length,
      data: {
        specialties,
      },
    });
  } catch (error) {
    console.log("Get all specialties remote error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleGetInfoSpecialty = async (req, res) => {
  try {
    const { specialtyId } = req.params;

    if (!specialtyId)
      return res.status(400).json({
        status: "error",
        message: "Invalid specialtyId",
      });

    const specialty = await db.Specialty.findOne({
      where: { specialtyId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });

    if (specialty?.image) {
      specialty.image = new Buffer(specialty.image, "base64").toString("binary");
    }

    if (specialty?.imageRemote) {
      specialty.imageRemote = new Buffer(specialty.imageRemote, "base64").toString("binary");
    }

    return res.status(200).json({
      status: "success",
      data: {
        specialty: specialty ? specialty : {},
      },
    });
  } catch (error) {
    console.log("Get info specialty error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleSaveInfoSpecialty = async (req, res) => {
  try {
    const {
      specialtyId,
      image,
      imageRemote,
      descriptionHTML,
      descriptionMarkdown,
      descriptionRemoteHTML,
      descriptionRemoteMarkdown,
      popular,
      remote,
      action,
    } = req.body;

    if (action === "create") {
      const infoCreated = await db.Specialty.create(
        {
          specialtyId,
          image,
          imageRemote,
          descriptionHTML,
          descriptionMarkdown,
          descriptionRemoteHTML,
          descriptionRemoteMarkdown,
          popular,
          remote,
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
        where: { specialtyId },
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
    console.log("Save info specialty error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleDeleteInfoSpecialty = async (req, res) => {
  try {
    const { specialtyId } = req.params;
    if (!specialtyId) {
      return res.status(404).json({
        status: "error",
        message: "Invalid specialtyId",
      });
    }

    await db.Specialty.destroy({
      where: { specialtyId },
    });

    await db.Allcode.destroy({
      where: { keyMap: specialtyId },
    });

    return res.status(204).json({
      status: "success",
      message: "Specialty is deleted successfully!",
    });
  } catch (error) {
    console.log("Delete info specialty error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};
