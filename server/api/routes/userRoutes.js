"use strict";

module.exports = function (app) {
    const userHandlers = require("../controllers/userController.js");

    app.route("/auth/profile").post(userHandlers.loginRequired, userHandlers.profile);

    app.route("/auth/register").post(userHandlers.register);

    app
        .route("/auth/logout")
        .post(userHandlers.loginRequired, userHandlers.logout);

    app.route("/auth/sign_in").post(userHandlers.sign_in);
};
