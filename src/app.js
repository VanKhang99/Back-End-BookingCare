const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// ROUTER
const homeRouter = require("./routes/homeRoute");
const allcodeRouter = require("./routes/allcodeRoute");
const userRouter = require("./routes/userRoute");
const doctorRouter = require("./routes/doctorRoute");
const scheduleRouter = require("./routes/scheduleRoute");
const bookingRouter = require("./routes/bookingRoute");
const specialtyRouter = require("./routes/specialtyRoute");
const clinicRouter = require("./routes/clinicRoute");
const categoryRouter = require("./routes/categoryRoute");
const packageRouter = require("./routes/packageRoute");
const clinicSpecialtyRouter = require("./routes/clinicSpecialtyRoute");
const awsS3router = require("./routes/awsS3route");

// CONFIG APP
const app = express();

/// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/// Implement CORS
app.use(cors());
app.options("*", cors());

/// Serving static files
app.use(express.static(path.join(__dirname, "public")));

/// Development logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/// Body parser, reading data from body into req.body
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//CONTROLLER
app.use("/", homeRouter);
app.use("/api/allcodes", allcodeRouter);
app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/specialties", specialtyRouter);
app.use("/api/clinics", clinicRouter);
app.use("/api/clinic/specialties", clinicSpecialtyRouter);
app.use("/api/packages", packageRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/awsS3", awsS3router);

module.exports = app;
