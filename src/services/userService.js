const crypto = require("crypto");
const db = require("../models/index");
const bcrypt = require("bcryptjs");

const hashUserPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const passwordHashed = await bcrypt.hash(password, 12);
      resolve(passwordHashed);
    } catch (error) {
      reject(error);
    }
  });
};

const checkPassword = (passwordInput, passwordDB) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await bcrypt.compare(passwordInput, passwordDB));
    } catch (error) {
      reject(error);
    }
  });
};

const checkEmailExisted = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkEmail = await db.User.findOne({
        where: { email: email },
      });

      checkEmail ? resolve(true) : resolve(false);
    } catch (error) {
      reject(error);
    }
  });
};

const createPasswordResetToken = (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = {
  hashUserPassword,
  checkPassword,
  checkEmailExisted,
  createPasswordResetToken,
};
