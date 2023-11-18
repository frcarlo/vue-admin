"use strict";
const {validationResult} = require('express-validator');
const logger = require("../../lib/Logger");
const {spawnCommand, getSocketClient, fetchSensors} = require("./Helpers");


exports.mountDevice = async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.status(500).json({status: 500, size: 0, result: [], message: "", errors: validation.array()})
    }
    const {device} = req.body;
    logger.info(device)

    try {
        let result = await socketExecute(["mount", "|", "grep -v grep", "|", `grep -c "${device.path}"`].join(" "), "text")
        let isMounted = parseInt(result.data);
        console.log(device.mount, isMounted)
        if (device.mount === false && isMounted > 0) {
            result = await socketExecute(["umount", `${device.path}`, "&&", "echo $?"].join(" "), "text")
            console.log(parseInt(result.data))
        }
        if (device.mount === true && isMounted === 0) {
            result = await socketExecute([`mkdir -p /backup/${device.uuid}`, "&&", "mount", `${device.path}`, `/backup/${device.uuid}`, "&&", "echo $?"].join(" "), "text")
            console.log(parseInt(result.data))
        }

        res.json({
            status: 200,


            result: result.data

        })
    } catch (error) {
        res.json({
            status: 500,
            result: error.message
        })
    }

}


exports.glances = async function (req, res) {
    logger.debug(req.query)
    const {sensors = "all"} = req.query;
    let status = 200;

    const apis = sensors.split(",").map(x => x.trim()).filter(x => x !== '');

    let result = {errors: [], sensors: {}};


    for (const api of apis) {
        try {

            result.sensors[api] = await fetchSensors(api);
        } catch (error) {
            logger.error(error.status)
            result.errors.push({
                sensor: api,
                error: {status: error.status, message: error.statusText}
            });
        }
    }
    result.executed_at = new Date().toISOString();
    res.status(status).json(result);
}

const socketExecute = (command, format = "json") => {
    return new Promise((resolve, reject) => {
        try {
            const socket = getSocketClient(reject, (data) => {
                try {

                    data = JSON.parse(data)
                    if (data?.type === 'response') {
                        socket.end();
                        resolve(data);
                    } else if (data?.type === 'error') {
                        socket.end();
                        reject(data)
                    }
                } catch (e) {
                    logger.warn(e.message)
                    reject(e)
                }
            });
            socket.write(JSON.stringify(["cmd", command, format]));
        } catch (e) {
            console.log("Ups")
            reject(e)
        }
    })

}

exports.power = async function (req, res) {

    const {action} = req.body;
    const result = socketExecute(action);


}

exports.lsblk = async function (req, res) {
    const command = [
        "lsblk",
        "-o NAME,FSTYPE,LABEL,MOUNTPOINT,HOTPLUG,UUID,TYPE,PATH --json -l",
        "|jq  '[.blockdevices[] |  select((.hotplug==true and .fstype != null) )] '",

    ];

    const result = socketExecute(command.join(" "))
    result.then(data => {

        res.json({
            status: 200,
            size: data.data.length,

            result: data.data

        })
        //res.status(200).json(data)
    }).catch(error => {

        res.json({
            status: 500,
            error: {
                message: error.message,
            },
            result: []
        })
    })

};
