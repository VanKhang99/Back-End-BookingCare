const express = require("express");
const awsS3controller = require("../controllers/awsS3controller");

const router = express.Router();

router.post("/post-image", awsS3controller.upLoadPhoto, awsS3controller.postImageToS3);
router.delete("/delete-image/:imageName", awsS3controller.deleteImageFromS3);

module.exports = router;
