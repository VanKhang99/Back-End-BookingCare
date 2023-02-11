const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.route("/").get(userController.handleGetAllUsers).post(userController.handleCreateUser);

router
  .route("/:id")
  .get(userController.handleGetUser)
  .patch(userController.handleUpdateUser)
  .delete(userController.handleDeleteUser);

// router.get("/filter/:role", userController.handleGetAllUsersByRole);

module.exports = router;
