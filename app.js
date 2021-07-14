const createError = require("http-errors");
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
global.IMG_URL = `${process.env.IMG_URL}/`;
const adminRouter = require("./admin/routes/admins");
const indexRouter = require("./user/routes/index");
// const userRouter = require("./user/routes/users");
require("./config/dbConfig");
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
require("./config/passport")(passport);
app.use("/", indexRouter);
// app.use("/v1/users", userRouter);
app.use("/v1/admins", adminRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
