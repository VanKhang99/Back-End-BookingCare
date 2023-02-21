const db = require("../models/index");
const { Buffer } = require("buffer");
// const { checkInfo } = require("../utils/helpers");

exports.handleGetAllClinic = async (req, res) => {
  try {
    const { type } = req.params;

    const clinics = await db.Clinic.findAll({
      where: {
        ...(type === "popular" && { popular: true }),
      },
      attributes: ["clinicId", "image", "logo", "address", "keyWord"],
      include: [
        {
          model: db.Allcode,
          as: "nameClinicData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (clinics?.length > 0) {
      clinics.forEach((clinic) => {
        if (clinic?.image) {
          clinic.image = new Buffer(clinic.image, "base64").toString("binary");
        }

        if (clinic.logo) {
          clinic.logo = new Buffer(clinic.logo, "base64").toString("binary");
        }
      });

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

exports.handleGetInfoClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;

    if (!clinicId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid clinicId",
      });
    }

    const clinic = await db.Clinic.findOne({
      where: { clinicId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
      include: [
        {
          model: db.Allcode,
          as: "nameClinicData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (clinic?.image) {
      clinic.image = new Buffer(clinic.image, "base64").toString("binary");
    }

    if (clinic?.logo) {
      clinic.logo = new Buffer(clinic.logo, "base64").toString("binary");
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: clinic ? clinic : {},
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

exports.handleSaveInfoClinic = async (req, res) => {
  try {
    const { data } = req.body;
    const { clinicId, action } = data;

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
        where: { clinicId },
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

exports.handleDeleteClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;
    if (!clinicId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid clinicId",
      });
    }

    await db.Clinic.destroy({
      where: { clinicId },
    });

    await db.Allcode.destroy({
      where: { keyMap: clinicId },
    });

    return res.status(204).json({
      status: "success",
      message: "Clinic deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete clinic error from the server.",
    });
  }
};

// {
//   model: db.Doctor_Info,
//   as: "doctors",
//   attributes: {
//     exclude: ["addressClinic", "createdAt", "updatedAt", "id", "popular"],
//   },
//   include: [
//     {
//       model: db.User,
//       as: "anotherInfo",
//     },
//     {
//       model: db.Allcode,
//       as: "paymentData",
//       attributes: ["valueEn", "valueVi"],
//     },
//     {
//       model: db.Allcode,
//       as: "priceData",
//       attributes: ["valueEn", "valueVi"],
//     },
//     {
//       model: db.Allcode,
//       as: "provinceData",
//       attributes: ["valueEn", "valueVi"],
//     },
//     {
//       model: db.Allcode,
//       as: "specialtyData",
//       attributes: ["valueEn", "valueVi"],
//     },
//   ],
// },
