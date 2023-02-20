const db = require("../models/index");
const { Buffer } = require("buffer");

exports.getAllPackagesType = async (req, res) => {
  try {
    const packagesType = await db.Package_Type.findAll();

    if (packagesType.length > 0) {
      packagesType.forEach((packageType) => {
        packageType.image = new Buffer(packageType.image, "base64").toString("binary");
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        packages: packagesType ? packagesType : [],
      },
    });
  } catch (error) {
    console.log("Get all packages type error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.getPackageType = async (req, res) => {
  try {
    const { packageTypeId } = req.params;

    const data = await db.Package_Type.findOne({
      where: { id: +packageTypeId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    if (data.image) {
      data.image = new Buffer(data.image, "base64").toString("binary");
    }

    return res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (error) {
    console.log("Get package error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.createPackageType = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.action === "create") {
      const infoCreated = await db.Package_Type.create(
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
    console.log("Create package type error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
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
    console.log("Delete package type error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};
