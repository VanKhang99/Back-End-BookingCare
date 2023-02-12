const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const { Sequelize } = require("sequelize");

//CONNECT DB
const sequelize = new Sequelize("bookingcare", "root", "0934032904", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false,
});

const deleteOldSchedules = async () => {
  const query = `DELETE FROM schedules WHERE DATE(createdAt) != CURDATE()`;
  await sequelize.query(query);
};

// deleteOldSchedules();

setInterval(deleteOldSchedules, 86400000);

sequelize
  .authenticate()
  .then(() => console.log("Connection to DB has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

// RUN APP ON SERVER PORT 8000
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Backend NodeJS is running on the port: " + port);
});
