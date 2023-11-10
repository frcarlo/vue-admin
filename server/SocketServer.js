/*
**
**  Example of Interprocess communication in Node.js through a UNIX domain socket
**
**  Usage:
**   server>  MODE=server node ipc.example.js
**   client>  MODE=client node ipc.example.js
**
*/
const _ = require("lodash")
const net = require('net');
const fs = require('fs');
const logger = require("./lib/Logger");
const {spawn} = require("child_process");
const connections = {};

let mode = "server", server = null, SHUTDOWN = false;


// Our socket
const SOCKET_FILE = '/tmp/unix.sock';

class ApiError extends Error {
    status;

    constructor(status, msg, name, details = null) {

        super(msg);
        Error.captureStackTrace(this, this.constructor);
        this.status = status;
        this.details = details
        this.name = name;
    }
}

logger.info('Loading interprocess communications test');
logger.info('Mode: %s Socket: %s   Process: %s', mode, SOCKET_FILE, process.pid);
const spawnCommand = function (cmd, format = "json") {
    console.log(cmd)
    return new Promise((resolve, reject) => {
        try {
            logger.debug(cmd);
            const child = spawn(cmd, {
                shell: true
            });
            const data = [];
            let closed = false;

            setTimeout(() => {
                if (!closed) {
                    logger.debug('Timeout no response');
                    child.kill(15);
                }

            }, 5000);

            child.stdout.on('data', (chunk) => {
                data.push(chunk);
            });

            child.stderr.on('data', (data) => {
                reject(data)

            });

            child.on('error', (error) => {
                reject(error)
            });

            child.on('close', (code) => {

                closed = true;
                try {
                    let parsed = Buffer.concat(data).toString().trim();
                    if (format === "json")
                        parsed = JSON.parse(parsed);

                    resolve(parsed);
                } catch (error) {
                    logger.error("Rejected...")
                    reject(error.message);
                }

            });
        } catch (error) {

            reject(error)
        }
    });
}

const builResponse = (data, type = "response") => {
    return JSON.stringify({
        data, type
    })
}

function createServer(socket) {
    console.log('Creating server.');
    return net.createServer(function (stream) {
        logger.info('Connection acknowledged.');


        let self = Date.now();
        connections[self] = (stream);
        stream.on('end', function () {
            logger.info('Client disconnected.');
            delete connections[self];
        });

        // Messages are buffers. use toString
        stream.on('data', async function (msg) {
            msg = msg.toString();

            try {

                const event = JSON.parse(msg);
                let response = {data: [], type: "response"};
                switch (_.first(event)) {
                    case "cmd":
                        event.shift();
                        response = builResponse(await spawnCommand(...event), "response");
                        break;
                }
                stream.write(response);
                logger.info(response)
            } catch (error) {

                if (!(error instanceof Error)) {
                    error = new ApiError(500, error.toString(),)
                }
                stream.write(builResponse([{message: error.message}], "error"))

            }


        });
    }).listen(socket)
        .on("listening", function () {
            fs.chmodSync(SOCKET_FILE, 0o766);
            logger.info("Listening to socket ...")
        })
        .on('connection', function (socket) {
            fs.chmodSync(SOCKET_FILE, 0o766);
            socket.write(JSON.stringify({
                data: [],
                type: "ping"
            }));

        });
}


// check for failed cleanup
logger.info('Checking for leftover socket.');
fs.stat(SOCKET_FILE, function (err,) {
    if (err) {
        // start server
        logger.info('No leftover socket found.');
        server = createServer(SOCKET_FILE);


        return;
    }
    // remove file then start server
    logger.info('Removing leftover socket.')
    fs.unlink(SOCKET_FILE, function (err) {
        if (err) {
            // This should never happen.
            logger.error(err);
            process.exit(0);
        }
        server = createServer(SOCKET_FILE);
        const x = fs.chmodSync(SOCKET_FILE, fs.constants.O_CREAT);
        console.log("...", x)
    });
});

// close all connections when the user does CTRL-C
function cleanup() {
    if (!SHUTDOWN) {
        SHUTDOWN = true;
        logger.info('\n', "Terminating.", '\n');
        if (Object.keys(connections).length) {
            let clients = Object.keys(connections);
            while (clients.length) {
                let client = clients.pop();
                connections[client].end();
            }
        }
        server.close();
        process.exit(0);
    }
}

process.on('SIGINT', cleanup);
