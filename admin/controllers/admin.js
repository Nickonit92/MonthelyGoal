const Admin = require("../models/Admin");
const SendResponse = require("../../apiHandler");
const Boom = require("boom");
const FileService = require("../../services/file-service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  userName,
  yearsDiff,
  generateRandomString,
  properCase,
} = require("../../helper/healper");
const { welcomeEmail } = require("../../services/email-services");

module.exports = {
  //create Sub Admin
  createAdmins: async (req, res) => {
    try {
      const mobile = await Admin.findOne({ mobileNo: req.body.mobileNo });
      if (mobile) {
        return SendResponse(
          res,
          Boom.conflict("This Mobile Number already registered")
        );
      }
      const email = await Admin.findOne({ email: req.body.email });
      if (email) {
        return SendResponse(
          res,
          Boom.conflict("This Email Id already registered")
        );
      }
      req.body.name = properCase(req.body.name);
      req.body.userName = userName(req.body.name);
      req.body.age = yearsDiff(req.body.dob, new Date());
      req.body.password = generateRandomString(6);
      await welcomeEmail(
        req.body.email,
        "Welcome Mail ASTROPROVINCE",
        `Hi ${req.body.name}, Welcome to Astroprovince. This mail is for Account creation Here is your Username: ${req.body.userName} and Password: ${req.body.password}`
      );
      let profileImage = "";
      if (req.files) {
        profileImage = await FileService.uploadImage(req.files.profileImage);
      }
      req.body.profileImage = profileImage;
      let user = new Admin(req.body);
      user.password = user.hash(req.body.password);
      user = await user.save();
      return SendResponse(res, user, "Registration successfully");
    } catch (error) {
      return SendResponse(res, Boom.badImplementation());
    }
  },

  //Admin Login
  login: async (req, res) => {
    try {
      const user = await Admin.findOne({ userName: req.body.userName })
        .select("+password")
        .lean()
        .exec();
      if (!user) {
        return SendResponse(res, Boom.conflict("User Id is not correct"));
      }
      let match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return SendResponse(res, Boom.conflict("Incorrect Password"));
      }
      if (user.accountStatus === "APPLIED") {
        return res.json({
          data: {
            code: 2,
            message: "Go to chnage password screen",
            result: {},
          },
        });
      }
      var payload = {
        email: user.email,
        userId: user._id,
      };
      jwt.sign(
        payload,
        process.env.AUTH_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN },
        (error, token) => {
          let Token = "Bearer " + token;
          user.password = undefined;
          return SendResponse(res, { Token, user }, "User Login successfully");
        }
      );
    } catch (error) {
      return SendResponse(res, Boom.badImplementation());
    }
  },

  //Change Password
  changePassword: async (req, res) => {
    try {
      const user = await Admin.findOne({ userName: req.body.userName })
        .select("+password")
        .lean()
        .exec();
      if (!user) {
        return SendResponse(res, Boom.conflict("User Id is not correct"));
      }
      let match = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!match) {
        return SendResponse(res, Boom.conflict("Incorrect Password"));
      }
      let password = await bcrypt.hash(req.body.password, 12);
      await Admin.findByIdAndUpdate(
        { _id: user._id },
        { $set: { password: password, accountStatus: "APPROVED" } }
      );
      return SendResponse(res, {}, "Password Changed");
    } catch (error) {
      return SendResponse(res, Boom.badImplementation());
    }
  },

  //Forgot Password
  forgotPassowrd: async (req, res) => {
    try {
      const user = await Admin.findOne({ userName: req.body.userName });
      if (!user) {
        return SendResponse(res, Boom.conflict("User Id is not correct"));
      }
      req.body.password = generateRandomString(6);
      await welcomeEmail(
        user.email,
        "Forgot Password",
        `Hi ${user.name}, Here is your new one time Password: ${req.body.password}`
      );
      let password = await bcrypt.hash(req.body.password, 12);
      await Admin.findByIdAndUpdate(
        { _id: user._id },
        { $set: { password: password, accountStatus: "APPLIED" } }
      );
      return SendResponse(res, {}, "Forgot Password");
    } catch (error) {
      return SendResponse(res, Boom.badImplementation());
    }
  },

  //List of Astrologer
  astrologerList: async (req, res) => {
    try {
      if (req.user == "Unothorise") {
        return res.json({
          data: {
            code: 402,
            message: "Unauthorized Token",
            result: {},
          },
        });
      }
      let astrologers = await Admin.find({ role: "ASTROLOGER" });
      return SendResponse(res, astrologers, "Astrologers List");
    } catch (error) {
      return SendResponse(res, Boom.badImplementation());
    }
  },
};
