"use strict";

module.exports = function (app) {
  const userHandlers = require("../controllers/userController.js");
  const apiHandlers = require("../controllers/apiController.js");

  // todoList Routes
  app.route("/api/df").post(userHandlers.loginRequired, apiHandlers.filesystem);
};
