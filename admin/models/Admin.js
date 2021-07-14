const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const adminSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    mobileNo: {
      type: String,
      default: "",
    },
    dialcode: {
      type: String,
      default: "91",
    },
    registerOn: {
      type: Date,
      default: Date.now(),
    },
    age: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["ADMIN", "ASTROLOGER", "HR", "CONTENT"],
      default: "ADMIN",
    },
    email: {
      type: String,
      default: "",
    },
    userName: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
      enum: ["ADMIN", "HR"],
      default: "USER",
    },
    status: {
      type: String,
      default: false,
    },
    specialties: [String],
    language: [String],
    accountStatus: {
      type: String,
      enum: ["APPROVED", "APPLIED", "SUSPEND"],
      default: "APPLIED",
    },
    deviceToken: {
      type: String,
      default: "",
    },
    deviceId: {
      type: String,
      default: "",
    },
    deviceType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

adminSchema.methods.hash = (password) => bcrypt.hashSync(password, 12);
// adminSchema.methods.toJSON = () => {
//   var obj = this.toObject();
//   delete obj.password;
//   delete obj.userName;
//   return obj;
// };

adminSchema.virtual("avatar").get(() => {
  return this.profileImage ? IMG_URL + this.profileImage : "";
});
const admin = mongoose.model("users", adminSchema);

module.exports = admin;
