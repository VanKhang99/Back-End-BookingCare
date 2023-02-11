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

const checkPassword = (passwordDB, passwordInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await bcrypt.compare(passwordDB, passwordInput));
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

module.exports = {
  hashUserPassword,
  checkPassword,
  checkEmailExisted,
};

// const checkUserEmail = (userEmail) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const userData = await db.User.findOne({
//         where: { email: userEmail },
//       });

//       userData ? resolve(true) : resolve(false);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// // 1) Check email is valid in DB
// const isEmailExist = await checkUserEmail(email);

// if (!isEmailExist) {
//   data = {
//     errCode: 1,
//     errMessage: `Invalid email or password`,
//   };

//   resolve(data);
// }

// console.log(userData);

// if (!userData) {
//   data = {
//     errCode: 2,
//     errMessage: `User not found!`,
//   };
//   resolve(data);
// }

// 3) Check password between db and input's user
// const checkPassword = await bcrypt.compareSync(
//   password,
//   userData.password
// );
