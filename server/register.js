const User = require("./api/models/userModel");
const {registerUser} = require("./api/controllers/userController");
const mongoose = require("mongoose");
const option = {
    dbName: "auth",
};
const mongoURI = process.env.MONGODB_URI;
mongoose
    .connect(`mongodb://${mongoURI}/?authMechanism=DEFAULT`, option)
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
        email: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
        fullName: process.env.USER_FULLNAME
    },
    process.env.USER_PASSWORD
)
    .then((data) => {
        console.log(data);
        process.exit(0);
    })
    .catch(console.error);
