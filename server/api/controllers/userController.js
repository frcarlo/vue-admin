"use strict";

const mongoose = require("mongoose"),
    jwt = require("jsonwebtoken"),
    bcrypt = require("bcrypt"),
    User = mongoose.model("User");


exports.registerUser = async (user, password) => {
    const newUser = new User(user);
    newUser.hash_password = bcrypt.hashSync(password, 10);
    try {
        const user = await newUser.save();
        return user;
    } catch (e) {
        console.log(e.message);
    }
};

exports.register = async function (req, res) {
    const newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    try {
        const user = register(req.body, req.body.password);
        //const user = await newUser.save();
        user.hash_password = undefined;
        return res.json(user);
    } catch (e) {
        console.log(e);
        return res.status(400).send({
            message: e.message,
        });
    }
};

exports.sign_in = async function (req, res) {
    const user = await User.findOne({email: req.body.email});
    if (!user || !user.comparePassword(req.body.password)) {
        return res.status(401).json({
            message: "Authentication failed. Invalid user or password.",
        });
    }
    return res.json({
        token: jwt.sign(
            {email: user.email, fullName: user.fullName, _id: user._id},
            "RESTFULAPIs"
        ),
    });
};

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({message: "Unauthorized user!!"});
    }
};

exports.logout = function (req, res, next) {
    if (req.user) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                status: true,
                message: "session closed",
            });
        });

        // next();
    } else {
        return res.status(400).json({message: "not sign in"});
    }
};

exports.profile = function (req, res, next) {
    if (req.user) {
        res.send(req.user);
        // next();
    } else {
        return res.status(401).json({message: "Invalid token"});
    }
};
