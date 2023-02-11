const express = require("express");
const allCodeController = require("../controllers/allCodeController");

const router = express.Router();

router.post("/", allCodeController.handleCreateNewData);
router.get("/:type", allCodeController.handleGetAllCode);

module.exports = router;
