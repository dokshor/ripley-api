/*
  TOLIV API
  @author: Fabian Ramirez <framirez@toliv.io>
  @desc: Third layers application
  @version: 1
*/

// Includes
require("./config.js");
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const moment = require('moment-timezone');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Models
const City = require("./models/city");
const Weather = require("./models/weather");

// Redis layer
var redis = require('redis'), redis_client = redis.createClient();

// HTTP Server listening
http.listen(PORT_API, () => {
    console.log('Ripley API Version ' + VERSION);
    console.log('Environment: ' + ENVIRONMENT);
    console.log('Listening at %s', PORT_API);
});

// We sincronize the first time the Weather
Weather.sincronize(redis_client, (results) => console.log("[SUCCESS] Weather sincronized when server is starting"));

// Where there are errors
redis_client.on("error", (err) => {
    console.log("We are unabled to connect to Redis. Please check this error: " + err);
});

// We create cities
redis_client.set("api.cities", JSON.stringify(City.findAll()));

// We set errors to empty
redis_client.set("api.errors", JSON.stringify([]));

// Interval
var allClients = [];
var allIntervals = [];
io.on('connection', function(socket){
    console.log('[INFO] Web client connected');
    allClients.push(socket);
    socket.on('disconnect', function() {
        console.log('[INFO] Client disconnected');

        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);
        clearInterval(allIntervals[i]);
        allIntervals.splice(i, 1);
    });
    
    // We emit the first time data
    Weather.emit_to_socket(redis_client, socket);

    // We set interval
    allIntervals.push(setInterval(() => {
        // 10% of error
        if (Math.random(0, 1) < 0.1) {
            const error_message = {
                timestamp: moment(),
                message: 'How unfortunate! The API Request Failed'
            };
            
            redis_client.get('api.errors', (err, errors) => {
                if(!errors) {
                    errors = new Array();
                } else {
                    errors = JSON.parse(errors);
                }

                // I need to add the message at the beginning of the array
                errors.unshift(error_message);
                redis_client.set("api.errors", JSON.stringify(errors));
            });
            socket.emit('forecast', JSON.stringify({ success: false, message: error_message }));
        // 90% of a successfully request
        } else {
            Weather.emit_to_socket(redis_client, socket); 
        }
    }, 10000));
});

http.on("exit", function(){
    redis_client.quit();
});