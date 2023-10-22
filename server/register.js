const User = require("./api/models/userModel");
const { registerUser } = require("./api/controllers/userController");
const mongoose = require("mongoose");
const option = {
  dbName: "auth",
};
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect("mongodb://localhost:27017/?authMechanism=DEFAULT", option)
  .then(
    function () {
      //connected successfully
    },
    function (err) {
      //err handle
    }
  );

registerUser(
  {
    email: "frcarlo@gmail.com",
    password: "Enigma17",
    fullName: "Francesco Carlo",
  },
  "Enigma17"
)
  .then((data) => {
    console.log(data);
    process.exit(0);
  })
  .catch(console.error);
