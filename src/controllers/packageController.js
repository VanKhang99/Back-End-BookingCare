const db = require("../models/index");
const { Buffer } = require("buffer");
const { getManyImageFromS3, getOneImageFromS3, deleteImageFromS3 } = require("./awsS3controller");

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await db.Package.findAll();

    return res.status(200).json({
      status: "success",
      data: {
        packages: packages ? packages : [],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all packages error from the server.",
    });
  }
};

exports.getAllPackagesByClinicId = async (req, res) => {
  try {
    const { valueClinicId } = req.params;
    const packages = await db.Package.findAll({
      where: {
        clinicId: valueClinicId,
      },
      include: [
        {
          model: db.Allcode,
          as: "paymentPackage",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "pricePackage",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "provincePackage",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "specialtyPackage",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "clinicName",
          attributes: ["valueEn", "valueVi"],
        },

        {
          model: db.Clinic,
          as: "clinicData",
          attributes: ["logo"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (packages.length > 0) {
      packages.forEach((pk) => {
        pk.clinicData.logo = new Buffer(pk.clinicData.logo, "base64").toString("binary");
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        packages: packages ? packages : [],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all packages by clinicId error from the server.",
    });
  }
};

exports.getAllPackagesByIds = async (req, res) => {
  try {
    const clinicId = +req.params.clinicId;
    const specialtyId = +req.params.specialtyId;
    console.log(specialtyId);
    console.log(clinicId);
    const packages = await getManyImageFromS3("Package", clinicId, specialtyId);
    console.log(packages);
    // const data = await db.Package.findAll({
    //   where: { specialtyId, clinicId },
    //   attributes: {
    //     exclude: ["createdAt", "updatedAt"],
    //   },
    //   include: [
    //     {
    //       model: db.Allcode,
    //       as: "pricePackage",
    //       attributes: ["valueEn", "valueVi"],
    //     },
    //     {
    //       model: db.Allcode,
    //       as: "provincePackage",
    //       attributes: ["valueEn", "valueVi"],
    //     },
    //     {
    //       model: db.Clinic,
    //       as: "clinicData",
    //       attributes: ["logo"],
    //     },
    //     {
    //       model: db.Allcode,
    //       as: "clinicName",
    //       attributes: ["valueEn", "valueVi"],
    //     },
    //   ],
    //   raw: true,
    //   nest: true,
    // });

    // if (!data.length) {
    //   return res.status(404).json({
    //     status: "error",
    //     message: "No data found with that ID. Please check your ID and try again!",
    //   });
    // }

    // if (data.length > 0) {
    //   data.forEach((pk) => {
    //     pk.clinicData.logo = new Buffer(pk.clinicData.logo, "base64").toString("binary");
    //   });
    // }

    return res.status(200).json({
      status: "success",
      results: packages.length,
      data: {
        data: packages,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all packages by ids error from the server.",
    });
  }
};

exports.getPackage = async (req, res) => {
  try {
    const packageId = +req.params.packageId;
    const packageData = await getOneImageFromS3("Package", +packageId);

    if (!packageData) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: packageData,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get package error from the server.",
    });
  }
};

exports.createPackage = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.action === "create") {
      const infoCreated = await db.Package.create(
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

    const infoUpdated = await db.Package.update(
      {
        ...data,
        updatedAt: new Date(),
      },
      {
        where: { id: +data.id },
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
      message: "Create package error from the server.",
    });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    if (!packageId) {
      return res.status(404).json({
        status: "error",
        message: "Invalid packageId",
      });
    }

    await db.Package.destroy({
      where: { id: packageId },
    });

    return res.status(204).json({
      status: "success",
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete package error from the server.",
    });
  }
};

// const data = await db.Package.findOne({
//   where: { id: +packageId },
//   attributes: {
//     exclude: ["createdAt", "updatedAt"],
//   },
//   include: [
//     {
//       model: db.Allcode,
//       as: "pricePackage",
//       attributes: ["valueEn", "valueVi"],
//     },
//     {
//       model: db.Clinic,
//       as: "clinicData",
//       attributes: ["logo"],
//     },
//     {
//       model: db.Allcode,
//       as: "clinicName",
//       attributes: ["valueEn", "valueVi"],
//     },
//   ],
//   raw: true,
//   nest: true,
// });
