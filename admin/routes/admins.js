const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminController = require("../controllers/admin");

router.post("/register", adminController.createAdmins);
router.post("/login", adminController.login);
router.post("/change-password", adminController.changePassword);
router.post("/forgot-password", adminController.forgotPassowrd);
router.get(
  "/astrologer/list",
  passport.authenticate("jwt", { session: false }),
  adminController.astrologerList
);

module.exports = router;
