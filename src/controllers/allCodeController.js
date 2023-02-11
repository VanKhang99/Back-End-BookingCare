const db = require("../models/index");
const { Op } = require("sequelize");

exports.handleGetAllCode = async (req, res) => {
  try {
    const { type } = req.params;

    if (!type) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing parameter!",
      });
    }

    const dataResponse = await db.Allcode.findAll({
      where: { type },
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
    console.log("Get all code error", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleCreateNewData = async (req, res) => {
  try {
    const { valueEn, valueVi } = req.body;
    const checkValue = await db.Allcode.findOne({
      where: {
        [Op.and]: [{ valueEn }, { valueVi }],
      },
      raw: true,
    });

    if (checkValue) {
      return res.status(400).json({
        status: "error",
        message: "This all-code data is created in the DB. Please try another data!",
      });
    }

    const newAllCode = await db.Allcode.create(
      {
        ...req.body,
      },
      { raw: true }
    );

    return res.status(200).json({
      status: "success",
      data: {
        allcode: newAllCode,
      },
    });
  } catch (error) {
    console.log("Create data all-code error", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};
