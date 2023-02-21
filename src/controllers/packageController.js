const db = require("../models/index");
const { Buffer } = require("buffer");

exports.handleGetAllPackages = async (req, res) => {
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

exports.handleGetAllPackagesByClinicId = async (req, res) => {
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

exports.handleGetAllPackagesByIds = async (req, res) => {
  try {
    const { clinicId, specialtyId } = req.params;
    const data = await db.Package.findAll({
      where: { specialtyId, clinicId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
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
          model: db.Clinic,
          as: "clinicData",
          attributes: ["logo"],
        },
        {
          model: db.Allcode,
          as: "clinicName",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!data.length) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    if (data.length > 0) {
      data.forEach((pk) => {
        pk.clinicData.logo = new Buffer(pk.clinicData.logo, "base64").toString("binary");
      });
    }

    return res.status(200).json({
      status: "success",
      results: data.length,
      data: {
        packages: data,
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

exports.handleGetPackage = async (req, res) => {
  try {
    const { packageId } = req.params;

    const data = await db.Package.findOne({
      where: { id: +packageId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Allcode,
          as: "pricePackage",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Clinic,
          as: "clinicData",
          attributes: ["logo"],
        },
        {
          model: db.Allcode,
          as: "clinicName",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    if (data.clinicData.logo) {
      data.clinicData.logo = new Buffer(data.clinicData.logo, "base64").toString("binary");
    }

    return res.status(200).json({
      status: "success",
      data: {
        data,
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

exports.handleCreatePackage = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.action === "create") {
      const infoCreated = await db.Package.create(
        {
          ...data,
        },
        { raw: true }
      );

      if (infoCreated.image) {
        infoCreated.image = new Buffer(infoCreated.image, "base64").toString("binary");
      }

      return res.status(201).json({
        status: "success",
        data: {
          info: infoCreated ? infoCreated : {},
        },
      });
    }

    const infoUpdated = await db.Package.update(
      {
        ...data,
        updatedAt: new Date(),
      },
      {
        where: { id: data.id },
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

exports.handleDeletePackage = async (req, res) => {
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
