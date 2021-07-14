const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// const Users = require("../mobileApi/models/User");
const Admin = require("../admin/models/Admin");
const secretKey = process.env.AUTH_SECRET_KEY;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;
opts.ignoreExpiration = true;
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        let to = new Date();
        let today = Math.ceil(to.getTime() / 1000);
        if (jwt_payload.exp < today) {
          return done(null, "Unothorise");
        }
        // const user = await Users.findOne({
        //   _id: jwt_payload.userId,
        //   status: true,
        // });
        // if (user) {
        //   return done(null, user);
        // } else {
        const admin = await Admin.findById({
          _id: jwt_payload.userId,
        });
        if (admin) {
          return done(null, admin);
        } else {
          return done(null, "Unothorise");
        }
        // }
      } catch (error) {
        console.log("Some error in passport");
      }
    })
  );
};
