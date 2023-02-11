const db = require("../models/index");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const { Buffer } = require("buffer");

const roleToFilter = (roleString) => {
  let roleIdToMap;
  if (roleString === "tat-ca" || roleString === "all" || roleString === "") {
    return (roleIdToMap = "ALL");
  }

  if (roleString === "quan-tri-vien" || roleString === "admin") {
    return (roleIdToMap = "R1");
  }

  if (roleString === "bac-si" || roleString === "doctor") {
    return (roleIdToMap = ["R2", , "R3", "R4", "R5", "R6", "R8"]);
  }

  return (roleIdToMap = "R7");
};

exports.handleGetAllUsers = async (req, res) => {
  try {
    //pagination
    const page = +req.query.page;
    const limit = +req.query.limit;
    const offset = (page - 1) * limit;

    //filter
    const roleIdToMap = roleToFilter(req.query.role);
    // console.log(req.query.role);

    const totalUsers = await db.User.findAll({
      attributes: ["roleId"],
    });

    const users = await db.User.findAll({
      where: { ...(roleIdToMap !== "ALL" && { roleId: roleIdToMap }) },
      attributes: {
        exclude: ["password"],
      },
      ...(offset >= 0 && { offset }),
      ...(limit > 0 && { limit }),
    });

    if (users.length > 0) {
      users.forEach((user) => {
        if (user.roleId !== "R7") {
          user.image = new Buffer.from(user.image, "base64").toString("binary");
        }
      });

      return res.status(200).json({
        status: "success",
        data: {
          results: users.length,
          countUsers: {
            count: roleIdToMap === "ALL" ? totalUsers.length : users.length,
            users: totalUsers,
          },
          users,
        },
      });
    }
  } catch (error) {
    console.log("Get all users by error!", error);
    return res.status(500).json({
      status: "error",
      message: "Error from the server.",
    });
  }
};

exports.handleGetUser = async (req, res) => {
  try {
    const id = +req.params.id;
    const user = await db.User.findOne({
      attributes: {
        exclude: ["password", "image"],
      },
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user found with that ID",
        data: {},
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.handleCreateUser = async (req, res) => {
  try {
    const checkEmail = await userService.checkEmailExisted(req.body.email);

    if (checkEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email already in use. Please try another one!",
      });
    }

    const passwordHashedFromBcrypt = await userService.hashUserPassword(req.body.password);

    const newUser = await db.User.create(
      {
        ...req.body,
        password: passwordHashedFromBcrypt,
      },
      { raw: true }
    );
    newUser.password = undefined;

    return res.status(201).json({
      status: "success",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.handleUpdateUser = async (req, res) => {
  try {
    const id = +req.params.id;

    const dataUpdated = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      image: req.body.image ? req.body.image : "",
      gender: req.body.gender,
      roleId: req.body.roleId,
      positionId: req.body.positionId,
    };

    const result = await db.User.update(
      { ...dataUpdated },
      {
        where: { id },
      }
    );

    if (!result[0]) {
      return res.status(404).json({
        status: "error",
        message: "No record found with that ID or update data is empty!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Update successful!",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.handleDeleteUser = async (req, res) => {
  try {
    const id = +req.params.id;

    const result = await db.User.destroy({
      where: {
        id,
      },
    });

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "No record found with that ID. Please try another ID!",
      });
    }

    return res.status(204).json({
      status: "success",
      message: "Delete user successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.handleGetAllUsersByRole = async (req, res) => {
//   try {
//     const { role } = req.params;
//     const roleIdToMap = roleToFilter(role);

//     const users = await db.User.findAll({
//       where: { ...(roleIdToMap !== "ALL" && { roleId: roleIdToMap }) },
//       attributes: {
//         exclude: ["password", "createdAt", "updatedAt"],
//       },
//       raw: true,
//     });

//     if (users.length > 0) {
//       users.forEach((user) => {
//         if (user.roleId !== "R7") {
//           user.image = new Buffer.from(user.image, "base64").toString("binary");
//         }
//       });

//       return res.status(200).json({
//         status: "success",
//         data: {
//           results: users.length,
//           data: users,
//         },
//       });
//     }
//   } catch (error) {
//     console.log("Get all users by role error!", error);
//     return res.status(500).json({
//       status: "error",
//       message: "Error from the server.",
//     });
//   }
// };
