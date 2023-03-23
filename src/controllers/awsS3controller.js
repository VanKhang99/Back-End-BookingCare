const multer = require("multer");
const db = require("../models/index");
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
});

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
  region: process.env.AWS_S3_REGION,
});

exports.upLoadPhoto = upload.single("uploaded_file");

exports.getManyImageFromS3 = async (nameDB, data) => {
  try {
    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    };

    for (const item of data) {
      if (item.image) {
        getObjectParams.Key = item.image;
        const imageCommand = new GetObjectCommand(getObjectParams);
        item.imageUrl = await getSignedUrl(s3, imageCommand, { expiresIn: 600000 });
      }

      if (nameDB === "Doctor") {
        getObjectParams.Key = item.moreData.image;
        const imageCommand = new GetObjectCommand(getObjectParams);
        item.moreData.imageUrl = await getSignedUrl(s3, imageCommand, { expiresIn: 600000 });
      }

      if (nameDB === "Clinic" && item.logo) {
        getObjectParams.Key = item.logo;
        const logoCommand = new GetObjectCommand(getObjectParams);
        item.logoUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
      }

      if (nameDB === "ClinicSpecialty" && item.clinicInfo.image) {
        getObjectParams.Key = item.clinicInfo.image;
        const logoCommand = new GetObjectCommand(getObjectParams);
        item.clinicInfo.imageUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
      }

      if (nameDB === "Specialty" && item.imageRemote) {
        getObjectParams.Key = item.imageRemote;
        const logoCommand = new GetObjectCommand(getObjectParams);
        item.imageRemoteUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
      }
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

// nameDB, id, id2 = null
exports.getOneImageFromS3 = async (nameDB, data) => {
  try {
    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    };

    if (data.image) {
      getObjectParams.Key = data.image;
      const imageCommand = new GetObjectCommand(getObjectParams);
      data.imageUrl = await getSignedUrl(s3, imageCommand, { expiresIn: 600000 });
    }

    if (nameDB === "Doctor") {
      getObjectParams.Key = data.moreData.image;
      const imageCommand = new GetObjectCommand(getObjectParams);
      data.moreData.imageUrl = await getSignedUrl(s3, imageCommand, { expiresIn: 600000 });
    }

    if (nameDB === "Clinic" && data.logo) {
      getObjectParams.Key = data.logo;
      const logoCommand = new GetObjectCommand(getObjectParams);
      data.logoUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
    }

    if (nameDB === "ClinicSpecialty" && data.clinicInfo.logo) {
      getObjectParams.Key = data.clinicInfo.logo;
      const logoCommand = new GetObjectCommand(getObjectParams);
      data.clinicInfo.logoUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
    }

    if (nameDB === "ClinicSpecialty" && data.clinicInfo.image) {
      getObjectParams.Key = data.clinicInfo.image;
      const logoCommand = new GetObjectCommand(getObjectParams);
      data.clinicInfo.imageUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
    }

    if (nameDB === "Specialty" && data.imageRemote) {
      getObjectParams.Key = data.imageRemote;
      const imageRemoteCommand = new GetObjectCommand(getObjectParams);
      data.imageRemoteUrl = await getSignedUrl(s3, imageRemoteCommand, { expiresIn: 600000 });
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

exports.postImageToS3 = async (req, res) => {
  try {
    // console.log(req.file, req.body);

    if (!req.file)
      return res.status(404).json({
        status: "error",
        message: "File image not found!",
      });

    const imageName = `${Date.now()}-${req.file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imageName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return res.status(201).json({
      status: "success",
      data: {
        image: imageName,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Post image to S3 bucket error!!!",
    });
  }
};

exports.deleteImageFromS3 = async (req, res) => {
  try {
    const { imageName } = req.params;

    if (!imageName) {
      return res.status(404).json({
        status: "success",
        message: "Please provide the image-name",
      });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imageName,
    };

    const command = new DeleteObjectCommand(params);
    const isDelete = await s3.send(command);

    if (isDelete.$metadata.httpStatusCode === 204) {
      return res.status(204).json({
        status: "success",
        message: "Image is deleted successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Delete image from S3 bucket error!!!",
    });
  }
};
