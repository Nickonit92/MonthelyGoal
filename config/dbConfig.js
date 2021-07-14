var mongoose = require("mongoose");
require("dotenv").config();
var username = process.env.DB_USERNAME; // REPLACE WITH YOUR USERNAME
var password = process.env.DB_PASSWORD; // REPLACE WITH YOUR PASSWORD
const server = process.env.DB_HOST; // REPLACE WITH YOUR DB SERVER
const dbport = process.env.DB_PORT; //"27017";
const database = process.env.DB_NAME; // REPLACE WITH YOUR DB NAME
const url = `mongodb://${server}:${dbport}/${database}`;
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(url, {
        // auth: {
        //     user: username,
        //     password: password
        // },
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        keepAlive: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log("Database connected successful: " + database);
      })
      .catch((err) => {
        console.error("Database connection error" + err);
      });
  }
}
module.exports = new Database();
