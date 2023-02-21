const express = require("express");
const allCodeController = require("../controllers/allCodeController");

const router = express.Router();

router.post("/", allCodeController.createNewData);
router.get("/:type", allCodeController.getAllCodes);
router.get("/get-one/:keyMap", allCodeController.getOneAllCode);

module.exports = router;
