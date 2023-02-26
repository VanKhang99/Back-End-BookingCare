const db = require("../models/index");
const { Op } = require("sequelize");

exports.getAllCodes = async (req, res) => {
  try {
    const { type } = req.params;

    if (!type) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing parameter!",
      });
    }

    const dataResponse = await db.Allcode.findAll({
      where: {
        ...(type !== "all" && { type }),
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });

    if (!dataResponse.length) {
      return res.status(400).json({
        status: "error",
        message: "The type you want to search does not exist in the database.",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        type,
        allCode: dataResponse,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all code error from the server.",
    });
  }
};

exports.getOneAllCode = async (req, res) => {
  try {
    const { keyMap } = req.params;

    const data = await db.Allcode.findOne({
      where: { keyMap },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      raw: true,
    });

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that keyMap. Please check your ID and try again!",
      });
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
      message: "Get one row allCode error from the server.",
    });
  }
};

exports.createAllCode = async (req, res) => {
  try {
    const data = { ...req.body };
    const { keyMap } = req.body;

    const isExisted = await db.Allcode.findOne({
      where: {
        keyMap,
      },
      raw: true,
    });

    if (data.action === "create") {
      if (isExisted) {
        return res.status(400).json({
          status: "error",
          message: "This all-code data(keyMap) is created in the DB. Please try another!",
        });
      }

      const infoCreated = await db.Allcode.create(
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

    const infoUpdated = await db.Allcode.update(
      {
        ...data,
        updatedAt: new Date(),
      },
      {
        where: { keyMap },
      }
    );

    if (!infoUpdated[0]) {
      return res.status(404).json({
        status: "error",
        message: "No record found with that keyMap!",
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
      message: "Create data all-code error from the server.",
    });
  }
};

exports.deleteAllCode = async (req, res) => {
  try {
    const { keyMap } = req.params;

    const allCodeDeleted = await db.Allcode.destroy({
      where: { keyMap },
    });

    if (!allCodeDeleted) {
      return res.status(404).json({
        status: "error",
        message: "No allCode found with that keyMap. Please check and try again!",
      });
    }

    return res.status(204).json({
      status: "success",
      message: "AllCode is deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete all-code error from the server.",
    });
  }
};
