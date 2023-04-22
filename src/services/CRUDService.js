const db = require("../models/index");
const bcrypt = require("bcryptjs");

// const createNewUser = async (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let passwordHashedFromBcrypt = await hashUserPassword(data.password);
//       console.log(passwordHashedFromBcrypt);
//       await db.User.create({
//         email: data.email,
//         password: passwordHashedFromBcrypt,
//         firstName: data.firstName,
//         lastName: data.lastName,
//         address: data.address,
//         phoneNumber: data.phone,
//         gender: data.gender,
//         roleId: data.roleId,
//         positionId: data.positionId,
//       });
//       resolve("A new user is created successfully!");
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

const getAllUsers = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.User.findAll({ raw: true });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

// const getUserDataById = async (userId) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let user = await db.User.findOne({
//         where: { id: userId },
//         raw: true,
//       });
//       if (!user) resolve([]);
//       resolve(user);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// const updateUserData = async (newData, id) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const user = await db.User.findOne({ where: { id: id } });

//       if (!user) throw new Error(`Cant find user with id ${id}`);

//       user.email = newData.email;
//       user.firstName = newData.firstName;
//       user.lastName = newData.lastName;
//       user.address = newData.address;
//       user.phoneNumber = newData.phoneNumber;

//       await user.save();
//       resolve();
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

module.exports = {
  // createNewUser,
  getAllUsers,
  // getUserDataById,
  // updateUserData,
};
