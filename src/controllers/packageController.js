const db = require("../models/index");
const { getManyImageFromS3, getOneImageFromS3 } = require("./awsS3controller");
const { bulkCreatePackageCategories } = require("./packageCategoriesController");

exports.getAllPackages = async (req, res) => {
  try {
    const clinicId = +req.params.clinicId;
    const specialtyId = +req.params.specialtyId;
    const getAll = req.params.getAll;
    let objectWhere;

    if (getAll === "true") {
      objectWhere = {};
    } else {
      objectWhere = {
        specialtyId: specialtyId ? specialtyId : null,
        ...(clinicId && { clinicId: clinicId }),
      };
    }

    const packages = await db.Package.findAll({
      where: objectWhere,
      attributes: {
        exclude: ["createdAt", "updatedAt", "provinceId", "paymentId"],
      },
      include: [
        {
          model: db.Clinic,
          as: "clinicData",
          attributes: ["address", "nameEn", "nameVi"],
        },
        // {
        //   model: db.Category,
        //   as: "category",
        //   attributes: ["id", "nameEn", "nameVi"],
        // },
        {
          model: db.Specialty,
          as: "specialty",
          attributes: ["id", "nameVi", "nameEn"],
        },
        {
          model: db.Allcode,
          as: "provincePackage",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "paymentPackage",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
      ],
      nest: true,
      raw: true,
    });

    if (!packages.length)
      return res.status(400).json({
        status: "error",
        message: "Something went wrong!",
      });

    const packagesData = await getManyImageFromS3("Package", packages);

    return res.status(200).json({
      status: "success",
      results: packagesData.length,
      data: {
        data: packagesData,
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
    const pk = await db.Package.findOne({
      where: { id: packageId },
      attributes: {
        exclude: ["createdAt", "updatedAt", "provinceId", "paymentId", "specialtyId"],
      },
      include: [
        {
          model: db.Clinic,
          as: "clinicData",
          attributes: ["nameVi", "nameEn"],
        },
        {
          model: db.Specialty,
          as: "specialty",
          attributes: ["id", "nameVi", "nameEn"],
        },
        {
          model: db.Allcode,
          as: "provincePackage",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "paymentPackage",
          attributes: ["keyMap", "valueEn", "valueVi"],
        },
        // {
        //   model: db.Category,
        //   through: { attributes: [] },
        //   // as: "packageCategoryData",
        // },
      ],
      nest: true,
      raw: true,
    });

    if (!pk) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    const packageData = await getOneImageFromS3("Package", pk);

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
      const infoCreated = (
        await db.Package.create({
          ...data,
        })
      ).get({ plain: true });

      // if (infoCreated) {
      //   console.log("test");
      //   for (const id of data.categoryIds) {
      //     await db.PackageCategory.create({
      //       packageId: +infoCreated.id,
      //       categoryId: +id,
      //     });
      //   }
      // }

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
