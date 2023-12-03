const logger = require("../../lib/Logger");
const {spawn} = require("child_process");
const net = require("net");
const _ = require("lodash")


exports.fetchSensors = async (sensor = "all") => {

    logger.debug("Execute sensor:" + `${process.env.GLANCE_URL}/api/3/${sensor}`)
    const api = await fetch(`${process.env.GLANCE_URL}/api/3/${sensor}`, {});

    if (api.ok) {
        const data = await api.json();
        try {
            return data;
        } catch (error) {
            throw error;
        }
    } else {
        throw api;

    }
}


const spawnCommand = function (cmd, format = "json") {
    return new Promise((resolve, reject) => {
        try {
            logger.debug(cmd + " " + format);
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
                logger.info(data.toString())
                data.push(chunk);
            });

            child.stderr.on('data', (data) => {
                console.log("ups")
                reject(data)

            });

            child.on('error', (error) => {
                console.log("Ups ")
                reject(error)
            });

            child.on('close', (code) => {
                closed = true;
                try {
                    let parsed = Buffer.concat(data).toString()
                    if (format === "json")
                        parsed = JSON.parse(parsed);

                    resolve(parsed);
                } catch (error) {
                    logger.error(error)
                    reject(error)
                }

            });
        } catch (error) {
            console.log("Ups")
            reject(error)
        }
    });
}

exports.spawnCommand = spawnCommand;

exports.createServer = function (socket) {

    return net.createServer(function (stream) {
        logger.info('Connection acknowledged.');


        let self = Date.now();
        connections[self] = (stream);
        stream.on('end', function () {
            logger.info('Client disconnected.');
            delete connections[self];
        });

        // Messages are buffers. use toString
        stream.on('data', function (msg) {
            msg = msg.toString();
            logger.info('Client:', msg);
            stream.write(msg)

        });
    }).listen(socket)
        .on('connection', function (socket) {

            socket.write('Alive ...');

        });
}

exports.getSocketClient = function (reject, cb) {
    return net.createConnection(process.env.SOCKETFILE)
        .on('connect', () => {
            logger.info("New connection to socket: " + process.env.SOCKETFILE);
        })
        // Messages are buffers. use toString
        .on('data', function (data) {
            data = data.toString();
            if (typeof cb === 'function') cb(data);
        })
        .on('error', function (data) {
            logger.error('Server not active.');
            // process.exit(1);
            reject(new Error('Server not active.'))
        });
}