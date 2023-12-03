const _ = require("lodash");
const logger = require("../../lib/Logger");
const {spawn} = require("child_process");


Number.prototype.formatBytes = function () {
    let units = ['B', 'KB', 'MB', 'GB', 'TB'],
        bytes = this,
        i;

    for (i = 0; bytes >= 1024 && i < 4; i++) {
        bytes /= 1024;
    }

    return bytes.toFixed(2) + units[i];
}

const buildFilters = (rules, doc,) => {
    return (messages = []) => {
        //sconsole.log(messages)
        return Promise.all(
            rules.map(async filter => {
                try {
                    let matched;
                    for (const message of messages) {


                        const {re, type} = filter;
                        const e = message.match(re)

                        logger.info(type, e)
                        if (e) {
                            //s   console.log(e.index, e[0])
                            if (type === "current_file") {
                                let [__, file, size, op] = e.input.split("|")
                                size = size * 1;

                                matched = {type, message: `File(${op}): ${file}, size: ${size.formatBytes()}`}
                                break;
                            } else if (type === "total_size") {
                                //console.log(type, e)
                                let size = e[1].replace(/\./g, "") * 1;
                                doc.size = size;
                                doc.size_formatted = size.formatBytes();

                                matched = {type, message: size.formatBytes()}
                                break;
                            } else if (type === "progress") {
                                matched = {type, message: e[1] * 1}
                                break;
                            } else if (["total_files", "created_files", "transferred_files"].includes(type)) {
                                doc[type] = e[1];
                                logger.info(e)
                                matched = {type, message: e[1]};
                                break;
                            } else {
                                matched = {type, message: e[0]};
                                break;
                            }
                        }

                    }
                    return matched


                } catch (error) {
                    console.error(messages)
                    console.error(error)
                }
            }).filter(d => !_.isNil(d)));

    }
}

const dataHandler = async ({
                               context = {},
                               message = null,
                               rules = (v) => v,
                               eventKey = "backup",
                               doc = {},
                               req = {}
                           } = {}) => {
    const data = (await rules(message)).filter(d => !_.isNil(d));
    //console.log(data);
    const io = req.io;
    for (const event of data) {
        logger.info(`Emit event ${event.type} : ${event.message}`)
        io.emit(eventKey, event.message, {
            ...event,
            device: doc.device,
            id: doc.id,
            backup: doc
        })
    }
}
const closeHandler = ({
                          context, doc, req,
                          eventKey = "backup",

                      } = {}) => {

    const io = req.io;
    const {error, code = 0, process, warnings = []} = context;
    doc.warning_messages = warnings;
    if (warnings.length > 0) {
        doc.status = "done_with_warnings"
    } else {
        doc.status = "done"
    }
    io.emit("trigger", "fetchBackupHistory", {})
    io.emit("backup", "process closed", {
        type: "close",
        error: code === 0 ? false : true,
        id: doc.id,
        warnings,
        message: "Process closed",
        backup: doc,
    })
}
const errorHandler = ({
                          context, doc, req,
                          eventKey = "backup",

                      } = {}) => {
    const io = req.io;
    const {error, stderr = [], process} = context;

    if (stderr.length > 0) {
        io.emit("backup", "error", {
            type: "error",
            error: true,
            id: doc.id,
            message: stderr,
            backup: doc,
        })
    }
    if (error instanceof Error) {
        io.emit("backup", "error", {
            type: "end",
            error: true,
            id: doc.id,
            message: [error.message],
            backup: doc,
        })
    }
}

const aliveHandler = ({context, timeout = 30000, event = "backup", req = {}} = {}) => {
    const io = req.io;
    logger.info("Set aliveHandler")
    return setInterval(() => {
        io.emit(event, "alive", {
            type: "ping",
        })
    }, timeout);

}

const timeoutHandler = ({context, timeout = 60000 * 180, event = "backup", req = {}} = {}) => {
    const io = req.io;
    logger.info("Set timeoutHandler")
    return setTimeout(() => {
        if (!context.closed) {
            logger.debug('Timeout no response');
            context.process.kill(15);
        }
    }, timeout);
}

