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
const packageRouter = require("./routes/packageRoute");
const clinicSpecialtyRouter = require("./routes/clinic_specialtyRoute");

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
// app.use(express.json({ limit: "10kb" }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//CONTROLLER
app.use("/", homeRouter);
app.use("/api/allcodes", allcodeRouter);
app.use("/api/users", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/specialties", specialtyRouter);
app.use("/api/clinics", clinicRouter);
app.use("/api/clinics-specialties", clinicSpecialtyRouter);
app.use("/api/packages", packageRouter);

module.exports = app;
