const db = require("../models/index");
const { Buffer } = require("buffer");
const { checkInfo } = require("../utils/helpers");
const { getManyImageFromS3, getOneImageFromS3, deleteImageFromS3 } = require("./awsS3controller");

exports.getAllSpecialties = async (req, res) => {
  try {
    const { type } = req.params;
    let specialties = await getManyImageFromS3("Specialty");

    if (type === "popular") {
      specialties = specialties.filter((specialty) => specialty.popular);
    }

    if (type === "remote") {
      specialties = specialties.filter((specialty) => specialty.remote);
    }

    if (specialties?.length > 0) {
      return res.status(200).json({
        status: "success",
        results: specialties.length,
        data: {
          specialties,
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

// exports.getAllSpecialtiesPopular = async (req, res) => {
//   try {
//     const specialties = await db.Specialty.findAll({
//       where: { popular: true },
//       attributes: {
//         exclude: ["createdAt", "updatedAt", "id", "imageRemote"],
//       },
//       include: [
//         {
//           model: db.Allcode,
//           as: "nameData",
//           attributes: ["valueEn", "valueVi"],
//         },
//       ],
//       raw: true,
//       nest: true,
//     });

//     specialties.forEach((specialty) => {
//       specialty.image = new Buffer(specialty.image, "base64").toString("binary");
//     });

//     return res.status(200).json({
//       status: "success",
//       data: {
//         specialties,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: "error",
//       message: "Get all info specialty error from the server.",
//     });
//   }
// };

// exports.getAllSpecialtiesRemote = async (req, res) => {
//   try {
//     const specialties = await db.Specialty.findAll({
//       where: { remote: true },
//       attributes: ["imageRemote", "specialtyId"],
//       include: [
//         {
//           model: db.Allcode,
//           as: "nameData",
//           attributes: ["valueEn", "valueVi"],
//         },
//       ],
//       raw: true,
//       nest: true,
//     });

//     specialties.forEach((specialty) => {
//       specialty.imageRemote = new Buffer(specialty.imageRemote, "base64").toString("binary");
//     });

//     return res.status(200).json({
//       status: "success",
//       result: specialties.length,
//       data: {
//         specialties,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: "error",
//       message: "Get all specialties remote error from the server.",
//     });
//   }
// };

exports.getSpecialty = async (req, res) => {
  try {
    const specialtyId = +req.params.specialtyId;

    const dataSpecialty = await getOneImageFromS3("Specialty", specialtyId);

    if (!dataSpecialty)
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });

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
