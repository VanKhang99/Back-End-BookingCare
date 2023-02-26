const db = require("../models/index");
const { Buffer } = require("buffer");

const { getManyImageFromS3, getOneImageFromS3, deleteImageFromS3 } = require("./awsS3controller");

exports.getAllPackagesType = async (req, res) => {
  try {
    const dataPackagesType = await getManyImageFromS3("Package_Type");

    return res.status(200).json({
      status: "success",
      data: {
        packages: dataPackagesType.length ? dataPackagesType : [],
      },
    });

    console.log(dataPackagesType);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all packages type error from the server.",
    });
  }
};

exports.getPackageType = async (req, res) => {
  try {
    const { packageTypeId } = req.params;
    const dataPackagesType = await getOneImageFromS3("Package_Type", +packageTypeId);

    if (!dataPackagesType) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        data: dataPackagesType,
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

exports.createUpdatePackageType = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.action === "create") {
      const infoCreated = await db.Package_Type.create(
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

    const infoUpdated = await db.Package_Type.update(
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
      message: "Create package-type error from the server.",
    });
  }
};

exports.deletePackageType = async (req, res) => {
  try {
    const { packageTypeId } = req.params;

    if (!packageTypeId)
      return res.status(400).json({
        status: "error",
        message: "Invalid packageTypeID",
      });

    await db.Package_Type.destroy({
      where: {
        id: packageTypeId,
      },
    });

    return res.status(204).json({
      status: "success",
      message: "Package type deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete package-type error from the server.",
    });
  }
};

//   if (infoCreated.image) {
//     infoCreated.image = new Buffer(infoCreated.image, "base64").toString("binary");
//   }
