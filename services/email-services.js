const nodemailer = require("nodemailer");
const authUP = {
  user: process.env.AUTH_EMAIL || "Moreinventive11@gmail.com",
  pass: process.env.AUTH_PASSWORD || "27940@Gmail10",
};
const fromEMAIL = "astroprovince@gmail.com";
module.exports = {
  welcomeEmail: async (email, subject, msg) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: authUP,
    });

    var mailoptions = {
      from: fromEMAIL,
      to: email,
      subject: subject,
      text: msg,
    };

    await transporter.sendMail(mailoptions, (error, info) => {
      if (error) {
        console.log("failed", error);
        return 0;
      } else {
        console.log("sent ");
        return 1;
      }
    });
  },
};
