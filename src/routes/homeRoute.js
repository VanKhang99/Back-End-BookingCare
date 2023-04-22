const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", homeController.getHomePage);
// router.get("/crud", homeController.getCRUD);

// //Create
// router.post("/post-crud", homeController.postCRUD);

// //Read
// router.get("/get-crud", homeController.displayDataCRUD);

// //Update
// router.get("/update-crud", homeController.getUserId);
// router.post("/patch-crud/:id", homeController.patchCRUD);

module.exports = router;
