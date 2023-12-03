"use strict";

const express = require("express"),
    app = express(),
    cors = require("cors"),
    port = process.env.PORT || 3000,
    User = require("./api/models/userModel"),
    Backup = require("./api/models/backupModel"),

    history = require('connect-history-api-fallback'),

    jsonwebtoken = require("jsonwebtoken");

require('dotenv').config()
const {registerUser} = require("./api/controllers/userController");
const logger = require("./lib/Logger");
const pinoHTTP = require('pino-http')
const appPath = __dirname + '/app/';
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const whitelist = ["http://loalhost:3000", "/", "http://localhost:3001"]
const io = new Server(server,
    {
        cors: {
            origin: "*",
            transports: ["websocket", "polling"],
            credentials: true
        },
        allowEIO3: true
    },
);
app.set("io", io);
const mongoose = require("mongoose");

const option = {
    dbName: "auth",
};

const mongoURI = process.env.MONGODB_URI;
let BackupModel;
//mongoose.model("User");
mongoose
    .connect(`mongodb://${mongoURI}/?authMechanism=DEFAULT`, option)
    .then(
        function () {
            //connected successfully


            if (process.env.USER_EMAIL && process.env.USER_PASSWORD && process.env.USER_FULLNAME)
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

                    })
                    .catch(console.error);
        },
        function (err) {
            //err handle
        }
    );

if (process.env.NODE_ENV !== "development")
    app.use(pinoHTTP({
        logger
    }))

BackupModel = mongoose.model("Backup");

BackupModel.watch((data) => {
    console.log(data)
})

app.use(history({}));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(function (req, res, next) {
    req.io = io;

    req.Backup = BackupModel;
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


app.use(express.static(appPath));
app.get("/pong", (req, res) => {
    res.status(200).json({message: "alive"})
})

require("./api/routes/userRoutes")(app);
require("./api/routes/apiRoutes")(app);

app.use(function (req, res) {
    console.log(`referer ${req.get('Referrer')}, url: ${req.url} not found`); // log the error
    //console.log(req)
    res.status(404).send({url: req.originalUrl + " not found"});
});

app.use(function (error, request, response, next) {
    // Error handling middleware functionality
    console.log(`url: ${req.url} ,  referrer: ${req.get('Referrer')} error ${error.message}`); // log the error
    const status = error.status || 400;
    // send back an easily understandable error message to the caller
    response.status(status).json({error: true, message: error.message});
});
io.on('connection', (socket) => {
    logger.info("New socket connection")
    socket.emit("message", {data: `${new Date().toDateString()} - you are connected`})
});
console.log("...")
server.listen(port);

console.log(" RESTful API server started on: " + port);

module.exports = app;
