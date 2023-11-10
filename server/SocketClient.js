/*
**
**  Example of Interprocess communication in Node.js through a UNIX domain socket
**
**  Usage:
**   server>  MODE=server node ipc.example.js
**   client>  MODE=client node ipc.example.js
**
*/

const net = require('net');
const fs = require('fs');
const connections = {};
let client = null, mode = "client";


// prevent duplicate exit messages
let SHUTDOWN = false;

// Our socket
const SOCKETFILE = '/tmp/unix.sock';

// For simplicity of demonstration, both ends in this one file

console.info('Loading interprocess communications test');
console.info('  Mode: %s \n  Socket: %s \n  Process: %s', mode, SOCKETFILE, process.pid);

function createServer(socket) {
    console.log('Creating server.');
    var server = net.createServer(function (stream) {
            console.log('Connection acknowledged.');

            // Store all connections so we can terminate them if the server closes.
            // An object is better than an array for these.
            var self = Date.now();
            connections[self] = (stream);
            stream.on('end', function () {
                console.log('Client disconnected.');
                delete connections[self];
            });

            // Messages are buffers. use toString
            stream.on('data', function (msg) {
                msg = msg.toString();
                if (msg === '__snootbooped') {
                    console.log("Client's snoot confirmed booped.");
                    return;
                }

                console.log('Client:', msg);

                if (msg === 'foo') {
                    stream.write('bar');
                }

                if (msg === 'baz') {
                    stream.write('qux');
                }

                if (msg === 'here come dat boi') {
                    stream.write('Kill yourself.');
                }

            });
        })
            .listen(socket)
            .on('connection', function (socket) {
                console.log('Client connected.');
                console.log('Sending boop.');
                socket.write('__boop');
                //console.log(Object.keys(socket));
            })
    ;
    return server;
}


// Connect to server.
console.log("Connecting to server.");
client = net.createConnection(SOCKETFILE)
    .on('connect', () => {
        console.log("Connected.");
    })
    // Messages are buffers. use toString
    .on('data', function (data) {
        data = data.toString();

        if (data === '__boop') {
            console.info('Server sent boop. Confirming our snoot is booped.');
            client.write('__snootbooped');
            return;
        }
        if (data === '__disconnect') {
            console.log('Server disconnected.')
            return cleanup();
        }

        // Generic message handler
        console.info('Server:', data)
    })
    .on('error', function (data) {
        console.error('Server not active.');
        process.exit(1);
    })
;

// Handle input from stdin.
var inputbuffer = "";
process.stdin.on("data", function (data) {
    inputbuffer += data;
    if (inputbuffer.indexOf("\n") !== -1) {
        var line = inputbuffer.substring(0, inputbuffer.indexOf("\n"));
        inputbuffer = inputbuffer.substring(inputbuffer.indexOf("\n") + 1);
        // Let the client escape
        if (line === 'exit') {
            return cleanup();
        }
        if (line === 'quit') {
            return cleanup();
        }
        client.write(line);
    }
});

function cleanup() {
    if (!SHUTDOWN) {
        SHUTDOWN = true;
        console.log('\n', "Terminating.", '\n');
        client.end();
        process.exit(0);
    }
}

process.on('SIGINT', cleanup);

