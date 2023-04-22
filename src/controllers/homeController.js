// const db = require("../models/index");
const CRUDService = require("../services/CRUDService");

exports.getHomePage = async (req, res) => {
  try {
    // const data = await db.User.findAll();
    return res.render("home.ejs", {
      // data: JSON.stringify(data),
      data: "Khang",
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.getCRUD = async (req, res) => {
//   return res.render("postCRUD.ejs");
// };

// exports.postCRUD = async (req, res) => {
//   const message = await CRUDService.createNewUser(req.body);
//   return res.redirect("/crud");
// };

// exports.displayDataCRUD = async (req, res) => {
//   const userData = await CRUDService.getAllUsers();
//   return res.render("displayDataCRUD.ejs", {
//     dataTable: userData,
//   });
// };

// exports.getUserId = async (req, res) => {
//   const userId = req.query.id;

//   if (!userId) return res.send("Users not found!");

//   const userData = await CRUDService.getUserDataById(userId);
//   return res.render("updateDataCRUD.ejs", {
//     data: userData,
//   });
// };

// exports.patchCRUD = async (req, res) => {
//   let data = req.body;
//   const newDataUser = await CRUDService.updateUserData(data, req.params.id);
//   return res.redirect("/get-crud");
// };
