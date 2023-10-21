"use strict";

const { spawn } = require("child_process");

exports.filesystem = async function (req, res) {
  const ls = spawn("df", ["-H"]);
  let response = "";
  const dataCache = [];
  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    console.log(`--------------`);

    dataCache.push(Buffer.from(data));
  });

  ls.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    const response = Buffer.concat(dataCache);
    res.json({ message: response.toString() });
  });
};
