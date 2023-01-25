const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors')
const bodyParser = require('body-parser');
const debug = require("debug")("server:server");
const path = require('path');
require("dotenv").config();
const config = require('./config/config')[process.env.NODE_ENV];

// Globals
global.baseDir = __dirname;

// app.use(helmet());
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const publicDir = path.join(baseDir,'/public'); 
app.use(express.static(publicDir)); 
app.use(express.static(path.resolve('./public/quotation'))); //working with http://localhost:3008/quotation-8n8id0.pdf

require("./models")
require('./routes')(app)

const port = parseInt(config.serverPort, 10);
app.set('port', port);
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Environment running on:  ${process.env.NODE_ENV}`);
    console.log(`Server is running on port: ${port}`);
});
server.on("error", onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "error" event.
 */

 function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }
  
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  }
  
module.exports = app;
