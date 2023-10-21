"use strict";

const express = require("express"),
  app = express(),
  cors = require("cors"),
  port = process.env.PORT || 3000,
  User = require("./api/models/userModel"),
  jsonwebtoken = require("jsonwebtoken");

const mongoose = require("mongoose");
const option = {
  dbName: "auth",
};

const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(
    "mongodb://root:Enigma17@localhost:27017/?authMechanism=DEFAULT",
    option
  )
  .then(
    function () {
      //connected successfully
    },
    function (err) {
      //err handle
    }
  );

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(function (req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      "RESTFULAPIs",
      function (err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});
const routes = require("./api/routes/userRoutes");
const apiRoutes = require("./api/routes/apiRoutes");
routes(app);
apiRoutes(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(port);

console.log(" RESTful API server started on: " + port);

module.exports = app;
