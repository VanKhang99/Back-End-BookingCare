const express = require("express");
const allCodeController = require("../controllers/allCodeController");

const router = express.Router();

router.post("/", allCodeController.createAllCode);
router.get("/:type", allCodeController.getAllCodes);
router.get("/get-one/:keyMap", allCodeController.getOneAllCode);
router.delete("/delete/:keyMap", allCodeController.deleteAllCode);

module.exports = router;
// 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
