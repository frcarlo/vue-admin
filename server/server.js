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
  .connect("mongodb://localhost:27017/?authMechanism=DEFAULT", option)
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
require("./api/routes/userRoutes")(app);
require("./api/routes/apiRoutes")(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.use(function (error, request, response, next) {
  // Error handling middleware functionality
  console.log(`error ${error.message}`); // log the error
  const status = error.status || 400;
  // send back an easily understandable error message to the caller
  response.status(status).json({ error: true, message: error.message });
});

app.listen(port);

console.log(" RESTful API server started on: " + port);

module.exports = app;
