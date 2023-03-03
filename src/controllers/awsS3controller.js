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

exports.getManyImageFromS3 = async (nameDB, idFind1 = null, idFind2 = null) => {
  try {
    let data;
    if (nameDB === "Doctor_Info") {
      data = await db[nameDB].findAll({
        attributes: ["doctorId", "popular", "remote"],
        include: [
          {
            model: db.User,
            as: "moreData",
            attributes: ["id", "firstName", "lastName", "image", "roleId", "positionId"],
            include: [
              {
                model: db.Allcode,
                as: "roleData",
                attributes: ["keyMap", "valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "positionData",
                attributes: ["keyMap", "valueEn", "valueVi"],
              },
            ],
          },
          {
            model: db.Specialty,
            as: "specialtyData",
            attributes: ["id", "nameEn", "nameVi"],
          },
        ],
        nest: true,
        raw: true,
      });
    } else if (nameDB === "Clinic_Specialty") {
      data = await db[nameDB].findAll({
        where: { clinicId: +idFind1 },
        attributes: ["clinicId", "specialtyId", "address", "image"],
        include: [
          {
            model: db.Specialty,
            as: "specialtyName",
            attributes: ["nameVi", "nameEn"],
          },
          {
            model: db.Clinic,
            as: "clinicInfo",
            attributes: ["nameVi", "nameEn", "image"],
          },
        ],
        nest: true,
        raw: true,
      });
    } else if (nameDB === "Package") {
      data = await db[nameDB].findAll({
        where: {
          ...(idFind2 && { specialtyId: idFind2 }),
          ...(idFind1 && { clinicId: idFind1 }),
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", ""],
        },
        include: [
          {
            model: db.Clinic,
            as: "clinicData",
            // attributes: ["keyMap", "valueEn", "valueVi"],
          },
        ],
        nest: true,
        raw: true,
      });
    } else {
      data = await db[nameDB].findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
    }

    // console.log(data);

    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    };

    for (const item of data) {
      if (item.image) {
        getObjectParams.Key = item.image;
        const imageCommand = new GetObjectCommand(getObjectParams);
        item.imageUrl = await getSignedUrl(s3, imageCommand, { expiresIn: 600000 });
      }

      if (nameDB === "Doctor_Info") {
        getObjectParams.Key = item.moreData.image;
        const imageCommand = new GetObjectCommand(getObjectParams);
        item.moreData.imageUrl = await getSignedUrl(s3, imageCommand, { expiresIn: 600000 });
      }

      if (nameDB === "Clinic" && item.logo) {
        getObjectParams.Key = item.logo;
        const logoCommand = new GetObjectCommand(getObjectParams);
        item.logoUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
      }

      if (nameDB === "Clinic_Specialty" && item.clinicInfo.image) {
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

exports.getOneImageFromS3 = async (nameDB, id, id2 = null) => {
  try {
    let data;

    if (nameDB === "Clinic_Specialty") {
      data = await db[nameDB].findOne({
        where: {
          clinicId: +id,
          specialtyId: +id2,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: db.Specialty,
            as: "specialtyName",
            attributes: ["nameVi", "nameEn"],
          },
          {
            model: db.Clinic,
            as: "clinicInfo",
            attributes: ["nameVi", "nameEn", "image", "logo", "processHTML", "priceHTML", "noteHTML"],
          },
        ],
        nest: true,
        raw: true,
      });
    } else if (nameDB === "User") {
      data = await db.User.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["keyMap", "valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "roleData",
            attributes: ["keyMap", "valueEn", "valueVi"],
          },
          {
            model: db.Doctor_Info,
            as: "moreData",
            attributes: {
              exclude: [
                "doctorId",
                "id",
                "nameClinic",
                "provinceId",
                "paymentId",
                "priceId",
                "clinicId",
                "specialtyId",
                "createdAt",
                "updatedAt",
              ],
            },
            include: [
              {
                model: db.Clinic,
                as: "clinic",
                attributes: ["id", "nameEn", "nameVi", "address"],
              },
              {
                model: db.Specialty,
                as: "specialtyData",
                attributes: ["id", "nameEn", "nameVi"],
              },
              {
                model: db.Allcode,
                as: "provinceData",
                attributes: ["keyMap", "valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "paymentData",
                attributes: ["keyMap", "valueEn", "valueVi"],
              },
              {
                model: db.Allcode,
                as: "priceData",
                attributes: ["keyMap", "valueEn", "valueVi"],
              },
            ],
          },
        ],
        nest: true,
        raw: true,
      });
    } else if (nameDB === "Package") {
      data = await db[nameDB].findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "priceId", "provinceId", "paymentId", "specialtyId"],
        },
        include: [
          {
            model: db.Clinic,
            as: "clinicData",
            attributes: ["nameVi", "nameEn"],
          },
          {
            model: db.Specialty,
            as: "specialty",
            attributes: ["id", "nameVi", "nameEn"],
          },
          {
            model: db.Allcode,
            as: "pricePackage",
            attributes: ["keyMap", "valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "provincePackage",
            attributes: ["keyMap", "valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "paymentPackage",
            attributes: ["keyMap", "valueEn", "valueVi"],
          },
        ],
        nest: true,
        raw: true,
      });
    } else {
      data = await db[nameDB].findOne({
        where: { id: +id },
      });
    }

    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    };

    if (data.image) {
      getObjectParams.Key = data.image;
      const imageCommand = new GetObjectCommand(getObjectParams);
      data.imageUrl = await getSignedUrl(s3, imageCommand, { expiresIn: 600000 });
    }

    if (nameDB === "Clinic" && data.logo) {
      getObjectParams.Key = data.logo;
      const logoCommand = new GetObjectCommand(getObjectParams);
      data.logoUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
    }

    if (nameDB === "Clinic_Specialty" && data.clinicInfo.logo) {
      getObjectParams.Key = data.clinicInfo.logo;
      const logoCommand = new GetObjectCommand(getObjectParams);
      data.clinicInfo.logoUrl = await getSignedUrl(s3, logoCommand, { expiresIn: 600000 });
    }

    if (nameDB === "Clinic_Specialty" && data.clinicInfo.image) {
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
