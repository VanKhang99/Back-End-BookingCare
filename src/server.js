const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const { Sequelize } = require("sequelize");

//CONNECT DB
const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    dialectOptions:
      process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    query: {
      raw: true,
    },
    timezone: "+07:00",
  }
);

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