const rsync = async (source, dest, {params = "-atrv", req, backupDoc, ...opts}) => {
    const io = req.io;
    const argList = [];
    let args = [];

    args.push(params);

    args.push("--info=progress2")
    args.push("--out-format=file|%n|%l|%o")
    args.push("--stats");


    args.push(source.join(' '));
    args.push(dest);

    const filters = [
        {re: new RegExp(/^Number of files.*/), type: "number_of_files"},
        //{re: new RegExp(/^Total\s*file\s*size:\s*((\d+\.?){1,})\s*bytes/), type: "total_size"},
        {re: new RegExp(/^Total\s*file\s*size:\s*([0-9\.]*)\s*bytes/), type: "total_size"},
        {re: new RegExp(/(\d+)%/), type: "progress"},
        {re: new RegExp(/^file/), type: "current_file"},
        {re: new RegExp(/^Number of files:\s*([0-9]*)\s*\(/), type: "total_files"},
        {re: new RegExp(/^Number of created files:\s*([0-9]*)\s*\(?/), type: "created_files"},
        {re: new RegExp(/^Number of regular files transferred:\s*([0-9]*)/), type: "transferred_files"}
    ]
    try {
        io.emit("message", "Backup Started...");
        io.emit("backup", "start", {
            backup: backupDoc,
            id: backupDoc.id
        })
        backupDoc.active = true;

        const code = await spawnCommand("/usr/bin/rsync", args, {

                alive: (context) => aliveHandler({context, req,}),
                timeout: (context) => timeoutHandler({context, req}),
                onData: async (message, context) => await dataHandler({
                    context,
                    message,
                    rules: buildFilters(filters, backupDoc),
                    doc: backupDoc,
                    req
                }),
                onError: async (context) => await errorHandler({context, doc: backupDoc, req}),
                onClose: async (context) => await closeHandler({context, doc: backupDoc, req}),
                onProcess: async (process) => {
                    backupDoc.process.pid = process.pid;
                    backupDoc.process.name = process.spawnfile;
                    backupDoc.process.killed = process.killed;
                }

            },
            opts
        )
        backupDoc.active = false;
        backupDoc.updated = new Date().toISOString()
        backupDoc.finished = new Date().toISOString()
        await backupDoc.save();
        io.emit("backup", "Backup Finished...", {
            id: backupDoc.id,
            type: "end",
            backup: backupDoc
        })
        io.emit("message", "Backup Finished...");

        return true
    } catch (e) {
        backupDoc.active = false;
        backupDoc.updated = new Date().toISOString();
        backupDoc.status = "error";
        backupDoc.error_message = typeof e === "string" ? e.split(':') : e.message;
        backupDoc.save();
        io.emit("backup", "error", {
            type: "end  ",
            error: true,
            id: backupDoc.id,
            message: typeof e === "string" ? e.split(':') : [e.message],
            backup: backupDoc,
        })
        logger.error(e)
        return false
    }
}

const defaultHandler = (value) => value;
const spawnCommand = function (cmd, args, {
    alive = defaultHandler,
    timeout = defaultHandler,
    onProcess = defaultHandler,
    onError = defaultHandler,
    onClose = defaultHandler,
    onData = defaultHandler
} = {}, messageOpts = {}) {
    let timerOut;
    let timerPing;
    let warnings = [];

    return new Promise((resolve, reject) => {
        try {

            logger.info(cmd + JSON.stringify(args));
            logger.info(args);
            const process = spawn(cmd, args);
            const data = [];
            let closed = false;
            onProcess(process);
            timerOut = timeout({process, closed});
            timerPing = alive({process, closed});

            const clearTimers = () => {
                logger.info("Clear timers and intervals")
                clearInterval(timerPing)
                clearTimeout(timerOut)
            }

            process.stdout.on('data', async (chunk) => {
                const data = chunk.toString().trim().split(/[\r\n]+/);
                await onData(data, {process})
                logger.info(data)
            });

            process.stderr.on('data', async (data) => {

                const stderr = data.toString().trim().split(/[\r\n]+/);

                clearTimers()

                warnings = [...warnings, ...stderr]

                // await onError({process, error: null, stderr})
                // reject(data.toString())
            });

            process.on('error', async (error) => {

                logger.error(error);

                clearTimers()
                await onError({process, error, stderr: []})
                reject(error)
            });

            process.on('close', async (code) => {
                closed = true;

                logger.info(`${cmd}  ${JSON.stringify(args)}, ExitCode: ${code}`);

                clearTimers()
                await onClose({process, code, warnings})
                resolve(code)

            });
        } catch (error) {
            console.log("ON- REJECT  ERROR")
            reject(error)
        }
    });
}

module.exports = rsync;