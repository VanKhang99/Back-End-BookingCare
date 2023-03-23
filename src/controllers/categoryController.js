const db = require("../models/index");
const { Buffer } = require("buffer");

const { getManyImageFromS3, getOneImageFromS3, deleteImageFromS3 } = require("./awsS3controller");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await db.Category.findAll();

    if (!categories.length) {
      return res.status(404).json({
        status: "error",
        message: "Something went wrong",
      });
    }

    const dataCategories = await getManyImageFromS3("Category", categories);

    return res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get all categories error from the server.",
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await db.Category.findOne({
      where: { id: +categoryId },
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "No data found with that ID. Please check your ID and try again!",
      });
    }

    const dataCategory = await getOneImageFromS3("Category", category);

    return res.status(200).json({
      status: "success",
      data: {
        data: dataCategory,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Get category error from the server.",
    });
  }
};

exports.createUpdateCategory = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.action === "create") {
      const infoCreated = await db.Category.create(
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

    const infoUpdated = await db.Category.update(
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
      message: "Create - Update category error from the server.",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId)
      return res.status(400).json({
        status: "error",
        message: "Invalid categoryId",
      });

    await db.Category.destroy({
      where: {
        id: categoryId,
      },
    });

    return res.status(204).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete category error from the server.",
    });
  }
};

//   if (infoCreated.image) {
//     infoCreated.image = new Buffer(infoCreated.image, "base64").toString("binary");
//   }
