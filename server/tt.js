const logger = require("./lib/Logger");
const {spawn} = require("child_process");
const _ = require("lodash");
const spawnCommand = function (cmd, format = "json") {
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
                    console.log('Timeout no response');
                    child.kill(15);
                } else {
                    console.log("Close ...")
                }

            }, 1000);

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
            reject(error)
        }
    });
}

const blkidParser = (data) => {
    return data.split("\n").filter(r => r !== "").map(r => {
        const [device, tags] = r.split(":")
        const re = new RegExp(/(([A-Z]*)="([^"]*)")/, "ig")
        const attr = tags.match(re).map(p => {
            let [attr, value] = p.split("=");
            value = value.replace(/^"/, "").replace(/"$/, "");
            return {
                [attr.toLowerCase()]: value
            }
        }).reduce((acc, current) => {
            for (const key of _.keys(current)) {

                acc[key] = current[key];
            }
            return acc
        }, {});
        return {
            device, ...attr
        };
    });
}

const main = async () => {
    const command = [
        "lsblk",
        "-o NAME,FSTYPE,LABEL,MOUNTPOINT,HOTPLUG,UUID,TYPE,PATH --json -l",
        "|jq  '[.blockdevices[] |  select(.hotplug==true )] '",

    ];
    try {

        let result = await spawnCommand(command.join(" "));
        let blkidResult = await spawnCommand("blkid", format = "text");

        const blkidDevices = blkidParser(blkidResult);
        result = result.filter(d => d.type === 'part').map(d => {
            const blkidDev = blkidDevices.find(b => b.device === d.path)
            if (blkidDev) {
                let {label, type} = blkidDev;
                return {
                    ...d,
                    label, fstype: type

                }
            }
        })
        console.log({
            status: 200,
            size: result.length,

            result: result

        })


    } catch (error) {
        logger.error(error)

    }
}

main().catch(console.error)