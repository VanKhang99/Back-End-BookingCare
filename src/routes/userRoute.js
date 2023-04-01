const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/send-code", authController.sendCode);
router.post("/verify-code", authController.verifyCode);
router.post("/signup", authController.signUp);

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/profile", authController.protect, userController.getMe, userController.getUser);

router.route("/").get(userController.getAllUsers).post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// router.get("/filter/:role", userController.handleGetAllUsersByRole);

module.exports = router;
