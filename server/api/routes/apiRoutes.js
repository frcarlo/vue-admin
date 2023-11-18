"use strict";
const {body} = require('express-validator');
const userHandlers = require("../controllers/userController");
const apiHandlers = require("../controllers/apiController");
module.exports = function (app) {
    const userHandlers = require("../controllers/userController.js");
    const apiHandlers = require("../controllers/apiController.js");

    // todoList Routes
    app.route("/api/v1/lsblk").post(userHandlers.loginRequired, apiHandlers.lsblk);
    app.route("/api/v1/perfmon").post(userHandlers.loginRequired, apiHandlers.glances);
    app.route("/api/v1/mount").post(userHandlers.loginRequired, body("device").notEmpty(), apiHandlers.mountDevice);
    app.route("/api/v1/power").post(userHandlers.loginRequired, body("action").isIn(["reboot", "shutdown"]).notEmpty(), apiHandlers.power);
};

