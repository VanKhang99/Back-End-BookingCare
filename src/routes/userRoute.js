const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.route("/").get(userController.getAllUsers).post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// router.get("/filter/:role", userController.handleGetAllUsersByRole);

module.exports = router;
